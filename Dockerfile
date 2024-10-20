# Start your image with a node base image
FROM node:18-alpine

# The /app directory will act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./src ./src
COPY ./public ./public

# Accept the API key as a build argument
ARG REACT_APP_ETHERSCAN_API_KEY

# Set the API key as an environment variable
ENV REACT_APP_ETHERSCAN_API_KEY=$REACT_APP_ETHERSCAN_API_KEY

# Install node packages, install serve, build the app, and remove dependencies at the end
# add any node packages required for your app here
RUN npm install \
    && npm install -g serve \
    && npm run build \
    && rm -fr node_modules

EXPOSE 3000

# Start the app using serve command
CMD [ "serve", "-s", "build" ]