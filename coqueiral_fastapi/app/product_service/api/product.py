from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from coqueiral_fastapi.app.product_service.core.config import get_db
from coqueiral_fastapi.app.product_service.models.product import Produto
from coqueiral_fastapi.app.product_service.schemas.product import CriarProduto, ProdutoResponse
from coqueiral_fastapi.app.auth_service.core.security import get_usuario_atual
from coqueiral_fastapi.app.auth_service.models.user import Usuario
import redis
from typing import List
import json

router = APIRouter()

redis_client = redis.StrictRedis(host='redis-10415.c13.us-east-1-3.ec2.redns.redis-cloud.com', port=10415, decode_responses=True, 
                                 username='default', password='7TSFmDoncBiHM4d19WLhX9CA8hksqF3T')

def get_cached_user(usuario_atual: Usuario = Depends(get_usuario_atual)):
    user_data_json = redis_client.get(f"user:{usuario_atual.id}")
    user_data = json.loads(user_data_json) if user_data_json else None
    if not user_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Usuário não encontrado no cache')
    return user_data

def is_admin(usuario_atual: Usuario = Depends(get_usuario_atual)) -> bool:
    user_data = get_cached_user(usuario_atual)
    return user_data.get('is_admin', False) is True

@router.get('/produtos', response_model=List[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):
    produtos = db.query(Produto).all()
    return produtos

@router.get('/produtos/{produto_id}', response_model=ProdutoResponse)
def mostrar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Produto não encontrado')
    return produto

@router.post('/produtos', response_model=ProdutoResponse)
def criar_produto(produto: CriarProduto, db: Session = Depends(get_db), admin: bool = Depends(is_admin)):
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Apenas administradores podem criar produtos')
    novo_produto = Produto(**produto.dict())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@router.put('/produtos/{produto_id}', response_model=ProdutoResponse)
def editar_produto(produto_id: int, produto: CriarProduto, db: Session = Depends(get_db), admin: bool = Depends(is_admin)):
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Apenas administradores podem editar produtos')
    produto_db = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Produto não encontrado')
    for key, value in produto.dict().items():
        setattr(produto_db, key, value)
    db.commit()
    db.refresh(produto_db)
    return produto_db

@router.delete('/produtos/{produto_id}', response_model=ProdutoResponse)
def deletar_produto(produto_id: int, db: Session = Depends(get_db), admin: bool = Depends(is_admin)):
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Apenas administradores podem deletar produtos')
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Produto não encontrado')
    db.delete(produto)
    db.commit()
    return produto