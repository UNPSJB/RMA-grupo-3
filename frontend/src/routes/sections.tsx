import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const GraficosPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const NodosPage = lazy(() => import('src/pages/nodos'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />

    },
    { // Sign in
      path: '/login',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
      /* children: [
        { element:<SignInPage />, index: true },
      ] */
    },
    // paginas que cuentan con el dashboard: 
    {
      path: '/dashboard',
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [ // rutas hijas  
        // { path: 'home' },
        { element: <HomePage />, index:true },
        { path: 'graficos', element: <GraficosPage /> }, // blog
        { path: 'nodos', element: <NodosPage /> },
        { path: 'registro_historico', element: <HomePage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'configuracion', element: <HomePage /> },
      ],
    },

    { // página de error 404
      path: '404',
      element: <Page404 />,
    },
    { // redirección a 404 para rutas desconocidas
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ]);
}
