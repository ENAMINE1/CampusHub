// A section title (h2) with an optional "see all" link on the right.
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ id, title, linkTo, linkLabel }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 id={id} className="text-2xl font-bold">
        {title}
      </h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300"
        >
          {linkLabel}
          <ArrowRight
            className="size-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
