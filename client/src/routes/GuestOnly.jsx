// Wraps pages only logged-out visitors need (login, sign-up). Once logged in, go back to where
// the visitor came from (ProtectedRoute stores it), or home.
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/ui/Spinner.jsx';

export default function GuestOnly({ children }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'checking') return <Spinner label="Checking your session…" />;
  if (user) return <Navigate to={location.state?.from ?? '/'} replace />;
  return children;
}
