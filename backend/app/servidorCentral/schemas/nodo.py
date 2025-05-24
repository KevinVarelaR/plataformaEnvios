from pydantic import BaseModel, IPvAnyAddress
from typing import Optional
from datetime import datetime

class NodoBase(BaseModel):
    nombre: str
    ip_registrada: IPvAnyAddress
    validado: Optional[bool] = False

class NodoCreate(NodoBase):
    pass

class NodoResponse(NodoBase):
    nodo_id: int
    fecha_registro: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
