// A password field with a show / hide button and a Caps Lock warning, the two things that most
// often cause "wrong password" on the first try. Other props pass through to Input.
import { useState } from 'react';
import { Eye, EyeOff, Lock, TriangleAlert } from 'lucide-react';
import Input from './Input.jsx';

export default function PasswordInput({ onBlur, ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const Toggle = isVisible ? EyeOff : Eye;

  // getModifierState tells whether Caps Lock is on at the moment of the key press.
  const checkCaps = (e) => setCapsLock(e.getModifierState?.('CapsLock') ?? false);

  return (
    <div>
      <Input
        {...props}
        type={isVisible ? 'text' : 'password'}
        icon={Lock}
        onKeyUp={checkCaps}
        onBlur={(e) => {
          setCapsLock(false);
          onBlur?.(e);
        }}
        trailing={
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            className="grid size-8 place-items-center rounded-lg text-ink-muted transition hover:bg-surface-muted hover:text-ink"
          >
            <Toggle
              key={String(isVisible)}
              className="size-4 animate-fade"
              aria-hidden="true"
            />
          </button>
        }
      />
      {capsLock && (
        <p className="mt-1.5 flex animate-fade items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
          <TriangleAlert className="size-3.5" aria-hidden="true" />
          Caps Lock is on
        </p>
      )}
    </div>
  );
}
