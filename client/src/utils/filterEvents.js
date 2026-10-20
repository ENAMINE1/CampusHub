// Returns the events whose title contains `search` (any case) and whose category matches (empty = all).
export default function filterEvents(events, search, category) {
  const query = search.trim().toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(query) &&
      (category === '' || event.category === category),
  );
}
