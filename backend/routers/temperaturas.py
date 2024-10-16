from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from dependencies import get_db  
from database import Temperatura  
from datetime import datetime
#import paho.mqtt.client as mqtt
import json

router = APIRouter(prefix="/temperaturas")

# Función para manejar la recepción de mensajes MQTT
def on_message(message):
    payload = message.payload.decode("utf-8") # Decodificar el mensaje 
    data = json.loads(payload) # Convertir el JSON recibido en un diccionario de Python
    # Extraer los campos del mensaje
    id = data['id']  
    type = data['type']   
    dato = data['data']  
    time = datetime.strptime(data['time'], "%Y-%m-%d %H:%M:%S.%f")  

    # Conectar a la base de datos - guardar los datos
    db = Session() 
    temperatura = Temperatura(id=id, type=type, dato=float(dato), time=time)
    
    try:
        db.add(temperatura)
        db.commit()
        db.refresh(temperatura)
    except Exception as e:
        db.rollback()
        print(f"Error al insertar en la base de datos: {e}")
    finally:
        db.close()

# Inicializar el cliente MQTT y suscribirse a un tópico
""" def mqtt_subscribe():
    client = mqtt.Client()
    client.on_message = on_message  
    client.connect("public.mqtthq.com", 1883, 60)  
    client.subscribe("test_topic")  
    client.loop_start()   """

# CRUD para Temperatura
@router.post("/temperaturas/")
def create_temperatura(id: int, type: str, dato: float, time: str, db: Session = Depends(get_db)):
    temperatura = Temperatura(id=id, type=type, dato=dato, time=time)
    db.add(temperatura)
    db.commit()
    db.refresh(temperatura)
    return temperatura

@router.get("/temperaturas/")
def get_temperaturas(db: Session = Depends(get_db)):
    return db.query(Temperatura).all()

@router.get("/temperaturas/{temperatura_valor}")
def get_temperatura(temperatura_id: int, db: Session = Depends(get_db)):
    temperatura = db.query(Temperatura).filter(Temperatura.id == temperatura_id).first()
    if temperatura is None:
        raise HTTPException(status_code=404, detail="Temperatura no encontrada")
    return temperatura


'''
from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Temperatura  # Importa tu modelo desde el módulo correcto
#from datetime import date, time

router = APIRouter(prefix="/temperaturas")

# CRUD para Temperatura
@router.post("/temperaturas/")
def create_temperatura(id: int, type: str, data: str, time: str, db: Session = Depends(get_db)):
    temperatura = Temperatura(id=id, type=type, data=data, time=time)
    db.add(temperatura)
    db.commit()
    db.refresh(temperatura)
    return temperatura

@router.get("/temperaturas/")
def get_temperaturas(db: Session = Depends(get_db)):
    return db.query(Temperatura).all()

@router.get("/temperaturas/{temperatura_valor}")
def get_temperatura(temperatura_id: int, db: Session = Depends(get_db)):
    temperatura = db.query(Temperatura).filter(Temperatura.id == temperatura_id).first()
    if temperatura is None:
        raise HTTPException(status_code=404, detail="Temperatura no encontrada")
    return temperatura
'''
'''
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
'''
