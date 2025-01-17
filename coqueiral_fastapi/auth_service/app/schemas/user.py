from pydantic import BaseModel, EmailStr


class CriarUsuario(BaseModel):
    nome: str
    email: EmailStr
    senha: str


class LoginUsuario(BaseModel):
    email: EmailStr
    senha: str


class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr

    class Config:
        orm_mode = True
