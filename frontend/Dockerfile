FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Run in dev mode with --host flag for external accessibility in Docker
CMD ["npm", "run", "dev", "--", "--host"]
