import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axiosInstance';
import useAuthStore from '../store/authStore';
import LibraryIllustration from './LibraryIllustration';

// Reusable split layout wrapper
function AuthLayout({ children, quote, author }) {
  const { theme, toggleTheme } = useAuthStore();
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="auth-root" data-theme={theme}>
      <div className="auth-left">
        <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 3, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c6fe0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize: '18px', color: '#e8e4ff' }}>Librario</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 160px' }}>
          <LibraryIllustration />
        </div>
        <div className="auth-left-content">
          <div style={{ width: '36px', height: '2px', background: 'rgba(245,158,11,0.6)', borderRadius: '2px', marginBottom: '14px' }} />
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize: '19px', color: '#ddd8ff', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '8px' }}>"{quote}"</p>
          <p style={{ fontSize: '12px', color: 'rgba(240,224,192,0.45)' }}>— {author}</p>
        </div>
      </div>
      <div className="auth-right">
        <button onClick={toggleTheme} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--text-2)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {theme === 'dark' ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></> : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}
          </svg>
        </button>
        <div className="auth-form-wrap">{children}</div>
      </div>
    </div>
  );
}

// ==================== REGISTER ====================
export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'MEMBER' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await API.post('/auth/register', { name: form.name, email: form.email, password: form.password, role: 'MEMBER' });
      setMsg({ text: 'Account created! Check your email for OTP.', type: 'success' });
      setTimeout(() => navigate('/verify-otp', { state: { email: form.email } }), 1500);
    } catch (err) {
      setMsg({ text: err.response?.data || 'Registration failed', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout quote="The more that you read, the more things you will know." author="Dr. Seuss">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px', fontFamily:"'Playfair Display',serif" }}>Create Account</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Join the library management system</p>
      </div>
      <div className="auth-card">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
          ].map(f => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input className="input" {...f} value={form[f.name]} onChange={e => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); }} />
              {errors[f.name] && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{errors[f.name]}</p>}
            </div>
          ))}
          {/* Role is always MEMBER for self-registration. Librarians are created by Admin only. */}
          <div style={{ background:'var(--accent-muted)', border:'1px solid var(--border-accent)', borderRadius:'8px', padding:'10px 14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ fontSize:'12px', color:'var(--accent)' }}>Registering as <strong>Member</strong>. Librarian accounts are created by Admin only.</p>
          </div>
          {[
            { label: 'Password', name: 'password', placeholder: 'Min 6 characters' },
            { label: 'Confirm Password', name: 'confirmPassword', placeholder: 'Repeat password' },
          ].map(f => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input className="input" type="password" name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={e => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); }} />
              {errors[f.name] && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{errors[f.name]}</p>}
            </div>
          ))}
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '11px' }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-2)' }}>
          Already have an account? <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

// ==================== VERIFY OTP ====================
export function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const inputs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i, e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus(); };
  const handlePaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (p.length === 6) { setOtp(p.split('')); inputs.current[5]?.focus(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setMsg({ text: 'Enter 6-digit OTP', type: 'error' }); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/verify', { email, otp: code });
      setMsg({ text: res.data, type: 'success' });
      setTimeout(() => navigate('/'), 2200);
    } catch (err) {
      setMsg({ text: err.response?.data || 'Verification failed', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout quote="Not all readers are leaders, but all leaders are readers." author="Harry S. Truman">
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ width: '52px', height: '52px', background: 'var(--accent-muted)', border: '1px solid var(--border-accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-1)', fontFamily:"'Playfair Display',serif" }}>Verify your email</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', marginTop: '4px' }}>OTP sent to <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{email}</span></p>
      </div>
      <div className="auth-card">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }} onPaste={handlePaste}>
            {otp.map((d, i) => (
              <input key={i} ref={el => inputs.current[i] = el} type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
                style={{ width: '44px', height: '52px', textAlign: 'center', background: 'var(--bg-input)', border: `1px solid ${d ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', color: 'var(--text-1)', fontSize: '22px', fontWeight: '700', outline: 'none', boxShadow: d ? '0 0 0 3px var(--accent-muted)' : 'none', transition: 'all 0.15s' }} />
            ))}
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
        {msg.type === 'success' && (
          <div className="alert alert-info" style={{ marginTop: '14px' }}>
            ℹ️ Account pending admin approval. You'll receive an email once approved.
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px' }}>
          <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

// ==================== FORGOT PASSWORD ====================
export function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({ otp: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setMsg({ text: 'OTP sent! Check your email.', type: 'success' });
      setTimeout(() => { setMsg({ text: '', type: '' }); setStep(2); }, 1500);
    } catch (err) {
      setMsg({ text: err.response?.data || 'Failed', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setMsg({ text: 'Passwords do not match', type: 'error' }); return; }
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, otp: form.otp, newPassword: form.newPassword });
      setMsg({ text: 'Password reset! Redirecting...', type: 'success' });
      setTimeout(() => window.location.href = '/', 2000);
    } catch (err) {
      setMsg({ text: err.response?.data || 'Reset failed', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout quote="Reading is to the mind what exercise is to the body." author="Joseph Addison">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-1)', fontFamily:"'Playfair Display',serif" }}>{step === 1 ? 'Reset Password' : 'New Password'}</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', marginTop: '4px' }}>{step === 1 ? 'Enter your email to receive a reset OTP' : `OTP sent to ${email}`}</p>
      </div>
      <div className="auth-card">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        {step === 1 ? (
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div><label className="label">Email Address</label><input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div><label className="label">OTP Code</label><input className="input" placeholder="6-digit code" maxLength={6} value={form.otp} onChange={e => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })} /></div>
            <div><label className="label">New Password</label><input className="input" type="password" placeholder="Min 6 characters" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} /></div>
            <div><label className="label">Confirm Password</label><input className="input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} /></div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}
        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px' }}>
          <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

// ==================== PROTECTED ROUTE ====================
export function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) navigate('/', { replace: true });
    else if (roles && !roles.includes(user?.role)) navigate('/dashboard', { replace: true });
  }, [token, user]);
  if (!token) return null;
  if (roles && !roles.includes(user?.role)) return null;
  return children;
}
