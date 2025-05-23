from pydantic import BaseModel, EmailStr
from datetime import datetime
from decimal import Decimal

class ClienteBase(BaseModel):
    nombre: str
    cedula: str
    telefono: str | None = None
    correo: EmailStr

class ClienteCreate(ClienteBase):
    pass

class ClienteOut(ClienteBase):
    cliente_id: int
    fecha_alta: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CuentaOut(BaseModel):
    cliente_id: int
    saldo: Decimal
    updated_at: datetime

    class Config:
        orm_mode = True

class RecargaInput(BaseModel):
    monto: Decimal        