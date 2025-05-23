from pydantic import BaseModel

class VehiculoBase(BaseModel):
    placa: str
    modelo: str
    capacidadKg: int

class VehiculoCreate(VehiculoBase):
    pass

class VehiculoOut(VehiculoBase):
    idVehiculo: str
    id: str  