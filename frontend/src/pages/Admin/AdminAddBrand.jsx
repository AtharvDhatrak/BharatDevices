import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import httpService from '../../services/httpService';
import { useTheme } from '../../components/ThemeContext';

export default function AdminAddBrand() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const role = (localStorage.getItem('userRole') || 'ADMIN').toUpperCase();
    httpService.get('/base/menus', { params: { role } })
      .then(res => {
        if (mounted) {
          const data = res.data?.data || res.data || [];
          if (Array.isArray(data))
            setNavItems([...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setNavLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    if (!brandName.trim()) { setErrorMessage('Brand name is required.'); return; }
    setSaving(true);
    setErrorMessage('');
    try {
      await httpService.post('/base/saveBrand', { name: brandName.trim(), logoUrl, description });
      setSuccessMessage('Brand saved successfully!');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save brand.');
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    shell: { display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDarkMode ? '#0b1329' : '#f8fafc', color: isDarkMode ? '#f1f5f9' : '#0f172a' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    content: { flex: 1, overflowY: 'auto', padding: '1.25rem', maxWidth: '700px', width: '100%', margin: '0 auto', boxSizing: 'border-box' },
    card: { backgroundColor: isDarkMode ? '#131f37' : '#ffffff', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`, borderRadius: '12px', padding: '1.5rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: isDarkMode ? '#cbd5e1' : '#334155' },
    input: { width: '100%', minHeight: '42px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' },
    required: { color: '#ef4444', marginLeft: '0.2rem' },
  };

  return (
    <div style={styles.shell}>
      <Sidebar navItems={navItems} loading={navLoading} activePath="/admin/add-brand" onNavigate={p => { if (p) navigate(p); }} />
      <div style={styles.main}>
        <AdminTopbar user={{ name: localStorage.getItem('userName') || 'Admin User', avatar: null }} notificationCount={0} messageCount={0} onSearch={() => {}} onLogout={() => { localStorage.clear(); navigate('/login'); }} />
        <div style={styles.content}>
          <nav style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <Link to="/admin" style={{ color: '#F97316', textDecoration: 'none' }}>Dashboard</Link>
            <span style={{ margin: '0 0.4rem', color: '#94a3b8' }}>›</span>
            <span style={{ color: '#94a3b8' }}>Add Brand</span>
          </nav>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add Brand</h1>

          <div style={styles.card}>
            {errorMessage && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {successMessage}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.label}>Brand Name <span style={styles.required}>*</span></label>
              <input style={styles.input} placeholder="e.g. Dell, HP, Samsung" value={brandName} onChange={e => { setBrandName(e.target.value); setErrorMessage(''); }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.label}>Logo URL</label>
              <input style={styles.input} placeholder="https://example.com/logo.png" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
              {logoUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={logoUrl} alt="Brand logo preview" style={{ height: '48px', objectFit: 'contain', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '6px', padding: '4px' }} onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.label}>Description</label>
              <textarea rows={3} style={{ ...styles.input, resize: 'vertical' }} placeholder="Short description about this brand" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleSave} disabled={saving} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Brand'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
