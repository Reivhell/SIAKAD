import 'reflect-metadata';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { AuditModule } from '../audit/audit.module';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PresensiModule } from './presensi.module';
import { PresensiService, familyOf, todayISO, isValidDate } from './presensi.service';

const LECTURER = {
  id: 'u-dosen',
  email: 'budi.rahardjo@kampus.ac.id',
  role: 'lecturer',
  name: 'Dr. Budi Rahardjo, M.T.',
};

const STUDENT = {
  id: 'u-mhs',
  email: 'ahmad.syafiq@mahasiswa.ac.id',
  role: 'student',
  name: 'Ahmad Syafiq',
};

describe('PresensiService', () => {
  let service: PresensiService;
  let prisma: PrismaService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PrismaModule, SecurityModule, AuditModule, UsersModule, PresensiModule],
    }).compile();

    service = moduleRef.get(PresensiService);
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await moduleRef.close();
  });

  beforeEach(async () => {
    await prisma.attendanceRecord.deleteMany();
    await prisma.attendanceSession.deleteMany();
  });

  it('memiliki helper dasar yang benar', () => {
    expect(familyOf('Dr. Budi Rahardjo, M.T.')).toBe('Dr. Budi Rahardjo');
    expect(familyOf('Tim MPK')).toBe('Tim MPK');
    expect(isValidDate(todayISO())).toBe(true);
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('not-a-date')).toBe(false);
    expect(isValidDate('2026-13-01')).toBe(false);
  });

  it('mengembalikan kelas yang diampu dosen beserta status sesi hari ini', async () => {
    const classes = await service.getClasses(LECTURER);
    expect(classes.length).toBe(2); // IF3110 + IF3170 untuk Dr. Budi Rahardjo
    const codes = classes.map((c: any) => c.code).sort();
    expect(codes).toEqual(['IF3110', 'IF3170']);
    for (const c of classes) {
      expect(c.enrolledCount).toBe(5); // Ahmad + 4 mahasiswa baru
      expect(c.today.hasOpenSession).toBe(false);
      expect(c.sessionCount).toBe(0);
    }
  });

  it('membuka sesi presensi dengan roster dari KRS mahasiswa terdaftar', async () => {
    const session = await service.openSession(LECTURER, { courseCode: 'IF3110' }, '127.0.0.1', 'vitest');
    expect(session.meetingNumber).toBe(1);
    expect(session.status).toBe('open');
    expect(session.rosterSize).toBe(5);
    expect(session.courseName).toBe('Pengembangan Aplikasi Web');

    const detail = await service.getSessionDetail(session.id, LECTURER) as any;
    expect(detail.rosterSize).toBe(5);
    expect(detail.roster.every((r: any) => r.status === 'Belum Presensi')).toBe(true);
    expect(detail.stats.total).toBe(5);
    expect(detail.stats.belum).toBe(5);
  });

  it('menolak membuka sesi ganda pada tanggal yang sama', async () => {
    await service.openSession(LECTURER, { courseCode: 'IF3110', meetingNumber: 1 }, '127.0.0.1', 'vitest');
    await expect(
      service.openSession(LECTURER, { courseCode: 'IF3110', meetingNumber: 2 }, '127.0.0.1', 'vitest'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('menolak dosen lain membuka sesi untuk kelas yang bukan miliknya', async () => {
    const otherLecturer = { ...LECTURER, email: 'sri.hartati@kampus.ac.id', name: 'Dra. Sri Hartati, M.Sc.' };
    await expect(
      service.openSession(otherLecturer, { courseCode: 'IF3140' }, '127.0.0.1', 'vitest'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('menyimpan rekaman presensi secara bulk dan menghitung statistik', async () => {
    const session = await service.openSession(LECTURER, { courseCode: 'IF3110' }, '127.0.0.1', 'vitest');
    const roster = ((await service.getSessionDetail(session.id, LECTURER)) as any).roster;

    const result = await service.saveRecords(
      session.id,
      LECTURER,
      {
        records: roster.slice(0, 4).map((r: any, i: number) => ({
          studentNim: r.nim,
          status: i === 3 ? 'Izin' : 'Hadir',
          notes: i === 3 ? 'Ada keperluan keluarga' : null,
        })),
      },
      '127.0.0.1',
      'vitest',
    );

    expect(result.saved).toBe(4);
    const detail = (await service.getSessionDetail(session.id, LECTURER)) as any;
    expect(detail.stats.hadir).toBe(3);
    expect(detail.stats.izin).toBe(1);
    expect(detail.stats.belum).toBe(1);
    const izinStudent = detail.roster.find((r: any) => r.status === 'Izin');
    expect(izinStudent.notes).toBe('Ada keperluan keluarga');
  });

  it('menolak status presensi yang tidak dikenal dan NIM di luar roster', async () => {
    const session = await service.openSession(LECTURER, { courseCode: 'IF3110' }, '127.0.0.1', 'vitest');

    await expect(
      service.saveRecords(session.id, LECTURER, { records: [{ studentNim: '10118001', status: 'Mangkir' }] }, '127.0.0.1', 'vitest'),
    ).rejects.toBeInstanceOf(HttpException);

    await expect(
      service.saveRecords(session.id, LECTURER, { records: [{ studentNim: '99999999', status: 'Hadir' }] }, '127.0.0.1', 'vitest'),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('menutup sesi dan mengunci perubahan setelahnya', async () => {
    const session = await service.openSession(LECTURER, { courseCode: 'IF3110' }, '127.0.0.1', 'vitest');
    const closed = await service.closeSession(session.id, LECTURER, '127.0.0.1', 'vitest');
    expect(closed.status).toBe('closed');

    await expect(
      service.saveRecords(session.id, LECTURER, { records: [{ studentNim: '10118001', status: 'Hadir' }] }, '127.0.0.1', 'vitest'),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('menyusun riwayat sesi (history) dan rekap per mahasiswa (rekap)', async () => {
    const yesterday = (() => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - 1);
      return d.toISOString().slice(0, 10);
    })();
    const s1 = await service.openSession(LECTURER, { courseCode: 'IF3110', meetingNumber: 1, date: yesterday }, '127.0.0.1', 'vitest');
    await service.saveRecords(
      s1.id,
      LECTURER,
      { records: [{ studentNim: '10118001', status: 'Hadir' }, { studentNim: '10118004', status: 'Alpha' }] },
      '127.0.0.1',
      'vitest',
    );
    await service.closeSession(s1.id, LECTURER, '127.0.0.1', 'vitest');

    const s2 = await service.openSession(LECTURER, { courseCode: 'IF3110', meetingNumber: 2 }, '127.0.0.1', 'vitest');
    await service.saveRecords(
      s2.id,
      LECTURER,
      { records: [{ studentNim: '10118001', status: 'Hadir' }, { studentNim: '10118004', status: 'Hadir' }] },
      '127.0.0.1',
      'vitest',
    );

    const history = await service.getClassHistory('IF3110', LECTURER);
    expect(history.sessions.length).toBe(2);
    expect(history.sessions[0].meetingNumber).toBe(2);

    const rekap = await service.getClassRekap('IF3110', LECTURER);
    const ahmad = rekap.students.find((s: any) => s.nim === '10118001');
    const budi = rekap.students.find((s: any) => s.nim === '10118004');
    expect(ahmad.total).toBe(2);
    expect(ahmad.hadir).toBe(2);
    expect(ahmad.percentage).toBe(100);
    expect(budi.alpha).toBe(1);
    expect(budi.percentage).toBe(50);
  });

  it('memberikan riwayat presensi milik mahasiswa yang bersangkutan', async () => {
    const session = await service.openSession(LECTURER, { courseCode: 'IF3110' }, '127.0.0.1', 'vitest');
    await service.saveRecords(
      session.id,
      LECTURER,
      { records: [{ studentNim: '10118001', status: 'Hadir' }, { studentNim: '10118004', status: 'Alpha' }] },
      '127.0.0.1',
      'vitest',
    );

    const mine = await service.getMyAttendance(STUDENT) as any;
    expect(mine.nim).toBe('10118001');
    expect(mine.courses.length).toBeGreaterThanOrEqual(1);
    const if3110 = mine.courses.find((c: any) => c.code === 'IF3110');
    expect(if3110.attendance).toBe(1);
    expect(if3110.total).toBe(1);
    expect(if3110.percentage).toBe(100);
    expect(mine.records.length).toBe(1);
  });

  it('memberikan ringkasan kehadiran lintas kelas untuk pihak institusi', async () => {
    const session = await service.openSession(LECTURER, { courseCode: 'IF3110' }, '127.0.0.1', 'vitest');
    await service.saveRecords(
      session.id,
      LECTURER,
      { records: [{ studentNim: '10118001', status: 'Hadir' }, { studentNim: '10118004', status: 'Alpha' }] },
      '127.0.0.1',
      'vitest',
    );

    const summary = await service.getSummary();
    expect(summary.totals.sessions).toBe(1);
    expect(summary.totals.records).toBe(2);
    const course = summary.courses.find((c: any) => c.code === 'IF3110');
    expect(course.attendanceRate).toBe(50);
    expect(summary.recent.length).toBe(1);
  });
});