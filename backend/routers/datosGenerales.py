from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from dependencies import get_db  
from database import DatosGenerales, Nodo
from datetime import datetime
import paho.mqtt.client as mqtt
import json
import sqlite3

router = APIRouter()

# Función para manejar la recepción de mensajes MQTT
def on_message(_, userdata, message):
    payload = message.payload.decode("utf-8")  # Decodificar el mensaje
    payload = payload.replace('\'','\"') # reemplazamos los caracteres ' por " para que sea un JSON válido.
    data = json.loads(payload) # Convertir el JSON recibido en un diccionario de Python
    
    # Extraer los campos del mensaje
    nodo_id = data['id']
    type = data['type']   
    dato = data['data']  
    time = datetime.strptime(data['time'], "%Y-%m-%d %H:%M:%S.%f")  

    # Conectar a la base de datos - guardar los datos
    db = next(get_db())

    # Verificar si nodo_id existe en la tabla de nodos
    nodo_existente = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    
    if nodo_existente is None:
        print(f"Error: El nodo_id {nodo_id} no existe en la tabla de nodos.")
    else:
    # Solo se ejecuta si el nodo_id existe
        datosGenerales = DatosGenerales(nodo_id=nodo_id, type=type, dato=float(dato), time=time)
        try:
            db.add(datosGenerales)
            db.commit()
            db.refresh(datosGenerales)
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

# CRUD para Datos Generales
@router.post("/")
def create_datosGenerales(nodo_id: int, type: str, dato: float, time: str, db: Session = Depends(get_db)):
    datosGenerales = DatosGenerales(nodo_id=nodo_id, type=type, dato=dato, time=time)
    db.add(datosGenerales)
    db.commit()
    db.refresh(datosGenerales)
    return datosGenerales

@router.get("/")
def get_datosGenerales(db: Session = Depends(get_db)):
    return db.query(DatosGenerales).all()

@router.get("/{}")
def get_datosGenerales(datosGenerales_nodo_id: int, db: Session = Depends(get_db)):
    datosGenerales = db.query(DatosGenerales).filter(DatosGenerales.nodo_id == datosGenerales_nodo_id).first()
    if datosGenerales is None:
        raise HTTPException(status_code=404, detail="Dato no encontrado")
    return datosGenerales


'''

""" conn=sqlite3.connect('test.db')
cursor = conn.cursor()

def publish_temperature(value):
    client= mqtt.Client()
    client.connect('localhost', 1883, 60)
    client.publish('temperatures', value)
    client.disconnect()




# Almacenar la temperatura en SQLite
def store_temperature(value):
    cursor.execute('INSERT INTO temperatures (temperature) VALUES (?)', (value,))
    conn.commit()
    publish_temperature(value) """


# Función para manejar la recepción de mensajes MQTT
def on_message(_, userdata, message):
    payload = message.payload.decode("utf-8")  # Decodificar el mensaje
    payload = payload.replace('\'','\"') # reemplazamos los caracteres ' por " para que sea un JSON válido.
    data = json.loads(payload) # Convertir el JSON recibido en un diccionario de Python
    
    # Extraer los campos del mensaje
    #id = data['id']  
    nodo_id = data['id']
    type = data['type']   
    dato = data['data']  
    time = datetime.strptime(data['time'], "%Y-%m-%d %H:%M:%S.%f")  

    # Conectar a la base de datos - guardar los datos
    db = next(get_db())

    # Verificar si nodo_id existe en la tabla de nodos
    nodo_existente = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    
    if nodo_existente is None:
        print(f"Error: El nodo_id {nodo_id} no existe en la tabla de nodos.")#temperatura = Temperatura(nodo_id=nodo_id, type=type, dato=float(dato), time=time)
    else:
    # Solo se ejecuta si el nodo_id existe
        temperatura = Temperatura(nodo_id=nodo_id, type=type, dato=float(dato), time=time)
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
@router.post("/")
def create_temperatura(nodo_id: int, type: str, dato: float, time: str, db: Session = Depends(get_db)):
    temperatura = Temperatura(nodo_id=id, type=type, dato=dato, time=time)
    db.add(temperatura)
    db.commit()
    db.refresh(temperatura)
    return temperatura

@router.get("/")
def get_temperaturas(db: Session = Depends(get_db)):
    return db.query(Temperatura).all()

@router.get("/{}")
def get_temperatura(temperatura_nodo_id: int, db: Session = Depends(get_db)):
    temperatura = db.query(Temperatura).filter(Temperatura.nodo_id == temperatura_nodo_id).first()
    if temperatura is None:
        raise HTTPException(status_code=404, detail="Temperatura no encontrada")
    return temperatura


'''