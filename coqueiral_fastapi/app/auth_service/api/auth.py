from coqueiral_fastapi.app.auth_service.core.config import get_db
from coqueiral_fastapi.app.auth_service.core.security import (
    cria_token_acesso,
    get_usuario_atual,
    hash_senha,
    verifica_senha,
)
from coqueiral_fastapi.app.auth_service.models.user import Usuario
from coqueiral_fastapi.app.auth_service.schemas.token import Token
from coqueiral_fastapi.app.auth_service.schemas.user import CriarUsuario, LoginUsuario, UsuarioResponse
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import redis

router = APIRouter()

redis_client = redis.StrictRedis(host='redis-10415.c13.us-east-1-3.ec2.redns.redis-cloud.com', port=10415, decode_responses=True, 
                                 username='default', password='7TSFmDoncBiHM4d19WLhX9CA8hksqF3T')

@router.post('/registrar', response_model=UsuarioResponse)
def registrar(usuario: CriarUsuario, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email já cadastrado')
    senha_hashed = hash_senha(usuario.senha)
    novo_usuario = Usuario(email=usuario.email, nome=usuario.nome, senha_hashed=senha_hashed, is_admin=False)
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario


@router.post('/login', response_model=Token)
def login(usuario: LoginUsuario, db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if not usuario_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Usuário não encontrado')
    if not verifica_senha(usuario.senha, usuario_db.senha_hashed):
        raise HTTPException(status_code=status.HTTP_401_BAD_REQUEST, detail='Senha incorreta')
    token_acesso = cria_token_acesso(data={'sub': usuario_db.email})
    redis_client.set(f"user:{usuario_db.id}", usuario_db.json(), ex=3600)
    return {'access_token': token_acesso, 'token_type': 'bearer'}


@router.get('/usuario', response_model=UsuarioResponse)
def get_usuario_atual(usuario_atual: Usuario = Depends(get_usuario_atual)):
    return usuario_atual
