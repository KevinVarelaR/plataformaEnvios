from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.servidorCentral.config import POSTGRES_URL

# Crea el motor de conexión a la base de datos PostgreSQL usando la URL de configuración.
engine = create_engine(POSTGRES_URL)

# Crea una clase de sesión para interactuar con la base de datos.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para los modelos ORM de SQLAlchemy.
Base = declarative_base()
