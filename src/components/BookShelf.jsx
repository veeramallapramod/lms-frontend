import { useEffect, useState } from 'react';
import Layout from './Layout';
import useBookStore from '../store/bookStore';

const CATEGORY_COLORS = {
  'Fiction':     { spine:'#3b82f6', label:'📖' },
  'Non-Fiction': { spine:'#10b981', label:'📝' },
  'Science':     { spine:'#06b6d4', label:'🔬' },
  'Technology':  { spine:'#8b5cf6', label:'💻' },
  'History':     { spine:'#c8a55a', label:'🏛️' },
  'Biography':   { spine:'#f97316', label:'👤' },
  'Philosophy':  { spine:'#6366f1', label:'🧠' },
  'Arts':        { spine:'#ec4899', label:'🎨' },
  'Mathematics': { spine:'#84cc16', label:'📐' },
  'Medicine':    { spine:'#ef4444', label:'⚕️' },
  'Law':         { spine:'#a16207', label:'⚖️' },
  'Business':    { spine:'#0ea5e9', label:'💼' },
  'Other':       { spine:'#94a3b8', label:'📚' },
};
const DEFAULT_COLOR = { spine:'#94a3b8', label:'📚' };

const CATEGORY_ORDER = ['Fiction','Non-Fiction','Science','Technology','History','Biography','Philosophy','Arts','Mathematics','Medicine','Law','Business','Other'];

function BookSpine({ book, index, spineColor, onSelect }) {
  const height = 140 + (index % 6) * 20;
  const width  = 52  + (index % 5) * 12;
  const tilt   = [0, 0, 0, -3, 0, 0, 2, 0, 0, -2][index % 10];
  return (
    <div
      onClick={() => onSelect(book)}
      title={`${book.title} — ${book.author}`}
      style={{ width:`${width}px`, height:`${height}px`, flexShrink:0, borderRadius:'2px 4px 4px 2px', position:'relative', cursor:'pointer', transformOrigin:'bottom center', transform:`rotate(${tilt}deg)`, transition:'transform 0.25s ease, box-shadow 0.25s ease', boxShadow:'2px 0 6px rgba(0,0,0,0.35)',
        background: book.coverImage ? `url(${book.coverImage}) center/cover no-repeat` : `linear-gradient(160deg, ${spineColor}ee, ${spineColor}88)` }}
      onMouseEnter={e => { e.currentTarget.style.transform=`rotate(${tilt}deg) translateY(-28px)`; e.currentTarget.style.boxShadow='4px 10px 24px rgba(0,0,0,0.5)'; e.currentTarget.style.zIndex='10'; }}
      onMouseLeave={e => { e.currentTarget.style.transform=`rotate(${tilt}deg) translateY(0)`;    e.currentTarget.style.boxShadow='2px 0 6px rgba(0,0,0,0.35)';  e.currentTarget.style.zIndex='1'; }}
    >
      {!book.coverImage && <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'5px', background:spineColor, borderRadius:'2px 0 0 2px', opacity:0.9 }}/>}
      <div style={{ position:'absolute', top:'5px', right:'4px', width:'6px', height:'6px', borderRadius:'50%', background: book.available ? '#10b981' : '#ef4444', boxShadow:`0 0 4px ${book.available ? '#10b981' : '#ef4444'}` }}/>
      {!book.coverImage && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'6px 4px 6px 9px' }}>
          <p style={{ fontSize:'9px', color:'rgba(255,255,255,0.85)', writingMode:'vertical-rl', textOrientation:'mixed', lineHeight:1.2, fontWeight:'700', overflow:'hidden', maxHeight:'100%', fontFamily:"'DM Sans',sans-serif" }}>
            {book.title}
          </p>
        </div>
      )}
    </div>
  );
}

