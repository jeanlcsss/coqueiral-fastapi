from app.api.auth import router as auth_router
from fastapi import FastAPI

app = FastAPI(title='Auth Service')

app.include_router(auth_router, prefix='/auth', tags=['Auth'])


@app.get('/')
def root():
    return {'message': 'Serviço de autenticação funcionando!'}
