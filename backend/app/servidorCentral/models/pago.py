from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime
from app.servidorCentral.database.centralPG import Base
from datetime import datetime

class PagoEnvio(Base):
    """
    Modelo ORM que representa un pago realizado por un envío en la base de datos.

    Atributos:
        pago_id (int): ID único del pago (clave primaria).
        envio_id (int): ID del envío asociado al pago (puede ser nulo).
        cliente_id (int): ID del cliente que realiza el pago.
        monto (Decimal): Monto del pago.
        fecha_pago (datetime): Fecha en que se realizó el pago.
        updated_at (datetime): Fecha de la última actualización del pago.
    """
    __tablename__ = "pagos_envio"

    pago_id = Column(Integer, primary_key=True, index=True)
    envio_id = Column(Integer, ForeignKey("envios.envio_id", ondelete="SET NULL"), nullable=True)
    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id"), nullable=False)
    monto = Column(Numeric(12, 2), nullable=False)
    fecha_pago = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
