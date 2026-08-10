import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  private async context() {
    const activePeriod = await this.prisma.academicPeriod.findFirst({ where: { isActive: true } });
    const periods = await this.prisma.academicPeriod.findMany({
      orderBy: { code: 'desc' },
      select: { code: true, label: true },
    });
    return { activePeriod: activePeriod?.code ?? '', periods };
  }

  async summary(user: { id: string; email: string; role: string; name: string }) {
    const ctx = await this.context();
    switch (user.role) {
      case 'admin':
        return this.adminSummary(ctx);
      case 'lecturer':
        return this.lecturerSummary(ctx, user.name);
      case 'student':
        return this.studentSummary(ctx, user.email);
      default:
        return { role: user.role, activePeriod: ctx.activePeriod, periods: ctx.periods };
    }
  }

  private async adminSummary(ctx: { activePeriod: string; periods: unknown[] }) {
    const [studentTotal, lecturerTotal, totalCourses, gpaTrends, facultyDist] = await Promise.all([
      this.prisma.facultyDistribution.aggregate({ _sum: { students: true } }),
      this.prisma.user.count({ where: { role: 'lecturer' } }),
      this.prisma.courseOffering.count(),
      this.prisma.gpaTrend.findMany({ orderBy: { academicYear: 'asc' } }),
      this.prisma.facultyDistribution.findMany({ orderBy: { students: 'desc' } }),
    ]);
    const trend = gpaTrends.map((t) => ({ name: t.academicYear, gpa: t.gpaAvg }));
    const last = gpaTrends[gpaTrends.length - 1]?.gpaAvg ?? 0;
    const prev = gpaTrends[gpaTrends.length - 2]?.gpaAvg ?? last;
    return {
      role: 'admin',
      activePeriod: ctx.activePeriod,
      periods: ctx.periods,
      kpis: [
        { label: 'Total Mahasiswa Aktif', value: Number(studentTotal._sum.students ?? 0), delta: '+4.5%' },
        { label: 'Total Dosen', value: lecturerTotal, delta: null },
        { label: 'Kelas Berjalan', value: totalCourses, delta: null },
        { label: 'IPK Rata-Rata', value: last, delta: ((last - prev) / (prev || 1)).toFixed(2) },
      ],
      gpaTrend: trend,
      facultyDistribution: facultyDist.map((f) => ({ name: f.program, count: f.students })),
      riskDropout: facultyDist.length > 3 ? Math.round(facultyDist[0].students * 0.01) : 0,
    };
  }

  private async lecturerSummary(ctx: { activePeriod: string; periods: unknown[] }, name: string) {
    const family = name.split(',')[0].trim();
    const courses = await this.prisma.courseOffering.findMany({ where: { lecturer: { contains: family } } });
    const mentees = await this.prisma.user.count({ where: { role: 'student' } });
    return {
      role: 'lecturer',
      activePeriod: ctx.activePeriod,
      periods: ctx.periods,
      kpis: [
        { label: 'Kelas Diampu', value: courses.length, delta: null },
        { label: 'Mahasiswa Wali', value: mentees, delta: '5 KRS pending' },
      ],
      schedule: courses.map((c, i) => ({
        id: i + 1,
        code: c.code,
        name: c.name,
        class: 'K-01',
        time: c.schedule.split(', ')[1] ?? c.schedule,
        room: c.room,
      })),
    };
  }

  private async studentSummary(ctx: { activePeriod: string; periods: unknown[] }, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const krs = await this.prisma.krsItem.findUnique({ where: { studentEmail: email } });
    const history = user
      ? await this.prisma.studentGpaHistory.findMany({
          where: { nim: user.username.split('@')[0] },
          orderBy: { semester: 'asc' },
        })
      : [];
    let courseCodes: string[] = [];
    try {
      courseCodes = krs ? (JSON.parse(krs.coursesJson) as string[]) : [];
    } catch {
      courseCodes = [];
    }
    const courses = courseCodes.length
      ? await this.prisma.courseOffering.findMany({
          where: { code: { in: courseCodes }, program: krs?.prodi },
        })
      : [];
    const last = history[history.length - 1];
    return {
      role: 'student',
      activePeriod: ctx.activePeriod,
      periods: ctx.periods,
      kpis: [
        { label: 'IPK Kumulatif', value: last?.ipk ?? 0, delta: '+0.05' },
        { label: 'SKS Diambil', value: krs?.sksDiambil ?? 0, delta: null },
        { label: 'Mata Kuliah Aktif', value: courses.length, delta: null },
      ],
      gpaHistory: history.map((h) => ({ name: h.semester, IPS: h.ips, IPK: h.ipk })),
      courses: courses.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        sks: c.sks,
        lecturer: c.lecturer,
        schedule: c.schedule,
      })),
    };
  }
}