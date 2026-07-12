import { useEffect, useRef, useState, useCallback } from 'react';
import Layout from './Layout';
import API from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

/* ══ Inline QR Engine ═══════════════════════════════════════════ */
const _E2=new Uint8Array(512),_L2=new Uint8Array(256);
(()=>{let v=1;for(let i=0;i<255;i++){_E2[i]=v;_L2[v]=i;v=(v<<1)^(v&0x80?0x11d:0);}for(let i=255;i<512;i++)_E2[i]=_E2[i-255];})();
const _m2=(a,b)=>(a&&b)?_E2[_L2[a]+_L2[b]]:0;
function _rs2(d,n){let g=[1];for(let i=0;i<n;i++){const q=new Array(g.length+1).fill(0);for(let j=0;j<g.length;j++){q[j]^=g[j];q[j+1]^=_m2(g[j],_E2[i]);}g=q;}const s=[...d,...new Array(n).fill(0)];for(let i=0;i<d.length;i++){const c=s[i];if(c)for(let j=0;j<g.length;j++)s[i+j]^=_m2(g[j],c);}return s.slice(d.length);}
const _V2=[null,[21,13,1,10],[25,22,1,16],[29,34,1,26],[33,48,2,18],[37,64,2,24]];
function _pv2(l){for(let v=1;v<=5;v++)if(Math.ceil((4+8+l*8+4)/8)<=_V2[v][1])return v;return 5;}
function _cw2(t,v){const[,dc,bl,ep]=_V2[v];const by=Array.from(t).map(c=>c.charCodeAt(0));const bi=[];const pb=(x,n)=>{for(let i=n-1;i>=0;i--)bi.push((x>>i)&1);};pb(4,4);pb(by.length,8);by.forEach(b=>pb(b,8));pb(0,4);while(bi.length%8)bi.push(0);const cw=[];for(let i=0;i<bi.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bi[i+j];cw.push(b);}const pa=[0xec,0x11];let pi=0;while(cw.length<dc)cw.push(pa[pi++%2]);const bs=Math.floor(dc/bl),ex=dc%bl;const dB=[],eB=[];let pos=0;for(let b=0;b<bl;b++){const ln=bs+(b>=bl-ex?1:0);const bk=cw.slice(pos,pos+ln);dB.push(bk);eB.push(_rs2(bk,ep));pos+=ln;}const o=[];const mD=Math.max(...dB.map(b=>b.length));for(let i=0;i<mD;i++)dB.forEach(b=>{if(i<b.length)o.push(b[i]);});eB[0].forEach((_,i)=>eB.forEach(b=>o.push(b[i])));return o;}
function _makeQR2(text){
  const ver=_pv2(text.length);const[sz]=_V2[ver];const cw=_cw2(text,ver);
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
function _drawQR2(canvas,text,px,dark,light){
  try{const{matrix,size}=_makeQR2(text);const sc=Math.max(1,Math.floor(px/size));const w=sc*size;canvas.width=w;canvas.height=w;const ctx=canvas.getContext('2d');ctx.fillStyle=light;ctx.fillRect(0,0,w,w);ctx.fillStyle=dark;for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(matrix[r][c]===1)ctx.fillRect(c*sc,r*sc,sc,sc);}catch(e){console.error('QR err:',e);}
}
function QRCode({value,size=120,dark='#1E1A16',light='#ffffff',style={}}){
  const ref=useRef(null);
  useEffect(()=>{if(ref.current&&value)_drawQR2(ref.current,value,size,dark,light);},[value,size,dark,light]);
  return <canvas ref={ref} style={{display:'block',imageRendering:'pixelated',...style}}/>;
}
/* ══ End QR Engine ══════════════════════════════════════════════ */

/* ─── tiny inline QR decoder using jsQR via CDN script tag ─────── */
/* We dynamically inject jsQR from CDN so no npm install needed     */

const MODE_ISSUE  = 'issue';
const MODE_RETURN = 'return';

function loadJsQR() {
  return new Promise((resolve) => {
    if (window.jsQR) { resolve(window.jsQR); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    s.onload = () => resolve(window.jsQR);
    document.head.appendChild(s);
  });
}

/* ─── Animated result card ──────────────────────────────────────── */
function ResultCard({ result, onClose }) {
  if (!result) return null;
  const ok = result.type === 'success';
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:999, display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)',
      animation:'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        background:'var(--bg-card)', borderRadius:'20px', padding:'36px 44px',
        maxWidth:'380px', width:'90%', textAlign:'center',
        border:`2px solid ${ok ? 'var(--green)' : 'var(--red)'}`,
        boxShadow:`0 0 60px ${ok ? 'rgba(34,166,110,0.22)' : 'rgba(224,66,90,0.22)'}`,
        animation:'popUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          width:'64px', height:'64px', borderRadius:'50%',
          background: ok ? 'var(--green-muted)' : 'var(--red-muted)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 18px',
          border:`2px solid ${ok ? 'var(--green)' : 'var(--red)'}`,
        }}>
          {ok
            ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          }
        </div>
        <h2 style={{ fontSize:'18px', fontWeight:'700', color:'var(--text-1)', marginBottom:'8px' }}>
          {ok ? (result.mode === MODE_ISSUE ? 'Book Issued!' : 'Book Returned!') : 'Action Failed'}
        </h2>
        <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.6, marginBottom:'6px' }}>
          {result.message}
        </p>
        {result.dueDate && (
          <div style={{ background:'var(--green-muted)', border:'1px solid var(--green)', borderRadius:'8px', padding:'8px 16px', marginTop:'12px' }}>
            <p style={{ fontSize:'12px', color:'var(--green)', fontWeight:'700' }}>Due Date: {result.dueDate}</p>
          </div>
        )}
        {result.fine > 0 && (
          <div style={{ background:'var(--red-muted)', border:'1px solid var(--red)', borderRadius:'8px', padding:'8px 16px', marginTop:'12px' }}>
            <p style={{ fontSize:'12px', color:'var(--red)', fontWeight:'700' }}>Fine Collected: ₹{result.fine}</p>
          </div>
        )}
        <button onClick={onClose} className="btn-primary" style={{ marginTop:'22px', padding:'10px 32px', fontSize:'13px' }}>
          Scan Next
        </button>
      </div>
    </div>
  );
}

