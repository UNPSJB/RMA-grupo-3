// src/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

interface Nodo {
    id: number;
    latitud: number; // Cambiado a número para latitud
    longitud: number; // Cambiado a número para longitud
}

const MapComponent: React.FC = () => {
    const [nodos, setNodos] = useState<Nodo[]>([]);

    useEffect(() => {
        // Función para obtener los nodos desde la API
        const fetchNodos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/docs#/Nodos/');
                setNodos(response.data);
            } catch (error) {
                console.error("Error al obtener los nodos:", error);
            }
        };

        fetchNodos();

        // Inicializar el mapa
        const map = L.map('map').setView([-43.2530, -65.3016], 12); // Centrro

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Definir las coordenadas del polígono (zona de interés)
        const polygonCoords: L.LatLngExpression[] = [
            [-43.451525, -65.927821], // Vértice 1
            [-43.351533, -65.925876], // Vértice 2
            [-43.192349, -65.083941], // Vértice 3
            [-43.33826, -65.21180], // Vértice 4
        ];

        // Crear el polígono y agregarlo al mapa
        const polygon = L.polygon(polygonCoords, { color: 'purple', fillOpacity: 0.3 }).addTo(map);
        polygon.bindPopup('Área delimitada: Zona de interés');

        // Establecer límites máximos del mapa
        const bounds = L.latLngBounds(polygonCoords);
        map.setMaxBounds(bounds);

         // Agregar puntos de interés desde la API
        /* nodos.forEach(nodo => {
            const { latitud, longitud } = nodo; // Desestructurar la posición
             L.marker([latitud, longitud])
                .addTo(map)
                .bindPopup(`Nodo `); // Ajustar el nombre según tus necesidades 
        }); */

        // Marcado manual
        L.marker([-43.33826, -65.21180])
                .addTo(map)
                .bindPopup(`Nodo 1`); // Ajustar el nombre según tus necesidades

        return () => {
            map.remove();
        };
    }, [nodos]); // Dependencia nodos para actualizar al obtener nuevos datos

    return <div id="map" style={{ width: '100%', height: '500px' }} />; // Ajusta el tamaño según sea necesario
};

export default MapComponent;