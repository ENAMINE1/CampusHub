// Favorite event ids shared through Context, so every page and card sees the same list.
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('campushub:favorites', []);

  function isFavorite(id) {
    return favorites.includes(id);
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favId) => favId !== id) : [...current, id],
    );
  }

  return (
    <FavoritesContext value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
