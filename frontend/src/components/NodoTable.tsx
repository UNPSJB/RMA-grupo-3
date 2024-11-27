import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Box,
} from "@mui/material";

import { CheckCircle, Cancel } from "@mui/icons-material";
import EditNodeForm from "./EditNodeForm";

interface NodoTableProps {
  onEditNode: (nodeId: number) => void; // Nueva prop para manejar la edición
}

// Define el tipo de dato que llega desde el backend
interface NodoData {
  id: number;
  latitud: number;
  longitud: number;
  alias: string;
  estado: boolean;
  ultimo_voltaje: number | null;
}

const NodoTable: React.FC<NodoTableProps> = ({ onEditNode }) => {
  const [data, setData] = useState<NodoData[]>([]);
  const [orderBy, setOrderBy] = useState<keyof NodoData>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<number | null>(null);
  const [fetchError, setError] = useState<string | null>(null);
  const [selectedNodeState, setSelectedNodeState] = useState<boolean | null>(null);

  // Cargar datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/nodos/get-data");
        setData(response.data.data); // Ajusta si el formato de los datos es diferente
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchData();
  }, []);

  // Función para manejar el orden de las columnas
  const handleSort = (column: keyof NodoData) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  // Ordenar datos
  const sortedData = data.sort((a, b) => {
    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (valueA === null || valueB === null) {
      return 0;
    }

    if (order === "asc") {
      return valueA > valueB ? 1 : -1;
    }
    return valueA < valueB ? 1 : -1;
  });

  // Abrir diálogo de confirmación para desactivar nodo
  const handleOpenDialog = (nodeId: number, currentState: boolean) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeState(currentState);
    setDialogOpen(true);
  };

  // Cerrar diálogo de confirmación
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedNodeId(null);
  };

const handleToggleNodeState = async (nodoId: number, currentState: boolean) => {
  //  if (selectedUserId !== null) {
    try {
      const response = await axios.put(`http://localhost:8000/nodos/${selectedNodeId}/toggle`);
      // console.log("Respuesta del servidor: ", response.data);
      setData((prevData) =>
        prevData.map((nodo) =>
          nodo.id === nodoId ? { ...nodo, estado:  !currentState } : nodo
        )
      );
    } catch (error) {
      console.error("Error al desactivar/activar el nodo:", fetchError);
      setError(error.response?.data?.detail || "No se pudo desactivar/activar el nodo. Intentalo nuevamente.");
    } finally {
      handleCloseDialog();
    }
  };

  // Desactivar nodo
  /* const handleDeactivateNode = async () => {
    if (selectedNodeId !== null) {
      try {
        await axios.put(`http://localhost:8000/nodos/${selectedNodeId}/deactivate`);
        setData((prevData) =>
          prevData.map((node) =>
            node.id === selectedNodeId ? { ...node, estado: false } : node
          )
        );
        handleCloseDialog();
      } catch (error) {
        console.error("Error al desactivar el nodo:", error);
      }
    }
  }; */

  // Abrir formulario de edición
  const handleEditNode = (nodeId: number) => {
    setEditingNodeId(nodeId);
  };

  // Cerrar formulario de edición
  const handleCloseEditForm = () => {
    setEditingNodeId(null);
  };

  // Actualizar datos tras la edición
  const handleUpdateNode = async () => {
    try {
      const response = await axios.get("http://localhost:8000/nodos/get-data");
      setData(response.data.data); // Volver a cargar los datos después de la edición
      handleCloseEditForm();
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {[
              { label: "ID nodo", key: "id" },
              { label: "Latitud (°)", key: "latitud" },
              { label: "Longitud (°)", key: "longitud" },
              { label: "Alias", key: "alias" },
              { label: "Voltaje (V)", key: "ultimo_voltaje" },
              { label: "Estado", key: "estado" },
              { label: "Acciones", key: "acciones" },
            ].map((column) => (
              <TableCell key={column.key}>
                {column.key !== "acciones" ? (
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? order : "asc"}
                    onClick={() => handleSort(column.key as keyof NodoData)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.latitud}</TableCell>
              <TableCell>{row.longitud}</TableCell>
              <TableCell>{row.alias}</TableCell>
              <TableCell>{row.ultimo_voltaje ?? "N/A"}</TableCell>
              <TableCell>
                {row.estado ? (
                  <CheckCircle style={{ color: "green" }} />
                ) : (
                  <Cancel style={{ color: "red" }} />
                )}
              </TableCell>

              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onEditNode(row.id)}
                >
                  Modificar
                </Button>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1}}>
                  <Button
                     variant="contained"
                    color={row.estado ? "secondary" : "primary"} 
                    onClick={() => handleOpenDialog(row.id, row.estado)}
                  >
                    {row.estado ? "Deshabiltar" : "Habilitar"}
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Diálogo de confirmación */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas desactivar este nodo? Esta acción es reversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              if (selectedNodeId !== null && selectedNodeState !== null) {
                handleToggleNodeState(selectedNodeId, selectedNodeState);
              }
            }}
            color="secondary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulario de edición */}
      {editingNodeId !== null && (
        <EditNodeForm
          nodeId={editingNodeId}
          onClose={handleCloseEditForm}
          onUpdate={handleUpdateNode}
        />
      )}
    </TableContainer>
  );
};

export default NodoTable;
