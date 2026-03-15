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

**Ошибки «dist/main.js missing»** и **«> next build» в Build Logs** — значит, Docker-сборка идёт из корня репо (собирается фронт), а не из папки `backend`. Нужно либо задать контекст backend, либо использовать корневой Dockerfile для бэкенда.

### Вариант А: Root Directory = backend (рекомендуется)

1. Открой проект на Railway → сервис **XDEMA** → **Settings** → **Source**.
2. **Root Directory:** укажи **`backend`** (без слэша). Сохрани.
3. Если есть поле **Dockerfile path** / **Docker file:** укажи **`Dockerfile`** (не `backend/Dockerfile`), чтобы контекст сборки был папка `backend`.
4. Запусти **Redeploy**.

### Вариант Б: сборка из корня репо

Если после Варианта А в Build Logs по-прежнему видно `> next build` или падает проверка `dist/main.js`:

1. В **Settings** → **Source** для XDEMA поставь **Root Directory** в **пусто** (корень репо).
2. В поле **Dockerfile path** укажи: **`Dockerfile.backend`** (в корне репо лежит файл, который копирует только `backend/` и собирает NestJS).
3. Сохрани и сделай **Redeploy**.

Убедись, что:
- В **Variables** у XDEMA заданы минимум: `DATABASE_URL` (от PostgreSQL в Railway), `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`, `BACKEND_URL`.
- **Healthcheck Path:** `/api/settings`.

Подробный список переменных и что обязательно: см. **[ENV_KEYS.md](./ENV_KEYS.md)**.
