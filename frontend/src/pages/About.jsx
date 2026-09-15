import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'Products' },
  { value: '100+', label: 'Business Clients' },
  { value: '25+', label: 'Technology Categories' },
];

const offerings = [
  {
    img: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=400&q=80',
    title: 'Computing',
    sub: 'Laptops, Desktops, Mini PCs, Monitors',
    link: '/products?category=laptops',
  },
  {
    img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80',
    title: 'Printing',
    sub: 'Printers, Scanners, Multifunction Devices',
    link: '/products?category=printers',
  },
  {
    img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
    title: 'Networking',
    sub: 'Routers, Switches, Access Points, Firewalls',
    link: '/products?category=networking',
  },
  {
    img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
    title: 'Infrastructure',
    sub: 'Servers, Storage, UPS Systems',
    link: '/products',
  },
  {
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    title: 'Accessories',
    sub: 'Keyboards, Mice, Webcams, Headsets, Cables',
    link: '/products?category=accessories',
  },
];

const whyUs = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
    title: 'Genuine Products',
    desc: 'Authentic products from trusted channels.',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>,
    title: 'Competitive Pricing',
    desc: 'Great value without compromising quality.',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    title: 'Wide Product Range',
    desc: 'From individual devices to complete IT infrastructure.',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Business-Focused Solutions',
    desc: 'Tailored to your organisation\'s needs.',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    title: 'Reliable Support',
    desc: 'Assistance before and after your purchase.',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: 'Bulk & Enterprise Procurement',
    desc: 'Helping businesses procure at scale.',
  },
];

const steps = [
  {
    num: '01',
    icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>,
    title: 'Understand',
    desc: 'We listen to your requirements and understand your business goals.',
    top: true,
  },
  {
    num: '02',
    icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Recommend',
    desc: 'We suggest the right products and solutions tailored to your needs and budget.',
    top: false,
  },
  {
    num: '03',
    icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: 'Deliver',
    desc: 'We ensure smooth procurement, timely delivery, and hassle-free deployment.',
    top: true,
  },
  {
    num: '04',
    icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
    title: 'Support',
    desc: 'We remain by your side with reliable support whenever you need us.',
    top: false,
  },
];

