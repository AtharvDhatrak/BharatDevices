import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="ft-root">

      {/* ── CTA Banner (Preserved Exactly As Requested) ── */}
      <div className="ft-cta">
        <div className="ft-cta-panel" />
        <div className="ft-cta-inner">

          <div className="ft-cta-text">
            <div className="ft-cta-eyebrow">
              READY TO GET STARTED?
              <span className="ft-cta-eyebrow-line" />
            </div>
            <h2 className="ft-cta-heading">
              Let's Build Your <span className="ft-cta-blue">Technology Setup</span>
            </h2>
            <p className="ft-cta-desc">
              Whether you need a single device, bulk procurement, or a complete
              IT infrastructure solution, Bharat Devices is ready to help.
            </p>
          </div>

          <div className="ft-cta-btns">
            <Link to="/enquiry" className="ft-cta-btn-primary">Request a Quote &nbsp;→</Link>
            <Link to="/contact" className="ft-cta-btn-outline">Talk to Our Team</Link>
          </div>

          <div className="ft-cta-contacts">
            <a href="tel:+918308649907" className="ft-cta-contact-item">
              <div className="ft-cta-contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <span className="ft-cta-contact-label">CALL US</span>
                <span className="ft-cta-contact-value">+91 83086 49907</span>
              </div>
            </a>
            <a href="mailto:sales@bharatdevices.com" className="ft-cta-contact-item">
              <div className="ft-cta-contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <span className="ft-cta-contact-label">EMAIL US</span>
                <span className="ft-cta-contact-value">sales@bharatdevices.com</span>
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* ── Compact, Clean Footer Body (Redesigned per Reference Image 2) ── */}
      <div className="ft-body">
        <div className="ft-inner">

          {/* Col 1: Brand & Socials */}
          <div className="ft-brand-col">
            <Link to="/" className="ft-logo-link">
              <img src={logoImg} alt="Bharat Devices" className="ft-logo" />
            </Link>
            <p className="ft-short-desc">
              Your trusted partner for enterprise IT hardware and smart electronic devices across India.
            </p>
            <div className="ft-socials-row">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="ft-social-icon" aria-label="LinkedIn" title="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="ft-social-icon" aria-label="YouTube" title="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="ft-social-icon" aria-label="Twitter" title="Twitter / X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://wa.me/918308649907?text=Hello%20Bharat%20Devices%20Support" target="_blank" rel="noopener noreferrer" className="ft-social-icon" aria-label="WhatsApp" title="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="ft-col">
            <h4 className="ft-heading">Company</h4>
            <ul className="ft-list">
              <li><Link to="/about" className="ft-nav-link">About Us</Link></li>
              <li><Link to="/#solutions" className="ft-nav-link">Solutions</Link></li>
              <li><Link to="/#why-us" className="ft-nav-link">Why Choose Us</Link></li>
              <li><Link to="/contact" className="ft-nav-link">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="ft-col">
            <h4 className="ft-heading">Support</h4>
            <ul className="ft-list">
              <li><Link to="/enquiry" className="ft-nav-link">Request a Quote</Link></li>
              <li><Link to="/contact" className="ft-nav-link">Help Center & FAQs</Link></li>
              <li><Link to="/contact" className="ft-nav-link">Warranty & Support</Link></li>
              <li><a href="tel:+918308649907" className="ft-nav-link">Direct Line: +91 83086 49907</a></li>
            </ul>
          </div>

          {/* Col 4: Links */}
          <div className="ft-col">
            <h4 className="ft-heading">Links</h4>
            <ul className="ft-list">
              <li><Link to="/" className="ft-nav-link">Home</Link></li>
              <li><Link to="/products" className="ft-nav-link">All Products</Link></li>
              <li><Link to="/products?category=laptops" className="ft-nav-link">Laptops & PCs</Link></li>
              <li><Link to="/products?category=networking" className="ft-nav-link">Networking</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact Us (Clean phone/email badges matching reference image) */}
          <div className="ft-col ft-contact-col">
            <h4 className="ft-heading">Contact Us</h4>
            <div className="ft-contact-group">
              <a href="tel:+918308649907" className="ft-contact-line">
                <div className="ft-badge-icon ft-badge-icon--blue">
                  <Phone size={14} />
                </div>
                <span className="ft-contact-text">+91 83086 49907</span>
              </a>

              <a href="mailto:sales@bharatdevices.com" className="ft-contact-line">
                <div className="ft-badge-icon ft-badge-icon--blue">
                  <Mail size={14} />
                </div>
                <span className="ft-contact-text">sales@bharatdevices.com</span>
              </a>

              <div className="ft-contact-line">
                <div className="ft-badge-icon ft-badge-icon--gray">
                  <MapPin size={14} />
                </div>
                <span className="ft-contact-text">Vashi, Navi Mumbai, India</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Slim Bottom Bar ── */}
      <div className="ft-bottom">
        <div className="ft-bottom-inner">
          <span className="ft-copy">© 2026 Bharat ElectroAI Private Limited. All rights reserved.</span>
          <span className="ft-bottom-tagline">Quality Electronics. A Brighter Tomorrow.</span>
          <button className="ft-scroll-top" onClick={scrollTop} aria-label="Scroll to top" title="Scroll to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        .ft-root {
          background: #ffffff;
          font-family: inherit;
          transition: background-color 0.35s ease, border-color 0.35s ease;
        }

        /* ── CTA Banner (Unchanged, Pristine) ── */
        .ft-cta {
          background: #064e3b;
          position: relative;
          overflow: hidden;
          padding: 0 42px;
          min-height: 160px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ft-cta-panel {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 48%;
          background: linear-gradient(135deg, #F97316, #EA580C);
          clip-path: polygon(12% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .ft-cta-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 40px;
          padding: 28px 0;
        }
        .ft-cta-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .ft-cta-eyebrow-line {
          flex: 1;
          max-width: 80px;
          height: 1.5px;
          background: linear-gradient(90deg, #F97316, transparent);
        }
        .ft-cta-heading {
          font-size: clamp(1.25rem, 2.2vw, 1.75rem);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .ft-cta-blue { color: #FB923C; }
        .ft-cta-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 460px;
        }
        .ft-cta-btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .ft-cta-btn-primary {
          background: #ffffff;
          color: #052e16;
          padding: 11px 22px;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          text-align: center;
          transition: background 0.2s, transform 0.15s;
        }
        .ft-cta-btn-primary:hover { background: #fff7ed; transform: translateY(-1px); }
        .ft-cta-btn-outline {
          border: 1.5px solid rgba(255,255,255,0.5);
          color: #ffffff;
          padding: 10px 22px;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .ft-cta-btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
        .ft-cta-contacts { display: flex; flex-direction: column; gap: 14px; flex-shrink: 0; }
        .ft-cta-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .ft-cta-contact-item:hover { opacity: 0.85; }
        .ft-cta-contact-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ffffff;
        }
        .ft-cta-contact-label { display: block; font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }
        .ft-cta-contact-value { display: block; font-size: 0.88rem; font-weight: 700; color: #ffffff; margin-top: 1px; }

        /* ── Compact Footer Body (Matching Reference Image 2) ── */
        .ft-body {
          padding: 36px 32px 30px;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.35s ease, border-color 0.35s ease;
        }

        .ft-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr 1.3fr;
          gap: 36px;
          align-items: start;
        }

        /* Brand Column */
        .ft-brand-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ft-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .ft-short-desc {
          font-size: 0.82rem;
          color: #64748b;
          line-height: 1.55;
          margin: 0;
          max-width: 270px;
        }

        .ft-socials-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }

        .ft-social-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .ft-social-icon:hover {
          background: #F97316;
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Columns */
        .ft-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ft-heading {
          font-size: 0.92rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .ft-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ft-nav-link {
          font-size: 0.83rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.18s, transform 0.18s;
          display: inline-block;
        }

        .ft-nav-link:hover {
          color: #F97316;
          transform: translateX(2px);
        }

        /* Contact Column */
        .ft-contact-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ft-contact-line {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-size: 0.83rem;
          color: #334155;
          transition: color 0.18s;
        }

        .ft-contact-line:hover {
          color: #F97316;
        }

        .ft-badge-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ft-badge-icon--blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .ft-badge-icon--gray {
          background: #f1f5f9;
          color: #F97316;
        }

        .ft-contact-text {
          font-weight: 600;
          word-break: break-word;
        }

        /* ── Slim Bottom Bar ── */
        .ft-bottom {
          padding: 12px 32px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          transition: background-color 0.35s ease, border-color 0.35s ease;
        }

        .ft-bottom-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 0.78rem;
          color: #64748b;
        }

        .ft-copy {
          color: #64748b;
        }

        .ft-bottom-tagline {
          color: #94a3b8;
          font-size: 0.76rem;
        }

        .ft-scroll-top {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F97316;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
        }

        .ft-scroll-top:hover {
          background: #ea580c;
          transform: translateY(-2px);
        }

        /* ── Dark Mode Overrides ── */
        html.dark .ft-root {
          background: #070d1e;
        }

        html.dark .ft-body {
          background: #070d1e;
          border-bottom-color: #192b50;
        }

        html.dark .ft-heading {
          color: #f8fafc;
        }

        html.dark .ft-short-desc,
        html.dark .ft-nav-link {
          color: #94a3b8;
        }

        html.dark .ft-nav-link:hover {
          color: #F97316;
        }

        html.dark .ft-social-icon {
          background: #0e1830;
          color: #94a3b8;
        }

        html.dark .ft-social-icon:hover {
          background: #F97316;
          color: #ffffff;
        }

        html.dark .ft-contact-line {
          color: #cbd5e1;
        }

        html.dark .ft-contact-line:hover {
          color: #F97316;
        }

        html.dark .ft-badge-icon--blue {
          background: #1e293b;
          color: #38bdf8;
        }

        html.dark .ft-badge-icon--gray {
          background: #1e293b;
          color: #F97316;
        }

        html.dark .ft-bottom {
          background: #040814;
          border-top-color: #192b50;
        }

        html.dark .ft-copy,
        html.dark .ft-bottom-tagline {
          color: #64748b;
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .ft-inner {
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 28px;
          }
          .ft-contact-col {
            grid-column: 1 / -1;
          }
          .ft-cta-inner {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .ft-cta-btns {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 600px) {
          .ft-inner {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .ft-brand-col {
            grid-column: 1 / -1;
          }
          .ft-contact-col {
            grid-column: 1 / -1;
          }
          .ft-bottom-inner {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          .ft-cta {
            padding: 24px 20px;
          }
          .ft-body {
            padding: 28px 20px 24px;
          }
        }
      `}</style>
    </footer>
  );
}
