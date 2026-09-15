import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productStore } from '../data/productStore';

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
  { n: 1, label: 'Basic Information', sub: 'Add basic product details' },
  { n: 2, label: 'Specifications', sub: 'Add product specifications' },
  { n: 3, label: 'Pricing & Inventory', sub: 'Set pricing and stock details' },
  { n: 4, label: 'Media & Documents', sub: 'Upload images and files' },
  { n: 5, label: 'SEO & Settings', sub: 'SEO and other settings' },
];

/* ─── Toggle Switch ─── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? '#1d4ed8' : '#d1d5db', position: 'relative', transition: 'background .2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
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
    <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 10px', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', background: '#fff' }}>
      {tags.map(t => (
        <span key={t} style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
          {t}
          <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1d4ed8', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
        </span>
      ))}
      <input
        value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKey}
        placeholder={tags.length ? '' : 'Enter tags and press Enter'}
        style={{ border: 'none', outline: 'none', fontSize: 13, flexGrow: 1, minWidth: 120, fontFamily: 'inherit' }}
      />
    </div>
  );
}

/* ─── Main Component ─── */
export default function AdminAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = isEdit ? productStore.getById(id) : null;

  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);

  /* Form state */
  const [basic, setBasic] = useState({
    name: existing?.name || '',
    sku: existing?.sku || '',
    brand: existing?.brand || '',
    modelNumber: existing?.modelNumber || '',
    category: existing?.category || '',
    subCategory: existing?.subCategory || '',
    shortDescription: existing?.shortDescription || '',
    detailedDescription: existing?.detailedDescription || '',
    tags: existing?.tags || [],
  });

  const [specs, setSpecs] = useState(
    existing?.specs
      ? Object.entries(existing.specs).map(([k, v]) => ({ key: k, value: v, id: Math.random() }))
      : [
          { id: 1, key: 'Processor', value: '' },
          { id: 2, key: 'Display', value: '' },
          { id: 3, key: 'RAM', value: '' },
          { id: 4, key: 'Storage', value: '' },
          { id: 5, key: 'Operating System', value: '' },
          { id: 6, key: 'Warranty', value: '' },
        ]
  );

  const [pricing, setPricing] = useState({
    price: existing?.price || '',
    priceNote: existing?.priceNote || 'Price varies based on configuration',
    minQty: existing?.minQty || 1,
    maxQty: existing?.maxQty || '',
    stockStatus: existing?.stockStatus || 'In Stock',
    availableUnits: existing?.availableUnits || '',
  });

  const [media, setMedia] = useState({
    images: existing?.images || [],
    primaryIndex: 0,
    datasheetName: '',
    videoUrl: existing?.videoUrl || '',
  });

  const [seo, setSeo] = useState({
    slug: existing?.slug || basic.name.toLowerCase().replace(/\s+/g, '-'),
    metaTitle: existing?.metaTitle || '',
    metaDescription: existing?.metaDescription || '',
  });

  const [quickInfo, setQuickInfo] = useState({
    status: existing?.status || 'Active',
    featured: existing?.featured ?? false,
    newArrival: existing?.newArrival ?? false,
    warrantyPeriod: existing?.warrantyPeriod || '',
    supportType: existing?.supportType || '',
  });

  const fileInputRef = useRef();
  const [deleteModal, setDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

  /* Sync slug when name changes */
  useEffect(() => {
    if (!isEdit) setSeo(s => ({ ...s, slug: basic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
  }, [basic.name]);

  /* Image upload */
  const handleImageUpload = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => setMedia(m => ({ ...m, images: [...m.images, e.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); };

  const removeImage = (i) => setMedia(m => ({
    ...m,
    images: m.images.filter((_, idx) => idx !== i),
    primaryIndex: m.primaryIndex >= i && m.primaryIndex > 0 ? m.primaryIndex - 1 : m.primaryIndex,
  }));

  /* Spec rows */
  const addSpec = () => setSpecs(s => [...s, { id: Math.random(), key: '', value: '' }]);
  const removeSpec = (sid) => setSpecs(s => s.filter(x => x.id !== sid));
  const updateSpec = (sid, field, val) => setSpecs(s => s.map(x => x.id === sid ? { ...x, [field]: val } : x));

  /* Validate step 1 */
  const validateBasic = () => {
    const e = {};
    if (!basic.name.trim()) e.name = 'Product name is required';
    if (!basic.brand) e.brand = 'Brand is required';
    if (!basic.category) e.category = 'Category is required';
    if (!basic.shortDescription.trim()) e.shortDescription = 'Short description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* Build product object */
  const buildProduct = () => ({
    ...basic,
    specs: Object.fromEntries(specs.filter(s => s.key).map(s => [s.key, s.value])),
    features: specs.filter(s => s.key && s.value).map(s => `${s.key}: ${s.value}`),
    ...pricing,
    price: Number(pricing.price) || 0,
    images: media.images,
    image: media.images[media.primaryIndex] || media.images[0] || '',
    videoUrl: media.videoUrl,
    ...seo,
    ...quickInfo,
    categorySlug: basic.category.toLowerCase(),
  });

  const handleSave = (asDraft = false) => {
    if (step === 1 && !validateBasic()) return;
    const product = { ...buildProduct(), status: asDraft ? 'Draft' : quickInfo.status };
    if (isEdit) { productStore.update(id, product); }
    else { productStore.add(product); }
    setSaved(true);
    setTimeout(() => navigate('/admin/products'), 800);
  };

  const handleNext = () => {
    if (step === 1 && !validateBasic()) return;
    if (step < 5) setStep(s => s + 1);
    else handleSave();
  };

  /* ─── Render ─── */
  return (
    <div className="ap-page">
      {/* Top Header */}
      <header className="ap-header">
        <div className="ap-header-left">
          <div className="ap-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="ap-search-input" placeholder="Search anything..." />
          </div>
        </div>
        <div className="ap-header-right">
          <button className="ap-icon-btn ap-notif">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="badge badge-red">6</span>
          </button>
          <button className="ap-icon-btn ap-mail">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span className="badge badge-orange">2</span>
          </button>
          <button className="ap-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>
          <button className="ap-user-btn">
            <div className="ap-avatar">A</div>
            <span className="ap-user-name">Admin User</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </header>

      {/* Page Title Bar */}
      <div className="ap-title-bar">
        <div>
          <h1 className="ap-page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <nav className="ap-breadcrumb">
            <Link to="/admin" className="ap-bread-link">Dashboard</Link>
            <span className="ap-bread-sep">›</span>
            <Link to="/admin/products" className="ap-bread-link ap-bread-active">Products</Link>
            <span className="ap-bread-sep">›</span>
            <span className="ap-bread-cur">{isEdit ? 'Edit Product' : 'Add Product'}</span>
          </nav>
        </div>
        <div className="ap-title-actions">
          <button className="ap-btn-cancel" onClick={() => navigate('/admin/products')}>Cancel</button>
          <button className="ap-btn-save" onClick={() => handleSave(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saved ? 'Saved!' : 'Save Product'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="ap-body">
        {/* Left Step Nav */}
        <aside className="ap-steps-nav">
          {STEPS.map(s => (
            <button
              key={s.n}
              className={`ap-step-item${step === s.n ? ' ap-step-active' : step > s.n ? ' ap-step-done' : ''}`}
              onClick={() => setStep(s.n)}
            >
              <div className="ap-step-circle">
                {step > s.n
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : s.n}
              </div>
              <div className="ap-step-text">
                <span className="ap-step-label">{s.label}</span>
                <span className="ap-step-sub">{s.sub}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Center Form */}
        <main className="ap-form-area">

          {/* ── Step 1: Basic Information ── */}
          {step === 1 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <div>
                  <h2 className="ap-section-title">Basic Information</h2>
                  <p className="ap-section-sub">Enter basic details about the product</p>
                </div>
              </div>

              <div className="ap-field-grid">
                <div className="ap-field">
                  <label className="ap-label">Product Name <span className="ap-req">*</span></label>
                  <input className={`ap-input${errors.name ? ' ap-input-err' : ''}`} placeholder="Enter product name"
                    value={basic.name} onChange={e => setBasic(b => ({ ...b, name: e.target.value }))} />
                  {errors.name && <span className="ap-err-msg">{errors.name}</span>}
                </div>
                <div className="ap-field">
                  <label className="ap-label">Product ID (SKU)</label>
                  <input className="ap-input" placeholder="e.g. LAP-DEL-5450"
                    value={basic.sku} onChange={e => setBasic(b => ({ ...b, sku: e.target.value }))} />
                  <span className="ap-hint">Unique SKU will be auto generated if left empty</span>
                </div>

                <div className="ap-field">
                  <label className="ap-label">Brand <span className="ap-req">*</span></label>
                  <div className="ap-select-wrap">
                    <select className={`ap-select${errors.brand ? ' ap-input-err' : ''}`}
                      value={basic.brand} onChange={e => setBasic(b => ({ ...b, brand: e.target.value }))}>
                      <option value="">Select brand</option>
                      {BRANDS.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <svg className="ap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  {errors.brand && <span className="ap-err-msg">{errors.brand}</span>}
                </div>
                <div className="ap-field">
                  <label className="ap-label">Model Number <span className="ap-req">*</span></label>
                  <input className="ap-input" placeholder="Enter model number"
                    value={basic.modelNumber} onChange={e => setBasic(b => ({ ...b, modelNumber: e.target.value }))} />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Category <span className="ap-req">*</span></label>
                  <div className="ap-select-wrap">
                    <select className={`ap-select${errors.category ? ' ap-input-err' : ''}`}
                      value={basic.category}
                      onChange={e => setBasic(b => ({ ...b, category: e.target.value, subCategory: '' }))}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <svg className="ap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  {errors.category && <span className="ap-err-msg">{errors.category}</span>}
                </div>
                <div className="ap-field">
                  <label className="ap-label">Sub Category</label>
                  <div className="ap-select-wrap">
                    <select className="ap-select" value={basic.subCategory}
                      onChange={e => setBasic(b => ({ ...b, subCategory: e.target.value }))}>
                      <option value="">Select sub category</option>
                      {(SUB_CATS[basic.category] || []).map(s => <option key={s}>{s}</option>)}
                    </select>
                    <svg className="ap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="ap-field ap-field-full">
                <label className="ap-label">Short Description <span className="ap-req">*</span></label>
                <textarea className={`ap-input ap-textarea${errors.shortDescription ? ' ap-input-err' : ''}`} rows={3}
                  placeholder="Enter short description"
                  maxLength={150}
                  value={basic.shortDescription}
                  onChange={e => setBasic(b => ({ ...b, shortDescription: e.target.value }))} />
                <div className="ap-desc-footer">
                  <span className="ap-hint">This will be shown on product listing cards (150 characters max)</span>
                  <span className="ap-char-count">{basic.shortDescription.length}/150</span>
                </div>
                {errors.shortDescription && <span className="ap-err-msg">{errors.shortDescription}</span>}
              </div>

              {/* Detailed Description */}
              <div className="ap-field ap-field-full">
                <label className="ap-label">Detailed Description</label>
                <div className="ap-rte-wrap">
                  <div className="ap-rte-toolbar">
                    <select className="ap-rte-format-sel">
                      <option>Normal</option><option>Heading 1</option><option>Heading 2</option>
                    </select>
                    {['B','I','U'].map(t => (
                      <button key={t} type="button" className="ap-rte-btn" style={{ fontWeight: t === 'B' ? 700 : 400, fontStyle: t === 'I' ? 'italic' : 'normal', textDecoration: t === 'U' ? 'underline' : 'none' }}>{t}</button>
                    ))}
                    <div className="ap-rte-divider" />
                    {[
                      <svg key="ul" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
                      <svg key="ol" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10H6"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
                      <svg key="al" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
                      <svg key="ar" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="7" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
                      <svg key="link" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
                    ].map((icon, i) => (
                      <button key={i} type="button" className="ap-rte-btn ap-rte-icon-btn">{icon}</button>
                    ))}
                  </div>
                  <textarea className="ap-rte-area" rows={6}
                    placeholder="Enter detailed product description..."
                    value={basic.detailedDescription}
                    onChange={e => setBasic(b => ({ ...b, detailedDescription: e.target.value }))} />
                </div>
              </div>

              {/* Tags */}
              <div className="ap-field ap-field-full">
                <label className="ap-label">Product Tags</label>
                <TagInput tags={basic.tags} onChange={tags => setBasic(b => ({ ...b, tags }))} />
                <span className="ap-hint">Use tags to improve search and filtering (e.g. business, laptop, dell)</span>
              </div>
            </div>
          )}

          {/* ── Step 2: Specifications ── */}
          {step === 2 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                <div>
                  <h2 className="ap-section-title">Specifications</h2>
                  <p className="ap-section-sub">Add technical specifications for the product</p>
                </div>
              </div>

              <div className="ap-specs-header-row">
                <span className="ap-specs-col-label">Specification Name</span>
                <span className="ap-specs-col-label">Value</span>
                <span />
              </div>

              {specs.map(spec => (
                <div key={spec.id} className="ap-spec-row">
                  <input className="ap-input" placeholder="e.g. Processor"
                    value={spec.key} onChange={e => updateSpec(spec.id, 'key', e.target.value)} />
                  <input className="ap-input" placeholder="e.g. Intel Core i5 13th Gen"
                    value={spec.value} onChange={e => updateSpec(spec.id, 'value', e.target.value)} />
                  <button type="button" className="ap-spec-remove" onClick={() => removeSpec(spec.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              ))}

              <button type="button" className="ap-add-spec-btn" onClick={addSpec}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Specification
              </button>
            </div>
          )}

          {/* ── Step 3: Pricing & Inventory ── */}
          {step === 3 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <div>
                  <h2 className="ap-section-title">Pricing & Inventory</h2>
                  <p className="ap-section-sub">Set pricing and stock details</p>
                </div>
              </div>

              <div className="ap-field-grid">
                <div className="ap-field">
                  <label className="ap-label">Base Price (₹) <span className="ap-req">*</span></label>
                  <input className="ap-input" type="number" placeholder="0"
                    value={pricing.price} onChange={e => setPricing(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label">Price Note</label>
                  <input className="ap-input" placeholder="Price varies based on configuration"
                    value={pricing.priceNote} onChange={e => setPricing(p => ({ ...p, priceNote: e.target.value }))} />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Min Order Quantity</label>
                  <input className="ap-input" type="number" min={1}
                    value={pricing.minQty} onChange={e => setPricing(p => ({ ...p, minQty: e.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label">Max Order Quantity</label>
                  <input className="ap-input" type="number"
                    value={pricing.maxQty} onChange={e => setPricing(p => ({ ...p, maxQty: e.target.value }))} />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Stock Status</label>
                  <div className="ap-select-wrap">
                    <select className="ap-select" value={pricing.stockStatus}
                      onChange={e => setPricing(p => ({ ...p, stockStatus: e.target.value }))}>
                      <option>In Stock</option>
                      <option>Out of Stock</option>
                      <option>Pre-order</option>
                      <option>On Request</option>
                    </select>
                    <svg className="ap-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div className="ap-field">
                  <label className="ap-label">Available Units</label>
                  <input className="ap-input" type="number" placeholder="e.g. 500"
                    value={pricing.availableUnits} onChange={e => setPricing(p => ({ ...p, availableUnits: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Media & Documents ── */}
          {step === 4 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div>
                  <h2 className="ap-section-title">Media & Documents</h2>
                  <p className="ap-section-sub">Upload product images and documents</p>
                </div>
              </div>

              <label className="ap-label">Product Images</label>
              <div
                className="ap-drop-zone ap-drop-zone-large"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                <p className="ap-drop-text">Drag &amp; drop images here</p>
                <span className="ap-drop-or">or</span>
                <button type="button" className="ap-upload-btn" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>Upload Images</button>
                <p className="ap-drop-hint">JPG, PNG, WEBP up to 5MB each</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => handleImageUpload(e.target.files)} />
              </div>

              {media.images.length > 0 && (
                <div className="ap-thumbs-row">
                  {media.images.map((img, i) => (
                    <div key={i} className={`ap-thumb-item${media.primaryIndex === i ? ' ap-thumb-primary' : ''}`}>
                      <img src={img} alt="" className="ap-thumb-img" />
                      <button type="button" className="ap-thumb-remove" onClick={() => removeImage(i)}>×</button>
                      {media.primaryIndex === i && <span className="ap-primary-badge">Primary</span>}
                      {media.primaryIndex !== i && (
                        <button type="button" className="ap-set-primary" onClick={() => setMedia(m => ({ ...m, primaryIndex: i }))}>Set Primary</button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="ap-field ap-field-full" style={{ marginTop: '1.5rem' }}>
                <label className="ap-label">Product Video URL (YouTube)</label>
                <input className="ap-input" placeholder="https://youtube.com/watch?v=..."
                  value={media.videoUrl} onChange={e => setMedia(m => ({ ...m, videoUrl: e.target.value }))} />
              </div>
            </div>
          )}

          {/* ── Step 5: SEO & Settings ── */}
          {step === 5 && (
            <div className="ap-section">
              <div className="ap-section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <div>
                  <h2 className="ap-section-title">SEO &amp; Settings</h2>
                  <p className="ap-section-sub">Optimize for search engines and configure settings</p>
                </div>
              </div>

              <div className="ap-field ap-field-full">
                <label className="ap-label">URL Slug</label>
                <div className="ap-slug-wrap">
                  <span className="ap-slug-prefix">/products/</span>
                  <input className="ap-input ap-slug-input" placeholder="product-url-slug"
                    value={seo.slug} onChange={e => setSeo(s => ({ ...s, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} />
                </div>
              </div>

              <div className="ap-field ap-field-full">
                <label className="ap-label">Meta Title</label>
                <input className="ap-input" placeholder="Enter SEO meta title"
                  value={seo.metaTitle} onChange={e => setSeo(s => ({ ...s, metaTitle: e.target.value }))} />
              </div>

              <div className="ap-field ap-field-full">
                <label className="ap-label">Meta Description</label>
                <textarea className="ap-input ap-textarea" rows={3} placeholder="Enter SEO meta description (160 chars)"
                  maxLength={160} value={seo.metaDescription}
                  onChange={e => setSeo(s => ({ ...s, metaDescription: e.target.value }))} />
                <div className="ap-desc-footer">
                  <span />
                  <span className="ap-char-count">{seo.metaDescription.length}/160</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Panels */}
        <aside className="ap-right-panel">
          {/* Product Images */}
          <div className="ap-panel">
            <div className="ap-panel-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <div>
                <h3 className="ap-panel-title">Product Images</h3>
                <p className="ap-panel-sub">Upload high quality images of your product</p>
              </div>
            </div>

            <div className="ap-drop-zone" onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              <p className="ap-drop-text ap-drop-text-sm">Drag &amp; drop images here</p>
              <span className="ap-drop-or">or</span>
              <button type="button" className="ap-upload-btn ap-upload-btn-sm" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>Upload Images</button>
              <p className="ap-drop-hint">JPG, PNG, WEBP up to 5MB each</p>
            </div>

            {media.images.length > 0 && (
              <div className="ap-thumbs-row ap-thumbs-row-sm">
                {media.images.map((img, i) => (
                  <div key={i} className={`ap-thumb-item${media.primaryIndex === i ? ' ap-thumb-primary' : ''}`}>
                    <img src={img} alt="" className="ap-thumb-img" />
                    <button type="button" className="ap-thumb-remove" onClick={() => removeImage(i)}>×</button>
                    {media.primaryIndex === i && <span className="ap-primary-badge">Primary</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Information */}
          <div className="ap-panel">
            <div className="ap-panel-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <h3 className="ap-panel-title">Quick Information</h3>
            </div>

            <div className="ap-qi-row">
              <label className="ap-qi-label">Status</label>
              <div className="ap-select-wrap ap-select-wrap-sm">
                <select className="ap-select ap-select-sm" value={quickInfo.status}
                  onChange={e => setQuickInfo(q => ({ ...q, status: e.target.value }))}>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Inactive</option>
                </select>
                <span className={`ap-status-dot ${quickInfo.status === 'Active' ? 'dot-green' : quickInfo.status === 'Draft' ? 'dot-yellow' : 'dot-gray'}`} />
                <svg className="ap-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div className="ap-qi-row">
              <label className="ap-qi-label">Featured Product</label>
              <Toggle checked={quickInfo.featured} onChange={v => setQuickInfo(q => ({ ...q, featured: v }))} />
            </div>

            <div className="ap-qi-row">
              <label className="ap-qi-label">New Arrival</label>
              <Toggle checked={quickInfo.newArrival} onChange={v => setQuickInfo(q => ({ ...q, newArrival: v }))} />
            </div>
          </div>

          {/* Warranty & Support */}
          <div className="ap-panel">
            <div className="ap-panel-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <h3 className="ap-panel-title">Warranty &amp; Support</h3>
            </div>

            <div className="ap-qi-row">
              <label className="ap-qi-label">Warranty Period</label>
              <div className="ap-select-wrap ap-select-wrap-sm">
                <select className="ap-select ap-select-sm" value={quickInfo.warrantyPeriod}
                  onChange={e => setQuickInfo(q => ({ ...q, warrantyPeriod: e.target.value }))}>
                  <option value="">Select warranty</option>
                  {WARRANTIES.map(w => <option key={w}>{w}</option>)}
                </select>
                <svg className="ap-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div className="ap-qi-row">
              <label className="ap-qi-label">Support Type</label>
              <div className="ap-select-wrap ap-select-wrap-sm">
                <select className="ap-select ap-select-sm" value={quickInfo.supportType}
                  onChange={e => setQuickInfo(q => ({ ...q, supportType: e.target.value }))}>
                  <option value="">Select support type</option>
                  {SUPPORT_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
                <svg className="ap-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Action Bar */}
      <div className="ap-bottom-bar">
        <button className="ap-btn-cancel" onClick={() => navigate('/admin/products')}>Cancel</button>
        <div className="ap-bottom-right">
          <button className="ap-btn-draft" onClick={() => handleSave(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save as Draft
          </button>
          {step < 5
            ? <button className="ap-btn-next" onClick={handleNext}>Next →</button>
            : <button className="ap-btn-next" onClick={() => handleSave(false)}>Save Product</button>
          }
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ap-page {
          background: #f8fafc;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          color: #1e293b;
        }

        /* Header */
        .ap-header {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .ap-search-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.45rem 0.85rem;
          width: 280px;
        }

        .ap-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #374151;
          font-family: inherit;
          width: 100%;
        }

        .ap-header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ap-icon-btn {
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
        }

        .ap-icon-btn:hover { background: #f1f5f9; }

        .badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-red { background: #ef4444; }
        .badge-orange { background: #f97316; }

        .ap-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem 0.65rem;
          border-radius: 8px;
          transition: background 0.15s;
        }

        .ap-user-btn:hover { background: #f1f5f9; }

        .ap-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1d4ed8;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ap-user-name { font-size: 0.875rem; font-weight: 600; color: #374151; }

        /* Title Bar */
        .ap-title-bar {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ap-page-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .ap-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
        }

        .ap-bread-link { color: #64748b; text-decoration: none; }
        .ap-bread-link:hover { color: #1d4ed8; }
        .ap-bread-active { color: #1d4ed8 !important; font-weight: 600; }
        .ap-bread-sep { color: #d1d5db; }
        .ap-bread-cur { color: #374151; font-weight: 500; }

        .ap-title-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ap-btn-cancel {
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.6rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .ap-btn-cancel:hover { border-color: #9ca3af; }

        .ap-btn-save {
          background: #1d4ed8;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
          font-family: inherit;
        }

        .ap-btn-save:hover { background: #1e40af; }

        /* Body Layout */
        .ap-body {
          display: grid;
          grid-template-columns: 220px 1fr 280px;
          gap: 1.25rem;
          padding: 1.25rem 2rem;
          flex: 1;
          align-items: start;
        }

        /* Step Nav */
        .ap-steps-nav {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          position: sticky;
          top: 120px;
        }

        .ap-step-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.85rem;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          width: 100%;
          font-family: inherit;
          transition: background 0.15s;
        }

        .ap-step-item:hover:not(.ap-step-active) { background: #f8fafc; }

        .ap-step-active { background: #eff6ff !important; }

        .ap-step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          background: #fff;
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ap-step-active .ap-step-circle {
          border-color: #1d4ed8;
          background: #1d4ed8;
          color: #fff;
        }

        .ap-step-done .ap-step-circle {
          border-color: #16a34a;
          background: #16a34a;
          color: #fff;
        }

        .ap-step-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .ap-step-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .ap-step-active .ap-step-label { color: #1d4ed8; }

        .ap-step-sub {
          font-size: 0.68rem;
          color: #94a3b8;
          line-height: 1.3;
        }

        /* Form Area */
        .ap-form-area {
          min-width: 0;
        }

        .ap-section {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ap-section-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .ap-section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
        }

        .ap-section-sub {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 0.15rem;
        }

        /* Fields */
        .ap-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .ap-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .ap-field-full { grid-column: 1 / -1; }

        .ap-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .ap-req { color: #ef4444; }

        .ap-input {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.55rem 0.85rem;
          font-size: 0.875rem;
          color: #1e293b;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff;
          width: 100%;
        }

        .ap-input:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.1);
        }

        .ap-input-err { border-color: #ef4444 !important; }
        .ap-err-msg { font-size: 0.72rem; color: #ef4444; }

        .ap-textarea { resize: vertical; }

        .ap-hint { font-size: 0.72rem; color: #94a3b8; }

        .ap-char-count { font-size: 0.72rem; color: #94a3b8; }

        .ap-desc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Select */
        .ap-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ap-select {
          appearance: none;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.55rem 2.25rem 0.55rem 0.85rem;
          font-size: 0.875rem;
          color: #374151;
          font-family: inherit;
          outline: none;
          background: #fff;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .ap-select:focus { border-color: #1d4ed8; }

        .ap-chevron {
          position: absolute;
          right: 0.65rem;
          pointer-events: none;
        }

        /* Rich Text Editor */
        .ap-rte-wrap {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
        }

        .ap-rte-toolbar {
          display: flex;
          align-items: center;
          gap: 0.15rem;
          padding: 0.5rem 0.65rem;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .ap-rte-format-sel {
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          padding: 0.2rem 0.4rem;
          font-size: 0.78rem;
          color: #374151;
          font-family: inherit;
          background: #fff;
          cursor: pointer;
          margin-right: 0.25rem;
        }

        .ap-rte-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: #374151;
          transition: background 0.15s;
        }

        .ap-rte-btn:hover { background: #e2e8f0; }
        .ap-rte-icon-btn { color: #374151; }

        .ap-rte-divider {
          width: 1px;
          height: 20px;
          background: #e5e7eb;
          margin: 0 0.25rem;
        }

        .ap-rte-area {
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

        /* Specs */
        .ap-specs-header-row {
          display: grid;
          grid-template-columns: 1fr 1fr 40px;
          gap: 0.75rem;
          padding: 0 0 0.5rem;
        }

        .ap-specs-col-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ap-spec-row {
          display: grid;
          grid-template-columns: 1fr 1fr 40px;
          gap: 0.75rem;
          align-items: center;
        }

        .ap-spec-remove {
          background: none;
          border: 1px solid #fecaca;
          border-radius: 7px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }

        .ap-spec-remove:hover { background: #fef2f2; }

        .ap-add-spec-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: 1px dashed #1d4ed8;
          border-radius: 8px;
          padding: 0.55rem 1rem;
          color: #1d4ed8;
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
          align-self: flex-start;
        }

        .ap-add-spec-btn:hover { background: #eff6ff; }

        /* Slug */
        .ap-slug-wrap {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
        }

        .ap-slug-prefix {
          background: #f8fafc;
          border-right: 1px solid #d1d5db;
          padding: 0.55rem 0.85rem;
          font-size: 0.8rem;
          color: #64748b;
          white-space: nowrap;
        }

        .ap-slug-input {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          flex: 1;
        }

        /* Drop Zone */
        .ap-drop-zone {
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          padding: 2rem 1rem;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          transition: border-color 0.2s, background 0.2s;
        }

        .ap-drop-zone:hover {
          border-color: #1d4ed8;
          background: #f0f7ff;
        }

        .ap-drop-zone-large { padding: 3rem 1rem; }

        .ap-drop-text { font-size: 0.875rem; color: #374151; font-weight: 500; }
        .ap-drop-text-sm { font-size: 0.8rem; }
        .ap-drop-or { font-size: 0.78rem; color: #94a3b8; }
        .ap-drop-hint { font-size: 0.72rem; color: #94a3b8; }

        .ap-upload-btn {
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 7px;
          padding: 0.5rem 1.25rem;
          font-size: 0.83rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .ap-upload-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
        .ap-upload-btn-sm { padding: 0.4rem 1rem; font-size: 0.78rem; }

        /* Thumbnails */
        .ap-thumbs-row {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          padding: 0.25rem 0;
        }

        .ap-thumbs-row-sm .ap-thumb-item { width: 56px; height: 56px; }

        .ap-thumb-item {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          flex-shrink: 0;
        }

        .ap-thumb-primary { border-color: #1d4ed8; }

        .ap-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ap-thumb-remove {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 18px;
          height: 18px;
          background: rgba(0,0,0,0.6);
          border: none;
          border-radius: 50%;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .ap-primary-badge {
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          background: #1d4ed8;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 3px;
          white-space: nowrap;
        }

        .ap-set-primary {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.55);
          border: none;
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          padding: 3px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
          font-family: inherit;
        }

        .ap-thumb-item:hover .ap-set-primary { opacity: 1; }

        /* Right Panel */
        .ap-right-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: sticky;
          top: 120px;
        }

        .ap-panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .ap-panel-header {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .ap-panel-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
        }

        .ap-panel-sub {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 0.1rem;
        }

        /* Quick Info */
        .ap-qi-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.4rem 0;
          border-top: 1px solid #f8fafc;
        }

        .ap-qi-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #374151;
        }

        .ap-select-wrap-sm { width: auto; }

        .ap-select-sm {
          padding: 0.3rem 1.75rem 0.3rem 0.5rem;
          font-size: 0.78rem;
          min-width: 100px;
        }

        .ap-status-dot {
          position: absolute;
          left: 0.5rem;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          pointer-events: none;
        }

        .dot-green { background: #16a34a; }
        .dot-yellow { background: #d97706; }
        .dot-gray { background: #94a3b8; }

        /* Bottom Bar */
        .ap-bottom-bar {
          position: sticky;
          bottom: 0;
          background: #fff;
          border-top: 1px solid #e5e7eb;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 40;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
        }

        .ap-bottom-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ap-btn-draft {
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.6rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .ap-btn-draft:hover { border-color: #9ca3af; }

        .ap-btn-next {
          background: #1d4ed8;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.75rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }

        .ap-btn-next:hover { background: #1e40af; }

        @media (max-width: 1100px) {
          .ap-body { grid-template-columns: 200px 1fr; }
          .ap-right-panel { display: none; }
        }

        @media (max-width: 768px) {
          .ap-body { grid-template-columns: 1fr; padding: 1rem; }
          .ap-steps-nav { display: none; }
          .ap-field-grid { grid-template-columns: 1fr; }
          .ap-header { padding: 0.65rem 1rem; }
          .ap-title-bar { padding: 0.85rem 1rem; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .ap-bottom-bar { padding: 0.75rem 1rem; }
        }
      `}</style>
    </div>
  );
}
