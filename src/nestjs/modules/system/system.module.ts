import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { TelemetryController } from './telemetry.controller';
import { InfrastructureController } from './infrastructure.controller';
import { AuditController } from './audit.controller';
import { SecurityModule } from '../security/security.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SecurityModule,
    UsersModule,
  ],
  providers: [AuditService],
  controllers: [
    TelemetryController,
    InfrastructureController,
    AuditController,
  ],
  exports: [AuditService],
})
export class SystemModule {}
