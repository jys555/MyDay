# MyDay - Telegram Mini App Personal Planner

Production-ready Telegram Mini App for daily task management with reminders.

## 🏗️ Project Structure

```
MyDay/
├── backend/          # Node.js + Express + Prisma + PostgreSQL
├── frontend/         # React + Vite + TailwindCSS + Telegram Mini App SDK
└── package.json      # Monorepo root
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Railway Postgres)
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

### Local Development

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Railway backend URL
npm run dev
```

## 📦 Deployment

### Railway (Backend + Database)

1. Create Railway account and new project
2. Add PostgreSQL service
3. Add Node.js service from GitHub repo (backend folder)
4. Set environment variables:
   - `DATABASE_URL` (from Postgres service)
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_BOT_WEBAPP_URL` (your Vercel frontend URL)
   - `TELEGRAM_BOT_SECRET` (optional, for webhook)
5. Deploy

### Vercel (Frontend)

1. Import GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Set environment variable:
   - `VITE_API_BASE_URL` = your Railway backend URL (e.g., `https://myday-backend.up.railway.app`)
4. Deploy

### Telegram Bot Setup

1. Open your bot in Telegram
2. Send `/start` command
3. Click "Open MyDay" button to launch Mini App

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://...
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_BOT_WEBAPP_URL=https://my-day-jys.vercel.app
TELEGRAM_BOT_SECRET=optional_secret
PORT=4000
```

### Frontend (.env)

```env
VITE_API_BASE_URL=https://myday-backend.up.railway.app
```

## 📱 Features

- ✅ Create, edit, delete tasks
- ✅ Set priority (low, medium, high)
- ✅ Set due dates
- ✅ Mark tasks as done
- ✅ Today/Week/All Tasks views
- ✅ Telegram reminders (via cron job)
- ✅ Dark mode UI optimized for mobile

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- node-telegram-bot-api
- Railway cron jobs

**Frontend:**
- React 18
- Vite
- TailwindCSS
- @twa-dev/sdk (Telegram Mini App SDK)
- React Router
- Axios

## 📝 License

MIT
