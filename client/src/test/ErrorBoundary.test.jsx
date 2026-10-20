// ErrorBoundary swaps a crashed page for a friendly message instead of a blank screen.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function Broken() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('shows the fallback when a child throws', () => {
    // React logs caught errors to the console; silence it so the test output stays readable.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('unexpected error');
    spy.mockRestore();
  });
});
