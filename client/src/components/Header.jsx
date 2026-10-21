// Sticky site header: logo, main navigation (a menu button on small screens), theme toggle and
// the signed-in user. It gains a shadow once the page scrolls, so it reads as floating above it.
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import NavLinks from './NavLinks.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import UserMenu from './UserMenu.jsx';
import buttonStyles from './ui/buttonStyles.js';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const MenuIcon = isMenuOpen ? X : Menu;

  // Close the mobile menu whenever the page changes (back button included).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    // passive: the browser need not wait for this handler before scrolling.
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-canvas/80 backdrop-blur-lg transition-[border-color,box-shadow] duration-300 ${
        isScrolled ? 'border-line shadow-card' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <NavLinks className="flex items-center gap-1" />
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <UserMenu />
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Menu"
            className={`${buttonStyles({ variant: 'ghost', size: 'icon' })} lg:hidden`}
          >
            <MenuIcon
              key={isMenuOpen ? 'close' : 'open'}
              className="animate-fade"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-slide-down border-t border-line px-4 py-3 shadow-lift lg:hidden"
        >
          <NavLinks className="grid gap-1" onNavigate={() => setIsMenuOpen(false)} />
        </nav>
      )}
    </header>
  );
}
