from pydantic import BaseModel
from typing import Any

class RutaCreate(BaseModel):
    nombre: str
    vehiculo_id: Any 
    mensajero_id: Any