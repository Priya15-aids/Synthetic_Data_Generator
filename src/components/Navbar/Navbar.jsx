import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiDatabase, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { href: '#home', label: 'Home', color: 'var(--color-primary)' },
    { href: '#about', label: 'About', color: 'var(--color-cyan)' },
    { href: '#features', label: 'Features', color: 'var(--color-emerald)' },
    { href: '#how-it-works', label: 'How It Works', color: 'var(--color-indigo)' },
    { href: '#use-cases', label: 'Use Cases', color: 'var(--color-rose)' },
    { href: '#generator', label: 'Generator', color: 'var(--color-violet)' },
  ];

  const handleNavClick = () => setIsOpen(false);

  // Scroll to a section without changing the URL hash (needed for HashRouter)
  const handleSectionClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    const id = href.replace('#', '');
    let el = document.getElementById(id);
    if (!el && id === 'generator') {
      el = document.querySelector('.generate-section');
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FiDatabase className="logo-icon" />
          <span>SynthData</span>
        </Link>

        {}
        <div className="navbar-mobile-actions">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-icon-btn" onClick={handleNavClick} title="Dashboard">
                <FiGrid />
              </Link>
              <button className="mobile-icon-btn mobile-logout-icon" onClick={() => { logout(); handleNavClick(); }} title="Logout">
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-icon-btn" onClick={handleNavClick} title="Sign In">
                <FiUser />
              </Link>
            </>
          )}
          <button
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {}
        <div className={`navbar-right ${isOpen ? 'active' : ''}`}>
          {isHomePage && (
            <ul className="navbar-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSectionClick(e, link.href)}
                    style={{ '--nav-color': link.color }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {!isHomePage && (
            <ul className="navbar-links">
              <li>
                <Link to="/" onClick={handleNavClick} style={{ '--nav-color': 'var(--color-primary)' }}>
                  Home
                </Link>
              </li>
            </ul>
          )}

          <div className="navbar-actions">
            <ThemeToggle />

            {user ? (
              <>
                <Link to="/dashboard" className="navbar-action-btn" onClick={handleNavClick} title="Dashboard">
                  <FiGrid />
                  <span className="action-label">Dashboard</span>
                </Link>
                <button className="navbar-action-btn logout-btn" onClick={() => { logout(); handleNavClick(); }} title="Logout">
                  <FiLogOut />
                  <span className="action-label">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-action-btn" onClick={handleNavClick} title="Login">
                  <FiUser />
                  <span className="action-label">Login</span>
                </Link>
                <Link to="/signup" className="navbar-signup-btn" onClick={handleNavClick}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
