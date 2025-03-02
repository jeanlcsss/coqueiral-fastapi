from datetime import datetime, timedelta

from coqueiral_fastapi.app.auth_service.core.config import get_db
from coqueiral_fastapi.app.auth_service.models.user import Usuario
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

SECRET_KEY = 'test_key'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)


def verifica_senha(senha: str, senha_hashed: str) -> bool:
    return pwd_context.verify(senha, senha_hashed)


def cria_token_acesso(usuario: Usuario, expires_delta: timedelta = None) -> str:
    to_encode = {
        "sub": usuario.email,
        "exp": datetime.now() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)),
        "is_admin": usuario.is_admin,
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_usuario_atual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Credenciais inválidas',
        headers={'WWW-Authenticate': 'Bearer'},
    )

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario is None:
        raise credentials_exception

    return usuario
