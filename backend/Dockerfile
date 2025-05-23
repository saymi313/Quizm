FROM node:18-alpine
WORKDIR /app
# Copy package files from backend directory
COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev
# Copy backend source code
COPY backend/ .
# Copy .env file from the app directory (one level up)
COPY ../.env .
# Install dotenv
RUN npm install dotenv
# Expose port
EXPOSE 5000
# Start the server (adjust to your main file if needed)
CMD ["node", "server.js"]