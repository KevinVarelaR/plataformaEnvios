from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.servidorCentral.database.centralPG import Base
from datetime import datetime

class Cliente(Base):
    """
    Modelo ORM que representa a un cliente en la base de datos.

    Atributos:
        cliente_id (int): ID único del cliente (clave primaria).
        nombre (str): Nombre del cliente.
        cedula (str): Cédula de identidad del cliente (única).
        telefono (str): Teléfono del cliente.
        correo (str): Correo electrónico del cliente (único).
        fecha_alta (datetime): Fecha de alta del cliente.
        updated_at (datetime): Fecha de la última actualización.
        cuenta (CuentaCliente): Relación uno a uno con la cuenta del cliente.
    """
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
    """
    Modelo ORM que representa la cuenta asociada a un cliente.

    Atributos:
        cliente_id (int): ID del cliente (clave primaria y foránea).
        saldo (Decimal): Saldo actual de la cuenta.
        updated_at (datetime): Fecha de la última actualización del saldo.
        cliente (Cliente): Relación inversa con el cliente.
    """
    __tablename__ = "cuentas_clientes"

    cliente_id = Column(Integer, ForeignKey("clientes.cliente_id", ondelete="CASCADE"), primary_key=True)
    saldo = Column(Numeric(12, 2), nullable=False, default=0.00)
    updated_at = Column(DateTime, default=datetime.utcnow)

    cliente = relationship("Cliente", back_populates="cuenta")
