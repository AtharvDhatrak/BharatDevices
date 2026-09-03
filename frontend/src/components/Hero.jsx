import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Background Glow */}
      <div className="hero-glow" />

      <div className="hero-grid">
        {/* Left Column: Heading & Controls */}
        <div className="hero-left">

          <h1 className="hero-title">
            Your Trusted Partner in{' '}
            <span className="hero-title-gradient">Electronics Solutions</span>
          </h1>

          <p className="hero-description">
            Enterprise-grade laptops, CCTV surveillance, custom desktop workstations, and smart peripherals tailored for industry needs.
          </p>

          {/* Search Bar Container */}
          <div className="hero-search-container">
            <span className="hero-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search processors, cameras, laptops..."
              className="hero-search-input"
            />
            <button className="hero-search-button">
              Search
            </button>
          </div>

          {/* Action CTAs Row */}
          <div className="hero-actions">
            <Link to="/products" className="cta-btn primary-btn">
              Explore Catalog
            </Link>
            <Link to="/enquiry" className="cta-btn secondary-btn">
              Request a Quote
            </Link>
          </div>
        </div>

        {/* Right Column: Static Image Frame */}
        <div className="hero-right">
          <div className="hero-image-frame">
            <img 
              src="/src/assets/hero-showcase.png" 
              alt="Electronics Solutions Showcase"
              className="hero-image"
            />
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          padding: 3rem 0 4rem 0;
          overflow: hidden;
        }

        .hero-glow {
          position: absolute;
          top: -5%;
          left: 5%;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, rgba(2, 132, 199, 0.05) 50%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        .hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  /* Centers items vertically and horizontally inside grid cells */
  place-items: center; 
  
  /* Ensures the grid content centers horizontally if given a max-width */
  justify-content: center; 
  
  position: relative;
  z-index: 1;
}

/* Optional: Center inline text and elements inside each grid child */
.hero-grid > * {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .hero-badge {
          align-self: flex-start;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          background: rgba(2, 132, 199, 0.15);
          border: 1px solid var(--accent-color);
          color: var(--accent-color);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .hero-title {
          font-size: clamp(2rem, 3.5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.15;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .hero-title-gradient {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 520px;
        }

        .hero-search-container {
          display: flex;
          align-items: center;
          background-color: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.5rem 0.5rem 0.5rem 1rem;
          backdrop-filter: blur(16px);
          max-width: 480px;
          width: 100%;
        }

        .hero-search-icon {
          margin-right: 0.75rem;
          opacity: 0.8;
        }

        .hero-search-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: inherit;
        }

        .hero-search-button {
          background-color: var(--accent-color);
          color: #fff;
          border: none;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 0 12px var(--accent-glow);
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .cta-btn {
          padding: 0.75rem 1.75rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          display: inline-block;
          text-align: center;
        }

        .primary-btn {
          background-color: var(--accent-color);
          color: #fff;
          box-shadow: 0 0 16px var(--accent-glow);
        }

        .secondary-btn {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .hero-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .hero-image-frame {
          position: relative;
          width: 100%;
          max-width: 500px;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          z-index: 1;
        }

        .hero-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Mobile Breakpoint Adjustments */
        @media (max-width: 768px) {
          .hero-section {
            padding: 1.5rem 0 2.5rem 0;
          }

          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hero-badge {
            align-self: center;
          }

          .hero-left {
            align-items: center;
            text-align: center;
          }

          .hero-actions {
            width: 100%;
            justify-content: center;
          }

          .cta-btn {
            flex: 1;
            min-width: 140px;
          }
        }
      `}</style>
    </section>
  );
}