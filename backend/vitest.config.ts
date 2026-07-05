import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DEFAULT_SEED_PASSWORD: 'Test_SIAKAD_2026!',
      JWT_ACCESS_SECRET: 'test-access-secret-min-32-chars-long!!',
      JWT_REFRESH_SECRET: 'test-refresh-secret-min-32-chars-long!',
      JWT_RESET_PASSWORD_SECRET: 'test-reset-secret-min-32-chars-long!!',
      NODE_ENV: 'test',
    },
    globalSetup: ['./tests/global-setup.ts'],
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
