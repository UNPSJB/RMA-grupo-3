import os
import pandas as pd
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from dependencies import get_db
from database import Nodo  # Importa el modelo Nodo desde tu base de datos
from schemas import Nodo as NodoSchema, NodoCreate

router = APIRouter()

@router.post("/", response_model=NodoSchema)
def create_nodo(nodo_data: NodoCreate, db: Session = Depends(get_db)):
    existing_nodo = db.query(Nodo).filter(Nodo.id == nodo_data.id).first()
    if existing_nodo:
        raise HTTPException(status_code=400, detail="El nodo ya existe")

    nodo = Nodo(**nodo_data.dict())
    db.add(nodo)
    db.commit()
    db.refresh(nodo)
    return nodo

@router.get("/", response_model=list[NodoSchema])
def get_nodos(db: Session = Depends(get_db)):
    return db.query(Nodo).all()

@router.get("/{nodo_id}")
def get_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    return nodo

@router.put("/{nodo_id}", response_model=NodoSchema)
def update_nodo(nodo_id: int, nodo_data: NodoCreate, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")

    for key, value in nodo_data.dict(exclude_unset=True).items():
        setattr(nodo, key, value)

    db.commit()
    db.refresh(nodo)
    return nodo

@router.delete("/{nodo_id}")
def delete_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    db.delete(nodo)
    db.commit()
    return {"detail": "Nodo eliminado"}


# class YourTable(db.Model):
#     __tablename__ = 'nodos'  # Cambia el nombre a tu tabla

#     # Define las columnas de la tabla (ejemplo)
#     id = Column(Integer, primary_key=True, index=True)
#     latitud = Column(Float)  # Columna para latitud
#     longitud = Column(Float)  # Columna para longitud
#     # Agrega más columnas según tu tabla


