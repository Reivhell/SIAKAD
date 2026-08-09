import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { SecurityService } from '../../modules/security/security.service';
import { UsersService } from '../../modules/users/users.service';

/**
 * AuthGuard — validasi sesi berlapis:
 *
 * 1. Access token (JWT HS256, issuer `siakad-api`) diverifikasi.
 * 2. Token hanya dipercaya jika pengguna MASIH ADA di database dan
 *    `refreshVersion` pada token sama dengan versi tersimpan. Ini membuat
 *    logout & reset password langsung mematikan semua token lama, dan
 *    akun yang dihapus tidak bisa lagi memakai tokennya.
 * 3. Jika access token ekspired, guard mencoba pemulihan via refresh token.
 *    Pada pemulihan, refresh token DIPUTAR (rotasi): versi dinaikkan dan
 *    token baru ditandatangani, sehingga refresh token lama yang dicuri
 *    tidak bisa dipakai ulang (token reuse detection).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(SecurityService) private readonly securityService: SecurityService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const ip = req.ip || '127.0.0.1';

    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = this.securityService.verifyAccessToken(token);
      if (decoded) {
        const session = await this.usersService.findAuthSession(decoded.id);
        if (session && session.refreshVersion === (decoded.ver ?? 0)) {
          req.user = decoded;
          return true;
        }
        // User dihapus atau sesi di-revoke — jangan pakai fallback refresh
        // untuk sesi yang sengaja dicabut; langsung tolak.
        this.securityService.logSecurityEvent('WARNING', `Sesi revoked atau akun tidak ada untuk ${decoded.email || decoded.id} dari IP ${ip}`, ip);
        throw new UnauthorizedException({
          code: 'UNAUTHORIZED',
          message: 'Akses ditolak. Sesi Anda telah dicabut (logout/reset password). Silakan masuk kembali.'
        });
      }
      // Token kadaluarsa/invalid — lanjut ke recovery refresh token di bawah
      // agar pengguna dengan refresh token valid tidak di-logout paksa.
    }

    // Attempt Session Recovery with HttpOnly Refresh Token (dengan rotasi)
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const decodedRefresh = this.securityService.verifyRefreshToken(refreshToken);
      if (decodedRefresh) {
        const session = await this.usersService.findAuthSession(decodedRefresh.id);
        if (session && session.refreshVersion === (decodedRefresh.ver ?? 0)) {
          // Rotasi: naikkan versi sesi agar refresh token yang dipakai ini
          // dan semua duplikatnya mati. Token baru ditandatangani dengan ver+1.
          const nextVersion = session.refreshVersion + 1;
          await this.usersService.bumpRefreshVersion(decodedRefresh.id);

          const userPayload = {
            id: decodedRefresh.id,
            email: decodedRefresh.email,
            role: decodedRefresh.role,
            name: decodedRefresh.name,
            ver: nextVersion,
          };

          const newAccessToken = this.securityService.signAccessToken(userPayload);
          const newRefreshToken = this.securityService.signRefreshToken(userPayload);

          res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 mins
          });
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          this.securityService.logSecurityEvent('INFO', `Sesi diperbarui + refresh token dirotasi untuk ${userPayload.email} di Guard.`, ip);
          req.user = userPayload;
          return true;
        }
      }
    }

    this.securityService.logSecurityEvent('WARNING', `Upaya akses tanpa otentikasi valid dari IP: ${ip} pada rute ${req.url}`, ip);
    throw new UnauthorizedException({
      code: 'UNAUTHORIZED',
      message: 'Akses ditolak. Sesi Anda tidak valid atau telah berakhir.'
    });
  }
}