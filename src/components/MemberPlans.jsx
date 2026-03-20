import { useState } from 'react';
import Layout from './Layout';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';
import RazorpayModal from './RazorpayModal';

const PLANS = [
  { id:'FREE',     name:'Free',     price:'₹0',   period:'forever',   color:'#94a3b8', books:2,  duration:14, features:['2 books at a time','14-day borrow period','Basic catalog access','Email notifications'] },
  { id:'BASIC',    name:'Basic',    price:'₹99',  period:'per month', color:'#3b82f6', books:5,  duration:30, features:['5 books at a time','30-day borrow period','Email notifications','Basic support'] },
  { id:'STANDARD', name:'Standard', price:'₹199', period:'per month', color:'#8b5cf6', books:10, duration:30, popular:true, features:['10 books at a time','30-day borrow period','Priority reservations','Email notifications','Standard support'] },
  { id:'PREMIUM',  name:'Premium',  price:'₹399', period:'per month', color:'#f59e0b', books:20, duration:60, features:['20 books at a time','60-day borrow period','Unlimited reservations','Email + SMS alerts','Premium support','Fine waiver (1/year)'] },
];

export default function MemberPlans() {
  const { user, updateUser } = useAuthStore();
  const currentPlan = user?.subscriptionPlan || 'FREE';
  const [loading,      setLoading]      = useState('');
  const [msg,          setMsg]          = useState({ text:'', type:'' });
  const [razorpayPlan, setRazorpayPlan] = useState(null);
  const [isRenewal,    setIsRenewal]    = useState(false);

  const openPayment = (plan, renewal = false) => {
    setIsRenewal(renewal);
    setRazorpayPlan(plan);
  };

  const handleSubscribe = async (plan) => {
    if (plan.id === currentPlan) return;
    if (plan.id === 'FREE') {
      setLoading(plan.id);
      try {
        const res = await API.post('/auth/subscribe', { email: user.email, plan: plan.id });
        setMsg({ text: res.data, type:'success' });
        updateUser({ subscriptionPlan: plan.id, maxBorrowLimit: plan.books });
      } catch (err) {
        setMsg({ text: err.response?.data || 'Subscription failed', type:'error' });
      } finally {
        setLoading('');
        setTimeout(() => setMsg({ text:'', type:'' }), 4000);
      }
      return;
    }
    openPayment(plan, false);
  };

  const handleRenew = (plan) => openPayment(plan, true);

  const handlePaymentSuccess = async (plan) => {
    setRazorpayPlan(null);
    setLoading(plan.id);
    try {
      const res = await API.post('/auth/subscribe', { email: user.email, plan: plan.id });
      setMsg({
        text: isRenewal ? `✓ ${plan.name} plan renewed successfully!` : `✓ ${res.data}`,
        type: 'success',
      });
      updateUser({ subscriptionPlan: plan.id, maxBorrowLimit: plan.books });
    } catch (err) {
      setMsg({ text: err.response?.data || 'Payment failed', type:'error' });
    } finally {
      setLoading('');
      setIsRenewal(false);
      setTimeout(() => setMsg({ text:'', type:'' }), 5000);
    }
  };

  const activePlanObj = PLANS.find(p => p.id === currentPlan);

  return (
    <Layout title="Subscription Plans" subtitle="Upgrade or renew your plan to borrow more books">

      {razorpayPlan && (
        <RazorpayModal
          mode="subscription"
          planData={{
            planId:   razorpayPlan.id,
            planName: isRenewal ? `${razorpayPlan.name} (Renewal)` : razorpayPlan.name,
            price:    parseInt(razorpayPlan.price.replace('₹', '')),
            books:    razorpayPlan.books,
            email:    user?.email,
            name:     user?.name,
          }}
          onClose={() => { setRazorpayPlan(null); setIsRenewal(false); }}
          onSuccess={() => handlePaymentSuccess(razorpayPlan)}
        />
      )}

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {/* Current plan banner */}
      <div style={{ background:'var(--accent-muted)', border:'1px solid var(--border-accent)', borderRadius:'14px', padding:'18px 22px', marginBottom:'32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)' }}>
            Current Plan: <span style={{ color:'var(--accent)', fontSize:'15px' }}>{currentPlan}</span>
          </p>
          <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'3px' }}>
            Borrow up to <strong>{user?.maxBorrowLimit || 2}</strong> books at a time
            {activePlanObj && activePlanObj.id !== 'FREE' && (
              <span style={{ marginLeft:'8px', color:'var(--text-3)' }}>· {activePlanObj.price}/month</span>
            )}
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'12px', background:'var(--accent)', color:'white', padding:'5px 16px', borderRadius:'20px', fontWeight:'700' }}>
            {currentPlan}
          </span>
          {/* Quick Renew button in banner */}
          {currentPlan !== 'FREE' && activePlanObj && (
            <button
              onClick={() => handleRenew(activePlanObj)}
              style={{
                fontSize:'12px', fontWeight:'700', padding:'7px 18px', borderRadius:'20px',
                border:'2px solid var(--accent)', cursor:'pointer',
                background:'linear-gradient(135deg,#7c6fe0,#5448b8)',
                color:'white', fontFamily:"'DM Sans',sans-serif",
                boxShadow:'0 3px 12px rgba(108,95,199,0.35)',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
            >
              🔄 Renew Plan
            </button>
          )}
        </div>
      </div>

      {/* Plans grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'40px' }}>
        {PLANS.map(plan => {
          const isActive = plan.id === currentPlan;
          return (
            <div key={plan.id} style={{
              background:'var(--bg-card)', borderRadius:'16px', padding:'24px',
              border:`2px solid ${isActive ? plan.color : plan.popular ? plan.color+'44' : 'var(--border)'}`,
              position:'relative', transition:'transform 0.2s, box-shadow 0.2s',
            }}>
              {plan.popular && !isActive && (
                <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:plan.color, color:'white', fontSize:'9px', fontWeight:'700', padding:'3px 12px', borderRadius:'20px', whiteSpace:'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              {isActive && (
                <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:plan.color, color:'white', fontSize:'9px', fontWeight:'700', padding:'3px 12px', borderRadius:'20px', whiteSpace:'nowrap' }}>
                  ✓ YOUR PLAN
                </div>
              )}

              <div style={{ marginBottom:'16px' }}>
                <p style={{ fontSize:'11px', fontWeight:'700', color:plan.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>{plan.name}</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:'3px', marginBottom:'4px' }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', color:'var(--text-1)', lineHeight:1 }}>{plan.price}</span>
                  <span style={{ fontSize:'11px', color:'var(--text-3)' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize:'11px', color:'var(--text-3)' }}>{plan.books} books · {plan.duration} days</p>
              </div>

              <div style={{ height:'1px', background:'var(--border)', marginBottom:'14px' }}/>

              <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'flex-start', gap:'7px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:'2px' }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span style={{ fontSize:'11px', color:'var(--text-2)', lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Button area */}
              {isActive ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {/* Current plan indicator */}
                  <button disabled style={{
                    width:'100%', padding:'10px', borderRadius:'8px', fontSize:'12px',
                    fontWeight:'700', background:plan.color, color:'white',
                    border:'none', cursor:'default', fontFamily:"'DM Sans',sans-serif",
                  }}>
                    ✓ Current Plan
                  </button>
                  {/* Renew button — only for paid plans */}
                  {plan.id !== 'FREE' && (
                    <button
                      onClick={() => handleRenew(plan)}
                      disabled={loading === `renew-${plan.id}`}
                      style={{
                        width:'100%', padding:'10px', borderRadius:'8px', fontSize:'12px',
                        fontWeight:'700', cursor:'pointer', border:`1.5px solid ${plan.color}`,
                        background:'transparent', color:plan.color,
                        fontFamily:"'DM Sans',sans-serif", transition:'all 0.15s',
                        opacity: loading === `renew-${plan.id}` ? 0.6 : 1,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = plan.color; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = plan.color; }}
                    >
                      {loading === `renew-${plan.id}` ? 'Processing...' : '🔄 Renew Plan'}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                  style={{
                    width:'100%', padding:'10px', borderRadius:'8px', fontSize:'12px',
                    fontWeight:'700', cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                    background:'var(--bg-2)', color:'var(--text-1)',
                    border:`1px solid var(--border)`,
                    opacity: loading === plan.id ? 0.6 : 1, transition:'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = plan.color; e.currentTarget.style.color = plan.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-1)'; }}
                >
                  {loading === plan.id ? 'Processing...' : plan.id === 'FREE' ? 'Downgrade to Free' : 'Pay & Subscribe'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="card" style={{ padding:'24px' }}>
        <h3 style={{ fontSize:'15px', fontWeight:'600', marginBottom:'20px' }}>Full Comparison</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th style={{ color:'#94a3b8' }}>Free</th>
                <th style={{ color:'#3b82f6' }}>Basic</th>
                <th style={{ color:'#8b5cf6' }}>Standard</th>
                <th style={{ color:'#f59e0b' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Books at a time',    '2',       '5',        '10',         '20'],
                ['Borrow period',      '14 days', '30 days',  '30 days',    '60 days'],
                ['Reservations',       'Limited', 'Limited',  'Priority',   'Unlimited'],
                ['Email notifications','✓',       '✓',        '✓',          '✓'],
                ['Fine waiver',        '✗',       '✗',        '✗',          '1/year'],
                ['Support',            'Basic',   'Basic',    'Standard',   'Premium'],
                ['Monthly price',      '₹0',      '₹99',      '₹199',       '₹399'],
              ].map(([feature, ...vals]) => (
                <tr key={feature}>
                  <td style={{ fontWeight:'500' }}>{feature}</td>
                  {vals.map((v, i) => (
                    <td key={i} style={{ color: v==='✗' ? 'var(--text-3)' : v==='✓' ? 'var(--green)' : 'var(--text-1)', fontWeight: v==='✓'||v==='✗' ? '700' : '400' }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop:'24px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px 24px' }}>
        <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)', marginBottom:'8px' }}>📋 How subscription works</p>
        <p style={{ fontSize:'13px', color:'var(--text-2)', lineHeight:1.7 }}>
          Your plan controls how many books you can borrow <strong>at the same time</strong>.
          Hit <strong>Renew Plan</strong> on your current plan card (or the banner above) to extend it for another cycle via Razorpay.
          Upgrade anytime — your new limit applies immediately after payment.
        </p>
      </div>
    </Layout>
  );
}
