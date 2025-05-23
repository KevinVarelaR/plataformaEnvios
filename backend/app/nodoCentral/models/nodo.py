# app/models/nodo.py
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import INET
from datetime import datetime
from app.nodoCentral.database.centralPG import Base

class NodoLocal(Base):
    __tablename__ = "nodos_locales"

    nodo_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    ip_registrada = Column(INET, nullable=False, unique=True)
    validado = Column(Boolean, default=False, nullable=False)
    fecha_registro = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
