from pydantic import BaseModel

class PaqueteBase(BaseModel):
    descripcion: str
    idRuta: str  # Asignado a una ruta existente
    idCliente: str  # ID real del cliente (provisto por central)

class PaqueteCreate(PaqueteBase):
    pass

class PaqueteOut(PaqueteBase):
    idPaquete: str
    id: str