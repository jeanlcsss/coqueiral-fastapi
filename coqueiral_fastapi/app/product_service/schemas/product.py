from pydantic import BaseModel

class CriarProduto(BaseModel):
    nome: str
    descricao: str
    preco: float
    estoque: int

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    preco: float
    estoque: int

    class Config:
        orm_mode = True