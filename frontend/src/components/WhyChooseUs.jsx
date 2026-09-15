import React from 'react';

const reasons = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Trusted Quality',
    desc: 'Original & certified products from leading global brands.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Business Focused',
    desc: 'Solutions tailored for all business sizes and industries.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Hassle-free Buying',
    desc: 'Quick enquiry and quotation process with fast turnaround.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Ongoing Support',
    desc: "We're here even after your purchase with dedicated assistance.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-inner">
        <div className="why-left">
          <h2 className="why-title">Why Choose<br />Bharat Devices?</h2>
        </div>
        <div className="why-grid">
          {reasons.map((r, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{r.icon}</div>
              <div className="why-text">
                <span className="why-card-title">{r.title}</span>
                <span className="why-card-desc">{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .why-section {
          background: #f8fafc;
          padding: 3rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .why-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          align-items: center;
        }

        .why-left { min-width: 200px; }

        .why-title {
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 800;
          color: #1e293b;
          line-height: 1.3;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .why-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.85rem;
          padding: 1.5rem 1rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .why-card:hover {
          box-shadow: 0 6px 20px rgba(29,78,216,0.08);
          transform: translateY(-3px);
        }

        .why-icon {
          width: 56px;
          height: 56px;
          background: #eff6ff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .why-text {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .why-card-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
        }

        .why-card-desc {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .why-inner { grid-template-columns: 1fr; gap: 1.5rem; }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .why-section { padding: 2rem 1rem; }
          .why-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .why-card { padding: 1.25rem 0.75rem; gap: 0.65rem; }
          .why-icon { width: 46px; height: 46px; }
        }
      `}</style>
    </section>
  );
}
