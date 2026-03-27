import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

// Plans that get offline access
const OFFLINE_PLANS = ['BASIC', 'STANDARD', 'PREMIUM'];

export function useOfflineAccess() {
  const { user } = useAuthStore();
  const [isOnline,      setIsOnline]      = useState(navigator.onLine);
  const [swRegistered,  setSwRegistered]  = useState(false);
  const [offlineReady,  setOfflineReady]  = useState(false);

  const hasMembership = OFFLINE_PLANS.includes(user?.subscriptionPlan);

  // Register Service Worker for paid members
  useEffect(() => {
    if (!hasMembership) return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        setSwRegistered(true);
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setOfflineReady(true);
            }
          });
        });
        if (reg.active) setOfflineReady(true);
      })
      .catch(err => console.warn('SW registration failed:', err));
  }, [hasMembership]);

  // Online/offline listeners
  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return { isOnline, swRegistered, offlineReady, hasMembership };
}

// ── Offline Banner Component ────────────────────────────────────
export function OfflineBanner() {
  const { isOnline, offlineReady, hasMembership } = useOfflineAccess();
  const [dismissed, setDismissed] = useState(false);

  // Show "offline ready" toast briefly when SW is activated
  const [showReady, setShowReady] = useState(false);
  useEffect(() => {
    if (offlineReady && hasMembership) {
      setShowReady(true);
      setTimeout(() => setShowReady(false), 4000);
    }
  }, [offlineReady]);

  if (isOnline && !showReady) return null;
  if (dismissed) return null;

  if (!isOnline && hasMembership) {
    return (
      <div style={{
        position:'fixed', top:0, left:0, right:0, zIndex:9999,
        background:'linear-gradient(135deg,#f59e0b,#d97706)',
        color:'white', padding:'10px 20px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontSize:'13px', fontWeight:'600', boxShadow:'0 2px 12px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'18px' }}>📡</span>
          <span>You're offline — Showing cached data. Live actions unavailable.</span>
        </div>
        <button onClick={() => setDismissed(true)}
          style={{ background:'none', border:'none', color:'white', cursor:'pointer', fontSize:'18px', lineHeight:1, padding:'4px 8px' }}>
          ×
        </button>
      </div>
    );
  }

  if (!isOnline && !hasMembership) {
    return (
      <div style={{
        position:'fixed', top:0, left:0, right:0, zIndex:9999,
        background:'#ef4444', color:'white', padding:'10px 20px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontSize:'13px', fontWeight:'600',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span>⚠️</span>
          <span>You're offline. Upgrade to Basic/Standard/Premium plan for offline access.</span>
        </div>
        <button onClick={() => setDismissed(true)}
          style={{ background:'none', border:'none', color:'white', cursor:'pointer', fontSize:'18px' }}>
          ×
        </button>
      </div>
    );
  }

  if (showReady) {
    return (
      <div style={{
        position:'fixed', bottom:'90px', right:'24px', zIndex:9999,
        background:'#22c55e', color:'white', padding:'12px 20px', borderRadius:'12px',
        fontSize:'13px', fontWeight:'600', boxShadow:'0 4px 20px rgba(34,197,94,0.4)',
        display:'flex', alignItems:'center', gap:'8px',
        animation:'slideIn 0.3s ease',
      }}>
        <span>✅</span> Offline access ready — you can now use Librario without internet!
      </div>
    );
  }

  return null;
}
