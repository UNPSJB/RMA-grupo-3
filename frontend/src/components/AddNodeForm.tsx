import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

interface AddNodeFormProps {
  onCancel: () => void;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    id: "",
    latitud: "",
    longitud: "",
    alias: "",
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/nodos/", {
        id: parseInt(formData.id, 10),
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        alias: formData.alias,
        descripcion: formData.descripcion || null,
      });
      alert("Nodo agregado exitosamente.");
      onCancel(); // Vuelve a la tabla de nodos
    } catch (error) {
      console.error("Error al agregar el nodo:", error);
      alert("Ocurrió un error al agregar el nodo.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Agregar Nodo
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ID"
          name="id"
          value={formData.id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Latitud"
          name="latitud"
          value={formData.latitud}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Longitud"
          name="longitud"
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Guardar Nodo
        </Button>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Cancelar
        </Button>
      </form>
    </Box>
  );
};

export default AddNodeForm;
