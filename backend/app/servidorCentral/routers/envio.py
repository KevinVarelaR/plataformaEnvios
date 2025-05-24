from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.servidorCentral.database.centralPG import SessionLocal
from app.servidorCentral.models.envio import Envio, EstadoEnvioEnum
from app.servidorCentral.models.cliente import CuentaCliente
from app.servidorCentral.models.nodo import NodoLocal
from app.servidorCentral.schemas.envio import EnvioCreate, EnvioResponse
from app.servidorCentral.models.pago import PagoEnvio
from datetime import datetime

router = APIRouter(prefix="/envio", tags=["Envio"])

def get_db():
    """
    Proporciona una sesión de base de datos para cada solicitud.
    Cierra la sesión automáticamente al finalizar.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

COSTO_ENVIO = 1500       

@router.post("/", response_model=EnvioResponse)
def crear_envio(envio: EnvioCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo envío si el nodo de origen está validado y el cliente tiene fondos suficientes.

    Args:
        envio (EnvioCreate): Datos del envío a crear.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        EnvioResponse: Información del envío creado.

    Raises:
        HTTPException:  Si el nodo de origen no existe o no está validado,
                        si los nodos de origen y destino son iguales,
                        o si el cliente no tiene fondos suficientes.
    """
    nodo_origen = db.query(NodoLocal).filter(
        NodoLocal.nodo_id == envio.nodo_origen_id,
        NodoLocal.validado == True
    ).first()

    if not nodo_origen:
        raise HTTPException(status_code=403, detail="Nodo de origen no existe o no está validado")

    if envio.nodo_origen_id == envio.nodo_destino_id:
        raise HTTPException(status_code=400, detail="Nodo origen y destino no pueden ser iguales")

    cuenta = db.query(CuentaCliente).filter(CuentaCliente.cliente_id == envio.cliente_id).first()
    if not cuenta or cuenta.saldo < COSTO_ENVIO:
        raise HTTPException(status_code=400, detail="Fondos insuficientes")

    nuevo = Envio(
        cliente_id=envio.cliente_id,
        nodo_origen_id=envio.nodo_origen_id,
        nodo_destino_id=envio.nodo_destino_id,
        estado=envio.estado,
        fecha_entrega=envio.fecha_entrega,
        qr_code=envio.qr_code
    )

    cuenta.saldo -= COSTO_ENVIO
    db.add(nuevo)
    db.flush() 

    nuevo_pago = PagoEnvio(
        envio_id=nuevo.envio_id,
        cliente_id=envio.cliente_id,
        monto=COSTO_ENVIO,
        fecha_pago=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo)

    return nuevo

@router.get("/", response_model=list[EnvioResponse])
def listar_envios(db: Session = Depends(get_db)):
    """
    Lista todos los envíos registrados en el sistema.

    Args:
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        list[EnvioResponse]: Lista de envíos registrados.
    """
    return db.query(Envio).all()

@router.get("/{envio_id}", response_model=EnvioResponse)
def obtener_envio(envio_id: int, db: Session = Depends(get_db)):
    """
    Obtiene la información de un envío específico por su ID.

    Args:
        envio_id (int): ID del envío a consultar.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        EnvioResponse: Información del envío encontrado.

    Raises:
        HTTPException: Si el envío no existe.
    """
    envio = db.query(Envio).filter(Envio.envio_id == envio_id).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    return envio

@router.put("/qr/{qr_code}/entregar", response_model=EnvioResponse)
def marcar_entregado(qr_code: UUID, db: Session = Depends(get_db)):
    """
    Marca un envío como entregado usando el código QR.

    Args:
        qr_code (UUID): Código QR asociado al envío.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        EnvioResponse: Información del envío actualizado.

    Raises:
        HTTPException: Si el envío no existe o ya fue entregado.
    """
    envio = db.query(Envio).filter(Envio.qr_code == qr_code).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")

    if envio.estado == EstadoEnvioEnum.ENTREGADO:
        raise HTTPException(status_code=400, detail="El envío ya fue entregado")

    envio.estado = EstadoEnvioEnum.ENTREGADO
    envio.fecha_entrega = datetime.utcnow()
    db.commit()
    db.refresh(envio)
    return envio