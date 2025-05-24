from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.servidorCentral.database.centralPG import SessionLocal
from app.servidorCentral.models.cliente import Cliente, CuentaCliente
from app.servidorCentral.schemas.cliente import ClienteCreate, ClienteResponse, CuentaClienteSchema, RecargaSaldo

router = APIRouter()

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

@router.post("/", response_model=ClienteResponse)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo cliente en el sistema y su cuenta asociada.

    Args:
        cliente (ClienteCreate): Datos del cliente a registrar.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        ClienteResponse: Información del cliente registrado.

    Raises:
        HTTPException: Si ya existe un cliente con la misma cédula o correo.
    """
    if db.query(Cliente).filter((Cliente.cedula == cliente.cedula) | (Cliente.correo == cliente.correo)).first():
        raise HTTPException(status_code=400, detail="Cliente ya registrado")

    nuevo = Cliente(**cliente.dict())
    db.add(nuevo)
    db.flush()
    cuenta = CuentaCliente(cliente_id=nuevo.cliente_id)
    db.add(cuenta)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    """
    Lista todos los clientes registrados en el sistema.

    Args:
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        list[ClienteResponse]: Lista de clientes registrados.
    """
    return db.query(Cliente).all()

@router.get("/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Obtiene la información de un cliente específico por su ID.

    Args:
        cliente_id (int): ID del cliente a consultar.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        ClienteResponse: Información del cliente encontrado.

    Raises:
        HTTPException: Si el cliente no existe.
    """
    cliente = db.query(Cliente).filter(Cliente.cliente_id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.get("/{cliente_id}/cuenta", response_model=CuentaClienteSchema)
def obtener_cuenta(cliente_id: int, db: Session = Depends(get_db)):
    """
    Obtiene la información de la cuenta de un cliente específico.

    Args:
        cliente_id (int): ID del cliente cuya cuenta se consulta.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        CuentaClienteSchema: Información de la cuenta del cliente.

    Raises:
        HTTPException: Si la cuenta no existe.
    """
    cuenta = db.query(CuentaCliente).filter(CuentaCliente.cliente_id == cliente_id).first()
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    return cuenta

@router.put("/{cliente_id}/cuenta/recargar", response_model=CuentaClienteSchema)
def recargar_saldo(cliente_id: int, data: RecargaSaldo, db: Session = Depends(get_db)):
    """
    Recarga el saldo de la cuenta de un cliente.

    Args:
        cliente_id (int): ID del cliente cuya cuenta se recarga.
        data (RecargaSaldo): Monto a recargar.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        CuentaClienteSchema: Información de la cuenta actualizada.

    Raises:
        HTTPException: Si el monto es inválido o la cuenta no existe.
    """
    if data.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor que cero")
    
    cuenta = db.query(CuentaCliente).filter(CuentaCliente.cliente_id == cliente_id).first()
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    
    cuenta.saldo += data.monto
    db.commit()
    db.refresh(cuenta)
    return cuenta
