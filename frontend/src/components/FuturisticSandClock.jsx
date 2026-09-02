import React from 'react';

export default function FuturisticSandClock({ width = 320, height = 360 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Neon Purple Gradient */}
        <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#6B21A8" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>

        {/* Top Metallic Plate Gradient */}
        <linearGradient id="metalTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Glow Effects */}
        <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* TOP ISOMETRIC CAP */}
      <g transform="translate(0, 20)">
        {/* Top Surface */}
        <path
          d="M160 40 L260 90 L160 140 L60 90 Z"
          fill="url(#metalTop)"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        {/* Top Edge Rim */}
        <path
          d="M60 90 L60 105 C60 120, 260 120, 260 105 L260 90"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth="2"
        />
      </g>

      {/* DOTTED CONNECTOR LINES */}
      <line x1="60" y1="110" x2="60" y2="230" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <line x1="260" y1="110" x2="260" y2="230" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

      {/* CENTRAL MECH HOURGLASS STREAM */}
      <g stroke="#C084FC" strokeWidth="2" filter="url(#neonFilter)">
        {/* Upper Funnel Stream */}
        <path d="M110 110 L155 170 L165 170 L210 110" strokeDasharray="2 2" />
        {/* Central Energy Core */}
        <ellipse cx="160" cy="175" rx="8" ry="4" fill="#E9D5FF" />
        <line x1="160" y1="175" x2="160" y2="225" stroke="#F0ABFC" strokeWidth="3" />
        {/* Lower Particle Stream */}
        <path d="M160 175 L110 230 M160 175 L210 230" strokeDasharray="3 3" opacity="0.8" />
      </g>

      {/* BOTTOM ISOMETRIC BASE (GLOWING PURPLE) */}
      <g transform="translate(0, 140)">
        {/* Base Side/Thickness */}
        <path
          d="M60 90 L60 115 C60 135, 260 135, 260 115 L260 90 Z"
          fill="url(#purpleGlow)"
        />
        {/* Base Top Surface */}
        <path
          d="M160 40 L260 90 L160 140 L60 90 Z"
          fill="#581C87"
          stroke="#C084FC"
          strokeWidth="2"
          filter="url(#neonFilter)"
        />
        {/* Inner Circuit Accent */}
        <path
          d="M160 60 L230 95 L160 130 L90 95 Z"
          fill="none"
          stroke="#E9D5FF"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />
      </g>
    </svg>
  );
}