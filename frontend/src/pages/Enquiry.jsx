import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import {
  Package,
  Plus,
  Trash2,
  Check,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  Search,
  X,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8089';

const TIMELINE_OPTIONS = [
  { id: 'immediate', label: '1–2 Weeks (Urgent)' },
  { id: '1month', label: 'Within 1 Month' },
  { id: 'quarterly', label: 'Quarterly Deployment' },
  { id: 'flexible', label: 'Exploring / Flexible' }
];

export default function Enquiry() {
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();

  const initProductId   = searchParams.get('product') || '';
  const initProductName = searchParams.get('productName') || '';
  const initProductCat  = searchParams.get('productCategory') || '';

  // Products from Database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quote Basket State
  const [quoteItems, setQuoteItems] = useState([]);

  // Catalog Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('ALL');

  // Collapsible Quotation & Organization Details Drawer State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form State (No Procurement Type)
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    delivery: '',
    timeline: 'Within 1 Month',
    message: ''
  });

  const [step, setStep] = useState(1); // 1 = Config/RFQ, 3 = Confirmation
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [enquiryId, setEnquiryId] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Helper to parse JSONB safely
  const parseJsonb = (field, fallback = {}) => {
    try {
      if (!field) return fallback;
      let target = field;
      if (typeof field === 'object' && field !== null && 'value' in field) {
        target = field.value;
      }
      if (typeof target === 'string') {
        if (target.includes('value=')) {
          const m = target.match(/value=({.*?}|\[.*?\])/);
          if (m && m[1]) return JSON.parse(m[1]);
        }
        return JSON.parse(target);
      }
      return target || fallback;
    } catch {
      return fallback;
    }
  };

  // Helper to extract clean specifications options without fake prices
  const getProductSpecs = (p) => {
    const list = [];

    // 1. Check variants
    if (p?.raw?.variants && Array.isArray(p.raw.variants) && p.raw.variants.length > 0) {
      p.raw.variants.forEach((v, i) => {
        const combo = parseJsonb(v.combination, {});
        const entries = Object.entries(combo || {});
        let label = entries.map(([k, val]) => `${k}: ${val}`).join(' • ');
        if (!label) label = v.sku ? `SKU: ${v.sku}` : `Configuration #${i + 1}`;
        list.push({
          id: v.id || `v-${i}`,
          label,
          sku: v.sku || ''
        });
      });
      return list;
    }

    // 2. Check specs object
    if (p?.raw) {
      const specs = parseJsonb(p.raw.specifications || p.raw.specs, {});
      Object.entries(specs).forEach(([k, val]) => {
        if (Array.isArray(val) && val.length > 0) {
          val.forEach((item, idx) => {
            list.push({
              id: `${k}-${idx}`,
              label: `${k}: ${item}`,
              sku: ''
            });
          });
        } else if (typeof val === 'string' && val.trim()) {
          list.push({
            id: k,
            label: `${k}: ${val.trim()}`,
            sku: ''
          });
        }
      });
      if (list.length > 0) return list;
    }

    // 3. Fallback standard spec
    return [
      { id: 'std', label: 'Standard Manufacturer Specification', sku: '' }
    ];
  };

  // Create a clean Quote Item with multi-specification support
  const createQuoteItem = (product) => {
    const specs = getProductSpecs(product);
    const defaultSpec = specs[0]?.label || 'Standard Specification';

    return {
      uid: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: product.id,
      name: product.name,
      brand: product.brand || '',
      category: product.category || 'General',
      image: product.image,
      specOptions: specs,
      selectedSpecs: [defaultSpec], // Supports MULTIPLE specifications selected at once, or empty for all specs
      specQuantities: { [defaultSpec]: 1 }, // Per-specification quantity mapping
      quantity: 1,
      customNote: ''
    };
  };

  // Fetch products from database
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`${API_BASE}/base/getProducts`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const rawList = data?.data || data || [];
        const normalized = (Array.isArray(rawList) ? rawList : []).map((p) => {
          let imageUrl = '';
          try {
            const imgVal = p.image_urls?.value !== undefined ? p.image_urls.value : p.image_urls;
            const imgs = typeof imgVal === 'string' ? JSON.parse(imgVal) : imgVal;
            if (Array.isArray(imgs) && imgs.length > 0) imageUrl = imgs[0];
            else if (typeof imgs === 'string' && imgs.trim()) imageUrl = imgs;
          } catch (_) {}

          if (!imageUrl && p.variants && p.variants.length > 0) {
            try {
              const vImg = p.variants[0].imageUrls?.value !== undefined ? p.variants[0].imageUrls.value : p.variants[0].imageUrls;
              const vImgs = typeof vImg === 'string' ? JSON.parse(vImg) : vImg;
              if (Array.isArray(vImgs) && vImgs.length > 0) imageUrl = vImgs[0];
            } catch (_) {}
          }

          return {
            id: p.id,
            name: p.title || p.name || 'Device',
            brand: (p.brand || '').trim(),
            category: p.category || p.category_id || 'General',
            image: imageUrl || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
            raw: p
          };
        });

        setProducts(normalized);
        setLoading(false);

        // Pre-select if navigated from product detail or listing
        if (initProductId) {
          const match = normalized.find((p) => String(p.id) === String(initProductId));
          if (match) {
            setQuoteItems([createQuoteItem(match)]);
            return;
          }
        }

        if (initProductName) {
          const match = normalized.find(
            (p) => p.name.toLowerCase() === initProductName.toLowerCase()
          );
          if (match) {
            setQuoteItems([createQuoteItem(match)]);
          } else {
            const custom = {
              id: 'custom',
              name: initProductName,
              brand: '',
              category: initProductCat || 'General',
              image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
              raw: null
            };
            setQuoteItems([createQuoteItem(custom)]);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching products:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initProductId, initProductName, initProductCat]);

  // Quote Basket operations
  const addProductToQuote = (product) => {
    setQuoteItems((prev) => [...prev, createQuoteItem(product)]);
  };

  const removeQuoteItem = (uid) => {
    setQuoteItems((prev) => prev.filter((it) => it.uid !== uid));
  };

  // Toggle specifications for a single item (supports 0, 1, or multiple specs)
  const toggleItemSpec = (uid, specLabel) => {
    setQuoteItems((prev) =>
      prev.map((it) => {
        if (it.uid !== uid) return it;
        const current = it.selectedSpecs || [];
        const specQtys = { ...(it.specQuantities || {}) };
        let updatedSpecs;

        if (current.includes(specLabel)) {
          // Deselect: allowed even down to 0 (which means quote for all available specs)
          updatedSpecs = current.filter((s) => s !== specLabel);
          delete specQtys[specLabel];
        } else {
          updatedSpecs = [...current, specLabel];
          if (!specQtys[specLabel]) {
            specQtys[specLabel] = 1;
          }
        }

        // Calculate total quantity
        let totalQty;
        if (updatedSpecs.length === 0) {
          totalQty = it.quantity || 1;
        } else if (updatedSpecs.length === 1) {
          totalQty = specQtys[updatedSpecs[0]] || it.quantity || 1;
          specQtys[updatedSpecs[0]] = totalQty;
        } else {
          totalQty = updatedSpecs.reduce((sum, s) => sum + (specQtys[s] || 1), 0);
        }

        return {
          ...it,
          selectedSpecs: updatedSpecs,
          specQuantities: specQtys,
          quantity: totalQty
        };
      })
    );
  };

  // Toggle "All Available Specifications" (Quote for all configs)
  const selectAllSpecs = (uid) => {
    setQuoteItems((prev) =>
      prev.map((it) => {
        if (it.uid !== uid) return it;
        return {
          ...it,
          selectedSpecs: [],
          specQuantities: {},
          quantity: it.quantity || 1
        };
      })
    );
  };

  // Update quantity for a specific chosen specification
  const updateSpecQty = (uid, specLabel, delta) => {
    setQuoteItems((prev) =>
      prev.map((it) => {
        if (it.uid !== uid) return it;
        const specQtys = { ...(it.specQuantities || {}) };
        const currentVal = specQtys[specLabel] || 1;
        const nextVal = Math.max(1, currentVal + delta);
        specQtys[specLabel] = nextVal;

        const totalQty = (it.selectedSpecs || []).reduce(
          (sum, s) => sum + (specQtys[s] || 1),
          0
        );

        return {
          ...it,
          specQuantities: specQtys,
          quantity: totalQty
        };
      })
    );
  };

  const setSpecExactQty = (uid, specLabel, val) => {
    const parsed = Math.max(1, parseInt(val, 10) || 1);
    setQuoteItems((prev) =>
      prev.map((it) => {
        if (it.uid !== uid) return it;
        const specQtys = { ...(it.specQuantities || {}) };
        specQtys[specLabel] = parsed;

        const totalQty = (it.selectedSpecs || []).reduce(
          (sum, s) => sum + (specQtys[s] || 1),
          0
        );

        return {
          ...it,
          specQuantities: specQtys,
          quantity: totalQty
        };
      })
    );
  };

  const updateItemQty = (uid, delta) => {
    setQuoteItems((prev) =>
      prev.map((it) => {
        if (it.uid !== uid) return it;
        const nextQty = Math.max(1, (it.quantity || 1) + delta);
        const specQtys = { ...(it.specQuantities || {}) };
        if (it.selectedSpecs && it.selectedSpecs.length === 1) {
          specQtys[it.selectedSpecs[0]] = nextQty;
        }
        return { ...it, quantity: nextQty, specQuantities: specQtys };
      })
    );
  };

  const setItemExactQty = (uid, qty) => {
    const val = parseInt(qty, 10);
    const parsed = isNaN(val) || val < 1 ? 1 : val;
    setQuoteItems((prev) =>
      prev.map((it) => {
        if (it.uid !== uid) return it;
        const specQtys = { ...(it.specQuantities || {}) };
        if (it.selectedSpecs && it.selectedSpecs.length === 1) {
          specQtys[it.selectedSpecs[0]] = parsed;
        }
        return { ...it, quantity: parsed, specQuantities: specQtys };
      })
    );
  };

  const updateItemNote = (uid, note) => {
    setQuoteItems((prev) =>
      prev.map((it) => (it.uid === uid ? { ...it, customNote: note } : it))
    );
  };

  // Total Units
  const totalUnits = useMemo(() => {
    return quoteItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
  }, [quoteItems]);

  // Unique categories in database for picker filter
  const pickerCategories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [products]);

  // Filtered products for modal
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = pickerCategory === 'ALL' || p.category.toLowerCase() === pickerCategory.toLowerCase();
      if (!matchCat) return false;
      if (!pickerSearch.trim()) return true;
      const q = pickerSearch.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, pickerCategory, pickerSearch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Submit Quotation Request to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quoteItems.length === 0) {
      setSubmitError('Please select at least one instrument or device to build your quotation.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const genId = `BD-RFQ-${Date.now().toString().slice(-6)}`;

    // Format products for Admin and backend compatibility
    const firstItem = quoteItems[0];
    const firstItemSpecs = (!firstItem.selectedSpecs || firstItem.selectedSpecs.length === 0)
      ? 'All Available Specifications'
      : firstItem.selectedSpecs.join(' • ');
    const formattedProductName =
      quoteItems.length === 1
        ? `${firstItem.name} [Specs: ${firstItemSpecs}]`
        : `${firstItem.name} (+${quoteItems.length - 1} other instruments)`;

    const categoriesList = Array.from(new Set(quoteItems.map((i) => i.category))).join(', ');

    // Itemized message structure
    const itemsLines = quoteItems.map((item, idx) => {
      let specsJoined;
      if (!item.selectedSpecs || item.selectedSpecs.length === 0) {
        specsJoined = 'All Available Specifications (Quote for full range)';
      } else if (item.selectedSpecs.length === 1) {
        specsJoined = item.selectedSpecs[0];
      } else {
        specsJoined = item.selectedSpecs.map(s => `${s} [Qty: ${item.specQuantities?.[s] || 1}]`).join(' • ');
      }

      return [
        `Product #${idx + 1}: ${item.name}`,
        item.brand ? `• Brand: ${item.brand} | Category: ${item.category}` : null,
        `• Specifications & Breakdown: ${specsJoined}`,
        `• Total Device Quantity: ${item.quantity} units`,
        `• Commercial Rate: Official Quotation Required`,
        item.customNote ? `• Note: ${item.customNote}` : null
      ].filter(Boolean).join('\n');
    }).join('\n\n');

    const structuredMessage = [
      `[Requested Bill of Materials / Products]:`,
      itemsLines,
      `----------------------------------------`,
      `• Total Line Items: ${quoteItems.length} products`,
      `• Total Quantity: ${totalUnits} units`,
      `• Target Delivery Timeline: ${form.timeline}`,
      `• Delivery Location: ${form.delivery}`,
      '',
      `[Organization Requirements & Special Instructions]:`,
      form.message?.trim() ? form.message.trim() : 'Standard commercial quotation requested with GST invoice.'
    ].join('\n');

    try {
      const res = await fetch(`${API_BASE}/api/enquiry/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId:       genId,
          name:            form.name,
          company:         form.company,
          email:           form.email,
          phone:           form.phone,
          delivery:        form.delivery,
          message:         structuredMessage,
          productName:     formattedProductName,
          productCategory: categoriesList || 'General',
          quantity:        totalUnits,
        })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success !== false) {
        setEnquiryId(data?.enquiryId || genId);
        setIsDetailsOpen(false);
        setStep(3);
      } else {
        setSubmitError(data?.message || 'Failed to submit quote request. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Unable to connect to server. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (!enquiryId) return;
    navigator.clipboard.writeText(enquiryId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Color Tokens synchronized with Admin Portal
  const themeStyles = {
    pageBg: isDarkMode ? '#070d1e' : '#f8fafc',
    cardBg: isDarkMode ? '#0e1830' : '#ffffff',
    subCardBg: isDarkMode ? '#132244' : '#f8fafc',
    borderColor: isDarkMode ? '#192b50' : '#e2e8f0',
    borderLight: isDarkMode ? '#223867' : '#cbd5e1',
    textPrimary: isDarkMode ? '#f8fafc' : '#0f172a',
    textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
    inputBg: isDarkMode ? '#070d1e' : '#ffffff',
    accentOrange: '#F97316',
    accentOrangeSoft: isDarkMode ? 'rgba(249, 115, 22, 0.15)' : '#fff7ed',
    accentGreen: '#22c55e',
    accentGreenSoft: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#f0fdf4',
  };

  return (
    <div className="enquiry-page" style={{ backgroundColor: themeStyles.pageBg, color: themeStyles.textPrimary }}>
      <div className={`enquiry-container ${step === 3 ? 'step-confirmation-active' : ''}`}>
        
        {/* Top Header — Clean, no redundant theme button */}
        <div className="enquiry-header-row">
          <div className="header-text-col">
            <div className="portal-badge" style={{ backgroundColor: themeStyles.accentOrangeSoft, color: themeStyles.accentOrange }}>
              <ShieldCheck size={14} /> Commercial Quotation & RFQ Portal
            </div>
            <h1 className="portal-title">Request Enterprise Quotation</h1>
            <p className="portal-subtitle" style={{ color: themeStyles.textSecondary }}>
              Select devices, configure technical specifications, and receive a customized commercial proposal with volume discounts and official GST invoicing.
            </p>
          </div>
        </div>

        {/* STEP 3: SUBMITTED CONFIRMATION */}
        {step === 3 ? (
          <div className="success-card" style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}>
            <div className="success-icon-wrap">
              <CheckCircle2 size={42} color="#ffffff" />
            </div>

            <h2 className="success-heading" style={{ color: themeStyles.textPrimary }}>Quotation Request Successfully Registered</h2>
            <p className="success-desc" style={{ color: themeStyles.textSecondary }}>
              Your multi-instrument quotation ticket has been assigned to our enterprise solutions team.
            </p>

            <div className="tracking-id-card" style={{ backgroundColor: themeStyles.subCardBg, borderColor: themeStyles.borderColor }}>
              <span className="tracking-label" style={{ color: themeStyles.textSecondary }}>Official Tracking Reference:</span>
              <strong className="tracking-val" style={{ color: themeStyles.accentOrange }}>{enquiryId}</strong>
              <button type="button" onClick={handleCopyId} className="copy-btn">
                {copiedId ? <Check size={14} /> : <Copy size={14} />} {copiedId ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Requested Items Summary Table */}
            <div className="summary-list-card" style={{ backgroundColor: themeStyles.subCardBg, borderColor: themeStyles.borderColor }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>
                Requested Items ({quoteItems.length} Products · {totalUnits} Units):
              </h4>
              <div className="summary-items-list">
                {quoteItems.map((it, idx) => (
                  <div key={it.uid} className="summary-item-row" style={{ borderBottomColor: themeStyles.borderColor }}>
                    <div className="summary-item-left">
                      <span className="summary-item-num">#{idx + 1}</span>
                      <img src={it.image} alt={it.name} className="summary-item-thumb" />
                      <div>
                        <div className="summary-item-name" style={{ color: themeStyles.textPrimary }}>{it.name}</div>
                        <div className="summary-item-spec" style={{ color: themeStyles.textSecondary }}>
                          {!it.selectedSpecs || it.selectedSpecs.length === 0
                            ? 'All Available Specifications (Quote for All)'
                            : it.selectedSpecs.length === 1
                            ? it.selectedSpecs[0]
                            : it.selectedSpecs.map(s => `${s} (${it.specQuantities?.[s] || 1} units)`).join(' • ')}
                        </div>
                      </div>
                    </div>
                    <div className="summary-item-qty">
                      <span className="qty-tag">{it.quantity} {it.quantity === 1 ? 'Unit' : 'Units'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="next-steps-banner" style={{ backgroundColor: themeStyles.accentGreenSoft, borderColor: themeStyles.accentGreen }}>
              <Sparkles size={18} color="#22c55e" />
              <span>
                An authorized Bharat Devices sales engineer will review your specification requirements and dispatch an official quotation PDF to <strong>{form.email}</strong> within 2 to 4 business hours.
              </span>
            </div>

            <div className="success-actions">
              <Link to="/products" className="btn-browse-more">
                Browse More Products
              </Link>
              <Link to="/" className="btn-return-home" style={{ color: themeStyles.textSecondary, borderColor: themeStyles.borderColor }}>
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* STEP 1: FULL-WIDTH UNCLUTTERED RFQ BUILDER */
          <div className="rfq-full-width-layout">
            
            {/* FULL-WIDTH SECTION: Instruments in Quote */}
            <div className="rfq-main-col">
              <div className="col-header-bar" style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}>
                <div>
                  <h2 className="col-title" style={{ color: themeStyles.textPrimary }}>
                    Instruments in Quote
                  </h2>
                  <span className="col-subtitle" style={{ color: themeStyles.textSecondary }}>
                    {quoteItems.length} {quoteItems.length === 1 ? 'Product' : 'Products'} · {totalUnits} Total Units
                  </span>
                </div>

                <div className="col-header-actions">
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="btn-open-picker"
                  >
                    <Plus size={16} /> Add Product
                  </button>

                  {/* SINGLE PROMINENT ACTION BUTTON */}
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(true)}
                    className="btn-trigger-drawer"
                    title="Open Contact Info"
                    disabled={quoteItems.length === 0}
                    style={{
                      opacity: quoteItems.length === 0 ? 0.6 : 1,
                      cursor: quoteItems.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <User size={16} />
                    <span>Contact Info</span>
                    <ArrowRight size={17} className="drawer-arrow-icon" />
                  </button>
                </div>
              </div>

              {/* Scrollable Instruments in Quote Container */}
              <div className="instruments-scroll-wrap">
                {quoteItems.length === 0 ? (
                  <div className="empty-rfq-card" style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}>
                    <div className="empty-icon-wrap" style={{ backgroundColor: themeStyles.subCardBg }}>
                      <Package size={38} color={themeStyles.accentOrange} />
                    </div>
                    <h3 style={{ color: themeStyles.textPrimary, margin: '12px 0 6px 0' }}>No Instruments Added Yet</h3>
                    <p style={{ color: themeStyles.textSecondary, margin: '0 0 18px 0', fontSize: '13px', maxWidth: '440px', lineHeight: '1.5' }}>
                      Select devices from our enterprise catalog to configure technical specifications and raise your official quotation.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="btn-browse-catalog-primary"
                    >
                      <Plus size={16} /> Select Instruments from Catalog
                    </button>
                  </div>
                ) : (
                  <div className="quote-cards-stack">
                    {quoteItems.map((item, idx) => {
                      const selectedCount = (item.selectedSpecs || []).length;
                      return (
                        <div
                          key={item.uid}
                          className="product-quote-card"
                          style={{
                            backgroundColor: themeStyles.cardBg,
                            borderColor: themeStyles.borderColor
                          }}
                        >
                          {/* Top Header of Product */}
                          <div className="card-top-row">
                            <div className="card-product-meta">
                              <img src={item.image} alt={item.name} className="product-thumb" />
                              <div className="meta-text">
                                <div className="meta-badge-row">
                                  {item.brand && <span className="brand-pill">{item.brand}</span>}
                                  <span className="cat-pill" style={{ color: themeStyles.textSecondary }}>{item.category}</span>
                                </div>
                                <h3 className="product-title" style={{ color: themeStyles.textPrimary }}>
                                  {item.name}
                                </h3>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeQuoteItem(item.uid)}
                              className="btn-remove-card"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Multi-Specification Selection (One or Multiple at once, or Quote for All Specs) */}
                          <div className="spec-section-box" style={{ backgroundColor: themeStyles.subCardBg, borderColor: themeStyles.borderColor }}>
                            <div className="spec-section-header">
                              <span className="spec-label" style={{ color: themeStyles.textSecondary }}>
                                SPECIFICATIONS <span style={{ fontSize: '0.73rem', opacity: 0.85 }}>(SELECT MULTIPLE OR QUOTE FOR ALL):</span>
                              </span>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {item.specOptions.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => selectAllSpecs(item.uid)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: themeStyles.accentOrange,
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      padding: '2px 4px',
                                      textDecoration: 'underline'
                                    }}
                                  >
                                    {selectedCount === item.specOptions.length ? 'Clear Specs' : 'Select All Specs'}
                                  </button>
                                )}
                                <span className="spec-count-tag" style={{ backgroundColor: themeStyles.accentOrangeSoft, color: themeStyles.accentOrange }}>
                                  {selectedCount === 0 ? 'All Specs (Quote All)' : `${selectedCount} Selected`}
                                </span>
                              </div>
                            </div>

                            <div className="spec-pills-row">
                              {/* Option: Quote for All Available Specs */}
                              <button
                                type="button"
                                className={`spec-chip-btn ${selectedCount === 0 ? 'spec-selected' : ''}`}
                                style={{
                                  backgroundColor: selectedCount === 0 ? themeStyles.accentOrange : (isDarkMode ? '#0e1830' : '#ffffff'),
                                  borderColor: selectedCount === 0 ? themeStyles.accentOrange : themeStyles.borderColor,
                                  color: selectedCount === 0 ? '#ffffff' : themeStyles.textPrimary,
                                  fontWeight: selectedCount === 0 ? '700' : '500'
                                }}
                                onClick={() => {
                                  // Clear selected specs so quote includes all available specs
                                  setQuoteItems(prev => prev.map(it => it.uid === item.uid ? { ...it, selectedSpecs: [], specQuantities: {} } : it));
                                }}
                              >
                                <span className={`chip-indicator-box ${selectedCount === 0 ? 'box-checked' : ''}`}>
                                  {selectedCount === 0 && <Check size={11} strokeWidth={3} />}
                                </span>
                                ★ Quote for All Available Specs
                              </button>

                              {item.specOptions.map((opt) => {
                                const isSelected = (item.selectedSpecs || []).includes(opt.label);
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    className={`spec-chip-btn ${isSelected ? 'spec-selected' : ''}`}
                                    style={{
                                      backgroundColor: isSelected ? themeStyles.accentOrange : (isDarkMode ? '#0e1830' : '#ffffff'),
                                      borderColor: isSelected ? themeStyles.accentOrange : themeStyles.borderColor,
                                      color: isSelected ? '#ffffff' : themeStyles.textPrimary,
                                    }}
                                    onClick={() => toggleItemSpec(item.uid, opt.label)}
                                  >
                                    <span className={`chip-indicator-box ${isSelected ? 'box-checked' : ''}`}>
                                      {isSelected && <Check size={11} strokeWidth={3} />}
                                    </span>
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Quantities Breakdown if multiple (2+) specifications selected */}
                            {selectedCount >= 2 && (
                              <div className="spec-quantities-container" style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px dashed ${themeStyles.borderColor}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: '700', color: themeStyles.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    Quantity per Selected Specification:
                                  </span>
                                  <span style={{ fontSize: '12px', fontWeight: '700', color: themeStyles.accentOrange }}>
                                    Total Units: {item.quantity}
                                  </span>
                                </div>

                                <div className="spec-quantities-grid">
                                  {item.selectedSpecs.map((specLabel) => {
                                    const specQty = (item.specQuantities && item.specQuantities[specLabel]) || 1;
                                    return (
                                      <div
                                        key={specLabel}
                                        className="spec-quantity-card"
                                        style={{
                                          backgroundColor: isDarkMode ? '#0e1830' : '#ffffff',
                                          borderColor: themeStyles.borderColor
                                        }}
                                      >
                                        <div className="spec-qty-title" title={specLabel} style={{ color: themeStyles.textPrimary }}>
                                          {specLabel}
                                        </div>
                                        <div className="stepper-wrap" style={{ borderColor: themeStyles.borderColor }}>
                                          <button
                                            type="button"
                                            className="stepper-btn"
                                            onClick={() => updateSpecQty(item.uid, specLabel, -1)}
                                            style={{ color: themeStyles.textPrimary }}
                                          >
                                            −
                                          </button>
                                          <input
                                            type="number"
                                            min="1"
                                            value={specQty}
                                            onChange={(e) => setSpecExactQty(item.uid, specLabel, e.target.value)}
                                            className="stepper-input"
                                            style={{ color: themeStyles.textPrimary }}
                                          />
                                          <button
                                            type="button"
                                            className="stepper-btn"
                                            onClick={() => updateSpecQty(item.uid, specLabel, 1)}
                                            style={{ color: themeStyles.textPrimary }}
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Overall Quantity (when 0 or 1 spec selected) & Notes */}
                          <div className="card-bottom-row">
                            {selectedCount < 2 ? (
                              <div className="qty-block">
                                <span className="qty-label" style={{ color: themeStyles.textSecondary }}>
                                  {selectedCount === 0 ? 'Total Units (All Specs):' : 'Required Quantity:'}
                                </span>
                                <div className="stepper-wrap" style={{ borderColor: themeStyles.borderColor }}>
                                  <button
                                    type="button"
                                    className="stepper-btn"
                                    onClick={() => updateItemQty(item.uid, -1)}
                                    style={{ color: themeStyles.textPrimary }}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => setItemExactQty(item.uid, e.target.value)}
                                    className="stepper-input"
                                    style={{ color: themeStyles.textPrimary }}
                                  />
                                  <button
                                    type="button"
                                    className="stepper-btn"
                                    onClick={() => updateItemQty(item.uid, 1)}
                                    style={{ color: themeStyles.textPrimary }}
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Quantity Quick Presets */}
                                <div className="qty-presets">
                                  {[5, 10, 25, 50, 100].map((preset) => (
                                    <button
                                      key={preset}
                                      type="button"
                                      onClick={() => setItemExactQty(item.uid, preset)}
                                      className="preset-pill"
                                      style={{
                                        borderColor: themeStyles.borderColor,
                                        color: themeStyles.textSecondary,
                                        backgroundColor: item.quantity === preset ? themeStyles.accentOrangeSoft : 'transparent'
                                      }}
                                    >
                                      {preset}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            {/* Optional item note input */}
                            <div className="item-note-wrap" style={{ width: selectedCount >= 2 ? '100%' : undefined }}>
                              <input
                                type="text"
                                placeholder="Optional notes for this device (e.g. custom power cord, asset tagging, rack kit)..."
                                value={item.customNote}
                                onChange={(e) => updateItemNote(item.uid, e.target.value)}
                                className="item-note-input"
                                style={{
                                  backgroundColor: themeStyles.inputBg,
                                  borderColor: themeStyles.borderColor,
                                  color: themeStyles.textPrimary
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add another product trigger */}
                    <div className="bottom-instruments-actions">
                      <button
                        type="button"
                        onClick={() => setIsPickerOpen(true)}
                        className="btn-add-more-dashed"
                        style={{
                          borderColor: themeStyles.borderColor,
                          color: themeStyles.accentOrange,
                          backgroundColor: themeStyles.cardBg
                        }}
                      >
                        <Plus size={18} /> Add Another Device to Quote
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLLAPSIBLE SLIDE-OUT DRAWER FOR QUOTATION & ORGANIZATION DETAILS */}
            {isDetailsOpen && (
              <div className="drawer-overlay" onClick={() => setIsDetailsOpen(false)}>
                <div
                  className="details-drawer"
                  style={{
                    backgroundColor: themeStyles.cardBg,
                    borderLeftColor: themeStyles.borderColor,
                    color: themeStyles.textPrimary
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="drawer-header" style={{ borderBottomColor: themeStyles.borderColor }}>
                    <div>
                      <div className="drawer-badge" style={{ color: themeStyles.accentOrange }}>
                        <FileCheck size={14} /> STEP 2: CONTACT & ORGANIZATION DETAILS
                      </div>
                      <h3 className="drawer-title" style={{ color: themeStyles.textPrimary }}>
                        Contact Info & Organization Details
                      </h3>
                      <p className="drawer-sub" style={{ color: themeStyles.textSecondary }}>
                        Enter your business information to receive an official commercial proposal with GST invoice breakdown.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDetailsOpen(false)}
                      className="btn-drawer-collapse"
                      title="Collapse Drawer"
                      style={{ color: themeStyles.textSecondary, borderColor: themeStyles.borderColor }}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>

                  {/* Drawer Form Body */}
                  <div className="drawer-body">
                    {submitError && (
                      <div className="error-alert">
                        {submitError}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="drawer-form">
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label className="field-label" style={{ color: themeStyles.textSecondary }}>
                            <User size={13} /> Full Name <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            placeholder="e.g. Rahul Sharma"
                            required
                            className="field-input"
                            style={{
                              backgroundColor: themeStyles.inputBg,
                              borderColor: themeStyles.borderColor,
                              color: themeStyles.textPrimary
                            }}
                          />
                        </div>

                        <div className="form-field">
                          <label className="field-label" style={{ color: themeStyles.textSecondary }}>
                            <Building size={13} /> Company / Organization <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleFormChange}
                            placeholder="e.g. Acme Technologies Pvt Ltd"
                            required
                            className="field-input"
                            style={{
                              backgroundColor: themeStyles.inputBg,
                              borderColor: themeStyles.borderColor,
                              color: themeStyles.textPrimary
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label className="field-label" style={{ color: themeStyles.textSecondary }}>
                            <Mail size={13} /> Work Email <span className="req">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleFormChange}
                            placeholder="rahul@company.com"
                            required
                            className="field-input"
                            style={{
                              backgroundColor: themeStyles.inputBg,
                              borderColor: themeStyles.borderColor,
                              color: themeStyles.textPrimary
                            }}
                          />
                        </div>

                        <div className="form-field">
                          <label className="field-label" style={{ color: themeStyles.textSecondary }}>
                            <Phone size={13} /> Phone / WhatsApp <span className="req">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleFormChange}
                            placeholder="+91 98765 43210"
                            required
                            className="field-input"
                            style={{
                              backgroundColor: themeStyles.inputBg,
                              borderColor: themeStyles.borderColor,
                              color: themeStyles.textPrimary
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="field-label" style={{ color: themeStyles.textSecondary }}>
                          <MapPin size={13} /> Delivery Location / Destination City <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          name="delivery"
                          value={form.delivery}
                          onChange={handleFormChange}
                          placeholder="e.g. BKC Complex, Mumbai, Maharashtra"
                          required
                          className="field-input"
                          style={{
                            backgroundColor: themeStyles.inputBg,
                            borderColor: themeStyles.borderColor,
                            color: themeStyles.textPrimary
                          }}
                        />
                      </div>

                      {/* Expected Delivery Timeline */}
                      <div className="form-field">
                        <label className="field-label" style={{ color: themeStyles.textSecondary }}>
                          <Clock size={13} /> Expected Delivery Timeline
                        </label>
                        <div className="chip-options-grid">
                          {TIMELINE_OPTIONS.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              className={`chip-choice-btn ${form.timeline === t.label ? 'choice-active' : ''}`}
                              style={{
                                backgroundColor: form.timeline === t.label ? themeStyles.accentOrangeSoft : (isDarkMode ? '#070d1e' : '#ffffff'),
                                borderColor: form.timeline === t.label ? themeStyles.accentOrange : themeStyles.borderColor,
                                color: form.timeline === t.label ? themeStyles.accentOrange : themeStyles.textPrimary
                              }}
                              onClick={() => setForm((f) => ({ ...f, timeline: t.label }))}
                            >
                              {form.timeline === t.label && <Check size={12} />} {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Requirements / GST Details */}
                      <div className="form-field">
                        <label className="field-label" style={{ color: themeStyles.textSecondary }}>
                          <FileText size={13} /> Specific Requirements / GST Details (Optional)
                        </label>
                        <textarea
                          name="message"
                          rows={3}
                          value={form.message}
                          onChange={handleFormChange}
                          placeholder="Mention GST identification number, custom OS requirements, extended warranty, or phased shipping..."
                          className="field-textarea"
                          style={{
                            backgroundColor: themeStyles.inputBg,
                            borderColor: themeStyles.borderColor,
                            color: themeStyles.textPrimary
                          }}
                        />
                      </div>

                      {/* Summary overview box */}
                      <div className="rfq-summary-box" style={{ backgroundColor: themeStyles.subCardBg, borderColor: themeStyles.borderColor }}>
                        <div className="summary-row">
                          <span style={{ color: themeStyles.textSecondary }}>Selected Instruments:</span>
                          <strong>{quoteItems.length} Products</strong>
                        </div>
                        <div className="summary-row">
                          <span style={{ color: themeStyles.textSecondary }}>Total Units:</span>
                          <strong>{totalUnits} Units</strong>
                        </div>
                        <div className="summary-row">
                          <span style={{ color: themeStyles.textSecondary }}>Commercial Rate:</span>
                          <strong style={{ color: themeStyles.accentOrange }}>Wholesale RFQ Quote</strong>
                        </div>
                      </div>

                      {/* Submit RFQ Button */}
                      <button
                        type="submit"
                        disabled={submitting || quoteItems.length === 0}
                        className="btn-submit-rfq"
                      >
                        {submitting ? (
                          <span>Generating Official RFQ...</span>
                        ) : (
                          <>
                            <span>Submit Official Quotation Request</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <p className="privacy-note" style={{ color: themeStyles.textSecondary }}>
                        🔒 Official Bharat Devices quotation with GST invoice breakdown will be dispatched directly to your business email.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* CATALOG PICKER MODAL */}
      {isPickerOpen && (
        <div className="picker-overlay" onClick={() => setIsPickerOpen(false)}>
          <div
            className="picker-modal"
            style={{
              backgroundColor: themeStyles.cardBg,
              borderColor: themeStyles.borderColor,
              color: themeStyles.textPrimary
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="picker-header" style={{ borderBottomColor: themeStyles.borderColor }}>
              <div>
                <h3 className="picker-title" style={{ color: themeStyles.textPrimary }}>Add Instruments from Catalog</h3>
                <span className="picker-sub" style={{ color: themeStyles.textSecondary }}>
                  Select from {products.length} enterprise-ready hardware devices
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="btn-close-picker"
                style={{ color: themeStyles.textSecondary }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="picker-filter-bar" style={{ borderBottomColor: themeStyles.borderColor }}>
              <div className="picker-search-wrap" style={{ backgroundColor: themeStyles.inputBg, borderColor: themeStyles.borderColor }}>
                <Search size={15} color={themeStyles.textSecondary} />
                <input
                  type="text"
                  placeholder="Search by product name, model, brand..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="picker-search-input"
                  style={{ color: themeStyles.textPrimary }}
                />
                {pickerSearch && (
                  <button type="button" onClick={() => setPickerSearch('')} className="btn-clear-search">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="picker-cats-scroll">
                {pickerCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPickerCategory(cat)}
                    className={`picker-cat-pill ${pickerCategory === cat ? 'active' : ''}`}
                    style={{
                      borderColor: pickerCategory === cat ? themeStyles.accentOrange : themeStyles.borderColor,
                      backgroundColor: pickerCategory === cat ? themeStyles.accentOrange : (isDarkMode ? '#070d1e' : '#f1f5f9'),
                      color: pickerCategory === cat ? '#ffffff' : themeStyles.textSecondary
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Grid */}
            <div className="picker-body">
              {filteredProducts.length === 0 ? (
                <div className="picker-empty" style={{ color: themeStyles.textSecondary }}>
                  <Package size={32} />
                  <span>No products found matching your search.</span>
                </div>
              ) : (
                <div className="picker-grid">
                  {filteredProducts.map((p) => {
                    const alreadyInQuote = quoteItems.some((it) => it.productId === p.id);
                    return (
                      <div
                        key={p.id}
                        className="picker-product-card"
                        style={{
                          backgroundColor: themeStyles.subCardBg,
                          borderColor: themeStyles.borderColor
                        }}
                      >
                        <img src={p.image} alt={p.name} className="picker-thumb" />
                        <div className="picker-info">
                          <div className="picker-badge-row">
                            {p.brand && <span className="brand-pill-sm">{p.brand}</span>}
                            <span className="cat-pill-sm" style={{ color: themeStyles.textSecondary }}>{p.category}</span>
                          </div>
                          <h4 className="picker-name" style={{ color: themeStyles.textPrimary }}>{p.name}</h4>

                          <button
                            type="button"
                            onClick={() => addProductToQuote(p)}
                            className={`btn-picker-add ${alreadyInQuote ? 'btn-added' : ''}`}
                          >
                            {alreadyInQuote ? (
                              <>
                                <Check size={13} /> Add Another
                              </>
                            ) : (
                              <>
                                <Plus size={13} /> Add to RFQ
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="picker-footer" style={{ borderTopColor: themeStyles.borderColor }}>
              <span className="footer-count" style={{ color: themeStyles.textSecondary }}>
                {quoteItems.length} {quoteItems.length === 1 ? 'item' : 'items'} currently in quote
              </span>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="btn-picker-done"
              >
                Done Adding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button: Contact Info in right corner */}
      {step === 1 && (
        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          className="floating-contact-btn"
          title="Open Contact Info & Organization Details"
        >
          <User size={18} />
          <span>Contact Info</span>
        </button>
      )}

      <style>{`
        /* ── Base Page ── */
        .enquiry-page {
          min-height: 100vh;
          padding: 2.5rem 1.5rem 5rem;
          font-family: inherit;
          transition: background-color 0.2s;
        }

        .enquiry-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 100px);
          max-height: calc(100vh - 100px);
          overflow: hidden;
        }

        .enquiry-container.step-confirmation-active {
          height: auto;
          max-height: none;
          min-height: calc(100vh - 100px);
          overflow-y: visible;
          padding-bottom: 3.5rem;
        }

        /* ── Header ── */
        .enquiry-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          gap: 1.5rem;
          flex-shrink: 0;
        }

        .portal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 0.35rem;
        }

        .portal-title {
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
          line-height: 1.2;
        }

        .portal-subtitle {
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
          max-width: 760px;
        }

        /* ── Full Width Instruments Section ── */
        .rfq-full-width-layout {
          width: 100%;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .rfq-main-col {
          width: 100%;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          overflow: hidden;
        }

        .col-header-bar {
          border-radius: 14px;
          padding: 0.85rem 1.4rem;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.85rem;
          flex-shrink: 0;
        }

        /* ── Scrollable Instruments in Quote Container ── */
        .instruments-scroll-wrap {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 6px;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .instruments-scroll-wrap::-webkit-scrollbar {
          width: 6px;
        }

        .instruments-scroll-wrap::-webkit-scrollbar-track {
          background: transparent;
        }

        .instruments-scroll-wrap::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .instruments-scroll-wrap:hover::-webkit-scrollbar-thumb {
          background: #94a3b8;
        }

        html.dark .instruments-scroll-wrap::-webkit-scrollbar-thumb {
          background: #192b50;
        }

        html.dark .instruments-scroll-wrap:hover::-webkit-scrollbar-thumb {
          background: #334e68;
        }

        .col-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0;
        }

        .col-subtitle {
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 3px;
          display: block;
        }

        .col-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-open-picker {
          background: #F97316;
          color: #ffffff;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.18s, transform 0.15s;
        }

        .btn-open-picker:hover {
          background: #ea580c;
          transform: translateY(-1px);
        }

        /* Prominent Collapsible Drawer Trigger Button */
        .btn-trigger-drawer {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;
          border: none;
          padding: 0.6rem 1.35rem;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 3px 12px rgba(16, 185, 129, 0.28);
          transition: all 0.2s ease;
        }

        .btn-trigger-drawer:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(16, 185, 129, 0.4);
        }

        .drawer-arrow-icon {
          transition: transform 0.2s ease;
        }

        .btn-trigger-drawer:hover .drawer-arrow-icon {
          transform: translateX(3px);
        }

        /* ── Empty State ── */
        .empty-rfq-card {
          border-radius: 14px;
          padding: 3.5rem 1.5rem;
          border: 1px dashed;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .btn-browse-catalog-primary {
          background: #F97316;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.75rem;
          border-radius: 9px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background 0.18s;
        }

        .btn-browse-catalog-primary:hover {
          background: #ea580c;
        }

        /* ── Quote Cards Stack ── */
        .quote-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .product-quote-card {
          border-radius: 14px;
          padding: 1.4rem;
          border: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: border-color 0.18s;
        }

        .card-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .card-product-meta {
          display: flex;
          align-items: center;
          gap: 1.15rem;
        }

        .product-thumb {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          object-fit: cover;
          background: #f1f5f9;
          flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.06);
        }

        .meta-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .meta-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-pill {
          background: #F97316;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cat-pill {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .product-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.3;
        }

        .btn-remove-card {
          background: transparent;
          border: none;
          color: #ef4444;
          opacity: 0.75;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.15s;
        }

        .btn-remove-card:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.1);
        }

        /* ── Multi-Specification Pills ── */
        .spec-section-box {
          border-radius: 10px;
          padding: 1rem 1.15rem;
          border: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .spec-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .spec-label {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .spec-count-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .spec-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .spec-chip-btn {
          border-radius: 8px;
          border: 1.5px solid;
          padding: 0.5rem 0.95rem;
          font-size: 0.81rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
        }

        .chip-indicator-box {
          width: 15px;
          height: 15px;
          border-radius: 4px;
          border: 1.5px solid currentColor;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .chip-indicator-box.box-checked {
          background: #ffffff;
          border-color: #ffffff;
          color: #F97316;
        }

        .spec-chip-btn:hover {
          transform: translateY(-1px);
        }

        .spec-chip-btn.spec-selected {
          box-shadow: 0 3px 8px rgba(249, 115, 22, 0.28);
        }

        /* ── Quantity & Notes ── */
        .card-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .qty-block {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .qty-label {
          font-size: 0.8rem;
          font-weight: 700;
        }

        .stepper-wrap {
          display: inline-flex;
          align-items: center;
          border-radius: 8px;
          border: 1px solid;
          overflow: hidden;
        }

        .stepper-btn {
          background: transparent;
          border: none;
          width: 32px;
          height: 32px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stepper-btn:hover {
          background: rgba(0,0,0,0.06);
        }

        .stepper-input {
          width: 44px;
          height: 32px;
          background: transparent;
          border: none;
          text-align: center;
          font-size: 0.88rem;
          font-weight: 800;
          outline: none;
        }

        .qty-presets {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .preset-pill {
          padding: 3px 8px;
          border-radius: 5px;
          border: 1px solid;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }

        .preset-pill:hover {
          color: #F97316;
          border-color: #F97316;
        }

        .item-note-wrap {
          flex: 1;
          min-width: 260px;
        }

        .item-note-input {
          width: 100%;
          padding: 0.5rem 0.85rem;
          border-radius: 7px;
          border: 1px solid;
          font-size: 0.8rem;
          outline: none;
        }

        .item-note-input:focus {
          border-color: #F97316 !important;
        }

        /* Actions below list */
        .bottom-instruments-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .btn-add-more-dashed {
          padding: 0.75rem 1.4rem;
          border-radius: 10px;
          border: 1.5px dashed;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
        }

        .btn-add-more-dashed:hover {
          border-color: #F97316 !important;
          background: rgba(249, 115, 22, 0.05) !important;
        }

        /* ── Collapsible Slide-out Drawer ── */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        .details-drawer {
          width: 100%;
          max-width: 540px;
          height: 100%;
          border-left: 1px solid;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .drawer-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 0.35rem;
        }

        .drawer-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.3;
        }

        .drawer-sub {
          font-size: 0.8rem;
          margin: 0.25rem 0 0;
          line-height: 1.45;
        }

        .btn-drawer-collapse {
          background: transparent;
          border: 1px solid;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .btn-drawer-collapse:hover {
          color: #F97316 !important;
          border-color: #F97316 !important;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .drawer-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .field-label {
          font-size: 0.77rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .field-label .req {
          color: #ef4444;
        }

        .field-input {
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.84rem;
          outline: none;
          transition: border-color 0.18s;
        }

        .field-input:focus {
          border-color: #F97316 !important;
        }

        .field-textarea {
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.84rem;
          outline: none;
          resize: vertical;
          font-family: inherit;
        }

        .field-textarea:focus {
          border-color: #F97316 !important;
        }

        .chip-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .chip-choice-btn {
          border-radius: 8px;
          border: 1px solid;
          padding: 0.55rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.15s;
          text-align: center;
        }

        .rfq-summary-box {
          border-radius: 10px;
          padding: 0.85rem 1rem;
          border: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.8rem;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-submit-rfq {
          background: #F97316;
          color: #ffffff;
          border: none;
          padding: 0.85rem;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
          transition: background 0.18s, transform 0.15s;
        }

        .btn-submit-rfq:hover:not(:disabled) {
          background: #ea580c;
          transform: translateY(-1px);
        }

        .btn-submit-rfq:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .privacy-note {
          font-size: 0.73rem;
          margin: 0;
          text-align: center;
          line-height: 1.4;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        /* ── Confirmation Card ── */
        .success-card {
          border-radius: 16px;
          padding: 2.5rem 2rem;
          border: 1px solid;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }

        .success-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
          margin-bottom: 1.25rem;
        }

        .success-heading {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
        }

        .success-desc {
          font-size: 0.9rem;
          margin: 0 0 1.5rem;
          max-width: 480px;
        }

        .tracking-id-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.65rem 1.25rem;
          border-radius: 9px;
          border: 1px solid;
          margin-bottom: 1.5rem;
        }

        .tracking-label {
          font-size: 0.78rem;
          font-weight: 600;
        }

        .tracking-val {
          font-size: 1.05rem;
          font-family: monospace;
          letter-spacing: 0.05em;
        }

        .copy-btn {
          background: transparent;
          border: none;
          color: #F97316;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .summary-list-card {
          width: 100%;
          border-radius: 10px;
          padding: 1.15rem;
          border: 1px solid;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .summary-items-list::-webkit-scrollbar {
          width: 5px;
        }

        .summary-items-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .summary-items-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        html.dark .summary-items-list::-webkit-scrollbar-thumb {
          background: #334e68;
        }

        /* ── Floating Contact Info Button ── */
        .floating-contact-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 9999px;
          padding: 12px 20px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 25px -4px rgba(249, 115, 22, 0.45), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        }

        .floating-contact-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 28px -4px rgba(249, 115, 22, 0.55), 0 6px 12px -2px rgba(0, 0, 0, 0.15);
        }

        .floating-contact-btn:active {
          transform: translateY(0);
        }

        /* ── Multi-Spec Quantities ── */
        .spec-quantities-container {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .spec-quantities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.75rem;
        }

        .spec-quantity-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          border-radius: 9px;
          border: 1px solid;
          gap: 0.75rem;
        }

        .spec-qty-title {
          font-size: 0.82rem;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .summary-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid;
          gap: 1rem;
        }

        .summary-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .summary-item-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .summary-item-num {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .summary-item-thumb {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          object-fit: cover;
        }

        .summary-item-name {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .summary-item-spec {
          font-size: 0.75rem;
        }

        .qty-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(249, 115, 22, 0.15);
          color: #F97316;
        }

        .next-steps-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.85rem 1.15rem;
          border-radius: 9px;
          border: 1px solid;
          font-size: 0.82rem;
          line-height: 1.45;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .success-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-browse-more {
          background: #F97316;
          color: #ffffff;
          padding: 0.65rem 1.5rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
        }

        .btn-return-home {
          padding: 0.65rem 1.5rem;
          border-radius: 8px;
          border: 1px solid;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
        }

        /* ── Catalog Modal ── */
        .picker-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .picker-modal {
          width: 100%;
          max-width: 860px;
          height: 85vh;
          max-height: 780px;
          border-radius: 16px;
          border: 1px solid;
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .picker-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .picker-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0;
        }

        .picker-sub {
          font-size: 0.78rem;
          display: block;
          margin-top: 2px;
        }

        .btn-close-picker {
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .picker-filter-bar {
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .picker-search-wrap {
          display: flex;
          align-items: center;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          border: 1px solid;
          gap: 8px;
        }

        .picker-search-input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 0.84rem;
          outline: none;
        }

        .btn-clear-search {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }

        .picker-cats-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .picker-cat-pill {
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid;
          font-size: 0.73rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }

        .picker-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1.5rem;
        }

        .picker-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 1rem;
        }

        .picker-product-card {
          border-radius: 12px;
          border: 1px solid;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.18s, border-color 0.18s;
        }

        .picker-product-card:hover {
          transform: translateY(-2px);
        }

        .picker-thumb {
          width: 100%;
          height: 120px;
          object-fit: cover;
          background: #f1f5f9;
        }

        .picker-info {
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }

        .picker-badge-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .brand-pill-sm {
          background: #F97316;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 3px;
          text-transform: uppercase;
        }

        .cat-pill-sm {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .picker-name {
          font-size: 0.875rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .btn-picker-add {
          margin-top: auto;
          padding: 0.45rem;
          border-radius: 7px;
          border: none;
          background: #F97316;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.15s;
        }

        .btn-picker-add:hover {
          background: #ea580c;
        }

        .btn-picker-add.btn-added {
          background: #22c55e;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
        }

        .picker-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          gap: 0.75rem;
        }

        .picker-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-count {
          font-size: 0.82rem;
          font-weight: 600;
        }

        .btn-picker-done {
          background: #22c55e;
          color: #ffffff;
          border: none;
          padding: 0.55rem 1.3rem;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .enquiry-page {
            padding: 1.5rem 1rem 4rem;
          }
          .details-drawer {
            max-width: 100%;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .chip-options-grid {
            grid-template-columns: 1fr;
          }
          .card-top-row {
            flex-direction: row;
          }
          .product-thumb {
            width: 58px;
            height: 58px;
          }
          .col-header-actions {
            width: 100%;
          }
          .btn-open-picker, .btn-trigger-drawer {
            flex: 1;
            justify-content: center;
          }
          .bottom-instruments-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 480px) {
          .picker-grid {
            grid-template-columns: 1fr;
          }
          .enquiry-container {
            height: calc(100vh - 80px);
            max-height: calc(100vh - 80px);
          }
        }
      `}</style>
    </div>
  );
}
