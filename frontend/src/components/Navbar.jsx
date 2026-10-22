import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFeedback, setSearchFeedback] = useState(null);
  const navigate = useNavigate();

  const searchInputRef = useRef(null);
  const searchIndexRef = useRef(0);
  const lastSearchTermRef = useRef('');

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  // Quick keyboard shortcut: Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const clearHighlights = () => {
    document.querySelectorAll('.in-page-search-match').forEach((el) => {
      el.classList.remove('in-page-search-match');
    });
  };

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = search.trim();
    if (!query) return;

    clearHighlights();

    const term = query.toLowerCase();
    const rootScope = document.querySelector('main') || document.querySelector('#root') || document.body;

    // Collect visible matching text elements on the current page
    const matchedElements = [];
    const walker = document.createTreeWalker(
      rootScope,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.textContent || !node.textContent.toLowerCase().includes(term)) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Exclude navbar, headers, footers, mobile drawers, scripts, styles, inputs
          if (
            parent.closest(
              'header, nav, footer, .navbar, .ft-root, .mobile-nav, .mobile-bottom-nav, script, style, input, textarea, select'
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Check visibility
          const rect = parent.getBoundingClientRect();
          const style = window.getComputedStyle(parent);
          if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            (rect.width === 0 && rect.height === 0)
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode = walker.nextNode();
    while (currentNode) {
      const parent = currentNode.parentElement;
      if (parent && !matchedElements.includes(parent)) {
        matchedElements.push(parent);
      }
      currentNode = walker.nextNode();
    }

    if (matchedElements.length > 0) {
      // Cycle through matches if user searches the same query repeatedly
      let nextIndex = 0;
      if (lastSearchTermRef.current === term) {
        nextIndex = (searchIndexRef.current + 1) % matchedElements.length;
      }
      searchIndexRef.current = nextIndex;
      lastSearchTermRef.current = term;

      const targetEl = matchedElements[nextIndex];
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.classList.add('in-page-search-match');

      setSearchFeedback({
        text: `Match ${nextIndex + 1} of ${matchedElements.length} found on page`,
        type: 'success'
      });

      // Clear highlight after 3.5s
      setTimeout(() => {
        targetEl.classList.remove('in-page-search-match');
      }, 3500);

      setTimeout(() => {
        setSearchFeedback(null);
      }, 3000);

      setMobileOpen(false);
    } else {
      // Not found on current page -> Navigate to products catalog search
      setSearchFeedback({
        text: `Searching catalog for "${query}"...`,
        type: 'info'
      });

      setTimeout(() => {
        setSearchFeedback(null);
        navigate(`/products?q=${encodeURIComponent(query)}`);
        setMobileOpen(false);
      }, 400);
    }
  };

  const handleClear = () => {
    setSearch('');
    clearHighlights();
    setSearchFeedback(null);
    searchInputRef.current?.focus();
  };

  return (
    <header className={`navbar ${isDarkMode ? 'navbar--dark' : ''}`}>
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
          {navLinks.map((l) => (
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

        {/* Search Bar - Sleek Modern Pill */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <button type="submit" className="navbar-search-btn" aria-label="Search" title="Search">
            <svg
              className="navbar-search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search page or catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="navbar-search-input"
          />

          {search ? (
            <button
              type="button"
              className="navbar-search-clear"
              onClick={handleClear}
              aria-label="Clear search"
              title="Clear"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <span className="navbar-search-shortcut" title="Press Ctrl+K to search">⌘K</span>
          )}

          {/* Feedback Tooltip Badge */}
          {searchFeedback && (
            <div className={`navbar-search-feedback navbar-search-feedback--${searchFeedback.type}`}>
              {searchFeedback.type === 'success' ? '✓ ' : '🔍 '}
              {searchFeedback.text}
            </div>
          )}
        </form>

        <div className="navbar-actions">
          <ThemeToggle theme={isDarkMode ? 'dark' : 'light'} toggleTheme={toggleTheme} />
          <Link to="/enquiry" className="btn-request-quote">Request Quote</Link>
          <button className="hamburger" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="mobile-nav">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.5rem', borderBottom: isDarkMode ? '1px solid #192b50' : '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isDarkMode ? '#cbd5e1' : '#64748b' }}>Appearance</span>
            <ThemeToggle theme={isDarkMode ? 'dark' : 'light'} toggleTheme={toggleTheme} />
          </div>

          {/* Mobile Search Input */}
          <form
            onSubmit={handleSearch}
            style={{
              padding: '0.75rem 1.25rem',
              borderBottom: isDarkMode ? '1px solid #192b50' : '1px solid #f1f5f9',
              display: 'flex',
              gap: '8px'
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: isDarkMode ? '#0e1830' : '#f1f5f9',
                borderRadius: '8px',
                padding: '0 10px',
                border: isDarkMode ? '1px solid #192b50' : '1px solid #e2e8f0',
                height: '38px',
                gap: '8px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search page or catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: isDarkMode ? '#f8fafc' : '#0f172a',
                  fontSize: '0.85rem'
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              style={{
                background: '#ea580c',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0 12px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Find
            </button>
          </form>

          {navLinks.map((l) => (
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
          <div style={{ padding: '0.75rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              to="/enquiry"
              className="btn-request-quote"
              style={{ display: 'block', textAlign: 'center' }}
              onClick={() => setMobileOpen(false)}
            >
              Request Quote
            </Link>
            <Link
              to="/login?portal=admin"
              className="mobile-admin-btn"
              onClick={() => setMobileOpen(false)}
            >
              ⚡ Admin Portal Login
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

        /* ── Search Bar - Modern Aesthetic Capsule Pill ── */
        .navbar-search {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 0 0.75rem 0 0.85rem;
          gap: 0.4rem;
          width: 220px;
          height: 38px;
          margin: auto 1.25rem;
          position: relative;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.25s ease,
                      background-color 0.25s ease,
                      box-shadow 0.25s ease;
        }
        .navbar-search:focus-within {
          width: 280px;
          border-color: #ea580c;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15);
        }
        .navbar-search-btn {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .navbar-search-icon {
          color: #94a3b8;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .navbar-search:focus-within .navbar-search-icon {
          color: #ea580c;
          transform: scale(1.08);
        }
        .navbar-search-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.82rem;
          font-weight: 500;
          color: #1e293b;
          font-family: inherit;
        }
        .navbar-search-input::placeholder {
          color: #94a3b8;
          font-size: 0.8rem;
        }
        .navbar-search-clear {
          background: none;
          border: none;
          padding: 3px;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.15s ease;
        }
        .navbar-search-clear:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .navbar-search-shortcut {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.18);
          border-radius: 5px;
          padding: 2px 6px;
          letter-spacing: 0.05em;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
        }
        .navbar-search-feedback {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.22);
          pointer-events: none;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: searchTooltipPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .navbar-search-feedback--success {
          background: #16a34a;
        }
        .navbar-search-feedback--info {
          background: #ea580c;
        }
        @keyframes searchTooltipPop {
          from { opacity: 0; transform: translate(-50%, -6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

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


        .mobile-admin-btn {
          border: 1px solid #fed7aa;
          background: #fff7ed;
          color: #c2410c;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          display: block;
          transition: all 0.2s;
        }
        .mobile-admin-btn:hover {
          background: #ea580c;
          color: #ffffff;
        }

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

        /* ── Dark Mode ── */
        .navbar--dark {
          background: #070d1e;
          border-bottom-color: #192b50;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .navbar--dark .nav-link {
          color: #94a3b8;
        }
        .navbar--dark .nav-link:hover {
          color: #F97316;
        }
        .navbar--dark .nav-link--active {
          color: #F97316;
          border-bottom-color: #F97316;
        }
        .navbar--dark .navbar-search {
          background: rgba(14, 24, 48, 0.85);
          border-color: #192b50;
        }
        .navbar--dark .navbar-search:focus-within {
          border-color: #ea580c;
          background: #0e1830;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.25);
        }
        .navbar--dark .navbar-search-input {
          color: #f1f5f9;
        }
        .navbar--dark .navbar-search-input::placeholder {
          color: #64748b;
        }
        .navbar--dark .navbar-search-shortcut {
          background: rgba(25, 43, 80, 0.9);
          color: #94a3b8;
        }
        .navbar--dark .hamburger {
          border-color: #192b50;
          color: #cbd5e1;
        }
        .navbar--dark .mobile-nav {
          background: #070d1e;
          border-top-color: #192b50;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }
        .navbar--dark .mobile-nav-link {
          color: #94a3b8;
        }
        .navbar--dark .mobile-nav-link:hover {
          background: #0e1830;
          color: #F97316;
        }
        .navbar--dark .mobile-nav-link--active {
          color: #F97316;
          border-left-color: #F97316;
          background: #0e1830;
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
