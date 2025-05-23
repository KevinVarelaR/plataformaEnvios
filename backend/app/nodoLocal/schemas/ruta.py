from pydantic import BaseModel

class RutaBase(BaseModel):
    nombreRuta: str
    vehiculoAsignado: str  # idVehiculo
    mensajeroAsignado: str  # idMensajero

class RutaCreate(RutaBase):
    pass

class RutaOut(RutaBase):
    idRuta: str
    id: str  