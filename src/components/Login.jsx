import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import useAuthStore from '../store/authStore';
import LibraryIllustration from './LibraryIllustration';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, theme, toggleTheme } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState('');

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      setToken(res.data.token, res.data);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data;
      setServerMsg(typeof msg === 'string' ? msg : (msg?.message || msg?.error || 'Login failed. Please try again.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root" data-theme={theme}>
      {/* LEFT — Library illustration */}
      <div className="auth-left">
        {/* Floating quote */}
        <div style={{ position: 'absolute', top: '40px', left: '40px', right: '40px', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a55a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize: '20px', color: '#f0e6d0', letterSpacing: '0.02em' }}>Librario</span>
          </div>
        </div>

        {/* Illustration */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 160px' }}>
          <LibraryIllustration />
        </div>

        {/* Bottom quote */}
        <div className="auth-left-content">
          <div style={{ width: '40px', height: '2px', background: 'rgba(245,158,11,0.6)', borderRadius: '2px', marginBottom: '16px' }} />
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize: '22px', color: '#f0e0c0', lineHeight: 1.5, marginBottom: '10px', fontStyle: 'italic' }}>
            "A library is not a luxury but one of the necessities of life."
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(240,224,192,0.5)', letterSpacing: '0.05em' }}>— Henry Ward Beecher</p>
          <div style={{ display: 'flex', gap: '6px', marginTop: '24px' }}>
            {[1,2,3].map(i => <div key={i} style={{ width: i === 1 ? '20px' : '6px', height: '4px', background: i === 1 ? 'rgba(245,158,11,0.7)' : 'rgba(245,158,11,0.25)', borderRadius: '2px' }}/>)}
          </div>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div className="auth-right">
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--text-2)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {theme === 'dark'
              ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
              : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}
          </svg>
        </button>

        <div className="auth-form-wrap">
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '6px', fontFamily:"'Playfair Display',serif" }}>Welcome back</h1>
            <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Sign in to your library account</p>
          </div>

          <div className="auth-card">
            {serverMsg && <div className="alert alert-error">{serverMsg}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label">Email Address</label>
                <input className="input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoFocus />
                {errors.email && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="label" style={{ margin: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Forgot?</Link>
                </div>
                <input className="input" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} />
                {errors.password && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
              </div>
              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '12px' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text-2)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
