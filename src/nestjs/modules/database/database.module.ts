import { Module, Global } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { KrsRepository } from './krs.repository';

@Global()
@Module({
  providers: [UserRepository, KrsRepository],
  exports: [UserRepository, KrsRepository],
})
export class DatabaseModule {}
