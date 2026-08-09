# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
# CATATAN: jangan set NODE_ENV=production di stage ini — npm ci membutuhkan
# devDependencies (esbuild, prisma CLI) untuk build & generate.
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Generate Prisma client saat build agar tidak perlu CLI di production
RUN npx prisma generate && npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
# Salin hanya artefak yang dibutuhkan; file db (.db) & .env TIDAK ikut
# (lihat .dockerignore) sehingga data dev tidak pernah masuk image.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
# Hapus dependensi dev (prisma CLI, tsx, dll) — Node modules jadi ramping
RUN npm prune --omit=dev
USER nestjs
EXPOSE 3000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/auth/csrf-token').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server.cjs"]