import { apiClient } from './api.client';

export interface KrsRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentNim: string;
  courses: string[]; // Course codes
  status: 'Draft' | 'Diajukan' | 'Disetujui' | 'Revisi';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface KrsResponse {
  status: 'success';
  krs: KrsRecord;
}

export interface KrsListResponse {
  status: 'success';
  count: number;
  records: KrsRecord[];
}

export class KrsService {
  /**
   * Fetches study plan (KRS) for the logged-in student user
   */
  static async getKrs(): Promise<KrsResponse> {
    return apiClient.get<KrsResponse>('/krs');
  }

  /**
   * Adds a course to the current student's draft KRS
   */
  static async addCourse(courseCode: string): Promise<KrsResponse> {
    return apiClient.post<KrsResponse>('/krs/add-course', { courseCode });
  }

  /**
   * Removes a course from the current student's draft KRS
   */
  static async removeCourse(courseCode: string): Promise<KrsResponse> {
    return apiClient.post<KrsResponse>('/krs/remove-course', { courseCode });
  }

  /**
   * Submits the student's draft KRS for academic advisor approval
   */
  static async submitKrs(): Promise<KrsResponse> {
    return apiClient.post<KrsResponse>('/krs/submit');
  }

  /**
   * Fetches all KRS entries in the system (Lecturer/Admin/Kaprodi access)
   */
  static async getAllKrs(): Promise<KrsListResponse> {
    return apiClient.get<KrsListResponse>('/krs/students');
  }

  /**
   * Approves or requests a revision for a student's study plan (Lecturer/Admin access)
   */
  static async approveKrs(studentNim: string, approve: boolean): Promise<KrsResponse> {
    return apiClient.post<KrsResponse>('/krs/approve', { studentNim, approve });
  }
}
