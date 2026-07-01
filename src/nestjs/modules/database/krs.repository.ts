import { Injectable, OnModuleInit } from '@nestjs/common';
import { BaseRepository } from './base.repository';

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
export class KrsRepository extends BaseRepository<AdminKrsItem> implements OnModuleInit {
  onModuleInit() {
    this.seedDefaultKrs();
  }

  async findByStudentEmail(email: string): Promise<AdminKrsItem | null> {
    const item = this.items.find((k) => k.studentEmail.toLowerCase() === email.toLowerCase());
    return item || null;
  }

  async findByStudentNim(nim: string): Promise<AdminKrsItem | null> {
    const item = this.items.find((k) => k.studentNim === nim);
    return item || null;
  }

  private seedDefaultKrs() {
    this.items = [
      {
        id: 'krs-1',
        studentNim: '10118001',
        studentName: 'Faisal Akbar',
        studentEmail: 'mahasiswa@kampus.ac.id',
        prodi: 'Teknik Informatika',
        sksDiambil: 8,
        status: 'Diajukan',
        courses: ['IF3110', 'IF3150', 'KU2071'],
      },
      {
        id: 'krs-2',
        studentNim: '10118002',
        studentName: 'Dian Safitri',
        studentEmail: 'student2@kampus.ac.id',
        prodi: 'Sistem Informasi',
        sksDiambil: 3,
        status: 'Disetujui',
        courses: ['SI2101'],
      },
      {
        id: 'krs-3',
        studentNim: '10118003',
        studentName: 'Aditya Pratama',
        studentEmail: 'student3@kampus.ac.id',
        prodi: 'Teknik Elektro',
        sksDiambil: 4,
        status: 'Draft',
        courses: ['EE4102'],
      },
    ];
  }
}
