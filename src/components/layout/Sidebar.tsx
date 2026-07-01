import React from 'react';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  FileSpreadsheet,
  CheckSquare,
  User as UserIcon,
  Bell,
  ClipboardList,
  Download,
  MessageSquare,
  BarChart3,
  Lock,
  Clock,
  FileText,
  Award,
  ChevronDown,
  ChevronRight,
  Network,
  Cpu,
  Send,
  Key,
  FileCheck,
  Layers,
  Briefcase,
  ShieldAlert,
  Eye,
  Star,
  Search,
  Upload,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Role } from '../../types';
import { useLanguage } from '../../lib/i18n';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  role: Role;
  onLogout?: () => void;
  className?: string;
  user?: any;
}

export function Sidebar({ currentView, onChangeView, role, onLogout, className, user }: SidebarProps) {
  const { t } = useLanguage();

  const getGroupTitle = (title: string) => {
    switch(title) {
      case 'Utama': return t('sidebar.group.main');
      case 'Akademik': return t('sidebar.group.academic');
      case 'Akademik Mandiri': return t('sidebar.group.academic_self');
      case 'Layanan & Berkas': return t('sidebar.group.services_files');
      case 'Inovasi Canggih': return t('sidebar.group.innovation_adv');
      case 'Informasi & Keuangan': return t('sidebar.group.info_finance');
      case 'Penilaian': return t('sidebar.group.grading');
      case 'Bimbingan': return t('sidebar.group.advising');
      case 'Komunikasi': return t('sidebar.group.communication');
      case 'Laporan': return t('sidebar.group.reports');
      case 'Pengaturan': return t('sidebar.group.settings');
      case 'Dashboard': return t('sidebar.group.dashboard');
      case 'Master Data': return t('sidebar.group.master_data');
      case 'Monitoring': return t('sidebar.group.monitoring');
      case 'Pengumuman': return t('sidebar.group.announcements');
      case 'Enterprise Suite': return t('sidebar.group.enterprise_suite');
      case 'Kebijakan Kelas': return t('sidebar.group.class_policy');
      case 'Kebijakan Fakultas': return t('sidebar.group.faculty_policy');
      default: return title;
    }
  };

  const getItemLabel = (id: string, defaultLabel: string) => {
    switch(id) {
      // Main Core
      case 'dashboard': 
        if (role === 'lecturer') return t('nav.dashboard_lecturer');
        if (role === 'admin') return t('nav.dashboard_admin');
        if (role === 'kaprodi') return t('nav.dashboard_kaprodi');
        if (role === 'dekan') return t('nav.dashboard_dekan');
        return t('nav.dashboard');
      case 'inovasi': 
        if (role === 'admin') return t('nav.innovation_hub');
        if (role === 'kaprodi') return t('nav.innovation_ews');
        if (role === 'dekan') return t('nav.innovation_bi');
        return t('nav.inovasi');
      case 'krs': return t('nav.krs');
      case 'khs': return t('nav.khs');
      case 'jadwal': return t('nav.jadwal');
      case 'transkrip': return t('nav.transkrip');
      case 'presensi': return t('nav.presensi');
      case 'keuangan': return t('nav.keuangan');
      case 'profil': 
        if (role === 'lecturer') return t('nav.profile_lecturer');
        return t('nav.profil');
      case 'pengumuman': return t('nav.pengumuman');
      case 'layanan': return t('nav.layanan');
      case 'unduhan': return t('nav.unduhan');
      case 'edom': 
        if (role === 'lecturer') return t('nav.edom_eval');
        if (role === 'admin') return t('nav.monitor_edom');
        return t('nav.edom');

      // Lecturer specific
      case 'jadwal-mengajar': return t('nav.schedule_teaching');
      case 'kelas-perkuliahan': return t('nav.class_lectures');
      case 'presensi-perkuliahan': return t('nav.attendance_lectures');
      case 'jurnal-perkuliahan': return t('nav.journal_teaching');
      case 'kelola-materi': return t('nav.course_materials');
      case 'input-nilai': return t('nav.input_grades');
      case 'rekap-nilai': return t('nav.recap_grades');
      case 'persetujuan-krs': return t('nav.krs_students');
      case 'bimbingan-akademik': return t('nav.advisor_lecturer');
      case 'skripsi': return t('nav.thesis');
      case 'pengumuman-kelas': return t('nav.class_announcements');
      case 'pesan': return t('nav.messages_chat');
      case 'rekap-presensi': return t('nav.recap_attendance');
      case 'bkd': return t('nav.bkd_report');
      case 'riwayat-mengajar': return t('nav.teaching_history');
      case 'ubah-password': return t('nav.change_password');

      // Admin specific
      case 'admin-mahasiswa': return t('nav.students');
      case 'admin-dosen': return t('nav.lecturers');
      case 'admin-prodi': return t('nav.study_programs');
      case 'admin-matakuliah': return t('nav.courses');
      case 'admin-ruangan': return t('nav.rooms');
      case 'admin-user': return t('nav.users');
      case 'admin-tahun-akademik': return t('nav.academic_year');
      case 'admin-kurikulum': return t('nav.curriculum');
      case 'admin-kelas-kuliah': return t('nav.lecture_classes');
      case 'admin-jadwal-kuliah': return t('nav.lecture_schedules');
      case 'admin-krs': return t('nav.krs_admin');
      case 'admin-khs': return t('nav.khs_admin');
      case 'admin-monitoring-presensi': return t('nav.attendance_admin');
      case 'admin-monitoring-nilai': return t('nav.grades_admin');
      case 'admin-monitoring-aktivitas': return t('nav.user_activity');
      case 'admin-laporan': return t('nav.reports_admin');
      case 'admin-pengumuman': return t('nav.announcements_admin');
      case 'admin-workflow': return t('nav.workflow_engine');
      case 'admin-pddikti': return t('nav.pddikti_feeder');
      case 'admin-obe': return t('nav.obe_assessment');
      case 'admin-mbkm': return t('nav.mbkm_module');
      case 'admin-thesis': return t('nav.thesis_defense');
      case 'admin-scheduling': return t('nav.conflict_engine');
      case 'admin-attendance-iot': return t('nav.iot_attendance');
      case 'admin-comm-center': return t('nav.comm_center');
      case 'admin-api-gateway': return t('nav.api_lms_sync');
      case 'admin-accreditation': return t('nav.accreditation_form');
      case 'admin-helpdesk': return t('nav.helpdesk_tickets');
      case 'admin-security-audit': return t('nav.audit_security');
      case 'admin-backup': return t('nav.database_backup');
      case 'admin-log': return t('nav.activity_log');
      case 'admin-role': return t('nav.role_management');

      // Kaprodi Specific
      case 'kaprodi-persetujuan-kelas': return t('nav.class_approval');
      case 'kaprodi-distribusi-beban': return t('nav.teaching_load');
      case 'kaprodi-monitoring-dosen': return t('nav.monitor_lecturer');
      case 'kaprodi-monitoring-nilai': return t('nav.monitor_grades');
      case 'kaprodi-monitoring-presensi': return t('nav.monitor_attendance');
      case 'kaprodi-laporan': return t('nav.report_program');

      // Dekan Specific
      case 'dekan-persetujuan-beban': return t('nav.load_approval');
      case 'dekan-pengesahan-kurikulum': return t('nav.curriculum_approval');
      case 'dekan-monitoring-nilai': return t('nav.monitor_grades');
      case 'dekan-monitoring-kehadiran': return t('nav.monitor_presence');
      case 'dekan-monitoring-keuangan': return t('nav.finance_faculty');
      case 'dekan-laporan': return t('nav.report_faculty');

      default: return defaultLabel;
    }
  };

  // Define all available items for student / admin
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'student'] },
    { id: 'mahasiswa', label: 'Data Mahasiswa', icon: Users, roles: ['admin'] },
    { id: 'krs', label: 'KRS (Rencana Studi)', icon: BookOpen, roles: ['admin', 'student'] },
    { id: 'khs', label: 'KHS (Hasil Studi)', icon: GraduationCap, roles: ['admin', 'student'] },
    { id: 'jadwal', label: 'Jadwal Kuliah', icon: Calendar, roles: ['student'] },
    { id: 'transkrip', label: 'Transkrip Akademik', icon: FileSpreadsheet, roles: ['student'] },
    { id: 'presensi', label: 'Presensi & Absensi', icon: CheckSquare, roles: ['admin', 'student'] },
    { id: 'keuangan', label: 'Keuangan & UKT', icon: CreditCard, roles: ['admin', 'student'] },
    { id: 'profil', label: 'Profil Mahasiswa', icon: UserIcon, roles: ['student'] },
    { id: 'pengumuman', label: 'Pengumuman', icon: Bell, roles: ['student'] },
    { id: 'layanan', label: 'Layanan Akademik', icon: ClipboardList, roles: ['student'] },
    { id: 'unduhan', label: 'Unduhan Dokumen', icon: Download, roles: ['student'] },
  ];

  // Structured groups for Lecturer (Dosen) matching the ideal SIAKAD structure
  const lecturerGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard Dosen', icon: LayoutDashboard },
        { id: 'inovasi', label: 'Inovasi SIAKAD Modern', icon: Sparkles },
        { id: 'showcase', label: 'Showcase Integrasi Library', icon: Layers }
      ]
    },
    {
      title: 'Akademik',
      items: [
        { id: 'jadwal-mengajar', label: 'Jadwal Mengajar', icon: Calendar },
        { id: 'kelas-perkuliahan', label: 'Kelas Perkuliahan', icon: Users },
        { id: 'presensi-perkuliahan', label: 'Presensi Perkuliahan', icon: CheckSquare },
        { id: 'jurnal-perkuliahan', label: 'Jurnal Mengajar', icon: BookOpen },
        { id: 'kelola-materi', label: 'Materi Kuliah', icon: FileText }
      ]
    },
    {
      title: 'Penilaian',
      items: [
        { id: 'input-nilai', label: 'Input Nilai', icon: FileSpreadsheet },
        { id: 'rekap-nilai', label: 'Rekap Nilai', icon: Award }
      ]
    },
    {
      title: 'Bimbingan',
      items: [
        { id: 'persetujuan-krs', label: 'KRS Mahasiswa', icon: ClipboardList },
        { id: 'bimbingan-akademik', label: 'Dosen Wali', icon: Users },
        { id: 'skripsi', label: 'Skripsi / TA', icon: GraduationCap }
      ]
    },
    {
      title: 'Komunikasi',
      items: [
        { id: 'pengumuman-kelas', label: 'Pengumuman Kelas', icon: Bell },
        { id: 'pesan', label: 'Pesan / Chat', icon: MessageSquare }
      ]
    },
    {
      title: 'Laporan',
      items: [
        { id: 'rekap-presensi', label: 'Rekap Presensi', icon: FileText },
        { id: 'bkd', label: 'Laporan BKD', icon: BarChart3 },
        { id: 'riwayat-mengajar', label: 'Riwayat Mengajar', icon: Clock },
        { id: 'edom', label: 'Evaluasi Kinerja (EDOM)', icon: Star }
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        { id: 'profil', label: 'Profil Dosen', icon: UserIcon },
        { id: 'ubah-password', label: 'Ubah Password', icon: Lock }
      ]
    }
  ];

  // Structured groups for Admin matching the requested ideal SIAKAD structure
  const adminGroups = [
    {
      title: 'Dashboard',
      items: [
        { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
        { id: 'inovasi', label: 'Hub Inovasi Modern', icon: Sparkles },
        { id: 'showcase', label: 'Showcase Integrasi Library', icon: Layers }
      ]
    },
    {
      title: 'Master Data',
      items: [
        { id: 'admin-mahasiswa', label: 'Mahasiswa', icon: Users },
        { id: 'admin-dosen', label: 'Dosen', icon: GraduationCap },
        { id: 'admin-prodi', label: 'Program Studi', icon: ClipboardList },
        { id: 'admin-matakuliah', label: 'Mata Kuliah', icon: BookOpen },
        { id: 'admin-ruangan', label: 'Ruangan', icon: Calendar },
        { id: 'admin-user', label: 'User', icon: Users }
      ]
    },
    {
      title: 'Akademik',
      items: [
        { id: 'admin-tahun-akademik', label: 'Tahun Akademik', icon: Clock },
        { id: 'admin-kurikulum', label: 'Kurikulum', icon: FileSpreadsheet },
        { id: 'admin-kelas-kuliah', label: 'Kelas Kuliah', icon: Users },
        { id: 'admin-jadwal-kuliah', label: 'Jadwal Kuliah', icon: Calendar },
        { id: 'admin-krs', label: 'KRS', icon: ClipboardList },
        { id: 'admin-khs', label: 'KHS', icon: GraduationCap }
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { id: 'admin-monitoring-presensi', label: 'Presensi', icon: CheckSquare },
        { id: 'admin-monitoring-nilai', label: 'Nilai', icon: Award },
        { id: 'admin-monitoring-aktivitas', label: 'Aktivitas User', icon: BarChart3 },
        { id: 'edom', label: 'Monitor EDOM', icon: Star }
      ]
    },
    {
      title: 'Laporan',
      items: [
        { id: 'admin-laporan', label: 'Laporan', icon: FileText }
      ]
    },
    {
      title: 'Pengumuman',
      items: [
        { id: 'admin-pengumuman', label: 'Pengumuman', icon: Bell }
      ]
    },
    {
      title: 'Enterprise Suite',
      items: [
        { id: 'admin-workflow', label: 'Workflow Engine', icon: Layers },
        { id: 'admin-pddikti', label: 'PDDIKTI Feeder', icon: Network },
        { id: 'admin-obe', label: 'OBE Assessment', icon: Award },
        { id: 'admin-mbkm', label: 'Modul MBKM', icon: Briefcase },
        { id: 'admin-thesis', label: 'Sidang & Skripsi', icon: GraduationCap },
        { id: 'admin-scheduling', label: 'Conflict Engine', icon: ShieldAlert },
        { id: 'admin-attendance-iot', label: 'IoT Attendance', icon: Cpu },
        { id: 'admin-comm-center', label: 'Comm Center', icon: Send },
        { id: 'admin-api-gateway', label: 'API & LMS Sync', icon: Key },
        { id: 'admin-accreditation', label: 'Borang Akreditasi', icon: FileCheck },
        { id: 'admin-helpdesk', label: 'Helpdesk Tickets', icon: MessageSquare },
        { id: 'admin-security-audit', label: 'Audit & Security', icon: Eye }
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        { id: 'admin-backup', label: 'Backup Database', icon: Download },
        { id: 'admin-log', label: 'Log Aktivitas', icon: Clock },
        { id: 'admin-role', label: 'Manajemen Role', icon: Lock }
      ]
    }
  ];

  // Structured groups for Kaprodi
  const kaprodiGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard Kaprodi', icon: LayoutDashboard },
        { id: 'inovasi', label: 'Inovasi & EWS', icon: Sparkles },
        { id: 'showcase', label: 'Showcase Integrasi Library', icon: Layers }
      ]
    },
    {
      title: 'Kebijakan Kelas',
      items: [
        { id: 'kaprodi-persetujuan-kelas', label: 'Persetujuan Kelas', icon: ClipboardList },
        { id: 'kaprodi-distribusi-beban', label: 'Beban Mengajar', icon: BookOpen }
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { id: 'kaprodi-monitoring-dosen', label: 'Monitoring Dosen', icon: Users },
        { id: 'kaprodi-monitoring-nilai', label: 'Monitoring Nilai', icon: Award },
        { id: 'kaprodi-monitoring-presensi', label: 'Monitoring Presensi', icon: CheckSquare },
        { id: 'edom', label: 'Evaluasi Dosen (EDOM)', icon: Star }
      ]
    },
    {
      title: 'Laporan',
      items: [
        { id: 'kaprodi-laporan', label: 'Laporan Prodi', icon: FileText }
      ]
    }
  ];

  // Structured groups for Dekan
  const dekanGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard Dekan', icon: LayoutDashboard },
        { id: 'inovasi', label: 'Inovasi & BI Analitik', icon: Sparkles },
        { id: 'showcase', label: 'Showcase Integrasi Library', icon: Layers }
      ]
    },
    {
      title: 'Kebijakan Fakultas',
      items: [
        { id: 'dekan-persetujuan-beban', label: 'Beban Mengajar', icon: ClipboardList },
        { id: 'dekan-pengesahan-kurikulum', label: 'Kurikulum Prodi', icon: BookOpen }
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { id: 'dekan-monitoring-nilai', label: 'Monitoring Nilai', icon: Award },
        { id: 'dekan-monitoring-kehadiran', label: 'Monitoring Kehadiran', icon: CheckSquare },
        { id: 'dekan-monitoring-keuangan', label: 'Keuangan Fakultas', icon: CreditCard },
        { id: 'edom', label: 'Evaluasi Dosen (EDOM)', icon: Star }
      ]
    },
    {
      title: 'Laporan',
      items: [
        { id: 'dekan-laporan', label: 'Laporan Fakultas', icon: FileText }
      ]
    }
  ];

  // Structured groups for Student (Mahasiswa)
  const studentGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Akademik Mandiri',
      items: [
        { id: 'krs', label: 'KRS (Rencana Studi)', icon: BookOpen },
        { id: 'khs', label: 'KHS (Hasil Studi)', icon: GraduationCap },
        { id: 'jadwal', label: 'Jadwal Kuliah', icon: Calendar },
        { id: 'transkrip', label: 'Transkrip Akademik', icon: FileSpreadsheet },
        { id: 'presensi', label: 'Presensi & Absensi', icon: CheckSquare },
        { id: 'edom', label: 'Evaluasi Dosen (EDOM)', icon: Star }
      ]
    },
    {
      title: 'Layanan & Berkas',
      items: [
        { id: 'layanan', label: 'Layanan Akademik', icon: ClipboardList },
        { id: 'unduhan', label: 'Unduhan Dokumen', icon: Download }
      ]
    },
    {
      title: 'Inovasi Canggih',
      items: [
        { id: 'inovasi', label: 'Inovasi SIAKAD Modern', icon: Sparkles },
        { id: 'showcase', label: 'Showcase Integrasi Library', icon: Layers }
      ]
    },
    {
      title: 'Informasi & Keuangan',
      items: [
        { id: 'pengumuman', label: 'Pengumuman', icon: Bell },
        { id: 'keuangan', label: 'Keuangan & UKT', icon: CreditCard },
        { id: 'profil', label: 'Profil Mahasiswa', icon: UserIcon }
      ]
    }
  ];

  const baakGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Ringkasan BAAK', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Akademik Global',
      items: [
        { id: 'kurikulum', label: 'Kurikulum & OBE', icon: BookOpen },
        { id: 'penjadwalan', label: 'Smart Scheduling', icon: Calendar },
        { id: 'cuti-status', label: 'Status & Mutasi', icon: Users }
      ]
    }
  ];

  const baukGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Ringkasan BAUK', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Keuangan Global',
      items: [
        { id: 'billing', label: 'Konfigurasi UKT/SPP', icon: CreditCard },
        { id: 'beasiswa', label: 'Manajemen Beasiswa', icon: Award },
        { id: 'rekon', label: 'Rekonsiliasi Bank VA', icon: RefreshCw }
      ]
    }
  ];

  const applicantGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Ringkasan PMB', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Penerimaan',
      items: [
        { id: 'pmb-form', label: 'Formulir PMB', icon: FileText },
        { id: 'ocr-docs', label: 'Verifikasi Dokumen OCR', icon: Upload },
        { id: 'cbt-exam', label: 'Ujian CBT Online', icon: Shield },
        { id: 'register-nim', label: 'Aktivasi NIM & Daftar Ulang', icon: CreditCard }
      ]
    }
  ];

  const alumniGroups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Ringkasan Alumni', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Dokumen Kelulusan',
      items: [
        { id: 'transkrip', label: 'Ijazah & Transkrip', icon: GraduationCap },
        { id: 'tracer', label: 'Tracer Study', icon: Search },
        { id: 'layanan', label: 'Layanan Alumni', icon: FileSpreadsheet },
        { id: 'profil', label: 'Profil Saya', icon: UserIcon }
      ]
    }
  ];

  // State for collapsible sub-sections
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    lecturerGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`lecturer-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Akademik';
    });
    adminGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`admin-${g.title}`] = hasActive || g.title === 'Dashboard' || g.title === 'Master Data';
    });
    kaprodiGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`kaprodi-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Kebijakan Kelas';
    });
    dekanGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`dekan-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Kebijakan Fakultas';
    });
    studentGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`student-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Akademik Mandiri';
    });
    baakGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`baak-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Akademik Global';
    });
    baukGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`bauk-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Keuangan Global';
    });
    applicantGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`applicant-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Penerimaan';
    });
    alumniGroups.forEach(g => {
      const hasActive = g.items.some(item => item.id === currentView);
      initial[`alumni-${g.title}`] = hasActive || g.title === 'Utama' || g.title === 'Dokumen Kelulusan';
    });
    return initial;
  });

  // Auto-expand group when currentView changes
  React.useEffect(() => {
    if (role === 'lecturer') {
      const activeGroup = lecturerGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`lecturer-${activeGroup.title}`]: true }));
      }
    } else if (role === 'admin') {
      const activeGroup = adminGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`admin-${activeGroup.title}`]: true }));
      }
    } else if (role === 'kaprodi') {
      const activeGroup = kaprodiGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`kaprodi-${activeGroup.title}`]: true }));
      }
    } else if (role === 'dekan') {
      const activeGroup = dekanGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`dekan-${activeGroup.title}`]: true }));
      }
    } else if (role === 'student') {
      const activeGroup = studentGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`student-${activeGroup.title}`]: true }));
      }
    } else if (role === 'baak') {
      const activeGroup = baakGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`baak-${activeGroup.title}`]: true }));
      }
    } else if (role === 'bauk') {
      const activeGroup = baukGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`bauk-${activeGroup.title}`]: true }));
      }
    } else if (role === 'applicant') {
      const activeGroup = applicantGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`applicant-${activeGroup.title}`]: true }));
      }
    } else if (role === 'alumni') {
      const activeGroup = alumniGroups.find(g => g.items.some(item => item.id === currentView));
      if (activeGroup) {
        setExpandedGroups(prev => ({ ...prev, [`alumni-${activeGroup.title}`]: true }));
      }
    }
  }, [currentView, role]);

  // Filter items matching the user's role (for non-lecturers/non-admins/non-kaprodi)
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  const renderMenuGroupList = (groups: any[], rolePrefix: string) => {
    return groups.map((group, groupIdx) => {
      const groupKey = `${rolePrefix}-${group.title}`;
      const isExpanded = expandedGroups[groupKey] ?? false;
      const hasActiveItem = group.items.some((item: any) => item.id === currentView);
      
      return (
        <div key={groupIdx} className="space-y-1" id={`sidebar-group-${rolePrefix}-${groupIdx}`}>
          <motion.button
            id={`sidebar-header-btn-${rolePrefix}-${groupIdx}`}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setExpandedGroups(prev => ({
                ...prev,
                [groupKey]: !prev[groupKey]
              }));
            }}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-200 outline-none focus:outline-none select-none text-left cursor-pointer border-0 bg-transparent no-underline",
              hasActiveItem
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold"
                : isExpanded
                ? "text-slate-800 bg-slate-100 hover:bg-slate-200/50 dark:text-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/60"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
            )}
            type="button"
          >
            <span id={`sidebar-header-span-${rolePrefix}-${groupIdx}`} className="flex items-center gap-1.5">
              {hasActiveItem && <span id={`sidebar-active-dot-${rolePrefix}-${groupIdx}`} className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />}
              {getGroupTitle(group.title)}
            </span>
            <ChevronRight 
              id={`sidebar-header-chevron-${rolePrefix}-${groupIdx}`}
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200", 
                isExpanded ? "rotate-90 text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
              )} 
            />
          </motion.button>
          
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                id={`sidebar-subgroup-${rolePrefix}-${groupIdx}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="pl-2 mt-1 space-y-1 ml-2 border-l border-slate-100 dark:border-slate-800/60 overflow-hidden"
              >
                {group.items.map((item: any) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  const isRestrictedForAlumni = role === 'student' && user?.isGraduated && ['krs', 'jadwal', 'presensi', 'edom', 'keuangan'].includes(item.id);
                  
                  return (
                    <motion.button
                      id={`sidebar-item-btn-${rolePrefix}-${item.id}`}
                      key={item.id}
                      onClick={() => onChangeView(item.id)}
                      whileHover={isRestrictedForAlumni ? {} : { x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer outline-none focus:outline-none border-0 no-underline bg-transparent text-left",
                        isActive 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-bold" 
                          : isRestrictedForAlumni
                          ? "text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/10"
                          : "hover:bg-slate-100/60 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 text-slate-500 dark:text-slate-400"
                      )}
                      type="button"
                    >
                      <Icon id={`sidebar-item-icon-${rolePrefix}-${item.id}`} className={cn("mr-2.5 h-4 w-4 flex-shrink-0 transition-colors", isActive ? "text-white" : isRestrictedForAlumni ? "text-slate-300 dark:text-slate-700" : "text-slate-400 dark:text-slate-500")} />
                      <span id={`sidebar-item-text-${rolePrefix}-${item.id}`} className="truncate flex-1 flex items-center justify-between">
                        <span className="truncate">{getItemLabel(item.id, item.label)}</span>
                        {isRestrictedForAlumni && (
                          <Lock className="w-3 h-3 text-amber-500 ml-1.5 flex-shrink-0" />
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <div className={cn("flex flex-col w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 h-screen border-r border-slate-200 dark:border-slate-800 transition-colors duration-200", className)}>
      <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="bg-blue-600 p-1.5 rounded-xl text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-wider font-sans">
          SIAKAD<span className="text-blue-500">.</span>
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4" id="sidebar-menu-scrollable">
        <div className="space-y-3 px-3" id="sidebar-menu-wrapper">
          {role === 'lecturer' ? (
            renderMenuGroupList(lecturerGroups, 'lecturer')
          ) : role === 'admin' ? (
            renderMenuGroupList(adminGroups, 'admin')
          ) : role === 'kaprodi' ? (
            renderMenuGroupList(kaprodiGroups, 'kaprodi')
          ) : role === 'dekan' ? (
            renderMenuGroupList(dekanGroups, 'dekan')
          ) : role === 'baak' ? (
            renderMenuGroupList(baakGroups, 'baak')
          ) : role === 'bauk' ? (
            renderMenuGroupList(baukGroups, 'bauk')
          ) : role === 'applicant' ? (
            renderMenuGroupList(applicantGroups, 'applicant')
          ) : role === 'alumni' ? (
            renderMenuGroupList(alumniGroups, 'alumni')
          ) : (
            renderMenuGroupList(studentGroups, 'student')
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1 flex-shrink-0">
        <motion.button 
          id="sidebar-logout-btn"
          onClick={onLogout}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="flex items-center w-full px-3 py-2.5 text-xs font-semibold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors cursor-pointer outline-none focus:outline-none border-0 no-underline bg-transparent"
          type="button"
        >
          <LogOut className="mr-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          {t('nav.logout')}
        </motion.button>
      </div>
    </div>
  );
}
