// The sign-up form: errors appear on blur and on submit, are linked to their inputs, and a valid form signs in.
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from '../components/RegistrationForm.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

function renderForm() {
  render(
    <AuthProvider>
      <RegistrationForm />
    </AuthProvider>,
  );
  return userEvent.setup();
}

describe('RegistrationForm validation', () => {
  it('shows no errors before the user touches anything', () => {
    renderForm();
    expect(screen.queryByText(/must be|valid email/)).not.toBeInTheDocument();
  });

  it('shows an email error after leaving the field, linked with aria-describedby', async () => {
    const user = renderForm();
    const email = screen.getByLabelText('Email');
    await user.type(email, 'not-an-email');
    await user.tab();

    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Enter a valid email address.');
  });

  it('shows every error when submitting an empty form', async () => {
    const user = renderForm();
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Name must be 2 to 60 characters.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(
      screen.getByText('Password must be at least 8 characters.'),
    ).toBeInTheDocument();
  });

  it('signs the user in when the form is valid', async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText('Name'), 'Asha');
    await user.type(screen.getByLabelText('Email'), 'asha@campus.edu');
    await user.type(screen.getByLabelText('Password'), 'longenough1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByRole('status')).toHaveTextContent('Welcome, Asha!');
  });
});
