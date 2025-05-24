from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import relationship
from app.servidorCentral.database.centralPG import Base
from datetime import datetime
import enum
from sqlalchemy.schema import FetchedValue

# Enum en Python equivalente al ENUM en PostgreSQL
class EstadoEnvioEnum(str, enum.Enum):
    """
    Enum que representa los posibles estados de un envío.

    Valores:
        CREADO: El envío ha sido creado.
        EN_TRANSITO: El envío está en tránsito.
        RECIBIDO: El envío ha sido recibido en un nodo.
        VALIDADO: El envío ha sido validado.
        ENTREGADO: El envío fue entregado al destinatario.
        FALLIDO: El envío falló en algún punto del proceso.
    """
    CREADO = "CREADO"
    EN_TRANSITO = "EN_TRANSITO"
    RECIBIDO = "RECIBIDO"
    VALIDADO = "VALIDADO"
    ENTREGADO = "ENTREGADO"
    FALLIDO = "FALLIDO"

# Modelo SQLAlchemy
class Envio(Base):
    """
    Modelo ORM que representa un envío en la base de datos.

    Atributos:
        envio_id (int): ID único del envío (clave primaria).
        cliente_id (int): ID del cliente que realiza el envío.
        nodo_origen_id (int): ID del nodo de origen.
        nodo_destino_id (int): ID del nodo de destino.
        fecha_creacion (datetime): Fecha de creación del envío.
        fecha_entrega (datetime): Fecha estimada o real de entrega.
        estado (EstadoEnvioEnum): Estado actual del envío.
        qr_code (UUID): Código QR único asociado al envío.
        updated_at (datetime): Fecha de la última actualización del envío.
    """
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
