import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpStatus, HttpException, Inject, HttpCode } from '@nestjs/common';
import * as express from 'express';
import { SecurityService } from '../security/security.service';
import { UsersService } from '../users/users.service';
import { SecureUser } from '../users/secure-user.interface';
import { AuditService } from '../system/audit.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { z } from 'zod';
import crypto from 'crypto';

const loginInputSchema = z.object({
  username: z.string().email({ message: 'Username harus berupa alamat email valid' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' })
});

const registrationInputSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(8, { message: 'Kata sandi minimal 8 karakter demi keamanan' }),
  role: z.enum(['student', 'lecturer', 'kaprodi', 'dekan', 'admin', 'alumni', 'baak', 'bauk', 'applicant'], { message: 'Peran pengguna tidak valid' }),
  department: z.string().min(3, { message: 'Program studi / unit kerja minimal 3 karakter' }),
  phone: z.string().min(10, { message: 'Nomor telepon minimal 10 digit' })
});

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(SecurityService) private readonly securityService: SecurityService,
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(AuditService) private readonly auditService: AuditService,
  ) {
    console.log("DEBUG AUTH_CONTROLLER CONSTRUCTOR:", {
      securityService: !!this.securityService,
      usersService: !!this.usersService,
      auditService: !!this.auditService,
    });
  }

  @Get('csrf-token')
  getCsrfToken(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    let csrfToken = (req as any).csrfToken || req.cookies?.csrfToken;
    if (!csrfToken) {
      csrfToken = crypto.randomBytes(32).toString('hex');
      res.cookie('csrfToken', csrfToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    }
    return { status: 'success', csrfToken };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return { status: 'success', user: req.user };
  }

  @Post('secure-register')
  async secureRegister(@Req() req: express.Request, @Body() body: any) {
    const ip = req.ip || '127.0.0.1';
    try {
      const validatedData = registrationInputSchema.parse(body);

      const existing = this.usersService.findByUsername(validatedData.email);
      if (existing) {
        this.securityService.logSecurityEvent('WARNING', `Registration attempt failed: User ${validatedData.email} already exists`, ip);
        throw new HttpException({
          status: 'error',
          message: 'Email tersebut sudah terdaftar dalam sistem SIAKAD.'
        }, HttpStatus.BAD_REQUEST);
      }

      const { hash, algo } = await this.securityService.secureHash(validatedData.password);

      const newUser: SecureUser = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        username: validatedData.email.toLowerCase(),
        email: validatedData.email.toLowerCase(),
        name: validatedData.name,
        role: validatedData.role,
        phone: validatedData.phone,
        department: validatedData.department,
        passwordHash: hash,
        hashingAlgo: algo
      };

      this.usersService.create(newUser);
      const regDetails = `New user registered: ${validatedData.email} as role [${validatedData.role}] using ${algo.toUpperCase()}`;
      this.securityService.logSecurityEvent('INFO', regDetails, ip);
      this.auditService.log(
        newUser.id,
        newUser.email,
        'AUTH_REGISTER_SUCCESS',
        'auth',
        regDetails,
        ip,
        req.headers['user-agent'] || 'Unknown'
      );

      return {
        status: 'success',
        message: 'Registrasi akun berhasil secara aman!',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          department: newUser.department,
          hashingAlgo: algo
        }
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const valDetails = `Registration schema validation failed: ${(error as any).errors.map((e: any) => e.message).join(', ')}`;
        this.securityService.logSecurityEvent('WARNING', `Registration schema validation failed from IP: ${ip}`, ip);
        this.auditService.log(
          'ANONYMOUS',
          body.email || 'anonymous@kampus.ac.id',
          'AUTH_REGISTER_VALIDATION_FAILED',
          'auth',
          valDetails,
          ip,
          req.headers['user-agent'] || 'Unknown'
        );
        throw new HttpException({
          status: 'error',
          errors: (error as any).errors.map((e: any) => e.message)
        }, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      this.securityService.logSecurityEvent('ALERT', `Internal error during registration: ${(error as Error).message}`, ip);
      throw new HttpException({ status: 'error', message: 'Gagal memproses registrasi secara aman.' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('secure-login')
  @HttpCode(HttpStatus.OK)
  async secureLogin(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response, @Body() body: any) {
    const ip = req.ip || '127.0.0.1';
    try {
      const { username, password } = loginInputSchema.parse(body);

      const user = this.usersService.findByUsername(username);
      if (!user) {
        const userNotFoundDetails = `Failed login attempt: Account ${username} not found`;
        this.securityService.logSecurityEvent('WARNING', userNotFoundDetails, ip);
        this.auditService.log(
          'ANONYMOUS',
          username,
          'AUTH_LOGIN_FAILED_USER_NOT_FOUND',
          'auth',
          userNotFoundDetails,
          ip,
          req.headers['user-agent'] || 'Unknown'
        );
        throw new HttpException({
          status: 'error',
          message: 'Kredensial tidak valid. Silakan periksa kembali email atau kata sandi Anda.'
        }, HttpStatus.UNAUTHORIZED);
      }

      const isValid = await this.securityService.secureVerify(password, user.passwordHash, user.hashingAlgo);
      if (!isValid) {
        const incorrectPwdDetails = `Failed login attempt: Incorrect password for ${username}`;
        this.securityService.logSecurityEvent('WARNING', incorrectPwdDetails, ip);
        this.auditService.log(
          user.id,
          user.email,
          'AUTH_LOGIN_FAILED_INCORRECT_PASSWORD',
          'auth',
          incorrectPwdDetails,
          ip,
          req.headers['user-agent'] || 'Unknown'
        );
        throw new HttpException({
          status: 'error',
          message: 'Kredensial tidak valid. Silakan periksa kembali email atau kata sandi Anda.'
        }, HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      const token = this.securityService.signAccessToken(payload);
      const refreshToken = this.securityService.signRefreshToken(payload);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      const successDetails = `User authenticated: ${username} (Role: ${user.role}). Signed Access Token (15m, Access Secret) & Refresh Token (7d, Refresh Secret).`;
      this.securityService.logSecurityEvent('INFO', successDetails, ip);
      this.auditService.log(
        user.id,
        user.email,
        'AUTH_LOGIN_SUCCESS',
        'auth',
        successDetails,
        ip,
        req.headers['user-agent'] || 'Unknown'
      );

      return {
        status: 'success',
        message: 'Otentikasi berhasil!',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          department: user.department,
          hashingAlgo: user.hashingAlgo
        }
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.securityService.logSecurityEvent('WARNING', `Login request validation failed`, ip);
        throw new HttpException({
          status: 'error',
          message: 'Format input tidak valid.',
          errors: (error as any).errors?.map((e: any) => e.message) || []
        }, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      this.securityService.logSecurityEvent('ALERT', `Internal error during authentication: ${(error as Error).message}`, ip);
      throw new HttpException({ status: 'error', message: 'Terjadi kesalahan internal pada sistem keamanan.' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset-password-request')
  resetPasswordRequest(@Req() req: express.Request, @Body() body: any) {
    const { email } = body;
    const ip = req.ip || '127.0.0.1';

    const user = this.usersService.findByUsername(email);
    if (!user) {
      const details = `Password reset requested for non-existent email: ${email}. Generic response returned.`;
      this.securityService.logSecurityEvent('INFO', details, ip);
      this.auditService.log(
        'ANONYMOUS',
        email || 'anonymous@kampus.ac.id',
        'AUTH_RESET_REQUEST_INVALID_EMAIL',
        'auth',
        details,
        ip,
        req.headers['user-agent'] || 'Unknown'
      );
      return {
        status: 'success',
        message: 'Instruksi reset kata sandi telah dikirim jika email terdaftar.'
      };
    }

    const resetToken = this.securityService.signResetPasswordToken({ id: user.id, purpose: 'password_reset' });

    const details = `Password reset token generated and signed using JWT_RESET_PASSWORD_SECRET for user ${email} (Expired 10m).`;
    this.securityService.logSecurityEvent('INFO', details, ip);
    this.auditService.log(
      user.id,
      user.email,
      'AUTH_RESET_REQUEST_SUCCESS',
      'auth',
      details,
      ip,
      req.headers['user-agent'] || 'Unknown'
    );

    return {
      status: 'success',
      message: 'Email instruksi reset kata sandi berhasil dikirim! Reset token terbuat dengan kunci reset khusus.',
      debugToken: resetToken
    };
  }

  @Post('reset-password-confirm')
  resetPasswordConfirm(@Req() req: express.Request, @Body() body: any) {
    const { token, newPassword } = body;
    const ip = req.ip || '127.0.0.1';

    if (!token) {
      throw new HttpException({ status: 'error', message: 'Token pemulihan diperlukan.' }, HttpStatus.BAD_REQUEST);
    }

    if (this.securityService.invalidPasswordResetTokens.has(token)) {
      const replayDetails = `REPLAY ATTACK BLOCKED: Deteksi upaya penggunaan ulang token reset kata sandi yang telah kedaluwarsa/terpakai! IP: ${ip}`;
      this.securityService.logSecurityEvent('ALERT', replayDetails, ip);
      this.auditService.log(
        'UNKNOWN_REPLAY_ATTACKER',
        'anonymous@kampus.ac.id',
        'AUTH_RESET_CONFIRM_REPLAY_ATTACK',
        'auth',
        replayDetails,
        ip,
        req.headers['user-agent'] || 'Unknown'
      );
      throw new HttpException({
        status: 'error',
        message: 'Token Kedaluwarsa! Token pemulihan kata sandi ini sudah digunakan sebelumnya. Satu token hanya valid untuk satu kali pakai (One-Time Use Enforced).'
      }, HttpStatus.BAD_REQUEST);
    }

    const decoded = this.securityService.verifyResetToken(token);
    if (!decoded || decoded.purpose !== 'password_reset') {
      const invalidTokenDetails = `Failed password reset: Invalid or expired reset token from IP ${ip}`;
      this.securityService.logSecurityEvent('WARNING', invalidTokenDetails, ip);
      this.auditService.log(
        'UNKNOWN_REPLAY_ATTACKER',
        'anonymous@kampus.ac.id',
        'AUTH_RESET_CONFIRM_INVALID_TOKEN',
        'auth',
        invalidTokenDetails,
        ip,
        req.headers['user-agent'] || 'Unknown'
      );
      throw new HttpException({
        status: 'error',
        message: 'Token pemulihan tidak valid atau telah melewati batas kedaluwarsa ketat 10 menit.'
      }, HttpStatus.BAD_REQUEST);
    }

    this.securityService.invalidPasswordResetTokens.add(token);

    const successDetails = `Password reset completed successfully using JWT_RESET_PASSWORD_SECRET. User ID ${decoded.id} has secure new password.`;
    this.securityService.logSecurityEvent('INFO', successDetails, ip);
    
    // Fetch user details for audit record
    const user = this.usersService.findById(decoded.id);
    this.auditService.log(
      decoded.id,
      user?.email || 'unknown@kampus.ac.id',
      'AUTH_RESET_CONFIRM_SUCCESS',
      'auth',
      successDetails,
      ip,
      req.headers['user-agent'] || 'Unknown'
    );

    return {
      status: 'success',
      message: 'Kata sandi Anda berhasil disetel ulang secara aman! Token pemulihan sekarang dinonaktifkan secara permanen.'
    };
  }

  @Post('secure-logout')
  secureLogout(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const ip = req.ip || '127.0.0.1';
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    
    // Since logout is client-triggered, we'll try to identify the user if token cookie is present.
    // If not, it's fine.
    this.auditService.log(
      'ANONYMOUS',
      'anonymous@kampus.ac.id',
      'AUTH_LOGOUT',
      'auth',
      'User logged out and security cookies cleared.',
      ip,
      req.headers['user-agent'] || 'Unknown'
    );

    return {
      status: 'success',
      message: 'Berhasil keluar secara aman dari portal akademik.'
    };
  }
}
