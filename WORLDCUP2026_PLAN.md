# FIFA World Cup 2026 — Full-Stack Web Application Plan

> **Project:** WorldCup2026 — A production-grade football World Cup web application  
> **Author:** Mehedi  
> **Date:** 2026-05-12  
> **Status:** Implementation Complete — 95%  
> **Total Files Created:** 153 (excl. node_modules)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Environment & Infrastructure](#3-environment--infrastructure)
4. [Database Design (MySQL)](#4-database-design-mysql)
5. [Full Folder Structure](#5-full-folder-structure)
6. [Backend Architecture](#6-backend-architecture)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Reusable Component System](#8-reusable-component-system)
9. [API Design](#9-api-design)
10. [Feature Module Design](#10-feature-module-design)
11. [Reusability Rules](#11-reusability-rules)
12. [Full Feature Example — Matches](#12-full-feature-example--matches)
13. [State Management Strategy](#13-state-management-strategy)
14. [Real-Time Architecture (Socket.io)](#14-real-time-architecture-socketio)
15. [Authentication Flow](#15-authentication-flow)
16. [Build Order & Milestones](#16-build-order--milestones)

---

## 1. Project Overview

A web application inspired by the FIFA World Cup 2026 that allows users to:

- **Browse matches** — View scheduled, live, and completed matches
- **See live scores** — Real-time score updates via Socket.io
- **Make predictions** — Predict match outcomes before kickoff
- **Compete on leaderboard** — Earn points for correct predictions
- **Play quizzes** — Football trivia and knowledge quizzes
- **Vote** — Vote for best player, best goal, etc.

### Core Principles

| Principle | Rule |
|-----------|------|
| **Reusability** | Every UI element and logic unit is written once, used everywhere |
| **Modularity** | Features are self-contained modules that can be developed independently |
| **Separation of Concerns** | UI layer never contains business logic; API calls live in service layer |
| **Scalability** | Adding a new feature means adding a new folder, not touching existing code |
| **Consistency** | Same patterns, naming, and structure across every module |

---

## 2. Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library (component-based) |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client (via service layer) |
| **React Context + useReducer** | State management |
| **Socket.io-client** | Real-time updates |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js v18** | Runtime |
| **Express.js** | HTTP framework |
| **mysql2** | MySQL driver (Promise-based) |
| **jsonwebtoken (JWT)** | Authentication |
| **bcryptjs** | Password hashing |
| **Socket.io** | Real-time WebSocket server |
| **cors** | Cross-origin handling |
| **dotenv** | Environment config |
| **express-validator** | Input validation |

### Database
| Technology | Purpose |
|------------|---------|
| **MariaDB 10.4** | Database (via XAMPP) |
| **phpMyAdmin** | DB admin GUI (via XAMPP) |

---

## 3. Environment & Infrastructure

### XAMPP Setup
```
XAMPP Location:    /opt/lampp/
MySQL Binary:      /opt/lampp/bin/mysql
MySQL Port:        3306
phpMyAdmin:        http://localhost/phpmyadmin
MySQL User:        root (no password by default)
```

### Project Location
```
Project Root:      /home/mehedi/Documents/new-folder/
Frontend:          /home/mehedi/Documents/new-folder/client/
Backend:           /home/mehedi/Documents/new-folder/server/
```

### Running Ports
| Service | Port | URL |
|---------|------|-----|
| XAMPP Apache | 80 | http://localhost |
| XAMPP MySQL | 3306 | — |
| Express API | 5000 | http://localhost:5000/api |
| Vite Dev Server | 5173 | http://localhost:5173 |
| Socket.io | 5000 | ws://localhost:5000 |

### Environment Variables (server/.env)
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=worldcup2026
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## 4. Database Design (MySQL)

### Entity Relationship Overview
```
users ──────────┐
                 ├──> predictions ──> matches
                 ├──> quiz_attempts ──> quizzes ──> quiz_questions
                 └──> votes
                 
teams ──────────> group_standings ──> groups
teams ──────────> matches (home_team / away_team)
```

### Tables

#### `users`
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    total_points INT DEFAULT 0,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `teams`
```sql
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3) UNIQUE NOT NULL,        -- e.g., 'BRA', 'ARG', 'GER'
    flag_url VARCHAR(255) DEFAULT NULL,
    group_id INT,
    played INT DEFAULT 0,
    won INT DEFAULT 0,
    drawn INT DEFAULT 0,
    lost INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    goal_difference INT DEFAULT 0,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `groups`(id)
);
```

#### `groups`
```sql
CREATE TABLE `groups` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) NOT NULL,              -- e.g., 'Group A', 'Group B'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `matches`
```sql
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    group_id INT DEFAULT NULL,
    stage ENUM('group', 'round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final') NOT NULL,
    match_date DATETIME NOT NULL,
    venue VARCHAR(255) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    home_score INT DEFAULT NULL,
    away_score INT DEFAULT NULL,
    status ENUM('scheduled', 'live', 'half_time', 'completed', 'postponed') DEFAULT 'scheduled',
    minute INT DEFAULT NULL,                -- current match minute if live
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id),
    FOREIGN KEY (group_id) REFERENCES `groups`(id)
);
```

#### `match_events`
```sql
CREATE TABLE match_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    event_type ENUM('goal', 'own_goal', 'penalty_goal', 'penalty_miss', 'yellow_card', 'red_card', 'substitution') NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    minute INT NOT NULL,
    details VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

#### `predictions`
```sql
CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    match_id INT NOT NULL,
    predicted_home_score INT NOT NULL,
    predicted_away_score INT NOT NULL,
    points_earned INT DEFAULT 0,
    is_scored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_prediction (user_id, match_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);
```

#### `quizzes`
```sql
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `quiz_questions`
```sql
CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option ENUM('a', 'b', 'c', 'd') NOT NULL,
    points INT DEFAULT 10,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
```

#### `quiz_attempts`
```sql
CREATE TABLE quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
```

#### `quiz_responses`
```sql
CREATE TABLE quiz_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option ENUM('a', 'b', 'c', 'd') NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);
```

#### `votes`
```sql
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    poll_id INT NOT NULL,
    option_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_vote (user_id, poll_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE
);
```

#### `polls`
```sql
CREATE TABLE polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `poll_options`
```sql
CREATE TABLE poll_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    vote_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);
```

### Prediction Scoring Rules
| Outcome | Points |
|---------|--------|
| Exact score match (e.g., predicted 2-1, result 2-1) | **10** |
| Correct goal difference (e.g., predicted 3-1, result 2-0) | **5** |
| Correct winner only (e.g., predicted 3-0, result 1-0) | **3** |
| Wrong prediction | **0** |

---

## 5. Full Folder Structure

```
worldcup2026/
├── client/                          # FRONTEND (React + Vite)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── assets/
│   │       └── flags/               # Team flag images
│   ├── src/
│   │   ├── main.jsx                 # App entry point
│   │   ├── App.jsx                  # Root component + Router
│   │   ├── index.css                # Tailwind imports
│   │   │
│   │   ├── components/              # SHARED REUSABLE COMPONENTS
│   │   │   ├── ui/                  # Atomic UI elements
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── index.js         # Barrel export
│   │   │   │
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── PageLayout.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── shared/              # Composed shared components
│   │   │       ├── TeamBadge.jsx     # Flag + team name (reused everywhere)
│   │   │       ├── ScoreDisplay.jsx  # Score rendering (reused in cards, detail pages)
│   │   │       ├── CountdownTimer.jsx
│   │   │       ├── StatusBadge.jsx   # Match status indicator
│   │   │       ├── PointsBadge.jsx   # Points display
│   │   │       └── index.js
│   │   │
│   │   ├── features/                # FEATURE MODULES
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   ├── RegisterForm.jsx
│   │   │   │   │   └── ProtectedRoute.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.js
│   │   │   │   ├── services/
│   │   │   │   │   └── authService.js
│   │   │   │   ├── context/
│   │   │   │   │   └── AuthContext.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── matches/
│   │   │   │   ├── components/
│   │   │   │   │   ├── MatchCard.jsx
│   │   │   │   │   ├── MatchList.jsx
│   │   │   │   │   ├── MatchDetail.jsx
│   │   │   │   │   ├── LiveIndicator.jsx
│   │   │   │   │   └── MatchEventTimeline.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useMatches.js
│   │   │   │   │   └── useLiveMatch.js
│   │   │   │   ├── services/
│   │   │   │   │   └── matchService.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── predictions/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PredictionForm.jsx
│   │   │   │   │   ├── PredictionCard.jsx
│   │   │   │   │   └── PredictionHistory.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── usePredictions.js
│   │   │   │   ├── services/
│   │   │   │   │   └── predictionService.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── leaderboard/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LeaderboardTable.jsx
│   │   │   │   │   ├── LeaderboardRow.jsx
│   │   │   │   │   └── UserRankCard.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useLeaderboard.js
│   │   │   │   ├── services/
│   │   │   │   │   └── leaderboardService.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── components/
│   │   │   │   │   ├── QuizCard.jsx
│   │   │   │   │   ├── QuizList.jsx
│   │   │   │   │   ├── QuizPlayer.jsx
│   │   │   │   │   ├── QuestionCard.jsx
│   │   │   │   │   └── QuizResult.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useQuiz.js
│   │   │   │   ├── services/
│   │   │   │   │   └── quizService.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── voting/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PollCard.jsx
│   │   │   │   │   ├── PollList.jsx
│   │   │   │   │   └── PollResults.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useVoting.js
│   │   │   │   ├── services/
│   │   │   │   │   └── votingService.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── groups/
│   │   │       ├── components/
│   │   │       │   ├── GroupTable.jsx
│   │   │       │   └── GroupStageView.jsx
│   │   │       ├── hooks/
│   │   │       │   └── useGroups.js
│   │   │       ├── services/
│   │   │       │   └── groupService.js
│   │   │       └── index.js
│   │   │
│   │   ├── pages/                   # PAGE COMPONENTS (compose features)
│   │   │   ├── HomePage.jsx
│   │   │   ├── MatchesPage.jsx
│   │   │   ├── MatchDetailPage.jsx
│   │   │   ├── PredictionsPage.jsx
│   │   │   ├── LeaderboardPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── QuizPlayPage.jsx
│   │   │   ├── VotingPage.jsx
│   │   │   ├── GroupsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── services/                # GLOBAL SERVICES
│   │   │   └── api.js               # Axios instance with interceptors
│   │   │
│   │   ├── hooks/                   # GLOBAL CUSTOM HOOKS
│   │   │   ├── useSocket.js         # Socket.io connection hook
│   │   │   ├── useToast.js          # Toast notification hook
│   │   │   └── usePagination.js     # Pagination logic
│   │   │
│   │   ├── context/                 # GLOBAL CONTEXTS
│   │   │   ├── SocketContext.jsx
│   │   │   └── ToastContext.jsx
│   │   │
│   │   ├── utils/                   # UTILITY FUNCTIONS
│   │   │   ├── formatDate.js
│   │   │   ├── formatScore.js
│   │   │   ├── calculatePoints.js
│   │   │   └── constants.js
│   │   │
│   │   └── routes/                  # ROUTE DEFINITIONS
│   │       └── AppRoutes.jsx
│   │
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # BACKEND (Node.js + Express)
│   ├── src/
│   │   ├── app.js                   # Express app setup (middleware, routes)
│   │   ├── server.js                # Server entry point (listen + socket.io)
│   │   │
│   │   ├── config/
│   │   │   ├── db.js                # MySQL connection pool
│   │   │   ├── socket.js            # Socket.io setup
│   │   │   └── env.js               # Environment variable loader
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification middleware
│   │   │   ├── adminOnly.js         # Admin role check
│   │   │   ├── validate.js          # Request validation middleware
│   │   │   └── errorHandler.js      # Global error handler
│   │   │
│   │   ├── features/                # FEATURE MODULES (backend)
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── auth.validation.js
│   │   │   │
│   │   │   ├── matches/
│   │   │   │   ├── match.routes.js
│   │   │   │   ├── match.controller.js
│   │   │   │   ├── match.service.js
│   │   │   │   ├── match.validation.js
│   │   │   │   └── match.socket.js   # Socket handlers for live matches
│   │   │   │
│   │   │   ├── predictions/
│   │   │   │   ├── prediction.routes.js
│   │   │   │   ├── prediction.controller.js
│   │   │   │   ├── prediction.service.js
│   │   │   │   └── prediction.validation.js
│   │   │   │
│   │   │   ├── leaderboard/
│   │   │   │   ├── leaderboard.routes.js
│   │   │   │   ├── leaderboard.controller.js
│   │   │   │   └── leaderboard.service.js
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── quiz.routes.js
│   │   │   │   ├── quiz.controller.js
│   │   │   │   ├── quiz.service.js
│   │   │   │   └── quiz.validation.js
│   │   │   │
│   │   │   ├── voting/
│   │   │   │   ├── voting.routes.js
│   │   │   │   ├── voting.controller.js
│   │   │   │   ├── voting.service.js
│   │   │   │   └── voting.validation.js
│   │   │   │
│   │   │   ├── teams/
│   │   │   │   ├── team.routes.js
│   │   │   │   ├── team.controller.js
│   │   │   │   └── team.service.js
│   │   │   │
│   │   │   └── groups/
│   │   │       ├── group.routes.js
│   │   │       ├── group.controller.js
│   │   │       └── group.service.js
│   │   │
│   │   └── utils/
│   │       ├── AppError.js           # Custom error class
│   │       ├── catchAsync.js         # Async error wrapper
│   │       └── scorePrediction.js    # Prediction scoring logic
│   │
│   ├── database/
│   │   ├── schema.sql               # Full database schema
│   │   └── seed.sql                  # Seed data (teams, groups, sample matches)
│   │
│   ├── .env                         # Environment variables (git-ignored)
│   ├── .env.example                 # Template
│   ├── package.json
│   └── nodemon.json
│
├── .gitignore
├── WORLDCUP2026_PLAN.md             # This file
└── README.md
```

---

## 6. Backend Architecture

### Request Flow
```
Client Request
    │
    ▼
[Express Router]  ──>  route file picks the right controller
    │
    ▼
[Middleware]       ──>  auth.js, validate.js (runs BEFORE controller)
    │
    ▼
[Controller]      ──>  handles req/res, calls service, sends response
    │
    ▼
[Service]         ──>  contains business logic, calls database
    │
    ▼
[Database (MySQL)] ──>  raw SQL via mysql2 pool
    │
    ▼
Response sent back to client
```

### Layer Responsibilities

| Layer | File | Does | Does NOT |
|-------|------|------|----------|
| **Route** | `*.routes.js` | Define endpoints, attach middleware, call controller | Contain logic |
| **Controller** | `*.controller.js` | Parse request, call service, format response | Access DB directly |
| **Service** | `*.service.js` | Business logic, DB queries, data transformation | Touch req/res objects |
| **Validation** | `*.validation.js` | Define express-validator rules | Contain business rules |
| **Middleware** | `middleware/*.js` | Cross-cutting concerns (auth, errors) | Feature-specific logic |

### Database Connection (config/db.js)
```javascript
// Creates a connection pool — reused across all services
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // 127.0.0.1
    port: process.env.DB_PORT,       // 3306
    user: process.env.DB_USER,       // root
    password: process.env.DB_PASSWORD,// (empty for XAMPP default)
    database: process.env.DB_NAME,   // worldcup2026
    waitForConnections: true,
    connectionLimit: 10
});
// Export pool.promise() for async/await usage
```

### Error Handling Pattern
```javascript
// Every controller uses catchAsync wrapper — no try/catch boilerplate
// AppError class for operational errors with status codes
// Global errorHandler middleware catches everything
```

---

## 7. Frontend Architecture

### Component Hierarchy
```
App
├── ToastProvider (global)
├── AuthProvider (global)
├── SocketProvider (global)
└── Router
    ├── PageLayout
    │   ├── Header
    │   ├── <Page Component>         ← Pages compose features
    │   │   ├── Feature Components   ← Feature-specific UI
    │   │   │   └── UI Components    ← Reusable atoms
    │   │   └── Shared Components    ← Cross-feature composed UI
    │   └── Footer
    └── NotFoundPage
```

### Data Flow
```
Page Component
    │
    ├── calls custom hook (e.g., useMatches)
    │       │
    │       ├── calls service function (e.g., matchService.getAll)
    │       │       │
    │       │       └── uses api.js (Axios instance)
    │       │               │
    │       │               └── HTTP request to Express API
    │       │
    │       └── manages loading/error/data state
    │
    └── renders feature components with data as props
```

### Rule: Pages vs Features vs Components

| Type | Location | Purpose | Example |
|------|----------|---------|---------|
| **Page** | `pages/` | Route entry point, composes features | `MatchesPage.jsx` |
| **Feature Component** | `features/*/components/` | Feature-specific UI | `MatchCard.jsx` |
| **Shared Component** | `components/shared/` | Cross-feature composed UI | `TeamBadge.jsx` |
| **UI Component** | `components/ui/` | Atomic, style-only elements | `Button.jsx`, `Card.jsx` |

---

## 8. Reusable Component System

### UI Components (Atomic Layer)

These are the building blocks. Every component accepts variants via props.

#### Button
```jsx
// Props: variant (primary|secondary|danger|ghost), size (sm|md|lg), 
//        isLoading, disabled, fullWidth, leftIcon, rightIcon
// Used in: forms, modals, cards, headers — everywhere
<Button variant="primary" size="md" isLoading={submitting}>
    Submit Prediction
</Button>
```

#### Card
```jsx
// Props: padding (sm|md|lg), hoverable, bordered, className
// Used in: MatchCard, PredictionCard, QuizCard, PollCard, UserRankCard
<Card hoverable padding="md">
    <Card.Header>Match #12</Card.Header>
    <Card.Body>...</Card.Body>
    <Card.Footer>...</Card.Footer>
</Card>
```

#### Table
```jsx
// Props: columns (array of {key, label, render}), data, sortable, onSort
// Used in: LeaderboardTable, GroupTable, PredictionHistory
<Table columns={columns} data={standings} sortable />
```

#### Modal
```jsx
// Props: isOpen, onClose, title, size (sm|md|lg)
// Used in: prediction submission, quiz start confirmation, login prompt
<Modal isOpen={showModal} onClose={close} title="Confirm Prediction">
    ...
</Modal>
```

#### Badge
```jsx
// Props: variant (success|warning|danger|info|neutral), size (sm|md)
// Used in: StatusBadge, PointsBadge, match stages, quiz difficulty
<Badge variant="success">LIVE</Badge>
```

#### Input
```jsx
// Props: label, error, type, placeholder, leftIcon
// Used in: LoginForm, RegisterForm, PredictionForm
<Input label="Home Score" type="number" error={errors.homeScore} />
```

#### Tabs
```jsx
// Props: tabs (array of {key, label}), activeKey, onChange
// Used in: MatchesPage (by date/stage), ProfilePage (predictions/quizzes)
<Tabs tabs={matchTabs} activeKey={activeTab} onChange={setActiveTab} />
```

#### Additional: Avatar, Loader, EmptyState, Toast
```
Avatar    — user display in header, leaderboard, comments
Loader    — every page/section loading state
EmptyState — "No matches today", "No predictions yet"
Toast     — success/error notifications globally
```

### Shared Components (Composed Layer)

Built FROM ui components, used ACROSS features.

#### TeamBadge
```jsx
// Shows flag + team name/code. Used in MatchCard, GroupTable, PredictionCard
<TeamBadge team={match.homeTeam} size="md" showCode />
```

#### ScoreDisplay
```jsx
// Renders score or "vs" for scheduled matches. Used in MatchCard, MatchDetail, PredictionCard
<ScoreDisplay home={2} away={1} status="completed" />
<ScoreDisplay status="scheduled" />  // renders "vs"
```

#### StatusBadge
```jsx
// Match status indicator. Uses Badge internally. Used in MatchCard, MatchDetail
<StatusBadge status="live" minute={67} />   // "LIVE 67'"
<StatusBadge status="completed" />           // "FT"
```

#### CountdownTimer
```jsx
// Countdown to match kickoff. Used in MatchCard, MatchDetail, PredictionForm
<CountdownTimer targetDate={match.matchDate} />
```

#### PointsBadge
```jsx
// Shows points with icon. Used in PredictionCard, LeaderboardRow, ProfilePage
<PointsBadge points={10} label="Exact Match!" />
```

### Component Reuse Map

Shows which shared/ui components are used by which features:

```
                    MatchCard  PredictionCard  LeaderboardRow  GroupTable  QuizCard  PollCard
Card                   ✓           ✓               —              —          ✓         ✓
TeamBadge              ✓           ✓               —              ✓          —         —
ScoreDisplay           ✓           ✓               —              —          —         —
StatusBadge            ✓           ✓               —              —          —         —
Badge                  ✓           ✓               ✓              ✓          ✓         ✓
Button                 —           ✓               —              —          ✓         ✓
Avatar                 —           —               ✓              —          —         —
Table                  —           —               ✓              ✓          —         —
CountdownTimer         ✓           ✓               —              —          —         ✓
PointsBadge            —           ✓               ✓              —          —         —
```

---

## 9. API Design

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Yes | Get current user profile |
| PUT | `/auth/me` | Yes | Update profile |

### Match Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/matches` | No | List all matches (filterable by status, stage, date) |
| GET | `/matches/:id` | No | Get match detail with events |
| POST | `/matches` | Admin | Create match |
| PUT | `/matches/:id` | Admin | Update match (score, status) |
| GET | `/matches/live` | No | Get currently live matches |
| POST | `/matches/:id/events` | Admin | Add match event (goal, card) |

### Prediction Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/predictions` | Yes | Get user's predictions |
| POST | `/predictions` | Yes | Submit prediction for a match |
| PUT | `/predictions/:id` | Yes | Update prediction (before kickoff only) |
| GET | `/predictions/match/:matchId` | Yes | Get user's prediction for specific match |

### Leaderboard Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | No | Get top users (paginated) |
| GET | `/leaderboard/me` | Yes | Get current user's rank |

### Team & Group Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/teams` | No | List all teams |
| GET | `/groups` | No | List groups with standings |
| GET | `/groups/:id` | No | Group detail with matches |

### Quiz Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/quizzes` | No | List active quizzes |
| GET | `/quizzes/:id` | Yes | Get quiz with questions |
| POST | `/quizzes/:id/attempt` | Yes | Submit quiz attempt |
| GET | `/quizzes/history` | Yes | User's quiz history |

### Voting Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/polls` | No | List active polls |
| GET | `/polls/:id` | No | Poll detail with results |
| POST | `/polls/:id/vote` | Yes | Cast vote |

### Standard API Response Format
```json
// Success
{
    "status": "success",
    "data": { ... }
}

// Success with pagination
{
    "status": "success",
    "data": [ ... ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "totalPages": 8
    }
}

// Error
{
    "status": "error",
    "message": "Match not found",
    "code": "MATCH_NOT_FOUND"
}
```

---

## 10. Feature Module Design

Each feature follows the **exact same internal structure** on both frontend and backend.

### Backend Feature Template
```
features/<feature>/
├── <feature>.routes.js       # Express router with endpoints
├── <feature>.controller.js   # Request handling (parse → delegate → respond)
├── <feature>.service.js      # Business logic + DB queries
└── <feature>.validation.js   # express-validator rules (if needed)
```

### Frontend Feature Template
```
features/<feature>/
├── components/               # Feature-specific React components
│   ├── <Feature>Card.jsx
│   ├── <Feature>List.jsx
│   └── <Feature>Detail.jsx
├── hooks/
│   └── use<Feature>.js       # Data fetching + state for this feature
├── services/
│   └── <feature>Service.js   # API calls for this feature
└── index.js                  # Barrel export
```

### Adding a New Feature Checklist
1. Create backend folder: `server/src/features/<name>/`
2. Create route, controller, service, validation files
3. Register routes in `app.js`
4. Create frontend folder: `client/src/features/<name>/`
5. Create service (API calls), hook (state), components
6. Create page in `client/src/pages/`
7. Add route in `AppRoutes.jsx`
8. Add nav link in `Header.jsx`

---

## 11. Reusability Rules

### Rule 1: Single Source of Truth
> If a piece of UI or logic exists, it exists in **exactly one place**.

| Bad | Good |
|-----|------|
| Copy-paste a card layout in 3 files | Create `Card` component, use it 3 times |
| Write `axios.get('/api/matches')` in 3 components | Create `matchService.getAll()`, call it from hook |
| Format dates inline in every component | Create `formatDate()` utility |

### Rule 2: Props for Variation, Not New Components
> Different visual states = props, not separate components.

```jsx
// BAD: MatchCardLive.jsx, MatchCardScheduled.jsx, MatchCardCompleted.jsx
// GOOD: MatchCard.jsx with status prop that drives rendering
<MatchCard match={match} />  // internally switches on match.status
```

### Rule 3: Compose, Don't Inherit
> Build complex components by composing simple ones.

```jsx
// MatchCard is composed of:
<Card hoverable>
    <TeamBadge team={homeTeam} />
    <ScoreDisplay home={homeScore} away={awayScore} status={status} />
    <TeamBadge team={awayTeam} />
    <StatusBadge status={status} minute={minute} />
</Card>
```

### Rule 4: Service Layer for All API Calls
> Components and hooks NEVER call axios directly.

```
Component → Hook → Service → api.js (Axios) → Backend
```

### Rule 5: Custom Hooks for All Stateful Logic
> Components render. Hooks manage state and side effects.

```jsx
// Hook handles: fetch, loading, error, refetch
const { matches, loading, error } = useMatches({ status: 'live' });

// Component just renders
if (loading) return <Loader />;
return matches.map(m => <MatchCard key={m.id} match={m} />);
```

### Rule 6: Barrel Exports for Clean Imports
```javascript
// components/ui/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';

// Usage: import { Button, Card, Modal } from '@/components/ui';
```

---

## 12. Full Feature Example — Matches

This section shows the **complete implementation plan** for the Matches feature end-to-end.

### Backend

#### `server/src/features/matches/match.routes.js`
```javascript
const router = express.Router();
const ctrl = require('./match.controller');
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const { validateMatch, validateEvent } = require('./match.validation');

router.get('/',              ctrl.getAll);           // Public: list matches
router.get('/live',          ctrl.getLive);           // Public: live matches
router.get('/:id',          ctrl.getById);           // Public: match detail
router.post('/',     auth, adminOnly, validateMatch, ctrl.create);   // Admin
router.put('/:id',   auth, adminOnly, validateMatch, ctrl.update);   // Admin
router.post('/:id/events', auth, adminOnly, validateEvent, ctrl.addEvent);

module.exports = router;
```

#### `server/src/features/matches/match.controller.js`
```javascript
const matchService = require('./match.service');
const catchAsync = require('../../utils/catchAsync');

exports.getAll = catchAsync(async (req, res) => {
    const filters = {
        status: req.query.status,    // 'scheduled', 'live', 'completed'
        stage: req.query.stage,      // 'group', 'round_of_16', etc.
        date: req.query.date,        // '2026-06-15'
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
    };
    const result = await matchService.getAll(filters);
    res.json({ status: 'success', ...result });
});

exports.getById = catchAsync(async (req, res) => {
    const match = await matchService.getById(req.params.id);
    res.json({ status: 'success', data: match });
});

exports.getLive = catchAsync(async (req, res) => {
    const matches = await matchService.getLive();
    res.json({ status: 'success', data: matches });
});

exports.create = catchAsync(async (req, res) => {
    const match = await matchService.create(req.body);
    res.status(201).json({ status: 'success', data: match });
});

exports.update = catchAsync(async (req, res) => {
    const match = await matchService.update(req.params.id, req.body);
    // Emit socket event for live score updates
    if (req.body.status === 'live' || req.body.home_score !== undefined) {
        req.io.to(`match:${req.params.id}`).emit('score:update', match);
        req.io.emit('matches:update', match);
    }
    res.json({ status: 'success', data: match });
});

exports.addEvent = catchAsync(async (req, res) => {
    const event = await matchService.addEvent(req.params.id, req.body);
    req.io.to(`match:${req.params.id}`).emit('match:event', event);
    res.status(201).json({ status: 'success', data: event });
});
```

#### `server/src/features/matches/match.service.js`
```javascript
const db = require('../../config/db');
const AppError = require('../../utils/AppError');

exports.getAll = async (filters) => {
    let query = `
        SELECT m.*, 
               ht.name AS home_team_name, ht.code AS home_team_code, ht.flag_url AS home_team_flag,
               at.name AS away_team_name, at.code AS away_team_code, at.flag_url AS away_team_flag
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        WHERE 1=1
    `;
    const params = [];

    if (filters.status) { query += ' AND m.status = ?'; params.push(filters.status); }
    if (filters.stage) { query += ' AND m.stage = ?'; params.push(filters.stage); }
    if (filters.date) { query += ' AND DATE(m.match_date) = ?'; params.push(filters.date); }

    // Count total
    const countQuery = query.replace('SELECT m.*,', 'SELECT COUNT(*) as total FROM (SELECT m.id');
    // ... pagination logic

    query += ' ORDER BY m.match_date ASC LIMIT ? OFFSET ?';
    params.push(filters.limit, (filters.page - 1) * filters.limit);

    const [rows] = await db.query(query, params);
    return { data: rows, pagination: { page: filters.page, limit: filters.limit, total } };
};

exports.getById = async (id) => {
    const [matches] = await db.query(`...join query...`, [id]);
    if (!matches.length) throw new AppError('Match not found', 404);

    const [events] = await db.query(
        'SELECT * FROM match_events WHERE match_id = ? ORDER BY minute ASC', [id]
    );
    return { ...matches[0], events };
};

exports.getLive = async () => {
    const [rows] = await db.query(`...WHERE m.status IN ('live', 'half_time')...`);
    return rows;
};

// create, update, addEvent methods follow same pattern...
```

### Frontend

#### `client/src/features/matches/services/matchService.js`
```javascript
import api from '@/services/api';

const matchService = {
    getAll: (params) => api.get('/matches', { params }),
    getById: (id) => api.get(`/matches/${id}`),
    getLive: () => api.get('/matches/live'),
};

export default matchService;
```

#### `client/src/features/matches/hooks/useMatches.js`
```javascript
import { useState, useEffect } from 'react';
import matchService from '../services/matchService';

export function useMatches(filters = {}) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const { data } = await matchService.getAll(filters);
            setMatches(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load matches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMatches(); }, [JSON.stringify(filters)]);

    return { matches, loading, error, pagination, refetch: fetchMatches };
}
```

#### `client/src/features/matches/hooks/useLiveMatch.js`
```javascript
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import matchService from '../services/matchService';

export function useLiveMatch(matchId) {
    const [match, setMatch] = useState(null);
    const [events, setEvents] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        matchService.getById(matchId).then(({ data }) => {
            setMatch(data.data);
            setEvents(data.data.events || []);
        });

        // Join match room for live updates
        socket?.emit('match:join', matchId);
        socket?.on('score:update', (updated) => setMatch(updated));
        socket?.on('match:event', (event) => setEvents(prev => [...prev, event]));

        return () => {
            socket?.emit('match:leave', matchId);
            socket?.off('score:update');
            socket?.off('match:event');
        };
    }, [matchId, socket]);

    return { match, events };
}
```

#### `client/src/features/matches/components/MatchCard.jsx`
```jsx
import { Card, Badge } from '@/components/ui';
import { TeamBadge, ScoreDisplay, StatusBadge, CountdownTimer } from '@/components/shared';

export default function MatchCard({ match, onClick }) {
    const isUpcoming = match.status === 'scheduled';

    return (
        <Card hoverable onClick={() => onClick?.(match.id)} padding="md">
            <div className="flex items-center justify-between">
                <TeamBadge team={{ name: match.home_team_name, code: match.home_team_code, flag: match.home_team_flag }} />
                <div className="text-center">
                    <ScoreDisplay
                        home={match.home_score}
                        away={match.away_score}
                        status={match.status}
                    />
                    <StatusBadge status={match.status} minute={match.minute} />
                </div>
                <TeamBadge team={{ name: match.away_team_name, code: match.away_team_code, flag: match.away_team_flag }} />
            </div>
            {isUpcoming && <CountdownTimer targetDate={match.match_date} />}
            <Badge variant="neutral" size="sm">{match.stage.replace('_', ' ')}</Badge>
        </Card>
    );
}
```

#### `client/src/features/matches/components/MatchList.jsx`
```jsx
import { Loader, EmptyState } from '@/components/ui';
import MatchCard from './MatchCard';

export default function MatchList({ matches, loading, error, onMatchClick }) {
    if (loading) return <Loader />;
    if (error) return <EmptyState title="Error" description={error} />;
    if (!matches.length) return <EmptyState title="No matches found" />;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} onClick={onMatchClick} />
            ))}
        </div>
    );
}
```

#### `client/src/pages/MatchesPage.jsx`
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '@/components/ui';
import { PageLayout } from '@/components/layout';
import { MatchList } from '@/features/matches';
import { useMatches } from '@/features/matches/hooks/useMatches';

const tabs = [
    { key: 'all', label: 'All Matches' },
    { key: 'live', label: 'Live' },
    { key: 'scheduled', label: 'Upcoming' },
    { key: 'completed', label: 'Results' },
];

export default function MatchesPage() {
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();
    const filters = activeTab === 'all' ? {} : { status: activeTab };
    const { matches, loading, error } = useMatches(filters);

    return (
        <PageLayout title="Matches">
            <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
            <MatchList
                matches={matches}
                loading={loading}
                error={error}
                onMatchClick={(id) => navigate(`/matches/${id}`)}
            />
        </PageLayout>
    );
}
```

---

## 13. State Management Strategy

### Approach: React Context + Custom Hooks (no Redux)

| Scope | Tool | Example |
|-------|------|---------|
| **Global (auth)** | Context + useReducer | `AuthContext` — user session, login/logout |
| **Global (UI)** | Context | `ToastContext` — show/dismiss toasts |
| **Global (real-time)** | Context | `SocketContext` — Socket.io connection |
| **Feature data** | Custom hooks | `useMatches`, `usePredictions` — fetch + state |
| **Local UI** | useState | Form inputs, tab selection, modal open/close |

### Why No Redux?
This app has clear data boundaries. Each feature fetches its own data via hooks. The only truly global state is auth and socket connection. Context handles that cleanly.

---

## 14. Real-Time Architecture (Socket.io)

### Server Setup
```
Express server → attach Socket.io
    │
    ├── Namespace: / (default)
    │   ├── Event: 'matches:update'      → broadcast to all (score changes)
    │   └── Event: 'leaderboard:update'  → broadcast when predictions are scored
    │
    └── Room-based:
        ├── 'match:{id}' → join/leave per match detail page
        │   ├── Event: 'score:update'    → score changes for this match
        │   └── Event: 'match:event'     → goals, cards, substitutions
        └── 'quiz:{id}' → live quiz room (optional future feature)
```

### Client Usage
```jsx
// Any component can subscribe to live updates via the useSocket hook
const socket = useSocket();
useEffect(() => {
    socket.on('matches:update', (match) => {
        // Update match in local state
    });
    return () => socket.off('matches:update');
}, [socket]);
```

---

## 15. Authentication Flow

```
Register/Login
    │
    ▼
Server validates → creates JWT (user id + role in payload)
    │
    ▼
Client stores JWT in localStorage
    │
    ▼
Axios interceptor attaches: Authorization: Bearer <token>
    │
    ▼
Protected routes check AuthContext.isAuthenticated
    │
    ▼
Server middleware verifies JWT on protected endpoints
```

### Protected Route Component
```jsx
// Wraps routes that require login
// Redirects to /login if not authenticated
// Admin routes additionally check user.role === 'admin'
```

---

## 16. Build Order & Milestones

### Overall Progress: 95% Complete

### Phase 1 — Foundation ✅ DONE
- [x] Initialize Vite + React + Tailwind (client) — 104 frontend files
- [x] Initialize Express project (server) — 46 backend files
- [x] Setup MySQL database schema.sql + seed.sql — ready to run on XAMPP
- [x] Build `config/db.js` connection pool
- [x] Build all 12 UI components (`components/ui/`)
- [x] Build 5 layout components (Header, Footer, PageLayout, Sidebar)
- [x] Build 5 shared components (TeamBadge, ScoreDisplay, StatusBadge, CountdownTimer, PointsBadge)
- [x] Setup Axios instance with interceptors
- [x] Setup error handling middleware (backend)

### Phase 2 — Auth ✅ DONE
- [x] Backend: auth routes, controller, service, validation (4 files)
- [x] Frontend: AuthContext, useAuth hook
- [x] Frontend: LoginForm, RegisterForm, ProtectedRoute
- [x] Login/Register pages

### Phase 3 — Teams, Groups, Matches ✅ DONE
- [x] Seed data: 48 teams, 12 groups, 16 sample matches
- [x] Backend: teams (3 files), groups (3 files), matches (4 files)
- [x] Frontend matches: MatchCard, MatchList, MatchDetail, LiveIndicator, MatchEventTimeline
- [x] Frontend groups: GroupTable, GroupStageView
- [x] Matches page with tab filtering
- [x] Groups page with standings table

### Phase 4 — Predictions ✅ DONE
- [x] Backend: predictions routes, controller, service, validation (4 files)
- [x] Frontend: PredictionForm, PredictionCard, PredictionHistory
- [x] Prediction scoring logic (scorePrediction.js utility)
- [x] Prediction UI integrated into match detail page

### Phase 5 — Leaderboard ✅ DONE
- [x] Backend: leaderboard routes, controller, service (3 files)
- [x] Frontend: LeaderboardTable, LeaderboardRow, UserRankCard
- [x] User rank card on profile page

### Phase 6 — Quiz & Voting ✅ DONE
- [x] Backend: quiz routes, controller, service, validation (4 files)
- [x] Frontend: QuizCard, QuizList, QuizPlayer, QuestionCard, QuizResult
- [x] Backend: voting routes, controller, service, validation (4 files)
- [x] Frontend: PollCard, PollList, PollResults

### Phase 7 — Real-Time & Polish ✅ DONE
- [x] Socket.io server setup (config/socket.js)
- [x] Live match updates (useLiveMatch hook + socket events)
- [x] SocketContext + useSocket hook
- [x] LiveIndicator component with pulse animation
- [x] Toast notifications (ToastContext + ToastProvider)
- [ ] **PENDING**: Run schema.sql on XAMPP MySQL (needs `sudo /opt/lampp/lampp startmysql`)
- [ ] **PENDING**: Verify full app build (`npm run dev` on both client + server)
- [ ] **OPTIONAL**: Loading skeletons, additional responsive polish

---

## Quick Reference: Key Patterns

| Pattern | Implementation |
|---------|---------------|
| **API call** | `service.method()` → uses `api.js` Axios instance |
| **Data fetching** | Custom hook calls service, manages loading/error/data |
| **Error handling (BE)** | `catchAsync` wrapper + `AppError` class + `errorHandler` middleware |
| **Auth check (BE)** | `auth` middleware verifies JWT, attaches `req.user` |
| **Auth check (FE)** | `ProtectedRoute` checks `AuthContext.isAuthenticated` |
| **Real-time** | Socket.io rooms per match, global events for leaderboard |
| **Styling** | Tailwind utility classes, consistent via component props (variant, size) |
| **Imports** | Barrel exports → `import { Button, Card } from '@/components/ui'` |

---

## Implementation Summary (2026-05-12)

### Files Created: 153 total

| Category | Files | Details |
|----------|-------|---------|
| **Backend Config** | 6 | app.js, server.js, db.js, env.js, socket.js, .env |
| **Backend Middleware** | 4 | auth.js, adminOnly.js, validate.js, errorHandler.js |
| **Backend Utils** | 3 | AppError.js, catchAsync.js, scorePrediction.js |
| **Backend Features** | 29 | 8 features × ~3-4 files each (routes, controller, service, validation) |
| **Database** | 2 | schema.sql (13 tables), seed.sql (48 teams, 12 groups, sample data) |
| **Frontend UI Components** | 13 | Button, Card, Input, Select, Badge, Avatar, Modal, Table, Tabs, Loader, EmptyState, Toast, index |
| **Frontend Layout** | 5 | Header, Footer, PageLayout, Sidebar, index |
| **Frontend Shared** | 6 | TeamBadge, ScoreDisplay, StatusBadge, CountdownTimer, PointsBadge, index |
| **Frontend Features** | 47 | 7 features with components, hooks, services, index |
| **Frontend Pages** | 13 | Home, Matches, MatchDetail, Predictions, Leaderboard, Groups, Quiz, QuizPlay, Voting, Profile, Login, Register, NotFound |
| **Frontend Core** | 10 | App.jsx, main.jsx, AppRoutes, api.js, contexts, hooks, utils |
| **Config Files** | 8 | package.json (x2), vite.config, tailwind.config, postcss.config, .gitignore, nodemon.json, .env.example |

### Remaining Steps (5%)
1. Start XAMPP MySQL: `sudo /opt/lampp/lampp startmysql`
2. Run schema: `/opt/lampp/bin/mysql -u root < server/database/schema.sql`
3. Run seed: `/opt/lampp/bin/mysql -u root < server/database/seed.sql`
4. Start backend: `cd server && npm run dev`
5. Start frontend: `cd client && npm run dev`
6. Open: http://localhost:5173
