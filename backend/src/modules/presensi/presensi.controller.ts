import { Controller, Get, Post, Body, Param, Req, UseGuards, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import * as express from 'express';
import { PresensiService } from './presensi.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/presensi')
@UseGuards(AuthGuard, RolesGuard)
export class PresensiController {
  constructor(@Inject(PresensiService) private readonly presensiService: PresensiService) {}

  /** Daftar kelas yang diampu dosen + status sesi hari ini. */
  @Get('classes')
  @Roles('lecturer')
  async getClasses(@Req() req: express.Request) {
    const user = (req as any).user;
    const classes = await this.presensiService.getClasses(user);
    return { status: 'success', classes };
  }

  /** Riwayat sesi presensi satu mata kuliah (dosen pengampu). */
  @Get('classes/:code/history')
  @Roles('lecturer')
  async getClassHistory(@Req() req: express.Request, @Param('code') code: string) {
    const user = (req as any).user;
    const result = await this.presensiService.getClassHistory(code, user);
    return { status: 'success', ...result };
  }

  /** Rekap presensi per mahasiswa untuk satu mata kuliah (dosen pengampu). */
  @Get('classes/:code/rekap')
  @Roles('lecturer')
  async getClassRekap(@Req() req: express.Request, @Param('code') code: string) {
    const user = (req as any).user;
    const result = await this.presensiService.getClassRekap(code, user);
    return { status: 'success', ...result };
  }

  /** Membuka sesi presensi baru (dosen pengampu). */
  @Post('sessions')
  @Roles('lecturer')
  @HttpCode(HttpStatus.CREATED)
  async openSession(@Req() req: express.Request, @Body() body: any) {
    const user = (req as any).user;
    const session = await this.presensiService.openSession(
      user,
      body,
      req.ip || '127.0.0.1',
      req.headers['user-agent'] || 'Unknown',
    );
    return { status: 'success', message: `Sesi presensi pertemuan ${session.meetingNumber} berhasil dibuka.`, session };
  }

  /** Detail sesi + daftar hadir terpadu. */
  @Get('sessions/:id')
  @Roles('lecturer', 'admin', 'baak', 'kaprodi', 'dekan')
  async getSessionDetail(@Req() req: express.Request, @Param('id') id: string) {
    const user = (req as any).user;
    const session = await this.presensiService.getSessionDetail(id, user);
    return { status: 'success', session };
  }

  /** Simpan rekaman presensi (bulk upsert) pada sesi yang masih terbuka. */
  @Post('sessions/:id/records')
  @Roles('lecturer')
  @HttpCode(HttpStatus.OK)
  async saveRecords(@Req() req: express.Request, @Param('id') id: string, @Body() body: any) {
    const user = (req as any).user;
    const result = await this.presensiService.saveRecords(
      id,
      user,
      body,
      req.ip || '127.0.0.1',
      req.headers['user-agent'] || 'Unknown',
    );
    return { status: 'success', message: result.message, result };
  }

  /** Tutup sesi presensi (dosen pengampu). */
  @Post('sessions/:id/close')
  @Roles('lecturer')
  @HttpCode(HttpStatus.OK)
  async closeSession(@Req() req: express.Request, @Param('id') id: string) {
    const user = (req as any).user;
    const result = await this.presensiService.closeSession(
      id,
      user,
      req.ip || '127.0.0.1',
      req.headers['user-agent'] || 'Unknown',
    );
    return { status: 'success', message: result.message, session: result };
  }

  /** Riwayat presensi milik mahasiswa yang sedang login. */
  @Get('my')
  @Roles('student')
  async getMyAttendance(@Req() req: express.Request) {
    const user = (req as any).user;
    const result = await this.presensiService.getMyAttendance(user);
    return { status: 'success', ...result };
  }

  /** Ringkasan presensi seluruh kelas (pihak institusi). */
  @Get('summary')
  @Roles('admin', 'baak', 'kaprodi', 'dekan')
  async getSummary(@Req() req: express.Request) {
    const result = await this.presensiService.getSummary();
    return { status: 'success', ...result };
  }
}