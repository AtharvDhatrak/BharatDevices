import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import httpService from '../../services/httpService';
import { useTheme } from '../../components/ThemeContext';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Archive,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Building,
  Package,
  Calendar,
  Copy,
  Check,
  User,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Send,
  PhoneCall
} from 'lucide-react';

const STATUS_CONFIG = {
  New: {
    label: 'New',
    bgLight: '#fff7ed',
    borderLight: '#fed7aa',
    colorLight: '#c2410c',
    bgDark: 'rgba(249, 115, 22, 0.15)',
    borderDark: 'rgba(249, 115, 22, 0.35)',
    colorDark: '#fb923c',
    dot: '#f97316'
  },
  Reviewed: {
    label: 'Reviewed',
    bgLight: '#eff6ff',
    borderLight: '#bfdbfe',
    colorLight: '#1d4ed8',
    bgDark: 'rgba(59, 130, 246, 0.15)',
    borderDark: 'rgba(59, 130, 246, 0.35)',
    colorDark: '#60a5fa',
    dot: '#3b82f6'
  },
  Contacted: {
    label: 'Contacted',
    bgLight: '#f0fdf4',
    borderLight: '#bbf7d0',
    colorLight: '#15803d',
    bgDark: 'rgba(34, 197, 94, 0.15)',
    borderDark: 'rgba(34, 197, 94, 0.35)',
    colorDark: '#4ade80',
    dot: '#22c55e'
  },
  Closed: {
    label: 'Closed',
    bgLight: '#f8fafc',
    borderLight: '#e2e8f0',
    colorLight: '#475569',
    bgDark: 'rgba(148, 163, 184, 0.12)',
    borderDark: 'rgba(148, 163, 184, 0.25)',
    colorDark: '#94a3b8',
    dot: '#64748b'
  }
};

