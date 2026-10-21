// Log-in form. The server answers wrong email and wrong password with the same message on purpose.
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import Input from './ui/Input.jsx';
import Button from './ui/Button.jsx';
import ErrorState from './ui/ErrorState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { login } = useAuth();

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!values.email.trim() || !values.password) {
      setError('Enter your email and password.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await login(values.email.trim(), values.password);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Input
        id="login-email"
        name="email"
        label="Email"
        type="email"
        icon={Mail}
        placeholder="you@campus.edu"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
      />
      <Input
        id="login-password"
        name="password"
        label="Password"
        type="password"
        icon={Lock}
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
      />
      {error && <ErrorState title="Could not log in" message={error} />}
      <Button type="submit" size="lg" isLoading={isSaving} className="w-full">
        {isSaving ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  );
}
