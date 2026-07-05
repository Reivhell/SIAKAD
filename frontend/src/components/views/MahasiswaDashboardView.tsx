import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, GraduationCap, Calendar, FileSpreadsheet, 
  CheckCircle2, CreditCard, User as UserIcon, Bell, ClipboardList, 
  Download, Sparkles, TrendingUp, Search, Info, HelpCircle, 
  MapPin, Phone, Mail, Award, Clock, ArrowRight, Printer, AlertTriangle, 
  DollarSign, CheckSquare, RefreshCw, Upload, FileText, ChevronRight, X, ChevronDown, Lock
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { User, Course } from '../../types';
import { AcademicDatesWidget } from '../widgets/AcademicDatesWidget';
import { SemesterProgressBar } from '../widgets/SemesterProgressBar';
import { DegreeCreditProgressBar } from '../widgets/DegreeCreditProgressBar';
import { FinanceDetailsBreakdown } from '../widgets/FinanceDetailsBreakdown';
import { SmartCourseRecommendation } from '../widgets/SmartCourseRecommendation';
import { HelpdeskSystem } from '../widgets/HelpdeskSystem';
import { PsychologicalSupportCrisis } from '../widgets/PsychologicalSupportCrisis';
import { AcademicAbsenceSupport } from '../widgets/AcademicAbsenceSupport';
import { CertifiedDigitalTranscript } from '../widgets/CertifiedDigitalTranscript';
import { AnnouncementTicker } from '../widgets/AnnouncementTicker';
import { EnterpriseControlSuite } from '../widgets/EnterpriseControlSuite';
import { 
  LmsHybridModule, 
  SmartCommunicationModule, 
  StudentSelfServiceModule, 
  SecurityComplianceModule, 
  ModernTechModule,
  MobilePwaControlBar
} from '../widgets/ModernSiaFeatures';
import { LecturerRatingModule } from '../widgets/LecturerRatingModule';
import { SksConversionModule } from '../widgets/SksConversionModule';
import { CentralizedTasksModule } from '../widgets/CentralizedTasksModule';
import { DigitalFormsTracker } from '../widgets/DigitalFormsTracker';
import { useLanguage } from '../../utils/i18n';

interface MahasiswaDashboardViewProps {
  user: User;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
  onUserChange?: (newUser: User) => void;
}

// Mock Data Definitions
const studentSemesterGPAs = [
  { name: 'Smt 1', IPS: 3.40, IPK: 3.40 },
  { name: 'Smt 2', IPS: 3.55, IPK: 3.48 },
  { name: 'Smt 3', IPS: 3.52, IPK: 3.49 },
  { name: 'Smt 4', IPS: 3.65, IPK: 3.53 },
  { name: 'Smt 5', IPS: 3.78, IPK: 3.58 },
];

const mockAnnouncements = [
  {
    id: 1,
    category: 'Akademik',
    title: 'Pendaftaran Yudisium & Wisuda Periode II Tahun 2026',
    date: '25 Juni 2026',
    excerpt: 'Diberitahukan kepada seluruh mahasiswa tingkat akhir bahwa pendaftaran wisuda periode II dibuka hingga 15 Juli 2026.',
    important: true,
  },
  {
    id: 2,
    category: 'Kegiatan',
    title: 'Kuliah Umum Internasional: Masa Depan Web 3.0 & AI Terintegrasi',
    date: '22 Juni 2026',
    excerpt: 'Menghadirkan narasumber dari Google DeepMind dan praktisi global. Dilaksanakan secara hybrid di Aula Barat.',
    important: false,
  },
  {
    id: 3,
    category: 'Keuangan',
    title: 'Batas Akhir Penangguhan & Pembayaran UKT Semester Ganjil 2026/2027',
    date: '18 Juni 2026',
    excerpt: 'Batas akhir pembayaran UKT diperpanjang hingga tanggal 3 Agustus 2026 pukul 16:00 WIB.',
    important: true,
  },
];

const mockTodayClasses = [
  { id: 'c1', code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, time: '08:00 - 10:30', room: 'GKU Timur R-202', lecturer: 'Dr. Hendra Wijaya, M.T.' },
  { id: 'c3', code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, time: '13:00 - 15:30', room: 'Lab Komputasi R-105', lecturer: 'Dr. Budi Rahardjo' },
];

const mockWeeklySchedules = {
  'Senin': [
    { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, time: '08:00 - 10:30', room: 'GKU Timur R-202', lecturer: 'Dr. Hendra Wijaya, M.T.' },
    { code: 'IF3120', name: 'Interaksi Manusia dan Komputer', sks: 3, time: '13:00 - 15:30', room: 'GKU Barat R-304', lecturer: 'Rina Astuti, M.Kom.' }
  ],
  'Selasa': [
    { code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, time: '10:30 - 13:00', room: 'GKU Timur R-101', lecturer: 'Dra. Sri Hartati' }
  ],
  'Rabu': [
    { code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, time: '13:00 - 15:30', room: 'Lab Komputasi R-105', lecturer: 'Dr. Budi Rahardjo' }
  ],
  'Kamis': [
    { code: 'IF3140', name: 'Manajemen Basis Data', sks: 3, time: '08:00 - 10:30', room: 'Lab Multimedia R-201', lecturer: 'Wawan Kuswara, M.T.' }
  ],
  'Jumat': [
    { code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, time: '14:00 - 15:40', room: 'Audit Utama R-102', lecturer: 'Tim MPK' }
  ],
};

const mockAvailableKrsCourses: Course[] = [
  { id: 'k1', code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, semester: 5, type: 'Wajib' },
  { id: 'k2', code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, semester: 5, type: 'Wajib' },
  { id: 'k3', code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, semester: 5, type: 'Wajib' },
  { id: 'k4', code: 'IF3140', name: 'Manajemen Basis Data', sks: 3, semester: 5, type: 'Wajib' },
  { id: 'k5', code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, semester: 5, type: 'Wajib' },
  { id: 'k6', code: 'IF3180', name: 'Sistem Temu Balik Informasi', sks: 3, semester: 5, type: 'Pilihan' },
  { id: 'k7', code: 'IF3190', name: 'Kriptografi', sks: 3, semester: 5, type: 'Pilihan' },
  { id: 'k8', code: 'IF3210', name: 'Pemrograman Mobile Berorientasi Objek', sks: 3, semester: 5, type: 'Pilihan' },
];

