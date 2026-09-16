import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { productStore } from '../data/productStore';
import Sidebar from '../components/Sidebar';
import httpService from '../services/httpService';

/* ─── Constants ─── */
const BRANDS = ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Logitech', 'Samsung', 'LG'];
const CATEGORIES = ['Laptops', 'Desktops', 'Monitors', 'Networking', 'Storage', 'Accessories', 'Printers', 'CCTV'];
const SUB_CATS = {
  Laptops: ['Business Laptop', 'Gaming Laptop', 'Ultrabook', 'Workstation'],
  Desktops: ['All-in-One', 'Tower PC', 'Mini PC', 'Workstation'],
  Monitors: ['IPS Monitor', 'Curved Monitor', '4K Monitor', 'Gaming Monitor'],
  Networking: ['Router', 'Switch', 'Access Point', 'Firewall'],
  Storage: ['SSD', 'HDD', 'NAS', 'USB Drive'],
  Accessories: ['Keyboard', 'Mouse', 'Webcam', 'Headset'],
  Printers: ['Laser', 'Inkjet', 'Multifunction', 'Label Printer'],
  CCTV: ['IP Camera', 'Dome Camera', 'DVR', 'NVR'],
};
const WARRANTIES = ['1 Year', '2 Years', '3 Years', '5 Years', 'Lifetime'];
const SUPPORT_TYPES = ['Onsite', 'Carry-in', 'Online', 'Phone Support'];

const STEPS = [
  { n: 1, label: 'Basic Information' },
  { n: 2, label: 'Specifications' },
  { n: 3, label: 'Pricing & Inventory' },
  { n: 4, label: 'SEO & Settings' },
];

/* ─── Toggle Switch ─── */
function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`aap-toggle${checked ? ' aap-toggle-on' : ''}`}>
      <span className="aap-toggle-thumb" />
    </button>
  );
}

/* ─── Tag Input ─── */
function TagInput({ tags, onChange }) {
  const [val, setVal] = useState('');
  const onKey = (e) => {
    if (e.key === 'Enter' && val.trim()) {
      e.preventDefault();
      if (!tags.includes(val.trim())) onChange([...tags, val.trim()]);
      setVal('');
    }
  };
  return (
    <div className="aap-tag-input">
      {tags.map(t => (
        <span key={t} className="aap-tag">
          {t}
          <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} className="aap-tag-remove">×</button>
        </span>
      ))}
      <input
        value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKey}
        placeholder={tags.length ? '' : 'Enter tags and press Enter'}
        className="aap-tag-input-field"
      />
    </div>
  );
}

