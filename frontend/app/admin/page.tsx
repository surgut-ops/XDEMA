'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store';
import { useRouter } from 'next/navigation';
import { ordersApi, reviewsApi, galleryApi, settingsApi, usersApi, messagesApi, adminNotifApi, coursesApi } from '@/lib/api';
import { authApi } from '@/lib/api';

type AdminTab = 'dashboard'|'orders'|'reviews'|'prices'|'gallery'|'materials'|'blocks'|'editor'|'herobg'|'popup'|'liveqr'|'notify'|'contacts'|'users'|'messages'|'telegram'|'instructions';

export default function AdminPage() {
  const { user, login, isAdmin } = useUserStore();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginVal, setLoginVal] = useState('admin');
  const [passVal, setPassVal] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<AdminTab>('dashboard');

  useEffect(() => { if (isAdmin()) setLoggedIn(true); }, []);

  const doLogin = async () => {
    try {
      const r = await authApi.login(loginVal, passVal) as any;
      if (r.user?.role !== 'ADMIN') { setErr('Недостаточно прав'); return; }
      login(r.user, r.token);
      setLoggedIn(true);
    } catch (e: any) { setErr(e.message); }
  };

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--bg)'}}>
      <div className="glass-card p-9 w-full max-w-[370px] text-center">
        <div className="font-syne font-extrabold text-[1.85rem] tracking-[.1em] mb-1 bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] bg-clip-text text-transparent">ADMIN</div>
        <p className="text-[.8rem] mb-7" style={{color:'var(--muted)'}}>Панель управления XDEMA</p>
        <div className="mb-3"><label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5 text-left" style={{color:'var(--muted)'}}>Логин</label><input className="form-control" value={loginVal} onChange={e=>setLoginVal(e.target.value)}/></div>
        <div className="mb-4"><label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5 text-left" style={{color:'var(--muted)'}}>Пароль</label><input className="form-control" type="password" value={passVal} onChange={e=>setPassVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()}/></div>
        <button onClick={doLogin} className="w-full py-2.5 rounded-xl text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Войти</button>
        {err && <p className="text-[.77rem] mt-2" style={{color:'var(--c2)'}}>{err}</p>}
      </div>
    </div>
  );

  const LINKS: [AdminTab, string][] = [
    ['dashboard','Dashboard'],['orders','Заказы'],['reviews','Отзывы'],['prices','Цены'],
    ['gallery','Галерея'],['materials','Материалы'],['blocks','Блоки'],['editor','Редактор'],
    ['herobg','Фон главной'],['popup','Smart Popup'],['liveqr','Live QR настр.'],['notify','Уведомления'],
    ['contacts','Контакты'],['users','Пользователи'],['messages','Сообщения'],['telegram','Telegram'],['instructions','Инструкция'],
  ];

  return (
    <div className="min-h-screen flex" style={{background:'var(--bg)'}}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[200px] border-r sticky top-0 h-screen overflow-y-auto" style={{background:'rgba(7,7,14,.96)',borderColor:'var(--border)'}}>
        <div className="font-syne font-bold text-[.92rem] tracking-[.1em] px-5 py-4 border-b" style={{color:'var(--c1)',borderColor:'var(--border)'}}>ADMIN</div>
        <Link href="/" className="flex items-center gap-2 px-5 py-2.5 text-[.81rem] font-medium transition-all border-b hover:text-[var(--c1)]" style={{color:'var(--muted)',borderColor:'var(--border)'}}>
          ← На главную
        </Link>
        {LINKS.map(([id, label]) => (
          <button key={id} onClick={()=>setTab(id)}
            className={`text-left px-5 py-2.5 text-[.81rem] font-medium transition-all ${tab===id?'text-[var(--c1)] bg-[rgba(0,229,255,.08)]':''}`}
            style={{color:tab===id?undefined:'var(--muted)',background:tab===id?undefined:'transparent'}}>
            {label}
          </button>
        ))}
        <div className="mt-auto">
          <hr style={{borderColor:'var(--border)',margin:'0.5rem 1.2rem'}} />
          <button onClick={()=>{useUserStore.getState().logout();setLoggedIn(false);}} className="w-full text-left px-5 py-2.5 text-[.81rem] font-medium" style={{color:'var(--c2)'}}>Выйти</button>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 overflow-x-auto flex gap-1 p-2 border-b" style={{background:'rgba(7,7,14,.96)',borderColor:'var(--border)'}}>
        {LINKS.map(([id,label])=><button key={id} onClick={()=>setTab(id)} className="whitespace-nowrap text-[.7rem] px-3 py-1.5 rounded-md flex-shrink-0 transition-all" style={{background:tab===id?'rgba(0,229,255,.12)':'transparent',color:tab===id?'var(--c1)':'var(--muted)',border:tab===id?'1px solid rgba(0,229,255,.2)':'1px solid transparent'}}>{label}</button>)}
      </div>

      {/* Content */}
      <main className="flex-1 p-5 md:p-7 overflow-y-auto mt-0 md:mt-0 pt-16 md:pt-5">
        <AdminContent tab={tab} />
      </main>
    </div>
  );
}

