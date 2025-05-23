from fastapi import APIRouter, Query
from uuid import uuid4
from app.nodoLocal.schemas.mensajero import MensajeroCreate, MensajeroOut
from app.nodoLocal.utils.mongoUtils import insert_with_ip, get_items_by_ip

router = APIRouter(prefix="/nodo-local/mensajeros", tags=["Mensajeros"])

@router.post("/", response_model=MensajeroOut)
async def registrar_mensajero(data: MensajeroCreate, ip_nodo: str = Query(...)):
    mensajero_dict = data.dict()
    mensajero_dict["idMensajero"] = "MENS" + uuid4().hex[:6].upper()
    insertado_id = await insert_with_ip("mensajeros", mensajero_dict, ip_nodo)
    mensajero_dict["id"] = insertado_id
    return mensajero_dict

@router.get("/", response_model=list[MensajeroOut])
async def obtener_mensajeros(ip_nodo: str = Query(...)):
    return await get_items_by_ip("mensajeros", ip_nodo)