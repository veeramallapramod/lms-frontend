import { useState, useEffect } from 'react';
import LibraryIllustration from './LibraryIllustration';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const DOODLES = [
  { id:1,  type:'book',     x:10,  y:12,  size:46, delay:0,    dur:6.2, rot:12  },
  { id:2,  type:'book',     x:72,  y:7,   size:36, delay:1.2,  dur:7.1, rot:-8  },
  { id:3,  type:'book',     x:85,  y:52,  size:42, delay:0.4,  dur:5.8, rot:15  },
  { id:4,  type:'book',     x:5,   y:70,  size:34, delay:2.1,  dur:8.0, rot:-18 },
  { id:5,  type:'book',     x:58,  y:78,  size:40, delay:0.8,  dur:6.6, rot:6   },
  { id:6,  type:'book',     x:38,  y:22,  size:30, delay:3.6,  dur:6.4, rot:-20 },
  { id:7,  type:'bookmark', x:32,  y:5,   size:30, delay:1.6,  dur:7.4, rot:-5  },
  { id:8,  type:'bookmark', x:78,  y:28,  size:26, delay:3.0,  dur:5.5, rot:20  },
  { id:9,  type:'bookmark', x:8,   y:48,  size:28, delay:4.0,  dur:5.6, rot:14  },
  { id:10, type:'glasses',  x:20,  y:42,  size:42, delay:0.6,  dur:8.2, rot:-10 },
  { id:11, type:'glasses',  x:63,  y:16,  size:36, delay:2.5,  dur:6.8, rot:8   },
  { id:12, type:'magnify',  x:46,  y:56,  size:38, delay:1.0,  dur:7.6, rot:-14 },
  { id:13, type:'magnify',  x:88,  y:73,  size:32, delay:3.4,  dur:5.2, rot:22  },
  { id:14, type:'pencil',   x:14,  y:86,  size:34, delay:1.8,  dur:7.0, rot:35  },
  { id:15, type:'pencil',   x:48,  y:90,  size:28, delay:0.2,  dur:8.4, rot:-25 },
  { id:16, type:'star',     x:28,  y:30,  size:24, delay:2.8,  dur:5.8, rot:0   },
  { id:17, type:'star',     x:76,  y:86,  size:20, delay:1.4,  dur:7.2, rot:0   },
  { id:18, type:'sparkle',  x:54,  y:40,  size:22, delay:2.2,  dur:7.8, rot:0   },
  { id:19, type:'sparkle',  x:90,  y:20,  size:18, delay:4.5,  dur:6.0, rot:0   },
];

const COLORS = ['#9b8fef','#7c6fe0','#b8b0f8','#60b8e8','#4ecba8','#c4b8f8','#80d0c0','#a0c8f0'];

function Doodle({ type, size, color }) {
  const sw = Math.max(1.4, size * 0.048);
  if (type === 'book') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
  if (type === 'bookmark') return (
    <svg width={size*0.6} height={size} viewBox="0 0 24 24" fill={color+'28'} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
  if (type === 'glasses') return (
    <svg width={size} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
      <line x1="2" y1="12" x2="2" y2="11"/><line x1="22" y1="12" x2="22" y2="11"/>
    </svg>
  );
  if (type === 'magnify') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
  if (type === 'pencil') return (
    <svg width={size*0.5} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="2" x2="22" y2="6"/>
      <path d="M7.5 20.5L2 22l1.5-5.5L15 5l5 5z"/>
    </svg>
  );
  if (type === 'star') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color+'35'} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  if (type === 'sparkle') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
    </svg>
  );
  return null;
}

