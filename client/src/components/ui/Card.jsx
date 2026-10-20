// White rounded box used for event cards, club cards and detail panels.
export default function Card({ className = '', children }) {
  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </article>
  );
}