function AdminContent({ tab }: { tab: AdminTab }) {
  const [data, setData] = useState<any>({});
  const load = async () => {
    const [orders, reviews, users, msgs, galleryCount] = await Promise.all([
      ordersApi.getAll().catch(()=>[]),
      reviewsApi.getAll().catch(()=>[]),
      usersApi.getAll().catch(()=>[]),
      messagesApi.getAll().catch(()=>[]),
      galleryApi.getAll().then((r: any) => (Array.isArray(r) ? r.length : 0)).catch(()=>0),
    ]);
    setData({ orders, reviews, users, msgs, galleryCount });
  };
  useEffect(() => { load(); }, [tab]);

  if (tab === 'dashboard') return <DashboardTab data={data} />;
  if (tab === 'orders') return <OrdersTab orders={data.orders||[]} reload={load} />;
  if (tab === 'reviews') return <ReviewsTab reviews={data.reviews||[]} reload={load} />;
  if (tab === 'users') return <UsersTab users={data.users||[]} reload={load} />;
  if (tab === 'messages') return <MessagesTab msgs={data.msgs||[]} />;
  if (tab === 'gallery') return <GalleryTab />;
  if (tab === 'instructions') return <InstructionsTab />;
  if (tab === 'prices') return <PricesTab />;
  if (tab === 'contacts') return <ContactsAdminTab />;
  if (tab === 'blocks') return <BlocksTab />;
  if (tab === 'editor') return <EditorTab />;
  if (tab === 'popup') return <PopupTab />;
  if (tab === 'notify') return <NotifyTab />;
  if (tab === 'herobg') return <HeroBgTab />;
  if (tab === 'telegram') return <TelegramTab />;
  if (tab === 'liveqr') return <LiveQRTab />;
  if (tab === 'materials') return <MaterialsTab />;
  return <div className="text-center py-20" style={{color:'var(--muted)'}}>Раздел в разработке</div>;
}

