from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Persona  # Importa tu modelo desde el módulo correcto

router = APIRouter(prefix="/personas")

# CRUD para Persona
@router.post("/personas/")
def create_persona(dni: str, nombre: str, edad: int, db: Session = Depends(get_db)):
    # Verifica si la persona ya existe
    existing_persona = db.query(Persona).filter(Persona.dni == dni).first()
    if existing_persona:
        raise HTTPException(status_code=400, detail="La persona ya existe")

    persona = Persona(dni=dni, nombre=nombre, edad=edad)
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return persona

@router.get("/personas/")
def get_personas(db: Session = Depends(get_db)):
    return db.query(Persona).all()

@router.get("/personas/{persona_id}")
def get_persona(persona_dni: int, db: Session = Depends(get_db)):
    persona = db.query(Persona).filter(Persona.dni == persona_dni).first()
    if persona is None:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return persona

@router.put("/personas/{persona_dni}")
def update_persona(persona_dni: int, nombre: str, edad: int, db: Session = Depends(get_db)):
    persona = db.query(Persona).filter(Persona.dni == persona_dni).first()
    if persona is None:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    persona.nombre = nombre
    persona.edad = edad
    db.commit()
    return persona

@router.delete("/personas/{persona_dni}")
def delete_persona(persona_dni: int, db: Session = Depends(get_db)):
    persona = db.query(Persona).filter(Persona.dni == persona_dni).first()
    if persona is None:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    db.delete(persona)
    db.commit()
    return {"detail": "Persona eliminada"}