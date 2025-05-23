from fastapi import APIRouter, Query
from app.nodoLocal.schemas.nodo import RegistroEnvio, RegistroEnvioOut
from app.nodoLocal.utils.mongoUtils import insert_with_ip, get_items_by_ip

router = APIRouter(prefix="/nodo-local/registros", tags=["Registros de Movimiento"])

@router.post("/", response_model=RegistroEnvioOut)
async def registrar_movimiento(data: RegistroEnvio, ip_nodo: str = Query(...)):
    registro = data.dict()
    insertado_id = await insert_with_ip("registros_envio", registro, ip_nodo)
    registro["id"] = insertado_id
    return registro

@router.get("/", response_model=list[RegistroEnvioOut])
async def obtener_movimientos(ip_nodo: str = Query(...)):
    return await get_items_by_ip("registros_envio", ip_nodo)