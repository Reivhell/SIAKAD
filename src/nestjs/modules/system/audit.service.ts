import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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
  private readonly logFilePath = path.join(process.cwd(), 'audit_logs.json');
  private auditRecords: AuditRecord[] = [];

  onModuleInit() {
    this.loadLogs();
    this.log('SYSTEM', 'system@kampus.ac.id', 'AUDIT_INIT', 'system', 'Persistent Audit System Initialized successfully.', '0.0.0.0', 'NestJS Server');
  }

  private loadLogs() {
    try {
      if (fs.existsSync(this.logFilePath)) {
        const fileContent = fs.readFileSync(this.logFilePath, 'utf8');
        this.auditRecords = JSON.parse(fileContent);
      } else {
        this.auditRecords = [];
        this.saveLogs();
      }
    } catch (err) {
      console.error('Failed to load audit logs from file, initializing empty log database.', err);
      this.auditRecords = [];
    }
  }

  private saveLogs() {
    try {
      fs.writeFileSync(this.logFilePath, JSON.stringify(this.auditRecords, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write audit logs to file.', err);
    }
  }

  public log(
    actorId: string,
    email: string,
    action: string,
    resource: string,
    details: string,
    ip: string = '127.0.0.1',
    userAgent: string = 'Unknown',
    oldValue?: string,
    newValue?: string
  ): AuditRecord {
    const record: AuditRecord = {
      id: 'audit-' + Math.random().toString(36).substr(2, 9),
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
    };

    this.auditRecords.unshift(record);
    
    // Cap at 1000 persistent records in local file database
    if (this.auditRecords.length > 1000) {
      this.auditRecords.pop();
    }

    this.saveLogs();
    return record;
  }

  public getRecords(limit: number = 100, filterAction?: string, filterEmail?: string): AuditRecord[] {
    let result = [...this.auditRecords];
    if (filterAction) {
      result = result.filter(r => r.action.toLowerCase() === filterAction.toLowerCase());
    }
    if (filterEmail) {
      result = result.filter(r => r.email.toLowerCase().includes(filterEmail.toLowerCase()));
    }
    return result.slice(0, limit);
  }
}
