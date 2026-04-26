# ----------------------------------------------------------------------
# MULTI-STAGE DOCKER BUILD FOR NESTJS + PRISMA APPLICATION
# ----------------------------------------------------------------------

# ------------------------------
# Stage 1: Builder
# ------------------------------
# Purpose: Compile TypeScript application and generate Prisma Client
# Base: Node.js 20 Alpine (lightweight)
# Output: Compiled JS files in /dist directory
# ------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies using ci for reproducible builds
COPY package*.json ./
RUN npm ci

# Generate Prisma Client from schema.prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code and build the application
COPY . .
RUN npm run build

# ------------------------------
# Stage 2: Runner (Production)
# ------------------------------
# Purpose: Run the compiled application in production
# Base: Node.js 20 Alpine (lightweight)
# Dependencies: Production only (no dev tools)
# ------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Install only production dependencies to minimize image size
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and generate production client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads

# Expose application port
EXPOSE 3000

# Execute database migrations and start the NestJS server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]