import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}



export default function AdminRoute({ children }: Props) {
  const { user, isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return null; // or loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 2) {
    return <Navigate to="/" replace />;
  }

  return children;
}
