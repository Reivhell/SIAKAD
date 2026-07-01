import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { SecurityModule } from './modules/security/security.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SystemModule } from './modules/system/system.module';
import { KrsModule } from './modules/krs/krs.module';

@Module({
  imports: [
    DatabaseModule,
    SecurityModule,
    UsersModule,
    AuthModule,
    SystemModule,
    KrsModule,
  ],
})
export class AppModule {}
