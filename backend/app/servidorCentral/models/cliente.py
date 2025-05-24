from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.servidorCentral.database.centralPG import Base
from datetime import datetime

class Cliente(Base):
    __tablename__ = "clientes"

    cliente_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    cedula = Column(String(20), nullable=False, unique=True)
    telefono = Column(String(20))
    correo = Column(String(150), nullable=False, unique=True)
    fecha_alta = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # Relación 1:1 con CuentaCliente (tabla externa, pero lógica unificada)
    cuenta = relationship("CuentaCliente", back_populates="cliente", uselist=False, cascade="all, delete")

class CuentaCliente(Base):
    __tablename__ = "cuentas_clientes"

    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id", ondelete="CASCADE"), primary_key=True)
    saldo = Column(Numeric(12, 2), nullable=False, default=0.00)
    updated_at = Column(DateTime, default=datetime.utcnow)

    cliente = relationship("Cliente", back_populates="cuenta")
