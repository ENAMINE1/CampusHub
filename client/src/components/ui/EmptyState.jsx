// Friendly message shown when a list has no items.
export default function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-slate-600">{message}</p>
    </div>
  );
}
