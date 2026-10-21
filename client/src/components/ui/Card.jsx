// The surface used for cards and panels. `interactive` adds a gentle lift on hover, for cards
// that act as one big link.
const lift =
  'transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift ' +
  'dark:hover:border-brand-500/50';

export default function Card({
  as: Tag = 'article',
  interactive,
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      {...props}
      className={`rounded-2xl border border-line bg-surface p-5 shadow-card ${interactive ? lift : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
