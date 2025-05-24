from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class EntregaCreate(BaseModel):
    """
    Modelo para la creación de una nueva ruta.

    Atributos:
        nombre (str): Nombre de la ruta.
        vehiculo_id (Any): Identificador del vehículo asignado a la ruta.
        mensajero_id (Any): Identificador del mensajero asignado a la ruta.
    """
    paquete_id: Any
    fecha_entrega: Optional[datetime] = None
    firma: Optional[str] = None
    observaciones: Optional[str] = None

class EntregaResponse(BaseModel):
    """
    Modelo de respuesta para una entrega registrada o consultada.

    Atributos:
        paquete_id (str): Identificador del paquete entregado.
        fecha_entrega (Optional[datetime]): Fecha y hora de la entrega.
        firma (str): Firma digital o nombre de quien recibe la entrega.
        observaciones (Optional[str]): Comentarios adicionales sobre la entrega.
        sincronizado (bool): Indica si la entrega ha sido sincronizada con el sistema central.
    """
    paquete_id: str
    fecha_entrega: Optional[datetime]
    firma: str
    observaciones: Optional[str]
    sincronizado: bool

    class Config:
        from_attributes = True
