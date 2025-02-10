from sqlalchemy import Column, Integer, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class StatusPedidoEnum(str, enum.Enum):
    CARRINHO = "carrinho"
    PENDENTE = "pendente"
    PAGO = "pago"
    CANCELADO = "cancelado"

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, nullable=False)
    status = Column(Enum(StatusPedidoEnum), default=StatusPedidoEnum.CARRINHO)
    total = Column(Float, default=0.0)

    itens = relationship("PedidoItem", back_populates="pedido")

class PedidoItem(Base):
    __tablename__ = "pedido_itens"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    produto_id = Column(Integer, nullable=False)
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Float, nullable=False)

    pedido = relationship("Pedido", back_populates="itens")