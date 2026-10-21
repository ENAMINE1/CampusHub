// A labelled dropdown with a custom chevron. Pass the <option> elements as children.
import { ChevronDown } from 'lucide-react';
import { controlClass, labelClass } from './fieldStyles.js';

export default function Select({ id, label, className = '', children, ...selectProps }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`${controlClass} appearance-none pr-10 capitalize`}
          {...selectProps}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
