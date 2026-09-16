import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import httpService from '../services/httpService';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.BACKEND_BASE_URL) ||
  import.meta.env?.VITE_API_BASE_URL ||
  '';

export default function AdminAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const portalType = searchParams.get('portal') || 'admin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { identifier, password, portal: portalType.toUpperCase() };
    try {
      const endpoint = `${API_BASE_URL}/auth/admin/login`;
      const response = await httpService.post(endpoint, payload);
      const token = response?.token || response?.data?.token;
      const role = response?.role || response?.data?.role || 'ADMIN';
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        navigate('/admin/dashboard', { replace: true });
      } else {
        alert('Login succeeded, but no valid token was returned.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Authorization failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="al-page">
      {/* Background blobs */}
      <div className="al-blob al-blob-tl" />
      <div className="al-blob al-blob-br" />

      {/* Top-right corner tagline */}
      <div className="al-corner al-corner-tr">
        <span>TECHNOLOGY</span>
        <span>FOR A BRIGHTER</span>
        <span>TOMORROW</span>
        <div className="al-corner-bars al-corner-bars-right">
          <span className="al-bar al-bar-orange" />
          <span className="al-bar al-bar-green" />
        </div>
      </div>

      {/* Bottom-left corner tagline */}
      <div className="al-corner al-corner-bl">
        <span>QUALITY DEVICES</span>
        <span>STRONGER BUSINESSES</span>
        <div className="al-corner-bars">
          <span className="al-bar al-bar-blue" />
        </div>
      </div>

      {/* Login Card */}
      <div className="al-card">
        <div className="al-logo">
          <img src={logoImg} alt="Bharat Devices" className="al-logo-img" />
        </div>

        <h1 className="al-title">Admin <span className="al-title-blue">Portal</span></h1>
        <p className="al-subtitle">Sign in to manage, monitor and grow together.</p>

        <form onSubmit={handleSubmit} className="al-form">

          <div className="al-field">
            <label className="al-label">Admin ID / Email</label>
            <div className="al-input-wrap">
              <svg className="al-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                className="al-input"
                placeholder="Enter your admin ID or email"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="al-field">
            <label className="al-label">Password</label>
            <div className="al-input-wrap">
              <svg className="al-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="al-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="al-eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="al-options">
            <label className="al-check-label">
              <input
                type="checkbox"
                className="al-checkbox"
                checked={keepSignedIn}
                onChange={e => setKeepSignedIn(e.target.checked)}
              />
              Keep me signed in
            </label>
            <a href="#" className="al-forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="al-submit-btn" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Verifying...' : 'Login'}</span>
            {!isSubmitting && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            )}
          </button>

          <div className="al-or">
            <span className="al-or-line" />
            <span className="al-or-text">OR</span>
            <span className="al-or-line" />
          </div>

          <div className="al-secure">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Secure access for authorized users only.</span>
          </div>

        </form>
      </div>

      <style>{`
        .al-page {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(150deg, #eef4fd 0%, #f7f9ff 50%, #eef4fd 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
          box-sizing: border-box;
        }

        .al-blob {
          position: absolute;
          border-radius: 50%;
          background: rgba(191, 219, 254, 0.55);
          pointer-events: none;
          z-index: 0;
        }
        .al-blob-tl { width: 480px; height: 480px; top: -160px; left: -160px; }
        .al-blob-br { width: 420px; height: 420px; bottom: -130px; right: -130px; }

        .al-corner {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #94a3b8;
          z-index: 1;
          line-height: 1.4;
        }
        .al-corner-tr { top: 2rem; right: 2rem; text-align: right; }
        .al-corner-bl { bottom: 2rem; left: 2rem; }

        .al-corner-bars { display: flex; gap: 5px; margin-top: 5px; }
        .al-corner-bars-right { justify-content: flex-end; }

        .al-bar { height: 3px; width: 26px; border-radius: 2px; display: block; }
        .al-bar-orange { background: #f97316; }
        .al-bar-green  { background: #22c55e; }
        .al-bar-blue   { background: #2563eb; }

        .al-card {
          position: relative;
          z-index: 2;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 8px 48px rgba(30, 64, 175, 0.10), 0 2px 8px rgba(0,0,0,0.04);
          padding: 2.5rem 2.25rem 2.25rem;
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .al-logo { margin-bottom: 1.25rem; }
        .al-logo-img { height: 62px; width: auto; object-fit: contain; }

        .al-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.45rem;
          letter-spacing: -0.02em;
        }
        .al-title-blue { color: #2563eb; }

        .al-subtitle {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0 0 1.75rem;
          line-height: 1.55;
        }

        .al-form {
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .al-field { display: flex; flex-direction: column; gap: 0.4rem; }

        .al-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .al-input-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 0 0.85rem;
          gap: 0.6rem;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .al-input-wrap:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
        }

        .al-input-icon { flex-shrink: 0; }

        .al-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.72rem 0;
          font-size: 0.88rem;
          color: #0f172a;
          background: transparent;
          font-family: inherit;
        }
        .al-input::placeholder { color: #cbd5e1; }

        .al-eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .al-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -0.15rem;
        }

        .al-check-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #374151;
          cursor: pointer;
          user-select: none;
        }

        .al-checkbox {
          width: 17px;
          height: 17px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .al-forgot {
          font-size: 0.82rem;
          font-weight: 600;
          color: #2563eb;
          text-decoration: none;
        }
        .al-forgot:hover { text-decoration: underline; }

        .al-submit-btn {
          width: 100%;
          padding: 0.85rem 1.4rem;
          background: #1e3a8a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.2s, transform 0.15s;
          margin-top: 0.2rem;
          font-family: inherit;
        }
        .al-submit-btn:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        .al-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .al-or {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .al-or-line { flex: 1; height: 1px; background: #e2e8f0; }
        .al-or-text { font-size: 0.75rem; color: #94a3b8; font-weight: 600; letter-spacing: 0.06em; }

        .al-secure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.78rem;
        }

        @media (max-width: 520px) {
          .al-card { padding: 2rem 1.4rem 1.75rem; }
          .al-corner { display: none; }
          .al-title { font-size: 1.65rem; }
        }
      `}</style>
    </div>
  );
}
