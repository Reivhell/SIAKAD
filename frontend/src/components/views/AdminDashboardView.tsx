import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { getDashboardSummary, DashboardSummary } from '../../api/dashboard.api';
import {
  getAdminOverview,
  AdminUser,
  AdminStudent,
  AdminLecturer,
  AdminProdi,
  AdminCourse,
  AdminRoom,
  AdminAcademicYear,
  AdminClass,
  AdminSchedule,
  AdminKrsItem,
  AdminAnnouncement,
  AdminActivityLog,
  AdminBillingInvoice
} from '../../api/academic.api';

// Sub Module Imports
import { AdminMasterDataModule } from './admin/AdminMasterDataModule';
import { AdminAcademicModule } from './admin/AdminAcademicModule';
import { AdminMonitoringModule } from './admin/AdminMonitoringModule';
import { AdminSettingsModule } from './admin/AdminSettingsModule';
import { AdminEnterpriseSuiteModule } from './admin/AdminEnterpriseSuiteModule';
import { 
  LecturerRatingModule } from '../widgets/LecturerRatingModule';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ClipboardList,
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface AdminDashboardViewProps {
  user: User;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

export function AdminDashboardView({ user, activeTab = 'dashboard', onChangeTab }: AdminDashboardViewProps) {
  // MASTER MUTABLE STATES for all SIAKAD Admin Entities (diisi dari basis data)
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [studentsList, setStudentsList] = useState<AdminStudent[]>([]);
  const [lecturersList, setLecturersList] = useState<AdminLecturer[]>([]);
  const [prodisList, setProdisList] = useState<AdminProdi[]>([]);
  const [coursesList, setCoursesList] = useState<AdminCourse[]>([]);
  const [roomsList, setRoomsList] = useState<AdminRoom[]>([]);
  const [academicYearsList, setAcademicYearsList] = useState<AdminAcademicYear[]>([]);
  const [classesList, setClassesList] = useState<AdminClass[]>([]);
  const [schedulesList, setSchedulesList] = useState<AdminSchedule[]>([]);
  const [krsList, setKrsList] = useState<AdminKrsItem[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<AdminAnnouncement[]>([]);
  const [activityLogsList, setActivityLogsList] = useState<AdminActivityLog[]>([]);
  const [invoicesList, setInvoicesList] = useState<AdminBillingInvoice[]>([]);

  // Live summary from backend (falls back to real list counts while loading/on error)
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminOverview()
      .then((data) => {
        if (cancelled) return;
        setUsersList(data.users);
        setStudentsList(data.students);
        setLecturersList(data.lecturers);
        setProdisList(data.prodis);
        setCoursesList(data.courses);
        setRoomsList(data.rooms);
        setAcademicYearsList(data.academicYears);
        setClassesList(data.classes);
        setSchedulesList(data.schedules);
        setKrsList(data.krs);
        setAnnouncementsList(data.announcements);
        setActivityLogsList(data.activityLogs);
        setInvoicesList(data.billing);
      })
      .catch((err) => console.error('Gagal memuat overview admin:', err));
    getDashboardSummary()
      .then((s) => {
        if (!cancelled) setSummary(s);
      })
      .catch(() => {
        // ringkasan tetap berasal dari daftar nyata yang sudah dimuat
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Kurikulum diturunkan dari data prodi & mata kuliah yang nyata
  const [curriculums, setCurriculums] = useState<Array<{ id: string; kode: string; nama: string; status: string; totalSks: number }>>([]);
  useEffect(() => {
    if (prodisList.length && coursesList.length) {
      setCurriculums(
        prodisList.map((p, i) => {
          const mk = coursesList.filter((c) => c.prodi === p.nama);
          return {
            id: `curr-${p.id}`,
            kode: `KUR${p.kode}`,
            nama: `Kurikulum ${p.nama}`,
            status: i === 0 ? 'Aktif' : 'Draft',
            totalSks: mk.reduce((sum, c) => sum + c.sks, 0) || 144,
          };
        }),
      );
    }
  }, [prodisList, coursesList]);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    // Also write a new log entry
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      user: user.name,
      role: 'Admin',
      action: msg,
      ip: '192.168.10.12',
      time: 'Baru saja'
    };
    setActivityLogsList(prev => [newLog, ...prev]);
  };

  // Helper values for Dashboard Stats
  const activeStudentsCount = studentsList.filter(s => s.status === 'Aktif').length;
  const activeLecturersCount = lecturersList.filter(l => l.status === 'Aktif').length;
  const classCount = classesList.length;
  const activeSemester = academicYearsList.find(y => y.isAktif);

  // Render Admin Dashboard Landing
  const renderDashboardLanding = () => {
    const s = summary;
    // Recharts Mock Data (fallback until live data arrives)
    const gpaTrendData = s?.gpaTrend?.length
      ? s.gpaTrend
      : [
          { name: '2022', gpa: 3.31 },
          { name: '2023', gpa: 3.42 },
          { name: '2024', gpa: 3.48 },
          { name: '2025', gpa: 3.55 },
          { name: '2026', gpa: 3.58 },
        ];

    const prodiDistributionData = s?.facultyDistribution?.length
      ? s.facultyDistribution.map((f) => ({ name: f.name, jumlah: f.count }))
      : prodisList.map(p => {
          const count = studentsList.filter(s => s.prodi === p.nama).length;
          return { name: p.kode, jumlah: count };
        });

    const kpi = (i: number) => s?.kpis[i]?.value;
    const activePeriod = s?.activePeriod;
    const periodParts = activePeriod ? activePeriod.split('-') : [];
    const bannerSemester = periodParts[1] ?? activeSemester?.semester;
    const bannerTahun = periodParts[0] ?? activeSemester?.tahunAjaran;

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncater">Total Mahasiswa</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpi(0) ?? studentsList.length}</div>
                    <div className="ml-2 flex items-baseline text-xs font-bold text-green-600 dark:text-green-400">
                      <TrendingUp className="self-center flex-shrink-0 h-3 w-3 mr-0.5" />
                      +{activeStudentsCount} Aktif
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncater">Total Dosen</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpi(1) ?? lecturersList.length}</div>
                    <div className="ml-2 flex items-baseline text-xs font-bold text-blue-600 dark:text-blue-400">
                      +{activeLecturersCount} Aktif
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncater">Mata Kuliah</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpi(2) ?? coursesList.length}</div>
                    <span className="ml-2 text-xs text-slate-400 font-bold">Terdaftar</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncater">Kelas & Jadwal</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{classCount}</div>
                    <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">{schedulesList.length} Jadwal</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Active Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full uppercase">Tahun Ajaran Aktif</span>
            <h3 className="text-lg md:text-xl font-extrabold">
              Semester {bannerSemester} TA {bannerTahun}
            </h3>
            <p className="text-xs text-blue-100 max-w-xl font-medium">
              Pengisian KRS sedang <span className="font-bold underline">{activeSemester?.isKrsBuka ? 'DIBUKA' : 'DITUTUP'}</span> untuk seluruh mahasiswa. Anda dapat mengelola masa akademik dan penutupan krs melalui tab Tahun Akademik.
            </p>
          </div>
          <button 
            onClick={() => onChangeTab?.('admin-tahun-akademik')}
            className="flex items-center gap-1 bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-colors"
          >
            Kelola Akademik
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recharts Graphical ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend IPK */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Rata-Rata Kelulusan IPK Mahasiswa</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminGpaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-ink-muted)', fontSize: 11}} dy={10} />
                  <YAxis domain={[3.0, 4.0]} axisLine={false} tickLine={false} tick={{fill: 'var(--color-ink-muted)', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#adminGpaColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Distribusi Mahasiswa per Program Studi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prodiDistributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-ink-muted)', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-ink-muted)', fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(148, 163, 184, 0.05)'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Bar dataKey="jumlah" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Admin Logs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Log Aktivitas Sistem Terkini</h3>
            <button 
              onClick={() => onChangeTab?.('admin-log')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Semua Log
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {activityLogsList.slice(0, 4).map((log) => (
              <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-[10px]">
                    {log.role.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{log.action}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{log.user} &bull; IP: {log.ip}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Helper to render active view
  const renderView = () => {
    // 1. Master Data tabs
    if ([
      'admin-mahasiswa', 
      'admin-dosen', 
      'admin-prodi', 
      'admin-matakuliah', 
      'admin-ruangan', 
      'admin-user'
    ].includes(activeTab)) {
      return (
        <AdminMasterDataModule
          activeTab={activeTab}
          users={usersList}
          setUsers={setUsersList}
          students={studentsList}
          setStudents={setStudentsList}
          lecturers={lecturersList}
          setLecturers={setLecturersList}
          prodis={prodisList}
          setProdis={setProdisList}
          courses={coursesList}
          setCourses={setCoursesList}
          rooms={roomsList}
          setRooms={setRoomsList}
          onShowToast={triggerToast}
        />
      );
    }

    // 2. Academic tabs
    if ([
      'admin-tahun-akademik',
      'admin-kurikulum',
      'admin-kelas-kuliah',
      'admin-jadwal-kuliah',
      'admin-krs',
      'admin-khs'
    ].includes(activeTab)) {
      return (
        <AdminAcademicModule
          activeTab={activeTab}
          academicYears={academicYearsList}
          setAcademicYears={setAcademicYearsList}
          classes={classesList}
          setClasses={setClassesList}
          schedules={schedulesList}
          setSchedules={setSchedulesList}
          krsData={krsList}
          setKrsData={setKrsList}
          courses={coursesList}
          setCourses={setCoursesList}
          students={studentsList}
          lecturers={lecturersList}
          rooms={roomsList}
          curriculums={curriculums}
          setCurriculums={setCurriculums}
          onShowToast={triggerToast}
        />
      );
    }

    // 3. Monitoring, Laporan, & Audit tabs
    if ([
      'admin-monitoring-presensi',
      'admin-monitoring-nilai',
      'admin-monitoring-aktivitas',
      'admin-laporan',
      'admin-log'
    ].includes(activeTab)) {
      return (
        <AdminMonitoringModule
          activeTab={
            activeTab === 'admin-monitoring-aktivitas' || activeTab === 'admin-log'
              ? 'admin-log-aktivitas'
              : activeTab === 'admin-laporan'
              ? 'admin-laporan-akademik'
              : activeTab
          }
          students={studentsList}
          classes={classesList}
          lecturers={lecturersList}
          onShowToast={triggerToast}
        />
      );
    }

    // 4. Settings & Other tabs
    if ([
      'admin-pengumuman',
      'admin-backup',
      'admin-role',
      'admin-keuangan'
    ].includes(activeTab)) {
      return (
        <AdminSettingsModule
          activeTab={activeTab}
          announcements={announcementsList}
          setAnnouncements={setAnnouncementsList}
          invoices={invoicesList}
          setInvoices={setInvoicesList}
          onShowToast={triggerToast}
        />
      );
    }

    // 5. Enterprise Suite tabs
    if ([
      'admin-workflow',
      'admin-pddikti',
      'admin-obe',
      'admin-mbkm',
      'admin-thesis',
      'admin-scheduling',
      'admin-attendance-iot',
      'admin-comm-center',
      'admin-api-gateway',
      'admin-accreditation',
      'admin-helpdesk',
      'admin-security-audit'
    ].includes(activeTab)) {
      return (
        <AdminEnterpriseSuiteModule
          activeTab={activeTab}
          onShowToast={triggerToast}
        />
      );
    }

    if (activeTab === 'inovasi') {
      return (
        <div className="space-y-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Modul ini sedang dalam pengembangan.</p>
        </div>
      );
    }

    if (activeTab === 'edom') {
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 block font-sans">Administrasi &bull; Monitor Kinerja EDOM Dosen Se-Universitas</span>
            <LecturerRatingModule user={user} />
          </div>
        </div>
      );
    }

    // Default or Fallback Dashboard landing
    return renderDashboardLanding();
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-8 font-sans transition-colors relative">
      {/* Toast Alert Widget */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 dark:border-slate-100 animate-slideUp">
          <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-xs font-bold leading-tight">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div>
          <span className="text-[10px] font-boldr text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
            SIAKAD Admin &bull; Portal Administrator Utama
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-2 leading-tight">
            Sistem Informasi Akademik Utama
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Petugas Aktif: <span className="text-slate-700 dark:text-slate-300 font-bold">{user.name}</span> &bull; Hak Akses: Administrator Universitas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
            ADM
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Database</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              Sinkron (Live)
            </span>
          </div>
        </div>
      </div>

      {/* View router contents */}
      {renderView()}
    </div>
  );
}
