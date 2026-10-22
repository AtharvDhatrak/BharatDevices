import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8089';

export default function TopBar() {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [refInput, setRefInput] = useState('');
  const [trackData, setTrackData] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    const cleanId = refInput.trim();
    if (!cleanId) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackData(null);
    try {
      const res = await fetch(`${API_BASE}/api/enquiry/${encodeURIComponent(cleanId)}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No enquiry found with reference ID "' + cleanId + '". Please verify the number from your confirmation.');
        }
        throw new Error('Unable to track enquiry. Please try again later.');
      }
      const data = await res.json();
      setTrackData(data);
    } catch (err) {
      setTrackError(err.message || 'Tracking failed.');
    } finally {
      setTrackLoading(false);
    }
  };

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

          <button
            type="button"
            onClick={() => {
              setIsTrackOpen(true);
              setTrackError('');
              setTrackData(null);
            }}
            className="topbar-item topbar-track-btn"
          >
            Track Enquiry
          </button>

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

      {/* Track Enquiry Modal */}
      {isTrackOpen && (
        <div className="track-modal-overlay" onClick={() => setIsTrackOpen(false)}>
          <div className="track-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="track-modal-header">
              <div className="track-modal-title-wrap">
                <span className="track-modal-badge">Official RFQ Tracker</span>
                <h3 className="track-modal-title">Track Quotation / Enquiry</h3>
              </div>
              <button
                type="button"
                className="track-modal-close"
                onClick={() => setIsTrackOpen(false)}
                aria-label="Close tracking modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTrackSubmit} className="track-search-form">
              <div className="track-input-row">
                <input
                  type="text"
                  placeholder="Enter Tracking Reference (e.g. BD-RFQ-435557)"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  className="track-input"
                  required
                />
                <button
                  type="submit"
                  disabled={trackLoading || !refInput.trim()}
                  className="track-submit-btn"
                >
                  {trackLoading ? 'Searching...' : 'Track Status'}
                </button>
              </div>
            </form>

            {trackError && (
              <div className="track-error-alert">
                <span>⚠️ {trackError}</span>
              </div>
            )}

            {trackData && (
              <div className="track-result-box">
                <div className="track-result-header">
                  <div>
                    <span className="track-ref-label">Reference ID</span>
                    <strong className="track-ref-val">{trackData.enquiryId}</strong>
                  </div>
                  <span className={`track-status-pill status-${(trackData.status || 'New').toLowerCase().replace(/\s+/g, '-')}`}>
                    {trackData.status || 'New'}
                  </span>
                </div>

                <div className="track-progress-bar-wrap">
                  <div className="track-steps">
                    {['Registered', 'Under Review', 'Quote Dispatched', 'Completed'].map((st, i) => {
                      const cur = (trackData.status || 'New').toLowerCase();
                      const isActive =
                        (i === 0) ||
                        (i === 1 && (cur.includes('review') || cur.includes('dispatch') || cur.includes('approve') || cur.includes('complete'))) ||
                        (i === 2 && (cur.includes('dispatch') || cur.includes('approve') || cur.includes('complete'))) ||
                        (i === 3 && (cur.includes('approve') || cur.includes('complete')));
                      return (
                        <div key={st} className={`track-step ${isActive ? 'step-active' : ''}`}>
                          <div className="step-dot">{isActive ? '✓' : i + 1}</div>
                          <span className="step-text">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="track-details-grid">
                  <div className="track-detail-item">
                    <span className="detail-label">Client / Organization</span>
                    <strong className="detail-val">{trackData.name} {trackData.company ? `(${trackData.company})` : ''}</strong>
                  </div>
                  <div className="track-detail-item">
                    <span className="detail-label">Requested Device / Scope</span>
                    <strong className="detail-val">{trackData.productName || 'Enterprise RFQ Batch'}</strong>
                  </div>
                  <div className="track-detail-item">
                    <span className="detail-label">Total Units</span>
                    <strong className="detail-val">{trackData.quantity || 1} Units</strong>
                  </div>
                  <div className="track-detail-item">
                    <span className="detail-label">Submission Date</span>
                    <strong className="detail-val">
                      {trackData.submittedAt ? new Date(trackData.submittedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Recently'}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .topbar {
          background: #ffffff;
          color: #475569;
          font-size: 0.76rem;
          font-weight: 400;
          padding: 0.4rem 1.5rem;
          width: 100%;
          border-bottom: 1px solid #e5e7eb;
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
          color: #64748b;
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
          color: #475569;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .topbar-item:hover {
          color: #EA580C;
        }

        .company-name {
          color: #94a3b8;
          cursor: default;
        }

        .topbar-sep {
          color: #d1d5db;
        }

        /* Dropdown Styles */
        .topbar-dropdown-container {
          position: relative;
          display: inline-block;
        }

        .topbar-dropdown-btn {
          background: transparent;
          border: none;
          color: #475569;
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
          color: #EA580C;
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
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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
          color: #374151;
          padding: 0.45rem 0.65rem;
          text-align: left;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 500;
          transition: background-color 0.2s, color 0.2s;
        }

        .topbar-track-btn {
          background: none;
          border: none;
          color: #475569;
          font-size: inherit;
          font-family: inherit;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }
        .topbar-track-btn:hover {
          color: #F97316;
        }

        /* ── Track Modal Styles ── */
        .track-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .track-modal-card {
          width: 100%;
          max-width: 580px;
          background: #ffffff;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(0,0,0,0.25);
          animation: trackPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: #1e293b;
        }

        html.dark .track-modal-card {
          background: #0e1830;
          border-color: #192b50;
          color: #f8fafc;
        }

        @keyframes trackPop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .track-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .track-modal-badge {
          font-size: 0.72rem;
          font-weight: 800;
          color: #F97316;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          display: block;
        }

        .track-modal-title {
          font-size: 1.35rem;
          font-weight: 800;
          margin: 0;
        }

        .track-modal-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1.25rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.15s;
        }

        .track-modal-close:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .track-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .track-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 9px;
          border: 1.5px solid #cbd5e1;
          font-size: 0.9rem;
          outline: none;
          font-family: inherit;
        }

        html.dark .track-input {
          background: #070d1e;
          border-color: #192b50;
          color: #f8fafc;
        }

        .track-input:focus {
          border-color: #F97316 !important;
        }

        .track-submit-btn {
          background: #F97316;
          color: #ffffff;
          border: none;
          padding: 0 1.25rem;
          border-radius: 9px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }

        .track-submit-btn:hover:not(:disabled) {
          background: #ea580c;
        }

        .track-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .track-error-alert {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .track-result-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-top: 0.5rem;
        }

        html.dark .track-result-box {
          background: #070d1e;
          border-color: #192b50;
        }

        .track-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.85rem;
          margin-bottom: 1rem;
        }

        html.dark .track-result-header {
          border-bottom-color: #192b50;
        }

        .track-ref-label {
          font-size: 0.72rem;
          color: #64748b;
          display: block;
          text-transform: uppercase;
          font-weight: 700;
        }

        .track-ref-val {
          font-size: 1.1rem;
          font-family: monospace;
          color: #F97316;
        }

        .track-status-pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-new {
          background: rgba(249, 115, 22, 0.15);
          color: #F97316;
        }

        .status-under-review, .status-in-review {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }

        .status-quotation-dispatched, .status-quote-dispatched {
          background: rgba(168, 85, 247, 0.15);
          color: #a855f7;
        }

        .status-completed, .status-approved {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .track-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin: 1.25rem 0;
        }

        .track-steps::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: #cbd5e1;
          z-index: 1;
        }

        html.dark .track-steps::before {
          background: #192b50;
        }

        .track-step {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
        }

        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          border: 2px solid #ffffff;
        }

        html.dark .step-dot {
          background: #192b50;
          border-color: #0e1830;
          color: #94a3b8;
        }

        .track-step.step-active .step-dot {
          background: #22c55e;
          color: #ffffff;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .step-text {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
          text-align: center;
        }

        .track-step.step-active .step-text {
          color: #1e293b;
          font-weight: 700;
        }

        html.dark .track-step.step-active .step-text {
          color: #f8fafc;
        }

        .track-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
          margin-top: 1rem;
          border-top: 1px dashed #e2e8f0;
          padding-top: 1rem;
        }

        html.dark .track-details-grid {
          border-top-color: #192b50;
        }

        .track-detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
        }

        .detail-val {
          font-size: 0.84rem;
        }
      `}</style>
    </div>
  );
}