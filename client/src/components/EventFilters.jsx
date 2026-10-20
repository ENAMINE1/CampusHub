// Search box and category dropdown. The parent owns the values; this component only reports changes.
import categories from '../data/categories.js';

export default function EventFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <label className="flex-1">
        <span className="mb-1 block text-sm font-medium text-slate-700">Search</span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
        />
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 capitalize sm:w-48"
        >
          <option value="">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
