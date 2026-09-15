import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#1d4ed8' : '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    padding: '0.35rem 0',
    borderBottom: isActive ? '2px solid #1d4ed8' : '2px solid transparent',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  });

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src={logoImg} alt="Bharat Devices" className="brand-logo" />
        </Link>

        <nav className="nav-links">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} style={linkStyle} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form className="navbar-search" onSubmit={handleSearch}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search products, brands or keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="navbar-search-input"
          />
        </form>

        <div className="navbar-actions">
          <Link to="/enquiry" className="btn-request-quote">Request Quote</Link>
          <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav">
          {navLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem 1.5rem',
                color: isActive ? '#1d4ed8' : '#374151',
                fontWeight: '500',
                textDecoration: 'none',
                borderBottom: '1px solid #f1f5f9',
              })}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div style={{ padding: '1rem 1.5rem' }}>
            <Link to="/enquiry" className="btn-request-quote" style={{ display: 'inline-block' }} onClick={() => setMobileOpen(false)}>
              Request Quote
            </Link>
          </div>
        </nav>
      )}

      <style>{`
        .navbar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-logo {
          height: 44px;
          width: auto;
          object-fit: contain;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
        }

        .navbar-search {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.45rem 0.75rem;
          gap: 0.5rem;
          flex: 1;
          max-width: 380px;
          transition: border-color 0.2s;
        }

        .navbar-search:focus-within {
          border-color: #1d4ed8;
          background: #fff;
        }

        .navbar-search-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.83rem;
          color: #374151;
          font-family: inherit;
        }

        .navbar-search-input::placeholder { color: #94a3b8; }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          margin-left: auto;
        }

        .btn-request-quote {
          background: #1e3a8a;
          color: #ffffff;
          border: none;
          padding: 0.55rem 1.25rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .btn-request-quote:hover { background: #1d4ed8; }

        .hamburger {
          display: none;
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.4rem 0.5rem;
          cursor: pointer;
          color: #374151;
          align-items: center;
          justify-content: center;
        }

        .mobile-nav {
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        @media (max-width: 1024px) {
          .nav-links { gap: 1rem; }
          .navbar-search { max-width: 240px; }
        }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .navbar-search { display: none; }
          .hamburger { display: flex; }
          .navbar-inner { gap: 1rem; }
        }

        @media (max-width: 480px) {
          .navbar-inner { padding: 0 1rem; height: 56px; }
          .brand-logo { height: 36px; }
        }
      `}</style>
    </header>
  );
}
