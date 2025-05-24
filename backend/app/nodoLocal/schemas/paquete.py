from pydantic import BaseModel
from typing import Optional, Any

class PaqueteCreate(BaseModel):
    """
    Modelo para la creación de un nuevo paquete.

    Atributos:
        codigo (str): Código único del paquete.
        descripcion (Optional[str]): Descripción del paquete.
        ruta_id (Any): Identificador de la ruta asignada al paquete.
        qr_code (Optional[str]): Código QR asociado al paquete.
        cliente_id (int): ID del cliente que envía el paquete.
        nodo_destino_id (int): ID del nodo destino del envío.
    """
    codigo: str
    descripcion: Optional[str] = None
    ruta_id: Any
    qr_code: Optional[str] = None
    cliente_id: int
    nodo_destino_id: int