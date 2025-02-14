from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from coqueiral_fastapi.app.order_service.core.config import get_db
from coqueiral_fastapi.app.order_service.models.order import Pedido, PedidoItem, StatusPedidoEnum
from coqueiral_fastapi.app.order_service.schemas.order import PedidoItemCreate, PedidoResponse
import os
import requests

router = APIRouter()

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth_service:8000")

def get_usuario_atual(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token não fornecido")

    try:
        response = requests.get(f"{AUTH_SERVICE_URL}/get_usuario", headers={"Authorization": token})
        response.raise_for_status()
        return response.json()  # Retorna os dados do usuário autenticado
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falha na autenticação com auth_service")

@router.get("/carrinho", response_model=PedidoResponse)
def obter_carrinho(request: Request, db: Session = Depends(get_db), usuario=Depends(get_usuario_atual)):
    usuario_id = usuario["id"]  # Obtém ID do usuário autenticado

    carrinho = db.query(Pedido).filter(Pedido.usuario_id == usuario_id, Pedido.status == StatusPedidoEnum.CARRINHO).first()
    if not carrinho:
        carrinho = Pedido(usuario_id=usuario_id)
        db.add(carrinho)
        db.commit()
        db.refresh(carrinho)

    return carrinho

@router.post("/carrinho", response_model=PedidoResponse)
def adicionar_ao_carrinho(item: PedidoItemCreate, request: Request, db: Session = Depends(get_db), usuario=Depends(get_usuario_atual)):
    usuario_id = usuario["id"]
    carrinho = db.query(Pedido).filter(Pedido.usuario_id == usuario_id, Pedido.status == StatusPedidoEnum.CARRINHO).first()

    if not carrinho:
        carrinho = Pedido(usuario_id=usuario_id)
        db.add(carrinho)
        db.commit()
        db.refresh(carrinho)

    novo_item = PedidoItem(
        pedido_id=carrinho.id,
        produto_id=item.produto_id,
        quantidade=item.quantidade,
        preco_unitario=item.preco_unitario
    )
    db.add(novo_item)
    db.commit()
    return carrinho

@router.delete("/carrinho/{item_id}")
def remover_do_carrinho(item_id: int, request: Request, db: Session = Depends(get_db), usuario = Depends(get_usuario_atual)):
    usuario_id = usuario["id"]
    item = db.query(PedidoItem).filter(PedidoItem.id == item_id, PedidoItem.pedido.has(usuario_id=usuario_id)).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")

    db.delete(item)
    db.commit()
    return {"message": "Item removido do carrinho"}

@router.post("/carrinho/finalizar")
def finalizar_pedido(request: Request, db: Session = Depends(get_db), usuario = Depends(get_usuario_atual)):
    usuario_id = usuario["id"]
    carrinho = db.query(Pedido).filter(Pedido.usuario_id == usuario_id, Pedido.status == StatusPedidoEnum.CARRINHO).first()

    if not carrinho:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carrinho não encontrado")

    carrinho.status = StatusPedidoEnum.PENDENTE
    db.commit()
    return {"message": "Pedido finalizado! Aguarde pagamento."}

@router.post("/carrinho/cancelar")
def cancelar_pedido(request: Request, db: Session = Depends(get_db), usuario = Depends(get_usuario_atual)):
    usuario_id = usuario["id"]
    carrinho = db.query(Pedido).filter(Pedido.usuario_id == usuario_id, Pedido.status == StatusPedidoEnum.CARRINHO).first()

    if not carrinho:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carrinho não encontrado")

    carrinho.status = StatusPedidoEnum.CANCELADO
    db.commit()
    return {"message": "Pedido cancelado"}
