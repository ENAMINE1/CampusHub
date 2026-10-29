// The main navigation links, filtered by role. Used by the desktop bar and the mobile menu.
import { NavLink } from 'react-router';
import {
  CalendarDays,
  Heart,
  House,
  LayoutDashboard,
  Shield,
  Ticket,
  UsersRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/clubs', label: 'Clubs', icon: UsersRound },
  {
    to: '/me/registrations',
    label: 'My registrations',
    icon: Ticket,
    roles: ['student'],
  },
  { to: '/me/favorites', label: 'Favorites', icon: Heart, roles: ['student'] },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['clubAdmin', 'admin'],
  },
  { to: '/admin', label: 'Admin', icon: Shield, roles: ['admin'] },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
      : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
  }`;

export default function NavLinks({ className = '', onNavigate }) {
  const { user } = useAuth();
  const visible = LINKS.filter((link) => !link.roles || link.roles.includes(user?.role));

  return (
    <ul className={className}>
      {visible.map(({ to, label, icon: Icon, end }) => (
        <li key={to}>
          <NavLink to={to} end={end} className={linkClass} onClick={onNavigate}>
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
