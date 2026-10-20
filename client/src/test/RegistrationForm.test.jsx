// The sign-up form: errors appear on blur and on submit, are linked to their inputs,
// a valid form is sent to the API, and server errors are shown.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from '../components/RegistrationForm.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

// A fake API: nobody is logged in yet, and sign-up answers with whatever the test chooses.
let registerResponse;
const jsonResponse = (status, body) => ({
  ok: status < 300,
  status,
  json: async () => body,
});

beforeEach(() => {
  registerResponse = jsonResponse(201, {
    user: { id: 'u1', name: 'Asha', email: 'asha@campus.edu', role: 'student' },
    accessToken: 'token-1',
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) =>
      url.endsWith('/auth/refresh')
        ? jsonResponse(401, {
            error: { code: 'SESSION_EXPIRED', message: 'Please log in again.' },
          })
        : registerResponse,
    ),
  );
});
afterEach(() => vi.unstubAllGlobals());

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

  async function fillValidForm(user) {
    await user.type(screen.getByLabelText('Name'), 'Asha');
    await user.type(screen.getByLabelText('Email'), 'asha@campus.edu');
    await user.type(screen.getByLabelText('Password'), 'longenough1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
  }

  it('sends a valid form to POST /auth/register', async () => {
    const user = renderForm();
    await fillValidForm(user);

    const call = fetch.mock.calls.find(([url]) => url.endsWith('/auth/register'));
    expect(JSON.parse(call[1].body)).toEqual({
      name: 'Asha',
      email: 'asha@campus.edu',
      password: 'longenough1',
    });
  });

  it('shows the server error when the email is taken', async () => {
    registerResponse = jsonResponse(409, {
      error: {
        code: 'EMAIL_TAKEN',
        message: 'An account with this email already exists.',
      },
    });
    const user = renderForm();
    await fillValidForm(user);

    expect(await screen.findByRole('alert')).toHaveTextContent('already exists');
  });
});
