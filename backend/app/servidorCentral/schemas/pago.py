from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PagoBase(BaseModel):
    """
    Modelo base para los pagos.

    Atributos:
        envio_id (Optional[int]): ID del envío asociado al pago.
        cliente_id (int): ID del cliente que realiza el pago.
        monto (float): Monto del pago.
    """
    envio_id: Optional[int] = None
    cliente_id: int
    monto: float

class PagoCreate(PagoBase):
    """
    Modelo para la creación de un nuevo pago.
    Hereda de PagoBase.
    """
    pass

class PagoResponse(PagoBase):
    """
    Modelo de respuesta para un pago.

    Atributos adicionales:
        pago_id (int): ID único del pago.
        fecha_pago (datetime): Fecha en que se realizó el pago.
        updated_at (datetime): Fecha de la última actualización del pago.
    """
    pago_id: int
    fecha_pago: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
