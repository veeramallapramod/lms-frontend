import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const BOOKS = [
  { id:1, title:'The Great Gatsby',      author:'F. Scott Fitzgerald', cat:'Classic',    h:'#c8a55a', s:'#8b6a1f' },
  { id:2, title:'Sapiens',              author:'Yuval Noah Harari',   cat:'History',    h:'#6b9e7e', s:'#2d6b4a' },
  { id:3, title:'Atomic Habits',        author:'James Clear',         cat:'Self-Help',  h:'#d4845a', s:'#8b4a1a' },
  { id:4, title:'1984',                 author:'George Orwell',       cat:'Fiction',    h:'#9b8db8', s:'#4a3d6b' },
  { id:5, title:'Thinking Fast & Slow', author:'D. Kahneman',         cat:'Psychology', h:'#7ea8c8', s:'#2d5a8b' },
  { id:6, title:'The Alchemist',        author:'Paulo Coelho',        cat:'Fiction',    h:'#c8a06e', s:'#8b6020' },
  { id:7, title:'Dune',                 author:'Frank Herbert',       cat:'Sci-Fi',     h:'#c8b46e', s:'#8b7220' },
  { id:8, title:'A Brief History',      author:'S. Hawking',          cat:'Science',    h:'#6ea8c8', s:'#1a5a8b' },
];

const FEATURES = [
  { num:'01', icon:'📚', title:'Smart Borrow System',   desc:'Issue books, track due dates, auto-calculate fines. Full borrow history per member.',   col:'#c8a55a' },
  { num:'02', icon:'🔐', title:'3-Role Access Control', desc:'Admin, Librarian and Member — each with precisely scoped permissions and dashboards.',   col:'#9b8db8' },
  { num:'03', icon:'🔔', title:'Book Reservations',     desc:'Queue reservations on unavailable books. Instant email alert the moment it returns.',   col:'#6b9e7e' },
  { num:'04', icon:'🖼️', title:'Rich Book Catalog',    desc:'Search, filter, upload covers. Live availability badges across the full collection.',    col:'#7ea8c8' },
  { num:'05', icon:'📊', title:'Live Analytics',        desc:'Real-time stats: borrows, overdue items, pending approvals, member activity.',           col:'#d4845a' },
  { num:'06', icon:'✉️', title:'Email Notifications',  desc:'OTP, approval alerts, borrow confirmations, reservation updates via Gmail SMTP.',         col:'#7aac5a' },
];

const ROLES = [
  { role:'Admin',     col:'#c8a55a', e:'👑',
    perms:['Full system control','Manage all users & staff','Approve registrations','Subscription management','View all records & logs'] },
  { role:'Librarian', col:'#9b8db8', e:'📖',
    perms:['Issue & return books','Add & manage books','Register walk-in members','Approve new users','Manage reservations'] },
  { role:'Member',    col:'#6b9e7e', e:'🎓',
    perms:['Browse full catalog','Reserve unavailable books','Track borrow history','Email notifications','Manage own profile'] },
];

const TESTIMONIALS = [
  { name:'Arjun Sharma',  role:'Research Scholar', text:'Librario transformed how I discover and access books. The reservation system is pure genius.', av:'A', c:'#c8a55a' },
  { name:'Priya Nair',    role:'Senior Librarian', text:'Managing 12,000+ volumes has never felt this effortless. The admin panel is beautifully intuitive.', av:'P', c:'#9b8db8' },
  { name:'Rahul Verma',   role:'Graduate Student', text:'Found rare research material I could not locate anywhere else. Outstanding depth of collection.', av:'R', c:'#6b9e7e' },
];

