// Controlled sign-up form: one state object for all fields, validated on blur and on submit.
import { useState } from 'react';
import FormField from './FormField.jsx';
import validateRegistration from '../utils/validateRegistration.js';

const emptyForm = { name: '', email: '', password: '' };

export default function RegistrationForm() {
  const [values, setValues] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [submittedName, setSubmittedName] = useState('');

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
    setSubmittedName(values.name.trim());
    setValues(emptyForm);
    setTouched({});
  }

  // Only show an error once the user has left that field (or tried to submit).
  const visibleError = (field) => (touched[field] ? errors[field] : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
      <FormField
        id="register-name"
        name="name"
        label="Name"
        autoComplete="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={visibleError('name')}
      />
      <FormField
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
      <FormField
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
      <button
        type="submit"
        className="rounded-lg bg-brand-700 px-4 py-2 font-semibold text-white hover:bg-brand-600"
      >
        Create account
      </button>
      {submittedName && (
        <p role="status" className="text-green-800">
          Thanks, {submittedName}! Your account form is valid.
        </p>
      )}
    </form>
  );
}
