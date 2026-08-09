import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SecurityService } from './src/modules/security/security.service';
import { LoggingInterceptor } from './src/common/interceptors/logging.interceptor';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust proxy sebaiknya mengikuti deployment: 1 hop saat di belakang satu
  // reverse proxy (Nginx/Cloudflare). Jangan aktifkan tanpa proxy — jika
  // expose langsung, klien bisa memalsukan X-Forwarded-For untuk bypass rate limit.
  const trustProxy = process.env.TRUST_PROXY !== undefined ? Number(process.env.TRUST_PROXY) : 1;
  app.set('trust proxy', trustProxy);

  // Enable graceful shutdown hooks for Prisma and Redis connections
  app.enableShutdownHooks();

  const securityService = app.get(SecurityService);

  // Register Global Logging Interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(securityService));

  const isProduction = process.env.NODE_ENV === 'production';

  // CSP: strict in production, permissive in development
  const cspDirectives = isProduction
    ? {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      }
    : {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      };

  app.use(helmet({
    contentSecurityPolicy: { directives: cspDirectives },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    strictTransportSecurity: isProduction
      ? { maxAge: 31536000, includeSubDomains: true }
      : false,
  }));
  securityService.logSecurityEvent('INFO', `Helmet Security Headers Active (CSP ${isProduction ? 'STRICT' : 'DEV'}).`);

  // CORS: allowlist from env
  const rawAllowedOrigins = process.env.ALLOWED_ORIGINS || `http://localhost:${process.env.PORT || 3000},http://localhost:5173`;
  const allowedOrigins = rawAllowedOrigins.split(',').map(o => o.trim()).filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      securityService.logSecurityEvent('WARNING', `CORS blocked origin: ${origin}`);
      return callback(new Error(`Origin '${origin}' tidak diizinkan oleh kebijakan CORS.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  }));
  securityService.logSecurityEvent('INFO', `CORS applied. Allowed origins: [${allowedOrigins.join(', ')}]`);

  // Cookie Parser
  let cookieSecret = process.env.COOKIE_SECRET;
  if (!cookieSecret) {
    if (isProduction) {
      console.error('❌ CRITICAL: COOKIE_SECRET environment variable tidak diset di production. Exiting...');
      process.exit(1);
    }
    cookieSecret = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  DEV: COOKIE_SECRET tidak diset. Menggunakan ephemeral secret.');
  }

  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser(cookieSecret));

  // Global Rate Limiter
  const bruteForceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: false,
    handler: (req, res) => {
      const ip = req.ip || '127.0.0.1';
      securityService.logSecurityEvent('ALERT', `Rate Limit Exceeded for IP: ${ip} on route ${req.originalUrl}`, ip);
      res.status(429).json({
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak permintaan dari IP Anda.'
      });
    }
  });
  app.use('/api/', bruteForceLimiter);

  // Login-specific rate limiter (stricter — 10 attempts per 15 min)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: false,
    handler: (req, res) => {
      securityService.logSecurityEvent('ALERT', `Login Rate Limit Exceeded for IP: ${req.ip}`);
      res.status(429).json({
        status: 'error',
        code: 'LOGIN_RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.'
      });
    }
  });
  app.use('/api/auth/secure-login', loginLimiter);
  app.use('/api/auth/secure-register', loginLimiter);

  // Password-reset specific limiters — mencegah abuse token reset / email bombing.
  // request: 5 per 15 menit per IP; confirm: 10 per jam per IP.
  const resetRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: false,
    handler: (req, res) => {
      securityService.logSecurityEvent('ALERT', `Reset Request Rate Limit Exceeded for IP: ${req.ip}`);
      res.status(429).json({
        status: 'error',
        code: 'RESET_REQUEST_RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak permintaan reset kata sandi. Silakan coba lagi dalam 15 menit.'
      });
    }
  });
  app.use('/api/auth/reset-password-request', resetRequestLimiter);

  const resetConfirmLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: false,
    handler: (req, res) => {
      securityService.logSecurityEvent('ALERT', `Reset Confirm Rate Limit Exceeded for IP: ${req.ip}`);
      res.status(429).json({
        status: 'error',
        code: 'RESET_CONFIRM_RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak percobaan konfirmasi reset. Silakan coba lagi nanti.'
      });
    }
  });
  app.use('/api/auth/reset-password-confirm', resetConfirmLimiter);

  // CSRF Protection
  function csrfProtection(req: any, res: any, next: any) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      if (!req.cookies.csrfToken) {
        const csrfToken = crypto.randomBytes(32).toString('hex');
        req.csrfToken = csrfToken;
        res.cookie('csrfToken', csrfToken, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        });
      }
      return next();
    }
    if (req.headers.authorization?.startsWith('Bearer ')) return next();

    const cookieToken = req.cookies.csrfToken;
    const headerToken = req.headers['x-csrf-token'];
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      securityService.logSecurityEvent('ALERT', `CSRF Violation: ${req.url}`, req.ip);
      return res.status(403).json({
        status: 'error',
        code: 'CSRF_ERROR',
        message: 'CSRF token tidak valid.',
      });
    }
    next();
  }
  app.use('/api/', csrfProtection);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`[SIAKAD API] Running on http://0.0.0.0:${PORT}`);
}

bootstrap();
