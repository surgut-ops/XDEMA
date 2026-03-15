'use client';
import { useEffect, useState } from 'react';
import { coursesApi, reviewsApi, galleryApi, messagesApi } from '@/lib/api';
import { useSettingsStore, useModalStore } from '@/store';

// ── SECTION HEADER ────────────────────────────────────────
export function SectionHead({ label, title, sub }: { label:string; title:string; sub?:string }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-block font-mono text-[.67rem] tracking-[.2em] uppercase mb-2" style={{color:'var(--c1)'}}>{label}</div>
      <h2 className="font-syne font-extrabold text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[1.1] mb-1">{title}</h2>
      <div className="w-11 h-0.5 mx-auto rounded-full" style={{background:'linear-gradient(90deg,var(--c1),var(--c2))'}} />
      {sub && <p className="text-[.91rem] mt-2.5 max-w-md mx-auto" style={{color:'var(--muted)'}}>{sub}</p>}
    </div>
  );
}

// ── PRICING ───────────────────────────────────────────────
export function Pricing() {
  const { settings } = useSettingsStore();
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    coursesApi
      .getAll()
      .then((res: any) => setCourses(res as any[]))
      .catch(() => {});
  }, []);
  const { openPay } = useModalStore();
  const visible = settings.blocks?.training !== false;
  if (!visible) return null;

  return (
    <section className="section py-20">
      <SectionHead label="Обучение DJ" title="Три уровня мастерства" sub="От первого трека до профессиональных выступлений" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map(c => (
          <PricingCard key={c.id} course={c} onBuy={() => openPay(c.displayName || c.title, c.price, c.slug)} />
        ))}
      </div>
    </section>
  );
}

function PricingCard({ course, onBuy }: { course:any; onBuy:()=>void }) {
  const colors = { basic:'var(--c1)', middle:'var(--c2)', premium:'var(--c3)' };
  const color = colors[course.slug as keyof typeof colors] || 'var(--c1)';
  return (
    <div className={`pricing-card ${course.slug === 'middle' ? 'featured' : ''}`}>
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[.66rem] font-bold tracking-[.1em] uppercase mb-4 w-fit"
        style={{ background:`${color}20`, color, border:`1px solid ${color}30` }}>
        {course.slug === 'basic' ? 'Уровень 1' : course.slug === 'middle' ? 'Популярный' : 'Pro'}
      </span>
      <div className="font-syne font-bold mb-1" style={{ fontSize: course.nameSize ? `${course.nameSize}rem` : '1.6rem', fontFamily: course.cardFont === 'mono' ? 'var(--font-mono)' : course.cardFont === 'dm' ? 'var(--font-dm)' : 'var(--font-syne)' }}>
        {course.displayName || course.title}
      </div>
      <p className="mb-4 leading-[1.5]" style={{ fontSize: course.descSize ? `${course.descSize}rem` : '.82rem', color:'var(--muted)' }}>{course.tagline}</p>
      <div className="font-mono text-[2.1rem] mb-1" style={{ color:'var(--c1)' }}>
        {course.price?.toLocaleString('ru')} <span className="text-[.83rem]" style={{color:'var(--muted)'}}>₽ / курс</span>
      </div>
      <ul className="flex-1 mb-5 space-y-1.5">
        {(course.features || []).map((f:string, i:number) => (
          <li key={i} className="flex gap-2 items-start text-[.86rem]" style={{color:'var(--text2)',borderBottom:'1px solid rgba(255,255,255,.04)',paddingBottom:'0.42rem'}}>
            <span className="text-[.52rem] mt-[0.42rem] flex-shrink-0" style={{color:'var(--c1)'}}>◆</span>{f}
          </li>
        ))}
      </ul>
      {course.fullDesc && (
        <div className="mb-4 p-3 rounded-lg text-[.82rem] leading-[1.6]" style={{background:'rgba(255,255,255,.025)',border:'1px solid var(--border)',color:'var(--muted)'}}>
          {course.fullDesc}
        </div>
      )}
      <button onClick={onBuy} className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={course.slug === 'basic' ? {background:'linear-gradient(135deg,var(--c1),#009ab8)',color:'#000'} : course.slug === 'middle' ? {background:'linear-gradient(135deg,var(--c2),#aa0044)',color:'#fff'} : {background:'linear-gradient(135deg,var(--c3),#bbaa00)',color:'#000'}}>
        Купить — {course.price?.toLocaleString('ru')} ₽
      </button>
    </div>
  );
}

