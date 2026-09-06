import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isConfigured, user, loading } = useAuth();

  if (!isConfigured) return <>{children}</>;
  if (loading) return <div className="page-loading">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
