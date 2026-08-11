import React, { useState, useEffect } from 'react';
import { getTickets, updateTicketStatus } from '../../../api/academic.api';
import {
  Layers,
  Network,
  Award,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  Cpu,
  Send,
  Key,
  FileCheck,
  MessageSquare,
  Eye,
  Check,
  X,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  MapPin,
  Camera,
  QrCode,
  FileText,
  Mail,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Lock,
  Compass,
  HardDrive,
  BarChart,
  UserCheck,
  CreditCard
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart as ReAreaChart,
  Area as ReArea
} from 'recharts';

interface AdminEnterpriseSuiteModuleProps {
  activeTab: string;
  onShowToast: (message: string) => void;
}

// 1. WORKFLOW APPROVAL MOCK
const INITIAL_WORKFLOW_STEPS = [
  { id: 'step-1', name: 'Dosen Wali (PA)', role: 'Dosen', duration: 'Max 2 Hari', required: true },
  { id: 'step-2', name: 'Kepala Program Studi (Kaprodi)', role: 'Kaprodi', duration: 'Max 3 Hari', required: true },
  { id: 'step-3', name: 'Biro Administrasi Akademik (BAAK)', role: 'BAAK', duration: 'Max 1 Hari', required: true },
  { id: 'step-4', name: 'Wakil Dekan Bidang Akademik', role: 'Wakil Dekan', duration: 'Max 5 Hari', required: false }
];

// 2. PDDIKTI MOCK
const PDDIKTI_ENTITIES = [
  { name: 'Profil Mahasiswa', localCount: 4820, syncedCount: 4812, unsynced: 8, status: 'Sinkron Sebagian' },
  { name: 'Kualifikasi Dosen', localCount: 142, syncedCount: 142, unsynced: 0, status: 'Sinkron Penuh' },
  { name: 'Kartu Rencana Studi (KRS)', localCount: 9640, syncedCount: 9550, unsynced: 90, status: 'Sinkron Sebagian' },
  { name: 'Nilai Perkuliahan', localCount: 12500, syncedCount: 12100, unsynced: 400, status: 'Sinkron Sebagian' },
  { name: 'Kurikulum & CPL', localCount: 6, syncedCount: 6, unsynced: 0, status: 'Sinkron Penuh' },
  { name: 'Kelas Perkuliahan', localCount: 224, syncedCount: 224, unsynced: 0, status: 'Sinkron Penuh' }
];

// 3. OBE CPL MOCK
const INITIAL_CPL_LIST = [
  { code: 'CPL-01', desc: 'Kemampuan menerapkan ilmu dasar sains dan rekayasa komputer.', target: 80, averageAttainment: 83.5 },
  { code: 'CPL-02', desc: 'Mampu merancang dan melaksanakan eksperimen serta menganalisis data.', target: 75, averageAttainment: 78.2 },
  { code: 'CPL-03', desc: 'Mampu mendesain sistem, komponen, atau proses rekayasa perangkat lunak.', target: 80, averageAttainment: 81.4 },
  { code: 'CPL-04', desc: 'Mampu bekerja efektif dalam tim multidisiplin serta berkomunikasi.', target: 85, averageAttainment: 89.1 },
  { code: 'CPL-05', desc: 'Memiliki tanggung jawab etis, profesionalisme, dan pemahaman sosial.', target: 90, averageAttainment: 92.0 },
  { code: 'CPL-06', desc: 'Mampu menggunakan teknik dan tools rekayasa modern untuk IT.', target: 75, averageAttainment: 72.8 }
];

// 4. MBKM MOCK
const INITIAL_MBKM_STUDENTS = [
  { id: 'mbkm-1', name: 'Rian Hidayat', nim: '10123001', type: 'Magang Industri', partner: 'PT. Tokopedia Tbk', duration: '6 Bulan', conversionSks: 20, status: 'Aktif' },
  { id: 'mbkm-2', name: 'Siti Aminah', nim: '10123045', type: 'Pertukaran Pelajar', partner: 'Universitas Indonesia', duration: '1 Semester', conversionSks: 20, status: 'Diterima' },
  { id: 'mbkm-3', name: 'Fahri Alamsyah', nim: '10123112', type: 'Kampus Mengajar', partner: 'SDN 02 Baleendah', duration: '3 Bulan', conversionSks: 12, status: 'Selesai' },
  { id: 'mbkm-4', name: 'Clara Bella', nim: '10123190', type: 'Studi Independen Bersertifikat', partner: 'Dicoding Indonesia Academy', duration: '6 Bulan', conversionSks: 20, status: 'Aktif' },
  { id: 'mbkm-5', name: 'Devi Amanda', nim: '10123204', type: 'Proyek Kemanusiaan', partner: 'ACT Disaster Management', duration: '4 Bulan', conversionSks: 15, status: 'Draft' }
];

// 5. THESIS MOCK
const INITIAL_THESIS_PROPOSALS = [
  { id: 'tp-1', studentName: 'Aditya Pratama', nim: '10121010', title: 'Rancang Bangun Sistem Deteksi Hama Padi Berbasis CNN & IoT', advisor: 'Dr. Hendra Wijaya', examiner: 'Wawan Kuswara, M.T.', stage: 'Sidang Akhir', date: '2026-07-01', score: null },
  { id: 'tp-2', studentName: 'Nadia Putri', nim: '10121088', title: 'Implementasi Arsitektur Microservices pada Sistem Keuangan Kampus', advisor: 'Dr. Budi Rahardjo', examiner: 'Dra. Sri Hartati', stage: 'Seminar Hasil', date: '2026-06-29', score: null },
  { id: 'tp-3', studentName: 'Bagus Prakoso', nim: '10121102', title: 'Analisis Keamanan Jaringan WPA3 Menggunakan Metode Penetration Testing', advisor: 'Drs. Supriatna, M.T.', examiner: 'Dr. Hendra Wijaya', stage: 'Seminar Proposal', date: '2026-06-25', score: '84.5 (A)' },
  { id: 'tp-4', studentName: 'Eka Lestari', nim: '10121115', title: 'Optimasi Routing Protokol OSPF Menggunakan Algoritma Genetika', advisor: 'Wawan Kuswara, M.T.', examiner: 'Dr. Budi Rahardjo', stage: 'Pengajuan Judul', date: 'N/A', score: null }
];

// 11. Tiket helpdesk dimuat dari backend yang nyata (bukan mock)
interface HelpdeskTicketView {
  id: string;
  sender: string;
  category: string;
  title: string;
  priority: string;
  date: string;
  status: string;
}

// Terjemahan status tiket backend ke label UI helpdesk
function mapTicketStatus(status?: string): string {
  if (!status) return 'Terbuka';
  if (status.includes('el')) return 'Diselesaikan';
  if (status.includes('roses') || status.includes('ros')) return 'Diproses';
  return 'Terbuka';
}

// 12. SECURITY AUDIT LOGS
const SECURITY_LOGS = [
  { who: 'Hendra Wijaya (Admin)', action: 'Mengubah Bobot Penilaian OBE CPL-02', when: '2026-06-24 22:14', ip: '192.168.1.125', device: 'Chrome on Arch Linux' },
  { who: 'Sistem Auto-Gateway', action: 'Sinkronisasi Token LMS Canvas Berhasil', when: '2026-06-24 21:00', ip: '127.0.0.1 (Internal)', device: 'System Service' },
  { who: 'Ahmad Dahlan (Kaprodi SI)', action: 'Mengesahkan Kurikulum OBE 2026', when: '2026-06-24 18:30', ip: '10.233.15.91', device: 'Safari on macOS' },
  { who: 'Hendra Wijaya (Admin)', action: 'Eksport Data Borang Akreditasi Kriteria 4', when: '2026-06-24 14:12', ip: '192.168.1.125', device: 'Firefox on Linux' },
  { who: 'Devi Amanda (Mhs)', action: 'Login Gagal - Salah Password 3x berturut-turut', when: '2026-06-24 11:05', ip: '114.124.23.4', device: 'Chrome on Android' }
];

