import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

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
export const RegistroPage = lazy(() => import('src/pages/registro'));

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
      path:'/',
      element: <Navigate to = "/login" replace />
    },

    {
      // Sign in
      path: '/login',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
      children: [
        { element:<SignInPage />, path: '/login' , index: true },
      ]
    },
    {
      path: '/dashboard',
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'nodos', element: <NodosPage /> },
        { path: 'graficos', element: <GraficosPage /> }, // blog
        { path: 'home', element: <HomePage /> },
        { path: 'registros_historicos', element: <RegistroPage /> },
        { path: 'configuracion', element: <HomePage /> },
      ],
    },

    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ]);
}
