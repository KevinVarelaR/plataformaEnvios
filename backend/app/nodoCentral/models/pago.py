# app/models/pago.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from app.nodoCentral.database.centralPG import Base

class PagoEnvio(Base):
    __tablename__ = "pagos_envio"

    pago_id = Column(Integer, primary_key=True, index=True)
    envio_id = Column(Integer, ForeignKey("envios.envio_id", ondelete="SET NULL"), nullable=True)
    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id"), nullable=False)
    monto = Column(Numeric(12, 2), nullable=False)
    fecha_pago = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

    envio = relationship("Envio", back_populates="pagos")
    cliente = relationship("Cliente")  # Sin back_populates para evitar loops
