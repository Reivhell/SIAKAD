import { Module } from '@nestjs/common';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, SecurityModule, AuditModule],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}