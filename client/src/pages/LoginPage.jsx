// Log-in page, with a link to sign up instead.
import { Link, useLocation } from 'react-router';
import LoginForm from '../components/LoginForm.jsx';

export default function LoginPage() {
  const location = useLocation();

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Log in
      </h1>
      <LoginForm />
      <p className="mt-6 text-slate-700 dark:text-slate-300">
        New here? {/* Pass the return path along, so signing up also sends you back. */}
        <Link
          to="/register"
          state={location.state}
          className="font-semibold text-brand-700 underline dark:text-brand-300"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
