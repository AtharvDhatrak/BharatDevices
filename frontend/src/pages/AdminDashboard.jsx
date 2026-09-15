import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockAdminStats, mockEnquiries } from '../data/mockData';
import { productStore } from '../data/productStore';

/* ── Icons ── */
const Icon = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  products:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  categories:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  enquiries: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  users:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  logout:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  edit:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  search:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: Icon.dashboard },
  { id: 'products',   label: 'Products',   icon: Icon.products },
  { id: 'categories', label: 'Categories', icon: Icon.categories },
  { id: 'enquiries',  label: 'Enquiries',  icon: Icon.enquiries },
  { id: 'users',      label: 'Users',      icon: Icon.users },
  { id: 'settings',   label: 'Settings',   icon: Icon.settings },
];

const STATUS_COLORS = {
  New:       { bg: '#dbeafe', color: '#1d4ed8' },
  Contacted: { bg: '#fef9c3', color: '#a16207' },
  Quoted:    { bg: '#dcfce7', color: '#16a34a' },
};

const STAT_CARDS = [
  { label: 'Total Products',    key: 'totalProducts',   color: '#1d4ed8', bg: '#dbeafe', icon: Icon.products },
  { label: 'Total Categories',  key: 'totalCategories', color: '#7c3aed', bg: '#ede9fe', icon: Icon.categories },
  { label: 'Total Enquiries',   key: 'totalEnquiries',  color: '#d97706', bg: '#fef3c7', icon: Icon.enquiries },
  { label: 'New Enquiries',     key: 'newEnquiries',    color: '#16a34a', bg: '#dcfce7', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
];

/* ── Delete Confirm Modal ── */
function DeleteModal({ product, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </div>
        <h3 className="modal-title">Delete Product</h3>
        <p className="modal-desc">Are you sure you want to delete <strong>{product?.name}</strong>? This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn-delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Products List View ── */
function ProductsList({ onNavigate }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { setProducts(productStore.getAll()); }, []);

  const handleDelete = (product) => setDeleteTarget(product);
  const confirmDelete = () => {
    productStore.delete(deleteTarget.id);
    setProducts(productStore.getAll());
    setDeleteTarget(null);
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="plist-wrap">
      {/* Header */}
      <div className="plist-header">
        <div>
          <h2 className="plist-title">Products</h2>
          <p className="plist-sub">{products.length} total products</p>
        </div>
        <button className="plist-add-btn" onClick={() => navigate('/admin/products/add')}>
          {Icon.plus} Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="plist-toolbar">
        <div className="plist-search-wrap">
          {Icon.search}
          <input className="plist-search" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="plist-filters">
          {['All', 'Active', 'Draft', 'Inactive'].map(s => (
            <button key={s}
              className={`plist-filter-btn${filterStatus === s ? ' plist-filter-active' : ''}`}
              onClick={() => setFilterStatus(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="plist-table-wrap">
        <table className="plist-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="plist-row">
                <td className="plist-td plist-td-num">{i + 1}</td>
                <td className="plist-td plist-td-product">
                  <img
                    src={p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=100&q=60'}
                    alt={p.name}
                    className="plist-product-img"
                  />
                  <div>
                    <span className="plist-product-name">{p.name}</span>
                    <span className="plist-product-sku">{p.sku || '—'}</span>
                  </div>
                </td>
                <td className="plist-td">{p.brand || '—'}</td>
                <td className="plist-td">{p.category || '—'}</td>
                <td className="plist-td plist-td-price">
                  {p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : '—'}
                </td>
                <td className="plist-td">
                  <span className={`plist-status plist-status-${(p.status || 'active').toLowerCase()}`}>
                    <span className="plist-status-dot" />
                    {p.status || 'Active'}
                  </span>
                </td>
                <td className="plist-td plist-td-actions">
                  <button className="plist-action-btn plist-edit-btn"
                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    title="Edit">
                    {Icon.edit} Edit
                  </button>
                  <button className="plist-action-btn plist-delete-btn"
                    onClick={() => handleDelete(p)}
                    title="Delete">
                    {Icon.trash} Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="plist-empty">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

/* ── Dashboard Home View ── */
function DashboardHome({ onNavigate }) {
  const navigate = useNavigate();
  const [products] = useState(() => productStore.getAll());

  return (
    <>
      <div className="stats-grid">
        {STAT_CARDS.map(card => (
          <div key={card.key} className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">{card.label}</span>
              <div className="stat-icon-wrap" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
            </div>
            <span className="stat-value">{mockAdminStats[card.key]}</span>
            <button className="stat-view-all" onClick={() => card.key.includes('Product') ? onNavigate('products') : undefined}>
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="admin-bottom">
        <div className="enquiries-panel">
          <h2 className="panel-heading">Recent Enquiries</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Company</th><th>Product</th><th>Quantity</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {mockEnquiries.map(enq => {
                  const s = STATUS_COLORS[enq.status] || STATUS_COLORS.New;
                  return (
                    <tr key={enq.id} className="table-row">
                      <td className="td-id">{enq.id}</td>
                      <td className="td-cell">{enq.company}</td>
                      <td className="td-cell">{enq.product}</td>
                      <td className="td-cell td-center">{enq.quantity}</td>
                      <td className="td-cell">
                        <span className="status-badge" style={{ background: s.bg, color: s.color }}>{enq.status}</span>
                      </td>
                      <td className="td-cell td-date">{enq.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button className="view-all-link">View all enquiries &rarr;</button>
        </div>

        <div className="right-panel">
          <div className="quick-view-card">
            <div className="quick-view-header">
              <h3 className="qv-heading">Products (Quick View)</h3>
              <select className="qv-select"><option>All</option><option>Active</option></select>
            </div>
            <div className="qv-list">
              {products.slice(0, 4).map(p => (
                <div key={p.id} className="qv-item">
                  <img src={p.image || p.images?.[0]} alt={p.name} className="qv-img" />
                  <div className="qv-info">
                    <span className="qv-name">{p.name}</span>
                    <span className="qv-price">₹{Number(p.price || 0).toLocaleString('en-IN')} onwards</span>
                  </div>
                  <span className="qv-status">{p.status || 'Active'}</span>
                </div>
              ))}
            </div>
            <button className="view-all-link" onClick={() => onNavigate('products')}>View all products &rarr;</button>
          </div>

          <div className="quick-actions-card">
            <h3 className="qv-heading">Quick Actions</h3>
            <div className="qa-grid">
              {[
                { label: 'Add Product', action: () => navigate('/admin/products/add'), icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
                { label: 'Add Category', action: () => {}, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
                { label: 'View Enquiries', action: () => onNavigate('enquiries'), icon: Icon.enquiries },
                { label: 'Site Settings', action: () => onNavigate('settings'), icon: Icon.settings },
              ].map(qa => (
                <button key={qa.label} className="qa-btn" onClick={qa.action}>
                  <div className="qa-icon">{qa.icon}</div>
                  <span>{qa.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Main Admin Dashboard ── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveFromPath = () => {
    if (location.pathname.includes('/products')) return 'products';
    return 'dashboard';
  };

  const [activeNav, setActiveNav] = useState(getActiveFromPath);

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'products') navigate('/admin/products');
    else navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon">B</div>
          <div className="sidebar-brand-text">
            <span>BHARAT</span>
            <span style={{ color: '#60a5fa' }}>DEVICES</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-nav-item${activeNav === item.id ? ' sidebar-nav-active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={() => navigate('/')}>
          {Icon.logout} <span>Logout</span>
        </button>
      </aside>

      <div className="admin-main">
        {activeNav === 'dashboard' && <DashboardHome onNavigate={handleNav} />}
        {activeNav === 'products'  && <ProductsList onNavigate={handleNav} />}
        {activeNav === 'enquiries' && (
          <div style={{ color: '#94a3b8', padding: '2rem' }}>Enquiries view — coming soon</div>
        )}
        {activeNav === 'categories' && (
          <div style={{ color: '#94a3b8', padding: '2rem' }}>Categories view — coming soon</div>
        )}
        {activeNav === 'users' && (
          <div style={{ color: '#94a3b8', padding: '2rem' }}>Users view — coming soon</div>
        )}
        {activeNav === 'settings' && (
          <div style={{ color: '#94a3b8', padding: '2rem' }}>Settings view — coming soon</div>
        )}
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0f172a;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          color: #f1f5f9;
        }

        /* ── Sidebar ── */
        .admin-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: #1e293b;
          border-right: 1px solid #334155;
          display: flex;
          flex-direction: column;
          padding: 1.25rem 0;
          position: fixed;
          top: 0; bottom: 0; left: 0;
          z-index: 50;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0 1.25rem 1.5rem;
          border-bottom: 1px solid #334155;
          margin-bottom: 0.75rem;
        }

        .sidebar-logo-icon {
          width: 34px; height: 34px;
          background: #1d4ed8; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1rem; color: #fff; flex-shrink: 0;
        }

        .sidebar-brand-text {
          display: flex; flex-direction: column;
          font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.08em; line-height: 1.1;
        }

        .sidebar-nav {
          flex: 1;
          display: flex; flex-direction: column; gap: 0.15rem;
          padding: 0 0.75rem;
          overflow-y: auto;
        }

        .sidebar-nav-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.65rem 0.85rem; border-radius: 8px;
          border: none; background: transparent;
          color: #94a3b8; font-size: 0.875rem; font-weight: 500;
          cursor: pointer; text-align: left; width: 100%; font-family: inherit;
          transition: background 0.15s, color 0.15s;
        }

        .sidebar-nav-item:hover { background: #334155; color: #f1f5f9; }
        .sidebar-nav-active { background: #1d4ed8 !important; color: #fff !important; }
        .sidebar-nav-icon { flex-shrink: 0; display: flex; align-items: center; }

        .sidebar-logout {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.65rem 1.6rem;
          background: transparent; border: none; border-top: 1px solid #334155;
          color: #94a3b8; font-size: 0.875rem; font-weight: 500;
          cursor: pointer; margin-top: auto; font-family: inherit;
          transition: color 0.15s;
        }

        .sidebar-logout:hover { color: #ef4444; }

        /* ── Main ── */
        .admin-main {
          flex: 1; margin-left: 220px; padding: 1.75rem;
          display: flex; flex-direction: column; gap: 1.5rem; min-width: 0;
        }

        /* ── Stats ── */
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
        }

        .stat-card {
          background: #1e293b; border: 1px solid #334155;
          border-radius: 12px; padding: 1.25rem;
          display: flex; flex-direction: column; gap: 0.5rem;
        }

        .stat-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .stat-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; line-height: 1.3; }
        .stat-icon-wrap { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-value { font-size: 2rem; font-weight: 800; color: #f1f5f9; line-height: 1; }
        .stat-view-all { display: inline-flex; align-items: center; gap: 0.25rem; background: none; border: none; color: #60a5fa; font-size: 0.75rem; font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; }

        /* ── Bottom ── */
        .admin-bottom { display: grid; grid-template-columns: 1fr 300px; gap: 1.25rem; align-items: start; }

        .enquiries-panel {
          background: #1e293b; border: 1px solid #334155; border-radius: 12px;
          padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
        }

        .panel-heading { font-size: 1rem; font-weight: 700; color: #f1f5f9; }
        .table-wrap { overflow-x: auto; }

        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        .admin-table th {
          text-align: left; padding: 0.6rem 0.75rem;
          color: #64748b; font-weight: 600; font-size: 0.72rem;
          text-transform: uppercase; letter-spacing: 0.05em;
          border-bottom: 1px solid #334155;
        }

        .table-row:hover { background: rgba(255,255,255,0.03); }
        .td-id { padding: 0.75rem; color: #60a5fa; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
        .td-cell { padding: 0.75rem; color: #cbd5e1; font-size: 0.8rem; border-bottom: 1px solid #1e293b; }
        .td-center { text-align: center; }
        .td-date { color: #64748b; white-space: nowrap; }

        .status-badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
        .view-all-link { background: none; border: none; color: #60a5fa; font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 0; text-align: left; font-family: inherit; }

        .right-panel { display: flex; flex-direction: column; gap: 1.25rem; }
        .quick-view-card, .quick-actions-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; }
        .quick-view-header { display: flex; align-items: center; justify-content: space-between; }
        .qv-heading { font-size: 0.9rem; font-weight: 700; color: #f1f5f9; }
        .qv-select { background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #94a3b8; font-size: 0.75rem; padding: 0.2rem 0.4rem; font-family: inherit; cursor: pointer; }
        .qv-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .qv-item { display: flex; align-items: center; gap: 0.65rem; }
        .qv-img { width: 38px; height: 38px; border-radius: 6px; object-fit: cover; flex-shrink: 0; }
        .qv-info { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; }
        .qv-name { font-size: 0.75rem; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .qv-price { font-size: 0.68rem; color: #64748b; }
        .qv-status { background: #dcfce7; color: #16a34a; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 20px; flex-shrink: 0; }
        .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
        .qa-btn { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 0.85rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; cursor: pointer; transition: border-color 0.2s, background 0.2s; font-family: inherit; }
        .qa-btn:hover { border-color: #1d4ed8; background: #1e3a5f; }
        .qa-icon { width: 40px; height: 40px; background: #1e3a5f; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .qa-btn span { font-size: 0.7rem; color: #94a3b8; font-weight: 600; text-align: center; }

        /* ── Products List ── */
        .plist-wrap { display: flex; flex-direction: column; gap: 1.25rem; }
        .plist-header { display: flex; align-items: center; justify-content: space-between; }
        .plist-title { font-size: 1.4rem; font-weight: 800; color: #f1f5f9; }
        .plist-sub { font-size: 0.8rem; color: #64748b; margin-top: 0.15rem; }
        .plist-add-btn { display: flex; align-items: center; gap: 0.5rem; background: #1d4ed8; border: none; border-radius: 8px; padding: 0.65rem 1.25rem; color: #fff; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
        .plist-add-btn:hover { background: #1e40af; }

        .plist-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .plist-search-wrap { display: flex; align-items: center; gap: 0.5rem; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0.5rem 0.85rem; flex: 1; max-width: 320px; }
        .plist-search { background: transparent; border: none; outline: none; font-size: 0.875rem; color: #f1f5f9; font-family: inherit; width: 100%; }
        .plist-search::placeholder { color: #64748b; }
        .plist-filters { display: flex; gap: 0.35rem; }
        .plist-filter-btn { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 0.4rem 0.85rem; color: #94a3b8; font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .plist-filter-btn:hover { border-color: #1d4ed8; color: #60a5fa; }
        .plist-filter-active { background: #1d4ed8 !important; border-color: #1d4ed8 !important; color: #fff !important; }

        .plist-table-wrap { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; }
        .plist-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
        .plist-table th { text-align: left; padding: 0.75rem 1rem; color: #64748b; font-weight: 600; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #334155; background: #162032; }
        .plist-row { border-bottom: 1px solid #1e293b; transition: background 0.15s; }
        .plist-row:hover { background: rgba(255,255,255,0.03); }
        .plist-td { padding: 0.85rem 1rem; color: #cbd5e1; vertical-align: middle; }
        .plist-td-num { color: #64748b; font-size: 0.78rem; }
        .plist-td-product { display: flex; align-items: center; gap: 0.75rem; }
        .plist-product-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid #334155; }
        .plist-product-name { display: block; font-weight: 600; color: #f1f5f9; font-size: 0.83rem; }
        .plist-product-sku { display: block; font-size: 0.7rem; color: #64748b; margin-top: 0.1rem; }
        .plist-td-price { font-weight: 700; color: #f1f5f9; }
        .plist-td-actions { display: flex; gap: 0.5rem; }

        .plist-action-btn { display: inline-flex; align-items: center; gap: 0.35rem; border: none; border-radius: 6px; padding: 0.4rem 0.75rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .plist-edit-btn { background: #1e3a5f; color: #60a5fa; border: 1px solid #1e4080; }
        .plist-edit-btn:hover { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
        .plist-delete-btn { background: #2d1a1a; color: #f87171; border: 1px solid #4d2020; }
        .plist-delete-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .plist-status { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
        .plist-status-active { background: #dcfce7; color: #16a34a; }
        .plist-status-draft { background: #fef9c3; color: #a16207; }
        .plist-status-inactive { background: #f1f5f9; color: #64748b; }
        .plist-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .plist-empty { text-align: center; padding: 3rem; color: #64748b; }

        /* ── Delete Modal ── */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; }
        .modal-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 2rem; max-width: 380px; width: 90%; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .modal-icon-wrap { width: 56px; height: 56px; background: #2d1a1a; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .modal-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; }
        .modal-desc { font-size: 0.875rem; color: #94a3b8; text-align: center; line-height: 1.5; }
        .modal-desc strong { color: #f1f5f9; }
        .modal-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
        .modal-btn-cancel { background: #334155; border: none; border-radius: 8px; padding: 0.6rem 1.5rem; color: #f1f5f9; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: inherit; }
        .modal-btn-delete { background: #ef4444; border: none; border-radius: 8px; padding: 0.6rem 1.5rem; color: #fff; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: inherit; }
        .modal-btn-delete:hover { background: #dc2626; }

        @media (max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-bottom { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .admin-main { margin-left: 0; padding: 1rem; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
