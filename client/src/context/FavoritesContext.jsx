// Favorite event ids shared through Context (SPEC.md FR-5.3).
// Guests keep favorites in localStorage. Logged-in users keep them on the server, and on login
// any guest favorites are merged into the account, then cleared locally.
import { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useAuth } from './AuthContext.jsx';
import { apiFetch } from '../api/client.js';

const FavoritesContext = createContext(null);

const toggled = (ids, id) =>
  ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [guestFavorites, setGuestFavorites] = useLocalStorage('campushub:favorites', []);
  // Which user the server list belongs to, so one account never shows another's favorites.
  const [server, setServer] = useState({ userId: null, ids: [] });

  useEffect(() => {
    if (!user) return;
    const merge = guestFavorites.map((id) =>
      apiFetch(`/me/favorites/${id}`, { method: 'PUT' }).catch(() => {}),
    );
    Promise.all(merge)
      .then(() => apiFetch('/me/favorites'))
      .then((events) => {
        setServer({ userId: user.id, ids: events.map((e) => e.id) });
        // Only clear when there was something to merge, or this effect would run forever.
        if (guestFavorites.length > 0) setGuestFavorites([]);
      })
      .catch(() => setServer({ userId: user.id, ids: [] }));
  }, [user, guestFavorites, setGuestFavorites]);

  const favorites = user ? (server.userId === user.id ? server.ids : []) : guestFavorites;

  function toggleFavorite(id) {
    if (!user) {
      setGuestFavorites((current) => toggled(current, id));
      return;
    }
    // Optimistic update: change the heart now, undo it if the server says no.
    const wasFavorite = favorites.includes(id);
    setServer((s) => ({ ...s, ids: toggled(s.ids, id) }));
    apiFetch(`/me/favorites/${id}`, { method: wasFavorite ? 'DELETE' : 'PUT' }).catch(
      () => setServer((s) => ({ ...s, ids: toggled(s.ids, id) })),
    );
  }

  const isFavorite = (id) => favorites.includes(id);

  return (
    <FavoritesContext value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
