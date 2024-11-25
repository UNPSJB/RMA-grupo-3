import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";

interface FilaDatos {
  numero_nodo: number;
  alias: string;
  temperatura: number | null;
  voltaje: number | null;
  precipitacion: number | null;
  altitud: number | null;
  tiempo: string | null;
}

const TablaDatos: React.FC = () => {
  const [datos, setDatos] = useState<FilaDatos[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof FilaDatos>("numero_nodo");

useEffect(() => {
    // Cargar datos desde el backend
    axios
      .get("http://localhost:8000/nodos/tabla-datos")
      .then((response) => {
        const datosTransformados = response.data.tabla_datos.map((fila: any) => ({
            /* eslint-disable @typescript-eslint/dot-notation */
            numero_nodo: fila["Numero de nodo"], // Usar corchetes
            alias: fila["Alias"], // Usar corchetes
            temperatura: fila["Temperatura [°C]"], // Usar corchetes
            voltaje: fila["Voltaje [V]"], // Usar corchetes
            precipitacion: fila["Precipitacion [mm]"], // Usar corchetes
            altitud: fila["Altitud [cm]"], // Usar corchetes
            tiempo: fila["Tiempo"], // Usar corchetes
            /* eslint-enable @typescript-eslint/dot-notation */

        }));
        setDatos(datosTransformados);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  }, []);


  const handleSort = (property: keyof FilaDatos) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedDatos = [...datos].sort((a, b) => {
    if (a[orderBy] === null) return 1;
    if (b[orderBy] === null) return -1;
    if (a[orderBy]! < b[orderBy]!) return order === "asc" ? -1 : 1;
    if (a[orderBy]! > b[orderBy]!) return order === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {[
              { id: "numero_nodo", label: "Número de Nodo" },
              { id: "alias", label: "Alias" },
              { id: "temperatura", label: "Temperatura [°C]" },
              { id: "voltaje", label: "Voltaje [V]" },
              { id: "precipitacion", label: "Precipitación [mm]" },
              { id: "altitud", label: "Altitud [cm]" },
              { id: "tiempo", label: "Tiempo" },
            ].map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={() => handleSort(column.id as keyof FilaDatos)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedDatos.map((fila, index) => (
            <TableRow key={index}>
              <TableCell>{fila.numero_nodo}</TableCell>
              <TableCell>{fila.alias}</TableCell>
              <TableCell>{fila.temperatura ?? "-"}</TableCell>
              <TableCell>{fila.voltaje ?? "-"}</TableCell>
              <TableCell>{fila.precipitacion ?? "-"}</TableCell>
              <TableCell>{fila.altitud ?? "-"}</TableCell>
              <TableCell>{fila.tiempo ? new Date(fila.tiempo).toLocaleString() : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaDatos;
