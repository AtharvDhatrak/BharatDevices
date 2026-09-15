import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {searchOpen && (
        <div className="bottom-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="bottom-search-box" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="bottom-search-form">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                autoFocus
                placeholder="Search products, brands..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="bottom-search-input"
              />
              <button type="button" className="bottom-search-cancel" onClick={() => setSearchOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav">
        <NavLink to="/" end className={({ isActive }) => `bnav-item${isActive ? ' bnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/>
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink to="/products" className={({ isActive }) => `bnav-item${isActive ? ' bnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span>Products</span>
        </NavLink>

        <button className="bnav-item bnav-search-btn" onClick={() => setSearchOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Search</span>
        </button>

        <NavLink to="/enquiry" className={({ isActive }) => `bnav-item${isActive ? ' bnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <span>Quote</span>
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => `bnav-item${isActive ? ' bnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span>Menu</span>
        </NavLink>
      </nav>

      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          z-index: 200;
          height: 62px;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
        }

        @media (max-width: 900px) {
          .mobile-bottom-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        }

        .bnav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 6px 10px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.62rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          flex: 1;
          transition: color 0.2s;
          font-family: inherit;
        }

        .bnav-item:hover { color: #1d4ed8; }

        .bnav-active { color: #1d4ed8 !important; }

        .bnav-search-btn { color: #94a3b8; }

        /* Search overlay */
        .bottom-search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 400;
          display: flex;
          align-items: flex-end;
        }

        .bottom-search-box {
          width: 100%;
          background: #fff;
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          margin-bottom: 62px;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .bottom-search-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          border: 1.5px solid #1d4ed8;
          border-radius: 10px;
          padding: 0.65rem 0.85rem;
        }

        .bottom-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.95rem;
          color: #1e293b;
          font-family: inherit;
        }

        .bottom-search-cancel {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          color: #64748b;
        }
      `}</style>
    </>
  );
}
