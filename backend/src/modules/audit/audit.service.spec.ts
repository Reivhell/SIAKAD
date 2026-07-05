import { describe, it, expect, beforeEach } from 'vitest';
import { AuditService } from './audit.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('AuditService Unit Tests', () => {
  let auditService: AuditService;
  let prisma: PrismaService;

  beforeEach(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    await prisma.auditRecord.deleteMany();

    auditService = new AuditService(prisma);
    await auditService.onModuleInit();
  });

  it('should successfully initialize and write initial system log to database', async () => {
    const records = await auditService.getRecords();
    expect(records.length).toBeGreaterThanOrEqual(1);
    expect(records[0].action).toBe('AUDIT_INIT');
  });

  it('should create new persistent audit logs with correct schema details', async () => {
    const record = await auditService.log(
      'u1',
      'test@kampus.ac.id',
      'AUTH_LOGIN_SUCCESS',
      'auth',
      'User successfully logged in',
      '192.168.1.1',
      'Mozilla Firefox',
      'oldState',
      'newState',
    );

    expect(record?.id).toBeDefined();
    expect(record?.actorId).toBe('u1');
    expect(record?.email).toBe('test@kampus.ac.id');
    expect(record?.action).toBe('AUTH_LOGIN_SUCCESS');
    expect(record?.resource).toBe('auth');
    expect(record?.ip).toBe('192.168.1.1');
    expect(record?.userAgent).toBe('Mozilla Firefox');
    expect(record?.oldValue).toBe('oldState');
    expect(record?.newValue).toBe('newState');

    const allRecords = await auditService.getRecords();
    expect(allRecords[0].id).toBe(record?.id);
  });

  it('should correctly filter persistent records by action and email query', async () => {
    await auditService.log('u1', 'student@kampus.ac.id', 'COURSE_ENROLL', 'course', 'Enrolled in Course');
    await auditService.log('u2', 'admin@kampus.ac.id', 'SECRET_ROTATE', 'security', 'Rotated keys');

    const enrollRecords = await auditService.getRecords(10, 'COURSE_ENROLL');
    expect(enrollRecords.length).toBe(1);
    expect(enrollRecords[0].email).toBe('student@kampus.ac.id');

    const adminRecords = await auditService.getRecords(10, undefined, 'admin@kampus.ac.id');
    expect(adminRecords.length).toBe(1);
    expect(adminRecords[0].action).toBe('SECRET_ROTATE');
  });
});
