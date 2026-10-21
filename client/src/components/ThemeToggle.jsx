// Icon button that switches between light and dark mode.
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import buttonStyles from './ui/buttonStyles.js';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label="Dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={buttonStyles({ variant: 'ghost', size: 'icon' })}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
