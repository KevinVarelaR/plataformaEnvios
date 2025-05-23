from motor.motor_asyncio import AsyncIOMotorClient


POSTGRES_URL = "postgresql://postgres:CLAVE@mainline.proxy.rlwy.net:55440/railway"

# MongoDB general (única base compartida entre nodos)
MONGO_URL = "mongodb://mongo:nksdEFCmpMahyNdTJUuImrnasdAMXkVJ@shinkansen.proxy.rlwy.net:24305/NodosLocales"
#client = AsyncIOMotorClient(MONGO_URL)
#mongo_db = client["NodosLocales"]  # Mejor que get_default_database()
# URL del backend central (FastAPI central para sincronización)
CENTRAL_URL = "http://localhost:8000"

# Archivo de nodos registrados (creado al registrar nodos desde el central)
NODOS_REGISTRADOS_PATH = "app/nodos_config.json"
