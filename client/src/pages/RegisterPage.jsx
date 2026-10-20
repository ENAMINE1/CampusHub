// Sign-up page. The form only validates for now; it talks to the API in a later video.
import RegistrationForm from '../components/RegistrationForm.jsx';

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Join CampusHub
      </h1>
      <RegistrationForm />
    </>
  );
}
