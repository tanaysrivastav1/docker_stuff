# Stage 1: Build the frontend (React app)
FROM node:18-alpine AS build-frontend

# Set the working directory for frontend
WORKDIR /app

# Copy package.json and package-lock.json for dependency management
COPY package*.json ./

# Install node modules for React frontend
RUN npm install

# Copy the frontend source code (React)
COPY ./src ./src
COPY ./public ./public

# Accept the API key as a build argument
ARG REACT_APP_ETHERSCAN_API_KEY

# Set the API key as an environment variable for React
ENV REACT_APP_ETHERSCAN_API_KEY=$REACT_APP_ETHERSCAN_API_KEY

# Build the React app for production
RUN npm run build

# Stage 2: Set up the backend (Node.js API)
FROM node:18-alpine

# Set the working directory for the backend
WORKDIR /app

# Copy the backend files
COPY ./backend ./backend

# Copy the frontend build from Stage 1 to the backend's public directory
COPY --from=build-frontend /app/build ./backend/public

# Copy package.json and package-lock.json for the backend
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Expose the backend port (assuming the backend runs on port 5000)
EXPOSE 5000

# Start the backend (Node.js) server
CMD ["node", "./backend/server.js"]