import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
