import { Navigate, Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps { 
  isAuthenticated: boolean; 
  children: ReactNode;
}
  
export function ProtectedRoute ({ isAuthenticated, children }: ProtectedRouteProps) {
    
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}