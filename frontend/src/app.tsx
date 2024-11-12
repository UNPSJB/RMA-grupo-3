import 'src/global.css';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';

// ----------------------------------------------------------------------

export default function App() {

  useScrollToTop();
  
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>

  );
}

// ---------------------------------------------------------------------
/* import 'src/global.css';
import Fab from '@mui/material/Fab';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { useState, useEffect } from "react"
// import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function App() {

  const [books, setBooks] = useState([]) // 
  const getBooks = async () => {
    const login = await fetch("http://localhost:8000/token")
  }

  useEffect(() => {
    getBooks() 
  })

  useScrollToTop();
  return (
    <ThemeProvider>
      <Router />
      {}
    </ThemeProvider>
  );
} */

/* esto iba de bajo del useScrollToTop();
  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://homers-webpage.vercel.app/"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );
*/