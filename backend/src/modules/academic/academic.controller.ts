import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import * as express from 'express';
import { AcademicService, AcademicActor } from './academic.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

function actorOf(req: express.Request): AcademicActor {
  const u = (req as any).user;
  return { id: u.id, email: u.email, role: u.role, name: u.name };
}

function meta(req: express.Request): [string, string] {
  return [req.ip || '127.0.0.1', req.headers['user-agent'] || 'Unknown'];
}

@Controller('api/academic')
@UseGuards(AuthGuard, RolesGuard)
export class AcademicController {
  constructor(@Inject(AcademicService) private readonly academicService: AcademicService) {}

  // ── Dashboard per peran ───────────────────────────────────────────
  @Get('dashboard/:role')
  @Roles('admin', 'lecturer', 'student', 'kaprodi', 'dekan', 'baak', 'bauk', 'alumni', 'applicant')
  async getRoleDashboard(@Param('role') role: string) {
    const data = await this.academicService.getRoleDashboard(role);
    return { status: 'success', ...data };
  }

  @Put('dashboards/:role/items/:collection/:id/status')
  @Roles('admin', 'kaprodi', 'dekan', 'baak', 'bauk')
  async updateRoleDashboardItem(
    @Req() req: express.Request,
    @Param('role') role: string,
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const [ip, ua] = meta(req);
    const data = await this.academicService.updateRoleDashboardItem(role, collection, id, String(body.status || 'Disetujui'), actorOf(req), ip, ua);
    return { status: 'success', message: `Status item diperbarui menjadi ${body.status}.`, data };
  }

  // ── Pengumuman & tanggal akademik ─────────────────────────────────
  @Get('announcements')
  async getAnnouncements(@Query('target') target?: string) {
    return { status: 'success', announcements: await this.academicService.getAnnouncements(target) };
  }

  @Post('announcements')
  @Roles('admin', 'baak', 'bauk')
  @HttpCode(HttpStatus.CREATED)
  async createAnnouncement(@Req() req: express.Request, @Body() body: any) {
    const [ip, ua] = meta(req);
    const announcement = await this.academicService.createAnnouncement(actorOf(req), body, ip, ua);
    return { status: 'success', message: 'Pengumuman berhasil dibuat.', announcement };
  }

  @Put('announcements/:id')
  @Roles('admin', 'baak', 'bauk')
  async updateAnnouncement(@Req() req: express.Request, @Param('id') id: string, @Body() body: any) {
    const [ip, ua] = meta(req);
    const announcement = await this.academicService.updateAnnouncement(id, body, actorOf(req), ip, ua);
    return { status: 'success', message: 'Pengumuman berhasil diperbarui.', announcement };
  }

  @Delete('announcements/:id')
  @Roles('admin', 'baak', 'bauk')
  async deleteAnnouncement(@Req() req: express.Request, @Param('id') id: string) {
    const [ip, ua] = meta(req);
    await this.academicService.deleteAnnouncement(id, actorOf(req), ip, ua);
    return { status: 'success', message: 'Pengumuman dihapus.' };
  }

  @Get('dates')
  async getDates() {
    return { status: 'success', dates: await this.academicService.getDates() };
  }

  // ── Admin overview + master ───────────────────────────────────────
  @Get('admin/overview')
  @Roles('admin', 'baak', 'bauk', 'kaprodi', 'dekan')
  async getAdminOverview() {
    const data = await this.academicService.getAdminOverview();
    return { status: 'success', ...data };
  }

  // ── Dosen: overview & workspace ───────────────────────────────────
  @Get('lecturer/overview')
  @Roles('lecturer')
  async getLecturerOverview(@Req() req: express.Request) {
    const data = await this.academicService.getLecturerOverview(actorOf(req));
    return { status: 'success', ...data };
  }

  @Post('materials')
  @Roles('lecturer')
  async createMaterial(@Req() req: express.Request, @Body() body: any) {
    const [ip, ua] = meta(req);
    const material = await this.academicService.createMaterial(actorOf(req), body, ip, ua);
    return { status: 'success', message: 'Materi berhasil diunggah.', material };
  }

  @Delete('materials/:id')
  @Roles('lecturer')
  async deleteMaterial(@Req() req: express.Request, @Param('id') id: string) {
    const [ip, ua] = meta(req);
    await this.academicService.deleteMaterial(id, actorOf(req), ip, ua);
    return { status: 'success', message: 'Materi dihapus.' };
  }

  @Post('assignments')
  @Roles('lecturer')
  async createAssignment(@Req() req: express.Request, @Body() body: any) {
    const [ip, ua] = meta(req);
    const assignment = await this.academicService.createAssignment(actorOf(req), body, ip, ua);
    return { status: 'success', message: 'Tugas berhasil dibuat.', assignment };
  }

