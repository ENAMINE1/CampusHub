// A labelled multi-line text box with an accessible error message, like Input.
import FieldError from './FieldError.jsx';
import { controlClass, labelClass } from './fieldStyles.js';

export default function Textarea({ id, label, error, ...textareaProps }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${controlClass} resize-y`}
        {...textareaProps}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
