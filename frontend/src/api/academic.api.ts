/**
 * Academic API Client
 *
 * Klien terpusat untuk seluruh endpoint modul akademik (backend `academic.controller.ts`).
 * Setiap fungsi memetakan payload backend yang sudah disusun di `AcademicService`
 * ke tipe yang dikonsumsi dashboard. Semua data di sini berasal dari basis data,
 * bukan konstanta tiruan.
 */

import { apiClient } from './client';

// ── Admin (dashboard admin) ──────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dosen' | 'mahasiswa' | 'kaprodi' | 'akademik' | 'dekan';
  status: 'Aktif' | 'Non-Aktif';
  phone?: string;
  department?: string;
}

export interface AdminStudent {
  id: string;
  nim: string;
  name: string;
  prodi: string;
  angkatan: string;
  status: 'Aktif' | 'Cuti' | 'Lulus' | 'Drop Out';
  gpa: number;
  email: string;
  phone: string;
}

export interface AdminLecturer {
  id: string;
  nidn: string;
  name: string;
  jabatan: 'Asisten Ahli' | 'Lektor' | 'Lektor Kepala' | 'Guru Besar';
  prodi: string;
  status: 'Aktif' | 'Non-Aktif' | 'Tugas Belajar';
  email: string;
  phone: string;
}

export interface AdminProdi {
  id: string;
  kode: string;
  nama: string;
  jenjang: string;
  akreditasi: string | null;
}

export interface AdminCourse {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  prodi: string;
  type: 'Wajib' | 'Pilihan';
  prerequisites?: string[];
}

export interface AdminRoom {
  id: string;
  kode: string;
  nama: string;
  kapasitas: number;
  lokasi: string | null;
  status: string;
}

export interface AdminAcademicYear {
  id: string;
  tahunAjaran: string;
  semester: string;
  isAktif: boolean;
  isKrsBuka: boolean;
}

export interface AdminClass {
  id: string;
  kodeMK: string;
  namaMK: string;
  kelas: string;
  sks: number;
  dosenId: string;
  dosenName: string;
  kapasitas: number;
  pesertaCount: number;
}

export interface AdminSchedule {
  id: string;
  classId: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  ruangId: string;
  course?: string;
}

export interface AdminKrsItem {
  id: string;
  studentNim: string;
  studentName: string;
  prodi: string;
  sksDiambil: number;
  status: string;
  courses: string[];
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  target: string;
  date: string;
  author: string;
}

export interface AdminActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  ip: string;
  time: string;
}

export interface AdminBillingInvoice {
  id: string;
  studentNim: string;
  amount: number;
  description: string;
  status: string;
}

export interface AdminOverviewPayload {
  users: AdminUser[];
  students: AdminStudent[];
  lecturers: AdminLecturer[];
  prodis: AdminProdi[];
  courses: AdminCourse[];
  rooms: AdminRoom[];
  academicYears: AdminAcademicYear[];
  classes: AdminClass[];
  schedules: AdminSchedule[];
  krs: AdminKrsItem[];
  announcements: AdminAnnouncement[];
  activityLogs: AdminActivityLog[];
  billing: AdminBillingInvoice[];
}

// ── Dosen (workspace dosen) ──────────────────────────────────────────
export interface LecturerProfile {
  name: string;
  nidn: string;
  jabatan: string;
  prodi: string;
  email: string;
  phone: string;
  address: string;
  foto: string;
  riwayatPendidikan: { jenjang: string; institusi: string; prodi: string; tahun: string }[];
}

/** Profil kosong sementara sebelum data nyata dimuat (bentuk sama dengan respons backend). */
export const EMPTY_LECTURER_PROFILE: LecturerProfile = {
  name: '',
  nidn: '-',
  jabatan: '-',
  prodi: '-',
  email: '',
  phone: '-',
  address: '-',
  foto: '',
  riwayatPendidikan: [],
};

export interface JadwalMengajarItem {
  id: string;
  code: string;
  name: string;
  class: string;
  room: string;
  day: string;
  time: string;
  semester: string;
  sks: number;
  mahasiswaCount: number;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  class: string;
  sks: number;
  capacity: number;
  enrolled: number;
}

