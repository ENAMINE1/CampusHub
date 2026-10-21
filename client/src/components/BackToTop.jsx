// A round "back to top" button that fades in after scrolling down a screen or so. Long event
// lists on phones no longer need a long swipe back up.
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      // Hidden buttons are also taken out of the tab order and the accessibility tree.
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`fixed right-4 bottom-4 z-30 grid size-11 place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-lift backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:text-brand-600 sm:right-6 sm:bottom-6 dark:hover:text-brand-300 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
