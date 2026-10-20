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

  async function logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      // Forget the user locally even if the request failed.
      setAccessToken(null);
      setUser(null);
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
