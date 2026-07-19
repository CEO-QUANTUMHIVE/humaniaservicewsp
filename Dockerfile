# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run the production application
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Install only production dependencies for a lighter container image
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

# Expose port 3000 (configurable via PORT env var in Cloud Run)
EXPOSE 3000
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
