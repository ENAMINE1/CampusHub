// Button in the header that switches between light and dark mode.
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      className="rounded px-2 py-1 text-sm font-medium hover:bg-white/20"
    >
      {isDark ? '☀ Light' : '☾ Dark'}
      <span className="sr-only"> mode</span>
    </button>
  );
}