const mockSemestersGrades = {
  'Ganjil 2023/2024': {
    ips: 3.78,
    sksTaken: 17,
    grades: [
      { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, score: 92, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, score: 86, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, score: 90, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF3140', name: 'Manajemen Basis Data', sks: 3, score: 81, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, score: 88, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF3180', name: 'Sistem Temu Balik Informasi', sks: 3, score: 78, grade: 'B', point: 3.0, status: 'Lulus' },
    ]
  },
  'Genap 2022/2023': {
    ips: 3.65,
    sksTaken: 22,
    grades: [
      { code: 'IF2210', name: 'Algoritma dan Struktur Data', sks: 4, score: 84, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'IF2230', name: 'Sistem Operasi', sks: 3, score: 89, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2240', name: 'Rekayasa Perangkat Lunak', sks: 3, score: 76, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'IF2250', name: 'Pemrograman Berorientasi Objek', sks: 3, score: 95, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2270', name: 'Teori Bahasa Formal dan Otomata', sks: 3, score: 68, grade: 'C', point: 2.0, status: 'Lulus' },
      { code: 'IF2280', name: 'Jaringan Komputer', sks: 3, score: 82, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'KU2060', name: 'Bahasa Inggris Akademik', sks: 3, score: 91, grade: 'A', point: 4.0, status: 'Lulus' },
    ]
  },
  'Ganjil 2022/2023': {
    ips: 3.52,
    sksTaken: 21,
    grades: [
      { code: 'IF2110', name: 'Matematika Diskrit', sks: 3, score: 80, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'IF2130', name: 'Arsitektur dan Organisasi Komputer', sks: 3, score: 75, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'IF2140', name: 'Pemrograman Fungsional', sks: 3, score: 87, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'IF2150', name: 'Aljabar Linier dan Geometri', sks: 3, score: 93, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2160', name: 'Probabilitas dan Statistika', sks: 3, score: 82, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'KU2010', name: 'Tata Tulis Karya Ilmiah', sks: 2, score: 90, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2180', name: 'Interaksi Manusia dan Komputer', sks: 4, score: 86, grade: 'AB', point: 3.5, status: 'Lulus' },
    ]
  }
};

const mockTranscript = [
  // Semester 1
  { code: 'KU1011', name: 'Pengantar Rekayasa Desain', sks: 3, grade: 'A', point: 4.0, semester: 1, type: 'Umum' },
  { code: 'MA1101', name: 'Kalkulus IA', sks: 4, grade: 'AB', point: 3.5, semester: 1, type: 'Umum' },
  { code: 'FI1101', name: 'Fisika Dasar IA', sks: 4, grade: 'B', point: 3.0, semester: 1, type: 'Umum' },
  { code: 'KI1101', name: 'Kimia Dasar IA', sks: 3, grade: 'A', point: 4.0, semester: 1, type: 'Umum' },
  { code: 'KU1102', name: 'Pengantar Teknologi Informasi', sks: 3, grade: 'A', point: 4.0, semester: 1, type: 'Umum' },
  // Semester 2
  { code: 'KU1021', name: 'Pengantar Rekayasa Desain II', sks: 3, grade: 'A', point: 4.0, semester: 2, type: 'Umum' },
  { code: 'MA1201', name: 'Kalkulus IIA', sks: 4, grade: 'A', point: 4.0, semester: 2, type: 'Umum' },
  { code: 'FI1201', name: 'Fisika Dasar IIA', sks: 4, grade: 'B', point: 3.0, semester: 2, type: 'Umum' },
  { code: 'IF1210', name: 'Dasar Pemrograman', sks: 4, grade: 'A', point: 4.0, semester: 2, type: 'Inti' },
  // Semester 3
  { code: 'IF2110', name: 'Matematika Diskrit', sks: 3, grade: 'B', point: 3.0, semester: 3, type: 'Inti' },
  { code: 'IF2130', name: 'Arsitektur Komputer', sks: 3, grade: 'B', point: 3.0, semester: 3, type: 'Inti' },
  { code: 'IF2140', name: 'Pemrograman Fungsional', sks: 3, grade: 'AB', point: 3.5, semester: 3, type: 'Inti' },
  { code: 'IF2150', name: 'Aljabar Linier', sks: 3, grade: 'A', point: 4.0, semester: 3, type: 'Inti' },
  // Semester 4
  { code: 'IF2210', name: 'Algoritma & Struktur Data', sks: 4, grade: 'AB', point: 3.5, semester: 4, type: 'Inti' },
  { code: 'IF2230', name: 'Sistem Operasi', sks: 3, grade: 'A', point: 4.0, semester: 4, type: 'Inti' },
  { code: 'IF2240', name: 'Rekayasa Perangkat Lunak', sks: 3, grade: 'B', point: 3.0, semester: 4, type: 'Inti' },
  { code: 'IF2250', name: 'Pemrograman Berorientasi Objek', sks: 3, grade: 'A', point: 4.0, semester: 4, type: 'Inti' },
];

