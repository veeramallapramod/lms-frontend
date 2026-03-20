import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || 'AIzaSyCnTOhvuGPOV4YeWf-0qrC8fTU3DxCQCgc';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

/* ══════════════════════════════════════════════════════════════
   ROLE-BASED SYSTEM PROMPTS
   Strict three-tier access:
   ADMIN     → full system access + insights
   LIBRARIAN → operational access, no admin-only functions
   MEMBER    → general library help, no staff functions
   PUBLIC    → landing page visitor, general Librario info only
   ══════════════════════════════════════════════════════════════ */
function buildSystemPrompt(user, mode) {
  const role = user?.role || 'PUBLIC';
  const name = user?.name || 'there';
  const plan = user?.subscriptionPlan || 'FREE';
  const date = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const base = `You are Aria, the intelligent AI assistant for Librario — a modern Library Management System.
You are warm, helpful, concise, and smart.
Today is ${date}.
Always reply in 2–4 sentences unless a step-by-step explanation is genuinely needed.
Never make up specific real-time data (live book counts, specific users, etc.) you don't have.
Always stay on topic — if asked something completely unrelated to libraries/Librario, politely redirect.`;

  if (mode === 'public') return base + `

You are on the PUBLIC landing page. The visitor is not logged in.
Your job: explain what Librario is, its features, plans, and encourage them to register.

Librario overview:
- A full-stack Library Management System with 3 roles: Admin, Librarian, Member
- Features: book catalog, borrow/return, reservations, fines (₹5/day overdue), QR scanner, digital library card
- Subscription plans: Free (2 books), Basic ₹99/mo (5 books), Standard ₹199/mo (10 books), Premium ₹349/mo (20 books)
- Email notifications for approvals, due dates, reservations
- Razorpay payment for fines and subscriptions

DO NOT reveal any internal system data, user details, or admin functions.
Encourage visitors to create a free account or sign in.`;

  if (role === 'ADMIN') return base + `

You are speaking with ${name}, the ADMIN. You have FULL access to everything.
ADMIN exclusive capabilities you can guide on:
✅ Add/remove librarian and admin staff accounts
✅ View ALL system statistics and analytics
✅ Manage ALL user accounts (approve, reject, deactivate)
✅ Manage ALL subscription plans and payments
✅ Access ALL borrow records across all users
✅ Set subscription limits and pricing
✅ View and manage ALL fines and damage reports
✅ Delete books or bulk manage catalog
✅ Access admin alerts and system health

Librario system knowledge:
- Members request books → Librarian/Admin approves → Book issued (14-day loan)
- Fine: ₹5/day overdue. Damage fines: Minor ₹100, Moderate ₹300, Severe ₹600
- Renewals: 1 allowed per borrow if not overdue
- QR codes: LIBRARIO_BOOK_{id} format for each book
- Plans: FREE=2, BASIC=5, STANDARD=10, PREMIUM=20 concurrent borrows
- Payments via Razorpay (UPI/cards/wallets)`;

  if (role === 'LIBRARIAN') return base + `

You are speaking with ${name}, a LIBRARIAN.
LIBRARIAN capabilities you can guide on:
✅ Issue books to members (approve borrow requests)
✅ Process book returns and calculate fines
✅ Add new books to the catalog
✅ Register new walk-in members
✅ Manage reservations and waiting lists
✅ File damage reports (3 levels of severity)
✅ Use QR scanner to issue/return instantly
✅ View all active borrows and overdue books
✅ Approve/reject new member registrations
✅ View member profiles and borrow history

❌ CANNOT do (Admin-only — do not guide on these):
- Adding or removing librarian/admin accounts
- Changing subscription plan pricing
- Accessing system-wide financial reports
- Deactivating other staff accounts
- Bulk data operations

Librario knowledge:
- Borrow flow: Member requests → Librarian approves → 14-day loan period
- Fine: ₹5/day overdue. Damage: Minor ₹100, Moderate ₹300, Severe ₹600
- QR format: LIBRARIO_BOOK_{id} — scan to issue or return instantly
- 1 renewal per borrow allowed (not overdue)`;

  if (role === 'MEMBER') return base + `

You are speaking with ${name}, a Member on the ${plan} plan.
MEMBER capabilities you can guide on:
✅ Browse and search the book catalog
✅ Request to borrow available books
✅ Reserve books that are currently unavailable
✅ View your own borrow history and due dates
✅ Renew a book once (if not overdue)
✅ Pay overdue fines via Razorpay
✅ Upgrade subscription plan for more books
✅ Download your digital library card
✅ Manage your profile and password
✅ View and manage your reservations
✅ Receive email notifications

❌ CANNOT do (Staff-only — do not guide on these):
- Approving or rejecting other users
- Issuing books to other members
- Adding books to the catalog
- Accessing other members' data
- Filing damage reports
- Accessing admin or librarian panels

Member-specific info for ${name}:
- Current plan: ${plan} — borrow limit: ${{ FREE:2, BASIC:5, STANDARD:10, PREMIUM:20 }[plan] || 2} books at once
- Fine rate: ₹5 per day per overdue book
- Plans: FREE(2)→BASIC ₹99(5)→STANDARD ₹199(10)→PREMIUM ₹349(20 books)
- Renewals: 1 allowed per borrow, not overdue`;

  // Fallback
  return base + `\nUser role: ${role}. Provide general library assistance.`;
}

