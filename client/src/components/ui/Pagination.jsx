// Previous / next page controls with "Page 2 of 5". Hidden when everything fits on one page.
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button.jsx';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" />
        Previous
      </Button>
      <p className="px-2 text-sm text-ink-muted tabular-nums" aria-live="polite">
        Page <span className="font-semibold text-ink">{page}</span> of {totalPages}
      </p>
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