export default function Login() {
  const navigate   = useNavigate();
  const { setToken, theme, toggleTheme } = useAuthStore();
  const [form,      setForm]      = useState({ email:'', password:'' });
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [serverMsg, setServerMsg] = useState('');
  const [showPass,  setShowPass]  = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      setToken(res.data.token, res.data);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data;
      setServerMsg(typeof msg === 'string' ? msg : (msg?.message || msg?.error || 'Login failed. Please try again.'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', fontFamily:"'DM Sans',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        @keyframes floatA   { 0%,100%{transform:translateY(0px) rotate(var(--r))} 50%{transform:translateY(-16px) rotate(calc(var(--r) + 4deg))} }
        @keyframes floatB   { 0%,100%{transform:translateY(0px) rotate(var(--r))} 50%{transform:translateY(13px)  rotate(calc(var(--r) - 4deg))} }
        @keyframes floatC   { 0%,100%{transform:translateX(0px) rotate(var(--r))} 50%{transform:translateX(12px)  rotate(calc(var(--r) + 5deg))} }
        @keyframes floatD   { 0%,100%{transform:translate(0,0)  rotate(var(--r))} 50%{transform:translate(8px,-10px) rotate(calc(var(--r) - 6deg))} }
        @keyframes gradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn    { from{opacity:0;transform:scale(0.90)} to{opacity:1;transform:scale(1)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .doodle { position:absolute; opacity:0.50; filter:drop-shadow(0 2px 8px rgba(108,95,199,0.16)); }
        .doodle:hover { opacity:0.80; }

        .lav-bg {
          background: linear-gradient(145deg, #ede9ff 0%, #ddd6ff 28%, #cce8ff 58%, #d2f8ee 100%);
          background-size: 240% 240%;
          animation: gradMove 14s ease infinite;
        }
        .form-wrap  { animation: fadeUp 0.60s ease both; }
        .form-card  { animation: popIn 0.50s cubic-bezier(0.34,1.56,0.64,1) 0.12s both; }

        .vi { width:100%;padding:11px 14px;border-radius:10px;border:1.5px solid rgba(108,95,199,0.20);background:#fff;color:#1e1b4b;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:all 0.2s; }
        .vi:focus { border-color:#7c6fe0;box-shadow:0 0 0 3px rgba(124,111,224,0.13);background:#fdfcff; }
        .vi::placeholder { color:rgba(30,27,75,0.30); }
        .lbl { display:block;font-size:11px;font-weight:700;color:rgba(30,27,75,0.50);text-transform:uppercase;letter-spacing:0.09em;margin-bottom:7px; }
        .err { color:#e0425a;font-size:12px;margin-top:4px; }

        .sbtn { width:100%;padding:13px;border:none;border-radius:11px;background:linear-gradient(135deg,#7c6fe0,#5448b8);color:#fff;font-size:15px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.28s;letter-spacing:0.02em;box-shadow:0 6px 22px rgba(108,95,199,0.34); }
        .sbtn:hover:not(:disabled) { transform:translateY(-3px);box-shadow:0 12px 36px rgba(108,95,199,0.46);background:linear-gradient(135deg,#8f84e8,#6458c8); }
        .sbtn:disabled { opacity:0.55;cursor:not-allowed; }
        .sbtn:active:not(:disabled) { transform:translateY(-1px); }
      `}</style>

      {/* ══ LEFT — Lavender animated doodle panel ══ */}
      <div className="lav-bg" style={{ position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'52px' }}>

        {/* Soft ambient blobs */}
        <div style={{ position:'absolute', top:'-100px', left:'-100px', width:'380px', height:'380px', borderRadius:'50%', background:'rgba(124,111,224,0.14)', filter:'blur(70px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-80px', right:'-80px', width:'320px', height:'320px', borderRadius:'50%', background:'rgba(78,203,168,0.13)', filter:'blur(60px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'38%', right:'8%', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(96,184,232,0.11)', filter:'blur(50px)', pointerEvents:'none' }}/>

        {/* Library illustration — centred in panel */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%, -54%)',
          width:'78%', maxWidth:'340px',
          zIndex:1, opacity:0.82,
          filter:'drop-shadow(0 8px 32px rgba(108,95,199,0.18))',
        }}>
          <LibraryIllustration/>
        </div>

        {/* Floating doodles — 4 different float animations — z:2 so above illustration */}
        {DOODLES.map((d, i) => {
          const anims = ['floatA','floatB','floatC','floatD'];
          return (
            <div key={d.id} className="doodle" style={{ zIndex:2,
              left:`${d.x}%`, top:`${d.y}%`,
              '--r': `${d.rot}deg`,
              animation:`${anims[i%4]} ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}>
              <Doodle type={d.type} size={d.size} color={COLORS[i % COLORS.length]}/>
            </div>
          );
        })}

        {/* Logo */}
        <div style={{ position:'absolute', top:'40px', left:'48px', display:'flex', alignItems:'center', gap:'11px', zIndex:2 }}>
          <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'linear-gradient(135deg,#7c6fe0,#5448b8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(108,95,199,0.38)', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:'700', color:'#2d2080', lineHeight:1 }}>Librario</p>
            <p style={{ fontSize:'9px', letterSpacing:'0.14em', color:'rgba(45,32,128,0.42)', fontWeight:'600', textTransform:'uppercase', marginTop:'1px' }}>Library System</p>
          </div>
        </div>

        {/* Quote */}
        <div style={{ position:'relative', zIndex:2 }}>
          <div style={{ width:'38px', height:'3px', borderRadius:'2px', background:'linear-gradient(90deg,#7c6fe0,#4ecba8)', marginBottom:'16px' }}/>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', color:'#2d2080', lineHeight:1.58, fontStyle:'italic', marginBottom:'10px', maxWidth:'340px' }}>
            "A library is not a luxury but one of the necessities of life."
          </p>
          <p style={{ fontSize:'13px', color:'rgba(45,32,128,0.42)', letterSpacing:'0.04em' }}>— Henry Ward Beecher</p>
          <div style={{ display:'flex', gap:'6px', marginTop:'20px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ width:i===1?'22px':'7px', height:'4px', borderRadius:'2px', background:i===1?'#7c6fe0':'rgba(124,111,224,0.24)' }}/>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT — Form ══ */}
      <div style={{ background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 40px', position:'relative' }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          position:'absolute', top:'20px', right:'20px',
          background:'var(--bg-card)', border:'1px solid var(--border)',
          borderRadius:'10px', padding:'9px', cursor:'pointer',
          color:'var(--text-2)', lineHeight:0, transition:'all 0.2s',
          boxShadow:'0 2px 8px rgba(108,95,199,0.10)',
        }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--accent-muted)'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--bg-card)'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {theme === 'dark'
              ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
              : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}
          </svg>
        </button>
        {/* Subtle dot texture */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(108,95,199,0.055) 1px, transparent 1px)', backgroundSize:'26px 26px', pointerEvents:'none' }}/>

        <div className="form-wrap" style={{ width:'100%', maxWidth:'400px', position:'relative' }}>
          <div style={{ marginBottom:'28px' }}>
            <h1 style={{ fontSize:'30px', fontWeight:'700', color:'#1e1b4b', marginBottom:'7px', fontFamily:"'Playfair Display',serif" }}>Welcome back</h1>
            <p style={{ color:'rgba(30,27,75,0.50)', fontSize:'14px' }}>Sign in to your library account</p>
          </div>

          <div className="form-card" style={{ background:'#ffffff', borderRadius:'18px', padding:'32px', border:'1px solid rgba(108,95,199,0.12)', boxShadow:'0 8px 40px rgba(108,95,199,0.09), 0 2px 8px rgba(108,95,199,0.05)' }}>

            {serverMsg && (
              <div style={{ background:'rgba(224,66,90,0.08)', border:'1px solid rgba(224,66,90,0.22)', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px', fontSize:'13px', color:'#c0324a', fontWeight:'500' }}>
                {serverMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
              <div>
                <label className="lbl">Email Address</label>
                <input className="vi" name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} autoFocus autoComplete="email"/>
                {errors.email && <p className="err">{errors.email}</p>}
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'7px' }}>
                  <label className="lbl" style={{ margin:0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize:'12px', color:'#7c6fe0', textDecoration:'none', fontWeight:'600' }}>Forgot?</Link>
                </div>
                <div style={{ position:'relative' }}>
                  <input className="vi" name="password" type={showPass?'text':'password'}
                    placeholder="Your password" value={form.password}
                    onChange={handleChange} style={{ paddingRight:'42px' }} autoComplete="current-password"/>
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(30,27,75,0.32)', padding:'2px', lineHeight:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showPass
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="err">{errors.password}</p>}
              </div>

              <button className="sbtn" type="submit" disabled={loading}>
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation:'spin 0.7s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign:'center', marginTop:'20px', paddingTop:'18px', borderTop:'1px solid rgba(108,95,199,0.08)' }}>
              <p style={{ fontSize:'13px', color:'rgba(30,27,75,0.46)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color:'#7c6fe0', fontWeight:'700', textDecoration:'none' }}>Create one</Link>
              </p>
            </div>
          </div>

          {/* Role badges */}
          <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginTop:'20px', flexWrap:'wrap' }}>
            {[{r:'Admin',c:'#7c6fe0'},{r:'Librarian',c:'#38b2a0'},{r:'Member',c:'#5ba8d4'}].map(({r,c})=>(
              <span key={r} style={{ fontSize:'11px', padding:'3px 13px', borderRadius:'20px', background:`${c}12`, color:c, border:`1px solid ${c}28`, fontWeight:'600' }}>{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
