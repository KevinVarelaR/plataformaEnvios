# nodo_local/schemas/mensajero.py
from pydantic import BaseModel

class MensajeroCreate(BaseModel):
    nombre: str
