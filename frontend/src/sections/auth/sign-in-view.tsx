import { useState, useCallback } from 'react'
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate, Outlet } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';

// import Fab from '@mui/material/Fab';

export function SignInView() {
  const navigate = useNavigate ();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); // para msjs de errores

  const handleSignIn = useCallback(async () => {
    if (!username || !password) {
      setError("Nombre de usuario y contraseña son requeridos.");
      return;
    }

    setLoading(true);
    setError(null); 

    try {
      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        navigate('/dashboard');  
      } else {
        setError("Nombre de usuario o contraseña incorrecto.");
      }
    } catch (fetchError) {
      console.error("Error al iniciar sesión:", error);
      setError("Hubo un problema al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [username, password, navigate]);

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Inicio de sesión</Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        {error && ( // Mostrar mensaje de error si existe
          <Box
            sx={{
              mb: 2,
              alignSelf: 'flex-start',
              padding: 1,
              border: '1px solid orange',
              backgroundColor: 'red',
              borderRadius: 1,
            }}
          >
            <Typography 
              sx={{
                color:"black",
                fontWeight: 'bold',
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          name="username"
          label="Nombre de usuario"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          ¿Has olvidado tu contraseña?
        </Link>

        <TextField
          fullWidth
          name="password"
          label="Contraseña"
          placeholder="ejemplo.1234"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="button"
          color="inherit"
          variant="contained"
          onClick={handleSignIn}
          loading={loading}
        >
          Iniciar sesión
        </LoadingButton>
      </Box>
    
    </>
  );
}


/* import { useState, useCallback } from 'react'
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate, Outlet } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';

// import Fab from '@mui/material/Fab';

export function SignInView() {
  const navigate = useNavigate ();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleSignIn = useCallback(async () => {
    if (!username || !password) {
      alert("Nombre de usuario y contraseña son requeridos.")
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        navigate('/dashboard'); // ver si borrar 
      } else {
        alert("Nombre de usuario o contraseña incorrecto.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  }, [username, password, navigate]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end" >
      <TextField
        fullWidth
        name="username"
        label="Nombre de usuario"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        ¿Has olvidado tu contraseña?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        placeholder="ejemplo.1234"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="button"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        loading={loading}
      >
        Iniciar sesión
      </LoadingButton>
    </Box>
  );
  //
  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Inicio de sesión</Typography>
      </Box>

      {renderForm}
    </>
  );
}
 */