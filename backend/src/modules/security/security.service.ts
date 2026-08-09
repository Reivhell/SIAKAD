import { Injectable, OnModuleInit } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import crypto from 'crypto';

export interface SecurityLog {
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ALERT';
  message: string;
  ip: string;
}

@Injectable()
export class SecurityService implements OnModuleInit {
  public jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET || '';
  public jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET || '';
  public jwtResetPasswordSecret: string = process.env.JWT_RESET_PASSWORD_SECRET || '';

  // Basis untuk derivasi fallback di dev — diambil dari env, TIDAK hardcoded.
  // Di production, semua secret HARUS diset secara eksplisit via env var (process akan exit jika tidak).
  private readonly devBaseSeed: string = process.env.JWT_SECRET || '';

  // Token hardening: semua JWT harus HS256 dan di-issue oleh API ini.
  // Menentukan issuer + algorithm secara eksplisit mencegah algoritme confusion
  // dan memastikan token asing (dari issuer lain) tidak pernah diterima.
  static readonly JWT_ISSUER = 'siakad-api';
  static readonly JWT_ALGORITHM = 'HS256';

  // Penyimpanan one-time-use reset token: hash(token) => expiry (ms epoch).
  // Dibanding Set<string>, store ini: (1) ter-otomatis kadaluarsa, (2) ter-bound,
  //  sehingga tidak bisa tumbuh tak terbatas menjadi memory leak.
  private readonly invalidatedResetTokens = new Map<string, number>();
  private static readonly MAX_INVALIDATED_TOKENS = 1000;

  public readonly secretsMetadata = {
    JWT_ACCESS_SECRET: { configured: !!process.env.JWT_ACCESS_SECRET, source: process.env.JWT_ACCESS_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' },
    JWT_REFRESH_SECRET: { configured: !!process.env.JWT_REFRESH_SECRET, source: process.env.JWT_REFRESH_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' },
    JWT_RESET_PASSWORD_SECRET: { configured: !!process.env.JWT_RESET_PASSWORD_SECRET, source: process.env.JWT_RESET_PASSWORD_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' }
  };

  public readonly securityLogs: SecurityLog[] = [];

  onModuleInit() {
    this.initializeSecrets();
    this.logSecurityEvent('INFO', 'SIAKAD Modern Security System Initialized via NestJS.', '0.0.0.0');
  }

  /**
   * Menandai token sebagai tidak valid (one-time-use) hingga `ttlSeconds`.
   * Hanya hash SHA-256 dari token yang disimpan — token mentah tidak
   * pernah berada di memori dalam jangka panjang.
   */
  public invalidateToken(token: string, ttlSeconds: number = 600): void {
    this.pruneInvalidatedTokens();
    const hash = this.hashToken(token);
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.invalidatedResetTokens.set(hash, expiresAt);
    if (this.invalidatedResetTokens.size > SecurityService.MAX_INVALIDATED_TOKENS) {
      let oldestKey: string | null = null;
      let oldestExpiry = Infinity;
      for (const [key, expiry] of this.invalidatedResetTokens) {
        if (expiry < oldestExpiry) {
          oldestExpiry = expiry;
          oldestKey = key;
        }
      }
      if (oldestKey) this.invalidatedResetTokens.delete(oldestKey);
    }
  }

  public isTokenInvalid(token: string): boolean {
    this.pruneInvalidatedTokens();
    return this.invalidatedResetTokens.has(this.hashToken(token));
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private pruneInvalidatedTokens(): void {
    const now = Date.now();
    for (const [key, expiry] of this.invalidatedResetTokens) {
      if (expiry <= now) this.invalidatedResetTokens.delete(key);
    }
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

  // Token signatures — HS256 + issuer tetap diverifikasi saat decode.
  public signAccessToken(payload: any): string {
    return jwt.sign(payload, this.jwtAccessSecret, {
      expiresIn: '15m',
      algorithm: SecurityService.JWT_ALGORITHM,
      issuer: SecurityService.JWT_ISSUER,
    });
  }

  public signRefreshToken(payload: any): string {
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: '7d',
      algorithm: SecurityService.JWT_ALGORITHM,
      issuer: SecurityService.JWT_ISSUER,
    });
  }

  public signResetPasswordToken(payload: any): string {
    return jwt.sign(payload, this.jwtResetPasswordSecret, {
      expiresIn: '10m',
      algorithm: SecurityService.JWT_ALGORITHM,
      issuer: SecurityService.JWT_ISSUER,
    });
  }

  // Token verifications — algoritme dan issuer diverifikasi secara eksplisit.
  // Ini mencegah kategori serangan "algorithm confusion" dan penolakan token asing.
  public verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtAccessSecret, {
        algorithms: [SecurityService.JWT_ALGORITHM],
        issuer: SecurityService.JWT_ISSUER,
      });
    } catch (err) {
      return null;
    }
  }

  public verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtRefreshSecret, {
        algorithms: [SecurityService.JWT_ALGORITHM],
        issuer: SecurityService.JWT_ISSUER,
      });
    } catch (err) {
      return null;
    }
  }

  public verifyResetToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtResetPasswordSecret, {
        algorithms: [SecurityService.JWT_ALGORITHM],
        issuer: SecurityService.JWT_ISSUER,
      });
    } catch (err) {
      return null;
    }
  }

  // Passwords
  public async secureHash(password: string): Promise<{ hash: string; algo: 'argon2' | 'bcrypt' }> {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 12, // 4MB
      timeCost: 3,
      parallelism: 1
    });
    return { hash, algo: 'argon2' };
  }

  public async secureVerify(password: string, hash: string, algo: 'argon2' | 'bcrypt'): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (err) {
      return false;
    }
  }

  public rotateAllSecrets() {
    this.jwtAccessSecret = crypto.randomBytes(64).toString('hex');
    this.jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
    this.jwtResetPasswordSecret = crypto.randomBytes(64).toString('hex');
  }
}
