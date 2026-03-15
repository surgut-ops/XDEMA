'use client';
import { useEffect, useRef } from 'react';
import { useSettingsStore, usePerformanceStore } from '@/store';

const NOTES = ['♩','♪','♫','♬','𝄞','♪','♩','♫'];

export function HeroBg() {
  const { settings } = useSettingsStore();
  const { perfMode } = usePerformanceStore();
  const bgRef = useRef<HTMLDivElement>(null);

  // Lazy-load: не запускать тяжёлые анимации на мобильных и слабых устройствах
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      if (conn && (conn.saveData || conn.effectiveType === '2g')) {
        document.documentElement.classList.add('perf');
      }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const mem = (performance as unknown as { memory?: { totalJSHeapSize?: number } }).memory;
      if (mem && mem.totalJSHeapSize && mem.totalJSHeapSize < 50 * 1024 * 1024) {
        document.documentElement.classList.add('perf');
      }
    }
  }, []);

  useEffect(() => {
    if (perfMode) return;
    const bg = bgRef.current;
    if (!bg) return;
    const saved = settings.heroBg || { type: 'preset', id: 'orbs' };
    if (saved.type === 'image' && saved.url) {
      bg.innerHTML = '';
      bg.style.background = `url(${saved.url}) center/cover no-repeat`;
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,${(saved.overlay||55)/100})`;
      bg.appendChild(d);
    } else {
      applyPreset(bg, saved.id || 'orbs');
    }
  }, [settings.heroBg, perfMode]);

  return (
    <div ref={bgRef} className="hero-bg-layer" id="hero-bg" />
  );
}

function orb(bg: HTMLElement, w:number,h:number,col:string,op:number,l:number|null,r:number|null,t:number|null,b:number|null,del:number) {
  const d = document.createElement('div');
  d.className = 'hb-orb';
  d.style.cssText = `width:${w}px;height:${h}px;background:${col};opacity:${op};position:absolute;animation-delay:${del}s;`
    + (l!=null?`left:${l}px;`:'') + (r!=null?`right:${r}px;`:'')
    + (t!=null?`top:${t}px;`:'') + (b!=null?`bottom:${b}px;`:'');
  bg.appendChild(d);
}

function addNotes(bg: HTMLElement) {
  NOTES.forEach((note) => {
    const p = document.createElement('div');
    p.className = 'music-particle';
    p.textContent = note;
    p.style.cssText = `font-size:${10+Math.random()*14}px;color:var(--c1);left:${5+Math.random()*90}%;animation-duration:${14+Math.random()*16}s;animation-delay:${Math.random()*14}s;opacity:.17;`;
    bg.appendChild(p);
  });
}

function applyPreset(bg: HTMLElement, id: string) {
  bg.innerHTML = '';
  bg.style.background = 'none';
  const C1='rgba(0,229,255,.35)', C2='rgba(255,45,120,.35)', C3='rgba(123,97,255,.35)';

  if (id === 'orbs') {
    orb(bg,700,700,C1,.08,-200,-200,null,null,0);
    orb(bg,500,500,C2,.07,null,-150,200,null,-6);
    orb(bg,350,350,C3,.05,null,null,null,-80,-12);
  }
  if (id === 'sonic') {
    orb(bg,600,400,C1,.07,-150,null,null,null,0);
    orb(bg,400,400,C2,.06,null,-80,null,-80,-5);
    const w = document.createElement('div');
    w.className = 'sonic-wave-container';
    w.innerHTML = `<svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;position:absolute;bottom:0;left:0;opacity:.13"><path d="M0,110 C120,160 240,60 360,110 C480,160 600,60 720,110 C840,160 960,60 1080,110 C1200,160 1320,60 1440,110 L1440,220 L0,220Z" fill="var(--c1)"/><path d="M0,145 C180,90 360,180 540,135 C720,90 900,180 1080,140 C1260,100 1380,155 1440,140 L1440,220 L0,220Z" fill="var(--c2)" opacity=".5"/></svg><svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;position:absolute;top:20%;left:0;opacity:.07"><path d="M0,40 C160,10 320,70 480,40 C640,10 800,70 960,40 C1120,10 1280,70 1440,40" fill="none" stroke="var(--c1)" stroke-width="1.5"/></svg>`;
    bg.appendChild(w);
  }
  if (id === 'aurora') {
    orb(bg,800,300,C3,.1,-100,null,-50,null,0);
    orb(bg,600,250,C1,.09,null,-100,null,null,-7);
    [[C1,'15%','8s',0],[C3,'35%','11s',-4],[C2,'55%','9s',-7]].forEach(([col,top,dur,del]) => {
      const band = document.createElement('div');
      band.className = 'aurora-band';
      band.style.cssText = `background:${col};top:${top};animation-duration:${dur};animation-delay:${del}s;`;
      bg.appendChild(band);
    });
  }
  if (id === 'vinyl') {
    orb(bg,600,600,C3,.06,null,null,null,null,0);
    [[320,C1,.05,'35s',0],[240,C3,.06,'28s',-10],[170,C2,.06,'22s',-5],[110,C1,.07,'18s',0]].forEach(([rad,col,op,dur,del]) => {
      const ring = document.createElement('div');
      ring.className = 'vinyl-ring';
      ring.style.cssText = `width:${(rad as number)*2}px;height:${(rad as number)*2}px;border:1px solid ${col};opacity:${op};animation-duration:${dur};animation-delay:${del}s;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);`;
      bg.appendChild(ring);
    });
  }
  if (id === 'neon') {
    [[C1,300,300,'30%','20%','3s',0],[C2,400,250,'55%','60%','4.5s',-2],[C3,250,350,'15%','65%','3.8s',-1.5]].forEach(([col,w,h,t,l,dur,del]) => {
      const blob = document.createElement('div');
      blob.className = 'neon-blob';
      blob.style.cssText = `width:${w}px;height:${h}px;background:${col};top:${t};left:${l};animation-duration:${dur};animation-delay:${del}s;`;
      bg.appendChild(blob);
    });
  }
  if (id === 'nebula') {
    orb(bg,700,500,C1,.07,-100,null,-80,null,0);
    [[C3,350,280,'15%','10%','14s',0],[C2,280,350,'50%','55%','18s',-6]].forEach(([col,w,h,t,l,dur,del]) => {
      const c = document.createElement('div');
      c.className = 'nebula-cloud';
      c.style.cssText = `width:${w}px;height:${h}px;background:${col};top:${t};left:${l};animation-duration:${dur};animation-delay:${del}s;`;
      bg.appendChild(c);
    });
  }
  addNotes(bg);
}
