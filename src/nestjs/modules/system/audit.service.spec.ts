import { AuditService } from './audit.service';
import * as fs from 'fs';

describe('AuditService Unit Tests', () => {
  let auditService: AuditService;

  beforeEach(() => {
    // Delete any existing audit_logs.json if exists for test isolation
    if (fs.existsSync('audit_logs.json')) {
      try {
        fs.unlinkSync('audit_logs.json');
      } catch (err) {}
    }
    auditService = new AuditService();
    // Manually trigger initialization hook
    auditService.onModuleInit();
  });

  afterEach(() => {
    if (fs.existsSync('audit_logs.json')) {
      try {
        fs.unlinkSync('audit_logs.json');
      } catch (err) {}
    }
  });

  it('should successfully initialize and write initial system log to disk', () => {
    expect(fs.existsSync('audit_logs.json')).toBe(true);
    const records = auditService.getRecords();
    expect(records.length).toBeGreaterThanOrEqual(1);
    expect(records[0].action).toBe('AUDIT_INIT');
  });

  it('should create new persistent audit logs with correct schema details', () => {
    const record = auditService.log(
      'u1',
      'test@kampus.ac.id',
      'AUTH_LOGIN_SUCCESS',
      'auth',
      'User successfully logged in',
      '192.168.1.1',
      'Mozilla Firefox',
      'oldState',
      'newState'
    );

    expect(record.id).toBeDefined();
    expect(record.actorId).toBe('u1');
    expect(record.email).toBe('test@kampus.ac.id');
    expect(record.action).toBe('AUTH_LOGIN_SUCCESS');
    expect(record.resource).toBe('auth');
    expect(record.ip).toBe('192.168.1.1');
    expect(record.userAgent).toBe('Mozilla Firefox');
    expect(record.oldValue).toBe('oldState');
    expect(record.newValue).toBe('newState');

    // Confirm is loaded into persistent logs
    const allRecords = auditService.getRecords();
    expect(allRecords[0].id).toBe(record.id);
  });

  it('should correctly filter persistent records by action and email query', () => {
    auditService.log('u1', 'student@kampus.ac.id', 'COURSE_ENROLL', 'course', 'Enrolled in Course');
    auditService.log('u2', 'admin@kampus.ac.id', 'SECRET_ROTATE', 'security', 'Rotated keys');

    const enrollRecords = auditService.getRecords(10, 'COURSE_ENROLL');
    expect(enrollRecords.length).toBe(1);
    expect(enrollRecords[0].email).toBe('student@kampus.ac.id');

    const adminRecords = auditService.getRecords(10, undefined, 'admin@kampus.ac.id');
    expect(adminRecords.length).toBe(1);
    expect(adminRecords[0].action).toBe('SECRET_ROTATE');
  });
});
