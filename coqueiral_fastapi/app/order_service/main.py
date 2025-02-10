from fastapi import FastAPI
from coqueiral_fastapi.app.order_service.api.order import router as pedido_router

app = FastAPI(title="Order Service")

app.include_router(pedido_router, prefix="/pedidos", tags=["Pedidos"])

@app.get("/")
def root():
    return {"message": "Serviço de pedidos funcionando!"}
