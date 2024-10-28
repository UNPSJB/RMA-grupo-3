
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Nodo  # Importa tu modelo desde el módulo correcto

router = APIRouter()

@router.post("/")
def create_nodos(id: int,latitud: float,longitud: float, db: Session = Depends(get_db)):
    existing_nodo = db.query(Nodo).filter(Nodo.id == id).first()
    if existing_nodo:
        raise HTTPException(status_code=400, detail="El ya existe")

    nodo = Nodo(id=id, latitud=latitud, longitud=longitud)
    db.add(nodo)
    db.commit()
    db.refresh(nodo)
    return nodo

@router.get("/")
def get_nodos(db: Session = Depends(get_db)):
    return db.query(Nodo).all()

@router.get("/{nodo_id}")
def get_nodos(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    return nodo


@router.put("/")
def update_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    nodo.id = id
    db.commit()
    return nodo

@router.delete("/{nodo_id}")
def delete_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    db.delete(nodo)
    db.commit()
    return {"detail": "Nodo eliminado"}


