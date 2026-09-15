import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mockData';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === Number(id)) || mockProducts[0];

  const [activeImg, setActiveImg] = useState(0);
  const images = product.images || [product.image];

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="bread-link">Home</Link>
          <span className="bread-sep">&rsaquo;</span>
          <Link to="/products" className="bread-link">
            {product.categorySlug ? product.categorySlug.charAt(0).toUpperCase() + product.categorySlug.slice(1) : 'Products'}
          </Link>
          <span className="bread-sep">&rsaquo;</span>
          <span className="bread-current">{product.name}</span>
        </nav>

        <div className="detail-grid">
          {/* Image Gallery */}
          <div className="gallery">
            <div className="thumbnail-col">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb-btn${activeImg === i ? ' thumb-active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} className="thumb-img" />
                </button>
              ))}
            </div>
            <div className="main-img-wrap">
              <img src={images[activeImg]} alt={product.name} className="main-img" />
            </div>
          </div>

          {/* Product Info */}
          <div className="detail-info">
            <h1 className="detail-name">{product.name}</h1>
            <span className="detail-category-badge">{product.category}</span>

            <div className="detail-meta">
              <div className="meta-row">
                <span className="meta-label">Brand:</span>
                <span className="meta-value">{product.brand}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Category:</span>
                <span className="meta-value">Business {product.category}</span>
              </div>
            </div>

            <div className="detail-price-block">
              <span className="detail-price">₹{product.price.toLocaleString('en-IN')} onwards</span>
              <span className="price-note">*Price varies based on configuration</span>
            </div>

            {product.features && (
              <ul className="features-list">
                {product.features.map((f, i) => (
                  <li key={i} className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="detail-ctas">
              <button
                className="btn-quote"
                onClick={() => navigate(`/enquiry?product=${product.id}`)}
              >
                Request Quote
              </button>
              <button className="btn-datasheet">
                Download Datasheet
              </button>
            </div>
          </div>
        </div>

        {/* Specs + Need Help */}
        <div className="bottom-grid">
          {product.specs && (
            <div className="specs-card">
              <h2 className="specs-heading">Specifications</h2>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key} className="spec-row">
                      <td className="spec-key">{key}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="need-help-card">
            <h3 className="help-heading">Need Help?</h3>
            <p className="help-sub">Our team is ready to help you</p>
            <a href="tel:+911244567800" className="help-contact">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +91 124 456 7800
            </a>
            <a href="mailto:sales@bharatdevices.com" className="help-contact">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              sales@bharatdevices.com
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .detail-page {
          background: #f8fafc;
          min-height: 100vh;
          padding: 1.5rem;
        }

        .detail-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.83rem;
        }

        .bread-link {
          color: #1d4ed8;
          text-decoration: none;
          font-weight: 500;
        }

        .bread-link:hover { text-decoration: underline; }

        .bread-sep { color: #94a3b8; }

        .bread-current {
          color: #374151;
          font-weight: 500;
        }

        /* Main Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 1.75rem;
        }

        /* Gallery */
        .gallery {
          display: flex;
          gap: 0.75rem;
        }

        .thumbnail-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .thumb-btn {
          width: 60px;
          height: 60px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          background: #f8fafc;
          transition: border-color 0.2s;
        }

        .thumb-btn.thumb-active { border-color: #1d4ed8; }

        .thumb-btn:hover { border-color: #93c5fd; }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .main-img-wrap {
          flex: 1;
          border-radius: 10px;
          overflow: hidden;
          background: #f8fafc;
          aspect-ratio: 4/3;
        }

        .main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Info */
        .detail-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.2;
        }

        .detail-category-badge {
          display: inline-block;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          border: 1px solid #bfdbfe;
        }

        .detail-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .meta-row {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .meta-label { color: #64748b; }
        .meta-value { color: #374151; font-weight: 600; }

        .detail-price-block {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .detail-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #b45309;
        }

        .price-note {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #374151;
        }

        .detail-ctas {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .btn-quote {
          background: #1d4ed8;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-quote:hover { background: #1e40af; }

        .btn-datasheet {
          background: #ffffff;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .btn-datasheet:hover { border-color: #1d4ed8; color: #1d4ed8; }

        /* Bottom Grid */
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 1.5rem;
        }

        .specs-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 1.5rem;
        }

        .specs-heading {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .spec-row:nth-child(even) { background: #f8fafc; }

        .spec-key, .spec-val {
          padding: 0.65rem 0.75rem;
          font-size: 0.85rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .spec-key {
          color: #64748b;
          font-weight: 500;
          width: 40%;
        }

        .spec-val {
          color: #374151;
          font-weight: 600;
        }

        .need-help-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .help-heading {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
        }

        .help-sub {
          font-size: 0.83rem;
          color: #64748b;
          margin-top: -0.4rem;
        }

        .help-contact {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
          padding: 0.5rem 0;
          border-top: 1px solid #f1f5f9;
        }

        .help-contact:hover { color: #1d4ed8; }

        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr; }
          .bottom-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .detail-page { padding: 1rem; }
          .gallery { flex-direction: column; }
          .thumbnail-col { flex-direction: row; }
          .detail-ctas { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
