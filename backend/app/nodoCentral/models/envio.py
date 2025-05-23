# app/models/envio.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, Enum, CheckConstraint, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from app.nodoCentral.database.centralPG import Base

# Enum para estados de envío
class EstadoEnvio(str, enum.Enum):
    CREADO = "CREADO"
    EN_TRANSITO = "EN_TRANSITO"
    RECIBIDO = "RECIBIDO"
    VALIDADO = "VALIDADO"
    ENTREGADO = "ENTREGADO"
    FALLIDO = "FALLIDO"

class Envio(Base):
    __tablename__ = "envios"

    envio_id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id"), nullable=False)
    nodo_origen_id = Column(Integer, ForeignKey("nodos_locales.nodo_id"), nullable=False)
    nodo_destino_id = Column(Integer, ForeignKey("nodos_locales.nodo_id"), nullable=False)

    fecha_creacion = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    fecha_entrega = Column(TIMESTAMP, nullable=True)
    estado = Column(Enum(EstadoEnvio), default=EstadoEnvio.CREADO, nullable=False)
    qr_code = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

    # Relaciones
    cliente = relationship("Cliente", back_populates="envios")
    nodo_origen = relationship("NodoLocal", foreign_keys=[nodo_origen_id])
    nodo_destino = relationship("NodoLocal", foreign_keys=[nodo_destino_id])
    pagos = relationship("PagoEnvio", back_populates="envio", cascade="all, delete")

    __table_args__ = (
        CheckConstraint("nodo_origen_id <> nodo_destino_id", name="chk_origen_destino"),
        CheckConstraint("fecha_entrega IS NULL OR fecha_entrega >= fecha_creacion", name="chk_fecha_entrega"),
    )
