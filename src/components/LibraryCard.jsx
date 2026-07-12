import { useEffect, useRef, useState } from 'react';
import Layout from './Layout';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';

/* ══ Inline QR Engine — zero deps, zero CDN ══════════════════════ */
const _E=new Uint8Array(512),_L=new Uint8Array(256);
(()=>{let v=1;for(let i=0;i<255;i++){_E[i]=v;_L[v]=i;v=(v<<1)^(v&0x80?0x11d:0);}for(let i=255;i<512;i++)_E[i]=_E[i-255];})();
const _m=(a,b)=>(a&&b)?_E[_L[a]+_L[b]]:0;
function _rs(d,n){let g=[1];for(let i=0;i<n;i++){const q=new Array(g.length+1).fill(0);for(let j=0;j<g.length;j++){q[j]^=g[j];q[j+1]^=_m(g[j],_E[i]);}g=q;}const s=[...d,...new Array(n).fill(0)];for(let i=0;i<d.length;i++){const c=s[i];if(c)for(let j=0;j<g.length;j++)s[i+j]^=_m(g[j],c);}return s.slice(d.length);}
const _V=[null,[21,13,1,10],[25,22,1,16],[29,34,1,26],[33,48,2,18],[37,64,2,24]];
function _pv(l){for(let v=1;v<=5;v++)if(Math.ceil((4+8+l*8+4)/8)<=_V[v][1])return v;return 5;}
function _cw(t,v){const[,dc,bl,ep]=_V[v];const by=Array.from(t).map(c=>c.charCodeAt(0));const bi=[];const pb=(x,n)=>{for(let i=n-1;i>=0;i--)bi.push((x>>i)&1);};pb(4,4);pb(by.length,8);by.forEach(b=>pb(b,8));pb(0,4);while(bi.length%8)bi.push(0);const cw=[];for(let i=0;i<bi.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bi[i+j];cw.push(b);}const pa=[0xec,0x11];let pi=0;while(cw.length<dc)cw.push(pa[pi++%2]);const bs=Math.floor(dc/bl),ex=dc%bl;const dB=[],eB=[];let pos=0;for(let b=0;b<bl;b++){const ln=bs+(b>=bl-ex?1:0);const bk=cw.slice(pos,pos+ln);dB.push(bk);eB.push(_rs(bk,ep));pos+=ln;}const o=[];const mD=Math.max(...dB.map(b=>b.length));for(let i=0;i<mD;i++)dB.forEach(b=>{if(i<b.length)o.push(b[i]);});eB[0].forEach((_,i)=>eB.forEach(b=>o.push(b[i])));return o;}
function _makeQR(text){
  const ver=_pv(text.length);const[sz]=_V[ver];const cw=_cw(text,ver);
  const M=Array.from({length:sz},()=>new Int8Array(sz).fill(-1));
  const F=Array.from({length:sz},()=>new Uint8Array(sz));
  const ok=(r,c)=>r>=0&&r<sz&&c>=0&&c<sz;
  const s=(r,c,v)=>{if(!ok(r,c))return;M[r][c]=v;F[r][c]=1;};
  const fin=(tr,tc)=>{for(let r=0;r<7;r++)for(let c=0;c<7;c++)s(tr+r,tc+c,(r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4))?1:0);for(let i=0;i<=7;i++){s(tr+7,tc+i,0);s(tr-1,tc+i,0);s(tr+i,tc+7,0);s(tr+i,tc-1,0);}};
  fin(0,0);fin(0,sz-7);fin(sz-7,0);
  for(let i=8;i<sz-8;i++){s(6,i,i%2?0:1);s(i,6,i%2?0:1);}s(sz-8,8,1);
  const AL=[[],[],[6,18],[6,22],[6,26],[6,30]];const ap=AL[ver]||[];
  for(const r of ap)for(const c of ap){if(F[r]?.[c])continue;for(let dr=-2;dr<=2;dr++)for(let dc=-2;dc<=2;dc++)s(r+dr,c+dc,(Math.abs(dr)===2||Math.abs(dc)===2||(dr===0&&dc===0))?1:0);}
  const fd=(()=>{const d=2;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>9)?0x537:0);return((d<<10)|(r&0x3ff))^0x5412;})();
  [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]].forEach(([r,c],i)=>s(r,c,(fd>>(14-i))&1));
  [[sz-1,8],[sz-2,8],[sz-3,8],[sz-4,8],[sz-5,8],[sz-6,8],[sz-7,8],[8,sz-8],[8,sz-7],[8,sz-6],[8,sz-5],[8,sz-4],[8,sz-3],[8,sz-2],[8,sz-1]].forEach(([r,c],i)=>s(r,c,(fd>>(14-i))&1));
  const rem=[0,0,7,7,7,7,7][ver]||0;
  const ab=[];cw.forEach(w=>{for(let i=7;i>=0;i--)ab.push((w>>i)&1);});for(let i=0;i<rem;i++)ab.push(0);
  let bit=0,up=true;
  for(let rt=sz-1;rt>=1;rt-=2){if(rt===6)rt=5;for(let i=0;i<sz;i++){const row=up?sz-1-i:i;for(let d=0;d<=1;d++){const col=rt-d;if(!ok(row,col)||F[row][col])continue;M[row][col]=(ab[bit]??0)^(row%2===0?1:0);bit++;}}up=!up;}
  return{matrix:M,size:sz};
}
function _drawQR(canvas,text,px,dark,light){
  try{
    const{matrix,size}=_makeQR(text);
    const sc=Math.max(1,Math.floor(px/size));const w=sc*size;
    canvas.width=w;canvas.height=w;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle=light;ctx.fillRect(0,0,w,w);
    ctx.fillStyle=dark;
    for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(matrix[r][c]===1)ctx.fillRect(c*sc,r*sc,sc,sc);
  }catch(e){console.error('QR draw error:',e);canvas.width=px;canvas.height=px;}
}
function getQRDataURL(text,px=200,dark='#1E1A16',light='#ffffff'){
  const c=document.createElement('canvas');_drawQR(c,text,px,dark,light);return c.toDataURL('image/png');
}
function generateQRForCanvas(text){return _makeQR(text);}

