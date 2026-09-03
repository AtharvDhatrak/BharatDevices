import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'laptops', name: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80', link: '/products?category=laptops' },
  { id: 'desktops', name: 'Desktops', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=400&q=80', link: '/products?category=desktops' },
  { id: 'monitors', name: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80', link: '/products?category=monitors' },
  { id: 'networking', name: 'Networking', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80', link: '/products?category=networking' },
  { id: 'printers', name: 'Printers', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80', link: '/products?category=printers' },
  { id: 'storage', name: 'Storage', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80', link: '/products?category=storage' },
  { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', link: '/products?category=accessories' },
  { id: 'cctv', name: 'CCTV', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80', link: '/products?category=cctv' },
];

export default function ShopByCategory() {
  const scrollRowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const el = scrollRowRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRowRef.current.offsetLeft);
    setScrollLeft(scrollRowRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRowRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRowRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="category-section">
      <div className="category-container">
        <div className="category-header">
          <h2 className="category-title">Shop by Category</h2>
          <Link to="/categories" className="category-view-all">
            View All <span>&rarr;</span>
          </Link>
        </div>

        <div
          ref={scrollRowRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`category-scroll-row no-scrollbar ${isDragging ? 'is-dragging' : ''}`}
        >
          {categories.map((item, index) => (
            <Link key={`${item.id}-${index}`} to={item.link} className="category-card">
              <div className="category-image-frame">
                <img
                  src={item.image}
                  alt={item.name}
                  className="category-img"
                  loading="lazy"
                />
              </div>
              <span className="category-name">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .category-section {
          padding: 1rem 0;
          width: 100%;
        }

        .category-container {
          width: 100%;
          padding: 0 0.5rem;
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          padding: 0 0.25rem;
        }

        .category-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary, #0f172a);
        }

        .category-view-all {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-color, #2563eb);
          text-decoration: none;
        }

        .category-scroll-row {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center;
          gap: 0.85rem;
          overflow-x: scroll !important;
          overflow-y: hidden !important;
          width: 100%;
          padding: 0.5rem 0;
          cursor: grab;
          user-select: none;
          -webkit-overflow-scrolling: touch;
        }

        .category-scroll-row.is-dragging {
          cursor: grabbing;
        }

        /* Increased Device Card Sizes */
        .category-card {
          flex: 0 0 auto !important;
          width: 135px; /* Increased from 95px */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background-color: var(--bg-surface, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 16px;
          text-decoration: none;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .category-card:hover {
          border-color: var(--accent-color, #2563eb);
          transform: translateY(-3px);
        }

        /* Larger Image Frame with High Subject Isolation */
        .category-image-frame {
          width: 100%;
          height: 85px; /* Increased from 48px */
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background-color: #f8fafc;
          margin-bottom: 0.5rem;
          pointer-events: none;
          overflow: hidden;
        }

        /* Maximized Image Size & Blend Fix for Backgrounds */
        .category-img {
          max-height: 75px; /* Increased object size */
          max-width: 100%;
          object-fit: contain;
          mix-blend-mode: multiply; /* Blends light/white image backgrounds into card background */
          pointer-events: none;
        }

        .category-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary, #334155);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          text-align: center;
          pointer-events: none;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (min-width: 768px) {
          .category-card {
            width: 155px; /* Scaled up for desktop viewports */
            padding: 0.85rem;
          }

          .category-image-frame {
            height: 95px;
          }

          .category-img {
            max-height: 85px;
          }

          .category-name {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}