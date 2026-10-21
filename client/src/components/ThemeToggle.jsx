// Icon button that switches between light and dark mode. The icon spins in as it swaps.
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
      className={`${buttonStyles({ variant: 'ghost', size: 'icon' })} overflow-hidden`}
    >
      {/* key: a new element each time, so the entrance animation plays on every switch. */}
      <Icon key={theme} aria-hidden="true" className="animate-spin-in" />
    </button>
  );
}
