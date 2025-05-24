from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import INET
from app.servidorCentral.database.centralPG import Base
from datetime import datetime

class NodoLocal(Base):
    """
    Modelo ORM que representa un nodo local en la base de datos.

    Atributos:
        nodo_id (int): ID único del nodo (clave primaria).
        nombre (str): Nombre del nodo.
        ip_registrada (str): Dirección IP registrada del nodo.
        validado (bool): Indica si el nodo ha sido validado.
        fecha_registro (datetime): Fecha de registro del nodo.
        updated_at (datetime): Fecha de la última actualización del nodo.
    """
    __tablename__ = "nodos_locales"

    nodo_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    ip_registrada = Column(INET, nullable=False, unique=True)
    validado = Column(Boolean, nullable=False, default=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
