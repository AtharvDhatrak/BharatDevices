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

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo + tricolor bars */}
        <Link to="/" className="navbar-brand">
          <div className="brand-wrap">
            <img src={logoImg} alt="Bharat Devices" className="brand-logo" />
            <div className="brand-bars">
              <span className="brand-bar brand-bar--orange" />
              <span className="brand-bar brand-bar--green" />
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-links">
          {navLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="mobile-nav">
          {navLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' mobile-nav-link--active' : '')}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div style={{ padding: '0.75rem 1.25rem 1rem' }}>
            <Link
              to="/enquiry"
              className="btn-request-quote"
              style={{ display: 'inline-block' }}
              onClick={() => setMobileOpen(false)}
            >
              Request Quote
            </Link>
          </div>
        </nav>
      )}

      <style>{`
        /* ── Shell ── */
        .navbar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: stretch;
          gap: 0;
        }

        /* ── Logo ── */
        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 2rem;
        }
        .brand-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .brand-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .brand-bars {
          display: flex;
          gap: 3px;
        }
        .brand-bar {
          display: block;
          height: 3px;
          width: 22px;
          border-radius: 2px;
        }
        .brand-bar--orange { background: #F97316; }
        .brand-bar--green  { background: #16a34a; }

        /* ── Desktop nav links ── */
        .nav-links {
          display: flex;
          align-items: stretch;
          gap: 0;
          flex-shrink: 0;
        }
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          border-bottom: 3px solid transparent;
          transition: color 0.18s, border-color 0.18s;
          white-space: nowrap;
          /* pull indicator flush to navbar bottom edge */
          margin-bottom: -1px;
        }
        .nav-link:hover {
          color: #F97316;
        }
        .nav-link--active {
          color: #F97316;
          border-bottom-color: #F97316;
          font-weight: 600;
        }

        /* ── Search ── */
        .navbar-search {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0 0.75rem;
          gap: 0.5rem;
          flex: 1;
          max-width: 360px;
          margin: 0 1.5rem;
          transition: border-color 0.2s;
        }
        .navbar-search:focus-within {
          border-color: #F97316;
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

        /* ── Actions ── */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          margin-left: auto;
        }
        .btn-request-quote {
          background: #EA580C;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-request-quote:hover { background: #F97316; }

        /* ── Hamburger ── */
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

        /* ── Mobile menu ── */
        .mobile-nav {
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
        }
        .mobile-nav-link {
          display: block;
          padding: 0.85rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: color 0.18s, border-color 0.18s, background 0.18s;
        }
        .mobile-nav-link:hover {
          background: #fff7ed;
          color: #F97316;
        }
        .mobile-nav-link--active {
          color: #F97316;
          border-left-color: #F97316;
          background: #fff7ed;
          font-weight: 600;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .nav-link { padding: 0 0.75rem; }
          .navbar-search { max-width: 220px; margin: 0 1rem; }
        }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .navbar-search { display: none; }
          .hamburger { display: flex; }
          .navbar-brand { margin-right: 0; }
        }
        @media (max-width: 480px) {
          .navbar-inner { padding: 0 1rem; height: 56px; }
          .brand-logo { height: 32px; }
          .brand-bar { width: 18px; height: 2px; }
        }
      `}</style>
    </header>
  );
}
