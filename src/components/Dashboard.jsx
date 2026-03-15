import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import useAuthStore from '../store/authStore';
import useBookStore from '../store/bookStore';
import useUserStore from '../store/userStore';
import API from '../api/axiosInstance';

/* ══════════════════════════════════════════════
   4. BETTER CHARTS — Recharts with gradient fills
   ══════════════════════════════════════════════ */
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

/* ══ Animated Counter Hook — pure JS, no deps ═══════════════════ */
function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === null || target === undefined || isNaN(target)) return;
    const n = Number(target);
    if (n === prev.current) return;
    const start = prev.current;
    prev.current = n;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (n - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}
/* ══════════════════════════════════════════════════════════════ */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'10px 14px', boxShadow:'var(--shadow-md)' }}>
        <p style={{ fontSize:'11px', color:'var(--text-3)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
        <p style={{ fontSize:'18px', fontWeight:'700', color:'#7c6fe0', fontFamily:"'Playfair Display',serif" }}>
          {payload[0].value} borrows
        </p>
      </div>
    );
  }
  return null;
};

/* ══════════════════════════════════════════════
   3. COLORED STAT CARDS
   ══════════════════════════════════════════════ */
const STAT_CONFIGS = [
  { key:'books',   cls:'stat-books',   iconColor:'#3b82f6', iconBg:'rgba(59,130,246,0.15)'  },
  { key:'members', cls:'stat-members', iconColor:'#7c3aed', iconBg:'rgba(124,58,237,0.15)' },
  { key:'borrow',  cls:'stat-borrow',  iconColor:'#f97316', iconBg:'rgba(249,115,22,0.15)'  },
  { key:'avail',   cls:'stat-avail',   iconColor:'#059669', iconBg:'rgba(5,150,105,0.15)'   },
  { key:'overdue', cls:'stat-overdue', iconColor:'#dc2626', iconBg:'rgba(220,38,38,0.15)'   },
  { key:'pending', cls:'stat-pending', iconColor:'#d97706', iconBg:'rgba(217,119,6,0.13)'   },
];

