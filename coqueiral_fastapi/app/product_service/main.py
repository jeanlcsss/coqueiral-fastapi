from fastapi import FastAPI
from coqueiral_fastapi.app.product_service.api.product import router as product_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='Product Service')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(product_router, prefix='/produtos', tags=['Produtos'])

@app.get('/')
def root():
    return {'message': 'Serviço de produtos funcionando!'}