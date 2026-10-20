// EventCard shows an event's details, its seats left, and a "Full" badge when there are none.
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import EventCard from '../components/EventCard.jsx';
import { FavoritesProvider } from '../context/FavoritesContext.jsx';
import { gitWorkshop, hackNight } from './fixtures.js';

// EventCard uses <Link> (needs a router) and FavoriteButton (needs FavoritesContext).
function renderCard(event) {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <EventCard event={event} />
      </FavoritesProvider>
    </MemoryRouter>,
  );
}

describe('EventCard', () => {
  it('shows the title as a link to the details page', () => {
    renderCard(gitWorkshop);
    expect(screen.getByRole('link', { name: 'Intro to Git Workshop' })).toHaveAttribute(
      'href',
      '/events/evt-1',
    );
  });

  it('shows how many seats are left', () => {
    renderCard(gitWorkshop);
    expect(screen.getByText('12 seats left')).toBeInTheDocument();
  });

  it('shows Full when every seat is taken', () => {
    renderCard(hackNight);
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('toggles the favorite button', async () => {
    const user = userEvent.setup();
    renderCard(gitWorkshop);
    const heart = screen.getByRole('button', { name: 'Favorite Intro to Git Workshop' });
    expect(heart).toHaveAttribute('aria-pressed', 'false');
    await user.click(heart);
    expect(heart).toHaveAttribute('aria-pressed', 'true');
  });
});
