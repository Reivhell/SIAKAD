import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface RosterStudent {
  nim: string;
  name: string;
}

export interface OpenSessionInput {
  courseCode: string;
  courseName: string;
  meetingNumber: number;
  date: string;
  topic?: string | null;
  lecturerEmail: string;
  lecturerName: string;
  roster: RosterStudent[];
}

export interface SessionRecordInput {
  studentNim: string;
  studentName: string;
  status: string;
  notes?: string | null;
}

/**
 * PresensiRepository — akses data untuk modul presensi perkuliahan.
 * Semua query memakai PrismaService langsung; validasi & otorisasi
 * ditangani di lapisan service/controller.
 */
@Injectable()
export class PresensiRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  // ── Kelas & enrollments ────────────────────────────────────────────
  findClassesByLecturer(familyName: string) {
    return this.prisma.courseOffering.findMany({
      where: { lecturer: { contains: familyName } },
      orderBy: { code: 'asc' },
    });
  }

  findCourseByCodeAndLecturer(code: string, familyName: string) {
    return this.prisma.courseOffering.findFirst({
      where: { code, lecturer: { contains: familyName } },
    });
  }

  findEnrolledStudents(courseCode: string): Promise<Array<{ studentNim: string; studentName: string }>> {
    return this.prisma.krsItem.findMany({
      where: { coursesJson: { contains: courseCode } },
      select: { studentNim: true, studentName: true },
    });
  }

  findKrsByStudentEmail(email: string) {
    return this.prisma.krsItem.findUnique({ where: { studentEmail: email } });
  }

  // ── Sesi ───────────────────────────────────────────────────────────
  findOpenSession(courseCode: string, date: string) {
    return this.prisma.attendanceSession.findFirst({
      where: { courseCode, date, status: 'open' },
    });
  }

  findSessionById(id: string) {
    return this.prisma.attendanceSession.findUnique({
      where: { id },
      include: { records: true },
    });
  }

  findMaxMeetingNumber(courseCode: string): Promise<number | null> {
    return this.prisma.attendanceSession.aggregate({
      where: { courseCode },
      _max: { meetingNumber: true },
    }).then((r) => r._max.meetingNumber);
  }

  createSession(input: OpenSessionInput) {
    return this.prisma.attendanceSession.create({
      data: {
        courseCode: input.courseCode,
        courseName: input.courseName,
        meetingNumber: input.meetingNumber,
        date: input.date,
        topic: input.topic ?? null,
        lecturerEmail: input.lecturerEmail,
        lecturerName: input.lecturerName,
        status: 'open',
        openedAt: new Date().toISOString(),
        rosterJson: JSON.stringify(input.roster),
      },
    });
  }

  updateSession(id: string, data: { status?: string; closedAt?: string | null }) {
    return this.prisma.attendanceSession.update({ where: { id }, data });
  }

  findSessionsByCourse(courseCode: string, lecturerEmail: string) {
    return this.prisma.attendanceSession.findMany({
      where: { courseCode, lecturerEmail },
      orderBy: [{ date: 'desc' }, { meetingNumber: 'desc' }],
      include: { records: true },
    });
  }

  // ── Rekaman presensi ───────────────────────────────────────────────
  upsertRecord(sessionId: string, studentNim: string, input: SessionRecordInput, updatedAt: string) {
    return this.prisma.attendanceRecord.upsert({
      where: { sessionId_studentNim: { sessionId, studentNim } },
      create: {
        sessionId,
        studentNim,
        studentName: input.studentName,
        status: input.status,
        notes: input.notes ?? null,
        updatedAt,
      },
      update: {
        status: input.status,
        notes: input.notes ?? null,
        updatedAt,
      },
    });
  }

  findRecordsByNim(studentNim: string) {
    return this.prisma.attendanceRecord.findMany({
      where: { studentNim },
      include: { session: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findAllSessions() {
    return this.prisma.attendanceSession.findMany({
      include: { records: true },
      orderBy: { date: 'desc' },
    });
  }
}