import { useState, useEffect, useRef } from 'react';
import { PublicChatbot } from './AIChatbot';
import { Link } from 'react-router-dom';

const BOOKS = [
  { id:1, title:'The Great Gatsby',      author:'F. Scott Fitzgerald', cat:'Classic',    h:'#b8863f', s:'#8b6a1f' },
  { id:2, title:'Sapiens',              author:'Yuval Noah Harari',   cat:'History',    h:'#38b2a0', s:'#1e7a6a' },
  { id:3, title:'Atomic Habits',        author:'James Clear',         cat:'Self-Help',  h:'#5ba8d4', s:'#2d6e9e' },
  { id:4, title:'1984',                 author:'George Orwell',       cat:'Fiction',    h:'#C9A35A', s:'#96702E' },
  { id:5, title:'Thinking Fast & Slow', author:'D. Kahneman',         cat:'Psychology', h:'#60c8b0', s:'#2e8870' },
  { id:6, title:'The Alchemist',        author:'Paulo Coelho',        cat:'Fiction',    h:'#f0a0c0', s:'#b85888' },
  { id:7, title:'Dune',                 author:'Frank Herbert',       cat:'Sci-Fi',     h:'#8ec8f0', s:'#4090c0' },
  { id:8, title:'A Brief History',      author:'S. Hawking',          cat:'Science',    h:'#70d4b8', s:'#2a9880' },
];

const FEATURES = [
  { num:'01', icon:'📚', title:'Smart Borrow System',   desc:'Issue books, track due dates, auto-calculate fines. Full borrow history per member.',   col:'#b8863f' },
  { num:'02', icon:'🔐', title:'3-Role Access Control', desc:'Admin, Librarian and Member — each with precisely scoped permissions and dashboards.',   col:'#38b2a0' },
  { num:'03', icon:'🔔', title:'Book Reservations',     desc:'Queue reservations on unavailable books. Instant email alert the moment it returns.',   col:'#5ba8d4' },
  { num:'04', icon:'🖼️', title:'Rich Book Catalog',    desc:'Search, filter, upload covers. Live availability badges across the full collection.',    col:'#5ba8d4' },
  { num:'05', icon:'📊', title:'Live Analytics',        desc:'Real-time stats: borrows, overdue items, pending approvals, member activity.',           col:'#f0a080' },
  { num:'06', icon:'✉️', title:'Email Notifications',  desc:'OTP, approval alerts, borrow confirmations, reservation updates via Gmail SMTP.',         col:'#48c078' },
];

const ROLES = [
  { role:'Admin',     col:'#b8863f', e:'👑',
    perms:['Full system control','Manage all users & staff','Approve registrations','Subscription management','View all records & logs'] },
  { role:'Librarian', col:'#38b2a0', e:'📖',
    perms:['Issue & return books','Add & manage books','Register walk-in members','Approve new users','Manage reservations'] },
  { role:'Member',    col:'#5ba8d4', e:'🎓',
    perms:['Browse full catalog','Reserve unavailable books','Track borrow history','Email notifications','Manage own profile'] },
];

