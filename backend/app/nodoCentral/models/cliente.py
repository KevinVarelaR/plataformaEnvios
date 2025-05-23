# app/models/cliente.py
from sqlalchemy import Column, Integer, String, TIMESTAMP, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.nodoCentral.database.centralPG import Base

class Cliente(Base):
    __tablename__ = "clientes"

    cliente_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    cedula = Column(String(20), unique=True, nullable=False)
    telefono = Column(String(20))
    correo = Column(String(150), unique=True, nullable=False)
    fecha_alta = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

    envios = relationship("Envio", back_populates="cliente")
    cuenta = relationship("CuentaCliente", uselist=False, back_populates="cliente")
    pagos = relationship("PagoEnvio", back_populates="cliente")

class CuentaCliente(Base):
    __tablename__ = "cuentas_clientes"

    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id", ondelete="CASCADE"), primary_key=True)
    saldo = Column(Numeric(12, 2), nullable=False, default=0)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

    cliente = relationship("Cliente", back_populates="cuenta")
