'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore, useModalStore } from '@/store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const { user, logout, isAdmin } = useUserStore();
  const { openAuth } = useModalStore();
  const [mob, setMob] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleAuth = () => {
    if (isAdmin()) window.location.href = '/admin';
    else if (user) window.location.href = '/account';
    else openAuth();
  };

  const navLabel = isAdmin() ? 'Admin' : user ? user.name.split(' ')[0] : 'Войти';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[800] h-[66px] flex items-center justify-between px-4 sm:px-10 transition-all duration-300 border-b ${scrolled ? 'border-white/10' : 'border-transparent'}`}
        style={{ background: 'var(--nav)', backdropFilter: 'blur(24px) saturate(140%)' }}>

        <Link href="/" className="font-syne font-extrabold tracking-[.1em] sm:tracking-[.18em] text-[.85rem] sm:text-[1.1rem] bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] bg-clip-text text-transparent">
          XDEMA
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Live QR — сократить текст на мобильном */}
          <button
            onClick={() => window.location.href = '/live'}
            className="flex items-center gap-1 text-black font-bold text-[.6rem] sm:text-xs tracking-wide px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-[9px] transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,var(--c1),#008fa8)', boxShadow: '0 3px 14px rgba(0,229,255,.3)' }}>
            <span className="hidden xs:inline">♫ </span>QR
            <span className="hidden sm:inline"> LIVE</span>
          </button>

          {/* Auth */}
          <button
            onClick={handleAuth}
            className="flex items-center gap-1 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-[9px] text-[.6rem] sm:text-xs font-medium transition-all hover:border-[var(--c1)] hover:text-[var(--c1)]"
            style={{ background: 'var(--glass2)', border: '1px solid var(--bord2)', color: 'var(--text2)' }}>
            {navLabel}
          </button>

          <ThemeToggle />

          {/* Burger mobile */}
          <button className="flex sm:hidden flex-col gap-[4px] p-1.5" onClick={() => setMob(!mob)}>
            <span className={`block w-[20px] h-[1.5px] rounded-sm transition-all duration-300 ${mob ? 'rotate-45 translate-y-[7px]' : ''}`} style={{ background: 'var(--text)' }} />
            <span className={`block w-[20px] h-[1.5px] rounded-sm transition-all duration-300 ${mob ? 'opacity-0' : ''}`} style={{ background: 'var(--text)' }} />
            <span className={`block w-[20px] h-[1.5px] rounded-sm transition-all duration-300 ${mob ? '-rotate-45 -translate-y-[7px]' : ''}`} style={{ background: 'var(--text)' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mob && (
        <div className="fixed inset-0 top-[66px] z-[799] flex flex-col p-6 gap-2 overflow-y-auto sm:hidden"
          style={{ background: 'rgba(9,9,15,.97)', backdropFilter: 'blur(20px)' }}>
          {[
            ['/', 'Главная'], ['/courses', 'Обучение'], ['/services', 'Заказать DJ'],
            ['/corporate', 'Корпоративы'], ['/live', 'Live QR'], ['/gallery', 'Галерея'],
            ['/reviews', 'Отзывы'], ['/contacts', 'Контакты'],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMob(false)}
              className="text-base font-medium px-4 py-3 rounded-[10px] transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)', e.currentTarget.style.background = 'var(--glass2)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)', e.currentTarget.style.background = 'transparent')}>
              {label}
            </Link>
          ))}
          <hr style={{ borderColor: 'var(--border)', margin: '.4rem 0' }} />
          <button className="text-base font-medium px-4 py-3 text-left rounded-[10px]"
            style={{ color: 'var(--muted)' }} onClick={() => { setMob(false); handleAuth(); }}>
            Войти / Аккаунт
          </button>
        </div>
      )}
    </>
  );
}
