// Who is signed in, shared through Context. For now the user lives only in memory;
// Video 63 connects login, logout and refresh to the real API.
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(newUser) {
    setUser(newUser);
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
