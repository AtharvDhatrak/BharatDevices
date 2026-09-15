import React from 'react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="cta-section">
      <div className="cta-bg-img" />
      <div className="cta-overlay" />
      <div className="cta-inner">
        <div className="cta-left">
          <span className="cta-eyebrow">READY TO UPGRADE YOUR BUSINESS?</span>
          <h2 className="cta-title">Let's Find the Right Devices for You</h2>
          <p className="cta-desc">Get expert recommendations and tailored pricing for your business needs.</p>
          <Link to="/enquiry" className="cta-btn">Request a Quote &nbsp;→</Link>
        </div>

        <div className="cta-contacts">
          <div className="cta-contact-item">
            <div className="cta-contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <span className="cta-contact-label">Call Us</span>
              <a href="tel:+918308649907" className="cta-contact-value">+91 83086 49907</a>
            </div>
          </div>
          <div className="cta-contact-item">
            <div className="cta-contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <span className="cta-contact-label">Email Us</span>
              <a href="mailto:sales@bharatdevices.com" className="cta-contact-value">sales@bharatdevices.com</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cta-section {
          position: relative;
          background: #0b1628;
          padding: 3.5rem 1.5rem;
          overflow: hidden;
        }

        .cta-bg-img {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 45%;
          background: url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80') center/cover no-repeat;
          opacity: 0.15;
        }

        .cta-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #0b1628 55%, transparent 100%);
        }

        .cta-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 3rem;
          align-items: center;
        }

        .cta-left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cta-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          color: #3b82f6;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cta-title {
          font-size: clamp(1.35rem, 2.8vw, 2rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          max-width: 500px;
        }

        .cta-desc {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          border: 2px solid #ffffff;
          color: #ffffff;
          padding: 0.7rem 1.5rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          width: fit-content;
          transition: background 0.2s, color 0.2s;
        }

        .cta-btn:hover { background: #ffffff; color: #0b1628; }

        .cta-contacts {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex-shrink: 0;
        }

        .cta-contact-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .cta-contact-icon {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .cta-contact-label {
          display: block;
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cta-contact-value {
          display: block;
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          margin-top: 2px;
          transition: color 0.2s;
        }

        .cta-contact-value:hover { color: #3b82f6; }

        @media (max-width: 900px) {
          .cta-inner { grid-template-columns: 1fr; gap: 2rem; }
          .cta-contacts { flex-direction: row; flex-wrap: wrap; }
          .cta-bg-img { width: 100%; opacity: 0.08; }
        }

        @media (max-width: 640px) {
          .cta-section { padding: 2.5rem 1rem; }
          .cta-contacts { flex-direction: column; gap: 1rem; }
        }
      `}</style>
    </section>
  );
}
