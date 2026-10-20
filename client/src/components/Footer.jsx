// Site footer shown at the bottom of every page.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <p className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600">
        © {year} CampusHub. Built in the MERN course.
      </p>
    </footer>
  );
}
