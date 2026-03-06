import { useEffect, useState } from 'react';
import Layout from './Layout';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';

export default function MyBorrows() {
  const { user, updateUser } = useAuthStore();
  const [borrows, setBorrows]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab,     setTab]       = useState('active');

  useEffect(() => {
    const init = async () => {
      let uid = user?.id;
      // If id missing, fetch it
      if (!uid && user?.email) {
        try {
          const res = await API.get('/auth/users');
          const found = res.data.find(u => u.email === user.email);
          if (found?.id) { uid = found.id; updateUser({ id: found.id }); }
        } catch {}
      }
      if (uid) fetchMyBorrows(uid);
      else setLoading(false);
    };
    init();
  }, []);

  const fetchMyBorrows = async (uid) => {
    setLoading(true);
    try {
      const res = await API.get(`/borrow/history/${uid}`);
      setBorrows(res.data);
    } catch { } finally { setLoading(false); }
  };

  const active    = borrows.filter(b => !b.returned);
  const history   = borrows.filter(b =>  b.returned);
  const displayed = tab === 'active' ? active : history;

  const daysLeft = (dueDate) => {
    const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000*60*60*24));
    return diff;
  };

  const isOverdue = (b) => !b.returned && new Date(b.dueDate) < new Date();

  const urgencyColor = (days) => {
    if (days < 0)  return { color:'var(--red)',    bg:'var(--red-muted)' };
    if (days <= 2) return { color:'var(--yellow)',  bg:'var(--yellow-muted)' };
    if (days <= 5) return { color:'var(--orange)',  bg:'var(--orange-muted)' };
    return              { color:'var(--green)',   bg:'var(--green-muted)' };
  };

  return (
    <Layout title="My Borrowed Books" subtitle="Track your active borrows and return deadlines">

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Currently Borrowed', value: active.length,  color:'var(--accent)',  bg:'var(--accent-muted)' },
          { label:'Overdue Books',       value: active.filter(b=>isOverdue(b)).length, color:'var(--red)', bg:'var(--red-muted)' },
          { label:'Total Returned',      value: history.length, color:'var(--green)',  bg:'var(--green-muted)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ width:'10px', height:'40px', borderRadius:'5px', background:s.color, flexShrink:0 }}/>
            <div>
              <p style={{ fontFamily:'Instrument Serif, serif', fontSize:'32px', color:'var(--text-1)', lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'2px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'18px', background:'var(--bg-card)', padding:'4px', borderRadius:'10px', border:'1px solid var(--border)', width:'fit-content' }}>
        {[['active',`Active (${active.length})`],['history',`History (${history.length})`]].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding:'8px 20px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', fontFamily:'Plus Jakarta Sans, sans-serif',
              background: tab===key ? 'var(--accent)' : 'transparent', color: tab===key ? 'white' : 'var(--text-2)', transition:'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding:'60px', textAlign:'center', color:'var(--text-3)' }}>Loading your books...</div>
      ) : displayed.length === 0 ? (
        <div style={{ padding:'60px', textAlign:'center', color:'var(--text-3)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>📚</div>
          <p style={{ fontSize:'16px' }}>{tab==='active' ? "You haven't borrowed any books yet" : "No return history yet"}</p>
          <p style={{ fontSize:'13px', marginTop:'6px' }}>Go to <a href="/books" style={{ color:'var(--accent)' }}>Book Catalog</a> to request a book</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {displayed.map(borrow => {
            const days     = daysLeft(borrow.dueDate);
            const overdue  = isOverdue(borrow);
            const urgency  = urgencyColor(days);

            return (
              <div key={borrow.id} className="card"
                style={{ padding:'20px', display:'flex', gap:'18px', alignItems:'center',
                  borderLeft: `4px solid ${overdue ? 'var(--red)' : borrow.returned ? 'var(--green)' : days<=2 ? 'var(--yellow)' : 'var(--accent)'}` }}>

                {/* Book cover */}
                <div style={{ width:'60px', height:'80px', borderRadius:'6px', overflow:'hidden', flexShrink:0,
                  background:'var(--accent-muted)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {borrow.book?.coverImage ? (
                    <img src={borrow.book.coverImage} alt={borrow.book.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  )}
                </div>

                {/* Book info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 style={{ fontSize:'15px', fontWeight:'700', color:'var(--text-1)', marginBottom:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{borrow.book?.title}</h3>
                  <p style={{ fontSize:'12px', color:'var(--text-2)', marginBottom:'8px' }}>by {borrow.book?.author}</p>

                  <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
                    <div>
                      <p style={{ fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Borrowed On</p>
                      <p style={{ fontSize:'13px', color:'var(--text-1)', fontWeight:'500' }}>{borrow.borrowDate}</p>
                    </div>
                    <div>
                      <p style={{ fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Due Date</p>
                      <p style={{ fontSize:'13px', color: overdue ? 'var(--red)' : 'var(--text-1)', fontWeight: overdue ? '700' : '500' }}>{borrow.dueDate}</p>
                    </div>
                    {borrow.returned && (
                      <div>
                        <p style={{ fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Returned On</p>
                        <p style={{ fontSize:'13px', color:'var(--green)', fontWeight:'500' }}>{borrow.returnDate}</p>
                      </div>
                    )}
                    {borrow.fine > 0 && (
                      <div>
                        <p style={{ fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Fine Paid</p>
                        <p style={{ fontSize:'13px', color:'var(--red)', fontWeight:'700' }}>₹{borrow.fine}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side — status + deadline */}
                <div style={{ flexShrink:0, textAlign:'center', display:'flex', flexDirection:'column', gap:'8px', alignItems:'center' }}>
                  {/* Status badge */}
                  <span className={`badge badge-${borrow.status?.toLowerCase()}`}>{borrow.status}</span>

                  {/* Deadline countdown — only for active */}
                  {!borrow.returned && (
                    <div style={{ background:urgency.bg, borderRadius:'10px', padding:'10px 16px', textAlign:'center', minWidth:'100px', border:`1px solid ${urgency.color}25` }}>
                      {overdue ? (
                        <>
                          <p style={{ fontSize:'18px', fontWeight:'800', color:urgency.color, fontFamily:'Instrument Serif, serif', lineHeight:1 }}>{Math.abs(days)}d</p>
                          <p style={{ fontSize:'10px', color:urgency.color, fontWeight:'600', marginTop:'2px' }}>OVERDUE</p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize:'18px', fontWeight:'800', color:urgency.color, fontFamily:'Instrument Serif, serif', lineHeight:1 }}>{days}d</p>
                          <p style={{ fontSize:'10px', color:urgency.color, fontWeight:'600', marginTop:'2px' }}>LEFT</p>
                        </>
                      )}
                    </div>
                  )}

                  {borrow.returned && (
                    <div style={{ background:'var(--green-muted)', borderRadius:'10px', padding:'8px 14px', border:'1px solid rgba(16,185,129,0.2)' }}>
                      <p style={{ fontSize:'11px', color:'var(--green)', fontWeight:'600' }}>✓ Returned</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fine warning if any overdue */}
      {active.some(b => isOverdue(b)) && (
        <div style={{ marginTop:'20px', background:'var(--red-muted)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'14px 18px', display:'flex', gap:'12px', alignItems:'center' }}>
          <span style={{ fontSize:'20px' }}>⚠️</span>
          <div>
            <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--red)' }}>You have overdue books!</p>
            <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'2px' }}>Fine is ₹5 per day per book after due date. Please return them as soon as possible.</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
