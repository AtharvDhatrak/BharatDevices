import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', requirement: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="ct-page">

      {/* ── Hero ── */}
      <section className="ct-hero">
        <div className="ct-hero-bg" />
        <div className="ct-hero-overlay" />
        <div className="ct-hero-inner">
          <div className="ct-hero-left">
            <div className="ct-eyebrow">
              <span className="ct-eyebrow-line ct-orange" />
              CONTACT US
              <span className="ct-eyebrow-line ct-green" />
            </div>
            <h1 className="ct-hero-title">Let's Talk <span className="ct-blue">Technology</span></h1>
            <p className="ct-hero-sub">
              Have a question, need a quote, or looking for the right solution?<br />
              Our team is here to help you.
            </p>
            <div className="ct-hero-badges">
              <span className="ct-hbadge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                Trusted Support
              </span>
              <span className="ct-hbadge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Quick Response
              </span>
              <span className="ct-hbadge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Dedicated Team
              </span>
              <span className="ct-hbadge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                Business Focused
              </span>
            </div>
          </div>
          <div className="ct-hero-right">
            <div className="ct-hero-img-wrap">
              <img src="/about-hero.png" alt="Bharat Devices Office" className="ct-hero-img" />
              <div className="ct-hero-img-overlay" />
              <div className="ct-hero-brand">
                <div className="ct-brand-logo">
                  <span className="ct-brand-name">BHARAT<br/>DEVICES</span>
                  <span className="ct-brand-tm">™</span>
                </div>
              </div>
              <div className="ct-hero-tagline-box">
                PEOPLE<br/>TECHNOLOGY<br/>SOLUTIONS<br/>A BRIGHTER<br/>TOMORROW
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Contact Cards ── */}
      <section className="ct-quick">
        <div className="ct-quick-inner">
          <div className="ct-qcard">
            <div className="ct-qcard-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="ct-qcard-body">
              <h3>Visit Our Office</h3>
              <p>Akshar Business Park, J Wing C2,<br/>Sector 25, Vashi, Navi Mumbai – 400703</p>
            </div>
            <div className="ct-qcard-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
          <div className="ct-qcard">
            <div className="ct-qcard-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className="ct-qcard-body">
              <h3>Email Us</h3>
              <p>
                <a href="mailto:sales@bharatdevices.com">sales@bharatdevices.com</a><br/>
                <a href="mailto:hr@bharatdevices.com">hr@bharatdevices.com</a>
                <span className="ct-email-sep"> | </span>
                <a href="mailto:aback@bharatdevices.com">aback@bharatdevices.com</a>
              </p>
            </div>
            <div className="ct-qcard-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
          <div className="ct-qcard">
            <div className="ct-qcard-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="ct-qcard-body">
              <h3>Call Us</h3>
              <p>
                <a href="tel:+918308649907" className="ct-phone">+91 83086 49907</a><br/>
                <span className="ct-hours">Mon - Sat, 9:30 AM – 6:30 PM</span>
              </p>
            </div>
            <div className="ct-qcard-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Middle: Locations + Form ── */}
      <section className="ct-mid">
        <div className="ct-mid-inner">

          {/* Locations */}
          <div className="ct-locations">
            <div className="ct-loc-eyebrow">
              <span className="ct-loc-line" />OUR LOCATIONS
            </div>
            <h2 className="ct-loc-title">Two Locations.<br/><span className="ct-blue">One Commitment.</span></h2>
            <p className="ct-loc-sub">
              Visit our offices or get in touch with our team. We're always ready
              to discuss how Bharat Devices can support your business.
            </p>
            <div className="ct-addr-card">
              <div className="ct-addr-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
              </div>
              <div className="ct-addr-body">
                <h4>Registered Address</h4>
                <p className="ct-addr-company">BHARAT ELECTROAI PRIVATE LIMITED</p>
                <p>VO-852, WeWork 247 Park, 13th Floor,<br/>Vikhroli Corporate Park, LBS Road,<br/>Vikhroli West, Mumbai – 400079,<br/>Maharashtra, India</p>
              </div>
              <div className="ct-addr-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
            <div className="ct-addr-card">
              <div className="ct-addr-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
              </div>
              <div className="ct-addr-body">
                <h4>Office Address</h4>
                <p className="ct-addr-company">BHARAT ELECTROAI PRIVATE LIMITED</p>
                <p>Akshar Business Park, J Wing C2,<br/>Sector 25, Vashi,<br/>Navi Mumbai – 400703</p>
              </div>
              <div className="ct-addr-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="ct-form-col">
            <div className="ct-form-eyebrow">
              <span className="ct-loc-line" />SEND US A MESSAGE
            </div>
            <h2 className="ct-form-title">Request a Quote</h2>
            <p className="ct-form-sub">Tell us about your requirement and our team will get back to you shortly.</p>

            {submitted ? (
              <div className="ct-success">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h3>Thank you! We'll be in touch soon.</h3>
              </div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit}>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label>Full Name <span className="ct-req">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange}
                      placeholder="Enter your full name" required />
                  </div>
                  <div className="ct-field">
                    <label>Work Email <span className="ct-req">*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="Enter your work email" required />
                  </div>
                </div>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label>Phone Number <span className="ct-req">*</span></label>
                    <div className="ct-phone-wrap">
                      <span className="ct-phone-prefix">
                        <img src="https://flagcdn.com/w20/in.png" alt="IN" width="20" height="14" />
                        +91
                      </span>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        placeholder="Enter phone number" required className="ct-phone-input" />
                    </div>
                  </div>
                  <div className="ct-field">
                    <label>Company Name <span className="ct-req">*</span></label>
                    <input name="company" value={form.company} onChange={handleChange}
                      placeholder="Enter your company name" required />
                  </div>
                </div>
                <div className="ct-field ct-field-full">
                  <label>Your Requirement <span className="ct-req">*</span></label>
                  <textarea name="requirement" value={form.requirement} onChange={handleChange}
                    placeholder="Tell us about your requirement (products, quantity, timeline, etc.)"
                    rows="4" required />
                </div>
                <button type="submit" className="ct-submit">Send Enquiry &nbsp;→</button>
                <p className="ct-privacy">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Your information is safe with us. We respect your privacy.
                </p>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="ct-trust">
        <div className="ct-trust-inner">
          <div className="ct-trust-item">
            <div className="ct-trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <div><h4>Genuine Products</h4><p>Sourced through trusted channels</p></div>
          </div>
          <div className="ct-trust-sep" />
          <div className="ct-trust-item">
            <div className="ct-trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
            </div>
            <div><h4>Competitive Pricing</h4><p>Value for your business</p></div>
          </div>
          <div className="ct-trust-sep" />
          <div className="ct-trust-item">
            <div className="ct-trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div><h4>Wide Product Range</h4><p>From devices to infrastructure</p></div>
          </div>
          <div className="ct-trust-sep" />
          <div className="ct-trust-item">
            <div className="ct-trust-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            </div>
            <div><h4>Reliable Support</h4><p>Before and after your purchase</p></div>
          </div>
          <div className="ct-trust-brand">
            TECHNOLOGY<br/>FOR A BRIGHTER<br/>TOMORROW
          </div>
        </div>
      </section>

      <style>{`
        .ct-page { background: #f8fafc; font-family: inherit; }

        /* ── Hero ── */
        .ct-hero {
          position: relative; min-height: 340px; overflow: hidden;
          background: #07152b;
        }
        .ct-hero-bg {
          position: absolute; inset: 0;
          background: url('/about-hero.png') center/cover no-repeat;
          opacity: 0.22;
        }
        .ct-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(100deg, rgba(7,21,43,0.97) 45%, rgba(7,21,43,0.55) 100%);
        }
        .ct-hero-inner {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: stretch; min-height: 340px;
        }
        .ct-hero-left {
          padding: 52px 48px 52px 32px;
          display: flex; flex-direction: column; gap: 18px;
        }
        .ct-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; font-weight: 700; letter-spacing: 4px;
          color: #94a3b8; text-transform: uppercase;
        }
        .ct-eyebrow-line { height: 2px; width: 32px; border-radius: 2px; }
        .ct-orange { background: #f97316; }
        .ct-green { background: #22c55e; }
        .ct-hero-title {
          font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900;
          color: #ffffff; line-height: 1.1; letter-spacing: -1px; margin: 0;
        }
        .ct-blue { color: #3b82f6; }
        .ct-hero-sub {
          font-size: 1rem; color: #94a3b8; line-height: 1.65; margin: 0;
        }
        .ct-hero-badges {
          display: flex; flex-wrap: wrap; gap: 8px 16px;
        }
        .ct-hbadge {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.82rem; font-weight: 600; color: #cbd5e1;
        }
        .ct-hbadge svg { color: #60a5fa; flex-shrink: 0; }

        /* Hero right */
        .ct-hero-right { position: relative; overflow: hidden; }
        .ct-hero-img-wrap { position: relative; width: 100%; height: 100%; min-height: 340px; }
        .ct-hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ct-hero-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(7,21,43,0.9) 0%, rgba(7,21,43,0.3) 60%, rgba(7,21,43,0.1) 100%);
        }
        .ct-hero-brand {
          position: absolute; top: 28px; left: 32px; z-index: 3;
          display: flex; align-items: flex-start; gap: 4px;
        }
        .ct-brand-name {
          font-size: 1.1rem; font-weight: 900; color: #ffffff;
          letter-spacing: 1px; line-height: 1.2;
        }
        .ct-brand-tm { font-size: 0.65rem; color: #94a3b8; margin-top: 2px; }
        .ct-hero-tagline-box {
          position: absolute; bottom: 32px; right: 24px; z-index: 3;
          font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.7);
          text-align: right; letter-spacing: 1.5px; line-height: 1.8;
          text-transform: uppercase;
        }

        /* ── Quick Contact Cards ── */
        .ct-quick {
          background: #ffffff;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          position: relative; z-index: 10;
        }
        .ct-quick-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 32px;
          display: grid; grid-template-columns: repeat(3, 1fr);
        }
        .ct-qcard {
          display: flex; align-items: center; gap: 18px;
          padding: 24px 20px; border-right: 1px solid #f1f5f9;
          cursor: default; transition: background 0.2s;
        }
        .ct-qcard:last-child { border-right: none; }
        .ct-qcard:hover { background: #f8fafc; }
        .ct-qcard-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: #1d4ed8; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ct-qcard-body { flex: 1; }
        .ct-qcard-body h3 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .ct-qcard-body p { font-size: 0.8rem; color: #64748b; line-height: 1.5; margin: 0; }
        .ct-qcard-body a { color: #1d4ed8; text-decoration: none; }
        .ct-qcard-body a:hover { text-decoration: underline; }
        .ct-email-sep { color: #94a3b8; margin: 0 2px; }
        .ct-phone { font-size: 1rem; font-weight: 700; color: #1d4ed8 !important; }
        .ct-hours { color: #64748b; font-size: 0.78rem; }
        .ct-qcard-arrow {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #e2e8f0; display: flex; align-items: center;
          justify-content: center; color: #1d4ed8; flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .ct-qcard:hover .ct-qcard-arrow { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }

        /* ── Middle ── */
        .ct-mid { background: #f8fafc; padding: 56px 0 60px; }
        .ct-mid-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 32px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;
        }

        /* Locations */
        .ct-loc-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; letter-spacing: 4px;
          color: #64748b; text-transform: uppercase; margin-bottom: 16px;
        }
        .ct-loc-line { display: inline-block; width: 28px; height: 2px; background: #f97316; border-radius: 2px; }
        .ct-form-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; letter-spacing: 4px;
          color: #1d4ed8; text-transform: uppercase; margin-bottom: 14px;
        }
        .ct-loc-title {
          font-size: clamp(1.5rem, 2.5vw, 2.1rem); font-weight: 900;
          color: #0f172a; line-height: 1.2; margin-bottom: 14px;
        }
        .ct-loc-sub { font-size: 0.9rem; color: #64748b; line-height: 1.65; margin-bottom: 28px; }

        .ct-addr-card {
          display: flex; align-items: flex-start; gap: 16px;
          background: #ffffff; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 20px 18px;
          margin-bottom: 14px; cursor: default;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .ct-addr-card:hover { box-shadow: 0 4px 20px rgba(29,78,216,0.08); border-color: #bfdbfe; }
        .ct-addr-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: #eff6ff; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .ct-addr-body { flex: 1; }
        .ct-addr-body h4 { font-size: 0.88rem; font-weight: 700; color: #1d4ed8; margin-bottom: 3px; }
        .ct-addr-company { font-size: 0.75rem; font-weight: 600; color: #0f172a; margin-bottom: 5px; }
        .ct-addr-body p { font-size: 0.8rem; color: #64748b; line-height: 1.6; margin: 0; }
        .ct-addr-arrow {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid #e2e8f0; display: flex; align-items: center;
          justify-content: center; color: #1d4ed8; flex-shrink: 0; margin-top: 4px;
          transition: background 0.2s;
        }
        .ct-addr-card:hover .ct-addr-arrow { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }

        /* Form */
        .ct-form-title {
          font-size: clamp(1.4rem, 2.2vw, 1.9rem); font-weight: 800;
          color: #0f172a; margin-bottom: 6px;
        }
        .ct-form-sub { font-size: 0.88rem; color: #64748b; margin-bottom: 24px; line-height: 1.5; }
        .ct-form { display: flex; flex-direction: column; gap: 14px; }
        .ct-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ct-field { display: flex; flex-direction: column; gap: 6px; }
        .ct-field-full { grid-column: 1 / -1; }
        .ct-field label { font-size: 0.82rem; font-weight: 600; color: #374151; }
        .ct-req { color: #ef4444; }
        .ct-field input, .ct-field textarea {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 10px 14px; font-size: 0.875rem; color: #0f172a;
          background: #ffffff; outline: none; transition: border-color 0.2s;
          font-family: inherit;
        }
        .ct-field input:focus, .ct-field textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .ct-field textarea { resize: vertical; min-height: 110px; }
        .ct-phone-wrap {
          display: flex; border: 1.5px solid #e2e8f0; border-radius: 8px;
          overflow: hidden; background: #ffffff;
          transition: border-color 0.2s;
        }
        .ct-phone-wrap:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .ct-phone-prefix {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 12px; background: #f8fafc;
          border-right: 1.5px solid #e2e8f0;
          font-size: 0.875rem; font-weight: 600; color: #374151;
          white-space: nowrap; flex-shrink: 0;
        }
        .ct-phone-input {
          flex: 1; border: none !important; box-shadow: none !important;
          border-radius: 0 !important; padding: 10px 14px !important;
        }
        .ct-submit {
          background: #0f2d6b; color: #ffffff;
          border: none; border-radius: 8px; padding: 14px 28px;
          font-size: 0.95rem; font-weight: 700; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-align: center; letter-spacing: 0.3px;
        }
        .ct-submit:hover { background: #1d4ed8; transform: translateY(-1px); }
        .ct-privacy {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.78rem; color: #94a3b8; margin: 0;
        }
        .ct-success {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; padding: 48px 24px; text-align: center;
          background: #eff6ff; border-radius: 14px; border: 1px solid #bfdbfe;
        }
        .ct-success h3 { font-size: 1.1rem; color: #1d4ed8; font-weight: 700; }

        /* ── Trust Bar ── */
        .ct-trust {
          background: #ffffff; border-top: 1px solid #f1f5f9;
          padding: 28px 0;
        }
        .ct-trust-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 32px;
          display: flex; align-items: center; gap: 0;
        }
        .ct-trust-item {
          display: flex; align-items: center; gap: 14px;
          flex: 1; padding: 0 20px;
        }
        .ct-trust-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: #eff6ff; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .ct-trust-item h4 { font-size: 0.88rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .ct-trust-item p { font-size: 0.75rem; color: #64748b; margin: 0; }
        .ct-trust-sep { width: 1px; height: 50px; background: #f1f5f9; flex-shrink: 0; }
        .ct-trust-brand {
          font-size: 0.72rem; font-weight: 800; color: #94a3b8;
          letter-spacing: 2px; text-transform: uppercase;
          text-align: right; line-height: 1.8; padding-left: 20px;
          white-space: nowrap; flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ct-mid-inner { gap: 32px; }
        }

        @media (max-width: 900px) {
          .ct-hero-inner { grid-template-columns: 1fr; }
          .ct-hero-right { display: none; }
          .ct-hero-left { padding: 40px 24px; }
          .ct-quick-inner { grid-template-columns: 1fr; }
          .ct-qcard { border-right: none; border-bottom: 1px solid #f1f5f9; }
          .ct-qcard:last-child { border-bottom: none; }
          .ct-mid-inner { grid-template-columns: 1fr; gap: 40px; }
          .ct-trust-inner { flex-wrap: wrap; gap: 16px; }
          .ct-trust-item { min-width: 45%; }
          .ct-trust-sep { display: none; }
          .ct-trust-brand { width: 100%; text-align: center; padding: 0; }
        }

        @media (max-width: 640px) {
          .ct-quick-inner { padding: 0 16px; }
          .ct-mid { padding: 36px 0 40px; }
          .ct-mid-inner { padding: 0 16px; }
          .ct-form-row { grid-template-columns: 1fr; }
          .ct-trust-inner { padding: 0 16px; }
          .ct-trust-item { min-width: 100%; }
          .ct-loc-title { font-size: 1.5rem; }
          .ct-hero-badges { gap: 8px 10px; }
        }
      `}</style>
    </main>
  );
}
