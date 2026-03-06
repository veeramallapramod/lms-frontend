// Beautiful dark library illustration for auth left panel
export default function LibraryIllustration() {
  return (
    <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '420px', opacity: 0.92 }}>
      {/* Background wall */}
      <rect width="480" height="520" fill="#0a0705"/>

      {/* Ambient ceiling light */}
      <ellipse cx="240" cy="0" rx="180" ry="60" fill="rgba(251,191,36,0.07)"/>

      {/* Back wall paneling */}
      <rect x="20" y="20" width="440" height="480" rx="2" fill="#110a04" stroke="#1f1208" strokeWidth="1"/>

      {/* Wall vertical panels */}
      {[80, 160, 240, 320, 400].map(x => (
        <line key={x} x1={x} y1="20" x2={x} y2="500" stroke="#1a0e06" strokeWidth="1.5"/>
      ))}

      {/* ========== BOOKSHELF 1 (top) ========== */}
      {/* Shelf board */}
      <rect x="20" y="140" width="440" height="12" fill="#2d1507" rx="2"/>
      <rect x="20" y="150" width="440" height="4" fill="#1a0c04"/>
      {/* Shadow under shelf */}
      <rect x="20" y="152" width="440" height="6" fill="rgba(0,0,0,0.4)"/>

      {/* Books on shelf 1 */}
      {/* Book 1 - tall blue */}
      <rect x="35" y="80" width="22" height="62" rx="2" fill="#1e3a5f"/>
      <rect x="35" y="80" width="4" height="62" fill="#2563eb" opacity="0.6"/>
      <rect x="38" y="95" width="15" height="2" fill="rgba(255,255,255,0.15)" rx="1"/>
      <rect x="38" y="100" width="10" height="1.5" fill="rgba(255,255,255,0.1)" rx="1"/>
      {/* Book 2 - short red */}
      <rect x="60" y="100" width="16" height="42" rx="2" fill="#4a1010"/>
      <rect x="60" y="100" width="3" height="42" fill="#dc2626" opacity="0.7"/>
      {/* Book 3 - tilted amber */}
      <rect x="79" y="86" width="14" height="56" rx="1" fill="#4a2e00" transform="rotate(-4 79 142)"/>
      <rect x="79" y="86" width="3" height="56" fill="#d97706" opacity="0.6" transform="rotate(-4 79 142)"/>
      {/* Book 4 - tall green */}
      <rect x="96" y="75" width="20" height="67" rx="2" fill="#0f2e1a"/>
      <rect x="96" y="75" width="3" height="67" fill="#10b981" opacity="0.5"/>
      <rect x="100" y="88" width="12" height="1.5" fill="rgba(255,255,255,0.12)" rx="1"/>
      {/* Book 5 - medium purple */}
      <rect x="119" y="90" width="18" height="52" rx="2" fill="#2d1a4a"/>
      <rect x="119" y="90" width="3" height="52" fill="#8b5cf6" opacity="0.6"/>
      {/* Book 6 - ornate gold spine */}
      <rect x="140" y="72" width="24" height="70" rx="2" fill="#2a1a00"/>
      <rect x="140" y="72" width="4" height="70" fill="#f59e0b" opacity="0.7"/>
      <rect x="145" y="85" width="14" height="1.5" fill="rgba(245,158,11,0.5)" rx="1"/>
      <rect x="145" y="90" width="10" height="1.5" fill="rgba(245,158,11,0.3)" rx="1"/>
      <rect x="145" y="128" width="14" height="1.5" fill="rgba(245,158,11,0.5)" rx="1"/>
      {/* Book 7 */}
      <rect x="167" y="95" width="14" height="47" rx="1" fill="#1a2535"/>
      <rect x="167" y="95" width="3" height="47" fill="#60a5fa" opacity="0.5"/>
      {/* Book 8 - fat dictionary */}
      <rect x="184" y="82" width="32" height="60" rx="2" fill="#1f1a0a"/>
      <rect x="184" y="82" width="5" height="60" fill="#d97706" opacity="0.4"/>
      <rect x="190" y="95" width="20" height="1.5" fill="rgba(255,255,255,0.08)" rx="1"/>
      <rect x="190" y="100" width="16" height="1" fill="rgba(255,255,255,0.06)" rx="1"/>
      {/* Books 9-15 continuing */}
      <rect x="219" y="88" width="16" height="54" rx="2" fill="#1a0f25"/>
      <rect x="219" y="88" width="3" height="54" fill="#a78bfa" opacity="0.5"/>
      <rect x="238" y="78" width="19" height="64" rx="2" fill="#0f1f10"/>
      <rect x="238" y="78" width="3" height="64" fill="#34d399" opacity="0.4"/>
      <rect x="260" y="92" width="13" height="50" rx="1" fill="#3a1515"/>
      <rect x="260" y="92" width="3" height="50" fill="#f87171" opacity="0.5"/>
      <rect x="276" y="80" width="21" height="62" rx="2" fill="#0c1a2e"/>
      <rect x="276" y="80" width="4" height="62" fill="#3b82f6" opacity="0.6"/>
      <rect x="300" y="86" width="15" height="56" rx="1" fill="#1f1200"/>
      <rect x="300" y="86" width="3" height="56" fill="#fb923c" opacity="0.5"/>
      <rect x="318" y="74" width="26" height="68" rx="2" fill="#1a0d00"/>
      <rect x="318" y="74" width="4" height="68" fill="#f59e0b" opacity="0.65"/>
      <rect x="323" y="88" width="16" height="1.5" fill="rgba(245,158,11,0.4)" rx="1"/>
      <rect x="347" y="90" width="17" height="52" rx="2" fill="#0f2020"/>
      <rect x="347" y="90" width="3" height="52" fill="#2dd4bf" opacity="0.5"/>
      <rect x="367" y="82" width="14" height="60" rx="1" fill="#200f20"/>
      <rect x="367" y="82" width="3" height="60" fill="#e879f9" opacity="0.4"/>
      <rect x="384" y="76" width="22" height="66" rx="2" fill="#0a1628"/>
      <rect x="384" y="76" width="4" height="66" fill="#38bdf8" opacity="0.5"/>
      <rect x="409" y="88" width="15" height="54" rx="1" fill="#1e1000"/>
      <rect x="409" y="88" width="3" height="54" fill="#fbbf24" opacity="0.5"/>
      <rect x="427" y="80" width="18" height="62" rx="2" fill="#15100a"/>
      <rect x="427" y="80" width="3" height="62" fill="#a16207" opacity="0.6"/>

      {/* ========== BOOKSHELF 2 (middle) ========== */}
      <rect x="20" y="300" width="440" height="12" fill="#2d1507" rx="2"/>
      <rect x="20" y="310" width="440" height="4" fill="#1a0c04"/>
      <rect x="20" y="312" width="440" height="6" fill="rgba(0,0,0,0.4)"/>

      {/* Books on shelf 2 */}
      <rect x="35" y="240" width="18" height="62" rx="2" fill="#1a0f2e"/>
      <rect x="35" y="240" width="3" height="62" fill="#7c3aed" opacity="0.6"/>
      <rect x="56" y="250" width="14" height="52" rx="1" fill="#0f2a10"/>
      <rect x="56" y="250" width="3" height="52" fill="#16a34a" opacity="0.5"/>
      <rect x="73" y="238" width="28" height="64" rx="2" fill="#1f1500"/>
      <rect x="73" y="238" width="5" height="64" fill="#ca8a04" opacity="0.6"/>
      <rect x="78" y="252" width="18" height="1.5" fill="rgba(255,255,255,0.1)" rx="1"/>
      <rect x="104" y="245" width="16" height="57" rx="1" fill="#1a1520"/>
      <rect x="104" y="245" width="3" height="57" fill="#c026d3" opacity="0.5"/>
      <rect x="123" y="252" width="20" height="50" rx="2" fill="#0f1e30"/>
      <rect x="123" y="252" width="3" height="50" fill="#0ea5e9" opacity="0.5"/>
      <rect x="146" y="240" width="15" height="62" rx="1" fill="#2a0f0f"/>
      <rect x="146" y="240" width="3" height="62" fill="#ef4444" opacity="0.5"/>
      <rect x="164" y="248" width="22" height="54" rx="2" fill="#101f10"/>
      <rect x="164" y="248" width="4" height="54" fill="#22c55e" opacity="0.45"/>
      <rect x="189" y="236" width="13" height="66" rx="1" fill="#1a0f00"/>
      <rect x="189" y="236" width="3" height="66" fill="#f97316" opacity="0.6"/>
      <rect x="205" y="244" width="25" height="58" rx="2" fill="#0d1520"/>
      <rect x="205" y="244" width="4" height="58" fill="#2563eb" opacity="0.5"/>
      <rect x="233" y="250" width="17" height="52" rx="1" fill="#1f1a00"/>
      <rect x="233" y="250" width="3" height="52" fill="#eab308" opacity="0.5"/>
      <rect x="253" y="240" width="20" height="62" rx="2" fill="#0f1a1f"/>
      <rect x="253" y="240" width="3" height="62" fill="#06b6d4" opacity="0.5"/>
      <rect x="276" y="246" width="14" height="56" rx="1" fill="#1e0f1e"/>
      <rect x="276" y="246" width="3" height="56" fill="#d946ef" opacity="0.5"/>
      <rect x="293" y="238" width="26" height="64" rx="2" fill="#1a1200"/>
      <rect x="293" y="238" width="5" height="64" fill="#f59e0b" opacity="0.55"/>
      <rect x="322" y="248" width="16" height="54" rx="1" fill="#0f1515"/>
      <rect x="322" y="248" width="3" height="54" fill="#14b8a6" opacity="0.5"/>
      <rect x="341" y="242" width="19" height="60" rx="2" fill="#15101e"/>
      <rect x="341" y="242" width="3" height="60" fill="#8b5cf6" opacity="0.5"/>
      <rect x="363" y="250" width="14" height="52" rx="1" fill="#1a0a0a"/>
      <rect x="363" y="250" width="3" height="52" fill="#f43f5e" opacity="0.5"/>
      <rect x="380" y="240" width="22" height="62" rx="2" fill="#0c1a10"/>
      <rect x="380" y="240" width="4" height="62" fill="#10b981" opacity="0.5"/>
      <rect x="405" y="246" width="16" height="56" rx="1" fill="#0f1525"/>
      <rect x="405" y="246" width="3" height="56" fill="#60a5fa" opacity="0.5"/>
      <rect x="424" y="238" width="20" height="64" rx="2" fill="#1a1000"/>
      <rect x="424" y="238" width="3" height="64" fill="#f97316" opacity="0.45"/>

      {/* ========== READING DESK (bottom) ========== */}
      {/* Desk surface */}
      <rect x="100" y="420" width="280" height="16" rx="3" fill="#2d1507"/>
      <rect x="100" y="434" width="280" height="6" fill="#1a0c04"/>
      {/* Desk legs */}
      <rect x="110" y="436" width="16" height="60" fill="#241205"/>
      <rect x="354" y="436" width="16" height="60" fill="#241205"/>

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
        <rect x="-8" y="50" width="16" height="6" rx="3" fill="#3d2010"/>
        <rect x="-3" y="20" width="6" height="32" fill="#2d1507"/>
        {/* Lamp arm */}
        <line x1="0" y1="20" x2="-20" y2="5" stroke="#2d1507" strokeWidth="5" strokeLinecap="round"/>
        {/* Lamp shade */}
        <path d="M-35 5 L-5 5 L-10 -12 L-30 -12 Z" fill="#1a0f00"/>
        <path d="M-35 5 L-5 5" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6"/>
        {/* Light cone */}
        <path d="M-20 5 L-50 45 L10 45 Z" fill="rgba(251,191,36,0.08)"/>
        {/* Bulb glow */}
        <circle cx="-20" cy="3" r="3" fill="rgba(251,191,36,0.8)"/>
        <circle cx="-20" cy="3" r="8" fill="rgba(251,191,36,0.15)"/>
      </g>

      {/* ========== ATMOSPHERIC EFFECTS ========== */}
      {/* Warm glow around lamp area */}
      <ellipse cx="350" cy="415" rx="80" ry="40" fill="rgba(251,191,36,0.04)"/>
      {/* Cool blue window light from top-right */}
      <rect x="360" y="20" width="80" height="100" fill="rgba(59,130,246,0.04)" rx="4"/>
      <rect x="362" y="22" width="76" height="96" stroke="rgba(59,130,246,0.1)" strokeWidth="1" fill="none" rx="3"/>
      {/* Window cross */}
      <line x1="400" y1="22" x2="400" y2="118" stroke="rgba(59,130,246,0.08)" strokeWidth="2"/>
      <line x1="362" y1="70" x2="438" y2="70" stroke="rgba(59,130,246,0.08)" strokeWidth="2"/>

      {/* Dust particles */}
      {[{x:80,y:180},{x:200,y:60},{x:340,y:200},{x:420,y:120},{x:150,y:380},{x:280,y:340}].map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="rgba(251,191,36,0.3)" opacity={0.4 + i*0.1}/>
      ))}

      {/* Floor shadow */}
      <ellipse cx="240" cy="510" rx="200" ry="15" fill="rgba(0,0,0,0.5)"/>
    </svg>
  );
}