/* ─── Book QR Preview Modal ─────────────────────────────────────── */
function BookQRModal({ book, onClose }) {

  const downloadQR = () => {
    // Find the canvas inside the modal and download it
    const canvas = document.querySelector('#book-qr-canvas canvas');
    if (!canvas) { alert('QR not ready'); return; }
    const link = document.createElement('a');
    link.download = `book-qr-${book.id}-${book.title.replace(/\s+/g,'-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!book) return null;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)' }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', borderRadius:'20px', padding:'32px', maxWidth:'320px', width:'90%', textAlign:'center', border:'1px solid var(--border)', boxShadow:'var(--shadow-hover)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
          <h3 style={{ fontSize:'16px', fontWeight:'700', color:'var(--text-1)' }}>Book QR Code</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', fontSize:'20px' }}>×</button>
        </div>
        <div id="book-qr-canvas" style={{ background:'#fff', borderRadius:'12px', padding:'16px', display:'inline-block', marginBottom:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
          <QRCode value={`LIBRARIO_BOOK_${book.id}`} size={200} dark="#1E1A16" light="#ffffff"/>
        </div>
        <p style={{ fontWeight:'700', fontSize:'14px', color:'var(--text-1)', marginBottom:'4px' }}>{book.title}</p>
        <p style={{ fontSize:'12px', color:'var(--text-3)', marginBottom:'4px' }}>{book.author}</p>
        <p style={{ fontSize:'11px', color:'var(--accent)', fontWeight:'600', marginBottom:'18px', fontFamily:'monospace', background:'var(--accent-muted)', display:'inline-block', padding:'3px 10px', borderRadius:'6px' }}>
          LIBRARIO_BOOK_{book.id}
        </p>
        <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
          <button onClick={downloadQR} className="btn-primary" style={{ fontSize:'13px', padding:'9px 20px' }}>
            ⬇️ Download QR
          </button>
          <button onClick={onClose} className="btn-secondary" style={{ fontSize:'13px', padding:'9px 16px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN QR SCANNER PAGE ─────────────────────────────────────── */
export default function QRScanner() {
  const { user } = useAuthStore();
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const rafRef     = useRef(null);
  const lastScan   = useRef(0);

  const [mode,        setMode]       = useState(MODE_ISSUE);
  const [scanning,    setScanning]   = useState(false);
  const [camError,    setCamError]   = useState('');
  const [result,      setResult]     = useState(null);
  const [processing,  setProcessing] = useState(false);
  const [manualId,    setManualId]   = useState('');
  const [userId,      setUserId]     = useState('');
  const [users,       setUsers]      = useState([]);
  const [books,       setBooks]      = useState([]);
  const [userSearch,  setUserSearch] = useState('');
  const [bookSearch,  setBookSearch] = useState('');
  const [showBookQR,  setShowBookQR] = useState(null);
  const [jsQR,        setJsQR]       = useState(null);
  const [activeTab,   setActiveTab]  = useState('scanner'); // scanner | generate | history
  const [history,     setHistory]    = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);

  // Load jsQR + data on mount
  useEffect(() => {
    loadJsQR().then(setJsQR);
    API.get('/auth/users').then(r => setUsers(r.data)).catch(()=>{});
    API.get('/books').then(r => setBooks(r.data)).catch(()=>{});
    API.get('/borrow/all').then(r => setBorrowRecords(r.data)).catch(()=>{});
  }, []);

  // Camera start/stop
  const startCamera = useCallback(async () => {
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode:'environment', width:{ ideal:1280 }, height:{ ideal:720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
      }
    } catch (e) {
      setCamError(e.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : 'Could not access camera. Please check your device.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // QR scan loop
  useEffect(() => {
    if (!scanning || !jsQR) return;
    const scan = () => {
      const video   = videoRef.current;
      const canvas  = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) { rafRef.current = requestAnimationFrame(scan); return; }
      const ctx = canvas.getContext('2d');
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts:'dontInvert' });
      if (code && Date.now() - lastScan.current > 2500) {
        lastScan.current = Date.now();
        handleQRDetected(code.data);
      }
      rafRef.current = requestAnimationFrame(scan);
    };
    rafRef.current = requestAnimationFrame(scan);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [scanning, jsQR, mode, userId]);

  const handleQRDetected = useCallback(async (data) => {
    // Expected: LIBRARIO_BOOK_{id}  or  LIBRARIO_MEMBER_{id}
    const bookMatch = data.match(/^LIBRARIO_BOOK_(\d+)$/);
    if (!bookMatch) return; // ignore non-Librario QRs
    const bookId = Number(bookMatch[1]);

    if (mode === MODE_ISSUE) {
      if (!userId) {
        // Flash hint
        setResult({ type:'error', message:'Please select a member before scanning a book to issue.', mode });
        return;
      }
      await performIssue(bookId, Number(userId));
    } else {
      // Return: find active borrow for this book
      const record = borrowRecords.find(r => r.book?.id === bookId && !r.returned);
      if (!record) {
        setResult({ type:'error', message:`No active borrow found for Book #${bookId}.`, mode });
        return;
      }
      await performReturn(record.id);
    }
  }, [mode, userId, borrowRecords]);

  const performIssue = async (bookId, memberId) => {
    setProcessing(true);
    try {
      const res = await API.post('/borrow/issue', { bookId, userId: memberId });
      const entry = { action:'Issued', bookId, memberId, time: new Date().toLocaleTimeString(), bookTitle: books.find(b=>b.id===bookId)?.title || `Book #${bookId}` };
      setHistory(h => [entry, ...h.slice(0,19)]);
      setResult({ type:'success', mode:MODE_ISSUE, message: res.data.message || 'Book issued successfully!', dueDate: res.data.dueDate });
      API.get('/borrow/all').then(r => setBorrowRecords(r.data)).catch(()=>{});
    } catch (err) {
      setResult({ type:'error', mode:MODE_ISSUE, message: err.response?.data || 'Issue failed' });
    } finally { setProcessing(false); }
  };

  const performReturn = async (borrowId) => {
    setProcessing(true);
    try {
      const res = await API.put(`/borrow/return/${borrowId}`);
      const entry = { action:'Returned', borrowId, time: new Date().toLocaleTimeString(), fine: res.data?.fine || 0 };
      setHistory(h => [entry, ...h.slice(0,19)]);
      setResult({ type:'success', mode:MODE_RETURN, message: res.data?.message || 'Book returned successfully!', fine: res.data?.fine || 0 });
      API.get('/borrow/all').then(r => setBorrowRecords(r.data)).catch(()=>{});
    } catch (err) {
      setResult({ type:'error', mode:MODE_RETURN, message: err.response?.data || 'Return failed' });
    } finally { setProcessing(false); }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const id = manualId.trim();
    if (!id) return;
    if (mode === MODE_ISSUE) {
      if (!userId) { alert('Please select a member first'); return; }
      await performIssue(Number(id), Number(userId));
    } else {
      const record = borrowRecords.find(r => r.book?.id === Number(id) && !r.returned);
      if (!record) { setResult({ type:'error', message:`No active borrow for Book ID ${id}.`, mode }); return; }
      await performReturn(record.id);
    }
    setManualId('');
  };

  const filteredUsers  = users.filter(u => u.role === 'MEMBER' && (!userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())));
  const filteredBooks  = books.filter(b => !bookSearch || b.title?.toLowerCase().includes(bookSearch.toLowerCase()) || b.author?.toLowerCase().includes(bookSearch.toLowerCase()));
  const selectedMember = users.find(u => String(u.id) === String(userId));

  return (
    <Layout title="QR Borrow & Return" subtitle="Scan a book QR code to instantly issue or return">
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popUp  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        @keyframes scanLine {
          0%   { top: 8%; }
          50%  { top: 88%; }
          100% { top: 8%; }
        }
        .scan-line { position:absolute;left:10%;right:10%;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);animation:scanLine 2s ease-in-out infinite;box-shadow:0 0 8px var(--accent); }
        .corner { position:absolute;width:22px;height:22px;border-color:var(--accent); }
        .c-tl { top:12%;left:10%;border-top:3px solid;border-left:3px solid; }
        .c-tr { top:12%;right:10%;border-top:3px solid;border-right:3px solid; }
        .c-bl { bottom:12%;left:10%;border-bottom:3px solid;border-left:3px solid; }
        .c-br { bottom:12%;right:10%;border-bottom:3px solid;border-right:3px solid; }
      `}</style>

      {result && <ResultCard result={result} onClose={() => setResult(null)}/>}
      {showBookQR && <BookQRModal book={showBookQR} onClose={() => setShowBookQR(null)}/>}

      {/* ── Tabs ── */}
      <div style={{ display:'flex', gap:'4px', background:'var(--bg-card)', padding:'4px', borderRadius:'10px', border:'1px solid var(--border)', width:'fit-content', marginBottom:'24px' }}>
        {[['scanner','📷 Scanner'],['generate','🔲 Generate QRs'],['history','📋 Session Log']].map(([k,l]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={{ padding:'8px 20px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', fontFamily:"'Manrope',sans-serif", background: activeTab===k ? 'var(--accent)' : 'transparent', color: activeTab===k ? 'white' : 'var(--text-2)', transition:'all 0.15s' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ══════ TAB: SCANNER ══════ */}
      {activeTab === 'scanner' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'24px', alignItems:'start' }}>

          {/* Left: camera + controls */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Mode switcher */}
            <div className="card" style={{ padding:'18px 22px' }}>
              <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px' }}>Scan Mode</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                {[
                  { m:MODE_ISSUE,  icon:'📤', label:'Issue Book',   desc:'Scan to lend to member',   col:'var(--accent)' },
                  { m:MODE_RETURN, icon:'📥', label:'Return Book',  desc:'Scan to mark as returned',  col:'var(--green)' },
                ].map(({ m, icon, label, desc, col }) => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    padding:'16px', borderRadius:'12px', cursor:'pointer', textAlign:'left',
                    border:`2px solid ${mode === m ? col : 'var(--border)'}`,
                    background: mode === m ? `${col}12` : 'transparent',
                    transition:'all 0.2s', fontFamily:"'Manrope',sans-serif",
                  }}>
                    <p style={{ fontSize:'20px', marginBottom:'6px' }}>{icon}</p>
                    <p style={{ fontSize:'14px', fontWeight:'700', color: mode === m ? col : 'var(--text-1)' }}>{label}</p>
                    <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'2px' }}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Member selector — only for ISSUE mode */}
            {mode === MODE_ISSUE && (
              <div className="card" style={{ padding:'18px 22px' }}>
                <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px' }}>
                  Select Member <span style={{ color:'var(--red)' }}>*</span>
                </p>
                {selectedMember ? (
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', background:'var(--accent-muted)', border:'1px solid var(--border-accent)', borderRadius:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'800', color:'white', flexShrink:0 }}>
                      {selectedMember.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-1)' }}>{selectedMember.name}</p>
                      <p style={{ fontSize:'11px', color:'var(--text-3)' }}>{selectedMember.email}</p>
                    </div>
                    <button onClick={() => { setUserId(''); setUserSearch(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', fontSize:'18px' }}>×</button>
                  </div>
                ) : (
                  <div style={{ position:'relative' }}>
                    <input className="input" placeholder="Search member name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ fontSize:'13px' }}/>
                    {userSearch && filteredUsers.length > 0 && (
                      <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', boxShadow:'var(--shadow-hover)', zIndex:50, maxHeight:'180px', overflowY:'auto' }}>
                        {filteredUsers.slice(0,6).map(u => (
                          <div key={u.id} onClick={() => { setUserId(String(u.id)); setUserSearch(''); }} style={{ padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid var(--border)', transition:'background 0.12s' }}
                            onMouseEnter={e=>e.currentTarget.style.background='var(--accent-muted)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)' }}>{u.name}</p>
                            <p style={{ fontSize:'11px', color:'var(--text-3)' }}>{u.email}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Camera viewport */}
            <div className="card" style={{ padding:0, overflow:'hidden', borderRadius:'16px' }}>
              <div style={{ position:'relative', background:'#0a0a14', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <video ref={videoRef} style={{ width:'100%', height:'100%', objectFit:'cover', display: scanning ? 'block' : 'none' }} playsInline muted/>
                <canvas ref={canvasRef} style={{ display:'none' }}/>

                {scanning && (
                  <>
                    <div className="scan-line"/>
                    <div className="corner c-tl"/><div className="corner c-tr"/>
                    <div className="corner c-bl"/><div className="corner c-br"/>
                    <div style={{ position:'absolute', bottom:'14px', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)', borderRadius:'20px', padding:'5px 16px' }}>
                      <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.75)', fontWeight:'500', whiteSpace:'nowrap' }}>
                        {processing ? '⏳ Processing...' : `Scanning for ${mode === MODE_ISSUE ? 'book to issue' : 'book to return'}...`}
                      </p>
                    </div>
                  </>
                )}

                {!scanning && !camError && (
                  <div style={{ textAlign:'center', padding:'40px 24px' }}>
                    <div style={{ fontSize:'48px', marginBottom:'14px' }}>📷</div>
                    <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'14px', marginBottom:'4px' }}>Camera is off</p>
                    <p style={{ color:'rgba(255,255,255,0.30)', fontSize:'12px' }}>Press Start to begin scanning</p>
                  </div>
                )}

                {camError && (
                  <div style={{ textAlign:'center', padding:'32px 24px' }}>
                    <p style={{ fontSize:'32px', marginBottom:'12px' }}>🚫</p>
                    <p style={{ color:'var(--red)', fontSize:'13px', maxWidth:'280px' }}>{camError}</p>
                  </div>
                )}
              </div>

              {/* Camera controls */}
              <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)', display:'flex', gap:'10px', alignItems:'center' }}>
                {!scanning
                  ? <button className="btn-primary" onClick={startCamera} style={{ fontSize:'13px', padding:'10px 24px' }}>▶ Start Camera</button>
                  : <button className="btn-danger"  onClick={stopCamera}  style={{ fontSize:'13px', padding:'10px 24px' }}>⏹ Stop Camera</button>
                }
                <p style={{ fontSize:'12px', color:'var(--text-3)' }}>
                  {scanning ? 'Point camera at a book QR code' : 'Camera stopped'}
                </p>
              </div>
            </div>

            {/* Manual fallback */}
            <div className="card" style={{ padding:'18px 22px' }}>
              <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px' }}>
                Manual Entry (No Camera)
              </p>
              <form onSubmit={handleManualSubmit} style={{ display:'flex', gap:'10px' }}>
                <input className="input" value={manualId} onChange={e => setManualId(e.target.value)} placeholder="Enter Book ID..." style={{ fontSize:'13px', flex:1 }} type="number" min="1"/>
                <button className="btn-primary" type="submit" style={{ fontSize:'13px', padding:'10px 20px', whiteSpace:'nowrap' }}>
                  {mode === MODE_ISSUE ? 'Issue' : 'Return'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: active borrows sidebar */}
          <div className="card" style={{ padding:'0', overflow:'hidden' }}>
            <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ fontSize:'14px', fontWeight:'700', color:'var(--text-1)' }}>Active Borrows</p>
              <span style={{ fontSize:'11px', color:'var(--text-3)', background:'var(--bg-2)', padding:'2px 8px', borderRadius:'10px' }}>
                {borrowRecords.filter(r=>!r.returned).length}
              </span>
            </div>
            <div style={{ maxHeight:'520px', overflowY:'auto' }}>
              {borrowRecords.filter(r=>!r.returned).slice(0,20).map(r => {
                const overdue = r.dueDate && new Date(r.dueDate) < new Date();
                return (
                  <div key={r.id} style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'4px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                      <p style={{ fontSize:'12.5px', fontWeight:'600', color:'var(--text-1)', lineHeight:1.3, flex:1 }}>{r.book?.title || `Book #${r.book?.id}`}</p>
                      {overdue && <span style={{ fontSize:'9px', background:'var(--red-muted)', color:'var(--red)', border:'1px solid var(--red)', borderRadius:'6px', padding:'2px 6px', fontWeight:'700', flexShrink:0 }}>OVERDUE</span>}
                    </div>
                    <p style={{ fontSize:'11px', color:'var(--text-3)' }}>{r.user?.name}</p>
                    <p style={{ fontSize:'10px', color: overdue ? 'var(--red)' : 'var(--text-3)' }}>
                      Due: {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—'}
                    </p>
                    <button onClick={() => performReturn(r.id)} style={{ marginTop:'4px', padding:'5px 12px', fontSize:'11px', fontWeight:'600', cursor:'pointer', borderRadius:'7px', border:'1px solid var(--green)', background:'var(--green-muted)', color:'var(--green)', fontFamily:"'Manrope',sans-serif", transition:'all 0.15s' }}
                      onMouseEnter={e=>{e.currentTarget.style.background='var(--green)';e.currentTarget.style.color='white';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='var(--green-muted)';e.currentTarget.style.color='var(--green)';}}>
                      ↩ Quick Return
                    </button>
                  </div>
                );
              })}
              {borrowRecords.filter(r=>!r.returned).length === 0 && (
                <div style={{ padding:'32px', textAlign:'center' }}>
                  <p style={{ fontSize:'28px', marginBottom:'8px' }}>✅</p>
                  <p style={{ fontSize:'13px', color:'var(--text-3)' }}>No active borrows</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════ TAB: GENERATE QRs ══════ */}
      {activeTab === 'generate' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'4px' }}>
            <input className="input" placeholder="Search books..." value={bookSearch} onChange={e => setBookSearch(e.target.value)} style={{ maxWidth:'360px', fontSize:'13px' }}/>
            <p style={{ fontSize:'12px', color:'var(--text-3)' }}>{filteredBooks.length} books</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'14px' }}>
            {filteredBooks.map(book => (
              <div key={book.id} className="card" style={{ padding:'18px', display:'flex', flexDirection:'column', gap:'10px', cursor:'pointer' }}
                onClick={() => setShowBookQR(book)}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                  <div style={{ width:'42px', height:'56px', borderRadius:'6px', background:`linear-gradient(145deg,var(--accent-muted2),var(--accent-muted))`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'1px solid var(--border-accent)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-1)', marginBottom:'3px', lineHeight:1.3 }}>{book.title}</p>
                    <p style={{ fontSize:'11px', color:'var(--text-3)', marginBottom:'4px' }}>{book.author}</p>
                    <span className={`badge badge-${book.availabilityStatus?.toLowerCase() === 'available' ? 'available' : book.availabilityStatus?.toLowerCase() === 'few_left' ? 'few_left' : 'out_of_stock'}`} style={{ fontSize:'9px' }}>
                      {book.availabilityStatus || 'Available'}
                    </span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', background:'var(--bg-2)', borderRadius:'8px', border:'1px solid var(--border)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <p style={{ fontSize:'11px', color:'var(--text-2)', fontFamily:'monospace' }}>LIBRARIO_BOOK_{book.id}</p>
                </div>
                <p style={{ fontSize:'11px', color:'var(--accent)', fontWeight:'600', textAlign:'center' }}>Click to view & download QR →</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ TAB: SESSION LOG ══════ */}
      {activeTab === 'history' && (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:'14px', fontWeight:'700', color:'var(--text-1)' }}>Session Log</p>
            <button onClick={() => setHistory([])} style={{ fontSize:'12px', color:'var(--text-3)', background:'none', border:'none', cursor:'pointer' }}>Clear</button>
          </div>
          {history.length === 0 ? (
            <div style={{ padding:'48px', textAlign:'center' }}>
              <p style={{ fontSize:'32px', marginBottom:'10px' }}>📋</p>
              <p style={{ fontSize:'14px', color:'var(--text-2)', fontWeight:'500', marginBottom:'4px' }}>No activity yet</p>
              <p style={{ fontSize:'12px', color:'var(--text-3)' }}>Scan a book QR to see it here</p>
            </div>
          ) : (
            <div>
              {history.map((h, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'8px', background: h.action === 'Issued' ? 'var(--accent-muted)' : 'var(--green-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>
                    {h.action === 'Issued' ? '📤' : '📥'}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-1)' }}>
                      {h.action} — {h.bookTitle || `Borrow #${h.borrowId}`}
                    </p>
                    <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'2px' }}>
                      {h.action === 'Issued' ? `Member #${h.memberId}` : h.fine > 0 ? `Fine: ₹${h.fine}` : 'No fine'} · {h.time}
                    </p>
                  </div>
                  <span style={{ fontSize:'10px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px', background: h.action === 'Issued' ? 'var(--accent-muted)' : 'var(--green-muted)', color: h.action === 'Issued' ? 'var(--accent)' : 'var(--green)' }}>
                    {h.action}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
