import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { KrsRepository, AdminKrsItem } from './krs.repository';
import { SecurityService } from '../security/security.service';
import { AuditService } from '../audit/audit.service';
import crypto from 'crypto';

export interface CourseDetail {
  kode: string;
  nama: string;
  sks: number;
}

export interface PaginatedKrsResult {
  records: AdminKrsItem[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

@Injectable()
export class KrsService {
  private readonly availableCourses: CourseDetail[] = [
    { kode: 'IF3110', nama: 'Pengembangan Aplikasi Web', sks: 4 },
    { kode: 'IF3150', nama: 'Sistem Embedded', sks: 3 },
    { kode: 'KU2071', nama: 'Pancasila dan Kewarganegaraan', sks: 2 },
    { kode: 'SI2101', nama: 'Pengantar Sistem Informasi', sks: 3 },
    { kode: 'EE4102', nama: 'Mikrokontroler & IoT', sks: 4 },
    { kode: 'IF4040', nama: 'Kriptografi & Keamanan Informasi', sks: 4 },
    { kode: 'IF4050', nama: 'Kecerdasan Buatan', sks: 3 },
  ];

  constructor(
    @Inject(KrsRepository) private readonly krsRepository: KrsRepository,
    @Inject(SecurityService) private readonly securityService: SecurityService,
    @Inject(AuditService) private readonly auditService: AuditService,
  ) {}

  async getKrsByEmail(email: string, studentName: string): Promise<AdminKrsItem> {
    let krs = await this.krsRepository.findByStudentEmail(email);
    if (!krs) {
      // Create a default draft KRS
      const newKrs: AdminKrsItem = {
        id: crypto.randomUUID(),
        studentNim: '101' + Math.floor(10000 + Math.random() * 90000).toString(),
        studentName,
        studentEmail: email,
        prodi: 'Teknik Informatika',
        sksDiambil: 0,
        status: 'Draft',
        courses: [],
      };
      krs = await this.krsRepository.create(newKrs);
    }
    return krs;
  }

  async addCourse(email: string, studentName: string, courseCode: string, ip: string, userAgent: string, actorId: string): Promise<AdminKrsItem> {
    const krs = await this.getKrsByEmail(email, studentName);

    if (krs.status !== 'Draft' && krs.status !== 'Revisi') {
      throw new HttpException(
        'KRS tidak dapat diubah karena status saat ini bukan Draft atau Revisi.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (krs.courses.includes(courseCode)) {
      throw new HttpException('Mata kuliah sudah ada di dalam KRS Anda.', HttpStatus.BAD_REQUEST);
    }

    const course = this.availableCourses.find((c) => c.kode === courseCode);
    if (!course) {
      throw new HttpException('Kode mata kuliah tidak ditemukan.', HttpStatus.NOT_FOUND);
    }

    const currentSks = this.calculateTotalSks(krs.courses);
    if (currentSks + course.sks > 24) {
      const rollbackDetails = `TX-ROLLBACK: Student ${email} attempted to exceed 24 SKS limit (Current: ${currentSks}, Requested: ${course.sks}).`;
      this.securityService.logSecurityEvent('WARNING', rollbackDetails, ip);
      this.auditService.log(
        actorId,
        email,
        'KRS_ADD_COURSE_EXCEED_LIMIT',
        'krs',
        rollbackDetails,
        ip,
        userAgent
      );

      throw new HttpException(
        'Batas SKS terlampaui! Anda tidak diperbolehkan mengambil lebih dari 24 SKS dalam satu semester.',
        HttpStatus.BAD_REQUEST,
      );
    }

    krs.courses.push(courseCode);
    krs.sksDiambil = this.calculateTotalSks(krs.courses);
    await this.krsRepository.update(krs.id, krs);

    const successDetails = `KRS-ADD: Course ${courseCode} (${course.sks} SKS) added successfully to student ${email}. Total SKS: ${krs.sksDiambil}`;
    this.securityService.logSecurityEvent('INFO', successDetails, ip);
    this.auditService.log(
      actorId,
      email,
      'KRS_ADD_COURSE_SUCCESS',
      'krs',
      successDetails,
      ip,
      userAgent,
      undefined,
      JSON.stringify(krs)
    );

    return krs;
  }

  async removeCourse(email: string, studentName: string, courseCode: string, ip: string, userAgent: string, actorId: string): Promise<AdminKrsItem> {
    const krs = await this.getKrsByEmail(email, studentName);

    if (krs.status !== 'Draft' && krs.status !== 'Revisi') {
      throw new HttpException(
        'KRS tidak dapat diubah karena status saat ini bukan Draft atau Revisi.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!krs.courses.includes(courseCode)) {
      throw new HttpException('Mata kuliah tidak ditemukan dalam KRS Anda.', HttpStatus.BAD_REQUEST);
    }

    krs.courses = krs.courses.filter((code) => code !== courseCode);
    krs.sksDiambil = this.calculateTotalSks(krs.courses);
    await this.krsRepository.update(krs.id, krs);

    const successDetails = `KRS-REMOVE: Course ${courseCode} removed successfully from student ${email}. Total SKS: ${krs.sksDiambil}`;
    this.securityService.logSecurityEvent('INFO', successDetails, ip);
    this.auditService.log(
      actorId,
      email,
      'KRS_REMOVE_COURSE_SUCCESS',
      'krs',
      successDetails,
      ip,
      userAgent,
      undefined,
      JSON.stringify(krs)
    );

    return krs;
  }

  async submitKrs(email: string, studentName: string, ip: string, userAgent: string, actorId: string): Promise<AdminKrsItem> {
    const krs = await this.getKrsByEmail(email, studentName);

    if (krs.status !== 'Draft' && krs.status !== 'Revisi') {
      throw new HttpException(
        'Hanya KRS dengan status Draft atau Revisi yang dapat diajukan.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (krs.courses.length === 0) {
      throw new HttpException('KRS tidak dapat diajukan karena kosong (0 SKS diambil).', HttpStatus.BAD_REQUEST);
    }

    krs.status = 'Diajukan';
    await this.krsRepository.update(krs.id, krs);

    const successDetails = `KRS-SUBMIT: Study plan submitted successfully by student ${email}. SKS taken: ${krs.sksDiambil}`;
    this.securityService.logSecurityEvent('INFO', successDetails, ip);
    this.auditService.log(
      actorId,
      email,
      'KRS_SUBMIT_SUCCESS',
      'krs',
      successDetails,
      ip,
      userAgent,
      undefined,
      JSON.stringify(krs)
    );

    return krs;
  }

  async getAllKrs(): Promise<AdminKrsItem[]> {
    return this.krsRepository.findAll();
  }

  async getAllKrsPaginated(
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
    search?: string,
    status?: string,
  ): Promise<PaginatedKrsResult> {
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(MAX_LIMIT, Math.max(1, limit));

    const result = await this.krsRepository.findPaginated(
      normalizedPage,
      normalizedLimit,
      search?.trim() || undefined,
      status?.trim() || undefined,
    );

    return {
      records: result.data,
      count: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async approveKrs(
    studentNim: string,
    approve: boolean,
    ip: string,
    userAgent: string,
    actorId: string,
    actorEmail: string,
  ): Promise<AdminKrsItem> {
    const krs = await this.krsRepository.findByStudentNim(studentNim);
    if (!krs) {
      throw new HttpException('KRS Mahasiswa tidak ditemukan.', HttpStatus.NOT_FOUND);
    }

    if (krs.status !== 'Diajukan') {
      throw new HttpException('Hanya KRS berstatus Diajukan yang dapat ditinjau.', HttpStatus.BAD_REQUEST);
    }

    krs.status = approve ? 'Disetujui' : 'Revisi';
    await this.krsRepository.update(krs.id, krs);

    const actionText = approve ? 'APPROVED' : 'REVISED';
    const auditAction = approve ? 'KRS_APPROVE_SUCCESS' : 'KRS_REVISION_REQUESTED';
    const successDetails = `KRS-${actionText}: Study plan for student NIM ${studentNim} reviewed by ${actorEmail}. Status updated to: ${krs.status}`;
    
    this.securityService.logSecurityEvent(approve ? 'INFO' : 'WARNING', successDetails, ip);
    this.auditService.log(
      actorId,
      actorEmail,
      auditAction,
      'krs',
      successDetails,
      ip,
      userAgent,
      undefined,
      JSON.stringify(krs)
    );

    return krs;
  }

  private calculateTotalSks(courses: string[]): number {
    return courses.reduce((acc, code) => {
      const course = this.availableCourses.find((c) => c.kode === code);
      return acc + (course ? course.sks : 0);
    }, 0);
  }
}
