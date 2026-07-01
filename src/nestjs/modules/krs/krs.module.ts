import { Module } from '@nestjs/common';
import { KrsController } from './krs.controller';
import { KrsService } from './krs.service';
import { SecurityModule } from '../security/security.module';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [SecurityModule, SystemModule],
  controllers: [KrsController],
  providers: [KrsService],
  exports: [KrsService],
})
export class KrsModule {}
