import React, { useState, useEffect } from 'react';
import { useTheme } from '../../components/ThemeContext';
import httpService from '../../services/httpService';

const STATUS_COLORS = {
  New:        { bg: '#fef9c3', color: '#854d0e' },
  Reviewed:   { bg: '#dbeafe', color: '#1e40af' },
  Contacted:  { bg: '#dcfce7', color: '#166534' },
  Closed:     { bg: '#f1f5f9', color: '#475569' },
};

export default function AdminEnquiries() {
  const { isDarkMode } = useTheme();
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await httpService.get('/api/enquiry/all');
      setEnquiries(res.data || []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (enquiryId, status) => {
    try {
      await httpService.put(`/api/enquiry/${enquiryId}/status`, { status });
      const updated = enquiries.map(e => e.enquiryId === enquiryId ? { ...e, status } : e);
      setEnquiries(updated);
      if (selected?.enquiryId === enquiryId) setSelected({ ...selected, status });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const card  = isDarkMode ? '#0e1e38' : '#ffffff';
  const border= isDarkMode ? '#132a52' : '#e2e8f0';
  const text  = isDarkMode ? '#f8fafc'  : '#0f172a';
  const sub   = isDarkMode ? '#94a3b8'  : '#64748b';

  if (loading) {
    return (
      <div style={{ color: sub, textAlign: 'center', padding: '2rem' }}>Loading enquiries...</div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: text }}>Enquiries</h2>

      {enquiries.length === 0 ? (
        <div style={{ background: card, padding: '2rem', borderRadius: '10px', border: `1px solid ${border}`, color: sub, textAlign: 'center' }}>
          No enquiries yet.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* List */}
          <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {enquiries.map(enq => {
              const sc = STATUS_COLORS[enq.status] || STATUS_COLORS.New;
              const isActive = selected?.enquiryId === enq.enquiryId;
              return (
                <div
                  key={enq.enquiryId}
                  onClick={() => setSelected(enq)}
                  style={{
                    background: card,
                    border: `1.5px solid ${isActive ? '#F97316' : border}`,
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: text }}>{enq.enquiryId}</span>
                    <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: '999px', background: sc.bg, color: sc.color, fontWeight: 600 }}>
                      {enq.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: text, fontWeight: 500 }}>{enq.name} — {enq.company}</div>
                  <div style={{ fontSize: '0.8rem', color: sub, marginTop: '0.2rem' }}>
                    {enq.productName} · Qty {enq.quantity}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: sub, marginTop: '0.2rem' }}>
                    {new Date(enq.submittedAt).toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail */}
          {selected && (
            <div style={{ flex: '1 1 340px', background: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#F97316' }}>{selected.enquiryId}</div>
                  <div style={{ fontSize: '0.8rem', color: sub }}>{new Date(selected.submittedAt).toLocaleString('en-IN')}</div>
                </div>
                <select
                  value={selected.status}
                  onChange={e => updateStatus(selected.enquiryId, e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '4px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: card, color: text, cursor: 'pointer' }}
                >
                  {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <Section label="Product" isDark={isDarkMode}>
                <Row label="Product"  value={selected.productName} />
                <Row label="Category" value={selected.productCategory} />
                <Row label="Quantity" value={selected.quantity} />
              </Section>

              <Section label="Customer" isDark={isDarkMode}>
                <Row label="Name"     value={selected.name} />
                <Row label="Company"  value={selected.company} />
                <Row label="Email"    value={<a href={`mailto:${selected.email}`} style={{ color: '#F97316' }}>{selected.email}</a>} />
                <Row label="Phone"    value={<a href={`tel:${selected.phone}`} style={{ color: '#F97316' }}>{selected.phone}</a>} />
                <Row label="Delivery" value={selected.delivery} />
              </Section>

              {selected.message && (
                <Section label="Message" isDark={isDarkMode}>
                  <p style={{ fontSize: '0.88rem', color: isDarkMode ? '#cbd5e1' : '#374151', margin: 0, lineHeight: 1.6 }}>{selected.message}</p>
                </Section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ label, children, isDark }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F97316', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ background: isDark ? '#071328' : '#f8fafc', borderRadius: '8px', padding: '0.75rem 1rem' }}>{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.85rem' }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
