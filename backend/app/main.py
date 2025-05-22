from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import clientes, envios, sincronizacion

app = FastAPI(title="Plataforma Distribuida de Envíos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router)
app.include_router(envios.router)
app.include_router(sincronizacion.router)

@app.get("/")
def root():
    return {"mensaje": "API de Envíos activa"}
