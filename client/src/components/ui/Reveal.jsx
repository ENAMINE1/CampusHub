// Fades and lifts its content in the first time it scrolls into view. Used for sections below
// the fold, so the page feels like it unfolds as you read instead of all appearing at once.
// Content is always in the page (and readable by screen readers); only its look animates.
import { useEffect, useRef, useState } from 'react';

export default function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  const ref = useRef(null);
  // Old browsers without IntersectionObserver simply show everything straight away.
  const [isShown, setIsShown] = useState(() => !('IntersectionObserver' in window));

  useEffect(() => {
    const element = ref.current;
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsShown(true);
        observer.disconnect(); // reveal once, never hide again
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      {...props}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${
        isShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
