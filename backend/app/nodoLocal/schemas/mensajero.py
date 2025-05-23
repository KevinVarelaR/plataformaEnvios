from pydantic import BaseModel

class MensajeroBase(BaseModel):
    nombre: str
    telefono: str

class MensajeroCreate(MensajeroBase):
    pass

class MensajeroOut(MensajeroBase):
    idMensajero: str
    id: str