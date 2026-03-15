'use client';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-10 border-t flex flex-wrap items-center justify-between gap-4 px-6 py-8 sm:px-10"
      style={{ borderColor: 'var(--border)' }}>
      <div className="font-syne font-extrabold text-[1.3rem] tracking-[.12em] bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] bg-clip-text text-transparent">
        XDEMA
      </div>
      <div className="text-[.76rem]" style={{ color: 'var(--muted)' }}>
        © {new Date().getFullYear()} XDEMA. DJ & Обучение.
      </div>
      <div className="flex flex-wrap gap-5">
        {[
          ['/courses','Обучение'],['/services','DJ'],['/live','Live QR'],
          ['/gallery','Галерея'],['/contacts','Контакты'],['/admin','admin'],
        ].map(([href, label]) => (
          <Link key={href} href={href}
            className="text-[.76rem] transition-colors hover:text-[var(--c1)]"
            style={{ color: label === 'admin' ? 'transparent' : 'var(--muted)', opacity: label === 'admin' ? .18 : 1 }}>
            {label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
