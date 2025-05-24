from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime
from app.servidorCentral.database.centralPG import Base
from datetime import datetime

class PagoEnvio(Base):
    __tablename__ = "pagos_envio"

    pago_id = Column(Integer, primary_key=True, index=True)
    envio_id = Column(Integer, ForeignKey("envios.envio_id", ondelete="SET NULL"), nullable=True)
    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id"), nullable=False)
    monto = Column(Numeric(12, 2), nullable=False)
    fecha_pago = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
