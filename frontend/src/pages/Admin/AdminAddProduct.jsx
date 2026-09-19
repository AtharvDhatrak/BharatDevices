import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import AdminTopbar from '../../pages/Admin/AdminTopbar';
import httpService from '../../services/httpService';
import { useTheme } from '../../components/ThemeContext';

/* ─── Constants ─── */
const BRANDS = ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Logitech', 'Samsung', 'LG'];

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

  /* Fetch sidebar nav items and categories using httpService */
  useEffect(() => {
    let mounted = true;
    const fetchMetadata = async () => {
      try {
        const role = (localStorage.getItem('userRole') || 'ADMIN').toUpperCase();
        const [menuRes, catRes] = await Promise.allSettled([
          httpService.get('/base/menus', { params: { role } }),
          httpService.get('/base/getCategories').catch(() => httpService.get('/getCategories'))
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

  /* Styles */
  const styles = {
    shell: { display: 'flex', height: '100vh', maxHeight: '100vh', minHeight: '100vh', overflow: 'hidden', backgroundColor: isDarkMode ? '#0b1329' : '#f8fafc', color: isDarkMode ? '#f1f5f9' : '#0f172a' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, width: '100%' },
    content: { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '0.75rem', maxWidth: '1280px', width: '100%', margin: '0 auto', boxSizing: 'border-box' },
    card: { backgroundColor: isDarkMode ? '#131f37' : '#ffffff', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`, borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' },
    input: { width: '100%', minHeight: '40px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: isDarkMode ? '#cbd5e1' : '#334155' },
    required: { color: '#ef4444', marginLeft: '0.2rem' },
    subText: { color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.775rem', marginTop: '0.25rem' },
    errorAlert: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500 },
    actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}` },
    uploadBox: { border: `2px dashed ${isDarkMode ? '#334155' : '#cbd5e1'}`, borderRadius: '8px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', minHeight: '40px', padding: '0.3rem', border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`, borderRadius: '8px', background: isDarkMode ? '#0f172a' : '#fff' }}>
            {item.options.map(opt => {
              const selectedValues = Array.isArray(item.value) ? item.value : [];
              const isChecked = selectedValues.includes(opt);
              return (
                <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', marginRight: '0.4rem', cursor: 'pointer' }}>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#ffffff', marginTop: '12px', fontWeight: 600, fontSize: '0.95rem' }}>Uploading files...</p>
        </div>
      )}

      {toastMessage && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10000, backgroundColor: '#10b981', color: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✨</span> {toastMessage.text}
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .stepper-container { display: flex; align-items: center; justify-content: space-between; width: 100%; overflow-x: auto; padding: 0.25rem 0; gap: 0.5rem; }
        .step-item { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; min-width: 60px; cursor: pointer; }
        .step-line { position: absolute; top: 17px; left: -50%; right: 50%; height: 2px; background-color: ${isDarkMode ? '#1e293b' : '#e2e8f0'}; z-index: 1; }
        .step-line.active { background-color: #2563eb; }
        .step-circle { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.85rem; z-index: 2; border: 2px solid ${isDarkMode ? '#334155' : '#cbd5e1'}; background-color: ${isDarkMode ? '#0f172a' : '#ffffff'}; color: ${isDarkMode ? '#94a3b8' : '#64748b'}; }
        .step-circle.active { background-color: #2563eb; border-color: #2563eb; color: #ffffff; }
        .step-circle.completed { background-color: #10b981; border-color: #10b981; color: #ffffff; }
        .step-title { font-size: 0.75rem; font-weight: 600; margin-top: 0.35rem; text-align: center; color: ${isDarkMode ? '#cbd5e1' : '#334155'}; white-space: nowrap; }
        .step-desc { font-size: 0.7rem; color: ${isDarkMode ? '#64748b' : '#94a3b8'}; text-align: center; margin-top: 0.1rem; }
        .matrix-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.875rem; }
        .matrix-table th, .matrix-table td { padding: 0.65rem; border-bottom: 1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}; text-align: left; }
        .matrix-table th { font-weight: 600; color: ${isDarkMode ? '#94a3b8' : '#64748b'}; background-color: ${isDarkMode ? '#0f172a' : '#f8fafc'}; }
        .thumb-preview { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}; }
      `}</style>

      <Sidebar navItems={navItems} loading={navLoading} activePath={location.pathname} onNavigate={(path) => { if (path) navigate(path); }} />

      <div style={styles.main}>
        <AdminTopbar user={{ name: localStorage.getItem('userName') || 'Admin User', avatar: null }} notificationCount={6} messageCount={2} onSearch={() => {}} onLogout={() => { localStorage.clear(); navigate('/login'); }} />

        <div style={styles.content} className="no-scrollbar">
          <div style={{ marginBottom: '1rem' }}>
            <nav style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              <Link to="/admin" style={{ color: isDarkMode ? '#60a5fa' : '#2563eb', textDecoration: 'none' }}>Dashboard</Link>
              <span style={{ margin: '0 0.4rem', color: styles.subText.color }}>›</span>
              <Link to="/admin/products" style={{ color: isDarkMode ? '#60a5fa' : '#2563eb', textDecoration: 'none' }}>Products</Link>
              <span style={{ margin: '0 0.4rem', color: styles.subText.color }}>›</span>
              <span style={{ color: styles.subText.color }}>{isEdit ? 'Edit' : 'Add'}</span>
            </nav>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          </div>

          {/* Stepper */}
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
                    <span className="step-title" style={{ color: isActive ? (isDarkMode ? '#60a5fa' : '#2563eb') : undefined }}>{s.title}</span>
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
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Basic Information</h2>
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
                    <select style={styles.input} value={basic.brand} onChange={e => { setBasic(b => ({ ...b, brand: e.target.value })); if (errorMessage) setErrorMessage(''); }}>
                      <option value="">Select brand</option>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
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

                <div style={{ marginBottom: '1rem' }}>
                  <label style={styles.label}>Short Description <span style={styles.required}>*</span></label>
                  <textarea rows={3} style={{ ...styles.input, resize: 'vertical' }} placeholder="Enter short description" maxLength={150} value={basic.shortDescription} onChange={e => { setBasic(b => ({ ...b, shortDescription: e.target.value })); if (errorMessage) setErrorMessage(''); }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={styles.label}>Detailed Description</label>
                  <textarea rows={4} style={{ ...styles.input, resize: 'vertical' }} placeholder="Enter comprehensive product features..." value={basic.detailedDescription} onChange={e => setBasic(b => ({ ...b, detailedDescription: e.target.value }))} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={styles.label}>Tags</label>
                  <input style={styles.input} placeholder="e.g. gaming, lightweight (comma separated)" value={basic.tagsInput} onChange={e => setBasic(b => ({ ...b, tagsInput: e.target.value }))} />
                </div>
              </>
            )}

            {/* Step 2: Specifications */}
            {step === 2 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Specifications <span style={styles.required}>*</span></h2>
                    <p style={{ ...styles.subText, margin: 0 }}>At least one specification is required.</p>
                  </div>
                  <button type="button" onClick={() => setSpecs(prev => [...prev, { id: Math.random(), key: '', value: '', type: 'text', options: [], isVariant: false }])} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}>
                    + Add Field
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {specs.map((item, index) => (
                    <div key={item.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input style={{ ...styles.input, flex: 1 }} placeholder="Specification Name" value={item.key} onChange={e => { const copy = [...specs]; copy[index].key = e.target.value; setSpecs(copy); if (errorMessage) setErrorMessage(''); }} />
                      
                      <div style={{ flex: 1.5 }}>
                        {renderSpecValueInput(item, index)}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                        <input type="checkbox" checked={item.isVariant} onChange={e => { const copy = [...specs]; copy[index].isVariant = e.target.checked; setSpecs(copy); }} />
                        <span>Variant</span>
                      </div>

                      <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', fontWeight: 'bold' }}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Pricing & Inventory Matrix */}
            {step === 3 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Pricing & Inventory Matrix <span style={styles.required}>*</span></h2>
                    <p style={{ ...styles.subText, margin: 0 }}>Set pricing for variants or base configurations.</p>
                  </div>
                  <button type="button" onClick={generateVariantMatrix} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`, background: 'transparent', color: isDarkMode ? '#f8fafc' : '#0f172a', cursor: 'pointer' }}>
                    Regenerate Matrix
                  </button>
                </div>

                {variants.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
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
                                <td key={k}><strong>{val}</strong></td>
                              ))}
                              <td>
                                <input style={{ ...styles.input, minHeight: '34px' }} value={v.sku || ''} onChange={e => {
                                  const copy = [...variants];
                                  copy[vIndex].sku = e.target.value;
                                  setVariants(copy);
                                }} />
                              </td>
                              <td>
                                <input type="number" style={{ ...styles.input, minHeight: '34px' }} placeholder="0.00" value={v.price ?? v.wholesale_price ?? ''} onChange={e => {
                                  const copy = [...variants];
                                  copy[vIndex].price = e.target.value;
                                  setVariants(copy);
                                  if (errorMessage) setErrorMessage('');
                                }} />
                              </td>
                              <td>
                                <input type="number" style={{ ...styles.input, minHeight: '34px' }} placeholder="Qty" value={v.stock ?? v.stock_quantity ?? ''} onChange={e => {
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
                  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
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
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Media & File Groups</h2>
                <p style={{ ...styles.subText, marginBottom: '1.25rem' }}>Upload files securely through your Spring Boot backend controller.</p>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`, borderRadius: '8px' }}>
                  <label style={styles.label}>General Product Images</label>
                  <div style={styles.uploadBox} onClick={() => document.getElementById('general-file-input').click()}>
                    <p style={{ margin: 0, fontWeight: 500 }}>📂 Click to upload general images</p>
                    <input id="general-file-input" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelection(e, 'general')} />
                  </div>

                  {media.generalImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {media.generalImages.map((url, imgIdx) => (
                        <div key={imgIdx} style={{ position: 'relative' }}>
                          <img src={url} alt="General product" className="thumb-preview" />
                          <button type="button" onClick={() => {
                            const updated = media.generalImages.filter((_, i) => i !== imgIdx);
                            setMedia(m => ({ ...m, generalImages: updated }));
                          }} style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {variants.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Variant-Specific Images</h3>
                    {variants.map(v => {
                      const comboObj = typeof v.combination === 'string' ? JSON.parse(v.combination) : v.combination;
                      const variantKey = Object.values(comboObj || {}).join('-');
                      const groupImages = media.variantImages[variantKey] || v.imageUrls || [];
                      return (
                        <div key={v.id || variantKey} style={{ padding: '0.75rem', marginBottom: '0.75rem', border: `1px dashed ${isDarkMode ? '#334155' : '#cbd5e1'}`, borderRadius: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Variant: <strong>{variantKey}</strong></span>
                            <label style={{ padding: '0.25rem 0.5rem', background: '#2563eb', color: '#fff', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                              Upload Images
                              <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelection(e, variantKey)} />
                            </label>
                          </div>
                          {groupImages.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {groupImages.map((u, uIdx) => (
                                <img key={uIdx} src={u} alt="Variant thumbnail" className="thumb-preview" style={{ width: '45px', height: '45px' }} />
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
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>SEO Settings</h2>
                <div>
                  <label style={styles.label}>SEO Slug</label>
                  <input style={styles.input} placeholder="product-slug" value={seo.slug} onChange={e => setSeo(s => ({ ...s, slug: e.target.value }))} />
                </div>
              </>
            )}

            {/* Bottom Actions */}
            <div style={styles.actions}>
              <button type="button" onClick={() => { if (errorMessage) setErrorMessage(''); changeStep(step - 1); }} disabled={step === 1} style={{ padding: '0.6rem 1.0rem', borderRadius: '8px', border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: 'transparent', color: isDarkMode ? '#f8fafc' : '#334155', cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.4 : 1 }}>
                Previous
              </button>

              <div>
                {step < STEPS.length ? (
                  <button type="button" onClick={() => changeStep(step + 1)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>
                    Next
                  </button>
                ) : (
                  <button type="button" onClick={() => handleSave(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>
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