function StatCard({ label, value, icon, cfgKey, link, sub, delay }) {
  const cfg      = STAT_CONFIGS.find(c => c.key === cfgKey) || STAT_CONFIGS[0];
  const numericVal = typeof value === 'number' ? value : (isNaN(Number(value)) ? null : Number(value));
  const animated   = useCountUp(numericVal, 1200);
  const display    = numericVal !== null ? animated : value;

  return (
    <Link to={link || '#'} style={{ textDecoration:'none' }}>
      <div className={`stat-card ${cfg.cls} stat-enter-${delay}`}
        style={{ cursor:'pointer' }}>
        {/* Gradient icon circle */}
        <div className="stat-icon" style={{ background: cfg.iconBg }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={cfg.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon}/>
          </svg>
        </div>
        <div style={{ flex:1 }}>
          <p className="stat-number-animated"
            style={{ fontSize:'32px', fontWeight:'800', color:'var(--text-1)',
              fontFamily:"'Playfair Display',serif", lineHeight:1,
              animationDelay:`${(delay-1)*0.08}s` }}>
            {display ?? '—'}
          </p>
          <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'3px', fontWeight:'500' }}>{label}</p>
          {sub && <p style={{ fontSize:'11px', color: cfg.iconColor, marginTop:'2px', fontWeight:'700' }}>{sub}</p>}
        </div>
        {/* Accent left bar */}
        <div style={{ position:'absolute', left:0, top:'18%', bottom:'18%', width:'3px',
          borderRadius:'0 3px 3px 0', background: cfg.iconColor, opacity:0.75 }}/>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════
   6. SECTION HEADERS WITH ICONS
   ══════════════════════════════════════════════ */
function SectionHeader({ emoji, title, badge, action }) {
  return (
    <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div className="section-title">
        <div className="section-title-icon" style={{ background:'var(--accent-muted)' }}>{emoji}</div>
        <span>{title}</span>
        {badge != null && badge > 0 && (
          <span style={{ background:'var(--red)', color:'white', fontSize:'10px', fontWeight:'800', padding:'2px 7px', borderRadius:'10px', animation:'pulse 2s infinite' }}>{badge}</span>
        )}
      </div>
      {action}
    </div>
  );
}

/* ══════════════════════════════════════════════
   AVAILABILITY MINI-BARS
   ══════════════════════════════════════════════ */
function AvailBar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 200); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ padding:'14px 18px', borderRadius:'12px', background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:`4px solid ${color}`, flex:1, minWidth:'120px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'8px' }}>
        <span style={{ fontSize:'12px', color, fontWeight:'700' }}>{label}</span>
        <span style={{ fontSize:'26px', fontWeight:'800', color, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{value}</span>
      </div>
      <div style={{ height:'5px', background:`${color}20`, borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${width}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius:'3px', transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}/>
      </div>
      <p style={{ fontSize:'10px', color, marginTop:'4px', opacity:0.7 }}>{pct}% of catalog</p>
    </div>
  );
}

export default function Dashboard() {
  const { user }                   = useAuthStore();
  const { books, fetchBooks }      = useBookStore();
  const { users, pendingUsers, fetchAllUsers, fetchPendingUsers, approveUser, rejectUser } = useUserStore();
  const [stats,      setStats]      = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const role = user?.role;

  const fetchStats = useCallback(async () => {
    try { const r = await API.get('/borrow/stats'); setStats(r.data); } catch {}
  }, []);

  useEffect(() => {
    fetchBooks();
    if (role === 'ADMIN' || role === 'LIBRARIAN') {
      fetchAllUsers(); fetchPendingUsers(); fetchStats();
    }
  }, [role]);

  useEffect(() => {
    if ((role === 'ADMIN' || role === 'LIBRARIAN') && books.length > 0) fetchStats();
  }, [books]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchBooks(), fetchStats()]);
    setTimeout(() => setRefreshing(false), 600);
  };

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 18 ? '☀️ Good afternoon' : '🌙 Good evening';

  /* 4. CHART DATA — gradient area chart */
  const chartData = [
    { month:'Aug', borrows:12, returns:9  },
    { month:'Sep', borrows:19, returns:14 },
    { month:'Oct', borrows:15, returns:12 },
    { month:'Nov', borrows:24, returns:20 },
    { month:'Dec', borrows:18, returns:15 },
    { month:'Jan', borrows:28, returns:22 },
  ];

  /* Live book stats from store */
  const available  = books.filter(b => b.available !== false).length;
  const fewLeft    = books.filter(b => b.availabilityStatus === 'FEW_LEFT').length;
  const outOfStock = books.filter(b => !b.available || b.availabilityStatus === 'OUT_OF_STOCK').length;
  const totalCopies = books.reduce((s,b) => s + (b.quantity||0), 0);
  const borrowed   = books.reduce((s,b) => s + (b.borrowedCount||0), 0);

  return (
    <Layout
      title="Dashboard"
      subtitle={`${greeting}, ${user?.name?.split(' ')[0] || 'there'}!`}
      actions={
        <button onClick={handleRefresh} className="btn-secondary" style={{ fontSize:'12px', padding:'7px 14px', gap:'6px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }}>
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      }
    >

      {/* ═══════════════════════════════════════
          ADMIN / LIBRARIAN STAT CARDS
          3 + 6 = colored, animated, accented
          ═══════════════════════════════════════ */}
      {(role === 'ADMIN' || role === 'LIBRARIAN') && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px,1fr))', gap:'14px', marginBottom:'26px' }}>
          <StatCard delay={1} cfgKey="books"   label="Total Books"          value={stats?.totalBooks ?? books.length}                         sub={`${totalCopies} copies total`} link="/books"     icon="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <StatCard delay={2} cfgKey="members" label="Total Members"        value={stats?.totalMembers ?? users.filter(u=>u.role==='MEMBER').length} link="/users"     icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/>
          <StatCard delay={3} cfgKey="borrow"  label="Currently Borrowed"   value={stats?.currentlyBorrowed ?? borrowed}                       sub={`of ${totalCopies} copies`}   link="/borrow"    icon="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          <StatCard delay={4} cfgKey="avail"   label="Available Now"        value={stats?.availableBooks ?? available}                         link="/books"     icon="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3"/>
          <StatCard delay={5} cfgKey="overdue" label="Overdue Books"        value={stats?.overdueBooks ?? 0}                                   sub={stats?.overdueBooks > 0 ? '⚠ Needs attention' : '✓ All on time'} link="/borrow" icon="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <StatCard delay={6} cfgKey="pending" label="Pending Approvals"    value={stats?.totalPendingUsers ?? pendingUsers.length}            sub={pendingUsers.length > 0 ? 'Review needed' : 'None pending'} link="/approvals" icon="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 8v6M23 11h-6"/>
        </div>
      )}

      {/* MEMBER STAT CARDS */}
      {role === 'MEMBER' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'14px', marginBottom:'26px' }}>
          <StatCard delay={1} cfgKey="books"  label="Total Books"  value={books.length} link="/books"  icon="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <StatCard delay={2} cfgKey="avail"  label="Available"    value={available}    link="/books"  icon="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3"/>
          <StatCard delay={3} cfgKey="members" label="Your Plan"   value={user?.subscriptionPlan || 'FREE'} link="/plans" icon="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </div>
      )}

      {/* ═══════════════════════════════════════
          AVAILABILITY MINI-BARS
          ═══════════════════════════════════════ */}
      {books.length > 0 && (
        <div style={{ display:'flex', gap:'12px', marginBottom:'26px', flexWrap:'wrap', animation:'fadeUp 0.5s ease 0.35s both' }}>
          <AvailBar label="🟢 Available"    value={available}  total={books.length} color="#059669"/>
          <AvailBar label="🟡 Few Left"     value={fewLeft}    total={books.length} color="#8b6418"/>
          <AvailBar label="🔴 Out of Stock" value={outOfStock} total={books.length} color="#dc2626"/>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MAIN GRID — Chart + Approvals
          4. RECHARTS AREA CHART WITH GRADIENT
          ═══════════════════════════════════════ */}
      {(role === 'ADMIN' || role === 'LIBRARIAN') && (
        <div style={{ display:'grid', gridTemplateColumns: pendingUsers.length > 0 ? '1fr 340px' : '1fr', gap:'20px', marginBottom:'26px', animation:'fadeUp 0.5s ease 0.4s both' }}>

          {/* 📊 Borrow Analytics chart */}
          <div className="card">
            <SectionHeader emoji="📊" title="Borrow Analytics"
              action={<span style={{ fontSize:'11px', color:'var(--text-3)', background:'var(--accent-muted)', padding:'3px 10px', borderRadius:'20px' }}>Last 6 months</span>}
            />
            <div style={{ padding:'20px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top:8, right:8, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="colorBorrows" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.30}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                  <XAxis dataKey="month" tick={{ fill:'var(--text-3)', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:'var(--text-3)', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="borrows" name="Borrows"
                    stroke="#6366f1" strokeWidth={2.5}
                    fill="url(#colorBorrows)" dot={{ fill:'#6366f1', r:3, strokeWidth:0 }} activeDot={{ r:5 }}/>
                  <Area type="monotone" dataKey="returns" name="Returns"
                    stroke="#10b981" strokeWidth={2}
                    fill="url(#colorReturns)" dot={{ fill:'#10b981', r:3, strokeWidth:0 }} activeDot={{ r:5 }}/>
                </AreaChart>
              </ResponsiveContainer>

              {/* Chart legend + summary */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'14px', paddingTop:'14px', borderTop:'1px solid var(--border)' }}>
                <div style={{ display:'flex', gap:'16px' }}>
                  {[['#6366f1','Borrows'],['#10b981','Returns']].map(([c,l]) => (
                    <div key={l} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:c }}/>
                      <span style={{ fontSize:'12px', color:'var(--text-2)' }}>{l}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:'20px' }}>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:'20px', fontWeight:'800', color:'#7c6fe0', fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{chartData[chartData.length-1].borrows}</p>
                    <p style={{ fontSize:'11px', color:'var(--text-3)' }}>This month</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:'20px', fontWeight:'800', color:'var(--green)', fontFamily:"'Playfair Display',serif", lineHeight:1 }}>↑ 12%</p>
                    <p style={{ fontSize:'11px', color:'var(--text-3)' }}>vs last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔔 Pending Approvals */}
          {pendingUsers.length > 0 && (
            <div className="card">
              <SectionHeader emoji="🔔" title="Pending Approvals" badge={pendingUsers.length}
                action={<Link to="/approvals" style={{ fontSize:'12px', color:'var(--accent)', textDecoration:'none' }}>View all →</Link>}
              />
              <div>
                {pendingUsers.slice(0,5).map((u, i) => (
                  <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'11px 18px', borderBottom:'1px solid var(--border)', animation:`slideLeft 0.35s ease ${0.05*i}s both` }}>
                    <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'var(--accent-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'800', color:'var(--accent)', flexShrink:0 }}>
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</p>
                      <p style={{ fontSize:'11px', color:'var(--text-3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</p>
                    </div>
                    <div style={{ display:'flex', gap:'5px', flexShrink:0 }}>
                      <button className="btn-success" style={{ padding:'4px 10px', fontSize:'11px' }} onClick={() => approveUser(u.id)}>✓</button>
                      <button className="btn-danger"  style={{ padding:'4px 10px', fontSize:'11px' }} onClick={() => rejectUser(u.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
          📚 RECENT BOOKS
          6. Section header with icon
          ═══════════════════════════════════════ */}
      <div className="card" style={{ animation:'fadeUp 0.5s ease 0.45s both' }}>
        <SectionHeader emoji="📚" title="Recent Books"
          action={
            <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
              {(role==='ADMIN'||role==='LIBRARIAN') && (
                <Link to="/add-book"><button className="btn-primary" style={{ fontSize:'12px', padding:'6px 14px' }}>+ Add Book</button></Link>
              )}
              <Link to="/books" style={{ fontSize:'13px', color:'var(--accent)', textDecoration:'none', fontWeight:'600' }}>View all →</Link>
            </div>
          }
        />

        {books.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center', color:'var(--text-3)' }}>
            <div style={{ fontSize:'42px', marginBottom:'12px' }}>📭</div>
            <p style={{ fontSize:'15px', marginBottom:'8px' }}>No books in catalog yet</p>
            {(role==='ADMIN'||role==='LIBRARIAN') && <Link to="/add-book" style={{ color:'var(--accent)', fontSize:'14px', fontWeight:'600' }}>Add your first book →</Link>}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(185px,1fr))', gap:'16px', padding:'20px' }}>
            {books.slice(0, 8).map((book, i) => {
              const rem    = (book.quantity||0) - (book.borrowedCount||0);
              const status = rem <= 0 ? 'out_of_stock' : rem <= 2 ? 'few_left' : 'available';
              const statusLabel = status==='available' ? '🟢 Available' : status==='few_left' ? '🟡 Few Left' : '🔴 Out of Stock';
              return (
                <div key={book.id}
                  className="book-card-3d"
                  style={{ borderRadius:'14px', overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer',
                    animationDelay:`${0.05*i}s`,
                    background:'var(--bg-card)'
                  }}
                >
                  {/* Cover */}
                  <div style={{ width:'100%', height:'200px', position:'relative', overflow:'hidden', background:'var(--bg-2)' }}>
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                    ) : (
                      <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg, var(--accent-muted), var(--purple-muted))', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                        <p style={{ fontSize:'11px', color:'var(--text-3)', textAlign:'center', padding:'0 10px', lineHeight:1.4 }}>{book.title}</p>
                      </div>
                    )}
                    <div style={{ position:'absolute', top:'8px', right:'8px' }}>
                      <span className={`badge badge-${status}`} style={{ fontSize:'9px', background: status==='available'?'#059669': status==='few_left'?'#8b6418':'#dc2626', color:'white', border:'none' }}>{statusLabel}</span>
                    </div>
                    {book.category && (
                      <div style={{ position:'absolute', bottom:'8px', left:'8px' }}>
                        <span style={{ fontSize:'9px', background:'rgba(0,0,0,0.72)', color:'white', padding:'2px 8px', borderRadius:'20px' }}>{book.category}</span>
                      </div>
                    )}
                    {book.shelfNumber && (
                      <div style={{ position:'absolute', top:'8px', left:'8px' }}>
                        <span style={{ fontSize:'9px', background:'rgba(245,158,11,0.85)', color:'white', padding:'2px 7px', borderRadius:'20px', fontWeight:'700' }}>📍 {book.shelfNumber}</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ padding:'12px 14px 14px' }}>
                    <p style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-1)', marginBottom:'3px', lineHeight:1.3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{book.title}</p>
                    <p style={{ fontSize:'11px', color:'var(--text-2)', marginBottom:'6px' }}>by {book.author}</p>
                    {/* Mini progress bar for copies */}
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ flex:1, height:'3px', background:'var(--border)', borderRadius:'2px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${Math.round((rem / Math.max(book.quantity||1,1))*100)}%`, background: rem>2?'var(--green)': rem>0?'var(--yellow)':'var(--red)', borderRadius:'2px', transition:'width 0.6s ease' }}/>
                      </div>
                      <span style={{ fontSize:'10px', color:'var(--text-3)', whiteSpace:'nowrap' }}>{rem}/{book.quantity||0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </Layout>
  );
}
