from pydantic import BaseModel

class VehiculoCreate(BaseModel):
    placa: str
    modelo: str
