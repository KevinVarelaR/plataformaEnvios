from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import relationship
from app.servidorCentral.database.centralPG import Base
from datetime import datetime
import enum
from sqlalchemy.schema import FetchedValue

# Enum en Python equivalente al ENUM en PostgreSQL
class EstadoEnvioEnum(str, enum.Enum):
    CREADO = "CREADO"
    EN_TRANSITO = "EN_TRANSITO"
    RECIBIDO = "RECIBIDO"
    VALIDADO = "VALIDADO"
    ENTREGADO = "ENTREGADO"
    FALLIDO = "FALLIDO"

# Modelo SQLAlchemy
class Envio(Base):
    __tablename__ = "envios"

    envio_id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id"), nullable=False)
    nodo_origen_id = Column(Integer, ForeignKey("nodos_locales.nodo_id"), nullable=False)
    nodo_destino_id = Column(Integer, ForeignKey("nodos_locales.nodo_id"), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_entrega = Column(DateTime, nullable=True)
    estado = Column(ENUM(EstadoEnvioEnum, name="estado_envio", create_type=False), nullable=False, default=EstadoEnvioEnum.CREADO)
    qr_code = Column(UUID(as_uuid=True), nullable=False, unique=True, server_default=FetchedValue())
    updated_at = Column(DateTime, default=datetime.utcnow)
