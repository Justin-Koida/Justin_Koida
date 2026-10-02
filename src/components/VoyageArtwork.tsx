/** Original vector artwork keeps the map crisp and its moving parts lightweight. */
export function ShipArtwork() {
  return <g className="ship-bob" stroke="#21374c" strokeWidth="2.6" strokeLinejoin="round">
    <ellipse className="ship-wake" cx="0" cy="34" rx="62" ry="9" fill="none" stroke="#f4ffff" strokeWidth="3" />
    <path d="M-51 13 Q-38 49 22 37 Q43 32 54 6 L33 15Z" fill="#aa6843" />
    <path d="M-47 17 Q-22 37 21 29 L43 17 Q29 43-8 40Z" fill="#713e34" stroke="none" />
    <path d="M-44 24 Q0 44 41 21 L34 30 Q0 49-37 33Z" fill="#198a9b" />
    <path d="M-49 13 Q0 28 53 6" fill="none" stroke="#f0c477" strokeWidth="5" />
    <path d="M-38 12 V-3 H-21 V17" fill="#be7950" />
    <path d="M-42-4 H-18 L-22-10 H-38Z" fill="#e95145" />
    <path d="M-12 18 V-63 M22 14 V-43 M44 10 L64-4" fill="none" stroke="#674735" strokeWidth="3" />
    <g className="ship-sails" fill="#fff9dd">
      <path d="M-15-49 Q-39-31-34 0 Q-21-7-15 2Z" />
      <path d="M-8-49 Q21-37 14-9 Q1-15-8-9Z" />
      <path d="M26-37 Q43-20 46-3 L26 3Z" />
    </g>
    <path d="M-8-49 Q6-29 14-9 L-8-9Z" fill="#ebca8e" stroke="none" opacity=".65" />
    <path d="M-30-4 L-12-57 M24-39 L43 13" stroke="#705543" strokeWidth="1" />
    <path d="M-47 17 Q-20 26 9 23" fill="none" stroke="#ffe5a0" strokeWidth="2" />
    <g className="ship-flag"><path d="M-12-65 Q2-73 17-65 L14-45 Q1-53-12-46Z" fill="#21374c" />
      <circle cx="2" cy="-59" r="7" fill="#f6cc67" stroke="none" />
      <path d="M-1-61v1 M5-61v1 M-1-57 Q2-53 5-57" fill="none" strokeWidth="1.3" />
    </g>
    <path d="M-23 29 Q-16 21-9 29 T5 29 T19 29" fill="none" stroke="#f5cd7c" strokeWidth="2" />
    <path d="M47 14 Q66 7 57-3 Q49-8 48 0 Q50 5 55 1" fill="#f1c373" />
    <g fill="#f7c65b" strokeWidth="1.3"><circle cx="-27" cy="23" r="3" /><circle cx="-12" cy="27" r="3" /><circle cx="5" cy="28" r="3" /><circle cx="22" cy="24" r="3" /></g>
    <circle cx="-31" cy="6" r="3" fill="#ffe7a6" />
  </g>
}

