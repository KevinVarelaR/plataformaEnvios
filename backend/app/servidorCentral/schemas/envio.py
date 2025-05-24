from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime
from enum import Enum

class EstadoEnvio(str, Enum):
    """
    Enum que representa los posibles estados de un envío.
    """
    CREADO = "CREADO"
    EN_TRANSITO = "EN_TRANSITO"
    RECIBIDO = "RECIBIDO"
    VALIDADO = "VALIDADO"
    ENTREGADO = "ENTREGADO"
    FALLIDO = "FALLIDO"

class EnvioBase(BaseModel):
    """
    Modelo base para los envíos.

    Atributos:
        cliente_id (int): ID del cliente que realiza el envío.
        nodo_origen_id (int): ID del nodo de origen.
        nodo_destino_id (int): ID del nodo de destino.
        estado (Optional[EstadoEnvio]): Estado actual del envío.
        fecha_entrega (Optional[datetime]): Fecha estimada de entrega.
    """
    cliente_id: int
    nodo_origen_id: int
    nodo_destino_id: int
    estado: Optional[EstadoEnvio] = EstadoEnvio.CREADO
    fecha_entrega: Optional[datetime] = None

class EnvioCreate(BaseModel):
    """
    Modelo para la creación de un nuevo envío.

    Atributos:
        cliente_id (int): ID del cliente que realiza el envío.
        nodo_origen_id (int): ID del nodo de origen.
        nodo_destino_id (int): ID del nodo de destino.
        estado (Optional[EstadoEnvio]): Estado inicial del envío.
        fecha_entrega (Optional[datetime]): Fecha estimada de entrega.
    """
    cliente_id: int
    nodo_origen_id: int 
    nodo_destino_id: int
    estado: Optional[EstadoEnvio] = EstadoEnvio.CREADO
    fecha_entrega: Optional[datetime] = None


class EnvioResponse(EnvioBase):
    """
    Modelo de respuesta para un envío.

    Atributos adicionales:
        envio_id (int): ID único del envío.
        qr_code (UUID4): Código QR asociado al envío.
        fecha_creacion (datetime): Fecha de creación del envío.
        updated_at (datetime): Fecha de la última actualización del envío.
    """
    envio_id: int
    qr_code: UUID4
    fecha_creacion: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
