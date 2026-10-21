// Who is signed in (initial, name and role) and the log-out button.
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import buttonStyles from './ui/buttonStyles.js';

const ROLE_LABELS = { student: 'Student', clubAdmin: 'Club admin', admin: 'Admin' };

export default function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2.5 sm:flex">
        <span
          className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white"
          aria-hidden="true"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="leading-tight">
          <p className="max-w-[10rem] truncate text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-ink-muted">{ROLE_LABELS[user.role]}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={logout}
        aria-label="Log out"
        title="Log out"
        className={buttonStyles({ variant: 'ghost', size: 'icon' })}
      >
        <LogOut aria-hidden="true" />
      </button>
    </div>
  );
}
