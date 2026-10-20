// Shares the logged-in student's registrations. The list is loaded from GET /me/registrations
// whenever a student logs in, then kept up to date with useReducer actions.
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import {
  initialRegistrations,
  registrationsReducer,
} from '../features/registrations/registrationsReducer.js';
import { useAuth } from './AuthContext.jsx';
import { apiFetch } from '../api/client.js';

const RegistrationsContext = createContext(null);

export function RegistrationsProvider({ children }) {
  const { user } = useAuth();
  const [registrations, dispatch] = useReducer(
    registrationsReducer,
    initialRegistrations,
  );
  // Which user the loaded list belongs to, so another account never sees a stale list.
  const [loaded, setLoaded] = useState({ userId: null, error: '' });
  const isStudent = user?.role === 'student';

  useEffect(() => {
    if (!isStudent) return;
    apiFetch('/me/registrations')
      .then((list) => {
        dispatch({ type: 'loaded', registrations: list });
        setLoaded({ userId: user.id, error: '' });
      })
      .catch((err) => setLoaded({ userId: user.id, error: err.message }));
  }, [isStudent, user?.id]);

  const isCurrent = isStudent && loaded.userId === user.id;
  const value = {
    registrations: isCurrent ? registrations : [],
    isLoading: isStudent && !isCurrent,
    error: isCurrent ? loaded.error : '',
    dispatch,
    isRegistered: (eventId) =>
      isCurrent &&
      registrations.some((r) => r.eventId === eventId && r.status === 'registered'),
  };

  return <RegistrationsContext value={value}>{children}</RegistrationsContext>;
}

export function useRegistrations() {
  return useContext(RegistrationsContext);
}
