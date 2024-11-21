import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

interface EditNodeFormProps {
  nodeId: number;
  onClose: () => void; // Callback para cerrar el formulario
  onUpdate: () => void; // Callback para actualizar la tabla después de guardar
}

const EditNodeForm: React.FC<EditNodeFormProps> = ({ nodeId, onClose, onUpdate }) => {
  // Ajuste para usar tipos adecuados
  const [formData, setFormData] = useState({
    latitud: 0, // Valor inicial como número
    longitud: 0, // Valor inicial como número
    alias: "",
    descripcion: "",
    estado: true, // Booleano para cumplir con el esquema del backend
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Cargar los datos actuales del nodo al montar el componente
  useEffect(() => {
    const fetchNodeData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/nodos/${nodeId}`);
        const node = response.data;
        setFormData({
          latitud: node.latitud, // Mantener como número
          longitud: node.longitud, // Mantener como número
          alias: node.alias || "",
          descripcion: node.descripcion || "",
          estado: node.estado || false,
        });
      } catch (error) {
        console.error("Error al cargar los datos del nodo:", error);
      }
    };

    fetchNodeData();
  }, [nodeId]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "latitud" || name === "longitud" ? parseFloat(value) : value,
    }));
  };

  // Confirmación antes de guardar
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Guardar los cambios
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8000/nodos/${nodeId}`, formData);
      onUpdate(); // Actualizar la tabla
      onClose(); // Cerrar el formulario
    } catch (error) {
      console.error("Error al actualizar el nodo:", error.response?.data || error.message);
      alert("Hubo un error al actualizar el nodo.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <h2>Editar Nodo</h2>
      <form>
        <TextField
          label="Latitud"
          name="latitud"
          type="number"
          value={formData.latitud}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Longitud"
          name="longitud"
          type="number"
          value={formData.longitud}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Alias"
          name="alias"
          value={formData.alias}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Guardar
          </Button>
        </Box>
      </form>

      {/* Diálogo de confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas guardar los cambios en este nodo? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditNodeForm;
