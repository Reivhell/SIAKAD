import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/system')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'dekan')
  @Get('audit-logs')
  async getAuditLogs(
    @Query('limit') limit?: number,
    @Query('action') action?: string,
    @Query('email') email?: string,
  ) {
    // Cap limit untuk mencegah klien meminta array raksasa (memory abuse).
    const rawLimit = Number(limit);
    const safeLimit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 500) : 100;
    const records = await this.auditService.getRecords(safeLimit, action, email);
    return {
      status: 'success',
      count: records.length,
      records,
    };
  }
}
