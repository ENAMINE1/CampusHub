// Search box and category dropdown. The parent owns the values; this component only reports changes.
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import categories from '../data/categories.js';

export default function EventFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_12rem]">
      <Input
        id="event-search"
        label="Search"
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by title"
      />
      <Select
        id="event-category"
        label="Category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </div>
  );
}
