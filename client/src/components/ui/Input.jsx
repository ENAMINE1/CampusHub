// A labelled input with an optional leading icon, an optional trailing control (a clear or
// show-password button) and an error message wired up for screen readers.
import FieldError from './FieldError.jsx';
import { controlClass, labelClass } from './fieldStyles.js';

export default function Input({
  id,
  label,
  error,
  icon: Icon,
  trailing,
  className = '',
  ...inputProps
}) {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="group/field relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-muted transition-colors group-focus-within/field:text-brand-500"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${controlClass} ${Icon ? 'pl-10' : ''} ${trailing ? 'pr-12' : ''}`}
          {...inputProps}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>
        )}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
