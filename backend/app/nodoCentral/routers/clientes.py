# app/routers/clientes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.nodoCentral.database.centralPG import get_db
from app.nodoCentral.models.cliente import Cliente, CuentaCliente
from app.nodoCentral.schemas.cliente import ClienteCreate, ClienteOut, CuentaOut, RecargaInput
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

router = APIRouter(prefix="/clientes", tags=["Clientes"])

# 1. Registrar cliente y su cuenta
@router.post("/", response_model=ClienteOut)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    existe = db.query(Cliente).filter(
        (Cliente.cedula == cliente.cedula) |
        (Cliente.correo == cliente.correo)
    ).first()
    if existe:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="El cliente ya existe")

    nuevo = Cliente(**cliente.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    cuenta = CuentaCliente(cliente_id=nuevo.cliente_id)
    db.add(cuenta)
    db.commit()

    return nuevo

# 2. Obtener todos los clientes
@router.get("/", response_model=list[ClienteOut])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(Cliente).all()

# 3. Obtener un cliente por ID
@router.get("/{cliente_id}", response_model=ClienteOut)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.cliente_id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    return cliente

# 4. Consultar saldo
@router.get("/{cliente_id}/cuenta", response_model=CuentaOut)
def obtener_cuenta(cliente_id: int, db: Session = Depends(get_db)):
    cuenta = db.query(CuentaCliente).filter(CuentaCliente.cliente_id == cliente_id).first()
    if not cuenta:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Cuenta no encontrada")
    return cuenta

@router.post("/{cliente_id}/recargar", response_model=CuentaOut)
def recargar_cuenta(cliente_id: int, data: RecargaInput, db: Session = Depends(get_db)):
    if data.monto <= 0:
        raise HTTPException(status_code=400, detail="Monto debe ser mayor que cero")

    cuenta = db.query(CuentaCliente).filter(CuentaCliente.cliente_id == cliente_id).first()
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")

    cuenta.saldo += data.monto
    db.commit()
    db.refresh(cuenta)
    return cuenta