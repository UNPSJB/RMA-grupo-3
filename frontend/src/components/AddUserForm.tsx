import React, { useState } from "react";
import { Box, 
        TextField, 
        Button, 
        Typography, 
        MenuItem, 
        Select, 
        FormControl, 
        InputLabel,
        SelectChangeEvent } from "@mui/material";
import axios from "axios";
/* import {toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; */

interface AddUserFormProps {
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    /* email: "", */
    rol: "", 
    password: "",  
  });
  
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRolChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(formData);
      await axios.post("http://localhost:8000/usuarios/user/", {
        user: formData.username,
        /* email: formData(formData.email), */
        rol: formData.rol, 
        password: formData.password, 
      });
      alert("Usuario agregado exitosamente.");
      onCancel(); // Vuelve a la tabla de usuarios
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      alert("Ocurrió un error al agregar el usuario.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Registrar usuario nuevo
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* <TextField
          label="ID"
          name="id"
          value={formData.id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />  */}
        <TextField
          label="Nombre de usuario"
          name="username"
          value={formData.username}
          onChange={handleUserNameChange}
          fullWidth
          margin="normal"
          required
        />
        {/* <TextField
           label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required 
        /> */} 
        <FormControl fullWidth margin="normal" required>
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

        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
          required
        />  
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Guardar Usuario
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
      {/* <ToastContainer /> */}
    </Box>
  );
};

export default AddUserForm;
