from fastapi import FastAPI
from coqueiral_fastapi.app.product_service.api.product import router as product_router

app = FastAPI(title='Product Service')

app.include_router(product_router, prefix='/produtos', tags=['Produtos'])

@app.get('/')
def root():
    return {'message': 'Serviço de produtos funcionando!'}