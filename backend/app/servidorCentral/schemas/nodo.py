from pydantic import BaseModel, IPvAnyAddress
from typing import Optional
from datetime import datetime

class NodoBase(BaseModel):
    """
    Modelo base para los nodos.

    Atributos:
        nombre (str): Nombre del nodo.
        ip_registrada (IPvAnyAddress): Dirección IP registrada del nodo.
        validado (Optional[bool]): Indica si el nodo ha sido validado.
    """
    nombre: str
    ip_registrada: IPvAnyAddress
    validado: Optional[bool] = False

class NodoCreate(NodoBase):
    """
    Modelo para la creación de un nuevo nodo.
    Hereda de NodoBase.
    """
    pass

class NodoResponse(NodoBase):
    """
    Modelo de respuesta para un nodo.

    Atributos adicionales:
        nodo_id (int): ID único del nodo.
        fecha_registro (datetime): Fecha de registro del nodo.
        updated_at (datetime): Fecha de la última actualización del nodo.
    """
    nodo_id: int
    fecha_registro: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
