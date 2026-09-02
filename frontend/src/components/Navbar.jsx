import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/logo.png';

export default function Navbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.9rem',
    letterSpacing: '0.01em',
    padding: '0.25rem 0',
    borderBottom: isActive ? '2px solid var(--accent-color)' : '2px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <header style={{
      width: '100%',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="responsive-container" style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={logoImg} 
            alt="Bharat Devices Logo" 
            style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
          />
          <span style={{ 
            fontSize: '1.2rem', 
            fontWeight: '800', 
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            BHARAT<span style={{ color: 'var(--accent-color)' }}>DEVICES</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <NavLink to="/" style={linkStyle}>Home</NavLink>
          <NavLink to="/products" style={linkStyle}>Products</NavLink>
          <NavLink to="/categories" style={linkStyle}>Categories</NavLink>
          <NavLink to="/about" style={linkStyle}>About Us</NavLink>
        </nav>

        {/* Right Section Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <Link to="/enquiry" style={{
            backgroundColor: 'var(--accent-color)', 
            color: '#fff',
            padding: '0.55rem 1.25rem', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontSize: '0.85rem', 
            fontWeight: '600', 
            letterSpacing: '0.02em',
            boxShadow: '0 0 12px var(--accent-glow)'
          }}>
            Enquire Now
          </Link>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only"
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: '1.5rem', cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-only" style={{
          padding: '1rem 1.5rem', backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-color)', display: 'flex',
          flexDirection: 'column', gap: '1rem'
        }}>
          <NavLink to="/" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Products</NavLink>
          <NavLink to="/categories" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Categories</NavLink>
          <NavLink to="/about" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/admin" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>Admin Portal</NavLink>
        </div>
      )}

      {/* Mobile Display Helper Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  );
}