from fastapi import FastAPI
from routers import cliente

app = FastAPI(
    title="API base",
    descripcion="esta api usarla como cascaron",
    version="0.1.0",
    openapi_tags=[{
        "name": "clientes",
        "descripcion":  "clientes routers"
    }]
)

app.include_router(cliente)
#app.include_router(cliente, productos) #?
