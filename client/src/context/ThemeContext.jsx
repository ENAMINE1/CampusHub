// Light/dark theme shared through Context, so any component can read or toggle it without prop drilling.
import { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const ThemeContext = createContext(null);

// First visit: follow the operating system setting. After that, remember the user's choice.
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('campushub:theme', systemTheme);

  // Tailwind's dark: classes look for a "dark" class on <html> (see @custom-variant in index.css).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
