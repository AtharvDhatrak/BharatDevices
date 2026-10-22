import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8089';
const ITEMS_PER_PAGE = 9;

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
  const display = specs.Display || features.find(f => /display|"/.test(String(f).toLowerCase())) || '';
  const processor = specs.Processor || features.find(f => /processor|intel|amd|ryzen|m2|m3/.test(String(f).toLowerCase())) || '';
  const os = specs['Operating System'] || features.find(f => /windows|macos|os/.test(String(f).toLowerCase())) || '';
  return [
    display && { icon: 'monitor', text: String(display) },
    processor && { icon: 'chip', text: String(processor) },
    os && { icon: 'os', text: String(os) },
  ].filter(Boolean);
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gridTopRef = useRef(null);

  const initCat = searchParams.get('category') || '';
  const initQ = searchParams.get('q') || '';

  // Products from Database
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceFromVal, setPriceFromVal] = useState(0);
  const [priceToVal, setPriceToVal] = useState(200000);
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    brands: [],
    priceFrom: 0,
    priceTo: 200000,
  });

  // UI States
  const [sortBy, setSortBy] = useState('Latest');
  const [wishlist, setWishlist] = useState([]);
  const [showAllCats, setShowAllCats] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(initQ);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch Products from Database
  useEffect(() => {
    setLoading(true);

    const fetchManual = fetch(`${API_BASE}/base/getProducts`)
      .then(r => r.json())
      .then(data => {
        const raw = data?.data || data || [];
        return (Array.isArray(raw) ? raw : []).map(p => {
          const variants = Array.isArray(p.variants) ? p.variants : [];
          const prices = variants.map(v => v.price).filter(Boolean);
          const minPrice = prices.length
            ? Math.min(...prices)
            : (p.price ? parseFloat(p.price) : 0);

          let imageUrl = '';
          try {
            const imgVal = p.image_urls?.value !== undefined ? p.image_urls.value : p.image_urls;
            const imgs = typeof imgVal === 'string' ? JSON.parse(imgVal) : imgVal;
            imageUrl = Array.isArray(imgs) ? imgs[0] : (typeof imgs === 'string' ? imgs : '');
          } catch (_) {}

          let specsObj = {};
          try {
            const sv = p.specs?.value || p.specifications?.value || p.specs || p.specifications;
            specsObj = typeof sv === 'string' ? JSON.parse(sv) : (sv || {});
          } catch (_) {}

          const rawCat = p.category_id || p.category || '';

          return {
            ...p,
            name: p.title || p.name || 'Unnamed Product',
            brand: (p.brand || '').trim(),
            category: formatCategoryName(rawCat),
            categoryKey: getCategoryKey(rawCat),
            price: minPrice,
            image: imageUrl || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
            specs: specsObj,
            features: [],
            isScraped: false,
          };
        });
      })
      .catch(() => []);

    const fetchScraped = fetch(`${API_BASE}/api/products/scraped`)
      .then(r => r.json())
      .then(raw => (Array.isArray(raw) ? raw : []).map(p => ({
        id: 's-' + p.id,
        name: p.name,
        brand: (p.brand || 'Other').trim(),
        category: p.category || 'Other',
        categoryKey: (p.category || 'other').toLowerCase(),
        price: p.price ? parseFloat(p.price) : 0,
        image: p.imageUrl || '',
        specs: {},
        features: [],
        shortDescription: p.description ? p.description.slice(0, 120) + '…' : '',
        rating: p.rating,
        stock: p.stock,
        sourceUrl: p.sourceUrl,
        sourceName: p.sourceName,
        isScraped: true,
      })))
      .catch(() => []);

    Promise.all([fetchManual, fetchScraped])
      .then(([manual, scraped]) => {
        setAllProducts([...manual, ...scraped]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 2. Derive Categories strictly present in the database, ordered alphabetically
  const dbCategories = useMemo(() => {
    const map = new Map();
    allProducts.forEach(p => {
      const name = p.category || 'Other';
      const key = p.categoryKey || getCategoryKey(name);
      if (!map.has(key)) {
        map.set(key, { key, name, count: 1 });
      } else {
        map.get(key).count += 1;
      }
    });

    // Sort alphabetically by category name
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allProducts]);

  // 3. Derive Brands strictly present in the database, ordered alphabetically
  const dbBrands = useMemo(() => {
    const map = new Map();
    allProducts.forEach(p => {
      const brand = (p.brand || '').trim();
      if (!brand || brand === '—') return;
      const key = brand.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { name: brand, count: 1 });
      } else {
        map.get(key).count += 1;
      }
    });

    // Sort alphabetically by brand name
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allProducts]);

  // 4. Synchronize URL query params with filter state on load or change
  useEffect(() => {
    if (initCat && dbCategories.length > 0) {
      const matched = dbCategories.find(
        c => c.key.toLowerCase() === initCat.toLowerCase() || c.name.toLowerCase() === initCat.toLowerCase()
      );
      if (matched) {
        setSelectedCategories([matched.name]);
        setAppliedFilters(prev => ({ ...prev, categories: [matched.name] }));
      }
    }
  }, [initCat, dbCategories]);

  useEffect(() => {
    setMobileSearch(initQ);
  }, [initQ]);

  // Checkbox handlers
  const toggleCategory = catName => {
    setSelectedCategories(prev => {
      const next = prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName];
      setAppliedFilters(af => ({ ...af, categories: next }));
      setCurrentPage(1);
      return next;
    });
  };

  const toggleBrand = brandName => {
    setSelectedBrands(prev => {
      const next = prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName];
      setAppliedFilters(af => ({ ...af, brands: next }));
      setCurrentPage(1);
      return next;
    });
  };

  const toggleWishlist = id => setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const applyFilters = () => {
    setAppliedFilters({
      categories: selectedCategories,
      brands: selectedBrands,
      priceFrom: priceFromVal,
      priceTo: priceToVal,
    });
    setCurrentPage(1);
    setShowMobileFilter(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceFromVal(0);
    setPriceToVal(200000);
    setBrandSearch('');
    setAppliedFilters({
      categories: [],
      brands: [],
      priceFrom: 0,
      priceTo: 200000,
    });
    setCurrentPage(1);
    if (initCat || initQ) navigate('/products');
  };

  const removeCategoryFilter = cat => {
    setSelectedCategories(prev => prev.filter(c => c !== cat));
    setAppliedFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
    setCurrentPage(1);
  };

  const removeBrandFilter = brand => {
    setSelectedBrands(prev => prev.filter(b => b !== brand));
    setAppliedFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
    setCurrentPage(1);
  };

  const handleMobileSearch = e => {
    e.preventDefault();
    if (mobileSearch.trim()) navigate(`/products?q=${encodeURIComponent(mobileSearch.trim())}`);
  };

  // 5. Filter & Sort Logic
  const filtered = useMemo(() => {
    let list = [...allProducts];

    // Search filter
    if (initQ) {
      const q = initQ.toLowerCase().trim();
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (appliedFilters.categories.length > 0) {
      list = list.filter(p =>
        appliedFilters.categories.some(
          c => p.category.toLowerCase() === c.toLowerCase() ||
               p.categoryKey === c.toLowerCase()
        )
      );
    }

    // Brand filter
    if (appliedFilters.brands.length > 0) {
      list = list.filter(p =>
        appliedFilters.brands.some(b => (p.brand || '').toLowerCase() === b.toLowerCase())
      );
    }

    // Price range filter
    list = list.filter(p => p.price >= appliedFilters.priceFrom && p.price <= appliedFilters.priceTo);

    // Sorting
    if (sortBy === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Name: A to Z') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sortBy === 'Name: Z to A') list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));

    return list;
  }, [appliedFilters, sortBy, initQ, allProducts]);

  // 6. Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = page => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Brand search filtering within alphabetical brand list
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return dbBrands;
    return dbBrands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()));
  }, [dbBrands, brandSearch]);

  const visibleCats = showAllCats ? dbCategories : dbCategories.slice(0, 5);
  const visibleBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 5);

  const hasActiveFilters =
    appliedFilters.categories.length > 0 ||
    appliedFilters.brands.length > 0 ||
    appliedFilters.priceFrom > 0 ||
    appliedFilters.priceTo < 200000 ||
    Boolean(initQ);

  const renderFiltersContent = () => (
    <>
      <div className="filters-top">
        <div className="filters-heading-wrap">
          <span className="filters-heading">Filters</span>
          {hasActiveFilters && (
            <span className="active-badge">Active</span>
          )}
        </div>
        <button type="button" className="clear-all-btn" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      <div className="filters-scrollable">
        {/* Categories Group (Alphabetically Sorted from DB) */}
        <div className="filter-group">
          <div className="filter-group-header">
            <span className="filter-group-title">Categories</span>
            <span className="filter-group-meta">{dbCategories.length} available</span>
          </div>

          <div className="filter-list">
            {visibleCats.map(cat => (
              <label key={cat.name} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                />
                <span className="filter-label-text">{cat.name}</span>
                <span className="filter-count">({cat.count})</span>
              </label>
            ))}
            {dbCategories.length === 0 && (
              <span className="filter-empty-hint">Loading categories...</span>
            )}
          </div>

          {dbCategories.length > 5 && (
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowAllCats(p => !p)}
            >
              {showAllCats ? '− Show fewer' : `+ Show ${dbCategories.length - 5} more`}
            </button>
          )}
        </div>

        {/* Brands Group (Alphabetically Sorted from DB) */}
        <div className="filter-group">
          <div className="filter-group-header">
            <span className="filter-group-title">Brands</span>
            <span className="filter-group-meta">{dbBrands.length} available</span>
          </div>

          <div className="brand-search-box">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="brand-search-input"
              placeholder="Search brands..."
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
            />
            {brandSearch && (
              <button
                type="button"
                className="brand-search-clear"
                onClick={() => setBrandSearch('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-list">
            {visibleBrands.map(brand => (
              <label key={brand.name} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={selectedBrands.includes(brand.name)}
                  onChange={() => toggleBrand(brand.name)}
                />
                <span className="filter-label-text">{brand.name}</span>
                <span className="filter-count">({brand.count})</span>
              </label>
            ))}
            {filteredBrands.length === 0 && (
              <span className="filter-empty-hint">No brands match "{brandSearch}"</span>
            )}
          </div>

          {filteredBrands.length > 5 && (
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowAllBrands(p => !p)}
            >
              {showAllBrands ? '− Show fewer' : `+ Show ${filteredBrands.length - 5} more`}
            </button>
          )}
        </div>

        {/* Price Range Slider */}
        <div className="filter-group">
          <div className="filter-group-header">
            <span className="filter-group-title">Price Range</span>
          </div>

          <div className="price-range-labels">
            <div className="price-tag">
              <span className="price-tag-sub">Min</span>
              <span className="price-tag-val">₹{priceFromVal.toLocaleString('en-IN')}</span>
            </div>
            <span className="price-range-sep">–</span>
            <div className="price-tag">
              <span className="price-tag-sub">Max</span>
              <span className="price-tag-val">₹{priceToVal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="price-sliders">
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={priceFromVal}
              onChange={e => {
                const val = Math.min(Number(e.target.value), priceToVal - 1000);
                setPriceFromVal(val);
              }}
              className="price-slider"
            />
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={priceToVal}
              onChange={e => {
                const val = Math.max(Number(e.target.value), priceFromVal + 1000);
                setPriceToVal(val);
              }}
              className="price-slider"
            />
          </div>
        </div>
      </div>

      <div className="filters-bottom">
        <button type="button" className="apply-filters-btn" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>
    </>
  );

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <div className="products-banner">
        <div className="products-banner-inner">
          <div className="banner-left">
            <h1 className="banner-title">
              Find the Right Device<br />for Your Business
            </h1>
            <p className="banner-sub">
              Laptops, desktops, monitors, networking gear and printers from certified global brands.
            </p>
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
            <span className="banner-badge-line1">Certified Quality</span>
            <span className="banner-badge-line2">Official Enterprise Warranty</span>
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

      {/* Main Container — Equal Height Aligned Grid */}
      <div className="products-body" ref={gridTopRef}>
        {/* Sidebar for Desktop */}
        <aside className="filters-sidebar">
          {renderFiltersContent()}
        </aside>

        {/* Product Grid Area */}
        <div className="products-grid-wrap">
          {/* Header Bar */}
          <div className="products-grid-header">
            <div className="products-header-left">
              <span className="products-count">
                Showing{' '}
                <strong>
                  {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} –{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </strong>{' '}
                of <strong>{filtered.length}</strong> products
              </span>
            </div>

            <div className="header-controls-row">
              {/* Mobile Filter Button */}
              <button type="button" className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filters {hasActiveFilters && '●'}
              </button>

              <div className="desktop-sort-wrap">
                <span className="sort-label">Sort by:</span>
                <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option>Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                  <option>Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-chips-bar">
              <span className="active-chips-label">Active:</span>
              {appliedFilters.categories.map(c => (
                <button
                  key={c}
                  type="button"
                  className="filter-chip"
                  onClick={() => removeCategoryFilter(c)}
                  title="Remove category filter"
                >
                  {c} <span className="chip-remove">✕</span>
                </button>
              ))}
              {appliedFilters.brands.map(b => (
                <button
                  key={b}
                  type="button"
                  className="filter-chip"
                  onClick={() => removeBrandFilter(b)}
                  title="Remove brand filter"
                >
                  {b} <span className="chip-remove">✕</span>
                </button>
              ))}
              {(appliedFilters.priceFrom > 0 || appliedFilters.priceTo < 200000) && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => {
                    setPriceFromVal(0);
                    setPriceToVal(200000);
                    setAppliedFilters(p => ({ ...p, priceFrom: 0, priceTo: 200000 }));
                  }}
                  title="Reset price range"
                >
                  ₹{appliedFilters.priceFrom.toLocaleString('en-IN')} – ₹{appliedFilters.priceTo.toLocaleString('en-IN')}{' '}
                  <span className="chip-remove">✕</span>
                </button>
              )}
              {initQ && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => navigate('/products')}
                  title="Clear search"
                >
                  Query: "{initQ}" <span className="chip-remove">✕</span>
                </button>
              )}
              <button
                type="button"
                className="filter-chip-clear"
                onClick={clearFilters}
              >
                Reset All
              </button>
            </div>
          )}

          {/* Scrollable Products Area */}
          <div className="products-scrollable-area">
            {loading ? (
              <div className="products-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                  <div key={i} className="product-card product-card-skeleton">
                    <div className="skeleton-img" />
                    <div className="skeleton-body">
                      <div className="skeleton-line" style={{ width: '40%' }} />
                      <div className="skeleton-line" style={{ width: '80%' }} />
                      <div className="skeleton-line" style={{ width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="products-grid">
                {paginatedProducts.map(product => {
                  const specs = getProductSpecs(product);
                  return (
                    <div key={product.id} className="product-card">
                      <div className="product-img-wrap">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-img"
                          loading="lazy"
                          onError={e => {
                            e.target.src = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <button
                          type="button"
                          className="wishlist-btn"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label="Save to wishlist"
                        >
                          <HeartIcon filled={wishlist.includes(product.id)} />
                        </button>
                        {product.brand && (
                          <span className="brand-pill">{product.brand}</span>
                        )}
                        {product.isScraped && (
                          <span className="scraped-pill">{product.sourceName || 'Catalog'}</span>
                        )}
                      </div>

                      <div className="product-info">
                        <div className="product-cat-row">
                          <span className="product-category">{product.category}</span>
                        </div>

                        <h3 className="product-name" title={product.name}>
                          {product.name}
                        </h3>

                        <div className="product-price-row">
                          {product.isScraped ? (
                            <>
                              <span className="product-price">£{product.price?.toFixed(2)}</span>
                              {product.rating && <span className="product-rating">★ {product.rating}</span>}
                            </>
                          ) : (
                            <div className="price-block">
                              <span className="price-prefix">Wholesale from</span>
                              <span className="product-price">
                                {product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                              </span>
                            </div>
                          )}
                        </div>

                        {!product.isScraped && specs.length > 0 && (
                          <div className="product-specs">
                            {specs.slice(0, 3).map((s, i) => (
                              <div key={i} className="spec-row">
                                <SpecIcon type={s.icon} />
                                <span className="spec-text">{s.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="product-actions">
                          <Link to={`/products/${product.id}`} className="view-details-btn">
                            View Details
                          </Link>
                          <Link
                            to={product.isScraped
                              ? `/enquiry?productName=${encodeURIComponent(product.name)}&productCategory=${encodeURIComponent(product.category)}`
                              : `/enquiry?product=${product.id}`}
                            className="request-quote-btn"
                          >
                            Request Quote
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <h3>No products found</h3>
                <p>We couldn't find any products matching your current filters.</p>
                <button type="button" className="apply-filters-btn" onClick={clearFilters} style={{ width: 'auto', padding: '0.65rem 1.5rem', marginTop: '0.5rem' }}>
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="page-btn page-nav-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹ Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`page-btn page-num-btn ${currentPage === num ? 'page-active' : ''}`}
                    onClick={() => handlePageChange(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="page-btn page-nav-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {showMobileFilter && (
        <div className="filter-overlay" onClick={() => setShowMobileFilter(false)}>
          <div className="filter-sheet" onClick={e => e.stopPropagation()}>
            <div className="filter-sheet-header">
              <span className="filter-sheet-title">Filter Products</span>
              <button type="button" className="filter-sheet-close" onClick={() => setShowMobileFilter(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="filter-sheet-body">
              {renderFiltersContent()}
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
          padding: 2.25rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          align-items: center;
          gap: 1.5rem;
          min-height: 160px;
          position: relative;
        }

        .banner-left { display: flex; flex-direction: column; gap: 0.5rem; }

        .banner-title {
          font-size: clamp(1.3rem, 2.5vw, 1.85rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }

        .banner-sub {
          font-size: 0.875rem;
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
        }

        .banner-badge-line1 {
          font-size: 0.82rem;
          font-weight: 700;
          color: #1e293b;
        }

        .banner-badge-line2 {
          font-size: 0.78rem;
          color: #64748b;
        }

        .banner-badge-bar {
          display: flex;
          gap: 3px;
          margin-top: 6px;
        }

        .banner-badge-bar::before,
        .banner-badge-bar::after {
          content: '';
          display: block;
          height: 3px;
          width: 24px;
          border-radius: 2px;
        }

        .banner-badge-bar::before { background: #F97316; }
        .banner-badge-bar::after  { background: #16a34a; }

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

        .header-controls-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid #fed7aa;
          background: #fff7ed;
          border-radius: 8px;
          padding: 0.45rem 0.85rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #ea580c;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .mobile-filter-btn:hover {
          background: #ffedd5;
        }

        /* ── Main Layout: Visual Consistency & Aligned Height ── */
        .products-body {
          max-width: 1360px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 1.25rem;
          height: calc(100vh - 74px);
          max-height: calc(100vh - 74px);
          box-sizing: border-box;
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .filters-sidebar {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
        }

        .filters-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .filters-heading-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filters-heading {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .active-badge {
          background: #ffedd5;
          color: #ea580c;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: #ea580c;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }

        .clear-all-btn:hover { color: #c2410c; text-decoration: underline; }

        .filters-scrollable {
          flex: 1;
          overflow-y: auto;
          padding-right: 4px;
          margin-right: -4px;
          display: flex;
          flex-direction: column;
        }

        .filters-scrollable::-webkit-scrollbar {
          width: 5px;
        }

        .filters-scrollable::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .filter-group {
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .filter-group-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .filter-group-meta {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .brand-search-box {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .brand-search-box svg {
          position: absolute;
          left: 0.65rem;
          pointer-events: none;
        }

        .brand-search-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          padding: 0.4rem 1.6rem 0.4rem 1.85rem;
          font-size: 0.8rem;
          color: #334155;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .brand-search-input:focus {
          border-color: #F97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .brand-search-clear {
          position: absolute;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 0.75rem;
          color: #94a3b8;
          cursor: pointer;
        }

        .filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .filter-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          cursor: pointer;
          padding: 2px 0;
          transition: color 0.15s;
        }

        .filter-checkbox-label:hover .filter-label-text {
          color: #F97316;
        }

        .filter-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #F97316;
          cursor: pointer;
          flex-shrink: 0;
          border-radius: 4px;
        }

        .filter-label-text {
          font-size: 0.83rem;
          color: #334155;
          flex: 1;
          font-weight: 500;
        }

        .filter-count {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .filter-empty-hint {
          font-size: 0.75rem;
          color: #94a3b8;
          font-style: italic;
          padding: 0.25rem 0;
        }

        .show-more-btn {
          background: none;
          border: none;
          color: #F97316;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
          padding: 0.2rem 0 0;
        }

        .show-more-btn:hover { text-decoration: underline; }

        .price-range-labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .price-tag {
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 4px 8px;
          min-width: 80px;
        }

        .price-tag-sub {
          font-size: 0.65rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
        }

        .price-tag-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
        }

        .price-range-sep {
          color: #94a3b8;
          font-weight: 600;
        }

        .price-sliders {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .price-slider {
          width: 100%;
          accent-color: #F97316;
          cursor: pointer;
        }

        .filters-bottom {
          padding-top: 1rem;
          margin-top: auto;
        }

        .apply-filters-btn {
          background: #F97316;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          width: 100%;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }

        .apply-filters-btn:hover {
          background: #ea580c;
          transform: translateY(-1px);
        }

        /* ── Product Grid Container ── */
        .products-grid-wrap {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
          overflow: hidden;
          gap: 0.75rem;
        }

        .products-scrollable-area {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 6px;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .products-scrollable-area::-webkit-scrollbar {
          width: 6px;
        }

        .products-scrollable-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .products-scrollable-area::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .products-scrollable-area:hover::-webkit-scrollbar-thumb {
          background: #94a3b8;
        }

        html.dark .products-scrollable-area::-webkit-scrollbar-thumb {
          background: #192b50;
        }

        html.dark .products-scrollable-area:hover::-webkit-scrollbar-thumb {
          background: #334e68;
        }

        .products-grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          gap: 1rem;
          flex-wrap: wrap;
          transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
        }

        .products-count {
          font-size: 0.85rem;
          color: #475569;
        }

        .products-count strong {
          color: #0f172a;
        }

        .desktop-sort-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sort-label {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 600;
        }

        .sort-select {
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          padding: 0.4rem 0.75rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #0f172a;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          background: #fff;
          transition: border-color 0.2s;
        }

        .sort-select:focus {
          border-color: #F97316;
        }

        /* ── Active Chips Bar ── */
        .active-chips-bar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.6rem 1rem;
        }

        .active-chips-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #ea580c;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }

        .filter-chip:hover {
          background: #ffedd5;
          border-color: #f97316;
        }

        .chip-remove {
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .filter-chip-clear {
          background: none;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          margin-left: auto;
          text-decoration: underline;
        }

        .filter-chip-clear:hover {
          color: #ef4444;
        }

        /* ── Products Grid ── */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          flex: 1;
        }

        .product-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
          border-color: #fed7aa;
        }

        .product-img-wrap {
          position: relative;
          height: 180px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        .wishlist-btn {
          position: absolute;
          top: 0.65rem;
          right: 0.65rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .wishlist-btn:hover {
          transform: scale(1.1);
        }

        .brand-pill {
          position: absolute;
          top: 0.65rem;
          left: 0.65rem;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.02em;
        }

        .scraped-pill {
          position: absolute;
          bottom: 0.65rem;
          left: 0.65rem;
          background: rgba(37, 99, 235, 0.9);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .product-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .product-cat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-category {
          font-size: 0.72rem;
          font-weight: 700;
          color: #ea580c;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .product-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5em;
        }

        .product-price-row {
          margin-top: 0.2rem;
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .price-block {
          display: flex;
          flex-direction: column;
        }

        .price-prefix {
          font-size: 0.68rem;
          color: #64748b;
          font-weight: 500;
        }

        .product-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }

        .product-rating {
          font-size: 0.75rem;
          color: #f59e0b;
          font-weight: 700;
        }

        .product-specs {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-top: 0.4rem;
          padding-top: 0.4rem;
          border-top: 1px solid #f1f5f9;
        }

        .spec-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .spec-text {
          font-size: 0.72rem;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-actions {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-top: auto;
          padding-top: 0.85rem;
        }

        .view-details-btn {
          display: block;
          text-align: center;
          padding: 0.55rem;
          border: 1.5px solid #16a34a;
          border-radius: 8px;
          color: #16a34a;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.18s;
        }

        .view-details-btn:hover {
          background: #16a34a;
          color: #ffffff;
        }

        .request-quote-btn {
          display: block;
          text-align: center;
          padding: 0.55rem;
          border: none;
          border-radius: 8px;
          background: #F97316;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.18s;
          box-shadow: 0 2px 6px rgba(249, 115, 22, 0.25);
        }

        .request-quote-btn:hover {
          background: #ea580c;
        }

        /* ── Empty State ── */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #ffffff;
          border-radius: 14px;
          border: 1px dashed #cbd5e1;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .empty-state h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0.5rem 0 0;
        }

        .empty-state p {
          font-size: 0.85rem;
          margin: 0;
        }

        /* ── Pagination ── */
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.25rem 0 0.5rem;
          margin-top: auto;
        }

        .page-btn {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
        }

        .page-nav-btn {
          padding: 0.5rem 1rem;
        }

        .page-nav-btn:hover:not(:disabled) {
          border-color: #F97316;
          color: #F97316;
          background: #fff7ed;
        }

        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .page-num-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .page-num-btn:hover:not(.page-active) {
          border-color: #fed7aa;
          background: #fff7ed;
          color: #F97316;
        }

        .page-num-btn.page-active {
          background: #F97316;
          border-color: #F97316;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
        }

        /* ── Skeletons ── */
        .product-card-skeleton {
          pointer-events: none;
        }

        .skeleton-img {
          height: 180px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .skeleton-line {
          height: 14px;
          background: #f1f5f9;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* ── Mobile Filter Sheet ── */
        .filter-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          z-index: 400;
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
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .filter-sheet-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }

        .filter-sheet-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
        }

        .filter-sheet-body {
          flex: 1;
          overflow-y: auto;
          padding: 0 1.25rem 2rem;
          display: flex;
          flex-direction: column;
        }

        /* ── Dark Mode Overrides (Soft, consistent theme transition) ── */
        html.dark .products-body {
          background: #070d1e;
        }

        html.dark .products-grid-header {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
        }

        html.dark .products-count {
          color: #94a3b8 !important;
        }

        html.dark .products-count strong {
          color: #f8fafc !important;
        }

        html.dark .sort-label {
          color: #94a3b8 !important;
        }

        html.dark .sort-select {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          color: #f8fafc !important;
        }

        html.dark .mobile-filter-btn {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          color: #cbd5e1 !important;
        }

        html.dark .filters-sidebar {
          background: #0e1830 !important;
          border-color: #192b50 !important;
        }

        html.dark .active-chips-bar {
          background: #0e1830 !important;
          border-color: #192b50 !important;
        }

        html.dark .active-chips-label {
          color: #94a3b8 !important;
        }

        html.dark .filter-chip {
          background: #132244 !important;
          border-color: #192b50 !important;
          color: #fdba74 !important;
        }

        html.dark .product-card {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
        }

        html.dark .product-card:hover {
          border-color: #f97316 !important;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.18) !important;
        }

        html.dark .product-name {
          color: #f8fafc !important;
        }

        html.dark .product-img-wrap {
          background: #0b1428 !important;
        }

        html.dark .wishlist-btn {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          color: #cbd5e1 !important;
        }

        html.dark .pagination-wrap {
          border-top-color: #192b50 !important;
        }

        html.dark .page-nav-btn {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          color: #94a3b8 !important;
        }

        html.dark .page-nav-btn:hover:not(:disabled) {
          background: #132244 !important;
          color: #f8fafc !important;
        }

        html.dark .page-num-btn {
          background: #0e1830 !important;
          border-color: #192b50 !important;
          color: #94a3b8 !important;
        }

        html.dark .page-num-btn:hover:not(.page-active) {
          background: #132244 !important;
          color: #f8fafc !important;
        }

        html.dark .page-num-btn.page-active {
          background: #f97316 !important;
          border-color: #f97316 !important;
          color: #ffffff !important;
        }

        html.dark .filter-sheet {
          background: #0e1830 !important;
          color: #f8fafc !important;
        }

        html.dark .filter-sheet-header {
          border-bottom-color: #192b50 !important;
        }

        html.dark .filter-sheet-title {
          color: #f8fafc !important;
        }

        html.dark .filter-sheet-close {
          color: #94a3b8 !important;
        }

        /* ── Responsive Adaptations ── */
        @media (max-width: 1100px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .products-body { grid-template-columns: 260px 1fr; gap: 1rem; }
        }

        @media (max-width: 860px) {
          .products-body {
            grid-template-columns: 1fr;
            padding: 0.75rem 1rem;
            height: calc(100vh - 120px);
            max-height: calc(100vh - 120px);
          }

          .filters-sidebar { display: none; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .desktop-sort-wrap { display: none; }
          .mobile-filter-row { display: flex; }
        }

        @media (max-width: 580px) {
          .products-body {
            height: calc(100vh - 110px);
            max-height: calc(100vh - 110px);
            padding: 0.5rem 0.75rem;
          }
          .mobile-search-bar { display: block; }
          .products-grid {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }

          .product-card {
            flex-direction: row;
            border-radius: 12px;
          }

          .product-img-wrap {
            width: 120px;
            height: auto;
            min-height: 140px;
            flex-shrink: 0;
          }

          .product-info { padding: 0.75rem; gap: 0.25rem; }
          .product-name { font-size: 0.84rem; -webkit-line-clamp: 2; min-height: unset; }
          .product-price { font-size: 0.92rem; }
          .product-actions { flex-direction: row; padding-top: 0.4rem; gap: 0.35rem; }
          .view-details-btn, .request-quote-btn {
            flex: 1;
            padding: 0.45rem 0.25rem;
            font-size: 0.75rem;
          }
          .wishlist-btn { width: 28px; height: 28px; top: 0.4rem; right: 0.4rem; }
        }
      `}</style>
    </div>
  );
}
