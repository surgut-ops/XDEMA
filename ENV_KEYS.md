# Переменные окружения и API-ключи — Vercel и Railway

## Где что заполнять

| Где | Что деплоится | Переменные |
|-----|----------------|------------|
| **Vercel** | Только frontend (Next.js) | Только `NEXT_PUBLIC_*` и при необходимости другие для билда |
| **Railway** | Только backend (NestJS) + БД | Всё для API, БД, Stripe, SMTP, S3, Telegram и т.д. |

---

## Vercel (проект xdema, Root Directory: `frontend`)

### Обязательно заполнить сейчас (иначе сайт не будет работать с API)

| Переменная | Пример | Где взять |
|------------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://твой-backend.up.railway.app/api` | URL бэкенда на Railway **после** деплоя (Settings → Networking → Domain). Обязательно путь с `/api` в конце. |
| `NEXT_PUBLIC_SITE_URL` | `https://xdema.vercel.app` | Твой домен фронта на Vercel (или выданный `*.vercel.app`). |

### Можно заполнить сейчас или позже

| Переменная | Пример | Зачем |
|------------|--------|--------|
| `NEXT_PUBLIC_STRIPE_PK` | `pk_test_...` или `pk_live_...` | Публичный ключ Stripe для оплаты на фронте. Без него кнопки оплаты не будут инициализироваться. |

**Где в Vercel:** Project → Settings → Environment Variables. Добавь для **Production** (и при необходимости Preview).

---

## Railway (сервис XDEMA, Root Directory: `backend`)

### Обязательно заполнить сейчас

| Переменная | Что подставить | Важно |
|------------|----------------|--------|
| `DATABASE_URL` | Строка из Railway PostgreSQL | В Railway: добавь сервис **PostgreSQL** в тот же проект → в его настройках скопируй **Postgres connection URL** (или переменную `DATABASE_URL`) и вставь в Variables сервиса XDEMA. **Не используй** `localhost:5432` — в облаке его нет. |
| `JWT_SECRET` | Случайная строка (например base64) | Сгенерировать: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. Не оставлять `replace-this-with-...`. |
| `ADMIN_EMAIL` | Твой email админа | Например `admin@xdema.ru`. |
| `ADMIN_PASSWORD` | Надёжный пароль | Обязательно смени с дефолтного из .env.example. |
| `FRONTEND_URL` | URL фронта на Vercel | Например `https://xdema.vercel.app` — для CORS и редиректов. |
| `BACKEND_URL` | URL самого бэкенда на Railway | После деплоя: Settings → Networking → Generate domain. Подставь, например `https://xdema-production.up.railway.app`. |

### Нужны для оплаты и писем (можно заглушки на старте)

| Переменная | Пример | Где взять |
|------------|--------|-----------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | stripe.com → Dashboard → Developers → API keys (Secret key). |
| `STRIPE_PUBLIC_KEY` | `pk_test_...` | Там же (Publishable key). На фронт не копировать — он у Vercel в `NEXT_PUBLIC_STRIPE_PK`. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | stripe.com → Developers → Webhooks → Add endpoint → URL: `https://твой-backend.up.railway.app/api/payments/webhook` → после создания скопировать Signing secret. |
| `SMTP_HOST` | `smtp.gmail.com` | Для Gmail. |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | Твой Gmail | |
| `SMTP_PASS` | Пароль приложения | Google Account → Security → 2-Step Verification → App passwords. |
| `EMAIL_FROM` | `XDEMA <твой@gmail.com>` | |

Без Stripe/SMTP бэкенд запустится, но оплата и отправка писем не будут работать.

### Можно настроить позже

| Переменная | Назначение |
|------------|------------|
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Уведомления в Telegram (опционально). |
| `S3_*` (S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY, S3_PUBLIC_URL, S3_REGION) | Загрузка файлов (например Yandex Object Storage). Можно оставить заглушки, если загрузка не используется. |

### Остальное (можно оставить как в .env.example)

- `JWT_EXPIRES_IN=7d`
- `BCRYPT_ROUNDS=12`
- `NODE_ENV=production` (Railway часто ставит сам)

**Важно для Railway:** переменные `NEXT_PUBLIC_*` в Railway для бэкенда не нужны — они только для фронта (Vercel). В Railway их можно не добавлять или удалить.

---

## Порядок действий

1. **Railway**
   - Добавить сервис **PostgreSQL**, скопировать `DATABASE_URL` в переменные **XDEMA**.
   - Заполнить обязательные переменные (JWT_SECRET, ADMIN_*, FRONTEND_URL, BACKEND_URL).
   - Задеплоить XDEMA (Root Directory: `backend`, при наличии Dockerfile в backend он будет использоваться).
   - Сгенерировать домен (Networking → Generate domain), подставить его в `BACKEND_URL` и во фронт как `NEXT_PUBLIC_API_URL`.
2. **Vercel**
   - Указать Root Directory: `frontend`.
   - Добавить `NEXT_PUBLIC_API_URL` (URL бэкенда с `/api`) и `NEXT_PUBLIC_SITE_URL` (URL фронта).
   - При необходимости добавить `NEXT_PUBLIC_STRIPE_PK`.
3. **Снова Railway**
   - Обновить `FRONTEND_URL` на итоговый URL Vercel (если ещё не сделано).
   - При включении оплаты — добавить Stripe ключи и webhook secret, на Stripe указать URL webhook бэкенда.
