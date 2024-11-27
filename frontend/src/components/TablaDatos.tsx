import React, { useState, useEffect , useCallback} from "react";
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Button,
  Box,
  FormControlLabel,
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

interface FiltroMedicion {
  habilitar: boolean;
  rangoMin: number | null;
  rangoMax: number | null;
}

type Filtros = {
  [key: string]: FiltroMedicion | boolean | string;
};

const TablaDatos: React.FC = () => {
  const [datos, setDatos] = useState<FilaDatos[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof FilaDatos | null>(null);

  // Filtros dinámicos
  const [filtros, setFiltros] = useState<Filtros>({
    nodo: false,
    temperatura: { habilitar: false, rangoMin: null, rangoMax: null },
    voltaje: { habilitar: false, rangoMin: null, rangoMax: null },
    precipitacion: { habilitar: false, rangoMin: null, rangoMax: null },
    altitud: { habilitar: false, rangoMin: null, rangoMax: null },
    fecha: false,
    fechaDesde: "",
    fechaHasta: "",
  });


  const [filtroNodo, setFiltroNodo] = useState<number[]>([]);
  const [habilitarFiltroNodo, setHabilitarFiltroNodo] = useState(false);

  const nodosUnicos = Array.from(new Set(datos.map((fila) => fila.numero_nodo)));

  const columnasActivas = [
    "numero_nodo",
    "alias",
    ...Object.keys(filtros).filter(
      (key) =>
        key !== "nodo" &&
        key !== "fechaDesde" &&
        key !== "fechaHasta" &&
        typeof filtros[key] === "object" &&
        (filtros[key] as FiltroMedicion).habilitar
    ),
    "tiempo",
  ];

  const handleFiltroHabilitar = (key: keyof Filtros) => {
    if (typeof filtros[key] === "object") {
      setFiltros({
        ...filtros,
        [key]: { ...(filtros[key] as FiltroMedicion), habilitar: !filtros[key]?.habilitar },
      });
    }
  };

  const handleFiltroRangoMin = (key: keyof Filtros, value: number | null) => {
    if (typeof filtros[key] === "object") {
      setFiltros({
        ...filtros,
        [key]: { ...(filtros[key] as FiltroMedicion), rangoMin: value },
      });
    }
  };


  const handleFiltroRangoMax = (key: keyof Filtros, value: number | null) => {
    if (typeof filtros[key] === "object") {
      setFiltros({
        ...filtros,
        [key]: { ...(filtros[key] as FiltroMedicion), rangoMax: value },
      });
    }
  };


const cargarDatos = useCallback((params: any) => {
  axios
    .get("http://localhost:8000/nodos/tabla-datos", {
      params,
      paramsSerializer: (queryParams) =>
        Object.entries(queryParams)
          .map(([key, value]) =>
            Array.isArray(value)
              ? value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&")
              : `${key}=${encodeURIComponent(value)}`
          )
          .join("&"),
    })
    .then((response) => {
      const columnasHabilitadas = Object.keys(filtros)
        .filter((key) => typeof filtros[key] === "object" && (filtros[key] as FiltroMedicion).habilitar);

      // Asegúrate de filtrar únicamente por columnas habilitadas
      setDatos(
        response.data.tabla_datos
          .filter((fila: any) =>
            columnasHabilitadas.every((col) => {
              if (col === "temperatura") return fila["Temperatura [°C]"] !== null;
              if (col === "voltaje") return fila["Voltaje [V]"] !== null;
              if (col === "precipitacion") return fila["Precipitación [mm]"] !== null;
              if (col === "altitud") return fila["Altitud [cm]"] !== null;
              return true;
            })
          )
          .map((fila: any) => ({
            numero_nodo: fila["Numero de nodo"],
            /* eslint-disable @typescript-eslint/dot-notation */
            alias: fila["Alias"],
            /* eslint-disable @typescript-eslint/dot-notation */
            temperatura: fila["Temperatura [°C]"],
            voltaje: fila["Voltaje [V]"],
            precipitacion: fila["Precipitación [mm]"],
            altitud: fila["Altitud [cm]"],
            /* eslint-disable @typescript-eslint/dot-notation */
            tiempo: fila["Tiempo"],
            /* eslint-disable @typescript-eslint/dot-notation */
          }))
      );
    })

    .catch((error) => console.error("Error al cargar los datos:", error));
}, [filtros]); // Dependemos de `filtros`

  // Cargar datos iniciales
useEffect(() => {
  cargarDatos({});
}, [cargarDatos]);


  const aplicarFiltros = () => {
    const params: any = {};

    if (filtros.nodo && filtroNodo.length > 0) {
      params.nodo_ids = filtroNodo;
    }

        // Filtro por nodos
        if (habilitarFiltroNodo && filtroNodo.length > 0) {
          params.nodo_ids = filtroNodo;
        }

        Object.keys(filtros).forEach((key) => {
          if (typeof filtros[key] === "object" && filtros[key]?.habilitar) {
            const filtro = filtros[key] as FiltroMedicion;
            if (filtro.rangoMin !== null) params[`${key}_min`] = filtro.rangoMin;
            if (filtro.rangoMax !== null) params[`${key}_max`] = filtro.rangoMax;
          }
        });
    
        // Filtro por fecha
        if (filtros.fecha) {
          if (filtros.fechaDesde) params.fecha_desde = filtros.fechaDesde;
          if (filtros.fechaHasta) params.fecha_hasta = filtros.fechaHasta;
        }

    cargarDatos(params);
  };

  const reiniciarFiltros = () => {
    setFiltroNodo([]);
    setFiltros({
      nodo: false,
      temperatura: { habilitar: false, rangoMin: null, rangoMax: null },
      voltaje: { habilitar: false, rangoMin: null, rangoMax: null },
      precipitacion: { habilitar: false, rangoMin: null, rangoMax: null },
      altitud: { habilitar: false, rangoMin: null, rangoMax: null },
      fecha: false,
      fechaDesde: "",
      fechaHasta: "",
    });
    cargarDatos({});
  };

  const handleSort = (column: keyof FilaDatos) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
    setDatos((prevDatos) =>
      [...prevDatos].sort((a, b) => {
        if (a[column] === null || b[column] === null) return 0;
        return isAsc
          ? (a[column]! > b[column]! ? 1 : -1)
          : (a[column]! < b[column]! ? 1 : -1);
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {/* Filtro por Nodo */}
        <FormControlLabel
          control={
            <Checkbox
              checked={habilitarFiltroNodo}
              onChange={(e) => setHabilitarFiltroNodo(e.target.checked)}
            />
          }
          label="Habilitar filtro por Nodo"
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filtro-nodo-label">Nodos</InputLabel>
          <Select
            labelId="filtro-nodo-label"
            multiple
            value={filtroNodo}
            onChange={(e) => setFiltroNodo(e.target.value as number[])}
            renderValue={(selected) => selected.join(", ")}
            disabled={!habilitarFiltroNodo}
          >
            {nodosUnicos.map((nodo) => (
              <MenuItem key={nodo} value={nodo}>
                <Checkbox checked={filtroNodo.includes(nodo)} />
                <ListItemText primary={`Nodo ${nodo}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>


      {/* Filtros dinámicos */}
      {["temperatura", "voltaje", "precipitacion", "altitud"].map((key) => (
        <Box key={key} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={typeof filtros[key] === "object" && (filtros[key] as FiltroMedicion).habilitar}
                onChange={() => handleFiltroHabilitar(key as keyof Filtros)}
              />
            }
            label={`Habilitar filtro para ${key}`}
          />
          <TextField
            type="number"
            label="Rango Mín."
            value={typeof filtros[key] === "object" ? (filtros[key] as FiltroMedicion).rangoMin ?? "" : ""}
            onChange={(e) =>
              handleFiltroRangoMin(key as keyof Filtros, Number(e.target.value) || null)
            }
            disabled={typeof filtros[key] !== "object" || !(filtros[key] as FiltroMedicion).habilitar}
          />
          <TextField
            type="number"
            label="Rango Máx."
            value={typeof filtros[key] === "object" ? (filtros[key] as FiltroMedicion).rangoMax ?? "" : ""}
            onChange={(e) =>
              handleFiltroRangoMax(key as keyof Filtros, Number(e.target.value) || null)
            }
            disabled={typeof filtros[key] !== "object" || !(filtros[key] as FiltroMedicion).habilitar}
          />
        </Box>
        ))}

        {/* Filtro por Fecha */}
        <FormControlLabel
          control={
            <Checkbox
              checked={filtros.fecha as boolean}
              onChange={(e) =>
                setFiltros({ ...filtros, fecha: e.target.checked })
              }
            />
          }
          label="Habilitar filtro por Fecha"
        />
        <TextField
          type="datetime-local"
          label="Desde"
          value={filtros.fechaDesde}
          onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
          disabled={!filtros.fecha}
        />
        <TextField
          type="datetime-local"
          label="Hasta"
          value={filtros.fechaHasta}
          onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
          disabled={!filtros.fecha}
        />
      </Box>

      {/* Botones */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={aplicarFiltros}>
          Aplicar Filtros
        </Button>


        <Button
          variant="outlined"
          onClick={() => {
            setFiltroNodo([]);
            setHabilitarFiltroNodo(false);
            reiniciarFiltros(); // También reinicia el resto de los filtros
          }}
        >
          Reiniciar Filtros
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columnasActivas.map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : "asc"}
                    onClick={() => handleSort(col as keyof FilaDatos)}
                  >
                    {col.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((fila, index) => (
              <TableRow key={index}>
                {columnasActivas.map((col) => (
                  <TableCell key={col}>
                    {(fila as Record<string, any>)[col] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TablaDatos;