function ShelfUnit({ category, books, onSelect, shelfId }) {
  const config = CATEGORY_COLORS[category] || DEFAULT_COLOR;
  if (books.length === 0) return null;

  const rows = [];
  for (let i = 0; i < books.length; i += 14) rows.push(books.slice(i, i + 14));

  return (
    <div style={{ marginBottom:'52px' }}>
      {/* Header with shelf number badge */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
        <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:`${config.spine}22`, border:`1px solid ${config.spine}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>
          {config.label}
        </div>
        <div>
          <h3 style={{ fontSize:'16px', fontWeight:'700', color:'var(--text-1)', fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{category}</h3>
          <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'2px' }}>{books.length} book{books.length !== 1 ? 's' : ''}</p>
        </div>

        {/* ── SHELF NUMBER BADGE ── */}
        <div style={{ display:'flex', alignItems:'center', gap:'7px', background:`${config.spine}18`, border:`1.5px solid ${config.spine}50`, borderRadius:'10px', padding:'7px 14px', marginLeft:'4px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={config.spine} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize:'13px', fontWeight:'800', color:config.spine, letterSpacing:'0.06em' }}>Shelf {shelfId}</span>
        </div>

        <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, ${config.spine}40, transparent)` }}/>
      </div>

      {rows.map((row, ri) => (
        <div key={ri} style={{ marginBottom: ri < rows.length - 1 ? '28px' : '0' }}>
          <div style={{ position:'relative', background:`linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 30%)`, borderRadius:'6px 6px 0 0', padding:'32px 24px 0', minHeight:'220px', display:'flex', alignItems:'flex-end', gap:'3px', flexWrap:'nowrap', overflowX:'auto', overflowY:'visible', scrollbarWidth:'none' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'6px 6px 0 0', background:`radial-gradient(ellipse at 50% 0%, ${config.spine}08 0%, transparent 70%)`, pointerEvents:'none' }}/>
            {row.map((book, i) => <BookSpine key={book.id} book={book} index={i} spineColor={config.spine} onSelect={onSelect} />)}
            {row.length < 5 && Array.from({ length:3 }).map((_,i) => (
              <div key={`e-${i}`} style={{ width:'55px', height:`${140+i*18}px`, background:'rgba(255,255,255,0.02)', border:'1px dashed rgba(255,255,255,0.05)', borderRadius:'2px', flexShrink:0 }}/>
            ))}
          </div>
          {/* Wooden shelf */}
          <div style={{ height:'18px', background:'linear-gradient(180deg, #6b3e1a 0%, #4a2810 50%, #3d1f08 100%)', borderRadius:'0 0 4px 4px', boxShadow:'0 6px 18px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)', position:'relative' }}>
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)', borderRadius:'0 0 4px 4px' }}/>
          </div>
          <div style={{ height:'8px', background:'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 100%)', borderRadius:'0 0 4px 4px' }}/>
        </div>
      ))}
    </div>
  );
}

