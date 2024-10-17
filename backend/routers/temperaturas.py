from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from dependencies import get_db  
from database import Temperatura  
from datetime import datetime
import paho.mqtt.client as mqtt
import json

router = APIRouter(prefix="/temperaturas")

# Función para manejar la recepción de mensajes MQTT
def on_message(_, userdata, message):
    payload = message.payload.decode("utf-8")  # Decodificar el mensaje
    payload = payload.replace('\'','\"') # reemplazamos los caracteres ' por " para que sea un JSON válido.
    data = json.loads(payload) # Convertir el JSON recibido en un diccionario de Python
    
    # Extraer los campos del mensaje
    id = data['id']  
    type = data['type']   
    dato = data['data']  
    time = datetime.strptime(data['time'], "%Y-%m-%d %H:%M:%S.%f")  

    # Conectar a la base de datos - guardar los datos
    db = next(get_db())
    temperatura = Temperatura(nodo_id=id, type=type, dato=float(dato), time=time)

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
def mqtt_subscribe():
    client = mqtt.Client()
    client.on_message = on_message
    client.connect("localhost", 1883, 60)
    client.subscribe("test_topic")  
    client.loop_start()

# CRUD para Temperatura
@router.post("/temperaturas/")
def create_temperatura(id: int, type: str, dato: float, time: str, db: Session = Depends(get_db)):
    temperatura = Temperatura(nodo_id=id, type=type, dato=dato, time=time)
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
