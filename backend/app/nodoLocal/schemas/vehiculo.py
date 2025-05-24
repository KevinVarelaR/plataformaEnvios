from pydantic import BaseModel

class VehiculoCreate(BaseModel):
    """
    Modelo para la creación de un nuevo vehículo.

    Atributos:
        placa (str): Placa del vehículo.
        modelo (str): Modelo del vehículo.
    """
    placa: str
    modelo: str
