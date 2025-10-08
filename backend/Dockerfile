# Backend Dockerfile (NestJS + Prisma)
FROM node:20-alpine

# Force Docker Hub anonymous pull
ENV DOCKER_BUILDKIT=1

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy all source files
COPY . .

# Generate Prisma client
RUN npx prisma generate || true

EXPOSE 4000

# Run migrations automatically and start dev server
CMD npx prisma migrate deploy && npm run start:dev