function DashboardTab({ data }: any) {
  const turnover = (data.orders || []).reduce((s: number, o: any) => s + (o.amount || 0), 0);
  const stats = [
    {label:'Заказов',val:data.orders?.length||0},{label:'Пользователей',val:data.users?.length||0},
    {label:'На модерации',val:data.reviews?.filter((r:any)=>!r.approved).length||0},{label:'Сообщений',val:data.msgs?.length||0},
    {label:'Оборот',val:`${turnover.toLocaleString('ru')} ₽`},{label:'Фото',val:data.galleryCount??0},
  ];
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map(s=><div key={s.label} className="rounded-xl border p-5 text-center" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
          <div className="font-syne font-bold text-[1.9rem]" style={{color:'var(--c1)'}}>{s.val}</div>
          <div className="text-[.72rem] mt-1" style={{color:'var(--muted)'}}>{s.label}</div>
        </div>)}
      </div>
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="font-syne font-bold text-base mb-4">Последние заказы</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[.82rem]">
            <thead><tr className="border-b" style={{borderColor:'var(--border)'}}>
              {['Тип','Клиент','Сумма','Статус','Дата'].map(h=><th key={h} className="text-left py-2 px-2 text-[.68rem] uppercase tracking-[.1em]" style={{color:'var(--muted)'}}>{h}</th>)}
            </tr></thead>
            <tbody>{(data.orders||[]).slice(0,8).map((o:any)=>(
              <tr key={o.id} className="border-b" style={{borderColor:'rgba(255,255,255,.03)'}}>
                <td className="py-2 px-2">{o.type}</td>
                <td className="py-2 px-2">{o.clientName}</td>
                <td className="py-2 px-2 font-mono" style={{color:'var(--c1)'}}>{o.amount?`${o.amount.toLocaleString('ru')} ₽`:'—'}</td>
                <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-full text-[.67rem]" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>{o.status}</span></td>
                <td className="py-2 px-2 text-[.77rem]" style={{color:'var(--muted)'}}>{o.createdAt?new Date(o.createdAt).toLocaleDateString('ru'):''}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders, reload }: any) {
  const [filter, setFilter] = useState<'all'|'COURSE'|'DJ_BOOKING'|'QR_TRACK'>('all');
  const filtered = filter === 'all' ? orders : orders.filter((o: any) => o.type === filter);
  const cycleStatus = async (id:number) => {
    const ss = ['PENDING','PAID','IN_PROGRESS','COMPLETED','CANCELLED'];
    const o = orders.find((x:any)=>x.id===id);
    const next = ss[(ss.indexOf(o.status)+1)%ss.length];
    await ordersApi.updateStatus(id, next);
    reload();
  };
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Заказы</h2>
      <div className="flex gap-2 mb-4">
        {[['all','Все'],['COURSE','Курсы'],['DJ_BOOKING','Брони'],['QR_TRACK','QR']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v as any)} className={`px-3 py-1.5 rounded-lg text-sm ${filter===v?'text-black':''}`} style={{background:filter===v?'var(--c1)':'var(--glass2)',border:'1px solid var(--border)'}}>{l}</button>
        ))}
      </div>
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-[.82rem]">
            <thead><tr className="border-b" style={{borderColor:'var(--border)'}}>{['#','Тип','Клиент','Email','Сумма','Статус',''].map(h=><th key={h} className="text-left py-2 px-2 text-[.67rem] uppercase tracking-[.1em]" style={{color:'var(--muted)'}}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map((o:any)=>(
              <tr key={o.id} className="border-b" style={{borderColor:'rgba(255,255,255,.03)'}}>
                <td className="py-2 px-2 font-mono text-[.7rem]" style={{color:'var(--muted)'}}>#{o.id}</td>
                <td className="py-2 px-2">{o.type}</td><td className="py-2 px-2">{o.clientName}</td>
                <td className="py-2 px-2 text-[.77rem]" style={{color:'var(--muted)'}}>{o.clientEmail}</td>
                <td className="py-2 px-2 font-mono" style={{color:'var(--c1)'}}>{o.amount?`${o.amount.toLocaleString('ru')} ₽`:'—'}</td>
                <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-full text-[.67rem]" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>{o.status}</span></td>
                <td className="py-2 px-2"><button onClick={()=>cycleStatus(o.id)} className="text-[.68rem] px-2 py-0.5 rounded" style={{background:'var(--glass2)',border:'1px solid var(--border)',color:'var(--muted)'}}>→ Статус</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews, reload }: any) {
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Модерация отзывов</h2>
      <div className="space-y-3">
        {reviews.map((r:any)=>(
          <div key={r.id} className="flex gap-4 p-4 rounded-xl flex-wrap items-start" style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--border)'}}>
            <div className="flex-1 min-w-[180px]">
              <div className="flex gap-2 items-center flex-wrap mb-1">
                <span className="font-semibold text-[.87rem]">{r.name}</span>
                <span className="text-[.82rem]" style={{color:'var(--c3)'}}>{'★'.repeat(r.rating)}</span>
                <span className="px-2 py-0.5 rounded-full text-[.67rem]" style={{background:r.approved?'rgba(0,232,122,.1)':'rgba(255,165,0,.12)',color:r.approved?'var(--c5)':'#ffa500'}}>{r.approved?'одобрен':'проверка'}</span>
              </div>
              <div className="text-[.82rem] mb-1" style={{color:'var(--muted)'}}>{r.text}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!r.approved && <button onClick={async()=>{await reviewsApi.approve(r.id);reload();}} className="px-3 py-1 rounded-lg text-[.8rem] text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Одобрить</button>}
              {r.approved && <button onClick={async()=>{await reviewsApi.hide(r.id);reload();}} className="px-3 py-1 rounded-lg text-[.8rem]" style={{background:'var(--glass2)',border:'1px solid var(--border)',color:'var(--muted)'}}>Скрыть</button>}
              <button onClick={async()=>{await reviewsApi.delete(r.id);reload();}} className="px-3 py-1 rounded-lg text-[.8rem]" style={{background:'rgba(255,45,120,.1)',border:'1px solid rgba(255,45,120,.2)',color:'var(--c2)'}}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ users, reload }: any) {
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Пользователи</h2>
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-[.82rem]">
            <thead><tr className="border-b" style={{borderColor:'var(--border)'}}>{['#','Имя','Email','Роль','Дата',''].map(h=><th key={h} className="text-left py-2 px-2 text-[.67rem] uppercase tracking-[.1em]" style={{color:'var(--muted)'}}>{h}</th>)}</tr></thead>
            <tbody>{users.map((u:any)=>(
              <tr key={u.id} className="border-b" style={{borderColor:'rgba(255,255,255,.03)'}}>
                <td className="py-2 px-2 font-mono text-[.7rem]" style={{color:'var(--muted)'}}>#{u.id}</td>
                <td className="py-2 px-2">{u.name}</td><td className="py-2 px-2">{u.email}</td>
                <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-full text-[.67rem]" style={{background:u.role==='ADMIN'?'rgba(123,97,255,.12)':'rgba(0,229,255,.1)',color:u.role==='ADMIN'?'var(--c4)':'var(--c1)'}}>{u.role}</span></td>
                <td className="py-2 px-2 text-[.77rem]" style={{color:'var(--muted)'}}>{u.createdAt?new Date(u.createdAt).toLocaleDateString('ru'):''}</td>
                <td className="py-2 px-2"><button onClick={async()=>{await usersApi.deleteUser(u.id);reload();}} className="text-[.68rem] px-2 py-0.5 rounded" style={{background:'rgba(255,45,120,.1)',border:'1px solid rgba(255,45,120,.2)',color:'var(--c2)'}}>Удалить</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MessagesTab({ msgs }: any) {
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Сообщения</h2>
      <div className="space-y-3">
        {msgs.map((m:any)=>(
          <div key={m.id} className="p-4 rounded-xl" style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--border)'}}>
            <div className="flex justify-between flex-wrap mb-1">
              <span className="font-semibold text-[.87rem]">{m.fromName} <span className="font-normal" style={{color:'var(--muted)'}}>· {m.contact}</span></span>
              <span className="text-[.72rem]" style={{color:'var(--muted2)'}}>{m.createdAt?new Date(m.createdAt).toLocaleDateString('ru'):''} · {m.type}</span>
            </div>
            <div className="text-[.82rem]" style={{color:'var(--muted)'}}>{m.text||'(без текста)'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const [items, setItems] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');

  const reload = () => galleryApi.getAll().then((res: any) => setItems(res as any[])).catch(() => {});

  useEffect(() => { reload(); }, []);

  const addUrl = async () => {
    if (!url) return;
    await galleryApi.addUrl(label || 'Photo', url);
    reload();
    setUrl('');
    setLabel('');
  };

  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Галерея</h2>
      <div className="border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-all" style={{borderColor:'var(--border)'}} onDragOver={e=>{e.preventDefault();(e.currentTarget as HTMLElement).style.borderColor='var(--c1)';}} onDragLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border)';}} onDrop={async e=>{e.preventDefault();(e.currentTarget as HTMLElement).style.borderColor='var(--border)';const file=e.dataTransfer.files[0];if(file){await galleryApi.upload(file,file.name.split('.')[0]);reload();}}}>
        <input type="file" accept="image/*" className="hidden" id="gfile" onChange={async e=>{const f=e.target.files?.[0];if(f){await galleryApi.upload(f,f.name.split('.')[0]);reload();e.target.value='';}}} />
        <label htmlFor="gfile" className="block text-[.85rem] cursor-pointer" style={{color:'var(--muted)'}}>+ Загрузить (JPG/PNG/WEBP, до 5MB)</label>
      </div>
      <div className="rounded-xl border p-5 mb-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="font-syne font-bold text-base mb-3">Добавить фото по URL</div>
        <div className="flex gap-3 flex-wrap">
          <input className="form-control flex-1" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/photo.jpg" />
          <input className="form-control" style={{maxWidth:160}} value={label} onChange={e=>setLabel(e.target.value)} placeholder="Название" />
          <button onClick={addUrl} className="px-4 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Добавить</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((g:any,i:number)=>(
          <div key={g.id} className="rounded-xl overflow-hidden relative" style={{border:'1px solid var(--border)'}}>
            {g.imageUrl ? (
              <img
                src={g.imageUrl}
                alt={g.label}
                className="w-full object-cover"
                style={{ height: 120 }}
                loading="lazy"
              />
            ) : (
              <div
                className="flex items-center justify-center text-[.76rem] h-[120px]"
                style={{ background: 'rgba(0,229,255,.1)', color: 'var(--muted)' }}
              >
                {g.label}
              </div>
            )}
            <button
              onClick={async () => {
                await galleryApi.delete(g.id);
                reload();
              }}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[.65rem]"
              style={{ background: 'var(--c2)' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricesTab() {
  const [djPrices, setDjPrices] = useState<any[]>([]);
  const [qrPrices, setQrPrices] = useState<any>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    settingsApi.get('djPrices').then((r: any) => setDjPrices(Array.isArray(r) ? r : (r?.value ? r.value : []) || [])).catch(() => {});
    settingsApi.get('qrPrices').then((r: any) => setQrPrices(r && typeof r === 'object' ? r : (r?.value ? r.value : {}) || {})).catch(() => {});
  }, []);
  const saveDj = async () => { await settingsApi.set('djPrices', djPrices); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const saveQr = async () => { await settingsApi.set('qrPrices', qrPrices); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Цены</h2>
      {saved && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Сохранено</div>}
      <div className="rounded-xl border p-5 mb-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="font-syne font-bold text-base mb-4">Прайс DJ</div>
        {djPrices.map((item: any, i: number) => (
          <div key={i} className="flex gap-3 mb-2 items-center">
            <input className="form-control flex-1" value={item.n} onChange={e => { const arr = [...djPrices]; arr[i] = {...arr[i], n: e.target.value}; setDjPrices(arr); }} placeholder="Название услуги" />
            <input className="form-control w-28" type="number" value={item.p} onChange={e => { const arr = [...djPrices]; arr[i] = {...arr[i], p: +e.target.value}; setDjPrices(arr); }} placeholder="Цена ₽" />
            <button onClick={() => setDjPrices(djPrices.filter((_: any, j: number) => j !== i))} className="px-2 py-1 rounded text-sm" style={{background:'rgba(255,45,120,.1)',color:'var(--c2)'}}>✕</button>
          </div>
        ))}
        <div className="flex gap-3 mt-3">
          <button onClick={() => setDjPrices([...djPrices, {n:'',p:0}])} className="px-4 py-2 rounded-lg text-sm" style={{background:'var(--glass2)',border:'1px solid var(--border)',color:'var(--muted)'}}>+ Добавить строку</button>
          <button onClick={saveDj} className="px-4 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Сохранить прайс DJ</button>
        </div>
      </div>
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="font-syne font-bold text-base mb-4">Цены Live QR</div>
        {[['track','Трек'],['dance','Танец'],['tip','Чаевые'],['msg','Сообщение']].map(([k,label]) => (
          <div key={k} className="flex gap-3 mb-3 items-center">
            <label className="w-28 text-[.82rem]" style={{color:'var(--muted)'}}>{label}</label>
            <input className="form-control w-32" type="number" value={qrPrices[k] ?? 0} onChange={e => setQrPrices({...qrPrices, [k]: +e.target.value})} />
            <span className="text-[.82rem]" style={{color:'var(--muted)'}}>₽</span>
          </div>
        ))}
        <button onClick={saveQr} className="px-4 py-2 rounded-lg text-sm font-semibold text-black mt-2" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Сохранить QR цены</button>
      </div>
    </div>
  );
}

function ContactsAdminTab() {
  const [ct, setCt] = useState<any>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => { settingsApi.get('contacts').then((r: any) => setCt(r && typeof r === 'object' ? r : {})).catch(() => {}); }, []);
  const save = async () => { await settingsApi.set('contacts', ct); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const fields = [['phone','Телефон','Телефон'],['email','Email','Email'],['city','Город','Город'],['insta','Instagram URL','https://instagram.com/...'],['tg','Telegram URL','https://t.me/...'],['yt','YouTube URL','https://youtube.com/...'],['vk','VK URL','https://vk.com/...']];
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Контакты</h2>
      {saved && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Сохранено</div>}
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        {fields.map(([k, label, ph]) => (
          <div key={k} className="mb-3">
            <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>{label}</label>
            <input className="form-control" value={ct[k] || ''} onChange={e => setCt({...ct, [k]: e.target.value})} placeholder={ph} />
          </div>
        ))}
        <button onClick={save} className="px-5 py-2 rounded-lg text-sm font-semibold text-black mt-2" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Сохранить контакты</button>
      </div>
    </div>
  );
}

function BlocksTab() {
  const defaultBlocks = {training:true,services:true,gallery:true,reviews:true,faq:true,contacts:true};
  const [blocks, setBlocks] = useState<any>(defaultBlocks);
  const [saved, setSaved] = useState(false);
  useEffect(() => { settingsApi.get('blocks').then((r: any) => setBlocks(r && typeof r === 'object' ? r : defaultBlocks)).catch(() => {}); }, []);
  const save = async () => { await settingsApi.set('blocks', blocks); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const BLOCK_LABELS: Record<string,string> = {training:'Обучение',services:'Услуги DJ',gallery:'Галерея',reviews:'Отзывы',faq:'FAQ',contacts:'Контакты'};
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Блоки на главной</h2>
      {saved && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Сохранено</div>}
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        {Object.entries(BLOCK_LABELS).map(([k, label]) => (
          <div key={k} className="flex items-center justify-between py-3 border-b" style={{borderColor:'var(--border)'}}>
            <span className="text-[.9rem]">{label}</span>
            <button onClick={() => setBlocks({...blocks,[k]:!blocks[k]})} className="w-11 h-6 rounded-full transition-all relative" style={{background:blocks[k]?'var(--c1)':'rgba(255,255,255,.1)'}}>
              <span className="absolute top-0.5 transition-all w-5 h-5 rounded-full bg-white" style={{left:blocks[k]?'calc(100% - 22px)':'2px'}} />
            </button>
          </div>
        ))}
        <button onClick={save} className="px-5 py-2 rounded-lg text-sm font-semibold text-black mt-4" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Сохранить</button>
      </div>
    </div>
  );
}

function EditorTab() {
  const [hero, setHero] = useState<any>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => { settingsApi.get('hero').then((r: any) => setHero(r && typeof r === 'object' ? r : {})).catch(() => {}); }, []);
  const save = async () => { await settingsApi.set('hero', hero); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Редактор текстов</h2>
      {saved && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Сохранено</div>}
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        {[['title','Заголовок (XDEMA)'],['sub1','Подзаголовок 1'],['sub2','Подзаголовок 2']].map(([k,label]) => (
          <div key={k} className="mb-3">
            <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>{label}</label>
            <input className="form-control" value={hero[k]||''} onChange={e => setHero({...hero,[k]:e.target.value})} />
          </div>
        ))}
        <div className="flex gap-4 mb-3">
          <div className="flex-1">
            <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Размер заголовка (rem)</label>
            <input className="form-control" type="number" step="0.1" value={hero.titleSize??9} onChange={e => setHero({...hero,titleSize:+e.target.value})} />
          </div>
          <div className="flex-1">
            <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Размер подзаголовка</label>
            <input className="form-control" type="number" step="0.05" value={hero.subSize??1.05} onChange={e => setHero({...hero,subSize:+e.target.value})} />
          </div>
        </div>
        <button onClick={save} className="px-5 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Сохранить</button>
      </div>
    </div>
  );
}

function PopupTab() {
  const [p, setP] = useState<any>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => { settingsApi.get('popupSettings').then((r: any) => setP(r && typeof r === 'object' ? r : {})).catch(() => {}); }, []);
  const save = async () => { await settingsApi.set('popupSettings', p); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Smart Popup</h2>
      {saved && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Сохранено</div>}
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{borderColor:'var(--border)'}}>
          <span className="font-semibold">Включён</span>
          <button onClick={() => setP({...p,enabled:!p.enabled})} className="w-11 h-6 rounded-full transition-all relative" style={{background:p.enabled?'var(--c1)':'rgba(255,255,255,.1)'}}>
            <span className="absolute top-0.5 transition-all w-5 h-5 rounded-full bg-white" style={{left:p.enabled?'calc(100% - 22px)':'2px'}} />
          </button>
        </div>
        {[['tag','Тег (напр. АКЦИЯ)'],['title','Заголовок'],['text','Текст'],['btnText','Текст кнопки'],['img','URL изображения']].map(([k,label]) => (
          <div key={k} className="mb-3">
            <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>{label}</label>
            {k==='text' ? <textarea className="form-control" rows={2} value={p[k]||''} onChange={e=>setP({...p,[k]:e.target.value})} /> : <input className="form-control" value={p[k]||''} onChange={e=>setP({...p,[k]:e.target.value})} />}
          </div>
        ))}
        <div className="mb-3">
          <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Задержка (сек)</label>
          <input className="form-control w-28" type="number" value={p.delay??35} onChange={e=>setP({...p,delay:+e.target.value})} />
        </div>
        <div className="mb-4">
          <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Действие кнопки</label>
          <select className="form-control" value={p.action||'training'} onChange={e=>setP({...p,action:e.target.value})} style={{background:'var(--bg2)'}}>
            <option value="training">→ Обучение</option>
            <option value="services">→ DJ услуги</option>
            <option value="live">→ Live QR</option>
            <option value="book">→ Открыть форму бронирования</option>
          </select>
        </div>
        <button onClick={save} className="px-5 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Сохранить popup</button>
      </div>
    </div>
  );
}

function NotifyTab() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [form, setForm] = useState({title:'',text:'',imageUrl:'',targetAll:true,targetCourse:'',userId:''});
  const [sent, setSent] = useState(false);
  const load = () => adminNotifApi.getAll().then((r: any) => setNotifs(Array.isArray(r)?r:[])).catch(()=>{});
  useEffect(() => { load(); }, []);
  const send = async () => {
    await adminNotifApi.send({...form, userId: form.userId ? +form.userId : undefined});
    setSent(true); setTimeout(() => setSent(false), 2000);
    setForm({title:'',text:'',imageUrl:'',targetAll:true,targetCourse:'',userId:''});
    load();
  };
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Уведомления пользователям</h2>
      {sent && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Отправлено</div>}
      <div className="rounded-xl border p-5 mb-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="font-syne font-bold text-base mb-4">Новое уведомление</div>
        {[['title','Заголовок'],['text','Текст'],['imageUrl','URL изображения (необязательно)']].map(([k,label]) => (
          <div key={k} className="mb-3">
            <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>{label}</label>
            {k==='text' ? <textarea className="form-control" rows={3} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} /> : <input className="form-control" value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} />}
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Кому</label>
          <select className="form-control" value={form.targetCourse || (form.userId ? 'user' : 'all')} onChange={e => { const v = e.target.value; if (v==='all') setForm({...form,targetAll:true,targetCourse:'',userId:''}); else if (v==='user') setForm({...form,targetAll:false,targetCourse:''}); else setForm({...form,targetAll:false,targetCourse:v,userId:''}); }} style={{background:'var(--bg2)'}}>
            <option value="all">Всем пользователям</option>
            <option value="basic">Базовый курс</option>
            <option value="middle">Средний курс</option>
            <option value="premium">Премиум курс</option>
            <option value="user">Конкретному пользователю</option>
          </select>
        </div>
        <button onClick={send} className="px-5 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Отправить</button>
      </div>
      <div className="space-y-2">
        {notifs.map((n:any) => (
          <div key={n.id} className="flex justify-between items-start p-3 rounded-xl" style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--border)'}}>
            <div><div className="font-semibold text-[.87rem]">{n.title}</div><div className="text-[.77rem]" style={{color:'var(--muted)'}}>{n.text?.slice(0,80)}</div></div>
            <button onClick={async()=>{await adminNotifApi.delete(n.id);load();}} className="px-2 py-1 rounded text-[.75rem] flex-shrink-0 ml-3" style={{background:'rgba(255,45,120,.1)',color:'var(--c2)'}}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroBgTab() {
  const defaultBg = {type:'preset',id:'orbs'};
  const [bg, setBg] = useState<any>(defaultBg);
  const [saved, setSaved] = useState(false);
  useEffect(() => { settingsApi.get('heroBg').then((r:any) => setBg(r && typeof r === 'object' ? r : defaultBg)).catch(()=>{}); }, []);
  const save = async () => { await settingsApi.set('heroBg', bg); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const PRESETS = [['orbs','Орбы'],['sonic','Волны'],['aurora','Аврора'],['vinyl','Виниловые кольца'],['neon','Неон'],['nebula','Туманность']];
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Фон главной</h2>
      {saved && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Сохранено</div>}
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="font-syne font-bold text-sm mb-3">Пресет анимации</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {PRESETS.map(([id,label]) => (
            <button key={id} onClick={() => setBg({type:'preset',id})} className="py-2 px-3 rounded-lg text-[.82rem] font-medium transition-all text-left" style={{background:bg.id===id?'rgba(0,229,255,.12)':'var(--glass2)',border:`1px solid ${bg.id===id?'rgba(0,229,255,.3)':'var(--border)'}`,color:bg.id===id?'var(--c1)':'var(--text2)'}}>{label}</button>
          ))}
        </div>
        <div className="border-t pt-4 mb-4" style={{borderColor:'var(--border)'}}>
          <div className="font-syne font-bold text-sm mb-3">Или своё изображение</div>
          <input className="form-control mb-2" placeholder="URL изображения" value={bg.type==='image'?bg.url||'':''} onChange={e=>setBg({type:'image',url:e.target.value,overlay:55})} />
          {bg.type==='image' && (
            <div>
              <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Затемнение: {bg.overlay??55}%</label>
              <input type="range" min="0" max="90" value={bg.overlay??55} onChange={e=>setBg({...bg,overlay:+e.target.value})} className="w-full" />
            </div>
          )}
        </div>
        <button onClick={save} className="px-5 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Применить фон</button>
      </div>
    </div>
  );
}

function TelegramTab() {
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Telegram уведомления</h2>
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <p className="text-[.88rem] mb-4" style={{color:'var(--muted)'}}>Telegram бот настраивается через переменные окружения Railway:</p>
        {[['TELEGRAM_BOT_TOKEN','Токен от @BotFather'],['TELEGRAM_CHAT_ID','ID чата/группы (-100...)']].map(([k,desc]) => (
          <div key={k} className="mb-3 p-3 rounded-lg" style={{background:'rgba(0,0,0,.4)',border:'1px solid var(--border)'}}>
            <div className="font-mono text-[.78rem] mb-1" style={{color:'var(--c1)'}}>{k}</div>
            <div className="text-[.75rem]" style={{color:'var(--muted)'}}>{desc}</div>
          </div>
        ))}
        <p className="text-[.8rem] mt-4" style={{color:'var(--muted)'}}>Уведомления автоматически приходят при новом заказе, платеже, отзыве и сообщении.</p>
      </div>
    </div>
  );
}

function LiveQRTab() {
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => { settingsApi.get('liveQrTitle').then((r: any) => setTitle(typeof r === 'string' ? r : (r?.value ?? ''))).catch(() => {}); }, []);
  const save = async () => { await settingsApi.set('liveQrTitle', title); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Live QR настройки</h2>
      {saved && <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>✓ Сохранено</div>}
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="mb-3">
          <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>Заголовок страницы Live QR</label>
          <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Live QR" />
        </div>
        <p className="text-[.8rem] mb-4" style={{color:'var(--muted)'}}>Цены для карточек (Трек, Танец, Чаевые, Сообщение) задаются в разделе <strong>Цены</strong> → Цены Live QR.</p>
        <button onClick={save} className="px-5 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Сохранить</button>
      </div>
    </div>
  );
}

function MaterialsTab() {
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => { coursesApi.getAll().then((r: any) => setCourses(Array.isArray(r) ? r : [])).catch(() => {}); }, []);
  const reload = () => coursesApi.getAll().then((r: any) => setCourses(Array.isArray(r) ? r : [])).catch(() => {});
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Материалы курсов</h2>
      <div className="space-y-6">
        {courses.map((c: any) => (
          <div key={c.id} className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
            <div className="font-syne font-bold text-base mb-3">{c.title} ({c.slug})</div>
            <p className="text-[.8rem] mb-4" style={{color:'var(--muted)'}}>Добавление материалов через API: POST /api/courses/:id/materials. Список материалов загружается при открытии курса.</p>
            <a href={`/courses/${c.slug}`} className="text-[.82rem]" style={{color:'var(--c1)'}}>Открыть курс →</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstructionsTab() {
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Инструкция по запуску</h2>
      {[
        {n:1,t:'Установить зависимости',code:`cd backend && npm install\ncd ../frontend && npm install`},
        {n:2,t:'Настроить .env',code:`cp .env.example backend/.env\n# Заполните все переменные в backend/.env`},
        {n:3,t:'Запустить базу данных',code:`docker-compose up -d postgres\ncd backend && npx prisma migrate dev --name init\nnpx prisma db seed`},
        {n:4,t:'Запустить backend',code:`cd backend && npm run start:dev\n# → http://localhost:3001/api`},
        {n:5,t:'Запустить frontend',code:`cd frontend && npm run dev\n# → http://localhost:3000`},
        {n:6,t:'Stripe webhooks (dev)',code:`stripe listen --forward-to localhost:3001/api/payments/webhook`},
        {n:7,t:'Деплой frontend → Vercel',code:`cd frontend && npx vercel`},
        {n:8,t:'Деплой backend → Railway',code:`# railway.app → New Project → Deploy from GitHub\n# Добавить PostgreSQL → скопировать DATABASE_URL`},
      ].map(s=>(
        <div key={s.n} className="flex gap-4 py-4 border-b" style={{borderColor:'var(--border)'}}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[.8rem] font-bold flex-shrink-0" style={{background:'linear-gradient(135deg,var(--c1),var(--c2))'}}>
            {s.n}
          </div>
          <div>
            <div className="font-semibold text-[.87rem] mb-2">{s.t}</div>
            <pre className="text-[.74rem] p-3 rounded-lg overflow-x-auto" style={{background:'rgba(0,0,0,.6)',border:'1px solid var(--border)',color:'var(--c1)',fontFamily:'Space Mono,monospace'}}>{s.code}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}
