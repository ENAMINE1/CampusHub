// Site header: logo link, main navigation, theme toggle and who is signed in.
import { Link, NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `rounded px-2 py-1 hover:underline ${isActive ? 'bg-white/20 underline' : ''}`;

export default function Header() {
  const { user, logout } = useAuth();

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
            {user?.role === 'student' && (
              <li>
                <NavLink to="/me/registrations" className={linkClass}>
                  My registrations
                </NavLink>
              </li>
            )}
            {(user?.role === 'clubAdmin' || user?.role === 'admin') && (
              <li>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
              </li>
            )}
            {!user && (
              <li>
                <NavLink to="/login" className={linkClass}>
                  Log in
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {user && (
            <>
              <span>Hi, {user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded px-2 py-1 font-medium hover:bg-white/20"
              >
                Log out
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
