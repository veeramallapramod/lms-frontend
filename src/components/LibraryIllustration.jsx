// Beautiful dark library illustration for auth left panel
export default function LibraryIllustration() {
  return (
    <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '420px', opacity: 0.92 }}>
      {/* Background wall */}
      <rect width="480" height="520" fill="#2d2870"/>

      {/* Ambient ceiling light */}
      <ellipse cx="240" cy="0" rx="180" ry="60" fill="rgba(168,156,247,0.14)"/>

      {/* Back wall paneling */}
      <rect x="20" y="20" width="440" height="480" rx="2" fill="#35308a" stroke="#4a44a8" strokeWidth="1"/>

      {/* Wall vertical panels */}
      {[80, 160, 240, 320, 400].map(x => (
        <line key={x} x1={x} y1="20" x2={x} y2="500" stroke="#2a2568" strokeWidth="1.5"/>
      ))}

      {/* ========== BOOKSHELF 1 (top) ========== */}
      {/* Shelf board */}
      <rect x="20" y="140" width="440" height="12" fill="#5c52c8" rx="2"/>
      <rect x="20" y="150" width="440" height="4" fill="#3e39a0"/>
      {/* Shadow under shelf */}
      <rect x="20" y="152" width="440" height="6" fill="rgba(0,0,0,0.30)"/>

      {/* Books on shelf 1 */}
      {/* Book 1 - tall blue */}
      <rect x="35" y="80" width="22" height="62" rx="2" fill="#bfdbfe"/>
      <rect x="35" y="80" width="4" height="62" fill="#2563eb" opacity="0.6"/>
      <rect x="38" y="95" width="15" height="2" fill="rgba(255,255,255,0.15)" rx="1"/>
      <rect x="38" y="100" width="10" height="1.5" fill="rgba(255,255,255,0.1)" rx="1"/>
      {/* Book 2 - short red */}
      <rect x="60" y="100" width="16" height="42" rx="2" fill="#fecaca"/>
      <rect x="60" y="100" width="3" height="42" fill="#dc2626" opacity="0.7"/>
      {/* Book 3 - tilted amber */}
      <rect x="79" y="86" width="14" height="56" rx="1" fill="#fde68a" transform="rotate(-4 79 142)"/>
      <rect x="79" y="86" width="3" height="56" fill="#8b6418" opacity="0.6" transform="rotate(-4 79 142)"/>
      {/* Book 4 - tall green */}
      <rect x="96" y="75" width="20" height="67" rx="2" fill="#a7f3d0"/>
      <rect x="96" y="75" width="3" height="67" fill="#10b981" opacity="0.5"/>
      <rect x="100" y="88" width="12" height="1.5" fill="rgba(255,255,255,0.12)" rx="1"/>
      {/* Book 5 - medium purple */}
      <rect x="119" y="90" width="18" height="52" rx="2" fill="#ddd6fe"/>
      <rect x="119" y="90" width="3" height="52" fill="#8b5cf6" opacity="0.6"/>
      {/* Book 6 - ornate gold spine */}
      <rect x="140" y="72" width="24" height="70" rx="2" fill="#fef3c7"/>
      <rect x="140" y="72" width="4" height="70" fill="#c8a55a" opacity="0.7"/>
      <rect x="145" y="85" width="14" height="1.5" fill="rgba(124,111,224,0.55)" rx="1"/>
      <rect x="145" y="90" width="10" height="1.5" fill="rgba(124,111,224,0.35)" rx="1"/>
      <rect x="145" y="128" width="14" height="1.5" fill="rgba(124,111,224,0.55)" rx="1"/>
      {/* Book 7 */}
      <rect x="167" y="95" width="14" height="47" rx="1" fill="#bfdbfe"/>
      <rect x="167" y="95" width="3" height="47" fill="#60a5fa" opacity="0.5"/>
      {/* Book 8 - fat dictionary */}
      <rect x="184" y="82" width="32" height="60" rx="2" fill="#fef9c3"/>
      <rect x="184" y="82" width="5" height="60" fill="#8b6418" opacity="0.4"/>
      <rect x="190" y="95" width="20" height="1.5" fill="rgba(255,255,255,0.08)" rx="1"/>
      <rect x="190" y="100" width="16" height="1" fill="rgba(255,255,255,0.06)" rx="1"/>
      {/* Books 9-15 continuing */}
      <rect x="219" y="88" width="16" height="54" rx="2" fill="#ede9fe"/>
      <rect x="219" y="88" width="3" height="54" fill="#a78bfa" opacity="0.5"/>
      <rect x="238" y="78" width="19" height="64" rx="2" fill="#d1fae5"/>
      <rect x="238" y="78" width="3" height="64" fill="#34d399" opacity="0.4"/>
      <rect x="260" y="92" width="13" height="50" rx="1" fill="#fee2e2"/>
      <rect x="260" y="92" width="3" height="50" fill="#f87171" opacity="0.5"/>
      <rect x="276" y="80" width="21" height="62" rx="2" fill="#dbeafe"/>
      <rect x="276" y="80" width="4" height="62" fill="#3b82f6" opacity="0.6"/>
      <rect x="300" y="86" width="15" height="56" rx="1" fill="#ffedd5"/>
      <rect x="300" y="86" width="3" height="56" fill="#fb923c" opacity="0.5"/>
      <rect x="318" y="74" width="26" height="68" rx="2" fill="#fef3c7"/>
      <rect x="318" y="74" width="4" height="68" fill="#c8a55a" opacity="0.65"/>
      <rect x="323" y="88" width="16" height="1.5" fill="rgba(200,192,255,0.65)" rx="1"/>
      <rect x="347" y="90" width="17" height="52" rx="2" fill="#ccfbf1"/>
      <rect x="347" y="90" width="3" height="52" fill="#2dd4bf" opacity="0.5"/>
      <rect x="367" y="82" width="14" height="60" rx="1" fill="#fae8ff"/>
      <rect x="367" y="82" width="3" height="60" fill="#e879f9" opacity="0.4"/>
      <rect x="384" y="76" width="22" height="66" rx="2" fill="#e0f2fe"/>
      <rect x="384" y="76" width="4" height="66" fill="#38bdf8" opacity="0.5"/>
      <rect x="409" y="88" width="15" height="54" rx="1" fill="#fef9c3"/>
      <rect x="409" y="88" width="3" height="54" fill="#c8a55a" opacity="0.5"/>
      <rect x="427" y="80" width="18" height="62" rx="2" fill="#f5f3ff"/>
      <rect x="427" y="80" width="3" height="62" fill="#a16207" opacity="0.6"/>

      {/* ========== BOOKSHELF 2 (middle) ========== */}
      <rect x="20" y="300" width="440" height="12" fill="#5c52c8" rx="2"/>
      <rect x="20" y="310" width="440" height="4" fill="#3e39a0"/>
      <rect x="20" y="312" width="440" height="6" fill="rgba(0,0,0,0.30)"/>

      {/* Books on shelf 2 */}
      <rect x="35" y="240" width="18" height="62" rx="2" fill="#ede9fe"/>
      <rect x="35" y="240" width="3" height="62" fill="#7c3aed" opacity="0.6"/>
      <rect x="56" y="250" width="14" height="52" rx="1" fill="#d1fae5"/>
      <rect x="56" y="250" width="3" height="52" fill="#16a34a" opacity="0.5"/>
      <rect x="73" y="238" width="28" height="64" rx="2" fill="#fef3c7"/>
      <rect x="73" y="238" width="5" height="64" fill="#ca8a04" opacity="0.6"/>
      <rect x="78" y="252" width="18" height="1.5" fill="rgba(255,255,255,0.1)" rx="1"/>
      <rect x="104" y="245" width="16" height="57" rx="1" fill="#fae8ff"/>
      <rect x="104" y="245" width="3" height="57" fill="#c026d3" opacity="0.5"/>
      <rect x="123" y="252" width="20" height="50" rx="2" fill="#dbeafe"/>
      <rect x="123" y="252" width="3" height="50" fill="#0ea5e9" opacity="0.5"/>
      <rect x="146" y="240" width="15" height="62" rx="1" fill="#fee2e2"/>
      <rect x="146" y="240" width="3" height="62" fill="#ef4444" opacity="0.5"/>
      <rect x="164" y="248" width="22" height="54" rx="2" fill="#d1fae5"/>
      <rect x="164" y="248" width="4" height="54" fill="#22c55e" opacity="0.45"/>
      <rect x="189" y="236" width="13" height="66" rx="1" fill="#3e39a0"/>
      <rect x="189" y="236" width="3" height="66" fill="#f97316" opacity="0.6"/>
      <rect x="205" y="244" width="25" height="58" rx="2" fill="#dbeafe"/>
      <rect x="205" y="244" width="4" height="58" fill="#2563eb" opacity="0.5"/>
      <rect x="233" y="250" width="17" height="52" rx="1" fill="#fef9c3"/>
      <rect x="233" y="250" width="3" height="52" fill="#eab308" opacity="0.5"/>
      <rect x="253" y="240" width="20" height="62" rx="2" fill="#cffafe"/>
      <rect x="253" y="240" width="3" height="62" fill="#06b6d4" opacity="0.5"/>
      <rect x="276" y="246" width="14" height="56" rx="1" fill="#fae8ff"/>
      <rect x="276" y="246" width="3" height="56" fill="#d946ef" opacity="0.5"/>
      <rect x="293" y="238" width="26" height="64" rx="2" fill="#fef3c7"/>
      <rect x="293" y="238" width="5" height="64" fill="#c8a55a" opacity="0.55"/>
      <rect x="322" y="248" width="16" height="54" rx="1" fill="#ccfbf1"/>
      <rect x="322" y="248" width="3" height="54" fill="#14b8a6" opacity="0.5"/>
      <rect x="341" y="242" width="19" height="60" rx="2" fill="#ede9fe"/>
      <rect x="341" y="242" width="3" height="60" fill="#8b5cf6" opacity="0.5"/>
      <rect x="363" y="250" width="14" height="52" rx="1" fill="#fee2e2"/>
      <rect x="363" y="250" width="3" height="52" fill="#f43f5e" opacity="0.5"/>
      <rect x="380" y="240" width="22" height="62" rx="2" fill="#d1fae5"/>
      <rect x="380" y="240" width="4" height="62" fill="#10b981" opacity="0.5"/>
      <rect x="405" y="246" width="16" height="56" rx="1" fill="#dbeafe"/>
      <rect x="405" y="246" width="3" height="56" fill="#60a5fa" opacity="0.5"/>
      <rect x="424" y="238" width="20" height="64" rx="2" fill="#ffedd5"/>
      <rect x="424" y="238" width="3" height="64" fill="#f97316" opacity="0.45"/>

      {/* ========== READING DESK (bottom) ========== */}
      {/* Desk surface */}
      <rect x="100" y="420" width="280" height="16" rx="3" fill="#5c52c8"/>
      <rect x="100" y="434" width="280" height="6" fill="#3e39a0"/>
      {/* Desk legs */}
      <rect x="110" y="436" width="16" height="60" fill="#4a44a8"/>
      <rect x="354" y="436" width="16" height="60" fill="#4a44a8"/>

      {/* Open book on desk */}
      <g transform="translate(200, 386)">
        {/* Left page */}
        <path d="M0 0 C0 0 -50 2 -50 6 L-50 36 C-50 38 0 36 0 36 Z" fill="#f5f0e8"/>
        <line x1="-45" y1="12" x2="-8" y2="12" stroke="#d4c9b5" strokeWidth="1"/>
        <line x1="-45" y1="17" x2="-8" y2="17" stroke="#d4c9b5" strokeWidth="1"/>
        <line x1="-45" y1="22" x2="-8" y2="22" stroke="#d4c9b5" strokeWidth="1"/>
        <line x1="-45" y1="27" x2="-20" y2="27" stroke="#d4c9b5" strokeWidth="1"/>
        {/* Right page */}
        <path d="M0 0 C0 0 50 2 50 6 L50 36 C50 38 0 36 0 36 Z" fill="#ede8df"/>
        <line x1="8" y1="12" x2="45" y2="12" stroke="#d4c9b5" strokeWidth="1"/>
        <line x1="8" y1="17" x2="45" y2="17" stroke="#d4c9b5" strokeWidth="1"/>
        <line x1="8" y1="22" x2="45" y2="22" stroke="#d4c9b5" strokeWidth="1"/>
        <line x1="8" y1="27" x2="35" y2="27" stroke="#d4c9b5" strokeWidth="1"/>
        {/* Spine */}
        <rect x="-2" y="0" width="4" height="36" fill="#8b7355"/>
        {/* Book glow */}
        <ellipse cx="0" cy="36" rx="40" ry="6" fill="rgba(245,191,70,0.15)"/>
      </g>

      {/* Desk lamp */}
      <g transform="translate(370, 360)">
        {/* Lamp base */}
        <rect x="-8" y="50" width="16" height="6" rx="3" fill="#8078e0"/>
        <rect x="-3" y="20" width="6" height="32" fill="#5c52c8"/>
        {/* Lamp arm */}
        <line x1="0" y1="20" x2="-20" y2="5" stroke="#5c52c8" strokeWidth="5" strokeLinecap="round"/>
        {/* Lamp shade */}
        <path d="M-35 5 L-5 5 L-10 -12 L-30 -12 Z" fill="#3e39a0"/>
        <path d="M-35 5 L-5 5" stroke="#a89cf7" strokeWidth="1.5" opacity="0.6"/>
        {/* Light cone */}
        <path d="M-20 5 L-50 45 L10 45 Z" fill="rgba(108,95,199,0.10)"/>
        {/* Bulb glow */}
        <circle cx="-20" cy="3" r="3" fill="rgba(168,156,247,0.90)"/>
        <circle cx="-20" cy="3" r="8" fill="rgba(124,111,224,0.20)"/>
      </g>

      {/* ========== ATMOSPHERIC EFFECTS ========== */}
      {/* Warm glow around lamp area */}
      <ellipse cx="350" cy="415" rx="80" ry="40" fill="rgba(78,203,168,0.08)"/>
      {/* Cool blue window light from top-right */}
      <rect x="360" y="20" width="80" height="100" fill="rgba(96,165,250,0.08)" rx="4"/>
      <rect x="362" y="22" width="76" height="96" stroke="rgba(124,111,224,0.20)" strokeWidth="1" fill="none" rx="3"/>
      {/* Window cross */}
      <line x1="400" y1="22" x2="400" y2="118" stroke="rgba(124,111,224,0.14)" strokeWidth="2"/>
      <line x1="362" y1="70" x2="438" y2="70" stroke="rgba(124,111,224,0.14)" strokeWidth="2"/>

      {/* Dust particles */}
      {[{x:80,y:180},{x:200,y:60},{x:340,y:200},{x:420,y:120},{x:150,y:380},{x:280,y:340}].map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="rgba(200,192,255,0.65)" opacity={0.4 + i*0.1}/>
      ))}

      {/* Floor shadow */}
      <ellipse cx="240" cy="510" rx="200" ry="15" fill="rgba(0,0,0,0.22)"/>
      {/* Subtle inner shadow overlay for depth */}
      <rect x="0" y="380" width="480" height="140" fill="url(#bottomFade)" opacity="0.4"/>
      <defs><linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1660" stopOpacity="0"/><stop offset="100%" stopColor="#1a1660" stopOpacity="0.6"/></linearGradient></defs>
    </svg>
  );
}
