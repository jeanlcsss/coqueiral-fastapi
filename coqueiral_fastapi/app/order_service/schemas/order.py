from pydantic import BaseModel
from typing import List

class PedidoItemBase(BaseModel):
    produto_id: int
    quantidade: int
    preco_unitario: float

class PedidoItemCreate(PedidoItemBase):
    pass

class PedidoItemResponse(PedidoItemBase):
    id: int

class PedidoBase(BaseModel):
    usuario_id: int
    itens: List[PedidoItemCreate]
    total: float

class PedidoResponse(PedidoBase):
    id: int
    status: str
    itens: List[PedidoItemResponse]