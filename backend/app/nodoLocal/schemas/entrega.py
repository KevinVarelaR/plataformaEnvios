from pydantic import BaseModel
from datetime import datetime

class EntregaBase(BaseModel):
    idPaquete: str
    fechaEntrega: datetime
    estadoEntrega: str
    observaciones: str

class EntregaCreate(EntregaBase):
    pass

class EntregaOut(EntregaBase):
    id: str
