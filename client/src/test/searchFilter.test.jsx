// The Events page sends the debounced search, category and page to the API and shows the result.
// fetch is replaced by a fake "server" that filters the fixtures, so no real API is needed.
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventsPage from '../pages/EventsPage.jsx';
import renderWithProviders from './renderWithProviders.jsx';
import { sampleEvents } from './fixtures.js';

function fakeApi(url) {
  if (url.includes('/auth/')) return { ok: false, status: 401, json: async () => ({}) };
  const params = new URL(url, 'http://test').searchParams;
  const q = (params.get('q') ?? '').toLowerCase();
  const data = sampleEvents.filter((e) => e.title.toLowerCase().includes(q));
  return {
    ok: true,
    json: async () => ({ data, page: 1, totalPages: 1, total: data.length }),
  };
}

const renderPage = (path = '/events') => renderWithProviders(<EventsPage />, { path });

describe('EventsPage search', () => {
  it('sends the debounced search to the API and shows the result', async () => {
    const fetchMock = vi.fn(async (url) => fakeApi(url));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findAllByRole('article')).toHaveLength(3);
    await user.type(screen.getByLabelText('Search'), 'football');

    // The search is debounced, so wait for the list to update instead of checking straight away.
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1));
    expect(screen.getByText('Football Final')).toBeInTheDocument();
    // Debouncing means one request for the whole word, not one per letter.
    const searches = fetchMock.mock.calls.filter(([url]) => url.includes('q='));
    expect(searches).toHaveLength(1);
    expect(searches[0][0]).toContain('q=football');
  });

  it('reads filters and page from the URL', async () => {
    const fetchMock = vi.fn(async (url) => fakeApi(url));
    vi.stubGlobal('fetch', fetchMock);
    renderPage('/events?category=tech&page=2');

    await screen.findAllByRole('article');
    const [eventsUrl] = fetchMock.mock.calls.find(([url]) => url.includes('/events?'));
    expect(eventsUrl).toContain('category=tech');
    expect(eventsUrl).toContain('page=2');
    expect(screen.getByLabelText('Category')).toHaveValue('tech');
  });
});
