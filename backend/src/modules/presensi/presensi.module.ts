import { Module } from '@nestjs/common';
import { PresensiController } from './presensi.controller';
import { PresensiService } from './presensi.service';
import { PresensiRepository } from './presensi.repository';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, SecurityModule, AuditModule],
  controllers: [PresensiController],
  providers: [PresensiService, PresensiRepository],
  exports: [PresensiService],
})
export class PresensiModule {}