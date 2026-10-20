// Error message box. role="alert" makes screen readers read it out straight away.
export default function ErrorState({ message }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-5 text-red-900 dark:text-red-200"
    >
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
