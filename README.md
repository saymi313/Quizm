# Quizm

MERN-based quiz platform with user and admin workflows, quiz authoring, attempts, scoring, and leaderboards.

## Structure
- `backend/` – Express + MongoDB API (controllers, services, routes, middleware)
- `frontend/` – Vite/React UI (pages, components, services)
- `k8s/` – Deployment/service manifests
- `DeploymentInstructions/README.md` – Deployment guide (kept as-is)

## Quick Start
1) Install dependencies  
```sh
cd backend && npm install
cd ../frontend && npm install
```
2) Environment  
- Backend: set `.env` (Mongo URI, JWT secret, S3 creds if used, etc.)  
- Frontend: set `.env` with `VITE_API_URL` pointing to the backend base URL (include `/api`).
3) Run locally (two terminals)  
```sh
cd backend && npm start
cd frontend && npm run dev
```

## Build & Deploy
- Frontend production build: `cd frontend && npm run build`
- Docker: use the `Dockerfile` in each of `backend/` and `frontend/`
- Kubernetes: apply manifests under `k8s/`
- Detailed deployment steps live in `DeploymentInstructions/README.md`.

## Notes
- Authentication state is stored in `localStorage` as `userInfo`.
- File uploads use the backend `/upload` endpoint with bearer auth.