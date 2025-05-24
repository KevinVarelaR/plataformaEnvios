from pydantic import BaseModel

class MensajeroCreate(BaseModel):
    nombre: str
