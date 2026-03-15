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

**Ошибки «Cannot find module /app/dist/main»** и **«healthcheck failed»** возникают, когда сервис XDEMA собирает не backend, а frontend (или корень), и команда `node dist/main` не находит файл.

### Что сделать

1. Открой проект на Railway, выбери сервис **XDEMA** (backend).
2. Зайди в **Settings** → **Source** (или **Service**).
3. В поле **Root Directory** укажи: **`backend`** (без слэша в начале).
4. Сохрани и запусти **Redeploy**.

Убедись, что:
- **Build Command:** `npm run build` (NestJS соберёт `dist/`).
- **Start Command:** `npm run start:prod` (или `node dist/main`).
- **Healthcheck Path:** `/api/settings` (как в `backend/railway.json`).

После этого сборка будет в `backend/`, в образ попадёт `dist/main.js`, и healthcheck сможет достучаться до API.
