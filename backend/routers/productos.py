from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Producto  # Importa tu modelo desde el módulo correcto

router = APIRouter(prefix="/productos")

@router.post("/")
def create_producto(nombre: str, precio: int, db: Session = Depends(get_db)):
    producto = Producto(nombre=nombre, precio=precio)
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto

@router.get("/")
def get_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()

@router.get("/{producto_id}")
def get_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@router.put("/{producto_id}")
def update_producto(producto_id: int, nombre: str, precio: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    producto.nombre = nombre
    producto.precio = precio
    db.commit()
    return producto

@router.delete("/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db.delete(producto)
    db.commit()
    return {"detail": "Producto eliminado"}
