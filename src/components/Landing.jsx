import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const BOOKS = [
  { id:1, title:'The Great Gatsby',       author:'F. Scott Fitzgerald', cat:'Classic',    h:'#c8a55a', s:'#8b6a1f', b:'#1a0f02' },
  { id:2, title:'Sapiens',               author:'Yuval Noah Harari',   cat:'History',    h:'#6b9e7e', s:'#2d6b4a', b:'#011a0d' },
  { id:3, title:'Atomic Habits',         author:'James Clear',         cat:'Self-Help',  h:'#d4845a', s:'#8b4a1a', b:'#1a0800' },
  { id:4, title:'1984',                  author:'George Orwell',       cat:'Fiction',    h:'#9b8db8', s:'#4a3d6b', b:'#0d0a1a' },
  { id:5, title:'Thinking Fast & Slow',  author:'D. Kahneman',         cat:'Psychology', h:'#7ea8c8', s:'#2d5a8b', b:'#001020' },
  { id:6, title:'The Alchemist',         author:'Paulo Coelho',        cat:'Fiction',    h:'#c8a06e', s:'#8b6020', b:'#1a0e00' },
  { id:7, title:'Dune',                  author:'Frank Herbert',       cat:'Sci-Fi',     h:'#c8b46e', s:'#8b7220', b:'#1a1200' },
  { id:8, title:'Brief History of Time', author:'S. Hawking',          cat:'Science',    h:'#6ea8c8', s:'#1a5a8b', b:'#001828' },
];

const FEATURES = [
  { num:'01', title:'Smart Borrow System',   desc:'Issue books, track due dates, auto-calculate fines. Complete borrow history for every member.', col:'#c8a55a' },
  { num:'02', title:'3-Role Access Control', desc:'Admin, Librarian and Member — each with precisely defined permissions and tailored dashboards.', col:'#9b8db8' },
  { num:'03', title:'Book Reservations',     desc:'Queue reservations on unavailable books. Instant email notifications on availability.',          col:'#6b9e7e' },
  { num:'04', title:'Rich Book Catalog',     desc:'Search by title, author, category. Upload covers. Live availability badges across collections.',  col:'#7ea8c8' },
  { num:'05', title:'Live Analytics',        desc:'Real-time stats on borrows, overdue items, pending approvals and member activity.',               col:'#d4845a' },
  { num:'06', title:'Email Notifications',   desc:'OTP verification, approval alerts, borrow confirmations, reservation updates via Gmail.',         col:'#7aac5a' },
];

const TESTIMONIALS = [
  { name:'Arjun Sharma',  role:'Research Scholar', text:'Librario completely transformed how I discover and access books. The reservation system is nothing short of genius.', av:'A', c:'#c8a55a' },
  { name:'Priya Nair',    role:'Senior Librarian', text:'Managing over 12,000 volumes has never been this effortless. The admin panel is beautifully designed and deeply intuitive.', av:'P', c:'#9b8db8' },
  { name:'Rahul Verma',   role:'Graduate Student', text:'I found rare research papers I could not locate anywhere else. The depth and breadth of this collection is remarkable.', av:'R', c:'#6b9e7e' },
];

