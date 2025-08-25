import { Navigate } from 'react-router-dom';
import { useAuth } from './../store';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading, profile } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Don't redirect yet
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
