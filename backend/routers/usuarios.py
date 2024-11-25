from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from dependencies import get_db
from database import Usuario
from schemas import Usuario as UsuarioSchema, UsuarioCreate
import schemas
router = APIRouter()

@router.post("/user/", response_model=schemas.Usuario)
def create_usuario(usuario_data: UsuarioCreate, db: Session = Depends(get_db)):
    print(usuario_data)
    # Verifica si el usuario ya existe
    existing_usuario = db.query(Usuario).filter(Usuario.user == usuario_data.user).first()
    if existing_usuario:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    usuario = Usuario(user=usuario_data.user, 
                      rol=usuario_data.rol, 
                      password=usuario_data.password, 
                      estado=usuario_data.estado) 
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

# Devuelve a todos los usuarios cargados en la base de datos.
@router.get("/users", response_model=list[UsuarioSchema])
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

# 

# ------------------------------------------------------ PARA TABLA 
"""
    Endpoint para obtener todos los usuarios de la base de datos.
    Retorna una lista de usuarios con sus datos básicos.
"""
@router.get("/get-data")
def get_data(db: Session = Depends(get_db)):
    try:
        usuarios = db.query(Usuario).all()
        data = [
            {
                "id": usuario.id,
                "username": usuario.user,
                "rol": usuario.rol,
                "estado": usuario.estado,
            }
            for usuario in usuarios
        ]
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {str(e)}")

# Devuelve a un usuario segun su id
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
    usuario.rol = usuario_data.rol
    usuario.estado = usuario_data.estado
    db.commit()
    db.refresh(usuario)
    return usuario

@router.put("/{user_id}/toggle")
def toggle_usuario(user_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    usuario.estado = not usuario.estado
    db.commit()
    return {"message": "Estado actualizado", "estado": usuario.estado}

@router.delete("/{user}")
def delete_usuario(user: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.user == user).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(usuario)
    db.commit()
    return {"detail": "Usuario eliminado"}















""" @router.get("/get-data")
def get_data(db: Session = Depends(get_db)):
    try:
        usuarios = db.query(Usuario).all() # Consulta todos los usuarios
        users_data = [
            {
                "id": usuario.id,
                "username": usuario.user,
            }
        for usuario in usuarios
        ]

        return users_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {str(e)}")


@router.get("/get-data")
def get_data(db: Session = Depends(get_db)):
    try:
        data = []
        usuarios = db.query(Usuario).all()

        for usuario in usuarios:
            data.append({
                "id": usuario.id,
                "nombre": usuario.user,
            })

        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {str(e)}")
 """