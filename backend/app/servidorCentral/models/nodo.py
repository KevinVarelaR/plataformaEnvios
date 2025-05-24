from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import INET
from app.servidorCentral.database.centralPG import Base
from datetime import datetime

class NodoLocal(Base):
    __tablename__ = "nodos_locales"

    nodo_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    ip_registrada = Column(INET, nullable=False, unique=True)
    validado = Column(Boolean, nullable=False, default=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
