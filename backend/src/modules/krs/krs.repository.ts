import { Injectable, Inject } from '@nestjs/common';
import { IBaseRepository } from '../../common/prisma/base.repository';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface AdminKrsItem {
  id: string;
  studentNim: string;
  studentName: string;
  studentEmail: string;
  prodi: string;
  sksDiambil: number;
  status: 'Belum Mengisi' | 'Draft' | 'Diajukan' | 'Disetujui' | 'Revisi';
  courses: string[]; // array of course codes
}

@Injectable()
export class KrsRepository implements IBaseRepository<AdminKrsItem> {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private toDomain(record: any): AdminKrsItem {
    return {
      ...record,
      courses: record.coursesJson ? JSON.parse(record.coursesJson) : []
    };
  }

  private toPrisma(item: AdminKrsItem): any {
    const { courses, ...rest } = item;
    return {
      ...rest,
      coursesJson: JSON.stringify(courses)
    };
  }

  async find(id: string): Promise<AdminKrsItem | null> {
    const item = await this.prisma.krsItem.findUnique({ where: { id } });
    return item ? this.toDomain(item) : null;
  }

  async findAll(): Promise<AdminKrsItem[]> {
    const items = await this.prisma.krsItem.findMany();
    return items.map(this.toDomain);
  }

  async create(item: AdminKrsItem): Promise<AdminKrsItem> {
    const record = await this.prisma.krsItem.create({ data: this.toPrisma(item) });
    return this.toDomain(record);
  }

  async update(id: string, item: Partial<AdminKrsItem>): Promise<AdminKrsItem | null> {
    try {
      const dataToUpdate = item.courses ? this.toPrisma(item as AdminKrsItem) : item;
      const record = await this.prisma.krsItem.update({
        where: { id },
        data: dataToUpdate,
      });
      return this.toDomain(record);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.krsItem.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findByStudentEmail(email: string): Promise<AdminKrsItem | null> {
    const item = await this.prisma.krsItem.findFirst({
      where: { studentEmail: email }
    });
    return item ? this.toDomain(item) : null;
  }

  async findByStudentNim(nim: string): Promise<AdminKrsItem | null> {
    const item = await this.prisma.krsItem.findUnique({
      where: { studentNim: nim }
    });
    return item ? this.toDomain(item) : null;
  }

  /**
   * Paginated query for enterprise-scale listing.
   * Returns { data, total, page, limit, totalPages }.
   */
  async findPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ): Promise<{ data: AdminKrsItem[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { studentName: { contains: search } },
        { studentNim: { contains: search } },
        { studentEmail: { contains: search } },
        { prodi: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.krsItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { studentNim: 'asc' },
      }),
      this.prisma.krsItem.count({ where }),
    ]);

    return {
      data: items.map((i) => this.toDomain(i)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
