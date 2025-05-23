# app/schemas/nodo.py
from pydantic import BaseModel, IPvAnyAddress
from datetime import datetime

class NodoCreate(BaseModel):
    nombre: str
    ip_registrada: IPvAnyAddress

class NodoOut(NodoCreate):
    nodo_id: int
    validado: bool
    fecha_registro: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
