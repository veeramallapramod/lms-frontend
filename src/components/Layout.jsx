import Sidebar from './Sidebar';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';

export default function Layout({ title, subtitle, actions, children }) {
  const { theme } = useAuthStore();
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            {title && <h1 style={{ fontSize:'19px', fontWeight:'700', color:'var(--text-1)', fontFamily:'Instrument Serif, serif' }}>{title}</h1>}
            {subtitle && <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'1px' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>{actions}</div>}
        </div>
        <div className="page-body page-enter">
          {children}
        </div>
      </div>
    </div>
  );
}
