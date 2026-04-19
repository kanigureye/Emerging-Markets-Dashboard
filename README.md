# Emerging Markets Dashboard

A fullstack economic data dashboard displaying real-time indicators for African emerging markets.
Built with Java Spring Boot, React TypeScript, and the World Bank Open Data API.

## Live Demo

- **Frontend:** https://emerging-markets-dashboard-two.vercel.app
- **API:** https://emerging-markets-dashboard-production.up.railway.app/api/countries

Built with Java Spring Boot, React TypeScript, and the World Bank Open Data API.

---

## Tech Stack

**Backend**
- Java 21 + Spring Boot 3
- PostgreSQL + Flyway migrations
- Maven
- World Bank API integration

**Frontend**
- React 19 + TypeScript
- Vite
- TanStack Query
- Recharts
- Axios

---

## Prerequisites

- Java 21+
- Maven
- PostgreSQL running locally
- Node.js 18+
---

## Getting Started

### 1. Database setup

Create a PostgreSQL database:
sql
CREATE DATABASE emerging_markets;

2. Backend

From project root
./mvnw spring-boot:run
Flyway will automatically run migrations and create the tables.
On startup, the app fetches and seeds economic data from the World Bank API.

Backend runs on: `http://localhost:8080`

3. Frontend

cd frontend
npm install
npm run dev
Frontend runs on: `http://localhost:5173`

───

API Endpoints

| Method | Endpoint                                            | Description                        |
| ------ | --------------------------------------------------- | ---------------------------------- |
| GET    | /api/countries                                      | List all countries                 |
| GET    | /api/countries/{code}                               | Get country by code                |
| GET    | /api/indicators/{countryCode}                       | Shaped economic data for a country |
| GET    | /api/indicators/{countryCode}/raw                   | Raw indicator data                 |
| GET    | /api/indicators/{countryCode}/filter?indicatorCode= | Filter by indicator                |
───

Countries & Indicators

**Countries:** Nigeria, Kenya, Ghana, South Africa, Ethiopia

**Indicators:**

• GDP (current US$)
• Inflation, consumer prices (annual %)
• Population, total

───

Data Source
[World Bank Open Data](https://data.worldbank.org/) — free, no API key required.
Data is fetched on startup and refreshed weekly.