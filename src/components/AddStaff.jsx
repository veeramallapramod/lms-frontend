import { useState } from 'react';
import Layout from './Layout';
import API from '../api/axiosInstance';

const ROLE_INFO = {
  LIBRARIAN: {
    color: 'var(--purple)',
    bg: 'var(--purple-muted)',
    border: 'rgba(139,92,246,0.3)',
    perms: ['Add, edit, delete books','Issue & return books','Add new members','Approve user registrations','View all borrow records','Manage reservations'],
    desc: 'Can manage books, issue/return, handle members. Cannot manage subscriptions or create staff.',
  },
  ADMIN: {
    color: 'var(--gold)',
    bg: 'var(--gold-muted)',
    border: 'rgba(245,158,11,0.3)',
    perms: ['Full system access','Manage all users & staff','Add/delete books','Manage subscriptions','Approve registrations','Create Admin & Librarian accounts'],
    desc: 'Has complete system access including creating other admins and librarians.',
  },
};

export default function AddStaff() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', role:'LIBRARIAN' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });

  const config = ROLE_INFO[form.role];

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
      await API.post('/auth/create-staff', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setMsg({ text: `${form.role === 'ADMIN' ? 'Admin' : 'Librarian'} account created for ${form.email}. Login credentials sent via email.`, type:'success' });
      setForm({ name:'', email:'', password:'', confirmPassword:'', role:'LIBRARIAN' });
    } catch (err) {
      setMsg({ text: err.response?.data || 'Failed to create account', type:'error' });
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Add Staff" subtitle="Create Admin or Librarian accounts directly — no registration needed">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'24px', maxWidth:'960px' }}>

        {/* Form */}
        <div className="card" style={{ padding:'28px' }}>
          <h3 style={{ fontSize:'15px', fontWeight:'600', marginBottom:'20px' }}>Staff Account Details</h3>

          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

            {/* Role selector */}
            <div>
              <label className="label">Account Type</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                {['LIBRARIAN','ADMIN'].map(r => (
                  <div key={r} onClick={() => setForm({...form, role:r})} style={{
                    padding:'12px 16px', borderRadius:'10px', cursor:'pointer', border:`2px solid ${form.role===r ? ROLE_INFO[r].color : 'var(--border)'}`,
                    background: form.role===r ? ROLE_INFO[r].bg : 'var(--bg-2)', transition:'all 0.15s',
                    display:'flex', alignItems:'center', gap:'10px',
                  }}>
                    <div style={{ width:'10px', height:'10px', borderRadius:'50%', background: form.role===r ? ROLE_INFO[r].color : 'var(--border)', transition:'all 0.15s', flexShrink:0 }}/>
                    <div>
                      <p style={{ fontSize:'13px', fontWeight:'700', color: form.role===r ? ROLE_INFO[r].color : 'var(--text-1)' }}>{r}</p>
                      <p style={{ fontSize:'10px', color:'var(--text-3)' }}>{r === 'LIBRARIAN' ? 'Manages books & members' : 'Full system access'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="e.g. Priya Sharma" value={form.name} onChange={e => { setForm({...form, name:e.target.value}); setErrors({...errors, name:''}); }}/>
              {errors.name && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.name}</p>}
            </div>

            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="staff@library.com" value={form.email} onChange={e => { setForm({...form, email:e.target.value}); setErrors({...errors, email:''}); }}/>
              {errors.email && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.email}</p>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => { setForm({...form, password:e.target.value}); setErrors({...errors, password:''}); }}/>
                {errors.password && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.password}</p>}
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input className="input" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => { setForm({...form, confirmPassword:e.target.value}); setErrors({...errors, confirmPassword:''}); }}/>
                {errors.confirmPassword && <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{errors.confirmPassword}</p>}
              </div>
            </div>

            <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'12px 14px' }}>
              <p style={{ fontSize:'11px', color:'var(--text-3)', marginBottom:'4px' }}>ℹ️ The account is immediately active. Login credentials will be emailed to the staff member.</p>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ justifyContent:'center', padding:'12px' }}>
              {loading ? 'Creating Account...' : `Create ${form.role === 'ADMIN' ? 'Admin' : 'Librarian'} Account`}
            </button>
          </form>
        </div>

        {/* Right — permissions preview */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div className="card" style={{ padding:'24px', border:`1px solid ${config.border}`, background:config.bg }}>
            <p style={{ fontSize:'11px', fontWeight:'700', color:config.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px' }}>{form.role}</p>
            <p style={{ fontSize:'13px', color:'var(--text-2)', lineHeight:1.6, marginBottom:'16px' }}>{config.desc}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'9px' }}>
              {config.perms.map(p => (
                <div key={p} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span style={{ fontSize:'12.5px', color:'var(--text-2)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning for Admin creation */}
          {form.role === 'ADMIN' && (
            <div style={{ background:'var(--red-muted)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'10px', padding:'14px 16px' }}>
              <p style={{ fontSize:'12px', color:'var(--red)', fontWeight:'600', marginBottom:'4px' }}>⚠️ Admin privileges</p>
              <p style={{ fontSize:'12px', color:'var(--text-2)', lineHeight:1.6 }}>
                This person will have full access including creating other admins. Only create admin accounts for trusted personnel.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
