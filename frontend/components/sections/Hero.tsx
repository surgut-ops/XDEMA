'use client';
import { useEffect, useRef } from 'react';
import { useSettingsStore, useModalStore } from '@/store';
import { usePerformanceStore } from '@/store';
import Link from 'next/link';

export function Hero() {
  const { settings } = useSettingsStore();
  const { perfMode } = usePerformanceStore();
  const swRef = useRef<HTMLDivElement>(null);
  const hero = settings.hero || {};
  const title = hero.title || 'XDEMA';
  const sub1 = hero.sub1 || 'DJ · Mentor · Live Energy';
  const sub2 = hero.sub2 || 'Обучение · Мероприятия · Live QR';
  const titleSz = hero.titleSize ? `${hero.titleSize}rem` : 'var(--hero-title-sz)';
  const subSz = hero.subSize ? `${hero.subSize}rem` : 'var(--hero-sub-sz)';

  useEffect(() => {
    if (!swRef.current || perfMode) return;
    swRef.current.innerHTML = '';
    for (let i = 0; i < 34; i++) {
      const bar = document.createElement('div');
      bar.className = 'soundwave-bar';
      const h = 6 + Math.random() * 22;
      bar.style.cssText = `height:${h}px;animation-delay:${(i*1.2/34).toFixed(2)}s;animation-duration:${(.7+Math.random()*.8).toFixed(2)}s`;
      swRef.current.appendChild(bar);
    }
  }, [perfMode]);

  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 py-8">
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.04) 1px,transparent 1px)', backgroundSize:'55px 55px', maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black 10%,transparent 80%)', WebkitMaskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black 10%,transparent 80%)' }} />

      {/* DJ Console SVG */}
      <div className={`hero-console w-full max-w-[430px] mb-6 ${perfMode ? '' : 'animate-float'}`}
        style={perfMode ? {} : { filter: 'drop-shadow(0 0 32px rgba(0,229,255,.38)) drop-shadow(0 0 65px rgba(255,45,120,.14))' }}>
        <DJConsoleSVG />
      </div>

      {/* Text */}
      <p className="font-mono text-[.67rem] tracking-[.28em] uppercase mb-3 opacity-80" style={{ color:'var(--c1)' }}>
        Electronic Experience Architect
      </p>
      <h1 className="hero-title font-syne mb-2" style={{ fontSize: titleSz }}>
        {title}
      </h1>
      <p className="font-syne font-semibold tracking-[.22em] uppercase mb-1" style={{ fontSize: subSz, color:'var(--muted)' }}>
        {sub1}
      </p>
      <p className="text-[.84rem] tracking-[.12em] mb-6" style={{ color:'var(--muted2)', letterSpacing:'.12em' }}>
        {sub2}
      </p>

      {/* Soundwave */}
      {!perfMode && (
        <div ref={swRef} className="soundwave flex items-center gap-[3px] h-7 mb-6" />
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/courses" className="btn-c1 btn-pulse px-6 py-3 rounded-xl text-sm font-semibold text-black font-dm transition-all hover:-translate-y-0.5"
          style={{ background:'linear-gradient(135deg,var(--c1),#009ab8)', boxShadow:'0 4px 18px rgba(0,229,255,.25)' }}>
          Обучение
        </Link>
        <Link href="/services" className="px-6 py-3 rounded-xl text-sm font-semibold text-white font-dm transition-all hover:-translate-y-0.5"
          style={{ background:'linear-gradient(135deg,var(--c2),#aa0044)', boxShadow:'0 4px 18px rgba(255,45,120,.25)' }}>
          Заказать DJ
        </Link>
        <Link href="/corporate" className="px-6 py-3 rounded-xl text-sm font-semibold font-dm transition-all"
          style={{ background:'var(--glass2)', border:'1px solid var(--border)', color:'var(--text2)' }}>
          Корпоративы
        </Link>
        <Link href="/live" className="px-6 py-3 rounded-xl text-sm font-semibold text-black font-dm transition-all hover:-translate-y-0.5"
          style={{ background:'linear-gradient(135deg,var(--c3),#bbaa00)', boxShadow:'0 4px 18px rgba(255,214,0,.25)' }}>
          Live QR
        </Link>
        <Link href="/contacts" className="px-6 py-3 rounded-xl text-sm font-semibold font-dm transition-all"
          style={{ background:'transparent', border:'1.5px solid var(--bord2)', color:'var(--text2)' }}>
          Контакты
        </Link>
      </div>
    </section>
  );
}

