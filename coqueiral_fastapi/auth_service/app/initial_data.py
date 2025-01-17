from models.user import Base
from core.config import engine

Base.metadata.create_all(bind=engine)