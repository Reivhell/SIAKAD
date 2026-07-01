import { Controller, Get } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { UsersService } from '../users/users.service';

@Controller('api/security')
export class TelemetryController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly usersService: UsersService,
  ) {}

  @Get('telemetry')
  getTelemetry() {
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
          saltRounds: 10,
        },
        systemUsersCount: this.usersService.count(),
        logs: this.securityService.securityLogs,
      },
    };
  }
}
