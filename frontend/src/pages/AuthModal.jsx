import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import httpService from '../services/httpService';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const portalType = searchParams.get('portal') || 'user';
  const isAdminPortal = portalType.toLowerCase() === 'admin';

  const [isLogin, setIsLogin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Generate 40 unique snow particles with random positions, sizes, and delays
  const snowflakes = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 8 + 6}s`,
    delay: `${Math.random() * -10}s`,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  const handleSendOTP = async () => {
    if (!identifier) return alert('Please enter your email or mobile number.');
    try {
      await httpService.post('/auth/send-otp', { identifier });
      setOtpSent(true);
      alert('OTP dispatched successfully!');
    } catch (err) {
      alert(err.message || 'Failed to send OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = (isLogin || isAdminPortal) ? '/auth/login' : '/auth/register';

    const payload = {
      identifier,
      password,
      portal: portalType.toUpperCase(),
      ...((isLogin || isAdminPortal) ? {} : { fullName, username, otp })
    };

    try {
      const response = await httpService.post(endpoint, payload);
      if (response?.token) {
        localStorage.setItem('authToken', response.token);
        window.location.href = isAdminPortal ? '/admin/dashboard' : '/';
      }
    } catch (err) {
      alert(err.message || 'Authentication failed');
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/oauth/${provider}?portal=${portalType}`;
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
          </div>
        </div>

        <div className="card-content-grid">
          
          {/* Left Form Column */}
          <div className="form-column">
            
            <div className="orange-dot"></div>
            
            {/* <div className="welcome-text">
              <span className="sub-welcome">{isAdminPortal ? 'Admin Access' : (isLogin ? 'Welcome to' : 'Join Us')}</span>
              <h1 className="main-title">Bharat Devices</h1>
            </div> */}

            <form onSubmit={handleSubmit} className="inspace-form">
              
              {!isAdminPortal && !isLogin ? (
                <>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Username</label>
                      <input
                        type="text"
                        placeholder="johndoe123"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Email or Phone</label>
                      <input
                        type="text"
                        placeholder="name@example.com"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group full-width">
                      <div className="label-row">
                        <label>OTP Verification</label>
                        <button type="button" className="otp-btn" onClick={handleSendOTP}>Send OTP</button>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={!otpSent}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <label>Email or Mobile</label>
                    <input
                      type="text"
                      placeholder="name@example.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="capsule-btn">
                {isAdminPortal ? 'LOGIN' : (isLogin ? 'LOGIN' : 'SIGN UP')}
              </button>

              <div className="oauth-section">
                <span className="oauth-label">OR CONTINUE WITH</span>
                <div className="oauth-pills">
                  <button type="button" className="glass-pill" onClick={() => handleOAuth('google')}>Google</button>
                  <button type="button" className="glass-pill" onClick={() => handleOAuth('microsoft')}>Microsoft</button>
                </div>
              </div>

              {!isAdminPortal && (
                <div className="toggle-mode-text">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Column Illustration */}
          <div className="illustration-column">
            <div className="curved-banner">
              <svg className="landscape-svg" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e1b4b" />
                    <stop offset="50%" stopColor="#312e81" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                  
                  <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>

                <rect width="500" height="600" fill="url(#skyGrad)" />
                <circle cx="410" cy="90" r="28" fill="#ffffff" opacity="0.9" />

                <path d="M0 400 L120 280 L260 420 L380 250 L500 380 L500 600 L0 600 Z" fill="#2e1065" opacity="0.6" />
                <path d="M0 450 L180 320 L320 480 L500 330 L500 600 L0 600 Z" fill="#1e1b4b" opacity="0.8" />

                <rect x="280" y="320" width="180" height="200" fill="#3730a3" rx="8" />
                <rect x="300" y="350" width="40" height="30" fill="#fef08a" opacity="0.8" />
                <rect x="350" y="350" width="40" height="30" fill="#fef08a" opacity="0.8" />
                
                <path d="M 180 280 L 260 250 L 260 520 L 180 480 Z" fill="url(#doorGrad)" />
                <polygon points="180,280 140,300 140,500 180,480" fill="#fb923c" />

                <rect x="120" y="480" width="100" height="15" fill="#c084fc" rx="4" />
                <rect x="100" y="495" width="140" height="15" fill="#a855f7" rx="4" />
                <rect x="80" y="510" width="180" height="15" fill="#9333ea" rx="4" />
                
                <path d="M120 525 L320 600 L0 600 L0 525 Z" fill="#2563eb" opacity="0.7" />
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
          background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%);
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
          background: rgba(99, 102, 241, 0.4);
        }

        .orb-2 {
          width: 450px;
          height: 450px;
          bottom: -15%;
          right: -5%;
          background: rgba(168, 85, 247, 0.35);
          animation-delay: -4s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          top: 40%;
          left: 50%;
          background: rgba(236, 72, 153, 0.25);
          animation-delay: -8s;
        }

        .dark .orb-1 { background: rgba(79, 70, 229, 0.35); }
        .dark .orb-2 { background: rgba(147, 51, 234, 0.3); }
        .dark .orb-3 { background: rgba(219, 39, 119, 0.2); }

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
          box-shadow: 0 0 6px rgba(147, 197, 253, 0.8);
        }

        .dark .snowflake {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 8px rgba(191, 219, 254, 0.9);
        }

        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(25px) rotate(180deg);
          }
          100% {
            transform: translateY(105vh) translateX(-15px) rotate(360deg);
          }
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
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08), 
                      0 1px 2px rgba(255, 255, 255, 0.5) inset;
        }

        .dark .glass-panel {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 
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

        .theme-toggle-btn:hover {
          transform: scale(1.05);
        }

        .icon-rotator { transition: transform 0.5s ease; }
        .icon-rotator.rotated { transform: rotate(180deg); }

        /* Outer Frame Dimensions */
        .inspace-card {
          width: 100%;
          max-width: 960px;
          border-radius: 28px;
          padding: 2.5rem 2.5rem 1.75rem 2.5rem;
        }

        .card-top-header { margin-bottom: 2rem; }
        .brand-logo { font-size: 1.25rem; letter-spacing: -0.02em; }

        .light .logo-light { color: #64748b; font-weight: 400; }
        .light .logo-bold { color: #2563eb; font-weight: 800; }
        .dark .logo-light { color: #94a3b8; font-weight: 400; }
        .dark .logo-bold { color: #60a5fa; font-weight: 800; }

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

        .orange-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #f59e0b;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
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

        .form-row { display: flex; gap: 1rem; width: 100%; }
        .input-group { flex: 1; display: flex; flex-direction: column; }
        .input-group.full-width { width: 100%; }

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
          padding: 0.4rem 0;
          font-size: 0.9rem;
          outline: none;
          background: transparent;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .light .input-group input { color: #0f172a; border-bottom-color: rgba(148, 163, 184, 0.6); }
        .dark .input-group input { color: #ffffff; border-bottom-color: rgba(71, 85, 105, 0.8); }

        .input-group input:focus {
          border-bottom-color: #3b82f6;
        }

        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .otp-btn {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 700;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .dark .otp-btn { color: #60a5fa; }

        .capsule-btn {
          width: 110px;
          padding: 0.65rem 0;
          border-radius: 50px;
          border: none;
          background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .capsule-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
        }

        .oauth-section { margin-top: 0.5rem; }
        .oauth-label { display: block; font-size: 0.65rem; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .oauth-pills { display: flex; gap: 0.5rem; }

        .glass-pill {
          flex: 1;
          padding: 0.45rem;
          border-radius: 8px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .light .glass-pill {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(203, 213, 225, 0.6);
          color: #334155;
        }

        .dark .glass-pill {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }

        .glass-pill:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .dark .glass-pill:hover {
          background: rgba(51, 65, 85, 0.6);
        }

        .toggle-mode-text { font-size: 0.75rem; color: #94a3b8; margin-top: 0.75rem; }
        .toggle-mode-text button {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .dark .toggle-mode-text button { color: #60a5fa; }

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
          .form-row { flex-direction: column; gap: 1.25rem; }
          .capsule-btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}