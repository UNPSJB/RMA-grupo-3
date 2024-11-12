from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from routers import usuarios,nodos, datosGenerales, auth
from dependencies import get_db  # Asegúrate de que esto es correcto
from routers.datosGenerales import mqtt_subscribe
from fastapi.middleware.cors import CORSMiddleware
from routers import auth

# Instancia de FastAPI
app = FastAPI()
app.mount("/frontend", StaticFiles(directory="../frontend"), name="frontend")

mqtt_subscribe()

# Incluye el router de productos
app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(nodos.router, prefix="/nodos", tags=["Nodos"])
app.include_router(datosGenerales.router, prefix="/datosgenerales", tags=["Datos_Generales"])
app.include_router(auth.router, prefix="/auth", tags=["Autenticacion"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir el origen de tu frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los headers
)


