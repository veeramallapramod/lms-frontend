import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Dummy data for landing page
const FEATURED_BOOKS = [
  { id:1, title:'The Great Gatsby', author:'F. Scott Fitzgerald', category:'Fiction', color:'#1e3a5f', spine:'#2563eb' },
  { id:2, title:'Sapiens', author:'Yuval Noah Harari', category:'History', color:'#1a2e0a', spine:'#16a34a' },
  { id:3, title:'Atomic Habits', author:'James Clear', category:'Self-Help', color:'#2d1507', spine:'#f59e0b' },
  { id:4, title:'1984', author:'George Orwell', category:'Fiction', color:'#1f0a0a', spine:'#dc2626' },
  { id:5, title:'Thinking Fast and Slow', author:'Daniel Kahneman', category:'Psychology', color:'#1a0f2e', spine:'#8b5cf6' },
  { id:6, title:'The Alchemist', author:'Paulo Coelho', category:'Fiction', color:'#0f1e10', spine:'#10b981' },
  { id:7, title:'Dune', author:'Frank Herbert', category:'Science Fiction', color:'#2a1a00', spine:'#d97706' },
  { id:8, title:'Brief History of Time', author:'Stephen Hawking', category:'Science', color:'#0a1628', spine:'#38bdf8' },
];

const STATS = [
  { value: '12,500+', label: 'Books in Collection' },
  { value: '3,200+', label: 'Active Members' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Digital Access' },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma', role: 'Member', text: 'Librario completely transformed how I access books. The reservation system is genius!', avatar: 'A' },
  { name: 'Priya Nair', role: 'Librarian', text: 'Managing the library has never been easier. The admin dashboard is incredibly intuitive.', avatar: 'P' },
  { name: 'Rahul Verma', role: 'Member', text: 'Found rare research papers I couldn\'t locate anywhere else. Outstanding collection!', avatar: 'R' },
];

