import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SecurityService } from '../../modules/security/security.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(SecurityService) private readonly securityService: SecurityService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles restricted
    }

    const req = context.switchToHttp().getRequest();
    const ip = req.ip || '127.0.0.1';
    
    if (!req.user) {
      throw new ForbiddenException({
        code: 'UNAUTHORIZED',
        message: 'Otentikasi diperlukan.'
      });
    }

    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      this.securityService.logSecurityEvent(
        'ALERT',
        `ACCESS VIOLATION: Pengguna ${req.user.email} (Peran: ${userRole}) mencoba mengakses rute terbatas ${req.url} yang memerlukan peran [${roles.join(', ')}].`,
        ip,
      );
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: `Akses ditolak. Peran Anda (${userRole}) tidak memiliki izin untuk rute ini.`
      });
    }

    return true;
  }
}
