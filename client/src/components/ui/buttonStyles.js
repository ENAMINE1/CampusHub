// Class names for buttons, shared by <Button> and by links that should look like buttons
// (a <Link> to another page must stay a link for screen readers, even when styled as a button).
// Every variant answers the pointer: a lift on hover, a small press on click.
const base =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl ' +
  'font-semibold whitespace-nowrap select-none transition duration-200 ease-out ' +
  'active:translate-y-0 active:scale-[0.97] active:duration-75 ' +
  'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0';

// The primary button gets a light sweep across it on hover (the ::after layer), a subtle cue
// that it is the main action on the page.
const shine =
  'after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r ' +
  'after:from-transparent after:via-white/20 after:to-transparent after:transition-transform ' +
  'after:duration-700 hover:after:translate-x-full';

const variants = {
  primary:
    `bg-brand-600 text-white shadow-sm shadow-brand-700/25 hover:-translate-y-px ` +
    `hover:bg-brand-700 hover:shadow-md hover:shadow-brand-700/30 ` +
    `dark:bg-brand-500 dark:hover:bg-brand-600 ${shine}`,
  secondary:
    'border border-line bg-surface text-ink shadow-card hover:-translate-y-px ' +
    'hover:border-brand-300 hover:bg-surface-muted dark:hover:border-brand-500/40',
  ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  danger:
    'bg-red-600 text-white shadow-sm shadow-red-700/25 hover:-translate-y-px hover:bg-red-700 ' +
    'hover:shadow-md',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'size-10',
};

export default function buttonStyles({ variant = 'primary', size = 'md' } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}
