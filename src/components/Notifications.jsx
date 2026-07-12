import { useEffect, useState } from 'react';
import Layout from './Layout';
import useAuthStore from '../store/authStore';
import API from '../api/axiosInstance';

const TYPE_CONFIG = {
  DUE_SOON:           { icon: '📅', color: 'var(--yellow)',  bg: 'var(--yellow-muted)',  label: 'Due Soon' },
  OVERDUE:            { icon: '⚠️', color: 'var(--red)',     bg: 'var(--red-muted)',     label: 'Overdue' },
  FINE_ISSUED:        { icon: '💸', color: 'var(--red)',     bg: 'var(--red-muted)',     label: 'Fine Issued' },
  RESERVATION_READY:  { icon: '🔔', color: 'var(--green)',   bg: 'var(--green-muted)',   label: 'Reservation Ready' },
  RENEWAL_SUCCESS:    { icon: '✅', color: 'var(--green)',   bg: 'var(--green-muted)',   label: 'Renewed' },
  LOW_STOCK:          { icon: '📦', color: 'var(--orange)',  bg: 'var(--orange-muted)',  label: 'Low Stock' },
  DAMAGED_BOOK:       { icon: '🔧', color: 'var(--purple)',  bg: 'var(--purple-muted)',  label: 'Damaged Book' },
  GENERAL:            { icon: '📢', color: 'var(--accent)',  bg: 'var(--accent-muted)',  label: 'General' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Notifications() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [loading,        setLoading]       = useState(true);
  const [filter,         setFilter]        = useState('all'); // all | unread

  useEffect(() => { if (user?.id) fetchNotifications(); }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/notifications/${user.id}`);
      setNotifications(res.data);
    } catch {} finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await API.put(`/notifications/${user.id}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout
      title="Notifications"
      subtitle="Stay updated on your books, fines, and reservations"
      actions={
        unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllAsRead} style={{ fontSize: '12px' }}>
            ✓ Mark all as read
          </button>
        )
      }
    >
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all',    label: `All (${notifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', border: '1px solid',
              fontFamily:"'Manrope',sans-serif",
              background:   filter === t.key ? 'var(--accent)' : 'var(--bg-card)',
              color:        filter === t.key ? 'white'         : 'var(--text-2)',
              borderColor:  filter === t.key ? 'var(--accent)' : 'var(--border)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
            Loading notifications...
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
            <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          displayed.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.GENERAL;
            return (
              <div key={n.id}
                onClick={() => { if (!n.read) markAsRead(n.id); }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '16px 20px',
                  borderBottom: i < displayed.length - 1 ? '1px solid var(--border)' : 'none',
                  background: n.read ? 'transparent' : cfg.bg,
                  cursor: n.read ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                }}>

                {/* Icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: cfg.bg, border: `1px solid ${cfg.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                }}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>
                        {n.title}
                      </span>
                      <span style={{
                        fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                        borderRadius: '20px', background: cfg.bg,
                        color: cfg.color, border: `1px solid ${cfg.color}40`,
                      }}>
                        {cfg.label}
                      </span>
                      {!n.read && (
                        <span style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: 'var(--accent)', display: 'inline-block',
                        }} />
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', flexShrink: 0 }}>
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', margin: 0 }}>
                    {n.message}
                  </p>
                  {n.actionUrl && (
                    <a href={n.actionUrl}
                      style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', marginTop: '6px', display: 'inline-block' }}
                      onClick={e => e.stopPropagation()}>
                      View →
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}