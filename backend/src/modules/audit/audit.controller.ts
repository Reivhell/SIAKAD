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
    const records = await this.auditService.getRecords(limit ? Number(limit) : 100, action, email);
    return {
      status: 'success',
      count: records.length,
      records,
    };
  }
}
