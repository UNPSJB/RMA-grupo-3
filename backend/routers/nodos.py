from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Nodo  # Importa tu modelo desde el módulo correcto

router = APIRouter()

@router.post("/")
def create_nodo(id: int, latitud: float, longitud: float, alias: str = None, descripcion: str = None, estado: bool = True, db: Session = Depends(get_db)):
    existing_nodo = db.query(Nodo).filter(Nodo.id == id).first()
    if existing_nodo:
        raise HTTPException(status_code=400, detail="El nodo ya existe")

    nodo = Nodo(id=id, latitud=latitud, longitud=longitud, alias=alias, descripcion=descripcion, estado=estado)
    db.add(nodo)
    db.commit()
    db.refresh(nodo)
    
    return nodo

@router.get("/")
def get_nodos(db: Session = Depends(get_db)):
    return db.query(Nodo).all()

@router.get("/{nodo_id}")
def get_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    return nodo

@router.put("/{nodo_id}")
def update_nodo(nodo_id: int, latitud: float = None, longitud: float = None, alias: str = None, descripcion: str = None, estado: bool = None, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")

    # Actualizar solo los campos proporcionados
    if latitud is not None:
        nodo.latitud = latitud
    if longitud is not None:
        nodo.longitud = longitud
    if alias is not None:
        nodo.alias = alias
    if descripcion is not None:
        nodo.descripcion = descripcion
    if estado is not None:
        nodo.estado = estado

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
