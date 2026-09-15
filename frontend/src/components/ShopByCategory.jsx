import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'laptops', name: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80' },
  { id: 'desktops', name: 'Desktops', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=300&q=80' },
  { id: 'monitors', name: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80' },
  { id: 'networking', name: 'Networking', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80' },
  { id: 'printers', name: 'Printers', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80' },
  { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80' },
];

export default function ShopByCategory() {
  return (
    <section className="cat-section">
      <div className="cat-wrap">
        <div className="cat-header">
          <h2 className="cat-heading">Shop by Category</h2>
          <Link to="/products" className="cat-view-all">View all categories &nbsp;→</Link>
        </div>

        <div className="cat-grid">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="cat-card">
              <div className="cat-img-wrap">
                <img src={cat.image} alt={cat.name} className="cat-img" loading="lazy" />
              </div>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .cat-section {
          background: #f8fafc;
          padding: 2.5rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .cat-wrap { max-width: 1280px; margin: 0 auto; }

        .cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .cat-heading {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1e293b;
        }

        .cat-view-all {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1d4ed8;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .cat-view-all:hover { text-decoration: underline; }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        .cat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 0.75rem 1.1rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }

        .cat-card:hover {
          border-color: #1d4ed8;
          box-shadow: 0 4px 16px rgba(29,78,216,0.1);
          transform: translateY(-3px);
        }

        .cat-img-wrap {
          width: 100%;
          height: 90px;
          border-radius: 10px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s;
        }

        .cat-card:hover .cat-img { transform: scale(1.05); }

        .cat-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .cat-grid { grid-template-columns: repeat(3, 1fr); }
          .cat-img-wrap { height: 100px; }
        }

        @media (max-width: 640px) {
          .cat-section { padding: 2rem 1rem; }
          .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
          .cat-img-wrap { height: 72px; }
          .cat-name { font-size: 0.78rem; }
          .cat-card { padding: 0.75rem 0.5rem 0.85rem; gap: 0.5rem; border-radius: 10px; }
        }
      `}</style>
    </section>
  );
}
