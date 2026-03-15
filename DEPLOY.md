# Деплой XDEMA — обязательные настройки

## Vercel (frontend)

**Ошибка «No Next.js version detected»** возникает, когда Vercel собирает проект из корня репозитория, где нет Next.js.

### Что сделать

1. Открой проект **xdema** в Vercel.
2. Зайди в **Settings** → **General**.
3. В блоке **Root Directory** нажми **Edit**.
4. Укажи папку: **`frontend`** (именно эта папка содержит `package.json` с Next.js).
5. Сохрани и сделай **Redeploy**.

После этого билд будет запускаться из `frontend/`, и Next.js определится корректно.

---

## Railway (backend XDEMA)

**Ошибки «Cannot find module /app/dist/main»** и **«healthcheck failed»** возникают, когда Railway собирает не backend (NestJS), а frontend (Next.js) — в логах при этом видно `> next build`. Тогда в образе нет `dist/main.js`, и старт падает.

### Что сделать

1. Открой проект на Railway, выбери сервис **XDEMA** (backend).
2. Зайди в **Settings** → **Source**.
3. В поле **Root Directory** укажи: **`backend`** (без слэша в начале). Сохрани.
4. В корне папки `backend` в репозитории лежит **Dockerfile** — Railway его подхватит и будет собирать образ через Docker (NestJS), а не Nixpacks. Запусти **Redeploy**.

Убедись, что:
- **Root Directory** именно `backend` (не `/backend` и не пусто).
- В **Variables** у XDEMA заданы минимум: `DATABASE_URL` (от сервиса PostgreSQL в Railway, не localhost), `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL` (URL твоего фронта на Vercel), `BACKEND_URL` (URL самого бэкенда на Railway после Generate domain).
- **Healthcheck Path:** `/api/settings` (по умолчанию из `backend/railway.json`).

Подробный список переменных и что обязательно: см. **[ENV_KEYS.md](./ENV_KEYS.md)**.
