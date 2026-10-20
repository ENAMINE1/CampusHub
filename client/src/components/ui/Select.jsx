// A labelled dropdown. Pass the <option> elements as children.
export default function Select({ id, label, children, ...selectProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 capitalize"
        {...selectProps}
      >
        {children}
      </select>
    </div>
  );
}