export default function BookShelf() {
  const { books, fetchBooks } = useBookStore();
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');

  useEffect(() => { fetchBooks(); }, []);

  const filtered = search
    ? books.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase()))
    : books;

  const grouped = {};
  filtered.forEach(book => {
    const cat = book.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(book);
  });

  const sortedCategories = CATEGORY_ORDER.filter(c => grouped[c]?.length > 0);
  Object.keys(grouped).forEach(c => { if (!sortedCategories.includes(c)) sortedCategories.push(c); });

  // Generate shelf IDs: A1, A2, A3, B1, B2, B3, ...
  const getShelfId = (index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 3));
    const num  = (index % 3) + 1;
    return `${row}${num}`;
  };

  const totalBooks      = books.length;
  const totalCategories = Object.keys(grouped).length;
  const availableBooks  = books.filter(b => b.available).length;

  return (
    <Layout title="Book Shelf" subtitle="Browse books organized by category — hover to lift, click for details">

      {/* Stats */}
      <div style={{ display:'flex', gap:'14px', marginBottom:'28px', flexWrap:'wrap' }}>
        {[
          { label:'Total Books',  value:totalBooks,            color:'var(--accent)' },
          { label:'Categories',   value:totalCategories,       color:'var(--purple)' },
          { label:'Available',    value:availableBooks,        color:'var(--green)' },
          { label:'Borrowed',     value:totalBooks - availableBooks, color:'var(--red)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'12px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'8px', height:'32px', borderRadius:'4px', background:s.color }}/>
            <div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', color:'var(--text-1)', lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'1px' }}>{s.label}</p>
            </div>
          </div>
        ))}

        {/* Search */}
        <div style={{ flex:1, position:'relative', minWidth:'200px', maxWidth:'300px', marginLeft:'auto' }}>
          <svg style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="input" placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:'36px' }}/>
        </div>
      </div>

      {/* Shelf index legend */}
      {sortedCategories.length > 0 && (
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'14px 18px', marginBottom:'28px' }}>
          <p style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>Shelf Index</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
            {sortedCategories.map((cat, i) => {
              const config = CATEGORY_COLORS[cat] || DEFAULT_COLOR;
              return (
                <div key={cat} style={{ display:'flex', alignItems:'center', gap:'6px', background:`${config.spine}15`, border:`1px solid ${config.spine}35`, borderRadius:'20px', padding:'4px 10px' }}>
                  <span style={{ fontSize:'11px' }}>{config.label}</span>
                  <span style={{ fontSize:'11px', color:'var(--text-2)', fontWeight:'500' }}>{cat}</span>
                  <span style={{ fontSize:'11px', fontWeight:'800', color:config.spine }}>→ {getShelfId(i)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display:'flex', gap:'20px', marginBottom:'24px', flexWrap:'wrap' }}>
        <span style={{ fontSize:'12px', color:'var(--text-3)', fontWeight:'600' }}>Dot:</span>
        {[['#10b981','Available'],['#ef4444','Borrowed']].map(([c,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:c, boxShadow:`0 0 4px ${c}` }}/>
            <span style={{ fontSize:'12px', color:'var(--text-2)' }}>{l}</span>
          </div>
        ))}
        <span style={{ fontSize:'12px', color:'var(--text-3)' }}>· Hover to lift · Click for details</span>
      </div>

      {/* Shelves */}
      {books.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px', color:'var(--text-3)' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>📚</div>
          <p style={{ fontSize:'16px' }}>No books in the library yet</p>
        </div>
      ) : sortedCategories.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', color:'var(--text-3)' }}>No books match your search</div>
      ) : (
        sortedCategories.map((cat, i) => (
          <ShelfUnit key={cat} category={cat} books={grouped[cat]} onSelect={setSelected} shelfId={getShelfId(i)} />
        ))
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:'24px' }}
          onClick={() => setSelected(null)}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'28px', maxWidth:'440px', width:'100%', display:'flex', gap:'20px', position:'relative' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width:'90px', height:'124px', borderRadius:'4px', flexShrink:0, overflow:'hidden', background:`linear-gradient(135deg, ${(CATEGORY_COLORS[selected.category]||DEFAULT_COLOR).spine}dd, ${(CATEGORY_COLORS[selected.category]||DEFAULT_COLOR).spine}66)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'4px 4px 16px rgba(0,0,0,0.4)' }}>
              {selected.coverImage
                ? <img src={selected.coverImage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : <span style={{ fontSize:'32px' }}>{(CATEGORY_COLORS[selected.category]||DEFAULT_COLOR).label}</span>}
            </div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:'18px', fontWeight:'700', color:'var(--text-1)', marginBottom:'3px', fontFamily:"'Playfair Display',serif", lineHeight:1.2 }}>{selected.title}</h2>
              <p style={{ fontSize:'13px', color:'var(--text-2)', marginBottom:'12px' }}>by {selected.author}</p>

              {/* Shelf location */}
              {selected.shelfNumber && (
                <div style={{ display:'flex', alignItems:'center', gap:'7px', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'8px', padding:'8px 12px', marginBottom:'12px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a55a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{ fontSize:'12px', fontWeight:'700', color:'#c8a55a' }}>Shelf {selected.shelfNumber}</span>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'12px' }}>
                {[['Category', selected.category||'—'], ['Edition', selected.edition||'—'], ['Year', selected.publishedYear||'—'], ['Copies', selected.quantity||'—'], ['Available', selected.available ? 'Yes ✓' : 'No — Borrowed']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', gap:'10px' }}>
                    <span style={{ fontSize:'11px', color:'var(--text-3)', width:'72px', flexShrink:0 }}>{k}</span>
                    <span style={{ fontSize:'12px', color:'var(--text-1)', fontWeight:'500' }}>{v}</span>
                  </div>
                ))}
              </div>

              {selected.description && (
                <p style={{ fontSize:'12px', color:'var(--text-2)', lineHeight:1.6, borderTop:'1px solid var(--border)', paddingTop:'10px' }}>
                  {selected.description.slice(0,120)}{selected.description.length > 120 ? '...' : ''}
                </p>
              )}

              <div style={{ marginTop:'10px' }}>
                <span className={`badge ${selected.available ? 'badge-available' : 'badge-out_of_stock'}`}>
                  {selected.available ? '🟢 Available' : '🔴 Out of Stock'}
                </span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ position:'absolute', top:'14px', right:'14px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'6px', width:'26px', height:'26px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-2)', fontSize:'14px' }}>✕</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
