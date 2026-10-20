// A labelled multi-line text box with an accessible error message, like Input.
export default function Textarea({ id, label, error, ...textareaProps }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 aria-invalid:border-red-600 dark:border-slate-600 dark:bg-slate-800"
        {...textareaProps}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
