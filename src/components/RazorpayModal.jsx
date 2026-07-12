import { useState, useEffect } from 'react';

// ── Razorpay Payment Modal ────────────────────────────────────────────────────
// mode: 'fine' | 'subscription'
// fineData: { borrowId, bookTitle, daysLate, amount }
// planData: { planId, planName, price (number), email, name }
// onClose, onSuccess
export default function RazorpayModal({ mode, fineData, planData, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [step, setStep] = useState('details'); // 'details' | 'processing' | 'success'
  const [errors, setErrors] = useState({});
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    // Pre-fill from plan data if available
    if (planData) {
      setForm(f => ({
        ...f,
        email: planData.email || '',
        name: planData.name || '',
      }));
    }
    if (fineData) {
      setForm(f => ({
        ...f,
        email: fineData.email || '',
        name: fineData.name || '',
      }));
    }
    setTimeout(() => setAnimIn(true), 10);
  }, []);

  const amount = mode === 'fine'
    ? fineData?.amount
    : planData?.price;

  const title = mode === 'fine'
    ? 'Pay Library Fine'
    : `Subscribe to ${planData?.planName} Plan`;

  const subtitle = mode === 'fine'
    ? `Overdue fine for "${fineData?.bookTitle}"`
    : `Librario — ${planData?.planName} Plan`;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep('processing');
    // Simulate Razorpay redirect / processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess && onSuccess({ ...form, amount });
      }, 2000);
    }, 1800);
  };

  const paymentMethods = [
    { label: 'UPI', icon: (
      <svg viewBox="0 0 40 16" width="40" height="16">
        <text x="0" y="13" fontSize="11" fontWeight="800" fill="#097939" fontFamily="sans-serif">UPI</text>
        <text x="18" y="13" fontSize="8" fill="#6b7280" fontFamily="sans-serif">⚡</text>
      </svg>
    )},
    { label: 'VISA' },
    { label: 'MC' },
    { label: 'RuPay' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, padding: '24px',
      backdropFilter: 'blur(4px)',
      transition: 'opacity 0.3s',
      opacity: animIn ? 1 : 0,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        maxWidth: '860px',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
        transform: animIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        maxHeight: '92vh',
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: '320px', flexShrink: 0,
          background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          padding: '40px 32px',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }}/>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'40px' }}>
            <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
              📚
            </div>
            <div>
              <p style={{ fontSize:'15px', fontWeight:'800', color:'#fff', letterSpacing:'-0.3px' }}>Librario</p>
              <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Library System</p>
            </div>
          </div>

          {/* Title */}
          <h2 style={{ fontSize:'20px', fontWeight:'700', color:'#fff', lineHeight:1.3, marginBottom:'8px', fontFamily:"'Georgia',serif" }}>
            {title}
          </h2>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.55)', marginBottom:'32px', lineHeight:1.6 }}>
            {subtitle}
          </p>

          {/* Amount box */}
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '14px',
            padding: '20px 22px',
            marginBottom: '28px',
          }}>
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px' }}>Amount to Pay</p>
            <p style={{ fontSize:'38px', fontWeight:'800', color:'#fff', lineHeight:1, fontFamily:"'Georgia',serif" }}>
              ₹{amount?.toLocaleString('en-IN')}<span style={{ fontSize:'16px', fontWeight:'400', color:'rgba(255,255,255,0.5)' }}>.00</span>
            </p>
          </div>

          {/* Details */}
          {mode === 'fine' && fineData && (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <DetailRow icon="📖" label="Book" value={fineData.bookTitle} />
              <DetailRow icon="📅" label="Days Overdue" value={`${fineData.daysLate} days`} valueColor="#f87171" />
              <DetailRow icon="💰" label="Rate" value="₹5 per day" />
            </div>
          )}
          {mode === 'subscription' && planData && (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <DetailRow icon="🎫" label="Plan" value={planData.planName} />
              <DetailRow icon="📚" label="Book Limit" value={`${planData.books} books`} />
              <DetailRow icon="📆" label="Validity" value="30 days" />
            </div>
          )}

          {/* Contact */}
          <div style={{ marginTop:'auto', paddingTop:'32px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Need help?</p>
            <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>📧 info@librario.com</p>
            <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>📞 +91 93469 93306</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex: 1, padding: '40px 36px', overflowY: 'auto', position: 'relative' }}>
          {/* Close button */}
          <button onClick={onClose}
            style={{ position:'absolute', top:'20px', right:'20px', width:'32px', height:'32px', background:'#f1f5f9', border:'none', borderRadius:'50%', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
            ×
          </button>

          {step === 'details' && (
            <>
              <h3 style={{ fontSize:'18px', fontWeight:'700', color:'#0f172a', marginBottom:'6px' }}>Payment Details</h3>
              <div style={{ width:'40px', height:'3px', background:'linear-gradient(90deg,#3b82f6,#8b5cf6)', borderRadius:'2px', marginBottom:'28px' }}/>

              {/* Amount display */}
              <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'14px 18px', marginBottom:'24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'13px', color:'#64748b', fontWeight:'500' }}>Amount</span>
                <span style={{ fontSize:'20px', fontWeight:'800', color:'#0f172a', fontFamily:"'Georgia',serif" }}>₹{amount?.toLocaleString('en-IN')}.00</span>
              </div>

              {/* Form fields */}
              <div style={{ display:'flex', flexDirection:'column', gap:'16px', marginBottom:'28px' }}>
                <FormField label="Full Name" value={form.name} error={errors.name}
                  placeholder="Enter your full name"
                  onChange={v => { setForm(f=>({...f, name:v})); setErrors(e=>({...e, name:''})); }} />
                <FormField label="Email Address" value={form.email} error={errors.email}
                  placeholder="Enter your email"
                  type="email"
                  onChange={v => { setForm(f=>({...f, email:v})); setErrors(e=>({...e, email:''})); }} />
                <FormField label="Phone Number" value={form.phone} error={errors.phone}
                  placeholder="10-digit mobile number"
                  type="tel"
                  onChange={v => { setForm(f=>({...f, phone:v})); setErrors(e=>({...e, phone:''})); }} />
                {mode === 'fine' && fineData?.borrowId && (
                  <FormField label="Reference ID" value={`BRW-${fineData.borrowId}`} readOnly />
                )}
              </div>

              {/* Terms */}
              <p style={{ fontSize:'11px', color:'#94a3b8', marginBottom:'20px', lineHeight:1.6 }}>
                By proceeding, you agree to share the information entered on this page with Librario and Razorpay, adhering to applicable laws.
              </p>

              {/* Pay button */}
              <button onClick={handlePay}
                style={{
                  width:'100%', padding:'15px', borderRadius:'12px', border:'none',
                  background:'linear-gradient(135deg, #2563eb, #7c3aed)',
                  color:'#fff', fontSize:'15px', fontWeight:'800', cursor:'pointer',
                  fontFamily:"'Manrope',sans-serif", letterSpacing:'0.02em',
                  transition:'all 0.2s', boxShadow:'0 4px 20px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(99,102,241,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(99,102,241,0.35)'; }}>
                Pay ₹{amount?.toLocaleString('en-IN')}.00
              </button>

              {/* Payment methods */}
              <div style={{ marginTop:'20px', display:'flex', alignItems:'center', gap:'12px', justifyContent:'center' }}>
                <p style={{ fontSize:'10px', color:'#94a3b8', whiteSpace:'nowrap' }}>Secured by</p>
                <RazorpayBadge />
              </div>
              <div style={{ marginTop:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
                {['UPI', 'VISA', 'MC', 'RuPay', 'NetBanking'].map(m => (
                  <span key={m} style={{ fontSize:'9px', fontWeight:'700', color:'#475569', background:'#f1f5f9', padding:'3px 8px', borderRadius:'4px', border:'1px solid #e2e8f0', letterSpacing:'0.04em' }}>{m}</span>
                ))}
              </div>
            </>
          )}

          {step === 'processing' && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'360px', gap:'20px' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'50%', border:'4px solid #e2e8f0', borderTopColor:'#3b82f6', animation:'spin 0.8s linear infinite' }}/>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:'18px', fontWeight:'700', color:'#0f172a', marginBottom:'6px' }}>Processing Payment</p>
                <p style={{ fontSize:'13px', color:'#64748b' }}>Please wait while we verify your transaction...</p>
              </div>
              <RazorpayBadge />
            </div>
          )}

          {step === 'success' && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'360px', gap:'16px' }}>
              <div style={{
                width:'72px', height:'72px', borderRadius:'50%',
                background:'linear-gradient(135deg, #22c55e, #16a34a)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 8px 24px rgba(34,197,94,0.3)',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:'22px', fontWeight:'800', color:'#0f172a', marginBottom:'6px', fontFamily:"'Georgia',serif" }}>Payment Successful!</p>
                <p style={{ fontSize:'13px', color:'#64748b', lineHeight:1.6 }}>
                  ₹{amount?.toLocaleString('en-IN')} paid successfully.<br/>
                  A confirmation has been sent to {form.email}
                </p>
              </div>
              <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'14px 20px', textAlign:'center' }}>
                <p style={{ fontSize:'12px', color:'#16a34a', fontWeight:'600' }}>✓ Transaction ID: TXN{Date.now().toString().slice(-8)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, valueColor }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
        <span style={{ fontSize:'13px' }}>{icon}</span>
        <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)' }}>{label}</span>
      </div>
      <span style={{ fontSize:'12px', fontWeight:'600', color: valueColor || 'rgba(255,255,255,0.85)', maxWidth:'140px', textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</span>
    </div>
  );
}

function FormField({ label, value, error, placeholder, onChange, type = 'text', readOnly }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px', letterSpacing:'0.02em' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '11px 14px', borderRadius: '9px',
          border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          fontSize: '13px', color: '#0f172a',
          background: readOnly ? '#f8fafc' : '#fff',
          outline: 'none', transition: 'border-color 0.15s',
          fontFamily:"'Manrope',sans-serif",
        }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; }}
        onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0'; }}
      />
      {error && <p style={{ fontSize:'11px', color:'#ef4444', marginTop:'4px' }}>{error}</p>}
    </div>
  );
}

function RazorpayBadge() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'5px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'6px', padding:'4px 10px' }}>
      <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
        <path d="M20 4L8 12v16l12 8 12-8V12L20 4z" fill="#072654"/>
        <path d="M20 4L32 12 20 20 8 12z" fill="#3395FF"/>
        <path d="M20 20l12-8v16L20 36V20z" fill="#0B4B9C"/>
        <path d="M20 20L8 12v16l12 8V20z" fill="#2775D3"/>
      </svg>
      <span style={{ fontSize:'11px', fontWeight:'700', color:'#072654', letterSpacing:'0.02em' }}>Razorpay</span>
    </div>
  );
}
