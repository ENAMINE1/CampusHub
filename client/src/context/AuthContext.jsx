// Who is signed in, shared through Context, backed by the API.
// On every page load we try a silent refresh: if the httpOnly cookie is still valid, the user
// stays logged in without typing their password again (SPEC.md FR-1.4).
import { createContext, useContext, useEffect, useState } from 'react';
import {
  apiFetch,
  refreshSession,
  setAccessToken,
  setSessionExpiredHandler,
} from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 'checking' until the silent refresh answers, so protected pages do not redirect too early.
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    refreshSession()
      .then((session) => setUser(session.user))
      .catch(() => setUser(null)) // no cookie or an expired one: simply logged out
      .finally(() => setStatus('ready'));
  }, []);

  async function startSession(path, body) {
    const session = await apiFetch(path, { method: 'POST', body });
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session.user;
  }

  const login = (email, password) => startSession('/auth/login', { email, password });
  const register = (name, email, password) =>
    startSession('/auth/register', { name, email, password });

  // Logging out reloads the app on a clean login page instead of clearing the user in React.
  // Clearing it would make ProtectedRoute remember the current page and send the next person
  // who logs in on this device there; the reload also wipes everything held in memory.
  async function logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
      window.history.replaceState(null, '', '/login');
      window.location.reload();
    }
  }

  return (
    <AuthContext value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