export interface StudentAcademic {
  nim: string;
  name: string;
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpha: number;
    total: number;
  };
  grades: {
    tugas: number;
    kuis: number;
    praktikum: number;
    uts: number;
    uas: number;
    final: number;
    gradeLetter: string;
  };
  krs: {
    courses: { code: string; name: string; sks: number }[];
    status: 'Pending' | 'Approved' | 'Revised';
    revisionNotes?: string;
  };
  ipkHistory: { semester: string; ipk: number }[];
  consultations: { date: string; topic: string; notes: string }[];
  gpa: number;
}

/**
 * Bentuk mentah yang dikembalikan backend untuk `students` pada lecturer overview.
 * Dipetakan ke StudentAcademic lewat `mapStudentAcademic`.
 */
export interface RawStudentAcademic {
  nim: string;
  name: string;
  attendance: { hadir: number; sakit: number; izin: number; alpha: number };
  grades: { tugas: number; kuis: number; praktikum: number; uts: number; uas: number; final: number; gradeLetter: string };
  krs: { courses: { code: string; name: string; sks: number }[]; status: string };
  ipkHistory: { name: string; IPK: number }[];
  consultations: { date: string; topic: string; notes: string }[];
  gpa: number;
}

export function mapStudentAcademic(raw: RawStudentAcademic): StudentAcademic {
  const { hadir, sakit, izin, alpha } = raw.attendance;
  return {
    ...raw,
    attendance: { hadir, sakit, izin, alpha, total: hadir + sakit + izin + alpha },
    krs: {
      courses: raw.krs.courses,
      status: raw.krs.status === 'Disetujui' ? 'Approved' : raw.krs.status === 'Diajukan' ? 'Pending' : 'Revised',
    },
    ipkHistory: raw.ipkHistory.map((x) => ({ semester: x.name, ipk: x.IPK })),
  };
}

export interface JurnalItem {
  pertemuan: number;
  date: string;
  materi: string;
  pokokBahasan: string;
  subPokokBahasan: string;
  catatan: string;
  status: string;
  fileCount: number;
}

export interface TugasItem {
  id: string;
  classId: string;
  title: string;
  description: string;
  deadline: string;
  submissionsCount: number;
  attachments: string[];
}

