import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TopBar() {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handlePortalRedirect = (type) => {
    setAdminDropdownOpen(false);
    if (type === 'admin') {
      navigate('/login?portal=admin');
    } 
     else {
      navigate('/login?portal=user');
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <span className="topbar-tagline">
          Quality Electronics. Smarter Solutions for Your Business.
        </span>

        <div className="topbar-right">
          <a href="tel:+918308649907" className="topbar-item">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            +91 83086 49907
          </a>

          <span className="topbar-sep">|</span>

          <a href="mailto:sales@bharatdevices.com" className="topbar-item">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            sales@bharatdevices.com
          </a>

          <span className="topbar-sep">|</span>

          <span className="topbar-item company-name">
            Bharat ElectroAI Pvt. Ltd.
          </span>

          <span className="topbar-sep">|</span>

          <Link to="/enquiry" className="topbar-item">
            Bulk Enquiries
          </Link>

          <span className="topbar-sep">|</span>

          <a href="#" className="topbar-item">
            Track Enquiry
          </a>

          <span className="topbar-sep">|</span>

          {/* Admin / Portal Login Dropdown */}
          <div className="topbar-dropdown-container">
            <button
              onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
              className="topbar-dropdown-btn"
              aria-expanded={adminDropdownOpen}
            >
              <span>Login Portal</span>
              <span
                className="arrow-icon"
                style={{
                  transform: adminDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▼
              </span>
            </button>

            {adminDropdownOpen && (
              <div className="topbar-dropdown-menu">
                <button
                  onClick={() => handlePortalRedirect('admin')}
                  className="topbar-dropdown-item"
                >
                  ⚡ Admin Portal
                </button>
                {/* <button
                  onClick={() => handlePortalRedirect('user')}
                  className="topbar-dropdown-item"
                >
                  👤 User Portal
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .topbar {
          background: #1a2744;
          color: #cbd5e1;
          font-size: 0.76rem;
          font-weight: 400;
          padding: 0.4rem 1.5rem;
          width: 100%;
          /* FIX: Ensures topbar stays above sticky navbar */
          position: relative;
          z-index: 1000;
          overflow: visible !important;
        }

        .topbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .topbar-tagline {
          color: #94a3b8;
          font-size: 0.74rem;
          white-space: nowrap;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .topbar-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #cbd5e1;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .topbar-item:hover { 
          color: #ffffff; 
        }

        .company-name {
          color: #94a3b8;
          cursor: default;
        }

        .topbar-sep { 
          color: #374151; 
        }

        /* Dropdown Styles */
        .topbar-dropdown-container {
          position: relative;
          display: inline-block;
        }

        .topbar-dropdown-btn {
          background: transparent;
          border: none;
          color: #cbd5e1;
          font-size: 0.76rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0;
          transition: color 0.2s;
        }

        .topbar-dropdown-btn:hover {
          color: #ffffff;
        }

        .arrow-icon {
          font-size: 0.55rem;
          transition: transform 0.2s ease;
          display: inline-block;
        }

        .topbar-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 140px;
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          padding: 0.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          /* FIX: Extra high z-index to fly above everything */
          z-index: 9999;
        }

        .topbar-dropdown-item {
          background: none;
          border: none;
          color: #e2e8f0;
          padding: 0.45rem 0.65rem;
          text-align: left;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 500;
          transition: background-color 0.2s, color 0.2s;
        }

        .topbar-dropdown-item:hover {
          background-color: #334155;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .topbar-tagline { display: none; }
          .topbar-inner { justify-content: center; }
          .topbar-right { gap: 0.4rem; font-size: 0.7rem; }
        }

        @media (max-width: 600px) {
          .topbar { display: none; }
        }
      `}</style>
    </div>
  );
}