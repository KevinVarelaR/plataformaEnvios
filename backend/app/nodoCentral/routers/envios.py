# app/routers/envios.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.nodoCentral.database.centralPG import get_db
from app.nodoCentral.models.envio import Envio
from app.nodoCentral.models.cliente import Cliente, CuentaCliente
from app.nodoCentral.models.pago import PagoEnvio
from app.nodoCentral.schemas.envio import EnvioCreate, EnvioOut
from app.nodoCentral.models.nodo import NodoLocal
from decimal import Decimal
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

router = APIRouter(prefix="/envios", tags=["Envíos"])

# Monto fijo por envío (puede ser dinámico si querés)
MONTO_ENVIO = Decimal("1500.00")

# 1. Registrar nuevo envío
@router.post("/", response_model=EnvioOut)
def crear_envio(data: EnvioCreate, db: Session = Depends(get_db)):
    # Validar cliente
    cliente = db.query(Cliente).filter(Cliente.cliente_id == data.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    # Validar nodos origen y destino
    nodo_origen = db.query(NodoLocal).filter(NodoLocal.nodo_id == data.nodo_origen_id).first()
    nodo_destino = db.query(NodoLocal).filter(NodoLocal.nodo_id == data.nodo_destino_id).first()

    if not nodo_origen or not nodo_origen.validado:
        raise HTTPException(status_code=400, detail="Nodo de origen no válido o no está validado")
    if not nodo_destino or not nodo_destino.validado:
        raise HTTPException(status_code=400, detail="Nodo de destino no válido o no está validado")

    # Validar saldo
    cuenta = db.query(CuentaCliente).filter(CuentaCliente.cliente_id == data.cliente_id).first()
    if not cuenta or cuenta.saldo < MONTO_ENVIO:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    # Crear el envío
    nuevo_envio = Envio(
        cliente_id=data.cliente_id,
        nodo_origen_id=data.nodo_origen_id,
        nodo_destino_id=data.nodo_destino_id
    )
    db.add(nuevo_envio)
    db.commit()
    db.refresh(nuevo_envio)

    # Registrar el pago
    pago = PagoEnvio(
        envio_id=nuevo_envio.envio_id,
        cliente_id=data.cliente_id,
        monto=MONTO_ENVIO
    )
    db.add(pago)
    db.commit()

    return nuevo_envio

# 2. Listar todos los envíos
@router.get("/", response_model=list[EnvioOut])
def listar_envios(db: Session = Depends(get_db)):
    return db.query(Envio).all()

# 3. Obtener un envío por ID
@router.get("/{envio_id}", response_model=EnvioOut)
def obtener_envio(envio_id: int, db: Session = Depends(get_db)):
    envio = db.query(Envio).filter(Envio.envio_id == envio_id).first()
    if not envio:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Envío no encontrado")
    return envio
