import { Injectable, HttpException, HttpStatus, Inject, ForbiddenException, ConflictException } from '@nestjs/common';
import { PresensiRepository } from './presensi.repository';
import { SecurityService } from '../security/security.service';
import { AuditService } from '../audit/audit.service';

export const ATTENDANCE_STATUSES = ['Hadir', 'Izin', 'Sakit', 'Alpha'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NIM_PATTERN = /^[A-Za-z0-9.-]{3,30}$/;
const MAX_RECORDS_PER_SAVE = 300;
const MAX_NOTES_LENGTH = 200;
const MAX_TOPIC_LENGTH = 300;

/** Kecocokan nama dosen dgn kolom lecturer CourseOffering memakai nama keluarga
 *  (sama seperti modul dashboard): "Dr. Budi Rahardjo, M.T." → "Dr. Budi Rahardjo". */
export function familyOf(name: string): string {
  return name.split(',')[0].trim();
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export interface AttendanceActor {
  id: string;
  email: string;
  role: string;
  name: string;
}

const READER_ROLES = ['admin', 'baak', 'kaprodi', 'dekan'];

@Injectable()
export class PresensiService {
  constructor(
    @Inject(PresensiRepository) private readonly repo: PresensiRepository,
    @Inject(SecurityService) private readonly securityService: SecurityService,
    @Inject(AuditService) private readonly auditService: AuditService,
  ) {}

  // ── Kelas dosen (dengan status sesi hari ini) ─────────────────────
  async getClasses(actor: AttendanceActor) {
    const family = familyOf(actor.name);
    const classes = await this.repo.findClassesByLecturer(family);
    const today = todayISO();

    const result = [];
    for (const c of classes) {
      const openSession = await this.repo.findOpenSession(c.code, today);
      const enrolled = await this.repo.findEnrolledStudents(c.code);
      const sessionCount = await this.repo.findMaxMeetingNumber(c.code);

      result.push({
        code: c.code,
        name: c.name,
        sks: c.sks,
        schedule: c.schedule,
        room: c.room,
        lecturer: c.lecturer,
        enrolledCount: enrolled.length,
        sessionCount: sessionCount ?? 0,
        today: {
          date: today,
          hasOpenSession: Boolean(openSession),
          openSessionId: openSession?.id ?? null,
          openMeetingNumber: openSession?.meetingNumber ?? null,
        },
      });
    }
    return result;
  }

  // ── Membuka sesi presensi baru ─────────────────────────────────────
  async openSession(actor: AttendanceActor, body: any, ip: string, userAgent: string) {
    const courseCode = this.normalizeCourseCode(body?.courseCode);
    const family = familyOf(actor.name);
    const course = await this.repo.findCourseByCodeAndLecturer(courseCode, family);
    if (!course) {
      throw new ForbiddenException('Mata kuliah tidak ditemukan pada jadwal mengajar Anda.');
    }

    let date = body?.date != null ? String(body.date).trim() : todayISO();
    if (!isValidDate(date)) {
      throw new HttpException('Tanggal sesi tidak valid (format: yyyy-mm-dd).', HttpStatus.BAD_REQUEST);
    }

    const existingOpen = await this.repo.findOpenSession(course.code, date);
    if (existingOpen) {
      throw new ConflictException('Sesi presensi untuk mata kuliah ini pada tanggal tersebut sudah dibuka.');
    }

    let meetingNumber: number;
    if (body?.meetingNumber != null) {
      meetingNumber = Number(body.meetingNumber);
      if (!Number.isInteger(meetingNumber) || meetingNumber < 1 || meetingNumber > 64) {
        throw new HttpException('Nomor pertemuan harus berupa angka bulat 1-64.', HttpStatus.BAD_REQUEST);
      }
    } else {
      const max = await this.repo.findMaxMeetingNumber(course.code);
      meetingNumber = (max ?? 0) + 1;
    }

    let topic: string | null = null;
    if (body?.topic != null) {
      topic = String(body.topic).trim();
      if (topic.length === 0) {
        topic = null;
      } else if (topic.length > MAX_TOPIC_LENGTH) {
        throw new HttpException(`Topik/BAP maksimal ${MAX_TOPIC_LENGTH} karakter.`, HttpStatus.BAD_REQUEST);
      }
    }

    const enrolled = await this.repo.findEnrolledStudents(course.code);
    const roster = this.dedupeRoster(enrolled);
    if (roster.length === 0) {
      throw new HttpException('Tidak ada mahasiswa terdaftar pada mata kuliah ini.', HttpStatus.BAD_REQUEST);
    }

    const session = await this.repo.createSession({
      courseCode: course.code,
      courseName: course.name,
      meetingNumber,
      date,
      topic,
      lecturerEmail: actor.email,
      lecturerName: actor.name,
      roster,
    });

    const details = `PRESENSI-OPEN: Sesi ${course.code} pertemuan ${meetingNumber} (${date}) dibuka oleh ${actor.email}. Terdaftar: ${roster.length} mahasiswa.`;
    this.securityService.logSecurityEvent('INFO', details, ip);
    this.auditService.log(actor.id, actor.email, 'PRESENSI_SESSION_OPEN', 'presensi', details, ip, userAgent);

    return {
      id: session.id,
      courseCode: session.courseCode,
      courseName: session.courseName,
      meetingNumber: session.meetingNumber,
      date: session.date,
      topic: session.topic,
      status: session.status,
      rosterSize: roster.length,
    };
  }

  // ── Detail sesi + roster terpadu ───────────────────────────────────
  async getSessionDetail(id: string, actor: AttendanceActor) {
    const session = await this.repo.findSessionById(id);
    if (!session) {
      throw new HttpException('Sesi presensi tidak ditemukan.', HttpStatus.NOT_FOUND);
    }
    this.assertCanRead(session, actor);

    const roster = this.buildMergedRoster(session);
    return {
      id: session.id,
      courseCode: session.courseCode,
      courseName: session.courseName,
      meetingNumber: session.meetingNumber,
      date: session.date,
      topic: session.topic,
      status: session.status,
      openedAt: session.openedAt,
      closedAt: session.closedAt,
      lecturerName: session.lecturerName,
      rosterSize: roster.length,
      stats: this.countStats(roster),
      roster,
    };
  }

  // ── Simpan rekaman presensi (bulk upsert) ──────────────────────────
  async saveRecords(id: string, actor: AttendanceActor, body: any, ip: string, userAgent: string) {
    const session = await this.repo.findSessionById(id);
    if (!session) {
      throw new HttpException('Sesi presensi tidak ditemukan.', HttpStatus.NOT_FOUND);
    }
    this.assertOwner(session, actor);

    if (session.status !== 'open') {
      throw new HttpException('Sesi presensi sudah ditutup dan tidak dapat diubah lagi.', HttpStatus.BAD_REQUEST);
    }

    const rawRecords = body?.records;
    if (!Array.isArray(rawRecords) || rawRecords.length === 0 || rawRecords.length > MAX_RECORDS_PER_SAVE) {
      throw new HttpException(`Rekaman presensi harus berupa array berisi 1-${MAX_RECORDS_PER_SAVE} entri.`, HttpStatus.BAD_REQUEST);
    }

    const roster = this.buildMergedRoster(session);
    const rosterByNim = new Map(roster.map((r) => [r.nim, r.name]));
    const normalized: Array<{ studentNim: string; studentName: string; status: string; notes: string | null }> = [];

    for (const item of rawRecords) {
      if (typeof item !== 'object' || item === null) {
        throw new HttpException('Setiap entri presensi harus berupa objek.', HttpStatus.BAD_REQUEST);
      }
      const nim = typeof item.studentNim === 'string' ? item.studentNim.trim() : '';
      if (!NIM_PATTERN.test(nim)) {
        throw new HttpException('NIM mahasiswa tidak valid.', HttpStatus.BAD_REQUEST);
      }
      const status = typeof item.status === 'string' ? item.status.trim() : '';
      if (!(ATTENDANCE_STATUSES as readonly string[]).includes(status)) {
        throw new HttpException(`Status presensi tidak valid. Gunakan salah satu: ${ATTENDANCE_STATUSES.join(', ')}.`, HttpStatus.BAD_REQUEST);
      }

      let notes: string | null = null;
      if (item.notes != null) {
        notes = String(item.notes).trim();
        if (notes.length > MAX_NOTES_LENGTH) {
          throw new HttpException(`Catatan presensi maksimal ${MAX_NOTES_LENGTH} karakter.`, HttpStatus.BAD_REQUEST);
        }
        if (notes.length === 0) notes = null;
      }

      const studentName = rosterByNim.get(nim);
      if (!studentName) {
        throw new HttpException(`Mahasiswa dengan NIM ${nim} tidak terdaftar pada sesi ini.`, HttpStatus.BAD_REQUEST);
      }

      normalized.push({ studentNim: nim, studentName, status, notes });
    }

    const updatedAt = new Date().toISOString();
    for (const rec of normalized) {
      await this.repo.upsertRecord(id, rec.studentNim, rec, updatedAt);
    }

    const details = `PRESENSI-SAVE: ${normalized.length} rekaman presensi tersimpan untuk sesi ${session.courseCode} pertemuan ${session.meetingNumber} (${session.date}).`;
    this.securityService.logSecurityEvent('INFO', details, ip);
    this.auditService.log(actor.id, actor.email, 'PRESENSI_SAVE_RECORDS', 'presensi', details, ip, userAgent);

    const updated = await this.repo.findSessionById(id);
    return {
      saved: normalized.length,
      sessionId: id,
      roster: updated ? this.buildMergedRoster(updated) : [],
      stats: updated ? this.countStats(this.buildMergedRoster(updated)) : null,
      message: `${normalized.length} data kehadiran berhasil disimpan.`,
    };
  }

  // ── Menutup sesi ───────────────────────────────────────────────────
  async closeSession(id: string, actor: AttendanceActor, ip: string, userAgent: string) {
    const session = await this.repo.findSessionById(id);
    if (!session) {
      throw new HttpException('Sesi presensi tidak ditemukan.', HttpStatus.NOT_FOUND);
    }
    this.assertOwner(session, actor);

    if (session.status !== 'open') {
      throw new HttpException('Sesi presensi sudah ditutup sebelumnya.', HttpStatus.BAD_REQUEST);
    }

    const closed = await this.repo.updateSession(id, { status: 'closed', closedAt: new Date().toISOString() });
    const details = `PRESENSI-CLOSE: Sesi ${session.courseCode} pertemuan ${session.meetingNumber} (${session.date}) ditutup oleh ${actor.email}.`;
    this.securityService.logSecurityEvent('INFO', details, ip);
    this.auditService.log(actor.id, actor.email, 'PRESENSI_SESSION_CLOSE', 'presensi', details, ip, userAgent);

    return {
      id: closed.id,
      courseCode: closed.courseCode,
      meetingNumber: closed.meetingNumber,
      date: closed.date,
      status: closed.status,
      closedAt: closed.closedAt,
      message: 'Sesi presensi berhasil ditutup.',
    };
  }

  // ── Riwayat sesi per kelas ─────────────────────────────────────────
  async getClassHistory(courseCode: string, actor: AttendanceActor) {
    const normalizedCode = this.normalizeCourseCode(courseCode);
    const family = familyOf(actor.name);
    const course = await this.repo.findCourseByCodeAndLecturer(normalizedCode, family);
    if (!course) {
      throw new ForbiddenException('Mata kuliah tidak ditemukan pada jadwal mengajar Anda.');
    }

    const sessions = await this.repo.findSessionsByCourse(normalizedCode, actor.email);
    return {
      course: { code: course.code, name: course.name, sks: course.sks, schedule: course.schedule, room: course.room },
      sessions: sessions.map((s) => {
        const roster = this.buildMergedRoster(s);
        return {
          id: s.id,
          meetingNumber: s.meetingNumber,
          date: s.date,
          topic: s.topic,
          status: s.status,
          openedAt: s.openedAt,
          closedAt: s.closedAt,
          rosterSize: roster.length,
          stats: this.countStats(roster),
        };
      }),
    };
  }

  // ── Rekap per mahasiswa untuk satu kelas ───────────────────────────
  async getClassRekap(courseCode: string, actor: AttendanceActor) {
    const normalizedCode = this.normalizeCourseCode(courseCode);
    const family = familyOf(actor.name);
    const course = await this.repo.findCourseByCodeAndLecturer(normalizedCode, family);
    if (!course) {
      throw new ForbiddenException('Mata kuliah tidak ditemukan pada jadwal mengajar Anda.');
    }

    const sessions = await this.repo.findSessionsByCourse(normalizedCode, actor.email);
    const perStudent = new Map<string, { name: string; hadir: number; izin: number; sakit: number; alpha: number; total: number }>();

    for (const s of sessions) {
      for (const rec of s.records) {
        const entry = perStudent.get(rec.studentNim) ?? { name: rec.studentName, hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 };
        entry.total += 1;
        if (rec.status === 'Hadir') entry.hadir += 1;
        else if (rec.status === 'Izin') entry.izin += 1;
        else if (rec.status === 'Sakit') entry.sakit += 1;
        else entry.alpha += 1;
        perStudent.set(rec.studentNim, entry);
      }
    }

    const students = Array.from(perStudent.entries())
      .map(([nim, v]) => ({
        nim,
        name: v.name,
        hadir: v.hadir,
        izin: v.izin,
        sakit: v.sakit,
        alpha: v.alpha,
        total: v.total,
        percentage: v.total > 0 ? Math.round(((v.hadir + v.izin + v.sakit) / v.total) * 100) : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      course: { code: course.code, name: course.name, sks: course.sks, room: course.room },
      sessionCount: sessions.length,
      students,
    };
  }

  // ── Riwayat presensi milik mahasiswa ───────────────────────────────
  async getMyAttendance(actor: AttendanceActor) {
    const krs = await this.repo.findKrsByStudentEmail(actor.email);
    if (!krs) {
      return { nim: null, courses: [], records: [] };
    }

    const records = await this.repo.findRecordsByNim(krs.studentNim);
    const perCourse = new Map<string, { name: string; attendance: number; total: number; alpha: number }>();

    for (const rec of records) {
      const key = rec.session.courseCode;
      const entry = perCourse.get(key) ?? { name: rec.session.courseName, attendance: 0, total: 0, alpha: 0 };
      entry.total += 1;
      if (rec.status === 'Alpha') {
        entry.alpha += 1;
      } else {
        entry.attendance += 1;
      }
      perCourse.set(key, entry);
    }

    const courses = Array.from(perCourse.entries())
      .map(([code, v]) => ({
        code,
        name: v.name,
        attendance: v.attendance,
        total: v.total,
        percentage: v.total > 0 ? Math.round((v.attendance / v.total) * 100) : 0,
      }))
      .sort((a, b) => a.code.localeCompare(b.code));

    return {
      nim: krs.studentNim,
      courses,
      records: records.map((r) => ({
        id: r.id,
        courseCode: r.session.courseCode,
        courseName: r.session.courseName,
        date: r.session.date,
        meetingNumber: r.session.meetingNumber,
        sessionStatus: r.session.status,
        status: r.status,
        notes: r.notes,
        updatedAt: r.updatedAt,
      })),
    };
  }

  // ── Ringkasan institusi (admin/baak/kaprodi/dekan) ─────────────────
  async getSummary() {
    const sessions = await this.repo.findAllSessions();
    const perCourse = new Map<string, { courseName: string; sessions: number; records: number; hadir: number; izin: number; sakit: number; alpha: number }>();

    for (const s of sessions) {
      const entry = perCourse.get(s.courseCode) ?? { courseName: s.courseName, sessions: 0, records: 0, hadir: 0, izin: 0, sakit: 0, alpha: 0 };
      entry.sessions += 1;
      entry.records += s.records.length;
      for (const r of s.records) {
        if (r.status === 'Hadir') entry.hadir += 1;
        else if (r.status === 'Izin') entry.izin += 1;
        else if (r.status === 'Sakit') entry.sakit += 1;
        else entry.alpha += 1;
      }
      perCourse.set(s.courseCode, entry);
    }

    const courses = Array.from(perCourse.entries())
      .map(([code, v]) => ({
        code,
        courseName: v.courseName,
        sessions: v.sessions,
        records: v.records,
        hadir: v.hadir,
        izin: v.izin,
        sakit: v.sakit,
        alpha: v.alpha,
        attendanceRate: v.records > 0 ? Math.round(((v.hadir + v.izin + v.sakit) / v.records) * 100) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions);

    const totalRecords = sessions.reduce((acc, s) => acc + s.records.length, 0);
    const recent = sessions.slice(0, 10).map((s) => {
      const rate = s.records.length > 0 ? Math.round((s.records.filter((r) => r.status !== 'Alpha').length / s.records.length) * 100) : 0;
      return {
        id: s.id,
        courseCode: s.courseCode,
        courseName: s.courseName,
        date: s.date,
        meetingNumber: s.meetingNumber,
        status: s.status,
        records: s.records.length,
        attendanceRate: rate,
      };
    });

    return {
      totals: { sessions: sessions.length, records: totalRecords, courses: courses.length },
      courses,
      recent,
    };
  }

  // ── Helper ─────────────────────────────────────────────────────────
  private normalizeCourseCode(value: unknown): string {
    if (typeof value !== 'string' || !/^[A-Z0-9]{2,10}$/i.test(value.trim())) {
      throw new HttpException('Kode mata kuliah tidak valid.', HttpStatus.BAD_REQUEST);
    }
    return value.trim().toUpperCase();
  }

  private dedupeRoster(rows: Array<{ studentNim: string; studentName: string }>) {
    const seen = new Set<string>();
    const out: Array<{ nim: string; name: string }> = [];
    for (const r of rows) {
      if (!r.studentNim || seen.has(r.studentNim)) continue;
      seen.add(r.studentNim);
      out.push({ nim: r.studentNim, name: r.studentName });
    }
    return out;
  }

  private parseRoster(session: { rosterJson: string }): Array<{ nim: string; name: string }> {
    try {
      const parsed = JSON.parse(session.rosterJson);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((r) => r && typeof r.nim === 'string')
        .map((r) => ({ nim: r.nim, name: String(r.name ?? '') }));
    } catch {
      return [];
    }
  }

  private buildMergedRoster(session: any) {
    const roster = this.parseRoster(session);
    const recordByNim = new Map<string, any>((session.records ?? []).map((r: any) => [r.studentNim, r]));
    return roster.map((s) => {
      const rec = recordByNim.get(s.nim);
      return {
        nim: s.nim,
        name: s.name,
        status: rec ? rec.status : 'Belum Presensi',
        notes: rec?.notes ?? null,
        updatedAt: rec?.updatedAt ?? null,
      };
    });
  }

  private countStats(roster: Array<{ status: string }>) {
    const stats = { hadir: 0, izin: 0, sakit: 0, alpha: 0, belum: 0, total: roster.length };
    for (const r of roster) {
      if (r.status === 'Hadir') stats.hadir += 1;
      else if (r.status === 'Izin') stats.izin += 1;
      else if (r.status === 'Sakit') stats.sakit += 1;
      else if (r.status === 'Alpha') stats.alpha += 1;
      else stats.belum += 1;
    }
    stats.total = roster.length;
    return stats;
  }

  private assertCanRead(session: any, actor: AttendanceActor) {
    if (actor.role === 'lecturer') {
      this.assertOwner(session, actor);
      return;
    }
    if (!READER_ROLES.includes(actor.role)) {
      throw new ForbiddenException('Anda tidak memiliki akses ke data presensi ini.');
    }
  }

  private assertOwner(session: any, actor: AttendanceActor) {
    if (session.lecturerEmail !== actor.email) {
      throw new ForbiddenException('Anda bukan pengampu mata kuliah pada sesi ini.');
    }
  }
}