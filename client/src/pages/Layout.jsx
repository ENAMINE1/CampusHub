// Shared frame for every signed-in page. <Outlet /> is where the matching child route renders.
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import TopProgress from '../components/ui/TopProgress.jsx';

export default function Layout() {
  const { pathname } = useLocation();

  // A new page starts at the top. Only the path counts: changing a filter (?q=) keeps your place.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

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
        {/* key: moving to another page gives a fresh boundary, so one crash does not stick around,
            and replays the short page entrance animation. */}
        <ErrorBoundary key={pathname}>
          <div className="animate-page">
            {/* Suspense shows the top bar while a lazy page's code is still downloading. */}
            <Suspense fallback={<TopProgress />}>
              <Outlet />
            </Suspense>
          </div>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
