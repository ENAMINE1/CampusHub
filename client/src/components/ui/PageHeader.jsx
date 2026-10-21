// The top of every page: a small eyebrow, the page title (the one <h1>), a line of context and
// optional actions on the right. One component keeps the hierarchy identical on every page.
export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-rise">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-wider text-brand-600 uppercase dark:text-brand-300">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
