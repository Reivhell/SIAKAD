import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { SecurityModule } from './modules/security/security.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { KrsModule } from './modules/krs/krs.module';

@Module({
  imports: [
    PrismaModule,
    SecurityModule,
    UsersModule,
    AuthModule,
    AuditModule,
    KrsModule,
  ],
})
export class AppModule {}
