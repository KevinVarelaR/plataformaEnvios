from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PagoBase(BaseModel):
    envio_id: Optional[int] = None
    cliente_id: int
    monto: float

class PagoCreate(PagoBase):
    pass

class PagoResponse(PagoBase):
    pago_id: int
    fecha_pago: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