export interface MateriItem {
  id: string;
  classId: string;
  title: string;
  type: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export interface SkripsiItem {
  id: string;
  nim: string;
  name: string;
  title: string;
  progressPercentage: number;
  status: string;
  logs: Array<{ date: string; note: string; approval: boolean }>;
  seminar?: { type: string; date: string; room: string; time: string };
}

export interface ChatMessage {
  id: string;
  sender: 'lecturer' | 'student';
  text: string;
  timestamp: string;
  /** Identitas pengirim nyata dari backend (dipakai untuk membangun thread). */
  senderEmail?: string;
  senderName?: string;
}

export interface ChatThread {
  studentNim: string;
  studentName: string;
  studentEmail?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface KonsultasiItem {
  date: string;
  topic: string;
  notes: string;
  studentNim?: string;
  studentName?: string;
}

export interface LecturerOverviewPayload {
  profile: LecturerProfile;
  jadwal: JadwalMengajarItem[];
  kelas: ClassItem[];
  students: RawStudentAcademic[];
  jurnal: JurnalItem[];
  tugas: TugasItem[];
  materi: MateriItem[];
  skripsi: SkripsiItem[];
  chats: ChatMessage[];
  konsultasi: KonsultasiItem[];
}

// ── Mahasiswa (dashboard mahasiswa) ──────────────────────────────────
export interface StudentSemesterGpa {
  name: string;
  IPS: number;
  IPK: number;
}

export interface StudentAnnouncement {
  id: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  important: boolean;
}

export interface TodayClassItem {
  id: string;
  code: string;
  name: string;
  sks: number;
  time: string;
  room: string;
  lecturer: string;
  day: string;
}

export interface WeeklySchedule {
  [day: string]: Array<Omit<TodayClassItem, 'day'>>;
}

export interface AvailableKrsCourse {
  id: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  type: 'Wajib' | 'Pilihan';
}

export interface TranskripRow {
  semester: string;
  ips: number;
  sksTaken: number;
  grades: Array<{ code: string; name: string; sks: number; score: number; grade: string; point: number; status: string }>;
}

export interface StudentPayment {
  id: string;
  semester: string;
  code: string;
  amount: number;
  date: string;
  status: string;
  method: string;
}

export interface StudentProfile {
  nim: string;
  name: string;
  program: string;
  faculty: string;
  classYear: string;
  advisor: string;
  email: string;
  phone: string;
  address: string;
  birthPlace: string;
  birthDate: string;
  religion: string;
  citizenId: string;
  avatarUrl: string;
}

export interface LayananRequest {
  id: string;
  type: string;
  date: string;
  purpose: string;
  status: string;
  downloadUrl: string | null;
}

export interface UnduhanItem {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileSize: string;
}

export interface StudentOverviewPayload {
  semesterGPAs: StudentSemesterGpa[];
  attendance: Array<{ code: string; name: string; attendance: number; total: number; percentage: number }>;
  announcements: StudentAnnouncement[];
  todayClasses: TodayClassItem[];
  weeklySchedules: WeeklySchedule;
  availableKrsCourses: AvailableKrsCourse[];
  transkrip: TranskripRow[];
  payments: StudentPayment[];
  unpaidBill: number;
  profile: StudentProfile;
  layananRequests: LayananRequest[];
  unduhan: UnduhanItem[];
}

// ── Dashboard peran (Kaprodi/Dekan/BAAK/BAUK/Alumni/Applicant) ───────
export interface KaprodiDashboardPayload {
  classesApproval: Array<{ id: string; courseCode: string; courseName: string; sementer: string; sks: number; classRoom: string; requestedBy: string; status: string }>;
  lecturers: Array<{ id: string; name: string; nip: string; role: string; baseSks: number; addedSks: number; journalFilled: string; rating: number }>;
  coursesBeban: Array<{ id: string; code: string; name: string; sks: number; assignedLecturer: string; semester: number }>;
  coursesNilai: Array<{ id: string; name: string; code: string; totalStudents: number; avgGpa: number; gradeA: number; gradeB: number; gradeC: number; gradeD: number; gradeE: number }>;
  presensi: Array<{ id: string; className: string; code: string; lecturer: string; attendanceRate: number; sessionsCompleted: number; sessionsPlanned: number }>;
  prodiGpaTrend: Array<{ name: string; IPK: number }>;
  laporan: { rasioDosenMahasiswa: string; ketepatanKelulusan: string; penyerapanLulusan: string };
  kpis: { totalStudentsProdi: number; totalLecturers: number; avgProdiGpa: number };
}

export interface DekanDashboardPayload {
  bebanDosen: Array<{ id: string; lecturerName: string; nidn: string; prodi: string; baseSks: number; requestedSks: number; reason: string; status: string }>;
  kurikulumApproval: Array<{ id: string; prodi: string; name: string; sksWajib: number; sksPilihan: number; cplCount: number; createdBy: string; status: string }>;
  financialMetrics: Array<{ name: string; paid: number; outstanding: number; target: number }>;
  prodiPerformance: Array<{ name: string; ipkAverage: number; attendanceLecturer: number; attendanceStudent: number }>;
  gradeDistributionFaculty: Array<{ name: string; value: number }>;
  kpis: { totalMahasiswa: string; totalDosen: string; rataIpk: string; targetUkt: string; uktSub: string };
}

export interface BaakDashboardPayload {
  schedules: Array<{ id: string; course: string; lecturer: string; room: string; time: string; cap: string; status: string }>;
  courses: Array<{ code: string; name: string; sks: number; semester: number; type: string; preraq: string; cpl: string }>;
  mutasiRequests: Array<{ id: string; name: string; nim: string; type: string; date: string; status: string; reason: string }>;
  warningList: Array<{ nim: string; name: string; ipk: number; spLevel: string; status: string; desc: string }>;
}

export interface BaukDashboardPayload {
  billingConfigs: Array<{ group: string; nominal: number; installmentAllowed: boolean; lateFee: number; count: number }>;
  scholarships: Array<{ id: string; name: string; source: string; discountPercent: number; awardees: number; status: string }>;
  reconciledPayments: Array<{ id: string; name: string; nim: string; bank: string; va: string; amount: string; date: string; method: string; status: string }>;
}

export interface AlumniDashboardPayload {
  alumniProfile: {
    name?: string; email?: string;
    nim: string; program: string; faculty: string; classYear: string; graduationYear: string; gpa: number; totalSks: number;
    degree: string; advisor: string; birthPlace: string; birthDate: string; religion: string; citizenId: string; phone: string; address: string; avatarUrl: string;
  };
  alumniSemesterGPAs: Array<{ name: string; IPS: number; IPK: number }>;
}

export interface ApplicantDashboardPayload {
  pmb: {
    nik: string; nisn: string; school: string; firstProdi: string; secondProdi: string;
    documents: Array<{ id: string; name: string; file: string; status: string; ocrScore: number; error: string }>;
  };
  testQuestions: Array<{ q: string; options: string[]; correct: string }>;
}

export type RoleDashboardPayload =
  | KaprodiDashboardPayload
  | DekanDashboardPayload
  | BaakDashboardPayload
  | BaukDashboardPayload
  | AlumniDashboardPayload
  | ApplicantDashboardPayload;

// ── HTTP helpers ─────────────────────────────────────────────────────
async function getJson<T>(url: string): Promise<T> {
  const res = await apiClient.get<{ status: string; data?: T }>(url);
  // Backend membungkus payload dalam `{ data }` untuk beberapa rute; bila tidak ada, kembalikan apa adanya.
  return (res as unknown as { data?: T }).data ?? (res as unknown as T);
}

function reject(res: { status: string; message?: string }): never {
  throw new Error(res.message || 'Permintaan gagal.');
}

// ── Admin / Dosen / Mahasiswa overview ───────────────────────────────
export async function getAdminOverview(): Promise<AdminOverviewPayload> {
  const res = await apiClient.get<AdminOverviewPayload>('/academic/admin/overview');
  return (res as unknown as { data?: AdminOverviewPayload }).data ?? res;
}

export async function getLecturerOverview(): Promise<LecturerOverviewPayload> {
  const res = await apiClient.get<LecturerOverviewPayload>('/academic/lecturer/overview');
  return (res as unknown as { data?: LecturerOverviewPayload }).data ?? res;
}

export async function getStudentOverview(): Promise<StudentOverviewPayload> {
  const res = await apiClient.get<StudentOverviewPayload>('/academic/student/overview');
  return (res as unknown as { data?: StudentOverviewPayload }).data ?? res;
}

// ── Dashboard peran ──────────────────────────────────────────────────
export async function getRoleDashboard<P extends RoleDashboardPayload>(role: string): Promise<P> {
  const res = await apiClient.get<P>(`/academic/dashboard/${role}`);
  return (res as unknown as { data?: P }).data ?? res;
}

export async function updateRoleDashboardItem(
  role: string,
  collection: string,
  id: string,
  status: string,
): Promise<RoleDashboardPayload> {
  const res = await apiClient.put<RoleDashboardPayload>(
    `/academic/dashboards/${role}/items/${collection}/${id}/status`,
    { status },
  );
  return (res as unknown as { data?: RoleDashboardPayload }).data ?? res;
}

// ── Pengumuman, materi, tugas, nilai, keuangan, tiket, dokumen ───────
export interface AcademicAnnouncement {
  id: string;
  title: string;
  content: string;
  target: string;
  date: string;
  author: string;
  createdAt?: string;
}

export async function getAcademicAnnouncements(target?: string): Promise<AcademicAnnouncement[]> {
  const params = target ? { params: { target } } : undefined;
  const res = await apiClient.get<{ status: string; announcements: AcademicAnnouncement[] }>('/academic/announcements', params);
  return (res as unknown as { announcements?: AcademicAnnouncement[] }).announcements ?? [];
}

/** Kirim pesan chat nyata ke mahasiswa (penerima = email). */
export async function sendChatMessage(to: string, text: string): Promise<ChatMessage> {
  const res = await apiClient.post<ChatMessage>('/academic/messages', { to, text });
  return (res as unknown as { data?: ChatMessage }).data ?? res;
}

export async function createAcademicAnnouncement(body: Partial<AcademicAnnouncement>): Promise<AcademicAnnouncement> {
  const res = await apiClient.post<AcademicAnnouncement>('/academic/announcements', body);
  return (res as unknown as { data?: AcademicAnnouncement }).data ?? res;
}

export async function updateAcademicAnnouncement(id: string, body: Partial<AcademicAnnouncement>): Promise<AcademicAnnouncement> {
  const res = await apiClient.put<AcademicAnnouncement>(`/academic/announcements/${id}`, body);
  return (res as unknown as { data?: AcademicAnnouncement }).data ?? res;
}

export async function deleteAcademicAnnouncement(id: string): Promise<{ id: string }> {
  const res = await apiClient.delete<{ id: string }>(`/academic/announcements/${id}`);
  return (res as unknown as { data?: { id: string } }).data ?? res;
}

export interface AcademicDateItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  type?: string;
  period?: string;
}

export async function getAcademicDates(): Promise<AcademicDateItem[]> {
  const res = await apiClient.get<{ status: string; dates: AcademicDateItem[] }>('/academic/dates');
  return (res as unknown as { dates?: AcademicDateItem[] }).dates ?? [];
}

export interface AcademicMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  lecturerEmail?: string;
}

