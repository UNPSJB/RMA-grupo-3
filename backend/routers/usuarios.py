from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Usuario  # Importa tu modelo desde el módulo correcto

router = APIRouter()

# CRUD para Usuario

@router.post("/")
def create_usuario(user: str, password: str, db: Session = Depends(get_db)):
    # Verifica si el usuario ya existe
    existing_usuario = db.query(Usuario).filter(Usuario.user == user).first()
    if existing_usuario:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    usuario = Usuario(user=user, password=password)
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

@router.get("/")
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@router.get("/{user}")
def get_usuario(username: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.user == username).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.put("/")
def update_usuario(user: str, password: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.user == user).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    usuario.user = user
    usuario.password = password
    db.commit()
    db.refresh(usuario)
    return usuario

@router.delete("/{user}")
def delete_usuario(user: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.user == user).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(usuario)
    db.commit()
    return {"detail": "Usuario eliminado"}
