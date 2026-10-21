// Controlled sign-up form: one state object for all fields, validated on blur and on submit,
// then sent to the API. Server errors (like a taken email) are shown above the button.
import { useState } from 'react';
import { Mail, UserRound } from 'lucide-react';
import Input from './ui/Input.jsx';
import PasswordInput from './ui/PasswordInput.jsx';
import Button from './ui/Button.jsx';
import ErrorState from './ui/ErrorState.jsx';
import validateRegistration from '../utils/validateRegistration.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const emptyForm = { name: '', email: '', password: '' };

export default function RegistrationForm() {
  const [values, setValues] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { register } = useAuth();
  const toast = useToast();

  // Errors are derived from the values, so they can never disagree with what is typed.
  const errors = validateRegistration(values);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (Object.keys(errors).length > 0) return;
    setIsSaving(true);
    setServerError('');
    try {
      // On success AuthContext now has a user, and the page moves on.
      await register(values.name.trim(), values.email.trim(), values.password);
      toast.success('Account created. Welcome to CampusHub!');
    } catch (err) {
      setServerError(err.message);
      setIsSaving(false);
    }
  }

  // Only show an error once the user has left that field (or tried to submit).
  const visibleError = (field) => (touched[field] ? errors[field] : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Input
        id="register-name"
        name="name"
        label="Name"
        icon={UserRound}
        autoComplete="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={visibleError('name')}
      />
      <Input
        id="register-email"
        name="email"
        label="Email"
        type="email"
        icon={Mail}
        placeholder="you@campus.edu"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={visibleError('email')}
      />
      <PasswordInput
        id="register-password"
        name="password"
        label="Password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={visibleError('password')}
      />
      {serverError && (
        <ErrorState title="Could not create your account" message={serverError} />
      )}
      <Button type="submit" size="lg" isLoading={isSaving} className="w-full">
        {isSaving ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
