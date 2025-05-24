from pydantic import BaseModel
from typing import Any

class RutaCreate(BaseModel):
    """
    Modelo para la creación de una nueva ruta.

    Atributos:
        nombre (str): Nombre de la ruta.
        vehiculo_id (Any): Identificador del vehículo asignado a la ruta.
        mensajero_id (Any): Identificador del mensajero asignado a la ruta.
    """
    nombre: str
    vehiculo_id: Any 
    mensajero_id: Any