const industries = [
  {
    img: '/industry-corporate.png',
    title: 'Corporate & Enterprise',
    desc: 'Driving productivity with reliable technology solutions.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  },
  {
    img: '/industry-healthcare.png',
    title: 'Healthcare',
    desc: 'Technology for better care and healthier communities.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    img: '/industry-education.png',
    title: 'Education',
    desc: 'Enabling smarter learning for a brighter future.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
  {
    img: '/industry-manufacturing.png',
    title: 'Manufacturing',
    desc: 'Powering efficiency through technology.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M12 2v2M4.93 4.93l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M12 20v2m5.66-2.34l-1.41-1.41"/></svg>,
  },
  {
    img: '/industry-retail.png',
    title: 'Retail & SMB',
    desc: 'Smart solutions for growing businesses.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  },
  {
    img: '/industry-government.png',
    title: 'Government & Institutions',
    desc: 'Supporting stronger, more connected communities.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  },
];

export default function About() {
  return (
    <main className="about-page">

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-hero-overlay" />
        <div className="ab-hero-content">
          <div className="ab-hero-left">
            <span className="ab-eyebrow">— ABOUT US</span>
            <h1 className="ab-hero-title">
              Technology That Keeps<br />
              <span className="ab-blue">Business Moving</span>
            </h1>
            <p className="ab-hero-desc">
              Bharat Devices is a trusted technology solutions provider delivering
              reliable computing, printing, networking, infrastructure and electronic
              products for businesses of all sizes.
            </p>
            <Link to="/products" className="ab-hero-cta">Explore Our Products &nbsp;→</Link>
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="ab-section ab-who">
        <div className="ab-who-img-wrap">
          <img src="/about-hero.png" alt="Bharat Devices Office" className="ab-who-img" />
          <div className="ab-who-img-overlay">
            <span>PEOPLE</span>
            <span>PRODUCTS</span>
            <span>SOLUTIONS</span>
            <span className="ab-blue-text">A BRIGHTER TOMORROW</span>
          </div>
        </div>
        <div className="ab-who-text">
          <span className="ab-label">WHO WE ARE</span>
          <h2 className="ab-section-title">Your Trusted<br />Technology Partner</h2>
          <p className="ab-body-text">
            At Bharat Devices, we believe technology should make businesses more productive,
            connected and efficient. We provide a comprehensive range of technology products
            and solutions — from everyday workplace devices to enterprise infrastructure.
            Our focus is simple: offer genuine products from trusted channels, competitive
            pricing and responsive customer support that businesses can rely on.
          </p>
        </div>
        <div className="ab-stats">
          {stats.map((s, i) => (
            <div key={i} className="ab-stat">
              <span className="ab-stat-val">{s.value}</span>
              <span className="ab-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="ab-section ab-offer-section">
        <div className="ab-center-label">
          <span className="ab-label">WHAT WE OFFER</span>
          <h2 className="ab-section-title">Everything You Need. One Technology Partner.</h2>
        </div>
        <div className="ab-offer-grid">
          {offerings.map((o, i) => (
            <Link key={i} to={o.link} className="ab-offer-card">
              <div className="ab-offer-img-wrap">
                <img src={o.img} alt={o.title} className="ab-offer-img" loading="lazy" />
              </div>
              <div className="ab-offer-info">
                <span className="ab-offer-title">{o.title}</span>
                <span className="ab-offer-sub">{o.sub}</span>
              </div>
              <div className="ab-offer-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Bharat Devices ── */}
      <section className="ab-why-section">
        <div className="ab-why-inner">
          <span className="ab-label-light">WHY BHARAT DEVICES</span>
          <h2 className="ab-section-title-light">More Than Products. A Partner You Can Rely On.</h2>
          <div className="ab-why-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="ab-why-card">
                <div className="ab-why-icon">{w.icon}</div>
                <span className="ab-why-title">{w.title}</span>
                <span className="ab-why-desc">{w.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Approach ── */}
      <section className="ap-section">

        {/* Left side panel */}
        <div className="ap-side-panel ap-side-left">
          <div className="ap-side-content ap-side-content-left">
            <h3>Your<br/>Technology<br/>Journey<br/>Starts Here</h3>
            <div className="ap-side-line" />
          </div>
        </div>

        {/* Right side panel */}
        <div className="ap-side-panel ap-side-right">
          <div className="ap-side-content ap-side-content-right">
            <h3>Long-Term<br/>Success<br/>Together</h3>
            <div className="ap-side-line" />
          </div>
        </div>

        <div className="ap-container">

          {/* Header */}
          <div className="ap-heading">
            <div className="ap-eyebrow">Our Approach</div>
            <h2 className="ap-title">
              From Understanding to <span className="ap-blue">Ongoing Support</span>
            </h2>
            <p className="ap-subtitle">
              A simple, transparent and collaborative approach to help you find
              the right technology solutions for your business.
            </p>
          </div>

          {/* Mobile-only side panels (between heading and steps) */}
          <div className="ap-mobile-panels">
            <div className="ap-mobile-panel ap-mobile-panel-left">
              <div className="ap-side-content ap-side-content-left">
                <h3>Your<br/>Technology<br/>Journey<br/>Starts Here</h3>
                <div className="ap-side-line" />
              </div>
            </div>
            <div className="ap-mobile-panel ap-mobile-panel-right">
              <div className="ap-side-content ap-side-content-right">
                <h3>Long-Term<br/>Success<br/>Together</h3>
                <div className="ap-side-line" />
              </div>
            </div>
          </div>

          {/* Journey */}
          <div className="ap-journey">

            {/* Curved SVG path */}
            <svg className="ap-path-svg" viewBox="0 0 980 480" preserveAspectRatio="none">
              <path className="ap-path-main"
                d="M0,116 C140,116 200,364 375,364 C490,364 560,116 606,116 C680,116 750,364 837,364 C900,364 980,364 980,364" />
              <path className="ap-path-inner"
                d="M0,116 C140,116 200,364 375,364 C490,364 560,116 606,116 C680,116 750,364 837,364 C900,364 980,364 980,364" />
            </svg>

            {/* Steps */}
            <div className="ap-steps">
              {steps.map((s, i) => (
                <div key={i} className="ap-step">
                  <div className="ap-step-num">{s.num}</div>
                  <div className="ap-icon-circle">{s.icon}</div>
                  <div className="ap-step-dot" />
                  <div className="ap-step-card">
                    <h3 className="ap-card-title">{s.title}</h3>
                    <p className="ap-card-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Benefits */}
          <div className="ap-benefits">
            <div className="ap-benefit">
              <div className="ap-benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 12l3 3 5-6"/>
                  <path d="M20 12c0 5-3.5 8-8 10C7.5 20 4 17 4 12V6l8-3 8 3z"/>
                </svg>
              </div>
              <h3>A Trusted Partner<br/>at Every Step</h3>
            </div>
            <div className="ap-benefit">
              <div className="ap-benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>
                  <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2"/>
                </svg>
              </div>
              <h3>Focused on<br/>Your Business Goals</h3>
            </div>
            <div className="ap-benefit">
              <div className="ap-benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20V10M10 20V6M16 20V3M22 20H2"/>
                </svg>
              </div>
              <h3>Enabling<br/>Long-Term Growth</h3>
            </div>
          </div>

        </div>
      </section>

      {/* ── Industries ── */}
      <section className="ab-industries-section">
        <div className="ab-ind-header">
          <div className="ab-ind-eyebrow">
            <span className="ab-ind-line" />
            <span className="ab-ind-eyebrow-text">TECHNOLOGY FOR</span>
            <span className="ab-ind-line" />
          </div>
          <h2 className="ab-ind-title">Every <span className="ab-ind-blue">Industry</span></h2>
          <p className="ab-ind-subtitle">
            Reliable technology solutions tailored to the unique needs of every business.<br />
            Empowering industries. Enabling progress.
          </p>
        </div>
        <div className="ab-industry-grid">
          {industries.map((ind, i) => (
            <div key={i} className="ab-industry-card">
              <div className="ab-industry-img-wrap">
                <img src={ind.img} alt={ind.title} className="ab-industry-img" loading="lazy" />
                <div className="ab-industry-img-overlay" />
              </div>
              <div className="ab-industry-icon-wrap">
                <div className="ab-industry-icon">{ind.icon}</div>
              </div>
              <div className="ab-industry-body">
                <span className="ab-industry-title">{ind.title}</span>
                <span className="ab-industry-desc">{ind.desc}</span>
                <div className="ab-industry-dash" />
              </div>
            </div>
          ))}
        </div>
        <div className="ab-ind-footer">
          <span className="ab-ind-line" />
          <span className="ab-ind-footer-text">DIFFERENT INDUSTRIES. A BRIGHTER TOMORROW.</span>
          <span className="ab-ind-line" />
        </div>
      </section>

      <style>{`
        .about-page { background: #f8fafc; }

        /* ── Hero ── */
        .ab-hero {
          position: relative;
          height: 420px;
          overflow: hidden;
          background: #0b1628;
        }
        .ab-hero-bg {
          position: absolute; inset: 0;
          background: url('/about-hero.png') center/cover no-repeat;
          filter: brightness(0.45);
        }
        .ab-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(100deg, rgba(11,22,40,0.95) 40%, rgba(11,22,40,0.4) 100%);
        }
        .ab-hero-content {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 0 1.5rem;
          height: 100%;
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem;
        }
        .ab-hero-left { display: flex; flex-direction: column; gap: 1rem; max-width: 540px; }
        .ab-eyebrow { font-size: 0.8rem; font-weight: 600; color: #3b82f6; letter-spacing: 0.05em; }
        .ab-hero-title {
          font-size: clamp(1.8rem, 3.5vw, 2.75rem);
          font-weight: 800; color: #ffffff; line-height: 1.2;
        }
        .ab-blue { color: #3b82f6; }
        .ab-blue-text { color: #3b82f6 !important; }
        .ab-hero-desc { color: #94a3b8; font-size: 0.9rem; line-height: 1.65; }
        .ab-hero-cta {
          display: inline-flex; align-items: center;
          background: #1d4ed8; color: #fff;
          padding: 0.7rem 1.5rem; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600; text-decoration: none;
          width: fit-content; transition: background 0.2s;
        }
        .ab-hero-cta:hover { background: #1e40af; }
        .ab-hero-right { flex-shrink: 0; }
        .ab-hero-badge {
          background: rgba(255,255,255,0.95);
          border-radius: 14px; padding: 1.25rem 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .ab-hero-badge-icon {
          width: 56px; height: 56px; background: #eff6ff;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ab-badge-name { display: block; font-size: 1rem; font-weight: 800; color: #1e293b; }
        .ab-badge-sub { display: block; font-size: 0.72rem; color: #64748b; margin-top: 2px; }

        /* ── Shared ── */
        .ab-section {
          background: #ffffff; padding: 3.5rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .ab-label {
          font-size: 0.72rem; font-weight: 700; color: #1d4ed8;
          letter-spacing: 0.1em; text-transform: uppercase; display: block;
          margin-bottom: 0.5rem;
        }
        .ab-label-light {
          font-size: 0.72rem; font-weight: 700; color: #93c5fd;
          letter-spacing: 0.1em; text-transform: uppercase; display: block;
          margin-bottom: 0.5rem;
        }
        .ab-section-title {
          font-size: clamp(1.3rem, 2.5vw, 1.85rem);
          font-weight: 800; color: #1e293b; line-height: 1.25;
        }
        .ab-section-title-light {
          font-size: clamp(1.3rem, 2.5vw, 1.85rem);
          font-weight: 800; color: #ffffff; line-height: 1.25;
        }
        .ab-body-text { font-size: 0.9rem; color: #64748b; line-height: 1.7; }
        .ab-outline-btn {
          display: inline-flex; align-items: center;
          border: 1.5px solid #1d4ed8; color: #1d4ed8;
          padding: 0.6rem 1.25rem; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600; text-decoration: none;
          width: fit-content; transition: background 0.2s, color 0.2s;
        }
        .ab-outline-btn:hover { background: #1d4ed8; color: #fff; }
        .ab-center-label { text-align: center; margin-bottom: 2rem; }

        /* ── Who We Are ── */
        .ab-who {
          display: grid;
          grid-template-columns: 1fr 1.1fr auto;
          gap: 2.5rem; align-items: center;
          max-width: 1280px; margin: 0 auto;
          padding: 3.5rem 1.5rem;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
        }
        .ab-who-img-wrap { position: relative; border-radius: 14px; overflow: hidden; }
        .ab-who-img { width: 100%; height: 320px; object-fit: cover; display: block; }
        .ab-who-img-overlay {
          position: absolute; inset: 0;
          background: rgba(11,22,40,0.72);
          display: flex; flex-direction: column;
          align-items: flex-start; justify-content: center;
          padding: 2rem 1.5rem; gap: 0.4rem;
        }
        .ab-who-img-overlay span {
          font-size: 1rem; font-weight: 800; color: #ffffff;
          letter-spacing: 0.05em;
        }
        .ab-who-text { display: flex; flex-direction: column; gap: 1rem; }
        .ab-stats {
          display: flex; flex-direction: column; gap: 1.25rem;
          min-width: 160px;
        }
        .ab-stat { display: flex; flex-direction: column; gap: 1px; }
        .ab-stat-val { font-size: 1.85rem; font-weight: 800; color: #1d4ed8; line-height: 1; }
        .ab-stat-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }

        /* ── What We Offer ── */
        .ab-offer-section {
          background: #f8fafc;
          max-width: 100%; padding: 3.5rem 1.5rem;
        }
        .ab-offer-grid {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem;
        }
        .ab-offer-card {
          background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
          overflow: hidden; text-decoration: none;
          transition: box-shadow 0.2s, transform 0.2s;
          display: flex; flex-direction: column;
        }
        .ab-offer-card:hover { box-shadow: 0 6px 20px rgba(29,78,216,0.1); transform: translateY(-3px); border-color: #1d4ed8; }
        .ab-offer-img-wrap { height: 140px; overflow: hidden; }
        .ab-offer-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .ab-offer-card:hover .ab-offer-img { transform: scale(1.05); }
        .ab-offer-info { padding: 0.85rem 0.85rem 0.5rem; flex: 1; }
        .ab-offer-title { display: block; font-size: 0.875rem; font-weight: 700; color: #1e293b; }
        .ab-offer-sub { display: block; font-size: 0.73rem; color: #64748b; margin-top: 0.25rem; line-height: 1.4; }
        .ab-offer-arrow {
          padding: 0.5rem 0.85rem 0.85rem;
          display: flex; align-items: center; justify-content: flex-end;
        }

        /* ── Why Bharat Devices ── */
        .ab-why-section { background: #0f1f38; padding: 3.5rem 1.5rem; }
        .ab-why-inner { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
        .ab-why-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; }
        .ab-why-card {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 1.25rem 1rem;
          display: flex; flex-direction: column; gap: 0.6rem;
          transition: background 0.2s;
        }
        .ab-why-card:hover { background: rgba(255,255,255,0.1); }
        .ab-why-icon {
          width: 46px; height: 46px; background: rgba(59,130,246,0.15);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .ab-why-title { font-size: 0.875rem; font-weight: 700; color: #ffffff; }
        .ab-why-desc { font-size: 0.75rem; color: #94a3b8; line-height: 1.5; }

        /* ── Approach (exact spec) ── */
        .ap-section {
          position: relative;
          min-height: 780px;
          padding: 35px 0 30px;
          overflow: hidden;
          background: radial-gradient(circle at 50% 40%,
            rgba(222,238,255,0.8) 0%, rgba(248,251,255,0.95) 38%, #eef5ff 100%);
        }
        .ap-section::before {
          content: ''; position: absolute;
          width: 600px; height: 600px; left: -300px; top: -200px;
          border-radius: 50%; background: rgba(29,105,219,0.07); filter: blur(10px);
        }
        .ap-section::after {
          content: ''; position: absolute;
          width: 500px; height: 500px; right: -250px; bottom: -250px;
          border-radius: 50%; background: rgba(44,123,235,0.06);
        }
        .ap-container {
          width: min(1500px, 94%); margin: auto; position: relative; z-index: 2;
        }

        /* Header */
        .ap-heading { text-align: center; position: relative; z-index: 5; margin-bottom: 28px; }
        .ap-eyebrow {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          font-size: 15px; font-weight: 700; letter-spacing: 5px;
          color: #19376b; text-transform: uppercase; margin-bottom: 17px;
        }
        .ap-eyebrow::before, .ap-eyebrow::after {
          content: ''; width: 57px; height: 2px; background: #1875ed;
        }
        .ap-title {
          font-size: clamp(38px, 4vw, 54px); line-height: 1.08;
          font-weight: 800; letter-spacing: -1.8px; color: #122e60;
        }
        .ap-blue { color: #0875ee; }
        .ap-subtitle {
          max-width: 720px; margin: 15px auto 0;
          font-size: 18px; line-height: 1.5; color: #38537d;
        }

        /* Side panels */
        .ap-side-panel {
          position: absolute; top: 85px;
          width: 355px; height: 535px; overflow: hidden; z-index: 1;
          background-size: cover; background-position: center;
        }
        .ap-side-panel::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(4,34,74,0.15), rgba(5,38,82,0.65));
        }
        .ap-side-left {
          left: -25px; border-radius: 0 38px 38px 0;
          background-image: url('/approach-left.png');
          clip-path: polygon(0 0, 82% 6%, 100% 100%, 0 100%);
        }
        .ap-side-right {
          right: -25px; border-radius: 38px 0 0 38px;
          background-image: url('/approach-right.png');
          clip-path: polygon(18% 6%, 100% 0, 100% 100%, 0 100%);
        }
        .ap-side-content {
          position: absolute; z-index: 3; color: white; padding: 75px 50px;
        }
        .ap-side-content-left { left: 30px; }
        .ap-side-content-right { right: 25px; text-align: center; }
        .ap-side-content h3 {
          font-size: 21px; line-height: 1.55; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .ap-side-line { width: 62px; height: 3px; background: #2685ee; margin-top: 20px; }

        /* Mobile panels (hidden on desktop) */
        .ap-mobile-panels { display: none; }

        /* Journey */
        .ap-journey {
          position: relative;
          width: 900px; max-width: 74%; margin: 0 auto; height: 480px;
        }

        /* SVG wave path */
        .ap-path-svg {
          position: absolute; top: 0; left: -40px;
          width: calc(100% + 80px); height: 100%;
          z-index: 1; pointer-events: none;
        }
        .ap-path-main {
          fill: none; stroke: rgba(168,210,255,0.7); stroke-width: 38; stroke-linecap: round;
        }
        .ap-path-inner {
          fill: none; stroke: #5ba3f5; stroke-width: 2.5;
          stroke-dasharray: 8 7; stroke-linecap: round;
        }

        /* Steps grid */
        .ap-steps {
          position: relative; z-index: 3;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 24px; padding-top: 0; height: 100%;
        }
        .ap-step {
          position: relative; text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .ap-step:nth-child(even) { flex-direction: column-reverse; }
        .ap-step-num {
          font-size: 62px; line-height: 1; font-weight: 800;
          color: rgba(8,117,238,0.15); flex-shrink: 0;
        }
        .ap-icon-circle {
          width: 104px; height: 104px; margin: 0 auto;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; background: #ffffff;
          box-shadow: 0 8px 28px rgba(8,117,238,0.20), 0 0 0 8px rgba(8,117,238,0.07);
          color: #0875ee; flex-shrink: 0;
        }
        .ap-icon-circle svg { width: 43px; height: 43px; stroke: currentColor; }
        .ap-step-dot {
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; border: 5px solid #0875ee;
          margin: 10px auto; flex-shrink: 0;
          position: relative; z-index: 5;
          box-shadow: 0 0 0 4px rgba(8,117,238,0.14);
        }

        /* Step card */
        .ap-step-card {
          background: #ffffff; width: 100%; flex-shrink: 0;
          padding: 18px 18px 22px;
          box-shadow: 0 8px 28px rgba(8,117,238,0.10), 0 2px 6px rgba(0,0,0,0.04);
          border: 1px solid rgba(8,117,238,0.10);
        }
        .ap-step:nth-child(odd) .ap-step-card {
          border-top: 3px solid #0875ee; border-radius: 0 0 16px 16px;
        }
        .ap-step:nth-child(even) .ap-step-card {
          border-bottom: 3px solid #0875ee; border-radius: 16px 16px 0 0;
        }
        .ap-card-title { font-size: 19px; margin-bottom: 10px; color: #102f64; font-weight: 800; }
        .ap-card-desc { font-size: 15px; line-height: 1.5; color: #385477; }

        /* Benefits bar */
        .ap-benefits {
          position: relative; z-index: 5;
          width: 84%; margin: 10px auto 0;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(171,205,242,0.35);
          border-radius: 22px; box-shadow: 0 10px 35px rgba(35,91,150,0.08);
          display: grid; grid-template-columns: repeat(3, 1fr);
          min-height: 105px;
        }
        .ap-benefit {
          display: flex; align-items: center; justify-content: center;
          gap: 18px; padding: 20px 30px; position: relative;
        }
        .ap-benefit:not(:last-child)::after {
          content: ''; position: absolute; right: 0; top: 25%;
          height: 50%; width: 1px; background: #d8e6f8;
        }
        .ap-benefit-icon {
          width: 48px; height: 48px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #0875ee;
        }
        .ap-benefit-icon svg { width: 42px; height: 42px; stroke: currentColor; }
        .ap-benefit h3 { font-size: 17px; line-height: 1.3; color: #103773; font-weight: 600; }

        /* ── Industries ── */
        .ab-industries-section {
          background: linear-gradient(160deg, #0a1628 0%, #0d2044 50%, #0a1628 100%);
          padding: 4rem 1.5rem 2.5rem;
        }
        .ab-ind-header { text-align: center; margin-bottom: 2.5rem; }
        .ab-ind-eyebrow {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; margin-bottom: 0.75rem;
        }
        .ab-ind-line {
          flex: 1; max-width: 60px; height: 1.5px;
          background: linear-gradient(90deg, transparent, #e07b3c);
        }
        .ab-ind-eyebrow .ab-ind-line:last-child {
          background: linear-gradient(90deg, #e07b3c, transparent);
        }
        .ab-ind-eyebrow-text {
          font-size: 0.75rem; font-weight: 700; color: #e07b3c;
          letter-spacing: 0.18em; text-transform: uppercase;
        }
        .ab-ind-title {
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 800; color: #ffffff; line-height: 1.15;
        }
        .ab-ind-blue { color: #3b82f6; }
        .ab-ind-subtitle {
          font-size: 0.9rem; color: #94a3b8; line-height: 1.65;
          margin-top: 0.75rem;
        }
        .ab-industry-grid {
          max-width: 1340px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.85rem;
        }
        .ab-industry-card {
          display: flex; flex-direction: column;
          background: #0d1b30; border-radius: 14px;
          overflow: hidden; cursor: default;
          border: 1.5px solid rgba(96,165,250,0.28);
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .ab-industry-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(59,130,246,0.2);
          border-color: rgba(96,165,250,0.6);
        }
        .ab-industry-img-wrap { position: relative; height: 200px; overflow: hidden; }
        .ab-industry-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.35s; }
        .ab-industry-card:hover .ab-industry-img { transform: scale(1.06); }
        .ab-industry-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(10,22,40,0.05) 50%, rgba(10,22,40,0.65) 100%);
        }
        .ab-industry-icon-wrap {
          display: flex; justify-content: center;
          margin-top: -22px; position: relative; z-index: 2;
        }
        .ab-industry-icon {
          width: 44px; height: 44px;
          background: #1d4ed8; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 3px solid #0d1b30;
          box-shadow: 0 4px 16px rgba(29,78,216,0.5);
        }
        .ab-industry-body {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 0.75rem 0.85rem 1.25rem; gap: 0.35rem;
        }
        .ab-industry-title { font-size: 0.875rem; font-weight: 800; color: #ffffff; line-height: 1.3; }
        .ab-industry-desc { font-size: 0.75rem; color: #94a3b8; line-height: 1.5; }
        .ab-industry-dash { width: 40px; height: 3px; background: linear-gradient(90deg, #1d4ed8, #60a5fa); border-radius: 3px; margin-top: 0.7rem; }
        .ab-ind-footer {
          display: flex; align-items: center; justify-content: center;
          gap: 1rem; margin-top: 2.5rem;
        }
        .ab-ind-footer .ab-ind-line {
          flex: 1; max-width: 120px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2));
        }
        .ab-ind-footer .ab-ind-line:last-child {
          background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);
        }
        .ab-ind-footer-text {
          font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.3);
          letter-spacing: 0.15em; white-space: nowrap;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ab-who { grid-template-columns: 1fr 1fr; }
          .ab-stats { flex-direction: row; flex-wrap: wrap; grid-column: 1 / -1; }
          .ab-why-grid { grid-template-columns: repeat(3, 1fr); }
          .ab-offer-grid { grid-template-columns: repeat(3, 1fr); }
          .ab-industry-grid { grid-template-columns: repeat(3, 1fr); }
          .ab-industry-img-wrap { height: 160px; }
        }

        @media (max-width: 768px) {
          .ab-hero { height: auto; padding: 2.5rem 0; }
          .ab-hero-content { flex-direction: column; align-items: flex-start; padding: 2rem 1rem; }
          .ab-hero-right { display: none; }
          .ab-who { grid-template-columns: 1fr; padding: 2rem 1rem; }
          .ab-who-img { height: 220px; }
          .ab-why-grid { grid-template-columns: repeat(2, 1fr); }
          .ab-offer-grid { grid-template-columns: repeat(2, 1fr); }
          .ab-industry-grid { grid-template-columns: repeat(2, 1fr); }
          .ab-ind-subtitle br { display: none; }
          /* Approach mobile layout (Image #34) */
          .ap-section { min-height: unset; padding: 32px 0 36px; }
          .ap-side-panel { display: none; }
          .ap-mobile-panels {
            display: flex; gap: 10px; margin: 20px 16px 24px;
          }
          .ap-mobile-panel {
            flex: 1; height: 190px; border-radius: 16px;
            background-size: cover; background-position: center;
            position: relative; overflow: hidden;
          }
          .ap-mobile-panel::after {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(180deg, rgba(4,34,74,0.15), rgba(5,38,82,0.70));
          }
          .ap-mobile-panel .ap-side-content {
            padding: 20px 16px; position: absolute; z-index: 3; color: #fff;
          }
          .ap-mobile-panel .ap-side-content h3 {
            font-size: 13px; font-weight: 600; letter-spacing: 1.5px;
            line-height: 1.6; text-transform: uppercase;
          }
          .ap-mobile-panel .ap-side-line { width: 38px; }
          .ap-mobile-panel-left { background-image: url('/approach-left.png'); }
          .ap-mobile-panel-right { background-image: url('/approach-right.png'); }

          /* Steps — vertical list (Image #34) */
          .ap-journey { width: 100%; max-width: 100%; height: auto; }
          .ap-path-svg { display: none; }
          .ap-steps {
            grid-template-columns: 1fr; gap: 14px;
            padding: 0 16px; height: auto; position: relative;
          }
          .ap-steps::before {
            content: ''; position: absolute;
            left: calc(16px + 37px); top: 74px; bottom: 74px;
            width: 2.5px; border-left: 2.5px dashed rgba(8,117,238,0.35);
            z-index: 0;
          }
          .ap-step, .ap-step:nth-child(even) {
            display: grid !important; flex-direction: unset !important;
            grid-template-columns: 74px 1fr;
            grid-template-rows: auto auto auto;
            column-gap: 14px; align-items: start;
          }
          .ap-step-num {
            grid-column: 1; grid-row: 1;
            font-size: 40px !important; text-align: center; margin: 0;
          }
          .ap-icon-circle {
            grid-column: 1; grid-row: 2;
            width: 66px !important; height: 66px !important;
            margin: 0 auto; position: relative; z-index: 2;
          }
          .ap-icon-circle svg { width: 30px !important; height: 30px !important; }
          .ap-step-dot {
            grid-column: 1; grid-row: 3;
            margin: 8px auto 0 !important;
          }
          .ap-step-card {
            grid-column: 2; grid-row: 1 / 4;
            align-self: center;
            border-radius: 14px !important;
            border-top: none !important; border-bottom: none !important;
            border-left: 3px solid #0875ee !important;
            padding: 14px 16px !important;
            text-align: left; min-height: unset !important;
          }
          .ap-card-title { font-size: 16px !important; margin-bottom: 6px !important; }
          .ap-card-desc { font-size: 14px !important; }

          /* Benefits — 3 columns on mobile */
          .ap-benefits {
            width: 100%; grid-template-columns: repeat(3,1fr); margin-top: 20px;
          }
          .ap-benefit { padding: 14px 8px; gap: 8px; flex-direction: column; text-align: center; }
          .ap-benefit:not(:last-child)::after { height: 70%; top: 15%; }
          .ap-benefit-icon { width: 36px; height: 36px; }
          .ap-benefit-icon svg { width: 30px; height: 30px; }
          .ap-benefit h3 { font-size: 12px; }
          .ap-title { font-size: clamp(26px, 6vw, 38px); }
          .ap-subtitle { font-size: 15px; padding: 0 8px; }
        }

        @media (max-width: 480px) {
          .ab-why-grid { grid-template-columns: 1fr 1fr; }
          .ab-offer-grid { grid-template-columns: 1fr 1fr; }
          .ab-industry-grid { grid-template-columns: 1fr 1fr; }
          .ab-section { padding: 2rem 1rem; }
          .ab-offer-section { padding: 2rem 1rem; }
          .ap-section { padding: 1.5rem 0 2rem; }
          .ap-mobile-panels { gap: 8px; margin: 16px 12px 20px; }
          .ap-mobile-panel { height: 160px; }
          .ap-benefit { padding: 12px 6px; }
          .ap-benefit h3 { font-size: 11px; }
          .ab-industries-section { padding: 2.5rem 1rem 2rem; }
        }
      `}</style>
    </main>
  );
}
