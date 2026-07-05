import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface AuditRecord {
  id: string;
  actorId: string;
  email: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

@Injectable()
export class AuditService implements OnModuleInit {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Log init async
    this.log('SYSTEM', 'system@kampus.ac.id', 'AUDIT_INIT', 'system', 'Persistent Audit System Initialized successfully.', '0.0.0.0', 'NestJS Server');
  }

  public async log(
    actorId: string,
    email: string,
    action: string,
    resource: string,
    details: string,
    ip: string = '127.0.0.1',
    userAgent: string = 'Unknown',
    oldValue?: string,
    newValue?: string
  ): Promise<AuditRecord | null> {
    try {
      const record = await this.prisma.auditRecord.create({
        data: {
          actorId,
          email,
          action,
          resource,
          timestamp: new Date().toISOString(),
          ip,
          userAgent,
          details,
          oldValue,
          newValue
        }
      });
      return record as AuditRecord;
    } catch (err) {
      console.error('Failed to write audit log to database.', err);
      return null;
    }
  }

  public async getRecords(limit: number = 100, filterAction?: string, filterEmail?: string): Promise<AuditRecord[]> {
    const where: any = {};
    if (filterAction) {
      where.action = filterAction;
    }
    if (filterEmail) {
      where.email = { contains: filterEmail }; // works for SQLite / Postgres
    }

    const records = await this.prisma.auditRecord.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
    
    return records as AuditRecord[];
  }
}
