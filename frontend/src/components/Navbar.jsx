import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/logo.png';

export default function Navbar({ theme, toggleTheme }) {
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handlePortalRedirect = (type) => {
    setAuthDropdownOpen(false);
    setMobileMenuOpen(false);
    if (type === 'admin') {
      navigate('/login?portal=admin');
    } else {
      navigate('/login?portal=user');
    }
  };

  const desktopNavLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--bg-surface)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--text-primary)' : 'transparent',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.85rem',
    padding: '0.45rem 0.9rem',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
    transition: 'all 0.25s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const mobileNavLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--accent-color)' : 'var(--text-primary)',
    backgroundColor: isActive ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'block',
    transition: 'all 0.2s ease',
  });

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="navbar-brand">
          <img
            src={logoImg}
            alt="Bharat Devices Logo"
            className="navbar-logo-img"
          />
          <span className="navbar-brand-text">
            BHARAT<span style={{ color: 'var(--accent-color)' }}>DEVICES</span>
          </span>
        </Link>

        {/* Desktop Navigation Links (Inline on Laptop/Desktop) */}
        <nav className="desktop-nav">
          <NavLink to="/" style={desktopNavLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/products" style={desktopNavLinkStyle}>
            Products
          </NavLink>
          <NavLink to="/categories" style={desktopNavLinkStyle}>
            Categories
          </NavLink>
          <NavLink to="/about" style={desktopNavLinkStyle}>
            About Us
          </NavLink>
          <NavLink to="/enquiry" style={desktopNavLinkStyle}>
            Enquire
          </NavLink>
        </nav>

        {/* Right Side Utility Actions */}
        <div className="navbar-right-actions">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {/* Account Portal Dropdown (Desktop view) */}
          <div className="account-dropdown-container">
            <button
              onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
              className="account-btn"
            >
              <span>Account</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  transform: authDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                ▼
              </span>
            </button>

            {authDropdownOpen && (
              <div className="account-dropdown-menu">
                <button
                  onClick={() => handlePortalRedirect('user')}
                  className="dropdown-item"
                >
                  👤 User Portal
                </button>
                <button
                  onClick={() => handlePortalRedirect('admin')}
                  className="dropdown-item"
                >
                  ⚡ Admin Portal
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Toggle Button (Mobile/iOS view) */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <NavLink
            to="/"
            style={mobileNavLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            style={mobileNavLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/categories"
            style={mobileNavLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </NavLink>
          <NavLink
            to="/about"
            style={mobileNavLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </NavLink>
          <NavLink
            to="/enquiry"
            style={mobileNavLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            Enquire
          </NavLink>

          <hr className="mobile-divider" />

          {/* Account Portal Options for Mobile */}
          <div className="mobile-account-section">
            <span className="mobile-account-title">Account Portals</span>
            <button
              onClick={() => handlePortalRedirect('user')}
              className="mobile-portal-btn"
            >
              👤 User Portal
            </button>
            <button
              onClick={() => handlePortalRedirect('admin')}
              className="mobile-portal-btn"
            >
              ⚡ Admin Portal
            </button>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          width: 100%;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 0.85rem; /* Reduced padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.navbar-brand {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 1;
  min-width: 0; /* Prevents flex items from overflowing mobile width */
}

.navbar-logo-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.navbar-brand-text {
  font-size: 0.95rem; /* Reduced font size for tight layouts */
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-right-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.hamburger-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1;
  padding: 0.2rem;
  flex-shrink: 0;
}

        .account-dropdown-container {
          position: relative;
        }

        .account-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.45rem 0.9rem;
          border-radius: 20px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .account-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 160px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          padding: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          z-index: 110;
        }

        .dropdown-item {
          background: none;
          border: none;
          color: var(--text-primary);
          padding: 0.5rem 0.75rem;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }

        .hamburger-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.4rem;
          cursor: pointer;
          line-height: 1;
          padding: 0.25rem;
        }

        .mobile-drawer {
          display: none;
          flex-direction: column;
          gap: 0.4rem;
          padding: 1rem 1.5rem 1.5rem 1.5rem;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
        }

        .mobile-divider {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 0.5rem 0;
        }

        .mobile-account-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-account-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }

        .mobile-portal-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.65rem 1rem;
          border-radius: 8px;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* Mobile & Tablet Breakpoint (< 868px) */
        @media (max-width: 868px) {
          .desktop-nav {
            display: none;
          }

          .account-dropdown-container {
            display: none;
          }

          .hamburger-btn {
            display: block;
          }

          .mobile-drawer {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}