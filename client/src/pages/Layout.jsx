// Shared page frame. <Outlet /> is where the matching child route renders.
import { Outlet } from 'react-router';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
