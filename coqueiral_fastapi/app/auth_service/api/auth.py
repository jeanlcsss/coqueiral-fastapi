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
import json
from fastapi.security import OAuth2PasswordRequestForm

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
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not usuario_db or not verifica_senha(form_data.password, usuario_db.senha_hashed):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )
    token_acesso = cria_token_acesso(usuario=usuario_db)
    redis_client.set(f"user:{usuario_db.id}", json.dumps(usuario_db.to_dict()), ex=3600)
    return {'access_token': token_acesso, 'token_type': 'bearer'}


@router.get('/get_usuario', response_model=UsuarioResponse)
def get_usuario_atual(usuario_atual: Usuario = Depends(get_usuario_atual)):
    return usuario_atual
