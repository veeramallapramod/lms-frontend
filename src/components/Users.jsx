import { useEffect, useState } from 'react';
import Layout from './Layout';
import useUserStore from '../store/userStore';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';

const PLAN_COLORS = { FREE:'#94a3b8', BASIC:'#3b82f6', STANDARD:'#8b5cf6', PREMIUM:'#7c6fe0' };

export default function Users() {
  const { users, fetchAllUsers, loading } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const role = currentUser?.role;

  const [filter,      setFilter]      = useState('ALL');
  const [search,      setSearch]      = useState('');
  const [editUser,    setEditUser]    = useState(null);  // user being edited
  const [deleteId,    setDeleteId]    = useState(null);
  const [editForm,    setEditForm]    = useState({ name:'', email:'', phone:'', subscriptionPlan:'' });
  const [editErrors,  setEditErrors]  = useState({});
  const [editMsg,     setEditMsg]     = useState({ text:'', type:'' });
  const [saving,      setSaving]      = useState(false);

  useEffect(() => { fetchAllUsers(); }, []);

  /* ── filter + search ── */
  const filtered = users.filter(u => {
    const matchRole   = filter === 'ALL' || u.role === filter;
    const q           = search.toLowerCase();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const tabs = ['ALL','ADMIN','LIBRARIAN','MEMBER'];

  /* ── open edit modal ── */
  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ name: u.name||'', email: u.email||'', phone: u.phone||'', subscriptionPlan: u.subscriptionPlan||'FREE' });
    setEditErrors({});
    setEditMsg({ text:'', type:'' });
  };

  /* ── validate edit form ── */
  const validateEdit = () => {
    const e = {};
    if (!editForm.name.trim())  e.name  = 'Name is required';
    if (!editForm.email.trim()) e.email = 'Email is required';
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) e.email = 'Invalid email format';
    if (editForm.phone && !/^\d{10}$/.test(editForm.phone.replace(/\s/g,''))) e.phone = '10-digit number required';
    return e;
  };

  /* ── save edit ── */
  const handleSave = async () => {
    const errs = validateEdit();
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    setSaving(true);
    try {
      await API.put(`/auth/users/${editUser.id}`, editForm);
      setEditMsg({ text:'Member updated successfully!', type:'success' });
      fetchAllUsers();
      setTimeout(() => setEditUser(null), 1200);
    } catch (err) {
      setEditMsg({ text: err.response?.data || 'Update failed', type:'error' });
    } finally { setSaving(false); }
  };

  /* ── soft delete ── */
  const handleDelete = async (userId) => {
    if (!window.confirm('Deactivate this user? They will not be able to login.')) return;
    setDeleteId(userId);
    try {
      await API.put(`/auth/users/${userId}/deactivate`);
      fetchAllUsers();
    } catch (err) { alert(err.response?.data || 'Failed'); }
    finally { setDeleteId(null); }
  };

  const Field = ({ label, name, type='text', placeholder, required }) => (
    <div>
      <label style={{ fontSize:'12px', fontWeight:'600', color:'var(--text-2)', display:'block', marginBottom:'5px' }}>
        {label}{required && <span style={{ color:'var(--red)', marginLeft:'2px' }}>*</span>}
      </label>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={editForm[name]}
        onChange={e => { setEditForm({ ...editForm, [name]: e.target.value }); setEditErrors({ ...editErrors, [name]:'' }); }}
        style={{ borderColor: editErrors[name] ? 'var(--red)' : undefined }}
      />
      {editErrors[name] && <p style={{ color:'var(--red)', fontSize:'11px', marginTop:'4px' }}>⚠ {editErrors[name]}</p>}
    </div>
  );

  return (
    <Layout title="User Management" subtitle={`${users.length} users · ${filtered.length} shown`}>

      {/* ── TOP BAR: search + filter tabs ── */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap', alignItems:'center' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:2, minWidth:'220px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="input" placeholder="Search by name, email or phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:'34px' }}/>
        </div>

        {/* Role filter tabs */}
        <div style={{ display:'flex', gap:'4px', background:'var(--bg-card)', padding:'4px', borderRadius:'10px', border:'1px solid var(--border)' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} style={{
              padding:'7px 14px', borderRadius:'7px', border:'none', cursor:'pointer',
              fontSize:'12px', fontWeight:'500', fontFamily:"'DM Sans',sans-serif",
              background: filter===tab ? 'var(--accent)' : 'transparent',
              color: filter===tab ? 'white' : 'var(--text-2)', transition:'all 0.15s', whiteSpace:'nowrap',
            }}>
              {tab} {tab!=='ALL' && `(${users.filter(u=>u.role===tab).length})`}
            </button>
          ))}
        </div>

        {search && (
          <button className="btn-secondary" onClick={() => setSearch('')} style={{ fontSize:'12px' }}>Clear</button>
        )}
      </div>

      {/* ── STATS SUMMARY ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'20px' }}>
        {[
          { label:'Total Users',   value: users.length,                                color:'var(--accent)' },
          { label:'Members',       value: users.filter(u=>u.role==='MEMBER').length,   color:'var(--purple)' },
          { label:'Pending',       value: users.filter(u=>u.status==='PENDING').length, color:'var(--yellow)' },
          { label:'Active',        value: users.filter(u=>u.status==='APPROVED').length,color:'var(--green)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:'14px 18px', display:'flex', gap:'12px', alignItems:'center' }}>
            <div style={{ width:'8px', height:'36px', borderRadius:'4px', background:s.color, flexShrink:0 }}/>
            <div>
              <p style={{ fontSize:'22px', fontWeight:'800', color:'var(--text-1)', fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:'11px', color:'var(--text-2)', marginTop:'2px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="card">
        {loading ? (
          <div style={{ padding:'48px', textAlign:'center', color:'var(--text-2)' }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:'48px', textAlign:'center', color:'var(--text-3)' }}>No users found matching your search</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Verified</th>
                  {role === 'ADMIN' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    {/* User info */}
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'var(--accent-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700', color:'var(--accent)', flexShrink:0 }}>
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p style={{ fontWeight:'600', color:'var(--text-1)', fontSize:'13px' }}>
                            {u.name}
                            {u.email === currentUser?.email && (
                              <span style={{ marginLeft:'6px', fontSize:'9px', background:'var(--accent-muted)', color:'var(--accent)', padding:'1px 6px', borderRadius:'4px', fontWeight:'700' }}>YOU</span>
                            )}
                          </p>
                          <p style={{ fontSize:'11px', color:'var(--text-2)', marginTop:'1px' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td><span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role}</span></td>

                    {/* Phone */}
                    <td style={{ fontSize:'13px', color: u.phone ? 'var(--text-1)' : 'var(--text-3)' }}>
                      {u.phone || '—'}
                    </td>

                    {/* Plan */}
                    <td>
                      {u.role === 'MEMBER' ? (
                        <span style={{ fontSize:'11px', fontWeight:'700', color: PLAN_COLORS[u.subscriptionPlan] || '#94a3b8',
                          background: (PLAN_COLORS[u.subscriptionPlan] || '#94a3b8') + '18',
                          padding:'3px 8px', borderRadius:'20px', border:`1px solid ${(PLAN_COLORS[u.subscriptionPlan]||'#94a3b8')}30` }}>
                          {u.subscriptionPlan === 'PREMIUM' ? '⭐ ' : ''}{u.subscriptionPlan || 'FREE'}
                        </span>
                      ) : <span style={{ color:'var(--text-3)', fontSize:'12px' }}>—</span>}
                    </td>

                    {/* Status */}
                    <td><span className={`badge badge-${u.status?.toLowerCase()}`}>{u.status}</span></td>

                    {/* Join date */}
                    <td style={{ fontSize:'12px', color:'var(--text-2)' }}>
                      {u.joinDate || '—'}
                    </td>

                    {/* Email verified */}
                    <td>
                      <span style={{ fontSize:'12px', color: u.enabled ? 'var(--green)' : 'var(--text-3)', fontWeight: u.enabled ? '600':'400' }}>
                        {u.enabled ? '✓ Verified' : '✕ Pending'}
                      </span>
                    </td>

                    {/* Actions — admin only */}
                    {role === 'ADMIN' && (
                      <td>
                        <div style={{ display:'flex', gap:'6px' }}>
                          <button className="btn-secondary" style={{ fontSize:'11px', padding:'5px 10px' }}
                            onClick={() => openEdit(u)}>
                            ✏️ Edit
                          </button>
                          {u.email !== currentUser?.email && (
                            <button className="btn-danger" style={{ fontSize:'11px', padding:'5px 10px' }}
                              onClick={() => handleDelete(u.id)} disabled={deleteId === u.id}>
                              {deleteId === u.id ? '...' : '🗑️'}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {editUser && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'24px' }}
          onClick={() => setEditUser(null)}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'20px', padding:'32px', maxWidth:'480px', width:'100%', maxHeight:'90vh', overflowY:'auto' }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <div>
                <h2 style={{ fontSize:'18px', fontWeight:'700', color:'var(--text-1)' }}>Edit Member</h2>
                <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'2px' }}>Update member information</p>
              </div>
              <button onClick={() => setEditUser(null)}
                style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'8px', width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-2)', fontSize:'14px' }}>✕</button>
            </div>

            {editMsg.text && <div className={`alert alert-${editMsg.type}`} style={{ marginBottom:'16px' }}>{editMsg.text}</div>}

            {/* Avatar */}
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px', padding:'14px', background:'var(--bg-2)', borderRadius:'12px' }}>
              <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'var(--accent-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'700', color:'var(--accent)', flexShrink:0 }}>
                {editUser.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-1)' }}>{editUser.name}</p>
                <div style={{ display:'flex', gap:'6px', marginTop:'4px' }}>
                  <span className={`badge badge-${editUser.role?.toLowerCase()}`} style={{ fontSize:'9px' }}>{editUser.role}</span>
                  <span className={`badge badge-${editUser.status?.toLowerCase()}`} style={{ fontSize:'9px' }}>{editUser.status}</span>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <Field label="Full Name"     name="name"  placeholder="Enter full name"      required />
              <Field label="Email Address" name="email" type="email" placeholder="email@example.com" required />
              <Field label="Phone Number"  name="phone" type="tel"  placeholder="10-digit mobile number" />

              {/* Subscription plan — only for members */}
              {editUser.role === 'MEMBER' && (
                <div>
                  <label style={{ fontSize:'12px', fontWeight:'600', color:'var(--text-2)', display:'block', marginBottom:'5px' }}>Subscription Plan</label>
                  <select value={editForm.subscriptionPlan}
                    onChange={e => setEditForm({ ...editForm, subscriptionPlan: e.target.value })}
                    style={{ width:'100%', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px 14px', color:'var(--text-1)', fontFamily:"'DM Sans',sans-serif", fontSize:'14px', outline:'none' }}>
                    <option value="FREE">Free — 2 books max</option>
                    <option value="BASIC">Basic — 5 books max</option>
                    <option value="STANDARD">Standard — 10 books max</option>
                    <option value="PREMIUM">Premium — 20 books max</option>
                  </select>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display:'flex', gap:'10px', marginTop:'24px' }}>
              <button className="btn-secondary" onClick={() => setEditUser(null)} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex:2, justifyContent:'center' }}>
                {saving ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
