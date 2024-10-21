# Stage 1: Build the frontend (React app)
FROM node:18-alpine AS build-frontend

# Set the working directory for the frontend
WORKDIR /app

# Copy package.json and package-lock.json for dependency management
COPY package*.json ./

# Install node modules for the React frontend
RUN npm install

# Copy the React app source files
COPY ./src ./src
COPY ./public ./public

# Accept the API key as a build argument for the frontend
ARG REACT_APP_ETHERSCAN_API_KEY

# Set the API key as an environment variable for React
ENV REACT_APP_ETHERSCAN_API_KEY=$REACT_APP_ETHERSCAN_API_KEY

# Build the React app for production
RUN npm run build

# Stage 2: Set up the backend (Node.js API)
FROM node:18-alpine

# Set the working directory for the backend
WORKDIR /app

# Copy the backend files (server.js, db.js, etc.)
COPY ./backend ./backend

# Copy the frontend build files from the previous stage
COPY --from=build-frontend /app/build ./backend/public

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Set environment variables for PostgreSQL connection in production
ENV PG_HOST=postgresql
ENV PG_USER=postgres_user
ENV PG_PASSWORD=postgres_password
ENV PG_DATABASE=wallet_db
ENV PG_PORT=5432

# Expose the port for your backend API
EXPOSE 5000

# Start the backend server
CMD ["node", "./backend/server.js"]