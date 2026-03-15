'use client';
import { useEffect, useState } from 'react';
import { useUserStore, useModalStore } from '@/store';
import { usersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function AccountPage() {
  const { user, logout } = useUserStore();
  const { openAuth } = useModalStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [pwOld, setPwOld] = useState(''); const [pwNew, setPwNew] = useState(''); const [pwConf, setPwConf] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    usersApi.getMe().then(setData).catch(() => {});
  }, [user]);

  const changePw = async () => {
    if (pwNew !== pwConf) { setPwMsg('Пароли не совпадают'); return; }
    const r = await usersApi.changePassword(pwOld, pwNew).catch((e:any)=>({error:e.message})) as any;
    if (r?.error) setPwMsg(r.error);
    else { setPwMsg('Пароль изменён ✓'); setPwOld(''); setPwNew(''); setPwConf(''); }
  };

  if (!user) return null;
  const ini = user.name.split(' ').map((w:string)=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <>
      <Navbar />
      <main className="pt-[66px] min-h-screen">
        <div className="section py-16 max-w-[860px]">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block font-mono text-[.67rem] tracking-[.2em] uppercase mb-2" style={{color:'var(--c1)'}}>Кабинет</div>
            <h1 className="font-syne font-extrabold text-[clamp(1.6rem,3.5vw,2.6rem)]">Привет, {user.name.split(' ')[0]}!</h1>
            <div className="w-11 h-0.5 mx-auto rounded-full mt-1.5" style={{background:'linear-gradient(90deg,var(--c1),var(--c2))'}} />
          </div>

          {/* Profile */}
          <div className="rounded-[18px] border p-5 mb-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-syne font-bold text-xl text-white flex-shrink-0"
                style={{background:'linear-gradient(135deg,var(--c1),var(--c2))'}}>
                {ini}
              </div>
              <div className="flex-1">
                <div className="font-syne font-bold text-[1.25rem]">{user.name}</div>
                <div className="text-[.8rem] mt-0.5" style={{color:'var(--muted)'}}>{user.email}</div>
              </div>
              <button onClick={()=>{logout();router.push('/')}}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{background:'var(--glass2)',border:'1px solid var(--border)',color:'var(--text2)'}}>
                Выйти
              </button>
            </div>
          </div>

          {/* Courses */}
          <div className="rounded-[18px] border p-5 mb-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
            <div className="font-syne font-bold text-base mb-4">Мои курсы</div>
            {!data?.courses?.length ? (
              <div>
                <p className="text-[.85rem] mb-3" style={{color:'var(--muted)'}}>Курсов пока нет.</p>
                <button onClick={()=>router.push('/courses')} className="px-4 py-1.5 rounded-lg text-sm font-medium text-black"
                  style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>Выбрать курс →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.courses.map((uc:any) => (
                  <div key={uc.id} className="rounded-[14px] border p-4" style={{background:'rgba(255,255,255,.025)',border:'1px solid var(--border)'}}>
                    <div className="font-syne font-bold text-[1rem] mb-1">{uc.course.displayName || uc.course.title} курс</div>
                    <p className="text-[.82rem] mb-3" style={{color:'var(--muted)'}}>{uc.course.tagline}</p>
                    <div className="h-1 rounded-full mb-1" style={{background:'rgba(255,255,255,.08)'}}>
                      <div className="h-full rounded-full" style={{width:`${uc.progress||10}%`,background:'linear-gradient(90deg,var(--c1),var(--c2))'}} />
                    </div>
                    <div className="text-[.72rem] mb-3" style={{color:'var(--muted)'}}>Прогресс: {uc.progress||10}%</div>
                    {uc.course.materials?.length > 0 && (
                      <div>
                        <div className="font-mono text-[.66rem] tracking-[.08em] mb-2" style={{color:'var(--c1)'}}>МАТЕРИАЛЫ ({uc.course.materials.length})</div>
                        {uc.course.materials.map((m:any) => (
                          <div key={m.id} className="rounded-lg border p-3 mb-2 transition-all hover:border-[rgba(0,229,255,.2)]"
                            style={{background:'rgba(255,255,255,.025)',border:'1px solid var(--border)'}}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[.63rem] px-1.5 py-0.5 rounded" style={{background:'rgba(0,229,255,.1)',color:'var(--c1)'}}>{m.type}</span>
                              <span className="text-[.87rem] font-medium">{m.title}</span>
                            </div>
                            {m.content && <p className="text-[.81rem] mt-1.5 leading-[1.6]" style={{color:'var(--muted)'}}>{m.content}</p>}
                            {m.url && <a href={m.url} target="_blank" rel="noopener" className="text-[.81rem] mt-1 block" style={{color:'var(--c1)'}}>Открыть →</a>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          {data?.notifications?.length > 0 && (
            <div className="rounded-[18px] border p-5 mb-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
              <div className="font-syne font-bold text-base mb-4">
                Уведомления от XDEMA
                <span className="ml-2 px-2 py-0.5 rounded-full text-[.65rem] font-bold" style={{background:'var(--c2)',color:'#fff'}}>{data.notifications.length}</span>
              </div>
              {data.notifications.map((n:any) => (
                <div key={n.id} className="rounded-xl border p-4 mb-3" style={{background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.12)'}}>
                  {n.imageUrl && <img src={n.imageUrl} alt="" className="w-full rounded-lg mb-3 object-cover" style={{height:n.imageHeight||160}} loading="lazy" />}
                  <div className="font-semibold text-[.9rem] mb-1">{n.title}</div>
                  <div className="text-[.84rem] leading-[1.6]" style={{color:'var(--muted)'}}>{n.text}</div>
                  <div className="text-[.7rem] mt-1.5" style={{color:'var(--muted2)'}}>{n.createdAt ? new Date(n.createdAt).toLocaleDateString('ru') : ''}</div>
                </div>
              ))}
            </div>
          )}

          {/* Orders */}
          {data?.orders?.length > 0 && (
            <div className="rounded-[18px] border p-5 mb-4" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
              <div className="font-syne font-bold text-base mb-4">История заказов</div>
              <div className="overflow-x-auto">
                <table className="w-full text-[.83rem]">
                  <thead><tr className="border-b" style={{borderColor:'var(--border)'}}>
                    {['Тип','Сумма','Дата','Статус'].map(h=><th key={h} className="text-left py-2 px-2 text-[.68rem] uppercase tracking-[.1em]" style={{color:'var(--muted)'}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {data.orders.map((o:any) => (
                      <tr key={o.id} className="border-b" style={{borderColor:'rgba(255,255,255,.03)'}}>
                        <td className="py-2.5 px-2">{o.type}</td>
                        <td className="py-2.5 px-2 font-mono" style={{color:'var(--c1)'}}>{o.amount ? `${o.amount.toLocaleString('ru')} ₽` : '—'}</td>
                        <td className="py-2.5 px-2" style={{color:'var(--muted)'}}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('ru') : ''}</td>
                        <td className="py-2.5 px-2"><span className="px-2 py-0.5 rounded-full text-[.68rem] font-semibold" style={{background:'rgba(0,232,122,.1)',color:'var(--c5)'}}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Change password */}
          <div className="rounded-[18px] border p-5" style={{background:'var(--card)',border:'1px solid var(--border)'}}>
            <div className="font-syne font-bold text-base mb-4">Сменить пароль</div>
            {['Текущий пароль','Новый пароль','Подтвердить новый'].map((label, i) => {
              const vals = [pwOld, pwNew, pwConf];
              const setters = [setPwOld, setPwNew, setPwConf];
              return (
                <div key={label} className="mb-3">
                  <label className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5" style={{color:'var(--muted)'}}>{label}</label>
                  <input type="password" className="form-control" value={vals[i]} onChange={e=>setters[i](e.target.value)} placeholder="••••••••" />
                </div>
              );
            })}
            {pwMsg && <div className="text-[.8rem] mb-3" style={{color:pwMsg.includes('✓')?'var(--c5)':'var(--c2)'}}>{pwMsg}</div>}
            <button onClick={changePw} className="px-5 py-2 rounded-lg text-sm font-semibold text-black" style={{background:'linear-gradient(135deg,var(--c1),#009ab8)'}}>
              Сохранить пароль
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
