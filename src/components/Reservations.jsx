import { useEffect, useState } from 'react';
import Layout from './Layout';
import API from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

export default function Reservations() {
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = user?.role;

  useEffect(() => { loadReservations(); }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const url = (role === 'ADMIN' || role === 'LIBRARIAN') ? '/reservations/all' : `/reservations/user/${user?.id}`;
      const res = await API.get(url);
      setReservations(res.data);
    } catch { } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await API.put(`/reservations/cancel/${id}?userId=${user?.id}`);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
    } catch (err) { alert(err.response?.data || 'Failed'); }
  };

  const statusColors = {
    WAITING: 'badge-waiting', NOTIFIED: 'badge-notified',
    FULFILLED: 'badge-fulfilled', CANCELLED: 'badge-cancelled', EXPIRED: 'badge-rejected'
  };

  return (
    <Layout title="Reservations" subtitle={role === 'MEMBER' ? 'Your book reservations' : 'All member reservations'}>
      {loading ? (
        <div style={{ padding:'48px', textAlign:'center', color:'var(--text-2)' }}>Loading...</div>
      ) : reservations.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 20px' }}>
          <div style={{ width:'64px', height:'64px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <p style={{ color:'var(--text-2)', fontSize:'15px', marginBottom:'6px' }}>No reservations yet</p>
          <p style={{ color:'var(--text-3)', fontSize:'13px' }}>Reserve a book when it's out of stock to get notified when available</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  {(role === 'ADMIN' || role === 'LIBRARIAN') && <th>Member</th>}
                  <th>Reserved On</th>
                  <th>Expires</th>
                  <th>Status</th>
                  {role === 'MEMBER' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        {r.book?.coverImage ? (
                          <img src={r.book.coverImage} alt="" style={{ width:'32px', height:'42px', objectFit:'cover', borderRadius:'3px', flexShrink:0 }} />
                        ) : (
                          <div style={{ width:'32px', height:'42px', background:'var(--accent-muted)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                          </div>
                        )}
                        <div>
                          <p style={{ fontWeight:'500', fontSize:'13px', color:'var(--text-1)' }}>{r.book?.title}</p>
                          <p style={{ fontSize:'12px', color:'var(--text-2)' }}>{r.book?.author}</p>
                        </div>
                      </div>
                    </td>
                    {(role === 'ADMIN' || role === 'LIBRARIAN') && (
                      <td>
                        <p style={{ fontSize:'13px', fontWeight:'500', color:'var(--text-1)' }}>{r.user?.name}</p>
                        <p style={{ fontSize:'12px', color:'var(--text-2)' }}>{r.user?.email}</p>
                      </td>
                    )}
                    <td style={{ fontSize:'13px', color:'var(--text-2)' }}>{r.reservedDate}</td>
                    <td style={{ fontSize:'13px', color: r.status === 'NOTIFIED' ? 'var(--yellow)' : 'var(--text-2)', fontWeight: r.status === 'NOTIFIED' ? '600' : '400' }}>
                      {r.expiryDate}
                      {r.status === 'NOTIFIED' && <span style={{ display:'block', fontSize:'11px', color:'var(--yellow)' }}>⚡ Book ready for you!</span>}
                    </td>
                    <td><span className={`badge ${statusColors[r.status] || 'badge-pending'}`}>{r.status}</span></td>
                    {role === 'MEMBER' && (
                      <td>
                        {(r.status === 'WAITING' || r.status === 'NOTIFIED') && (
                          <button className="btn-danger" style={{ fontSize:'12px' }} onClick={() => handleCancel(r.id)}>Cancel</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="alert alert-info" style={{ marginTop:'20px' }}>
        <strong>How reservations work:</strong> When a book you reserved becomes available, you'll receive an email notification. You have 3 days to borrow it before your reservation expires.
      </div>
    </Layout>
  );
}
