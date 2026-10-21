// Log-in page, with a link to sign up instead.
import { Link, useLocation } from 'react-router';
import LoginForm from '../components/LoginForm.jsx';

export default function LoginPage() {
  const location = useLocation();

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 mb-8 text-ink-muted">Log in to see what is on this week.</p>
      <LoginForm />
      <p className="mt-8 text-center text-sm text-ink-muted">
        New here? {/* Pass the return path along, so signing up also sends you back. */}
        <Link
          to="/register"
          state={location.state}
          className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
