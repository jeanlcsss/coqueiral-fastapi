from coqueiral_fastapi.app.auth_service.models.user import Base, Usuario
from coqueiral_fastapi.app.auth_service.core.config import engine, SessionLocal
from sqlalchemy.orm import Session
from coqueiral_fastapi.app.auth_service.core.security import hash_senha

Base.metadata.create_all(bind=engine)

def init_db(db: Session):
    user = db.query(Usuario).filter(Usuario.email == 'admin@example.com').first()
    if not user:
        new_user = Usuario(
            nome="Admin",
            email="admin@example.com",
            senha_hashed=hash_senha('admin'),
            is_admin=True,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

db = SessionLocal()
init_db(db)
db.close()