export function AdminEnterpriseSuiteModule({ activeTab, onShowToast }: AdminEnterpriseSuiteModuleProps) {
  // 1. Workflow Engine States
  const [workflowSteps, setWorkflowSteps] = useState(INITIAL_WORKFLOW_STEPS);
  const [newStepName, setNewStepName] = useState('');
  const [newStepRole, setNewStepRole] = useState('BAAK');
  const [wfSimulationResult, setWfSimulationResult] = useState<string[]>([]);
  const [isWfSimulating, setIsWfSimulating] = useState(false);

  // 2. PDDIKTI States
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // 3. OBE States
  const [cplList, setCplList] = useState(INITIAL_CPL_LIST);
  const [isObeModalOpen, setIsObeModalOpen] = useState(false);
  const [selectedCpl, setSelectedCpl] = useState<any>(null);

  // 4. MBKM States
  const [mbkmStudents, setMbkmStudents] = useState(INITIAL_MBKM_STUDENTS);
  const [mbkmFilter, setMbkmFilter] = useState('Semua');

  // 5. Thesis States
  const [thesisProposals, setThesisProposals] = useState(INITIAL_THESIS_PROPOSALS);
  const [proposalFilter, setProposalFilter] = useState('Semua');

  // 6. Scheduling conflict engine state
  const [schLecturer, setSchLecturer] = useState('Dr. Hendra Wijaya');
  const [schRoom, setSchRoom] = useState('Lab Komputer 01');
  const [schDay, setSchDay] = useState('Senin');
  const [schTime, setSchTime] = useState('08:00 - 10:30');
  const [schConflicts, setSchConflicts] = useState<string[]>([]);

  // 7. IoT Attendance Simulator states
  const [iotDevice, setIotDevice] = useState<'RFID' | 'Face' | 'QR' | 'Fingerprint'>('RFID');
  const [iotNIM, setIotNIM] = useState('10123001');
  const [iotLogs, setIotLogs] = useState<Array<{ time: string; type: string; details: string; status: string }>>([
    { time: '10:14:22', type: 'RFID Swiped', details: 'NIM 10123045 - Sukses Presensi Kelas Web B', status: 'SUKSES' },
    { time: '10:12:05', type: 'Face ID Cam-02', details: 'NIM 10123112 - Wajah Terverifikasi 98.4%', status: 'SUKSES' },
    { time: '10:05:11', type: 'QR Code App', details: 'NIM 10123001 - Session ID kadaluarsa', status: 'GAGAL' }
  ]);

  // 8. Notification states
  const [commChannel, setCommChannel] = useState<'Email' | 'SMS' | 'WhatsApp' | 'Push'>('WhatsApp');
  const [commMessage, setCommMessage] = useState('Pemberitahuan resmi: Nilai KHS semester ganjil Anda kini dapat diakses melalui portal SIAKAD.');
  const [commTarget, setCommTarget] = useState('Semua Mahasiswa');

  // 9. API Gateway & LMS
  const [apiKey, setApiKey] = useState('sk_siakad_prod_99aa8877bc991200fa');
  const [isLmsSyncing, setIsLmsSyncing] = useState(false);

  // 11. Helpdesk Ticketing States
  const [tickets, setTickets] = useState<HelpdeskTicketView[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReply, setTicketReply] = useState('');

  // 12. Security Config States
  const [isMfaActive, setIsMfaActive] = useState(true);
  const [rateLimitRequests, setRateLimitRequests] = useState(100);
  const [isIpLockActive, setIsIpLockActive] = useState(false);

  // NEW SUB-TAB STATES
  const [lifecycleSubTab, setLifecycleSubTab] = useState<'calendar' | 'cuti_mutasi' | 'drop_out' | 'yudisium_wisuda' | 'alumni'>('calendar');
  const [obeSubTab, setObeSubTab] = useState<'cpl' | 'cpmk' | 'rubric'>('cpl');
  const [schedulingSubTab, setSchedulingSubTab] = useState<'rooms' | 'inventaris' | 'exams' | 'auto_schedule'>('rooms');
  const [perkuliahanSubTab, setPerkuliahanSubTab] = useState<'krs_approval' | 'jurnal_mengajar' | 'monitoring_nilai'>('krs_approval');
  const [integrationSubTab, setIntegrationSubTab] = useState<'api_gateway' | 'perpustakaan' | 'hrd'>('api_gateway');
  const [accreditationSubTab, setAccreditationSubTab] = useState<'borang' | 'analytics' | 'executive'>('borang');
  const [securitySubTab, setSecuritySubTab] = useState<'audit' | 'rbac' | 'backup_restore' | 'finance_gateway'>('audit');

  // NEW WORKFLOW & TTE & DOCUMENT STATES
  const [selectedDocToSign, setSelectedDocToSign] = useState<string>('Surat Aktif Kuliah');
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [ttePasscode, setTtePasscode] = useState<string>('');
  const [documentRequests, setDocumentRequests] = useState([
    { id: 'doc-001', type: 'Surat Aktif Kuliah', requester: 'Reza Aditya (NIM 10123001)', date: '2026-06-25', status: 'Disetujui', pdfUrl: '#' },
    { id: 'doc-002', type: 'Surat Cuti Kuliah', requester: 'Siti Aminah (NIM 10123045)', date: '2026-06-24', status: 'Menunggu Verifikasi', pdfUrl: '#' },
    { id: 'doc-003', type: 'Surat Keterangan Lulus (SKL)', requester: 'Eka Lestari (NIM 10121115)', date: '2026-06-23', status: 'Diproses', pdfUrl: '#' }
  ]);

  // NEW ACADEMIC & LIFECYCLE STATES
  const [isSemesterActive, setIsSemesterActive] = useState<boolean>(true);
  const [newAnnTitle, setNewAnnTitle] = useState<string>('');
  const [newAnnContent, setNewAnnContent] = useState<string>('');
  const [announcements, setAnnouncements] = useState([
    { id: 'ann-1', title: 'Pendaftaran Herregistrasi Semester Ganjil 2026/2027', category: 'Akademik', date: '2026-06-25', sender: 'BAAK' },
    { id: 'ann-2', title: 'Pedoman Pelaksanaan Magang MBKM Batch 7', category: 'MBKM', date: '2026-06-24', sender: 'LPPM' },
    { id: 'ann-3', title: 'Panduan Pembayaran UKT menggunakan Virtual Account', category: 'Keuangan', date: '2026-06-23', sender: 'Direktorat Keuangan' }
  ]);
  const [calendarEvents, setCalendarEvents] = useState([
    { date: '1-10 Juli 2026', title: 'Pembayaran UKT & Herregistrasi Online' },
    { date: '12-20 Juli 2026', title: 'Pengisian KRS Online (Rencana Studi)' },
    { date: '1 September 2026', title: 'Awal Perkuliahan Semester Ganjil 2026/2027' },
    { date: '19-24 Oktober 2026', title: 'Ujian Tengah Semester (UTS)' }
  ]);
  const [cutiRequests, setCutiRequests] = useState([
    { id: 'cuti-1', name: 'Zulkifli Hasan', nim: '10123100', prodi: 'Teknik Informatika', reason: 'Alasan Kesehatan / Pemulihan Medis', status: 'Menunggu Persetujuan' },
    { id: 'cuti-2', name: 'Agus Salim', nim: '10123050', prodi: 'Sistem Informasi', reason: 'Fokus Bekerja / Alasan Ekonomi', status: 'Disetujui' }
  ]);
  const [doCandidates, setDoCandidates] = useState([
    { name: 'Kurniawan Prasetyo', nim: '10120015', prodi: 'Teknik Informatika', nonActiveSemesters: 4, lastActive: '2024 Ganjil', status: 'Peringatan SP3' },
    { name: 'Rahmat Hidayatullah', nim: '10119044', prodi: 'Sistem Informasi', nonActiveSemesters: 5, lastActive: '2023 Genap', status: 'Rekomendasi DO' }
  ]);
  const [yudisiumCandidates, setYudisiumCandidates] = useState([
    { id: 'yud-1', name: 'Dian Sastro', nim: '10121002', prodi: 'Teknik Informatika', gpa: 3.82, sksCompleted: true, libraryFree: true, financeCleared: true },
    { id: 'yud-2', name: 'Taufik Hidayat', nim: '10121045', prodi: 'Sistem Informasi', gpa: 3.15, sksCompleted: true, libraryFree: false, financeCleared: true },
    { id: 'yud-3', name: 'Susi Susanti', nim: '10121099', prodi: 'Teknik Informatika', gpa: 3.45, sksCompleted: true, libraryFree: true, financeCleared: false }
  ]);
  const [alumniTracerList, setAlumniTracerList] = useState([
    { name: 'Andi Wijaya, S.Kom.', graduationYear: '2025', company: 'PT. Goto Gojek Tokopedia', salaryRange: 'Rp 10jt - Rp 15jt', waitingTime: '2 Bulan' },
    { name: 'Rina Herlina, S.SI.', graduationYear: '2025', company: 'Accenture Indonesia', salaryRange: 'Rp 8jt - Rp 10jt', waitingTime: '3 Bulan' }
  ]);

  // NEW OBE CPMK STATES
  const [cpmkList, setCpmkList] = useState([
    { code: 'CPMK-01', course: 'Algoritma & Struktur Data', desc: 'Mampu mengimplementasikan berbagai struktur data non-linear (tree, graph).', weight: '30%', attainment: '84.2%' },
    { code: 'CPMK-02', course: 'Pemrograman Berorientasi Objek', desc: 'Mampu merancang aplikasi berbasis design pattern (MVC, Singleton).', weight: '25%', attainment: '79.5%' },
    { code: 'CPMK-03', course: 'Basis Data', desc: 'Mampu mengoptimalkan query SQL kompleks dan index tabel relasional.', weight: '20%', attainment: '81.1%' }
  ]);
  const [obeRubrics, setObeRubrics] = useState([
    { item: 'Tugas Praktikum', method: 'Rubrik Kinerja Coding', maxScore: 100, weight: '20%' },
    { item: 'Proyek Akhir', method: 'Rubrik Desain Perangkat Lunak', maxScore: 100, weight: '40%' },
    { item: 'Ujian Tulis', method: 'Studi Kasus & Analisis', maxScore: 100, weight: '40%' }
  ]);

  // NEW MBKM LOGBOOK STATES
  const [mbkmLogbook, setMbkmLogbook] = useState([
    { date: '2026-06-25', name: 'Rian Hidayat', activity: 'Melakukan deployment mikroservis payment ke Kubernetes staging', status: 'Approved' },
    { date: '2026-06-24', name: 'Rian Hidayat', activity: 'Menulis unit testing menggunakan Jest untuk modul auth', status: 'Approved' },
    { date: '2026-06-23', name: 'Siti Aminah', activity: 'Diskusi dengan pembimbing UI mengenai desain KRS mobile', status: 'Pending Approval' }
  ]);

  // NEW THESIS BIMBINGAN STATES
  const [thesisBimbinganLogs, setThesisBimbinganLogs] = useState([
    { date: '2026-06-24', student: 'Nadia Putri', note: 'Revisi Bab III bagian perancangan sistem mikroservis diperbaiki', status: 'Approved' },
    { date: '2026-06-21', student: 'Aditya Pratama', note: 'Hasil akurasi model CNN 95% sudah cukup baik, lanjutkan ke Bab IV', status: 'Approved' },
    { date: '2026-06-18', student: 'Bagus Prakoso', note: 'Ubah metodologi pengujian keamanan WPA3 agar menggunakan kuesioner tambahan', status: 'Revision Required' }
  ]);

  // NEW SCHEDULING OPERASIONAL STATES
  const [classroomList, setClassroomList] = useState([
    { name: 'Ruang Kelas 301', capacity: 40, features: 'AC, Proyektor, Glass Board', status: 'Tersedia' },
    { name: 'Ruang Kelas 302', capacity: 40, features: 'AC, Proyektor, Glass Board', status: 'Terpakai' },
    { name: 'Lab Komputer 01', capacity: 30, features: '30 PC High-End, AC, Proyektor', status: 'Tersedia' },
    { name: 'Lab RPL & AI', capacity: 25, features: '25 PC GPU, IoT Starter Kit, AC', status: 'Tersedia' }
  ]);
  const [classroomBookings, setClassroomBookings] = useState([
    { id: 'b-1', room: 'Ruang Kelas 302', booker: 'Himpunan Mahasiswa IF', date: '2026-06-25 13:00 - 15:00', purpose: 'Rapat Kerja Tahunan HMIF', status: 'Approved' },
    { id: 'b-2', room: 'Lab Komputer 01', booker: 'Siti Aminah', date: '2026-06-26 09:00 - 11:00', purpose: 'Uji Coba Algoritma Penelitian Mandiri', status: 'Pending' }
  ]);
  const [labInventories, setLabInventories] = useState([
    { item: 'Intel Xeon Workstation PC', lab: 'Lab Komputer 01', condition: 'Sangat Baik', qty: '30 Unit', lastChecked: '2026-06-15' },
    { item: 'NVIDIA RTX 4080 GPU PC', lab: 'Lab RPL & AI', condition: 'Baik', qty: '12 Unit', lastChecked: '2026-06-20' },
    { item: 'Epson LCD Projector 4K', lab: 'Ruang Kelas 302', condition: 'Perlu Servis', qty: '1 Unit', lastChecked: '2026-06-23' }
  ]);
  const [examSchedules, setExamSchedules] = useState([
    { course: 'Konsep Artificial Intelligence', date: '2026-07-15 08:00', type: 'UTS Ganjil', room: 'Lab Komputer 01', proctor: 'Dra. Sri Hartati' },
    { course: 'Rekayasa Perangkat Lunak', date: '2026-07-16 10:30', type: 'UTS Ganjil', room: 'Ruang Kelas 302', proctor: 'Dr. Hendra Wijaya' }
  ]);

  // NEW LECTURER & PERKULIAHAN STATES
  const [krsPendingList, setKrsPendingList] = useState([
    { id: 'krs-1', name: 'Andika Pratama', nim: '10124012', gpa: 3.42, totalSks: 24, status: 'Menunggu Approval Wali' },
    { id: 'krs-2', name: 'Citra Kirana', nim: '10124055', gpa: 2.85, totalSks: 20, status: 'Menunggu Approval Wali' }
  ]);
  const [jurnalMengajarLogs, setJurnalMengajarLogs] = useState([
    { date: '2026-06-22', course: 'Konsep AI - Kelas A', topic: 'Pengantar Artificial Neural Network (ANN)', attendanceCount: '28/30 Mahasiswa', bapStatus: 'Telah Ditandatangani TTE' },
    { date: '2026-06-15', course: 'Konsep AI - Kelas A', topic: 'Decision Tree & Random Forest Algorithm', attendanceCount: '30/30 Mahasiswa', bapStatus: 'Telah Ditandatangani TTE' }
  ]);
  const [monitoringNilaiList, setMonitoringNilaiList] = useState([
    { lecturer: 'Drs. Supriatna, M.T.', course: 'Jaringan Nirkabel C', examDate: '2026-06-18', daysOverdue: 7, status: 'BELUM MENGISI (Kirim Alert)' },
    { lecturer: 'Wawan Kuswara, M.T.', course: 'Sistem Embedded B', examDate: '2026-06-21', daysOverdue: 4, status: 'BELUM MENGISI (Kirim Alert)' }
  ]);

  // NEW INTEGRATION PERPUSTAKAAN & HRD STATES
  const [libraryBooks, setLibraryBooks] = useState([
    { id: 'lib-1', borrower: 'Andika Pratama (10124012)', bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship', loanDate: '2026-06-10', returnDueDate: '2026-06-17', overdueDays: 8, status: 'Denda Rp 8,000 (Belum Bebas Pustaka)' },
    { id: 'lib-2', borrower: 'Dian Sastro (10121002)', bookTitle: 'Introduction to Algorithms 4th Edition', loanDate: '2026-06-05', returnDueDate: '2026-06-12', overdueDays: 0, status: 'Telah Dikembalikan (Bebas Pustaka)' }
  ]);
  const [hrdStaffList, setHrdStaffList] = useState([
    { name: 'Dr. Hendra Wijaya', role: 'Dosen Tetap (Fungsional: Lektor Kepala)', baseSalary: 'Rp 14,500,000', fingerScanSync: '98.5% Kehadiran', status: 'Gaji Terbayarkan' },
    { name: 'Dra. Sri Hartati', role: 'Dosen Tetap (Fungsional: Lektor)', baseSalary: 'Rp 12,000,000', fingerScanSync: '96.2% Kehadiran', status: 'Gaji Terbayarkan' }
  ]);

  // NEW FINANCE & PAYMENT GATEWAY STATES
  const [uktInvoices, setUktInvoices] = useState([
    { id: 'inv-101', studentName: 'Andika Pratama', nim: '10124012', amount: 'Rp 7,500,000', billingPeriod: '2026 Ganjil', vaNumber: '9880010124012', status: 'Belum Terbayar' },
    { id: 'inv-102', studentName: 'Reza Aditya', nim: '10123001', amount: 'Rp 7,500,000', billingPeriod: '2026 Ganjil', vaNumber: '9880010123001', status: 'Lunas (Payment Gateway)' }
  ]);

  // NEW RBAC SYSTEM STATES
  const [rbacPermissions, setRbacPermissions] = useState([
    { module: 'Akademik & Nilai', admin: true, kaprodi: true, dekan: true, dosen: true, student: false },
    { module: 'Borang Akreditasi', admin: true, kaprodi: true, dekan: true, dosen: false, student: false },
    { module: 'Sistem Keuangan / VA', admin: true, kaprodi: false, dekan: false, dosen: false, student: false },
    { module: 'Pengaturan Security', admin: true, kaprodi: false, dekan: false, dosen: false, student: false }
  ]);

  // NEW BACKUP SYSTEM STATES
  const [backupHistory, setBackupHistory] = useState([
    { date: '2026-06-24 02:00', type: 'Full Database Dump', size: '1.42 GB', creator: 'System Auto-Task', status: 'Safe' },
    { date: '2026-06-23 02:00', type: 'Full Database Dump', size: '1.41 GB', creator: 'System Auto-Task', status: 'Safe' }
  ]);

  // Helper Toast trigger
  const handleActionToast = (msg: string) => {
    onShowToast(msg);
  };

  // Drag simulation / Add step for Workflow Engine
  const handleAddStep = () => {
    if (!newStepName.trim()) return;
    const newStep = {
      id: `step-${Date.now()}`,
      name: newStepName,
      role: newStepRole,
      duration: 'Max 3 Hari',
      required: true
    };
    setWorkflowSteps([...workflowSteps, newStep]);
    setNewStepName('');
    handleActionToast(`Langkah workflow "${newStep.name}" berhasil ditambahkan.`);
  };

  const handleRemoveStep = (id: string) => {
    setWorkflowSteps(workflowSteps.filter(s => s.id !== id));
    handleActionToast(`Langkah workflow berhasil dihapus.`);
  };

  const runWorkflowSimulation = () => {
    setIsWfSimulating(true);
    setWfSimulationResult([]);
    const logs: string[] = [];
    
    workflowSteps.forEach((step, idx) => {
      setTimeout(() => {
        logs.push(`[${new Date().toLocaleTimeString()}] ✔️ Disetujui oleh: ${step.name} (${step.role}) - Berkas diteruskan.`);
        setWfSimulationResult([...logs]);
        if (idx === workflowSteps.length - 1) {
          setIsWfSimulating(false);
          logs.push(`[${new Date().toLocaleTimeString()}] 🎉 Alur Berhasil Diselesaikan! Dokumen sah.`);
          setWfSimulationResult([...logs]);
          handleActionToast('Simulasi workflow penandatanganan sukses!');
        }
      }, (idx + 1) * 800);
    });
  };

  // Run PDDIKTI Sync Simulation
  const runPddiktiSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncLogs([]);
    const logs: string[] = ['Menghubungkan ke Web Service Neo Feeder Kemdikbud (pddikti.kemdikbud.go.id)...'];

    const steps = [
      'Menyinkronkan data instansi sekolah & kurikulum nasional...',
      'Mengunggah 4,820 biodata Mahasiswa Aktif...',
      'Mencocokkan profil 142 Dosen bersertifikasi nasional...',
      'Mengunggah Kartu Rencana Studi (KRS) semester ganjil...',
      'Mengunggah rekapitulasi nilai akhir semester...',
      'Sinkronisasi rampung! 12,310 data terupdate di server PDDIKTI.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSyncProgress((prev) => Math.min(prev + Math.floor(100 / steps.length), 100));
        logs.push(`[${new Date().toLocaleTimeString()}] ${step}`);
        setSyncLogs([...logs]);
        if (idx === steps.length - 1) {
          setIsSyncing(false);
          setSyncProgress(100);
          handleActionToast('Sinkronisasi database dengan PDDIKTI sukses!');
        }
      }, (idx + 1) * 900);
    });
  };

  // MBKM State updates
  const handleUpdateMbkmStatus = (id: string, newStatus: string) => {
    setMbkmStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    handleActionToast(`Status MBKM Mahasiswa berhasil diperbarui menjadi ${newStatus}.`);
  };

  // Thesis State updates
  const handleUpdateThesisStage = (id: string, newStage: string) => {
    setThesisProposals(prev => prev.map(p => p.id === id ? { ...p, stage: newStage } : p));
    handleActionToast(`Progress Skripsi berhasil dialihkan ke tahap ${newStage}.`);
  };

  // Conflict Engine Check
  const triggerConflictCheck = () => {
    // Basic simulation logic for conflicts
    const randomConflicts: string[] = [];
    if (schLecturer === 'Dr. Hendra Wijaya' && schDay === 'Senin' && schTime === '08:00 - 10:30') {
      randomConflicts.push(`🔴 BENTROK DOSEN: Dr. Hendra Wijaya memiliki jadwal lain pada kelas "Konsep AI B" di Lab 02.`);
    }
    if (schRoom === 'Lab Komputer 01' && schDay === 'Senin' && schTime === '08:00 - 10:30') {
      randomConflicts.push(`🔴 BENTROK RUANGAN: Lab Komputer 01 sedang dipesan oleh kelas "Sistem Operasi C" jam 08:00.`);
    }
    
    if (randomConflicts.length === 0) {
      handleActionToast(`Auto-Checking: Tidak ditemukan bentrok! Slot jadwal aman dimasukkan.`);
      setSchConflicts(['🟢 AMAN: Tidak ada bentrok jadwal dengan dosen, ruangan, maupun kelas mahasiswa lainnya.']);
    } else {
      setSchConflicts(randomConflicts);
    }
  };

  // RFID scan simulation
  const simulateIotScan = () => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newLog = {
      time: timestamp,
      type: `${iotDevice} Simulator`,
      details: `Scanning ID ${iotNIM} pada terminal gerbang Fakultas... Terkonfirmasi.`,
      status: 'SUKSES'
    };
    setIotLogs([newLog, ...iotLogs]);
    handleActionToast(`Simulasi Scan IoT (${iotDevice}) Sukses!`);
  };

  // Comm trigger
  const handleSendComm = () => {
    handleActionToast(`Mengirim broadcast ke ${commTarget} via ${commChannel}...`);
    setTimeout(() => {
      handleActionToast(`Broadcast berhasil! Terkirim ke 4,820 kontak.`);
    }, 1200);
  };

  // Helpdesk response submit
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReply.trim() || !selectedTicketId) return;
    updateTicketStatus(selectedTicketId, 'Diproses')
      .then(() => {
        setTickets(prev => prev.map(t => t.id === selectedTicketId ? { ...t, status: 'Diproses' } : t));
        handleActionToast('Respon bantuan dikirim ke sistem helpdesk.');
      })
      .catch(() => handleActionToast('Gagal mengirim respon. Coba lagi nanti.'));
    setTicketReply('');
    setSelectedTicketId(null);
  };

  // Muat tiket helpdesk nyata dari backend
  useEffect(() => {
    let cancelled = false;
    getTickets()
      .then((items) => {
        if (cancelled) return;
        setTickets(items.map((t) => ({
          id: t.id,
          sender: t.requesterName || 'Pengguna',
          category: t.status || 'Akademik',
          title: t.subject,
          priority: 'Sedang',
          date: t.createdAt || '—',
          status: mapTicketStatus(t.status),
        })));
      })
      .catch((err) => console.error('Gagal memuat tiket helpdesk:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. WORKFLOW APPROVAL ENGINE */}
      {activeTab === 'admin-workflow' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Workflow Approval Engine (Configurable)
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Tentukan urutan birokrasi verifikasi dokumen / persetujuan KRS dan Wisuda se-universitas secara dinamis.</p>
            </div>
            <button
              onClick={runWorkflowSimulation}
              disabled={isWfSimulating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-55 transition-colors"
            >
              <Play className="w-3.5 h-3.5" /> {isWfSimulating ? 'Sedang Simulasi...' : 'Mulai Simulasi Workflow'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Step Configurator */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-slate-400r">Tahapan Pengesahan Berjalan</h4>
              <div className="space-y-3">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">{step.name}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">Role Penanggungjawab: {step.role} &bull; SLA: {step.duration}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${step.required ? 'bg-amber-100/60 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-slate-100 text-slate-400'}`}>
                          {step.required ? 'Wajib' : 'Opsional'}
                        </span>
                        <button onClick={() => handleRemoveStep(step.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Step Drawer */}
              <div className="p-4 border border-dashed border-blue-200 dark:border-blue-900/50 rounded-2xl bg-blue-50/5 flex flex-col md:flex-row items-end gap-3 pt-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400r">Nama Jabatan Approval Baru</label>
                  <input
                    type="text"
                    value={newStepName}
                    onChange={(e) => setNewStepName(e.target.value)}
                    placeholder="Contoh: Staff BAAK Utama, Ketua LPPM"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-44 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400r">Role Terkait</label>
                  <select
                    value={newStepRole}
                    onChange={(e) => setNewStepRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="BAAK">BAAK</option>
                    <option value="Kaprodi">Kaprodi</option>
                    <option value="Dosen Wali">Dosen Wali</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Rektorat">Rektorat</option>
                  </select>
                </div>
                <button
                  onClick={handleAddStep}
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl text-xs font-extrabold flex items-center gap-1.5 h-10 w-full md:w-auto justify-center cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" /> Sisipkan
                </button>
              </div>
            </div>

            {/* Simulated Live Logs */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400r flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-500 animate-spin" /> Log Simulasi Transaksi
                </h4>
                <div className="font-mono text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 space-y-2 max-h-80 overflow-y-auto">
                  {wfSimulationResult.map((res, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 font-semibold">{res}</div>
                  ))}
                  {wfSimulationResult.length === 0 && (
                    <div className="text-center py-12 italic text-slate-400">Klik tombol "Mulai Simulasi Workflow" di atas untuk melihat penandatanganan dinamis secara otomatis.</div>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80 text-[10px] font-bold text-blue-500">
                Workflow Engine v3.1 &bull; Active Node
              </div>
            </div>
          </div>

          {/* ADDED SUB-MODULE: PENGAJUAN DOKUMEN ONLINE & TTE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* 1. Pengajuan Dokumen Online Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-400r flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" /> Pengajuan Dokumen Online & Verifikasi Berkas
                </h4>
                <button 
                  onClick={() => {
                    const newDoc = {
                      id: `doc-00${documentRequests.length + 1}`,
                      type: 'Transkrip Akademik Resmi',
                      requester: 'Andika Pratama (NIM 10124012)',
                      date: new Date().toISOString().split('T')[0],
                      status: 'Menunggu Verifikasi',
                      pdfUrl: '#'
                    };
                    setDocumentRequests([newDoc, ...documentRequests]);
                    handleActionToast('Simulasi pengajuan dokumen baru berhasil!');
                  }}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors"
                >
                  + Simulasi Ajukan Dokumen
                </button>
              </div>
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs font-sans font-semibold border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-[9px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-150 dark:border-slate-850">
                      <th className="py-2.5 px-3">Jenis Dokumen</th>
                      <th className="py-2.5 px-3">Pengaju</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {documentRequests.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3">
                          <div className="text-xs font-extrabold text-slate-800 dark:text-white">{doc.type}</div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">{doc.id} &bull; {doc.date}</div>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-300">{doc.requester}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            doc.status === 'Disetujui' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                            doc.status === 'Menunggu Verifikasi' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                            'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {doc.status !== 'Disetujui' ? (
                            <button 
                              onClick={() => {
                                setDocumentRequests(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'Disetujui' } : d));
                                handleActionToast(`Dokumen ${doc.id} disetujui secara resmi.`);
                              }}
                              className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-500 font-bold">Terverifikasi</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Tanda Tangan Elektronik (TTE) Card Simulator */}
            <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-4">
              <h4 className="text-xs font-bold text-slate-400r flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-500" /> Tanda Tangan Elektronik (TTE) & Digital Seal BSrE
              </h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Gunakan modul integrasi Sertifikat Digital BSrE untuk menyematkan stempel kriptografis QR Code ke dokumen surat resmi / ijazah kelulusan secara massal.
              </p>

              <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase block">Pilih Dokumen TTE</label>
                     <select 
                       value={selectedDocToSign} 
                       onChange={(e) => { setSelectedDocToSign(e.target.value); setIsSigned(false); }}
                       className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none"
                     >
                       <option value="Surat Aktif Kuliah">Surat Aktif Kuliah (PDF)</option>
                       <option value="Surat Keterangan Bebas Pustaka">Surat Bebas Pustaka (PDF)</option>
                       <option value="Surat Keterangan Lulus (SKL)">Surat Keterangan Lulus (PDF)</option>
                       <option value="Ijazah Kelulusan Digital">Ijazah Kelulusan S1 (PDF)</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase block">Passphrase TTE (Keamanan)</label>
                     <input 
                       type="password" 
                       value={ttePasscode} 
                       onChange={(e) => setTtePasscode(e.target.value)}
                       placeholder="PIN TTE Anda" 
                       className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none"
                     />
                   </div>
                 </div>

                 <button 
                   onClick={() => {
                     if (!ttePasscode) {
                       handleActionToast('⚠️ Gagal: TTE memerlukan Passphrase PIN keamanan Anda!');
                       return;
                     }
                     setIsSigned(true);
                     handleActionToast('🔑 Dokumen berhasil ditandatangani menggunakan sertifikat digital BSrE.');
                   }}
                   className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                 >
                   Bubuhkan Tanda Tangan Elektronik (TTE)
                 </button>

                 {isSigned && (
                   <div className="p-4 bg-white dark:bg-slate-950 border border-emerald-500/20 rounded-xl flex items-center gap-4 animate-fade-in">
                     <div className="p-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex-shrink-0">
                       <QrCode className="w-12 h-12 text-emerald-600" />
                     </div>
                     <div className="space-y-1">
                       <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-blackr">TTE BSrE Verified</span>
                       <h5 className="text-[11px] font-black text-slate-800 dark:text-white mt-1">Stempel Kriptografi Berhasil</h5>
                       <p className="text-[9px] text-slate-400 font-mono">ID-CERT: CERT-SIAKAD-BSR-9981881729A72</p>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PDDIKTI INTEGRATION */}
      {activeTab === 'admin-pddikti' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-sky-500" /> Pangkalan Data Pendidikan Tinggi (PDDIKTI) Integration
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Integrasikan data SIAKAD Kampus Anda secara real-time ke Pangkalan Data Nasional PDDIKTI Feeder & WS Kemdikbud.</p>
            </div>
            <button
              onClick={runPddiktiSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/10 cursor-pointer disabled:opacity-55 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Feeder PDDIKTI'}
            </button>
          </div>

          {/* Sync Progress Bar */}
          {isSyncing && (
            <div className="p-4 bg-sky-500/5 border border-sky-100 dark:border-sky-950/40 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-sky-700 dark:text-sky-400">
                <span>Mengunggah data ke Server Pusat PDDIKTI Kemdikbud...</span>
                <span>{syncProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full transition-colors duration-300" style={{ width: `${syncProgress}%` }} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Entity Table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans font-semibold">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Nama Entitas Data</th>
                    <th className="py-3 px-4 text-center">Jumlah SIAKAD</th>
                    <th className="py-3 px-4 text-center text-emerald-600">Terlaporkan</th>
                    <th className="py-3 px-4 text-center text-rose-600">Selisih</th>
                    <th className="py-3 px-4 text-right">Status Feeder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {PDDIKTI_ENTITIES.map((ent, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-white">{ent.name}</td>
                      <td className="py-3.5 px-4 text-center">{ent.localCount.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 text-center text-emerald-600">{ent.syncedCount.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 text-center text-rose-600 font-extrabold">{ent.unsynced}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${ent.status === 'Sinkron Penuh' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                          {ent.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sync Console Logs */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400r flex items-center gap-1.5 font-mono">
                  <Cpu className="w-4 h-4 text-sky-400" /> CLI Feeder Log
                </h4>
                <div className="font-mono text-[10px] leading-relaxed text-slate-400 space-y-2 max-h-80 overflow-y-auto">
                  {syncLogs.map((log, idx) => (
                    <div key={idx} className="border-l-2 border-sky-500 pl-2 py-0.5 text-slate-300 font-semibold">{log}</div>
                  ))}
                  {syncLogs.length === 0 && (
                    <div className="text-center py-12 italic text-slate-500">Menunggu proses sinkronisasi... Klik 'Sinkronisasi Feeder PDDIKTI' di atas.</div>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-900 text-[10px] font-bold text-sky-500 font-mono">
                API Version: v5.2 (Neo-Feeder v2026.1)
              </div>
            </div>
          </div>

          {/* ADDED SUB-MODULE: AKADEMIK & STUDENT LIFECYCLE */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400r flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-500" /> Akademik & Student Lifecycle Management
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Kelola status keaktifan kuliah, kalender, pengumuman, yudisium, wisuda hingga tracer study alumni.</p>
              </div>

              {/* Sub tabs switches */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'calendar', label: 'Kalender & Pengumuman' },
                  { id: 'cuti_mutasi', label: 'Cuti & Mutasi' },
                  { id: 'drop_out', label: 'DO Engine' },
                  { id: 'yudisium_wisuda', label: 'Yudisium & Wisuda' },
                  { id: 'alumni', label: 'Database Alumni' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setLifecycleSubTab(st.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${lifecycleSubTab === st.id ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab 1: Calendar & Announcements */}
            {lifecycleSubTab === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Academic Calendar List */}
                <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-4.5 h-4.5 text-sky-500" /> Kalender Akademik Resmi
                    </h5>
                    {/* Aktivasi Semester Button */}
                    <button 
                      onClick={() => {
                        setIsSemesterActive(!isSemesterActive);
                        handleActionToast(`Semester Ganjil 2026/2027 ${!isSemesterActive ? 'BERHASIL DIAKTIFKAN' : 'DINONAKTIFKAN'}. Portal KRS mahasiswa otomatis terupdate.`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-colors flex items-center gap-1 ${isSemesterActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSemesterActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {isSemesterActive ? 'Aktivasi: Aktif' : 'Aktivasi: Tutup'}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {calendarEvents.map((evt, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800 rounded-xl flex justify-between gap-3 text-xs font-semibold leading-relaxed">
                        <span className="text-slate-500 font-mono text-[10px] flex-shrink-0">{evt.date}</span>
                        <span className="text-slate-700 dark:text-slate-300 text-right">{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Announcement List & Form */}
                <div className="lg:col-span-2 space-y-4">
                  <h5 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-sky-500" /> Pengumuman Akademik & Broadcast Portal
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Add Announcement Form */}
                    <div className="p-4 border border-slate-150 dark:border-slate-800 rounded-xl space-y-3 bg-white dark:bg-slate-900">
                      <h6 className="text-[10px] font-bold text-slate-400r">Rilis Pengumuman Baru</h6>
                      <div className="space-y-2">
                        <input 
                          type="text"
                          placeholder="Judul Pengumuman"
                          value={newAnnTitle}
                          onChange={(e) => setNewAnnTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold outline-none focus:border-sky-500"
                        />
                        <textarea 
                          placeholder="Tulis ringkasan pengumuman di sini..."
                          value={newAnnContent}
                          onChange={(e) => setNewAnnContent(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold outline-none focus:border-sky-500 resize-none"
                        />
                        <button 
                          onClick={() => {
                            if (!newAnnTitle.trim()) return;
                            const newAnn = {
                              id: `ann-${Date.now()}`,
                              title: newAnnTitle,
                              category: 'Akademik',
                              date: new Date().toISOString().split('T')[0],
                              sender: 'BAAK'
                            };
                            setAnnouncements([newAnn, ...announcements]);
                            setNewAnnTitle('');
                            setNewAnnContent('');
                            handleActionToast('Pengumuman akademik berhasil diterbitkan ke mahasiswa & dosen!');
                          }}
                          className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Terbitkan Pengumuman
                        </button>
                      </div>
                    </div>

                    {/* Announcement list */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold text-slate-800 dark:text-white">{ann.title}</p>
                            <p className="text-[9px] text-slate-400 font-medium">Biro: {ann.sender} &bull; {ann.date}</p>
                          </div>
                          <span className="px-1.5 py-0.5 bg-sky-500/10 text-sky-600 rounded text-[8px] font-black uppercase flex-shrink-0">{ann.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Cuti & Mutasi */}
            {lifecycleSubTab === 'cuti_mutasi' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">Daftar Pengajuan Cuti Kuliah & Mutasi Prodi</h5>
                  <span className="text-[10px] text-slate-400 font-bold">Total Antrean: {cutiRequests.filter(c => c.status === 'Menunggu Persetujuan').length} Berkas</span>
                </div>
                <div className="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs font-sans font-semibold border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-[9px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-4">Nama Mahasiswa / NIM</th>
                        <th className="py-2.5 px-4">Program Studi</th>
                        <th className="py-2.5 px-4">Alasan Pengajuan</th>
                        <th className="py-2.5 px-4">Status Berkas</th>
                        <th className="py-2.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {cutiRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/40">
                          <td className="py-3 px-4">
                            <div className="text-xs font-extrabold text-slate-800 dark:text-white">{req.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIM. {req.nim}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{req.prodi}</td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-500" title={req.reason}>{req.reason}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${req.status === 'Disetujui' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {req.status !== 'Disetujui' ? (
                              <div className="flex gap-1.5 justify-end">
                                <button 
                                  onClick={() => {
                                    setCutiRequests(prev => prev.map(c => c.id === req.id ? { ...c, status: 'Disetujui' } : c));
                                    handleActionToast(`Surat Keputusan Cuti ${req.name} berhasil ditandatangani TTE.`);
                                  }}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[9px] font-bold cursor-pointer hover:bg-emerald-700"
                                >
                                  Setujui Cuti / Mutasi
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-emerald-500 font-black">SK Terbit</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Drop Out Engine */}
            {lifecycleSubTab === 'drop_out' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-rose-500/5 space-y-4">
                  <h5 className="text-xs font-extrabold text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-500" /> Drop Out (DO) Auto-Detector Engine
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Sistem memantau riwayat registrasi mahasiswa. Mahasiswa yang tidak herregistrasi & tidak mengajukan cuti selama &ge; 4 semester berturut-turut otomatis diklasifikasikan sebagai status jenuh (Warning Drop Out).
                  </p>
                  <button 
                    onClick={() => {
                      handleActionToast('Memindai database SIAKAD... Menemukan 2 mahasiswa terindikasi jenuh 4+ semester.');
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                  >
                    Jalankan Pemindaian DO
                  </button>
                </div>

                <div className="lg:col-span-2 overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs font-sans font-semibold border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-[9px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-4">Nama Mahasiswa / NIM</th>
                        <th className="py-2.5 px-4">Program Studi</th>
                        <th className="py-2.5 px-4 text-center">Semester Mangkir</th>
                        <th className="py-2.5 px-4 text-center">Aktif Terakhir</th>
                        <th className="py-2.5 px-4">Rekomendasi</th>
                        <th className="py-2.5 px-4 text-right">Aksi Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {doCandidates.map((cand, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40">
                          <td className="py-3 px-4">
                            <div className="text-xs font-extrabold text-slate-800 dark:text-white">{cand.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIM. {cand.nim}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{cand.prodi}</td>
                          <td className="py-3 px-4 text-center text-rose-600 font-black">{cand.nonActiveSemesters} Sem</td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono text-[10px]">{cand.lastActive}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 rounded text-[8px] font-black uppercase">{cand.status}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={() => {
                                handleActionToast(`Surat Peringatan & Panggilan herregistrasi dikirim ke email & WhatsApp ${cand.name}.`);
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[9px] font-bold cursor-pointer border border-slate-200"
                            >
                              Kirim Alert SP
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Yudisium & Wisuda */}
            {lifecycleSubTab === 'yudisium_wisuda' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <h5 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <GraduationCap className="w-5 h-5 text-sky-500" /> Verifikasi Persyaratan Kelulusan Yudisium & Wisuda
                  </h5>
                  <button 
                    onClick={() => handleActionToast('Menyetujui Yudisium 3 kandidat berstatus Lolos secara massal.')}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold"
                  >
                    Rilis SK Yudisium Massal
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs font-sans font-semibold border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-[9px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-4">Nama Mahasiswa / NIM</th>
                        <th className="py-2.5 px-4 text-center">IPK</th>
                        <th className="py-2.5 px-4 text-center">144 SKS Kelar?</th>
                        <th className="py-2.5 px-4 text-center">Bebas Pustaka?</th>
                        <th className="py-2.5 px-4 text-center">Keuangan Clear?</th>
                        <th className="py-2.5 px-4">Hasil Evaluasi</th>
                        <th className="py-2.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {yudisiumCandidates.map((cand) => {
                        const isEligible = cand.sksCompleted && cand.libraryFree && cand.financeCleared;
                        return (
                          <tr key={cand.id} className="hover:bg-slate-50/40">
                            <td className="py-3 px-4">
                              <div className="text-xs font-extrabold text-slate-800 dark:text-white">{cand.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIM. {cand.nim} &bull; {cand.prodi}</div>
                            </td>
                            <td className="py-3 px-4 text-center font-black text-slate-800 dark:text-white">{cand.gpa.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={cand.sksCompleted} 
                                onChange={(e) => {
                                  setYudisiumCandidates(prev => prev.map(y => y.id === cand.id ? { ...y, sksCompleted: e.target.checked } : y));
                                }}
                                className="w-3.5 h-3.5 rounded"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={cand.libraryFree} 
                                onChange={(e) => {
                                  setYudisiumCandidates(prev => prev.map(y => y.id === cand.id ? { ...y, libraryFree: e.target.checked } : y));
                                }}
                                className="w-3.5 h-3.5 rounded"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={cand.financeCleared} 
                                onChange={(e) => {
                                  setYudisiumCandidates(prev => prev.map(y => y.id === cand.id ? { ...y, financeCleared: e.target.checked } : y));
                                }}
                                className="w-3.5 h-3.5 rounded"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isEligible ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-600'}`}>
                                {isEligible ? 'Yudisium: Lolos' : 'Tertunda: Berkas Belum Siap'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isEligible ? (
                                <button 
                                  onClick={() => handleActionToast(`SK Kelulusan (SKL) & Nomor Registrasi Wisuda S1 diterbitkan untuk ${cand.name}.`)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[9px] font-bold hover:bg-emerald-700 cursor-pointer"
                                >
                                  Terbitkan SKL
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Review manual</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 5: Alumni (Tracer Study) */}
            {lifecycleSubTab === 'alumni' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tracer input simulator */}
                <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-4">
                  <h5 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Send className="w-4.5 h-4.5 text-sky-500" /> Kirim Survei Tracer Study Alumni
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Kumpulkan data sebaran karir alumni untuk pemenuhan borang Indikator Kinerja Utama (IKU-1) Perguruan Tinggi.
                  </p>
                  <button 
                    onClick={() => {
                      handleActionToast('Email blast kuesioner tracer study dikirim ke seluruh alumni lulusan 2025!');
                    }}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold"
                  >
                    Kirim Blast Kuesioner Alumni
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <h5 className="text-xs font-bold text-slate-400r">Hasil Pelacakan Karir Alumni (IKU-1)</h5>
                  <div className="overflow-x-auto border border-slate-150 dark:border-slate-850 rounded-2xl">
                    <table className="w-full text-left text-xs font-sans font-semibold border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 text-[9px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                          <th className="py-2.5 px-4">Nama Alumni</th>
                          <th className="py-2.5 px-4">Tahun Lulus</th>
                          <th className="py-2.5 px-4">Perusahaan / Institusi Tempat Kerja</th>
                          <th className="py-2.5 px-4">Rata-rata Pendapatan</th>
                          <th className="py-2.5 px-4">Masa Tunggu Kerja</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {alumniTracerList.map((al, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40">
                            <td className="py-3 px-4 text-slate-800 dark:text-white font-extrabold">{al.name}</td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{al.graduationYear}</td>
                            <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{al.company}</td>
                            <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-extrabold">{al.salaryRange}</td>
                            <td className="py-3 px-4 font-black text-emerald-600 dark:text-emerald-400">{al.waitingTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. OUTCOME BASED EDUCATION (OBE) */}
      {activeTab === 'admin-obe' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Outcome-Based Education (OBE) Assessment Panel
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Petakan Capaian Pembelajaran Lulusan (CPL) ke Capaian Pembelajaran Mata Kuliah (CPMK) untuk pemenuhan kualifikasi akreditasi mutu nasional.</p>
            </div>
            
            {/* Sub-tab Switchers */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
              {[
                { id: 'cpl', label: 'CPL Utama' },
                { id: 'cpmk', label: 'Pencapaian CPMK' },
                { id: 'rubric', label: 'Rubrik Penilaian' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setObeSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${obeSubTab === sub.id ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {obeSubTab === 'cpl' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CPL Lists */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400r">Capaian Pembelajaran Lulusan (CPL) Utama</h4>
                <div className="space-y-3">
                  {cplList.map((cpl) => (
                    <div key={cpl.code} className="p-4 bg-slate-50 dark:bg-slate-950/15 border border-slate-150 dark:border-slate-800/80 rounded-2xl space-y-2 font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">{cpl.code}</span>
                        <span className="text-[10px] font-bold text-slate-400">Target BAN-PT: {cpl.target}%</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{cpl.desc}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${cpl.averageAttainment}%` }} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-white">Rata-rata: {cpl.averageAttainment}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart Visual */}
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-inner flex flex-col justify-between gap-4">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-black text-slate-800 dark:text-whiter">Radar Grafik Pemenuhan Mutu CPL</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Batas minimal ketercapaian borang (BPMN) adalah 75%.</p>
                </div>

                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={cplList}>
                      <PolarGrid stroke="#cbd5e1" className="dark:opacity-10" />
                      <PolarAngleAxis dataKey="code" tick={{ fontSize: 9, fill: 'var(--color-ink-muted)' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                      <Radar name="Ketercapaian Rata-Rata" dataKey="averageAttainment" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                      <Radar name="Target Minimum" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-200/20 text-[10px] text-amber-800 dark:text-amber-400 font-semibold leading-relaxed">
                  📢 <strong>MUTU AKADEMIK:</strong> Capaian <span className="underline font-bold">CPL-06</span> saat ini di bawah target (72.8% dari target 75%). Mohon lakukan penyesuaian asesmen tugas praktikum di Lab RPL.
                </div>
              </div>
            </div>
          )}

          {obeSubTab === 'cpmk' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h4 className="text-xs font-bold text-slate-400r">Pemetaan &amp; Ketercapaian CPMK Kuliah</h4>
                <button
                  onClick={() => {
                    onShowToast('Menyinkronkan data nilai tugas, UTS, UAS ke CPMK...');
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Sinkronisasi Nilai Akhir ke CPMK
                </button>
              </div>

              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs font-sans font-semibold text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-400 font-black uppercase border-b border-slate-150 dark:border-slate-800">
                      <th className="py-2.5 px-4">Mata Kuliah</th>
                      <th className="py-2.5 px-4">Kode CPMK</th>
                      <th className="py-2.5 px-4">Deskripsi Capaian Pembelajaran</th>
                      <th className="py-2.5 px-4 text-center">Hubungan CPL</th>
                      <th className="py-2.5 px-4 text-center">Target</th>
                      <th className="py-2.5 px-4 text-center">Rata-rata Capaian</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {[
                      { mk: 'Pemrograman Web B', kode: 'CPMK-1', desc: 'Mampu mendesain dan mendeploy aplikasi web dengan arsitektur modern.', cpl: 'CPL-03', target: '80%', avg: '84.2%', ok: true },
                      { mk: 'Basis Data A', kode: 'CPMK-2', desc: 'Mampu merancang database relasional dan melakukan query SQL kompleks.', cpl: 'CPL-01', target: '75%', avg: '79.1%', ok: true },
                      { mk: 'Rekayasa Perangkat Lunak', kode: 'CPMK-3', desc: 'Mampu membuat perancangan software terstruktur dengan diagram UML.', cpl: 'CPL-03', target: '80%', avg: '81.4%', ok: true },
                      { mk: 'Keamanan Informasi C', kode: 'CPMK-4', desc: 'Mampu mendeteksi kerentanan jaringan dan melakukan hardening protokol.', cpl: 'CPL-06', target: '75%', avg: '72.8%', ok: false }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="py-3.5 px-4">
                          <p className="font-extrabold text-slate-800 dark:text-white">{row.mk}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-600">{row.kode}</td>
                        <td className="py-3.5 px-4 max-w-xs text-slate-500 leading-relaxed font-semibold">{row.desc}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">{row.cpl}</td>
                        <td className="py-3.5 px-4 text-center text-slate-500">{row.target}</td>
                        <td className="py-3.5 px-4 text-center font-black text-slate-800 dark:text-white">{row.avg}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${row.ok ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                            {row.ok ? 'Memenuhi' : 'Dibawah Target'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {obeSubTab === 'rubric' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add form */}
              <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/10 dark:bg-slate-950/10 space-y-4 h-fit">
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-500" /> Buat Rubrik Penilaian Baru
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Nama Rubrik</label>
                    <input type="text" placeholder="Contoh: Rubrik Proyek Akhir Web" className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Metode Penilaian</label>
                    <select className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none">
                      <option>Proyek Praktikum (70% Demo, 30% Laporan)</option>
                      <option>Presentasi & Keaktifan (50% Tanya Jawab, 50% Slide)</option>
                      <option>Ujian Tulis Esai (Rubrik Penilaian Kualitatif)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      onShowToast('Rubrik penilaian berhasil dibuat dan ditambahkan ke master kurikulum.');
                    }}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    Tambah Rubrik Asesmen
                  </button>
                </div>
              </div>

              {/* Rubric lists */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-slate-400r">Master Rubrik Penilaian Terdaftar</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Rubrik Proyek Akhir Pemrograman Web B', method: 'Proyek Kelompok', items: 'Fungsionalitas (40%), Desain & UI (20%), Code Quality (20%), Dokumentasi (20%)' },
                    { title: 'Rubrik Presentasi Proposal Skripsi', method: 'Sidang Akademik', items: 'Metodologi Penelitian (35%), Penguasaan Teori (35%), Sistematika Slide (30%)' },
                    { title: 'Rubrik Evaluasi Kinerja Magang MBKM', method: 'Asesmen Mitra & Kampus', items: 'Kinerja di Mitra (40%), Logbook Harian (30%), Laporan Akhir Magang (30%)' }
                  ].map((rub, idx) => (
                    <div key={idx} className="p-4 border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950/20 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-black text-slate-800 dark:text-white">{rub.title}</span>
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[8px] font-blackr">{rub.method}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        <strong>Kriteria Bobot:</strong> {rub.items}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MBKM PORTAL */}
      {activeTab === 'admin-mbkm' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" /> Merdeka Belajar Kampus Merdeka (MBKM) Management
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Kelola mahasiswa magang, pertukaran pelajar, serta program konversi nilai 20 SKS MBKM Kemendikbudristek.</p>
            </div>
            {/* Simple filters */}
            <div className="flex gap-1.5">
              {['Semua', 'Aktif', 'Diterima', 'Selesai'].map((f) => (
                <button
                  key={f}
                  onClick={() => setMbkmFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${mbkmFilter === f ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans font-semibold">
              <thead>
                <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Nama Mahasiswa / NIM</th>
                  <th className="py-3 px-4">Jenis Program</th>
                  <th className="py-3 px-4">Mitra Kampus / Industri</th>
                  <th className="py-3 px-4">Durasi Sesi</th>
                  <th className="py-3 px-4 text-center text-emerald-600">Konversi SKS</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mbkmStudents
                  .filter(s => mbkmFilter === 'Semua' || s.status === mbkmFilter)
                  .map((stud) => (
                    <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>{stud.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIM. {stud.nim}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">{stud.type}</td>
                      <td className="py-3.5 px-4">{stud.partner}</td>
                      <td className="py-3.5 px-4">{stud.duration}</td>
                      <td className="py-3.5 px-4 text-center font-black">{stud.conversionSks} SKS</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          stud.status === 'Selesai' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                          stud.status === 'Aktif' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                          stud.status === 'Diterima' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {stud.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {stud.status === 'Diterima' ? (
                          <button onClick={() => handleUpdateMbkmStatus(stud.id, 'Aktif')} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm">
                            Mulai Kuliah
                          </button>
                        ) : stud.status === 'Aktif' ? (
                          <button onClick={() => handleUpdateMbkmStatus(stud.id, 'Selesai')} className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm">
                            Selesaikan & Konversi SKS
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. THESIS & FINAL PROJECT WORKFLOW */}
      {activeTab === 'admin-thesis' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" /> Skripsi, Tesis, & Sidang Akhir Workflow
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Tinjau usulan judul skripsi mahasiswa, atur pembimbing/penguji, serta kelola penjadwalan sidang kelulusan.</p>
            </div>
            {/* Filter */}
            <div className="flex gap-1.5">
              {['Semua', 'Pengajuan Judul', 'Seminar Proposal', 'Seminar Hasil', 'Sidang Akhir'].map((f) => (
                <button
                  key={f}
                  onClick={() => setProposalFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${proposalFilter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans font-semibold">
              <thead>
                <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Nama Mahasiswa / NIM</th>
                  <th className="py-3 px-4">Judul Penelitian Skripsi</th>
                  <th className="py-3 px-4">Dosen Pembimbing</th>
                  <th className="py-3 px-4">Dosen Penguji</th>
                  <th className="py-3 px-4">Tahapan</th>
                  <th className="py-3 px-4">Jadwal Sidang</th>
                  <th className="py-3 px-4 text-right">Aksi Alur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {thesisProposals
                  .filter(p => proposalFilter === 'Semua' || p.stage === proposalFilter)
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>{p.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIM. {p.nim}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs font-extrabold line-clamp-2 mt-2 leading-relaxed" title={p.title}>"{p.title}"</td>
                      <td className="py-3.5 px-4">{p.advisor}</td>
                      <td className="py-3.5 px-4">{p.examiner}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500/15 text-blue-600 dark:text-blue-400">
                          {p.stage}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[10px]">{p.date}</td>
                      <td className="py-3.5 px-4 text-right">
                        {p.stage === 'Pengajuan Judul' ? (
                          <button onClick={() => handleUpdateThesisStage(p.id, 'Seminar Proposal')} className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-700 transition-colors">
                            Verifikasi & Atur Sempro
                          </button>
                        ) : p.stage === 'Seminar Proposal' ? (
                          <button onClick={() => handleUpdateThesisStage(p.id, 'Seminar Hasil')} className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-amber-700 transition-colors">
                            Teruskan ke Semhas
                          </button>
                        ) : p.stage === 'Seminar Hasil' ? (
                          <button onClick={() => handleUpdateThesisStage(p.id, 'Sidang Akhir')} className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-emerald-700 transition-colors">
                            Jadwalkan Sidang Kelulusan
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1"><CheckCircle className="w-3.5 h-3.5" /> Lulus</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SCHEDULING CONFLICT ENGINE */}
      {activeTab === 'admin-scheduling' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" /> Scheduling Engine &amp; Conflict Detector
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Cegah jadwal kuliah ganda (bentrok) untuk dosen yang sama, kelas mahasiswa yang sama, maupun ketersediaan ruangan sebelum merilis jadwal kuliah.</p>
            </div>
            
            {/* Sub Tabs Switces */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 h-fit">
              {[
                { id: 'rooms', label: 'Ruangan & Booking' },
                { id: 'inventaris', label: 'Inventaris Lab' },
                { id: 'exams', label: 'Jadwal Ujian' },
                { id: 'auto_schedule', label: 'Conflict Engine & Simulator' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSchedulingSubTab(st.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${schedulingSubTab === st.id ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-tab 1: Ruangan & Booking */}
          {schedulingSubTab === 'rooms' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Classroom list */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-slate-400r">Daftar Ruang Kuliah &amp; Status Ketersediaan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classroomList.map((room, idx) => (
                    <div key={idx} className="p-4 border border-slate-150 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" /> {room.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${room.status === 'Tersedia' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                          {room.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium"><strong>Fasilitas:</strong> {room.features}</p>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold">Kapasitas Maks:</span>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">{room.capacity} Mahasiswa</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400r">Log Riwayat Booking Ruang</h4>
                  <div className="space-y-3">
                    {classroomBookings.map((booking) => (
                      <div key={booking.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-800 dark:text-white">{booking.purpose}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Ruang: {booking.room} &bull; Peminjam: {booking.booker}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600 animate-pulse'}`}>
                            {booking.status}
                          </span>
                          <p className="text-[9px] text-slate-400 mt-1 font-mono font-bold">{booking.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/10 dark:bg-slate-950/10 space-y-4 h-fit">
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-rose-500" /> Ajukan Booking Ruangan
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Nama Ruangan</label>
                    <select id="booking-room" className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none">
                      {classroomList.map((r, i) => <option key={i} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Tujuan Peminjaman</label>
                    <input id="booking-purpose" type="text" placeholder="Contoh: Kuliah Pengganti Aljabar" className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Pemohon / Penanggung Jawab</label>
                    <input id="booking-booker" type="text" placeholder="Contoh: HMIF / Dr. Hendra" className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Tanggal &amp; Waktu</label>
                    <input id="booking-date" type="text" placeholder="Contoh: 2026-06-27 10:00 - 12:00" className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none" />
                  </div>
                  <button
                    onClick={() => {
                      const r = (document.getElementById('booking-room') as HTMLSelectElement)?.value || 'Ruang Kelas 301';
                      const p = (document.getElementById('booking-purpose') as HTMLInputElement)?.value || 'Kuliah Tambahan';
                      const b = (document.getElementById('booking-booker') as HTMLInputElement)?.value || 'Dosen Pengampu';
                      const d = (document.getElementById('booking-date') as HTMLInputElement)?.value || '2026-06-27 13:00 - 15:00';
                      setClassroomBookings(prev => [
                        ...prev,
                        { id: `b-${Date.now()}`, room: r, booker: b, date: d, purpose: p, status: 'Pending' }
                      ]);
                      onShowToast('Permohonan booking ruangan berhasil diajukan dan menunggu persetujuan BAAK.');
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    Ajukan Ruang Kuliah
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Inventaris Lab */}
          {schedulingSubTab === 'inventaris' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-400r">Aset &amp; Inventaris Lab Terdaftar</h4>
                <button
                  onClick={() => onShowToast('Mengekspor daftar inventaris seluruh laboratorium komputer ke PDF...')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Ekspor Berkas Aset
                </button>
              </div>

              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs font-sans font-semibold text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-400 font-black uppercase border-b border-slate-150 dark:border-slate-800">
                      <th className="py-2.5 px-4">Nama Aset / Peralatan</th>
                      <th className="py-2.5 px-4">Laboratorium</th>
                      <th className="py-2.5 px-4">Jumlah Terdaftar</th>
                      <th className="py-2.5 px-4">Kondisi Aset</th>
                      <th className="py-2.5 px-4">Tanggal Audit Terakhir</th>
                      <th className="py-2.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {labInventories.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="py-3.5 px-4">
                          <p className="font-extrabold text-slate-800 dark:text-white">{inv.item}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono font-bold">{inv.lab}</td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-extrabold">{inv.qty}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${inv.condition === 'Sangat Baik' ? 'bg-emerald-500/10 text-emerald-600' : inv.condition === 'Baik' ? 'bg-blue-500/10 text-blue-600' : 'bg-red-500/10 text-red-600'}`}>
                            {inv.condition}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-semibold">{inv.lastChecked}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onShowToast(`Pengajuan perawatan/servis berkala untuk ${inv.item} berhasil dibuat.`)}
                            className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/40 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-rose-100"
                          >
                            Ajukan Servis
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Jadwal Ujian */}
          {schedulingSubTab === 'exams' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-400r">Jadwal Ujian Tengah Semester (UTS) &amp; Akhir Semester (UAS)</h4>
                <button
                  onClick={() => {
                    const courses = ['Basis Data A', 'Keamanan Jaringan B', 'Aljabar Linier C'];
                    const rooms = ['Lab Komputer 02', 'Ruang Kelas 301'];
                    const proctors = ['Dr. Budi Rahardjo', 'Dra. Sri Hartati'];
                    const randomCourse = courses[Math.floor(Math.random() * courses.length)];
                    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
                    const randomProctor = proctors[Math.floor(Math.random() * proctors.length)];
                    setExamSchedules(prev => [
                      ...prev,
                      { course: randomCourse, date: '2026-07-18 09:00', type: 'UTS Ganjil', room: randomRoom, proctor: randomProctor }
                    ]);
                    onShowToast(`Sistem berhasil memplot jadwal ujian otomatis untuk ${randomCourse} di ${randomRoom}.`);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Plot Jadwal Ujian Otomatis
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examSchedules.map((exam, idx) => (
                  <div key={idx} className="p-4 border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950/25 rounded-2xl flex flex-col justify-between gap-4 shadow-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 rounded text-[8px] font-blackr">{exam.type}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-extrabold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {exam.date}</span>
                      </div>
                      <h5 className="text-xs font-black text-slate-800 dark:text-white">{exam.course}</h5>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
                        <p><strong>Ruangan:</strong> {exam.room}</p>
                        <p><strong>Pengawas:</strong> {exam.proctor}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setExamSchedules(prev => prev.filter((_, i) => i !== idx));
                        onShowToast('Jadwal ujian berhasil dihapus dari sistem penjadwalan.');
                      }}
                      className="text-right text-[10px] font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1 self-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Jadwal
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 4: Conflict Engine Simulator */}
          {schedulingSubTab === 'auto_schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Schedule Form */}
              <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-4">
                <h4 className="text-xs font-bold text-slate-400r">Simulasi Tambah Jadwal Baru</h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400r">Pilih Dosen Pengajar</label>
                  <select
                    value={schLecturer}
                    onChange={(e) => setSchLecturer(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="Dr. Hendra Wijaya">Dr. Hendra Wijaya</option>
                    <option value="Dra. Sri Hartati">Dra. Sri Hartati</option>
                    <option value="Dr. Budi Rahardjo">Dr. Budi Rahardjo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400r">Pilih Ruang Kelas</label>
                  <select
                    value={schRoom}
                    onChange={(e) => setSchRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="Lab Komputer 01">Lab Komputer 01</option>
                    <option value="Lab Komputer 02">Lab Komputer 02</option>
                    <option value="Ruang Kelas 302">Ruang Kelas 302</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Hari</label>
                    <select
                      value={schDay}
                      onChange={(e) => setSchDay(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none"
                    >
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r">Waktu Sesi</label>
                    <select
                      value={schTime}
                      onChange={(e) => setSchTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none"
                    >
                      <option value="08:00 - 10:30">08:00 - 10:30</option>
                      <option value="10:30 - 13:00">10:30 - 13:00</option>
                      <option value="13:00 - 15:30">13:00 - 15:30</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={triggerConflictCheck}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" /> Deteksi Bentrok Jadwal
                </button>
              </div>

              {/* Checker Screen Outputs */}
              <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400r">Hasil Audit Konflik Alokasi Sumber Daya</h4>
                  <div className="space-y-3 font-semibold text-xs leading-relaxed">
                    {schConflicts.map((conf, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${conf.includes('🔴') ? 'bg-red-500/5 border-red-200/20 text-red-600 dark:text-red-400' : 'bg-emerald-500/5 border-emerald-200/20 text-emerald-600 dark:text-emerald-400'}`}>
                        {conf}
                      </div>
                    ))}
                    {schConflicts.length === 0 && (
                      <div className="text-center py-12 text-slate-400 font-medium">Ubah isian formulir di sebelah kiri dan klik "Deteksi Bentrok Jadwal" untuk menjalankan mesin validasi bentrok.</div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200/40 rounded-xl text-[10px] text-slate-500 leading-relaxed font-semibold">
                  💡 <strong>TIPS ENTERPRISE:</strong> Untuk memicu bentrok dalam simulasi, coba pilih Dosen: <strong className="text-slate-700 dark:text-slate-300">"Dr. Hendra Wijaya"</strong>, Hari: <strong className="text-slate-700 dark:text-slate-300">"Senin"</strong>, dan Jam: <strong className="text-slate-700 dark:text-slate-300 font-bold">"08:00 - 10:30"</strong>.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. IOT ATTENDANCE SYSTEM */}
      {activeTab === 'admin-attendance-iot' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-500 animate-pulse" /> IoT Attendance System (Terminal Simulator)
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Simulasikan presensi kelas mahasiswa secara otomatis menggunakan hardware RFID Card Reader, Face Recognition Camera, maupun QR Scanner di gerbang ruang kuliah.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulator Controls */}
            <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-5">
              <h4 className="text-xs font-bold text-slate-400r">Device Hardware Control Panel</h4>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400r block">Jenis Terminal IoT Terkoneksi</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'RFID', label: 'RFID Reader', icon: CreditCard },
                    { id: 'Face', label: 'Face Cam', icon: Camera },
                    { id: 'QR', label: 'QR Scanner', icon: QrCode },
                    { id: 'Fingerprint', label: 'Fingerprint', icon: UserCheck }
                  ].map((dev) => {
                    const Icon = dev.icon;
                    return (
                      <button
                        key={dev.id}
                        onClick={() => setIotDevice(dev.id as any)}
                        className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${iotDevice === dev.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'}`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        <span>{dev.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400r">Masukkan NIM Mahasiswa / Nomor Kartu</label>
                <input
                  type="text"
                  value={iotNIM}
                  onChange={(e) => setIotNIM(e.target.value)}
                  placeholder="Contoh: 10123001"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={simulateIotScan}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Kirim Trigger Sinyal IoT
              </button>
            </div>

            {/* IoT Real-time Stream logs */}
            <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-900 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400r flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real-time IoT MQTT Logs
                </h4>
                <div className="font-mono text-[10px] space-y-2 max-h-72 overflow-y-auto">
                  {iotLogs.map((log, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 flex items-center justify-between text-slate-300 font-semibold gap-3">
                      <div>
                        <span className="text-slate-500">[{log.time}]</span> <span className="text-emerald-500">[{log.type}]</span> {log.details}
                      </div>
                      <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded ${log.status === 'SUKSES' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-bold font-mono">
                MQTT Broker: mqtt.siakad-iot.itb.ac.id &bull; Status: Online (Listening)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. COMMUNICATION CENTER */}
      {activeTab === 'admin-comm-center' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-500" /> Unified Communication Center (Broadcast)
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Kirim pemberitahuan massal ke ribuan civitas akademika melalui integrasi Email SMTP, SMS Gateway, dan WhatsApp API.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400r block">Media Pengiriman</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'WhatsApp', label: 'WA', icon: MessageSquare },
                      { id: 'Email', label: 'Mail', icon: Mail },
                      { id: 'SMS', label: 'SMS', icon: Smartphone },
                      { id: 'Push', label: 'Push', icon: Compass }
                    ].map((chan) => (
                      <button
                        key={chan.id}
                        type="button"
                        onClick={() => setCommChannel(chan.id as any)}
                        className={`p-2.5 border rounded-xl flex flex-col items-center gap-1.5 text-[10px] font-bold cursor-pointer transition-colors ${commChannel === chan.id ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100/50'}`}
                      >
                        <chan.icon className="w-4 h-4" />
                        <span>{chan.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400r block">Target Penerima</label>
                  <select
                    value={commTarget}
                    onChange={(e) => setCommTarget(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
                  >
                    <option value="Semua Mahasiswa">Semua Mahasiswa (4,820 Orang)</option>
                    <option value="Dosen Tetap">Dosen Tetap & LB (142 Orang)</option>
                    <option value="Mahasiswa Baru 2026">Mahasiswa Baru Angkatan 2026</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400r block">Isi Pesan Siaran</label>
                <textarea
                  value={commMessage}
                  onChange={(e) => setCommMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={handleSendComm}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Kirim Pengumuman Massal
              </button>
            </div>

            {/* Comm previews */}
            <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400r">Live Preview di Perangkat Handphone</h4>
                <div className="mx-auto w-48 border-[6px] border-slate-800 rounded-[2rem] bg-slate-100 p-3 shadow-xl aspect-[9/16] relative flex flex-col">
                  {/* Phone speaker */}
                  <div className="w-16 h-3 bg-slate-800 mx-auto rounded-full mb-3" />
                  
                  {/* WA bubble mockup */}
                  {commChannel === 'WhatsApp' ? (
                    <div className="bg-emerald-100 dark:bg-emerald-950/25 p-2 rounded-xl border border-emerald-200/40 text-[9px] text-slate-800 font-semibold space-y-1">
                      <div className="text-emerald-700 font-extrabold font-mono uppercase text-[7px]">SIAKAD WA Gateway</div>
                      <p className="leading-snug">{commMessage}</p>
                    </div>
                  ) : commChannel === 'Email' ? (
                    <div className="bg-white p-2 rounded-xl border border-slate-200 text-[9px] text-slate-800 font-semibold space-y-1">
                      <div className="text-blue-600 font-extrabold font-sans text-[7px]">📧 Akademik Rektorat</div>
                      <p className="leading-snug">{commMessage}</p>
                    </div>
                  ) : (
                    <div className="bg-blue-100 p-2 rounded-xl border border-blue-200 text-[9px] text-slate-800 font-semibold space-y-1">
                      <div className="text-blue-700 font-extrabold font-sans text-[7px]">💬 SMS Push</div>
                      <p className="leading-snug">{commMessage}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-2 text-center text-[9px] font-bold text-slate-400">
                Penyedia Utama: Twilio, WA Business API, SendGrid API
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. API GATEWAY & LMS SINKRON */}
      {activeTab === 'admin-api-gateway' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" /> Enterprise API Gateway & LMS Sync
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Integrasikan pangkalan data SIAKAD dengan LMS (Moodle, Canvas, Google Classroom) serta buat API Key pihak ketiga.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Credentials */}
            <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-4">
              <h4 className="text-xs font-bold text-slate-400r">Client API Access Token</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">X-API-KEY Utama</span>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                    />
                    <button onClick={() => { navigator.clipboard.writeText(apiKey); handleActionToast('Token disalin!'); }} className="px-3 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300">Copy</button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Alamat Endpoints REST API</span>
                  <ul className="space-y-1.5 font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <li className="flex justify-between items-center bg-slate-100 dark:bg-slate-950 p-2 rounded-lg">
                      <span className="text-emerald-600">GET /api/v1/students</span>
                      <span>List Mahasiswa</span>
                    </li>
                    <li className="flex justify-between items-center bg-slate-100 dark:bg-slate-950 p-2 rounded-lg">
                      <span className="text-emerald-600">GET /api/v1/courses</span>
                      <span>Kurikulum & Matkul</span>
                    </li>
                    <li className="flex justify-between items-center bg-slate-100 dark:bg-slate-950 p-2 rounded-lg">
                      <span className="text-blue-600">POST /api/v1/grades</span>
                      <span>Update Nilai KHS</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* LMS Synchronizer */}
            <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400r flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-emerald-500" /> LMS Integrator (Moodle / Canvas Sync)
                </h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Secara otomatis membuat ruang kelas perkuliahan, mendaftarkan akun mahasiswa, dan mengambil nilai tugas dari sistem Canvas/Moodle secara real-time.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['Moodle API', 'Canvas LMS', 'Google Classroom'].map((lms, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-center">
                    <span className="text-[10px] font-black text-slate-800 dark:text-white block">{lms}</span>
                    <span className="text-[9px] font-extrabold text-emerald-500 block mt-1">● Terkoneksi</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsLmsSyncing(true);
                  handleActionToast('Menghubungkan ke API Canvas LMS untuk sinkronisasi nilai akhir...');
                  setTimeout(() => { setIsLmsSyncing(false); handleActionToast('Sinkronisasi Moodle & Canvas Sukses!'); }, 1500);
                }}
                disabled={isLmsSyncing}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
              >
                {isLmsSyncing ? 'Sinkronisasi Berlangsung...' : 'Trigger Sinkronisasi Kelas LMS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. ACCREDITATION SUPPORT */}
      {activeTab === 'admin-accreditation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-500" /> Borang Akreditasi BAN-PT & LAM-INFOKOM
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Periksa tingkat pemenuhan berkas untuk 9 Kriteria Akreditasi standar BAN-PT secara otomatis dari data SIAKAD.</p>
            </div>
            <button onClick={() => handleActionToast('Mengeksport Borang Akreditasi Kriteria 1-9 format Excel...')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
              Eksport Borang Akreditasi (ZIP)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: '1', title: 'Kriteria 1: Visi, Misi, Tujuan', score: 'A (Unggul)', count: '100% Berkas Terunggah' },
              { id: '2', title: 'Kriteria 2: Tata Pamong & Kerjasama', score: 'A (Unggul)', count: '12 Dokumen Kerjasama' },
              { id: '3', title: 'Kriteria 3: Mahasiswa', score: 'A (Unggul)', count: 'Rasio Kelulusan Tepat Waktu' },
              { id: '4', title: 'Kriteria 4: Sumber Daya Manusia (SDM)', score: 'B (Sangat Baik)', count: 'Persentase Dosen Ber-S3 (42%)' },
              { id: '5', title: 'Kriteria 5: Keuangan & Sarpras', score: 'A (Unggul)', count: 'Budgeting & RFID Ruang Kuliah' },
              { id: '6', title: 'Kriteria 6: Pendidikan (Kurikulum)', score: 'A (Unggul)', count: 'Kesesuaian OBE & MBKM (100%)' }
            ].map((crit) => (
              <div key={crit.id} className="p-4 border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/10 rounded-2xl flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">{crit.title}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{crit.count}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Skor Borang:</span>
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-black uppercase">{crit.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. HELPDESK & TICKETING */}
      {activeTab === 'admin-helpdesk' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Civitas Helpdesk & IT Ticketing Support
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Selesaikan laporan bantuan, kendala KRS, keluhan ukt, dan masalah log mahasiswa/dosen se-universitas secara terpusat.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets Lists */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-slate-400r">Laporan Antrean Tiket Bantuan</h4>
              <div className="space-y-3">
                {tickets.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/10 rounded-2xl border border-slate-100 dark:border-slate-800">
                    Belum ada tiket bantuan masuk.
                  </div>
                ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors ${selectedTicketId === t.id ? 'border-blue-600 bg-blue-500/5 shadow-sm' : 'border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/10 hover:bg-slate-100/50'}`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800 dark:text-white">{t.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${t.priority === 'Tinggi' ? 'bg-red-500/15 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{t.priority}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Kategori: {t.category} &bull; Pengirim: {t.sender} &bull; {t.date}</p>
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        t.status === 'Diselesaikan' ? 'bg-emerald-500/15 text-emerald-600' :
                        t.status === 'Diproses' ? 'bg-amber-500/15 text-amber-600' :
                        'bg-red-500/15 text-red-600'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>

            {/* Answer Drawer */}
            <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 h-fit">
              {selectedTicketId ? (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-whiter flex items-center gap-1.5">
                    <UserCheck className="w-4.5 h-4.5 text-blue-500" /> Berikan Tanggapan Akademik ({selectedTicketId})
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400r block">Solusi Kendala</label>
                    <textarea
                      value={ticketReply}
                      onChange={(e) => setTicketReply(e.target.value)}
                      rows={4}
                      placeholder="Tulis balasan pemecahan kendala di sini..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 resize-none leading-relaxed"
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    Kirim Solusi & Tutup Tiket
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 text-slate-400 font-medium text-xs leading-relaxed">
                  Silakan pilih tiket di sebelah kiri untuk membaca secara detail dan menulis solusi bantuan IT.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 12. SECURITY AUDIT & AUDIT TRAIL */}
      {activeTab === 'admin-security-audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" /> Enterprise Audit Trail & Security Panel
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Tinjau log forensik audit keamanan, audit perubahan nilai kuliah, serta atur kebijakan keamanan MFA dan Rate Limiting.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-blackr flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> Security Node: Safe
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audit Trail Lists */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-slate-400r">Forensik Audit Trail (Who, What, When, IP)</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-96 overflow-y-auto">
                {SECURITY_LOGS.map((log, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-start gap-4 hover:bg-slate-50/40 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-slate-800 dark:text-white">{log.action}</p>
                      <p className="text-[10px] text-slate-400 font-medium">User: {log.who} &bull; Device: {log.device}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">{log.ip}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{log.when}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Config Card */}
            <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 space-y-4">
              <h4 className="text-xs font-bold text-slate-400r flex items-center gap-1.5">
                <Lock className="w-4.5 h-4.5 text-blue-500" /> Kebijakan Pengamanan Sistem
              </h4>

              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">Autentikasi Multi-Faktor (MFA)</span>
                <input
                  type="checkbox"
                  checked={isMfaActive}
                  onChange={(e) => { setIsMfaActive(e.target.checked); handleActionToast(`MFA Universitas ${e.target.checked ? 'DIPAKSA AKTIF' : 'DINONAKTIFKAN'}`); }}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">Lock IP Mahasiswa (Mencegah Joki)</span>
                <input
                  type="checkbox"
                  checked={isIpLockActive}
                  onChange={(e) => { setIsIpLockActive(e.target.checked); handleActionToast(`Fitur IP Lock Pencegahan Joki ${e.target.checked ? 'AKTIF' : 'NONAKTIF'}`); }}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400r block">Rate Limiting Gateway (Request/Menit)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={rateLimitRequests}
                    onChange={(e) => setRateLimitRequests(Number(e.target.value))}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  />
                  <button onClick={() => handleActionToast(`Rate Limit diset ke ${rateLimitRequests} req/menit.`)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl">Simpan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
