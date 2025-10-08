# Frontend Dockerfile (Vite + React + TypeScript)
FROM node:20-alpine

# Force Docker Hub anonymous pull
ENV DOCKER_BUILDKIT=1


WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
