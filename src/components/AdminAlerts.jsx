import { useEffect, useState } from 'react';
import Layout from './Layout';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';

export default function AdminAlerts() {
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState([]);
  const [books,         setBooks]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [tab,           setTab]           = useState('low_stock'); // low_stock | damaged
  const [reportForm,    setReportForm]    = useState({ bookId: '', notes: '' });
  const [reportMsg,     setReportMsg]     = useState({ text: '', type: '' });
  const [submitting,    setSubmitting]    = useState(false);
  const [bookSearch,    setBookSearch]    = useState('');
  const [showDrop,      setShowDrop]      = useState(false);

  useEffect(() => {
    fetchAlerts();
    fetchBooks();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/notifications/${user.id}`);
      setNotifications(res.data.filter(n =>
        n.type === 'LOW_STOCK' || n.type === 'DAMAGED_BOOK'
      ));
    } catch {} finally { setLoading(false); }
  };

  const fetchBooks = async () => {
    try {
      const res = await API.get('/books');
      setBooks(res.data);
    } catch {}
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await API.put(`/notifications/${user.id}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const handleReportDamaged = async () => {
    if (!reportForm.bookId) {
      setReportMsg({ text: 'Please select a book', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      await API.post(`/notifications/damaged/${reportForm.bookId}`, {
        reportedByUserId: user.id,
        notes: reportForm.notes,
      });
      setReportMsg({ text: 'Damaged book reported. Admin has been notified.', type: 'success' });
      setReportForm({ bookId: '', notes: '' });
      setBookSearch('');
      fetchAlerts();
    } catch (err) {
      setReportMsg({ text: err.response?.data || 'Report failed', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const lowStockAlerts  = notifications.filter(n => n.type === 'LOW_STOCK');
  const damagedAlerts   = notifications.filter(n => n.type === 'DAMAGED_BOOK');
  const unreadCount     = notifications.filter(n => !n.read).length;

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author?.toLowerCase().includes(bookSearch.toLowerCase())
  ).slice(0, 6);

  const selectedBook = books.find(b => b.id === Number(reportForm.bookId));

  function timeAgo(dateStr) {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const AlertCard = ({ n }) => (
    <div onClick={() => { if (!n.read) markAsRead(n.id); }}
      style={{
        display: 'flex', gap: '14px', padding: '16px 18px',
        borderRadius: '12px', marginBottom: '10px', cursor: n.read ? 'default' : 'pointer',
        background: n.read ? 'var(--bg-card)' : n.type === 'LOW_STOCK'
          ? 'var(--orange-muted)' : 'var(--purple-muted)',
        border: `1px solid ${n.read ? 'var(--border)' : n.type === 'LOW_STOCK'
          ? 'rgba(251,146,60,0.3)' : 'rgba(192,132,252,0.3)'}`,
        transition: 'all 0.2s',
      }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
        background: n.type === 'LOW_STOCK' ? 'var(--orange-muted)' : 'var(--purple-muted)',
        border: `1px solid ${n.type === 'LOW_STOCK' ? 'var(--orange)' : 'var(--purple)'}30`,
      }}>
        {n.type === 'LOW_STOCK' ? '📦' : '🔧'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>
              {n.title}
            </span>
            {!n.read && (
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}/>
            )}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', flexShrink: 0, marginLeft: '8px' }}>
            {timeAgo(n.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', margin: 0 }}>
          {n.message}
        </p>
        {n.type === 'LOW_STOCK' && n.actionUrl && (
          <a href={n.actionUrl}
            onClick={e => e.stopPropagation()}
            style={{ fontSize: '12px', color: 'var(--orange)', fontWeight: '600', marginTop: '6px', display: 'inline-block' }}>
            Restock Book →
          </a>
        )}
      </div>
    </div>
  );

  return (
    <Layout
      title="Admin Alerts"
      subtitle="Low stock warnings and damaged book reports"
      actions={
        unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllAsRead} style={{ fontSize: '12px' }}>
            ✓ Mark all as read
          </button>
        )
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

        {/* ── LEFT: Alert feed ── */}
        <div>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Low Stock Alerts',   count: lowStockAlerts.length,  unread: lowStockAlerts.filter(n=>!n.read).length,  color: 'var(--orange)', bg: 'var(--orange-muted)', icon: '📦', key: 'low_stock' },
              { label: 'Damaged Book Reports', count: damagedAlerts.length, unread: damagedAlerts.filter(n=>!n.read).length,   color: 'var(--purple)', bg: 'var(--purple-muted)', icon: '🔧', key: 'damaged'   },
            ].map(s => (
              <div key={s.key} onClick={() => setTab(s.key)}
                style={{
                  padding: '16px 18px', borderRadius: '12px', cursor: 'pointer',
                  background: tab === s.key ? s.bg : 'var(--bg-card)',
                  border: `1px solid ${tab === s.key ? s.color + '40' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '22px' }}>{s.icon}</span>
                  {s.unread > 0 && (
                    <span style={{ background: 'var(--red)', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px' }}>
                      {s.unread} new
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '22px', fontWeight: '800', color: s.color, margin: '8px 0 2px', fontFamily:"'Bodoni Moda',serif" }}>
                  {s.count}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: '600' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[
              { key: 'low_stock', label: `📦 Low Stock (${lowStockAlerts.length})` },
              { key: 'damaged',   label: `🔧 Damaged (${damagedAlerts.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{
                  padding: '7px 16px', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', border: '1px solid',
                  fontFamily:"'Manrope',sans-serif",
                  background:  tab === t.key ? 'var(--accent)' : 'var(--bg-card)',
                  color:       tab === t.key ? 'white'         : 'var(--text-2)',
                  borderColor: tab === t.key ? 'var(--accent)' : 'var(--border)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Alert list */}
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
              Loading alerts...
            </div>
          ) : (tab === 'low_stock' ? lowStockAlerts : damagedAlerts).length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                {tab === 'low_stock' ? '📦' : '🔧'}
              </div>
              <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>
                {tab === 'low_stock' ? 'No low stock alerts' : 'No damaged book reports'}
              </p>
            </div>
          ) : (
            (tab === 'low_stock' ? lowStockAlerts : damagedAlerts).map(n => (
              <AlertCard key={n.id} n={n} />
            ))
          )}
        </div>

        {/* ── RIGHT: Report Damaged Book form ── */}
        <div className="card" style={{ padding: '22px', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>
            🔧 Report Damaged Book
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '18px' }}>
            Report a damaged book to notify all admins.
          </p>

          {reportMsg.text && (
            <div className={`alert alert-${reportMsg.type}`} style={{ marginBottom: '14px', fontSize: '12px' }}>
              {reportMsg.text}
            </div>
          )}

          {/* Book search */}
          <div style={{ marginBottom: '14px' }}>
            <label className="label">Select Book</label>
            <div style={{ position: 'relative' }}>
              <input className="input"
                placeholder="Search book title or author..."
                value={selectedBook ? selectedBook.title : bookSearch}
                onChange={e => {
                  setBookSearch(e.target.value);
                  setReportForm(p => ({ ...p, bookId: '' }));
                  setShowDrop(true);
                }}
                onFocus={() => setShowDrop(true)}
                style={{ fontSize: '13px' }}
              />
              {showDrop && bookSearch && !reportForm.bookId && filteredBooks.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  maxHeight: '200px', overflowY: 'auto', marginTop: '4px',
                }}>
                  {filteredBooks.map(b => (
                    <div key={b.id}
                      onClick={() => {
                        setReportForm(p => ({ ...p, bookId: b.id }));
                        setBookSearch('');
                        setShowDrop(false);
                      }}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', fontSize: '13px',
                        color: 'var(--text-1)', borderBottom: '1px solid var(--border)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <p style={{ fontWeight: '600', margin: 0 }}>{b.title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: 0 }}>{b.author}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedBook && (
              <div style={{
                marginTop: '8px', padding: '10px 12px', borderRadius: '8px',
                background: 'var(--purple-muted)', border: '1px solid rgba(192,132,252,0.25)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-1)', margin: 0 }}>{selectedBook.title}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: 0 }}>{selectedBook.author}</p>
                </div>
                <button onClick={() => { setReportForm(p => ({ ...p, bookId: '' })); setBookSearch(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '16px' }}>
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Notes (optional)</label>
            <textarea className="input"
              rows={3}
              placeholder="Describe the damage e.g. torn cover, missing pages..."
              value={reportForm.notes}
              onChange={e => setReportForm(p => ({ ...p, notes: e.target.value }))}
              style={{ resize: 'vertical', fontSize: '13px' }}
            />
          </div>

          <button className="btn-primary" onClick={handleReportDamaged}
            disabled={submitting || !reportForm.bookId}
            style={{ width: '100%', justifyContent: 'center' }}>
            {submitting ? 'Submitting...' : '🔧 Submit Damage Report'}
          </button>

          {/* Low stock checker */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-2)', marginBottom: '10px' }}>
              📦 Books Running Low
            </p>
            {books
              .filter(b => !b.deleted && (b.quantity - b.borrowedCount) <= 2)
              .slice(0, 5)
              .map(b => {
                const remaining = b.quantity - b.borrowedCount;
                return (
                  <div key={b.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <div style={{ minWidth: 0, flex: 1, marginRight: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-1)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.title}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: 0 }}>{b.author}</p>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px',
                      background: remaining === 0 ? 'var(--red-muted)' : 'var(--orange-muted)',
                      color: remaining === 0 ? 'var(--red)' : 'var(--orange)',
                      flexShrink: 0,
                    }}>
                      {remaining === 0 ? 'Out' : `${remaining} left`}
                    </span>
                  </div>
                );
              })}
            {books.filter(b => !b.deleted && (b.quantity - b.borrowedCount) <= 2).length === 0 && (
              <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '12px 0' }}>
                All books are well stocked ✅
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}