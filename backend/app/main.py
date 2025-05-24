from fastapi import FastAPI
from app.servidorCentral.routers import cliente, pago, envio, nodo
from app.nodoLocal.routers import mensajeros, entregas, paquetes, rutas, vehiculos

app = FastAPI(title="Servidor Central - Gestión de Envíos")

# Registro de routers de la API de PostgreSQL
app.include_router(cliente.router, prefix="/clientes", tags=["Clientes"])
app.include_router(pago.router, prefix="/pagos", tags=["Pagos"])
app.include_router(envio.router, prefix="/envios", tags=["Envio"])
app.include_router(nodo.router, prefix="/nodos", tags=["Nodos"])

# Registro de routers de la API de MongoDB
app.include_router(mensajeros.router, prefix="/mensajeros", tags=["Mensajeros"])
app.include_router(entregas.router, prefix="/entregas", tags=["Entregas"])
app.include_router(paquetes.router, prefix="/paquetes", tags=["Paquetes"])
app.include_router(rutas.router, prefix="/rutas", tags=["Rutas"])
app.include_router(vehiculos.router, prefix="/vehiculos", tags=["Vehiculos"])
