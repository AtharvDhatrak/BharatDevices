import React from 'react';
import { Link } from 'react-router-dom';
import StackedGlass from './StackedGlass';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '4rem 0 6rem 0',
      overflow: 'hidden',
    }}>
      {/* Soft Ambient Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-5%',
        left: '5%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, rgba(2, 132, 199, 0.05) 50%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Column: Heading & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{
            alignSelf: 'flex-start',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid var(--accent-color)',
            color: 'var(--accent-color)',
            fontSize: '0.8rem',
            fontWeight: '700',
            letterSpacing: '0.05em'
          }}>
            ⚡ NEXT-GEN HARDWARE DISTRIBUTION
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>
            Your Trusted Partner in <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Electronics Solutions</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            maxWidth: '520px'
          }}>
            Enterprise-grade laptops, CCTV surveillance, custom desktop workstations, and smart peripherals tailored for industry needs.
          </p>

          {/* Search Bar Container */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-glass)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '0.5rem 0.5rem 0.5rem 1rem',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(16px)',
            maxWidth: '480px'
          }}>
            <span style={{ marginRight: '0.75rem', opacity: 0.8 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search processors, cameras, laptops..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
            <button style={{
              backgroundColor: 'var(--accent-color)',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 12px var(--accent-glow)'
            }}>
              Search
            </button>
          </div>

          {/* Action CTAs Row */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginTop: '0.5rem',
            flexWrap: 'nowrap'
          }}>
            <Link to="/products" style={{
              backgroundColor: 'var(--accent-color)',
              color: '#fff',
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: '0 0 16px var(--accent-glow)',
              whiteSpace: 'nowrap',
              display: 'inline-block'
            }}>
              Explore Catalog
            </Link>
            <Link to="/enquiry" style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              display: 'inline-block'
            }}>
              Request a Quote
            </Link>
            
            
          </div>

        </div>

        {/* Right Column: Single Reference Static Image Frame */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '400px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            zIndex: 1
          }}>
            <img 
              src="/src/assets/hero-showcase.png" 
              alt="Electronics Solutions Showcase"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}