import { apiClient } from './client';

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
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
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
  static async getAllKrs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<KrsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return apiClient.get<KrsListResponse>(`/krs/students${suffix}`);
  }

  /**
   * Approves or requests a revision for a student's study plan (Lecturer/Admin access)
   */
  static async approveKrs(studentNim: string, approve: boolean): Promise<KrsResponse> {
    return apiClient.post<KrsResponse>('/krs/approve', { studentNim, approve });
  }
}