/* ── Suggestions per role ────────────────────────────────── */
const CHIPS = {
  ADMIN:     ['📊 System insights',   '👥 Manage approvals', '📚 Catalog tips',       '⚠️ Overdue analysis' ],
  LIBRARIAN: ['📤 Issue a book',       '🔲 QR scanner help',  '📋 Damage report',      '🔔 Reservation tips' ],
  MEMBER:    ['📖 Find a book',        '⏰ My due dates',      '💳 Upgrade plan',        '📚 Recommendations'  ],
  PUBLIC:    ['📚 What is Librario?',  '💰 See pricing',      '🎓 How to join?',        '✨ Key features'     ],
};

/* ── Bot face SVG ─────────────────────────────────────────── */
function BotFace({ size = 38, glow = false }) {
  return (
    <div style={{
      width:`${size}px`, height:`${size}px`, borderRadius:'50%', flexShrink:0,
      background:'linear-gradient(145deg,#7c6fe0 0%,#5448b8 50%,#4ecba8 100%)',
      display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
      boxShadow: glow
        ? '0 0 0 3px rgba(124,111,224,0.25), 0 4px 18px rgba(108,95,199,0.45)'
        : '0 3px 12px rgba(108,95,199,0.38)',
    }}>
      {/* Bot face */}
      <svg width={size*0.62} height={size*0.62} viewBox="0 0 24 24" fill="none">
        {/* Head */}
        <rect x="4" y="5" width="16" height="13" rx="4" fill="white" opacity="0.95"/>
        {/* Eyes */}
        <circle cx="9"  cy="10.5" r="1.8" fill="#5448b8"/>
        <circle cx="15" cy="10.5" r="1.8" fill="#5448b8"/>
        {/* Eye shine */}
        <circle cx="9.6"  cy="9.9" r="0.6" fill="white"/>
        <circle cx="15.6" cy="9.9" r="0.6" fill="white"/>
        {/* Smile */}
        <path d="M9 14 Q12 16.5 15 14" stroke="#5448b8" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        {/* Antenna */}
        <line x1="12" y1="5" x2="12" y2="2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.9"/>
        <circle cx="12" cy="2" r="1.2" fill="#4ecba8"/>
        {/* Ears */}
        <rect x="2"  y="9" width="2.5" height="5" rx="1.2" fill="white" opacity="0.7"/>
        <rect x="19.5" y="9" width="2.5" height="5" rx="1.2" fill="white" opacity="0.7"/>
      </svg>

      {/* Online dot */}
      <div style={{ position:'absolute', bottom:'1px', right:'1px', width:'9px', height:'9px', borderRadius:'50%', background:'#3dd68a', border:'2px solid white', boxShadow:'0 0 6px rgba(61,214,138,0.70)' }}/>
    </div>
  );
}

/* ── Message bubble ───────────────────────────────────────── */
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom:'12px', animation:'bubbleIn 0.22s ease', gap:'8px', alignItems:'flex-end' }}>
      {!isUser && <BotFace size={28}/>}
      <div style={{
        maxWidth:'76%', padding:'10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? 'linear-gradient(135deg,#7c6fe0,#5448b8)' : 'var(--bg-card, #fff)',
        color: isUser ? '#fff' : 'var(--text-1, #1e1b4b)',
        fontSize:'14px', lineHeight:1.60,
        border: isUser ? 'none' : '1px solid var(--border, rgba(108,95,199,0.14))',
        boxShadow: isUser ? '0 4px 14px rgba(108,95,199,0.32)' : '0 2px 8px rgba(0,0,0,0.06)',
        whiteSpace:'pre-wrap', wordBreak:'break-word',
      }}>
        {msg.content}
      </div>
      {isUser && (
        <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#a89cf7,#7c6fe0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800', color:'white', flexShrink:0 }}>
          {msg.initials || 'U'}
        </div>
      )}
    </div>
  );
}

