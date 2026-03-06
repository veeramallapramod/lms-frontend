import { useState } from 'react';
import Layout from './Layout';
import API from '../api/axiosInstance';

export default function AddLibrarian() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await API.post('/auth/create-librarian', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      setMsg({ text:`Librarian account created for ${form.email}. They can now login directly.`, type:'success' });
      setForm({ name:'', email:'', password:'', confirmPassword:'' });
    } catch (err) {
      setMsg({ text: err.response?.data || 'Failed to create librarian', type:'error' });
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Add Librarian" subtitle="Create a librarian account directly — no registration needed">
      <div style={{ maxWidth:'560px' }}>

        {/* Info banner */}
        <div style={{ background:'var(--accent-muted)', border:'1px solid var(--border-accent)', borderRadius:'10px', padding:'14px 18px', marginBottom:'24px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:'1px' }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--accent)', marginBottom:'3px' }}>Admin-only action</p>
            <p style={{ fontSize:'12px', color:'var(--text-2)', lineHeight:1.6 }}>
              Librarians are created directly by Admin. The account is immediately active — no email verification or approval needed. Share the credentials with the librarian.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding:'28px' }}>
          <h3 style={{ fontSize:'15px', fontWeight:'600', marginBottom:'20px', color:'var(--text-1)' }}>Librarian Details</h3>

          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="e.g. Priya Sharma" value={form.name} onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name:''}); }} />
              {errors.name && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.name}</p>}
            </div>

            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="librarian@library.com" value={form.email} onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email:''}); }} />
              {errors.email && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => { setForm({...form, password: e.target.value}); setErrors({...errors, password:''}); }} />
              {errors.password && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.password}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input className="input" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => { setForm({...form, confirmPassword: e.target.value}); setErrors({...errors, confirmPassword:''}); }} />
              {errors.confirmPassword && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Permissions preview */}
            <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'14px' }}>
              <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' }}>Librarian will have access to:</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                {['Add, edit, delete books','Issue & return books','Add new members','Approve user registrations','View all borrow records','Manage reservations'].map(p => (
                  <div key={p} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span style={{ fontSize:'11.5px', color:'var(--text-2)' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ justifyContent:'center', padding:'11px' }}>
              {loading ? 'Creating Account...' : 'Create Librarian Account'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
