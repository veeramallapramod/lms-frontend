import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import useBookStore from '../store/bookStore';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';

const AVAIL = {
  AVAILABLE:    { label: '🟢 Available',    cls: 'badge-available' },
  FEW_LEFT:     { label: '🟡 Few Left',     cls: 'badge-few_left' },
  OUT_OF_STOCK: { label: '🔴 Out of Stock', cls: 'badge-out_of_stock' },
};

export default function Books() {
  const { books, loading, fetchBooks, deleteBook,
          searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useBookStore();
  const { user, updateUser } = useAuthStore();
  const role = user?.role;

  const [deletingId,    setDeletingId]    = useState(null);
  const [selectedBook,  setSelectedBook]  = useState(null);
  const [authorFilter,  setAuthorFilter]  = useState('');
  const [sortOrder,     setSortOrder]     = useState('newest');
  const [reservingId,   setReservingId]   = useState(null);
  const [requestingId,  setRequestingId]  = useState(null);
  const [actionMsg,     setActionMsg]     = useState({ text:'', type:'' });
  const [resolvedUserId, setResolvedUserId] = useState(user?.id || null);

  useEffect(() => { fetchBooks(); }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.id && user?.email) {
        try {
          const res = await API.get('/auth/users');
          const found = res.data.find(u => u.email === user.email);
          if (found?.id) { setResolvedUserId(found.id); updateUser({ id: found.id }); }
        } catch {}
      } else {
        setResolvedUserId(user?.id);
      }
    };
    fetchUserId();
  }, [user?.id, user?.email]);

  const categories = [...new Set(books.map(b => b.category).filter(Boolean))];

  const filtered = books
    .filter(b => {
      const q = searchQuery.toLowerCase();
      return (!q || b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q))
        && (!selectedCategory || b.category === selectedCategory)
        && (!authorFilter || b.author?.toLowerCase().includes(authorFilter.toLowerCase()));
    })
    .sort((a, b) => sortOrder === 'title' ? a.title?.localeCompare(b.title) : b.id - a.id);

  const getAvail = (book) => book.availabilityStatus || (book.available ? 'AVAILABLE' : 'OUT_OF_STOCK');

  const showMsg = (text, type='success') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg({ text:'', type:'' }), 4000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    setDeletingId(id);
    try { await deleteBook(id); } catch { alert('Failed'); } finally { setDeletingId(null); }
  };

  const handleReserve = async (book) => {
    if (!resolvedUserId) { showMsg('User session error. Please logout and login again.', 'error'); return; }
    setReservingId(book.id);
    try {
      const res = await API.post('/reservations/reserve', { bookId: book.id, userId: resolvedUserId });
      showMsg(res.data);
    } catch (err) { showMsg(err.response?.data || 'Reservation failed', 'error'); }
    finally { setReservingId(null); }
  };

  const handleRequest = async (book) => {
    if (!resolvedUserId) { showMsg('User session error. Please logout and login again.', 'error'); return; }
    setRequestingId(book.id);
    try {
      const res = await API.post('/borrow/request', { bookId: book.id, userId: resolvedUserId });
      showMsg(res.data?.message || 'Borrow request sent!');
      setSelectedBook(null);
    } catch (err) { showMsg(err.response?.data || 'Request failed', 'error'); }
    finally { setRequestingId(null); }
  };

  return (
    <Layout
      title="Manage Books"
      subtitle={`${filtered.length} of ${books.length} books`}
      actions={
        (role === 'ADMIN' || role === 'LIBRARIAN') &&
        <Link to="/add-book"><button className="btn-primary">+ Add Book</button></Link>
      }
    >
      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap' }}>
        <div style={{ flex:2, minWidth:'180px', position:'relative' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="input" placeholder="Search title or author..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft:'34px' }}/>
        </div>
        <input className="input" placeholder="Filter by author..." value={authorFilter} onChange={e => setAuthorFilter(e.target.value)} style={{ flex:1, minWidth:'140px' }}/>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
          style={{ background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px 14px', color: selectedCategory ? 'var(--text-1)' : 'var(--text-3)', fontFamily:"'DM Sans',sans-serif", fontSize:'14px', outline:'none', minWidth:'150px' }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
          style={{ background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px 14px', color:'var(--text-1)', fontFamily:"'DM Sans',sans-serif", fontSize:'14px', outline:'none' }}>
          <option value="newest">Latest Added</option>
          <option value="title">Title A–Z</option>
        </select>
        {(searchQuery || selectedCategory || authorFilter) && (
          <button className="btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory(''); setAuthorFilter(''); }}>Clear</button>
        )}
      </div>

      {actionMsg.text && <div className={`alert alert-${actionMsg.type}`}>{actionMsg.text}</div>}

      {/* Grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'18px' }}>
          {[...Array(6)].map((_,i) => <div key={i} className="card shimmer" style={{ height:'340px' }}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px', color:'var(--text-3)' }}>No books found</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'18px' }}>
          {filtered.map(book => {
            const avail = getAvail(book);
            const cfg   = AVAIL[avail] || AVAIL.AVAILABLE;
            return (
              <div key={book.id} className="card book-card"
                style={{ padding:'0', cursor:'pointer', overflow:'hidden', display:'flex', flexDirection:'column', transition:'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => setSelectedBook(book)}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=''; }}
              >
                <div style={{ width:'100%', height:'220px', position:'relative', flexShrink:0, overflow:'hidden', background:'var(--bg-2)' }}>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                  ) : (
                    <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, var(--accent-muted), var(--purple-muted))`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                      <p style={{ fontSize:'11px', color:'var(--text-3)', textAlign:'center', padding:'0 12px' }}>{book.title}</p>
                    </div>
                  )}
                  <div style={{ position:'absolute', top:'8px', right:'8px' }}>
                    <span className={`badge ${cfg.cls}`} style={{ fontSize:'10px' }}>{cfg.label}</span>
                  </div>
                  {book.category && (
                    <div style={{ position:'absolute', bottom:'8px', left:'8px' }}>
                      <span style={{ fontSize:'10px', background:'rgba(0,0,0,0.70)', color:'white', padding:'2px 8px', borderRadius:'20px' }}>{book.category}</span>
                    </div>
                  )}
                  {/* Shelf badge on card */}
                  {book.shelfNumber && (
                    <div style={{ position:'absolute', top:'8px', left:'8px' }}>
                      <span style={{ fontSize:'10px', background:'rgba(180,120,0,0.90)', color:'white', padding:'2px 7px', borderRadius:'20px', fontWeight:'700' }}>
                        📍 {book.shelfNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ padding:'14px 14px 10px', flex:1, display:'flex', flexDirection:'column' }}>
                  <h3 style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-1)', marginBottom:'3px', lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{book.title}</h3>
                  <p style={{ fontSize:'12px', color:'var(--text-2)', marginBottom:'auto' }}>by {book.author}</p>

                  <div style={{ display:'flex', gap:'6px', marginTop:'10px', paddingTop:'10px', borderTop:'1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
                    {(role==='ADMIN'||role==='LIBRARIAN') && (
                      <Link to={`/edit-book/${book.id}`} style={{ flex:1 }}>
                        <button className="btn-secondary" style={{ width:'100%', fontSize:'11px', padding:'6px', justifyContent:'center' }}>Edit</button>
                      </Link>
                    )}
                    {role==='ADMIN' && (
                      <button className="btn-danger" style={{ flex:1, fontSize:'11px', padding:'6px' }} onClick={() => handleDelete(book.id)} disabled={deletingId===book.id}>
                        {deletingId===book.id ? '...' : 'Delete'}
                      </button>
                    )}
                    {role==='MEMBER' && avail!=='OUT_OF_STOCK' && (
                      <button className="btn-primary" style={{ flex:1, fontSize:'11px', padding:'6px', justifyContent:'center' }} onClick={() => setSelectedBook(book)}>
                        View & Request
                      </button>
                    )}
                    {role==='MEMBER' && avail==='OUT_OF_STOCK' && (
                      <button className="btn-reserve" style={{ flex:1, fontSize:'11px', padding:'6px' }} onClick={() => handleReserve(book)} disabled={reservingId===book.id}>
                        {reservingId===book.id ? '...' : '🔔 Reserve'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'24px' }}
          onClick={() => setSelectedBook(null)}>
          <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'16px', maxWidth:'520px', width:'100%', maxHeight:'90vh', overflowY:'auto', position:'relative', boxShadow:'0 20px 60px rgba(0,0,0,0.40)' }}
            onClick={e => e.stopPropagation()}>

            <button onClick={() => setSelectedBook(null)} style={{ position:'absolute', top:'14px', right:'14px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'8px', width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-2)', fontSize:'14px', zIndex:1 }}>✕</button>

            <div style={{ width:'100%', height:'260px', borderRadius:'20px 20px 0 0', overflow:'hidden', flexShrink:0 }}>
              {selectedBook.coverImage ? (
                <img src={selectedBook.coverImage} alt={selectedBook.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              ) : (
                <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg, var(--accent-muted), var(--purple-muted))', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
              )}
            </div>

            <div style={{ padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px' }}>
                <h2 style={{ fontSize:'22px', fontWeight:'700', color:'var(--text-1)', fontFamily:"'Playfair Display',serif", lineHeight:1.25, flex:1, paddingRight:'12px' }}>{selectedBook.title}</h2>
                <span className={`badge ${AVAIL[getAvail(selectedBook)]?.cls}`}>{AVAIL[getAvail(selectedBook)]?.label}</span>
              </div>
              <p style={{ fontSize:'14px', color:'var(--text-2)', marginBottom:'18px' }}>by <strong>{selectedBook.author}</strong></p>

              {/* Shelf location */}
              <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'#fef3c7', border:'1px solid #fde68a', borderRadius:'10px', padding:'12px 16px', marginBottom:'16px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5448b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <p style={{ fontSize:'11px', color:'#5448b8', fontWeight:'700', letterSpacing:'0.05em', textTransform:'uppercase' }}>Shelf Location</p>
                  <p style={{ fontSize:'16px', fontWeight:'800', color:'#92400e' }}>{selectedBook.shelfNumber ? `Shelf ${selectedBook.shelfNumber}` : 'Not assigned'}</p>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'16px' }}>
                {[
                  ['Category',     selectedBook.category],
                  ['ISBN',         selectedBook.isbn],
                  ['Edition',      selectedBook.edition],
                  ['Published',    selectedBook.publishedYear],
                  ['Total Copies', selectedBook.quantity],
                  ['Available',    selectedBook.available ? 'Yes' : 'No'],
                  ['Shelf No.',    selectedBook.shelfNumber || 'Not assigned'],
                ].map(([k,v]) => v ? (
                  <div key={k} style={{ background:'var(--bg)', borderRadius:'8px', padding:'10px 12px', border:'1px solid var(--border)' }}>
                    <p style={{ fontSize:'10px', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'2px' }}>{k}</p>
                    <p style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-1)' }}>{v}</p>
                  </div>
                ) : null)}
              </div>

              {selectedBook.description && (
                <p style={{ fontSize:'13px', color:'var(--text-2)', lineHeight:1.7, marginBottom:'18px', padding:'14px', background:'var(--bg)', borderRadius:'10px', border:'1px solid var(--border)' }}>{selectedBook.description}</p>
              )}

              {role === 'MEMBER' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {getAvail(selectedBook) !== 'OUT_OF_STOCK' ? (
                    <>
                      <button className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'14px' }}
                        onClick={() => handleRequest(selectedBook)} disabled={requestingId === selectedBook.id}>
                        {requestingId === selectedBook.id ? 'Sending Request...' : '📩 Request to Borrow'}
                      </button>
                      <p style={{ fontSize:'11px', color:'var(--text-3)', textAlign:'center' }}>Your request will be sent to the librarian for approval</p>
                    </>
                  ) : (
                    <>
                      <button className="btn-reserve" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'14px' }}
                        onClick={() => { handleReserve(selectedBook); setSelectedBook(null); }} disabled={reservingId === selectedBook.id}>
                        {reservingId === selectedBook.id ? 'Reserving...' : '🔔 Reserve — Join Waitlist'}
                      </button>
                      <p style={{ fontSize:'11px', color:'var(--text-3)', textAlign:'center' }}>All copies are borrowed. We'll email you when available.</p>
                    </>
                  )}
                </div>
              )}

              {(role==='ADMIN'||role==='LIBRARIAN') && (
                <Link to={`/edit-book/${selectedBook.id}`}>
                  <button className="btn-secondary" style={{ width:'100%', justifyContent:'center', marginTop:'8px' }}>Edit Book</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
