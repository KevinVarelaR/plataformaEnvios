# app/schemas/pago.py
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from app.nodoCentral.schemas.envio import EstadoEnvioEnum

class PagoBase(BaseModel):
    cliente_id: int
    monto: Decimal

class PagoOut(PagoBase):
    pago_id: int
    envio_id: int | None
    fecha_pago: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Para escanear QR y actualizar estado
class EscaneoInput(BaseModel):
    qr_code: UUID
    nuevo_estado: EstadoEnvioEnum
    ip_origen: str
