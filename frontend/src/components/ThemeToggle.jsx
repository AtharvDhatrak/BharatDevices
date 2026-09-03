import React from 'react';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
      {/* Main Toggle Switch Container */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle Light and Dark Mode"
        style={{
          position: 'relative',
          width: '56px',
          height: '28px',
          borderRadius: '14px',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          boxShadow: isDark 
            ? '0 0 10px rgba(2, 132, 199, 0.3), inset 0 2px 4px rgba(0,0,0,0.5)' 
            : '0 2px 8px rgba(0,0,0,0.15)',
          outline: 'none',
          flexShrink: 0,
        }}
      >
        {/* SVG Illustrated Day/Night Background */}
        <svg
          width="56"
          height="28"
          viewBox="0 0 90 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            {/* Day Sky Gradient */}
            <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A0C4FF" />
              <stop offset="100%" stopColor="#C4DDFF" />
            </linearGradient>

            {/* Night Sky Gradient */}
            <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
          </defs>

          {/* Dynamic Sky Background */}
          <rect
            width="90"
            height="42"
            fill={isDark ? 'url(#nightSky)' : 'url(#daySky)'}
            style={{ transition: 'fill 0.4s ease' }}
          />

          {/* DAY SCENE ELEMENTS */}
          <g style={{ opacity: isDark ? 0 : 1, transition: 'opacity 0.4s ease' }}>
            <circle cx="58" cy="28" r="12" fill="#FFD166" />
            <path d="M12 16 C12 14, 16 12, 20 14 C22 12, 28 12, 28 16 Z" fill="#FFFFFF" opacity="0.7" />
            <path d="M50 12 C50 10, 54 8, 58 10 C60 8, 65 9, 65 12 Z" fill="#FFFFFF" opacity="0.6" />
            <path d="M72 16 C68 12, 82 12, 80 20 Z" fill="#57CC99" />
            <rect x="74" y="20" width="3" height="12" fill="#8D5B4C" />
            <path d="M-5 42 C15 30, 45 35, 95 42 Z" fill="#80B918" />
            <path d="M-5 42 C25 32, 65 30, 95 42 Z" fill="#55A630" opacity="0.8" />
          </g>

          {/* NIGHT SCENE ELEMENTS */}
          <g style={{ opacity: isDark ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <path
              d="M 32 10 A 7 7 0 1 0 39 17 A 6 6 0 1 1 32 10 Z"
              fill="#FFEA79"
            />
            <circle cx="15" cy="12" r="1" fill="#FFFFFF" opacity="0.9" />
            <circle cx="22" cy="22" r="0.8" fill="#FFFFFF" opacity="0.7" />
            <circle cx="52" cy="10" r="1.2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="80" cy="14" r="0.8" fill="#FFFFFF" opacity="0.6" />
            <path d="M-5 42 C20 32, 50 36, 95 42 Z" fill="#1C3144" />
            <path d="M-5 42 C30 34, 70 32, 95 42 Z" fill="#2B4C6F" opacity="0.6" />
          </g>
        </svg>

        {/* Sliding White Orb / Knob */}
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: isDark ? '29px' : '3px',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            transition: 'left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </button>
    </div>
  );
}