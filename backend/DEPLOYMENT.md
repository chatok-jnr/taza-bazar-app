# Backend Deployment Guide

This guide shows how to put the Node.js/Express backend online using popular platforms. It assumes you have a MongoDB Atlas database (connection string via `DATABASE` and `DATABASE_PASSWORD`).

## Prerequisites

- A GitHub repository containing this project.
- MongoDB Atlas URI and password (or another MongoDB instance).
- Frontend URL(s) to allow via CORS.

## Environment variables

Copy `.env.example` to either `.env` or keep using `config.env` locally. On cloud platforms, set these as service environment variables (do not commit real secrets):

- NODE_ENV=production
- PORT (most platforms inject this automatically; our server also falls back to 8000)
- JWT_SECRET
- JWT_EXPIRES_IN (e.g., `30d`)
- DATABASE (your MongoDB connection string with `<PASSWORD>` placeholder)
- DATABASE_PASSWORD (value replaces `<PASSWORD>` in `DATABASE`)
- ALLOWED_ORIGINS (comma-separated list of frontend origins, e.g. `https://your-frontend.com,https://www.your-frontend.com`)

Security tip: rotate any secrets already committed to git and remove the file from the repo history if needed.

## Healthcheck

The backend exposes `GET /health` returning `{"status":"ok"}`. Configure your platform to use this path for health checks.

---

## Option A: Deploy on Render (no Docker)

1. Push your repository to GitHub.
2. Go to https://dashboard.render.com -> New -> Web Service.
3. Connect your repo, set the root directory to `backend/`.
4. Configure:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Add the variables listed above (Render provides `PORT` automatically).
   - Health Check Path: `/health`
5. Create Web Service. Render will build and deploy. Enable Auto Deploys if desired.

Notes:
- The server binds to `process.env.PORT`; Render injects this.
- Add your frontend URL(s) to `ALLOWED_ORIGINS` to restrict CORS in production.

### Using a render.yaml (Blueprints)

If Render asks for a `render.yaml`, we added one at the repo root. You can deploy via Blueprints:

1. Visit Render Dashboard → New → Blueprint.
2. Select your repository. Render will detect `render.yaml` at the root.
3. Click “Apply”. It will create a Web Service using `backend/` as the root.
4. After create, go to the service Settings → Environment and set the variables listed earlier.
5. Deploy and verify `/health`.

## Option B: Deploy on Railway (no Docker)

1. Push your repository to GitHub.
2. Go to https://railway.app -> New Project -> Deploy from GitHub Repo.
3. Set the service root to `backend/`.
4. Add environment variables from the list above. Railway commonly sets `PORT` automatically.
5. Build and deploy.

Configure a health check:
- Healthcheck Path: `/health`

## Option C: Fly.io with Docker (portable)

1. Add a Dockerfile (see example below) to `backend/` and deploy via Fly.io.
2. Install Fly CLI, run `fly launch` and follow prompts (select `backend/` as app dir).
3. Set secrets using `fly secrets set KEY=VALUE` for the env vars.

Example Dockerfile:

```
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 8080
# Fly/Heroku style: platform sets PORT; default to 8080
ENV PORT=8080
CMD ["npm", "start"]
```

Make sure your app reads `PORT` (this project does) and that the platform routes to it.

---

## Troubleshooting

- Connection timeouts on startup: verify `DATABASE` and `DATABASE_PASSWORD` are correct and that your MongoDB Atlas IP access list includes the platform’s egress IP or is set to `0.0.0.0/0` (for testing only—restrict later).
- CORS errors in browser: ensure `ALLOWED_ORIGINS` includes the exact scheme and host of your frontend (https/http, with or without `www`).
- 502/503 on platform: check logs; many platforms require the process to bind to the specified `PORT` within a timeout. This app now supports that.

## Notes

- Avoid committing secrets. Replace any secrets already in git and rotate them in your providers.
- Consider adding rate limiting, request size limits, and production logging if needed.
