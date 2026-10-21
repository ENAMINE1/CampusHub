// Sticky site header: logo, main navigation (a menu button on small screens), theme toggle and
// the signed-in user. The translucent background keeps content faintly visible while scrolling.
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import NavLinks from './NavLinks.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import UserMenu from './UserMenu.jsx';
import buttonStyles from './ui/buttonStyles.js';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MenuIcon = isMenuOpen ? X : Menu;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-lg">
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
            <MenuIcon aria-hidden="true" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-fade border-t border-line px-4 py-3 lg:hidden"
        >
          <NavLinks className="grid gap-1" onNavigate={() => setIsMenuOpen(false)} />
        </nav>
      )}
    </header>
  );
}
