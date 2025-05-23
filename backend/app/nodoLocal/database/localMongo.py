from motor.motor_asyncio import AsyncIOMotorClient
from app.nodoLocal.config import MONGO_URL

client = AsyncIOMotorClient(MONGO_URL)
mongo_db = client.get_default_database()  # sistema_envios
