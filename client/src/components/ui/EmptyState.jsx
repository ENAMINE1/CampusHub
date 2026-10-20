// Friendly message shown when a list has no items.
export default function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-8 text-center">
      <p className="text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );
}