/* ─── Main Component ─── */
export default function AdminAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const existing = isEdit ? productStore.getById(id) : null;

  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);

  /* Fetch sidebar nav items */
  useEffect(() => {
    let mounted = true;
    const fetchMenus = async () => {
      try {
        const role = (localStorage.getItem('userRole') || 'ADMIN').toUpperCase();
        const res = await httpService.get('/base/menus', { params: { role } });
        const data = res?.data?.data || [];
        if (mounted && Array.isArray(data)) setNavItems([...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
      } catch { if (mounted) setNavItems([]); }
      finally { if (mounted) setNavLoading(false); }
    };
    fetchMenus();
    return () => { mounted = false; };
  }, []);

  /* Form state */
  const [basic, setBasic] = useState({
    name: existing?.name || '', sku: existing?.sku || '',
    brand: existing?.brand || '', modelNumber: existing?.modelNumber || '',
    category: existing?.category || '', subCategory: existing?.subCategory || '',
    shortDescription: existing?.shortDescription || '',
    detailedDescription: existing?.detailedDescription || '',
    tags: existing?.tags || [],
  });

  const [specs, setSpecs] = useState(existing?.specs
    ? Object.entries(existing.specs).map(([k, v]) => ({ key: k, value: v, id: Math.random() }))
    : [
        { id: 1, key: 'Processor', value: '' }, { id: 2, key: 'Display', value: '' },
        { id: 3, key: 'RAM', value: '' }, { id: 4, key: 'Storage', value: '' },
        { id: 5, key: 'Operating System', value: '' }, { id: 6, key: 'Warranty', value: '' },
      ]
  );

  const [pricing, setPricing] = useState({
    price: existing?.price || '', priceNote: existing?.priceNote || 'Price varies based on configuration',
    minQty: existing?.minQty || 1, maxQty: existing?.maxQty || '',
    stockStatus: existing?.stockStatus || 'In Stock', availableUnits: existing?.availableUnits || '',
  });

  const [seo, setSeo] = useState({
    slug: existing?.slug || '', metaTitle: existing?.metaTitle || '', metaDescription: existing?.metaDescription || '',
  });

  const [media, setMedia] = useState({ images: existing?.images || [], primaryIndex: 0, videoUrl: existing?.videoUrl || '' });

  const [quickInfo, setQuickInfo] = useState({
    status: existing?.status || 'Active', featured: existing?.featured ?? false,
    newArrival: existing?.newArrival ?? false, warrantyPeriod: existing?.warrantyPeriod || '', supportType: existing?.supportType || '',
  });

  const fileInputRef = useRef();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) setSeo(s => ({ ...s, slug: basic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
  }, [basic.name]);

  const handleImageUpload = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => setMedia(m => ({ ...m, images: [...m.images, e.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); };
  const removeImage = (i) => setMedia(m => ({ ...m, images: m.images.filter((_, idx) => idx !== i), primaryIndex: m.primaryIndex >= i && m.primaryIndex > 0 ? m.primaryIndex - 1 : m.primaryIndex }));

  const addSpec = () => setSpecs(s => [...s, { id: Math.random(), key: '', value: '' }]);
  const removeSpec = (sid) => setSpecs(s => s.filter(x => x.id !== sid));
  const updateSpec = (sid, field, val) => setSpecs(s => s.map(x => x.id === sid ? { ...x, [field]: val } : x));

  const validateBasic = () => {
    const e = {};
    if (!basic.name.trim()) e.name = 'Product name is required';
    if (!basic.brand) e.brand = 'Brand is required';
    if (!basic.category) e.category = 'Category is required';
    if (!basic.shortDescription.trim()) e.shortDescription = 'Short description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildProduct = () => ({
    ...basic,
    specs: Object.fromEntries(specs.filter(s => s.key).map(s => [s.key, s.value])),
    features: specs.filter(s => s.key && s.value).map(s => `${s.key}: ${s.value}`),
    ...pricing, price: Number(pricing.price) || 0,
    images: media.images, image: media.images[media.primaryIndex] || media.images[0] || '',
    videoUrl: media.videoUrl, ...seo, ...quickInfo, categorySlug: basic.category.toLowerCase(),
  });

  const handleSave = (asDraft = false) => {
    if (step === 1 && !validateBasic()) return;
    const product = { ...buildProduct(), status: asDraft ? 'Draft' : quickInfo.status };
    if (isEdit) productStore.update(id, product);
    else productStore.add(product);
    setSaved(true);
    setTimeout(() => navigate('/admin/products'), 800);
  };

  const handleNext = () => {
    if (step === 1 && !validateBasic()) return;
    if (step < 4) setStep(s => s + 1);
    else handleSave();
  };

  return (
    <div className="aap-shell">
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        loading={navLoading}
        activePath={location.pathname}
        onNavigate={(path) => { if (path) navigate(path); }}
      />

      {/* Main */}
      <div className="aap-main">

        {/* Top Bar */}
        <header className="aap-topbar">
          <div className="aap-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="aap-search-input" placeholder="Search products, orders, customers..." />
          </div>
          <div className="aap-topbar-right">
            <button className="aap-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="aap-badge aap-badge-red">6</span>
            </button>
            <button className="aap-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span className="aap-badge aap-badge-orange">2</span>
            </button>
            <button className="aap-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <div className="aap-user">
              <div className="aap-avatar">A</div>
              <span className="aap-user-name">Admin User</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="aap-content">

          {/* Page Header */}
          <div className="aap-page-head">
            <div>
              <nav className="aap-breadcrumb">
                <Link to="/admin" className="aap-bc-link">Dashboard</Link>
                <span className="aap-bc-sep">›</span>
                <Link to="/admin/products" className="aap-bc-link aap-bc-blue">Products</Link>
                <span className="aap-bc-sep">›</span>
                <span className="aap-bc-cur">{isEdit ? 'Edit Product' : 'Add Product'}</span>
              </nav>
              <h1 className="aap-page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
              <p className="aap-page-sub">List a new product in your catalogue. Provide accurate details to help your customers find the right solution.</p>
            </div>
            <div className="aap-head-actions">
              <button className="aap-btn-draft" onClick={() => handleSave(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                Save as Draft
              </button>
              <button className="aap-btn-save" onClick={() => handleSave(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                {saved ? 'Saved!' : 'Save Product'}
              </button>
            </div>
          </div>

          {/* Body grid */}
          <div className="aap-grid">

            {/* Left — Form */}
            <div className="aap-form-col">

              {/* ── Step 1: Basic Information ── */}
              {step === 1 && (
                <div className="aap-card">
                  <div className="aap-card-head">
                    <div className="aap-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    </div>
                    <div>
                      <h2 className="aap-card-title">Basic Information</h2>
                      <p className="aap-card-sub">Enter the essential details about your product.</p>
                    </div>
                  </div>

                  <div className="aap-field-grid">
                    <div className="aap-field">
                      <label className="aap-label">Product Name <span className="aap-req">*</span></label>
                      <input className={`aap-input${errors.name ? ' aap-input-err' : ''}`} placeholder="Enter product name"
                        value={basic.name} onChange={e => setBasic(b => ({ ...b, name: e.target.value }))} />
                      {errors.name && <span className="aap-err">{errors.name}</span>}
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Product ID (SKU) <span className="aap-req">*</span></label>
                      <input className="aap-input" placeholder="e.g. LAP-DEL-5450"
                        value={basic.sku} onChange={e => setBasic(b => ({ ...b, sku: e.target.value }))} />
                      <span className="aap-hint">Unique SKU will be auto generated if left empty</span>
                    </div>

                    <div className="aap-field">
                      <label className="aap-label">Brand <span className="aap-req">*</span></label>
                      <div className="aap-select-wrap">
                        <select className={`aap-select${errors.brand ? ' aap-input-err' : ''}`}
                          value={basic.brand} onChange={e => setBasic(b => ({ ...b, brand: e.target.value }))}>
                          <option value="">Select brand</option>
                          {BRANDS.map(b => <option key={b}>{b}</option>)}
                        </select>
                        <svg className="aap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      {errors.brand && <span className="aap-err">{errors.brand}</span>}
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Model Number <span className="aap-req">*</span></label>
                      <input className="aap-input" placeholder="Enter model number"
                        value={basic.modelNumber} onChange={e => setBasic(b => ({ ...b, modelNumber: e.target.value }))} />
                    </div>

                    <div className="aap-field">
                      <label className="aap-label">Category <span className="aap-req">*</span></label>
                      <div className="aap-select-wrap">
                        <select className={`aap-select${errors.category ? ' aap-input-err' : ''}`}
                          value={basic.category} onChange={e => setBasic(b => ({ ...b, category: e.target.value, subCategory: '' }))}>
                          <option value="">Select category</option>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <svg className="aap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      {errors.category && <span className="aap-err">{errors.category}</span>}
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Sub Category</label>
                      <div className="aap-select-wrap">
                        <select className="aap-select" value={basic.subCategory}
                          onChange={e => setBasic(b => ({ ...b, subCategory: e.target.value }))}>
                          <option value="">Select sub category</option>
                          {(SUB_CATS[basic.category] || []).map(s => <option key={s}>{s}</option>)}
                        </select>
                        <svg className="aap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="aap-field aap-field-full">
                    <label className="aap-label">Short Description <span className="aap-req">*</span></label>
                    <textarea className={`aap-input aap-textarea${errors.shortDescription ? ' aap-input-err' : ''}`} rows={3}
                      placeholder="Enter short description" maxLength={150}
                      value={basic.shortDescription} onChange={e => setBasic(b => ({ ...b, shortDescription: e.target.value }))} />
                    <div className="aap-field-foot">
                      <span className="aap-hint">This will be shown on product listing cards (150 characters max).</span>
                      <span className="aap-charcount">{basic.shortDescription.length}/150</span>
                    </div>
                    {errors.shortDescription && <span className="aap-err">{errors.shortDescription}</span>}
                  </div>

                  <div className="aap-field aap-field-full">
                    <label className="aap-label">Detailed Description</label>
                    <div className="aap-rte">
                      <div className="aap-rte-bar">
                        <select className="aap-rte-fmt"><option>Normal</option><option>Heading 1</option><option>Heading 2</option></select>
                        {['B','I','U'].map(t => (
                          <button key={t} type="button" className="aap-rte-btn" style={{ fontWeight: t==='B'?700:400, fontStyle: t==='I'?'italic':'normal', textDecoration: t==='U'?'underline':'none' }}>{t}</button>
                        ))}
                        <span className="aap-rte-divider"/>
                        {[
                          <svg key="ul" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
                          <svg key="ol" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10H6"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
                          <svg key="al" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
                          <svg key="ar" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="7" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
                          <svg key="link" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
                          <svg key="exp" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
                        ].map((icon, i) => (
                          <button key={i} type="button" className="aap-rte-btn aap-rte-icon">{icon}</button>
                        ))}
                      </div>
                      <textarea className="aap-rte-area" rows={6} placeholder="Enter detailed product description..."
                        value={basic.detailedDescription} onChange={e => setBasic(b => ({ ...b, detailedDescription: e.target.value }))} />
                    </div>
                  </div>

                  <div className="aap-field aap-field-full">
                    <label className="aap-label">Product Tags</label>
                    <TagInput tags={basic.tags} onChange={tags => setBasic(b => ({ ...b, tags }))} />
                    <span className="aap-hint">Use tags to improve search and filtering (e.g. business, laptop, dell)</span>
                  </div>
                </div>
              )}

              {/* ── Step 2: Specifications ── */}
              {step === 2 && (
                <div className="aap-card">
                  <div className="aap-card-head">
                    <div className="aap-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    </div>
                    <div>
                      <h2 className="aap-card-title">Specifications</h2>
                      <p className="aap-card-sub">Add technical specifications for the product.</p>
                    </div>
                  </div>
                  <div className="aap-spec-header">
                    <span className="aap-spec-col-lbl">Specification Name</span>
                    <span className="aap-spec-col-lbl">Value</span>
                    <span/>
                  </div>
                  {specs.map(s => (
                    <div key={s.id} className="aap-spec-row">
                      <input className="aap-input" placeholder="e.g. Processor" value={s.key} onChange={e => updateSpec(s.id, 'key', e.target.value)} />
                      <input className="aap-input" placeholder="e.g. Intel Core i5 13th Gen" value={s.value} onChange={e => updateSpec(s.id, 'value', e.target.value)} />
                      <button type="button" className="aap-spec-del" onClick={() => removeSpec(s.id)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  ))}
                  <button type="button" className="aap-add-spec" onClick={addSpec}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Specification
                  </button>
                </div>
              )}

              {/* ── Step 3: Pricing & Inventory ── */}
              {step === 3 && (
                <div className="aap-card">
                  <div className="aap-card-head">
                    <div className="aap-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div>
                      <h2 className="aap-card-title">Pricing &amp; Inventory</h2>
                      <p className="aap-card-sub">Set pricing and stock details.</p>
                    </div>
                  </div>
                  <div className="aap-field-grid">
                    <div className="aap-field">
                      <label className="aap-label">Base Price (₹) <span className="aap-req">*</span></label>
                      <input className="aap-input" type="number" placeholder="0" value={pricing.price} onChange={e => setPricing(p => ({ ...p, price: e.target.value }))} />
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Price Note</label>
                      <input className="aap-input" placeholder="Price varies based on configuration" value={pricing.priceNote} onChange={e => setPricing(p => ({ ...p, priceNote: e.target.value }))} />
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Min Order Quantity</label>
                      <input className="aap-input" type="number" min={1} value={pricing.minQty} onChange={e => setPricing(p => ({ ...p, minQty: e.target.value }))} />
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Max Order Quantity</label>
                      <input className="aap-input" type="number" value={pricing.maxQty} onChange={e => setPricing(p => ({ ...p, maxQty: e.target.value }))} />
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Stock Status</label>
                      <div className="aap-select-wrap">
                        <select className="aap-select" value={pricing.stockStatus} onChange={e => setPricing(p => ({ ...p, stockStatus: e.target.value }))}>
                          <option>In Stock</option><option>Out of Stock</option><option>Pre-order</option><option>On Request</option>
                        </select>
                        <svg className="aap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                    <div className="aap-field">
                      <label className="aap-label">Available Units</label>
                      <input className="aap-input" type="number" placeholder="e.g. 500" value={pricing.availableUnits} onChange={e => setPricing(p => ({ ...p, availableUnits: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: SEO & Settings ── */}
              {step === 4 && (
                <div className="aap-card">
                  <div className="aap-card-head">
                    <div className="aap-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <div>
                      <h2 className="aap-card-title">SEO &amp; Settings</h2>
                      <p className="aap-card-sub">Optimize for search engines and configure settings.</p>
                    </div>
                  </div>
                  <div className="aap-field aap-field-full">
                    <label className="aap-label">URL Slug</label>
                    <div className="aap-slug-wrap">
                      <span className="aap-slug-pre">/products/</span>
                      <input className="aap-input aap-slug-input" placeholder="product-url-slug"
                        value={seo.slug} onChange={e => setSeo(s => ({ ...s, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} />
                    </div>
                  </div>
                  <div className="aap-field aap-field-full">
                    <label className="aap-label">Meta Title</label>
                    <input className="aap-input" placeholder="Enter SEO meta title" value={seo.metaTitle} onChange={e => setSeo(s => ({ ...s, metaTitle: e.target.value }))} />
                  </div>
                  <div className="aap-field aap-field-full">
                    <label className="aap-label">Meta Description</label>
                    <textarea className="aap-input aap-textarea" rows={3} placeholder="Enter SEO meta description (160 chars)" maxLength={160}
                      value={seo.metaDescription} onChange={e => setSeo(s => ({ ...s, metaDescription: e.target.value }))} />
                    <div className="aap-field-foot"><span/><span className="aap-charcount">{seo.metaDescription.length}/160</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="aap-right-col">

              {/* Product Images */}
              <div className="aap-card aap-card-sm">
                <div className="aap-card-head">
                  <div className="aap-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div>
                    <h3 className="aap-card-title">Product Images</h3>
                    <p className="aap-card-sub">Upload high quality images of your product.</p>
                  </div>
                </div>
                <div className="aap-dropzone" onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  <p className="aap-drop-text">Drag &amp; drop images here</p>
                  <span className="aap-drop-or">or</span>
                  <button type="button" className="aap-choose-btn" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>Choose Files</button>
                  <p className="aap-drop-hint">JPG, PNG, WEBP up to 5MB each</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files)} />
                </div>
                {media.images.length > 0 && (
                  <div className="aap-thumbs">
                    {media.images.map((img, i) => (
                      <div key={i} className={`aap-thumb${media.primaryIndex === i ? ' aap-thumb-primary' : ''}`}>
                        <img src={img} alt="" className="aap-thumb-img" onClick={() => setMedia(m => ({ ...m, primaryIndex: i }))} />
                        <button type="button" className="aap-thumb-x" onClick={() => removeImage(i)}>×</button>
                        {media.primaryIndex === i && <span className="aap-primary-badge">Primary</span>}
                      </div>
                    ))}
                    <button type="button" className="aap-thumb-add" onClick={() => fileInputRef.current?.click()}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      <span className="aap-thumb-add-lbl">Add More</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Information */}
              <div className="aap-card aap-card-sm">
                <div className="aap-card-head">
                  <div className="aap-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <h3 className="aap-card-title">Quick Information</h3>
                </div>
                <div className="aap-qi-row">
                  <span className="aap-qi-label">Status</span>
                  <div className="aap-select-wrap">
                    <span className={`aap-status-dot ${quickInfo.status === 'Active' ? 'dot-green' : quickInfo.status === 'Draft' ? 'dot-yellow' : 'dot-gray'}`}/>
                    <select className="aap-select aap-select-sm" value={quickInfo.status} onChange={e => setQuickInfo(q => ({ ...q, status: e.target.value }))}>
                      <option>Active</option><option>Draft</option><option>Inactive</option>
                    </select>
                    <svg className="aap-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div className="aap-qi-row">
                  <span className="aap-qi-label">Featured Product</span>
                  <Toggle checked={quickInfo.featured} onChange={v => setQuickInfo(q => ({ ...q, featured: v }))} />
                </div>
                <div className="aap-qi-row">
                  <span className="aap-qi-label">New Arrival</span>
                  <Toggle checked={quickInfo.newArrival} onChange={v => setQuickInfo(q => ({ ...q, newArrival: v }))} />
                </div>
              </div>

              {/* Warranty & Support */}
              <div className="aap-card aap-card-sm">
                <div className="aap-card-head">
                  <div className="aap-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3 className="aap-card-title">Warranty &amp; Support</h3>
                </div>
                <div className="aap-qi-row">
                  <span className="aap-qi-label">Warranty Period</span>
                  <div className="aap-select-wrap">
                    <select className="aap-select aap-select-sm" value={quickInfo.warrantyPeriod} onChange={e => setQuickInfo(q => ({ ...q, warrantyPeriod: e.target.value }))}>
                      <option value="">Select warranty</option>
                      {WARRANTIES.map(w => <option key={w}>{w}</option>)}
                    </select>
                    <svg className="aap-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div className="aap-qi-row">
                  <span className="aap-qi-label">Support Type</span>
                  <div className="aap-select-wrap">
                    <select className="aap-select aap-select-sm" value={quickInfo.supportType} onChange={e => setQuickInfo(q => ({ ...q, supportType: e.target.value }))}>
                      <option value="">Select support type</option>
                      {SUPPORT_TYPES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <svg className="aap-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="aap-bottom">
            <button className="aap-btn-cancel" onClick={() => navigate('/admin/products')}>Cancel</button>
            <div className="aap-bottom-right">
              {step > 1 && (
                <button className="aap-btn-prev" onClick={() => setStep(s => s - 1)}>← Back</button>
              )}
              {step < 4
                ? <button className="aap-btn-next" onClick={handleNext}>Next →</button>
                : <button className="aap-btn-next" onClick={() => handleSave(false)}>{saved ? 'Saved!' : 'Save Product'}</button>
              }
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .aap-shell {
          display: flex;
          min-height: 100vh;
          background: #050c1a;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }

        .aap-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f1f5f9;
          min-width: 0;
          overflow: hidden;
        }

        /* Top Bar */
        .aap-topbar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 1.75rem;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .aap-search-wrap {
          flex: 1;
          max-width: 520px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem 0.9rem;
        }

        .aap-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          color: #374151;
          font-family: inherit;
        }
        .aap-search-input::placeholder { color: #94a3b8; }

        .aap-topbar-right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-left: auto;
        }

        .aap-icon-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          color: #374151;
        }
        .aap-icon-btn:hover { background: #f1f5f9; }

        .aap-badge {
          position: absolute;
          top: 5px; right: 5px;
          width: 16px; height: 16px;
          border-radius: 50%;
          font-size: 10px; font-weight: 700;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          line-height: 1;
        }
        .aap-badge-red { background: #ef4444; }
        .aap-badge-orange { background: #f97316; }

        .aap-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.65rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .aap-user:hover { background: #f1f5f9; }

        .aap-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #1d4ed8;
          color: #fff;
          font-size: 0.85rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .aap-user-name { font-size: 0.875rem; font-weight: 600; color: #374151; }

        /* Content */
        .aap-content {
          flex: 1;
          padding: 1.5rem 1.75rem 6rem;
          overflow-y: auto;
        }

        /* Page Header */
        .aap-page-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .aap-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          margin-bottom: 0.35rem;
        }
        .aap-bc-link { color: #64748b; text-decoration: none; }
        .aap-bc-link:hover { color: #2563eb; }
        .aap-bc-blue { color: #2563eb !important; font-weight: 600; }
        .aap-bc-sep { color: #d1d5db; }
        .aap-bc-cur { color: #374151; font-weight: 500; }

        .aap-page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.3rem;
        }

        .aap-page-sub {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .aap-head-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          padding-top: 0.25rem;
        }

        .aap-btn-draft {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #fff;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          padding: 0.6rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: border-color 0.2s;
        }
        .aap-btn-draft:hover { border-color: #9ca3af; }

        .aap-btn-save {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #1d4ed8;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .aap-btn-save:hover { background: #1e40af; }

        /* Grid */
        .aap-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.25rem;
          align-items: start;
        }

        /* Card */
        .aap-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .aap-card-sm { padding: 1.1rem; gap: 0.9rem; }

        .aap-card-head {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .aap-card-icon {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: #eff6ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .aap-card-title { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.15rem; }
        .aap-card-sub { font-size: 0.78rem; color: #64748b; margin: 0; }

        /* Fields */
        .aap-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .aap-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .aap-field-full { grid-column: 1 / -1; }

        .aap-label { font-size: 0.8rem; font-weight: 600; color: #374151; }
        .aap-req { color: #ef4444; }

        .aap-input {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.58rem 0.85rem;
          font-size: 0.875rem;
          color: #0f172a;
          font-family: inherit;
          outline: none;
          background: #fff;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .aap-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .aap-input-err { border-color: #ef4444 !important; }
        .aap-textarea { resize: vertical; }

        .aap-hint { font-size: 0.72rem; color: #2563eb; }
        .aap-charcount { font-size: 0.72rem; color: #94a3b8; }
        .aap-err { font-size: 0.72rem; color: #ef4444; }

        .aap-field-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Select */
        .aap-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .aap-select {
          appearance: none;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.58rem 2.2rem 0.58rem 0.85rem;
          font-size: 0.875rem;
          color: #374151;
          font-family: inherit;
          outline: none;
          background: #fff;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .aap-select:focus { border-color: #2563eb; }
        .aap-select-sm { padding: 0.32rem 2rem 0.32rem 1.75rem; font-size: 0.78rem; min-width: 130px; }

        .aap-chevron { position: absolute; right: 0.6rem; pointer-events: none; }

        .aap-status-dot {
          position: absolute;
          left: 0.55rem;
          width: 7px; height: 7px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
        .dot-green { background: #16a34a; }
        .dot-yellow { background: #d97706; }
        .dot-gray { background: #94a3b8; }

        /* Rich Text Editor */
        .aap-rte {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
        }

        .aap-rte-bar {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          padding: 0.45rem 0.65rem;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .aap-rte-fmt {
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          padding: 0.18rem 0.4rem;
          font-size: 0.78rem;
          color: #374151;
          font-family: inherit;
          background: #fff;
          cursor: pointer;
          margin-right: 0.2rem;
        }

        .aap-rte-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 26px; height: 26px;
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.875rem;
          color: #374151;
          transition: background 0.15s;
        }
        .aap-rte-btn:hover { background: #e2e8f0; }
        .aap-rte-icon { color: #374151; }

        .aap-rte-divider { width: 1px; height: 18px; background: #e5e7eb; margin: 0 0.2rem; }

        .aap-rte-area {
          width: 100%;
          border: none;
          outline: none;
          padding: 0.75rem;
          font-size: 0.875rem;
          font-family: inherit;
          color: #374151;
          background: #fff;
          resize: vertical;
        }

        /* Tag Input */
        .aap-tag-input {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 6px 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          align-items: center;
          background: #fff;
          min-height: 40px;
          cursor: text;
          transition: border-color 0.2s;
        }
        .aap-tag-input:focus-within { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

        .aap-tag {
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .aap-tag-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: #1d4ed8;
          font-size: 14px;
          line-height: 1;
          padding: 0;
        }

        .aap-tag-input-field {
          border: none;
          outline: none;
          font-size: 0.875rem;
          flex-grow: 1;
          min-width: 120px;
          font-family: inherit;
          color: #374151;
          background: transparent;
        }

        /* Specs */
        .aap-spec-header {
          display: grid;
          grid-template-columns: 1fr 1fr 40px;
          gap: 0.75rem;
          padding-bottom: 0.4rem;
        }
        .aap-spec-col-lbl { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }

        .aap-spec-row {
          display: grid;
          grid-template-columns: 1fr 1fr 40px;
          gap: 0.75rem;
          align-items: center;
        }

        .aap-spec-del {
          background: none;
          border: 1px solid #fecaca;
          border-radius: 7px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .aap-spec-del:hover { background: #fef2f2; }

        .aap-add-spec {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: 1.5px dashed #2563eb;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          color: #2563eb;
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
          align-self: flex-start;
        }
        .aap-add-spec:hover { background: #eff6ff; }

        /* Slug */
        .aap-slug-wrap {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
        }
        .aap-slug-pre {
          background: #f8fafc;
          border-right: 1px solid #d1d5db;
          padding: 0.58rem 0.85rem;
          font-size: 0.8rem;
          color: #64748b;
          white-space: nowrap;
        }
        .aap-slug-input { border: none !important; border-radius: 0 !important; box-shadow: none !important; flex: 1; }

        /* Drop Zone */
        .aap-dropzone {
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          padding: 1.75rem 1rem;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .aap-dropzone:hover { border-color: #2563eb; background: #f0f7ff; }

        .aap-drop-text { font-size: 0.85rem; color: #374151; font-weight: 500; margin: 0.15rem 0 0; }
        .aap-drop-or { font-size: 0.78rem; color: #94a3b8; }
        .aap-drop-hint { font-size: 0.72rem; color: #94a3b8; margin: 0; }

        .aap-choose-btn {
          background: #fff;
          border: 1.5px solid #2563eb;
          border-radius: 7px;
          padding: 0.4rem 1.1rem;
          font-size: 0.83rem;
          font-weight: 600;
          color: #2563eb;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .aap-choose-btn:hover { background: #eff6ff; }

        /* Thumbnails */
        .aap-thumbs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .aap-thumb {
          position: relative;
          width: 72px; height: 72px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          flex-shrink: 0;
        }
        .aap-thumb-primary { border-color: #2563eb; }

        .aap-thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer; }

        .aap-thumb-x {
          position: absolute;
          top: 3px; right: 3px;
          width: 18px; height: 18px;
          background: rgba(0,0,0,0.6);
          border: none; border-radius: 50%;
          color: #fff; font-size: 12px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }

        .aap-primary-badge {
          position: absolute;
          bottom: 3px; left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: #fff;
          font-size: 8px; font-weight: 700;
          padding: 1px 5px;
          border-radius: 3px;
          white-space: nowrap;
        }

        .aap-thumb-add {
          width: 72px; height: 72px;
          border-radius: 8px;
          border: 2px dashed #d1d5db;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .aap-thumb-add:hover { border-color: #2563eb; }
        .aap-thumb-add-lbl { font-size: 0.65rem; color: #94a3b8; font-weight: 600; }

        /* Quick Info rows */
        .aap-qi-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.35rem 0;
          border-top: 1px solid #f8fafc;
        }
        .aap-qi-label { font-size: 0.82rem; font-weight: 500; color: #374151; }

        /* Toggle */
        .aap-toggle {
          width: 44px; height: 24px;
          border-radius: 12px;
          border: none;
          background: #d1d5db;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .aap-toggle-on { background: #2563eb; }
        .aap-toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: left 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .aap-toggle-on .aap-toggle-thumb { left: 23px; }

        /* Bottom Bar */
        .aap-bottom {
          position: fixed;
          bottom: 0;
          right: 0;
          left: 0;
          background: #fff;
          border-top: 1px solid #e5e7eb;
          padding: 0.85rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 30;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
        }

        .aap-btn-cancel {
          background: #fff;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          padding: 0.6rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .aap-btn-cancel:hover { border-color: #9ca3af; }

        .aap-bottom-right { display: flex; align-items: center; gap: 0.75rem; }

        .aap-btn-prev {
          background: #fff;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          padding: 0.6rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .aap-btn-prev:hover { border-color: #9ca3af; }

        .aap-btn-next {
          background: #1d4ed8;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.75rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.2s;
        }
        .aap-btn-next:hover { background: #1e40af; }

        @media (max-width: 1100px) {
          .aap-grid { grid-template-columns: 1fr; }
          .aap-right-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        }

        @media (max-width: 768px) {
          .aap-content { padding: 1rem 1rem 6rem; }
          .aap-field-grid { grid-template-columns: 1fr; }
          .aap-page-head { flex-direction: column; }
          .aap-right-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