export default function AdminEnquiries() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Navigation & Screen Size States
  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Enquiry Data States
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState('');

  // Pagination for Left List
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Responsive breakpoints
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isPhone = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Fetch Navigation Menu
  useEffect(() => {
    let mounted = true;
    const fetchMenus = async () => {
      try {
        const role = (localStorage.getItem('userRole') || 'ADMIN').toUpperCase();
        const res = await httpService.get('/base/menus', { params: { role } });
        const data = res?.data?.data || [];
        if (mounted && Array.isArray(data)) {
          setNavItems([...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
      } catch {
        if (mounted) setNavItems([]);
      } finally {
        if (mounted) setNavLoading(false);
      }
    };
    fetchMenus();
    return () => { mounted = false; };
  }, []);

  // Fetch Enquiries List
  const fetchEnquiries = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await httpService.get('/api/enquiry/all');
      const data = Array.isArray(res.data) ? res.data : [];
      setEnquiries(data);
      if (data.length > 0 && !selected && !isPhone) {
        setSelected(data[0]);
      } else if (selected) {
        const updated = data.find(e => e.enquiryId === selected.enquiryId);
        if (updated) setSelected(updated);
      }
    } catch (err) {
      console.warn('Backend enquiry fetch fallback:', err.message);
      setEnquiries(prev => {
        if (prev.length > 0) return prev;
        const fallback = [
          {
            id: 1,
            enquiryId: 'BD-ENQ-128158',
            name: 'Vikramaditya Roy',
            company: 'Nexus Infotech Solutions Ltd.',
            email: 'atharvdhatrak12@gmail.com',
            phone: '+91 98230 45678',
            productName: 'HP EliteBook G8 Enterprise Laptop [Spec: 50 GB Enterprise High-Performance]',
            productCategory: 'Laptops',
            quantity: 25,
            delivery: 'Bandra-Kurla Complex (BKC), Mumbai',
            message: `[Specification & System Pricing]:
• Selected Instrument Spec: 50 GB Enterprise High-Performance
• System Unit Price: ₹65,000
• Requested Quantity: 25 units
• Estimated Commercial Total: ₹16,25,000
• SKU: BD-50GB

[Customer Requirements / Delivery Notes]:
Looking for bulk enterprise deployment. We need 16GB RAM + 512GB NVMe SSD spec configurations with 3-year warranty and onsite support.`,
            status: 'New',
            submittedAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 2,
            enquiryId: 'BD-ENQ-128159',
            name: 'Pooja Deshmukh',
            company: 'Apex Cloud Systems',
            email: 'pooja.deshmukh@apexcloud.in',
            phone: '+91 83086 49907',
            productName: 'Sony Alpha 7 IV Full Frame Camera [Spec: 10 GB Enhanced Capacity]',
            productCategory: 'Cameras',
            quantity: 5,
            delivery: 'Hinjawadi IT Park, Pune',
            message: `[Specification & System Pricing]:
• Selected Instrument Spec: 10 GB Enhanced Capacity
• System Unit Price: ₹1,85,000
• Requested Quantity: 5 units
• Estimated Commercial Total: ₹9,25,000

[Customer Requirements / Delivery Notes]:
Require high-resolution video capture units with 24-70mm GM lenses for media production department.`,
            status: 'Contacted',
            submittedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 3,
            enquiryId: 'BD-ENQ-128160',
            name: 'Amitabh Sharma',
            company: 'Zenith Retailers & Distributors',
            email: 'amitabh@zenithretail.com',
            phone: '+91 91234 56789',
            productName: 'Apple iPhone 15 Pro Max [Spec: 5 GB Standard Capacity]',
            productCategory: 'Smartphones',
            quantity: 10,
            delivery: 'Connaught Place, New Delhi',
            message: `[Specification & System Pricing]:
• Selected Instrument Spec: 5 GB Standard Capacity
• System Unit Price: ₹1,34,000
• Requested Quantity: 10 units
• Estimated Commercial Total: ₹13,40,000

[Customer Requirements / Delivery Notes]:
Need GST invoice and bulk pricing breakdown for company executive rewards.`,
            status: 'Reviewed',
            submittedAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        if (!selected && !isPhone) setSelected(fallback[0]);
        return fallback;
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Update Status
  const updateStatus = async (enquiryId, newStatus) => {
    try {
      await httpService.put(`/api/enquiry/${enquiryId}/status`, { status: newStatus });
      setEnquiries(prev =>
        prev.map(e => (e.enquiryId === enquiryId ? { ...e, status: newStatus } : e))
      );
      if (selected?.enquiryId === enquiryId) {
        setSelected(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  // Clean phone number for native auto-dialing
  const getCleanPhone = (phone) => (phone || '').replace(/[^\d+]/g, '');

  // Helper to extract parsed specification & quotation details (single or multi-product)
  const extractQuoteDetails = (lead) => {
    if (!lead) return null;
    const msg = lead.message || '';

    // Multi-item parser (Product #1: ..., Product #2: ...)
    const items = [];
    const productBlocks = msg.split(/Product #\d+:\s*/i).slice(1);
    if (productBlocks.length > 0) {
      productBlocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const name = lines[0] || '';
        const specMatch = block.match(/• Specification:\s*([^\n]+)/i);
        const unitMatch = block.match(/• System Unit Price:\s*₹?([^\n]+)/i);
        const qtyMatch = block.match(/• Quantity:\s*(\d+)/i);
        const subtotalMatch = block.match(/• Subtotal:\s*₹?([^\n]+)/i);

        if (name) {
          items.push({
            name,
            spec: specMatch ? specMatch[1].trim() : 'Standard Specification',
            unitPrice: unitMatch ? unitMatch[1].trim() : '',
            quantity: qtyMatch ? qtyMatch[1].trim() : '1',
            subtotal: subtotalMatch ? subtotalMatch[1].trim() : ''
          });
        }
      });
    }

    // Commercial Total
    let total = null;
    const totalMatch = msg.match(/• Estimated Commercial Total:\s*₹?([\d,]+)/i);
    if (totalMatch && totalMatch[1]) {
      total = totalMatch[1].trim();
    }

    // Fallback single product fields
    let spec = 'Standard Specification';
    const specMatch = msg.match(/• Selected Instrument Spec:\s*(.+)/i) || lead.productName?.match(/\[Spec:\s*([^\]]+)\]/i);
    if (specMatch && specMatch[1]) {
      spec = specMatch[1].trim();
    }

    let unitPrice = null;
    const unitMatch = msg.match(/• System Unit Price:\s*₹?([\d,]+)/i);
    if (unitMatch && unitMatch[1]) {
      unitPrice = unitMatch[1].trim();
    }

    // Clean Product Name
    const cleanProductName = (lead.productName || 'Instrument / Device').replace(/\[Spec:.*?\]/g, '').trim();

    return { spec, unitPrice, total, cleanProductName, items };
  };

  // Helper to generate official Google Gmail web compose URL with automated quotation
  const getGoogleComposeUrl = (lead) => {
    if (!lead?.email) return '#';
    const quote = extractQuoteDetails(lead);
    const cleanProduct = quote?.cleanProductName || (lead.productName || 'Equipment / Device').replace(/\[Spec:.*?\]/g, '').trim();
    const subject = `Bharat Devices - Official Commercial Quotation [${lead.enquiryId}]`;

    let breakdownText = '';
    if (quote?.items && quote.items.length > 0) {
      breakdownText = quote.items.map((it, idx) => {
        return `${idx + 1}. ${it.name}
   • Specification    : ${it.spec}
   • System Unit Price: ₹${it.unitPrice} | Quantity: ${it.quantity} units
   • Item Subtotal    : ₹${it.subtotal}`;
      }).join('\n\n');
    } else {
      const specText = quote?.spec || 'Standard Specification';
      const unitPriceText = quote?.unitPrice ? `₹${quote.unitPrice}` : 'Standard System Pricing';
      const qtyText = `${lead.quantity || 1} units`;
      breakdownText = `• Instrument / Product : ${cleanProduct}
• Selected Spec Variant: ${specText}
• System Unit Price    : ${unitPriceText}
• Requested Quantity   : ${qtyText}`;
    }

    const totalText = quote?.total ? `₹${quote.total}` : 'Calculated upon order confirmation';

    // Clean customer notes
    const cleanCustomerNotes = (lead.message || '')
      .replace(/\[Specification & System Pricing Breakdown\]:[\s\S]*?\[Customer Requirements \/ Delivery Notes\]:\s*/i, '')
      .replace(/\[Specification & System Pricing\]:[\s\S]*?\[Customer Requirements \/ Delivery Notes\]:\s*/i, '')
      .replace(/\[Specification & System Pricing Breakdown\]:[\s\S]*/i, '')
      .replace(/\[Specification & System Pricing\]:[\s\S]*/i, '')
      .trim() || 'Standard business procurement enquiry.';

    const body = `Dear ${lead.name || 'Valued Customer'},

Thank you for reaching out to Bharat Devices. We are pleased to furnish our official commercial quotation based on system pricing for your requested instruments and specifications.

============================================================
           BHARAT DEVICES - COMMERCIAL QUOTATION
============================================================
Enquiry ID        : ${lead.enquiryId}
Customer Name     : ${lead.name || 'N/A'}
Company / Org     : ${lead.company || 'Direct Buyer'}
Delivery Location : ${lead.delivery || 'Standard Delivery'}

------------------------------------------------------------
SPECIFICATION & PRICING BREAKDOWN:
------------------------------------------------------------
${breakdownText}
------------------------------------------------------------
TOTAL ESTIMATED QUOTE  : ${totalText} (inclusive of standard GST & handling)
------------------------------------------------------------

TERMS & COMMERCIAL CONDITIONS:
1. Validity: This quotation is valid for 30 calendar days from the date of issue.
2. Delivery Timeline: Expedited dispatch within 3-5 business days upon PO receipt.
3. Warranty: Comprehensive 1-year manufacturer warranty with dedicated technical support.
4. Payment: Standard GST invoice provided. 100% against delivery / corporate net-30 terms.

Customer Requirements / Delivery Notes:
"${cleanCustomerNotes}"

Please reply directly to this email to issue your Purchase Order (PO) or if you require any specialized technical customisations.

Warm regards,
Sales & Enterprise Quotation Team
Bharat Devices Pvt. Ltd.
Email: atharvdhatrak11@gmail.com
Phone: +91 83086 49907
Website: https://bharatdevices.com`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Launch official Google Gmail web compose
  const handleReplyViaGoogleEmail = () => {
    if (!selected?.email) return;
    const url = getGoogleComposeUrl(selected);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Auto-dial phone app
  const handleCallCustomer = () => {
    if (!selected?.phone) return;
    window.location.href = `tel:${getCleanPhone(selected.phone)}`;
  };

  // Copy helper
  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  // Metrics
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter(e => (e.status || 'New').toLowerCase() === 'new').length;
    const reviewedCount = enquiries.filter(e => (e.status || '').toLowerCase() === 'reviewed').length;
    const contactedCount = enquiries.filter(e => (e.status || '').toLowerCase() === 'contacted').length;
    const closedCount = enquiries.filter(e => (e.status || '').toLowerCase() === 'closed').length;
    return { total, newCount, reviewedCount, contactedCount, closedCount };
  }, [enquiries]);

  // Filtered List
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => {
      const matchesStatus =
        statusFilter === 'ALL' || (e.status || 'New').toUpperCase() === statusFilter.toUpperCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (e.enquiryId || '').toLowerCase().includes(q) ||
        (e.name || '').toLowerCase().includes(q) ||
        (e.company || '').toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q) ||
        (e.productName || '').toLowerCase().includes(q) ||
        (e.delivery || '').toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, searchQuery]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate Paginated List
  const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE) || 1;
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  // Design Tokens matching AdminAddBrand & AdminAddCategories:
  // Light mode: Clean Orange & Crisp White
  // Dark mode: Radiant Orange & Deep Navy Blue
  const isDark = isDarkMode;
  const cardBg = isDark ? '#0e1830' : '#ffffff';
  const activeCardBg = isDark ? '#14254b' : '#fff7ed';
  const borderColor = isDark ? '#192b50' : '#e2e8f0';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const accentColor = isDark ? '#fb923c' : '#ea580c';
  const accentBg = isDark ? 'rgba(249, 115, 22, 0.15)' : '#fff7ed';

  const selectLead = (enq) => {
    setSelected(enq);
    if (isPhone) setShowMobileDetail(true);
  };

  const selectedQuote = selected ? extractQuoteDetails(selected) : null;

  const styles = {
    shell: {
      display: 'flex',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: isDark ? '#070d1e' : '#f8fafc',
      color: textColor,
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minWidth: 0,
      width: '100%',
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: isPhone ? '12px' : '20px',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      boxSizing: 'border-box',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: isPhone ? '1fr' : 'minmax(310px, 360px) minmax(0, 1fr)',
      gap: '20px',
      alignItems: 'start',
      width: '100%',
      boxSizing: 'border-box',
    },
  };

  return (
    <div style={styles.shell}>
      {/* ─── SIDEBAR ─── */}
      <Sidebar
        navItems={navItems}
        loading={navLoading}
        activePath={location.pathname}
        onNavigate={(path) => { if (path) navigate(path); }}
      />

      {/* ─── MAIN COLUMN ─── */}
      <div style={styles.main}>
        {/* ─── TOPBAR ─── */}
        <AdminTopbar
          user={{ name: localStorage.getItem('userName') || 'Admin User', avatar: null }}
          onSearch={(query) => setSearchQuery(query)}
          onLogout={() => { localStorage.clear(); navigate('/login'); }}
        />

        {/* ─── CONTENT AREA ─── */}
        <div style={styles.content} className="no-scrollbar">
          {/* Consistent Header Section matching AdminAddBrand */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h1 style={{ fontSize: isPhone ? '18px' : '22px', fontWeight: '700', margin: 0, color: textColor }}>
                Enquiries & Quotation Manager
              </h1>
              <p style={{ fontSize: '13px', color: subTextColor, margin: '4px 0 0 0' }}>
                Review customer quote requests and dispatch automated commercial quotations based on system pricing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchEnquiries(true)}
              disabled={refreshing || loading}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: isDark ? '#192b50' : '#e2e8f0',
                color: textColor,
                border: 'none',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                width: isPhone ? '100%' : 'auto',
                justifyContent: 'center'
              }}
            >
              <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              {refreshing ? 'Refreshing...' : 'Refresh Leads'}
            </button>
          </div>

          {/* ─── SUMMARY STAT METRICS CARDS ─── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isPhone ? '8px' : '14px',
            marginBottom: '18px'
          }}>
            {/* Total */}
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
              padding: isPhone ? '10px 12px' : '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: accentBg,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Inbox size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Total Leads</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: textColor }}>{stats.total}</div>
              </div>
            </div>

            {/* Action Required */}
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
              padding: isPhone ? '10px 12px' : '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: isDark ? 'rgba(249, 115, 22, 0.15)' : '#fff7ed',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Action Required</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f97316' }}>{stats.newCount}</div>
              </div>
            </div>

            {/* Contacted */}
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
              padding: isPhone ? '10px 12px' : '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: isDark ? 'rgba(34, 197, 94, 0.15)' : '#f0fdf4',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Contacted</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#22c55e' }}>{stats.contactedCount + stats.reviewedCount}</div>
              </div>
            </div>

            {/* Closed */}
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
              padding: isPhone ? '10px 12px' : '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: isDark ? 'rgba(148, 163, 184, 0.12)' : '#f8fafc',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Archive size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Resolved</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: textColor }}>{stats.closedCount}</div>
              </div>
            </div>
          </div>

          {/* ─── CONSISTENT 2-COLUMN GRID (Matching Add Brand & Add Category) ─── */}
          <div style={styles.gridContainer}>
            {/* ─── LEFT COLUMN: ENQUIRIES LIST WITH PAGINATION ─── */}
            {(!isPhone || !showMobileDetail) && (
              <div style={{
                backgroundColor: cardBg,
                padding: '16px',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0, color: textColor }}>
                    Existing Enquiries
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(249, 115, 22, 0.15)' : '#fff7ed',
                    color: '#f97316'
                  }}>
                    {filteredEnquiries.length} Total
                  </span>
                </div>

                {/* Search Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isDark ? '#070d1e' : '#f8fafc',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  <Search size={13} color={subTextColor} />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: textColor,
                      fontSize: '12px',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: subTextColor, cursor: 'pointer', padding: 0 }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
                  {['ALL', 'NEW', 'REVIEWED', 'CONTACTED', 'CLOSED'].map((tab) => {
                    const isActive = statusFilter === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setStatusFilter(tab)}
                        style={{
                          border: 'none',
                          background: isActive ? accentColor : (isDark ? '#142240' : '#f1f5f9'),
                          color: isActive ? '#ffffff' : subTextColor,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s'
                        }}
                      >
                        {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                      </button>
                    );
                  })}
                </div>

                {/* Paginated List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: subTextColor }}>
                      <div className="enquiry-spinner" style={{ margin: '0 auto 8px' }} />
                      <span style={{ fontSize: '12px' }}>Loading leads...</span>
                    </div>
                  ) : filteredEnquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: subTextColor, fontSize: '13px' }}>
                      No matching enquiries found.
                    </div>
                  ) : (
                    paginatedEnquiries.map((enq) => {
                      const isSelected = selected?.enquiryId === enq.enquiryId;
                      const sc = STATUS_CONFIG[enq.status] || STATUS_CONFIG.New;
                      const dateStr = enq.submittedAt
                        ? new Date(enq.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })
                        : 'Recent';

                      const parsed = extractQuoteDetails(enq);

                      return (
                        <div
                          key={enq.enquiryId}
                          onClick={() => selectLead(enq)}
                          style={{
                            background: isSelected ? activeCardBg : (isDark ? '#0b1428' : '#fafafa'),
                            border: `1.5px solid ${isSelected ? accentColor : borderColor}`,
                            borderRadius: '8px',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px'
                          }}
                        >
                          {/* Row 1: ID & Status */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: isSelected ? accentColor : subTextColor,
                              fontFamily: 'monospace'
                            }}>
                              {enq.enquiryId}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '999px',
                              background: isDark ? sc.bgDark : sc.bgLight,
                              color: isDark ? sc.colorDark : sc.colorLight,
                              border: `1px solid ${isDark ? sc.borderDark : sc.borderLight}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.dot }} />
                              {sc.label}
                            </span>
                          </div>

                          {/* Row 2: Customer Name & Company */}
                          <div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: 700,
                              color: textColor,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {enq.name || 'Anonymous User'}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: subTextColor,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {enq.company || 'Direct Buyer'}
                            </div>
                          </div>

                          {/* Row 3: Product Name & Spec Variant */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '11px',
                            paddingTop: '4px',
                            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`
                          }}>
                            <span style={{
                              color: textColor,
                              fontWeight: 600,
                              maxWidth: '65%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {parsed?.cleanProductName || enq.productName || 'Equipment'}
                            </span>
                            <span style={{ color: subTextColor, fontSize: '10px' }}>{dateStr}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* ─── PAGINATION CONTROLS (Prevents unconditional expansion) ─── */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    paddingTop: '10px',
                    borderTop: `1px solid ${borderColor}`,
                    fontSize: '12px',
                  }}>
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: `1px solid ${borderColor}`,
                        backgroundColor: isDark ? '#192b50' : '#f1f5f9',
                        color: currentPage === 1 ? subTextColor : textColor,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      ← Prev
                    </button>
                    <span style={{ color: subTextColor, fontSize: '11px' }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: `1px solid ${borderColor}`,
                        backgroundColor: isDark ? '#192b50' : '#f1f5f9',
                        color: currentPage === totalPages ? subTextColor : textColor,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── RIGHT COLUMN: LEAD INSPECTOR & AUTOMATED QUOTATION DISPATCH ─── */}
            {(!isPhone || showMobileDetail) && (
              selected ? (
                <div style={{
                  backgroundColor: cardBg,
                  padding: '20px',
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Mobile Back Button */}
                  {isPhone && (
                    <button
                      type="button"
                      onClick={() => setShowMobileDetail(false)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        color: accentColor,
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '0 0 10px 0'
                      }}
                    >
                      <ArrowLeft size={16} /> Back to Enquiries List
                    </button>
                  )}

                  {/* Header Row: ID, Date & Status */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: `1px solid ${borderColor}`,
                    paddingBottom: '14px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: accentColor,
                          fontFamily: 'monospace'
                        }}>
                          {selected.enquiryId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selected.enquiryId, 'id')}
                          title="Copy ID"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: subTextColor,
                            padding: '2px'
                          }}
                        >
                          {copiedField === 'id' ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                        </button>
                      </div>
                      <div style={{ fontSize: '11px', color: subTextColor, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={12} />
                        {selected.submittedAt ? new Date(selected.submittedAt).toLocaleString('en-IN') : 'N/A'}
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Status:</span>
                      <select
                        value={selected.status || 'New'}
                        onChange={(e) => updateStatus(selected.enquiryId, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: `1.5px solid ${borderColor}`,
                          background: isDark ? '#070d1e' : '#f8fafc',
                          color: textColor,
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="New">🟡 New</option>
                        <option value="Reviewed">🔵 Reviewed</option>
                        <option value="Contacted">🟢 Contacted</option>
                        <option value="Closed">⚪ Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Profile Box */}
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <User size={13} /> Customer Details
                    </div>

                    <div style={{
                      background: isDark ? '#070d1e' : '#f8fafc',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      padding: '12px 14px',
                      display: 'grid',
                      gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr',
                      gap: '10px'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Full Name</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: textColor, marginTop: '2px' }}>
                          {selected.name || 'N/A'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Company</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: textColor, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Building size={13} color={subTextColor} />
                          {selected.company || 'N/A'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Email Address</div>
                        <div style={{ fontSize: '12px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={12} color={accentColor} />
                          <a
                            href={getGoogleComposeUrl(selected)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: isDark ? '#38bdf8' : '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                            title="Click to open official Google Email compose"
                          >
                            {selected.email || 'N/A'}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(selected.email, 'email')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: subTextColor, padding: 0 }}
                            title="Copy email"
                          >
                            {copiedField === 'email' ? <Check size={11} color="#22c55e" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Phone Number</div>
                        <div style={{ fontSize: '12px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} color="#22c55e" />
                          <a
                            href={`tel:${getCleanPhone(selected.phone)}`}
                            style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}
                          >
                            {selected.phone || 'N/A'}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(selected.phone, 'phone')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: subTextColor, padding: 0 }}
                            title="Copy phone"
                          >
                            {copiedField === 'phone' ? <Check size={11} color="#22c55e" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ gridColumn: isPhone ? '1' : '1 / -1' }}>
                        <div style={{ fontSize: '11px', color: subTextColor, fontWeight: 600 }}>Delivery Location</div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: textColor, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={13} color="#ef4444" />
                          {selected.delivery || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─── PRODUCT, SPECIFICATION & SYSTEM QUOTATION BOX ─── */}
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Package size={13} /> Product, Specs & System Quotation
                    </div>

                    <div style={{
                      background: isDark ? '#070d1e' : '#f8fafc',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      {selectedQuote?.items && selectedQuote.items.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedQuote.items.map((it, idx) => (
                            <div key={idx} style={{
                              background: isDark ? '#0e1830' : '#ffffff',
                              border: `1px solid ${borderColor}`,
                              borderRadius: '6px',
                              padding: '8px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: textColor }}>{it.name}</span>
                                <span style={{ fontSize: '12px', fontWeight: 800, color: accentColor }}>₹{it.subtotal}</span>
                              </div>
                              <div style={{ fontSize: '11px', color: subTextColor, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                                <span>Spec: <strong style={{ color: textColor }}>{it.spec}</strong></span>
                                <span>Qty: <strong>{it.quantity} units</strong> {it.unitPrice ? `(@ ₹${it.unitPrice})` : ''}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {/* Product Name & Category */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: textColor }}>
                                {selectedQuote?.cleanProductName || selected.productName || 'Unspecified Product'}
                              </div>
                              <div style={{ fontSize: '11px', color: subTextColor, marginTop: '2px' }}>
                                Category: <span style={{ color: textColor, fontWeight: 600 }}>{selected.productCategory || 'General'}</span>
                              </div>
                            </div>

                            <div style={{
                              padding: '3px 10px',
                              borderRadius: '6px',
                              background: isDark ? 'rgba(249,115,22,0.15)' : '#fff7ed',
                              border: `1px solid ${isDark ? 'rgba(249,115,22,0.3)' : '#fed7aa'}`,
                              color: accentColor,
                              fontWeight: 700,
                              fontSize: '11px'
                            }}>
                              Qty: {selected.quantity || 1} units
                            </div>
                          </div>

                          {/* Selected Specification & System Unit Price */}
                          <div style={{
                            background: isDark ? '#0e1830' : '#ffffff',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '6px',
                            padding: '10px 12px',
                            display: 'grid',
                            gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr',
                            gap: '8px',
                            fontSize: '12px'
                          }}>
                            <div>
                              <span style={{ color: subTextColor, fontSize: '10px', display: 'block', fontWeight: 600 }}>Selected Specification:</span>
                              <strong style={{ color: accentColor, fontSize: '12px' }}>
                                {selectedQuote?.spec || 'Standard Specification'}
                              </strong>
                            </div>
                            <div>
                              <span style={{ color: subTextColor, fontSize: '10px', display: 'block', fontWeight: 600 }}>System Unit Price:</span>
                              <strong style={{ color: textColor, fontSize: '12px' }}>
                                {selectedQuote?.unitPrice ? `₹${selectedQuote.unitPrice}` : 'Standard System Pricing'}
                              </strong>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Automated Quotation Total Banner */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isDark ? 'rgba(249, 115, 22, 0.12)' : '#fff7ed',
                        border: `1px solid ${isDark ? 'rgba(249, 115, 22, 0.3)' : '#fed7aa'}`,
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: accentColor, letterSpacing: '0.04em' }}>
                            Automated Commercial Quotation
                          </div>
                          <div style={{ fontSize: '11px', color: subTextColor, marginTop: '1px' }}>
                            Pre-configured in email response draft
                          </div>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: accentColor }}>
                          {selectedQuote?.total ? `₹${selectedQuote.total}` : 'Base System Pricing'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <MessageSquare size={13} /> Customer Notes / Requirements
                    </div>

                    <div style={{
                      background: isDark ? '#070d1e' : '#f8fafc',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      padding: '12px 14px',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      color: isDark ? '#e2e8f0' : '#334155',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selected.message || 'No additional requirements provided.'}
                    </div>
                  </div>

                  {/* ─── ACTION TOOLBAR ─── */}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    borderTop: `1px solid ${borderColor}`,
                    paddingTop: '14px'
                  }}>
                    {/* Reply via Google Email button */}
                    {selected.email && (
                      <a
                        href={getGoogleComposeUrl(selected)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          background: accentColor,
                          color: '#ffffff',
                          textDecoration: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(249, 115, 22, 0.25)',
                          flex: isPhone ? '1 1 100%' : 'initial'
                        }}
                      >
                        <Send size={14} /> Send Email in Reply (Automated Quotation)
                      </a>
                    )}

                    {/* Auto-dial Phone button */}
                    {selected.phone && (
                      <a
                        href={`tel:${getCleanPhone(selected.phone)}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          background: isDark ? '#14254b' : '#f1f5f9',
                          color: isDark ? '#f8fafc' : '#0f172a',
                          border: `1px solid ${borderColor}`,
                          textDecoration: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flex: isPhone ? '1 1 100%' : 'initial'
                        }}
                      >
                        <PhoneCall size={14} color="#22c55e" /> Call Customer (Auto-Dial)
                      </a>
                    )}

                    {/* Close Lead Button */}
                    {selected.status !== 'Closed' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(selected.enquiryId, 'Closed')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'none',
                          border: `1px solid ${borderColor}`,
                          color: subTextColor,
                          padding: '9px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          marginLeft: isPhone ? '0' : 'auto'
                        }}
                      >
                        <CheckCircle2 size={13} /> Close Lead
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: subTextColor
                }}>
                  <Inbox size={36} color={accentColor} style={{ margin: '0 auto 10px' }} />
                  <h3 style={{ margin: '0 0 6px', color: textColor, fontSize: '15px', fontWeight: 700 }}>
                    Select an Enquiry
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    Click on any enquiry from the list to view customer details and dispatch automated quotations.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .enquiry-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(249, 115, 22, 0.2);
          border-top-color: #F97316;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