export async function createAcademicMaterial(body: Partial<AcademicMaterial>): Promise<AcademicMaterial> {
  const res = await apiClient.post<AcademicMaterial>('/academic/materials', body);
  return (res as unknown as { data?: AcademicMaterial }).data ?? res;
}

export async function deleteAcademicMaterial(id: string): Promise<{ id: string }> {
  const res = await apiClient.delete<{ id: string }>(`/academic/materials/${id}`);
  return (res as unknown as { data?: { id: string } }).data ?? res;
}

export interface AcademicAssignment {
  id: string;
  courseCode: string;
  classLabel: string;
  title: string;
  description: string;
  deadline: string;
  lecturerEmail?: string;
  createdAt?: string;
}

export async function createAcademicAssignment(body: Partial<AcademicAssignment>): Promise<AcademicAssignment> {
  const res = await apiClient.post<AcademicAssignment>('/academic/assignments', body);
  return (res as unknown as { data?: AcademicAssignment }).data ?? res;
}

export async function getAcademicAssignments(): Promise<AcademicAssignment[]> {
  const res = await apiClient.get<AcademicAssignment[]>('/academic/assignments');
  return (res as unknown as { data?: AcademicAssignment[] }).data ?? res;
}

export async function deleteAcademicAssignment(id: string): Promise<{ id: string }> {
  const res = await apiClient.delete<{ id: string }>(`/academic/assignments/${id}`);
  return (res as unknown as { data?: { id: string } }).data ?? res;
}

