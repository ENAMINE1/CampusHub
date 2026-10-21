// Shows its page only to logged-in users (with an allowed role, if `roles` is given); others go
// to /login, which sends them back here afterwards. Wrapped around the whole signed-in layout,
// it means a signed-out visitor sees nothing but the login and sign-up pages.
// This only hides UI: the server checks every request itself.
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

export default function ProtectedRoute({ roles, children }) {
  const { user, status } = useAuth();
  const location = useLocation();

  // Wait for the silent refresh, or a logged-in user would be bounced to /login on reload.
  if (status === 'checking') {
    return <Spinner label="Checking your session…" className="min-h-[60vh]" />;
  }
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <ErrorState
        title="No access"
        message="Your account does not have access to this page."
      />
    );
  }
  return children;
}
