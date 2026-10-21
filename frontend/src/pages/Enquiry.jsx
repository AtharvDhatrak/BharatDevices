import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8089';

export default function Enquiry() {
  const [searchParams] = useSearchParams();
  const initProductId   = searchParams.get('product') || '';
  const initProductName = searchParams.get('productName') || '';
  const initProductCat  = searchParams.get('productCategory') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteItems, setQuoteItems] = useState([]);
  const [openDropdownUid, setOpenDropdownUid] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const [step, setStep] = useState(1); // 1 = building quote / catalog, 3 = confirmation
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', delivery: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [enquiryId, setEnquiryId] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Close open specification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.spec-dropdown-container')) {
        setOpenDropdownUid(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Safe helper for parsing database JSONB strings or value wrappers
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

  // Helper to extract variants with system pricing and combinations
  const getProductVariants = (p) => {
    if (!p?.raw?.variants || !Array.isArray(p.raw.variants)) return [];
    return p.raw.variants.map((v, i) => {
      const combo = parseJsonb(v.combination, {});
      const comboEntries = Object.entries(combo || {});
      const comboText = comboEntries.map(([k, val]) => `${k}: ${val}`).join(' • ');
      const label = comboText || (v.sku ? `SKU: ${v.sku}` : `Option #${i + 1}`);
      const price = Number(v.price) || 0;
      return {
        id: v.id || `v-${i}`,
        sku: v.sku || '',
        combination: combo,
        label,
        price,
        stock: v.stock !== undefined ? v.stock : null
      };
    });
  };

  // Helper to extract specifications options
  const getProductSpecsList = (p) => {
    if (!p?.raw) return [];
    const specs = parseJsonb(p.raw.specifications || p.raw.specs, {});
    const list = [];
    Object.entries(specs).forEach(([k, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        val.forEach(item => {
          list.push(`${k}: ${item}`);
        });
      } else if (typeof val === 'string' && val.trim()) {
        list.push(`${k}: ${val.trim()}`);
      }
    });
    return list;
  };

  // Complete instrument specification options (5GB, 10GB, 50GB or database variants)
  const getInstrumentSpecs = (p) => {
    if (!p) return [];
    const vars = getProductVariants(p);
    if (vars.length > 0) return vars;

    const list = getProductSpecsList(p);
    const baseP = Number(p.price) || 12000;
    if (list.length > 0) {
      return list.map((specStr, idx) => ({
        id: `spec-${idx}`,
        label: specStr,
        price: baseP > 0 ? baseP : 12000,
        sku: `SPEC-${idx + 1}`,
      }));
    }

    // Default specification tiers for instruments without explicit variants
    return [
      { id: 'spec-5gb', label: '5 GB Standard Capacity', price: baseP, sku: 'BD-5GB' },
      { id: 'spec-10gb', label: '10 GB Enhanced Capacity', price: Math.round(baseP * 1.45), sku: 'BD-10GB' },
      { id: 'spec-50gb', label: '50 GB Enterprise High-Performance', price: Math.round(baseP * 2.75), sku: 'BD-50GB' },
    ];
  };

  // Helper to create a quote item from a product with multi-specification support
  const createQuoteItem = (product) => {
    const specs = getInstrumentSpecs(product);
    const defaultSpec = specs.length > 0 ? specs[0] : null;
    const initialVariants = defaultSpec
      ? [
          {
            variantId: defaultSpec.id,
            label: defaultSpec.label,
            price: Number(defaultSpec.price) || 0,
            quantity: 1,
            sku: defaultSpec.sku || '',
          },
        ]
      : [
          {
            variantId: 'default',
            label: 'Standard Specification',
            price: Number(product.price) || 0,
            quantity: 1,
            sku: '',
          },
        ];

    return {
      uid: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      raw: product.raw,
      specOptions: specs,
      selectedVariants: initialVariants,
    };
  };

  // Fetch products from backend database
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
          const variants = Array.isArray(p.variants) ? p.variants : [];
          const prices = variants
            .map((v) => Number(v.price))
            .filter((pr) => !isNaN(pr) && pr > 0);
          const minPrice = prices.length ? Math.min(...prices) : (Number(p.price) || 0);

          let imageUrl = '';
          try {
            const imgVal = p.image_urls?.value !== undefined ? p.image_urls.value : p.image_urls;
            const imgs = typeof imgVal === 'string' ? JSON.parse(imgVal) : imgVal;
            if (Array.isArray(imgs) && imgs.length > 0) {
              imageUrl = imgs[0];
            } else if (typeof imgs === 'string' && imgs.trim()) {
              imageUrl = imgs;
            }
          } catch (_) {}

          if (!imageUrl && variants.length > 0) {
            try {
              const vImg = variants[0].imageUrls?.value !== undefined ? variants[0].imageUrls.value : variants[0].imageUrls;
              const vImgs = typeof vImg === 'string' ? JSON.parse(vImg) : vImg;
              if (Array.isArray(vImgs) && vImgs.length > 0) {
                imageUrl = vImgs[0];
              } else if (typeof vImgs === 'string' && vImgs.trim()) {
                imageUrl = vImgs;
              }
            } catch (_) {}
          }

          if (!imageUrl) {
            imageUrl = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60';
          }

          return {
            id: p.id,
            name: p.title || p.name || 'Unnamed Product',
            category: p.category || p.category_id || p.subCategory || 'General',
            price: minPrice,
            image: imageUrl,
            raw: p,
          };
        });

        setProducts(normalized);
        setLoading(false);

        // Pre-select product if passed via query params
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
              category: initProductCat || 'General',
              image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60',
              price: 15000,
            };
            setQuoteItems([createQuoteItem(custom)]);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[Enquiry] Error fetching added products:', err);
        setProducts([]);
        setLoading(false);

        if (initProductName) {
          const custom = {
            id: 'custom',
            name: initProductName,
            category: initProductCat || 'General',
            image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60',
            price: 15000,
          };
          setQuoteItems([createQuoteItem(custom)]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initProductId, initProductName, initProductCat]);

  // Add a product to the quote list (supporting multi-variants)
  const addProductToQuote = (product) => {
    const existingIndex = quoteItems.findIndex((it) => String(it.productId) === String(product.id));
    if (existingIndex >= 0) {
      setQuoteItems((prev) => {
        const copy = [...prev];
        const target = copy[existingIndex];
        // If there are unselected variants for this product, add the next one
        const unselected = (target.specOptions || []).find(
          (opt) => !target.selectedVariants.some((v) => String(v.variantId) === String(opt.id) || v.label === opt.label)
        );
        if (unselected) {
          target.selectedVariants = [
            ...target.selectedVariants,
            {
              variantId: unselected.id,
              label: unselected.label,
              price: Number(unselected.price) || 0,
              quantity: 1,
              sku: unselected.sku || '',
            },
          ];
        } else if (target.selectedVariants.length > 0) {
          target.selectedVariants[0].quantity = (Number(target.selectedVariants[0].quantity) || 1) + 1;
        }
        return copy;
      });
    } else {
      setQuoteItems((prev) => [...prev, createQuoteItem(product)]);
    }
    setIsPickerOpen(false);
  };

  // Toggle specification variant on/off (allowing multi-select of both/multiple variants)
  const handleToggleVariant = (uid, opt) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;

        const isChecked = item.selectedVariants.some(
          (v) => String(v.variantId) === String(opt.id) || v.label === opt.label
        );

        if (isChecked) {
          // If already selected, do not remove if it is the only one selected
          if (item.selectedVariants.length <= 1) {
            return item;
          }
          return {
            ...item,
            selectedVariants: item.selectedVariants.filter(
              (v) => String(v.variantId) !== String(opt.id) && v.label !== opt.label
            ),
          };
        } else {
          const newVar = {
            variantId: opt.id,
            label: opt.label,
            price: Number(opt.price) || 0,
            quantity: 1,
            sku: opt.sku || '',
          };
          return {
            ...item,
            selectedVariants: [...item.selectedVariants, newVar],
          };
        }
      })
    );
  };

  // Select all available specification variants for an item
  const handleSelectAllVariants = (uid) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        const allAlready = item.selectedVariants.length === item.specOptions.length;
        if (allAlready && item.specOptions.length > 1) {
          // Reset to only first variant
          const first = item.specOptions[0];
          return {
            ...item,
            selectedVariants: [
              {
                variantId: first.id,
                label: first.label,
                price: Number(first.price) || 0,
                quantity: item.selectedVariants[0]?.quantity || 1,
                sku: first.sku || '',
              },
            ],
          };
        }

        const all = item.specOptions.map((opt) => {
          const existing = item.selectedVariants.find(
            (v) => String(v.variantId) === String(opt.id) || v.label === opt.label
          );
          if (existing) return existing;
          return {
            variantId: opt.id,
            label: opt.label,
            price: Number(opt.price) || 0,
            quantity: 1,
            sku: opt.sku || '',
          };
        });
        return { ...item, selectedVariants: all };
      })
    );
  };

  // Update quantity for a specific variant
  const handleVariantQtyChange = (uid, variantId, delta) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        return {
          ...item,
          selectedVariants: item.selectedVariants.map((v) => {
            if (String(v.variantId) !== String(variantId)) return v;
            const newQty = Math.max(1, (Number(v.quantity) || 1) + delta);
            return { ...v, quantity: newQty };
          }),
        };
      })
    );
  };

  const handleVariantQtyInput = (uid, variantId, value) => {
    const val = parseInt(value, 10);
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        return {
          ...item,
          selectedVariants: item.selectedVariants.map((v) => {
            if (String(v.variantId) !== String(variantId)) return v;
            return { ...v, quantity: isNaN(val) ? '' : val };
          }),
        };
      })
    );
  };

  const handleVariantQtyBlur = (uid, variantId) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        return {
          ...item,
          selectedVariants: item.selectedVariants.map((v) => {
            if (String(v.variantId) !== String(variantId)) return v;
            return { ...v, quantity: Math.max(1, Number(v.quantity) || 1) };
          }),
        };
      })
    );
  };

  // Remove an item entirely from the quote
  const handleRemoveItem = (uid) => {
    setQuoteItems((prev) => prev.filter((item) => item.uid !== uid));
  };

  // Calculate Grand Total & Total Units dynamically across all selected variants of all items
  const grandTotal = useMemo(() => {
    return quoteItems.reduce((acc, item) => {
      const itemSum = (item.selectedVariants || []).reduce((sum, v) => {
        const p = Number(v.price) || 0;
        const q = Number(v.quantity) || 1;
        return sum + p * q;
      }, 0);
      return acc + itemSum;
    }, 0);
  }, [quoteItems]);

  const totalUnits = useMemo(() => {
    return quoteItems.reduce((acc, item) => {
      const itemUnits = (item.selectedVariants || []).reduce(
        (sum, v) => sum + (Number(v.quantity) || 1),
        0
      );
      return acc + itemUnits;
    }, 0);
  }, [quoteItems]);

  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quoteItems.length === 0) {
      setSubmitError('Please add at least one product or instrument to your quotation request.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const id = `BD-ENQ-${Date.now().toString().slice(-6)}`;

    // Product Name summary
    const firstItem = quoteItems[0];
    const firstVariantsCount = firstItem?.selectedVariants?.length || 1;
    const firstSpecSummary =
      firstVariantsCount > 1
        ? `${firstItem.name} [${firstVariantsCount} Specifications]`
        : `${firstItem.name} [Spec: ${firstItem?.selectedVariants?.[0]?.label || 'Standard'}]`;

    const formattedProductName =
      quoteItems.length === 1
        ? firstSpecSummary
        : `${firstSpecSummary} (+${quoteItems.length - 1} other products)`;

    const categoriesList = Array.from(new Set(quoteItems.map((i) => i.category))).join(', ');

    // Itemized breakdown: one block per variant so backend & email auto-parser reads each line item
    let itemCounter = 1;
    const itemsList = [];
    quoteItems.forEach((item) => {
      (item.selectedVariants || []).forEach((v) => {
        const itemSubtotal = (Number(v.price) || 0) * (Number(v.quantity) || 1);
        itemsList.push(
          [
            `Product #${itemCounter}: ${item.name}`,
            `• Specification: ${v.label}`,
            `• System Unit Price: ₹${(Number(v.price) || 0).toLocaleString('en-IN')}`,
            `• Quantity: ${v.quantity} units`,
            `• Subtotal: ₹${itemSubtotal.toLocaleString('en-IN')}`,
          ].join('\n')
        );
        itemCounter++;
      });
    });

    const itemsBreakdown = itemsList.join('\n\n');

    const structuredMessage = [
      `[Specification & System Pricing Breakdown]:`,
      itemsBreakdown,
      `----------------------------------------`,
      `• Total Items: ${quoteItems.length} products (${totalUnits} units total)`,
      `• Estimated Commercial Total: ₹${grandTotal.toLocaleString('en-IN')}`,
      '',
      `[Customer Requirements / Delivery Notes]:`,
      form.message?.trim() ? form.message.trim() : 'Standard commercial quotation requested.',
    ].join('\n');

    try {
      const res = await fetch(`${API_BASE}/api/enquiry/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId:       id,
          name:            form.name,
          company:         form.company,
          email:           form.email,
          phone:           form.phone,
          delivery:        form.delivery,
          message:         structuredMessage,
          productName:     formattedProductName,
          productCategory: categoriesList || 'General',
          quantity:        totalUnits,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success !== false) {
        setEnquiryId(data?.enquiryId || id);
        setStep(3);
      } else {
        const msg = data?.message || `Submission failed with status ${res.status}. Please try again.`;
        setSubmitError(msg);
      }
    } catch (err) {
      console.error('[Enquiry] Network error:', err.message);
      setSubmitError('Unable to connect to the server. Please check your network connection and try again.');
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

  const filteredPickerProducts = products.filter((p) => {
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase().trim();
    return (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
  });

  return (
    <div className="enquiry-page">
      <div className="enquiry-container">
        {/* Subtle Top Header */}
        <div className="enquiry-header">
          <div className="enquiry-badge">Commercial Quotation Portal</div>
          <h1 className="enquiry-title">Request a Business Quotation</h1>
          <p className="enquiry-desc">
            Select one or multiple instruments, configure technical specifications, and receive an automated quotation based on official system pricing.
          </p>
        </div>

        {/* Step 3: Thank You / Confirmation */}
        {step === 3 ? (
          <div className="thank-you-card">
            <div className="thank-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="thank-heading">Quotation Request Logged</h2>
            <p className="thank-desc">Your multi-product quotation has been received by our commercial sales team.</p>

            <div className="enquiry-id-box">
              <span className="enquiry-id-label">Tracking ID:</span>
              <strong className="enquiry-id-value">{enquiryId}</strong>
              <button type="button" onClick={handleCopyId} className="btn-copy-id">
                {copiedId ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

            <div className="thank-summary-box">
              <div className="thank-summary-row">
                <span>Products Quoted:</span>
                <strong>{quoteItems.length} Products ({totalUnits} units)</strong>
              </div>
              <div className="thank-summary-row">
                <span>Estimated Commercial Total:</span>
                <strong style={{ color: '#f97316' }}>₹{grandTotal.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <p className="thank-followup">An official quotation with GST tax breakdown will be dispatched to your email shortly.</p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              <Link to="/" className="btn-back-home">Back to Home</Link>
              <Link to="/products" className="btn-explore-catalog">Browse Catalog</Link>
            </div>
          </div>
        ) : (
          /* Step 1 & 2: Main Layout */
          <div className="quote-grid-layout">
            {/* ─── LEFT COLUMN: QUOTATION ITEMS & DYNAMIC QUOTES ─── */}
            <div className="quote-items-col">
              <div className="section-header-row">
                <div>
                  <h2 className="section-title">Selected Instruments</h2>
                  <span className="section-subtitle">
                    {quoteItems.length} {quoteItems.length === 1 ? 'Product' : 'Products'} · {totalUnits} {totalUnits === 1 ? 'Unit' : 'Units'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="btn-add-product"
                >
                  + Add Product
                </button>
              </div>

              {/* Items List */}
              {quoteItems.length === 0 ? (
                <div className="empty-quote-state">
                  <div className="empty-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <h3>No instruments added yet</h3>
                  <p>Add devices from our catalog to build your custom business quote.</p>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="btn-browse-catalog"
                  >
                    Select Instruments from Catalog →
                  </button>
                </div>
              ) : (
                <div className="quote-items-list">
                  {quoteItems.map((item) => {
                    const selectedVars = item.selectedVariants || [];
                    const itemUnits = selectedVars.reduce((s, v) => s + (Number(v.quantity) || 1), 0);
                    const itemSubtotal = selectedVars.reduce((s, v) => s + (Number(v.price) || 0) * (Number(v.quantity) || 1), 0);
                    const hasMultipleSelected = selectedVars.length > 1;
                    const isDropdownOpen = openDropdownUid === item.uid;

                    return (
                      <div
                        key={item.uid}
                        className={`quote-item-card ${isDropdownOpen ? 'card-dropdown-active' : ''}`}
                      >
                        {/* Top: Image, Name & Delete */}
                        <div className="item-header-row">
                          <img src={item.image} alt={item.name} className="item-thumb" />
                          <div className="item-meta">
                            <h4 className="item-title">{item.name}</h4>
                            <span className="item-cat">{item.category}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.uid)}
                            className="btn-remove-item"
                            title="Remove product from quote"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Middle: Clean Specification Dropdown with Multi-Selection Access */}
                        <div className="item-spec-box">
                          <div className="spec-label-row">
                            <label className="item-field-label">Specification / Variant:</label>
                            {item.specOptions.length > 1 && (
                              <span className="spec-count-tag">
                                {selectedVars.length} of {item.specOptions.length} selected
                              </span>
                            )}
                          </div>

                          <div className="spec-dropdown-container">
                            <button
                              type="button"
                              className={`spec-dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownUid(isDropdownOpen ? null : item.uid);
                              }}
                            >
                              <div className="spec-trigger-left">
                                {hasMultipleSelected ? (
                                  <div className="multi-tag-display">
                                    <span className="multi-count-pill">{selectedVars.length} Selected</span>
                                    <span className="multi-summary-text">
                                      {selectedVars.map((v) => v.label.split('•')[0].trim()).join(' • ')}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="single-spec-display">
                                    <span className="single-spec-title">
                                      {selectedVars[0]?.label || 'Standard Specification'}
                                    </span>
                                    <span className="single-spec-price-tag">
                                      — ₹{(Number(selectedVars[0]?.price) || 0).toLocaleString('en-IN')} / unit
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="spec-trigger-right">
                                <span className={`dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`}>▼</span>
                              </div>
                            </button>

                            {/* Multi-Select Floating Dropdown Menu */}
                            {isDropdownOpen && (
                              <div className="spec-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                <div className="spec-dropdown-header">
                                  <div>
                                    <span className="menu-header-title">Select Specifications</span>
                                    <span className="menu-header-hint">Tap to check both or multiple variants</span>
                                  </div>
                                  {item.specOptions.length > 1 && (
                                    <button
                                      type="button"
                                      className="spec-btn-action"
                                      onClick={() => handleSelectAllVariants(item.uid)}
                                    >
                                      {selectedVars.length === item.specOptions.length ? 'Reset to Single' : 'Select All'}
                                    </button>
                                  )}
                                </div>

                                <div className="spec-options-scroll">
                                  {item.specOptions.map((opt) => {
                                    const isChecked = selectedVars.some(
                                      (v) => String(v.variantId) === String(opt.id) || v.label === opt.label
                                    );
                                    return (
                                      <div
                                        key={opt.id}
                                        className={`spec-option-row ${isChecked ? 'selected' : ''}`}
                                        onClick={() => handleToggleVariant(item.uid, opt)}
                                      >
                                        <div className={`spec-custom-checkbox ${isChecked ? 'checked' : ''}`}>
                                          {isChecked ? '✓' : ''}
                                        </div>
                                        <div className="spec-option-info">
                                          <span className="spec-option-name">{opt.label}</span>
                                          <span className="spec-option-cost">
                                            ₹{Number(opt.price).toLocaleString('en-IN')} / unit
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="spec-dropdown-footer">
                                  <span className="footer-notice">
                                    {selectedVars.length} specification{selectedVars.length !== 1 ? 's' : ''} active
                                  </span>
                                  <button
                                    type="button"
                                    className="spec-btn-done"
                                    onClick={() => setOpenDropdownUid(null)}
                                  >
                                    Done ✓
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom: Variant Quantities & Subtotals */}
                        {hasMultipleSelected ? (
                          <div className="item-variants-list-wrap">
                            <div className="variants-list-head">
                              <span>Configured Specifications ({selectedVars.length}):</span>
                            </div>
                            <div className="variants-list">
                              {selectedVars.map((v) => {
                                const vSub = (Number(v.price) || 0) * (Number(v.quantity) || 1);
                                return (
                                  <div key={v.variantId || v.label} className="variant-line-item">
                                    <div className="variant-line-meta">
                                      <span className="variant-line-label">{v.label}</span>
                                      <span className="variant-line-unit-rate">
                                        ₹{(Number(v.price) || 0).toLocaleString('en-IN')} / unit
                                      </span>
                                    </div>

                                    <div className="variant-line-actions">
                                      <div className="qty-controls">
                                        <button
                                          type="button"
                                          className="qty-btn"
                                          onClick={() => handleVariantQtyChange(item.uid, v.variantId, -1)}
                                        >
                                          −
                                        </button>
                                        <input
                                          type="number"
                                          className="qty-input"
                                          min="1"
                                          value={v.quantity}
                                          onChange={(e) => handleVariantQtyInput(item.uid, v.variantId, e.target.value)}
                                          onBlur={() => handleVariantQtyBlur(item.uid, v.variantId)}
                                        />
                                        <button
                                          type="button"
                                          className="qty-btn"
                                          onClick={() => handleVariantQtyChange(item.uid, v.variantId, 1)}
                                        >
                                          +
                                        </button>
                                      </div>

                                      <span className="variant-line-subtotal">₹{vSub.toLocaleString('en-IN')}</span>

                                      {selectedVars.length > 1 && (
                                        <button
                                          type="button"
                                          className="btn-del-variant"
                                          title="Deselect this specification"
                                          onClick={() => handleToggleVariant(item.uid, { id: v.variantId, label: v.label })}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="item-footer-row product-total-bar">
                              <span className="product-total-label">Subtotal for {item.name}:</span>
                              <strong className="product-total-amount">
                                {itemUnits} {itemUnits === 1 ? 'Unit' : 'Units'} · ₹{itemSubtotal.toLocaleString('en-IN')}
                              </strong>
                            </div>
                          </div>
                        ) : (
                          <div className="item-footer-row">
                            <div className="item-qty-wrap">
                              <span className="item-qty-label">Qty:</span>
                              <div className="qty-controls">
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => handleVariantQtyChange(item.uid, selectedVars[0]?.variantId, -1)}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  className="qty-input"
                                  min="1"
                                  value={selectedVars[0]?.quantity}
                                  onChange={(e) => handleVariantQtyInput(item.uid, selectedVars[0]?.variantId, e.target.value)}
                                  onBlur={() => handleVariantQtyBlur(item.uid, selectedVars[0]?.variantId)}
                                />
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => handleVariantQtyChange(item.uid, selectedVars[0]?.variantId, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="item-subtotal-box">
                              <span className="subtotal-label">Subtotal:</span>
                              <strong className="subtotal-amount">₹{itemSubtotal.toLocaleString('en-IN')}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dynamic Quotation Summary Card */}
              {quoteItems.length > 0 && (
                <div className="quote-summary-card">
                  <div className="summary-title-row">
                    <span className="summary-title">Commercial Quotation Summary</span>
                    <span className="summary-badge">Official Pricing</span>
                  </div>

                  <div className="summary-line">
                    <span>Instruments Selected:</span>
                    <strong>{quoteItems.length} Products</strong>
                  </div>
                  <div className="summary-line">
                    <span>Total Quantity:</span>
                    <strong>{totalUnits} Units</strong>
                  </div>

                  <div className="summary-divider" />

                  <div className="summary-total-row">
                    <span>Estimated Total Quote:</span>
                    <span className="summary-grand-total">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <p className="summary-note">
                    ✓ Official quotation reflecting this specification & price will be provided in email response.
                  </p>
                </div>
              )}
            </div>

            {/* ─── RIGHT COLUMN: CUSTOMER & DELIVERY INFORMATION ─── */}
            <div className="quote-form-col">
              <h2 className="section-title">Delivery & Contact Details</h2>
              <p className="section-subtitle">Enter your organization details to receive the official commercial quotation.</p>

              <form className="quote-form" onSubmit={handleSubmit}>
                <div className="form-two-col">
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="req">*</span></label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company / Organization <span className="req">*</span></label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleFormChange}
                      placeholder="e.g. Acme Tech Solutions"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-two-col">
                  <div className="form-group">
                    <label className="form-label">Work Email <span className="req">*</span></label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="name@company.com"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number <span className="req">*</span></label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="+91 98765 43210"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Location / City <span className="req">*</span></label>
                  <input
                    name="delivery"
                    value={form.delivery}
                    onChange={handleFormChange}
                    placeholder="e.g. Bandra-Kurla Complex (BKC), Mumbai"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Requirements / Notes (Optional)</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleFormChange}
                    placeholder="Specify warranty duration, GST invoice details, delivery timeline, or technical accessories..."
                    rows={3}
                    className="form-input form-textarea"
                  />
                </div>

                {submitError && (
                  <div className="submit-error-banner">
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-submit-quote"
                  disabled={submitting || quoteItems.length === 0}
                >
                  {submitting
                    ? 'Submitting Request...'
                    : `Submit Quotation Request (${quoteItems.length} Products · ₹${grandTotal.toLocaleString('en-IN')}) →`}
                </button>

                <p className="privacy-note">
                  🔒 Your details are securely encrypted and used strictly for commercial quotation purposes.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* ─── PRODUCT CATALOG PICKER MODAL (Add More Products) ─── */}
        {isPickerOpen && (
          <div className="modal-backdrop" onClick={() => setIsPickerOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Select Instruments to Add</h3>
                  <span className="modal-sub">Add multiple products to generate a combined quotation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  className="modal-close-btn"
                >
                  ✕
                </button>
              </div>

              {/* Search input */}
              <div className="modal-search-wrap">
                <input
                  type="text"
                  placeholder="Search available devices..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="modal-search-input"
                  autoFocus
                />
              </div>

              {/* Products list */}
              <div className="modal-products-grid">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    Loading available devices...
                  </div>
                ) : filteredPickerProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    No products found matching "{pickerSearch}".
                  </div>
                ) : (
                  filteredPickerProducts.map((p) => {
                    const isAlreadyAdded = quoteItems.some((it) => String(it.productId) === String(p.id));
                    return (
                      <div key={p.id} className="picker-product-card">
                        <img src={p.image} alt={p.name} className="picker-img" />
                        <div className="picker-info">
                          <h4 className="picker-name">{p.name}</h4>
                          <span className="picker-cat">{p.category}</span>
                          <span className="picker-price">
                            {p.price > 0 ? `₹${p.price.toLocaleString('en-IN')} onwards` : 'System Pricing'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProductToQuote(p)}
                          className={`btn-picker-add ${isAlreadyAdded ? 'added' : ''}`}
                        >
                          {isAlreadyAdded ? '+ Add More' : '+ Add to Quote'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .enquiry-page {
          background: radial-gradient(circle at 50% 0%, #0d1a33 0%, #070d1e 60%, #040814 100%);
          min-height: 100vh;
          padding: 2.5rem 1.25rem 4rem;
          color: #f8fafc;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .enquiry-container {
          max-width: 1140px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .enquiry-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .enquiry-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.12);
          border: 1px solid rgba(249, 115, 22, 0.3);
          color: #fb923c;
          margin-bottom: 0.6rem;
        }

        .enquiry-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.4rem;
          letter-spacing: -0.02em;
        }

        .enquiry-desc {
          color: #94a3b8;
          font-size: 0.88rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* ── 2-Column Grid Layout ── */
        .quote-grid-layout {
          display: grid;
          grid-template-columns: minmax(360px, 460px) 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* ── Left Column (Quote Items) ── */
        .quote-items-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .section-subtitle {
          font-size: 0.78rem;
          color: #94a3b8;
          display: block;
          margin-top: 2px;
        }

        .btn-add-product {
          background: rgba(249, 115, 22, 0.12);
          border: 1px solid rgba(249, 115, 22, 0.35);
          color: #fb923c;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add-product:hover {
          background: #f97316;
          color: #ffffff;
          border-color: #f97316;
        }

        /* Empty State */
        .empty-quote-state {
          background: rgba(15, 23, 42, 0.6);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.3rem;
        }

        .empty-quote-state h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0;
        }

        .empty-quote-state p {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 0;
          max-width: 280px;
        }

        .btn-browse-catalog {
          margin-top: 0.5rem;
          background: #f97316;
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Items List */
        .quote-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          max-height: 580px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .quote-item-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.2s;
          position: relative;
        }

        .quote-item-card:hover {
          border-color: rgba(249, 115, 22, 0.4);
        }

        .quote-item-card.card-dropdown-active {
          border-color: rgba(249, 115, 22, 0.7);
          z-index: 50;
        }

        .item-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .item-thumb {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          object-fit: cover;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .item-meta {
          flex: 1;
          min-width: 0;
        }

        .item-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-cat {
          font-size: 0.72rem;
          color: #94a3b8;
          display: block;
          margin-top: 2px;
        }

        .btn-remove-item {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          line-height: 1;
        }

        .btn-remove-item:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .item-spec-box {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .spec-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-field-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .spec-count-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: #fb923c;
          background: rgba(249, 115, 22, 0.12);
          border: 1px solid rgba(249, 115, 22, 0.3);
          padding: 1px 6px;
          border-radius: 4px;
        }

        /* ── Multi-Specification Dropdown Selector ── */
        .spec-dropdown-container {
          position: relative;
          width: 100%;
        }

        .spec-dropdown-trigger {
          width: 100%;
          background: #0b1428;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 6px;
          padding: 7px 10px;
          color: #ffffff;
          font-size: 0.8rem;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          text-align: left;
        }

        .spec-dropdown-trigger:hover,
        .spec-dropdown-trigger.open {
          border-color: #f97316;
          background: #0e1a35;
        }

        .spec-trigger-left {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
        }

        .multi-tag-display {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          overflow: hidden;
        }

        .multi-count-pill {
          background: #ea580c;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .multi-summary-text {
          font-size: 0.78rem;
          font-weight: 600;
          color: #fed7aa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .single-spec-display {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .single-spec-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #f8fafc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .single-spec-price-tag {
          font-size: 0.78rem;
          color: #fb923c;
          font-weight: 700;
          flex-shrink: 0;
        }

        .dropdown-chevron {
          font-size: 0.65rem;
          color: #94a3b8;
          transition: transform 0.2s ease;
          display: inline-block;
        }

        .dropdown-chevron.rotated {
          transform: rotate(180deg);
          color: #f97316;
        }

        /* ── Floating Dropdown Menu ── */
        .spec-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #081126;
          border: 1.5px solid #f97316;
          border-radius: 8px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.75);
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: specMenuIn 0.15s ease-out;
        }

        @keyframes specMenuIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .spec-dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .menu-header-title {
          font-size: 0.76rem;
          font-weight: 700;
          color: #ffffff;
          display: block;
        }

        .menu-header-hint {
          font-size: 0.66rem;
          color: #94a3b8;
          display: block;
        }

        .spec-btn-action {
          background: rgba(249, 115, 22, 0.15);
          border: 1px solid rgba(249, 115, 22, 0.4);
          color: #fb923c;
          font-size: 0.68rem;
          font-weight: 700;
          border-radius: 4px;
          padding: 3px 8px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .spec-btn-action:hover {
          background: #ea580c;
          color: #ffffff;
        }

        .spec-options-scroll {
          max-height: 200px;
          overflow-y: auto;
          padding: 5px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .spec-option-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 9px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
          user-select: none;
        }

        .spec-option-row:hover {
          background: rgba(255, 255, 255, 0.07);
        }

        .spec-option-row.selected {
          background: rgba(249, 115, 22, 0.14);
        }

        .spec-custom-checkbox {
          width: 17px;
          height: 17px;
          border-radius: 4px;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          color: #ffffff;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .spec-custom-checkbox.checked {
          background: #ea580c;
          border-color: #ea580c;
        }

        .spec-option-info {
          flex: 1;
          min-width: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
        }

        .spec-option-name {
          font-size: 0.77rem;
          color: #ffffff;
          font-weight: 500;
        }

        .spec-option-cost {
          font-size: 0.75rem;
          color: #fb923c;
          font-weight: 700;
          white-space: nowrap;
        }

        .spec-dropdown-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-notice {
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .spec-btn-done {
          background: #ea580c;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }

        .spec-btn-done:hover {
          background: #f97316;
        }

        /* ── Multi-Variants Itemized List ── */
        .item-variants-list-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 2px;
        }

        .variants-list-head {
          font-size: 0.7rem;
          font-weight: 700;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .variants-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .variant-line-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 7px 9px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .variant-line-meta {
          flex: 1;
          min-width: 140px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .variant-line-label {
          font-size: 0.77rem;
          font-weight: 600;
          color: #ffffff;
        }

        .variant-line-unit-rate {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .variant-line-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .variant-line-subtotal {
          font-size: 0.82rem;
          font-weight: 800;
          color: #fb923c;
          min-width: 65px;
          text-align: right;
        }

        .btn-del-variant {
          background: none;
          border: none;
          color: #64748b;
          font-size: 12px;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          line-height: 1;
        }

        .btn-del-variant:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .product-total-bar {
          margin-top: 2px;
          padding-top: 6px;
          border-top: 1px dashed rgba(255, 255, 255, 0.12);
        }

        .product-total-label {
          font-size: 0.74rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .product-total-amount {
          font-size: 0.86rem;
          color: #fb923c;
          font-weight: 800;
        }

        .item-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .item-qty-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .item-qty-label {
          font-size: 0.74rem;
          color: #94a3b8;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 6px;
          overflow: hidden;
        }

        .qty-btn {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 14px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .qty-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .qty-input {
          width: 36px;
          text-align: center;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          outline: none;
          padding: 0;
        }

        .item-subtotal-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .subtotal-label {
          font-size: 0.74rem;
          color: #94a3b8;
        }

        .subtotal-amount {
          font-size: 0.88rem;
          color: #fb923c;
          font-weight: 700;
        }

        /* Summary Card */
        .quote-summary-card {
          background: rgba(11, 20, 40, 0.85);
          border: 1px solid rgba(249, 115, 22, 0.3);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .summary-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .summary-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #fb923c;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .summary-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 999px;
          padding: 1px 7px;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #cbd5e1;
        }

        .summary-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 4px 0;
        }

        .summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }

        .summary-grand-total {
          font-size: 1.15rem;
          font-weight: 800;
          color: #f97316;
        }

        .summary-note {
          margin: 4px 0 0;
          font-size: 0.7rem;
          color: #86efac;
          line-height: 1.3;
        }

        /* ── Right Column (Form) ── */
        .quote-form-col {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
        }

        .quote-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .form-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .form-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .req { color: #f87171; }

        .form-input {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 0.6rem 0.8rem;
          font-size: 0.86rem;
          color: #ffffff;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: #f97316;
          background: rgba(255, 255, 255, 0.09);
        }

        .form-textarea {
          resize: vertical;
          min-height: 70px;
        }

        .btn-submit-quote {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.85rem 1rem;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.4rem;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
        }

        .btn-submit-quote:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(249, 115, 22, 0.45);
        }

        .btn-submit-quote:disabled {
          background: rgba(255, 255, 255, 0.2);
          color: #64748b;
          cursor: not-allowed;
          box-shadow: none;
        }

        .privacy-note {
          font-size: 0.72rem;
          color: #64748b;
          text-align: center;
          margin: 0;
        }

        .submit-error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 0.8rem;
          color: #fca5a5;
        }

        /* ── Modal Picker ── */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: #0b1428;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          width: 100%;
          max-width: 640px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .modal-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          display: block;
          margin-top: 2px;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 16px;
          cursor: pointer;
        }

        .modal-search-wrap {
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .modal-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 7px 12px;
          color: #ffffff;
          font-size: 0.84rem;
          outline: none;
        }

        .modal-products-grid {
          padding: 14px 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .picker-product-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px 12px;
          transition: background 0.2s;
        }

        .picker-product-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .picker-img {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
          background: rgba(0, 0, 0, 0.2);
        }

        .picker-info {
          flex: 1;
          min-width: 0;
        }

        .picker-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .picker-cat {
          font-size: 0.7rem;
          color: #94a3b8;
          display: block;
        }

        .picker-price {
          font-size: 0.76rem;
          color: #fb923c;
          font-weight: 700;
        }

        .btn-picker-add {
          background: #f97316;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn-picker-add.added {
          background: rgba(249, 115, 22, 0.2);
          color: #fb923c;
          border: 1px solid rgba(249, 115, 22, 0.4);
        }

        /* ── Thank You Card ── */
        .thank-you-card {
          max-width: 520px;
          margin: 0 auto;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 2.5rem 1.8rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .thank-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 10px rgba(22, 163, 74, 0.18);
        }

        .thank-heading {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }

        .thank-desc {
          font-size: 0.88rem;
          color: #94a3b8;
          margin: 0;
        }

        .enquiry-id-box {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .enquiry-id-label { font-size: 0.78rem; color: #94a3b8; }
        .enquiry-id-value { font-size: 0.95rem; color: #fb923c; font-family: monospace; }
        .btn-copy-id {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border-radius: 4px;
          padding: 2px 7px;
          font-size: 11px;
          cursor: pointer;
        }

        .thank-summary-box {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .thank-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #cbd5e1;
        }

        .thank-followup {
          font-size: 0.82rem;
          color: #86efac;
          margin: 0;
        }

        .btn-back-home {
          background: #ffffff;
          color: #ea580c;
          border-radius: 6px;
          padding: 0.65rem 1.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
        }

        .btn-explore-catalog {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 0.65rem 1.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .quote-grid-layout {
            grid-template-columns: 1fr;
          }
          .quote-items-list {
            max-height: none;
          }
        }

        @media (max-width: 520px) {
          .enquiry-page {
            padding: 1.5rem 0.85rem 3rem;
          }
          .form-two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
