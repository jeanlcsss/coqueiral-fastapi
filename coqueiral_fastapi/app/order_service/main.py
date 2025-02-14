from fastapi import FastAPI
from coqueiral_fastapi.app.order_service.api.order import router as pedido_router
from coqueiral_fastapi.app.order_service.api.payment import router as pagamento_router 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Order Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(pedido_router, prefix="/pedidos", tags=["Pedidos"])
app.include_router(pagamento_router, prefix="/pagamento", tags=["Pagamentos"])

@app.get("/")
def root():
    return {"message": "Serviço de pedidos funcionando!"}
