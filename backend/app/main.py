from fastapi import FastAPI
from app.nodoCentral.routers import clientes, envios, sincronizacion, nodos, pagos
from app.nodoLocal.routers import paquetes, rutas, vehiculos, entregas, mensajeros, registrarNodo, sincronizacion


app = FastAPI(title="Plataforma Distribuida de Envíos")

app.include_router(clientes.router)
app.include_router(envios.router)
app.include_router(sincronizacion.router)
app.include_router(nodos.router)
app.include_router(pagos.router)

app.include_router(paquetes.router)
app.include_router(rutas.router)
app.include_router(vehiculos.router)
app.include_router(entregas.router)
app.include_router(mensajeros.router)
app.include_router(registrarNodo.router)
app.include_router(sincronizacion.router, prefix="/nodo-local/sincronizacion", tags=["Sincronización Nodo Local"])

@app.get("/")
def root():
    return {"mensaje": "API de Envíos activa"}
