// Root component: page layout with header, main content and footer.
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import EventCard from './components/EventCard.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Upcoming events</h1>
        <EventCard />
      </main>
      <Footer />
    </div>
  );
}
