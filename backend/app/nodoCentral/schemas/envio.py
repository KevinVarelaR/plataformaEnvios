# app/schemas/envio.py
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from enum import Enum

class EstadoEnvioEnum(str, Enum):
    CREADO = "CREADO"
    EN_TRANSITO = "EN_TRANSITO"
    RECIBIDO = "RECIBIDO"
    VALIDADO = "VALIDADO"
    ENTREGADO = "ENTREGADO"
    FALLIDO = "FALLIDO"

# Para crear un envío
class EnvioCreate(BaseModel):
    cliente_id: int
    nodo_origen_id: int
    nodo_destino_id: int

# Para retornar un envío
class EnvioOut(BaseModel):
    envio_id: int
    cliente_id: int
    nodo_origen_id: int
    nodo_destino_id: int
    fecha_creacion: datetime
    fecha_entrega: datetime | None
    estado: EstadoEnvioEnum
    qr_code: UUID
    updated_at: datetime

    class Config:
        orm_mode = True
