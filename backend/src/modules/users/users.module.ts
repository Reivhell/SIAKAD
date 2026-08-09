import { Module, Global } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SecurityModule } from '../security/security.module';

@Global()
@Module({
  imports: [SecurityModule, PrismaModule],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
