import { useEffect } from 'react';
import Layout from './Layout';
import useUserStore from '../store/userStore';

export default function Approvals() {
  const { users, fetchAllUsers, approveUser, rejectUser, loading } = useUserStore();

  useEffect(() => { fetchAllUsers(); }, []);

  const pending = users.filter(u => u.status === 'PENDING' && u.enabled);
  const approved = users.filter(u => u.status === 'APPROVED');
  const rejected = users.filter(u => u.status === 'REJECTED');

  const UserRow = ({ u, showActions }) => (
    <tr key={u.id}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--accent)', flexShrink: 0 }}>
            {u.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p style={{ fontWeight: '500', color: 'var(--text-1)' }}>{u.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-2)' }}>{u.email}</p>
          </div>
        </div>
      </td>
      <td><span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role}</span></td>
      <td><span className={`badge badge-${u.status?.toLowerCase()}`}>{u.status}</span></td>
      <td>
        {showActions && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-success" onClick={() => approveUser(u.id)}>✓ Approve</button>
            <button className="btn-danger" onClick={() => rejectUser(u.id)}>✕ Reject</button>
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <Layout title="User Approvals" subtitle="Manage new user registration requests">
      {/* Pending */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-1)' }}>Pending Requests</h2>
          {pending.length > 0 && (
            <span style={{ background: 'var(--red)', color: 'white', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>{pending.length}</span>
          )}
        </div>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-2)' }}>Loading...</div>
        ) : pending.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>No pending approvals</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{pending.map(u => <UserRow key={u.id} u={u} showActions />)}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approved */}
      {approved.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-1)' }}>Approved Users ({approved.length})</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th></th></tr></thead>
              <tbody>{approved.map(u => <UserRow key={u.id} u={u} showActions={false} />)}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-1)' }}>Rejected Users ({rejected.length})</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{rejected.map(u => <UserRow key={u.id} u={u} showActions />)}</tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
