#!/usr/bin/env sh
set -e
cd /app

# Always run in dev mode and include devDependencies
unset NPM_CONFIG_PRODUCTION
export NODE_ENV=development

# If TypeScript is missing (or node_modules is incomplete) -> (re)install with dev deps
if [ ! -f node_modules/typescript/bin/tsc ]; then
  echo "[entrypoint] Installing dependencies (including dev)..."
  npm ci --include=dev || npm install
fi

# (Re)generate Prisma client (safe if no changes)
npx prisma generate || true

# Start Nest in watch mode
exec npm run start:dev
