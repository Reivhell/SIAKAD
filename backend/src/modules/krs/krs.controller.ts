import { Controller, Get, Post, Body, Req, Query, UseGuards, HttpStatus, HttpException, Inject, HttpCode } from '@nestjs/common';
import * as express from 'express';
import { KrsService } from './krs.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

const COURSE_CODE_PATTERN = /^[A-Z0-9]{2,10}$/;

function normalizeCourseCode(courseCode: unknown): string {
  if (typeof courseCode !== 'string' || !COURSE_CODE_PATTERN.test(courseCode.toUpperCase())) {
    throw new HttpException('Kode mata kuliah tidak valid.', HttpStatus.BAD_REQUEST);
  }
  return courseCode.toUpperCase();
}

@Controller('api/krs')
@UseGuards(AuthGuard, RolesGuard)
export class KrsController {
  constructor(@Inject(KrsService) private readonly krsService: KrsService) {}

  @Get()
  @Roles('student')
  async getKrs(@Req() req: express.Request) {
    const user = (req as any).user;
    const krs = await this.krsService.getKrsByEmail(user.email, user.name);
    return {
      status: 'success',
      krs,
    };
  }

  @Post('add-course')
  @Roles('student')
  @HttpCode(HttpStatus.OK)
  async addCourse(@Req() req: express.Request, @Body() body: any) {
    const user = (req as any).user;
    const courseCode = normalizeCourseCode(body?.courseCode);

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
  @Roles('student')
  @HttpCode(HttpStatus.OK)
  async removeCourse(@Req() req: express.Request, @Body() body: any) {
    const user = (req as any).user;
    const courseCode = normalizeCourseCode(body?.courseCode);

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
  @Roles('student')
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
  async getAllKrs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const parsedPage = page ? Number(page) : 1;
    const parsedLimit = limit ? Number(limit) : 10;

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
      throw new HttpException('Parameter page harus berupa angka bulat positif.', HttpStatus.BAD_REQUEST);
    }
    if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
      throw new HttpException('Parameter limit harus berupa angka bulat positif.', HttpStatus.BAD_REQUEST);
    }

    const result = await this.krsService.getAllKrsPaginated(parsedPage, parsedLimit, search, status);

    return {
      status: 'success',
      count: result.count,
      records: result.records,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  @Post('approve')
  @Roles('admin', 'dekan', 'kaprodi', 'lecturer')
  @HttpCode(HttpStatus.OK)
  async approveKrs(@Req() req: express.Request, @Body() body: any) {
    const user = (req as any).user;
    const { studentNim, approve } = body || {};

    if (typeof studentNim !== 'string' || !studentNim.trim() || studentNim.length > 30) {
      throw new HttpException('NIM mahasiswa tidak valid.', HttpStatus.BAD_REQUEST);
    }
    // `approve` HARUS boolean sungguhan. String "false" adalah truthy —
    // tanpa cek ini sebuah KRS bisa "disetujui" oleh nilai yang tidak valid.
    if (typeof approve !== 'boolean') {
      throw new HttpException('Parameter approve harus bertipe boolean (true/false).', HttpStatus.BAD_REQUEST);
    }

    const krs = await this.krsService.approveKrs(
      studentNim.trim(),
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
