// The search filter: first the pure function, then the real Events page with a stubbed fetch.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import EventsPage from '../pages/EventsPage.jsx';
import { FavoritesProvider } from '../context/FavoritesContext.jsx';
import filterEvents from '../utils/filterEvents.js';
import { sampleEvents } from './fixtures.js';

describe('filterEvents', () => {
  it('matches titles without caring about case or spaces', () => {
    const titles = filterEvents(sampleEvents, '  HACK ', '').map((e) => e.title);
    expect(titles).toEqual(['Hack Night']);
  });

  it('filters by category', () => {
    expect(filterEvents(sampleEvents, '', 'sports')).toHaveLength(1);
  });

  it('returns everything for an empty search and category', () => {
    expect(filterEvents(sampleEvents, '', '')).toHaveLength(3);
  });
});

describe('EventsPage search', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('narrows the list after typing in the search box', async () => {
    // Replace the network with a fake fetch that returns our fixtures.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => sampleEvents })),
    );
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/events']}>
        <FavoritesProvider>
          <EventsPage />
        </FavoritesProvider>
      </MemoryRouter>,
    );

    expect(await screen.findAllByRole('article')).toHaveLength(3);
    await user.type(screen.getByLabelText('Search'), 'football');

    // The search is debounced, so wait for the list to update instead of checking straight away.
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1));
    expect(screen.getByText('Football Final')).toBeInTheDocument();
  });
});
