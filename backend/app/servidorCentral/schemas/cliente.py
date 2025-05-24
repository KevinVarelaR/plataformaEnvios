from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal

class CuentaClienteSchema(BaseModel):
    saldo: float
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class RecargaSaldo(BaseModel):
    monto: Decimal

class ClienteBase(BaseModel):
    nombre: str
    cedula: str
    telefono: Optional[str]
    correo: EmailStr

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    cliente_id: int
    fecha_alta: datetime
    updated_at: datetime
    cuenta: Optional[CuentaClienteSchema]

    class Config:
        orm_mode = True
