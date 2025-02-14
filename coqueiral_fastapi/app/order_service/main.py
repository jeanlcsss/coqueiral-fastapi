from fastapi import FastAPI
from coqueiral_fastapi.app.order_service.api.order import router as pedido_router
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

@app.get("/")
def root():
    return {"message": "Serviço de pedidos funcionando!"}
