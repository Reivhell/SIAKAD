import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/nestjs/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SecurityService } from './src/nestjs/modules/security/security.service';
import { LoggingInterceptor } from './src/nestjs/common/interceptors/logging.interceptor';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);

  const securityService = app.get(SecurityService);
  
  // Register Global Logging Interceptor for metrics, observability, and latency tracing
  app.useGlobalInterceptors(new LoggingInterceptor(securityService));

  // Apply Helmet with CSP compatible with AI Studio preview iframes
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", '*'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*'],
        styleSrc: ["'self'", "'unsafe-inline'", '*'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:', '*'],
        imgSrc: ["'self'", 'data:', 'blob:', '*'],
        connectSrc: ["'self'", 'ws:', 'wss:', '*'],
        frameAncestors: ["'self'", '*'],
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  }));
  securityService.logSecurityEvent('INFO', 'Helmet Security Headers Active (CSP, XSS, Frame-Options, HSTS).');

  // CORS Configuration
  app.use(cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  }));
  securityService.logSecurityEvent('INFO', 'CORS Cross-Origin Resource Sharing rules applied.');

  // JSON Body Parser & Cookie Parser
  app.use(express.json());
  app.use(cookieParser('siakad_secure_cookie_signer_salt_9988'));

  // Global Rate Limiter to prevent Brute Force on APIs
  const bruteForceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: false,
    handler: (req, res, next, options) => {
      const ip = req.ip || '127.0.0.1';
      securityService.logSecurityEvent('ALERT', `Rate Limit Exceeded for IP: ${ip} on route ${req.originalUrl}`, ip);
      res.status(429).json({
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Terlalu banyak permintaan dari IP Anda. Sistem keamanan membatasi akses sementara.'
      });
    }
  });
  app.use('/api/', bruteForceLimiter);

  // CSRF Protection Middleware (Double-Submit Cookie Pattern)
  function csrfProtection(req: any, res: any, next: any) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      if (!req.cookies.csrfToken) {
        const csrfToken = crypto.randomBytes(32).toString('hex');
        req.csrfToken = csrfToken;
        res.cookie('csrfToken', csrfToken, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
      }
      return next();
    }

    // Bypass CSRF checks for API requests using Bearer authorization headers (mobile clients like Android)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      return next();
    }

    const cookieToken = req.cookies.csrfToken;
    const headerToken = req.headers['x-csrf-token'] || req.headers['X-CSRF-Token'];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      const ip = req.ip || '127.0.0.1';
      securityService.logSecurityEvent('ALERT', `CSRF Protection Violation Blocked! Route: ${req.originalUrl}, IP: ${ip}`, ip);
      return res.status(403).json({
        status: 'error',
        code: 'CSRF_ERROR',
        message: 'Keamanan CSRF: Permintaan ditolak karena token CSRF tidak valid atau kedaluwarsa.'
      });
    }

    next();
  }
  app.use('/api/', csrfProtection);

  const expressInstance = app.getHttpAdapter().getInstance();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    expressInstance.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    expressInstance.use(express.static(distPath));
    expressInstance.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`[NESTJS SERVER] Full-Stack Secure SIAKAD running on http://0.0.0.0:${PORT}`);
}

bootstrap();
