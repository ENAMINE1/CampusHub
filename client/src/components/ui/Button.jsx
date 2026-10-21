// Button with variants (primary, secondary, ghost, danger), sizes, and a loading state that
// shows a spinner and blocks double submits. Other props (onClick, type) pass straight through.
import { LoaderCircle } from 'lucide-react';
import buttonStyles from './buttonStyles.js';

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`${buttonStyles({ variant, size })} ${className}`}
      {...props}
    >
      {isLoading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
