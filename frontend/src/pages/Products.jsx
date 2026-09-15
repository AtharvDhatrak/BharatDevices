import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mockData';

const CATEGORIES = [
  { name: 'Laptops', count: 12 },
  { name: 'Desktops', count: 8 },
  { name: 'Monitors', count: 6 },
  { name: 'Networking', count: 4 },
  { name: 'Printers', count: 3 },
];
const BRANDS = [
  { name: 'Dell', count: 8 },
  { name: 'HP', count: 7 },
  { name: 'Lenovo', count: 6 },
  { name: 'Asus', count: 4 },
  { name: 'Acer', count: 3 },
];

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke={filled ? '#ef4444' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function SpecIcon({ type }) {
  if (type === 'monitor') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
  if (type === 'chip') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="6" height="6"/><rect x="2" y="2" width="20" height="20" rx="2"/>
      <line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/>
      <line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/>
      <line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/>
    </svg>
  );
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function getProductSpecs(product) {
  const specs = product.specs || {};
  const features = product.features || [];
  const display = specs.Display || features.find(f => /display|"/.test(f.toLowerCase())) || '';
  const processor = specs.Processor || features.find(f => /processor|intel|amd|ryzen/.test(f.toLowerCase())) || '';
  const os = specs['Operating System'] || features.find(f => /windows|os/.test(f.toLowerCase())) || '';
  return [
    display && { icon: 'monitor', text: display },
    processor && { icon: 'chip', text: processor },
    os && { icon: 'os', text: os },
  ].filter(Boolean);
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initCat = searchParams.get('category') || '';
  const initQ = searchParams.get('q') || '';

  const [selectedCategories, setSelectedCategories] = useState(
    initCat ? [initCat.charAt(0).toUpperCase() + initCat.slice(1)] : []
  );
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceFromVal, setPriceFromVal] = useState(20000);
  const [priceToVal, setPriceToVal] = useState(200000);
  const [sortBy, setSortBy] = useState('Latest');
  const [wishlist, setWishlist] = useState([]);
  const [showAllCats, setShowAllCats] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ categories: [], brands: [], priceFrom: 20000, priceTo: 200000 });
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(initQ);

  const toggleCategory = cat => setSelectedCategories(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]);
  const toggleBrand = brand => setSelectedBrands(p => p.includes(brand) ? p.filter(b => b !== brand) : [...p, brand]);
  const toggleWishlist = id => setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const applyFilters = () => {
    setAppliedFilters({ categories: selectedCategories, brands: selectedBrands, priceFrom: priceFromVal, priceTo: priceToVal });
    setShowMobileFilter(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceFromVal(20000);
    setPriceToVal(200000);
    setAppliedFilters({ categories: [], brands: [], priceFrom: 20000, priceTo: 200000 });
  };

  const handleMobileSearch = e => {
    e.preventDefault();
    if (mobileSearch.trim()) navigate(`/products?q=${encodeURIComponent(mobileSearch.trim())}`);
  };

  const filtered = useMemo(() => {
    let list = [...mockProducts];
    if (initQ) list = list.filter(p => p.name.toLowerCase().includes(initQ.toLowerCase()) || p.brand.toLowerCase().includes(initQ.toLowerCase()));
    if (appliedFilters.categories.length) list = list.filter(p => appliedFilters.categories.some(c => p.category.toLowerCase().includes(c.toLowerCase())));
    if (appliedFilters.brands.length) list = list.filter(p => appliedFilters.brands.includes(p.brand));
    list = list.filter(p => p.price >= appliedFilters.priceFrom && p.price <= appliedFilters.priceTo);
    if (sortBy === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    return list;
  }, [appliedFilters, sortBy, initQ]);

  const visibleCats = showAllCats ? CATEGORIES : CATEGORIES.slice(0, 5);
  const filteredBrands = BRANDS.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()));
  const visibleBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 5);

  const renderFilters = () => (
    <>
      <div className="filters-top">
        <span className="filters-heading">Filters</span>
        <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
      </div>

      <div className="filter-group">
        <div className="filter-group-header">
          <span className="filter-group-title">Categories</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        {visibleCats.map(cat => (
          <label key={cat.name} className="filter-checkbox-label">
            <input type="checkbox" className="filter-checkbox" checked={selectedCategories.includes(cat.name)} onChange={() => toggleCategory(cat.name)} />
            <span className="filter-label-text">{cat.name}</span>
            <span className="filter-count">({cat.count})</span>
          </label>
        ))}
        <button className="show-more-btn" onClick={() => setShowAllCats(p => !p)}>
          {showAllCats ? '− Show less' : '+ Show more'}
        </button>
      </div>

      <div className="filter-group">
        <div className="filter-group-header">
          <span className="filter-group-title">Brands</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <input type="text" className="brand-search-input" placeholder="Search brand..." value={brandSearch} onChange={e => setBrandSearch(e.target.value)} />
        {visibleBrands.map(brand => (
          <label key={brand.name} className="filter-checkbox-label">
            <input type="checkbox" className="filter-checkbox" checked={selectedBrands.includes(brand.name)} onChange={() => toggleBrand(brand.name)} />
            <span className="filter-label-text">{brand.name}</span>
            <span className="filter-count">({brand.count})</span>
          </label>
        ))}
        {filteredBrands.length > 5 && (
          <button className="show-more-btn" onClick={() => setShowAllBrands(p => !p)}>
            {showAllBrands ? '− Show less' : '+ Show more'}
          </button>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-group-header">
          <span className="filter-group-title">Price Range</span>
        </div>
        <div className="price-range-labels">
          <span>₹{priceFromVal.toLocaleString('en-IN')}</span>
          <span>₹{priceToVal.toLocaleString('en-IN')}</span>
        </div>
        <div className="price-sliders">
          <input type="range" min={0} max={200000} step={1000} value={priceFromVal} onChange={e => setPriceFromVal(Number(e.target.value))} className="price-slider" />
          <input type="range" min={0} max={200000} step={1000} value={priceToVal} onChange={e => setPriceToVal(Number(e.target.value))} className="price-slider" />
        </div>
      </div>

      <button className="apply-filters-btn" onClick={applyFilters}>Apply Filters</button>
    </>
  );

  return (
    <div className="products-page">

      {/* Hero Banner */}
      <div className="products-banner">
        <div className="products-banner-inner">
          <div className="banner-left">
            <h1 className="banner-title">Find the Right Device<br />for Your Business</h1>
            <p className="banner-sub">Laptops, desktops, monitors and more from trusted global brands.</p>
          </div>
          <div className="banner-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80"
              alt="Business Laptops"
              className="banner-img banner-img-main"
            />
            <img
              src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80"
              alt="Monitor"
              className="banner-img banner-img-side"
            />
          </div>
          <div className="banner-badge">
            <span className="banner-badge-line1">Reliable Technology</span>
            <span className="banner-badge-line2">for a Smarter Tomorrow</span>
            <div className="banner-badge-bar"></div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mobile-search-bar">
        <form onSubmit={handleMobileSearch} className="mobile-search-form">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search products, brands or keywords..."
            value={mobileSearch}
            onChange={e => setMobileSearch(e.target.value)}
            className="mobile-search-input"
          />
        </form>
      </div>

      {/* Toolbar: Breadcrumb + Mobile Filter Row */}
      <div className="products-toolbar">
        <div className="products-toolbar-inner">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Products</span>
          </nav>
          <div className="mobile-filter-row">
            <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
            </button>
            <div className="mobile-sort-wrap">
              <span className="sort-label">Sort:</span>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option>Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="products-body">

        {/* Sidebar — desktop only */}
        <aside className="filters-sidebar">
          {renderFilters()}
        </aside>

        {/* Grid/List */}
        <div className="products-grid-wrap">
          <div className="products-grid-header">
            <span className="products-count">Showing 1 – {filtered.length} of {filtered.length} products</span>
            <div className="desktop-sort-wrap">
              <span className="sort-label">Sort by:</span>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option>Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filtered.map(product => {
              const specs = getProductSpecs(product);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-img-wrap">
                    <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
                    <button className="wishlist-btn" onClick={() => toggleWishlist(product.id)}>
                      <HeartIcon filled={wishlist.includes(product.id)} />
                    </button>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-category">{product.category}</span>
                    <span className="product-price">₹{product.price.toLocaleString('en-IN')} onwards</span>
                    {specs.length > 0 && (
                      <div className="product-specs">
                        {specs.map((s, i) => (
                          <div key={i} className="spec-row">
                            <SpecIcon type={s.icon} />
                            <span className="spec-text">{s.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="product-actions">
                      <Link to={`/products/${product.id}`} className="view-details-btn">View Details</Link>
                      <Link to="/enquiry" className="request-quote-btn">Request Quote</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No products match your filters.</p>
              <button className="clear-all-btn" onClick={clearFilters} style={{ marginTop: '0.5rem' }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {showMobileFilter && (
        <div className="filter-overlay" onClick={() => setShowMobileFilter(false)}>
          <div className="filter-sheet" onClick={e => e.stopPropagation()}>
            <div className="filter-sheet-header">
              <span className="filter-sheet-title">Filters</span>
              <button className="filter-sheet-close" onClick={() => setShowMobileFilter(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="filter-sheet-body">
              {renderFilters()}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .products-page {
          background: #f8fafc;
          min-height: 100vh;
        }

        /* ── Banner ── */
        .products-banner {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .products-banner-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          align-items: center;
          gap: 1.5rem;
          min-height: 160px;
          position: relative;
        }

        .banner-left { display: flex; flex-direction: column; gap: 0.5rem; }

        .banner-title {
          font-size: clamp(1.2rem, 2.5vw, 1.75rem);
          font-weight: 800;
          color: #1e293b;
          line-height: 1.25;
        }

        .banner-sub {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.5;
        }

        .banner-img-wrap {
          position: relative;
          height: 130px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .banner-img { object-fit: cover; border-radius: 10px; display: block; }

        .banner-img-main {
          height: 120px;
          width: 220px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          z-index: 1;
        }

        .banner-img-side {
          height: 90px;
          width: 120px;
          margin-left: -20px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }

        .banner-badge {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-left: 1.5rem;
          border-left: none;
        }

        .banner-badge-line1 {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .banner-badge-line2 {
          font-size: 0.8rem;
          color: #64748b;
        }

        .banner-badge-bar {
          width: 36px;
          height: 3px;
          background: #1d4ed8;
          border-radius: 2px;
          margin-top: 6px;
        }

        /* ── Mobile Search ── */
        .mobile-search-bar {
          display: none;
          padding: 0.75rem 1rem;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .mobile-search-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
        }

        .mobile-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #374151;
          font-family: inherit;
        }

        .mobile-search-input::placeholder { color: #94a3b8; }

        /* ── Toolbar ── */
        .products-toolbar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .products-toolbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.6rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
        }

        .breadcrumb-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s;
        }

        .breadcrumb-link:hover { color: #1d4ed8; }

        .breadcrumb-sep { color: #94a3b8; }

        .breadcrumb-current {
          color: #1e293b;
          font-weight: 500;
        }

        .mobile-filter-row { display: none; align-items: center; gap: 0.75rem; }

        .mobile-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 8px;
          padding: 0.45rem 0.85rem;
          font-size: 0.83rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .mobile-filter-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }

        .mobile-sort-wrap { display: flex; align-items: center; gap: 0.4rem; }

        /* ── Body ── */
        .products-body {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* ── Sidebar ── */
        .filters-sidebar {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem;
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .filters-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .filters-heading { font-size: 1rem; font-weight: 700; color: #1e293b; }

        .clear-all-btn {
          background: none;
          border: none;
          color: #1d4ed8;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .filter-group {
          padding: 0.9rem 0;
          border-top: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .filter-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
          cursor: pointer;
        }

        .filter-group-title { font-size: 0.875rem; font-weight: 600; color: #374151; }

        .filter-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          cursor: pointer;
        }

        .filter-checkbox {
          width: 15px;
          height: 15px;
          accent-color: #1d4ed8;
          cursor: pointer;
          flex-shrink: 0;
        }

        .filter-label-text { font-size: 0.82rem; color: #374151; flex: 1; }

        .filter-count { font-size: 0.75rem; color: #94a3b8; }

        .show-more-btn {
          background: none;
          border: none;
          color: #1d4ed8;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          padding: 0.15rem 0;
        }

        .brand-search-input {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 0.4rem 0.6rem;
          font-size: 0.82rem;
          color: #374151;
          outline: none;
          font-family: inherit;
          width: 100%;
        }

        .brand-search-input:focus { border-color: #1d4ed8; }

        .price-range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .price-sliders { display: flex; flex-direction: column; gap: 0.4rem; }

        .price-slider { width: 100%; accent-color: #1d4ed8; cursor: pointer; }

        .apply-filters-btn {
          margin-top: 0.5rem;
          background: #1d4ed8;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.7rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
        }

        .apply-filters-btn:hover { background: #1e40af; }

        /* ── Grid Header ── */
        .products-grid-wrap { display: flex; flex-direction: column; gap: 1rem; }

        .products-grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.7rem 1rem;
        }

        .products-count { font-size: 0.82rem; color: #64748b; }

        .desktop-sort-wrap { display: flex; align-items: center; gap: 0.5rem; }

        .sort-label { font-size: 0.82rem; color: #374151; font-weight: 500; }

        .sort-select {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 0.3rem 0.5rem;
          font-size: 0.82rem;
          color: #374151;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          background: #fff;
        }

        /* ── Product Cards (Desktop Grid) ── */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .product-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .product-img-wrap {
          position: relative;
          height: 160px;
          background: #f8fafc;
          flex-shrink: 0;
          overflow: hidden;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .product-card:hover .product-img { transform: scale(1.04); }

        .wishlist-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s;
          padding: 0;
        }

        .wishlist-btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }

        .product-info {
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .product-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
        }

        .product-category {
          font-size: 0.73rem;
          color: #64748b;
        }

        .product-price {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 0.15rem;
        }

        .product-specs {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-top: 0.35rem;
          padding-top: 0.35rem;
          border-top: 1px solid #f1f5f9;
        }

        .spec-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .spec-text {
          font-size: 0.73rem;
          color: #475569;
          line-height: 1.3;
        }

        .product-actions {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: auto;
          padding-top: 0.6rem;
        }

        .view-details-btn {
          display: block;
          text-align: center;
          padding: 0.5rem;
          border: 1.5px solid #1d4ed8;
          border-radius: 7px;
          color: #1d4ed8;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }

        .view-details-btn:hover { background: #1d4ed8; color: #ffffff; }

        .request-quote-btn {
          display: block;
          text-align: center;
          padding: 0.5rem;
          border: none;
          border-radius: 7px;
          background: #1d4ed8;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
          cursor: pointer;
        }

        .request-quote-btn:hover { background: #1e40af; }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        /* ── Mobile Filter Sheet ── */
        .filter-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 300;
          display: flex;
          align-items: flex-end;
        }

        .filter-sheet {
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .filter-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .filter-sheet-title { font-size: 1rem; font-weight: 700; color: #1e293b; }

        .filter-sheet-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .filter-sheet-body {
          flex: 1;
          overflow-y: auto;
          padding: 0 1.25rem 2rem;
        }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
          .products-banner-inner { grid-template-columns: 1fr 1fr; }
          .banner-badge { display: none; }
        }

        @media (max-width: 900px) {
          .products-body {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .filters-sidebar { display: none; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .desktop-sort-wrap { display: none; }
          .mobile-filter-row { display: flex; }
          .products-banner-inner {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            padding: 1.25rem 1rem;
            min-height: unset;
          }
          .banner-img-wrap { display: none; }
          .banner-badge { display: none; }
          .products-toolbar-inner { padding: 0.6rem 1rem; }
        }

        @media (max-width: 640px) {
          .mobile-search-bar { display: block; }
          .products-grid { grid-template-columns: 1fr; }

          /* Switch to list layout on small screens */
          .products-grid {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .product-card {
            flex-direction: row;
            border-radius: 10px;
          }

          .product-img-wrap {
            width: 120px;
            height: auto;
            min-height: 130px;
            flex-shrink: 0;
            border-radius: 0;
          }

          .product-img { height: 100%; }

          .product-card:hover .product-img { transform: none; }

          .product-info { padding: 0.75rem; gap: 0.2rem; }

          .product-name { font-size: 0.82rem; }

          .product-price { font-size: 0.85rem; }

          .product-specs { margin-top: 0.25rem; padding-top: 0.25rem; }

          .product-actions { flex-direction: row; padding-top: 0.5rem; gap: 0.35rem; }

          .view-details-btn,
          .request-quote-btn { flex: 1; font-size: 0.72rem; padding: 0.4rem 0.25rem; }

          .wishlist-btn { width: 26px; height: 26px; }
        }

        @media (max-width: 400px) {
          .product-img-wrap { width: 100px; }
        }
      `}</style>
    </div>
  );
}
