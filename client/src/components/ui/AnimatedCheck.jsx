// A circled tick whose stroke draws itself in, for "done" moments. Decorative: hidden from
// screen readers, the text next to it says what happened.
export default function AnimatedCheck({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" className="opacity-30" />
      <path d="m8 12 3 3 5-6" strokeDasharray="24" className="animate-draw" />
    </svg>
  );
}
