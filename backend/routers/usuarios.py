from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from dependencies import get_db
from database import Usuario
from schemas import Usuario as UsuarioSchema, UsuarioCreate

router = APIRouter()

@router.post("/", response_model=UsuarioSchema)
def create_usuario(usuario_data: UsuarioCreate, db: Session = Depends(get_db)):
    # Verifica si el usuario ya existe
    existing_usuario = db.query(Usuario).filter(Usuario.user == usuario_data.user).first()
    if existing_usuario:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    usuario = Usuario(user=usuario_data.user, password=usuario_data.password)
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

@router.get("/", response_model=list[UsuarioSchema])
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@router.get("/{user}", response_model=UsuarioSchema)
def get_usuario(user: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.user == user).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.put("/{user}", response_model=UsuarioSchema)
def update_usuario(user: str, usuario_data: UsuarioCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.user == user).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    usuario.user = usuario_data.user
    usuario.password = usuario_data.password
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
