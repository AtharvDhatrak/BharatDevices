import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import httpService from '../services/httpService';

const API_BASE_URL = 
  (typeof process !== 'undefined' && process.env?.BACKEND_BASE_URL) || 
  import.meta.env?.VITE_API_BASE_URL || 
  '';

export default function AdminAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const portalType = searchParams.get('portal') || 'admin';

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate 40 unique snow particles with random positions, sizes, and delays
  const snowflakes = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 8 + 6}s`,
    delay: `${Math.random() * -10}s`,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      identifier,
      password,
      adminKey,
      portal: portalType.toUpperCase(),
    };

    try {
      const endpoint = `${API_BASE_URL}/auth/admin/login`;
      const response = await httpService.post(endpoint, payload);

      const token = response?.token || response?.data?.token;
      const role = response?.role || response?.data?.role || 'ADMIN';

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);

        // Perform client-side redirect
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
    <div className={`auth-page-bg ${isDarkMode ? 'dark' : 'light'}`}>
      
      {/* Dynamic Background Light Orbs */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>

      {/* Snowfall Layer */}
      <div className="snow-container">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              animationDuration: flake.duration,
              animationDelay: flake.delay,
              opacity: flake.opacity,
            }}
          />
        ))}
      </div>

      {/* Theme Toggle Button */}
      <button
        type="button"
        className="theme-toggle-btn glass-btn"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title="Toggle Theme"
      >
        <div className={`icon-rotator ${isDarkMode ? 'rotated' : ''}`}>
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </div>
      </button>

      {/* Main Glassmorphism Card Container */}
      <div className="inspace-card glass-panel">
        
        {/* Top Header */}
        <div className="card-top-header">
          <div className="brand-logo">
            <span className="logo-light">Bharat</span>
            <span className="logo-bold"> Devices</span>
            <span className="admin-badge">ADMIN</span>
          </div>
        </div>

        <div className="card-content-grid">
          
          {/* Left Form Column */}
          <div className="form-column">
            
            <div className="security-indicator">
              <div className="red-dot"></div>
              <span className="security-tag">Restricted Access</span>
            </div>

            <div className="welcome-text">
              <span className="sub-welcome">System Security Portal</span>
              <h1 className="main-title">Admin Login</h1>
            </div>

            <form onSubmit={handleSubmit} className="inspace-form">
              
              <div className="input-group">
                <label>Admin ID / Email</label>
                <input
                  type="text"
                  placeholder="admin@bharatdevices.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="input-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Security Key Field */}
              {/* <div className="input-group">
                <label>Admin Security Key</label>
                <input
                  type="password"
                  placeholder="Security Passkey"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                />
              </div> */}

              <button type="submit" className="capsule-btn admin-btn" disabled={isSubmitting}>
                {isSubmitting ? 'VERIFYING...' : 'AUTHORIZE'}
              </button>

            </form>
          </div>

          {/* Right Column Illustration */}
          <div className="illustration-column">
            <div className="curved-banner">
              <svg className="landscape-svg" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="50%" stopColor="#1e1b4b" />
                    <stop offset="100%" stopColor="#31124b" />
                  </linearGradient>
                  
                  <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>

                <rect width="500" height="600" fill="url(#skyGrad)" />
                <circle cx="410" cy="90" r="28" fill="#ffffff" opacity="0.9" />

                <path d="M0 400 L120 280 L260 420 L380 250 L500 380 L500 600 L0 600 Z" fill="#111827" opacity="0.6" />
                <path d="M0 450 L180 320 L320 480 L500 330 L500 600 L0 600 Z" fill="#0f172a" opacity="0.8" />

                <rect x="280" y="320" width="180" height="200" fill="#1e1b4b" rx="8" />
                <rect x="300" y="350" width="40" height="30" fill="#fca5a5" opacity="0.8" />
                <rect x="350" y="350" width="40" height="30" fill="#fca5a5" opacity="0.8" />
                
                <path d="M 180 280 L 260 250 L 260 520 L 180 480 Z" fill="url(#doorGrad)" />
                <polygon points="180,280 140,300 140,500 180,480" fill="#dc2626" />

                <rect x="120" y="480" width="100" height="15" fill="#f87171" rx="4" />
                <rect x="100" y="495" width="140" height="15" fill="#ef4444" rx="4" />
                <rect x="80" y="510" width="180" height="15" fill="#dc2626" rx="4" />
                
                <path d="M120 525 L320 600 L0 600 L0 525 Z" fill="#991b1b" opacity="0.7" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        /* Page Level Styles */
        .auth-page-bg {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          transition: background 0.5s ease;
        }

        .auth-page-bg.light {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%);
        }

        .auth-page-bg.dark {
          background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%);
        }

        /* Ambient Glowing Background Orbs */
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: floatOrb 12s infinite ease-in-out alternate;
        }

        .orb-1 {
          width: 380px;
          height: 380px;
          top: -10%;
          left: -5%;
          background: rgba(220, 38, 38, 0.25);
        }

        .orb-2 {
          width: 450px;
          height: 450px;
          bottom: -15%;
          right: -5%;
          background: rgba(124, 58, 237, 0.3);
          animation-delay: -4s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          top: 40%;
          left: 50%;
          background: rgba(239, 68, 68, 0.2);
          animation-delay: -8s;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 40px) scale(1.1); }
          100% { transform: translate(-20px, 20px) scale(0.95); }
        }

        /* Snowfall Styles */
        .snow-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .snowflake {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          pointer-events: none;
          animation: fall linear infinite;
        }

        .light .snowflake {
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 6px rgba(203, 213, 225, 0.8);
        }

        .dark .snowflake {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 8px rgba(248, 113, 113, 0.6);
        }

        @keyframes fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(50vh) translateX(25px) rotate(180deg); }
          100% { transform: translateY(105vh) translateX(-15px) rotate(360deg); }
        }

        /* Glassmorphism Panel Container */
        .glass-panel {
          position: relative;
          z-index: 2;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .light .glass-panel {
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08), 
                      0 1px 2px rgba(255, 255, 255, 0.5) inset;
        }

        .dark .glass-panel {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 
                      0 1px 1px rgba(255, 255, 255, 0.1) inset;
        }

        /* Toggle Button */
        .theme-toggle-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          transition: all 0.2s ease;
        }

        .light .glass-btn {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .dark .glass-btn {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .theme-toggle-btn:hover { transform: scale(1.05); }

        .icon-rotator { transition: transform 0.5s ease; }
        .icon-rotator.rotated { transform: rotate(180deg); }

        /* Outer Frame Dimensions */
        .inspace-card {
          width: 100%;
          max-width: 960px;
          border-radius: 28px;
          padding: 2.5rem 2.5rem 2.25rem 2.5rem;
        }

        .card-top-header { margin-bottom: 2rem; }
        .brand-logo { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; letter-spacing: -0.02em; }

        .light .logo-light { color: #64748b; font-weight: 400; }
        .light .logo-bold { color: #0f172a; font-weight: 800; }
        .dark .logo-light { color: #94a3b8; font-weight: 400; }
        .dark .logo-bold { color: #f8fafc; font-weight: 800; }

        .admin-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          background: rgba(220, 38, 38, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          letter-spacing: 0.05em;
        }

        .card-content-grid {
          display: flex;
          gap: 2rem;
          align-items: stretch;
        }

        .form-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 400px;
        }

        .security-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .red-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
        }

        .security-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: #ef4444;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .welcome-text { margin-bottom: 1.75rem; }
        .sub-welcome { font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 0.2rem; }
        .main-title { font-size: 1.85rem; font-weight: 800; margin: 0; }

        .light .main-title { color: #0f172a; }
        .dark .main-title { color: #f8fafc; }

        .inspace-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group { flex: 1; display: flex; flex-direction: column; }

        .input-group label {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .dark .input-group label { color: #94a3b8; }

        .input-group input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #cbd5e1;
          padding: 0.5rem 0;
          font-size: 0.9rem;
          outline: none;
          background: transparent;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .light .input-group input { color: #0f172a; border-bottom-color: rgba(148, 163, 184, 0.6); }
        .dark .input-group input { color: #ffffff; border-bottom-color: rgba(71, 85, 105, 0.8); }

        .input-group input:focus {
          border-bottom-color: #ef4444;
        }

        /* Password Input Wrapper and Eye Toggle Button */
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .password-input-wrapper input {
          padding-right: 2rem;
        }

        .eye-toggle-btn {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .light .eye-toggle-btn { color: #64748b; }
        .light .eye-toggle-btn:hover { color: #0f172a; }
        .dark .eye-toggle-btn { color: #94a3b8; }
        .dark .eye-toggle-btn:hover { color: #f8fafc; }

        .capsule-btn.admin-btn {
          width: 100%;
          padding: 0.75rem 0;
          border-radius: 50px;
          border: none;
          background: linear-gradient(90deg, #dc2626 0%, #991b1b 100%);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          margin-top: 1rem;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .capsule-btn.admin-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
        }

        .capsule-btn.admin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Right Banner */
        .illustration-column {
          flex: 1.1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .curved-banner {
          width: 100%;
          height: 100%;
          min-height: 420px;
          border-top-left-radius: 120px;
          border-bottom-left-radius: 24px;
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .landscape-svg {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .inspace-card { padding: 1.5rem; }
          .illustration-column { display: none; }
          .form-column { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}