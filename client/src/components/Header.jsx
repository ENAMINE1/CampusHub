// Site header: logo text and the main navigation links.
export default function Header() {
  return (
    <header className="bg-brand-700 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-bold">
          CampusHub
        </a>
        <nav aria-label="Main">
          <ul className="flex gap-4 text-sm font-medium">
            <li>
              <a href="/" className="hover:underline">
                Events
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Clubs
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
