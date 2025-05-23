from fastapi import APIRouter, Query, HTTPException
import httpx
from app.nodoLocal.config import CENTRAL_URL
from app.nodoLocal.utils.mongoUtils import update_item_by_ip, find_one_by_field

router = APIRouter(prefix="/nodo-local/sincronizacion", tags=["Sincronización"])

@router.post("/escaneo-qr")
async def escanear_codigo_qr(qr_code: str = Query(...), ip_nodo: str = Query(...)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{CENTRAL_URL}/validar-envio", params={"qr_code": qr_code, "ip_nodo": ip_nodo})
            response.raise_for_status()
            data = response.json()

        nuevo_estado = data.get("estado")
        if not nuevo_estado:
            raise HTTPException(status_code=400, detail="Estado no devuelto por el central.")

        paquete_local = await find_one_by_field("paquetes", "qr_code", qr_code, ip_nodo)
        if paquete_local:
            await update_item_by_ip("paquetes", str(paquete_local["_id"]), {"estado": nuevo_estado}, ip_nodo)

        entrega_local = await find_one_by_field("entregas", "idPaquete", qr_code, ip_nodo)
        if entrega_local:
            await update_item_by_ip("entregas", str(entrega_local["_id"]), {"estadoEntrega": nuevo_estado}, ip_nodo)

        return {"mensaje": "Sincronización exitosa", "estado_actualizado": nuevo_estado}

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
