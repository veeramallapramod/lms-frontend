import { useState } from 'react';
import Layout from './Layout';

const PLANS = [
  { id:1, name:'Basic', price:'₹99', period:'per month', color:'var(--accent)', books:5, duration:30, features:['5 books at a time','30-day borrow period','Email notifications','Basic support'] },
  { id:2, name:'Standard', price:'₹199', period:'per month', color:'var(--purple)', books:10, duration:30, features:['10 books at a time','30-day borrow period','Priority reservations','Email notifications','Standard support'], popular:true },
  { id:3, name:'Premium', price:'₹399', period:'per month', color:'var(--gold)', books:20, duration:60, features:['20 books at a time','60-day borrow period','Unlimited reservations','Email + SMS alerts','Premium support','Fine waiver (1/year)'] },
];

const SUBSCRIBERS = [
  { id:1, name:'Rahul Sharma', email:'rahul@example.com', plan:'Standard', status:'Active', expiry:'2026-04-15', amount:'₹199' },
  { id:2, name:'Priya Nair', email:'priya@example.com', plan:'Premium', status:'Active', expiry:'2026-03-20', amount:'₹399' },
  { id:3, name:'Amit Kumar', email:'amit@example.com', plan:'Basic', status:'Expired', expiry:'2026-02-01', amount:'₹99' },
  { id:4, name:'Sneha Rao', email:'sneha@example.com', plan:'Standard', status:'Active', expiry:'2026-05-10', amount:'₹199' },
];

