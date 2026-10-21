// Frame for the log-in and sign-up pages: the only screens a signed-out visitor can see.
// It shows the brand and what CampusHub offers, but no events, clubs or other campus data.
import { Outlet } from 'react-router';
import { BellRing, CalendarCheck, Radio } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const FEATURES = [
  { icon: CalendarCheck, text: 'Discover workshops, fests and meetups from every club.' },
  { icon: Radio, text: 'Reserve a seat and watch availability update live.' },
  { icon: BellRing, text: 'Get a reminder before every event you signed up for.' },
];

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-brand-700 p-12 text-white lg:flex lg:flex-col">
        {/* Decorative light and grid: aria-hidden, they carry no meaning. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_0%_0%,oklch(0.62_0.2_290/.55),transparent_60%),radial-gradient(40rem_30rem_at_100%_100%,oklch(0.55_0.2_250/.5),transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] bg-[size:48px_48px] opacity-[0.07]"
        />
        <Logo className="relative text-white" />
        <div className="relative my-auto max-w-lg animate-rise">
          <p className="mb-4 text-sm font-semibold tracking-wider text-brand-100 uppercase">
            Your campus, organised
          </p>
          <p className="font-display text-4xl leading-tight font-bold tracking-tight text-balance xl:text-5xl">
            Everything happening on campus, in one place.
          </p>
          <ul className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-brand-50">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-brand-100/80">Built in the MERN course.</p>
      </aside>
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10 animate-rise">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
