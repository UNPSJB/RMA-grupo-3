import sys
import time
import random
import threading
import paho.mqtt.client as paho
from typing import Optional
from datetime import datetime ,timedelta
from dataclasses import dataclass
from pydantic import BaseModel
from mqtt import TipoMensaje
from mqtt.config import config
from dotenv import load_dotenv

current_date = datetime(2024, 1, 1)
call_count = 0  # Contador de llamadas
max_voltage = 5.0

def increment_day():
    global current_date , call_count , max_voltage
    result_date = current_date
    call_count += 1  # Incrementar el contador de llamadas

    if call_count == 4:  # Cada cuarta llamada -- Genera un dato de cada tipo por dia
        current_date += timedelta(days=1)  # Incrementa el dia
        call_count = 0  # Reiniciar el contador
        max_voltage -= random.uniform(0.1, 0.5)

    return result_date

class Mensaje(BaseModel):
    id: int
    type: str
    data: str
    time: str

@dataclass
class Nodo:
    id: int
    stop_event: threading.Event
    cliente: paho.Client = paho.Client()
    frecuencia: int = 10  # tiempo entre mensajes (segundos)
    mensajes_enviados: int = 0

    def __post_init__(self) -> None:
        self.setear_manejadores_de_eventos()

    def setear_manejadores_de_eventos(self) -> None:

        def on_connect(_, obj, flags, reason_code) -> None:
            if self.cliente.is_connected():
                print("Publicador conectado!")

        self.cliente.enable_logger()
        self.cliente.on_connect = on_connect

    def publicar(
        self,
        topic: str,
        tipo: TipoMensaje,
        message: str = "",
        qos: int = 1,
    ) -> None:
        if not self.cliente.is_connected():
            self.conectar()

        while not self.stop_event.is_set():
            if len(message) == 0:
                if tipo == 'altitude_t': #Altura
                    message = str(
                    round(random.uniform(0.0, 20.0), 2)
                )  # altitud random entre 0 y 20 mm
                elif tipo == 'temp_t': #Temperatura
                    message = str(
                    round(random.uniform(10.0, 30.0), 2)
                )  # temperatura random entre 10 y 35°C
                elif tipo == 'voltage_t': #Voltaje
                    message = str(
                    round(max_voltage, 2)
                )  # voltage random entre 0 y 5 V
                elif tipo == 'rainfall_t': #Lluvia
                    message = str(
                    round(random.uniform(0.0, 10.0), 2)
                )  # precipitacion random entre 0 y 10 mm
                
            mensaje = self.formatear_mensaje(
                topic,
                tipo,
                message,
            )

            res = self.cliente.publish(
                topic,
                mensaje,
                qos,
            )

            try:
                res.wait_for_publish()
                if res.is_published():
                    self.cliente.logger.warn(f"{res.mid} - {mensaje}")
                    self.mensajes_enviados += 1
                else:
                    print(f"El mensaje n° {res.mid} no fue publicado.")
            except RuntimeError as re:
                print(f"El cliente se ha desconectado con el mensaje: {res.rc}.")
                break

            message = ""
            time.sleep(self.frecuencia)

        self.cliente.loop_stop()
        self.desconectar()

    def conectar(self) -> None:
        if self.cliente.connect(config.host, config.port, config.keepalive) != 0:
            print("Ha ocurrido un error al conectar al broker MQTT")
        print("Conectado al broker MQTT!")
        self.cliente.loop_start()

    def desconectar(self):
        self.cliente.disconnect()
        print(f"Desconectado! - mensajes enviados: {self.mensajes_enviados}")
        sys.exit(0)

    def formatear_mensaje(self, topic: str, tipo: TipoMensaje, mensaje: str) -> str:
        mensaje = Mensaje(
            #id=self.id, type=tipo, data=str(mensaje), time=str(random_date())
            id=self.id, type=tipo, data=str(mensaje), time=str(increment_day())
        ).model_dump()
        return str(mensaje)
    

