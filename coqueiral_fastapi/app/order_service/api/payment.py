import stripe
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from coqueiral_fastapi.app.order_service.core.config import get_db, STRIPE_SECRET_KEY
from coqueiral_fastapi.app.order_service.models.order import Pedido, StatusPedidoEnum
from coqueiral_fastapi.app.order_service.api.order import get_usuario_atual

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/")
def processar_pagamento(db: Session = Depends(get_db), usuario=Depends(get_usuario_atual)):
    pedido = db.query(Pedido).filter(Pedido.usuario_id == usuario["id"], Pedido.status == StatusPedidoEnum.PENDENTE).first()

    if not pedido:
        raise HTTPException(status_code=404, detail="Nenhum pedido pendente encontrado")

    try:
        # Criando uma sessão de checkout no Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "brl",
                        "product_data": {"name": f"Pedido #{pedido.id}"},
                        "unit_amount": int(pedido.total * 100),
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url="http://localhost:3000/sucesso",
            cancel_url="http://localhost:3000/cancelado",
        )

        return {"checkout_url": session.url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/confirmar")
def confirmar_pagamento(evento: dict, db: Session = Depends(get_db)):
    event_type = evento.get("type")

    if event_type == "checkout.session.completed":
        session = evento["data"]["object"]
        pedido_id = session["metadata"]["pedido_id"]

        pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
        if pedido:
            pedido.status = StatusPedidoEnum.PAGO
            db.commit()

    return {"message": "Evento processado"}