// ── SERVICES ──────────────────────────────────────────────
export function Services() {
  const { settings } = useSettingsStore();
  const visible = settings.blocks?.services !== false;
  if (!visible) return null;
  const SERVS = [
    {n:'Частные вечеринки',d:'Дни рождения, юбилеи, вечеринки у бассейна'},{n:'Свадьбы',d:'Церемония, банкет, дискотека — полное сопровождение'},
    {n:'Корпоративы',d:'Профессиональный DJ для ивентов любого масштаба'},{n:'Клубные выступления',d:'Ночные клубы, бары, открытые площадки'},
    {n:'Онлайн-стримы',d:'Live DJ-сеты с профессиональным звуком'},{n:'Мастер-классы',d:'Тимбилдинг и воркшопы для компаний'},
  ];
  return (
    <section className="section py-20">
      <SectionHead label="DJ Услуги" title="Любой формат" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVS.map(s => (
          <div key={s.n} className="p-[1.7rem] rounded-[18px] border transition-all hover:border-[rgba(0,229,255,.18)] hover:-translate-y-1"
            style={{background:'var(--card)',border:'1px solid var(--border)'}}>
            <div className="font-syne font-bold text-[1.1rem] mb-2">{s.n}</div>
            <p className="text-[.84rem] leading-[1.62]" style={{color:'var(--muted)'}}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── GALLERY ───────────────────────────────────────────────
export function GallerySection() {
  const { settings } = useSettingsStore();
  const [items, setItems] = useState<any[]>([]);
  const visible = settings.blocks?.gallery !== false;
  const gallS = settings.gallSettings || {cols:3,h:175};
  useEffect(() => {
    galleryApi
      .getAll()
      .then((res: any) => {
        const d = res as any[];
        setItems(d.slice(0, 6));
      })
      .catch(() => {});
  }, []);
  if (!visible) return null;
  return (
    <section className="section py-20">
      <SectionHead label="Фото" title="Галерея" />
      <div className="grid gap-[.85rem]" style={{gridTemplateColumns:`repeat(${gallS.cols},1fr)`}}>
        {items.map((g:any,i:number) => (
          <div key={g.id} className="m-item" style={{gridColumn:`span ${g.colSpan||1}`}}>
            {g.imageUrl ? <img src={g.imageUrl} alt={g.label} className="w-full object-cover block" style={{height:g.height||gallS.h}} loading="lazy" />
              : <div className="flex items-center justify-center text-[.76rem]" style={{height:g.height||gallS.h,background:'rgba(0,229,255,.1)',color:'var(--muted)'}}>{g.label}</div>}
            <div className="m-overlay">🔍</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── REVIEWS ───────────────────────────────────────────────
export function Reviews() {
  const { settings } = useSettingsStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const visible = settings.blocks?.reviews !== false;
  useEffect(() => {
    reviewsApi
      .getApproved()
      .then((res: any) => setReviews(res as any[]))
      .catch(() => {});
  }, []);
  if (!visible) return null;
  return (
    <section className="section py-20">
      <SectionHead label="Клиенты" title="Отзывы" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map(r => {
          const ini = r.name.split(' ').map((w:string)=>w[0]).join('').slice(0,2).toUpperCase();
          return (
            <div key={r.id} className="p-[1.4rem] rounded-[18px] border transition-all hover:border-[rgba(0,229,255,.18)]"
              style={{background:'rgba(255,255,255,.03)',border:'1px solid var(--border)'}}>
              <div className="flex gap-3 items-start mb-2.5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-bold text-white text-sm flex-shrink-0"
                  style={{background:'linear-gradient(135deg,var(--c1),var(--c2))'}}>{ini}</div>
                <div><div className="font-semibold text-[.89rem]">{r.name}</div>
                  <div className="text-[.7rem]" style={{color:'var(--muted2)'}}>{r.event && `${r.event} · `}{r.createdAt ? new Date(r.createdAt).toLocaleDateString('ru') : ''}</div>
                </div>
              </div>
              <div className="text-[.9rem] mb-1.5" style={{color:'var(--c3)'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <p className="text-[.85rem] leading-[1.62]" style={{color:'var(--text2)'}}>{r.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────
export function FAQ() {
  const { settings } = useSettingsStore();
  const [open, setOpen] = useState<number|null>(null);
  const visible = settings.blocks?.faq !== false;
  if (!visible) return null;
  const FAQS = [
    {q:'Как записаться на обучение?',a:'Нажмите "Купить курс". После оплаты свяжемся в течение 2 часов для согласования расписания.'},
    {q:'Нужно своё оборудование?',a:'Нет. Pioneer CDJ-2000NXS2 и DJM-900NXS2 предоставляются в студии.'},
    {q:'Минимальный заказ DJ?',a:'2 часа. Стоимость по прайс-листу.'},
    {q:'Как работает Live QR?',a:'На мероприятии размещается QR-код. Гости сканируют и заказывают треки, оставляют чаевые через онлайн-оплату.'},
    {q:'Работаете официально?',a:'Да. Договор, акт, счёт-фактура. Оплата наличными, картой, СБП, счёт для юр. лиц.'},
    {q:'Скидки?',a:'Повторным клиентам — 10–15%. Раннее бронирование (30+ дней) — 10%.'},
  ];
  return (
    <section className="section py-20">
      <SectionHead label="Вопросы" title="FAQ" />
      <div className="max-w-[720px] mx-auto space-y-2">
        {FAQS.map((f,i) => (
          <div key={i} className="rounded-xl overflow-hidden" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
            <button className="w-full text-left flex items-center justify-between px-5 py-4 text-[.89rem] font-medium transition-colors"
              style={{color: open===i ? 'var(--c1)' : 'var(--text)'}} onClick={()=>setOpen(open===i?null:i)}>
              <span>{f.q}</span>
              <span className="transition-transform text-xl flex-shrink-0 ml-4" style={{transform:open===i?'rotate(45deg)':'none',color:'var(--muted)'}}>+</span>
            </button>
            {open===i && <div className="px-5 pb-4 text-[.85rem] leading-[1.7]" style={{color:'var(--muted)'}}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CONTACTS SECTION ──────────────────────────────────────
export function ContactsSection() {
  const { settings } = useSettingsStore();
  const visible = settings.blocks?.contacts !== false;
  const ct = settings.contacts || {};
  const [name, setName] = useState(''); const [contact, setContact] = useState(''); const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  if (!visible) return null;
  const handleSubmit = async () => {
    if (!name||!msg) return;
    await messagesApi.send({fromName:name,contact,text:msg,type:'Главная'});
    setSent(true); setName(''); setContact(''); setMsg('');
  };
  return (
    <section className="section py-20">
      <SectionHead label="Связь" title="Контакты" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[900px] mx-auto">
        <div>
          <h3 className="font-syne font-bold text-[1.25rem] mb-5">XDEMA на связи</h3>
          {[['☎','Телефон',ct.phone||'+7 (999) 123-45-67'],['@','Email',ct.email||'xdema@djmail.ru'],['📍','Локация',ct.city||'Москва']].map(([ico,label,val])=>(
            <div key={label} className="flex gap-3 mb-4 items-start">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-sm flex-shrink-0" style={{background:'rgba(0,229,255,.08)',border:'1px solid rgba(0,229,255,.14)'}}>{ico}</div>
              <div><div className="text-[.7rem] uppercase tracking-[.1em]" style={{color:'var(--muted)'}}>{label}</div><div className="text-[.88rem] mt-0.5" style={{color:'var(--text2)'}}>{val}</div></div>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 mt-4">
            {[['Instagram',ct.insta],['Telegram',ct.tg],['YouTube',ct.yt],['VK',ct.vk]].map(([n,h])=>h&&h!=='#'?(
              <a key={n} href={h} target="_blank" className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[.81rem] transition-all hover:border-[var(--c1)] hover:text-[var(--c1)]"
                style={{background:'var(--glass2)',border:'1px solid var(--border)',color:'var(--text2)'}}>{n}</a>
            ):null)}
          </div>
        </div>
        <div className="glass-card p-7">
          <h3 className="font-syne font-bold text-[1.1rem] mb-4">Написать</h3>
          {sent ? <div className="text-[.9rem]" style={{color:'var(--c5)'}}>✓ Сообщение отправлено!</div> : (
            <>
              <div className="mb-3"><label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Имя</label><input className="form-control" value={name} onChange={e=>setName(e.target.value)} placeholder="Ваше имя"/></div>
              <div className="mb-3"><label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Контакт</label><input className="form-control" value={contact} onChange={e=>setContact(e.target.value)} placeholder="Телефон или email"/></div>
              <div className="mb-4"><label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Сообщение</label><textarea className="form-control" rows={3} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Расскажите о мероприятии..."/></div>
              <button onClick={handleSubmit} className="w-full py-2.5 rounded-xl text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Отправить</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
