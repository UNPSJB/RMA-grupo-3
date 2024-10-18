import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

// Definición del tipo de dato TemperatureData
interface TemperatureData {
  time: string;        // Cambiado de timestamp a time
  dato: number;       // Cambiado de temperature a dato
}

const TemperatureChart: React.FC = () => {
  const [data, setData] = useState<TemperatureData[]>([]);

  const [chartData, setChartData] = useState({
    labels: [] as string[], // Eje X (time)
    datasets: [
      {
        label: 'Temperatura',
        data: [] as number[], // Valores de dato
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const obtenerTemperaturas = async () => {
      try {
        const response = await axios.get('http://localhost:8000/temperaturas/');
        const temperaturas: TemperatureData[] = response.data;

        // Actualiza el estado `data` con los datos recibidos
        setData(temperaturas);

        // Mapea los datos para crear los labels (time) y las temperaturas (dato)
        const times = temperaturas.map((t) => t.time);
        const valoresDato = temperaturas.map((t) => t.dato);

        // Actualiza el estado `chartData` para reflejar los nuevos datos
        setChartData({
          labels: times,
          datasets: [
            {
              label: 'Temperatura',
              data: valoresDato,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error al obtener las temperaturas:', error);
      }
    };

    obtenerTemperaturas();
  }, []);

  return (
    <div>
      <h1>Gráfico de Temperaturas</h1>
      <Line data={chartData} />
    </div>
  );
};

export default TemperatureChart;
