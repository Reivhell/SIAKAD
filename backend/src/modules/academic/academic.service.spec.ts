import 'reflect-metadata';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { AuditModule } from '../audit/audit.module';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AcademicModule } from './academic.module';
import { AcademicService, familyOf, parseSchedule } from './academic.service';

const LECTURER = { id: 'u-dosen', email: 'budi.rahardjo@kampus.ac.id', role: 'lecturer', name: 'Dr. Budi Rahardjo, M.T.' };
const STUDENT = { id: 'u-mhs', email: 'ahmad.syafiq@mahasiswa.ac.id', role: 'student', name: 'Ahmad Syafiq' };
const ADMIN = { id: 'u-admin', email: 'admin@kampus.ac.id', role: 'admin', name: 'Hendra Wijaya, M.T.' };

describe('AcademicService', () => {
  let service: AcademicService;
  let prisma: PrismaService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PrismaModule, SecurityModule, AuditModule, UsersModule, AcademicModule],
    }).compile();
    service = moduleRef.get(AcademicService);
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await moduleRef.close();
  });

  it('memiliki helper dasar', () => {
    expect(familyOf('Dr. Budi Rahardjo, M.T.')).toBe('Dr. Budi Rahardjo');
    const s = parseSchedule('Senin, 08:00 - 10:30');
    expect(s.day).toBe('Senin');
    expect(s.start).toBe('08:00');
    expect(s.end).toBe('10:30');
  });

  it('menyajikan dashboard kaprodi dari RoleDashboard + KPI live', async () => {
    const data: any = await service.getRoleDashboard('kaprodi');
    expect(Array.isArray(data.classesApproval)).toBe(true);
    expect(data.classesApproval.length).toBeGreaterThanOrEqual(4);
    expect(Array.isArray(data.lecturers)).toBe(true);
    expect(Array.isArray(data.coursesBeban)).toBe(true);
    expect(Array.isArray(data.presensi)).toBe(true);
    expect(data.kpis.totalStudentsProdi).toBeGreaterThanOrEqual(6);
    expect(data.kpis.avgProdiGpa).toBeGreaterThan(0);
  });

  it('menyajikan dashboard dekan dengan KPI live', async () => {
    const data: any = await service.getRoleDashboard('dekan');
    expect(Array.isArray(data.bebanDosen)).toBe(true);
    expect(Array.isArray(data.kurikulumApproval)).toBe(true);
    expect(Array.isArray(data.financialMetrics)).toBe(true);
    expect(data.kpis.totalMahasiswa).toContain('Orang');
  });

  it('memperbarui status item persetujuan dan menyimpannya', async () => {
    const before: any = await service.getRoleDashboard('kaprodi');
    const pending = before.classesApproval.find((c: any) => c.status === 'Pending')!;
    await service.updateRoleDashboardItem('kaprodi', 'classesApproval', pending.id, 'Disetujui', ADMIN, '127.0.0.1', 'vitest');
    const after: any = await service.getRoleDashboard('kaprodi');
    const updated = after.classesApproval.find((c: any) => c.id === pending.id);
    expect(updated.status).toBe('Disetujui');
  });

  it('menyajikan overview dosen: profil, kelas, jadwal, siswa, materi, tugas, chat', async () => {
    const data: any = await service.getLecturerOverview(LECTURER);
    expect(data.profile.nidn).toBe('0412088201');
    expect(data.jadwal.length).toBe(2); // IF3110 + IF3170
    expect(data.kelas.length).toBe(2);
    expect(data.students.length).toBe(5);
    const first = data.students[0];
    expect(first.attendance).toHaveProperty('hadir');
    expect(first.attendance).toHaveProperty('alpha');
    expect(first.grades).toHaveProperty('final');
    expect(first.ipkHistory.length).toBeGreaterThanOrEqual(1);
    expect(data.materi.length).toBeGreaterThanOrEqual(1);
    expect(data.tugas.length).toBeGreaterThanOrEqual(1);
    expect(data.chats.length).toBeGreaterThanOrEqual(1);
  });

  it('membuat dan menghapus materi dosen', async () => {
    const created: any = await service.createMaterial(LECTURER, { courseCode: 'IF3110', title: 'Materi Uji', type: 'PDF' }, '127.0.0.1', 'vitest');
    expect(created.lecturerEmail).toBe(LECTURER.email);
    await service.deleteMaterial(created.id, LECTURER, '127.0.0.1', 'vitest');
    const gone = await prisma.courseMaterial.findUnique({ where: { id: created.id } });
    expect(gone).toBeNull();
  });

  it('membangun roster nilai satu kelas dan menyimpan nilai baru', async () => {
    const before: any = await service.getClassGrades('IF3110', LECTURER);
    expect(before.roster.length).toBe(5);
    const rows = before.roster.map((r: any) => ({ nim: r.nim, tugas: 95, kuis: 90, praktikum: 92, uts: 88, uas: 91 }));
    await service.saveClassGrades('IF3110', { grades: rows }, LECTURER, '127.0.0.1', 'vitest');
    const after: any = await service.getClassGrades('IF3110', LECTURER);
    for (const r of after.roster) {
      expect(r.final).toBeGreaterThan(90);
      expect(['A', 'AB']).toContain(r.gradeLetter);
    }
  });

  it('menolak akses nilai oleh dosen yang bukan pengampu', async () => {
    const stranger = { ...LECTURER, name: 'Dr. Indah Rahayu, M.T.' };
    await expect(service.getClassGrades('IF3110', stranger)).rejects.toThrow();
  });

  it('menyajikan overview mahasiswa: transkrip, jadwal, keuangan, pengumuman', async () => {
    const data: any = await service.getStudentOverview(STUDENT);
    expect(data.profile.nim).toBe('10118001');
    expect(data.transkrip.length).toBe(5);
    expect(data.transkrip[4].grades.length).toBe(5);
    expect(data.semesterGPAs.length).toBe(5);
    expect(data.todayClasses.length).toBeGreaterThanOrEqual(4);
    expect(data.availableKrsCourses.length).toBeGreaterThanOrEqual(5);
    expect(data.announcements.length).toBeGreaterThanOrEqual(2);
    expect(data.payments.length).toBe(3);
    expect(data.unpaidBill).toBe(7500000);
    expect(data.unduhan.length).toBeGreaterThanOrEqual(3);
  });

  it('menyajikan keuangan mahasiswa dan memproses pembayaran', async () => {
    const fin: any = await service.getMyFinance(STUDENT);
    expect(fin.unpaidTotal).toBe(7500000);
    const pending = fin.bills.find((b: any) => b.status === 'Belum Lunas');
    await service.payBill(pending.id, STUDENT, '127.0.0.1', 'vitest');
    const fin2: any = await service.getMyFinance(STUDENT);
    expect(fin2.unpaidTotal).toBe(0);
  });

  it('menyajikan overview admin untuk seluruh entitas master', async () => {
    const data: any = await service.getAdminOverview();
    expect(data.users.length).toBeGreaterThanOrEqual(16);
    expect(data.students.length).toBeGreaterThanOrEqual(7);
    expect(data.lecturers.length).toBeGreaterThanOrEqual(2);
    expect(data.prodis.length).toBeGreaterThanOrEqual(6);
    expect(data.rooms.length).toBeGreaterThanOrEqual(6);
    expect(data.academicYears.length).toBeGreaterThanOrEqual(5);
    expect(data.classes.length).toBeGreaterThanOrEqual(7);
    expect(data.schedules.length).toBe(data.classes.length);
    expect(data.krs.length).toBeGreaterThanOrEqual(7);
    expect(data.announcements.length).toBeGreaterThanOrEqual(3);
    expect(Array.isArray(data.activityLogs)).toBe(true);
    expect(data.billing.length).toBeGreaterThanOrEqual(8);
  });

  it('mengelola pengumuman, tanggal, dokumen, dan tiket', async () => {
    const ann: any = await service.createAnnouncement(ADMIN, { title: 'Pengumuman Uji', content: 'Isi pengumuman uji' }, '127.0.0.1', 'vitest');
    expect(ann.title).toBe('Pengumuman Uji');
    expect((await service.getAnnouncements()).length).toBeGreaterThanOrEqual(1);
    await service.deleteAnnouncement(ann.id, ADMIN, '127.0.0.1', 'vitest');

    expect((await service.getDates()).length).toBeGreaterThanOrEqual(4);
    expect((await service.getDocuments()).length).toBeGreaterThanOrEqual(4);

    const ticket: any = await service.createTicket(STUDENT, { subject: 'Uji tiket', message: 'Tidak bisa login' }, '127.0.0.1', 'vitest');
    expect(ticket.status).toBe('Terbuka');
    expect((await service.getMyTickets(STUDENT)).length).toBeGreaterThanOrEqual(1);
  });

  it('menolak pembuatan pengumuman tanpa judul', async () => {
    await expect(service.createAnnouncement(ADMIN, { content: 'tanpa judul' }, '127.0.0.1', 'vitest')).rejects.toBeInstanceOf(BadRequestException);
  });
});