export default function Subscriptions() {
  const [tab, setTab] = useState('plans');
  const [editPlan, setEditPlan] = useState(null);
  const [msg, setMsg] = useState('');

  const handleSavePlan = () => {
    setMsg('Plan updated successfully!');
    setEditPlan(null);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <Layout title="Subscriptions" subtitle="Manage library membership plans">

      {msg && <div className="alert alert-success" style={{ marginBottom:'20px' }}>{msg}</div>}

      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', background:'var(--bg-card)', padding:'4px', borderRadius:'10px', border:'1px solid var(--border)', width:'fit-content', marginBottom:'24px' }}>
        {[['plans','Membership Plans'],['subscribers','Subscribers'],['revenue','Revenue']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding:'8px 20px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', fontFamily:'Plus Jakarta Sans, sans-serif', background: tab===key ? 'var(--accent)' : 'transparent', color: tab===key ? 'white' : 'var(--text-2)', transition:'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      {tab === 'plans' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'24px' }}>
            {PLANS.map(plan => (
              <div key={plan.id} className="card" style={{ padding:'28px', position:'relative', border: plan.popular ? '1px solid var(--purple)' : '1px solid var(--border)' }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'var(--purple)', color:'white', fontSize:'10px', fontWeight:'700', padding:'3px 12px', borderRadius:'20px', letterSpacing:'0.05em' }}>MOST POPULAR</div>
                )}
                <div style={{ marginBottom:'20px' }}>
                  <span style={{ fontSize:'11px', fontWeight:'700', color:plan.color, textTransform:'uppercase', letterSpacing:'0.1em' }}>{plan.name}</span>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'4px', margin:'8px 0' }}>
                    <span style={{ fontFamily:'Instrument Serif, serif', fontSize:'36px', color:'var(--text-1)' }}>{plan.price}</span>
                    <span style={{ fontSize:'12px', color:'var(--text-3)' }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize:'12px', color:'var(--text-2)' }}>{plan.books} books · {plan.duration}-day borrow</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      <span style={{ fontSize:'12px', color:'var(--text-2)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setEditPlan(plan)} className="btn-secondary" style={{ width:'100%', justifyContent:'center', fontSize:'13px' }}>Edit Plan</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {tab === 'subscribers' && (
        <div className="card">
          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'var(--border)', borderBottom:'1px solid var(--border)' }}>
            {[
              { label:'Total Subscribers', value:SUBSCRIBERS.length },
              { label:'Active', value:SUBSCRIBERS.filter(s=>s.status==='Active').length },
              { label:'Expired', value:SUBSCRIBERS.filter(s=>s.status==='Expired').length },
              { label:'Monthly Revenue', value:'₹797' },
            ].map(s => (
              <div key={s.label} style={{ background:'var(--bg-card)', padding:'16px 20px', textAlign:'center' }}>
                <p style={{ fontFamily:'Instrument Serif, serif', fontSize:'26px', color:'var(--text-1)' }}>{s.value}</p>
                <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'2px' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {SUBSCRIBERS.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--accent-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color:'var(--accent)', flexShrink:0 }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize:'13px', fontWeight:'500', color:'var(--text-1)' }}>{s.name}</p>
                          <p style={{ fontSize:'11px', color:'var(--text-2)' }}>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize:'12px', fontWeight:'600', color:'var(--accent)' }}>{s.plan}</span></td>
                    <td><span className={`badge ${s.status==='Active' ? 'badge-approved' : 'badge-rejected'}`}>{s.status}</span></td>
                    <td style={{ fontSize:'13px', color:'var(--text-2)' }}>{s.expiry}</td>
                    <td style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)' }}>{s.amount}</td>
                    <td>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button className="btn-secondary" style={{ fontSize:'11px', padding:'5px 10px' }}>Renew</button>
                        {s.status === 'Active' && <button className="btn-danger" style={{ fontSize:'11px', padding:'5px 10px' }}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {tab === 'revenue' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {[
            { label:'Total Revenue', value:'₹12,450', sub:'All time', color:'var(--green)', icon:'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
            { label:'This Month', value:'₹797', sub:'Feb 2026', color:'var(--accent)', icon:'M3 3h18v18H3zM3 9h18M9 21V9' },
            { label:'Active Plans', value:'3', sub:'Basic, Standard, Premium', color:'var(--purple)', icon:'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background:`${s.color}18` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}/></svg>
              </div>
              <div>
                <p style={{ fontSize:'28px', fontWeight:'700', color:'var(--text-1)', fontFamily:'Instrument Serif, serif', lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:'13px', color:'var(--text-2)', marginTop:'2px' }}>{s.label}</p>
                <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'1px' }}>{s.sub}</p>
              </div>
            </div>
          ))}
          <div className="card" style={{ gridColumn:'1/-1', padding:'24px' }}>
            <p style={{ fontSize:'14px', fontWeight:'600', marginBottom:'16px' }}>Revenue by Plan</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { name:'Basic', amount:99, total:297, color:'var(--accent)', count:3 },
                { name:'Standard', amount:199, total:398, color:'var(--purple)', count:2 },
                { name:'Premium', amount:399, total:399, color:'var(--gold)', count:1 },
              ].map(p => (
                <div key={p.name} style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                  <span style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)', width:'80px' }}>{p.name}</span>
                  <div style={{ flex:1, height:'8px', background:'var(--bg-2)', borderRadius:'4px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(p.total/797)*100}%`, background:p.color, borderRadius:'4px' }}/>
                  </div>
                  <span style={{ fontSize:'13px', color:'var(--text-2)', width:'60px', textAlign:'right' }}>₹{p.total}</span>
                  <span style={{ fontSize:'12px', color:'var(--text-3)', width:'50px' }}>{p.count} subs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editPlan && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'32px', maxWidth:'400px', width:'100%', margin:'24px' }}>
            <h2 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'20px' }}>Edit {editPlan.name} Plan</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div><label className="label">Plan Name</label><input className="input" defaultValue={editPlan.name} /></div>
              <div><label className="label">Price (₹)</label><input className="input" defaultValue={editPlan.price.replace('₹','')} type="number" /></div>
              <div><label className="label">Max Books</label><input className="input" defaultValue={editPlan.books} type="number" /></div>
              <div><label className="label">Borrow Duration (days)</label><input className="input" defaultValue={editPlan.duration} type="number" /></div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button className="btn-primary" onClick={handleSavePlan} style={{ flex:1, justifyContent:'center' }}>Save Changes</button>
              <button className="btn-secondary" onClick={() => setEditPlan(null)} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
