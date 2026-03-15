'use client';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store';
import { useRouter } from 'next/navigation';
import { ordersApi, reviewsApi, galleryApi, settingsApi, usersApi, messagesApi, adminNotifApi } from '@/lib/api';
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
    const [orders, reviews, users, msgs] = await Promise.all([
      ordersApi.getAll().catch(()=>[]),
      reviewsApi.getAll().catch(()=>[]),
      usersApi.getAll().catch(()=>[]),
      messagesApi.getAll().catch(()=>[]),
    ]);
    setData({ orders, reviews, users, msgs });
  };
  useEffect(() => { load(); }, [tab]);

  if (tab === 'dashboard') return <DashboardTab data={data} />;
  if (tab === 'orders') return <OrdersTab orders={data.orders||[]} reload={load} />;
  if (tab === 'reviews') return <ReviewsTab reviews={data.reviews||[]} reload={load} />;
  if (tab === 'users') return <UsersTab users={data.users||[]} reload={load} />;
  if (tab === 'messages') return <MessagesTab msgs={data.msgs||[]} />;
  if (tab === 'gallery') return <GalleryTab />;
  if (tab === 'instructions') return <InstructionsTab />;
  return <div className="text-center py-20" style={{color:'var(--muted)'}}>Раздел в разработке</div>;
}

function DashboardTab({ data }: any) {
  const stats = [
    {label:'Заказов',val:data.orders?.length||0},{label:'Пользователей',val:data.users?.length||0},
    {label:'На модерации',val:data.reviews?.filter((r:any)=>!r.approved).length||0},{label:'Сообщений',val:data.msgs?.length||0},
  ];
  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
      <div className="rounded-xl border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-[.82rem]">
            <thead><tr className="border-b" style={{borderColor:'var(--border)'}}>{['#','Тип','Клиент','Email','Сумма','Статус',''].map(h=><th key={h} className="text-left py-2 px-2 text-[.67rem] uppercase tracking-[.1em]" style={{color:'var(--muted)'}}>{h}</th>)}</tr></thead>
            <tbody>{orders.map((o:any)=>(
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

  useEffect(() => {
    galleryApi
      .getAll()
      .then((res: any) => setItems(res as any[]))
      .catch(() => {});
  }, []);

  const addUrl = async () => {
    if (!url) return;
    await galleryApi.addUrl(label || 'Photo', url);
    galleryApi
      .getAll()
      .then((res: any) => setItems(res as any[]))
      .catch(() => {});
    setUrl('');
    setLabel('');
  };

  return (
    <div>
      <h2 className="font-syne font-bold text-[1.45rem] mb-5">Галерея</h2>
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
            {g.imageUrl ? <img src={g.imageUrl} alt={g.label} className="w-full object-cover" style={{height:120}} loading="lazy" />
              : <div className="flex items-center justify-center text-[.76rem] h-[120px]" style={{background:'rgba(0,229,255,.1)',color:'var(--muted)'}}>{g.label}</div>}
            <button onClick={async()=>{await galleryApi.delete(g.id);galleryApi.getAll().then(setItems).catch(()=>{});}} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[.65rem]" style={{background:'var(--c2)'}}>✕</button>
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
