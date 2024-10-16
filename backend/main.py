from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from routers import usuarios,nodos,temperaturas  # Esto debe permanecer aquí

from dependencies import get_db  # Asegúrate de que esto es correcto

# Instancia de FastAPI
app = FastAPI()

# Incluye el router de productos
app.include_router(usuarios.router, prefix="/usuarios", tags=["usuarios"])
app.include_router(nodos.router, prefix="/nodos", tags=["nodos"])
app.include_router(temperaturas.router, prefix="/temperaturas", tags=["temperaturas"])


