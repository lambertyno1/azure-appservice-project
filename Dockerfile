FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including the app/ and tests/ folders)
COPY . .

# Expose the port the app runs on
EXPOSE 80

# Start the server from the new app/ directory
CMD ["node", "app/server.js"]
