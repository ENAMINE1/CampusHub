// Sign-up page, with a link to log in instead.
import { Link, useLocation } from 'react-router';
import RegistrationForm from '../components/RegistrationForm.jsx';

export default function RegisterPage() {
  const location = useLocation();

  return (
    <>
      <h1 className="text-3xl font-bold">Join CampusHub</h1>
      <p className="mt-2 mb-8 text-ink-muted">
        Create a free student account in under a minute.
      </p>
      <RegistrationForm />
      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          state={location.state}
          className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
