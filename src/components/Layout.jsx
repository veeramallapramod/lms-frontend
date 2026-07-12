import Sidebar from './Sidebar';
import useAuthStore from '../store/authStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatbot from './AIChatbot';
import API from '../api/axiosInstance';

export default function Layout({ title, subtitle, actions, children }) {
  useEffect(() => { document.documentElement.setAttribute('data-theme', 'light'); }, []);

  const [chatOpen,    setChatOpen]    = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    const fetch = async () => {
      try {
        const res = await API.get(`/notifications/${user.id}/unread-count`);
        if (active) setUnreadCount(res.data?.count || 0);
      } catch {}
    };
    fetch();
    const iv = setInterval(fetch, 60000);
    return () => { active = false; clearInterval(iv); };
  }, [user?.id]);

  return (
    <div className="app-layout" data-theme="light">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            {title && <h1 style={{ fontSize:'19px', fontWeight:'700', color:'var(--text-1)', fontFamily:"'Bodoni Moda',serif" }}>{title}</h1>}
            {subtitle && <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'1px' }}>{subtitle}</p>}
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            {actions}

            {/* ── Bell notification icon ── */}
            <button
              onClick={() => navigate('/notifications')}
              title="Notifications"
              style={{
                position:'relative', background:'var(--bg-card)',
                border:'1px solid var(--border)', borderRadius:'10px',
                width:'38px', height:'38px', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--text-2)', transition:'all 0.18s', flexShrink:0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--accent-muted)'; e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.color='var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--bg-card)'; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-2)'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {/* Red badge */}
              {unreadCount > 0 && (
                <span style={{
                  position:'absolute', top:'-5px', right:'-5px',
                  background:'#e0425a', color:'white',
                  fontSize:'9px', fontWeight:'800',
                  minWidth:'17px', height:'17px', borderRadius:'20px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  padding:'0 4px', border:'2px solid var(--bg)',
                  lineHeight:1, animation: unreadCount > 0 ? 'bellPulse 2s ease-in-out infinite' : 'none',
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="page-body page-enter">
          {children}
        </div>
      </div>

      {/* ── AI Chatbot floating button ── */}
      {chatOpen && <AIChatbot onClose={() => setChatOpen(false)}/>}
      <button
        onClick={() => setChatOpen(o => !o)}
        title="Aria — AI Assistant"
        style={{
          position:'fixed', bottom:'24px', right:'24px', zIndex:499,
          width:'64px', height:'64px', borderRadius:'50%', border:'none',
          background: chatOpen
            ? 'linear-gradient(135deg,#e0425a,#b8203c)'
            : 'linear-gradient(135deg,#b8863f,#C9A35A)',
          color:'white', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: chatOpen
            ? '0 6px 24px rgba(224,66,90,0.45)'
            : '0 6px 24px rgba(150,108,40,0.45)',
          transition:'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          transform: chatOpen ? 'scale(1.05)' : 'scale(1)',
          overflow:'visible', padding:0,
        }}
        onMouseEnter={e => { if(!chatOpen) e.currentTarget.style.transform='scale(1.10)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = chatOpen ? 'scale(1.05)' : 'scale(1)'; }}
      >
        {chatOpen
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          : <>
              {/* Bot character sitting inside button */}
              <svg width="40" height="40" viewBox="0 0 36 36" fill="none" style={{ position:'relative', zIndex:1 }}>
                {/* Head */}
                <rect x="10" y="8" width="16" height="12" rx="4" fill="white" opacity="0.95"/>
                {/* Eyes */}
                <circle cx="14.5" cy="13" r="1.8" fill="#96702E"/>
                <circle cx="21.5" cy="13" r="1.8" fill="#96702E"/>
                <circle cx="15.1" cy="12.4" r="0.65" fill="white"/>
                <circle cx="22.1" cy="12.4" r="0.65" fill="white"/>
                {/* Smile */}
                <path d="M14 17 Q18 19.5 22 17" stroke="#96702E" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                {/* Antenna */}
                <line x1="18" y1="8" x2="18" y2="5.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.9"/>
                <circle cx="18" cy="4.8" r="1.4" fill="#C9A35A"/>
                {/* Ears */}
                <rect x="7.5" y="11" width="3" height="5" rx="1.5" fill="white" opacity="0.7"/>
                <rect x="25.5" y="11" width="3" height="5" rx="1.5" fill="white" opacity="0.7"/>
                {/* Body */}
                <rect x="12" y="21" width="12" height="8" rx="3" fill="white" opacity="0.80"/>
                {/* Legs dangling */}
                <line x1="15" y1="29" x2="14" y2="33" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
                <line x1="21" y1="29" x2="22" y2="33" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
                {/* Arms */}
                <line x1="12" y1="23" x2="8"  y2="26" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
                <line x1="24" y1="23" x2="28" y2="26" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
              </svg>
              {/* Online dot */}
              <div style={{ position:'absolute', bottom:'5px', right:'5px', width:'12px', height:'12px', borderRadius:'50%', background:'#3dd68a', border:'2.5px solid white', boxShadow:'0 0 8px rgba(61,214,138,0.80)', zIndex:2 }}/>
              {/* Pulse ring */}
              <span style={{ position:'absolute', inset:'-5px', borderRadius:'50%', background:'rgba(183,134,63,0.22)', animation:'chatPulse 2.5s ease-out infinite', pointerEvents:'none' }}/>
            </>
        }
      </button>

      <style>{`
        @keyframes bellPulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.12); }
        }
        @keyframes chatPulse {
          0%   { transform:scale(1);    opacity:0.8; }
          70%  { transform:scale(1.55); opacity:0;   }
          100% { transform:scale(1.55); opacity:0;   }
        }
      `}</style>
    </div>
  );
}
