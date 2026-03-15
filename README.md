# XDEMA DJ Platform

Fullstack DJ-платформа: Next.js 14 + NestJS + PostgreSQL + Stripe

## Быстрый старт

```bash
# 1. Клонировать
git clone <your-repo-url>
cd xdema

# 2. Настроить переменные
cp .env.example backend/.env
# Откройте backend/.env и заполните все поля

# 3. База данных (Docker)
docker-compose up -d postgres

# 4. Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev   # → http://localhost:3001/api

# 5. Frontend (новый терминал)
cd frontend
npm install
cp ../.env.example .env.local   # добавить NEXT_PUBLIC_* переменные
npm run dev         # → http://localhost:3000
```

**Admin панель:** http://localhost:3000/admin  
Логин/пароль: указаны в `backend/.env` → `ADMIN_EMAIL / ADMIN_PASSWORD`

---

## Деплой

### Frontend → Vercel
```bash
cd frontend && npx vercel
# Добавить env переменные в Vercel Dashboard
```

### Backend → Railway.app
1. railway.app → New Project → Deploy from GitHub → выбрать папку `/backend`
2. Добавить PostgreSQL сервис
3. Скопировать `DATABASE_URL` из PostgreSQL сервиса
4. Добавить все переменные из `.env.example` в Settings → Variables

### Stripe webhooks (production)
```
Stripe Dashboard → Developers → Webhooks → Add endpoint
URL: https://api.your-domain.com/api/payments/webhook
Events: checkout.session.completed
```

---

## Структура проекта

```
xdema/
├── frontend/        # Next.js 14 + TypeScript + Tailwind
│   ├── app/         # Pages (Router)
│   ├── components/  # UI + Sections + Layout
│   ├── lib/api.ts   # Все API вызовы
│   └── store/       # Zustand stores
│
├── backend/         # NestJS + Prisma
│   ├── src/         # Модули: auth, users, courses, orders, payments...
│   └── prisma/      # Schema + Seed
│
└── docker-compose.yml   # PostgreSQL + Redis
```

---

## Ключевые функции

| Функция | Описание |
|---|---|
| DJ пульт | SVG анимация, spinning vinyl, пульсирующие пады |
| Тарифы обучения | 3 курса, оплата через Stripe |
| Live QR | Заказ треков/чаевые/сообщения на мероприятии |
| Галерея | CSS Grid, per-item resize в Admin |
| Отзывы | Форма + модерация в Admin |
| Личный кабинет | Курсы + материалы + уведомления от Admin |
| Smart Popup | Настраиваемый с изображением |
| 6 пресетов фона | Орбы, Волны, Аврора, Виниловые кольца, Неон, Туманность |
| Режим экономии | Кнопка отключает анимации на слабых устройствах |
| Тёмная/светлая тема | Переключатель в шапке |
| Telegram уведомления | При каждом заказе/платеже/отзыве |
| Полная Admin панель | Dashboard, Заказы, Цены, Галерея, Редактор текстов... |
