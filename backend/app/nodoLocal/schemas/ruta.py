from pydantic import BaseModel
from typing import Any

class RutaCreate(BaseModel):
    nombre: str
    vehiculo_id: Any  # ObjectId como str
    mensajero_id: Any