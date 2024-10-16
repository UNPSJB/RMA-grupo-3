from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Usuario  # Importa tu modelo desde el módulo correcto

router = APIRouter(prefix="/usuarios")

# CRUD para Usuario
@router.post("/usuarios/")
def create_usuario(dni: str, nombre: str, edad: int, db: Session = Depends(get_db)):
    # Verifica si la usuario ya existe
    existing_usuario = db.query(Usuario).filter(Usuario.dni == dni).first()
    if existing_usuario:
        raise HTTPException(status_code=400, detail="La usuario ya existe")

    usuario = Usuario(dni=dni, nombre=nombre, edad=edad)
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

@router.get("/usuarios/")
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@router.get("/usuarios/{usuario_dni}")
def get_usuario(usuario_dni: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.dni == usuario_dni).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrada")
    return usuario

@router.put("/usuarios/{usuario_dni}")
def update_usuario(usuario_dni: int, nombre: str, edad: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.dni == usuario_dni).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrada")
    
    usuario.nombre = nombre
    usuario.edad = edad
    db.commit()
    return usuario

@router.delete("/usuarios/{usuario_dni}")
def delete_usuario(usuario_dni: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.dni == usuario_dni).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrada")
    
    db.delete(usuario)
    db.commit()
    return {"detail": "Usuario eliminada"}