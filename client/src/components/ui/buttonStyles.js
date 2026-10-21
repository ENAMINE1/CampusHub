// Class names for buttons, shared by <Button> and by links that should look like buttons
// (a <Link> to another page must stay a link for screen readers, even when styled as a button).
const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap ' +
  'transition duration-150 select-none active:scale-[0.98] ' +
  'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0';

const variants = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-700/20 hover:bg-brand-700 ' +
    'dark:bg-brand-500 dark:hover:bg-brand-600',
  secondary: 'border border-line bg-surface text-ink shadow-card hover:bg-surface-muted',
  ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  danger: 'bg-red-600 text-white hover:bg-red-700',
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
