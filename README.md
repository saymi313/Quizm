# Quizm - MERN Stack Quiz Application

Quizm is a full-featured quiz platform built with the MERN stack (MongoDB, Express, React, Node.js). It supports user registration, quiz creation, quiz taking, leaderboards, and detailed result analytics for both users and admins.

## Features

- User authentication (register/login)
- Browse, search, and filter quizzes
- Take timed quizzes with instant feedback
- View quiz results and detailed reports
- Leaderboards for each quiz
- Admin dashboard for managing quizzes and viewing attempts
- Responsive UI with Tailwind CSS

## Project Structure

```
app/
  backend/      # Express.js backend (API, MongoDB models, controllers)
  frontend/     # React.js frontend (pages, components, services)
  k8s/          # Kubernetes deployment and service manifests
  src/          # (May contain shared or legacy code)
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Docker (optional, for containerization)
- Kubernetes (optional, for deployment)

### Backend Setup

1. Install dependencies:
   ```sh
   cd app/backend
   npm install
   ```
2. Configure environment variables in `app/backend/.env`.
3. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Install dependencies:
   ```sh
   cd app/frontend
   npm install
   ```
2. Configure environment variables in `app/frontend/.env`.
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```

### Running with Docker

You can use the provided `Dockerfile` in both `backend/` and `frontend/` directories to build and run containers.

### Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory. Example to deploy the backend service:

```sh
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

## Scripts

- `npm run dev` - Start frontend in development mode
- `npm start` - Start backend server

## Technologies Used

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **Deployment:** Docker, Kubernetes

## License

This project is licensed under the MIT License.

---

**Quizm** - Expanding knowledge through interactive learning experiences.