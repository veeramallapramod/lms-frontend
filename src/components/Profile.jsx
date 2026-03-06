import { useState } from 'react';
import Layout from './Layout';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';

export default function Profile() {
  const { user, setToken } = useAuthStore();
  const role = user?.role;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [msg, setMsg] = useState({ text:'', type:'' });
  const [pwMsg, setPwMsg] = useState({ text:'', type:'' });
  const [tab, setTab] = useState('profile');

  const roleConfig = {
    ADMIN:     { color:'var(--gold)',   bg:'var(--gold-muted)',   label:'Administrator', icon:'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z', perms:['Full system access','Manage all users','Add/delete books','Manage subscriptions','Approve registrations'] },
    LIBRARIAN: { color:'var(--purple)', bg:'var(--purple-muted)', label:'Librarian',      icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87', perms:['Issue & return books','Add/delete books','Add members','Approve users','View all records'] },
    MEMBER:    { color:'var(--accent)', bg:'var(--accent-muted)', label:'Member',         icon:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', perms:['Browse book catalog','Reserve books','View borrow history','Receive notifications'] },
  };

  const config = roleConfig[role] || roleConfig.MEMBER;

  const handleSave = async () => {
    setMsg({ text:'Profile updated! (UI only — connect to API)', type:'success' });
    setEditing(false);
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ text:'Passwords do not match', type:'error' }); return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ text:'Password must be at least 6 characters', type:'error' }); return;
    }
    try {
      await API.post('/auth/change-password', {
        email: user.email,
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      setPwMsg({ text:'Password changed successfully!', type:'success' });
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) {
      setPwMsg({ text: err.response?.data || 'Failed to change password', type:'error' });
    }
    setTimeout(() => setPwMsg({ text:'', type:'' }), 3000);
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'U';

  return (
    <Layout title="My Profile" subtitle="Manage your account details">
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'24px', maxWidth:'1000px' }}>

        {/* Left — Profile Card */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* Avatar card */}
          <div className="card" style={{ padding:'28px', textAlign:'center' }}>
            {/* Avatar circle */}
            <div style={{ width:'88px', height:'88px', borderRadius:'50%', background:`linear-gradient(135deg, ${config.color}, ${config.color}88)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px', fontWeight:'800', color:'white', border:`3px solid ${config.color}44`, boxShadow:`0 0 0 6px ${config.color}11` }}>
              {initials}
            </div>
            <h2 style={{ fontSize:'18px', fontWeight:'700', color:'var(--text-1)', marginBottom:'4px' }}>{user?.name}</h2>
            <p style={{ fontSize:'13px', color:'var(--text-2)', marginBottom:'12px' }}>{user?.email}</p>
            <span className={`badge badge-${role?.toLowerCase()}`} style={{ fontSize:'12px', padding:'4px 14px' }}>{config.label}</span>

            <div style={{ marginTop:'20px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'center', gap:'6px', alignItems:'center' }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--green)' }}/>
                <span style={{ fontSize:'12px', color:'var(--green)', fontWeight:'600' }}>Account Active</span>
              </div>
            </div>
          </div>

          {/* Role permissions */}
          <div className="card" style={{ padding:'20px' }}>
            <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'14px' }}>Your Permissions</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {config.perms.map(p => (
                <div key={p} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span style={{ fontSize:'12.5px', color:'var(--text-2)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Tabs */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* Tab switcher */}
          <div style={{ display:'flex', gap:'4px', background:'var(--bg-card)', padding:'4px', borderRadius:'10px', border:'1px solid var(--border)', width:'fit-content' }}>
            {[['profile','Profile Info'],['password','Change Password'],['activity','Activity']].map(([key,label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ padding:'8px 20px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', fontFamily:'Plus Jakarta Sans, sans-serif', background: tab===key ? 'var(--accent)' : 'transparent', color: tab===key ? 'white' : 'var(--text-2)', transition:'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Profile Info Tab */}
          {tab === 'profile' && (
            <div className="card" style={{ padding:'28px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                <h3 style={{ fontSize:'16px', fontWeight:'600' }}>Personal Information</h3>
                <button onClick={() => setEditing(!editing)} className={editing ? 'btn-secondary' : 'btn-primary'} style={{ fontSize:'13px', padding:'7px 16px' }}>
                  {editing ? 'Cancel' : '✏️ Edit Profile'}
                </button>
              </div>
              {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                {[
                  { label:'Full Name', key:'name', value:form.name },
                  { label:'Email Address', key:'email', value:form.email },
                ].map(field => (
                  <div key={field.key}>
                    <label className="label">{field.label}</label>
                    {editing ? (
                      <input className="input" value={field.value} onChange={e => setForm({...form, [field.key]: e.target.value})} />
                    ) : (
                      <div style={{ padding:'10px 14px', background:'var(--bg-2)', borderRadius:'8px', fontSize:'14px', color:'var(--text-1)', border:'1px solid var(--border)' }}>
                        {field.value}
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <label className="label">Role</label>
                  <div style={{ padding:'10px 14px', background:'var(--bg-2)', borderRadius:'8px', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'8px' }}>
                    <span className={`badge badge-${role?.toLowerCase()}`}>{config.label}</span>
                    <span style={{ fontSize:'12px', color:'var(--text-3)' }}>Role is assigned by admin</span>
                  </div>
                </div>
                {editing && (
                  <button className="btn-primary" onClick={handleSave} style={{ alignSelf:'flex-start', padding:'10px 24px' }}>Save Changes</button>
                )}
              </div>
            </div>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <div className="card" style={{ padding:'28px' }}>
              <h3 style={{ fontSize:'16px', fontWeight:'600', marginBottom:'24px' }}>Change Password</h3>
              {pwMsg.text && <div className={`alert alert-${pwMsg.type}`}>{pwMsg.text}</div>}
              <form onSubmit={handlePasswordChange} style={{ display:'flex', flexDirection:'column', gap:'16px', maxWidth:'400px' }}>
                {[
                  { label:'Current Password', key:'currentPassword' },
                  { label:'New Password', key:'newPassword' },
                  { label:'Confirm New Password', key:'confirmPassword' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="label">{f.label}</label>
                    <input className="input" type="password" value={pwForm[f.key]} onChange={e => setPwForm({...pwForm, [f.key]: e.target.value})} placeholder="••••••••" />
                  </div>
                ))}
                <div style={{ background:'var(--accent-muted)', border:'1px solid var(--border-accent)', borderRadius:'8px', padding:'12px 14px' }}>
                  <p style={{ fontSize:'12px', color:'var(--accent)', fontWeight:'600', marginBottom:'4px' }}>Password requirements:</p>
                  <p style={{ fontSize:'12px', color:'var(--text-2)' }}>Minimum 6 characters</p>
                </div>
                <button className="btn-primary" type="submit" style={{ alignSelf:'flex-start', padding:'10px 24px' }}>Update Password</button>
              </form>
            </div>
          )}

          {/* Activity Tab */}
          {tab === 'activity' && (
            <div className="card" style={{ padding:'28px' }}>
              <h3 style={{ fontSize:'16px', fontWeight:'600', marginBottom:'24px' }}>Recent Activity</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
                {[
                  { action:'Logged in', time:'Just now', icon:'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3', color:'var(--green)' },
                  { action:'Profile viewed', time:'2 min ago', icon:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', color:'var(--accent)' },
                  { action:'Account created', time:'Recently', icon:'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3', color:'var(--purple)' },
                ].map((a,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:`${a.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon}/></svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:'13px', fontWeight:'500', color:'var(--text-1)' }}>{a.action}</p>
                      <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'2px' }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
