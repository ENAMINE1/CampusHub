// Controlled sign-up form: one state object for all fields, validated on blur and on submit.
import { useState } from 'react';
import Input from './ui/Input.jsx';
import Button from './ui/Button.jsx';
import validateRegistration from '../utils/validateRegistration.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = { name: '', email: '', password: '' };

export default function RegistrationForm() {
  const [values, setValues] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const { user, login } = useAuth();

  // Errors are derived from the values, so they can never disagree with what is typed.
  const errors = validateRegistration(values);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (Object.keys(errors).length > 0) return;
    // No server yet: signing in just stores the user in AuthContext.
    login({ name: values.name.trim(), email: values.email.trim() });
    setValues(emptyForm);
    setTouched({});
  }

  // Only show an error once the user has left that field (or tried to submit).
  const visibleError = (field) => (touched[field] ? errors[field] : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
      <Input
        id="register-name"
        name="name"
        label="Name"
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
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={visibleError('email')}
      />
      <Input
        id="register-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={visibleError('password')}
      />
      <Button type="submit">Create account</Button>
      {user && (
        <p role="status" className="text-green-800 dark:text-green-300">
          Welcome, {user.name}! You are signed in.
        </p>
      )}
    </form>
  );
}
