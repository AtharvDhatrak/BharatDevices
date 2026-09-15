import React from 'react';
import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <span className="topbar-tagline">Quality Electronics. Smarter Solutions for Your Business.</span>
        <div className="topbar-right">
          <a href="tel:+918308649907" className="topbar-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +91 83086 49907
          </a>
          <span className="topbar-sep">|</span>
          <a href="mailto:sales@bharatdevices.com" className="topbar-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            sales@bharatdevices.com
          </a>
          <span className="topbar-sep">|</span>
          <span className="topbar-item" style={{color:'#94a3b8', cursor:'default'}}>Bharat ElectroAI Pvt. Ltd.</span>
          <span className="topbar-sep">|</span>
          <Link to="/enquiry" className="topbar-item">Bulk Enquiries</Link>
          <span className="topbar-sep">|</span>
          <a href="#" className="topbar-item">Track Enquiry</a>
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

        .topbar-item:hover { color: #ffffff; }

        .topbar-sep { color: #374151; }

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
