from fastapi import APIRouter, Query
from uuid import uuid4
from app.nodoLocal.schemas.ruta import RutaCreate, RutaOut
from app.nodoLocal.utils.mongoUtils import insert_with_ip, get_items_by_ip

router = APIRouter(prefix="/nodo-local/rutas", tags=["Rutas"])

@router.post("/", response_model=RutaOut)
async def registrar_ruta(data: RutaCreate, ip_nodo: str = Query(...)):
    ruta_dict = data.dict()
    ruta_dict["idRuta"] = "RUTA" + uuid4().hex[:6].upper()
    insertado_id = await insert_with_ip("rutas", ruta_dict, ip_nodo)
    ruta_dict["id"] = insertado_id
    return ruta_dict

@router.get("/", response_model=list[RutaOut])
async def obtener_rutas(ip_nodo: str = Query(...)):
    return await get_items_by_ip("rutas", ip_nodo)