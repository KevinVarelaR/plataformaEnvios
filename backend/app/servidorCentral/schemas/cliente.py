from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal

class CuentaClienteSchema(BaseModel):
    """
    Modelo que representa la cuenta de un cliente.

    Atributos:
        saldo (float): Saldo actual de la cuenta.
        updated_at (Optional[datetime]): Fecha de la última actualización del saldo.
    """
    saldo: float
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class RecargaSaldo(BaseModel):
    """
    Modelo para la recarga de saldo de un cliente.

    Atributos:
        monto (Decimal): Monto a recargar.
    """
    monto: Decimal

class ClienteBase(BaseModel):
    """
    Modelo base para los clientes.

    Atributos:
        nombre (str): Nombre del cliente.
        cedula (str): Cédula de identidad del cliente.
        telefono (Optional[str]): Teléfono del cliente.
        correo (EmailStr): Correo electrónico del cliente.
    """
    nombre: str
    cedula: str
    telefono: Optional[str]
    correo: EmailStr

class ClienteCreate(ClienteBase):
    """
    Modelo para la creación de un nuevo cliente.
    Hereda de ClienteBase.
    """
    pass

class ClienteResponse(ClienteBase):
    """
    Modelo de respuesta para un cliente.

    Atributos adicionales:
        cliente_id (int): ID único del cliente.
        fecha_alta (datetime): Fecha de alta del cliente.
        updated_at (datetime): Fecha de la última actualización del cliente.
        cuenta (Optional[CuentaClienteSchema]): Información de la cuenta del cliente.
    """
    cliente_id: int
    fecha_alta: datetime
    updated_at: datetime
    cuenta: Optional[CuentaClienteSchema]

    class Config:
        orm_mode = True
