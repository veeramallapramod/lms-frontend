import { useState } from 'react';
import Layout from './Layout';
import API from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const PLAN_INFO = {
  FREE:     { label:'Free',     price:'₹0/mo',   books:2,  color:'#94a3b8' },
  BASIC:    { label:'Basic',    price:'₹99/mo',  books:5,  color:'#3b82f6' },
  STANDARD: { label:'Standard', price:'₹199/mo', books:10, color:'#8b5cf6' },
  PREMIUM:  { label:'Premium',  price:'₹399/mo', books:20, color:'#c8a55a' },
};

export default function AddMember() {
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    subscriptionPlan: 'FREE',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState({ text:'', type:'' });
  const [created, setCreated] = useState(null); // last created member info

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                                        e.name     = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g,''))) e.phone = '10-digit phone number required';
    if (!form.password || form.password.length < 6)              e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword)                  e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMsg({ text:'', type:'' });
    try {
      const res = await API.post('/auth/create-member', {
        name:             form.name.trim(),
        email:            form.email.trim(),
        phone:            form.phone.trim(),
        password:         form.password,
        subscriptionPlan: form.subscriptionPlan,
        createdBy:        user?.role,
      });
      setCreated({ name: form.name, email: form.email, plan: form.subscriptionPlan });
      setMsg({ text: res.data || `Member account created! Login credentials sent to ${form.email}`, type:'success' });
      setForm({ name:'', email:'', phone:'', password:'', confirmPassword:'', subscriptionPlan:'FREE' });
    } catch (err) {
      setMsg({ text: err.response?.data || 'Failed to create member account', type:'error' });
    } finally { setLoading(false); }
  };

  const selectedPlan = PLAN_INFO[form.subscriptionPlan];

  return (
    <Layout title="Add Offline Member" subtitle="Register a walk-in member directly — credentials sent to their email">

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'24px', maxWidth:'960px' }}>

        {/* ── FORM ── */}
        <div className="card" style={{ padding:'28px' }}>

          {/* Header strip */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'22px', paddingBottom:'18px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
              👤
            </div>
            <div>
              <h3 style={{ fontSize:'15px', fontWeight:'700', color:'var(--text-1)', margin:0 }}>New Member Registration</h3>
              <p style={{ fontSize:'12px', color:'var(--text-3)', margin:0 }}>Walk-in / offline registration by {user?.role?.toLowerCase()}</p>
            </div>
          </div>

          {msg.text && (
            <div className={`alert alert-${msg.type}`} style={{ marginBottom:'18px' }}>
              {msg.type === 'success' ? '✅ ' : '❌ '}{msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Name + Phone */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label className="label">Full Name <Req/></label>
                <input className="input" placeholder="e.g. Rahul Verma" value={form.name} onChange={e => set('name', e.target.value)}/>
                {errors.name && <Err>{errors.name}</Err>}
              </div>
              <div>
                <label className="label">Phone Number <Req/></label>
                <input className="input" placeholder="10-digit mobile" value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" maxLength={10}/>
                {errors.phone && <Err>{errors.phone}</Err>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address <Req/></label>
              <input className="input" type="email" placeholder="member@gmail.com" value={form.email} onChange={e => set('email', e.target.value)}/>
              {errors.email && <Err>{errors.email}</Err>}
            </div>

            {/* Passwords */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label className="label">Set Password <Req/></label>
                <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)}/>
                {errors.password && <Err>{errors.password}</Err>}
              </div>
              <div>
                <label className="label">Confirm Password <Req/></label>
                <input className="input" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}/>
                {errors.confirmPassword && <Err>{errors.confirmPassword}</Err>}
              </div>
            </div>

            {/* Subscription Plan */}
            <div>
              <label className="label">Subscription Plan</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                {Object.entries(PLAN_INFO).map(([id, p]) => (
                  <div key={id} onClick={() => set('subscriptionPlan', id)}
                    style={{
                      padding:'10px 8px', borderRadius:'10px', cursor:'pointer', textAlign:'center',
                      border:`2px solid ${form.subscriptionPlan===id ? p.color : 'var(--border)'}`,
                      background: form.subscriptionPlan===id ? p.color+'18' : 'var(--bg-2)',
                      transition:'all 0.15s',
                    }}>
                    <p style={{ fontSize:'12px', fontWeight:'700', color: form.subscriptionPlan===id ? p.color : 'var(--text-2)', margin:'0 0 2px' }}>{p.label}</p>
                    <p style={{ fontSize:'10px', color:'var(--text-3)', margin:0 }}>{p.books} books</p>
                    <p style={{ fontSize:'10px', color: form.subscriptionPlan===id ? p.color : 'var(--text-3)', fontWeight:'600', margin:'3px 0 0' }}>{p.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info note */}
            <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'12px 14px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
              <span style={{ fontSize:'14px', flexShrink:0 }}>📧</span>
              <p style={{ fontSize:'12px', color:'var(--text-2)', lineHeight:1.6, margin:0 }}>
                The member's account will be <strong style={{ color:'var(--green)' }}>immediately active</strong> — no OTP verification or admin approval needed.
                Login credentials (email + password) will be sent directly to their email address.
              </p>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}
              style={{ justifyContent:'center', padding:'12px', fontSize:'14px' }}>
              {loading
                ? '⏳ Creating Account...'
                : '➕ Create Member Account & Send Credentials'}
            </button>
          </form>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Plan preview */}
          <div className="card" style={{ padding:'22px', borderTop:`3px solid ${selectedPlan.color}` }}>
            <p style={{ fontSize:'10px', fontWeight:'700', color:selectedPlan.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>
              {selectedPlan.label} Plan Selected
            </p>
            <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'14px' }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', color:'var(--text-1)' }}>{selectedPlan.price}</span>
            </div>
            {[
              `Up to ${selectedPlan.books} books at a time`,
              'Immediate account activation',
              'Email + login credentials sent',
              'Can borrow, reserve & renew',
            ].map(f => (
              <div key={f} style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={selectedPlan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span style={{ fontSize:'12px', color:'var(--text-2)' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Last created */}
          {created && (
            <div style={{ background:'var(--green-muted)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:'12px', padding:'16px 18px' }}>
              <p style={{ fontSize:'12px', fontWeight:'700', color:'var(--green)', marginBottom:'10px' }}>✓ Last Created</p>
              <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)', margin:'0 0 3px' }}>{created.name}</p>
              <p style={{ fontSize:'12px', color:'var(--text-2)', margin:'0 0 3px' }}>{created.email}</p>
              <span style={{ fontSize:'10px', fontWeight:'700', color:'var(--green)', background:'rgba(16,185,129,0.15)', padding:'2px 8px', borderRadius:'5px' }}>
                {created.plan} plan
              </span>
            </div>
          )}

          {/* Who can do this */}
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px 18px' }}>
            <p style={{ fontSize:'12px', fontWeight:'600', color:'var(--text-1)', marginBottom:'10px' }}>🔐 Access</p>
            {[
              { role:'ADMIN',     color:'var(--gold)',   note:'Full access' },
              { role:'LIBRARIAN', color:'var(--purple)', note:'Can add members only' },
            ].map(a => (
              <div key={a.role} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'7px' }}>
                <span className={`badge badge-${a.role.toLowerCase()}`} style={{ fontSize:'9px' }}>{a.role}</span>
                <span style={{ fontSize:'11px', color:'var(--text-3)' }}>{a.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// helpers
function Req() {
  return <span style={{ color:'var(--red)', marginLeft:'2px' }}>*</span>;
}
function Err({ children }) {
  return <p style={{ color:'var(--red)', fontSize:'12px', marginTop:'4px' }}>{children}</p>;
}
