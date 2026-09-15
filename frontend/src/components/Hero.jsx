import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Reliable Devices for a',
    highlight: 'Smarter Tomorrow',
    desc: 'Laptops, desktops, monitors, networking devices, printers and more — all in one place.',
    cta: 'Explore Products',
    ctaLink: '/products',
    image: '/hero-slide1.png',
  },
  {
    title: 'Powering Productivity for',
    highlight: 'Modern Businesses',
    desc: 'Desktops and workstations that deliver peak performance for every business need.',
    cta: 'View Desktops',
    ctaLink: '/products?category=desktops',
    image: '/hero-slide2.png',
  },
  {
    title: 'Print Smarter',
    highlight: 'Every Day',
    desc: 'Reliable printing solutions for offices of every size — from compact inkjets to enterprise laser printers.',
    cta: 'View Printers',
    ctaLink: '/products?category=printers',
    image: '/hero-slide3.png',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-width background slides */}
      <div className="hero-slides-wrap">
        {slides.map((s, i) => (
          <div key={i} className={`hero-slide${i === current ? ' active' : ''}`}>
            <div className="hero-bg-img" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="hero-bg-overlay" />
          </div>
        ))}
      </div>

      {/* Text content */}
      <div className="hero-content">
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title">
              {slide.title}<br />
              <span className="hero-highlight">{slide.highlight}</span>
            </h1>
            <p className="hero-desc">{slide.desc}</p>
            <Link to={slide.ctaLink} className="hero-cta">
              {slide.cta} &nbsp;→
            </Link>
          </div>
        </div>

        {/* Arrows */}
        <button className="slider-arrow slider-arrow-prev" onClick={prev} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button className="slider-arrow slider-arrow-next" onClick={next} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`slider-dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .hero-slider {
          position: relative;
          height: 520px;
          overflow: hidden;
          background: #0b1628;
        }

        .hero-slides-wrap {
          position: absolute;
          inset: 0;
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .hero-slide.active { opacity: 1; }

        .hero-bg-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          filter: brightness(0.65) saturate(0.95);
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(11,22,40,0.88) 0%,
            rgba(11,22,40,0.65) 40%,
            rgba(11,22,40,0.15) 70%,
            rgba(11,22,40,0.05) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 5rem;
          width: 100%;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
          max-width: 560px;
        }

        .hero-title {
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .hero-highlight { color: #3b82f6; }

        .hero-desc {
          color: #cbd5e1;
          font-size: 1rem;
          line-height: 1.7;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          background: #1d4ed8;
          color: #ffffff;
          padding: 0.8rem 1.9rem;
          border-radius: 8px;
          font-size: 0.925rem;
          font-weight: 600;
          text-decoration: none;
          width: fit-content;
          transition: background 0.2s, transform 0.2s;
        }

        .hero-cta:hover { background: #1e40af; transform: translateX(3px); }

        /* Arrows */
        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          z-index: 10;
        }

        .slider-arrow:hover { background: rgba(255,255,255,0.25); }

        .slider-arrow-prev { left: 1.5rem; }
        .slider-arrow-next { right: 1.5rem; }

        /* Dots */
        .slider-dots {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s, width 0.3s;
        }

        .slider-dot.active {
          background: #ffffff;
          width: 28px;
          border-radius: 4px;
        }

        @media (max-width: 900px) {
          .hero-slider { height: 440px; }
          .hero-inner { padding: 0 3.5rem; }
        }

        @media (max-width: 600px) {
          .hero-slider { height: 380px; }
          .hero-inner { padding: 0 1.25rem; }
          .hero-title { font-size: 1.65rem; }
          .hero-desc { font-size: 0.875rem; }
          .hero-left { max-width: 100%; gap: 1rem; }
          .slider-arrow { width: 36px; height: 36px; }
          .slider-arrow-prev { left: 0.5rem; }
          .slider-arrow-next { right: 0.5rem; }
        }
      `}</style>
    </section>
  );
}
