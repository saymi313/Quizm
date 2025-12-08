# Quizm

React/Node quiz platform with user/admin workflows, quiz authoring, attempts, scoring, and leaderboards. Uses AWS DynamoDB for persistence.

## Structure
- `backend/` – Express API (controllers, services, routes, middleware) backed by DynamoDB
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
- Backend: `.env` with AWS creds/region and DynamoDB table names, plus JWT secret and S3 creds if uploads enabled  
  - Common vars: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `DYNAMO_USERS_TABLE`, `DYNAMO_QUIZZES_TABLE`, `JWT_SECRET`, `S3_BUCKET` (if used)  
- Frontend: `.env` with `VITE_API_URL` pointing to the backend base URL (include `/api`)
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