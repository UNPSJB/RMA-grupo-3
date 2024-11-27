// CaptureAndExportPDF.tsx
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import Button from '@mui/material/Button';
import TemperatureChart from 'src/components/TemperatureChart';


const CaptureAndExportPDF: React.FC = () => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleExportPDF = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, { scale: 2 });


      const pdf = new JsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.9); // Cambiar a JPEG con calidad 90% en caso de mejor calidad usar png
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    }
  };

  return (
    <div>
      <div ref={contentRef} style={{ padding: '20px', maxWidth: '100%' }}>
        {/* Coloca aquí el contenido que deseas capturar, como los gráficos y la lista */}
        <div>
          <h2>Reporte de Nodos</h2>
          {/* Incluye tus gráficos y listas aquí */}
          <TemperatureChart /> {/* Ajuste a ancho completo */}
        </div>
      </div>
      <Button variant="contained" color="primary" onClick={handleExportPDF}>

        Descargar PDF
      </Button>
    </div>
  );
};

export default CaptureAndExportPDF;