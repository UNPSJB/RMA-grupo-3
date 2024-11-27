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
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  SelectChangeEvent } from "@mui/material";

interface EditUserFormProps {
  userId: number;
  onClose: () => void; // Callback para cerrar el formulario
  onUpdate: () => void; // Callback para actualizar la tabla después de guardar
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userId, onClose, onUpdate }) => {
  // Ajuste para usar tipos adecuados
  const [formData, setFormData] = useState({
    username: "", 
    // email: "", 
    rol: "",
    // estado: true, // Booleano para cumplir con el esquema del backend
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleRolChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Cargar los datos actuales del nodo al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/usuarios/get-data");
        const user = response.data;
        setFormData({
          username: user.username, 
          // email: user.email, 
          rol: user.rol || "",
          //estado: user.estado || false,
        });
      } catch (error) {
        console.error("Error al cargar los datos del nodo:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Confirmación antes de guardar
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Guardar los cambios
  const handleSave = async () => {
    try {
      console.log("Datos enviados:", formData);
      await axios.put("http://localhost:8000/usuarios/userp", formData);
      onUpdate(); // Actualizar la tabla
      console.log("despues del update")
      onClose(); // Cerrar el formulario
    } catch (error) {
      console.error("Error al actualizar el usuario:", error.response?.data || error.message);
      alert('Hubo un error al actualizar el usuario.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <h2>Modificar usuario</h2>
      <form>
        <TextField
          label="Nombre de usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {/* <TextField
          label="E-mail"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        /> */}
        <FormControl fullWidth margin="normal" >
          <InputLabel>Rol</InputLabel>
          <Select
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleRolChange}
          >
            <MenuItem value="administrador">Administrador</MenuItem>
            <MenuItem value="profesional">Profesional</MenuItem>
            <MenuItem value="invitado">Invitado</MenuItem>
          </Select> 
        </FormControl>

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
            ¿Estás seguro de que deseas guardar los cambios en este usuairo? Esta acción no se puede deshacer.
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

export default EditUserForm;


/* 
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
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  SelectChangeEvent } from "@mui/material";

interface EditUserFormProps {
  userId: number;
  onClose: () => void; // Callback para cerrar el formulario
  onUpdate: () => void; // Callback para actualizar la tabla después de guardar
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userId, onClose, onUpdate }) => {
  // Ajuste para usar tipos adecuados
  const [formData, setFormData] = useState({
    username: "", 
    // email: "", 
    rol: "",
    estado: true, // Booleano para cumplir con el esquema del backend
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleRolChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Cargar los datos actuales del nodo al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/usuarios/user`);
        const user = response.data;
        setFormData({
          username: user.username, 
          // email: user.email, 
          rol: user.rol || "",
          estado: user.estado || false,
        });
      } catch (error) {
        console.error("Error al cargar los datos del nodo:", error);
      }
    };

    fetchUserData();
  }, [userId]);

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
      await axios.put(`http://localhost:8000/users/${userId}`, formData);
      onUpdate(); // Actualizar la tabla
      onClose(); // Cerrar el formulario
    } catch (error) {
      console.error("Error al actualizar el usuario:", error.response?.data || error.message);
      alert("Hubo un error al actualizar el usuario.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <h2>Modificar usuario</h2>
      <form>
        <TextField
          label="Nombre de usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {/* <TextField
          label="E-mail"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        /> * /}
        <FormControl fullWidth margin="normal" >
          <InputLabel>Rol</InputLabel>
          <Select
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleRolChange}
          >
            <MenuItem value="administrador">Administrador</MenuItem>
            <MenuItem value="profesional">Profesional</MenuItem>
            <MenuItem value="invitado">Invitado</MenuItem>
          </Select> 
        </FormControl>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Guardar
          </Button>
        </Box>
      </form>

      {/* Diálogo de confirmación * /}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas guardar los cambios en este usuairo? Esta acción no se puede deshacer.
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

export default EditUserForm;
 */