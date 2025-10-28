FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --include=dev

COPY . .

COPY --chmod=755 entrypoint.dev.sh /usr/local/bin/entrypoint.dev.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.dev.sh

RUN npx prisma generate || true

EXPOSE 4000
CMD ["sh","/usr/local/bin/entrypoint.dev.sh"]