/* ── Self-contained QRCode React component ── */
function QRCode({value,size=120,dark='#000000',light='#ffffff',style={}}){
  const ref=useRef(null);
  useEffect(()=>{if(ref.current&&value)_drawQR(ref.current,value,size,dark,light);},[value,size,dark,light]);
  return <canvas ref={ref} style={{display:'block',imageRendering:'pixelated',...style}}/>;
}
/* ══ End QR Engine ═══════════════════════════════════════════════ */


const PLAN_COLORS = {
  FREE:     { bg:['#e8e6ff','#d0ccff'], accent:'#96702E', badge:'FREE',     icon:'📚' },
  BASIC:    { bg:['#e0f4ee','#b8e8d4'], accent:'#2d7a52', badge:'BASIC',    icon:'⭐' },
  STANDARD: { bg:['#e8f4ff','#b8d8f8'], accent:'#1a6aaa', badge:'STANDARD', icon:'✨' },
  PREMIUM:  { bg:['#fff4e0','#ffd88a'], accent:'#9b6800', badge:'PREMIUM',  icon:'👑' },
};

const ROLE_COLORS = {
  ADMIN:     { accent:'#c8a55a', label:'Administrator' },
  LIBRARIAN: { accent:'#b8863f', label:'Librarian'     },
  MEMBER:    { accent:'#38b2a0', label:'Member'        },
};

