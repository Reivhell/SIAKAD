import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SecurityModule } from '../security/security.module';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [UsersModule, SecurityModule, SystemModule],
  controllers: [AuthController],
})
export class AuthModule {}
