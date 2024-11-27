import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Asegúrate de estar usando React Router

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
    const navigate = useNavigate(); // Hook de navegación de React Router

    // Definir una función global para manejar el clic
    useEffect(() => {
        // Función global para manejar la navegación
        (window as any).navigateToHome = () => {
            navigate('/dashboard/nodos'); // Redirigir al home
        };
    }, [navigate]);

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
        fetchNodos();
        const intervalId = setInterval(fetchNodos, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const initialMap = L.map('map').setView([-43.420000, -65.790000], 10);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(initialMap);
    
        // Definir un polígono y agregarlo al mapa
        const polygonCoords: L.LatLngExpression[] = [
            [-43.451525, -65.927821],
            [-43.351533, -65.925876],
            [-43.192349, -65.083941],
            [-43.33826, -65.21180],
        ];
        
        // Establecer límites máximos del mapa
        const bounds = L.latLngBounds(polygonCoords);
        initialMap.setMaxBounds(bounds);
    
        // Guardar el mapa en el estado
        setMap(initialMap);
    
        // Devolver una función de limpieza
        return () => {
            initialMap.remove(); // Eliminar el mapa de la instancia de Leaflet
        };
    }, []);
    
    useEffect(() => {
        if (!map) return;

        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        nodos.forEach(({ id, latitud, longitud, alias, estado }) => {
            const marker = L.marker([latitud, longitud]).addTo(map);
            
            const popupContent = `
                <b>Nodo ${id}</b><br>
                ${alias ? `Alias: ${alias}<br>` : ''} 
                Latitud: ${latitud.toFixed(6)}<br>
                Longitud: ${longitud.toFixed(6)}<br>
                Estado: ${estado === 1 ? 'Activo' : 'Inactivo'}<br>
                <button onclick="navigateToHome()" style="
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

            marker.bindPopup(popupContent);
        });
    }, [nodos, map]);

    return <div id="map" style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
