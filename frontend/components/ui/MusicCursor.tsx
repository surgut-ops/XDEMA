'use client';
import { useEffect, useRef, useState } from 'react';
import { usePerformanceStore } from '@/store';

// ── Music Cursor ──────────────────────────────────────────
export function MusicCursor() {
  const { perfMode } = usePerformanceStore();
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouch(touch);
    if (touch || perfMode) return;
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

  if (perfMode || isTouch) return null;

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
    <button
      onClick={toggle}
      title="Сменить тему"
      className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] flex items-center justify-center rounded-[8px] transition-all"
      style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--bord2)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </svg>
      )}
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
