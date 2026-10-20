// Checks the sign-up form values against SPEC.md FR-1.1 and returns { fieldName: message } for each problem.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function validateRegistration(values) {
  const errors = {};
  const name = values.name.trim();

  if (name.length < 2 || name.length > 60) {
    errors.name = 'Name must be 2 to 60 characters.';
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
}
