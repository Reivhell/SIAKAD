export type Role = 'admin' | 'baak' | 'bauk' | 'kaprodi' | 'dekan' | 'lecturer' | 'student' | 'applicant' | 'alumni';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  department?: string;
  themePreference?: 'light' | 'dark';
  isGraduated?: boolean;
}

export interface Student {
  id: string;
  nim: string;
  name: string;
  program: string;
  status: 'Aktif' | 'Cuti' | 'Lulus' | 'Drop Out';
  gpa: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  type: 'Wajib' | 'Pilihan';
  prerequisites?: string[];
}

export interface Enrollment {
  id: string;
  courseId: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}
