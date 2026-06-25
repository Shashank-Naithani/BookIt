# BookIt — Live Event Booking Platform

A full-stack event booking platform with a strict "no-oversell" guarantee, real-time analytics, and role-based access.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or via Docker)

## How to Run Locally

### 1. Database Setup
Ensure PostgreSQL is running. The default connection string is configured in `backend/.env`. Update `DATABASE_URL` if your credentials differ.

### 2. Start the App (One-Command Setup)
Open two terminal windows:

**Terminal 1: Backend (Install, Migrate, Seed & Start)**
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

**Terminal 2: Frontend (Install & Start)**
```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

### Default Test Accounts (from Seed)
- **Organizer:** `organizer@example.com` / `password123`
- **User:** `user@example.com` / `password123`