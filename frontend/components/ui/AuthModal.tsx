'use client';
import { useState } from 'react';
import { useModalStore, useUserStore } from '@/store';
import { authApi } from '@/lib/api';

export function AuthModal() {
  const { auth, closeAll } = useModalStore();
  const { login } = useUserStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!auth) return null;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const r: any =
        mode === 'login'
          ? await authApi.login(email, password)
          : await authApi.register(name, email, password);
      login(r.user, r.token);
      closeAll();
      if (r.user?.role === 'ADMIN') window.location.href = '/admin';
      else window.location.href = '/account';
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && closeAll()}
    >
      <div className="glass-card p-8 w-full max-w-[380px] relative">
        <button
          onClick={closeAll}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-sm"
          style={{
            background: 'var(--glass2)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
        >
          ✕
        </button>

        <div className="font-syne font-extrabold text-[1.6rem] tracking-[.1em] mb-1 bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] bg-clip-text text-transparent">
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </div>
        <p className="text-[.78rem] mb-6" style={{ color: 'var(--muted)' }}>
          {mode === 'login'
            ? 'Войдите в аккаунт XDEMA'
            : 'Создайте аккаунт XDEMA'}
        </p>

        {mode === 'register' && (
          <div className="mb-3">
            <label
              className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5"
              style={{ color: 'var(--muted)' }}
            >
              Имя
            </label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
            />
          </div>
        )}
        <div className="mb-3">
          <label
            className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5"
            style={{ color: 'var(--muted)' }}
          >
            Email
          </label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-[.7rem] uppercase tracking-[.1em] mb-1.5"
            style={{ color: 'var(--muted)' }}
          >
            Пароль
          </label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && (
          <p className="text-[.8rem] mb-3" style={{ color: 'var(--c2)' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-black mb-3 disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg,var(--c1),#009ab8)',
          }}
        >
          {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
          className="w-full text-center text-[.8rem]"
          style={{ color: 'var(--muted)' }}
        >
          {mode === 'login'
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}
