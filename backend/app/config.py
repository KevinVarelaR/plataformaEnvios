import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_URL = os.getenv("POSTGRES_URL")
MONGO_URL = os.getenv("MONGO_URL")
SECRET_TOKEN = os.getenv("SECRET_TOKEN", "secreto123")

"""POSTGRES_URL=postgresql://postgres:clave@host:port/railway
MONGO_URL=mongodb://mongo:clave@host:port
SECRET_TOKEN=tokentest123"""