// 3D Bookshelf Component
function Bookshelf() {
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:'600px', margin:'0 auto' }}>
      {/* Shelf 1 */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:'3px', marginBottom:'4px', padding:'0 8px' }}>
        {FEATURED_BOOKS.slice(0,8).map((book, i) => (
          <div key={book.id} className="landing-book" style={{
            width: `${40 + (i%3)*8}px`,
            height: `${90 + (i%4)*15}px`,
            background: book.color,
            borderRadius:'2px 4px 4px 2px',
            position:'relative',
            cursor:'pointer',
            transition:'transform 0.3s ease',
            flexShrink:0,
            boxShadow:'2px 2px 8px rgba(0,0,0,0.5)',
          }}>
            {/* Spine color strip */}
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'4px', background:book.spine, borderRadius:'2px 0 0 2px' }}/>
            {/* Book title vertical */}
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'4px 6px' }}>
              <p style={{ fontSize:'7px', color:'rgba(255,255,255,0.6)', textAlign:'center', writingMode:'vertical-rl', textOrientation:'mixed', lineHeight:1.2, fontFamily:'Plus Jakarta Sans, sans-serif', fontWeight:'600' }}>
                {book.title}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Shelf board */}
      <div style={{ height:'12px', background:'linear-gradient(180deg, #3d1f08 0%, #2d1507 100%)', borderRadius:'2px', boxShadow:'0 4px 12px rgba(0,0,0,0.5)', marginBottom:'20px' }}/>

      {/* Shelf 2 - reversed order */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:'3px', marginBottom:'4px', padding:'0 8px' }}>
        {[...FEATURED_BOOKS].reverse().map((book, i) => (
          <div key={`s2-${book.id}`} className="landing-book" style={{
            width: `${35 + (i%4)*10}px`,
            height: `${80 + (i%3)*20}px`,
            background: book.color,
            borderRadius:'2px 4px 4px 2px',
            position:'relative',
            cursor:'pointer',
            transition:'transform 0.3s ease',
            flexShrink:0,
            boxShadow:'2px 2px 8px rgba(0,0,0,0.5)',
            transform: i%3===1 ? 'rotate(-3deg)' : i%5===0 ? 'rotate(2deg)' : 'none',
          }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'4px', background:book.spine, borderRadius:'2px 0 0 2px' }}/>
          </div>
        ))}
      </div>
      <div style={{ height:'12px', background:'linear-gradient(180deg, #3d1f08 0%, #2d1507 100%)', borderRadius:'2px', boxShadow:'0 4px 12px rgba(0,0,0,0.5)' }}/>
    </div>
  );
}

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(p => (p+1)%3), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight:'100vh', background:'#06080f', color:'#f0f4ff', fontFamily:'Plus Jakarta Sans, sans-serif', overflowX:'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        .landing-book:hover { transform: translateY(-12px) !important; }
        .feature-card:hover { transform: translateY(-4px); border-color: rgba(245,158,11,0.4) !important; }
        .book-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important; }
        .nav-link:hover { color: #f59e0b; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,0.4); }
        .stat-item:hover { transform: scale(1.05); }
        * { box-sizing: border-box; margin:0; padding:0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #f59e0b44; border-radius: 3px; }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        background: scrollY > 50 ? 'rgba(6,8,15,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(245,158,11,0.15)' : 'none',
        padding:'16px 48px', display:'flex', alignItems:'center', justifyContent:'space-between',
        transition:'all 0.3s ease'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'34px', height:'34px', background:'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <span style={{ fontFamily:'Instrument Serif, serif', fontSize:'22px', color:'#f0e6d0' }}>Librario</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'32px' }}>
          {['Features','Collection','About'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{ color:'rgba(240,228,208,0.6)', textDecoration:'none', fontSize:'14px', fontWeight:'500', transition:'color 0.2s' }}>{item}</a>
          ))}
          <Link to="/login">
            <button className="cta-btn" style={{ background:'linear-gradient(135deg, #f59e0b, #d97706)', color:'#0a0500', fontWeight:'700', fontSize:'14px', padding:'9px 22px', borderRadius:'8px', border:'none', cursor:'pointer', transition:'all 0.2s', fontFamily:'Plus Jakarta Sans, sans-serif' }}>
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'center', overflow:'hidden', padding:'120px 48px 80px' }}>
        {/* Blurred library background */}
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          {/* Dark atmospheric gradient */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%, rgba(245,158,11,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)' }}/>
          {/* Blurred circles for depth */}
          <div style={{ position:'absolute', top:'10%', left:'60%', width:'400px', height:'400px', background:'rgba(245,158,11,0.06)', borderRadius:'50%', filter:'blur(80px)' }}/>
          <div style={{ position:'absolute', bottom:'20%', left:'20%', width:'300px', height:'300px', background:'rgba(59,130,246,0.05)', borderRadius:'50%', filter:'blur(60px)' }}/>
          {/* Grid overlay */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize:'60px 60px' }}/>
        </div>

        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center', maxWidth:'1200px', margin:'0 auto', width:'100%' }}>
          {/* Left - Text */}
          <div style={{ animation:'fadeUp 0.8s ease forwards' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'20px', padding:'6px 14px', marginBottom:'24px' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#f59e0b' }}/>
              <span style={{ fontSize:'12px', color:'#f59e0b', fontWeight:'600', letterSpacing:'0.05em' }}>LIBRARY MANAGEMENT SYSTEM</span>
            </div>
            <h1 style={{ fontFamily:'Instrument Serif, serif', fontSize:'64px', lineHeight:1.05, color:'#f0e6d0', marginBottom:'20px' }}>
              Where Every<br/>
              <span style={{ fontStyle:'italic', color:'#f59e0b' }}>Story</span> Finds<br/>
              Its Reader
            </h1>
            <p style={{ fontSize:'17px', color:'rgba(240,228,208,0.55)', lineHeight:1.8, marginBottom:'36px', maxWidth:'440px' }}>
              A modern library experience — discover books, track borrows, manage memberships and reservations all in one beautiful platform.
            </p>
            <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
              <Link to="/register">
                <button className="cta-btn" style={{ background:'linear-gradient(135deg, #f59e0b, #d97706)', color:'#0a0500', fontWeight:'700', fontSize:'15px', padding:'13px 28px', borderRadius:'10px', border:'none', cursor:'pointer', transition:'all 0.2s', fontFamily:'Plus Jakarta Sans, sans-serif' }}>
                  Get Started Free
                </button>
              </Link>
              <Link to="/login">
                <button style={{ background:'transparent', border:'1px solid rgba(245,158,11,0.3)', color:'#f0e6d0', fontWeight:'600', fontSize:'15px', padding:'13px 28px', borderRadius:'10px', cursor:'pointer', transition:'all 0.2s', fontFamily:'Plus Jakarta Sans, sans-serif' }}>
                  Sign In →
                </button>
              </Link>
            </div>

            {/* Quick stats */}
            <div style={{ display:'flex', gap:'32px', marginTop:'48px', paddingTop:'32px', borderTop:'1px solid rgba(245,158,11,0.15)' }}>
              {STATS.slice(0,3).map(s => (
                <div key={s.label} className="stat-item" style={{ transition:'transform 0.2s', cursor:'default' }}>
                  <p style={{ fontFamily:'Instrument Serif, serif', fontSize:'28px', color:'#f59e0b', lineHeight:1 }}>{s.value}</p>
                  <p style={{ fontSize:'12px', color:'rgba(240,228,208,0.45)', marginTop:'3px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Bookshelf */}
          <div style={{ position:'relative' }}>
            {/* Ambient glow behind shelf */}
            <div style={{ position:'absolute', inset:'-20px', background:'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)', filter:'blur(20px)' }}/>
            <div style={{ position:'relative', background:'rgba(10,7,3,0.6)', border:'1px solid rgba(245,158,11,0.1)', borderRadius:'16px', padding:'32px 24px 16px', backdropFilter:'blur(10px)' }}>
              {/* Library label */}
              <div style={{ textAlign:'center', marginBottom:'24px' }}>
                <p style={{ fontSize:'11px', color:'rgba(245,158,11,0.5)', letterSpacing:'0.2em', textTransform:'uppercase' }}>Featured Collection</p>
              </div>
              <Bookshelf />
              {/* Floating book cards */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'20px' }}>
                {FEATURED_BOOKS.slice(0,4).map(book => (
                  <div key={`card-${book.id}`} className="book-card-hover" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'8px', padding:'10px 12px', transition:'all 0.2s', cursor:'pointer' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ width:'6px', height:'32px', background:book.spine, borderRadius:'2px', flexShrink:0 }}/>
                      <div>
                        <p style={{ fontSize:'11px', fontWeight:'600', color:'rgba(240,228,208,0.8)', lineHeight:1.2 }}>{book.title}</p>
                        <p style={{ fontSize:'10px', color:'rgba(240,228,208,0.35)', marginTop:'2px' }}>{book.author}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ padding:'100px 48px', position:'relative' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <p style={{ fontSize:'12px', color:'#f59e0b', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'12px' }}>Why Librario</p>
            <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'48px', color:'#f0e6d0' }}>Everything your library needs</h2>
            <p style={{ color:'rgba(240,228,208,0.45)', marginTop:'12px', fontSize:'16px' }}>Built for admins, librarians and members alike</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px' }}>
            {[
              { icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', title:'Smart Borrow System', desc:'Issue books, track due dates and auto-calculate fines at ₹5/day. Full borrow history for every member.', color:'#f59e0b' },
              { icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', title:'3-Role Access Control', desc:'Admin, Librarian and Member — each with the right permissions. Admin approves all new users.', color:'#8b5cf6' },
              { icon:'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z', title:'Book Reservations', desc:'Reserve unavailable books and get email notifications the moment they\'re returned.', color:'#10b981' },
              { icon:'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', title:'Rich Book Catalog', desc:'Search by title, author, category. Upload cover images. Availability badges show stock in real time.', color:'#3b82f6' },
              { icon:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', title:'Live Dashboard', desc:'Stats on total books, active borrows, overdue items and pending approvals — all at a glance.', color:'#f97316' },
              { icon:'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3', title:'Email Notifications', desc:'OTP verification, approval alerts, borrow confirmations and reservation notifications via Gmail.', color:'#06b6d4' },
            ].map(f => (
              <div key={f.title} className="feature-card" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'28px', transition:'all 0.25s', cursor:'default' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:`${f.color}18`, border:`1px solid ${f.color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'18px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                </div>
                <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#f0e6d0', marginBottom:'8px' }}>{f.title}</h3>
                <p style={{ fontSize:'13px', color:'rgba(240,228,208,0.45)', lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROLES SECTION ===== */}
      <section style={{ padding:'80px 48px', background:'rgba(255,255,255,0.01)', borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <p style={{ fontSize:'12px', color:'#f59e0b', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'12px' }}>Access Levels</p>
            <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'48px', color:'#f0e6d0' }}>Built for every role</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
            {[
              { role:'Admin', color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.2)', icon:'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z', perms:['Manage all users & librarians','Approve/reject registrations','Add, edit, delete books','Manage library subscriptions','View all borrow records','Full dashboard access'] },
              { role:'Librarian', color:'#8b5cf6', bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.2)', icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87', perms:['Issue & return books','Add and delete books','Add new members','Approve new users','View all borrow records','Manage reservations'] },
              { role:'Member', color:'#10b981', bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.2)', icon:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', perms:['Browse full book catalog','Search & filter books','Reserve unavailable books','View borrow history','Receive email notifications','Manage own profile'] },
            ].map(r => (
              <div key={r.role} style={{ background:r.bg, border:`1px solid ${r.border}`, borderRadius:'16px', padding:'32px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:r.border, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={r.icon}/></svg>
                  </div>
                  <h3 style={{ fontFamily:'Instrument Serif, serif', fontSize:'26px', color:r.color }}>{r.role}</h3>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {r.perms.map(p => (
                    <div key={p} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:r.color, flexShrink:0 }}/>
                      <span style={{ fontSize:'13px', color:'rgba(240,228,208,0.7)' }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLLECTION PREVIEW ===== */}
      <section id="collection" style={{ padding:'100px 48px' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'48px' }}>
            <div>
              <p style={{ fontSize:'12px', color:'#f59e0b', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'12px' }}>Our Collection</p>
              <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'48px', color:'#f0e6d0' }}>Popular Books</h2>
            </div>
            <Link to="/login" style={{ color:'#f59e0b', textDecoration:'none', fontSize:'14px', fontWeight:'600' }}>View All →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
            {FEATURED_BOOKS.map(book => (
              <div key={`preview-${book.id}`} className="book-card-hover" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', overflow:'hidden', transition:'all 0.25s', cursor:'pointer' }}>
                {/* Book cover mock */}
                <div style={{ height:'160px', background:`linear-gradient(135deg, ${book.color}, ${book.color}dd)`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'8px', background:book.spine }}/>
                  <div style={{ textAlign:'center', padding:'0 20px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={book.spine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity:0.6, marginBottom:'8px' }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.5)', fontWeight:'600' }}>{book.category}</p>
                  </div>
                  <div style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(16,185,129,0.2)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'20px', padding:'2px 8px' }}>
                    <span style={{ fontSize:'9px', color:'#10b981', fontWeight:'700' }}>AVAILABLE</span>
                  </div>
                </div>
                <div style={{ padding:'14px' }}>
                  <p style={{ fontSize:'13px', fontWeight:'700', color:'#f0e6d0', marginBottom:'3px', lineHeight:1.3 }}>{book.title}</p>
                  <p style={{ fontSize:'11px', color:'rgba(240,228,208,0.4)' }}>{book.author}</p>
                  <div style={{ marginTop:'10px', paddingTop:'10px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'10px', background:`${book.spine}20`, color:book.spine, padding:'2px 8px', borderRadius:'4px', fontWeight:'600' }}>{book.category}</span>
                    <Link to="/login" style={{ fontSize:'11px', color:'#f59e0b', textDecoration:'none', fontWeight:'600' }}>Borrow →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding:'80px 48px', background:'rgba(245,158,11,0.03)', borderTop:'1px solid rgba(245,158,11,0.08)' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:'12px', color:'#f59e0b', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'12px' }}>Testimonials</p>
          <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'40px', color:'#f0e6d0', marginBottom:'48px' }}>What our users say</h2>
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(245,158,11,0.15)', borderRadius:'20px', padding:'40px', minHeight:'180px', position:'relative' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ display: i===activeTestimonial ? 'block' : 'none', animation:'fadeUp 0.5s ease' }}>
                <p style={{ fontFamily:'Instrument Serif, serif', fontSize:'22px', color:'rgba(240,228,208,0.85)', lineHeight:1.6, fontStyle:'italic', marginBottom:'24px' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg, #f59e0b, #d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', color:'#0a0500', fontSize:'16px' }}>{t.avatar}</div>
                  <div style={{ textAlign:'left' }}>
                    <p style={{ fontWeight:'700', color:'#f0e6d0', fontSize:'14px' }}>{t.name}</p>
                    <p style={{ fontSize:'12px', color:'rgba(240,228,208,0.4)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Dots */}
            <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'24px' }}>
              {TESTIMONIALS.map((_,i) => (
                <div key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i===activeTestimonial ? '20px' : '6px', height:'6px', borderRadius:'3px', background: i===activeTestimonial ? '#f59e0b' : 'rgba(245,158,11,0.3)', transition:'all 0.3s', cursor:'pointer' }}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding:'100px 48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'600px', height:'300px', background:'rgba(245,158,11,0.06)', borderRadius:'50%', filter:'blur(60px)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:'Instrument Serif, serif', fontSize:'56px', color:'#f0e6d0', marginBottom:'16px' }}>
            Ready to explore<br/><span style={{ color:'#f59e0b', fontStyle:'italic' }}>your library?</span>
          </h2>
          <p style={{ color:'rgba(240,228,208,0.45)', fontSize:'16px', marginBottom:'36px' }}>Join thousands of readers who manage their library life with Librario</p>
          <Link to="/register">
            <button className="cta-btn" style={{ background:'linear-gradient(135deg, #f59e0b, #d97706)', color:'#0a0500', fontWeight:'700', fontSize:'16px', padding:'16px 40px', borderRadius:'12px', border:'none', cursor:'pointer', transition:'all 0.2s', fontFamily:'Plus Jakarta Sans, sans-serif' }}>
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ padding:'32px 48px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'28px', height:'28px', background:'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <span style={{ fontFamily:'Instrument Serif, serif', fontSize:'16px', color:'rgba(240,228,208,0.6)' }}>Librario</span>
        </div>
        <p style={{ fontSize:'12px', color:'rgba(240,228,208,0.3)' }}>© 2026 Librario. Built for knowledge seekers.</p>
        <div style={{ display:'flex', gap:'20px' }}>
          <Link to="/login" style={{ fontSize:'13px', color:'rgba(240,228,208,0.4)', textDecoration:'none' }}>Sign In</Link>
          <Link to="/register" style={{ fontSize:'13px', color:'rgba(240,228,208,0.4)', textDecoration:'none' }}>Register</Link>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
