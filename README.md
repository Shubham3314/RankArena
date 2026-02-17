# RankArena

Production-ready contest and quiz backend built with NestJS, TypeORM, MySQL, Redis, and Bull.

## Features

- **Auth**: Signup, login, refresh tokens, JWT, bcrypt password hashing, role promotion
- **Users**: Profile, role management (admin only)
- **Contests**: CRUD, access levels (normal/vip), join, leaderboard
- **Questions**: Single, multi, true/false types with options
- **Submissions**: Join contest, save answers, submit, scoring
- **Leaderboard**: Paginated, materialized entries
- **Prizes**: Prize awards, winners endpoint
- **Common**: Roles decorator, RolesGuard, ContestAccessGuard, Throttler, validation

## Tech Stack

- NestJS 11, TypeScript, TypeORM, MySQL, JWT, bcrypt, class-validator, class-transformer

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=8082
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=rank_arena
DATABASE_URL=mysql://root:@localhost:3306/rank_arena
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-in-production
```

## Setup

### Install

```bash
npm ci
```

### Migrations

```bash
npm run typeorm:migrate
```

Or apply `dump.sql` manually to create the schema.

### Seed

```bash
npm run seed
```

Creates:

- Admin: `admin@rankarena.test` / `AdminPass123!`
- VIP: `vip@rankarena.test` / `VipPass123!`
- Normal: `normal@rankarena.test` / `NormalPass123!`
- One normal contest and one VIP contest with questions and options

### Run Server

```bash
npm run start:dev
```

Server runs at `http://localhost:8082`. API prefix: `/api/v1`.

### Run Worker

```bash
npm run build
npm run worker
```

Processes contest end jobs (compute winners, award prizes, populate leaderboard).

## API Overview

### Auth

- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token (body: `{ refreshToken }`)

### Users

- `GET /users/me` - Get current user (JWT)
- `PATCH /users/:id/role` - Update role (admin only)

### Contests

- `POST /contests` - Create (admin)
- `PATCH /contests/:id` - Update (admin)
- `GET /contests` - List
- `GET /contests/:id` - Detail
- `POST /contests/:id/join` - Join (authenticated)
- `GET /contests/:id/leaderboard?limit=&offset=` - Leaderboard
- `POST /contests/:id/compute-winner` - Compute winners (admin)
- `GET /contests/:id/winners` - Prize awards

### Questions

- `POST /contests/:id/questions` - Add question (admin)
- `PATCH /questions/:id` - Update question (admin)

### Submissions

- `POST /contests/:id/answers` - Save answer (body: `{ questionId, optionIds }`)
- `POST /contests/:id/submit` - Submit all
- `GET /contests/:id/answers/me` - My in-progress answers

## Scoring Rules

- **Single-select & True/False**: Correct option → `question.points`, else 0
- **Multi-select**: `question.points` per correct option selected, no penalty for wrong
- **Tie-break**: Earlier `submitted_at` ranks higher

## Postman

1. Import `rankarena.postman_collection.json`
2. Set environment: `baseUrl` = `http://localhost:8082/api/v1`
3. Run "Login Admin" to set `adminToken`
4. Run "Login Normal User" to set `normalToken`
5. Use `contestId` from Create Contest response