export interface MyGradeSemester {
  semester: string;
  ipk: number;
  count: number;
}

export async function getMyGrades(): Promise<{ semesters: MyGradeSemester[]; currentIpk: number }> {
  const res = await apiClient.get<{ semesters: MyGradeSemester[]; currentIpk: number }>('/academic/grades/my');
  return (res as unknown as { data?: { semesters: MyGradeSemester[]; currentIpk: number } }).data ?? res;
}

export interface ClassGradeReport {
  course: { code: string; name: string; sks: number };
  roster: Array<{ nim: string; name: string; krs: string; tugas: number; kuis: number; praktikum: number; uts: number; uas: number; final: number; gradeLetter: string }>;
}

export async function getClassGrades(code: string): Promise<ClassGradeReport> {
  const res = await apiClient.get<ClassGradeReport>(`/academic/grades/class/${code}`);
  return (res as unknown as { data?: ClassGradeReport }).data ?? res;
}

export async function saveClassGrades(code: string, rows: unknown[]): Promise<{ updated: number }> {
  const res = await apiClient.post<{ updated: number }>(`/academic/grades/class/${code}`, { rows });
  return (res as unknown as { data?: { updated: number } }).data ?? res;
}

export interface FinanceBill {
  id: string;
  studentNim: string;
  period: string;
  description: string;
  amount: number;
  paidAmount: number;
  dueDate?: string;
  status?: string;
}

