# ws_router.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

# Lista para almacenar conexiones de WebSocket
connected_clients: List[WebSocket] = []

@router.websocket("/ws/nodos/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print("Nuevo cliente conectado")

    try:
        while True:
            # Recibir mensajes si es necesario
            data = await websocket.receive_text()
            print(f"Mensaje recibido del cliente: {data}")
    except WebSocketDisconnect:
        print("Cliente desconectado")
    finally:
        connected_clients.remove(websocket)

# Función para notificar a los clientes conectados
async def notify_clients(nodos_data):
    # Convierte los datos a una cadena para enviarlos como texto plano
    nodos_text = str(nodos_data)
    for client in connected_clients:
        await client.send_text(nodos_text)
