from coqueiral_fastapi.app.product_service.models.product import Base, Produto
from coqueiral_fastapi.app.product_service.core.config import engine, SessionLocal
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

def init_db(db: Session):
    produto_existente = db.query(Produto).first()
    if not produto_existente:
        produtos_iniciais = [
            Produto(nome="Produto 1", descricao="Descrição do Produto 1", preco=10.0, estoque=1),
            Produto(nome="Produto 2", descricao="Descrição do Produto 2", preco=20.0, estoque=1),
            Produto(nome="Produto 3", descricao="Descrição do Produto 3", preco=30.0, estoque=1),
        ]
        db.bulk_save_objects(produtos_iniciais)
        db.commit()

db = SessionLocal()
init_db(db)
db.close()