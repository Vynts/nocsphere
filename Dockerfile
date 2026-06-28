# ==========================================
# 1. TARGET BACKEND (Untuk Image erzaaaa/nocsphere-backend)
# ==========================================
FROM python:3.12-slim AS backend-runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

# Karena requirements.txt dan Dockerfile sama-sama di root utama, langsung salin
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Menyalin isi sub-folder backend ke direktori kerja container
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


# ==========================================
# 2. TARGET FRONTEND (Untuk Image erzaaaa/nocsphere-frontend)
# ==========================================
FROM node:20-alpine AS frontend-base

FROM frontend-base AS frontend-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# KARENA FRONTEND SUDAH DI ROOT: Langsung salin package.json dari root utama project
COPY package.json package-lock.json* ./
RUN npm ci

FROM frontend-base AS frontend-builder
WORKDIR /app
COPY --from=frontend-deps /app/node_modules ./node_modules

# Salin seluruh isi root utama (termasuk kode frontend-mu yang sekarang di root)
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM frontend-base AS frontend-runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]