import { Module } from '@nestjs/common';
import { KrsController } from './krs.controller';
import { KrsService } from './krs.service';
import { KrsRepository } from './krs.repository';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, SecurityModule, AuditModule],
  controllers: [KrsController],
  providers: [KrsService, KrsRepository],
  exports: [KrsService],
})
export class KrsModule {}
