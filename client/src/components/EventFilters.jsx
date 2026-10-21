// Search box, category and sort dropdowns. The parent owns the values; this component only
// reports changes through onChange(name, value).
import { Search } from 'lucide-react';
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import categories from '../data/categories.js';

export default function EventFilters({ search, category, sort, onChange }) {
  return (
    <div
      role="search"
      className="mb-8 grid gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card sm:grid-cols-[1fr_12rem_10rem]"
    >
      <Input
        id="event-search"
        label="Search"
        type="search"
        icon={Search}
        value={search}
        onChange={(e) => onChange('q', e.target.value)}
        placeholder="Search titles and descriptions"
      />
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