const TESTIMONIALS = [
  { name:'Arjun Sharma',  role:'Research Scholar', text:'Librario transformed how I discover and access books. The reservation system is pure genius.', av:'A', c:'#b8863f' },
  { name:'Priya Nair',    role:'Senior Librarian', text:'Managing 12,000+ volumes has never felt this effortless. The admin panel is beautifully intuitive.', av:'P', c:'#38b2a0' },
  { name:'Rahul Verma',   role:'Graduate Student', text:'Found rare research material I could not locate anywhere else. Outstanding depth of collection.', av:'R', c:'#5ba8d4' },
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
        <p style={{fontSize:'6.5px',fontWeight:'700',color:'rgba(255,255,255,0.75)',writingMode:'vertical-rl',textAlign:'center',lineHeight:1.3,fontFamily:"'Bodoni Moda',serif",letterSpacing:'0.03em'}}>{book.title}</p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [scroll,   setScroll]   = useState(0);
  const [test,     setTest]     = useState(0);
  const [vis,      setVis]      = useState({});
  const [navSolid, setNavSolid] = useState(false);
  const [mouse,    setMouse]    = useState({ x: 0, y: 0 }); // -1..1, for hero parallax
  const [reduceMotion, setReduceMotion] = useState(false);
  const refs = useRef({});

  useEffect(()=>{
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = (e)=> setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return ()=> mq.removeEventListener('change', onChange);
  },[]);

  useEffect(()=>{
    const onScroll = ()=>{ const y=window.scrollY; setScroll(y); setNavSolid(y>60); };
    window.addEventListener('scroll', onScroll, { passive:true });
    return ()=> window.removeEventListener('scroll', onScroll);
  },[]);

  useEffect(()=>{
    const onMove = (e)=>{
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', onMove, { passive:true });
    return ()=> window.removeEventListener('mousemove', onMove);
  },[]);

  useEffect(()=>{
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) setVis(v=>({...v,[e.target.dataset.s]:true})); }),
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
    <div style={{fontFamily:"'Manrope',sans-serif", color:'#1E1A16', overflowX:'hidden'}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#F8F6F2;}

        .lib-fixed-bg { position:fixed; top:0; left:0; width:100%; height:100vh; z-index:0; }
        .lib-fixed-bg img, .lib-fixed-bg video { width:100%; height:100%; object-fit:cover; object-position:center 25%; filter:brightness(0.88) contrast(1.15) saturate(0.90) sepia(0.08); display:block; }
        .lib-fixed-bg::after { content:''; position:absolute; inset:0; background: linear-gradient(108deg, rgba(247,241,228,0.72) 0%, rgba(247,241,228,0.50) 42%, rgba(247,241,228,0.28) 72%, rgba(247,241,228,0.16) 100%), linear-gradient(to bottom, rgba(247,241,228,0.10) 0%, transparent 30%, transparent 60%, rgba(247,241,228,0.42) 100%); }

        .hero-section { position:relative; z-index:10; min-height:100vh; display:flex; align-items:center; }
        .content-layer { position:relative; z-index:20; background:#F8F6F2; }

        .parallax-strip { position:relative; z-index:21; background-image:url('/lib.jpg'); background-size:cover; background-attachment:fixed; background-position:center 25%; }
        .parallax-strip::before { content:''; position:absolute; inset:0; background:rgba(247,241,228,0.62); }
        .parallax-strip > .ps-inner { position:relative; z-index:1; }

        @keyframes riseBook  { from{opacity:0;transform:translateY(32px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(26px);} to{opacity:1;transform:translateY(0);} }
        @keyframes float     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-11px);} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.55;transform:scale(.93);} }

        .hero-atmosphere { position:absolute; inset:0; z-index:2; pointer-events:none; overflow:hidden; }        .hray { position:absolute; top:-15%; width:110px; height:130%; background:linear-gradient(100deg, transparent 0%, rgba(255,235,180,0.16) 45%, rgba(255,235,180,0.22) 50%, rgba(255,235,180,0.16) 55%, transparent 100%); transform:rotate(9deg); animation:hrayPulse 7s ease-in-out infinite; }
        @keyframes hrayPulse { 0%,100%{ opacity:0.5; } 50%{ opacity:1; } }
        .hdust { position:absolute; bottom:-4%; border-radius:50%; background:rgba(183,134,63,0.55); animation:hdustRise linear infinite; }
        @keyframes hdustRise { 0%{ transform:translateY(0) translateX(0); opacity:0; } 12%{ opacity:0.65; } 88%{ opacity:0.25; } 100%{ transform:translateY(-108vh) translateX(24px); opacity:0; } }
        @keyframes goldFlow  { 0%{background-position:-300% center;} 100%{background-position:300% center;} }
        @keyframes bounceY   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(9px);} }

        .s1{animation:fadeUp .70s ease .05s both;} .s2{animation:fadeUp .70s ease .18s both;}
        .s3{animation:fadeUp .70s ease .32s both;} .s4{animation:fadeUp .70s ease .46s both;}
        .s5{animation:fadeUp .70s ease .60s both;}
        .cpop{animation:fadeUp .90s cubic-bezier(.22,1,.36,1) .28s both;}
        .floating{animation:float 5s ease-in-out infinite;}

        .gold-shimmer {
          background:linear-gradient(120deg,#5a3800 0%,#b8863f 28%,#f5d98a 50%,#b8863f 72%,#5a3800 100%);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:goldFlow 4.5s linear infinite;
        }

        .btn-gold { background:linear-gradient(135deg,#b8863f,#96702E); color:#fff; border:none; font-weight:700; font-family:'Manrope',sans-serif; cursor:pointer; transition:all .30s; box-shadow:0 6px 28px rgba(150,108,40,.42); position:relative; overflow:hidden; }
        .btn-gold::after { content:''; position:absolute; top:0; left:-100%; width:50%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent); transition:left .5s; }
        .btn-gold:hover::after{left:200%;}
        .btn-gold:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(150,108,40,.54);}

        .btn-ghost { background:rgba(255,255,255,.85); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1.5px solid rgba(183,134,63,.55); color:#1E1A16; font-weight:700; font-family:'Manrope',sans-serif; cursor:pointer; transition:all .25s; box-shadow:0 4px 16px rgba(30,26,22,.08); }
        .btn-ghost:hover{background:#fff;border-color:#96702E;transform:translateY(-2px);box-shadow:0 8px 24px rgba(30,26,22,.14);}

        .nav-link { color:#1E1A16; text-decoration:none; font-size:15px; font-weight:600; letter-spacing:.03em; transition:color .25s; position:relative; font-family:'Manrope',sans-serif; }
        .nav-link::after { content:''; position:absolute; bottom:-6px; left:0; right:0; height:2px; background:linear-gradient(90deg,#B7863F,#96702E); transform:scaleX(0); transform-origin:center; transition:transform .3s cubic-bezier(0.34,1.56,0.64,1); border-radius:2px; }
        .nav-link:hover{color:#96702E;} .nav-link:hover::after{transform:scaleX(1);}

        .stag { display:inline-flex; align-items:center; gap:7px; background:rgba(255,255,255,.82); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1.5px solid rgba(183,134,63,.55); border-radius:50px; padding:7px 18px; box-shadow:0 4px 18px rgba(30,26,22,.10); }
        .stag span { font-size:11px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#96702E; }

        .feat-row { display:grid; grid-template-columns:56px 1fr; gap:18px; padding:24px 16px; border-bottom:1px solid rgba(95,91,86,.07); border-radius:10px; cursor:default; transition:background .25s,transform .25s; }
        .feat-row:hover{background:rgba(150,108,40,.06);transform:translateX(6px);}
        .feat-row:hover .fn{color:#b8863f!important;}

        .bk-tile{transition:all .32s ease;}
        .bk-tile:hover{transform:translateY(-9px);box-shadow:0 28px 55px rgba(95,91,86,.16)!important;}

        .role-card{transition:transform .28s,box-shadow .28s;}
        .role-card:hover{transform:translateY(-7px);box-shadow:0 20px 60px rgba(95,91,86,.12)!important;}

        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:#F8F6F2;}
        ::-webkit-scrollbar-thumb{background:rgba(150,108,40,.38);border-radius:4px;}

        .scroll-cue{animation:bounceY 1.9s ease-in-out infinite;}
        .shelf{height:12px;background:linear-gradient(180deg,#b8863f,#2d2680);border-radius:3px;box-shadow:0 5px 18px rgba(0,0,0,.40);}
        .gold-rule{height:1px;background:linear-gradient(90deg,transparent,rgba(150,108,40,.45),transparent);}
      `}</style>

      <div className="lib-fixed-bg">
        {reduceMotion ? (
          <img src="/lib.jpg" alt="" draggable="false" style={{ transform:`translate3d(${mouse.x*-10}px, ${mouse.y*-8}px, 0) scale(1.04)`, transition:'transform 0.4s cubic-bezier(0.22,1,0.36,1)' }}/>
        ) : (
          <video
            autoPlay muted loop playsInline preload="auto"
            poster="/lib.jpg"
            style={{ transform:`translate3d(${mouse.x*-10}px, ${mouse.y*-8}px, 0) scale(1.04)`, transition:'transform 0.4s cubic-bezier(0.22,1,0.36,1)' }}
          >
            <source src="/lib-hero.mp4" type="video/mp4"/>
          </video>
        )}
      </div>

      {/* NAVBAR */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 60px', background: navSolid ? 'rgba(253,246,230,0.90)' : 'transparent', backdropFilter: navSolid ? 'blur(22px)' : 'none', borderBottom: navSolid ? '1px solid rgba(150,108,40,0.15)' : 'none', boxShadow: navSolid ? '0 2px 20px rgba(150,108,40,0.08)' : 'none', transition:'all .40s ease' }}>
        <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
          <div style={{width:'36px',height:'36px',background:'linear-gradient(135deg,#b8863f,#96702E)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(150,108,40,.44)',flexShrink:0}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div>
            <p style={{fontFamily:"'Bodoni Moda',serif",fontSize:'21px',fontWeight:'700',color:'#1E1A16',lineHeight:1}}>Librario</p>
            <p style={{fontSize:'9px',letterSpacing:'.18em',color:'#96702E',fontWeight:'700',textTransform:'uppercase',marginTop:'2px'}}>Library System</p>
          </div>
        </div>
        <div style={{display:'flex',gap:'34px'}}>
          {['Features','Collection','Roles','Plans'].map(l=>(<a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>))}
        </div>
        <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
          <Link to="/login" style={{textDecoration:'none'}}><button className="btn-ghost" style={{fontSize:'14px',padding:'10px 22px',borderRadius:'9px',fontWeight:'700'}}>Sign In</button></Link>
          <Link to="/register" style={{textDecoration:'none'}}><button className="btn-gold" style={{fontSize:'14px',padding:'11px 24px',borderRadius:'9px',fontWeight:'700'}}>Get Started</button></Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{padding:'0 60px'}}>
        <div className="hero-atmosphere">
          <div className="hray" style={{left:'20%', animationDelay:'0s'}}/>
          <div className="hray" style={{left:'46%', animationDelay:'2.2s', width:'90px'}}/>
          <div className="hray" style={{left:'70%', animationDelay:'4.4s'}}/>
          {[...Array(16)].map((_,i)=>(
            <div key={i} className="hdust" style={{
              left:`${4+i*6.2}%`,
              width:`${2+(i%3)}px`, height:`${2+(i%3)}px`,
              animationDuration:`${9+(i%5)*2.2}s`,
              animationDelay:`${i*0.6}s`,
              transform:`translate3d(${mouse.x*(6+i%4*2)}px,0,0)`,
            }}/>
          ))}
        </div>
        <div style={{ position:'relative', zIndex:3, maxWidth:'1260px', margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center', transform:`translateY(${-heroShift}px)`, opacity:heroOpacity, transition:'opacity .06s linear' }}>
          <div>
            <div className="stag s1" style={{marginBottom:'22px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#b8863f',animation:'pulse 2s infinite'}}/>
              <span>Library Management System</span>
            </div>
            <h1 className="s2" style={{ fontFamily:"'Bodoni Moda',serif", fontSize:'clamp(50px,5.8vw,78px)', lineHeight:1.04, fontWeight:'900', color:'#1E1A16', marginBottom:'22px', letterSpacing:'-0.02em', textShadow:'0 2px 18px rgba(255,255,255,.65)' }}>
              Where Every<br/><em className="gold-shimmer" style={{fontStyle:'italic'}}>Story</em>&nbsp;Finds<br/>Its Reader
            </h1>
            <p className="s3" style={{fontSize:'18px',color:'rgba(30,26,22,.86)',lineHeight:1.9,maxWidth:'440px',marginBottom:'38px',fontWeight:'500',textShadow:'0 1px 3px rgba(255,255,255,.55), 0 0px 24px rgba(255,255,255,.35)'}}>
              A modern library experience — discover books, track borrows, manage memberships and reservations all in one beautifully crafted platform.
            </p>
            <div className="s4" style={{display:'flex',gap:'13px',flexWrap:'wrap'}}>
              <Link to="/register" style={{textDecoration:'none'}}><button className="btn-gold" style={{fontSize:'15px',padding:'14px 34px',borderRadius:'12px'}}>Get Started Free</button></Link>
              <Link to="/login" style={{textDecoration:'none'}}><button className="btn-ghost" style={{fontSize:'15px',padding:'14px 28px',borderRadius:'12px'}}>Sign In →</button></Link>
            </div>
            <div className="s5" style={{display:'flex',gap:'11px',marginTop:'46px',flexWrap:'wrap'}}>
              {[{v:'12,500+',l:'Books'},{v:'3,200+',l:'Members'},{v:'98%',l:'Satisfaction'},{v:'3 Roles',l:'Access Levels'}].map(s=>(
                <div key={s.l} style={{padding:'11px 16px',borderRadius:'11px',textAlign:'center',background:'rgba(253,246,230,.80)',backdropFilter:'blur(20px)',border:'1px solid rgba(150,108,40,.20)',minWidth:'80px',boxShadow:'0 4px 20px rgba(150,108,40,.08)'}}>
                  <p style={{fontFamily:"'Bodoni Moda',serif",fontSize:'20px',fontWeight:'700',color:'#b8863f',lineHeight:1}}>{s.v}</p>
                  <p style={{fontSize:'10px',color:'rgba(95,91,86,.48)',marginTop:'3px',fontWeight:'500',letterSpacing:'.04em'}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden="true"/>
        </div>
        <div style={{position:'absolute',bottom:'28px',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'7px',opacity:heroOpacity*.65,transition:'opacity .08s',pointerEvents:'none'}}>
          <p style={{fontSize:'10px',letterSpacing:'.14em',textTransform:'uppercase',color:'#96702E',fontWeight:'700',background:'rgba(255,255,255,.80)',backdropFilter:'blur(10px)',padding:'6px 14px',borderRadius:'20px',border:'1px solid rgba(183,134,63,.35)'}}>Scroll to explore</p>
          <svg className="scroll-cue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#96702E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{filter:'drop-shadow(0 1px 2px rgba(255,255,255,.6))'}}><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      <div className="content-layer">

        {/* Stats band */}
        <div style={{background:'#F1ECE0',padding:'54px 60px',borderTop:'1px solid rgba(150,108,40,.10)',borderBottom:'1px solid rgba(150,108,40,.10)'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:'32px',alignItems:'center'}}>
            {[{v:'12,500+',l:'Books in Collection',e:'📚'},{v:'3,200+',l:'Active Members',e:'👥'},{v:'98%',l:'Satisfaction Rate',e:'⭐'},{v:'24/7',l:'Digital Access',e:'🌐'},{v:'<50ms',l:'Avg Response',e:'⚡'}].map(s=>(
              <div key={s.l} style={{textAlign:'center'}}>
                <p style={{fontSize:'15px',marginBottom:'8px'}}>{s.e}</p>
                <p style={{fontFamily:"'Bodoni Moda',serif",fontSize:'38px',fontWeight:'900',color:'#96702E',lineHeight:1}}>{s.v}</p>
                <p style={{fontSize:'11px',color:'rgba(95,91,86,.48)',marginTop:'6px',fontWeight:'500',letterSpacing:'.04em'}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section id="features" ref={el=>refs.current['f']=el} data-s="f" style={{background:'#F8F6F2',padding:'110px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 2fr',gap:'90px',alignItems:'start'}}>
            <div style={{position:'sticky',top:'92px'}}>
              <div className="stag" style={{marginBottom:'20px'}}><span>Why Librario</span></div>
              <h2 style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(36px,4vw,54px)',fontWeight:'900',color:'#1E1A16',lineHeight:1.12,marginBottom:'18px'}}>
                Everything<br/>your library<br/><em className="gold-shimmer" style={{fontStyle:'italic'}}>needs.</em>
              </h2>
              <p style={{fontSize:'14px',color:'rgba(45,38,30,.72)',lineHeight:1.85,maxWidth:'230px'}}>One platform. Every tool. Built for admins, librarians and members alike.</p>
              <div style={{marginTop:'30px',height:'1px',background:'linear-gradient(90deg,rgba(150,108,40,.45),transparent)'}}/>
            </div>
            <div>
              {FEATURES.map((f,i)=>(
                <div key={f.num} className="feat-row" style={{ opacity:vis['f']?1:0, transform:vis['f']?'none':'translateY(18px)', transition:`opacity .62s ease ${i*.09}s,transform .62s ease ${i*.09}s` }}>
                  <p className="fn" style={{fontFamily:"'Bodoni Moda',serif",fontSize:'24px',fontWeight:'900',color:'rgba(95,91,86,.10)',lineHeight:1,transition:'color .25s'}}>{f.num}</p>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'7px'}}>
                      <span style={{fontSize:'18px'}}>{f.icon}</span>
                      <h3 style={{fontSize:'16px',fontWeight:'700',color:'#1E1A16'}}>{f.title}</h3>
                    </div>
                    <p style={{fontSize:'13.5px',color:'rgba(45,38,30,.80)',lineHeight:1.76,paddingLeft:'28px'}}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax strip 1 */}
        <div className="parallax-strip" style={{padding:'90px 60px'}}>
          <div className="ps-inner" style={{maxWidth:'700px',margin:'0 auto',textAlign:'center'}}>
            <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(150,108,40,.62)',marginBottom:'18px'}}>Our Philosophy</p>
            <blockquote style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(22px,3vw,34px)',fontWeight:'700',color:'#1E1A16',lineHeight:1.55,fontStyle:'italic'}}>
              "A library is not just a building of books — it is a living, breathing community of knowledge seekers."
            </blockquote>
            <div style={{width:'60px',height:'2px',background:'linear-gradient(90deg,transparent,#b8863f,transparent)',margin:'22px auto 0'}}/>
          </div>
        </div>

        {/* ROLES */}
        <section id="roles" ref={el=>refs.current['r']=el} data-s="r" style={{background:'#F1ECE0',padding:'110px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'60px'}}>
              <div className="stag" style={{justifyContent:'center',marginBottom:'16px'}}><span>Access Levels</span></div>
              <h2 style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(34px,4vw,52px)',fontWeight:'900',color:'#1E1A16'}}>Built for every role</h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'22px'}}>
              {ROLES.map((r,i)=>(
                <div key={r.role} className="role-card" style={{ background:'#fff', borderRadius:'20px', padding:'36px 28px', border:'1px solid rgba(95,91,86,.07)', boxShadow:'0 6px 36px rgba(95,91,86,.07)', opacity:vis['r']?1:0, transform:vis['r']?'none':'translateY(24px)', transition:`opacity .70s ease ${i*.15}s,transform .70s ease ${i*.15}s` }}>
                  <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'8px'}}>
                    <div style={{width:'52px',height:'52px',borderRadius:'50%', background:r.col==='#b8863f'?'rgba(150,108,40,.12)':r.col==='#9b8db8'?'rgba(155,141,184,.12)':'rgba(107,158,126,.12)', display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',flexShrink:0}}>{r.e}</div>
                    <h3 style={{fontFamily:"'Bodoni Moda',serif",fontSize:'24px',fontWeight:'700',color:r.col}}>{r.role}</h3>
                  </div>
                  <div style={{height:'1px',background:'rgba(95,91,86,.06)',margin:'18px 0'}}/>
                  <div style={{display:'flex',flexDirection:'column',gap:'11px'}}>
                    {r.perms.map(p=>(
                      <div key={p} style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={r.col} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:'3px'}}><polyline points="20 6 9 17 4 12"/></svg>
                        <span style={{fontSize:'13px',color:'rgba(95,91,86,.55)',lineHeight:1.45}}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COLLECTION */}
        <section id="collection" ref={el=>refs.current['c']=el} data-s="c" style={{background:'#F8F6F2',padding:'110px 60px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'48px',flexWrap:'wrap',gap:'16px'}}>
              <div>
                <div className="stag" style={{marginBottom:'14px'}}><span>Our Collection</span></div>
                <h2 style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(32px,4vw,50px)',fontWeight:'900',color:'#1E1A16'}}>Popular Books</h2>
              </div>
              <Link to="/login" style={{color:'#96702E',textDecoration:'none',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',gap:'5px'}}>Browse Full Catalog →</Link>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'18px'}}>
              {BOOKS.map((book,i)=>(
                <div key={`t${book.id}`} className="bk-tile" style={{ background:'#fff', borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(95,91,86,.06)', boxShadow:'0 6px 28px rgba(95,91,86,.07)', opacity:vis['c']?1:0, transform:vis['c']?'none':'translateY(20px)', transition:`opacity .55s ease ${i*.07}s,transform .55s ease ${i*.07}s` }}>
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
                    <p style={{fontSize:'13px',fontWeight:'700',color:'#1E1A16',marginBottom:'3px',lineHeight:1.35}}>{book.title}</p>
                    <p style={{fontSize:'11px',color:'rgba(95,91,86,.38)'}}>{book.author}</p>
                    <div style={{marginTop:'12px',paddingTop:'10px',borderTop:'1px solid rgba(95,91,86,.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:'9.5px',background:`${book.h}18`,color:book.h,padding:'2px 9px',borderRadius:'5px',fontWeight:'700',border:`1px solid ${book.h}30`}}>{book.cat}</span>
                      <Link to="/login" style={{fontSize:'11.5px',color:'#96702E',textDecoration:'none',fontWeight:'700'}}>Borrow →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax strip 2 — testimonials */}
        <div className="parallax-strip" style={{padding:'96px 60px'}}>
          <div className="ps-inner">
            <div style={{maxWidth:'1200px',margin:'0 auto'}}>
              <div style={{textAlign:'center',marginBottom:'46px'}}>
                <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(150,108,40,.62)',marginBottom:'14px'}}>Testimonials</p>
                <h2 style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'#1E1A16'}}>Trusted by readers & librarians</h2>
              </div>
              <div ref={el=>refs.current['t']=el} data-s="t" style={{maxWidth:'680px',margin:'0 auto'}}>
                <div style={{background:'rgba(253,246,230,.82)',backdropFilter:'blur(24px)',border:'1px solid rgba(150,108,40,.18)',borderRadius:'20px',padding:'42px 46px',boxShadow:'0 20px 60px rgba(95,91,86,.14)'}}>
                  {TESTIMONIALS.map((t,i)=>(
                    <div key={i} style={{display:i===test?'block':'none',animation:'fadeUp .5s ease'}}>
                      <p style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(16px,2vw,20px)',color:'rgba(95,91,86,.82)',lineHeight:1.80,fontStyle:'italic',marginBottom:'26px'}}>"{t.text}"</p>
                      <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                        <div style={{width:'46px',height:'46px',borderRadius:'50%',background:`linear-gradient(135deg,${t.c},${t.c}80)`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',color:'#fff',fontSize:'17px',fontFamily:"'Bodoni Moda',serif",boxShadow:`0 4px 18px ${t.c}55`,flexShrink:0}}>{t.av}</div>
                        <div>
                          <p style={{fontWeight:'700',color:'#1E1A16',fontSize:'14px'}}>{t.name}</p>
                          <p style={{fontSize:'12px',color:'rgba(95,91,86,.44)',marginTop:'2px'}}>{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
                    {TESTIMONIALS.map((_,i)=>(<div key={i} onClick={()=>setTest(i)} style={{width:i===test?'24px':'7px',height:'7px',borderRadius:'4px',background:i===test?'#b8863f':'rgba(150,108,40,.22)',transition:'all .36s ease',cursor:'pointer'}}/>))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PLANS */}
        <section id="plans" style={{background:'#FFFFFF',padding:'110px 60px',borderTop:'1px solid rgba(150,108,40,.10)'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',textAlign:'center'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'18px'}}>
              <div className="stag"><span>Subscription Plans</span></div>
            </div>
            <h2 style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(32px,4vw,50px)',fontWeight:'900',color:'#1E1A16',marginBottom:'14px'}}>
              Choose your <em className="gold-shimmer" style={{fontStyle:'italic'}}>reading plan</em>
            </h2>
            <p style={{color:'rgba(95,91,86,.48)',fontSize:'15px',marginBottom:'60px',maxWidth:'450px',margin:'0 auto 60px',lineHeight:1.82}}>From casual readers to research scholars — a plan for every pace.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'18px'}}>
              {[
                {name:'Free',     price:'₹0',   period:'forever', limit:'2 books',  hot:false, col:'#ffffff', bc:'rgba(95,91,86,.10)'},
                {name:'Basic',    price:'₹99',  period:'/month',  limit:'5 books',  hot:false, col:'rgba(150,108,40,.05)', bc:'rgba(150,108,40,.20)'},
                {name:'Standard', price:'₹199', period:'/month',  limit:'10 books', hot:true,  col:'rgba(150,108,40,.09)', bc:'rgba(150,108,40,.34)'},
                {name:'Premium',  price:'₹349', period:'/month',  limit:'20 books', hot:false, col:'rgba(155,141,184,.07)', bc:'rgba(155,141,184,.24)'},
              ].map((p,i)=>(
                <div key={p.name} style={{ background:p.col, border:`1px solid ${p.bc}`, borderRadius:'18px', padding:'32px 22px', position:'relative', textAlign:'left', transform:p.hot?'translateY(-8px)':'none', boxShadow:p.hot?'0 20px 60px rgba(150,108,40,.16)':'0 2px 16px rgba(95,91,86,.05)', transition:'transform .28s' }}>
                  {p.hot && <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#b8863f,#96702E)',color:'#fff',fontSize:'9px',fontWeight:'800',letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 14px',borderRadius:'20px',whiteSpace:'nowrap'}}>Most Popular</div>}
                  <p style={{fontSize:'11px',fontWeight:'700',color:p.hot?'#b8863f':p.name==='Premium'?'#9b8db8':'rgba(95,91,86,.55)',letterSpacing:'.10em',textTransform:'uppercase',marginBottom:'14px'}}>{p.name}</p>
                  <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'6px'}}>
                    <span style={{fontFamily:"'Bodoni Moda',serif",fontSize:'36px',fontWeight:'900',color:'#1E1A16'}}>{p.price}</span>
                    <span style={{fontSize:'12px',color:'rgba(95,91,86,.42)',fontWeight:'500'}}>{p.period}</span>
                  </div>
                  <p style={{fontSize:'12px',color:p.hot?'#b8863f':'rgba(95,91,86,.52)',fontWeight:'700',marginBottom:'22px'}}>{p.limit} at a time</p>
                  <div style={{height:'1px',background:'rgba(95,91,86,.08)',marginBottom:'18px'}}/>
                  <Link to="/login" style={{textDecoration:'none',display:'block'}}>
                    <button style={{width:'100%',padding:'11px',borderRadius:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:"'Manrope',sans-serif",transition:'all .25s', background:p.hot?'linear-gradient(135deg,#b8863f,#96702E)':'rgba(95,91,86,.06)', color:p.hot?'#fff':'rgba(95,91,86,.65)', border:p.hot?'none':'1px solid rgba(95,91,86,.12)', boxShadow:p.hot?'0 6px 20px rgba(150,108,40,.42)':'none' }}>
                      {p.price==='₹0'?'Start Free':'Choose Plan'}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA parallax */}
        <div className="parallax-strip" style={{padding:'130px 60px',textAlign:'center'}}>
          <div className="ps-inner" style={{maxWidth:'660px',margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'22px'}}>
              <div className="stag"><span>Get Started Today</span></div>
            </div>
            <h2 style={{fontFamily:"'Bodoni Moda',serif",fontSize:'clamp(38px,5vw,66px)',fontWeight:'900',color:'#1E1A16',lineHeight:1.06,marginBottom:'18px',letterSpacing:'-0.02em'}}>
              Ready to explore<br/><em className="gold-shimmer" style={{fontStyle:'italic'}}>your library?</em>
            </h2>
            <p style={{color:'rgba(30,26,22,.82)',fontSize:'16.5px',marginBottom:'40px',lineHeight:1.85,fontWeight:'500',textShadow:'0 1px 3px rgba(255,255,255,.55)'}}>Join thousands of readers who manage their library life with Librario.</p>
            <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/register" style={{textDecoration:'none'}}><button className="btn-gold" style={{fontSize:'16px',padding:'16px 42px',borderRadius:'13px'}}>Create Free Account</button></Link>
              <Link to="/login" style={{textDecoration:'none'}}><button className="btn-ghost" style={{fontSize:'16px',padding:'16px 32px',borderRadius:'13px'}}>Sign In →</button></Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{background:'#F1ECE0',padding:'30px 60px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px',borderTop:'1px solid rgba(150,108,40,.14)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
            <div style={{width:'30px',height:'30px',background:'linear-gradient(135deg,#b8863f,#96702E)',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div>
              <p style={{fontFamily:"'Bodoni Moda',serif",fontSize:'15px',fontWeight:'700',color:'rgba(95,91,86,.62)',lineHeight:1}}>Librario</p>
              <p style={{fontSize:'9px',color:'rgba(95,91,86,.38)',marginTop:'2px',letterSpacing:'.06em'}}>Library Management System</p>
            </div>
          </div>
          <p style={{fontSize:'12px',color:'rgba(95,91,86,.38)'}}>© 2026 Librario. Built for knowledge seekers.</p>
          <div style={{display:'flex',gap:'24px'}}>
            {[['Sign In','/login'],['Register','/register'],['Dashboard','/dashboard']].map(([l,p])=>(
              <Link key={l} to={p} style={{fontSize:'12.5px',color:'rgba(95,91,86,.48)',textDecoration:'none',transition:'color .2s'}}
                onMouseEnter={e=>e.currentTarget.style.color='#b8863f'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(95,91,86,.48)'}>{l}</Link>
            ))}
          </div>
        </footer>

      </div>{/* end content-layer */}

      {/* Public AI Chatbot */}
      <PublicChatbot/>
    </div>
  );
}
