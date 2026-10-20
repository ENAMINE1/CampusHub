// Sign-up page, with a link to log in instead.
import { Link, useLocation } from 'react-router';
import RegistrationForm from '../components/RegistrationForm.jsx';

export default function RegisterPage() {
  const location = useLocation();

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Join CampusHub
      </h1>
      <RegistrationForm />
      <p className="mt-6 text-slate-700 dark:text-slate-300">
        Already have an account?{' '}
        <Link
          to="/login"
          state={location.state}
          className="font-semibold text-brand-700 underline dark:text-brand-300"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
