from coqueiral_fastapi.app.order_service.models.order import Base
from coqueiral_fastapi.app.order_service.core.config import engine, SessionLocal
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

db = SessionLocal()
db.close()
