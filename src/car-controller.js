const waitFor = (selector, fn) => {
  const run = () => { const el = document.querySelector(selector); if (el) fn(el); };
  run();
  const observer = new MutationObserver(run);
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 12000);
};

waitFor('.car-scene', (scene) => {
  if (scene.dataset.chCarReady === '1') return;
  scene.dataset.chCarReady = '1';

  scene.innerHTML = `
    <div class="premium-car-art" aria-label="CH Auto premium sedan showcase">
      <svg class="premium-car-svg" viewBox="0 0 900 430" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef4f0"/><stop offset=".22" stop-color="#9aa9a4"/><stop offset=".5" stop-color="#17211f"/><stop offset=".72" stop-color="#566661"/><stop offset="1" stop-color="#111916"/></linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#263c36"/><stop offset=".5" stop-color="#07100e"/><stop offset="1" stop-color="#42675a"/></linearGradient>
          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#6f817b"/><stop offset=".5" stop-color="#f0f5f1"/><stop offset="1" stop-color="#394843"/></linearGradient>
          <linearGradient id="lamp" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#ffffff"/><stop offset=".55" stop-color="#d8fff0"/><stop offset="1" stop-color="#e8bd55"/></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="soft"><feGaussianBlur stdDeviation="16"/></filter>
        </defs>
        <ellipse cx="450" cy="382" rx="310" ry="24" fill="#000" opacity=".7" filter="url(#soft)"/>
        <ellipse cx="450" cy="370" rx="285" ry="13" fill="#e8bd55" opacity=".13" filter="url(#glow)"/>
        <path d="M115 305 C132 266 177 239 244 225 L325 137 C348 111 386 94 437 92 L562 96 C602 99 637 116 665 146 L738 228 C786 242 816 265 831 305 L812 338 C778 349 739 351 698 351 L209 351 C172 350 140 342 112 329Z" fill="url(#body)" stroke="#e5eee9" stroke-opacity=".55" stroke-width="3"/>
        <path d="M310 143 L345 116 C364 101 390 95 426 95 L548 99 C581 101 609 114 631 139 L674 220 L268 220Z" fill="url(#glass)" stroke="#dce8e2" stroke-opacity=".35" stroke-width="2"/>
        <path d="M439 101 L443 218" stroke="#e8bd55" stroke-opacity=".3" stroke-width="2"/>
        <path d="M274 224 L667 224" stroke="#e8bd55" stroke-opacity=".45" stroke-width="3"/>
        <path d="M160 278 C226 252 311 242 450 242 C584 242 683 251 753 277" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="5"/>
        <path d="M130 305 C200 294 258 290 330 292" fill="none" stroke="#e8bd55" stroke-opacity=".38" stroke-width="2"/>
        <path d="M570 292 C654 288 731 294 799 305" fill="none" stroke="#e8bd55" stroke-opacity=".38" stroke-width="2"/>
        <path d="M115 292 L189 263 L230 274 L206 304 L126 317Z" fill="#101815" stroke="#9fb1aa" stroke-opacity=".25"/>
        <path d="M683 264 L753 251 L817 289 L807 318 L722 303Z" fill="#111916" stroke="#9fb1aa" stroke-opacity=".25"/>
        <path d="M178 269 L226 248 L282 257 L257 279 L195 286Z" fill="url(#lamp)" opacity=".95"/>
        <path d="M682 256 L741 250 L783 275 L718 281Z" fill="url(#lamp)" opacity=".95"/>
        <path d="M187 275 L226 258" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
        <path d="M691 262 L741 257" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
        <path d="M377 264 Q450 245 523 264 L510 320 Q450 337 390 320Z" fill="#07100e" stroke="#dce7e2" stroke-opacity=".3" stroke-width="2"/>
        <path d="M397 269 Q450 255 503 269 L493 309 Q450 319 407 309Z" fill="#000"/>
        <g fill="#8d9c97"><circle cx="420" cy="284" r="4"/><circle cx="450" cy="280" r="4"/><circle cx="480" cy="284" r="4"/></g>
        <g stroke="#cbd8d3" stroke-width="3" opacity=".7"><path d="M390 271 L377 310"/><path d="M510 271 L523 310"/></g>
        <path d="M304 232 L326 232 L318 281 L297 281Z" fill="#d8e2de" opacity=".55"/>
        <path d="M581 232 L604 233 L615 281 L594 281Z" fill="#d8e2de" opacity=".55"/>
        <g><circle cx="250" cy="337" r="59" fill="#080d0b" stroke="#b9c7c1" stroke-width="5"/><circle cx="250" cy="337" r="42" fill="#1b2522" stroke="#687872" stroke-width="4"/><circle cx="250" cy="337" r="9" fill="#e8bd55"/><g stroke="#aab8b3" stroke-width="5"><path d="M250 300 V374"/><path d="M213 337 H287"/><path d="M224 311 L276 363"/><path d="M276 311 L224 363"/></g></g>
        <g><circle cx="686" cy="337" r="59" fill="#080d0b" stroke="#b9c7c1" stroke-width="5"/><circle cx="686" cy="337" r="42" fill="#1b2522" stroke="#687872" stroke-width="4"/><circle cx="686" cy="337" r="9" fill="#e8bd55"/><g stroke="#aab8b3" stroke-width="5"><path d="M686 300 V374"/><path d="M649 337 H723"/><path d="M660 311 L712 363"/><path d="M712 311 L660 363"/></g></g>
        <path d="M318 329 Q450 356 582 329" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="4"/>
        <rect x="402" y="307" width="96" height="23" rx="4" fill="#f0ead9"/><text x="450" y="323" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="#0b120f" letter-spacing="3">CH AUTO</text>
      </svg>
      <div class="car-reflection"></div>
    </div>`;

  const controls = document.querySelector('.car-controls');
  if (controls) controls.innerHTML = '<span>↔ Drag to inspect</span><span>◎ Pinch / wheel to zoom</span>';

  const isMobile = matchMedia('(max-width: 700px)').matches;
  const maxAngle = isMobile ? 17 : 24;
  let last = '';
  const apply = () => {
    const raw = scene.style.transform || '';
    const sm = raw.match(/scale\(([-\d.]+)\)/);
    const rm = raw.match(/rotateY\(([-\d.]+)deg\)/);
    const scale = Math.max(.9, Math.min(1.2, sm ? Number(sm[1]) : 1));
    let angle = rm ? Number(rm[1]) : 0;
    if (!Number.isFinite(angle)) angle = 0;
    angle = Math.max(-maxAngle, Math.min(maxAngle, angle));
    const next = `scale(${scale}) rotateY(${angle}deg)`;
    if (next !== last) { last = next; scene.style.transform = next; scene.dataset.angle = String(angle); }
  };
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(scene, {attributes:true, attributeFilter:['style']});
  window.addEventListener('resize', apply, {passive:true});
});
