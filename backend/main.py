from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from routers import usuarios,nodos,temperaturas  # Esto debe permanecer aquí

from dependencies import get_db  # Asegúrate de que esto es correcto
from routers.temperaturas import mqtt_subscribe

# Instancia de FastAPI
app = FastAPI()

mqtt_subscribe()

# Incluye el router de productos
app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(nodos.router, prefix="/nodos", tags=["Nodos"])
app.include_router(temperaturas.router, prefix="/temperaturas", tags=["Temperaturas"])


