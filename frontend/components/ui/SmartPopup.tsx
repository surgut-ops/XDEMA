'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSettingsStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store';

export function SmartPopup() {
  const { settings } = useSettingsStore();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { openBook } = useModalStore();

  useEffect(() => {
    const p = settings.popupSettings;
    if (!p || p.enabled === false) return;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('xdema_popup')) return;
    const t = setTimeout(() => {
      setShow(true);
      setTimeout(() => setVisible(true), 50);
      sessionStorage.setItem('xdema_popup', '1');
    }, (p.delay || 35) * 1000);
    return () => clearTimeout(t);
  }, [settings.popupSettings]);

  if (!show) return null;
  const p = settings.popupSettings || {};
  const close = () => { setVisible(false); setTimeout(() => setShow(false), 400); };
  const handleBtn = () => {
    close();
    const a = p.action || 'training';
    if (a === 'book') openBook();
    else router.push(`/${a === 'training' ? 'courses' : a}`);
  };

  return (
    <div className={`smart-popup ${visible ? 'show' : ''}`}>
      <button onClick={close} className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-[6px] text-xs transition-colors"
        style={{ background:'var(--glass)', border:'1px solid var(--border)', color:'var(--muted)' }}>✕</button>
      {p.img && (
        <img src={p.img} alt="" className="w-full rounded-lg mb-3 object-cover" style={{ height: p.imgH || 120 }} />
      )}
      <div className="font-mono text-[.62rem] tracking-[.1em] mb-1" style={{ color:'var(--c1)' }}>{p.tag || 'АКЦИЯ'}</div>
      <div className="font-syne font-bold text-base mb-1.5">{p.title || 'XDEMA'}</div>
      <div className="text-[.8rem] leading-[1.55] mb-3" style={{ color:'var(--muted)' }}>{p.text}</div>
      <button onClick={handleBtn} className="w-full py-2 rounded-lg text-sm font-semibold text-black transition-all"
        style={{ background:'linear-gradient(135deg,var(--c1),#009ab8)' }}>
        {p.btnText || 'Подробнее'}
      </button>
    </div>
  );
}
