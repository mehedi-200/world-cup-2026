# ⚽ World Cup 2026

A full-stack web application for the FIFA World Cup 2026 — live scores, fixtures, standings and more, with real-time updates.

## Tech Stack

**Client**
- React 18 + Vite
- Tailwind CSS
- React Router 7
- Socket.IO client (real-time updates)
- Axios

**Server**
- Node.js + Express
- MySQL (`mysql2`)
- Socket.IO (live score broadcasting)
- JWT authentication (`jsonwebtoken` + `bcryptjs`)
- express-validator

## Project Structure

```
├── client/   # React front-end (Vite + Tailwind)
└── server/   # Express REST API + Socket.IO server
```

## Getting Started

### 1. Server

```bash
cd server
npm install
cp .env.example .env   # set DB credentials & JWT secret
npm run dev
```

### 2. Client

```bash
cd client
npm install
npm run dev
```

The client runs on Vite's dev server and talks to the Express API.

## Features

- 🔴 Real-time match updates over WebSockets (Socket.IO)
- 🔐 JWT-based authentication
- 🗄️ MySQL-backed fixtures, teams and standings
- 📱 Responsive UI with Tailwind CSS

## Author

**Mehedi** — [@mehedi-200](https://github.com/mehedi-200)
