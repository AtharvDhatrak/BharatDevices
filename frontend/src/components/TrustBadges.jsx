import React from 'react';

const badges = [
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: '100% Genuine Products',
    desc: 'Original & certified devices',
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
        <line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/>
      </svg>
    ),
    title: 'Competitive Pricing',
    desc: 'Best value for your business',
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Bulk & Corporate Orders',
    desc: 'Special pricing and support',
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        <path d="M14.05 2a9 9 0 0 1 8 7.94"/>
        <path d="M14.05 6A5 5 0 0 1 18 10"/>
      </svg>
    ),
    title: 'Dedicated Support',
    desc: 'Pre-sale & post-sale assistance',
  },
];

export default function TrustBadges() {
  return (
    <div className="trust-bar">
      <div className="trust-inner">
        {badges.map((b, i) => (
          <div key={i} className="trust-item">
            <div className="trust-icon-wrap">{b.icon}</div>
            <div className="trust-text">
              <span className="trust-title">{b.title}</span>
              <span className="trust-desc">{b.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .trust-bar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem 1.5rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }

        .trust-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .trust-icon-wrap {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          background: #eff6ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trust-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .trust-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
        }

        .trust-desc {
          font-size: 0.75rem;
          color: #64748b;
        }

        @media (max-width: 900px) {
          .trust-inner { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }

        @media (max-width: 480px) {
          .trust-bar { padding: 1.25rem 1rem; }
          .trust-inner { gap: 0.75rem; }
          .trust-icon-wrap { width: 42px; height: 42px; }
          .trust-title { font-size: 0.8rem; }
          .trust-desc { font-size: 0.7rem; }
        }
      `}</style>
    </div>
  );
}
