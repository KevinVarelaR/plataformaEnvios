from fastapi import APIRouter, Query
from app.nodoLocal.schemas.entrega import EntregaCreate, EntregaOut
from app.nodoLocal.utils.mongoUtils import insert_with_ip, get_items_by_ip

router = APIRouter(prefix="/nodo-local/entregas", tags=["Entregas"])

@router.post("/", response_model=EntregaOut)
async def registrar_entrega(data: EntregaCreate, ip_nodo: str = Query(...)):
    entrega_dict = data.dict()
    insertado_id = await insert_with_ip("entregas", entrega_dict, ip_nodo)
    entrega_dict["id"] = insertado_id
    return entrega_dict

@router.get("/", response_model=list[EntregaOut])
async def obtener_entregas(ip_nodo: str = Query(...)):
    return await get_items_by_ip("entregas", ip_nodo)