function DJConsoleSVG() {
  return (
    <svg viewBox="0 0 440 325" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15152a"/><stop offset="100%" stopColor="#09090f"/>
        </linearGradient>
        <linearGradient id="ledG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00e5ff"/><stop offset="100%" stopColor="#ff2d78"/>
        </linearGradient>
        <radialGradient id="glL" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity=".5"/><stop offset="100%" stopColor="#00e5ff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glR" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff2d78" stopOpacity=".45"/><stop offset="100%" stopColor="#ff2d78" stopOpacity="0"/>
        </radialGradient>
        <filter id="gw"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="18" y="68" width="404" height="222" rx="20" fill="url(#bodyG)" stroke="rgba(0,229,255,.14)" strokeWidth="1"/>
      <rect x="28" y="77" width="384" height="4" rx="2" fill="url(#ledG)" className="led-strip" filter="url(#gw)"/>
      {/* Left disk */}
      <circle cx="122" cy="192" r="78" fill="url(#glL)" opacity=".22"/>
      <circle cx="122" cy="192" r="71" fill="rgba(255,255,255,.015)" stroke="rgba(0,229,255,.26)" strokeWidth="1.5"/>
      <g className="vinyl-l">
        <circle cx="122" cy="192" r="64" fill="rgba(0,229,255,.03)" stroke="rgba(0,229,255,.15)" strokeWidth="1"/>
        <circle cx="122" cy="192" r="57" fill="none" stroke="rgba(0,229,255,.08)" strokeWidth=".5" strokeDasharray="5 3"/>
        <circle cx="122" cy="192" r="49" fill="none" stroke="rgba(0,229,255,.06)" strokeWidth=".5"/>
        <circle cx="122" cy="192" r="41" fill="none" stroke="rgba(0,229,255,.05)" strokeWidth=".5"/>
        <line x1="122" y1="192" x2="122" y2="132" stroke="rgba(0,229,255,.3)" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <circle cx="122" cy="192" r="19" fill="rgba(0,229,255,.14)" stroke="rgba(0,229,255,.4)" strokeWidth="1.5"/>
      <circle cx="122" cy="192" r="5" fill="#00e5ff" filter="url(#gw)"/>
      {/* Right disk */}
      <circle cx="318" cy="192" r="78" fill="url(#glR)" opacity=".22"/>
      <circle cx="318" cy="192" r="71" fill="rgba(255,255,255,.015)" stroke="rgba(255,45,120,.26)" strokeWidth="1.5"/>
      <g className="vinyl-r">
        <circle cx="318" cy="192" r="64" fill="rgba(255,45,120,.03)" stroke="rgba(255,45,120,.15)" strokeWidth="1"/>
        <circle cx="318" cy="192" r="57" fill="none" stroke="rgba(255,45,120,.08)" strokeWidth=".5" strokeDasharray="5 3"/>
        <circle cx="318" cy="192" r="49" fill="none" stroke="rgba(255,45,120,.06)" strokeWidth=".5"/>
        <circle cx="318" cy="192" r="41" fill="none" stroke="rgba(255,45,120,.05)" strokeWidth=".5"/>
        <line x1="318" y1="192" x2="318" y2="132" stroke="rgba(255,45,120,.3)" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <circle cx="318" cy="192" r="19" fill="rgba(255,45,120,.12)" stroke="rgba(255,45,120,.4)" strokeWidth="1.5"/>
      <circle cx="318" cy="192" r="5" fill="#ff2d78" filter="url(#gw)"/>
      {/* Mixer */}
      <rect x="191" y="103" width="58" height="162" rx="10" fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
      <rect x="211" y="236" width="14" height="9" rx="2" fill="url(#ledG)"/>
      <rect x="200" y="150" width="7" height="12" rx="2" fill="#00e5ff" className="pad-a"/>
      <rect x="233" y="136" width="7" height="12" rx="2" fill="#ff2d78" className="pad-b"/>
      <circle cx="220" cy="120" r="6" fill="rgba(255,255,255,.07)" stroke="rgba(0,229,255,.5)" strokeWidth="1.5"/>
      <circle cx="220" cy="136" r="6" fill="rgba(255,255,255,.07)" stroke="rgba(0,229,255,.35)" strokeWidth="1.5"/>
      <circle cx="220" cy="152" r="6" fill="rgba(255,255,255,.07)" stroke="rgba(255,45,120,.35)" strokeWidth="1.5"/>
      {/* Waveforms */}
      <rect x="40" y="255" width="82" height="13" rx="4" fill="rgba(0,0,0,.4)"/>
      <polyline points="42,262 48,257 54,267 60,254 66,261 72,258 78,265 84,256 90,261 96,259 102,262 108,256 114,261 118,257" fill="none" stroke="rgba(0,229,255,.85)" strokeWidth="1.3"/>
      <rect x="318" y="255" width="82" height="13" rx="4" fill="rgba(0,0,0,.4)"/>
      <polyline points="320,261 326,265 332,257 338,262 344,255 350,261 356,266 362,257 368,261 374,258 380,264 386,257 392,261 396,257" fill="none" stroke="rgba(255,45,120,.85)" strokeWidth="1.3"/>
      {/* Pads */}
      <rect x="40" y="273" width="11" height="7" rx="2" fill="rgba(0,229,255,.75)" className="pad-a" filter="url(#gw)"/>
      <rect x="55" y="273" width="11" height="7" rx="2" fill="rgba(0,229,255,.45)" className="pad-b"/>
      <rect x="70" y="273" width="11" height="7" rx="2" fill="rgba(0,229,255,.2)" className="pad-c"/>
      <rect x="85" y="273" width="11" height="7" rx="2" fill="rgba(255,214,0,.4)" className="pad-a"/>
      <rect x="334" y="273" width="11" height="7" rx="2" fill="rgba(255,45,120,.75)" className="pad-b" filter="url(#gw)"/>
      <rect x="349" y="273" width="11" height="7" rx="2" fill="rgba(255,45,120,.45)" className="pad-c"/>
      <rect x="364" y="273" width="11" height="7" rx="2" fill="rgba(255,45,120,.2)" className="pad-a"/>
      <rect x="379" y="273" width="11" height="7" rx="2" fill="rgba(255,214,0,.4)" className="pad-b"/>
      <rect x="183" y="293" width="74" height="13" rx="4" fill="rgba(0,0,0,.55)"/>
      <text x="220" y="303.5" fontFamily="Space Mono,monospace" fontSize="7.5" fill="rgba(0,229,255,.7)" textAnchor="middle">128.0 BPM</text>
      <text x="220" y="65" fontFamily="Syne,sans-serif" fontSize="10" fill="rgba(255,255,255,.18)" textAnchor="middle" letterSpacing="6" fontWeight="700">XDEMA</text>
    </svg>
  );
}