function BookSpine({ book, i, delay }) {
  const hs = [118,135,105,145,122,138,108,128];
  const ws = [40,34,46,36,42,38,44,32];
  const [up, setUp] = useState(false);
  return (
    <div onMouseEnter={()=>setUp(true)} onMouseLeave={()=>setUp(false)}
      style={{
        width:`${ws[i%8]}px`, height:`${hs[i%8]}px`, flexShrink:0, cursor:'pointer', position:'relative',
        background:`linear-gradient(165deg,${book.h} 0%,${book.s} 55%,${book.b} 100%)`,
        borderRadius:'2px 5px 5px 2px',
        boxShadow:`2px 6px 18px rgba(0,0,0,0.30), inset -3px 0 8px rgba(0,0,0,0.18), inset 1px 0 0 rgba(255,255,255,0.15)`,
        transform: up ? 'translateY(-20px) rotate(-1.5deg)' : `translateY(0) rotate(${i%3===1?'1deg':i%3===2?'-0.5deg':'0deg'})`,
        transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        animation:`riseBook 0.7s ease ${delay}s both`,
      }}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:'4px',background:'rgba(255,255,255,0.22)',borderRadius:'2px 0 0 2px'}}/>
      <div style={{position:'absolute',right:0,top:3,bottom:3,width:'3px',background:'rgba(255,255,255,0.50)',borderRadius:'0 3px 3px 0'}}/>
      <div style={{position:'absolute',inset:'6px 5px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{fontSize:'6.5px',fontWeight:'700',color:'rgba(255,255,255,0.70)',writingMode:'vertical-rl',textAlign:'center',lineHeight:1.3,fontFamily:"'Playfair Display',serif",letterSpacing:'0.03em'}}>{book.title}</p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [scroll, setScroll]       = useState(0);
  const [test, setTest]           = useState(0);
  const [vis, setVis]             = useState({});
  const [mousePos, setMousePos]   = useState({ x:0, y:0 });
  const sRefs = useRef({});

  useEffect(()=>{
    const s=()=>setScroll(window.scrollY);
    window.addEventListener('scroll',s,{passive:true});
    return()=>window.removeEventListener('scroll',s);
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting)setVis(v=>({...v,[e.target.dataset.s]:true}));
    }),{threshold:0.10});
    Object.values(sRefs.current).forEach(el=>el&&obs.observe(el));
    return()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    const t=setInterval(()=>setTest(p=>(p+1)%3),5000);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    const m=e=>setMousePos({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight});
    window.addEventListener('mousemove',m,{passive:true});
    return()=>window.removeEventListener('mousemove',m);
  },[]);

  const solid = scroll>50;

  return (
    <div style={{minHeight:'100vh',background:'#f8f3eb',color:'#1a1208',fontFamily:"'DM Sans',sans-serif",overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}
        @keyframes riseBook{from{opacity:0;transform:translateY(35px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes popIn{from{opacity:0;transform:scale(0.90);}to{opacity:1;transform:scale(1);}}
        @keyframes goldFlow{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes subtleFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}

        .g-text{background:linear-gradient(120deg,#7a5010 0%,#c8a55a 30%,#f0d878 55%,#c8a55a 75%,#7a5010 100%);background-size:250% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:goldFlow 4s linear infinite;}
        
        .nav-link{color:rgba(26,18,8,0.50);text-decoration:none;font-size:13.5px;font-weight:500;letter-spacing:0.01em;transition:color 0.2s;position:relative;}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1.5px;background:#c8a55a;transform:scaleX(0);transform-origin:center;transition:transform 0.25s ease;}
        .nav-link:hover{color:#7a5010;}.nav-link:hover::after{transform:scaleX(1);}
        
        .btn-gold{background:linear-gradient(135deg,#c8a55a,#8b6418);color:#fff;border:none;font-weight:700;letter-spacing:0.02em;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.28s;box-shadow:0 6px 24px rgba(139,100,24,0.28);}
        .btn-gold:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(139,100,24,0.38);}
        .btn-ghost{background:rgba(26,18,8,0.06);border:1.5px solid rgba(26,18,8,0.14);color:#1a1208;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.22s;}
        .btn-ghost:hover{background:rgba(26,18,8,0.10);transform:translateY(-2px);}
        
        .feat-row:hover .feat-num{color:#c8a55a;}
        .feat-row{transition:background 0.25s;cursor:default;}
        .feat-row:hover{background:rgba(200,165,90,0.06);}
        
        .book-tile{transition:all 0.3s ease;cursor:pointer;}
        .book-tile:hover{transform:translateY(-8px);box-shadow:0 24px 56px rgba(26,18,8,0.14)!important;}
        
        .role-card{transition:transform 0.3s,box-shadow 0.3s;}
        .role-card:hover{transform:translateY(-5px);}
        
        .nav-cta-hover:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(139,100,24,0.34)!important;}
        
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#f8f3eb;}
        ::-webkit-scrollbar-thumb{background:#c8a55a;border-radius:4px;}
        ::-webkit-scrollbar-thumb:hover{background:#8b6418;}
        
        .shelf-plank{height:14px;background:linear-gradient(180deg,#9b7232 0%,#6b4c0e 55%,#3a2608 100%);border-radius:3px;box-shadow:0 6px 18px rgba(0,0,0,0.22),inset 0 1px 0 rgba(255,230,140,0.14);}
        
        .tag{display:inline-flex;align-items:center;gap:7px;background:rgba(200,165,90,0.13);border:1px solid rgba(200,165,90,0.32);border-radius:50px;padding:5px 16px;}
        .tag span{font-size:11px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:#7a5010;}
        
        .stagger-1{animation:fadeUp 0.6s ease 0.10s both;}
        .stagger-2{animation:fadeUp 0.6s ease 0.22s both;}
        .stagger-3{animation:fadeUp 0.6s ease 0.34s both;}
        .stagger-4{animation:fadeUp 0.6s ease 0.46s both;}
        .stagger-5{animation:fadeUp 0.6s ease 0.58s both;}
        .hero-shelf{animation:popIn 0.85s ease 0.30s both;}
      `}</style>

      {/* ────────────── NAVBAR ────────────── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:500,height:'66px',
        display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 64px',
        background: solid?'rgba(248,243,235,0.96)':'transparent',
        backdropFilter: solid?'blur(24px)':'none',
        borderBottom: solid?'1px solid rgba(200,165,90,0.18)':'none',
        boxShadow: solid?'0 2px 24px rgba(139,100,24,0.08)':'none',
        transition:'all 0.4s ease',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'37px',height:'37px',background:'linear-gradient(135deg,#c8a55a,#8b6418)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(139,100,24,0.30)',flexShrink:0}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:'700',color:'#1a1208',lineHeight:1}}>Librario</p>
            <p style={{fontSize:'8px',letterSpacing:'0.14em',color:'rgba(26,18,8,0.38)',fontWeight:'600',textTransform:'uppercase',marginTop:'1px'}}>Library Management</p>
          </div>
        </div>

        <div style={{display:'flex',gap:'34px'}}>
          {['Features','Collection','Roles','About'].map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
        </div>

        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <Link to="/login" style={{textDecoration:'none'}}>
            <button className="btn-ghost" style={{fontSize:'13px',padding:'8px 20px',borderRadius:'8px'}}>Sign In</button>
          </Link>
          <Link to="/register" style={{textDecoration:'none'}}>
            <button className="btn-gold nav-cta-hover" style={{fontSize:'13px',padding:'9px 22px',borderRadius:'9px'}}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ────────────── HERO ────────────── */}
      <section style={{minHeight:'100vh',position:'relative',display:'flex',alignItems:'center',overflow:'hidden',paddingTop:'66px'}}>
        {/* Library photo — beautifully visible, light overlay */}
        <div style={{position:'absolute',inset:0,zIndex:0}}>
          <img src="/lib.jpg" alt="library interior"
            style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 25%',filter:'brightness(0.88) saturate(0.78) contrast(1.08) sepia(0.12)'}}
          />
          {/* Multi-layer gradient — strong warm left, transparent right */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(108deg,rgba(248,243,235,1.0) 0%,rgba(248,243,235,0.96) 28%,rgba(248,243,235,0.72) 50%,rgba(248,243,235,0.28) 70%,rgba(248,243,235,0.06) 100%)'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(248,243,235,0.60) 0%,transparent 38%)'}}/>
          {/* Subtle warm colour tint on library photo side */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to left,rgba(200,165,90,0.08) 0%,transparent 50%)'}}/>
        </div>

        {/* Subtle parallax blob */}
        <div style={{position:'absolute',top:'15%',right:'8%',width:'380px',height:'380px',borderRadius:'50%',background:'radial-gradient(circle,rgba(200,165,90,0.10) 0%,transparent 70%)',pointerEvents:'none',transform:`translate(${mousePos.x*-20}px,${mousePos.y*-12}px)`,transition:'transform 0.8s ease'}}/>

        <div style={{position:'relative',zIndex:1,maxWidth:'1260px',margin:'0 auto',width:'100%',padding:'70px 64px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'80px',alignItems:'center'}}>

          {/* LEFT */}
          <div>
            <div className="tag stagger-1" style={{marginBottom:'22px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#c8a55a'}}/>
              <span>Library Management System</span>
            </div>

            <h1 className="stagger-2" style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(50px,5.8vw,76px)',lineHeight:1.04,fontWeight:'900',color:'#1a1208',marginBottom:'24px',letterSpacing:'-0.02em'}}>
              Where Every<br/>
              <em className="g-text" style={{fontStyle:'italic'}}>Story</em>&nbsp;Finds<br/>
              Its Reader
            </h1>

            <p className="stagger-3" style={{fontSize:'17px',color:'rgba(26,18,8,0.54)',lineHeight:1.90,maxWidth:'440px',marginBottom:'40px',fontWeight:'300'}}>
              A modern library experience — discover books, track borrows, manage memberships and reservations all in one beautifully designed platform.
            </p>

            <div className="stagger-4" style={{display:'flex',gap:'14px',flexWrap:'wrap'}}>
              <Link to="/register" style={{textDecoration:'none'}}>
                <button className="btn-gold" style={{fontSize:'15px',padding:'14px 34px',borderRadius:'12px'}}>
                  Get Started Free
                </button>
              </Link>
              <Link to="/login" style={{textDecoration:'none'}}>
                <button className="btn-ghost" style={{fontSize:'15px',padding:'14px 30px',borderRadius:'12px'}}>
                  Sign In →
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="stagger-5" style={{display:'flex',gap:'0',marginTop:'56px',paddingTop:'36px',borderTop:'1px solid rgba(200,165,90,0.22)'}}>
              {[{v:'12,500+',l:'Books'},{v:'3,200+',l:'Members'},{v:'98%',l:'Satisfaction'},{v:'24/7',l:'Digital Access'}].map((s,i)=>(
                <div key={s.l} style={{flex:1,paddingRight:'24px',borderRight:i<3?'1px solid rgba(200,165,90,0.18)':'none',paddingLeft:i>0?'24px':'0'}}>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:'32px',fontWeight:'700',color:'#1a1208',lineHeight:1}}>{s.v}</p>
                  <p style={{fontSize:'11px',color:'rgba(26,18,8,0.40)',marginTop:'4px',fontWeight:'500',letterSpacing:'0.04em'}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Bookshelf showcase */}
          <div className="hero-shelf">
            <div style={{
              background:'rgba(255,252,245,0.82)',
              backdropFilter:'blur(24px)',
              border:'1px solid rgba(200,165,90,0.24)',
              borderRadius:'24px',
              padding:'34px 28px 26px',
              boxShadow:'0 40px 90px rgba(139,100,24,0.14),0 10px 30px rgba(0,0,0,0.08)',
              position:'relative',
              overflow:'hidden',
            }}>
              {/* Corner accent */}
              <div style={{position:'absolute',top:0,right:0,width:'120px',height:'120px',background:'radial-gradient(circle at top right,rgba(200,165,90,0.12),transparent 70%)',pointerEvents:'none'}}/>

              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'22px'}}>
                <p style={{fontSize:'10px',fontWeight:'700',letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(122,80,16,0.55)'}}>Featured Collection</p>
                <div style={{display:'flex',gap:'4px'}}>
                  {['#c8a55a','#6b9e7e','#9b8db8'].map(c=><div key={c} style={{width:'6px',height:'6px',borderRadius:'50%',background:c}}/>)}
                </div>
              </div>

              {/* Row 1 */}
              <div style={{display:'flex',alignItems:'flex-end',gap:'4px',padding:'0 2px',marginBottom:'5px'}}>
                {BOOKS.map((b,i)=><BookSpine key={b.id} book={b} i={i} delay={0.40+i*0.055}/>)}
              </div>
              <div className="shelf-plank" style={{marginBottom:'22px'}}/>

              {/* Row 2 */}
              <div style={{display:'flex',alignItems:'flex-end',gap:'4px',padding:'0 2px',marginBottom:'5px'}}>
                {[...BOOKS].reverse().map((b,i)=><BookSpine key={`r-${b.id}`} book={b} i={i+2} delay={0.82+i*0.045}/>)}
              </div>
              <div className="shelf-plank" style={{marginBottom:'22px'}}/>

              {/* Mini cards */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                {BOOKS.slice(0,4).map(b=>(
                  <div key={`mc-${b.id}`} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',background:'rgba(248,243,235,0.90)',border:'1px solid rgba(200,165,90,0.16)',borderRadius:'10px',cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(200,165,90,0.10)';e.currentTarget.style.borderColor='rgba(200,165,90,0.35)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(248,243,235,0.90)';e.currentTarget.style.borderColor='rgba(200,165,90,0.16)';}}>
                    <div style={{width:'5px',height:'32px',background:`linear-gradient(180deg,${b.h},${b.s})`,borderRadius:'3px',flexShrink:0}}/>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:'10.5px',fontWeight:'600',color:'#1a1208',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',lineHeight:1.3}}>{b.title}</p>
                      <p style={{fontSize:'9px',color:'rgba(26,18,8,0.38)',marginTop:'1px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── DARK STATS BAND ────────────── */}
      <div style={{background:'linear-gradient(135deg,#1a1208 0%,#2d1c08 45%,#1a1208 100%)',padding:'44px 64px'}}>
        <div style={{maxWidth:'1260px',margin:'0 auto',display:'flex',justifyContent:'space-around',alignItems:'center',flexWrap:'wrap',gap:'28px'}}>
          {[{v:'12,500+',l:'Books in Collection',e:'📚'},{v:'3,200+',l:'Active Members',e:'👥'},{v:'98%',l:'Satisfaction Rate',e:'⭐'},{v:'24/7',l:'Digital Access',e:'🌐'},{v:'< 50ms',l:'Response Time',e:'⚡'}].map(s=>(
            <div key={s.l} style={{textAlign:'center'}}>
              <p style={{fontSize:'15px',marginBottom:'6px'}}>{s.e}</p>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'30px',fontWeight:'700',color:'#c8a55a',lineHeight:1}}>{s.v}</p>
              <p style={{fontSize:'11px',color:'rgba(248,243,235,0.36)',marginTop:'5px',fontWeight:'500',letterSpacing:'0.03em'}}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────── FEATURES — Editorial list style ────────────── */}
      <section id="features" style={{padding:'110px 64px',background:'#f8f3eb'}} ref={el=>sRefs.current['f']=el} data-s="f">
        <div style={{maxWidth:'1260px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'80px',alignItems:'start'}}>
            {/* Left sticky label */}
            <div style={{position:'sticky',top:'100px'}}>
              <div className="tag" style={{marginBottom:'20px'}}><span>Why Librario</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(36px,4vw,54px)',fontWeight:'900',color:'#1a1208',lineHeight:1.1,marginBottom:'18px'}}>
                Everything<br/>your<br/>library<br/><em style={{fontStyle:'italic',color:'#c8a55a'}}>needs.</em>
              </h2>
              <p style={{fontSize:'14px',color:'rgba(26,18,8,0.48)',lineHeight:1.8,maxWidth:'240px'}}>
                Built for admins, librarians and members — one platform, every tool.
              </p>
            </div>
            {/* Right — feature list */}
            <div>
              {FEATURES.map((f,i)=>(
                <div key={f.num} className="feat-row" style={{
                  display:'grid',gridTemplateColumns:'60px 1fr',gap:'20px',
                  padding:'28px 20px',borderBottom:'1px solid rgba(200,165,90,0.14)',
                  borderRadius:'10px',transition:'background 0.25s',
                  animation: vis['f'] ? `fadeUp 0.5s ease ${i*0.08}s both` : 'none',
                }}>
                  <p className="feat-num" style={{fontFamily:"'Playfair Display',serif",fontSize:'28px',fontWeight:'900',color:'rgba(26,18,8,0.14)',lineHeight:1,transition:'color 0.25s'}}>{f.num}</p>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                      <div style={{width:'8px',height:'8px',borderRadius:'50%',background:f.col,boxShadow:`0 0 8px ${f.col}60`,flexShrink:0}}/>
                      <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1a1208'}}>{f.title}</h3>
                    </div>
                    <p style={{fontSize:'13.5px',color:'rgba(26,18,8,0.50)',lineHeight:1.75,paddingLeft:'18px'}}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── ROLES — 3 elegant cards ────────────── */}
      <section id="roles" style={{padding:'100px 64px',background:'linear-gradient(180deg,#ede8df 0%,#f8f3eb 100%)'}} ref={el=>sRefs.current['r']=el} data-s="r">
        <div style={{maxWidth:'1260px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'60px'}}>
            <div className="tag" style={{justifyContent:'center',marginBottom:'16px'}}><span>Access Levels</span></div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(34px,4vw,52px)',fontWeight:'900',color:'#1a1208'}}>Built for every role</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px'}}>
            {[
              {role:'Admin',     col:'#c8a55a', bg:'rgba(200,165,90,0.08)',  bdr:'rgba(200,165,90,0.25)',  e:'👑',
               desc:'Complete system authority.',
               perms:['Manage all users & librarians','Approve/reject registrations','Add, edit & delete books','Manage subscriptions','View all borrow records','Full dashboard access']},
              {role:'Librarian', col:'#9b8db8', bg:'rgba(155,141,184,0.08)', bdr:'rgba(155,141,184,0.25)', e:'📖',
               desc:'Day-to-day operations.',
               perms:['Issue & return books','Add and manage books','Register walk-in members','Approve new users','View borrow records','Manage reservations']},
              {role:'Member',    col:'#6b9e7e', bg:'rgba(107,158,126,0.08)', bdr:'rgba(107,158,126,0.25)', e:'🎓',
               desc:'Library access & discovery.',
               perms:['Browse full book catalog','Search & filter books','Reserve unavailable books','Track borrow history','Email notifications','Manage own profile']},
            ].map((r,i)=>(
              <div key={r.role} className="role-card" style={{
                background:r.bg,border:`1.5px solid ${r.bdr}`,borderRadius:'20px',padding:'38px 30px',
                boxShadow:`0 8px 32px ${r.col}12`,
                animation: vis['r'] ? `fadeUp 0.55s ease ${i*0.14}s both` : 'none',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'10px'}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'rgba(255,255,255,0.80)',border:`2px solid ${r.bdr}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',boxShadow:`0 4px 16px ${r.col}20`}}>{r.e}</div>
                  <div>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'24px',fontWeight:'700',color:r.col}}>{r.role}</h3>
                    <p style={{fontSize:'11px',color:`${r.col}90`,fontWeight:'600',marginTop:'1px'}}>{r.desc}</p>
                  </div>
                </div>
                <div style={{height:'1px',background:`${r.col}20`,margin:'18px 0'}}/>
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  {r.perms.map(p=>(
                    <div key={p} style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={r.col} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:'3px'}}><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{fontSize:'13px',color:'rgba(26,18,8,0.62)',lineHeight:1.45}}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── COLLECTION GRID ────────────── */}
      <section id="collection" style={{padding:'100px 64px',background:'#f8f3eb'}} ref={el=>sRefs.current['c']=el} data-s="c">
        <div style={{maxWidth:'1260px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'48px'}}>
            <div>
              <div className="tag" style={{marginBottom:'14px'}}><span>Our Collection</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,4vw,50px)',fontWeight:'900',color:'#1a1208'}}>Popular Books</h2>
            </div>
            <Link to="/login" style={{color:'#7a5010',textDecoration:'none',fontSize:'14px',fontWeight:'700',letterSpacing:'0.02em',display:'flex',alignItems:'center',gap:'5px',transition:'gap 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.gap='9px'}
              onMouseLeave={e=>e.currentTarget.style.gap='5px'}>
              View All →
            </Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px'}}>
            {BOOKS.map((book,i)=>(
              <div key={`t-${book.id}`} className="book-tile" style={{
                background:'#fff',border:'1px solid rgba(200,165,90,0.16)',borderRadius:'14px',overflow:'hidden',
                boxShadow:'0 4px 18px rgba(26,18,8,0.07)',
                animation: vis['c'] ? `fadeUp 0.50s ease ${i*0.07}s both` : 'none',
              }}>
                <div style={{height:'152px',background:`linear-gradient(150deg,${book.h}28,${book.h}50)`,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div style={{position:'absolute',left:0,top:0,bottom:0,width:'10px',background:`linear-gradient(180deg,${book.h},${book.s})`}}/>
                  <div style={{textAlign:'center',padding:'0 18px'}}>
                    <div style={{fontSize:'28px',marginBottom:'8px',opacity:0.70}}>📖</div>
                    <p style={{fontSize:'9.5px',color:book.s,fontWeight:'700',letterSpacing:'0.10em',textTransform:'uppercase'}}>{book.cat}</p>
                  </div>
                  <div style={{position:'absolute',top:'10px',right:'10px',background:'rgba(107,158,126,0.14)',border:'1px solid rgba(107,158,126,0.35)',borderRadius:'20px',padding:'2px 9px'}}>
                    <span style={{fontSize:'8.5px',color:'#3a6a50',fontWeight:'700',letterSpacing:'0.05em'}}>AVAILABLE</span>
                  </div>
                </div>
                <div style={{padding:'14px 16px'}}>
                  <p style={{fontSize:'13px',fontWeight:'700',color:'#1a1208',marginBottom:'3px',lineHeight:1.3}}>{book.title}</p>
                  <p style={{fontSize:'11px',color:'rgba(26,18,8,0.38)'}}>{book.author}</p>
                  <div style={{marginTop:'11px',paddingTop:'10px',borderTop:'1px solid rgba(200,165,90,0.12)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'9.5px',background:`${book.h}22`,color:book.s,padding:'2px 10px',borderRadius:'5px',fontWeight:'700'}}>{book.cat}</span>
                    <Link to="/login" style={{fontSize:'11px',color:'#7a5010',textDecoration:'none',fontWeight:'700'}}>Borrow →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── TESTIMONIALS ────────────── */}
      <section style={{padding:'96px 64px',background:'linear-gradient(135deg,#1a1208 0%,#2d1c08 45%,#1a1208 100%)',position:'relative',overflow:'hidden'}}>
        {/* Decorative */}
        <div style={{position:'absolute',top:'-60px',right:'-60px',width:'280px',height:'280px',borderRadius:'50%',border:'1px solid rgba(200,165,90,0.08)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-40px',left:'-40px',width:'200px',height:'200px',borderRadius:'50%',border:'1px solid rgba(200,165,90,0.06)',pointerEvents:'none'}}/>
        <div style={{maxWidth:'760px',margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
          <div className="tag" style={{justifyContent:'center',background:'rgba(200,165,90,0.12)',borderColor:'rgba(200,165,90,0.24)',marginBottom:'18px'}}>
            <span style={{color:'#c8a55a'}}>Testimonials</span>
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'#f5edd8',marginBottom:'50px'}}>What our users say</h2>
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,165,90,0.16)',borderRadius:'22px',padding:'46px 50px',minHeight:'210px'}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{display:i===test?'block':'none',animation:'fadeUp 0.5s ease'}}>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(16px,2.2vw,22px)',color:'rgba(245,237,216,0.90)',lineHeight:1.78,fontStyle:'italic',marginBottom:'30px'}}>
                  "{t.text}"
                </p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'14px'}}>
                  <div style={{width:'46px',height:'46px',borderRadius:'50%',background:`linear-gradient(135deg,${t.c},${t.c}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#fff',fontSize:'17px',fontFamily:"'Playfair Display',serif",boxShadow:`0 4px 16px ${t.c}44`}}>{t.av}</div>
                  <div style={{textAlign:'left'}}>
                    <p style={{fontWeight:'700',color:'#f5edd8',fontSize:'14px'}}>{t.name}</p>
                    <p style={{fontSize:'12px',color:'rgba(245,237,216,0.38)',marginTop:'2px'}}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'28px'}}>
              {TESTIMONIALS.map((_,i)=>(
                <div key={i} onClick={()=>setTest(i)} style={{width:i===test?'24px':'7px',height:'7px',borderRadius:'4px',background:i===test?'#c8a55a':'rgba(200,165,90,0.26)',transition:'all 0.36s ease',cursor:'pointer'}}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── CTA ────────────── */}
      <section id="about" style={{padding:'120px 64px',background:'#f8f3eb',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'800px',height:'400px',background:'radial-gradient(ellipse,rgba(200,165,90,0.09) 0%,transparent 68%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:'700px',margin:'0 auto'}}>
          <div className="tag" style={{justifyContent:'center',marginBottom:'22px'}}><span>Get Started Today</span></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(40px,5.5vw,68px)',fontWeight:'900',color:'#1a1208',lineHeight:1.06,marginBottom:'20px',letterSpacing:'-0.02em'}}>
            Ready to explore<br/><em className="g-text" style={{fontStyle:'italic'}}>your library?</em>
          </h2>
          <p style={{color:'rgba(26,18,8,0.46)',fontSize:'16px',marginBottom:'42px',lineHeight:1.78,maxWidth:'480px',margin:'0 auto 42px'}}>
            Join thousands of readers who manage their library life with Librario. Free to get started.
          </p>
          <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/register" style={{textDecoration:'none'}}>
              <button className="btn-gold" style={{fontSize:'16px',padding:'17px 44px',borderRadius:'13px'}}>Create Free Account</button>
            </Link>
            <Link to="/login" style={{textDecoration:'none'}}>
              <button className="btn-ghost" style={{fontSize:'16px',padding:'17px 34px',borderRadius:'13px'}}>Sign In</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────── FOOTER ────────────── */}
      <footer style={{padding:'30px 64px',background:'#1a1208',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
          <div style={{width:'30px',height:'30px',background:'linear-gradient(135deg,#c8a55a,#8b6418)',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:'16px',color:'rgba(245,237,216,0.55)'}}>Librario</span>
        </div>
        <p style={{fontSize:'12px',color:'rgba(245,237,216,0.24)'}}>© 2026 Librario. Built for knowledge seekers.</p>
        <div style={{display:'flex',gap:'24px'}}>
          {[['Sign In','/login'],['Register','/register']].map(([l,p])=>(
            <Link key={l} to={p} style={{fontSize:'13px',color:'rgba(245,237,216,0.34)',textDecoration:'none',transition:'color 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.color='#c8a55a'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(245,237,216,0.34)'}>
              {l}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
