// Site footer shown at the bottom of every signed-in page.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-ink-muted sm:px-6">
        <p>© {year} CampusHub</p>
        <p>Built in the MERN course.</p>
      </div>
    </footer>
  );
}
