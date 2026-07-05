import { execSync } from 'node:child_process';

export default function globalSetup() {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./test.db';
  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma db push --force-reset --accept-data-loss', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  });
}