export function IslandArtwork({ variant }: { variant: number }) {
  return <svg viewBox="0 0 300 180" className="island-art" aria-hidden="true" fill="none" stroke="#244953" strokeWidth="3" strokeLinejoin="round">
    <ellipse className="island-ripple" cx="150" cy="144" rx="139" ry="26" stroke="#e0ffff" strokeWidth="3" />
    <path d="M29 123 Q18 151 73 160 L216 163 Q279 154 273 130 L241 114 69 109Z" fill="#c9844f" />
    <path d="M29 120 Q55 94 92 107 Q148 80 198 104 Q251 96 274 126 Q269 147 216 151 L78 150 Q31 143 29 120Z" fill="#ffe49d" />
    <path d="M48 117 Q74 99 102 106 Q148 86 195 107 Q234 99 255 122 Q241 139 198 138 L89 138Q57 133 48 117Z" fill="#83ce65" />
    <path d="M95 113 L113 72 132 78 146 25 168 75 181 64 199 118Z" fill="#55ae83" /><path d="M146 25 L161 117 199 118Z" fill="#27766d" /><path d="M134 60 L146 25 160 60 148 52 141 62Z" fill="#e7eed6" />
    {variant === 0 ? <g><path d="M172 123 V68 L199 56 224 70 V128Z" fill="#e9d8ac" /><path d="M199 56 V124 L224 128V70Z" fill="#b9b89c" /><path d="M170 68L198 51 228 68 199 81Z" fill="#467a86" />{[86, 99, 112].map(y => <path key={y} d={`M179 ${y}h12 M205 ${y+2}h11`} stroke="#426e7a" strokeWidth="5" />)}</g>
    : variant === 1 ? <g><path d="M170 125V94H233V127Z" fill="#ead9b0" /><path d="M164 94 Q201 40 239 94Z" fill="#69cddd" /><path d="M200 68V94 M177 82H224" stroke="#e1f3df" /><path d="M197 66L211 47 229 41" stroke="#436c70" strokeWidth="7" /><circle cx="230" cy="40" r="5" fill="#efc76c" /></g>
    : variant === 2 ? <g><path d="M161 125V87H238V127Z" fill="#f6e5bd" /><path d="M156 86L199 65 242 86Z" fill="#e5754f" /><path d="M171 94V117 M189 94V117 M208 94V117 M227 94V117" stroke="#b7ab86" strokeWidth="7" /><path d="M155 127H244" strokeWidth="5" /></g>
    : <g><path d="M169 125V93H208V127Z" fill="#f4d39c" /><path d="M163 94L188 69 215 94Z" fill="#cb775b" /><path d="M184 126V108H195V126" fill="#548181" /><path d="M213 130V104H245V131Z" fill="#f3e4b5" /><path d="M209 104L229 84 249 104Z" fill="#4d8e92" /></g>}
    <g className="island-palms"><path d="M77 125 Q85 98 75 79" stroke="#956641" strokeWidth="6" /><path d="M75 80Q44 62 40 86Q57 76 75 80 M75 80Q97 55 112 79Q91 74 75 80 M75 80Q65 51 53 64 M75 80Q92 84 95 100" fill="#42a85f" stroke="#37715f" strokeWidth="3" /></g>
    <path d="M61 133l13 3m29-16 10 3m91 12 13-3" stroke="#d8f7a3" strokeWidth="3" />
    <path d="M38 153q20 10 40 7m144 5 34-8" stroke="#fffbea" strokeWidth="3" />
    <path d="M117 143Q145 130 167 139" stroke="#fff0c4" strokeWidth="6" /><path d="M231 140L265 151 M232 147L260 157" stroke="#a77a50" strokeWidth="5" />
  </svg>
}

/** Pixel-sized timber pier extending from the berth into the painted beach. */
export function DockArtwork({ dx, dy }: { dx: number; dy: number }) {
  const length = Math.hypot(dx, dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  const planks = Math.max(2, Math.ceil(length / 11))
  return <g transform={`rotate(${angle})`} stroke="#594531" strokeWidth="1.3" strokeLinejoin="round">
    <path d={`M-5 7 H${length + 7} V13 H-5Z`} fill="#694d35" />
    <path d={`M-5-9 H${length + 7} V8 H-5Z`} fill="#dba46a" />
    {Array.from({ length: planks }, (_, i) => {
      const x = i * length / planks
      return <g key={i}>
        <path d={`M${x}-8 V7`} stroke="#87603f" />
        <path d={`M${x + 3}-5 v7`} stroke="#f3c78a" strokeWidth="1" />
        <circle cx={x + 4} cy={5} r=".8" fill="#594531" stroke="none" />
      </g>
    })}
    {[0, length * .5, length].map((x, i) => <g key={i}>
      <path d={`M${x - 3} 5 v15 h6 V5Z`} fill="#81583a" />
      <ellipse cx={x} cy={5} rx="4" ry="2.5" fill="#f0ca8c" />
      <path d={`M${x - 3}-9 v-9 h6 v9Z`} fill="#a5794c" />
      <ellipse cx={x} cy={-18} rx="4" ry="2.5" fill="#f0ca8c" />
      <path d={`M${x - 3}-13h6`} stroke="#e9d5a3" strokeWidth="2" />
    </g>)}
    <path d={`M0-16 Q${length / 4}-9 ${length / 2}-16 Q${length * .75}-9 ${length}-16`} fill="none" stroke="#f6ddb1" strokeWidth="2" />
  </g>
}
