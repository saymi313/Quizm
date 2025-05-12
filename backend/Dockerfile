FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json from the root app directory
COPY package.json package-lock.json ./

# Install dependencies (omit devDependencies for production)
RUN npm install --omit=dev

# Copy backend source code into container
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
