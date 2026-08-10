import { Controller, Get, Req, UseGuards, Inject } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboardService: DashboardService) {}

  @Get('summary')
  summary(@Req() req: { user: { id: string; email: string; role: string; name: string } }) {
    return this.dashboardService.summary(req.user);
  }
}