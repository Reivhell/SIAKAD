import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SecurityModule } from '../security/security.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [UsersModule, SecurityModule, AuditModule],
  controllers: [AuthController],
})
export class AuthModule {}