function BookSpine({ book, i, delay }) {
  const hs = [118,135,105,145,122,138,108,128];
  const ws = [40,34,46,36,42,38,44,32];
  const [up, setUp] = useState(false);
  return (
    <div onMouseEnter={()=>setUp(true)} onMouseLeave={()=>setUp(false)}
      style={{
        width:`${ws[i%8]}px`, height:`${hs[i%8]}px`, flexShrink:0, cursor:'pointer', position:'relative',
        background:`linear-gradient(165deg,${book.h},${book.s})`,
        borderRadius:'2px 5px 5px 2px',
        boxShadow:`2px 6px 18px rgba(0,0,0,0.38), inset -3px 0 8px rgba(0,0,0,0.22), inset 1px 0 0 rgba(255,255,255,0.15)`,
        transform: up ? 'translateY(-24px) rotate(-2deg)' : `translateY(0) rotate(${i%3===1?'1.5deg':i%3===2?'-1deg':'0deg'})`,
        transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        animation:`riseBook 0.7s ease ${delay}s both`,
      }}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:'4px',background:'rgba(255,255,255,0.25)',borderRadius:'2px 0 0 2px'}}/>
      <div style={{position:'absolute',right:0,top:3,bottom:3,width:'3px',background:'rgba(255,255,255,0.55)',borderRadius:'0 3px 3px 0'}}/>
      <div style={{position:'absolute',inset:'6px 5px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{fontSize:'6.5px',fontWeight:'700',color:'rgba(255,255,255,0.75)',writingMode:'vertical-rl',textAlign:'center',lineHeight:1.3,fontFamily:"'Playfair Display',serif",letterSpacing:'0.03em'}}>{book.title}</p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [scroll,   setScroll]   = useState(0);
  const [test,     setTest]     = useState(0);
  const [vis,      setVis]      = useState({});
  const [navSolid, setNavSolid] = useState(false);
  const refs = useRef({});

  useEffect(()=>{
    const onScroll = ()=>{
      const y = window.scrollY;
      setScroll(y);
      setNavSolid(y > 60);
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    return ()=> window.removeEventListener('scroll', onScroll);
  },[]);

  useEffect(()=>{
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if(e.isIntersecting) setVis(v=>({...v,[e.target.dataset.s]:true}));
      }),
      { threshold:0.06 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return ()=> obs.disconnect();
  },[]);

  useEffect(()=>{
    const t = setInterval(()=> setTest(p=>(p+1)%3), 5200);
    return ()=> clearInterval(t);
  },[]);

  const heroOpacity = Math.max(0, 1 - scroll / (typeof window !== 'undefined' ? window.innerHeight * 0.7 : 700));
  const heroShift   = scroll * 0.22;

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif", color:'#1a1208', overflowX:'hidden'}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#f8f3eb;}

        /*
         ╔══════════════════════════════════════════╗
         ║  THE EFFECT — exactly like the reference ║
         ║                                          ║
         ║  1. Library image: position:fixed        ║
         ║     → stays 100% still, never moves      ║
         ║                                          ║
         ║  2. Hero section: transparent            ║
         ║     → you see the library through it     ║
         ║                                          ║
         ║  3. .content-layer: solid parchment bg   ║
         ║     → scrolls up OVER the frozen image   ║
         ║     → creates the cinematic wipe moment  ║
         ║                                          ║
         ║  4. .parallax-strip: CSS background-     ║
         ║     attachment:fixed on later sections   ║
         ║     → library "windows" that peek thru   ║
         ╚══════════════════════════════════════════╝
        */

        .lib-fixed-bg {
          position: fixed;
          top:0; left:0; width:100%; height:100vh;
          z-index: 0;
        }
        .lib-fixed-bg img {
          width:100%; height:100%;
          object-fit:cover; object-position:center 25%;
          filter: brightness(0.42) contrast(1.12) saturate(0.62) sepia(0.18);
          display:block;
        }
        .lib-fixed-bg::after {
          content:'';
          position:absolute; inset:0;
          background:
            linear-gradient(108deg,
              rgba(8,5,2,0.80) 0%,
              rgba(8,5,2,0.48) 42%,
              rgba(8,5,2,0.18) 72%,
              rgba(8,5,2,0.08) 100%),
            linear-gradient(to bottom,
              rgba(8,5,2,0.10) 0%,
              transparent 28%,
              transparent 62%,
              rgba(8,5,2,0.65) 100%);
        }

        .hero-section {
          position:relative;
          z-index:10;
          min-height:100vh;
          display:flex;
          align-items:center;
          /* transparent — library shows through completely */
        }

        /* Solid bg layer that wipes over the frozen library */
        .content-layer {
          position:relative;
          z-index:20;
          background:#f8f3eb;
        }

        /* CSS parallax strips — library "windows" inside content */
        .parallax-strip {
          position:relative; z-index:21;
          background-image: url('/lib.jpg');
          background-size: cover;
          background-attachment: fixed;   /* ← this is what keeps it still */
          background-position: center 25%;
        }
        .parallax-strip::before {
          content:''; position:absolute; inset:0;
          background: rgba(8,5,2,0.70);
        }
        .parallax-strip > .ps-inner { position:relative; z-index:1; }

        /* ── ANIMATIONS ── */
        @keyframes riseBook  { from{opacity:0;transform:translateY(32px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(26px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes float     { 0%,100%{transform:translateY(0);}  50%{transform:translateY(-11px);} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1);}  50%{opacity:.55;transform:scale(.93);} }
        @keyframes goldFlow  { 0%{background-position:-300% center;} 100%{background-position:300% center;} }
        @keyframes bounceY   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(9px);} }
        @keyframes shimmer   { 0%{transform:translateX(-100%);} 100%{transform:translateX(400%);} }

        .s1{animation:fadeUp .70s ease .05s both;}
        .s2{animation:fadeUp .70s ease .18s both;}
        .s3{animation:fadeUp .70s ease .32s both;}
        .s4{animation:fadeUp .70s ease .46s both;}
        .s5{animation:fadeUp .70s ease .60s both;}
        .cpop{animation:fadeUp .90s cubic-bezier(.22,1,.36,1) .28s both;}
        .floating{animation:float 5s ease-in-out infinite;}

        .gold-shimmer {
          background:linear-gradient(120deg,#5a3800 0%,#c8a55a 28%,#f5d98a 50%,#c8a55a 72%,#5a3800 100%);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:goldFlow 4.5s linear infinite;
        }

        .reveal     { opacity:0; transform:translateY(28px); transition:opacity .75s ease,transform .75s ease; }
        .reveal.in  { opacity:1; transform:none; }

        .btn-gold {
          background:linear-gradient(135deg,#c8a55a,#8b6418);
          color:#fff; border:none; font-weight:700;
          font-family:'DM Sans',sans-serif; cursor:pointer;
          transition:all .30s;
          box-shadow:0 6px 28px rgba(139,100,24,.42);
          position:relative; overflow:hidden;
        }
        .btn-gold::after {
          content:''; position:absolute; top:0; left:-100%; width:50%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);
          transition:left .5s;
        }
        .btn-gold:hover::after{left:200%;}
        .btn-gold:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(139,100,24,.54);}

        .btn-ghost {
          background:rgba(245,237,216,.10); border:1.5px solid rgba(245,237,216,.28);
          color:#f5edd8; font-weight:600; font-family:'DM Sans',sans-serif;
          cursor:pointer; transition:all .25s;
        }
        .btn-ghost:hover{background:rgba(245,237,216,.18);transform:translateY(-2px);}

        .nav-link {
          color:rgba(245,237,216,.52); text-decoration:none;
          font-size:13.5px; font-weight:500; letter-spacing:.02em;
          transition:color .2s; position:relative;
        }
        .nav-link::after{
          content:''; position:absolute; bottom:-4px; left:0; right:0;
          height:1px; background:#c8a55a;
          transform:scaleX(0); transform-origin:center; transition:transform .25s;
        }
        .nav-link:hover{color:#c8a55a;}
        .nav-link:hover::after{transform:scaleX(1);}

        .stag {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(200,165,90,.11); border:1px solid rgba(200,165,90,.30);
          border-radius:50px; padding:5px 16px;
        }
        .stag span { font-size:10.5px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#8b6418; }

        .feat-row {
          display:grid; grid-template-columns:56px 1fr; gap:18px;
          padding:24px 16px; border-bottom:1px solid rgba(26,18,8,.07);
          border-radius:10px; cursor:default;
          transition:background .25s,transform .25s;
        }
        .feat-row:hover{background:rgba(200,165,90,.06);transform:translateX(6px);}
        .feat-row:hover .fn{color:#c8a55a!important;}

        .bk-tile{transition:all .32s ease;}
        .bk-tile:hover{transform:translateY(-9px);box-shadow:0 28px 55px rgba(26,18,8,.16)!important;}

        .role-card{transition:transform .28s,box-shadow .28s;}
        .role-card:hover{transform:translateY(-7px);box-shadow:0 20px 60px rgba(26,18,8,.12)!important;}

        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#f8f3eb;}
        ::-webkit-scrollbar-thumb{background:rgba(200,165,90,.38);border-radius:4px;}

        .scroll-cue{animation:bounceY 1.9s ease-in-out infinite;}
        .shelf{height:12px;background:linear-gradient(180deg,#9b7232,#4a3208);border-radius:3px;box-shadow:0 5px 18px rgba(0,0,0,.40);}
        .gold-rule{height:1px;background:linear-gradient(90deg,transparent,rgba(200,165,90,.45),transparent);}
      `}</style>

      {/* ══════════════════════════════════════════
          FIXED LIBRARY BG — position:fixed
          This image NEVER moves. Zero.
      ══════════════════════════════════════════ */}
      <div className="lib-fixed-bg">
        <img src="/lib.jpg" alt="" draggable="false"/>
      </div>

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        height:'64px', display:'flex', alignItems:'center',
        justifyContent:'space-between', padding:'0 60px',
        background: navSolid ? 'rgba(10,7,2,0.92)' : 'transparent',
        backdropFilter: navSolid ? 'blur(22px)' : 'none',
        borderBottom: navSolid ? '1px solid rgba(200,165,90,0.15)' : 'none',
        transition:'all .40s ease',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
          <div style={{width:'36px',height:'36px',background:'linear-gradient(135deg,#c8a55a,#8b6418)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(139,100,24,.44)',flexShrink:0}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:'700',color:'#f5edd8',lineHeight:1}}>Librario</p>
            <p style={{fontSize:'8px',letterSpacing:'.16em',color:'rgba(245,237,216,.32)',fontWeight:'600',textTransform:'uppercase',marginTop:'1px'}}>Library System</p>
          </div>
        </div>

        <div style={{display:'flex',gap:'34px'}}>
          {['Features','Collection','Roles','Plans'].map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
        </div>

        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <Link to="/login" style={{textDecoration:'none'}}>
            <button className="btn-ghost" style={{fontSize:'13px',padding:'8px 20px',borderRadius:'8px'}}>Sign In</button>
          </Link>
          <Link to="/register" style={{textDecoration:'none'}}>
            <button className="btn-gold" style={{fontSize:'13px',padding:'9px 22px',borderRadius:'9px'}}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO — transparent, sits on fixed library
          Content drifts up & fades as you scroll
      ══════════════════════════════════════════ */}
      <section className="hero-section" style={{padding:'0 60px'}}>
        <div style={{
          maxWidth:'1260px', margin:'0 auto', width:'100%',
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center',
          transform:`translateY(${-heroShift}px)`,
          opacity: heroOpacity,
          transition:'opacity .06s linear',
        }}>
          {/* left */}
          <div>
            <div className="stag s1" style={{marginBottom:'22px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#c8a55a',animation:'pulse 2s infinite'}}/>
              <span>Library Management System</span>
            </div>

            <h1 className="s2" style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:'clamp(50px,5.8vw,78px)', lineHeight:1.04,
              fontWeight:'900', color:'#f5edd8', marginBottom:'22px',
              letterSpacing:'-0.02em', textShadow:'0 4px 32px rgba(0,0,0,.55)',
            }}>
              Where Every<br/>
              <em className="gold-shimmer" style={{fontStyle:'italic'}}>Story</em>&nbsp;Finds<br/>
              Its Reader
            </h1>

            <p className="s3" style={{fontSize:'17px',color:'rgba(245,237,216,.58)',lineHeight:1.88,maxWidth:'430px',marginBottom:'38px',fontWeight:'300',textShadow:'0 2px 14px rgba(0,0,0,.45)'}}>
              A modern library experience — discover books, track borrows, manage memberships and reservations all in one beautifully crafted platform.
            </p>

            <div className="s4" style={{display:'flex',gap:'13px',flexWrap:'wrap'}}>
              <Link to="/register" style={{textDecoration:'none'}}>
                <button className="btn-gold" style={{fontSize:'15px',padding:'14px 34px',borderRadius:'12px'}}>Get Started Free</button>
              </Link>
              <Link to="/login" style={{textDecoration:'none'}}>
                <button className="btn-ghost" style={{fontSize:'15px',padding:'14px 28px',borderRadius:'12px'}}>Sign In →</button>
              </Link>
            </div>

            <div className="s5" style={{display:'flex',gap:'11px',marginTop:'46px',flexWrap:'wrap'}}>
              {[{v:'12,500+',l:'Books'},{v:'3,200+',l:'Members'},{v:'98%',l:'Satisfaction'},{v:'3 Roles',l:'Access Levels'}].map(s=>(
                <div key={s.l} style={{padding:'11px 16px',borderRadius:'11px',textAlign:'center',background:'rgba(8,5,2,.58)',backdropFilter:'blur(20px)',border:'1px solid rgba(200,165,90,.22)',minWidth:'80px'}}>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:'700',color:'#c8a55a',lineHeight:1}}>{s.v}</p>
                  <p style={{fontSize:'10px',color:'rgba(245,237,216,.38)',marginTop:'3px',fontWeight:'500',letterSpacing:'.04em'}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* right — floating bookshelf card */}
          <div className="cpop floating">
            <div style={{background:'rgba(8,5,2,.72)',backdropFilter:'blur(28px)',border:'1px solid rgba(200,165,90,.22)',borderRadius:'22px',padding:'30px 24px 22px',boxShadow:'0 40px 100px rgba(0,0,0,.65)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px'}}>
                <p style={{fontSize:'10px',fontWeight:'700',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(200,165,90,.52)'}}>Featured Collection</p>
                <div style={{display:'flex',gap:'5px'}}>
                  {['#c8a55a','#9b8db8','#6b9e7e'].map(c=>(
                    <div key={c} style={{width:'7px',height:'7px',borderRadius:'50%',background:c,boxShadow:`0 0 6px ${c}`}}/>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:'4px',marginBottom:'4px'}}>
                {BOOKS.map((b,i)=> <BookSpine key={b.id} book={b} i={i} delay={0.4+i*.055}/>)}
              </div>
              <div className="shelf" style={{marginBottom:'18px'}}/>
              <div style={{display:'flex',alignItems:'flex-end',gap:'4px',marginBottom:'4px'}}>
                {[...BOOKS].reverse().map((b,i)=> <BookSpine key={`r${b.id}`} book={b} i={i+2} delay={0.8+i*.045}/>)}
              </div>
              <div className="shelf" style={{marginBottom:'18px'}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px'}}>
                {BOOKS.slice(0,4).map(b=>(
                  <div key={`mc${b.id}`} style={{display:'flex',alignItems:'center',gap:'9px',padding:'9px 11px',background:'rgba(245,237,216,.05)',border:'1px solid rgba(200,165,90,.13)',borderRadius:'9px',cursor:'pointer',transition:'all .2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(200,165,90,.12)';e.currentTarget.style.borderColor='rgba(200,165,90,.30)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(245,237,216,.05)';e.currentTarget.style.borderColor='rgba(200,165,90,.13)';}}>
                    <div style={{width:'5px',height:'30px',background:`linear-gradient(${b.h},${b.s})`,borderRadius:'3px',flexShrink:0}}/>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:'10.5px',fontWeight:'600',color:'rgba(245,237,216,.88)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',lineHeight:1.3}}>{b.title}</p>
                      <p style={{fontSize:'9px',color:'rgba(245,237,216,.36)',marginTop:'1px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div style={{position:'absolute',bottom:'28px',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'7px',opacity:heroOpacity*.65,transition:'opacity .08s',pointerEvents:'none'}}>
          <p style={{fontSize:'10px',letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(200,165,90,.65)',fontWeight:'600'}}>Scroll to explore</p>
          <svg className="scroll-cue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(200,165,90,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTENT LAYER — scrolls over frozen library
          Starts with #1a1208 dark band for drama
      ══════════════════════════════════════════ */}
      <div className="content-layer">

        {/* ── Dark stats band ── */}
        <div style={{background:'#1a1208',padding:'54px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:'32px',alignItems:'center'}}>
            {[{v:'12,500+',l:'Books in Collection',e:'📚'},{v:'3,200+',l:'Active Members',e:'👥'},{v:'98%',l:'Satisfaction Rate',e:'⭐'},{v:'24/7',l:'Digital Access',e:'🌐'},{v:'<50ms',l:'Avg Response',e:'⚡'}].map(s=>(
              <div key={s.l} style={{textAlign:'center'}}>
                <p style={{fontSize:'15px',marginBottom:'8px'}}>{s.e}</p>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:'38px',fontWeight:'900',color:'#c8a55a',lineHeight:1}}>{s.v}</p>
                <p style={{fontSize:'11px',color:'rgba(245,237,216,.32)',marginTop:'6px',fontWeight:'500',letterSpacing:'.04em'}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section id="features"
          ref={el=>refs.current['f']=el} data-s="f"
          style={{background:'#f8f3eb',padding:'110px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 2fr',gap:'90px',alignItems:'start'}}>
            <div style={{position:'sticky',top:'92px'}}>
              <div className="stag" style={{marginBottom:'20px'}}><span>Why Librario</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(36px,4vw,54px)',fontWeight:'900',color:'#1a1208',lineHeight:1.12,marginBottom:'18px'}}>
                Everything<br/>your library<br/><em className="gold-shimmer" style={{fontStyle:'italic'}}>needs.</em>
              </h2>
              <p style={{fontSize:'14px',color:'rgba(26,18,8,.44)',lineHeight:1.85,maxWidth:'230px'}}>
                One platform. Every tool. Built for admins, librarians and members alike.
              </p>
              <div style={{marginTop:'30px',height:'1px',background:'linear-gradient(90deg,rgba(200,165,90,.45),transparent)'}}/>
            </div>

            <div>
              {FEATURES.map((f,i)=>(
                <div key={f.num} className="feat-row" style={{
                  opacity: vis['f'] ? 1 : 0,
                  transform: vis['f'] ? 'none' : 'translateY(18px)',
                  transition:`opacity .62s ease ${i*.09}s,transform .62s ease ${i*.09}s`,
                }}>
                  <p className="fn" style={{fontFamily:"'Playfair Display',serif",fontSize:'24px',fontWeight:'900',color:'rgba(26,18,8,.10)',lineHeight:1,transition:'color .25s'}}>{f.num}</p>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'7px'}}>
                      <span style={{fontSize:'18px'}}>{f.icon}</span>
                      <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1a1208'}}>{f.title}</h3>
                    </div>
                    <p style={{fontSize:'13.5px',color:'rgba(26,18,8,.48)',lineHeight:1.76,paddingLeft:'28px'}}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARALLAX STRIP #1 — library window inside content ── */}
        <div className="parallax-strip" style={{padding:'90px 60px'}}>
          <div className="ps-inner" style={{maxWidth:'700px',margin:'0 auto',textAlign:'center'}}>
            <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(200,165,90,.62)',marginBottom:'18px'}}>Our Philosophy</p>
            <blockquote style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(22px,3vw,34px)',fontWeight:'700',color:'#f5edd8',lineHeight:1.55,fontStyle:'italic',textShadow:'0 4px 24px rgba(0,0,0,.55)'}}>
              "A library is not just a building of books — it is a living, breathing community of knowledge seekers."
            </blockquote>
            <div style={{width:'60px',height:'2px',background:'linear-gradient(90deg,transparent,#c8a55a,transparent)',margin:'22px auto 0'}}/>
          </div>
        </div>

        {/* ── ROLES ── */}
        <section id="roles"
          ref={el=>refs.current['r']=el} data-s="r"
          style={{background:'#f2ead8',padding:'110px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'60px'}}>
              <div className="stag" style={{justifyContent:'center',marginBottom:'16px'}}><span>Access Levels</span></div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(34px,4vw,52px)',fontWeight:'900',color:'#1a1208'}}>Built for every role</h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'22px'}}>
              {ROLES.map((r,i)=>(
                <div key={r.role} className="role-card" style={{
                  background:'#fff',borderRadius:'20px',padding:'36px 28px',
                  border:'1px solid rgba(26,18,8,.07)',
                  boxShadow:'0 6px 36px rgba(26,18,8,.07)',
                  opacity: vis['r'] ? 1 : 0,
                  transform: vis['r'] ? 'none' : 'translateY(24px)',
                  transition:`opacity .70s ease ${i*.15}s,transform .70s ease ${i*.15}s`,
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'8px'}}>
                    <div style={{width:'52px',height:'52px',borderRadius:'50%',
                      background:r.col==='#c8a55a'?'rgba(200,165,90,.12)':r.col==='#9b8db8'?'rgba(155,141,184,.12)':'rgba(107,158,126,.12)',
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',flexShrink:0}}>{r.e}</div>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'24px',fontWeight:'700',color:r.col}}>{r.role}</h3>
                  </div>
                  <div style={{height:'1px',background:'rgba(26,18,8,.06)',margin:'18px 0'}}/>
                  <div style={{display:'flex',flexDirection:'column',gap:'11px'}}>
                    {r.perms.map(p=>(
                      <div key={p} style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={r.col} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:'3px'}}><polyline points="20 6 9 17 4 12"/></svg>
                        <span style={{fontSize:'13px',color:'rgba(26,18,8,.55)',lineHeight:1.45}}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COLLECTION ── */}
        <section id="collection"
          ref={el=>refs.current['c']=el} data-s="c"
          style={{background:'#f8f3eb',padding:'110px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'48px',flexWrap:'wrap',gap:'16px'}}>
              <div>
                <div className="stag" style={{marginBottom:'14px'}}><span>Our Collection</span></div>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,4vw,50px)',fontWeight:'900',color:'#1a1208'}}>Popular Books</h2>
              </div>
              <Link to="/login" style={{color:'#8b6418',textDecoration:'none',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',gap:'5px'}}>Browse Full Catalog →</Link>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'18px'}}>
              {BOOKS.map((book,i)=>(
                <div key={`t${book.id}`} className="bk-tile" style={{
                  background:'#fff',borderRadius:'14px',overflow:'hidden',
                  border:'1px solid rgba(26,18,8,.06)',
                  boxShadow:'0 6px 28px rgba(26,18,8,.07)',
                  opacity: vis['c'] ? 1 : 0,
                  transform: vis['c'] ? 'none' : 'translateY(20px)',
                  transition:`opacity .55s ease ${i*.07}s,transform .55s ease ${i*.07}s`,
                }}>
                  <div style={{height:'130px',background:`linear-gradient(145deg,${book.h}20,${book.h}42)`,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{position:'absolute',left:0,top:0,bottom:0,width:'8px',background:`linear-gradient(180deg,${book.h},${book.s})`}}/>
                    <div style={{textAlign:'center',padding:'0 18px'}}>
                      <div style={{fontSize:'26px',marginBottom:'6px',opacity:.75}}>📖</div>
                      <p style={{fontSize:'9.5px',color:book.h,fontWeight:'700',letterSpacing:'.10em',textTransform:'uppercase'}}>{book.cat}</p>
                    </div>
                    <div style={{position:'absolute',top:'10px',right:'10px',background:'rgba(107,158,126,.12)',border:'1px solid rgba(107,158,126,.33)',borderRadius:'20px',padding:'2px 9px'}}>
                      <span style={{fontSize:'8px',color:'#4a8b5a',fontWeight:'700',letterSpacing:'.04em'}}>AVAILABLE</span>
                    </div>
                  </div>
                  <div style={{padding:'14px 16px'}}>
                    <p style={{fontSize:'13px',fontWeight:'700',color:'#1a1208',marginBottom:'3px',lineHeight:1.35}}>{book.title}</p>
                    <p style={{fontSize:'11px',color:'rgba(26,18,8,.38)'}}>{book.author}</p>
                    <div style={{marginTop:'12px',paddingTop:'10px',borderTop:'1px solid rgba(26,18,8,.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:'9.5px',background:`${book.h}18`,color:book.h,padding:'2px 9px',borderRadius:'5px',fontWeight:'700',border:`1px solid ${book.h}30`}}>{book.cat}</span>
                      <Link to="/login" style={{fontSize:'11.5px',color:'#8b6418',textDecoration:'none',fontWeight:'700'}}>Borrow →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARALLAX STRIP #2 — testimonials over library ── */}
        <div className="parallax-strip" style={{padding:'96px 60px'}}>
          <div className="ps-inner">
            <div style={{maxWidth:'1200px',margin:'0 auto'}}>
              <div style={{textAlign:'center',marginBottom:'46px'}}>
                <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(200,165,90,.62)',marginBottom:'14px'}}>Testimonials</p>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'#f5edd8'}}>Trusted by readers & librarians</h2>
              </div>

              <div ref={el=>refs.current['t']=el} data-s="t" style={{maxWidth:'680px',margin:'0 auto'}}>
                <div style={{background:'rgba(8,5,2,.68)',backdropFilter:'blur(24px)',border:'1px solid rgba(200,165,90,.20)',borderRadius:'20px',padding:'42px 46px',boxShadow:'0 24px 80px rgba(0,0,0,.52)'}}>
                  {TESTIMONIALS.map((t,i)=>(
                    <div key={i} style={{display:i===test?'block':'none',animation:'fadeUp .5s ease'}}>
                      <p style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(16px,2vw,20px)',color:'rgba(245,237,216,.88)',lineHeight:1.80,fontStyle:'italic',marginBottom:'26px'}}>"{t.text}"</p>
                      <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                        <div style={{width:'46px',height:'46px',borderRadius:'50%',background:`linear-gradient(135deg,${t.c},${t.c}80)`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#fff',fontSize:'17px',fontFamily:"'Playfair Display',serif",boxShadow:`0 4px 18px ${t.c}55`,flexShrink:0}}>{t.av}</div>
                        <div>
                          <p style={{fontWeight:'700',color:'#f5edd8',fontSize:'14px'}}>{t.name}</p>
                          <p style={{fontSize:'12px',color:'rgba(245,237,216,.36)',marginTop:'2px'}}>{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
                    {TESTIMONIALS.map((_,i)=>(
                      <div key={i} onClick={()=>setTest(i)} style={{width:i===test?'24px':'7px',height:'7px',borderRadius:'4px',background:i===test?'#c8a55a':'rgba(200,165,90,.22)',transition:'all .36s ease',cursor:'pointer'}}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PLANS ── */}
        <section id="plans" style={{background:'#1a1208',padding:'110px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',textAlign:'center'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'18px'}}>
              <div className="stag" style={{background:'rgba(200,165,90,.10)',border:'1px solid rgba(200,165,90,.26)'}}><span style={{color:'#c8a55a'}}>Subscription Plans</span></div>
            </div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,4vw,50px)',fontWeight:'900',color:'#f5edd8',marginBottom:'14px'}}>
              Choose your <em className="gold-shimmer" style={{fontStyle:'italic'}}>reading plan</em>
            </h2>
            <p style={{color:'rgba(245,237,216,.38)',fontSize:'15px',marginBottom:'60px',maxWidth:'450px',margin:'0 auto 60px',lineHeight:1.82}}>
              From casual readers to research scholars — a plan for every pace.
            </p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'18px'}}>
              {[
                {name:'Free',     price:'₹0',   period:'forever', limit:'2 books',  hot:false, col:'rgba(245,237,216,.06)', bc:'rgba(245,237,216,.11)'},
                {name:'Basic',    price:'₹99',  period:'/month',  limit:'5 books',  hot:false, col:'rgba(200,165,90,.07)', bc:'rgba(200,165,90,.22)'},
                {name:'Standard', price:'₹199', period:'/month',  limit:'10 books', hot:true,  col:'rgba(200,165,90,.13)', bc:'rgba(200,165,90,.38)'},
                {name:'Premium',  price:'₹349', period:'/month',  limit:'20 books', hot:false, col:'rgba(155,141,184,.09)', bc:'rgba(155,141,184,.28)'},
              ].map((p,i)=>(
                <div key={p.name} style={{
                  background:p.col, border:`1px solid ${p.bc}`,
                  borderRadius:'18px', padding:'32px 22px',
                  position:'relative', textAlign:'left',
                  transform: p.hot ? 'translateY(-8px)' : 'none',
                  boxShadow: p.hot ? '0 20px 60px rgba(200,165,90,.20)' : 'none',
                  transition:'transform .28s',
                }}>
                  {p.hot && <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#c8a55a,#8b6418)',color:'#fff',fontSize:'9px',fontWeight:'800',letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 14px',borderRadius:'20px',whiteSpace:'nowrap'}}>Most Popular</div>}
                  <p style={{fontSize:'11px',fontWeight:'700',color: p.hot?'#c8a55a':p.name==='Premium'?'#9b8db8':'rgba(245,237,216,.52)',letterSpacing:'.10em',textTransform:'uppercase',marginBottom:'14px'}}>{p.name}</p>
                  <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'6px'}}>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:'36px',fontWeight:'900',color:'#f5edd8'}}>{p.price}</span>
                    <span style={{fontSize:'12px',color:'rgba(245,237,216,.32)',fontWeight:'500'}}>{p.period}</span>
                  </div>
                  <p style={{fontSize:'12px',color: p.hot?'#c8a55a':'rgba(245,237,216,.42)',fontWeight:'700',marginBottom:'22px'}}>{p.limit} at a time</p>
                  <div style={{height:'1px',background:'rgba(245,237,216,.07)',marginBottom:'18px'}}/>
                  <Link to="/login" style={{textDecoration:'none',display:'block'}}>
                    <button style={{width:'100%',padding:'11px',borderRadius:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all .25s',
                      background: p.hot ? 'linear-gradient(135deg,#c8a55a,#8b6418)' : 'rgba(245,237,216,.08)',
                      color: p.hot ? '#fff' : 'rgba(245,237,216,.60)',
                      border: p.hot ? 'none' : '1px solid rgba(245,237,216,.12)',
                      boxShadow: p.hot ? '0 6px 20px rgba(139,100,24,.42)' : 'none',
                    }}>
                      {p.price==='₹0' ? 'Start Free' : 'Choose Plan'}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA — library shines at maximum through parallax ── */}
        <div className="parallax-strip" style={{padding:'130px 60px',textAlign:'center'}}>
          <div className="ps-inner" style={{maxWidth:'660px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'22px'}}>
              <div className="stag" style={{background:'rgba(200,165,90,.10)',border:'1px solid rgba(200,165,90,.26)'}}><span style={{color:'#c8a55a'}}>Get Started Today</span></div>
            </div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(38px,5vw,66px)',fontWeight:'900',color:'#f5edd8',lineHeight:1.06,marginBottom:'18px',letterSpacing:'-0.02em',textShadow:'0 4px 36px rgba(0,0,0,.55)'}}>
              Ready to explore<br/>
              <em className="gold-shimmer" style={{fontStyle:'italic'}}>your library?</em>
            </h2>
            <p style={{color:'rgba(245,237,216,.48)',fontSize:'16px',marginBottom:'40px',lineHeight:1.80,textShadow:'0 2px 10px rgba(0,0,0,.40)'}}>
              Join thousands of readers who manage their library life with Librario.
            </p>
            <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/register" style={{textDecoration:'none'}}>
                <button className="btn-gold" style={{fontSize:'16px',padding:'16px 42px',borderRadius:'13px'}}>Create Free Account</button>
              </Link>
              <Link to="/login" style={{textDecoration:'none'}}>
                <button className="btn-ghost" style={{fontSize:'16px',padding:'16px 32px',borderRadius:'13px'}}>Sign In →</button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{background:'#0d0900',padding:'30px 60px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px',borderTop:'1px solid rgba(200,165,90,.12)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
            <div style={{width:'30px',height:'30px',background:'linear-gradient(135deg,#c8a55a,#8b6418)',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'15px',fontWeight:'700',color:'rgba(245,237,216,.45)',lineHeight:1}}>Librario</p>
              <p style={{fontSize:'9px',color:'rgba(245,237,216,.18)',marginTop:'2px',letterSpacing:'.06em'}}>Library Management System</p>
            </div>
          </div>
          <p style={{fontSize:'12px',color:'rgba(245,237,216,.18)'}}>© 2026 Librario. Built for knowledge seekers.</p>
          <div style={{display:'flex',gap:'24px'}}>
            {[['Sign In','/login'],['Register','/register'],['Dashboard','/dashboard']].map(([l,p])=>(
              <Link key={l} to={p} style={{fontSize:'12.5px',color:'rgba(245,237,216,.28)',textDecoration:'none',transition:'color .2s'}}
                onMouseEnter={e=>e.currentTarget.style.color='#c8a55a'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(245,237,216,.28)'}>{l}</Link>
            ))}
          </div>
        </footer>

      </div>{/* end content-layer */}
    </div>
  );
}
