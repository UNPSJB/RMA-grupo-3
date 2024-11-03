import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line , Bar } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js

Chart.register(...registerables);


// Definición del tipo de dato DatosGenerales
interface DatosGenerales {
  time: string; // Cambiado de timestamp a time
  dato: number; // Cambiado de temperature a dato
}

interface Nodo {
  id: number;   // ID del nodo
  name: string; // Nombre del nodo
}

const DatosGeneralesChart: React.FC = () => {
  const [data, setData] = useState<DatosGenerales[]>([]);
  const [nodos, setNodos] = useState<Nodo[]>([]); // Estado para los nodos disponibles
  const [selectedNodo, setSelectedNodo] = useState<number | null>(null); // Nodo seleccionado
  const [selectedTipo, setSelectedTipo] = useState<string>(''); // Tipo de dato seleccionado

  const [chartData, setChartData] = useState({
    labels: [] as string[], // Eje X (time)
    datasets: [
      {
        label: 'Datos Generales',
        data: [] as number[], // Valores de dato
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  // Efecto para obtener la lista de nodos
  useEffect(() => {
    const obtenerNodos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/nodos/'); // Tu endpoint de nodos
        setNodos(response.data); // Almacena los nodos en el estado
      } catch (error) {
        console.error('Error al obtener los nodos:', error);
      }
    };

    obtenerNodos();
  }, []); // Se ejecuta una vez al montar el componente

  // Efecto para obtener los datos generales del nodo seleccionado
  useEffect(() => {
    const obtenerDatosGenerales = async () => {
      if (selectedNodo === null || selectedTipo === '') {
        // Si no hay nodo seleccionado o tipo no seleccionado, limpia el gráfico
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Datos Generales',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        return; // No hacer nada si no hay nodo o tipo seleccionado
      }

      try {
        const response = await axios.get(`http://localhost:8000/datosgenerales/${selectedNodo}/${selectedTipo}`);
        const datosGenerales: DatosGenerales[] = response.data;

        // Actualiza el estado `data` con los datos recibidos
        setData(datosGenerales);

        // Mapea los datos para crear los labels (time) y los datos generales (dato)
        const times = datosGenerales.map((t) => t.time);
        const valoresDato = datosGenerales.map((t) => t.dato);

        // Actualiza el estado `chartData` para reflejar los nuevos datos
        setChartData({
          labels: times,
          datasets: [
            {
              label: 'Datos Generales',
              data: valoresDato,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error al obtener los datos generales:', error);
      }
    };

    obtenerDatosGenerales();
  }, [selectedNodo, selectedTipo]); // Ejecutar cada vez que cambie el nodo o el tipo seleccionado

  // Manejar el cambio de selección de nodo
  const handleNodoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "") {
      // Si se selecciona "Seleccionar un nodo", establece selectedNodo como null
      setSelectedNodo(null);
    } else {
      // Actualiza el nodo seleccionado
      setSelectedNodo(Number(value));
    }
  };

  // Manejar el cambio de selección de tipo
  const handleTipoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTipo(event.target.value); // Actualiza el tipo seleccionado
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gráfico de Barras de Datos Generales',
      },
    },
    }

  return (
    <div>
      <h1>Gráfico de Datos Generales</h1>
      
      {/* Componente de selección para nodos */}
      <select id="nodoSelect" onChange={handleNodoChange} value={selectedNodo ?? ''}>
        <option value="">Seleccionar un nodo</option>
        {nodos.map((nodo) => (
          <option key={nodo.id} value={nodo.id}>
            {nodo.id} {/* Muestra el nombre del nodo */}
          </option>
        ))}
      </select>

      {/* Componente de selección para tipo de dato */}
      <select id="tipoSelect" onChange={handleTipoChange} value={selectedTipo}>
        <option value="">Seleccionar tipo de dato</option>
        <option value="altitude_t">Altitud</option>
        <option value="temp_t">Temperatura</option>
        <option value="voltage_t">Voltaje</option>
      </select>

      <Line data={chartData} />
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DatosGeneralesChart;
