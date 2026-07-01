import React from 'react';
import { ChevronRight, Home, GraduationCap, Shield, User, Users, BookOpen, Layers } from 'lucide-react';
import { Role } from '../../types';

interface BreadcrumbProps {
  role: Role;
  currentView: string;
  onNavigate: (view: string) => void;
}

// Maps role keys to user-friendly titles & icons
const roleMeta: Record<Role, { label: string; icon: React.ReactNode; path: string }> = {
  student: {
    label: 'Mahasiswa',
    icon: <User className="w-4 h-4 text-blue-500" />,
    path: '/siakad/mahasiswa',
  },
  lecturer: {
    label: 'Dosen',
    icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
    path: '/siakad/dosen',
  },
  admin: {
    label: 'Administrator',
    icon: <Shield className="w-4 h-4 text-rose-500" />,
    path: '/admin',
  },
  kaprodi: {
    label: 'Kaprodi',
    icon: <Layers className="w-4 h-4 text-amber-500" />,
    path: '/siakad/kaprodi',
  },
  dekan: {
    label: 'Dekan',
    icon: <BookOpen className="w-4 h-4 text-indigo-500" />,
    path: '/siakad/dekan',
  },
  alumni: {
    label: 'Alumni',
    icon: <GraduationCap className="w-4 h-4 text-amber-500" />,
    path: '/siakad/alumni',
  },
  baak: {
    label: 'BAAK',
    icon: <BookOpen className="w-4 h-4 text-violet-500" />,
    path: '/siakad/baak',
  },
  bauk: {
    label: 'BAUK',
    icon: <Shield className="w-4 h-4 text-sky-500" />,
    path: '/siakad/bauk',
  },
  applicant: {
    label: 'Calon Mahasiswa',
    icon: <User className="w-4 h-4 text-indigo-500" />,
    path: '/siakad/applicant',
  },
};

// Comprehensive Indonesian-themed label mappings for academic sub-views
const viewLabelMap: Record<string, string> = {
  dashboard: 'Ringkasan Dashboard',
  krs: 'Kartu Rencana Studi (KRS)',
  khs: 'Kartu Hasil Studi (KHS)',
  jadwal: 'Jadwal Perkuliahan',
  transkrip: 'Transkrip Nilai Kumulatif',
  presensi: 'Kehadiran & Presensi',
  keuangan: 'Status Pembayaran Keuangan',
  profil: 'Profil Pengguna',
  pengumuman: 'Pengumuman Fakultas',
  layanan: 'Layanan Mahasiswa',
  unduhan: 'Unduhan Dokumen Akademik',
  inovasi: 'Pusat Inovasi AI',
  edom: 'Evaluasi Dosen (EDOM)',
  'ubah-password': 'Keamanan & Sandi',
  showcase: 'Showcase Integrasi Library',
  
  // Dosen Specific Tab Labels
  'jadwal-mengajar': 'Jadwal Mengajar',
  'kelas-perkuliahan': 'Kelola Kelas Perkuliahan',
  'presensi-perkuliahan': 'Presensi Perkuliahan',
  'jurnal-perkuliahan': 'Jurnal Perkuliahan',
  'input-nilai': 'Input Nilai Mahasiswa',
  'kelola-tugas': 'Kelola Tugas & Kuis',
  'kelola-materi': 'Kelola Materi Kuliah',
  'bimbingan-akademik': 'Bimbingan Akademik (PA)',
  'persetujuan-krs': 'Persetujuan KRS',
  skripsi: 'Bimbingan Skripsi/TA',
  pesan: 'Kotak Pesan',
  'pengumuman-kelas': 'Pengumuman Kelas',
  'rekap-presensi': 'Rekap Presensi Mengajar',
  'rekap-nilai': 'Rekap Nilai Kuliah',
  bkd: 'Beban Kerja Dosen (BKD)',
  'riwayat-mengajar': 'Riwayat Mengajar',

  // Admin Specific Tab Labels
  'admin-dashboard': 'Ringkasan Admin',
  'admin-mahasiswa': 'Manajemen Data Mahasiswa',
  'admin-dosen': 'Manajemen Data Dosen',
  'admin-prodi': 'Manajemen Program Studi',
  'admin-matakuliah': 'Manajemen Mata Kuliah',
  'admin-ruangan': 'Manajemen Ruangan & Gedung',
  'admin-user': 'Manajemen Akses & User',
  'admin-monitoring-aktivitas': 'Log Aktivitas Sistem',
  'admin-laporan': 'Laporan Sistem Utama',

  // Dekan Specific Tab Labels
  'dekan-persetujuan-beban': 'Persetujuan Beban Kerja',
  'dekan-pengesahan-kurikulum': 'Pengesahan Kurikulum',
  'dekan-monitoring-nilai': 'Monitoring Nilai Fakultas',
  'dekan-monitoring-kehadiran': 'Monitoring Kehadiran Kuliah',
  'dekan-monitoring-keuangan': 'Monitoring Keuangan Fakultas',
  'dekan-laporan': 'Laporan Kinerja Akademik',
};

export function Breadcrumb({ role, currentView, onNavigate }: BreadcrumbProps) {
  const meta = roleMeta[role];
  const currentViewLabel = viewLabelMap[currentView] || currentView;

  return (
    <nav className="flex items-center space-x-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-sans mb-6 bg-white dark:bg-slate-900/40 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs backdrop-blur-xs transition-all w-fit">
      {/* Level 1: Home / Portal */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors cursor-pointer"
        title="Kembali ke Dashboard Utama"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">SIAKAD Portal</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-600 shrink-0" />

      {/* Level 2: Role Level */}
      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
        {meta?.icon}
        <span>{meta?.label || 'Portal'}</span>
      </div>

      {currentView !== 'dashboard' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-600 shrink-0" />
          {/* Level 3: Current Module / Feature */}
          <span className="font-medium text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/10 dark:border-blue-500/20 max-w-[220px] sm:max-w-xs truncate">
            {currentViewLabel}
          </span>
        </>
      )}
    </nav>
  );
}
