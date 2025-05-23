from fastapi import APIRouter, Query
from uuid import uuid4
from app.nodoLocal.schemas.paquete import PaqueteCreate, PaqueteOut
from app.nodoLocal.utils.mongoUtils import insert_with_ip, get_items_by_ip

router = APIRouter(prefix="/nodo-local/paquetes", tags=["Paquetes"])

@router.post("/", response_model=PaqueteOut)
async def registrar_paquete(data: PaqueteCreate, ip_nodo: str = Query(...)):
    paquete_dict = data.dict()
    paquete_dict["idPaquete"] = "PKT" + uuid4().hex[:6].upper()
    insertado_id = await insert_with_ip("paquetes", paquete_dict, ip_nodo)
    paquete_dict["id"] = insertado_id
    return paquete_dict

@router.get("/", response_model=list[PaqueteOut])
async def obtener_paquetes(ip_nodo: str = Query(...)):
    return await get_items_by_ip("paquetes", ip_nodo)