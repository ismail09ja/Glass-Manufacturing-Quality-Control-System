# Glass Manufacturing Quality Control System

A full-stack quality control management system for glass manufacturing facilities.

## Tech Stack

| Layer | Technology |
|------------|-------------------------------------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB 7 (Mongoose ODM) |
| Auth | JWT (role-based: Admin, Inspector, Manager) |
| DevOps | Docker, docker-compose, GitHub Actions CI/CD |

## Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

### Option 2: Local Development

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

> **Note:** You need a local MongoDB instance running on port 27017 for local dev.

## Project Structure

```
glass-qc-system/
├── backend/
│   ├── config/          # DB connection
│   ├── middleware/       # JWT auth, role authorization
│   ├── models/          # Mongoose schemas (User, Batch, Inspection, Defect, Alert)
│   ├── routes/          # Express API routes
│   ├── tests/           # Jest tests
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── src/app/         # Next.js App Router pages
│   ├── src/lib/         # API client
│   ├── __tests__/       # React Testing Library tests
│   ├── Dockerfile
│   └── next.config.js
├── .github/workflows/   # CI/CD pipeline
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|---------------------------|------|-------------------------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| GET | /api/batches | Yes | List batches |
| POST | /api/batches | Yes | Create batch |
| GET | /api/batches/:id | Yes | Get batch details |
| GET | /api/inspection | Yes | List inspections |
| POST | /api/inspection | Yes | Record inspection |
| PUT | /api/inspection/:id | Yes | Update inspection |
| GET | /api/defects | Yes | List defects |
| POST | /api/defects | Yes | Report defect |
| GET | /api/dashboard/stats | Yes | Dashboard analytics |
| GET | /api/alerts | Yes | List alerts |
| PUT | /api/alerts/:id/resolve | Yes | Resolve alert |

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```
