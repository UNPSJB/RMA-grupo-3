import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

interface Nodo {
    id: number;
    latitud: number;
    longitud: number;
    alias: string; // Nuevo campo para alias
    estado: number; // Nuevo campo para estado
}

const MapComponent: React.FC = () => {
    const [nodos, setNodos] = useState<Nodo[]>([]);
    const [map, setMap] = useState<L.Map | null>(null);

    // Fetch de nodos
    const fetchNodos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/nodos/');
            setNodos(response.data);
        } catch (error) {
            console.error("Error al obtener los nodos:", error);
        }
    };

    useEffect(() => {
        // Llamar a fetchNodos de inmediato
        fetchNodos();

        // Intervalo de actualización
        const intervalId = setInterval(fetchNodos, 10000); // 10 segundos en milisegundos

        // Limpiar el intervalo al desmontar el componente
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Lista de dependencias vacía para ejecutar solo una vez

    // Inicializar el mapa solo una vez al montar el componente
    useEffect(() => {
        const initialMap = L.map('map').setView([-43.420000, -65.790000], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(initialMap);

        // Definir y agregar el polígono al mapa
        const polygonCoords: L.LatLngExpression[] = [
            [-43.451525, -65.927821],
            [-43.351533, -65.925876],
            [-43.192349, -65.083941],
            [-43.33826, -65.21180],
        ];
        // const polygon = L.polygon(polygonCoords, { color: 'purple', fillOpacity: 0.3 }).addTo(initialMap);
        // polygon.bindPopup('Área delimitada: Zona de interés');

        // Establecer límites máximos del mapa
        const bounds = L.latLngBounds(polygonCoords);
        initialMap.setMaxBounds(bounds);

        setMap(initialMap);

        return () => {
            initialMap.remove();
        };
    }, []);

    // Actualizar marcadores cuando `nodos` cambia
    useEffect(() => {
        if (!map) return; // Esperar hasta que el mapa esté inicializado

        // Limpiar los marcadores anteriores
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Agregar un marcador por cada nodo
        nodos.forEach(({ id, latitud, longitud, alias, estado }) => {
            const marker = L.marker([latitud, longitud]).addTo(map);
            
            // Información que se mostrará en el popup
            const popupContent = `
                <b>Nodo ${id}</b><br>
                ${alias ? `Alias: ${alias}<br>` : ''} 
                Latitud: ${latitud.toFixed(6)}<br>
                Longitud: ${longitud.toFixed(6)}<br>
                Estado: ${estado === 1 ? 'Activo' : 'Inactivo'}<br>
                 <button onclick="navigateToDetail(${id})" style="
                    margin-top: 10px; 
                    padding: 8px 12px; 
                    color: white; 
                    background-color: #007bff; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer;
                    font-size: 14px;
                ">
                    Ver detalles
                 </button>
            `;

            // Asignar el popup al marcador
            marker.bindPopup(popupContent);
        });
    }, [nodos, map]); // Ejecutar este efecto cuando `nodos` o `map` cambien

    return <div id="map" style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
