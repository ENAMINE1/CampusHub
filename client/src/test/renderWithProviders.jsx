// Renders a component inside the same providers the app uses (router, auth, favorites),
// so tests do not repeat this wrapper everywhere.
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../context/AuthContext.jsx';
import { FavoritesProvider } from '../context/FavoritesContext.jsx';

export default function renderWithProviders(ui, { path = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <FavoritesProvider>{ui}</FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
