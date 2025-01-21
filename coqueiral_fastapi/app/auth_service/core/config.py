from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Configuração do PostgreSQL
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "senha"
POSTGRES_SERVER = "localhost"
POSTGRES_PORT = "5432"
POSTGRES_DB = "coqueiral_db"

# URL de conexão com o PostgreSQL
# CONEXÃO PARA TESTE LOCAL
# SQLALCHEMY_DATABASE_URL = (
#     f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
# )

# CONEXÃO PARA TESTE NO DOCKER
SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_SERVER')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

# Configuração da engine e sessão
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
