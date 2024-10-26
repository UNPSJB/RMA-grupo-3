import sys
import argparse
import threading
import signal
import random
import time
import paho.mqtt.client as paho
from mqtt import TipoMensaje
from mqtt.pub import Nodo
from mqtt.config import config

def signal_handler(sig, frame):
    print("Deteniendo nodos...")
    stop_event.set()


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--nodos",
        type=int,
        default=5,
        help="Cantidad de nodos para la cual generar datos. (default=5)",
    )

    stop_event = threading.Event()
    signal.signal(signal.SIGINT, signal_handler)
    
    args = parser.parse_args()
    lista_nodos = [
        Nodo(i, frecuencia=random.randint(10, 12), stop_event=stop_event)
        for i in range(args.nodos)
    ]
    print(f"{len(lista_nodos)} nodo/s creado/s. Publicando...")

    for nodo in lista_nodos:

        thread = threading.Thread(
            target=nodo.publicar,
            args=(config.topic, TipoMensaje.TEMP_T),
        )
        thread.start()

        time.sleep(random.randint(1, 3))
        thread = threading.Thread(
            target=nodo.publicar,
            args=(config.topic, TipoMensaje.ALTITUDE_T),
        )
        thread.start()

        time.sleep(random.randint(1, 3))
        thread = threading.Thread(
            target=nodo.publicar,
            args=(config.topic, TipoMensaje.VOLTAGE_T),
        )
        thread.start()
        
        time.sleep(random.randint(1, 3))
