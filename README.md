# Oracle Dashboard 🛡️

Mobile-first orchard management dashboard with spraying decision helper.

## Features

- 📱 **Activity Widgets** - Latest watering, spraying, fertilizing activities
- 🧭 **Spraying Decision** - AI-powered recommendation for spray timing
- 🌤️ **Weather Integration** - Real-time weather data integration
- 📊 **Public Dashboard** - Read-only, mobile-optimized interface

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Testing**: Vitest
- **Database**: Supabase (read-only)
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## API Endpoints

- `GET /api/activities/latest` - Latest orchard activities
- `GET /api/weather/today` - Today's weather forecast
- `GET /api/spray-decision` - Spraying decision recommendation
- `GET /api/health` - System health check

## Documentation

- [Implementation Plan](../../memory/plans/2026-03-30_oracle-dashboard-mvp.md)
- [Project Protocol](../../PROJECTS_PROTOCOL.md)

---

Built by **Oracle Ranger** 🛡️ - Your Data-First Orchard Guardian
