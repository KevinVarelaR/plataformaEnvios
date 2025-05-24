from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class EntregaCreate(BaseModel):
    paquete_id: Any
    fecha_entrega: Optional[datetime] = None
    firma: Optional[str] = None
    observaciones: Optional[str] = None
