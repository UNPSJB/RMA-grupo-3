from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from routers import productos  # Esto debe permanecer aquí
from routers import personas  # Esto debe permanecer aquí

from dependencies import get_db  # Asegúrate de que esto es correcto

# Instancia de FastAPI
app = FastAPI()

# Incluye el router de productos
app.include_router(productos.router, prefix="/productos", tags=["productos"])
app.include_router(personas.router, prefix="/personas", tags=["personas"])

