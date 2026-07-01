import { Controller, Get, Post, Body, Req, UseGuards, HttpStatus, HttpException, Inject, HttpCode } from '@nestjs/common';
import * as express from 'express';
import { KrsService } from './krs.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/krs')
@UseGuards(AuthGuard, RolesGuard)
export class KrsController {
  constructor(@Inject(KrsService) private readonly krsService: KrsService) {}

  @Get()
  async getKrs(@Req() req: express.Request) {
    const user = (req as any).user;
    const krs = await this.krsService.getKrsByEmail(user.email, user.name);
    return {
      status: 'success',
      krs,
    };
  }

  @Post('add-course')
  @HttpCode(HttpStatus.OK)
  async addCourse(@Req() req: express.Request, @Body() body: any) {
    const user = (req as any).user;
    const { courseCode } = body;

    if (!courseCode) {
      throw new HttpException('Kode mata kuliah wajib diisi.', HttpStatus.BAD_REQUEST);
    }

    const krs = await this.krsService.addCourse(
      user.email,
      user.name,
      courseCode,
      req.ip || '127.0.0.1',
      req.headers['user-agent'] || 'Unknown',
      user.id,
    );

    return {
      status: 'success',
      message: `Mata kuliah ${courseCode} berhasil ditambahkan ke rencana studi.`,
      krs,
    };
  }

  @Post('remove-course')
  @HttpCode(HttpStatus.OK)
  async removeCourse(@Req() req: express.Request, @Body() body: any) {
    const user = (req as any).user;
    const { courseCode } = body;

    if (!courseCode) {
      throw new HttpException('Kode mata kuliah wajib diisi.', HttpStatus.BAD_REQUEST);
    }

    const krs = await this.krsService.removeCourse(
      user.email,
      user.name,
      courseCode,
      req.ip || '127.0.0.1',
      req.headers['user-agent'] || 'Unknown',
      user.id,
    );

    return {
      status: 'success',
      message: `Mata kuliah ${courseCode} berhasil dihapus dari rencana studi.`,
      krs,
    };
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitKrs(@Req() req: express.Request) {
    const user = (req as any).user;
    const krs = await this.krsService.submitKrs(
      user.email,
      user.name,
      req.ip || '127.0.0.1',
      req.headers['user-agent'] || 'Unknown',
      user.id,
    );

    return {
      status: 'success',
      message: 'Rencana studi (KRS) berhasil diajukan untuk persetujuan Dosen Wali.',
      krs,
    };
  }

  @Get('students')
  @Roles('admin', 'dekan', 'kaprodi', 'lecturer')
  async getAllKrs() {
    const records = await this.krsService.getAllKrs();
    return {
      status: 'success',
      count: records.length,
      records,
    };
  }

  @Post('approve')
  @Roles('admin', 'dekan', 'kaprodi', 'lecturer')
  @HttpCode(HttpStatus.OK)
  async approveKrs(@Req() req: express.Request, @Body() body: any) {
    const user = (req as any).user;
    const { studentNim, approve } = body;

    if (!studentNim || approve === undefined) {
      throw new HttpException('NIM mahasiswa dan status persetujuan (approve) wajib diisi.', HttpStatus.BAD_REQUEST);
    }

    const krs = await this.krsService.approveKrs(
      studentNim,
      approve,
      req.ip || '127.0.0.1',
      req.headers['user-agent'] || 'Unknown',
      user.id,
      user.email,
    );

    const actionMsg = approve ? 'disetujui' : 'diminta revisi';
    return {
      status: 'success',
      message: `Rencana studi mahasiswa dengan NIM ${studentNim} berhasil ${actionMsg}.`,
      krs,
    };
  }
}
