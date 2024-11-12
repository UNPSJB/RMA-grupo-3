from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from dependencies import get_db  
from database import DatosGenerales, Nodo
from schemas import DatosGeneralesCreate, DatosGeneralesResponse, NodoDetail
from datetime import datetime
import paho.mqtt.client as mqtt
import json

router = APIRouter()

# Función para manejar la recepción de mensajes MQTT
def on_message(_, userdata, message):
    payload = message.payload.decode("utf-8")
    payload = payload.replace('\'','"')  # Convert to valid JSON
    data = json.loads(payload)

    # Extraer los campos del mensaje
    nodo_id = data['id']
    type = data['type']   
    dato = data['data']  
    time = datetime.strptime(data['time'], "%Y-%m-%d %H:%M:%S.%f")  

    db = next(get_db())

    # Verificar si nodo_id existe en la tabla de nodos
    nodo_existente = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    
    if nodo_existente is None:
        print(f"Error: El nodo_id {nodo_id} no existe en la tabla de nodos.")
    else:
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
@router.post("/", response_model=DatosGeneralesResponse)
def create_datosGenerales(datos: DatosGeneralesCreate, db: Session = Depends(get_db)):
    datosGenerales = DatosGenerales(**datos.dict())
    db.add(datosGenerales)
    db.commit()
    db.refresh(datosGenerales)
    return datosGenerales

# Obtener todos los registros
@router.get("/", response_model=list[DatosGeneralesResponse])
def get_datosGenerales(db: Session = Depends(get_db)):
    return db.query(DatosGenerales).all()

# Ruta para obtener datos filtrados por nodo y tipo
@router.get("/{id_nodo}/{tipo}", response_model=list[DatosGeneralesResponse])
def get_datos_by_nodo_and_type(id_nodo: int, tipo: str, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == id_nodo).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    datos = db.query(DatosGenerales).filter(
        DatosGenerales.nodo_id == id_nodo,
        DatosGenerales.type == tipo
    ).limit(20).all()
    
    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron datos para el nodo y tipo especificados")
    
    return datos

""" # Ruta para obtener un dato específico de DatosGenerales por nodo_id
@router.get("/{datosGenerales_nodo_id}", response_model=DatosGeneralesResponse)
def get_datosGenerales(datosGenerales_nodo_id: int, db: Session = Depends(get_db)):
    datosGenerales = db.query(DatosGenerales).filter(DatosGenerales.nodo_id == datosGenerales_nodo_id).first()
    if datosGenerales is None:
        raise HTTPException(status_code=404, detail="Dato no encontrado")
    return datosGenerales """



""" # Obtener registros de tipo `altitude_t`
@router.get("/altitude", response_model=list[DatosGeneralesResponse])
def get_datos_altitude(db: Session = Depends(get_db)):
    datos = db.query(DatosGenerales).filter(DatosGenerales.type == "altitude_t").all()
    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron datos de tipo altitude_t")
    return datos

# Obtener registros de tipo `temp_t`
@router.get("/temperature", response_model=list[DatosGeneralesResponse])
def get_datos_temperature(db: Session = Depends(get_db)):
    datos = db.query(DatosGenerales).filter(DatosGenerales.type == "temp_t").all()
    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron datos de tipo temp_t")
    return datos

# Obtener registros de tipo `voltage_t`
@router.get("/voltage", response_model=list[DatosGeneralesResponse])
def get_datos_voltage(db: Session = Depends(get_db)):
    datos = db.query(DatosGenerales).filter(DatosGenerales.type == "voltage_t").all()
    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron datos de tipo voltage_t")
    return datos """



""" # Ruta para obtener todos los datos de un nodo específico por `id_nodo`
@router.get("/{id_nodo}", response_model=NodoDetail)
def get_datos_by_nodo(id_nodo: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == id_nodo).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    return nodo """