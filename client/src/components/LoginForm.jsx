// Log-in form. The server answers wrong email and wrong password with the same message on purpose.
import { useState } from 'react';
import Input from './ui/Input.jsx';
import Button from './ui/Button.jsx';
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
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
      <Input
        id="login-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
      />
      <Input
        id="login-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
      />
      {error && (
        <p role="alert" className="text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  );
}
