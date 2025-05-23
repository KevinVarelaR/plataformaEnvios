from pydantic import BaseModel
from datetime import datetime

class RegistroEnvio(BaseModel):
    idPaquete: str
    fecha: datetime
    tipo: str  # "ENVIADO" o "RECIBIDO"
    observaciones: str

class RegistroEnvioOut(RegistroEnvio):
    id: str