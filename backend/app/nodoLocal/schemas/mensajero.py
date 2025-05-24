from pydantic import BaseModel

class MensajeroCreate(BaseModel):
    """
    Modelo para la creación de un nuevo mensajero.

    Atributos:
        nombre (str): Nombre del mensajero.
    """
    nombre: str