const mockAttendance = [
  { code: 'IF3110', name: 'Pengembangan Aplikasi Web', attendance: 14, total: 14, percentage: 100 },
  { code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', attendance: 13, total: 14, percentage: 92.8 },
  { code: 'IF3170', name: 'Kecerdasan Buatan', attendance: 14, total: 14, percentage: 100 },
  { code: 'IF3140', name: 'Manajemen Basis Data', attendance: 12, total: 14, percentage: 85.7 },
  { code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', attendance: 14, total: 14, percentage: 100 },
  { code: 'IF3180', name: 'Sistem Temu Balik Informasi', attendance: 11, total: 14, percentage: 78.5 },
];

export function MahasiswaDashboardView({ user, activeTab, onChangeTab, onUserChange }: MahasiswaDashboardViewProps) {
  const { t, lang, dir } = useLanguage();
  // Navigation internal tab (11 features as listed by user)
  const [localActiveSubTab, setLocalActiveSubTab] = useState<string>('dashboard');
  const activeSubTab = activeTab || localActiveSubTab;
  const setActiveSubTab = (tab: string) => {
    if (onChangeTab) {
      onChangeTab(tab);
    } else {
      setLocalActiveSubTab(tab);
    }
  };

  // Interactive state lists
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [studiSelesai, setStudiSelesai] = useState<boolean>(user?.isGraduated || false);

  // Sync with user prop if it changes externally
  React.useEffect(() => {
    if (user && user.isGraduated !== undefined) {
      setStudiSelesai(user.isGraduated);
    }
  }, [user?.isGraduated]);

  const handleToggleStudiSelesai = (newVal: boolean) => {
    setStudiSelesai(newVal);
    if (onUserChange) {
      onUserChange({
        ...user,
        isGraduated: newVal
      });
    }
  };

  // 1. KRS State
  const [selectedKrs, setSelectedKrs] = useState<Course[]>(mockAvailableKrsCourses.slice(0, 4));
  const [krsStatus, setKrsStatus] = useState<'Draft' | 'Diajukan' | 'Disetujui'>('Draft');

  // 2. KHS State
  const [selectedSemester, setSelectedSemester] = useState<string>('Ganjil 2023/2024');

  // 3. Keuangan State
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 'p1', semester: 'Genap 2022/2023', code: 'UKT-GNP-22', amount: 7500000, date: '12 Februari 2023', status: 'Lunas', method: 'BSI Virtual Account' },
    { id: 'p2', semester: 'Ganjil 2022/2023', code: 'UKT-GJL-22', amount: 7500000, date: '18 Agustus 2022', status: 'Lunas', method: 'Mandiri Transfer' },
    { id: 'p3', semester: 'Genap 2021/2022', code: 'UKT-GNP-21', amount: 7500000, date: '10 Februari 2022', status: 'Lunas', method: 'BNI Virtual Account' },
  ]);
  const [unpaidBill, setUnpaidBill] = useState<number | null>(7500000); // 7.5 million UKT for current semester
  const [billStatus, setBillStatus] = useState<'Belum Bayar' | 'Lunas'>('Belum Bayar');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('BSI_VA');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // 4. Profil State
  const [studentProfile, setStudentProfile] = useState({
    nim: '1901001',
    name: 'Ahmad Syafiq',
    program: 'S1 Teknik Informatika',
    faculty: 'Fakultas Teknik',
    classYear: '2019',
    advisor: 'Dr. Budi Rahardjo',
    email: 'ahmad.syafiq@mahasiswa.ac.id',
    phone: '0812-3456-7890',
    address: 'Jl. Dago Asri No. 12, Bandung, Jawa Barat',
    birthPlace: 'Bandung',
    birthDate: '12 Maret 2001',
    religion: 'Islam',
    citizenId: '3273011203010005',
    avatarUrl: '', // simulated local state file
  });

  // Sync local student profile state with global user prop changes
  React.useEffect(() => {
    if (user) {
      setStudentProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        avatarUrl: user.avatar || prev.avatarUrl
      }));
    }
  }, [user]);

  const [editingProfile, setEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 5. Layanan Akademik State
  const [layananRequests, setLayananRequests] = useState([
    { id: 'r1', type: 'Surat Keterangan Aktif Kuliah', date: '15 Juni 2026', purpose: 'Pengurusan Tunjangan Gaji Orang Tua', status: 'Selesai', downloadUrl: '#' },
    { id: 'r2', type: 'Pendaftaran Praktek Kerja Lapangan (PKL)', date: '21 Juni 2026', purpose: 'Magang di PT Teknologi Indonesia', status: 'Verifikasi Kaprodi', downloadUrl: null }
  ]);
  const [newLayananType, setNewLayananType] = useState('Surat Keterangan Aktif Kuliah');
  const [newLayananPurpose, setNewLayananPurpose] = useState('');
  const [layananModalOpen, setLayananModalOpen] = useState(false);

  // 6. Transkrip State
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [transcriptType, setTranscriptType] = useState('Semua');

  // Helper Toast trigger
  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  // KRS Functions
  const handleAddKrsCourse = (course: Course) => {
    if (krsStatus !== 'Draft') return;
    const isAlreadyAdded = selectedKrs.some(c => c.id === course.id);
    if (isAlreadyAdded) return;
    
    const currentSKS = selectedKrs.reduce((acc, c) => acc + c.sks, 0);
    if (currentSKS + course.sks > 24) {
      triggerToast("Gagal! Batas maksimum SKS untuk semester ini adalah 24 SKS.");
      return;
    }

    setSelectedKrs([...selectedKrs, course]);
    triggerToast(`Mata kuliah ${course.name} berhasil ditambahkan.`);
  };

  const handleRemoveKrsCourse = (courseId: string) => {
    if (krsStatus !== 'Draft') return;
    setSelectedKrs(selectedKrs.filter(c => c.id !== courseId));
    triggerToast("Mata kuliah dihapus dari draf.");
  };

  const handleAjukanKrs = () => {
    setKrsStatus('Diajukan');
    triggerToast("KRS berhasil diajukan ke Dosen Wali Dr. Budi Rahardjo.");
  };

  // Financial Payment Simulation
  const handleProcessPayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentModalOpen(false);
      setBillStatus('Lunas');
      setUnpaidBill(null);
      // add to history
      const newHistoryItem = {
        id: `p${Date.now()}`,
        semester: 'Ganjil 2023/2024',
        code: 'UKT-GJL-23',
        amount: 7500000,
        date: '24 Juni 2026',
        status: 'Lunas',
        method: paymentMethod.replace('_', ' ')
      };
      setPaymentHistory([newHistoryItem, ...paymentHistory]);
      triggerToast("Pembayaran UKT Rp 7.500.000,- Berhasil Di-verifikasi!");
    }, 1200);
  };

  // Profile Image Upload Sim
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const newAvatar = uploadEvent.target.result as string;
          setStudentProfile(prev => ({
            ...prev,
            avatarUrl: newAvatar
          }));
          if (onUserChange) {
            onUserChange({
              ...user,
              avatar: newAvatar
            });
          }
          triggerToast("Foto profil berhasil diunggah!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Layanan Akademik Submit
  const handleAddLayanan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayananPurpose.trim()) {
      triggerToast("Tolong tuliskan alasan/keperluan pengajuan.");
      return;
    }

    const newRequest = {
      id: `r${Date.now()}`,
      type: newLayananType,
      date: '24 Juni 2026',
      purpose: newLayananPurpose,
      status: 'Diajukan',
      downloadUrl: null
    };

    setLayananRequests([newRequest, ...layananRequests]);
    setNewLayananPurpose('');
    setLayananModalOpen(false);
    triggerToast(`Berhasil mengajukan ${newLayananType}. Silakan cek berkala status berkas.`);
  };

  // Simulated PDF downloads (opens print window or triggers custom alert preview)
  const triggerPdfDownload = (docName: string) => {
    // Generate simulated print/download action
    const printContent = `
      ======================================================
                  SISTEM INFORMASI AKADEMIK (SIAKAD)
                  UNIVERSITAS AKADEMIK TERPADU
      ======================================================
      DOKUMEN RESMI : ${docName.toUpperCase()}
      NAMA          : ${studentProfile.name}
      NIM           : ${studentProfile.nim}
      PROGRAM STUDI : ${studentProfile.program}
      TANGGAL       : 24 Juni 2026
      
      STATUS VERIFIKASI: VALID / TER-OTENTIKASI SISTEM
      ======================================================
    `;
    
    // Create download file
    const element = document.createElement("a");
    const file = new Blob([printContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${docName.toLowerCase().replace(/\\s+/g, '_')}_${studentProfile.nim}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    triggerToast(`Dokumen ${docName} berhasil diunduh sebagai file cetak.`);
  };

  // Navigations tab config matching the user's requested 11 items
  const subNavigationItems = [
    { id: 'dashboard', label: '1. Dashboard Mahasiswa', icon: LayoutDashboard },
    { id: 'krs', label: '2. Kartu Rencana Studi (KRS)', icon: BookOpen },
    { id: 'khs', label: '3. Kartu Hasil Studi (KHS)', icon: GraduationCap },
    { id: 'jadwal', label: '4. Jadwal Kuliah', icon: Calendar },
    { id: 'transkrip', label: '5. Transkrip Akademik', icon: FileSpreadsheet },
    { id: 'presensi', label: '6. Presensi & Kehadiran', icon: CheckSquare },
    { id: 'keuangan', label: '7. Keuangan & UKT', icon: CreditCard },
    { id: 'profil', label: '8. Profil Mahasiswa', icon: UserIcon },
    { id: 'pengumuman', label: '9. Pengumuman Akademik', icon: Bell },
    { id: 'layanan', label: '10. Layanan Akademik', icon: ClipboardList },
    { id: 'unduhan', label: '11. Unduhan Dokumen', icon: Download },
  ];

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 animate-bounce text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header Banner - Premium Academic Title card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <GraduationCap className="w-80 h-80" />
        </div>
        
        <div className="space-y-1 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${studiSelesai ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-white/20 text-white border border-white/10'}`}>
              {studiSelesai ? <CheckCircle2 className="w-3 h-3 text-emerald-450 animate-pulse" /> : <Sparkles className="w-3 h-3 text-amber-300" />}
              {studiSelesai ? 'Alumni / Studi Selesai' : 'Portal Mahasiswa Aktif'}
            </div>
            <button
              onClick={() => {
                const nextVal = !studiSelesai;
                handleToggleStudiSelesai(nextVal);
                triggerToast(nextVal ? "Simulasi: Berhasil menyelesaikan seluruh studi! Selamat!" : "Simulasi: Kembali ke status Mahasiswa Aktif.");
              }}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.02]"
            >
              <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
              {studiSelesai ? 'Kembali Aktif' : 'Simulasikan Kelulusan'}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {studentProfile.name}
            </h2>
            {studiSelesai && (
              <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-300 shadow-md">
                <Award className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                Alumni
              </span>
            )}
          </div>
          <p className="text-sm text-indigo-100 font-medium">
            NIM: {studentProfile.nim} &bull; {studentProfile.program} &bull; Angkatan {studentProfile.classYear}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">IP Kumulatif (IPK)</div>
            <div className="text-lg font-extrabold text-white flex items-center justify-end gap-1.5">
              3.58 
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">SKS Semester 5</div>
            <div className="text-lg font-extrabold text-white">{selectedKrs.reduce((acc, c) => acc + c.sks, 0)} SKS</div>
          </div>
        </div>
      </div>

      {/* Main Student Portal Workspace */}
      <div className="w-full space-y-6">

          {/* TAB 1: DASHBOARD MAHASISWA */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Scrolling Announcement Ticker */}
              <AnnouncementTicker />

              {/* Semester & Degree Progress Bars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SemesterProgressBar />
                <DegreeCreditProgressBar forceCompleted={studiSelesai} />
              </div>

              {/* Centralized Tasks & Deadlines Timeline */}
              <CentralizedTasksModule role="student" />
              
              {/* Row 1: Academic Summary Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">IPS Semester Lalu</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">3.78</div>
                    <div className="text-[10px] text-green-500 font-bold flex items-center gap-0.5 mt-0.5">
                      <TrendingUp className="w-3 h-3" /> Memuaskan
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${studiSelesai ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                    {studiSelesai ? <CheckCircle2 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SKS Terkumpul</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {studiSelesai ? '144 SKS' : '84 SKS'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      {studiSelesai ? 'Studi Selesai / Lulus Yudisium' : 'Target: 144 SKS Kelulusan'}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kehadiran Kelas</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">96.4%</div>
                    <div className="text-[10px] text-emerald-500 font-bold mt-0.5">Batas Minimal Kehadiran 80%</div>
                  </div>
                </div>
              </div>

              {/* Row 2: Today's Classes & Announcements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Today's Schedule */}
                <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Jadwal Kuliah Hari Ini
                    </h3>
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">Rabu</span>
                  </div>
                  
                  <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800">
                    {mockTodayClasses.map((cls) => (
                      <div key={cls.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 rounded">
                            {cls.code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{cls.sks} SKS</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{cls.name}</h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pukul: {cls.time} WIB</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Ruang: {cls.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {mockTodayClasses.length === 0 && (
                      <div className="p-8 text-center text-slate-400">
                        Tidak ada perkuliahan terjadwal untuk hari ini.
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                    <button 
                      onClick={() => setActiveSubTab('jadwal')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      Lihat Seluruh Jadwal Mingguan
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Latest Announcements */}
                <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-400" />
                      Pengumuman Terbaru Kampus
                    </h3>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mockAnnouncements.map((ann) => (
                      <div key={ann.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            ann.category === 'Keuangan' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                            ann.category === 'Akademik' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' :
                            'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400'
                          }`}>
                            {ann.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{ann.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {ann.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                    <button 
                      onClick={() => setActiveSubTab('pengumuman')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      Buka Kalender Akademik Lengkap
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Progress Chart & Academic Dates Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        Indikator Perkembangan Indeks Prestasi Semester
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Rangkuman tren IPS dari Semester 1 sampai Semester 5.</p>
                    </div>
                    <button 
                      onClick={() => setActiveSubTab('khs')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      Detil Kartu Hasil Studi
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="h-60 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={studentSemesterGPAs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="studentPortalGpaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" dark-stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 11}} axisLine={false} tickLine={false} />
                        <YAxis domain={[3.0, 4.0]} tick={{fill: '#94a3b8', fontSize: 11}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                            borderRadius: '12px', 
                            border: 'none',
                            color: '#fff',
                            fontSize: '11px'
                          }} 
                        />
                        <Area type="monotone" dataKey="IPS" stroke="#3b82f6" strokeWidth={3.5} fillOpacity={1} fill="url(#studentPortalGpaGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col h-full">
                  <AcademicDatesWidget />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KARTU RENCANA STUDI (KRS) */}
          {activeSubTab === 'krs' && (
            studiSelesai ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto my-12 space-y-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
                  <Lock className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Akses KRS Terbuka Hanya Masa Studi</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Status akademik Anda saat ini tercatat sebagai <b>Alumni / Lulus Yudisium</b>. Pengisian Kartu Rencana Studi (KRS) online dan penawaran mata kuliah baru hanya dapat diakses oleh mahasiswa dengan status studi aktif.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveSubTab('transkrip')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Buka Transkrip Akademik Kelulusan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
              
              {/* Info banner */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Informasi Pengisian KRS Online</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Sesuai Indeks Prestasi (IPS) semester lalu sebesar <b>3.78</b>, Anda mendapatkan kuota maksimal beban studi sebanyak <b>24 SKS</b>. 
                      Pastikan Anda berkonsultasi dengan dosen wali <b>{studentProfile.advisor}</b> sebelum mengajukan finalisasi KRS.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Elective Course Recommendation Panel */}
              <SmartCourseRecommendation />

              {/* Automatic SKS Conversion & CPL Matching Module */}
              <SksConversionModule role="student" />

              {/* KRS Status Action Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Status Pengajuan KRS Ganjil 2026/2027</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      krsStatus === 'Disetujui' ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 border border-green-200/40' :
                      krsStatus === 'Diajukan' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200/40' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                    }`}>
                      {krsStatus}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {krsStatus === 'Draft' ? 'Silakan tambahkan matakuliah' :
                       krsStatus === 'Diajukan' ? 'Menunggu persetujuan Dosen Wali Dr. Budi Rahardjo' :
                       'KRS telah disetujui & dicetak oleh admin'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {krsStatus === 'Draft' ? (
                    <button
                      onClick={handleAjukanKrs}
                      disabled={selectedKrs.length === 0}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/15 transition-all cursor-pointer"
                    >
                      Ajukan KRS ke Dosen Wali
                    </button>
                  ) : krsStatus === 'Diajukan' ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setKrsStatus('Draft');
                          triggerToast("Pengajuan KRS ditarik kembali ke draf.");
                        }}
                        className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Tarik Pengajuan
                      </button>
                      <button
                        onClick={() => {
                          setKrsStatus('Disetujui');
                          triggerToast("Simulasi: Dosen Wali menyetujui KRS Anda!");
                        }}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-green-500/10 transition-all"
                      >
                        [Simulasi] Setujui Dosen Wali
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => triggerPdfDownload('KRS Ganjil 2026')}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      Unduh Bukti KRS Terverifikasi
                    </button>
                  )}
                </div>
              </div>

              {/* KRS Table / Form Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Selected KRS List */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Mata Kuliah Pilihan Anda</h3>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Terpilih: <span className="text-blue-600 dark:text-blue-400">{selectedKrs.reduce((sum, c) => sum + c.sks, 0)}</span> / 24 SKS
                    </span>
                  </div>

                  <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedKrs.map((course) => (
                      <div key={course.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50">
                              {course.code}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              course.type === 'Wajib' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400'
                            }`}>
                              {course.type}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{course.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">SKS: {course.sks} &bull; Semester {course.semester}</p>
                        </div>

                        {krsStatus === 'Draft' && (
                          <button
                            onClick={() => handleRemoveKrsCourse(course.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    ))}

                    {selectedKrs.length === 0 && (
                      <div className="p-12 text-center text-slate-400 space-y-2">
                        <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                        <div className="font-bold text-xs text-slate-500">Belum ada mata kuliah terpilih</div>
                        <p className="text-[10px]">Silakan pilih penawaran di kolom sebelah kanan.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Available KRS offerings */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Daftar Penawaran Kelas</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Klik matakuliah untuk mendaftarkan.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {mockAvailableKrsCourses.map((course) => {
                      const isSelected = selectedKrs.some(c => c.id === course.id);
                      return (
                        <div
                          key={course.id}
                          onClick={() => krsStatus === 'Draft' && !isSelected && handleAddKrsCourse(course)}
                          className={`p-3.5 text-left transition-all ${
                            isSelected 
                              ? 'bg-slate-50 dark:bg-slate-850/40 opacity-40 cursor-not-allowed' 
                              : krsStatus === 'Draft' ? 'hover:bg-blue-50/40 dark:hover:bg-blue-950/10 cursor-pointer' : 'cursor-not-allowed'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-slate-900 dark:text-white">{course.code} &bull; {course.name}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{course.sks} SKS &bull; {course.type}</div>
                            </div>
                            {isSelected ? (
                              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Terpilih
                              </span>
                            ) : (
                              krsStatus === 'Draft' && (
                                <span className="text-[10px] font-bold text-blue-600 hover:underline">
                                  + Tambah
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          )
        )}

          {/* TAB 3: KARTU HASIL STUDI (KHS) */}
          {activeSubTab === 'khs' && (
            <div className="space-y-6">
              
              {/* Semester switcher and GPA indicators */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transkrip Nilai per Semester (KHS)</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Pilih Semester Penilaian:</span>
                    <select 
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 outline-none border-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.keys(mockSemestersGrades).map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">IP Semester (IPS)</div>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                      {mockSemestersGrades[selectedSemester as keyof typeof mockSemestersGrades]?.ips.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right border-l border-slate-100 dark:border-slate-800 pl-4">
                    <div className="text-[10px] uppercase font-bold text-slate-400">SKS Terlaksana</div>
                    <div className="text-xl font-black text-slate-800 dark:text-white">
                      {mockSemestersGrades[selectedSemester as keyof typeof mockSemestersGrades]?.sksTaken} SKS
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerPdfDownload(`KHS ${selectedSemester}`)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl transition-colors self-center cursor-pointer"
                    title="Cetak KHS Semester Ini"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table of Grades */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800 text-left">
                    <thead className="bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-3.5">Kode Matakuliah</th>
                        <th className="px-6 py-3.5">Nama Matakuliah</th>
                        <th className="px-6 py-3.5 text-center">SKS</th>
                        <th className="px-6 py-3.5 text-center">Nilai Angka</th>
                        <th className="px-6 py-3.5 text-center">Grade Huruf</th>
                        <th className="px-6 py-3.5 text-center">Angka Kredit</th>
                        <th className="px-6 py-3.5 text-center">Kelulusan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {mockSemestersGrades[selectedSemester as keyof typeof mockSemestersGrades]?.grades.map((gr) => (
                        <tr key={gr.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{gr.code}</td>
                          <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-300">{gr.name}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400">{gr.sks}</td>
                          <td className="px-6 py-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{gr.score}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-md font-extrabold text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                              {gr.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-mono font-bold text-slate-800 dark:text-white">{gr.point.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400">
                              Lulus
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: JADWAL KULIAH */}
          {activeSubTab === 'jadwal' && (
            studiSelesai ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto my-12 space-y-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                  <Lock className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Alumni Tidak Memiliki Kelas Aktif</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Status studi Anda saat ini tercatat telah <b>Selesai / Lulus Yudisium</b>. Jadwal perkuliahan mingguan hanya ditawarkan untuk mahasiswa aktif di semester berjalan.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveSubTab('transkrip')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Buka Transkrip Akademik Kelulusan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kalender & Jadwal Perkuliahan Mingguan</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Jadwal resmi semester berjalan yang dicatat di SIAKAD.</p>
                  </div>
                  <button
                    onClick={() => triggerPdfDownload("Jadwal Kuliah Mingguan")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Unduh Jadwal PDF
                  </button>
                </div>

                {/* Day Grid Boards */}
                <div className="space-y-4">
                  {Object.entries(mockWeeklySchedules).map(([day, classes]) => (
                    <div key={day} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-slate-50 dark:bg-slate-950/50 px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">{day}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">({classes.length} Perkuliahan)</span>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {classes.map((cls, idx) => (
                          <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <div className="md:col-span-2">
                              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50">
                                {cls.code}
                              </span>
                              <div className="text-xs font-black text-slate-800 dark:text-white mt-1">{cls.time}</div>
                            </div>
                            <div className="md:col-span-5 space-y-0.5">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">{cls.name}</h5>
                              <p className="text-[11px] text-slate-400">Dosen: {cls.lecturer}</p>
                            </div>
                            <div className="md:col-span-3 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {cls.room}
                            </div>
                            <div className="md:col-span-2 text-right">
                              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded">
                                {cls.sks} SKS
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )
          )}

          {/* TAB 5: TRANSKRIP AKADEMIK */}
          {activeSubTab === 'transkrip' && (
            <div className="space-y-6">
              
              {/* Transcript Stats Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Rekapitulasi Prestasi</span>
                  <h3 className="text-lg font-bold">Transkrip Nilai Kumulatif Mahasiswa</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Daftar seluruh nilai matakuliah yang sah dari semester awal hingga sekarang.
                  </p>
                </div>

                 <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center min-w-[80px]">
                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total SKS</div>
                    <div className="text-xl font-black text-white mt-0.5">{studiSelesai ? '144' : '84'}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center min-w-[80px]">
                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">IPK</div>
                    <div className="text-xl font-black text-green-400 mt-0.5">3.64</div>
                  </div>
                  <button
                    onClick={() => triggerPdfDownload("Transkrip Akademik")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 self-center shadow-lg shadow-blue-500/10 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Unduh Transkrip
                  </button>
                </div>
              </div>

              {/* Secure Cryptographic Certified Digital Transcripts & Ijazah */}
              {studiSelesai ? (
                <CertifiedDigitalTranscript />
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Ijazah & Transkrip Digital Tersertifikasi</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Sesuai regulasi akademik Universitas, dokumen kelulusan (Ijazah S1 & Transkrip Digital bertanda-tangan digital resmi) hanya akan diterbitkan setelah Anda menyelesaikan seluruh studi wajib (<b>144 SKS</b>).
                    </p>
                  </div>
                  <div className="flex justify-center items-center gap-4 text-[11px] font-bold text-slate-450">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200/40 dark:border-slate-700/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Status Studi: <span className="text-amber-600 dark:text-amber-450">Belum Lulus (84 / 144 SKS)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleToggleStudiSelesai(true);
                      triggerToast("Simulasi Kelulusan Aktif! Seluruh SKS terpenuhi dan Ijazah diterbitkan.");
                    }}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-500/10 hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Simulasikan Penyelesaian Studi (Lulus)
                  </button>
                </div>
              )}

              {/* Filters & Search */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Cari kode atau nama matakuliah..."
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Filter Tipe:</span>
                  <select
                    value={transcriptType}
                    onChange={(e) => setTranscriptType(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-850 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 outline-none border-none"
                  >
                    <option value="Semua">Semua Matakuliah</option>
                    <option value="Inti">Inti Prodi</option>
                    <option value="Umum">Umum / MPK</option>
                  </select>
                </div>
              </div>

              {/* Table of all course transcript records */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800 text-left">
                    <thead className="bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-3">Semester</th>
                        <th className="px-6 py-3">Kode MK</th>
                        <th className="px-6 py-3">Nama Matakuliah</th>
                        <th className="px-6 py-3 text-center">SKS</th>
                        <th className="px-6 py-3 text-center">Grade</th>
                        <th className="px-6 py-3 text-center">Bobot</th>
                        <th className="px-6 py-3 text-center">Tipe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {mockTranscript
                        .filter(item => {
                          const matchesSearch = item.name.toLowerCase().includes(transcriptSearch.toLowerCase()) || item.code.toLowerCase().includes(transcriptSearch.toLowerCase());
                          const matchesType = transcriptType === 'Semua' || item.type === transcriptType;
                          return matchesSearch && matchesType;
                        })
                        .map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-3.5 font-bold text-slate-500">Smt {item.semester}</td>
                            <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">{item.code}</td>
                            <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-300">{item.name}</td>
                            <td className="px-6 py-3.5 text-center font-bold text-slate-600 dark:text-slate-400">{item.sks}</td>
                            <td className="px-6 py-3.5 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-md font-extrabold text-xs bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/40">
                                {item.grade}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-center font-mono font-bold text-slate-800 dark:text-white">{item.point.toFixed(2)}</td>
                            <td className="px-6 py-3.5 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                item.type === 'Inti' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                              }`}>
                                {item.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: PRESENSI / ABSENSI */}
          {activeSubTab === 'presensi' && (
            studiSelesai ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto my-12 space-y-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                  <Lock className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Presensi Kuliah Khusus Mahasiswa Aktif</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Status akademik Anda saat ini tercatat sebagai <b>Alumni / Lulus Yudisium</b>. Sistem pencatatan kehadiran presensi kelas (QR code / absensi online) hanya aktif selama masa studi berjalan.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveSubTab('transkrip')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Buka Transkrip Akademik Kelulusan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Persentase Kehadiran Kuliah Semester Ini</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Pantau riwayat presensi tiap kelas. Sesuai aturan akademik, minimal persentase kehadiran untuk mengikuti Ujian Akhir Semester (UAS) adalah 80%.
                  </p>
                </div>

                {/* Progress visualizers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {mockAttendance.map((item) => {
                    const isWarning = item.percentage < 80;
                    return (
                      <div key={item.code} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-500 border border-slate-200/40">
                              {item.code}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-tight">{item.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-black ${isWarning ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                              {item.percentage}%
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">Hadir: {item.attendance}/{item.total} Sesi</div>
                          </div>
                        </div>

                        {/* Bar indicator */}
                        <div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isWarning ? 'bg-red-500' : 'bg-blue-600'}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
                            <span>Batas 80% UAS</span>
                            <span className={isWarning ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                              {isWarning ? 'RISIKO TIDAK LAYAK UAS' : 'LAYAK UAS'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Automatic early intervention for missed lectures & wellbeing check */}
                <AcademicAbsenceSupport />

              </div>
            )
          )}

          {/* TAB 7: KEUANGAN & UKT */}
          {activeSubTab === 'keuangan' && (
            <div className="space-y-6">
              
              {/* Bill banner and simulator button */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1.5">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    studiSelesai 
                      ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-150'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-150'
                  }`}>
                    {studiSelesai ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" /> Bebas Administrasi Alumni
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" /> Tagihan Pembayaran
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {studiSelesai ? 'Kliring Keuangan Kelulusan & Alumni' : 'UKT Semester Ganjil 2023/2024'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {studiSelesai 
                      ? 'Seluruh kewajiban finansial masa studi Anda telah Lunas & Terverifikasi (Bebas Pustaka & Keuangan Alumni Terpenuhi).'
                      : 'Beban UKT regulatif Anda semester ini adalah sebesar Rp 7.500.000,-'
                    }
                  </p>
                </div>

                <div className="text-right flex flex-col items-end gap-2.5 w-full sm:w-auto">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Tagihan</div>
                    <div className="text-xl font-black text-green-600 dark:text-green-400">
                      {studiSelesai ? 'BEBAS KEUANGAN / LUNAS' : billStatus === 'Lunas' ? 'LUNAS / TERBAYAR' : 'BELUM BAYAR'}
                    </div>
                  </div>
                  {!studiSelesai && billStatus === 'Belum Bayar' && (
                    <button
                      onClick={() => setPaymentModalOpen(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/15 transition-all cursor-pointer"
                    >
                      Bayar Sekarang (Simulasi)
                    </button>
                  )}
                </div>
              </div>

              {/* Graphical Detailed Cost Breakdown */}
              <FinanceDetailsBreakdown />

              {/* Payment History Records */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Riwayat Pembayaran Registrasi UKT</h3>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paymentHistory.map((pmt) => (
                    <div key={pmt.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 dark:text-white">{pmt.semester} ({pmt.code})</div>
                        <div className="text-[11px] text-slate-400">Tanggal Bayar: {pmt.date} &bull; Metode: {pmt.method}</div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                        <span className="font-bold text-slate-800 dark:text-white">Rp {pmt.amount.toLocaleString('id-ID')}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400">
                          {pmt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive payment dialog popup */}
              {paymentModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-500" />
                        Simulasi Gerbang Pembayaran UKT
                      </h4>
                      <button 
                        onClick={() => setPaymentModalOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Penerima</span>
                        <span className="font-bold text-slate-800 dark:text-white">Universitas Akademik Terpadu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">NIM / Nama Mahasiswa</span>
                        <span className="font-bold text-slate-800 dark:text-white">{studentProfile.nim} / {studentProfile.name}</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 font-bold text-slate-900 dark:text-white text-sm">
                        <span>Total Tagihan</span>
                        <span>Rp 7.500.000,-</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                        Pilih Metode Pembayaran
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 outline-none"
                      >
                        <option value="BSI_Virtual_Account">BSI Virtual Account (VA)</option>
                        <option value="Mandiri_Virtual_Account">Mandiri Virtual Account</option>
                        <option value="BNI_Virtual_Account">BNI Virtual Account</option>
                        <option value="Gopay_E_Wallet">GoPay E-Wallet</option>
                        <option value="Credit_Card">Kartu Kredit Visa / Master</option>
                      </select>
                    </div>

                    <button
                      onClick={handleProcessPayment}
                      disabled={paymentLoading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/15 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {paymentLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Memproses Transaksi Virtual...
                        </>
                      ) : (
                        'Bayar & Konfirmasi Sekarang'
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 8: PROFIL MAHASISWA */}
          {activeSubTab === 'profil' && (
            <div className="space-y-6">
              
              {/* Profile card layout */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Biodata & Informasi Profil Pribadi</h3>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-900/40 transition-colors cursor-pointer"
                  >
                    {editingProfile ? 'Batal Perubahan' : 'Edit Kontak'}
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Photo Avatar layout */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6 space-y-4">
                    <div className="relative">
                      {studentProfile.avatarUrl ? (
                        <img 
                          src={studentProfile.avatarUrl} 
                          alt="Student Avatar" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-950 shadow-xl"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-4xl border-4 border-white dark:border-slate-950 shadow-xl">
                          {(studentProfile.name || 'M').charAt(0)}
                        </div>
                      )}
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full shadow-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Upload foto profil"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    <div className="text-center space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white">{studentProfile.name}</div>
                      <div className="text-xs text-slate-400 font-medium">NIM. {studentProfile.nim}</div>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border ${
                        studiSelesai 
                          ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50' 
                          : 'text-emerald-500 bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/50'
                      }`}>
                        Status: {studiSelesai ? 'ALUMNI / LULUS' : 'MAHASISWA AKTIF'}
                      </div>
                    </div>
                  </div>

                  {/* Info table fields */}
                  <div className="md:col-span-8 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Fakultas / Prodi</span>
                        <div className="font-semibold text-slate-800 dark:text-white mt-0.5">
                          {studentProfile.faculty} / {studentProfile.program}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Dosen Wali Akademik</span>
                        <div className="font-semibold text-slate-800 dark:text-white mt-0.5">
                          {studentProfile.advisor}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Tempat, Tanggal Lahir</span>
                        <div className="font-semibold text-slate-800 dark:text-white mt-0.5">
                          {studentProfile.birthPlace}, {studentProfile.birthDate}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Agama / NIK</span>
                        <div className="font-semibold text-slate-800 dark:text-white mt-0.5">
                          {studentProfile.religion} / {studentProfile.citizenId}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3.5">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kontak & Alamat Korespondensi</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> Email SIAKAD
                          </label>
                          {editingProfile ? (
                            <input
                              type="email"
                              value={studentProfile.email}
                              onChange={(e) => setStudentProfile({...studentProfile, email: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs"
                            />
                          ) : (
                            <div className="font-semibold text-slate-800 dark:text-white">{studentProfile.email}</div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> No. Telepon
                          </label>
                          {editingProfile ? (
                            <input
                              type="text"
                              value={studentProfile.phone}
                              onChange={(e) => setStudentProfile({...studentProfile, phone: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs"
                            />
                          ) : (
                            <div className="font-semibold text-slate-800 dark:text-white">{studentProfile.phone}</div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> Alamat Lengkap
                        </label>
                        {editingProfile ? (
                          <textarea
                            value={studentProfile.address}
                            onChange={(e) => setStudentProfile({...studentProfile, address: e.target.value})}
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs"
                          />
                        ) : (
                          <div className="font-semibold text-slate-800 dark:text-white leading-relaxed">{studentProfile.address}</div>
                        )}
                      </div>

                      {editingProfile && (
                        <button
                          onClick={() => {
                            setEditingProfile(false);
                            if (onUserChange) {
                              onUserChange({
                                ...user,
                                name: studentProfile.name,
                                email: studentProfile.email,
                                phone: studentProfile.phone
                              });
                            }
                            triggerToast("Perubahan kontak berhasil disimpan!");
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Simpan Perubahan Kontak
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 9: PENGUMUMAN & KALENDER AKADEMIK */}
          {activeSubTab === 'pengumuman' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Agenda & Kalender Akademik Resmi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pantau timeline kegiatan registrasi, masa perkuliahan, jadwal ujian, dan kegiatan kampus semester ganjil berjalan.
                </p>
              </div>

              {/* Timeline Roadmap list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {[
                      { title: 'Pembayaran UKT Registrasi Semester Ganjil', desc: 'Masa aktif pelunasan administrasi keuangan semester baru bagi seluruh angkatan.', date: '3 Juli - 1 Agustus 2026', done: true },
                      { title: 'Pengisian KRS Online Terbimbing', desc: 'Konsultasi kurikulum studi dengan dosen wali via SIAKAD.', date: '12 Agustus - 25 Agustus 2026', done: false },
                      { title: 'Awal Perkuliahan Semester Ganjil', desc: 'Sesi kuliah perdana dimulai secara tatap muka di masing-masing ruang kelas.', date: '1 September 2026', done: false },
                      { title: 'Masa Ujian Tengah Semester (UTS)', desc: 'Pengujian tulis dan praktek paruh waktu semester.', date: '15 Oktober - 25 Oktober 2026', done: false },
                      { title: 'Ujian Akhir Semester (UAS) & Evaluasi', desc: 'Batas akhir pengumpulan tugas besar prodi dan evaluasi final IP semester.', date: '18 Desember - 30 Desember 2026', done: false },
                    ].map((step, idx, arr) => (
                      <li key={idx}>
                        <div className="relative pb-8">
                          {idx !== arr.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-850" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-900 text-xs font-bold ${
                                step.done ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-850 text-slate-500'
                              }`}>
                                {idx + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5 flex justify-between gap-4 text-xs">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  {step.title}
                                  {step.done && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-extrabold">Done</span>}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                              </div>
                              <div className="text-right whitespace-nowrap font-bold text-slate-500 dark:text-slate-400">{step.date}</div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 10: LAYANAN AKADEMIK */}
          {activeSubTab === 'layanan' && (
            <div className="space-y-6">
              
              <DigitalFormsTracker role="student" isAlumni={studiSelesai} />

              {/* Student Helpdesk & Support System */}
              <HelpdeskSystem />

              {/* Anonymous Bullying / Sexual Harassment & Mental Health Support Unit */}
              <PsychologicalSupportCrisis />

            </div>
          )}

          {/* TAB 11: UNDUHAN DOKUMEN */}
          {activeSubTab === 'unduhan' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pusat Unduhan Berkas Elektronik</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Unduh seluruh dokumen sertifikat, kartu tanda mahasiswa digital, bukti KRS semester ganjil, dan transkrip akademik hasil studi yang sudah di-legalisir secara otomatis.
                </p>
              </div>

              {/* List of downloadable records */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Kartu Rencana Studi (KRS) Digital</h4>
                      <p className="text-[11px] text-slate-400 mt-1">File resmi berisi penawaran matakuliah terpilih semester berjalan.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerPdfDownload("KRS Digital Ganjil 2023")}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Dokumen (.PDF)
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Kartu Hasil Studi (KHS) Semester 4</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Hasil perolehan indeks prestasi pada semester genap sebelumnya.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerPdfDownload("KHS Semester 4")}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Dokumen (.PDF)
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Transkrip Nilai Sementara Ter-Legalisir</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Rekap seluruh matakuliah dan bobot IPK kumulatif resmi kampus.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerPdfDownload("Transkrip Akademik")}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Dokumen (.PDF)
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Kartu Tanda Mahasiswa (KTM) Digital</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Kartu identitas resmi digital yang mencantumkan nama, foto & NIM aktif.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerPdfDownload("Kartu Tanda Mahasiswa Digital")}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Dokumen (.PDF)
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 12: INOVASI & FITUR CANGGIH */}
          {activeSubTab === 'inovasi' && (
            <div className="space-y-6">
              {/* Floating PWA Optimizer Bar */}
              <MobilePwaControlBar />

              {/* Master Enterprise Suite Control Center */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Fitur Utama &bull; SIAKAD Enterprise &amp; Automation Hub</span>
                <EnterpriseControlSuite />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Integrasi LMS & Hybrid Learning */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 1 &bull; Kelas Hybrid</span>
                  <LmsHybridModule />
                </div>

                {/* Fitur Mandiri Mahasiswa */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 2 &bull; Self-Service Mandiri</span>
                  <StudentSelfServiceModule />
                </div>

                {/* Smart Communication Forum & Gateway */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 3 &bull; Komunikasi Cerdas</span>
                  <SmartCommunicationModule role="student" />
                </div>

                {/* AI Plagiarism & Digital Signatures */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 4 &bull; Integritas Akademik</span>
                  <ModernTechModule />
                </div>
              </div>

              {/* Security, 2FA & Audit Logs */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 5 &bull; Keamanan Akun &amp; Kepatuhan Regulasi</span>
                <SecurityComplianceModule user={user} />
              </div>
            </div>
          )}

          {/* TAB 13: EVALUASI KINERJA DOSEN (EDOM) */}
          {activeSubTab === 'edom' && (
            studiSelesai ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto my-12 space-y-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                  <Lock className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Pengisian EDOM Ditutup untuk Alumni</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Status akademik Anda saat ini tercatat sebagai <b>Alumni / Lulus Yudisium</b>. Kuesioner Evaluasi Dosen Oleh Mahasiswa (EDOM) hanya diisi oleh mahasiswa aktif yang menempuh mata kuliah berjalan.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveSubTab('transkrip')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Buka Transkrip Akademik Kelulusan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Sistem Penjaminan Mutu &bull; Evaluasi Dosen</span>
                  <LecturerRatingModule user={user} />
                </div>
              </div>
            )
          )}

      </div>

    </div>
  );
}
