import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import AdminTopbar from '../../pages/Admin/AdminTopbar';
import httpService from '../../services/httpService';
import { useTheme } from '../../components/ThemeContext';

/* ─── Constants ─── */


const STEPS = [
  { id: 1, title: 'Basic Info', desc: 'Add basic product details' },
  { id: 2, title: 'Specs', desc: 'Add product specifications' },
  { id: 3, title: 'Pricing', desc: 'Set pricing and stock details' },
  { id: 4, title: 'Media', desc: 'Upload images via backend' },
  { id: 5, title: 'SEO', desc: 'SEO and other settings' },
];

/* ─── Main Component ─── */
export default function AdminAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const isEdit = Boolean(id);
  const existingProduct = location.state?.editProduct || null;

  const [fetchedProduct, setFetchedProduct] = useState(null);

  // Fetch product data from backend if editing directly via URL
  useEffect(() => {
    let mounted = true;
    if (isEdit && !existingProduct) {
      httpService.get(`/base/product/${id}`)
        .then(res => {
          const prodData = res.data?.data || res.data;
          if (mounted && prodData) setFetchedProduct(prodData);
        })
        .catch(err => console.log("Failed to fetch product for editing", err));
    }
    return () => { mounted = false; };
  }, [id, isEdit, existingProduct]);

  const productData = existingProduct || fetchedProduct;

  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [brands, setBrands] = useState([]);
  /* Fetch sidebar nav items and categories using httpService */
  useEffect(() => {
    let mounted = true;
    const fetchMetadata = async () => {
      try {
        const role = (localStorage.getItem('userRole') || 'ADMIN').toUpperCase();
        const [menuRes, catRes, brandRes] = await Promise.allSettled([
          httpService.get('/base/menus', { params: { role } }),
          httpService.get('/base/getCategories').catch(() => httpService.get('/getCategories')),
          httpService.get('/base/getBrands').catch(() => httpService.get('/getBrands'))
        ]);

        if (mounted) {
          if (menuRes.status === 'fulfilled') {
            const data = menuRes.value?.data?.data || menuRes.value?.data || [];
            if (Array.isArray(data)) {
              setNavItems([...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
            }
          }
          if (catRes.status === 'fulfilled') {
            const catData = catRes.value?.data?.data || catRes.value?.data || [];
            if (Array.isArray(catData)) {
              setCategoriesList(catData);
            } else if (catData && typeof catData === 'object') {
              setCategoriesList(Object.values(catData));
            }
          }
          if (brandRes.status === 'fulfilled') {
            const brandData = brandRes.value?.data?.data || brandRes.value?.data || [];
            if (Array.isArray(brandData)) {
              setBrands(brandData);
            } else if (brandData && typeof brandData === 'object') {
              setBrands(Object.values(brandData));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch metadata", err);
        if (mounted) setNavItems([]);
      } finally {
        if (mounted) setNavLoading(false);
      }
    };
    fetchMetadata();
    return () => { mounted = false; };
  }, []);

  /* Form states mapped cleanly */
  const [basic, setBasic] = useState({
    name: productData?.name || productData?.title || '',
    sku: productData?.sku || productData?.product_id || '',
    brand: productData?.brand || '',
    modelNumber: productData?.modelNumber || productData?.model_number || '',
    category: productData?.category || productData?.category_id || '',
    subCategory: productData?.subCategory || productData?.sub_category || '',
    shortDescription: productData?.shortDescription || productData?.short_description || '',
    detailedDescription: productData?.detailedDescription || productData?.description || productData?.detailed_description || '',
    tagsInput: Array.isArray(productData?.tags) 
      ? productData.tags.join(', ') 
      : (typeof productData?.tags === 'string' ? productData.tags : ''),
  });

  // Robust Initializer for Specs supporting all JSON formats / object variations
  const [specs, setSpecs] = useState(() => {
    let sourceSpecs = productData?.specs || productData?.specifications || existingProduct?.specs || existingProduct?.specifications;
    
    if (typeof sourceSpecs === 'string') {
      try { sourceSpecs = JSON.parse(sourceSpecs); } catch { sourceSpecs = {}; }
    }

    if (sourceSpecs && typeof sourceSpecs === 'object') {
      if (sourceSpecs.value && typeof sourceSpecs.value === 'string') {
        try { sourceSpecs = JSON.parse(sourceSpecs.value); } catch {}
      } else if (sourceSpecs.value && typeof sourceSpecs.value === 'object') {
        sourceSpecs = sourceSpecs.value;
      }

      delete sourceSpecs.type;
      delete sourceSpecs.null;

      if (Array.isArray(sourceSpecs)) {
        return sourceSpecs.map((s, idx) => ({
          id: s.id || idx + 1,
          key: s.key || s.name || '',
          value: s.value !== undefined ? s.value : '',
          type: s.type || (Array.isArray(s.value) ? 'multiselect' : 'text'),
          options: s.options || [],
          isVariant: s.isVariant || false
        }));
      }

      const entries = Object.entries(sourceSpecs);
      if (entries.length > 0) {
        return entries.map(([k, v], idx) => ({
          key: k,
          value: v,
          type: Array.isArray(v) ? 'multiselect' : 'text',
          options: Array.isArray(v) ? v : [],
          isVariant: false,
          id: idx + 1
        }));
      }
    }
    return [{ key: 'Model', value: '', type: 'text', options: [], isVariant: false, id: 1 }];
  });

  const [variants, setVariants] = useState(() => productData?.variants || []);

  const [pricing, setPricing] = useState({
    price: productData?.price || productData?.base_price || '',
    priceNote: productData?.priceNote || 'Price varies based on configuration',
    minQty: productData?.minQty || 1,
    maxQty: productData?.maxQty || '',
    stockStatus: productData?.stockStatus || 'In Stock',
    availableUnits: productData?.availableUnits || productData?.stock || '',
  });

  const [seo, setSeo] = useState({
    slug: productData?.slug || productData?.seo_slug || '',
    metaTitle: productData?.metaTitle || '',
    metaDescription: productData?.metaDescription || '',
  });

  const [media, setMedia] = useState({
    generalImages: productData?.image_urls || productData?.imageUrls || productData?.generalImages || [], 
    variantImages: productData?.variantImages || {}, 
    primaryIndex: productData?.primaryIndex || 0,
    videoUrl: productData?.videoUrl || ''
  });

  const [quickInfo, setQuickInfo] = useState({
    status: productData?.status || 'Active',
    featured: productData?.featured ?? false,
    newArrival: productData?.newArrival ?? false,
    warrantyPeriod: productData?.warrantyPeriod || '',
    supportType: productData?.supportType || '',
  });

  // Re-populate state asynchronously when productData arrives
  useEffect(() => {
    if (productData) {
      setBasic({
        name: productData.name || productData.title || '',
        sku: productData.sku || productData.product_id || '',
        brand: productData.brand || '',
        modelNumber: productData.modelNumber || productData.model_number || '',
        category: productData.category || productData.category_id || '',
        subCategory: productData.subCategory || productData.sub_category || '',
        shortDescription: productData.shortDescription || productData.short_description || '',
        detailedDescription: productData.detailedDescription || productData.description || productData.detailed_description || '',
        tagsInput: Array.isArray(productData.tags) 
          ? productData.tags.join(', ') 
          : (typeof productData.tags === 'string' ? (productData.tags.startsWith('[') ? JSON.parse(productData.tags).join(', ') : productData.tags) : ''),
      });

      let rawSpecs = productData.specs || productData.specifications;
      if (typeof rawSpecs === 'string') {
        try { rawSpecs = JSON.parse(rawSpecs); } catch { rawSpecs = {}; }
      }
      if (rawSpecs && typeof rawSpecs === 'object') {
        if (rawSpecs.value) {
          try { rawSpecs = typeof rawSpecs.value === 'string' ? JSON.parse(rawSpecs.value) : rawSpecs.value; } catch {}
        }

        if (Array.isArray(rawSpecs)) {
          setSpecs(rawSpecs.map((s, idx) => ({
            id: s.id || idx + 1,
            key: s.key || s.name || '',
            value: s.value !== undefined ? s.value : '',
            type: s.type || (Array.isArray(s.value) ? 'multiselect' : 'text'),
            options: s.options || [],
            isVariant: s.isVariant || false
          })));
        } else {
          const entries = Object.entries(rawSpecs);
          if (entries.length > 0) {
            setSpecs(entries.map(([k, v], idx) => ({
              key: k,
              value: v,
              type: Array.isArray(v) ? 'multiselect' : 'text',
              options: Array.isArray(v) ? v : [],
              isVariant: false,
              id: idx + 1
            })));
          }
        }
      }

      if (productData.variants && Array.isArray(productData.variants)) {
        const parsedVariants = productData.variants.map(v => {
          let combo = v.combination;
          if (combo && typeof combo === 'object' && combo.value) {
            try { combo = typeof combo.value === 'string' ? JSON.parse(combo.value) : combo.value; } catch { combo = {}; }
          } else if (typeof combo === 'string') {
            try { combo = JSON.parse(combo); } catch { combo = {}; }
          }

          let vImages = v.imageUrls;
          if (vImages && typeof vImages === 'object' && vImages.value) {
            try { vImages = typeof vImages.value === 'string' ? JSON.parse(vImages.value) : vImages.value; } catch { vImages = []; }
          }

          return { ...v, combination: combo, imageUrls: vImages };
        });
        setVariants(parsedVariants);
      }
      
      let loadedImages = productData.image_urls || productData.imageUrls || productData.generalImages || [];
      if (loadedImages && typeof loadedImages === 'object' && loadedImages.value) {
        try { loadedImages = typeof loadedImages.value === 'string' ? JSON.parse(loadedImages.value) : loadedImages.value; } catch { loadedImages = []; }
      }
      if (Array.isArray(loadedImages) && loadedImages.length > 0) {
        setMedia(m => ({ ...m, generalImages: loadedImages }));
      }

      setSeo(s => ({
        ...s,
        slug: productData.slug || productData.seo_slug || s.slug
      }));

      setPricing(p => ({
        ...p,
        price: productData.price ?? productData.base_price ?? p.price,
        availableUnits: productData.availableUnits ?? productData.stock ?? p.availableUnits
      }));
    }
  }, [productData]);

  /* Backend File Upload Handler */
  const handleFileSelection = async (e, targetGroupKey = 'general') => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const folderPath = `products/${basic.sku || 'general'}/${targetGroupKey}`;
      formData.append('folder', folderPath);

      const response = await httpService.post('/api/files/upload', formData);
      const data = response.data;
      if (!data.success || !data.urls) throw new Error(data.error || 'Server upload failed');

      const uploadedUrls = data.urls;
      if (targetGroupKey === 'general') {
        setMedia(m => ({ ...m, generalImages: [...m.generalImages, ...uploadedUrls] }));
      } else {
        setMedia(m => ({
          ...m,
          variantImages: {
            ...m.variantImages,
            [targetGroupKey]: [...(m.variantImages[targetGroupKey] || []), ...uploadedUrls]
          }
        }));
      }
    } catch (err) {
      setErrorMessage(`Image upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const generateVariantMatrix = () => {
    const variantSpecs = specs.filter(s => s.isVariant && s.key && (Array.isArray(s.value) ? s.value.length > 0 : s.value));
    if (variantSpecs.length === 0) {
      setVariants([]);
      return;
    }

    const keys = variantSpecs.map(s => s.key);
    const valueSets = variantSpecs.map(s => {
      if (Array.isArray(s.value)) return s.value;
      return String(s.value).split(',').map(v => v.trim()).filter(Boolean);
    });

    const cartesian = (arrs) => arrs.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);
    const combinations = cartesian(valueSets);

    const generated = combinations.map((combo, idx) => {
      const combinationMap = {};
      keys.forEach((k, i) => { combinationMap[k] = combo[i]; });
      
      const existingVariant = variants.find(v => {
        const vCombo = typeof v.combination === 'string' ? JSON.parse(v.combination) : v.combination;
        return keys.every(k => vCombo?.[k] === combinationMap[k]);
      });

      return {
        id: existingVariant?.id || idx + 1,
        combination: combinationMap,
        price: existingVariant?.price || existingVariant?.wholesale_price || pricing.price || '',
        stock: existingVariant?.stock || existingVariant?.stock_quantity || '',
        sku: existingVariant?.sku || `${basic.sku || 'PROD'}-${Object.values(combinationMap).join('-').toUpperCase().replace(/\s+/g, '')}`
      };
    });

    setVariants(generated);
  };

  const handleCategoryChange = (selectedCategoryName) => {
    setBasic(b => ({ ...b, category: selectedCategoryName }));
    if (errorMessage && selectedCategoryName) setErrorMessage('');
    
    const foundCat = categoriesList.find(c => {
      const cName = (typeof c === 'string' ? c : (c.name || c.categoryName || c.id || '')).toLowerCase();
      return cName === selectedCategoryName.toLowerCase();
    });

    if (foundCat && typeof foundCat === 'object' && Array.isArray(foundCat.specDefinitions) && !isEdit) {
      const dynamicSpecs = foundCat.specDefinitions.map((def, idx) => ({
        id: idx + 1,
        key: def.label || def.key,
        type: def.type || 'text',
        options: def.options || [],
        isVariant: def.isVariant || false,
        isRequired: def.isRequired || false,
        value: def.type === 'multiselect' || def.type === 'checkbox_group' ? [] : ''
      }));
      setSpecs(dynamicSpecs.length > 0 ? dynamicSpecs : [{ key: 'Model', value: '', type: 'text', options: [], isVariant: false, id: 1 }]);
    }
  };

  useEffect(() => {
    if (!isEdit && basic.name && !seo.slug) {
      setSeo(s => ({ ...s, slug: basic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    }
  }, [basic.name, isEdit]);

  const buildProduct = () => ({
    ...(isEdit && productData?.id ? { id: productData.id } : {}),
    ...basic,
    title: basic.name,
    tags: basic.tagsInput ? basic.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
    specs: Object.fromEntries(specs.filter(s => s.key).map(s => [s.key, s.value])),
    specifications: Object.fromEntries(specs.filter(s => s.key).map(s => [s.key, s.value])),
    variants: variants.map(v => {
      const variantKey = Object.values(v.combination).join('-');
      return {
        ...v,
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
        imageUrls: media.variantImages[variantKey] || v.imageUrls || []
      };
    }),
    features: specs.filter(s => s.key && s.value).map(s => `${s.key}: ${Array.isArray(s.value) ? s.value.join(', ') : s.value}`),
    ...pricing, 
    price: Number(pricing.price) || 0,
    image_urls: media.generalImages,
    imageUrls: media.generalImages,
    videoUrl: media.videoUrl, 
    ...seo, 
    seo_slug: seo.slug,
    ...quickInfo, 
    categorySlug: (basic.category || '').toLowerCase(),
  });

  const validateStep1 = () => {
    if (!basic.name.trim()) { setErrorMessage('Please fill Product Name'); return false; }
    if (!basic.brand.trim()) { setErrorMessage('Please fill Brand'); return false; }
    if (!basic.modelNumber.trim()) { setErrorMessage('Please fill Model Number'); return false; }
    if (!basic.category.trim()) { setErrorMessage('Please fill Category'); return false; }
    if (!basic.shortDescription.trim()) { setErrorMessage('Please fill Short Description'); return false; }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    const hasValidSpec = specs.some(s => s.key.trim() && (Array.isArray(s.value) ? s.value.length > 0 : String(s.value).trim()));
    if (!hasValidSpec) {
      setErrorMessage('Please add at least one specification with a name and value.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep3 = () => {
    if (variants.length > 0) {
      const hasValidVariantPrice = variants.some(v => v.price !== '' && Number(v.price) >= 0);
      if (!hasValidVariantPrice) {
        setErrorMessage('Please enter a valid price for at least one item in the pricing matrix.');
        return false;
      }
    } else {
      if (!pricing.price || Number(pricing.price) <= 0) {
        setErrorMessage('Please enter a base price for the product.');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const changeStep = (newStep) => {
    if (step === 1 && newStep > step && !validateStep1()) return;
    if (step === 2 && newStep > step) {
      if (!validateStep2()) return;
      generateVariantMatrix();
    }
    if (step === 3 && newStep > step && !validateStep3()) return;
    if (newStep < 1 || newStep > STEPS.length) return;
    setStep(newStep);
  };

  const handleSave = async (asDraft = false) => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;
    try {
      const productPayload = { ...buildProduct(), status: asDraft ? 'Draft' : quickInfo.status };
      await httpService.post('/base/saveProduct', productPayload);

      setSaved(true);
      setToastMessage({ type: 'success', text: isEdit ? 'Product updated successfully!' : 'Product created successfully!' });
      setTimeout(() => navigate('/admin/products'), 1200);
    } catch (err) {
      setErrorMessage(`Failed to save product: ${err.response?.data?.message || err.message}`);
    }
  };

  /* Styles matching requested theme (Warm Orange theme highlights, crisp clean cards, rounded inputs) */
  const primaryThemeColor = '#f97316'; // Orange accent theme
  const styles = {
    shell: { display: 'flex', height: '100vh', maxHeight: '100vh', minHeight: '100vh', overflow: 'hidden', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', color: isDarkMode ? '#f1f5f9' : '#1e293b' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, width: '100%' },
    content: { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '1.5rem', maxWidth: '1320px', width: '100%', margin: '0 auto', boxSizing: 'border-box' },
    card: { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '16px', padding: '1.75rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' },
    input: { width: '100%', minHeight: '44px', padding: '0.6rem 0.9rem', borderRadius: '10px', border: `1.5px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none', fontSize: '0.925rem', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: isDarkMode ? '#e2e8f0' : '#334155' },
    required: { color: '#ef4444', marginLeft: '0.2rem' },
    subText: { color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' },
    errorAlert: { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.85rem 1.15rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' },
    actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` },
    uploadBox: { border: `2px dashed ${isDarkMode ? '#475569' : '#cbd5e1'}`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', transition: 'background-color 0.2s' }
  };

  const renderSpecValueInput = (item, index) => {
    switch (item.type) {
      case 'select':
        return (
          <select style={styles.input} value={item.value || ''} onChange={e => { const copy = [...specs]; copy[index].value = e.target.value; setSpecs(copy); }}>
            <option value="">Select option</option>
            {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'multiselect':
      case 'checkbox_group':
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', minHeight: '44px', padding: '0.4rem 0.6rem', border: `1.5px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, borderRadius: '10px', background: isDarkMode ? '#0f172a' : '#fff' }}>
            {item.options.map(opt => {
              const selectedValues = Array.isArray(item.value) ? item.value : [];
              const isChecked = selectedValues.includes(opt);
              return (
                <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', marginRight: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" checked={isChecked} onChange={e => {
                    const copy = [...specs];
                    let currentVals = Array.isArray(copy[index].value) ? [...copy[index].value] : [];
                    if (e.target.checked) currentVals.push(opt);
                    else currentVals = currentVals.filter(v => v !== opt);
                    copy[index].value = currentVals;
                    setSpecs(copy);
                  }} />
                  {opt}
                </label>
              );
            })}
          </div>
        );
      default:
        return <input style={styles.input} placeholder="Value options" value={typeof item.value === 'string' ? item.value : Array.isArray(item.value) ? item.value.join(', ') : JSON.stringify(item.value || '')} onChange={e => { const copy = [...specs]; copy[index].value = e.target.value; setSpecs(copy); }} />;
    }
  };

  return (
    <div style={styles.shell}>
      {uploading && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '50px', height: '50px', border: `4px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, borderTop: `4px solid ${primaryThemeColor}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#ffffff', marginTop: '16px', fontWeight: 600, fontSize: '1rem' }}>Uploading files...</p>
        </div>
      )}

      {toastMessage && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10000, backgroundColor: '#10b981', color: '#ffffff', padding: '0.9rem 1.35rem', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
          <span>✨</span> {toastMessage.text}
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .stepper-container { display: flex; align-items: center; justify-content: space-between; width: 100%; overflow-x: auto; padding: 0.5rem 0; gap: 1rem; }
        .step-item { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; min-width: 80px; cursor: pointer; }
        .step-line { position: absolute; top: 19px; left: -50%; right: 50%; height: 3px; background-color: ${isDarkMode ? '#334155' : '#e2e8f0'}; z-index: 1; transition: background-color 0.3s; }
        .step-line.active { background-color: ${primaryThemeColor}; }
        .step-circle { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; z-index: 2; border: 2.5px solid ${isDarkMode ? '#475569' : '#cbd5e1'}; background-color: ${isDarkMode ? '#1e293b' : '#ffffff'}; color: ${isDarkMode ? '#94a3b8' : '#64748b'}; transition: all 0.2s; }
        .step-circle.active { background-color: ${primaryThemeColor}; border-color: ${primaryThemeColor}; color: #ffffff; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2); }
        .step-circle.completed { background-color: #10b981; border-color: #10b981; color: #ffffff; }
        .step-title { font-size: 0.8rem; font-weight: 700; margin-top: 0.5rem; text-align: center; color: ${isDarkMode ? '#e2e8f0' : '#334155'}; white-space: nowrap; }
        .step-desc { font-size: 0.725rem; color: ${isDarkMode ? '#94a3b8' : '#64748b'}; text-align: center; margin-top: 0.15rem; }
        .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 0.75rem; font-size: 0.9rem; }
        .matrix-table th, .matrix-table td { padding: 0.85rem; border-bottom: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}; text-align: left; }
        .matrix-table th { font-weight: 700; color: ${isDarkMode ? '#cbd5e1' : '#475569'}; background-color: ${isDarkMode ? '#0f172a' : '#f8fafc'}; }
        .matrix-table tr:last-child td { border-bottom: none; }
        .thumb-preview { width: 68px; height: 68px; object-fit: cover; border-radius: 10px; border: 1.5px solid ${isDarkMode ? '#475569' : '#cbd5e1'}; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
      `}</style>

      <Sidebar navItems={navItems} loading={navLoading} activePath={location.pathname} onNavigate={(path) => { if (path) navigate(path); }} />

      <div style={styles.main}>
        <AdminTopbar user={{ name: localStorage.getItem('userName') || 'Admin User', avatar: null }} notificationCount={6} messageCount={2} onSearch={() => {}} onLogout={() => { localStorage.clear(); navigate('/login'); }} />

        <div style={styles.content} className="no-scrollbar">
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <nav style={{ fontSize: '0.825rem', marginBottom: '0.35rem', fontWeight: 500 }}>
                <Link to="/admin" style={{ color: primaryThemeColor, textDecoration: 'none' }}>Dashboard</Link>
                <span style={{ margin: '0 0.4rem', color: styles.subText.color }}>›</span>
                <Link to="/admin/products" style={{ color: primaryThemeColor, textDecoration: 'none' }}>Products</Link>
                <span style={{ margin: '0 0.4rem', color: styles.subText.color }}>›</span>
                <span style={{ color: styles.subText.color }}>{isEdit ? 'Edit Product' : 'Add Product'}</span>
              </nav>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.025em' }}>{isEdit ? 'Edit Product Catalog' : 'Add New Product'}</h1>
            </div>
          </div>

          {/* Stepper Card */}
          <div style={styles.card}>
            <div className="stepper-container no-scrollbar">
              {STEPS.map((s, idx) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                return (
                  <div key={s.id} className="step-item" onClick={() => changeStep(s.id)}>
                    {idx !== 0 && <div className={`step-line ${step >= s.id ? 'active' : ''}`} />}
                    <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                      {isCompleted ? '✓' : s.id}
                    </div>
                    <span className="step-title" style={{ color: isActive ? primaryThemeColor : undefined }}>{s.title}</span>
                    <span className="step-desc">{s.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.card}>
            {errorMessage && <div style={styles.errorAlert}><span>⚠️</span> {errorMessage}</div>}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}` }}>Basic Information</h2>
                <div style={styles.grid}>
                  <div>
                    <label style={styles.label}>Product Name <span style={styles.required}>*</span></label>
                    <input style={styles.input} placeholder="Enter product name" value={basic.name} onChange={e => { setBasic(b => ({ ...b, name: e.target.value })); if (errorMessage) setErrorMessage(''); }} />
                  </div>
                  <div>
                    <label style={styles.label}>Product ID (SKU)</label>
                    <input style={styles.input} placeholder="e.g. LAP-DEL-5450" value={basic.sku} onChange={e => setBasic(b => ({ ...b, sku: e.target.value }))} />
                  </div>
                </div>

                <div style={styles.grid}>
                  <div>
  <label style={styles.label}>Brand <span style={styles.required}>*</span></label>
  <select 
    style={styles.input} 
    value={basic.brand} 
    onChange={e => { 
      setBasic(b => ({ ...b, brand: e.target.value })); 
      if (errorMessage) setErrorMessage(''); 
    }}
  >
    <option value="">Select brand</option>
    {brands.map((b, index) => {
      // Handles both object structures or fallback to plain string
      const brandValue = typeof b === 'object' && b !== null ? (b.name || b.brandName || b.id) : b;
      const brandKey = typeof b === 'object' && b !== null ? (b.id || b.name || index) : b;
      
      return (
        <option key={brandKey} value={brandValue}>
          {brandValue}
        </option>
      );
    })}
  </select>
</div>
                  <div>
                    <label style={styles.label}>Model Number <span style={styles.required}>*</span></label>
                    <input style={styles.input} placeholder="Enter model number" value={basic.modelNumber} onChange={e => { setBasic(b => ({ ...b, modelNumber: e.target.value })); if (errorMessage) setErrorMessage(''); }} />
                  </div>
                </div>

                <div style={styles.grid}>
                  <div>
                    <label style={styles.label}>Category <span style={styles.required}>*</span></label>
                    <select style={styles.input} value={basic.category} onChange={e => handleCategoryChange(e.target.value)}>
                      <option value="">Select category</option>
                      {categoriesList.map((c, idx) => {
                        const catVal = typeof c === 'string' ? c : (c.id || c.name || c.categoryName);
                        const catLabel = typeof c === 'string' ? c : (c.name || c.categoryName || c.id);
                        return <option key={c.id || idx} value={catVal}>{catLabel}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Sub Category</label>
                    <input style={styles.input} placeholder="Sub-category name" value={basic.subCategory} onChange={e => setBasic(b => ({ ...b, subCategory: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={styles.label}>Short Description <span style={styles.required}>*</span></label>
                  <textarea rows={3} style={{ ...styles.input, resize: 'vertical' }} placeholder="Enter short description" maxLength={150} value={basic.shortDescription} onChange={e => { setBasic(b => ({ ...b, shortDescription: e.target.value })); if (errorMessage) setErrorMessage(''); }} />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={styles.label}>Detailed Description</label>
                  <textarea rows={4} style={{ ...styles.input, resize: 'vertical' }} placeholder="Enter comprehensive product features..." value={basic.detailedDescription} onChange={e => setBasic(b => ({ ...b, detailedDescription: e.target.value }))} />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={styles.label}>Tags</label>
                  <input style={styles.input} placeholder="e.g. gaming, lightweight (comma separated)" value={basic.tagsInput} onChange={e => setBasic(b => ({ ...b, tagsInput: e.target.value }))} />
                </div>
              </>
            )}

            {/* Step 2: Specifications */}
            {step === 2 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}` }}>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Specifications <span style={styles.required}>*</span></h2>
                    <p style={{ ...styles.subText, margin: 0 }}>At least one specification is required.</p>
                  </div>
                  <button type="button" onClick={() => setSpecs(prev => [...prev, { id: Math.random(), key: '', value: '', type: 'text', options: [], isVariant: false }])} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '10px', border: 'none', backgroundColor: primaryThemeColor, color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)' }}>
                    + Add Field
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {specs.map((item, index) => (
                    <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}>
                      <input style={{ ...styles.input, flex: 1 }} placeholder="Specification Name" value={item.key} onChange={e => { const copy = [...specs]; copy[index].key = e.target.value; setSpecs(copy); if (errorMessage) setErrorMessage(''); }} />
                      
                      <div style={{ flex: 1.5 }}>
                        {renderSpecValueInput(item, index)}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: primaryThemeColor }} checked={item.isVariant} onChange={e => { const copy = [...specs]; copy[index].isVariant = e.target.checked; setSpecs(copy); }} />
                        <span>Variant</span>
                      </div>

                      <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Pricing & Inventory Matrix */}
            {step === 3 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}` }}>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Pricing & Inventory Matrix <span style={styles.required}>*</span></h2>
                    <p style={{ ...styles.subText, margin: 0 }}>Set pricing for variants or base configurations.</p>
                  </div>
                  <button type="button" onClick={generateVariantMatrix} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 600, borderRadius: '8px', border: `1.5px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, background: 'transparent', color: isDarkMode ? '#f8fafc' : '#0f172a', cursor: 'pointer' }}>
                    Regenerate Matrix
                  </button>
                </div>

                {variants.length > 0 ? (
                  <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}>
                    <table className="matrix-table">
                      <thead>
                        <tr>
                          {(() => {
                            const firstCombo = typeof variants[0].combination === 'string' ? JSON.parse(variants[0].combination) : variants[0].combination;
                            return Object.keys(firstCombo || {}).map(k => <th key={k}>{k.toUpperCase()}</th>);
                          })()}
                          <th>Variant SKU</th>
                          <th>Price ($) <span style={styles.required}>*</span></th>
                          <th>Stock Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v, vIndex) => {
                          const comboObj = typeof v.combination === 'string' ? JSON.parse(v.combination) : v.combination;
                          return (
                            <tr key={v.id || vIndex}>
                              {Object.entries(comboObj || {}).map(([k, val]) => (
                                <td key={k}><strong style={{ color: primaryThemeColor }}>{val}</strong></td>
                              ))}
                              <td>
                                <input style={{ ...styles.input, minHeight: '38px', padding: '0.4rem 0.75rem' }} value={v.sku || ''} onChange={e => {
                                  const copy = [...variants];
                                  copy[vIndex].sku = e.target.value;
                                  setVariants(copy);
                                }} />
                              </td>
                              <td>
                                <input type="number" style={{ ...styles.input, minHeight: '38px', padding: '0.4rem 0.75rem' }} placeholder="0.00" value={v.price ?? v.wholesale_price ?? ''} onChange={e => {
                                  const copy = [...variants];
                                  copy[vIndex].price = e.target.value;
                                  setVariants(copy);
                                  if (errorMessage) setErrorMessage('');
                                }} />
                              </td>
                              <td>
                                <input type="number" style={{ ...styles.input, minHeight: '38px', padding: '0.4rem 0.75rem' }} placeholder="Qty" value={v.stock ?? v.stock_quantity ?? ''} onChange={e => {
                                  const copy = [...variants];
                                  copy[vIndex].stock = e.target.value;
                                  setVariants(copy);
                                }} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ maxWidth: '420px', margin: '1.5rem auto', padding: '1.5rem', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}>
                    <label style={styles.label}>Base Price ($) <span style={styles.required}>*</span></label>
                    <input type="number" style={styles.input} placeholder="0.00" value={pricing.price} onChange={e => { setPricing(p => ({ ...p, price: e.target.value })); if (errorMessage) setErrorMessage(''); }} />
                    <p style={styles.subText}>No variant fields were checked in Step 2, so this flat price will apply.</p>
                  </div>
                )}
              </>
            )}

            {/* Step 4: Media & File Groups */}
            {step === 4 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Media & File Groups</h2>
                <p style={{ ...styles.subText, marginBottom: '1.5rem' }}>Upload files securely through your Spring Boot backend controller.</p>

                <div style={{ marginBottom: '1.75rem', padding: '1.25rem', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
                  <label style={styles.label}>General Product Images</label>
                  <div style={styles.uploadBox} onClick={() => document.getElementById('general-file-input').click()}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.925rem', color: isDarkMode ? '#cbd5e1' : '#334155' }}>📁 Click to upload general images</p>
                    <input id="general-file-input" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelection(e, 'general')} />
                  </div>

                  {media.generalImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      {media.generalImages.map((url, imgIdx) => (
                        <div key={imgIdx} style={{ position: 'relative' }}>
                          <img src={url} alt="General product" className="thumb-preview" />
                          <button type="button" onClick={() => {
                            const updated = media.generalImages.filter((_, i) => i !== imgIdx);
                            setMedia(m => ({ ...m, generalImages: updated }));
                          }} style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {variants.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Variant-Specific Images</h3>
                    {variants.map(v => {
                      const comboObj = typeof v.combination === 'string' ? JSON.parse(v.combination) : v.combination;
                      const variantKey = Object.values(comboObj || {}).join('-');
                      const groupImages = media.variantImages[variantKey] || v.imageUrls || [];
                      return (
                        <div key={v.id || variantKey} style={{ padding: '1rem', marginBottom: '0.85rem', border: `1.5px dashed ${isDarkMode ? '#475569' : '#cbd5e1'}`, borderRadius: '12px', backgroundColor: isDarkMode ? '#0f172a' : '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Variant: <strong style={{ color: primaryThemeColor }}>{variantKey}</strong></span>
                            <label style={{ padding: '0.35rem 0.75rem', background: primaryThemeColor, color: '#fff', fontSize: '0.8rem', fontWeight: 600, borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(249, 115, 22, 0.25)' }}>
                              Upload Images
                              <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelection(e, variantKey)} />
                            </label>
                          </div>
                          {groupImages.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {groupImages.map((u, uIdx) => (
                                <img key={uIdx} src={u} alt="Variant thumbnail" className="thumb-preview" style={{ width: '52px', height: '52px' }} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Step 5: SEO */}
            {step === 5 && (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}` }}>SEO Settings</h2>
                <div>
                  <label style={styles.label}>SEO Slug</label>
                  <input style={styles.input} placeholder="product-slug" value={seo.slug} onChange={e => setSeo(s => ({ ...s, slug: e.target.value }))} />
                </div>
              </>
            )}

            {/* Bottom Actions */}
            <div style={styles.actions}>
              <button type="button" onClick={() => { if (errorMessage) setErrorMessage(''); changeStep(step - 1); }} disabled={step === 1} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: `1.5px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`, backgroundColor: 'transparent', color: isDarkMode ? '#f8fafc' : '#334155', fontWeight: 600, cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.4 : 1 }}>
                Previous
              </button>

              <div>
                {step < STEPS.length ? (
                  <button type="button" onClick={() => changeStep(step + 1)} style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', backgroundColor: primaryThemeColor, color: '#ffffff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)' }}>
                    Next Step
                  </button>
                ) : (
                  <button type="button" onClick={() => handleSave(false)} style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                    {saved ? 'Saved!' : isEdit ? 'Update Product' : 'Save Product'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}