/* ─── The actual card SVG/DOM rendered at 2× for crisp downloads ── */
function LibraryCardFace({ user, borrowStats, qrDataUrl, cardRef }) {
  const plan    = user?.subscriptionPlan || 'FREE';
  const role    = user?.role || 'MEMBER';
  const pCfg    = PLAN_COLORS[plan]  || PLAN_COLORS.FREE;
  const rCfg    = ROLE_COLORS[role]  || ROLE_COLORS.MEMBER;
  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'LB';
  const memberId = `LIB-${String(user?.id || 0).padStart(6,'0')}`;
  const joinYear = new Date().getFullYear();
  const expiry   = `${joinYear + 1}`;

  return (
    <div ref={cardRef} id="library-card" style={{
      width: '420px', height: '260px',
      borderRadius: '18px', overflow: 'hidden',
      position: 'relative', flexShrink: 0,
      fontFamily: "'Manrope', sans-serif",
      background: `linear-gradient(135deg, ${pCfg.bg[0]} 0%, ${pCfg.bg[1]} 100%)`,
      boxShadow: `0 20px 60px ${pCfg.accent}30, 0 4px 20px rgba(0,0,0,0.10)`,
    }}>

      {/* Background decorative circles */}
      <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:`${pCfg.accent}14` }}/>
      <div style={{ position:'absolute', bottom:'-60px', left:'-30px', width:'180px', height:'180px', borderRadius:'50%', background:`${pCfg.accent}10` }}/>
      <div style={{ position:'absolute', top:'60px', right:'30px', width:'80px', height:'80px', borderRadius:'50%', background:`${pCfg.accent}08` }}/>

      {/* Top strip */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'5px', background:`linear-gradient(90deg, ${pCfg.accent}, ${pCfg.accent}88)` }}/>

      {/* Header row */}
      <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {/* Logo */}
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:pCfg.accent, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 3px 10px ${pCfg.accent}50` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize:'14px', fontWeight:'700', color:'#1E1A16', lineHeight:1, fontFamily:"'Bodoni Moda',serif" }}>Librario</p>
            <p style={{ fontSize:'8px', letterSpacing:'0.12em', color:`${pCfg.accent}`, fontWeight:'700', textTransform:'uppercase', marginTop:'1px' }}>LIBRARY MANAGEMENT</p>
          </div>
        </div>
        {/* Plan badge */}
        <div style={{ background:`${pCfg.accent}22`, border:`1.5px solid ${pCfg.accent}55`, borderRadius:'20px', padding:'4px 12px', display:'flex', alignItems:'center', gap:'5px' }}>
          <span style={{ fontSize:'11px' }}>{pCfg.icon}</span>
          <span style={{ fontSize:'10px', fontWeight:'800', color:pCfg.accent, letterSpacing:'0.08em' }}>{pCfg.badge}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ position:'relative', zIndex:1, display:'flex', gap:'18px', padding:'16px 22px 0' }}>

        {/* Left: Avatar + name */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'10px', flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'13px' }}>
            {/* Avatar */}
            <div style={{ width:'54px', height:'54px', borderRadius:'50%', background:`linear-gradient(135deg, ${pCfg.accent}, ${pCfg.accent}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'800', color:'white', border:`3px solid white`, boxShadow:`0 4px 16px ${pCfg.accent}50`, flexShrink:0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize:'17px', fontWeight:'700', color:'#1E1A16', lineHeight:1.2, maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Library Member'}</p>
              <p style={{ fontSize:'10px', color:`${pCfg.accent}`, fontWeight:'600', marginTop:'2px', background:`${pCfg.accent}15`, padding:'2px 8px', borderRadius:'4px', display:'inline-block' }}>
                {rCfg.label}
              </p>
            </div>
          </div>

          {/* Member details grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 14px', width:'100%' }}>
            {[
              { label:'MEMBER ID',  value: memberId },
              { label:'EMAIL',      value: user?.email?.length > 18 ? user.email.slice(0,18)+'…' : user?.email || '—' },
              { label:'BOOKS READ', value: borrowStats?.total || '0' },
              { label:'VALID TILL', value: `Dec ${expiry}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize:'8px', fontWeight:'700', color:`${pCfg.accent}99`, letterSpacing:'0.12em', marginBottom:'1px' }}>{label}</p>
                <p style={{ fontSize:'11px', fontWeight:'600', color:'#1E1A16', fontFamily: label === 'MEMBER ID' ? 'monospace' : 'inherit' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Status chip */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22a66e', boxShadow:'0 0 6px rgba(34,166,110,0.60)' }}/>
            <span style={{ fontSize:'10px', fontWeight:'700', color:'#22a66e' }}>ACTIVE MEMBER</span>
          </div>
        </div>

        {/* Right: QR code */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', flexShrink:0 }}>
          <div style={{ background:'white', borderRadius:'10px', padding:'8px', boxShadow:`0 4px 16px ${pCfg.accent}20`, border:`1px solid ${pCfg.accent}22` }}>
            <QRCode value={`LIBRARIO_MEMBER_${user?.id || 0}`} size={80} dark="#1E1A16" light="#ffffff"/>
          </div>
          <p style={{ fontSize:'8px', color:`${pCfg.accent}88`, fontWeight:'600', letterSpacing:'0.08em', textAlign:'center' }}>SCAN TO VERIFY</p>
        </div>
      </div>

      {/* Bottom: holographic-style strip */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'32px', background:`linear-gradient(90deg, ${pCfg.accent}22, ${pCfg.accent}44, ${pCfg.accent}22)`, borderTop:`1px solid ${pCfg.accent}30`, display:'flex', alignItems:'center', padding:'0 22px', justifyContent:'space-between' }}>
        <p style={{ fontSize:'9px', color:`${pCfg.accent}`, fontWeight:'600', letterSpacing:'0.10em' }}>LIBRARIO LIBRARY SYSTEM</p>
        <div style={{ display:'flex', gap:'4px' }}>
          {[...Array(8)].map((_,i)=>(
            <div key={i} style={{ width:'14px', height:'8px', borderRadius:'2px', background:`${pCfg.accent}${i % 2 === 0 ? '66' : '33'}` }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────── */
export default function LibraryCard() {
  const { user } = useAuthStore();
  const cardRef  = useRef(null);
  const qrRef    = useRef(null);

  const [qrDataUrl,   setQrDataUrl]   = useState('');
  const [borrowStats, setBorrowStats] = useState({ total:0, active:0 });
  const [downloading, setDownloading] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [theme,       setTheme]       = useState('light');

  /* Load borrow history for stats */
  useEffect(() => {
    const fetchStats = async () => {
      let uid = user?.id;
      if (!uid && user?.email) {
        try { const r = await API.get('/auth/users'); uid = r.data.find(u => u.email === user.email)?.id; } catch {}
      }
      if (!uid) return;
      try {
        const r = await API.get(`/borrow/history/${uid}`);
        setBorrowStats({
          total:  r.data.length,
          active: r.data.filter(b => !b.returned).length,
        });
      } catch {}
    };
    fetchStats();
  }, [user]);

  /* Generate QR code data URL for download */
  useEffect(() => {
    const url = getQRDataURL(`LIBRARIO_MEMBER_${user?.id || 0}`, 200, '#1E1A16', '#ffffff');
    if (url) setQrDataUrl(url);
  }, [user]);

  /* Download card — draw directly to canvas (no html2canvas needed) */
  const downloadCard = () => {
    setDownloading(true);
    try {
      const plan   = user?.subscriptionPlan || 'FREE';
      const pCfg2  = PLAN_COLORS[plan] || PLAN_COLORS.FREE;
      const role2  = user?.role || 'MEMBER';
      const rCfg2  = ROLE_COLORS[role2] || ROLE_COLORS.MEMBER;
      const W = 840, H = 520;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, pCfg2.bg[0]);
      grad.addColorStop(1, pCfg2.bg[1]);
      ctx.fillStyle = grad;
      ctx.roundRect(0, 0, W, H, 36);
      ctx.fill();

      // Top accent strip
      ctx.fillStyle = pCfg2.accent;
      ctx.fillRect(0, 0, W, 10);

      // Decorative circles
      ctx.globalAlpha = 0.10;
      ctx.fillStyle = pCfg2.accent;
      ctx.beginPath(); ctx.arc(W - 80, -80, 400, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-60, H + 120, 360, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;

      // Logo box
      ctx.fillStyle = pCfg2.accent;
      ctx.roundRect(36, 36, 64, 64, 16);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📚', 68, 78);

      // Librario text
      ctx.fillStyle = '#1E1A16';
      ctx.textAlign = 'left';
      ctx.font = 'bold 32px serif';
      ctx.fillText('Librario', 116, 66);
      ctx.fillStyle = pCfg2.accent;
      ctx.font = '14px sans-serif';
      ctx.fillText('LIBRARY MANAGEMENT', 116, 90);

      // Plan badge
      ctx.fillStyle = pCfg2.accent + '33';
      ctx.roundRect(W - 160, 36, 124, 40, 20);
      ctx.fill();
      ctx.strokeStyle = pCfg2.accent + '88';
      ctx.lineWidth = 2;
      ctx.roundRect(W - 160, 36, 124, 40, 20);
      ctx.stroke();
      ctx.fillStyle = pCfg2.accent;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pCfg2.badge, W - 98, 62);

      // Avatar
      const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'LB';
      const grad2 = ctx.createLinearGradient(36, 150, 150, 260);
      grad2.addColorStop(0, pCfg2.accent);
      grad2.addColorStop(1, pCfg2.accent + 'bb');
      ctx.fillStyle = grad2;
      ctx.beginPath(); ctx.arc(94, 200, 52, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(initials, 94, 212);

      // Name
      ctx.fillStyle = '#1E1A16';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(user?.name || 'Library Member', 170, 195);
      ctx.fillStyle = pCfg2.accent;
      ctx.font = '18px sans-serif';
      ctx.fillText(rCfg2.label, 170, 225);

      // Details grid
      const details = [
        ['MEMBER ID',  `LIB-${String(user?.id||0).padStart(6,'0')}`],
        ['EMAIL',       (user?.email||'').slice(0,26)],
        ['BOOKS READ',  String(borrowStats?.total || 0)],
        ['VALID TILL', `Dec ${new Date().getFullYear()+1}`],
      ];
      details.forEach(([label, val], i) => {
        const col = i % 2 === 0 ? 36 : 320;
        const row = i < 2 ? 285 : 360;
        ctx.fillStyle = pCfg2.accent + '99';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, col, row);
        ctx.fillStyle = '#1E1A16';
        ctx.font = i === 0 ? 'bold 18px monospace' : 'bold 18px sans-serif';
        ctx.fillText(val, col, row + 26);
      });

      // Active dot
      ctx.fillStyle = '#22a66e';
      ctx.beginPath(); ctx.arc(43, 430, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#22a66e';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ACTIVE MEMBER', 60, 436);

      // QR code
      const { matrix, size: modules } = (function() {
        try { return generateQRForCanvas(`LIBRARIO_MEMBER_${user?.id||0}`); }
        catch { return { matrix: null, size: 0 }; }
      })();
      if (matrix) {
        const qrSize = 160, scale = Math.floor(qrSize / modules);
        const qrX = W - qrSize - 48, qrY = 140;
        ctx.fillStyle = '#fff';
        ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 14);
        ctx.fill();
        ctx.fillStyle = '#1E1A16';
        for (let r = 0; r < modules; r++)
          for (let col = 0; col < modules; col++)
            if (matrix[r]?.[col])
              ctx.fillRect(qrX + col*scale, qrY + r*scale, scale, scale);
        ctx.fillStyle = pCfg2.accent + '88';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN TO VERIFY', qrX + qrSize/2, qrY + qrSize + 28);
      }

      // Bottom strip
      ctx.fillStyle = pCfg2.accent + '33';
      ctx.fillRect(0, H - 50, W, 50);
      ctx.fillStyle = pCfg2.accent;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('LIBRARIO LIBRARY SYSTEM', 36, H - 18);

      // Download
      const link = document.createElement('a');
      link.download = `librario-card-${(user?.name||'member').replace(/\s+/g,'-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (e) {
      console.error(e);
      alert('Download failed: ' + e.message);
    } finally { setDownloading(false); }
  };

  /* Copy member ID */
  const memberId = `LIB-${String(user?.id || 0).padStart(6,'0')}`;
  const copyId = () => {
    navigator.clipboard.writeText(memberId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const plan    = user?.subscriptionPlan || 'FREE';
  const role    = user?.role || 'MEMBER';
  const pCfg    = PLAN_COLORS[plan]  || PLAN_COLORS.FREE;
  const rCfg    = ROLE_COLORS[role]  || ROLE_COLORS.MEMBER;

  return (
    <Layout title="My Library Card" subtitle="Your digital identity — download and carry it with you">
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'36px', alignItems:'start', maxWidth:'1000px' }}>

        {/* ── Left: Card + download ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'18px', alignItems:'center' }}>
          <LibraryCardFace user={user} borrowStats={borrowStats} qrDataUrl={qrDataUrl} cardRef={cardRef}/>

          {/* Action row */}
          <div style={{ display:'flex', gap:'10px', width:'100%', maxWidth:'420px' }}>
            <button className="btn-primary" onClick={downloadCard} disabled={downloading} style={{ flex:1, fontSize:'13px', padding:'11px 0', justifyContent:'center' }}>
              {downloading ? '⏳ Generating…' : '⬇️ Download PNG'}
            </button>
            <button className="btn-secondary" onClick={copyId} style={{ fontSize:'13px', padding:'11px 16px' }}>
              {copied ? '✓ Copied!' : '📋 Copy ID'}
            </button>
          </div>

          <p style={{ fontSize:'11px', color:'var(--text-3)', textAlign:'center', maxWidth:'340px', lineHeight:1.6 }}>
            This card is your digital library identity. Show it at the counter or let staff scan the QR code to pull up your account instantly.
          </p>
        </div>

        {/* ── Right: Details panels ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Account summary */}
          <div className="card" style={{ padding:'24px' }}>
            <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'18px' }}>Account Summary</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
              {[
                { label:'Total Books', value: borrowStats.total,  icon:'📚', color:pCfg.accent },
                { label:'Currently Active', value: borrowStats.active, icon:'📖', color:'var(--green)' },
                { label:'Plan', value: plan, icon: pCfg.icon, color:pCfg.accent },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center', padding:'16px 10px', background:'var(--bg-2)', borderRadius:'12px', border:'1px solid var(--border)' }}>
                  <p style={{ fontSize:'20px', marginBottom:'6px' }}>{s.icon}</p>
                  <p style={{ fontSize:'22px', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:"'Bodoni Moda',serif" }}>{s.value}</p>
                  <p style={{ fontSize:'10px', color:'var(--text-3)', marginTop:'4px', fontWeight:'500' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card details */}
          <div className="card" style={{ padding:'24px' }}>
            <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'18px' }}>Card Details</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                { label:'Full Name',    value: user?.name || '—' },
                { label:'Email',        value: user?.email || '—' },
                { label:'Member ID',    value: memberId, mono:true },
                { label:'Role',         value: rCfg.label },
                { label:'Plan',         value: plan },
                { label:'Card Status',  value: 'Active & Valid' },
              ].map(f => (
                <div key={f.label} style={{ display:'flex', alignItems:'center', gap:'12px', paddingBottom:'14px', borderBottom:'1px solid var(--border)' }}>
                  <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', minWidth:'100px', flexShrink:0 }}>{f.label}</p>
                  <p style={{ fontSize:'13px', color:'var(--text-1)', fontFamily: f.mono ? 'monospace' : 'inherit', fontWeight: f.mono ? '600' : '400', flex:1 }}>
                    {f.value}
                  </p>
                  {f.label === 'Card Status' && (
                    <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 6px rgba(34,166,110,0.6)', flexShrink:0 }}/>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QR Code info */}
          <div className="card" style={{ padding:'22px', background:`${pCfg.accent}08`, border:`1px solid ${pCfg.accent}28` }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'16px' }}>
              <div style={{ background:'white', borderRadius:'10px', padding:'8px', border:`1px solid ${pCfg.accent}25`, flexShrink:0, boxShadow:`0 4px 14px ${pCfg.accent}18` }}>
                <QRCode value={`LIBRARIO_MEMBER_${user?.id || 0}`} size={72} dark="#1E1A16" light="#ffffff"/>
              </div>
              <div>
                <p style={{ fontSize:'14px', fontWeight:'700', color:'var(--text-1)', marginBottom:'6px' }}>Your Member QR Code</p>
                <p style={{ fontSize:'12px', color:'var(--text-2)', lineHeight:1.65, marginBottom:'10px' }}>
                  This QR encodes your unique member ID. Librarians can scan it at the counter to instantly find your account and process borrows.
                </p>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'7px', padding:'5px 12px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <code style={{ fontSize:'11px', color:'var(--text-2)', fontFamily:'monospace' }}>LIBRARIO_MEMBER_{user?.id}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Usage tip */}
          <div style={{ background:'var(--accent-muted)', border:'1px solid var(--border-accent)', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
            <span style={{ fontSize:'18px', flexShrink:0 }}>💡</span>
            <div>
              <p style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-1)', marginBottom:'4px' }}>How to use your card</p>
              <p style={{ fontSize:'12px', color:'var(--text-2)', lineHeight:1.65 }}>
                Download the PNG and save it to your phone's gallery or wallet. At the library counter, simply show the screen or let the librarian scan the QR code. No app required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
