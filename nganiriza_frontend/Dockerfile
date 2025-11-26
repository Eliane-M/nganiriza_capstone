# Multi-stage build for React frontend
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies using pnpm
# Use --frozen-lockfile only if lockfile exists, otherwise install normally
RUN if [ -f pnpm-lock.yaml ]; then \
  pnpm install --frozen-lockfile; \
  else \
  pnpm install; \
  fi

# Copy source code (excluding node_modules which is already installed)
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost:8001
ARG REACT_APP_API_URL=http://localhost:8001
ENV VITE_API_URL=$VITE_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the application
RUN pnpm run build

# Production stage - use Node.js with serve
FROM node:20-alpine

# Install serve globally
RUN npm install -g serve

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start serve on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]

