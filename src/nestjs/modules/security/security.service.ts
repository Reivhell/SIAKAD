import { Injectable, OnModuleInit } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';
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
  
  public readonly jwtSecretFallback = process.env.JWT_SECRET || 'siakad_modern_super_secure_vault_key_2026';
  
  public readonly secretsMetadata = {
    JWT_ACCESS_SECRET: { configured: !!process.env.JWT_ACCESS_SECRET, source: process.env.JWT_ACCESS_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' },
    JWT_REFRESH_SECRET: { configured: !!process.env.JWT_REFRESH_SECRET, source: process.env.JWT_REFRESH_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' },
    JWT_RESET_PASSWORD_SECRET: { configured: !!process.env.JWT_RESET_PASSWORD_SECRET, source: process.env.JWT_RESET_PASSWORD_SECRET ? 'Environment (.env)' : 'On-the-Fly Generator (Ephemeral)' }
  };

  public readonly securityLogs: SecurityLog[] = [];
  public readonly invalidPasswordResetTokens = new Set<string>();

  onModuleInit() {
    this.initializeSecrets();
    this.logSecurityEvent('INFO', 'SIAKAD Modern Security System Initialized via NestJS.', '0.0.0.0');
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
        console.log('🔧 Development Mode: Generating cryptographically secure stable fallback secrets on startup.');
        const baseFallback = this.jwtSecretFallback;
        if (!this.jwtAccessSecret) {
          this.jwtAccessSecret = crypto.createHmac('sha256', baseFallback).update('access-token-key').digest('hex');
        }
        if (!this.jwtRefreshSecret) {
          this.jwtRefreshSecret = crypto.createHmac('sha256', baseFallback).update('refresh-token-key').digest('hex');
        }
        if (!this.jwtResetPasswordSecret) {
          this.jwtResetPasswordSecret = crypto.createHmac('sha256', baseFallback).update('reset-password-key').digest('hex');
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
