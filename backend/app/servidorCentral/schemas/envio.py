from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime
from enum import Enum

class EstadoEnvio(str, Enum):
    CREADO = "CREADO"
    EN_TRANSITO = "EN_TRANSITO"
    RECIBIDO = "RECIBIDO"
    VALIDADO = "VALIDADO"
    ENTREGADO = "ENTREGADO"
    FALLIDO = "FALLIDO"

class EnvioBase(BaseModel):
    cliente_id: int
    nodo_origen_id: int
    nodo_destino_id: int
    estado: Optional[EstadoEnvio] = EstadoEnvio.CREADO
    fecha_entrega: Optional[datetime] = None

class EnvioCreate(BaseModel):
    cliente_id: int
    nodo_origen_id: int 
    nodo_destino_id: int
    estado: Optional[EstadoEnvio] = EstadoEnvio.CREADO
    fecha_entrega: Optional[datetime] = None


class EnvioResponse(EnvioBase):
    envio_id: int
    qr_code: UUID4
    fecha_creacion: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
