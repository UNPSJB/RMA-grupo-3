import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, 
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
  Typography,
} from "@mui/material";
import AddUserForm from "./AddUserForm";

import { CheckCircle, Cancel } from "@mui/icons-material";

// Define el tipo de dato que llega desde el backend
interface UserData {
  id: number;
  username: string;
  // email: string;
  rol: string; 
  estado: boolean; 
}

const UserTable: React.FC = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [orderBy, setOrderBy] = useState<keyof UserData>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/usuarios/get-data");
      setData(response.data.data); 
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setError("No se pudieron cargar los datos. Intentelo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos desde el backend
  useEffect(() => {
    fetchData();
  }, []);

  // Función para manejar el orden de las columnas
  const handleSort = (column: keyof UserData) => {
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
    return order === "asc" ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    /* if (order === "asc") {
      return valueA > valueB ? 1 : -1;
    }
    return valueA < valueB ? 1 : -1; */
  });

  // Abrir diálogo de confirmación
  const handleOpenDialog = (userId: number) => {
    console.log("Cerrando el diálogo...");

    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  // Cerrar diálogo de confirmación
  const handleCloseDialog = () => {
    setSelectedUserId(null);
    setDialogOpen(false);
  };

  // Desactivar usuario
  const handleToggleUserState = async (userId: number, currentState: boolean) => {
  //  if (selectedUserId !== null) {
    try {
      const response = await axios.put(`http://localhost:8000/usuarios/${selectedUserId}/toggle`);
      // console.log("Respuesta del servidor: ", response.data);
      setData((prevData) =>
        prevData.map((user) =>
          user.id === userId ? { ...user, estado:  !currentState } : user
        )
      );
    } catch (fetchError) {
      console.error("Error al desactivar/activar el usuario:", error);
      setError(fetchError.response?.data?.detail || "No se pudo desactivar/activar el usuario. Intentalo nuevamente.");
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) 
    return <Typography> Cargando datos...</Typography>;

  if (error)
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    )
  
  return (
    <>
      {showAddUserForm ? (
        <AddUserForm 
          onCancel={() => {
            setShowAddUserForm(false);
            fetchData();
          }} 
        />
      ) : ( 
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAddUserForm(true)}
            >
              Registrar usuario nuevo
            </Button>
          </Box>
        
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    { label: "ID usuario", key: "id" },
                    { label: "Nombre de usuario", key: "username" },
                    /* { label: "Email", key: "email" }, */
                    { label: "Rol", key: "rol" }, 
                    { label: "Estado", key: "estado" }, 
                  ].map((column) => (
                    <TableCell key={column.key}>
                      { /* {column.key !== "acciones" ? ( */ }
                      <TableSortLabel
                        active={orderBy === column.key}
                        direction={orderBy === column.key ? order : "asc"}
                        onClick={() => handleSort(column.key as keyof UserData)}
                      >
                        {column.label}
                      </TableSortLabel>
                      { /* ) : (
                        column.label
                      )} */ } 
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    { /* <TableCell>{row.email}</TableCell>*/ }
                    <TableCell>{row.rol}</TableCell> 
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
                        color={row.estado ? "secondary" : "primary"}
                        onClick={() => handleOpenDialog(row.id)}
                        // disabled={!row.estado}
                      >
                        {row.estado ? "Deshabiltar" : "Habilitar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas deshabilitar/habilitar este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={async () => {
              if (selectedUserId !== null) {
                const selectedUser = data.find((user) => user.id === selectedUserId);
                if (selectedUser) {
                  await handleToggleUserState(selectedUserId, selectedUser.estado);
                }
              }
              handleCloseDialog();
            }}
            color="secondary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
