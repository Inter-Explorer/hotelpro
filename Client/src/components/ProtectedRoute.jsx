import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Wrap a page with this to block people who should not see it.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.userType !== 'admin') return <Navigate to="/rooms" replace />;
  return children;
}
