// Entry point: mounts the React app into <div id="root"> in index.html.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { RegistrationsProvider } from './context/RegistrationsContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter keeps the UI in sync with the address bar. */}
    <BrowserRouter>
      {/* Providers wrap the whole app, so any component below can read their values. */}
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <RegistrationsProvider>
              <App />
            </RegistrationsProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
