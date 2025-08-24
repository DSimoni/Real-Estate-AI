# 🏡 Real Estate Scraping Platform

A **full-stack real estate scraping platform** that collects property listings from multiple sources, processes them through a backend API, and displays them in a modern **Next.js dashboard**.

---

## 🏗️ Architecture

```
                      ┌────────────────────┐
                      │     Next.js        │  <-- Dashboard / Frontend
                      └────────┬───────────┘
                               │
                       ┌───────▼────────┐
                       │ ASP.NET Core   │  <-- Main backend API
                       │ (REST or gRPC) │
                       └───────┬────────┘
                               │
                     ┌─────────▼──────────┐
                     │ PostgreSQL / Redis │
                     └─────────┬──────────┘
                               │
       ┌───────────────────────┼────────────────────────┐
       │                       │                        │
┌──────▼─────┐         ┌───────▼──────┐         ┌───────▼──────┐
│ Node Scraper│         │ Node Scraper│         │ Node Scraper │
│ MerrJep.al  │         │ Njoftime.com│         │ Kosovo/Italy │
└─────────────┘         └─────────────┘         └──────────────┘
```

---

## 🔧 Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/) (React + SSR/SSG)
* **Backend**: [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) (REST API / gRPC)
* **Database & Cache**: [PostgreSQL](https://www.postgresql.org/) + [Redis](https://redis.io/)
* **Scrapers**: Node.js scrapers for multiple marketplaces:

  * MerrJep.al
  * Njoftime.com
  * Kosovo / Italy marketplaces

---

## ⚙️ Development Setup

### Backend (ASP.NET Core)

```bash
cd backend
dotnet restore
dotnet run
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

### Scrapers

```bash
cd scrapers/merrjep
node index.js

cd scrapers/njoftime
node index.js
```

---

## 🚀 Features

* Automated scraping of multiple real estate platforms
* Unified API with ASP.NET Core (REST/gRPC)
* Next.js dashboard for browsing/searching listings
* PostgreSQL storage with Redis caching
* Modular scraper design for easy extension

---

## 📌 Roadmap

* [ ] Add more marketplaces (e.g., Greece, Albania regions)
* [ ] Implement advanced filtering in Next.js dashboard
* [ ] Add WebSocket support for real-time updates
* [ ] Dockerize all services for easier deployment

---

## 📄 License

MIT License – free to use and modify.
