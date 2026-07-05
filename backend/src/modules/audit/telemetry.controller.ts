import { Controller, Get, UseGuards } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/security')
export class TelemetryController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get('telemetry')
  async getTelemetry() {
    return {
      status: 'success',
      telemetry: {
        helmetActive: true,
        corsActive: true,
        rateLimitConfig: {
          windowMinutes: 15,
          maxRequests: 200,
        },
        algorithms: {
          jwt: 'HS256',
          passwordHashing: 'Argon2id (Fallback: Bcrypt)',
        },
        systemUsersCount: await this.usersService.count(),
      },
    };
  }
}