  @Delete('assignments/:id')
  @Roles('lecturer')
  async deleteAssignment(@Req() req: express.Request, @Param('id') id: string) {
    const [ip, ua] = meta(req);
    await this.academicService.deleteAssignment(id, actorOf(req), ip, ua);
    return { status: 'success', message: 'Tugas dihapus.' };
  }

  @Get('grades/my')
  @Roles('student')
  async getMyGrades(@Req() req: express.Request) {
    const data = await this.academicService.getMyGrades(actorOf(req));
    return { status: 'success', ...data };
  }

  @Get('grades/class/:code')
  @Roles('lecturer')
  async getClassGrades(@Req() req: express.Request, @Param('code') code: string) {
    const data = await this.academicService.getClassGrades(code, actorOf(req));
    return { status: 'success', ...data };
  }

  @Post('grades/class/:code')
  @Roles('lecturer')
  async saveClassGrades(@Req() req: express.Request, @Param('code') code: string, @Body() body: any) {
    const [ip, ua] = meta(req);
    const data = await this.academicService.saveClassGrades(code, body, actorOf(req), ip, ua);
    return { status: 'success', message: `Nilai ${code} berhasil disimpan.`, ...data };
  }

  @Get('thesis')
  @Roles('lecturer', 'student')
  async getThesis(@Req() req: express.Request) {
    return { status: 'success', thesis: await this.academicService.getThesis(actorOf(req)) };
  }

  @Get('messages')
  @Roles('lecturer', 'student')
  async getMessages(@Req() req: express.Request, @Query('with') withEmail: string) {
    return { status: 'success', messages: await this.academicService.getMessages(withEmail, actorOf(req)) };
  }

  @Post('messages')
  @Roles('lecturer', 'student')
  async sendMessage(@Req() req: express.Request, @Body() body: any) {
    const [ip, ua] = meta(req);
    const message = await this.academicService.sendMessage(actorOf(req), body, ip, ua);
    return { status: 'success', message: 'Pesan terkirim.', data: message };
  }

  // ── Mahasiswa: overview ───────────────────────────────────────────
  @Get('student/overview')
  @Roles('student')
  async getStudentOverview(@Req() req: express.Request) {
    const data = await this.academicService.getStudentOverview(actorOf(req));
    return { status: 'success', ...data };
  }

  // ── Keuangan ──────────────────────────────────────────────────────
  @Get('finance')
  @Roles('student', 'admin', 'baak', 'bauk', 'kaprodi', 'dekan')
  async getFinance(@Req() req: express.Request) {
    return { status: 'success', bills: await this.academicService.getAllFinance(actorOf(req)) };
  }

  @Post('finance/:id/pay')
  @Roles('student', 'admin', 'baak', 'bauk')
  async payBill(@Req() req: express.Request, @Param('id') id: string) {
    const [ip, ua] = meta(req);
    const bill = await this.academicService.payBill(id, actorOf(req), ip, ua);
    return { status: 'success', message: 'Pembayaran berhasil diproses.', bill };
  }

  @Post('finance')
  @Roles('admin', 'baak', 'bauk')
  async createBill(@Req() req: express.Request, @Body() body: any) {
    const [ip, ua] = meta(req);
    const bill = await this.academicService.createBill(actorOf(req), body, ip, ua);
    return { status: 'success', message: 'Tagihan berhasil dibuat.', bill };
  }

  // ── Helpdesk & dokumen ────────────────────────────────────────────
  @Get('tickets')
  @Roles('student', 'admin', 'baak')
  async getTickets(@Req() req: express.Request) {
    const actor = actorOf(req);
    const tickets = actor.role === 'student' ? await this.academicService.getMyTickets(actor) : await this.academicService.getAllTickets();
    return { status: 'success', tickets };
  }

  @Post('tickets')
  @Roles('admin', 'lecturer', 'student', 'kaprodi', 'dekan', 'baak', 'bauk', 'alumni', 'applicant')
  async createTicket(@Req() req: express.Request, @Body() body: any) {
    const [ip, ua] = meta(req);
    const ticket = await this.academicService.createTicket(actorOf(req), body, ip, ua);
    return { status: 'success', message: 'Tiket berhasil dibuat.', ticket };
  }

  @Put('tickets/:id/status')
  @Roles('admin', 'baak')
  async updateTicketStatus(@Req() req: express.Request, @Param('id') id: string, @Body() body: any) {
    const [ip, ua] = meta(req);
    const ticket = await this.academicService.updateTicketStatus(id, body, actorOf(req), ip, ua);
    return { status: 'success', message: `Status tiket menjadi ${ticket.status}.`, ticket };
  }

  @Get('documents')
  async getDocuments() {
    return { status: 'success', documents: await this.academicService.getDocuments() };
  }
}