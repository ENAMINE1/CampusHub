// Site header: logo link and the main navigation. NavLink highlights the page you are on.
import { Link, NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle.jsx';

const linkClass = ({ isActive }) =>
  `rounded px-2 py-1 hover:underline ${isActive ? 'bg-white/20 underline' : ''}`;

export default function Header() {
  return (
    <header className="bg-brand-700 text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-4">
        <Link to="/" className="text-xl font-bold">
          CampusHub
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-2 text-sm font-medium">
            <li>
              <NavLink to="/events" className={linkClass}>
                Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/clubs" className={linkClass}>
                Clubs
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
