# Online Survey System

Starter full-stack scaffold for an Online Survey System using:

- React + Vite + Tailwind CSS (client)
- Node.js + Express (server)
- MongoDB + Mongoose
- JWT-based auth foundation

## Project Structure

```text
.
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- features/
|   |   |-- pages/
|   |   |-- routes/
|   |   `-- services/
|   `-- package.json
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- .env.example
|-- package.json
`-- README.md
```

## Quick Start

1. Install root dependencies:
   - `npm install`
2. Install app dependencies (already required if starting from this scaffold):
   - `npm install --prefix client`
   - `npm install --prefix server`
3. Copy env template and set secrets:
   - `cp .env.example server/.env` (or create `server/.env` manually on Windows)
4. Run both apps:
   - `npm run dev`

Client runs on `http://localhost:5173` and server runs on `http://localhost:5000`.

## Available Scripts

- Root
  - `npm run dev` - run client and server together
  - `npm run dev:client` - run frontend only
  - `npm run dev:server` - run backend only
  - `npm run build` - build frontend
- Client (`client/package.json`)
  - `npm run dev`, `npm run build`, `npm run preview`
- Server (`server/package.json`)
  - `npm run dev`, `npm run start`

## API Starter Routes

Base URL: `/api/v1`

- Auth
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me` (protected)
- Surveys
  - `GET /surveys` (protected)
  - `POST /surveys` (protected)
  - `GET /surveys/:surveyId` (protected)

## Notes for Future Features

- Current auth service compares plain-text passwords and should be upgraded with hashing (e.g., bcrypt) before production.
- Add validation layer (e.g., zod/joi), role-based access, response collection endpoints, analytics, and tests.
- Recommended next folders for expansion:
  - `server/src/routes/response.routes.js`
  - `server/src/models/response.model.js`
  - `client/src/features/surveys`
  - `client/src/features/responses`
