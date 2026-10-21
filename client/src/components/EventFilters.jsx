// Search box, category and sort dropdowns. The parent owns the values; this component only
// reports changes through onChange(name, value).
// Press "/" anywhere on the page to jump to the search box, as on many sites people already use.
import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import categories from '../data/categories.js';

function isTyping(target) {
  return (
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
  );
}

export default function EventFilters({ search, category, sort, onChange }) {
  const searchRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key !== '/' || isTyping(e.target)) return;
      e.preventDefault(); // otherwise the "/" would be typed into the box
      searchRef.current?.querySelector('input')?.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      role="search"
      className="mb-6 grid gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card sm:grid-cols-[1fr_12rem_10rem]"
    >
      <div ref={searchRef}>
        <Input
          id="event-search"
          label="Search"
          type="search"
          icon={Search}
          value={search}
          onChange={(e) => onChange('q', e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onChange('q', '')}
          placeholder="Search titles and descriptions"
          className="[&_input::-webkit-search-cancel-button]:hidden"
          trailing={
            search ? (
              <button
                type="button"
                onClick={() => onChange('q', '')}
                aria-label="Clear search"
                className="grid size-8 animate-fade place-items-center rounded-lg text-ink-muted transition hover:bg-surface-muted hover:text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <kbd
                className="mr-1 hidden rounded-md border border-line bg-surface-muted px-1.5 py-0.5 font-sans text-xs text-ink-muted sm:block"
                title="Press / to search"
              >
                /
              </kbd>
            )
          }
        />
      </div>
      <Select
        id="event-category"
        label="Category"
        value={category}
        onChange={(e) => onChange('category', e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>
      <Select
        id="event-sort"
        label="Sort by"
        value={sort}
        onChange={(e) => onChange('sort', e.target.value)}
      >
        <option value="date">Date</option>
        <option value="title">Title</option>
      </Select>
    </div>
  );
}
