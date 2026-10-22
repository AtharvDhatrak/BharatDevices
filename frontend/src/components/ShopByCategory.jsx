import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8089';

const CATEGORY_IMAGES = {
  laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  desktops: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=400&q=80',
  monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
  networking: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
  printers: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80',
  speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80',
  accessories: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
};

function formatCategoryName(raw) {
  if (!raw) return 'Other';
  const lower = raw.toLowerCase().trim();
  if (lower === 'laptop' || lower === 'laptops') return 'Laptops';
  if (lower === 'desktop' || lower === 'desktops') return 'Desktops';
  if (lower === 'monitor' || lower === 'monitors') return 'Monitors';
  if (lower === 'printer' || lower === 'printers') return 'Printers';
  if (lower === 'networking') return 'Networking';
  if (lower === 'speaker' || lower === 'speakers' || lower === 'audio') return 'Audio & Speakers';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function getCategoryKey(raw) {
  if (!raw) return 'other';
  const lower = raw.toLowerCase().trim();
  if (lower === 'laptop' || lower === 'laptops') return 'laptops';
  if (lower === 'desktop' || lower === 'desktops') return 'desktops';
  if (lower === 'monitor' || lower === 'monitors') return 'monitors';
  if (lower === 'printer' || lower === 'printers') return 'printers';
  if (lower === 'networking') return 'networking';
  if (lower === 'speaker' || lower === 'speakers' || lower === 'audio') return 'speaker';
  return lower;
}

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE}/base/getProducts`)
      .then(r => r.json())
      .then(data => {
        if (!isMounted) return;
        const products = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

        // Aggregate only categories that have products added in the database
        const categoryMap = new Map();

        products.forEach(p => {
          const rawCat = p.category_id || p.category || '';
          if (!rawCat) return;

          const key = getCategoryKey(rawCat);
          const name = formatCategoryName(rawCat);

          // Extract first image if available
          let productImg = '';
          try {
            const imgVal = p.image_urls?.value !== undefined ? p.image_urls.value : p.image_urls;
            const imgs = typeof imgVal === 'string' ? JSON.parse(imgVal) : imgVal;
            if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]) {
              productImg = imgs[0];
            }
          } catch (_) {}

          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              id: key,
              name,
              count: 1,
              image: productImg || CATEGORY_IMAGES[key] || CATEGORY_IMAGES.accessories,
            });
          } else {
            const existing = categoryMap.get(key);
            existing.count += 1;
            // Prefer a real product image if previously fallback
            if (!existing.image.includes('cloudinary') && productImg) {
              existing.image = productImg;
            }
          }
        });

        // Sort alphabetically by category name
        const sortedCats = Array.from(categoryMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCategories(sortedCats);
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="cat-section">
      <div className="cat-wrap">
        <div className="cat-header">
          <div>
            <h2 className="cat-heading">Shop by Category</h2>
            <p className="cat-subheading">Explore genuine devices by verified product categories</p>
          </div>
          <Link to="/products" className="cat-view-all">
            View all categories &nbsp;→
          </Link>
        </div>

        {loading ? (
          <div className="cat-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="cat-card cat-card-skeleton">
                <div className="cat-img-skeleton" />
                <div className="cat-text-skeleton" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="cat-empty">
            <p>No product categories available at the moment.</p>
            <Link to="/products" className="cat-view-all">Browse all catalog →</Link>
          </div>
        ) : (
          <div className="cat-grid">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.id)}`}
                className="cat-card"
              >
                <div className="cat-img-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="cat-img"
                    loading="lazy"
                    onError={e => {
                      e.target.src = CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES.accessories;
                    }}
                  />
                  <span className="cat-badge">{cat.count} {cat.count === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="cat-info">
                  <span className="cat-name">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .cat-section {
          background: #f8fafc;
          padding: 3rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .cat-wrap {
          max-width: 1280px;
          margin: 0 auto;
        }

        .cat-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 1rem;
        }

        .cat-heading {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .cat-subheading {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0.25rem 0 0;
        }

        .cat-view-all {
          font-size: 0.875rem;
          font-weight: 600;
          color: #F97316;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cat-view-all:hover {
          background: #F97316;
          color: #ffffff;
          border-color: #F97316;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
          transform: translateY(-1px);
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.25rem;
        }

        .cat-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 0.22s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .cat-card:hover {
          border-color: #F97316;
          box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.15),
                      0 8px 10px -6px rgba(249, 115, 22, 0.1);
          transform: translateY(-4px);
        }

        .cat-img-wrap {
          position: relative;
          width: 100%;
          height: 125px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .cat-card:hover .cat-img {
          transform: scale(1.06);
        }

        .cat-badge {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .cat-info {
          padding: 0.9rem 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: transparent;
        }

        .cat-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          transition: color 0.2s;
        }

        .cat-card:hover .cat-name {
          color: #F97316;
        }

        /* Dark mode overrides */
        html.dark .cat-section {
          background: #070d1e !important;
          border-bottom-color: #192b50 !important;
        }
        html.dark .cat-heading { color: #f8fafc !important; }
        html.dark .cat-subheading { color: #94a3b8 !important; }
        html.dark .cat-card {
          background: #0e1830 !important;
          border-color: #192b50 !important;
        }
        html.dark .cat-info {
          background: transparent !important;
        }
        html.dark .cat-name {
          color: #f8fafc !important;
        }
        html.dark .cat-card:hover .cat-name {
          color: #F97316 !important;
        }
        html.dark .cat-view-all {
          background: rgba(249, 115, 22, 0.15) !important;
          border-color: rgba(249, 115, 22, 0.35) !important;
          color: #F97316 !important;
        }
        html.dark .cat-empty {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          color: #94a3b8 !important;
        }
        html.dark .cat-card-skeleton {
          background: #0e1830 !important;
        }
        html.dark .cat-img-skeleton {
          background: linear-gradient(90deg, #0e1830 25%, #192b50 50%, #0e1830 75%) !important;
        }
        html.dark .cat-text-skeleton {
          background: #192b50 !important;
        }

        /* ── Skeletons ── */
        .cat-card-skeleton {
          pointer-events: none;
          background: #ffffff;
        }

        .cat-img-skeleton {
          width: 100%;
          height: 125px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .cat-text-skeleton {
          width: 60%;
          height: 14px;
          margin: 1rem auto;
          background: #f1f5f9;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .cat-empty {
          text-align: center;
          padding: 3rem 1rem;
          background: #ffffff;
          border-radius: 12px;
          border: 1px dashed #cbd5e1;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        @media (max-width: 768px) {
          .cat-section { padding: 2rem 1rem; }
          .cat-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
          }
          .cat-img-wrap { height: 95px; }
          .cat-name { font-size: 0.8rem; }
          .cat-info { padding: 0.65rem 0.5rem; }
          .cat-heading { font-size: 1.25rem; }
          .cat-view-all { font-size: 0.8rem; padding: 0.35rem 0.65rem; }
        }

        @media (max-width: 480px) {
          .cat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.65rem;
          }
        }
      `}</style>
    </section>
  );
}
