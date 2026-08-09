import { execSync } from 'node:child_process';

export default function globalSetup() {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./test.db';
  process.env.DATABASE_URL = databaseUrl;

  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    DEFAULT_SEED_PASSWORD: process.env.DEFAULT_SEED_PASSWORD || 'Test_SIAKAD_2026!',
  };

  execSync('npx prisma db push --force-reset --accept-data-loss', {
    stdio: 'inherit',
    env,
  });
  execSync('npx tsx prisma/seed.ts', {
    stdio: 'inherit',
    env,
  });
}