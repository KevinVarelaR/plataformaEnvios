from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.servidorCentral.database.centralPG import SessionLocal
from app.servidorCentral.models.pago import PagoEnvio
from app.servidorCentral.models.cliente import Cliente
from app.servidorCentral.schemas.pago import PagoCreate, PagoResponse

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

@router.post("/", response_model=PagoResponse)
def registrar_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo pago en el sistema.

    Args:
        pago (PagoCreate): Datos del pago a registrar.
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        PagoResponse: Información del pago registrado.

    Raises:
        HTTPException: Si el cliente no existe o el monto es inválido.
    """
    cliente = db.query(Cliente).filter(Cliente.cliente_id == pago.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    if pago.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor que cero")

    nuevo = PagoEnvio(**pago.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[PagoResponse])
def listar_pagos(db: Session = Depends(get_db)):
    """
    Lista todos los pagos registrados en el sistema.

    Args:
        db (Session): Sesión de base de datos proporcionada por dependencia.

    Returns:
        list[PagoResponse]: Lista de pagos registrados.
    """
    return db.query(PagoEnvio).all()
