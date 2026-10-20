// One event as a card. The details are hard-coded for now; the next video passes them in as props.
export default function EventCard() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">tech</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">Intro to Git Workshop</h2>
      <p className="mt-2 text-sm text-slate-600">
        Learn commits, branches and pull requests in one friendly hour.
      </p>
      <dl className="mt-4 space-y-1 text-sm text-slate-700">
        <div>
          <dt className="inline font-medium">When: </dt>
          <dd className="inline">Mon, 10 Nov, 4:00 PM</dd>
        </div>
        <div>
          <dt className="inline font-medium">Where: </dt>
          <dd className="inline">Lab 2, CS Block</dd>
        </div>
        <div>
          <dt className="inline font-medium">Seats left: </dt>
          <dd className="inline">12</dd>
        </div>
      </dl>
    </article>
  );
}
