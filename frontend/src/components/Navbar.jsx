import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Sparkles, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import LanguageSwitcher from './ui/LanguageSwitcher';

/**
 * Navbar component featuring premium glassmorphism styles,
 * interactive states, and a fully functional mobile menu.
 */
const Navbar = () => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll height to add extra opacity/border to the navigation bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home', 'Home'), path: '/' },
    { name: t('about', 'About'), path: '/about' },
  ];

  const activeStyle = "text-primary-400 bg-primary-500/10 border-primary-500";
  const inactiveStyle = "text-slate-300 hover:text-white hover:bg-slate-800/50 border-transparent";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-950/90 backdrop-blur-md border-b border-dark-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:text-glow duration-300">{t('character', 'Character')}<span className="text-primary-400 font-extrabold">U</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium border-b-2 transition-all duration-200 ${
                    isActive ? activeStyle : inactiveStyle
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* CTA / Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              to="/dashboard"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:shadow-lg hover:shadow-primary-500/35 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('launchApp', 'Launch App')} <User className="w-4 h-4" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-dark-950/98 backdrop-blur-lg border-b border-dark-800 ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-dark-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-dark-800">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20"
            >
              {t('launchApp', 'Launch App')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
