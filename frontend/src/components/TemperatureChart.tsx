import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import mqtt from 'mqtt'; // Librería para conectarse a MQTT

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TemperatureData {
  timestamp: string;
  temperature: number;
}

const TemperatureChart: React.FC = () => {
  const [data, setData] = useState<TemperatureData[]>([]);

  const [chartData, setChartData] = useState({
    labels: [] as string[], // Eje X (timestamps)
    datasets: [
      {
        label: 'Temperatura',
        data: [30] as number[], // Valores de temperatura
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Conectar a MQTT
    const client = mqtt.connect('mqtt://localhost:1883'); // Asegúrate de que esta URL coincida con tu configuración

    // Suscribirse al topic de temperaturas
    client.on('connect', () => {
      client.subscribe('temperatures', (err) => {
        if (!err) {
          console.log('Suscrito al topic temperatures');
        }
      });
    });

    // Manejar los mensajes entrantes de MQTT
    client.on('message', (topic, message) => {
      const temp = parseFloat(message.toString());
      const newData = {
        timestamp: new Date().toLocaleTimeString(), // Generar un timestamp simple
        temperature: temp,
      };

      // Actualizar el estado con el nuevo valor
      setData((prevData) => [...prevData, newData]);

      // Actualizar los datos del gráfico
      setChartData((prevChartData) => ({
        ...prevChartData,
        labels: [...prevChartData.labels, newData.timestamp],
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: [...prevChartData.datasets[0].data, newData.temperature],
          },
        ],
      }));
    });

    // Desconectar de MQTT cuando se desmonte el componente
    return () => {
      client.end();
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        Gráfico de Temperatura en Tiempo Real
      </Typography>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </Box>
  );
};

export default TemperatureChart;
