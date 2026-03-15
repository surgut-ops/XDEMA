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

Ошибки в логах:
- **«/package.json» not found** — в контекст попал корень репо, а используется `backend/Dockerfile`, который ждёт `package.json` в текущей папке. Нужно либо Root Directory = `backend` и путь к Dockerfile = `Dockerfile`, либо Root Directory пусто и путь = `Dockerfile.backend`.
- **«dist/main.js missing»** / **«> next build»** — собирается фронт вместо бэкенда; исправляется правильной парой Root Directory + Dockerfile path.

### Вариант А: Root Directory = backend

1. **Settings** → **Source**: **Root Directory** = **`backend`** (без слэша, не `/backend`).
2. **Settings** → **Build**: **Dockerfile Path** = **`Dockerfile`** (одно слово; не `/backend/Dockerfile` — иначе контекст сборки станет корень репо, в логах будет `> next build` и ошибка `dist/main.js missing`).
3. В папке `backend` лежит `railway.json` с `"dockerfilePath": "Dockerfile"` — при деплое из `backend` это подхватится автоматически.
4. Сохрани → **Redeploy**.

### Вариант Б: сборка из корня (если А не сработал)

1. **Root Directory:** оставь **пустым**.
2. **Dockerfile Path:** укажи **`Dockerfile.backend`** (именно этот файл в корне репо; не `backend/Dockerfile`).
3. Сохрани → **Redeploy**.

Важно: при пустом Root Directory путь **`/backend/Dockerfile`** даёт ошибку «package.json not found» — в этом случае нужен **`Dockerfile.backend`**.

Убедись, что:
- В **Variables** у XDEMA заданы минимум: `DATABASE_URL` (от PostgreSQL в Railway), `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`, `BACKEND_URL`.
- **Healthcheck Path:** `/api/settings`.

Подробный список переменных и что обязательно: см. **[ENV_KEYS.md](./ENV_KEYS.md)**.