/* ── Typing indicator ─────────────────────────────────────── */
function Typing() {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', marginBottom:'12px' }}>
      <BotFace size={28}/>
      <div style={{ background:'var(--bg-card,#fff)', border:'1px solid var(--border,rgba(108,95,199,0.14))', borderRadius:'16px 16px 16px 4px', padding:'12px 16px', display:'flex', gap:'5px', alignItems:'center' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#7c6fe0', animation:`dot 1.3s ease-in-out ${i*0.18}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN CHAT PANEL (shared by both interior and landing)
   mode: 'interior' | 'public'
   ════════════════════════════════════════════════════════════ */
function ChatPanel({ mode, user, onClose }) {
  const role     = mode === 'public' ? 'PUBLIC' : (user?.role || 'MEMBER');
  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'U';

  const roleLabel = { ADMIN:'Admin mode', LIBRARIAN:'Librarian mode', MEMBER:'Member mode', PUBLIC:'Public mode' };
  const roleColor = { ADMIN:'#f0945a', LIBRARIAN:'#4ecba8', MEMBER:'#7c6fe0', PUBLIC:'#60b8e8' };

  const greeting = mode === 'public'
    ? `Hi! 👋 I'm Aria, Librario's AI assistant.\n\nAsk me anything about Librario — features, pricing, how to join, or how the library system works!`
    : `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm Aria.\n\nI'm your ${role.charAt(0)+role.slice(1).toLowerCase()}-level assistant. I know exactly what you can do in Librario. What do you need help with?`;

  const [messages, setMessages] = useState([{ role:'assistant', content: greeting }]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const chips = CHIPS[role] || CHIPS.PUBLIC;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');

    const userMsg  = { role:'user', content, initials };
    const updated  = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const history = updated.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res = await fetch(GEMINI_URL, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          system_instruction: { parts:[{ text: buildSystemPrompt(user, mode === 'public' ? 'public' : null) }] },
          contents: history,
          generationConfig: { temperature:0.78, maxOutputTokens:600, topP:0.95 },
          safetySettings: [
            { category:'HARM_CATEGORY_HARASSMENT',        threshold:'BLOCK_ONLY_HIGH' },
            { category:'HARM_CATEGORY_DANGEROUS_CONTENT', threshold:'BLOCK_ONLY_HIGH' },
          ],
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(()=>({}));
        throw new Error(e?.error?.message || `API error ${res.status}`);
      }
      const data  = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) throw new Error('Empty response');
      setMessages(prev => [...prev, { role:'assistant', content: reply.trim() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role:'assistant', content:`⚠️ ${e.message.includes('API') ? 'API key issue — check your .env file.' : 'Something went wrong. Please try again.'}` }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  /* ── Panel styles — interior uses CSS vars, public uses hardcoded ── */
  const isPublic = mode === 'public';
  const panelBg  = isPublic ? 'rgba(255,255,255,0.97)' : 'var(--bg-card)';
  const textCol  = isPublic ? '#1e1b4b' : 'var(--text-1)';
  const text2    = isPublic ? 'rgba(30,27,75,0.50)' : 'var(--text-2)';
  const borderCol= isPublic ? 'rgba(108,95,199,0.15)' : 'var(--border)';
  const inputBg  = isPublic ? '#faf9ff' : 'var(--bg-input)';
  const chipBg   = isPublic ? '#f5f3ff' : 'var(--bg-2)';

  return (
    <div style={{
      width:'500px', height:'640px',
      background: panelBg,
      borderRadius:'22px',
      border:`1px solid ${borderCol}`,
      boxShadow:'0 28px 90px rgba(108,95,199,0.24), 0 6px 24px rgba(0,0,0,0.10)',
      display:'flex', flexDirection:'column', overflow:'hidden',
      fontFamily:"'DM Sans',sans-serif",
      backdropFilter:'blur(20px)',
    }}>
      <style>{`
        @keyframes bubbleIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dot      { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
      `}</style>

      {/* Header */}
      <div style={{ padding:'16px 18px', borderBottom:`1px solid ${borderCol}`, display:'flex', alignItems:'center', gap:'12px', background:'linear-gradient(135deg,rgba(124,111,224,0.09),rgba(78,203,168,0.07))' }}>
        <BotFace size={42} glow/>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <p style={{ fontSize:'15px', fontWeight:'700', color: textCol, lineHeight:1 }}>Aria</p>
            <span style={{ fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px', background:`${roleColor[role]}18`, color: roleColor[role], border:`1px solid ${roleColor[role]}30` }}>
              {roleLabel[role]}
            </span>
          </div>
          <p style={{ fontSize:'11px', color: text2, marginTop:'3px' }}>Librario AI · Powered by Gemini</p>
        </div>
        <div style={{ display:'flex', gap:'4px' }}>
          <button onClick={() => setMessages([{ role:'assistant', content: greeting }])} title="Clear chat"
            style={{ background:'none', border:'none', cursor:'pointer', color: text2, padding:'6px', borderRadius:'8px', lineHeight:0, transition:'all 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(108,95,199,0.10)'}
            onMouseLeave={e=>e.currentTarget.style.background='none'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.67"/></svg>
          </button>
          <button onClick={onClose} title="Close"
            style={{ background:'none', border:'none', cursor:'pointer', color: text2, padding:'6px', borderRadius:'8px', lineHeight:0, transition:'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(224,66,90,0.10)';e.currentTarget.style.color='#e0425a';}}
            onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=text2;}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 14px 8px', scrollbarWidth:'thin', scrollbarColor:'rgba(108,95,199,0.25) transparent' }}>
        {messages.map((m,i) => <Bubble key={i} msg={m}/>)}
        {loading && <Typing/>}
        <div ref={bottomRef}/>
      </div>

      {/* Quick chips */}
      {messages.length <= 1 && (
        <div style={{ padding:'4px 14px 10px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {chips.map(chip => (
            <button key={chip} onClick={() => send(chip.replace(/^[\S]+\s/, ''))}
              style={{ fontSize:'11.5px', padding:'5px 11px', borderRadius:'20px', border:`1px solid ${borderCol}`, background: chipBg, color: text2, cursor:'pointer', transition:'all 0.15s', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(108,95,199,0.10)';e.currentTarget.style.borderColor='rgba(108,95,199,0.35)';e.currentTarget.style.color='#7c6fe0';}}
              onMouseLeave={e=>{e.currentTarget.style.background=chipBg;e.currentTarget.style.borderColor=borderCol;e.currentTarget.style.color=text2;}}>
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding:'12px 14px', borderTop:`1px solid ${borderCol}`, display:'flex', gap:'9px', alignItems:'flex-end' }}>
        <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
          placeholder="Ask Aria anything…"
          rows={1}
          style={{ flex:1, padding:'10px 14px', borderRadius:'13px', border:`1.5px solid ${borderCol}`, background: inputBg, color: textCol, fontSize:'13.5px', fontFamily:"'DM Sans',sans-serif", resize:'none', outline:'none', maxHeight:'88px', overflowY:'auto', lineHeight:1.45, transition:'border-color 0.2s' }}
          onFocus={e=>e.target.style.borderColor='#7c6fe0'}
          onBlur={e=>e.target.style.borderColor=borderCol}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          style={{ width:'40px', height:'40px', borderRadius:'12px', border:'none', flexShrink:0, cursor: input.trim()&&!loading ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.22s', background: input.trim()&&!loading ? 'linear-gradient(135deg,#7c6fe0,#5448b8)' : 'rgba(108,95,199,0.10)', color: input.trim()&&!loading ? 'white' : 'rgba(108,95,199,0.40)', boxShadow: input.trim()&&!loading ? '0 4px 14px rgba(108,95,199,0.38)' : 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>

      <div style={{ padding:'5px 0 8px', textAlign:'center' }}>
        <p style={{ fontSize:'10px', color:'rgba(108,95,199,0.40)', letterSpacing:'0.03em' }}>Powered by Google Gemini · Free API</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   INTERIOR CHATBOT (used inside Layout — authenticated users)
   ════════════════════════════════════════════════════════════ */
export default function AIChatbot({ onClose }) {
  const { user } = useAuthStore();
  return (
    <div style={{ position:'fixed', bottom:'96px', right:'24px', zIndex:500, animation:'chatUp 0.32s cubic-bezier(0.34,1.56,0.64,1)' }}>
      <style>{`@keyframes chatUp{from{opacity:0;transform:translateY(22px) scale(0.94)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <ChatPanel mode="interior" user={user} onClose={onClose}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PUBLIC CHATBOT (used on Landing page — no auth needed)
   ════════════════════════════════════════════════════════════ */
export function PublicChatbot() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    // Stop pulsing after 6 seconds
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {open && (
        <div style={{ position:'fixed', bottom:'100px', right:'28px', zIndex:1000, animation:'chatUp 0.32s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <style>{`@keyframes chatUp{from{opacity:0;transform:translateY(22px) scale(0.94)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
          <ChatPanel mode="public" user={null} onClose={() => setOpen(false)}/>
        </div>
      )}

      {/* Floating button */}
      <button onClick={() => { setOpen(o=>!o); setPulse(false); }}
        style={{
          position:'fixed', bottom:'28px', right:'28px', zIndex:1000,
          width:'68px', height:'68px', borderRadius:'50%', border:'none',
          background: open ? 'linear-gradient(135deg,#e0425a,#b8203c)' : 'linear-gradient(135deg,#7c6fe0,#5448b8)',
          cursor:'pointer', padding:0, overflow:'visible',
          boxShadow: open ? '0 8px 28px rgba(224,66,90,0.50)' : '0 8px 28px rgba(108,95,199,0.52)',
          transition:'all 0.30s cubic-bezier(0.34,1.56,0.64,1)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>

        {/* Pulse rings */}
        {pulse && !open && (
          <>
            <span style={{ position:'absolute', inset:'-6px', borderRadius:'50%', background:'rgba(124,111,224,0.22)', animation:'ring 2s ease-out 0s infinite', pointerEvents:'none' }}/>
            <span style={{ position:'absolute', inset:'-6px', borderRadius:'50%', background:'rgba(124,111,224,0.14)', animation:'ring 2s ease-out 0.6s infinite', pointerEvents:'none' }}/>
          </>
        )}

        {/* Bot character sitting on button or X */}
        {open
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : (
            <>
              {/* Bot body inside the circle */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ position:'relative', zIndex:1 }}>
                {/* Bot head */}
                <rect x="10" y="9" width="16" height="12" rx="4" fill="white" opacity="0.95"/>
                {/* Eyes */}
                <circle cx="14.5" cy="14" r="1.8" fill="#5448b8"/>
                <circle cx="21.5" cy="14" r="1.8" fill="#5448b8"/>
                <circle cx="15.1" cy="13.4" r="0.65" fill="white"/>
                <circle cx="22.1" cy="13.4" r="0.65" fill="white"/>
                {/* Smile */}
                <path d="M14 18 Q18 20.5 22 18" stroke="#5448b8" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                {/* Antenna */}
                <line x1="18" y1="9" x2="18" y2="6.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.9"/>
                <circle cx="18" cy="5.8" r="1.4" fill="#4ecba8"/>
                {/* Ears */}
                <rect x="7.5" y="12" width="3" height="5" rx="1.5" fill="white" opacity="0.7"/>
                <rect x="25.5" y="12" width="3" height="5" rx="1.5" fill="white" opacity="0.7"/>
                {/* Body */}
                <rect x="12" y="22" width="12" height="8" rx="3" fill="white" opacity="0.80"/>
                {/* Legs dangling */}
                <line x1="15" y1="30" x2="14" y2="34" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
                <line x1="21" y1="30" x2="22" y2="34" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
                {/* Arms */}
                <line x1="12" y1="24" x2="8"  y2="27" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
                <line x1="24" y1="24" x2="28" y2="27" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
              </svg>
              {/* Online dot */}
              <div style={{ position:'absolute', bottom:'6px', right:'6px', width:'11px', height:'11px', borderRadius:'50%', background:'#3dd68a', border:'2.5px solid white', boxShadow:'0 0 8px rgba(61,214,138,0.80)', zIndex:2 }}/>
            </>
          )
        }

        {/* "Ask me!" tooltip when pulse */}
        {pulse && !open && (
          <div style={{ position:'absolute', right:'74px', top:'50%', transform:'translateY(-50%)', background:'white', color:'#5448b8', fontSize:'12px', fontWeight:'700', padding:'7px 14px', borderRadius:'20px', whiteSpace:'nowrap', boxShadow:'0 4px 18px rgba(108,95,199,0.25)', animation:'tooltipFade 3s ease-in-out 0.5s forwards', opacity:0, pointerEvents:'none', fontFamily:"'DM Sans',sans-serif", border:'1px solid rgba(108,95,199,0.15)' }}>
            💬 Ask Aria anything!
          </div>
        )}
      </button>

      <style>{`
        @keyframes ring        { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.7);opacity:0} }
        @keyframes tooltipFade { 0%{opacity:0} 15%{opacity:1} 75%{opacity:1} 100%{opacity:0} }
      `}</style>
    </>
  );
}
