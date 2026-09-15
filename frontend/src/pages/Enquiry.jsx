import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockProducts } from '../data/mockData';

const STEPS = ['Select Product', 'Fill Details', 'Submit Enquiry'];

export default function Enquiry() {
  const [searchParams] = useSearchParams();
  const initProductId = Number(searchParams.get('product')) || null;

  const [step, setStep] = useState(initProductId ? 2 : 1);
  const [selectedProduct, setSelectedProduct] = useState(
    initProductId ? mockProducts.find(p => p.id === initProductId) || mockProducts[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', delivery: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [enquiryId, setEnquiryId] = useState('');

  const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const id = `BD-ENQ-${Date.now().toString().slice(-6)}`;
    setEnquiryId(id);
    setStep(3);
    setSubmitting(false);
  };

  return (
    <div className="enquiry-page">
      <div className="enquiry-container">
        <h1 className="enquiry-heading">Simple Enquiry Process</h1>
        <p className="enquiry-sub">Just 3 simple steps to get your quote</p>

        {/* Step indicators */}
        <div className="steps-bar">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <React.Fragment key={n}>
                <div className="step-item">
                  <div className={`step-circle${done ? ' done' : active ? ' active' : ''}`}>
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : n}
                  </div>
                  <span className={`step-label${active ? ' step-label-active' : ''}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`step-connector${done ? ' connector-done' : ''}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="enquiry-body">
          {/* Step 1: Select Product */}
          {step === 1 && (
            <div className="step-content">
              <h2 className="step-content-title">Select a Product</h2>
              <div className="product-selection-grid">
                {mockProducts.map(p => (
                  <button
                    key={p.id}
                    className={`product-select-card${selectedProduct?.id === p.id ? ' selected' : ''}`}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <img src={p.image} alt={p.name} className="product-select-img" />
                    <div className="product-select-info">
                      <span className="product-select-name">{p.name}</span>
                      <span className="product-select-cat">{p.category}</span>
                      <span className="product-select-price">₹{p.price.toLocaleString('en-IN')} onwards</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="step-actions">
                <button
                  className="btn-next"
                  disabled={!selectedProduct}
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Fill Details */}
          {step === 2 && (
            <div className="step-content-two">
              {/* Product Preview */}
              <div className="product-preview-col">
                <h2 className="step-content-title">Selected Product</h2>
                {selectedProduct && (
                  <div className="product-preview-card">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="preview-img" />
                    <div className="preview-info">
                      <span className="preview-name">{selectedProduct.name}</span>
                      <span className="preview-cat">{selectedProduct.category}</span>
                      <div className="quantity-row">
                        <span className="qty-label">Quantity *</span>
                        <div className="qty-controls">
                          <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                          <input
                            type="number"
                            className="qty-value"
                            value={quantity}
                            onChange={e => {
                              const v = parseInt(e.target.value, 10);
                              setQuantity(isNaN(v) ? '' : v);
                            }}
                            onBlur={() => setQuantity(q => Math.max(1, Number(q) || 1))}
                          />
                          <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button className="change-product-btn" onClick={() => setStep(1)}>Change Product</button>
                <div className="enquiry-info-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>We'll get back to you within 24 hours!</span>
                </div>
              </div>

              {/* Form */}
              <div className="form-col">
                <h2 className="step-content-title">Your Details</h2>
                <form className="enquiry-form" onSubmit={handleSubmit}>
                  <div className="form-row-two">
                    <div className="form-field">
                      <label className="field-label">Full Name <span className="required">*</span></label>
                      <input name="name" value={form.name} onChange={handleFormChange} placeholder="Rahul Sharma" required className="field-input" />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Company Name <span className="required">*</span></label>
                      <input name="company" value={form.company} onChange={handleFormChange} placeholder="ABC Pvt Ltd" required className="field-input" />
                    </div>
                  </div>
                  <div className="form-row-two">
                    <div className="form-field">
                      <label className="field-label">Email <span className="required">*</span></label>
                      <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="rahul@abc.com" required className="field-input" />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Phone <span className="required">*</span></label>
                      <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="9876544210" required className="field-input" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="field-label">Delivery Location <span className="required">*</span></label>
                    <input name="delivery" value={form.delivery} onChange={handleFormChange} placeholder="Mumbai" required className="field-input" />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Message / Requirement</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleFormChange}
                      placeholder="Need quotation for 50 units with GST and delivery."
                      rows={3}
                      className="field-input field-textarea"
                    />
                  </div>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                  <p className="form-note">We respect your privacy. Your details are safe with us.</p>
                </form>
              </div>
            </div>
          )}

          {/* Step 3: Thank You */}
          {step === 3 && (
            <div className="thank-you-wrap">
              <div className="thank-you-card">
                <div className="thank-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="thank-heading">Thank You!</h2>
                <p className="thank-desc">Your enquiry has been submitted successfully.</p>
                <div className="enquiry-id-box">
                  Enquiry ID: <strong>{enquiryId}</strong>
                </div>
                <p className="thank-followup">Our team will contact you soon.</p>
                <Link to="/" className="btn-back-home">Back to Home</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .enquiry-page {
          background: linear-gradient(160deg, #0a1628 0%, #0d2044 60%, #0a1628 100%);
          min-height: 100vh;
          padding: 2.5rem 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .enquiry-page::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 420px; height: 420px;
          background: rgba(29,78,216,0.12);
          border-radius: 50%;
          pointer-events: none;
        }
        .enquiry-page::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -60px;
          width: 320px; height: 320px;
          background: rgba(29,78,216,0.08);
          border-radius: 50%;
          pointer-events: none;
        }

        .enquiry-container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .enquiry-heading {
          font-size: 1.75rem;
          font-weight: 800;
          color: #ffffff;
          text-align: center;
          margin-bottom: 0.3rem;
        }

        .enquiry-sub {
          color: #94a3b8;
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        /* Steps */
        .steps-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 2rem;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.2);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .step-circle.active {
          background: #1d4ed8;
          border-color: #1d4ed8;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(29,78,216,0.3);
        }

        .step-circle.done {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        .step-label {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
        }

        .step-label-active {
          color: #60a5fa;
          font-weight: 700;
        }

        .step-connector {
          width: 80px;
          height: 1.5px;
          background: rgba(255,255,255,0.1);
          margin-bottom: 20px;
        }

        .step-connector.connector-done {
          background: #16a34a;
        }

        /* Body */
        .enquiry-body {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(8px);
        }

        .step-content-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.25rem;
        }

        /* Step 1 */
        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .product-selection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
          max-height: 380px;
          overflow-y: auto;
        }

        .product-select-card {
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 0.75rem;
          cursor: pointer;
          background: rgba(255,255,255,0.04);
          text-align: left;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .product-select-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
        }

        .product-select-card.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
          background: rgba(29,78,216,0.15);
        }

        .product-select-img {
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 6px;
        }

        .product-select-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          display: block;
        }

        .product-select-cat {
          font-size: 0.72rem;
          color: #94a3b8;
          display: block;
        }

        .product-select-price {
          font-size: 0.8rem;
          font-weight: 700;
          color: #60a5fa;
          display: block;
        }

        .step-actions { display: flex; justify-content: flex-end; }

        .btn-next {
          background: #ffffff;
          color: #1d4ed8;
          border: none;
          border-radius: 8px;
          padding: 0.7rem 2rem;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .btn-next:disabled { background: rgba(255,255,255,0.3); color: #94a3b8; cursor: not-allowed; }
        .btn-next:not(:disabled):hover { background: #f0f9ff; transform: translateY(-1px); }

        /* Step 2 */
        .step-content-two {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .product-preview-col {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .product-preview-card {
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
        }

        .preview-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          display: block;
        }

        .preview-info {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .preview-name { font-size: 0.875rem; font-weight: 700; color: #ffffff; }
        .preview-cat { font-size: 0.75rem; color: #94a3b8; }

        .quantity-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
        }

        .qty-label { font-size: 0.8rem; font-weight: 600; color: #cbd5e1; }

        .qty-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 0.15rem 0.4rem;
          background: rgba(255,255,255,0.06);
        }

        .qty-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          color: #ffffff;
          cursor: pointer;
          padding: 0;
          width: 20px;
          text-align: center;
        }

        .qty-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          width: 64px;
          text-align: center;
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 5px;
          padding: 0.15rem 0.25rem;
          outline: none;
          font-family: inherit;
          background: rgba(255,255,255,0.08);
        }
        .qty-value:focus { border-color: #3b82f6; }
        .qty-value::-webkit-inner-spin-button,
        .qty-value::-webkit-outer-spin-button { opacity: 0.5; }

        .change-product-btn {
          background: none;
          border: none;
          color: #60a5fa;
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: color 0.2s;
        }
        .change-product-btn:hover { color: #93c5fd; }

        .enquiry-info-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(29,78,216,0.2);
          border: 1px solid rgba(59,130,246,0.3);
          border-radius: 10px;
          font-size: 0.8rem;
          color: #93c5fd;
          text-align: center;
          font-weight: 500;
          margin-top: auto;
        }

        /* Form */
        .form-col {
          display: flex;
          flex-direction: column;
        }

        .enquiry-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .required { color: #f87171; }

        .field-input {
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 7px;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #ffffff;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(255,255,255,0.07);
        }
        .field-input::placeholder { color: #64748b; }
        .field-input:focus { border-color: #3b82f6; background: rgba(255,255,255,0.1); }
        .field-textarea { resize: vertical; min-height: 70px; }

        .btn-submit {
          background: #ffffff;
          color: #1d4ed8;
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          margin-top: 0.25rem;
        }

        .btn-submit:hover:not(:disabled) { background: #f0f9ff; transform: translateY(-1px); }
        .btn-submit:disabled { background: rgba(255,255,255,0.3); color: #94a3b8; cursor: not-allowed; }

        .form-note {
          font-size: 0.73rem;
          color: #64748b;
          text-align: center;
        }

        /* Step 3 */
        .thank-you-wrap {
          display: flex;
          justify-content: center;
          padding: 2rem 0;
        }

        .thank-you-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-width: 360px;
          text-align: center;
        }

        .thank-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 12px rgba(22,163,74,0.15);
        }

        .thank-heading {
          font-size: 1.75rem;
          font-weight: 800;
          color: #ffffff;
        }

        .thank-desc {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .enquiry-id-box {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 0.6rem 1.25rem;
          font-size: 0.875rem;
          color: #e2e8f0;
        }

        .thank-followup {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .btn-back-home {
          background: #ffffff;
          color: #1d4ed8;
          border-radius: 8px;
          padding: 0.7rem 2rem;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }

        .btn-back-home:hover { background: #f0f9ff; transform: translateY(-1px); }

        @media (max-width: 768px) {
          .step-content-two { grid-template-columns: 1fr; }
          .product-selection-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row-two { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .enquiry-page { padding: 1rem; }
          .enquiry-body { padding: 1.25rem 1rem; }
          .product-selection-grid { grid-template-columns: 1fr 1fr; }
          .step-connector { width: 40px; }
        }
      `}</style>
    </div>
  );
}
