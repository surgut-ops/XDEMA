'use client';
import { useEffect, useRef, useState } from 'react';
import { usePerformanceStore } from '@/store';

// ── Music Cursor ──────────────────────────────────────────
export function MusicCursor() {
  const { perfMode } = usePerformanceStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (perfMode) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      el.classList.add('visible');
    };
    const onLeave = () => el.classList.remove('visible');
    const onEnter = () => el.classList.add('visible');
    const onDown = () => el.style.transform = 'translate(-3px,-15px) scale(.75)';
    const onUp = () => el.style.transform = 'translate(-3px,-15px) scale(1)';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    // Hot on interactive
    const onBtnEnter = () => el.classList.add('on-btn');
    const onBtnLeave = () => el.classList.remove('on-btn');
    document.querySelectorAll('button,a,.pricing-card').forEach(el2 => {
      el2.addEventListener('mouseenter', onBtnEnter);
      el2.addEventListener('mouseleave', onBtnLeave);
    });
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, [perfMode]);

  if (perfMode) return null;

  return (
    <div id="music-cursor" ref={ref} style={{ position:'fixed', zIndex:9998, pointerEvents:'none', fontSize:17, lineHeight:1, transform:'translate(-3px,-15px)', userSelect:'none' }}>
      ♪
    </div>
  );
}

// ── Theme Toggle ──────────────────────────────────────────
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const t = localStorage.getItem('xdema-theme');
    if (t === 'light') { setDark(false); document.documentElement.setAttribute('data-theme', 'light'); }
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('xdema-theme', next ? 'dark' : 'light');
  };
  return (
    <button onClick={toggle} title="Сменить тему"
      className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] text-base transition-all"
      style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--bord2)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
      {dark ? '☽' : '☀'}
    </button>
  );
}

// ── Performance Toggle ────────────────────────────────────
export function PerformanceToggle() {
  const { perfMode, toggle } = usePerformanceStore();
  return (
    <button
      onClick={toggle}
      title={perfMode ? 'Включить анимации' : 'Режим экономии (меньше анимаций)'}
      className="fixed bottom-5 right-5 z-[850] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{ background: perfMode ? 'rgba(0,232,122,.15)' : 'var(--glass2)', border: `1px solid ${perfMode ? 'rgba(0,232,122,.3)' : 'var(--border)'}`, color: perfMode ? 'var(--c5)' : 'var(--muted)' }}>
      {perfMode ? '⚡ Эконом' : '✨ Анимации'}
    </button>
  );
}

// ── Noise Overlay ─────────────────────────────────────────
export function NoiseOverlay() {
  const { perfMode } = usePerformanceStore();
  if (perfMode) return null;
  return <div className="noise-overlay" />;
}
