import os
from dotenv import load_dotenv
import asyncio
from telegram import Bot
import paho.mqtt.client as mqtt
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Obtener la ruta del directorio donde se encuentra bot.py
base_dir = Path(__file__).parent
# Construir la ruta completa al archivo .env
dotenv_path = base_dir / 'token_bot.env'

# Cargar las variables de entorno
load_dotenv(dotenv_path=dotenv_path)

#7208214203
#6738309138
#6915513359

# Cargar las variables de entorno desde el archivo .env
#dotenv_path = r'C:\Users\Franco\Desktop\aaa\RMA-grupo-3\backend\token_bot.env'
load_dotenv(dotenv_path=dotenv_path)
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
if not BOT_TOKEN or not CHAT_ID:
    raise ValueError("El BOT_TOKEN o CHAT_ID no están configurados correctamente.")

# Inicializa el bot de Telegram
bot = Bot(token=BOT_TOKEN)

# Función asíncrona para enviar mensajes al chat de Telegram
async def send_telegram_message(message: str):
    """Función asíncrona para enviar mensajes al chat de Telegram."""
    try:
        await bot.send_message(chat_id=CHAT_ID, text=message)
        print(f"Mensaje enviado: {message}")
    except Exception as e:
        print(f"Error al enviar mensaje: {e}")

# Función para definir los valores normales para diferentes tipos de datos
def is_data_normal(type: str, dato: float) -> bool:
    """Devuelve True si el dato está dentro del rango normal para el tipo de dato."""
    if type == 'temp_t':
        # Rango normal para temperatura (ejemplo 18°C a 30°C)
        return 13 <= dato <= 28
    elif type == 'altitude_t':
        # Rango normal para altitud (ejemplo 0 m a 5000 m)
        return 0 <= dato <= 20
    elif type == 'voltage_t':
        # Rango normal para voltaje (ejemplo 0V a 240V)
        return 1 <= dato <= 5
    elif type == 'rainfall_t':
        # Rango normal para lluvia (ejemplo 0 mm a 100 mm)
        return 0 <= dato <= 8
    else:
        # Para otros tipos de datos, puedes asumir que los valores siempre son normales
        return True

# Función para manejar la conexión con el broker MQTT
def on_connect(client, userdata, flags, rc):
    print(f"Conectado al broker con código de resultado: {rc}")
    if rc == 0:
        print("Conexión exitosa. Suscrito al tópico...")
        client.subscribe("test_topic")  # Asegúrate de que este sea el tópico correcto
    else:
        print("Error de conexión:", rc)

def on_message(client, userdata, message):
    print(f"Mensaje recibido en el tópico {message.topic}: {message.payload.decode()}")
    payload = message.payload.decode("utf-8")
    payload = payload.replace('\'', '"')  # Convertir a JSON válido
    try:
        data = json.loads(payload)
        print(f"Datos extraídos: {data}")
        # Extraer los campos del mensaje
        nodo_id = data.get('id', 'Desconocido')
        type = data.get('type', 'Desconocido')
        dato = data.get('data', 'Desconocido')
        time = data.get('time', '1970-01-01 00:00:00.000')  # Valor predeterminado con milisegundos

        # Convertir 'time' a datetime con milisegundos
        try:
            time = datetime.strptime(time, "%Y-%m-%d %H:%M:%S.%f")  # Formato con milisegundos
        except ValueError:
            print(f"Error al convertir 'time' a datetime con milisegundos: {time}")
            return

        # Convertir 'dato' a float, si es posible
        try:
            dato = float(dato)
        except ValueError:
            print(f"Error al convertir 'dato' a float: {dato}")
            return

        # Verificar si el dato está dentro del rango normal para el tipo de dato
        if not is_data_normal(type, dato):
            # Chequeo de tipo para personalizar el mensaje
            if type == "temp_t":
                mensaje = f"Alerta: Nuevo dato recibido fuera del rango normal. Nodo {nodo_id}: {dato} de tipo Temperatura"
            elif type == "voltage_t":
                mensaje = f"Alerta: Nuevo dato recibido fuera del rango normal. Nodo {nodo_id}: {dato} de tipo Tensión"
            elif type == "altitude_T":
                mensaje = f"Alerta: Nuevo dato recibido fuera del rango normal. Nodo {nodo_id}: {dato} de tipo Altura"
            elif type == "rainfall_T":
                mensaje = f"Alerta: Nuevo dato recibido fuera del rango normal. Nodo {nodo_id}: {dato} de tipo Precipitación"
            else:
                mensaje = f"Alerta: Nuevo dato recibido fuera del rango normal. Nodo {nodo_id}: {dato} de tipo {type}"
            # Enviar el mensaje con Telegram
            asyncio.run(send_telegram_message(mensaje))
        else:
            print(f"Dato dentro del rango normal: {dato}")
    except json.JSONDecodeError as e:
        print(f"Error al decodificar el mensaje: {e}")

# Función para manejar la suscripción
def on_subscribe(client, userdata, mid, granted_qos):
    print(f"Suscripción exitosa al tópico. QoS: {granted_qos}")

# Función para configurar y conectar el cliente MQTT
def setup_mqtt():
    client = mqtt.Client()

    # Asignar las funciones de callback
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_subscribe = on_subscribe

    try:
        client.connect("localhost", 1883, 60)  # Conéctate al broker en localhost
    except Exception as e:
        print(f"Error al conectar con el broker MQTT: {e}")
        return

    # Iniciar el loop para recibir mensajes
    client.loop_forever()

# Llamar a la función de configuración MQTT
setup_mqtt()

# Genera un mensaje de prueba para confirmar que todo está en funcionamiento
print("FIN")
