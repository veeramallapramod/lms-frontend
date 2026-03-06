import { useEffect, useState } from 'react';
import Layout from './Layout';
import API from '../api/axiosInstance';
import useBookStore from '../store/bookStore';
import useUserStore from '../store/userStore';
import useAuthStore from '../store/authStore';

// ✅ Defined OUTSIDE component so React doesn't remount on every render
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position:'relative', maxWidth:'400px', marginBottom:'12px' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ paddingLeft:'34px', fontSize:'13px', width:'100%' }}
        autoComplete="off"
        spellCheck="false"
      />
      {value && (
        <button type="button" onClick={() => onChange('')}
          style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', fontSize:'16px', lineHeight:1, padding:'2px' }}>
          ×
        </button>
      )}
    </div>
  );
}

export default function BorrowManagement() {
  const { user }                 = useAuthStore();
  const { books, fetchBooks }    = useBookStore();
  const { users, fetchAllUsers } = useUserStore();

  const [records,      setRecords]      = useState([]);
  const [requests,     setRequests]     = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [tab,          setTab]          = useState('requests');
  const [issueForm,    setIssueForm]    = useState({ bookId:'', userId:'' });
  const [issueMsg,     setIssueMsg]     = useState({ text:'', type:'' });
  const [returnResult, setReturnResult] = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  const [bookSearch,   setBookSearch]   = useState('');
  const [userSearch,   setUserSearch]   = useState('');
  const [showBookDrop, setShowBookDrop] = useState(false);
  const [showUserDrop, setShowUserDrop] = useState(false);

  // Per-tab search filters
  const [reqSearch, setReqSearch] = useState('');
  const [borSearch, setBorSearch] = useState('');
  const [ovrSearch, setOvrSearch] = useState('');

  useEffect(() => { fetchBooks(); fetchAllUsers(); loadRecords(); loadRequests(); }, []);

  const loadRecords  = async () => { setLoading(true); try { const r = await API.get('/borrow/all'); setRecords(r.data); } catch {} finally { setLoading(false); } };
  const loadRequests = async () => { try { const r = await API.get('/borrow/requests'); setRequests(r.data); } catch {} };

  const handleApproveRequest = async (requestId) => {
    setSubmitting(true);
    try { const res = await API.put(`/borrow/requests/${requestId}/approve`); alert(res.data?.message || 'Approved!'); loadRequests(); loadRecords(); fetchBooks(); }
    catch (err) { alert(err.response?.data || 'Approve failed'); }
    finally { setSubmitting(false); }
  };

  const handleRejectRequest = async (requestId) => {
    setSubmitting(true);
    try { await API.put(`/borrow/requests/${requestId}/reject`); loadRequests(); }
    catch (err) { alert(err.response?.data || 'Reject failed'); }
    finally { setSubmitting(false); }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!issueForm.bookId || !issueForm.userId) { setIssueMsg({ text:'Select both book and member', type:'error' }); return; }
    setSubmitting(true);
    try {
      const res = await API.post('/borrow/issue', { bookId: Number(issueForm.bookId), userId: Number(issueForm.userId) });
      setIssueMsg({ text:`✓ ${res.data.message} Due: ${res.data.dueDate}`, type:'success' });
      setIssueForm({ bookId:'', userId:'' }); setBookSearch(''); setUserSearch('');
      setShowBookDrop(false); setShowUserDrop(false);
      loadRecords(); fetchBooks();
    } catch (err) { setIssueMsg({ text: err.response?.data || 'Issue failed', type:'error' }); }
    finally { setSubmitting(false); setTimeout(() => setIssueMsg({ text:'', type:'' }), 5000); }
  };

  const handleReturn = async (borrowId) => {
    setSubmitting(true);
    try { const res = await API.put(`/borrow/return/${borrowId}`); setReturnResult(res.data); loadRecords(); fetchBooks(); }
    catch (err) { alert(err.response?.data || 'Return failed'); }
    finally { setSubmitting(false); }
  };

  const isOverdue = (r) => !r.returned && r.dueDate && new Date(r.dueDate) < new Date();
  const daysLate  = (d) => Math.max(0, Math.ceil((new Date() - new Date(d)) / (1000*60*60*24)));

  const availableBooks = books.filter(b => b.available && !b.deleted);
  const members        = users.filter(u => u.role === 'MEMBER' && u.status === 'APPROVED');

  const filteredBooks = availableBooks.filter(b =>
    b.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author?.toLowerCase().includes(bookSearch.toLowerCase())
  );
  const filteredUsers = members.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  // Tab-specific filtered data
  const visibleRequests = pendingRequests.filter(r => {
    const q = reqSearch.toLowerCase();
    return !q || r.user?.name?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q) || r.book?.title?.toLowerCase().includes(q);
  });

  const currentRecords = records.filter(r => !r.returned).filter(r => {
    const q = borSearch.toLowerCase();
    return !q || r.user?.name?.toLowerCase().includes(q) || r.book?.title?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q);
  });

  const overdueRecords = records.filter(r => isOverdue(r)).filter(r => {
    const q = ovrSearch.toLowerCase();
    return !q || r.user?.name?.toLowerCase().includes(q) || r.book?.title?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q);
  });

  const allRecords = records;

  const dropdownStyle = {
    position:'absolute', top:'calc(100% + 4px)', left:0, right:0,
    background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px',
    maxHeight:'220px', overflowY:'auto', zIndex:1000,
    boxShadow:'0 12px 36px rgba(0,0,0,0.4)',
  };



  const selectedPill = (text, onClear) => (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', background:'var(--green-muted)', border:'1.5px solid var(--green)', borderRadius:'8px' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span style={{ fontSize:'13px', fontWeight:'600', color:'var(--green)', flex:1 }}>{text}</span>
      <button type="button" onClick={onClear} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--green)', fontSize:'18px', lineHeight:1, padding:'0 2px' }}>×</button>
    </div>
  );

  return (
    <Layout title="Borrow Management" subtitle="Approve requests, issue & return books, track fines">

      {/* ── ISSUE BOOK FORM — zIndex:10 so dropdown goes ABOVE tabs ── */}
      <div className="card" style={{ padding:'22px', marginBottom:'24px', overflow:'visible', position:'relative', zIndex:10 }}>
        <h2 style={{ fontSize:'15px', fontWeight:'600', marginBottom:'16px' }}>Issue a Book Directly</h2>
        {issueMsg.text && <div className={`alert alert-${issueMsg.type}`} style={{ marginBottom:'14px' }}>{issueMsg.text}</div>}
        <form onSubmit={handleIssue}>
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', alignItems:'flex-start' }}>

            {/* Book search */}
            <div style={{ flex:2, minWidth:'220px', position:'relative' }}>
              <label className="label">Search &amp; Select Book</label>
              {issueForm.bookId ? selectedPill(bookSearch, () => { setIssueForm({...issueForm, bookId:''}); setBookSearch(''); setShowBookDrop(false); }) : (
                <>
                  <input className="input" placeholder="🔍 Type book title or author..." value={bookSearch} autoComplete="off"
                    onChange={e => { setBookSearch(e.target.value); setShowBookDrop(true); setIssueForm({...issueForm, bookId:''}); }}
                    onFocus={() => { if (bookSearch) setShowBookDrop(true); }}
                    onBlur={() => setTimeout(() => setShowBookDrop(false), 200)} />
                  {showBookDrop && bookSearch && (
                    <div style={dropdownStyle}>
                      {filteredBooks.length === 0
                        ? <p style={{ padding:'14px', fontSize:'13px', color:'var(--text-3)', textAlign:'center' }}>No available books found</p>
                        : filteredBooks.slice(0,8).map(b => (
                          <div key={b.id} style={{ padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid var(--border)', fontSize:'13px' }}
                            onMouseDown={() => { setIssueForm({...issueForm, bookId: String(b.id)}); setBookSearch(`${b.title} — ${b.author}`); setShowBookDrop(false); }}
                            onMouseEnter={e => e.currentTarget.style.background='var(--bg-2)'}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                            <p style={{ fontWeight:'600', color:'var(--text-1)' }}>{b.title}</p>
                            <p style={{ fontSize:'11px', color:'var(--text-2)', marginTop:'2px' }}>{b.author} · {b.category}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Member search */}
            <div style={{ flex:2, minWidth:'220px', position:'relative' }}>
              <label className="label">Search &amp; Select Member</label>
              {issueForm.userId ? selectedPill(userSearch, () => { setIssueForm({...issueForm, userId:''}); setUserSearch(''); setShowUserDrop(false); }) : (
                <>
                  <input className="input" placeholder="🔍 Type member name or email..." value={userSearch} autoComplete="off"
                    onChange={e => { setUserSearch(e.target.value); setShowUserDrop(true); setIssueForm({...issueForm, userId:''}); }}
                    onFocus={() => { if (userSearch) setShowUserDrop(true); }}
                    onBlur={() => setTimeout(() => setShowUserDrop(false), 200)} />
                  {showUserDrop && userSearch && (
                    <div style={dropdownStyle}>
                      {filteredUsers.length === 0
                        ? <p style={{ padding:'14px', fontSize:'13px', color:'var(--text-3)', textAlign:'center' }}>No members found</p>
                        : filteredUsers.slice(0,8).map(u => (
                          <div key={u.id} style={{ padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid var(--border)', fontSize:'13px' }}
                            onMouseDown={() => { setIssueForm({...issueForm, userId: String(u.id)}); setUserSearch(`${u.name} (${u.email})`); setShowUserDrop(false); }}
                            onMouseEnter={e => e.currentTarget.style.background='var(--bg-2)'}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                            <p style={{ fontWeight:'600', color:'var(--text-1)' }}>{u.name}</p>
                            <p style={{ fontSize:'11px', color:'var(--text-2)', marginTop:'2px' }}>{u.email}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:'2px' }}>
              <button className="btn-primary" type="submit" disabled={submitting || !issueForm.bookId || !issueForm.userId} style={{ padding:'10px 24px', whiteSpace:'nowrap' }}>
                {submitting ? 'Issuing...' : 'Issue Book'}
              </button>
            </div>
          </div>
        </form>
        <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'10px' }}>📅 Due date is 7 days from today. Fine: ₹5/day after due date.</p>
      </div>

      {/* Return modal */}
      {returnResult && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'24px' }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'32px', maxWidth:'380px', width:'100%', textAlign:'center' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background: returnResult.fine>0 ? 'var(--red-muted)' : 'var(--green-muted)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={returnResult.fine>0?'var(--red)':'var(--green)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {returnResult.fine>0
                  ? <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
                  : <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
              </svg>
            </div>
            <h2 style={{ fontSize:'18px', fontWeight:'700', color:'var(--text-1)', marginBottom:'8px' }}>{returnResult.message}</h2>
            {returnResult.fine > 0 ? (
              <div style={{ background:'var(--red-muted)', borderRadius:'10px', padding:'16px', margin:'16px 0' }}>
                <p style={{ fontSize:'13px', color:'var(--text-2)' }}>Days Late: <strong style={{ color:'var(--red)' }}>{returnResult.daysLate}</strong></p>
                <p style={{ fontSize:'28px', fontWeight:'700', color:'var(--red)', fontFamily:'Instrument Serif, serif', marginTop:'4px' }}>₹{returnResult.fine} Fine</p>
              </div>
            ) : (
              <p style={{ color:'var(--green)', marginBottom:'16px' }}>Returned on time — no fine! 🎉</p>
            )}
            <button className="btn-primary" onClick={() => setReturnResult(null)} style={{ width:'100%', justifyContent:'center' }}>Done</button>
          </div>
        </div>
      )}

      {/* ── TABS ── */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'18px', background:'var(--bg-card)', padding:'4px', borderRadius:'10px', border:'1px solid var(--border)', width:'fit-content' }}>
        {[
          ['requests', `📩 Requests${pendingRequests.length>0?' ('+pendingRequests.length+')':''}` ],
          ['current',  'Currently Borrowed'],
          ['overdue',  'Overdue ⚠️'],
          ['all',      'All Records'],
        ].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding:'7px 16px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'500', fontFamily:'Plus Jakarta Sans, sans-serif',
              background: tab===key ? (key==='requests'&&pendingRequests.length>0 ? 'var(--red)' : 'var(--accent)') : 'transparent',
              color: tab===key ? 'white' : 'var(--text-2)', transition:'all 0.15s', whiteSpace:'nowrap' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── REQUESTS TAB ── */}
      {tab === 'requests' && (
        <div className="card">
          <div style={{ padding:'16px 16px 0' }}>
            <SearchBar value={reqSearch} onChange={setReqSearch} placeholder="🔍 Search by member name, email or book..." />
          </div>
          {visibleRequests.length === 0 ? (
            <div style={{ padding:'48px', textAlign:'center', color:'var(--text-3)' }}>
              {reqSearch ? 'No requests match your search' : 'No borrow requests yet'}
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Member</th><th>Book</th><th>Requested</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {visibleRequests.map(req => (
                    <tr key={req.id}>
                      <td>
                        <p style={{ fontWeight:'500', fontSize:'13px' }}>{req.user?.name}</p>
                        <p style={{ fontSize:'11px', color:'var(--text-2)' }}>{req.user?.email}</p>
                      </td>
                      <td>
                        <p style={{ fontWeight:'500', fontSize:'13px' }}>{req.book?.title}</p>
                        <p style={{ fontSize:'11px', color:'var(--text-2)' }}>{req.book?.author}</p>
                      </td>
                      <td style={{ fontSize:'13px', color:'var(--text-2)' }}>{req.requestDate}</td>
                      <td><span className={`badge badge-${req.status?.toLowerCase()}`}>{req.status}</span></td>
                      <td>
                        {req.status === 'PENDING' ? (
                          <div style={{ display:'flex', gap:'6px' }}>
                            <button className="btn-success" style={{ fontSize:'12px', padding:'5px 12px' }} onClick={() => handleApproveRequest(req.id)} disabled={submitting}>✓ Approve</button>
                            <button className="btn-danger"  style={{ fontSize:'12px', padding:'5px 12px' }} onClick={() => handleRejectRequest(req.id)}  disabled={submitting}>✕ Reject</button>
                          </div>
                        ) : <span style={{ fontSize:'12px', color:'var(--text-3)' }}>{req.status}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── CURRENTLY BORROWED TAB ── */}
      {tab === 'current' && (
        <div className="card">
          <div style={{ padding:'16px 16px 0' }}>
            <SearchBar value={borSearch} onChange={setBorSearch} placeholder="🔍 Search by member name, email or book..." />
          </div>
          {loading ? <div style={{ padding:'48px', textAlign:'center', color:'var(--text-2)' }}>Loading...</div>
          : currentRecords.length === 0 ? (
            <div style={{ padding:'48px', textAlign:'center', color:'var(--text-3)' }}>{borSearch ? 'No records match your search' : 'No books currently borrowed'}</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Book</th><th>Member</th><th>Borrowed</th><th>Due Date</th><th>Status</th><th>Fine</th><th>Action</th></tr></thead>
                <tbody>{currentRecords.map(r => <BorrowRow key={r.id} r={r} isOverdue={isOverdue} daysLate={daysLate} handleReturn={handleReturn} submitting={submitting} />)}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── OVERDUE TAB ── */}
      {tab === 'overdue' && (
        <div className="card">
          <div style={{ padding:'16px 16px 0' }}>
            <SearchBar value={ovrSearch} onChange={setOvrSearch} placeholder="🔍 Search overdue by member name, email or book..." />
          </div>
          {overdueRecords.length === 0 ? (
            <div style={{ padding:'48px', textAlign:'center', color:'var(--text-3)' }}>{ovrSearch ? 'No overdue records match your search' : '🎉 No overdue books!'}</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Book</th><th>Member</th><th>Borrowed</th><th>Due Date</th><th>Status</th><th>Fine</th><th>Action</th></tr></thead>
                <tbody>{overdueRecords.map(r => <BorrowRow key={r.id} r={r} isOverdue={isOverdue} daysLate={daysLate} handleReturn={handleReturn} submitting={submitting} />)}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ALL RECORDS TAB ── */}
      {tab === 'all' && (
        <div className="card">
          {loading ? <div style={{ padding:'48px', textAlign:'center', color:'var(--text-2)' }}>Loading...</div>
          : allRecords.length === 0 ? <div style={{ padding:'48px', textAlign:'center', color:'var(--text-3)' }}>No records found</div>
          : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Book</th><th>Member</th><th>Borrowed</th><th>Due Date</th><th>Status</th><th>Fine</th><th>Action</th></tr></thead>
                <tbody>{allRecords.map(r => <BorrowRow key={r.id} r={r} isOverdue={isOverdue} daysLate={daysLate} handleReturn={handleReturn} submitting={submitting} />)}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

function BorrowRow({ r, isOverdue, daysLate, handleReturn, submitting }) {
  const overdue  = isOverdue(r);
  const calcFine = overdue ? daysLate(r.dueDate) * 5 : 0;
  return (
    <tr>
      <td>
        <p style={{ fontWeight:'500', color:'var(--text-1)', fontSize:'13px' }}>{r.book?.title}</p>
        <p style={{ fontSize:'12px', color:'var(--text-2)' }}>{r.book?.author}</p>
      </td>
      <td>
        <p style={{ fontSize:'13px', fontWeight:'500' }}>{r.user?.name}</p>
        <p style={{ fontSize:'12px', color:'var(--text-2)' }}>{r.user?.email}</p>
      </td>
      <td style={{ fontSize:'13px', color:'var(--text-2)' }}>{r.borrowDate}</td>
      <td>
        <span style={{ fontSize:'13px', color: overdue?'var(--red)':'var(--text-1)', fontWeight: overdue?'600':'400' }}>
          {r.dueDate}{overdue && ` (${daysLate(r.dueDate)}d late)`}
        </span>
      </td>
      <td><span className={`badge badge-${r.status?.toLowerCase()}`}>{r.status}</span></td>
      <td>
        {r.fine>0 ? <span className="fine-badge">₹{r.fine}</span>
          : overdue ? <span className="fine-badge">₹{calcFine} accruing</span>
          : <span style={{ color:'var(--text-3)', fontSize:'13px' }}>—</span>}
      </td>
      <td>
        {!r.returned
          ? <button className="btn-success" onClick={() => handleReturn(r.id)} disabled={submitting} style={{ fontSize:'12px', whiteSpace:'nowrap' }}>Return Book</button>
          : <span style={{ color:'var(--text-3)', fontSize:'12px' }}>Returned {r.returnDate}</span>}
      </td>
    </tr>
  );
}
