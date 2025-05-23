# app/routers/sincronizacion.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.nodoCentral.database.centralPG import get_db
from app.nodoCentral.models.envio import Envio, EstadoEnvio
from app.nodoCentral.models.nodo import NodoLocal
from app.nodoCentral.schemas.pago import EscaneoInput
from uuid import UUID

router = APIRouter(prefix="/sincronizacion", tags=["Sincronización"])

# 1. Escaneo de QR y actualización de estado
@router.post("/escaneo")
def registrar_escaneo(data: EscaneoInput, db: Session = Depends(get_db)):
    ip_str = str(data.ip_origen)

    # Validar nodo por IP
    nodo = db.query(NodoLocal).filter(
        NodoLocal.ip_registrada == ip_str,
        NodoLocal.validado == True
    ).first()

    if not nodo:
        raise HTTPException(status_code=401, detail="Nodo no validado para escanear")

    envio = db.query(Envio).filter(Envio.qr_code == data.qr_code).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")

    envio.estado = data.nuevo_estado
    db.commit()

    return {
        "mensaje": f"Estado actualizado a {data.nuevo_estado}",
        "nodo_validador": nodo.nombre,
        "ip_usada": ip_str
    }

# 2. Consulta pública del estado por QR
@router.get("/estado-qr/{qr_code}")
def obtener_estado_por_qr(qr_code: UUID, db: Session = Depends(get_db)):
    envio = db.query(Envio).filter(Envio.qr_code == qr_code).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")

    return {
        "estado": envio.estado,
        "cliente_id": envio.cliente_id,
        "nodo_origen_id": envio.nodo_origen_id,
        "nodo_destino_id": envio.nodo_destino_id,
        "fecha_creacion": envio.fecha_creacion,
        "fecha_entrega": envio.fecha_entrega,
        "actualizado": envio.updated_at
    }
