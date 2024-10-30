import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useNavigate  } from 'react-router-dom';

import { Iconify } from 'src/components/iconify';

import Fab from '@mui/material/Fab';


export function SignInView() {
  const navigate = useNavigate ();

  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = useCallback(() => {
    navigate('/home'); // (blog = graficos) 
  }, [navigate]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end" >
      <TextField
        fullWidth
        name="email"
        label="Dirección de correo"
        defaultValue="ejemplo@gmail.com"
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
        defaultValue="@ejemplo.1234"
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
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Iniciar sesión
      </LoadingButton>

      
    </Box>
    
  );
  //
  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Iniciar sesión</Typography>
        <Typography variant="body2" color="text.secondary">
        {/* ¿No tienes una cuenta? */}
          {/* <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Registrar usuario nuevo
          </Link> */}
          {/* <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="contained"
            onClick={handleSignIn}
          >
            Registrar usuario nuevo
          </LoadingButton> */}
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          O
        </Typography>
      </Divider>

    {/* <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Registrar usuario nuevo
      </LoadingButton> */}
      <Box display="flex" justifyContent="center">
        <LoadingButton 
          size="medium" // Cambiar el tamaño a "medium" o "small" según preferencia
          type="submit"
          color="inherit" // usa un color predefinido como "primary" o "secondary"
          variant="contained"
          content="center"
          onClick={handleSignIn}
          sx={{
            width: '200px',           // Ajusta el ancho 
            backgroundColor: '#1976d2', // Cambiar a color deseado (este caso azul)
            '&:hover': {
              backgroundColor: '#115293', // Color al pasar el ratón por encima
            },
          }}
        >
          Registrar usuario nuevo
        </LoadingButton>
      </Box>
      {/* <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Fab href="https://google.com/">
            <Iconify icon="logos:google-icon" />
          </Fab>
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Fab href="https://homers-webpage.vercel.app/">
            <Iconify icon="ri:twitter-x-fill" />
          </Fab>
        </IconButton>
      </Box> */}
    </>
  );
}
