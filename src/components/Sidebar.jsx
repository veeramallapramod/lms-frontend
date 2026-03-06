import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import { useEffect } from 'react';

export default function Sidebar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout, theme, toggleTheme } = useAuthStore();
  const { pendingUsers, fetchPendingUsers }   = useUserStore();
  const role = user?.role;

  useEffect(() => {
    if (role === 'ADMIN' || role === 'LIBRARIAN') fetchPendingUsers();
  }, [role]);

  const isActive     = (path) => location.pathname === path;
  const handleLogout = () => { logout(); navigate('/'); };

  const NavLink = ({ to, icon, label, badge }) => (
    <Link to={to}
      style={{ padding:'10px 14px', borderRadius:'9px', marginBottom:'2px', display:'flex', alignItems:'center', gap:'11px', textDecoration:'none',
        color: isActive(to) ? 'var(--accent)' : 'var(--text-2)',
        background: isActive(to) ? 'var(--accent-muted)' : 'transparent',
        fontWeight: isActive(to) ? '600' : '400',
        fontSize:'13.5px', transition:'all 0.15s',
        border: isActive(to) ? '1px solid var(--border-accent)' : '1px solid transparent',
      }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, opacity: isActive(to) ? 1 : 0.7 }}>
        <path d={icon}/>
      </svg>
      <span style={{ flex:1, fontSize:'13.5px' }}>{label}</span>
      {badge > 0 && (
        <span style={{ background:'var(--red)', color:'white', fontSize:'9px', fontWeight:'800', padding:'2px 6px', borderRadius:'10px', minWidth:'18px', textAlign:'center' }}>{badge}</span>
      )}
    </Link>
  );

  const SectionLabel = ({ children }) => (
    <p style={{ fontSize:'9px', fontWeight:'700', color:'var(--text-3)', letterSpacing:'0.12em', textTransform:'uppercase', padding:'14px 14px 5px', marginTop:'4px' }}>{children}</p>
  );

  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'U';

  return (
    <div className="sidebar" style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'11px' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 3px 10px rgba(245,158,11,0.35)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily:'Instrument Serif, serif', fontSize:'19px', color:'var(--text-1)', lineHeight:1 }}>Librario</p>
            <p style={{ fontSize:'9px', color:'var(--text-3)', marginTop:'2px', letterSpacing:'0.08em', fontWeight:'600' }}>LIBRARY SYSTEM</p>
          </div>
        </div>
      </div>

      <nav style={{ flex:1, overflowY:'auto', padding:'6px 8px 10px', scrollbarWidth:'none' }}>
        <SectionLabel>Main</SectionLabel>
        <NavLink to="/dashboard" icon="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" label="Dashboard"/>
        <NavLink to="/books"     icon="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" label="Manage Books"/>
        <NavLink to="/bookshelf" icon="M4 6h16M4 10h16M4 14h16M4 18h16" label="Book Shelf 📚"/>

        {role === 'ADMIN' && (<>
          <SectionLabel>Admin</SectionLabel>
          <NavLink to="/add-book"      icon="M12 5v14M5 12h14" label="Add Book"/>
          <NavLink to="/add-staff"     icon="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6" label="Add Staff"/>
          <NavLink to="/borrow"        icon="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" label="Borrow Management"/>
          <NavLink to="/reservations"  icon="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" label="Reservations"/>
          <NavLink to="/users"         icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" label="Users"/>
          <NavLink to="/approvals"     icon="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" label="Approvals" badge={pendingUsers.length}/>
          <NavLink to="/subscriptions" icon="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" label="Subscriptions"/>
        </>)}

        {role === 'LIBRARIAN' && (<>
          <SectionLabel>Librarian</SectionLabel>
          <NavLink to="/add-book"     icon="M12 5v14M5 12h14" label="Add Book"/>
          <NavLink to="/borrow"       icon="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" label="Borrow Management"/>
          <NavLink to="/reservations" icon="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" label="Reservations"/>
          <NavLink to="/users"        icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" label="Members"/>
          <NavLink to="/approvals"    icon="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" label="Approvals" badge={pendingUsers.length}/>
        </>)}

        {role === 'MEMBER' && (<>
          <SectionLabel>My Library</SectionLabel>
          <NavLink to="/my-borrows"   icon="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" label="My Borrowed Books"/>
          <NavLink to="/reservations" icon="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" label="My Reservations"/>
          <NavLink to="/plans"        icon="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" label="Subscription Plans ⭐"/>
        </>)}

        <SectionLabel>Account</SectionLabel>
        <NavLink to="/profile" icon="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" label="My Profile"/>
      </nav>

      <div style={{ padding:'10px 8px 12px', borderTop:'1px solid var(--border)' }}>
        <button onClick={toggleTheme}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:'11px', padding:'10px 14px', borderRadius:'9px', background:'transparent', border:'1px solid transparent', cursor:'pointer', color:'var(--text-2)', fontSize:'13px', marginBottom:'6px', transition:'all 0.15s', fontFamily:'Plus Jakarta Sans, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.background='var(--bg-2)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {theme === 'dark'
              ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
              : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}
          </svg>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Link to="/profile" style={{ textDecoration:'none' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', background:'var(--accent-muted)', border:'1px solid var(--border-accent)', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--bg-2)'}
            onMouseLeave={e => e.currentTarget.style.background='var(--accent-muted)'}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg, #f59e0b, #d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800', color:'white', flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:'12px', fontWeight:'700', color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'User'}</p>
              <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'2px' }}>
                <span className={`badge badge-${role?.toLowerCase()}`} style={{ fontSize:'9px', padding:'1px 5px' }}>{role}</span>
                {role === 'MEMBER' && user?.subscriptionPlan && user.subscriptionPlan !== 'FREE' && (
                  <span style={{ fontSize:'9px', color:'var(--gold)', fontWeight:'700' }}>⭐ {user.subscriptionPlan}</span>
                )}
              </div>
            </div>
            <button onClick={e => { e.preventDefault(); handleLogout(); }}
              style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', padding:'4px', flexShrink:0, borderRadius:'5px', transition:'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--red)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}
              title="Logout">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
