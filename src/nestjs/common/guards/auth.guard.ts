import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { SecurityService } from '../../modules/security/security.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(SecurityService) private readonly securityService: SecurityService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const ip = req.ip || '127.0.0.1';
    
    console.log("DEBUG AUTH_GUARD INCOMING REQUEST:", {
      url: req.url,
      headers: req.headers,
      cookies: req.cookies,
      signedCookies: req.signedCookies
    });
    
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
        req.user = decoded;
        return true;
      }
    }

    // Attempt Session Recovery with HttpOnly Refresh Token
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const decodedRefresh = this.securityService.verifyRefreshToken(refreshToken);
      if (decodedRefresh) {
        const userPayload = {
          id: decodedRefresh.id,
          email: decodedRefresh.email,
          role: decodedRefresh.role,
          name: decodedRefresh.name,
        };
        
        const newAccessToken = this.securityService.signAccessToken(userPayload);
        
        // Update access token cookie
        res.cookie('token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 mins
        });

        this.securityService.logSecurityEvent('INFO', `Sesi diperbarui secara otomatis menggunakan Refresh Token untuk ${userPayload.email} di Guard.`, ip);
        req.user = userPayload;
        return true;
      }
    }

    this.securityService.logSecurityEvent('WARNING', `Upaya akses tanpa otentikasi valid dari IP: ${ip} pada rute ${req.url}`, ip);
    throw new UnauthorizedException({
      code: 'UNAUTHORIZED',
      message: 'Akses ditolak. Sesi Anda tidak valid atau telah berakhir.'
    });
  }
}
