import React from 'react';
import { Link } from 'react-router-dom';

const solutions = [
  'IT Infrastructure',
  'Workspace Solutions',
  'Surveillance & Security',
  'Printing Solutions',
  'Annual Maintenance',
  'Bulk & Corporate Orders',
];

export default function BusinessSolutions() {
  return (
    <section className="biz-section">
      <div className="biz-inner">
        <div className="biz-left">
          <span className="biz-label">BUSINESS SOLUTIONS</span>
          <h2 className="biz-title">Customized IT Solutions<br />for Every Business</h2>
          <p className="biz-desc">
            From startups to enterprises, we help you choose the right devices
            and build scalable technology solutions.
          </p>
          <Link to="/enquiry" className="biz-cta">Request a Custom Quote &nbsp;→</Link>
        </div>

        <div className="biz-right">
          <div className="biz-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
              alt="Business Solutions"
              className="biz-img"
            />
            <div className="biz-checklist">
              {solutions.map((s, i) => (
                <div key={i} className="biz-check-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .biz-section {
          background: #ffffff;
          padding: 3rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .biz-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .biz-left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .biz-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #1d4ed8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .biz-title {
          font-size: clamp(1.35rem, 2.5vw, 1.85rem);
          font-weight: 800;
          color: #1e293b;
          line-height: 1.25;
        }

        .biz-desc {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.65;
          max-width: 420px;
        }

        .biz-cta {
          display: inline-flex;
          align-items: center;
          background: #1d4ed8;
          color: #ffffff;
          padding: 0.7rem 1.5rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          width: fit-content;
          transition: background 0.2s, transform 0.2s;
        }

        .biz-cta:hover { background: #1e40af; transform: translateX(2px); }

        .biz-right { position: relative; }

        .biz-img-wrap {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
        }

        .biz-img {
          width: 100%;
          height: 320px;
          object-fit: cover;
          display: block;
        }

        .biz-checklist {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.6rem;
          padding: 1.5rem;
        }

        .biz-check-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          border-radius: 8px;
          padding: 0.5rem 0.85rem;
          width: fit-content;
        }

        .biz-check-item span {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
        }

        @media (max-width: 900px) {
          .biz-inner { grid-template-columns: 1fr; gap: 2rem; }
          .biz-img { height: 260px; }
          .biz-desc { max-width: 100%; }
        }

        @media (max-width: 640px) {
          .biz-section { padding: 2rem 1rem; }
          .biz-img { height: 220px; }
          .biz-checklist { padding: 1rem; gap: 0.4rem; }
          .biz-check-item { padding: 0.4rem 0.65rem; }
          .biz-check-item span { font-size: 0.75rem; }
        }
      `}</style>
    </section>
  );
}
