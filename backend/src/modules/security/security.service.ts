import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Redis from 'ioredis';

export interface SecurityLog {
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ALERT';
  message: string;
  ip: string;
}

@Injectable()
export class SecurityService implements OnModuleInit, OnModuleDestroy {
  public jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET || '';
  public jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET || '';
  public jwtResetPasswordSecret: string = process.env.JWT_RESET_PASSWORD_SECRET || '';
  
  // Basis untuk derivasi fallback di dev — diambil dari env, TIDAK hardcoded.
  // Di production, semua secret HARUS diset secara eksplisit via env var (process akan exit jika tidak).
  private readonly devBaseSeed: string = process.env.JWT_SECRET || '';

  public readonly secretsMetadata = {
    JWT_ACCESS_SECRET: { configured: !!process.env.JWT_ACCESS_SECRET, source: process.env.JWT_ACCESS_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' },
    JWT_REFRESH_SECRET: { configured: !!process.env.JWT_REFRESH_SECRET, source: process.env.JWT_REFRESH_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' },
    JWT_RESET_PASSWORD_SECRET: { configured: !!process.env.JWT_RESET_PASSWORD_SECRET, source: process.env.JWT_RESET_PASSWORD_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' }
  };

  public readonly securityLogs: SecurityLog[] = [];
  public readonly invalidPasswordResetTokens = new Set<string>();
  private redis: Redis | null = null;

  onModuleInit() {
    this.initializeSecrets();
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL, {
        retryStrategy(times) {
          if (times > 3) return null; // fall back if unable to connect
          return Math.min(times * 50, 2000);
        },
        maxRetriesPerRequest: 1
      });
      this.redis.on('error', (err) => {
        // Suppress multiple error logs
      });
    }
    this.logSecurityEvent('INFO', 'SIAKAD Modern Security System Initialized via NestJS.', '0.0.0.0');
  }

  onModuleDestroy() {
    if (this.redis) {
      this.redis.quit();
    }
  }

  public async invalidateToken(token: string, expirySeconds: number = 600) {
    try {
      if (this.redis && this.redis.status === 'ready') {
        await this.redis.set(`bl:${token}`, '1', 'EX', expirySeconds);
        return;
      }
    } catch (e) {
      // Ignore
    }
    this.invalidPasswordResetTokens.add(token);
  }

  public async isTokenInvalid(token: string): Promise<boolean> {
    try {
      if (this.redis && this.redis.status === 'ready') {
        const exists = await this.redis.get(`bl:${token}`);
        return !!exists;
      }
    } catch (e) {
      // Ignore
    }
    return this.invalidPasswordResetTokens.has(token);
  }


  private initializeSecrets() {
    if (!this.jwtAccessSecret || !this.jwtRefreshSecret || !this.jwtResetPasswordSecret) {
      console.log('=====================================================================');
      console.log('⚠️  SECURITY NOTICE: Missing dedicated purpose-built JWT secrets in .env!');
      console.log('To minimize blast radius, the system requires separate secrets:');
      console.log('- JWT_ACCESS_SECRET (for short-lived access tokens)');
      console.log('- JWT_REFRESH_SECRET (for long-lived session renewal)');
      console.log('- JWT_RESET_PASSWORD_SECRET (for high-security reset flows)');
      console.log('=====================================================================');

      if (process.env.NODE_ENV === 'production') {
        console.log('❌ CRITICAL ERROR: Production environment mandates explicit JWT secret variables. Exiting...');
        process.exit(1);
      } else {
        console.log('🔧 Development Mode: Generating cryptographically secure ephemeral fallback secrets on startup.');
        // Gunakan devBaseSeed dari env, atau generate ephemeral random jika kosong.
        // TIDAK ada string hardcoded — ini memastikan secret tidak bisa ditebak dari source code.
        const baseSeed = this.devBaseSeed || crypto.randomBytes(32).toString('hex');
        if (!this.jwtAccessSecret) {
          this.jwtAccessSecret = crypto.createHmac('sha256', baseSeed).update('access-token-key').digest('hex');
        }
        if (!this.jwtRefreshSecret) {
          this.jwtRefreshSecret = crypto.createHmac('sha256', baseSeed).update('refresh-token-key').digest('hex');
        }
        if (!this.jwtResetPasswordSecret) {
          this.jwtResetPasswordSecret = crypto.createHmac('sha256', baseSeed).update('reset-password-key').digest('hex');
        }
      }
    } else {
      console.log('✓ All required purposed JWT environment secrets verified successfully.');
    }
  }

  public logSecurityEvent(type: 'INFO' | 'WARNING' | 'ALERT', message: string, ip: string = '127.0.0.1') {
    const event: SecurityLog = {
      timestamp: new Date().toISOString(),
      type,
      message,
      ip
    };
    this.securityLogs.unshift(event);
    if (this.securityLogs.length > 50) this.securityLogs.pop(); // Keep last 50 events
    console.log(`[SECURITY ${type}] ${event.timestamp} - ${message}`);
  }

  // Token signatures
  public signAccessToken(payload: any): string {
    return jwt.sign(payload, this.jwtAccessSecret, { expiresIn: '15m', algorithm: 'HS256' });
  }

  public signRefreshToken(payload: any): string {
    return jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: '7d', algorithm: 'HS256' });
  }

  public signResetPasswordToken(payload: any): string {
    return jwt.sign(payload, this.jwtResetPasswordSecret, { expiresIn: '10m', algorithm: 'HS256' });
  }

  // Token verifications
  public verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtAccessSecret);
    } catch (err) {
      return null;
    }
  }

  public verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtRefreshSecret);
    } catch (err) {
      return null;
    }
  }

  public verifyResetToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtResetPasswordSecret);
    } catch (err) {
      return null;
    }
  }

  // Passwords
  public async secureHash(password: string): Promise<{ hash: string; algo: 'argon2' | 'bcrypt' }> {
    try {
      const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 12, // 4MB
        timeCost: 3,
        parallelism: 1
      });
      return { hash, algo: 'argon2' };
    } catch (error) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return { hash, algo: 'bcrypt' };
    }
  }

  public async secureVerify(password: string, hash: string, algo: 'argon2' | 'bcrypt'): Promise<boolean> {
    try {
      if (algo === 'argon2') {
        return await argon2.verify(hash, password);
      } else {
        return await bcrypt.compare(password, hash);
      }
    } catch (err) {
      try {
        return await bcrypt.compare(password, hash);
      } catch {
        return false;
      }
    }
  }

  public rotateAllSecrets() {
    this.jwtAccessSecret = crypto.randomBytes(64).toString('hex');
    this.jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
    this.jwtResetPasswordSecret = crypto.randomBytes(64).toString('hex');
  }
}
