// Shared frame for every signed-in page. <Outlet /> is where the matching child route renders.
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import Spinner from '../components/ui/Spinner.jsx';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {/* key: moving to another page gives a fresh boundary, so one crash does not stick around. */}
        <ErrorBoundary key={location.pathname}>
          {/* Suspense shows the spinner while a lazy page's code is still downloading. */}
          <Suspense fallback={<Spinner label="Loading page…" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
