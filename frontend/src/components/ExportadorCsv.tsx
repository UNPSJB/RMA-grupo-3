import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Iconify} from 'src/components/iconify';

const DownloadCsvButton: React.FC = () => {



  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:8000/nodos/export-csv', {
        responseType: 'blob', // Esto asegura que obtengas el archivo como un blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv'); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Liberar la URL creada
    } catch (error) {
      console.error("Error downloading the CSV file", error);
    }
  };

  return <Button 
  variant="contained"
  color="inherit"
  startIcon={<Iconify icon="mingcute:download-3-line" />}
  type="button" onClick={handleDownload}>Descargar CSV
  </Button>;
};

export default DownloadCsvButton;
