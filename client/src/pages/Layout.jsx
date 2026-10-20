// Shared page frame. <Outlet /> is where the matching child route renders.
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import Spinner from '../components/ui/Spinner.jsx';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
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
