import { Injectable, Inject, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { AuditService } from '../audit/audit.service';

/** Kecocokan nama dosen dgn kolom lecturer CourseOffering memakai nama keluarga
 *  (sama seperti modul presensi): "Dr. Budi Rahardjo, M.T." → "Dr. Budi Rahardjo". */
export function familyOf(name: string): string {
  return name.split(',')[0].trim();
}

export interface AcademicActor {
  id: string;
  email: string;
  role: string;
  name: string;
}

const SEMESTER_LABELS: Record<number, string> = {
  1: 'Ganjil 2021/2022',
  2: 'Genap 2021/2022',
  3: 'Ganjil 2022/2023',
  4: 'Genap 2022/2023',
  5: 'Ganjil 2023/2024',
  6: 'Genap 2023/2024',
  7: 'Ganjil 2024/2025',
  8: 'Genap 2024/2025',
};

/** Parsing jadwal kuliah seperti "Senin, 08:00 - 10:30" menjadi {day, start, end}. */
export function parseSchedule(schedule: string): { day: string; start: string; end: string } {
  const comma = schedule.indexOf(',');
  if (comma < 0) return { day: 'Senin', start: schedule, end: schedule };
  const day = schedule.slice(0, comma).trim();
  const time = schedule.slice(comma + 1).trim();
  const m = time.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
  return { day, start: m ? m[1] : time, end: m ? m[2] : time };
}

function scoreToPoint(score: number): number {
  if (score >= 88) return 4.0;
  if (score >= 80) return 3.5;
  if (score >= 70) return 3.0;
  if (score >= 60) return 2.0;
  return 1.0;
}

function gradeLetterOf(score: number): string {
  if (score >= 88) return 'A';
  if (score >= 80) return 'AB';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

function safeJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const ADMIN_ROLES = ['admin', 'baak', 'bauk', 'kaprodi', 'dekan'];

@Injectable()
export class AcademicService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(SecurityService) private readonly securityService: SecurityService,
    @Inject(AuditService) private readonly auditService: AuditService,
  ) {}

  private async audit(actor: AcademicActor, action: string, resource: string, ip: string, userAgent: string, details?: string) {
    await this.auditService.log(actor.id, actor.email, action, resource, details ?? '', ip, userAgent);
  }

  // ── Role dashboard (Kaprodi/Dekan/BAAK/BAUK/Alumni/Applicant) ─────
  async getRoleDashboard(role: string) {
    const row = await this.prisma.roleDashboard.findUnique({ where: { role } });
    if (!row) return {};
    const data = safeJson<Record<string, unknown>>(row.dataJson, {});

    // Nilai KPI kaprodi dihitung live dari basis data.
    if (role === 'kaprodi') {
      const students = await this.prisma.user.count({ where: { role: 'student' } });
      const lecturers = await this.prisma.user.count({ where: { role: 'lecturer' } });
      const avgGpa = await this.prisma.gradeRecord.findMany({ select: { final: true } });
      const avg = avgGpa.length ? avgGpa.reduce((a, g) => a + g.final, 0) / avgGpa.length : 0;
      data['kpis'] = {
        totalStudentsProdi: students,
        totalLecturers: lecturers,
        avgProdiGpa: Math.round((avg / 25) * 100) / 100,
      };
    }
    if (role === 'dekan') {
      const students = await this.prisma.user.count({ where: { role: 'student' } });
      const lecturers = await this.prisma.user.count({ where: { role: 'lecturer' } });
      const bills = await this.prisma.financeBill.findMany();
      const total = bills.reduce((a, b) => a + b.amount, 0);
      const paid = bills.reduce((a, b) => a + b.paidAmount, 0);
      data['kpis'] = {
        totalMahasiswa: `${students.toLocaleString('id-ID')} Orang`,
        totalDosen: `${lecturers} Dosen`,
        rataIpk: `${(avgOf(await this.prisma.gradeRecord.findMany({ select: { final: true } }), 'final') / 25).toFixed(2)} / 4.00`,
        targetUkt: `Rp ${(total / 1_000_000_000).toFixed(1)} Milyar`,
        uktSub: `Sudah lunas: ${total ? Math.round((paid / total) * 100) : 0}%`,
      };
    }
    return data;
  }

  async updateRoleDashboardItem(role: string, collection: string, id: string, status: string, actor: AcademicActor, ip: string, userAgent: string) {
    const row = await this.prisma.roleDashboard.findUnique({ where: { role } });
    if (!row) throw new NotFoundException(`Dashboard peran "${role}" tidak ditemukan.`);
    const data = safeJson<Record<string, any>>(row.dataJson, {});
    const list = data[collection];
    if (!Array.isArray(list)) throw new BadRequestException(`Koleksi "${collection}" bukan daftar.`);
    const item = list.find((x: any) => x && x.id === id);
    if (!item) throw new NotFoundException(`Item "${id}" tidak ditemukan di "${collection}".`);
    item.status = status;
    await this.prisma.roleDashboard.update({
      where: { role },
      data: { dataJson: JSON.stringify(data), updatedAt: new Date().toISOString() },
    });
    await this.audit(actor, `UPDATE ${role}.${collection} ${id} → ${status}`, `role-dashboard:${role}`, ip, userAgent);
    return data;
  }

  // ── Pengumuman & tanggal akademik ─────────────────────────────────
  async getAnnouncements(target?: string) {
    const where = target ? { target } : {};
    return this.prisma.announcement.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createAnnouncement(actor: AcademicActor, body: any, ip: string, userAgent: string) {
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    if (!title || !content) throw new BadRequestException('Judul dan isi pengumuman wajib diisi.');
    const ann = await this.prisma.announcement.create({
      data: {
        title,
        content,
        target: body.target || 'Semua',
        date: body.date || new Date().toISOString().slice(0, 10),
        author: body.author || actor.name || actor.email,
        createdAt: new Date().toISOString(),
      },
    });
    await this.audit(actor, `CREATE announcement "${title}"`, 'announcement', ip, userAgent);
    return ann;
  }

  async updateAnnouncement(id: string, body: any, actor: AcademicActor, ip: string, userAgent: string) {
    const exists = await this.prisma.announcement.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Pengumuman tidak ditemukan.');
    const ann = await this.prisma.announcement.update({ where: { id }, data: body });
    await this.audit(actor, `UPDATE announcement "${ann.title}"`, 'announcement', ip, userAgent);
    return ann;
  }

  async deleteAnnouncement(id: string, actor: AcademicActor, ip: string, userAgent: string) {
    const exists = await this.prisma.announcement.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Pengumuman tidak ditemukan.');
    await this.prisma.announcement.delete({ where: { id } });
    await this.audit(actor, `DELETE announcement "${exists.title}"`, 'announcement', ip, userAgent);
    return { id };
  }

  async getDates() {
    return this.prisma.academicDate.findMany({ orderBy: { date: 'asc' } });
  }

  // ── Master admin ──────────────────────────────────────────────────
  async getAdminOverview() {
    const [users, prodis, rooms, years, courses, krs, announcements, audits, bills, lecturerProfiles] = await Promise.all([
      this.prisma.user.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.prodi.findMany({ orderBy: { kode: 'asc' } }),
      this.prisma.room.findMany({ orderBy: { kode: 'asc' } }),
      this.prisma.academicPeriod.findMany({ orderBy: { code: 'asc' } }),
      this.prisma.courseOffering.findMany({ orderBy: { code: 'asc' } }),
      this.prisma.krsItem.findMany({ orderBy: { studentNim: 'asc' } }),
      this.prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.auditRecord.findMany({ orderBy: { timestamp: 'desc' }, take: 30 }),
      this.prisma.financeBill.findMany({ orderBy: { studentNim: 'asc' } }),
      this.prisma.lecturerProfile.findMany(),
    ]);

    const profileByUser = new Map(lecturerProfiles.map((p) => [p.userId, p]));
    const roleMap: Record<string, string> = { student: 'mahasiswa', lecturer: 'dosen', admin: 'admin', kaprodi: 'kaprodi', dekan: 'dekan', baak: 'akademik', bauk: 'akademik', alumni: 'mahasiswa', applicant: 'mahasiswa' };

    const students = users
      .filter((u) => u.role === 'student')
      .map((u) => {
        const krsRow = krs.find((k) => k.studentEmail === u.email);
        return {
          id: u.id,
          nim: krsRow?.studentNim ?? u.email.split('@')[0].replace(/\./g, ''),
          name: u.name,
          prodi: krsRow?.prodi ?? u.department ?? 'Teknik Informatika',
          angkatan: String(new Date().getFullYear() - 5),
          status: u.isActive ? 'Aktif' : 'Drop Out',
          gpa: 3.5,
          email: u.email,
          phone: u.phone ?? '-',
        };
      });

    const lecturers = users
      .filter((u) => u.role === 'lecturer')
      .map((u) => {
        const p = profileByUser.get(u.id);
        const jabatan = (p?.jabatan as any) ?? 'Lektor';
        return {
          id: u.id,
          nidn: p?.nidn ?? '0000000000',
          name: u.name,
          jabatan,
          prodi: p?.prodi ?? u.department ?? 'Teknik Informatika',
          status: u.isActive ? 'Aktif' : 'Non-Aktif',
          email: u.email,
          phone: u.phone ?? '-',
        };
      });

    const classes = await Promise.all(
      courses.map(async (c) => {
        const enrolled = krs.filter((k) => safeJson<string[]>(k.coursesJson, []).includes(c.code)).length;
        return {
          id: c.code,
          kodeMK: c.code,
          namaMK: c.name,
          kelas: `${c.code}-A`,
          sks: c.sks,
          dosenId: c.lecturer,
          dosenName: c.lecturer,
          kapasitas: 50,
          pesertaCount: enrolled,
        };
      }),
    );

    const schedules = courses.map((c) => {
      const { day, start, end } = parseSchedule(c.schedule);
      return { id: c.code, classId: `${c.code}-A`, hari: day as any, jamMulai: start, jamSelesai: end, ruangId: c.room };
    });

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: roleMap[u.role] ?? u.role,
        status: u.isActive ? 'Aktif' : 'Non-Aktif',
        phone: u.phone ?? '-',
        department: u.department ?? '-',
      })),
      students,
      lecturers,
      prodis: prodis.map((p) => ({ id: p.id, kode: p.kode, nama: p.nama, jenjang: p.jenjang, akreditasi: p.akreditasi })),
      courses: courses.map((c) => ({ id: c.id, kode: c.code, nama: c.name, sks: c.sks, semester: 5, prodi: c.program, type: 'Wajib' as const })),
      rooms: rooms.map((r) => ({ id: r.id, kode: r.kode, nama: r.nama, kapasitas: r.kapasitas, lokasi: r.lokasi, status: r.status })),
      academicYears: years.map((y) => {
        const [, sem] = y.code.split('-');
        return { id: y.id, tahunAjaran: y.code.split('-')[0], semester: (sem ?? 'Ganjil') as any, isAktif: y.isActive, isKrsBuka: y.isKrsOpen };
      }),
      classes,
      schedules,
      krs: krs.map((k) => ({ id: k.id, studentNim: k.studentNim, studentName: k.studentName, prodi: k.prodi, sksDiambil: k.sksDiambil, status: k.status, courses: safeJson<string[]>(k.coursesJson, []) })),
      announcements: announcements.map((a) => ({ id: a.id, title: a.title, content: a.content, target: a.target, date: a.date, author: a.author })),
      activityLogs: audits.map((a) => ({ id: a.id, user: a.email, role: '', action: a.action, ip: a.ip, time: a.timestamp })),
      billing: bills.map((b) => ({ id: b.id, studentNim: b.studentNim, amount: b.amount - b.paidAmount, description: b.description, status: b.paidAmount >= b.amount ? 'Lunas' : 'Belum Lunas' })),
    };
  }

  // ── Dosen: overview + workspace ───────────────────────────────────
  async getLecturerOverview(actor: AcademicActor) {
    const identity = familyOf(actor.name);
    const offerings = await this.prisma.courseOffering.findMany({
      where: { lecturer: { contains: identity } },
      orderBy: { code: 'asc' },
    });
    const codes = offerings.map((c) => c.code);
    const [profileRow, user, sessions, materials, assignments, thesis, chats, consults, grades, krsRows] = await Promise.all([
      this.prisma.lecturerProfile.findUnique({ where: { userId: actor.id } }),
      this.prisma.user.findUnique({ where: { id: actor.id } }),
      codes.length ? this.prisma.attendanceSession.findMany({ where: { courseCode: { in: codes } }, orderBy: { date: 'desc' } }) : Promise.resolve([]),
      this.prisma.courseMaterial.findMany({ where: { lecturerEmail: actor.email }, orderBy: { uploadedAt: 'desc' } }),
      this.prisma.assignment.findMany({ where: { lecturerEmail: actor.email }, orderBy: { createdAt: 'desc' } }),
      this.prisma.thesis.findMany({ where: { supervisorEmail: actor.email }, orderBy: { progressPercentage: 'desc' } }),
      this.prisma.chatMessage.findMany({ where: { threadKey: { contains: actor.email } }, orderBy: { createdAt: 'asc' } }),
      this.prisma.consultationLog.findMany({ where: { advisorEmail: actor.email }, orderBy: { date: 'desc' } }),
      this.prisma.gradeRecord.findMany({ where: { semester: 5 } }),
      this.prisma.krsItem.findMany(),
    ]);

    const profile = profileRow
      ? {
          name: user?.name ?? actor.name,
          nidn: profileRow.nidn,
          jabatan: profileRow.jabatan,
          prodi: profileRow.prodi,
          email: actor.email,
          phone: profileRow.phone,
          address: profileRow.address,
          foto: '',
          riwayatPendidikan: safeJson<Array<{ jenjang: string; institusi: string; prodi: string; tahun: string }>>(profileRow.riwayatJson, []),
        }
      : { name: actor.name, nidn: '-', jabatan: '-', prodi: '-', email: actor.email, phone: '-', address: '-', foto: '', riwayatPendidikan: [] };

    const jadwal = offerings.map((c) => {
      const { day, start, end } = parseSchedule(c.schedule);
      const enrolled = krsRows.filter((k) => safeJson<string[]>(k.coursesJson, []).includes(c.code)).length;
      return {
        id: c.code,
        code: c.code,
        name: c.name,
        class: `${c.code}-A`,
        room: c.room,
        day,
        time: `${start} - ${end}`,
        semester: 'Ganjil 2025/2026',
        sks: c.sks,
        mahasiswaCount: enrolled,
      };
    });

    const kelas = offerings.map((c) => {
      const enrolled = krsRows.filter((k) => safeJson<string[]>(k.coursesJson, []).includes(c.code)).length;
      return { id: c.code, code: c.code, name: c.name, class: `${c.code}-A`, sks: c.sks, capacity: 50, enrolled };
    });

    const sessionRecords = sessions.length ? await this.prisma.attendanceRecord.findMany({ where: { sessionId: { in: sessions.map((s) => s.id) } } }) : [];
    const recordsByNim = new Map<string, typeof sessionRecords>();
    for (const r of sessionRecords) {
      const arr = recordsByNim.get(r.studentNim) ?? [];
      arr.push(r);
      recordsByNim.set(r.studentNim, arr);
    }

    const students = krsRows
      .filter((k) => k.coursesJson && codes.some((c) => k.coursesJson.includes(c)))
      .map((k) => {
        const recs = recordsByNim.get(k.studentNim) ?? [];
        const attendance = {
          hadir: recs.filter((r) => r.status === 'Hadir').length,
          sakit: recs.filter((r) => r.status === 'Sakit').length,
          izin: recs.filter((r) => r.status === 'Izin').length,
          alpha: recs.filter((r) => r.status === 'Alpha').length,
          total: recs.length,
        };
        const myGrades = grades.filter((g) => g.studentNim === k.studentNim);
        const sem5 = myGrades.filter((g) => g.semester === 5);
        const avg = myGrades.length ? myGrades.reduce((a, g) => a + g.final, 0) / myGrades.length : 0;
        const coursesTaken = safeJson<string[]>(k.coursesJson, []).map((code) => {
          const c = offerings.find((o) => o.code === code);
          return { code, name: c?.name ?? code, sks: c?.sks ?? 0 };
        });
        return {
          nim: k.studentNim,
          name: k.studentName,
          attendance,
          grades: sem5[0]
            ? { tugas: sem5[0].tugas, kuis: sem5[0].kuis, praktikum: sem5[0].praktikum, uts: sem5[0].uts, uas: sem5[0].uas, final: sem5[0].final, gradeLetter: sem5[0].gradeLetter }
            : { tugas: 0, kuis: 0, praktikum: 0, uts: 0, uas: 0, final: 0, gradeLetter: '-' },
          krs: {
            courses: coursesTaken,
            status: (k.status === 'Disetujui' ? 'Approved' : k.status === 'Diajukan' ? 'Pending' : 'Revised') as any,
          },
          ipkHistory: groupIpk(myGrades),
          consultations: consults.filter((c) => c.studentNim === k.studentNim).map((c) => ({ date: c.date, topic: c.topic, notes: c.notes })),
          gpa: Math.round((avg / 25) * 100) / 100,
        };
      });

    const jurnal = sessions
      .filter((s) => !s.closedAt)
      .map((s) => ({
        pertemuan: s.meetingNumber,
        date: s.date,
        materi: s.topic || `Pertemuan ${s.meetingNumber}`,
        pokokBahasan: s.topic || `Pertemuan ${s.meetingNumber}`,
        subPokokBahasan: '-',
        catatan: '-',
        status: 'Selesai' as const,
        fileCount: 0,
      }));

    const tugas = assignments.map((a) => ({
      id: a.id,
      classId: a.classLabel,
      title: a.title,
      description: a.description,
      deadline: a.deadline,
      submissionsCount: 0,
      attachments: [],
    }));

    const materi = materials.map((m) => ({
      id: m.id,
      classId: `${m.courseCode}-A`,
      title: m.title,
      type: m.type as any,
      fileName: m.fileName,
      fileSize: m.fileSize,
      uploadedAt: m.uploadedAt,
    }));

    const skripsi = thesis
      .sort((a, b) => b.progressPercentage - a.progressPercentage)
      .map((t) => ({
        id: t.id,
        nim: t.studentNim,
        name: t.studentName,
        title: t.title,
        progressPercentage: t.progressPercentage,
        status: t.status as any,
        logs: safeJson<Array<{ date: string; note: string; approval: boolean }>>(t.logsJson, []),
        seminar: t.seminarDate ? { type: t.seminarType ?? 'Kolokium', date: t.seminarDate, room: t.seminarRoom ?? '-', time: t.seminarTime ?? '-' } : undefined,
      }));

    const chatList = chats.map((m) => ({
      id: m.id,
      sender: (m.senderRole === 'lecturer' ? 'lecturer' : 'student') as any,
      senderEmail: m.senderEmail,
      senderName: m.senderName,
      text: m.text,
      timestamp: m.createdAt,
    }));

    return { profile, jadwal, kelas, students, jurnal, tugas, materi, skripsi, chats: chatList, konsultasi: consults };
  }

  async createMaterial(actor: AcademicActor, body: any, ip: string, userAgent: string) {
    if (!body.courseCode || !body.title) throw new BadRequestException('Kode mata kuliah dan judul materi wajib diisi.');
    const m = await this.prisma.courseMaterial.create({
      data: {
        courseCode: body.courseCode,
        title: body.title,
        type: body.type || 'PDF',
        fileName: body.fileName || `${body.courseCode}_${body.title}.pdf`,
        fileSize: body.fileSize || '1 MB',
        uploadedAt: body.uploadedAt || new Date().toISOString().slice(0, 10),
        lecturerEmail: actor.email,
      },
    });
    await this.audit(actor, `CREATE materi "${m.title}"`, 'course-material', ip, userAgent);
    return m;
  }

  async deleteMaterial(id: string, actor: AcademicActor, ip: string, userAgent: string) {
    const exists = await this.prisma.courseMaterial.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Materi tidak ditemukan.');
    await this.prisma.courseMaterial.delete({ where: { id } });
    await this.audit(actor, `DELETE materi "${exists.title}"`, 'course-material', ip, userAgent);
    return { id };
  }

  async createAssignment(actor: AcademicActor, body: any, ip: string, userAgent: string) {
    if (!body.courseCode || !body.title || !body.deadline) throw new BadRequestException('Kode MK, judul, dan tenggat tugas wajib diisi.');
    const a = await this.prisma.assignment.create({
      data: {
        courseCode: body.courseCode,
        classLabel: body.classLabel || `${body.courseCode}-A`,
        title: body.title,
        description: body.description || '',
        deadline: body.deadline,
        lecturerEmail: actor.email,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    });
    await this.audit(actor, `CREATE tugas "${a.title}"`, 'assignment', ip, userAgent);
    return a;
  }

  async deleteAssignment(id: string, actor: AcademicActor, ip: string, userAgent: string) {
    const exists = await this.prisma.assignment.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Tugas tidak ditemukan.');
    await this.prisma.assignment.delete({ where: { id } });
    await this.audit(actor, `DELETE tugas "${exists.title}"`, 'assignment', ip, userAgent);
    return { id };
  }

  async getClassGrades(code: string, actor: AcademicActor) {
    const offering = await this.prisma.courseOffering.findFirst({ where: { code } });
    if (!offering) throw new NotFoundException('Mata kuliah tidak ditemukan.');
    const identity = familyOf(actor.name);
    if (!offering.lecturer.includes(identity)) throw new ForbiddenException('Anda bukan pengampu mata kuliah ini.');
    const krsRows2 = await this.prisma.krsItem.findMany();
    const grades = await this.prisma.gradeRecord.findMany({ where: { courseCode: code, semester: 5 } });
    const roster = krsRows2
      .filter((k) => safeJson<string[]>(k.coursesJson, []).includes(code))
      .map((k) => {
        const g = grades.find((x) => x.studentNim === k.studentNim);
        return {
          nim: k.studentNim,
          name: k.studentName,
          tugas: g?.tugas ?? null,
          kuis: g?.kuis ?? null,
          praktikum: g?.praktikum ?? null,
          uts: g?.uts ?? null,
          uas: g?.uas ?? null,
          final: g?.final ?? null,
          gradeLetter: g?.gradeLetter ?? '-',
        };
      });
    return { course: { code: offering.code, name: offering.name, sks: offering.sks }, roster };
  }

  async saveClassGrades(code: string, body: any, actor: AcademicActor, ip: string, userAgent: string) {
    const offering = await this.prisma.courseOffering.findFirst({ where: { code } });
    if (!offering) throw new NotFoundException('Mata kuliah tidak ditemukan.');
    const identity = familyOf(actor.name);
    if (!offering.lecturer.includes(identity)) throw new ForbiddenException('Anda bukan pengampu mata kuliah ini.');
    const rows2: Array<{ nim: string; tugas: number; kuis: number; praktikum: number; uts: number; uas: number }> = Array.isArray(body.grades) ? body.grades : [];
    if (!rows2.length) throw new BadRequestException('Tidak ada nilai yang dikirim.');

    for (const r of rows2) {
      if (!r.nim) continue;
      const tugas = Number(r.tugas) || 0;
      const kuis = Number(r.kuis) || 0;
      const praktikum = Number(r.praktikum) || 0;
      const uts = Number(r.uts) || 0;
      const uas = Number(r.uas) || 0;
      const final = Math.round(((tugas + kuis + praktikum + uts + uas) / 5) * 100) / 100;
      const krs = await this.prisma.krsItem.findUnique({ where: { studentNim: r.nim } });
      await this.prisma.gradeRecord.upsert({
        where: { studentNim_courseCode_semester: { studentNim: r.nim, courseCode: code, semester: 5 } },
        create: {
          studentNim: r.nim,
          studentName: krs?.studentName ?? r.nim,
          courseCode: code,
          courseName: offering.name,
          semester: 5,
          tugas,
          kuis,
          praktikum,
          uts,
          uas,
          final,
          gradeLetter: gradeLetterOf(final),
          updatedBy: actor.email,
          updatedAt: new Date().toISOString(),
        },
        update: { tugas, kuis, praktikum, uts, uas, final, gradeLetter: gradeLetterOf(final), updatedBy: actor.email, updatedAt: new Date().toISOString() },
      });
    }
    await this.audit(actor, `SAVE nilai ${code} (${rows2.length} mahasiswa)`, 'grade', ip, userAgent);
    return { updated: rows2.length };
  }

  async getThesis(actor: AcademicActor) {
    if (actor.role === 'lecturer') {
      const rows = await this.prisma.thesis.findMany({ where: { supervisorEmail: actor.email }, orderBy: { progressPercentage: 'desc' } });
      return rows.map((t) => mapThesis(t));
    }
    const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
    if (!krs) return [];
    const rows = await this.prisma.thesis.findMany({ where: { studentNim: krs.studentNim } });
    return rows.map((t) => mapThesis(t));
  }

  // ── Tugas (Assignment) terpusat ───────────────────────────────────
  async getAssignments(actor: AcademicActor) {
    if (actor.role === 'lecturer') {
      return this.prisma.assignment.findMany({ where: { lecturerEmail: actor.email }, orderBy: { createdAt: 'desc' } });
    }
    if (actor.role === 'student') {
      const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
      const codes = krs ? safeJson<string[]>(krs.coursesJson, []) : [];
      return this.prisma.assignment.findMany({ where: { courseCode: { in: codes } }, orderBy: { createdAt: 'desc' } });
    }
    return this.prisma.assignment.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // ── Evaluasi Dosen oleh Mahasiswa (EDOM) ──────────────────────────
  async getEdom(actor: AcademicActor) {
    if (actor.role === 'lecturer') {
      const rows = await this.prisma.edomEvaluation.findMany({ where: { lecturerEmail: actor.email }, orderBy: { createdAt: 'desc' } });
      return { role: 'lecturer', evaluations: rows };
    }
    if (actor.role === 'student') {
      const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
      const nim = krs?.studentNim ?? actor.email.split('@')[0].replace(/\./g, '').toUpperCase();
      const [offerings, rows] = await Promise.all([
        this.prisma.courseOffering.findMany({ orderBy: { code: 'asc' } }),
        this.prisma.edomEvaluation.findMany({ where: { studentNim: nim }, orderBy: { createdAt: 'desc' } }),
      ]);
      const codes = krs ? safeJson<string[]>(krs.coursesJson, []) : [];
      const courses = offerings
        .filter((o) => codes.includes(o.code))
        .map((o) => ({
          code: o.code,
          name: o.name,
          lecturer: o.lecturer, // nama lengkap dosen pengampu
          evaluated: rows.some((r) => r.courseCode === o.code),
        }));
      return { role: 'student', courses, evaluations: rows };
    }
    // Pimpinan & admin: agregat per dosen dari seluruh evaluasi.
    const rows = await this.prisma.edomEvaluation.findMany({ orderBy: { createdAt: 'desc' } });
    return { role: 'leadership', evaluations: rows };
  }

  async submitEdom(actor: AcademicActor, body: any, ip: string, userAgent: string) {
    if (actor.role !== 'student') throw new ForbiddenException('Hanya mahasiswa yang dapat mengisi EDOM.');
    if (!body.courseCode || !body.courseName || !body.lecturerName) throw new BadRequestException('Matakuliah dan dosen wajib diisi.');
    const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
    const nim = krs?.studentNim ?? actor.email.split('@')[0].replace(/\./g, '').toUpperCase();
    const semester = '2025/2026-Genap';
    const existing = await this.prisma.edomEvaluation.findUnique({ where: { studentNim_courseCode_semester: { studentNim: nim, courseCode: body.courseCode, semester } } });
    if (existing) throw new BadRequestException(`Anda sudah mengisi EDOM untuk ${body.courseName} pada semester ${semester}.`);
    const clamp = (v: number) => Math.max(1, Math.min(5, Math.round(Number(v) || 0)));
    const row = await this.prisma.edomEvaluation.create({
      data: {
        studentNim: nim,
        studentName: actor.name,
        courseCode: body.courseCode,
        courseName: body.courseName,
        lecturerEmail: body.lecturerEmail || '',
        lecturerName: body.lecturerName,
        semester,
        pedagogik: clamp(body.pedagogik),
        profesional: clamp(body.profesional),
        kepribadian: clamp(body.kepribadian),
        sosial: clamp(body.sosial),
        comment: body.comment || '',
        createdAt: new Date().toISOString().slice(0, 10),
      },
    });
    await this.audit(actor, `SUBMIT EDOM ${body.courseName} untuk ${body.lecturerName}`, 'edom', ip, userAgent);
    return row;
  }

  async getMessages(withEmail: string, actor: AcademicActor) {
    const pair = [actor.email.toLowerCase(), withEmail.toLowerCase()].sort().join(':');
    const rows = await this.prisma.chatMessage.findMany({ where: { threadKey: pair }, orderBy: { createdAt: 'asc' } });
    return rows.map((m) => ({
      id: m.id,
      sender: (m.senderRole === 'lecturer' ? 'lecturer' : 'student') as any,
      senderEmail: m.senderEmail,
      senderName: m.senderName,
      text: m.text,
      timestamp: m.createdAt,
    }));
  }

  async sendMessage(actor: AcademicActor, body: any, ip: string, userAgent: string) {
    const to = String(body.to || '').trim().toLowerCase();
    const text = String(body.text || '').trim();
    if (!to || !text) throw new BadRequestException('Penerima dan isi pesan wajib diisi.');
    const pair = [actor.email.toLowerCase(), to].sort().join(':');
    const msg = await this.prisma.chatMessage.create({
      data: { threadKey: pair, senderEmail: actor.email, senderName: actor.name, senderRole: actor.role === 'lecturer' ? 'lecturer' : 'student', text, createdAt: new Date().toUTCString().slice(17, 22) },
    });
    await this.audit(actor, `SEND pesan ke ${to}`, 'chat', ip, userAgent);
    return { id: msg.id, sender: (actor.role === 'lecturer' ? 'lecturer' : 'student') as any, text, timestamp: msg.createdAt };
  }

  // ── Mahasiswa: overview ───────────────────────────────────────────
  async getStudentOverview(actor: AcademicActor) {
    const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
    const nim = krs?.studentNim ?? actor.email.split('@')[0].replace(/\./g, '').toUpperCase();
    const [offerings, grades, bills, announcements, documents, tickets] = await Promise.all([
      this.prisma.courseOffering.findMany({ orderBy: { code: 'asc' } }),
      this.prisma.gradeRecord.findMany({ where: { studentNim: nim } }),
      this.prisma.financeBill.findMany({ where: { studentNim: nim }, orderBy: { period: 'desc' } }),
      this.prisma.announcement.findMany({ where: { target: { in: ['Semua', 'Mahasiswa'] } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.document.findMany({ orderBy: { title: 'asc' } }),
      this.prisma.helpdeskTicket.findMany({ where: { requesterEmail: actor.email }, orderBy: { createdAt: 'desc' } }),
    ]);

    const enrolledCodes = krs ? safeJson<string[]>(krs.coursesJson, []) : [];
    const enrolled = offerings.filter((o) => enrolledCodes.includes(o.code));

    // Presensi nyata per mata kuliah dari sesi kuliah yang pernah dibuka.
    const sessions = enrolledCodes.length ? await this.prisma.attendanceSession.findMany({ where: { courseCode: { in: enrolledCodes } } }) : [];
    const attendanceRecords = enrolledCodes.length ? await this.prisma.attendanceRecord.findMany({ where: { studentNim: nim } }) : [];
    const attendance = enrolled
      .map((o) => {
        const courseSessions = sessions.filter((s) => s.courseCode === o.code);
        const planned = courseSessions.length;
        const attended = courseSessions.filter((s) =>
          attendanceRecords.some((r) => r.sessionId === s.id && r.status === 'Hadir'),
        ).length;
        return {
          code: o.code,
          name: o.name,
          attendance: attended,
          total: planned,
          percentage: planned ? Math.round((attended / planned) * 1000) / 10 : 0,
        };
      })
      .filter((a) => a.total > 0);

    const gpaSemesters = Array.from(new Set(grades.map((g) => g.semester))).sort((a, b) => a - b);
    const semesterGPAs = gpaSemesters.map((sem) => {
      const rows = grades.filter((g) => g.semester === sem);
      const ips = rows.reduce((a, g) => a + scoreToPoint(g.final), 0) / Math.max(1, rows.length);
      const all = grades.filter((g) => g.semester <= sem);
      const ipk = all.reduce((a, g) => a + scoreToPoint(g.final), 0) / Math.max(1, all.length);
      return { name: `Smt ${sem}`, IPS: Math.round(ips * 100) / 100, IPK: Math.round(ipk * 100) / 100 };
    });

    const transkrip = gpaSemesters.map((sem) => ({
      semester: SEMESTER_LABELS[sem] ?? `Semester ${sem}`,
      ips: Math.round((grades.filter((g) => g.semester === sem).reduce((a, g) => a + scoreToPoint(g.final), 0) / Math.max(1, grades.filter((g) => g.semester === sem).length)) * 100) / 100,
      sksTaken: grades.filter((g) => g.semester === sem).reduce((a, g) => a + (offerings.find((o) => o.code === g.courseCode)?.sks ?? 0), 0),
      grades: grades.filter((g) => g.semester === sem).map((g) => ({
        code: g.courseCode,
        name: g.courseName,
        sks: offerings.find((o) => o.code === g.courseCode)?.sks ?? 2,
        score: g.final,
        grade: g.gradeLetter,
        point: scoreToPoint(g.final),
        status: g.final >= 60 ? 'Lulus' : 'Tidak Lulus',
      })),
    }));

    const todayClasses = enrolled.map((o) => {
      const { day, start, end } = parseSchedule(o.schedule);
      return { id: o.code, code: o.code, name: o.name, sks: o.sks, time: `${start} - ${end}`, room: o.room, lecturer: familyOf(o.lecturer), day };
    });

    const weeklySchedules = Object.fromEntries(
      ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((dayName) => [
        dayName,
        todayClasses.filter((c) => c.day === dayName).map(({ day, ...rest }) => rest),
      ]),
    );

    const availableKrs = offerings.map((o) => ({
      id: o.code,
      code: o.code,
      name: o.name,
      sks: o.sks,
      semester: 5,
      type: enrolledCodes.includes(o.code) ? ('Wajib' as const) : ('Pilihan' as const),
    }));

    const paidBills = bills.filter((b) => b.paidAmount >= b.amount);
    const unpaidTotal = bills.filter((b) => b.paidAmount < b.amount).reduce((a, b) => a + (b.amount - b.paidAmount), 0);

    const profile = {
      nim,
      name: actor.name,
      program: `S1 ${krs?.prodi ?? 'Teknik Informatika'}`,
      faculty: 'Fakultas Teknologi Informasi',
      classYear: String(new Date().getFullYear() - 5),
      advisor: 'Dr. Budi Rahardjo',
      email: actor.email,
      phone: userPhone(actor.email),
      address: 'Jl. Dago Asri No. 12, Bandung, Jawa Barat',
      birthPlace: 'Bandung',
      birthDate: '12 Maret 2001',
      religion: 'Islam',
      citizenId: '3273011203010005',
      avatarUrl: '',
    };

    return {
      semesterGPAs,
      attendance,
      announcements: announcements.map((a) => ({ id: a.id, category: a.target, title: a.title, date: a.date, excerpt: a.content, important: a.target === 'Mahasiswa' })),
      todayClasses,
      weeklySchedules,
      availableKrsCourses: availableKrs,
      transkrip,
      payments: paidBills.map((b) => ({ id: b.id, semester: b.period, code: b.description, amount: b.amount, date: b.dueDate, status: 'Lunas', method: 'Virtual Account' })),
      unpaidBill: unpaidTotal,
      profile,
      layananRequests: tickets.map((t) => ({ id: t.id, type: t.subject, date: t.createdAt, purpose: t.message, status: t.status === 'Selesai' ? 'Selesai' : 'Verifikasi Kaprodi', downloadUrl: t.resolution ? '#' : null })),
      unduhan: documents.map((d) => ({ id: d.id, title: d.title, category: d.category, fileName: d.fileName, fileSize: d.fileSize })),
    };
  }

  async getMyGrades(actor: AcademicActor) {
    const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
    if (!krs) return { semesters: [], currentIpk: 0 };
    const grades = await this.prisma.gradeRecord.findMany({ where: { studentNim: krs.studentNim }, orderBy: { semester: 'asc' } });
    const semesters = Array.from(new Set(grades.map((g) => g.semester))).map((sem) => {
      const rows = grades.filter((g) => g.semester === sem);
      const avg = rows.reduce((a, g) => a + g.final, 0) / Math.max(1, rows.length);
      return { semester: SEMESTER_LABELS[sem] ?? `Semester ${sem}`, ipk: Math.round((avg / 25) * 100) / 100, count: rows.length };
    });
    const total = grades.length ? grades.reduce((a, g) => a + g.final, 0) / grades.length : 0;
    return { semesters, currentIpk: Math.round((total / 25) * 100) / 100 };
  }

  // ── Keuangan ──────────────────────────────────────────────────────
  async getMyFinance(actor: AcademicActor) {
    const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
    if (!krs) return { bills: [], unpaidTotal: 0 };
    const bills = await this.prisma.financeBill.findMany({ where: { studentNim: krs.studentNim }, orderBy: { period: 'desc' } });
    const unpaidTotal = bills.filter((b) => b.paidAmount < b.amount).reduce((a, b) => a + (b.amount - b.paidAmount), 0);
    return { bills, unpaidTotal };
  }

  async getAllFinance(actor: AcademicActor) {
    if (!ADMIN_ROLES.includes(actor.role)) {
      const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: actor.email } });
      if (!krs) return [];
      return this.prisma.financeBill.findMany({ where: { studentNim: krs.studentNim }, orderBy: { period: 'desc' } });
    }
    return this.prisma.financeBill.findMany({ orderBy: { period: 'desc' } });
  }

  async payBill(id: string, actor: AcademicActor, ip: string, userAgent: string) {
    const bill = await this.prisma.financeBill.findUnique({ where: { id } });
    if (!bill) throw new NotFoundException('Tagihan tidak ditemukan.');
    const updated = await this.prisma.financeBill.update({ where: { id }, data: { paidAmount: bill.amount, status: 'Lunas' } });
    await this.audit(actor, `PAY bill ${bill.studentNim} ${bill.description}`, 'finance', ip, userAgent);
    return updated;
  }

  async createBill(actor: AcademicActor, body: any, ip: string, userAgent: string) {
    if (!body.studentNim || !body.description || !body.amount) throw new BadRequestException('NIM, deskripsi, dan nominal wajib diisi.');
    const bill = await this.prisma.financeBill.create({
      data: {
        studentNim: body.studentNim,
        studentName: body.studentName || body.studentNim,
        period: body.period || '2025/2026-Ganjil',
        description: body.description,
        amount: Number(body.amount),
        paidAmount: 0,
        status: 'Belum Lunas',
        dueDate: body.dueDate || '15 Agustus',
      },
    });
    await this.audit(actor, `CREATE bill ${bill.studentNim} ${bill.description}`, 'finance', ip, userAgent);
    return bill;
  }

  // ── Helpdesk & dokumen ────────────────────────────────────────────
  async getMyTickets(actor: AcademicActor) {
    return this.prisma.helpdeskTicket.findMany({ where: { requesterEmail: actor.email }, orderBy: { createdAt: 'desc' } });
  }

  async getAllTickets() {
    return this.prisma.helpdeskTicket.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createTicket(actor: AcademicActor, body: any, ip: string, userAgent: string) {
    if (!body.subject || !body.message) throw new BadRequestException('Subjek dan pesan wajib diisi.');
    const ticket = await this.prisma.helpdeskTicket.create({
      data: {
        requesterEmail: actor.email,
        requesterName: actor.name,
        subject: body.subject,
        message: body.message,
        status: 'Terbuka',
        createdAt: new Date().toLocaleString('id-ID'),
      },
    });
    await this.audit(actor, `CREATE tiket "${ticket.subject}"`, 'helpdesk', ip, userAgent);
    return ticket;
  }

  async updateTicketStatus(id: string, body: any, actor: AcademicActor, ip: string, userAgent: string) {
    const ticket = await this.prisma.helpdeskTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Tiket tidak ditemukan.');
    const updated = await this.prisma.helpdeskTicket.update({ where: { id }, data: { status: body.status || ticket.status, resolution: body.resolution ?? ticket.resolution } });
    await this.audit(actor, `UPDATE tiket "${ticket.subject}" → ${updated.status}`, 'helpdesk', ip, userAgent);
    return updated;
  }

  async getDocuments() {
    return this.prisma.document.findMany({ orderBy: { title: 'asc' } });
  }
}

function avgOf(rows: Array<{ final: number }>, key: keyof { final: number }): number {
  return rows.length ? rows.reduce((a, r) => a + Number(r[key]), 0) / rows.length : 0;
}

function groupIpk(grades: Array<{ semester: number; final: number }>) {
  const sems = Array.from(new Set(grades.map((g) => g.semester))).sort((a, b) => a - b);
  return sems.map((sem) => {
    const rows = grades.filter((g) => g.semester === sem);
    const ipk = rows.reduce((a, g) => a + scoreToPoint(g.final), 0) / Math.max(1, rows.length);
    return { semester: `Smt ${sem}`, ipk: Math.round(ipk * 100) / 100 };
  });
}

function mapThesis(t: any) {
  return {
    id: t.id,
    nim: t.studentNim,
    name: t.studentName,
    title: t.title,
    progressPercentage: t.progressPercentage,
    status: t.status,
    logs: safeJson<Array<{ date: string; note: string; approval: boolean }>>(t.logsJson, []),
    seminar: t.seminarDate ? { type: t.seminarType ?? 'Kolokium', date: t.seminarDate, room: t.seminarRoom ?? '-', time: t.seminarTime ?? '-' } : undefined,
  };
}

function userPhone(email: string): string {
  const map: Record<string, string> = {
    'ahmad.syafiq@mahasiswa.ac.id': '0812-3456-7890',
    'dian.safitri@mahasiswa.ac.id': '0812-1112-1314',
    'aditya.pratama@mahasiswa.ac.id': '0812-2223-2425',
  };
  return map[email] ?? '0812-0000-0000';
}