import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const supportLinks = [
  { label: 'Request a Quote', to: '/enquiry' },
  { label: 'Track Enquiry', to: '#' },
  { label: 'FAQs', to: '#' },
  { label: 'Shipping & Delivery', to: '#' },
  { label: 'Returns & Warranty', to: '#' },
  { label: 'Privacy Policy', to: '#' },
];

const ctaBadges = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
    title: 'Expert Support', sub: 'Here when you need us',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
    title: 'Trusted Partner', sub: 'Quality you can rely on',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: 'Growth Focused', sub: 'Solutions for tomorrow',
  },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="ft-root">

      {/* ── CTA Banner ── */}
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

          <div className="ft-cta-badges">
            {ctaBadges.map((b, i) => (
              <div key={i} className="ft-cta-badge">
                <div className="ft-cta-badge-icon">{b.icon}</div>
                <div>
                  <strong>{b.title}</strong>
                  <span>{b.sub}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Footer Body ── */}
      <div className="ft-body">
        <div className="ft-inner">

          {/* Brand */}
          <div className="ft-brand">
            <Link to="/" className="ft-logo-link">
              <img src={logoImg} alt="Bharat Devices" className="ft-logo" />
            </Link>
            <p className="ft-legal">Bharat ElectroAI Private Limited</p>
            <p className="ft-sub">Quality Electronics. Smarter Solutions.</p>
            <p className="ft-tagline">
              Your trusted partner for IT and electronic devices.
              Quality products, competitive pricing and dedicated
              support for businesses.
            </p>
            <div className="ft-socials">
              <a href="#" className="ft-social" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="ft-social" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0b1628"/></svg>
              </a>
              <a href="#" className="ft-social" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="ft-col">
            <h4 className="ft-col-title">Quick Links</h4>
            <ul className="ft-links">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="ft-link">
                    <span>{l.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="ft-col">
            <h4 className="ft-col-title">Support</h4>
            <ul className="ft-links">
              {supportLinks.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="ft-link">
                    <span>{l.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="ft-col">
            <h4 className="ft-col-title">Contact Us</h4>
            <ul className="ft-contact-list">
              <li className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <a href="tel:+918308649907" className="ft-link-plain">+91 8308649907</a>
              </li>
              <li className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div className="ft-email-group">
                  <a href="mailto:sales@bharatdevices.com" className="ft-link-plain">sales@bharatdevices.com</a>
                  <a href="mailto:hr@bharatdevices.com" className="ft-link-plain">hr@bharatdevices.com</a>
                  <a href="mailto:aback@bharatdevices.com" className="ft-link-plain">aback@bharatdevices.com</a>
                </div>
              </li>
              <li className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <span className="ft-addr-label">OFFICE</span>
                  <span className="ft-addr-text">Akshar Business Park, J Wing C2<br/>Sector 25, Vashi, Navi Mumbai – 400703</span>
                </div>
              </li>
              <li className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                </div>
                <div>
                  <span className="ft-addr-label">REGISTERED</span>
                  <span className="ft-addr-text">VO-852, WeWork 247 Park, 13th Floor<br/>Vikhroli Corporate Park, LBS Road<br/>Vikhroli West, Mumbai – 400079</span>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="ft-bottom">
        <div className="ft-bottom-inner">
          <span>© 2026 Bharat ElectroAI Private Limited. All rights reserved.</span>
          <span className="ft-bottom-tagline">Quality Electronics. A Brighter Tomorrow.</span>
          <button className="ft-scroll-top" onClick={scrollTop} aria-label="Scroll to top">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        .ft-root { background: #080f1e; font-family: inherit; }

        /* ── CTA Banner ── */
        .ft-cta {
          background: #0c1e42;
          position: relative; overflow: hidden;
          padding: 0 42px;
          min-height: 160px;
          display: flex; align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ft-cta-panel {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 48%;
          background: #0879ee;
          clip-path: polygon(12% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .ft-cta-inner {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto; width: 100%;
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 40px;
          padding: 28px 0;
        }
        .ft-cta-eyebrow {
          display: flex; align-items: center; gap: 12px;
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;
        }
        .ft-cta-eyebrow-line {
          flex: 1; max-width: 80px; height: 1.5px;
          background: linear-gradient(90deg, #3b82f6, transparent);
        }
        .ft-cta-heading {
          font-size: clamp(1.25rem, 2.2vw, 1.75rem);
          font-weight: 900; color: #ffffff; line-height: 1.2; margin-bottom: 8px;
        }
        .ft-cta-blue { color: #60a5fa; }
        .ft-cta-desc { font-size: 0.85rem; color: rgba(255,255,255,0.65); line-height: 1.6; max-width: 460px; }

        .ft-cta-btns {
          display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;
        }
        .ft-cta-btn-primary {
          background: #ffffff; color: #0c1e42;
          padding: 11px 22px; border-radius: 7px;
          font-size: 0.875rem; font-weight: 700; text-decoration: none;
          white-space: nowrap; text-align: center;
          transition: background 0.2s, transform 0.15s;
        }
        .ft-cta-btn-primary:hover { background: #e0f2fe; transform: translateY(-1px); }
        .ft-cta-btn-outline {
          border: 1.5px solid rgba(255,255,255,0.5); color: #ffffff;
          padding: 10px 22px; border-radius: 7px;
          font-size: 0.875rem; font-weight: 600; text-decoration: none;
          white-space: nowrap; text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .ft-cta-btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

        .ft-cta-badges { display: flex; flex-direction: column; gap: 14px; flex-shrink: 0; }
        .ft-cta-badge { display: flex; align-items: center; gap: 12px; }
        .ft-cta-badge-icon {
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ft-cta-badge strong { display: block; font-size: 0.82rem; font-weight: 700; color: #ffffff; line-height: 1.3; }
        .ft-cta-badge span { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.6); }

        /* ── Footer Body ── */
        .ft-body {
          padding: 48px 42px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ft-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
          gap: 40px;
        }

        /* Brand */
        .ft-brand { display: flex; flex-direction: column; gap: 10px; }
        .ft-logo-link { display: inline-block; }
        .ft-logo { height: 50px; width: auto; object-fit: contain; display: block; }
        .ft-legal { font-size: 0.8rem; font-weight: 600; color: #e2e8f0; margin: 0; }
        .ft-sub { font-size: 0.75rem; color: #3b82f6; font-weight: 500; margin: 0; }
        .ft-tagline { font-size: 0.78rem; color: #475569; line-height: 1.65; margin: 4px 0 0; }
        .ft-socials { display: flex; gap: 8px; margin-top: 4px; }
        .ft-social {
          width: 32px; height: 32px; border-radius: 7px;
          background: rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8; text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .ft-social:hover { background: #1d4ed8; color: #fff; }

        /* Columns */
        .ft-col { display: flex; flex-direction: column; gap: 14px; }
        .ft-col-title { font-size: 0.88rem; font-weight: 700; color: #ffffff; margin: 0; }
        .ft-links { list-style: none; display: flex; flex-direction: column; gap: 2px; }
        .ft-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 6px 0;
          font-size: 0.82rem; color: #64748b; text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s;
        }
        .ft-link:hover { color: #ffffff; }
        .ft-link svg { opacity: 0.4; transition: opacity 0.2s, transform 0.2s; }
        .ft-link:hover svg { opacity: 1; transform: translateX(2px); }

        /* Contact column */
        .ft-contact-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .ft-contact-item { display: flex; align-items: flex-start; gap: 10px; }
        .ft-contact-icon {
          width: 26px; height: 26px; border-radius: 6px;
          background: rgba(59,130,246,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: #60a5fa; margin-top: 1px;
        }
        .ft-link-plain {
          font-size: 0.8rem; color: #64748b; text-decoration: none;
          transition: color 0.2s; display: block;
        }
        .ft-link-plain:hover { color: #ffffff; }
        .ft-email-group { display: flex; flex-direction: column; gap: 3px; }
        .ft-addr-label {
          display: block; font-size: 0.68rem; font-weight: 700;
          color: #3b82f6; letter-spacing: 0.08em; margin-bottom: 3px;
        }
        .ft-addr-text { font-size: 0.78rem; color: #64748b; line-height: 1.6; display: block; }

        /* ── Bottom Bar ── */
        .ft-bottom { padding: 14px 42px; background: #060b14; }
        .ft-bottom-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          font-size: 0.78rem; color: #334155;
        }
        .ft-bottom-tagline { color: #334155; }
        .ft-scroll-top {
          width: 36px; height: 36px; border-radius: 50%;
          background: #1d4ed8; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #ffffff; flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
        }
        .ft-scroll-top:hover { background: #2563eb; transform: translateY(-2px); }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ft-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
          .ft-brand { grid-column: 1 / -1; }
          .ft-cta-inner { grid-template-columns: 1fr auto; }
          .ft-cta-badges { display: none; }
        }

        @media (max-width: 768px) {
          .ft-cta { padding: 24px 20px; min-height: unset; }
          .ft-cta-panel { width: 100%; clip-path: none; opacity: 0.4; }
          .ft-cta-inner { grid-template-columns: 1fr; gap: 20px; padding: 0; }
          .ft-cta-btns { flex-direction: row; flex-wrap: wrap; }
          .ft-body { padding: 36px 20px 32px; }
          .ft-inner { grid-template-columns: 1fr 1fr; gap: 28px; }
          .ft-bottom { padding: 12px 20px; }
        }

        @media (max-width: 480px) {
          .ft-inner { grid-template-columns: 1fr; }
          .ft-bottom-inner { flex-direction: column; gap: 8px; text-align: center; }
          .ft-scroll-top { position: fixed; bottom: 20px; right: 20px; z-index: 50; }
        }
      `}</style>
    </footer>
  );
}