export async function getMyFinance(): Promise<{ bills: FinanceBill[] }> {
  const res = await apiClient.get<{ bills: FinanceBill[] }>('/academic/finance');
  return (res as unknown as { data?: { bills: FinanceBill[] } }).data ?? res;
}

export async function payFinanceBill(id: string, amount: number): Promise<FinanceBill> {
  const res = await apiClient.post<FinanceBill>(`/academic/finance/${id}/pay`, { amount });
  return (res as unknown as { data?: FinanceBill }).data ?? res;
}

export async function createFinanceBill(body: Partial<FinanceBill>): Promise<FinanceBill> {
  const res = await apiClient.post<FinanceBill>('/academic/finance', body);
  return (res as unknown as { data?: FinanceBill }).data ?? res;
}

export interface TicketItem {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt?: string;
  resolution?: string | null;
  requesterName?: string;
  requesterEmail?: string;
}

export async function getTickets(): Promise<TicketItem[]> {
  const res = await apiClient.get<{ status: string; tickets: TicketItem[] }>('/academic/tickets');
  return (res as unknown as { tickets?: TicketItem[] }).tickets ?? [];
}

export async function createTicket(body: Partial<TicketItem>): Promise<TicketItem> {
  const res = await apiClient.post<TicketItem>('/academic/tickets', body);
  return (res as unknown as { data?: TicketItem }).data ?? res;
}

export async function updateTicketStatus(id: string, status: string): Promise<TicketItem> {
  const res = await apiClient.put<TicketItem>(`/academic/tickets/${id}/status`, { status });
  return (res as unknown as { data?: TicketItem }).data ?? res;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileSize: string;
}

export async function getAcademicDocuments(): Promise<DocumentItem[]> {
  const res = await apiClient.get<DocumentItem[]>('/academic/documents');
  return (res as unknown as { data?: DocumentItem[] }).data ?? res;
}

export interface ThesisItem {
  id: string;
  nim: string;
  name: string;
  title: string;
  progressPercentage: number;
  status: string;
  logs: Array<{ date: string; note: string; approval: boolean }>;
  seminar?: { type: string; date: string; room: string; time: string };
}

export async function getThesisItems(): Promise<ThesisItem[]> {
  const res = await apiClient.get<{ status: string; thesis: ThesisItem[] }>('/academic/thesis');
  return (res as unknown as { thesis?: ThesisItem[] }).thesis ?? [];
}

export interface EdomEvaluation {
  id: string;
  studentNim: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  lecturerEmail: string;
  lecturerName: string;
  semester: string;
  pedagogik: number;
  profesional: number;
  kepribadian: number;
  sosial: number;
  comment?: string;
  createdAt?: string;
}

export interface EdomPayload {
  role: 'student' | 'lecturer' | 'leadership';
  courses?: Array<{ code: string; name: string; lecturer: string; evaluated: boolean }>;
  evaluations: EdomEvaluation[];
}

export async function getEdomEvaluations(): Promise<EdomPayload> {
  const res = await apiClient.get<EdomPayload>('/academic/edom');
  return (res as unknown as { data?: EdomPayload }).data ?? res;
}

export async function submitEdomEvaluation(
  body: Omit<EdomEvaluation, 'id' | 'studentNim' | 'studentName' | 'semester' | 'createdAt' | 'lecturerEmail'> & { lecturerEmail?: string },
): Promise<EdomEvaluation> {
  const res = await apiClient.post<EdomEvaluation>('/academic/edom', body);
  return (res as unknown as { data?: EdomEvaluation }).data ?? res;
}

export { reject };