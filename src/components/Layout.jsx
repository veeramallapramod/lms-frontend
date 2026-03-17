import Sidebar from './Sidebar';
import useAuthStore from '../store/authStore';
import { useEffect, useState } from 'react';
import AIChatbot from './AIChatbot';

export default function Layout({ title, subtitle, actions, children }) {
  const { theme } = useAuthStore();
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            {title && <h1 style={{ fontSize:'19px', fontWeight:'700', color:'var(--text-1)', fontFamily:"'Playfair Display',serif" }}>{title}</h1>}
            {subtitle && <p style={{ fontSize:'12px', color:'var(--text-2)', marginTop:'1px' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>{actions}</div>}
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
            : 'linear-gradient(135deg,#7c6fe0,#4ecba8)',
          color:'white', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: chatOpen
            ? '0 6px 24px rgba(224,66,90,0.45)'
            : '0 6px 24px rgba(108,95,199,0.45)',
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
                <circle cx="14.5" cy="13" r="1.8" fill="#5448b8"/>
                <circle cx="21.5" cy="13" r="1.8" fill="#5448b8"/>
                <circle cx="15.1" cy="12.4" r="0.65" fill="white"/>
                <circle cx="22.1" cy="12.4" r="0.65" fill="white"/>
                {/* Smile */}
                <path d="M14 17 Q18 19.5 22 17" stroke="#5448b8" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                {/* Antenna */}
                <line x1="18" y1="8" x2="18" y2="5.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.9"/>
                <circle cx="18" cy="4.8" r="1.4" fill="#4ecba8"/>
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
              <span style={{ position:'absolute', inset:'-5px', borderRadius:'50%', background:'rgba(124,111,224,0.22)', animation:'chatPulse 2.5s ease-out infinite', pointerEvents:'none' }}/>
            </>
        }
      </button>

      <style>{`
        @keyframes chatPulse {
          0%   { transform:scale(1);    opacity:0.8; }
          70%  { transform:scale(1.55); opacity:0;   }
          100% { transform:scale(1.55); opacity:0;   }
        }
      `}</style>
    </div>
  );
}
