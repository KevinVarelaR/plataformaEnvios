from pydantic import BaseModel
from typing import Optional, Any

class PaqueteCreate(BaseModel):
    codigo: str
    descripcion: Optional[str] = None
    ruta_id: Any
    qr_code: Optional[str] = None