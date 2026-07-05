import React, { useState } from 'react';
import { User } from '../../types';
import {
  initialUsers,
  initialStudents,
  initialLecturers,
  initialProdis,
  initialCourses,
  initialRooms,
  initialAcademicYears,
  initialClasses,
  initialSchedules,
  initialKrsData,
  initialAnnouncements,
  initialActivityLogs,
  initialBillingInvoices,
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
} from '../../data/adminMockData';

// Sub Module Imports
import { AdminMasterDataModule } from './admin/AdminMasterDataModule';
import { AdminAcademicModule } from './admin/AdminAcademicModule';
import { AdminMonitoringModule } from './admin/AdminMonitoringModule';
import { AdminSettingsModule } from './admin/AdminSettingsModule';
import { AdminEnterpriseSuiteModule } from './admin/AdminEnterpriseSuiteModule';
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
  // MASTER MUTABLE STATES for all SIAKAD Admin Entities
  const [usersList, setUsersList] = useState<AdminUser[]>(initialUsers);
  const [studentsList, setStudentsList] = useState<AdminStudent[]>(initialStudents);
  const [lecturersList, setLecturersList] = useState<AdminLecturer[]>(initialLecturers);
  const [prodisList, setProdisList] = useState<AdminProdi[]>(initialProdis);
  const [coursesList, setCoursesList] = useState<AdminCourse[]>(initialCourses);
  const [roomsList, setRoomsList] = useState<AdminRoom[]>(initialRooms);
  const [academicYearsList, setAcademicYearsList] = useState<AdminAcademicYear[]>(initialAcademicYears);
  const [classesList, setClassesList] = useState<AdminClass[]>(initialClasses);
  const [schedulesList, setSchedulesList] = useState<AdminSchedule[]>(initialSchedules);
  const [krsList, setKrsList] = useState<AdminKrsItem[]>(initialKrsData);
  const [announcementsList, setAnnouncementsList] = useState<AdminAnnouncement[]>(initialAnnouncements);
  const [activityLogsList, setActivityLogsList] = useState<AdminActivityLog[]>(initialActivityLogs);
  const [invoicesList, setInvoicesList] = useState<AdminBillingInvoice[]>(initialBillingInvoices);

  // Curriculums state
  const [curriculums, setCurriculums] = useState([
    { id: 'curr-1', kode: 'KUR2020', nama: 'Kurikulum Nasional 2020', status: 'Aktif', totalSks: 144 },
    { id: 'curr-2', kode: 'KUR-MERDEKA', nama: 'Kurikulum Merdeka Belajar', status: 'Draft', totalSks: 140 }
  ]);

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
    // Recharts Mock Data
    const gpaTrendData = [
      { name: '2022', gpa: 3.31 },
      { name: '2023', gpa: 3.42 },
      { name: '2024', gpa: 3.48 },
      { name: '2025', gpa: 3.55 },
      { name: '2026', gpa: 3.58 },
    ];

    const prodiDistributionData = prodisList.map(p => {
      const count = studentsList.filter(s => s.prodi === p.nama).length;
      return { name: p.kode, jumlah: count || Math.floor(Math.random() * 4) + 1 };
    });

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
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider">Total Mahasiswa</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{studentsList.length}</div>
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
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3">
                <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider">Total Dosen</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{lecturersList.length}</div>
                    <div className="ml-2 flex items-baseline text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      +{activeLecturersCount} Aktif
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
                <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider">Mata Kuliah</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{coursesList.length}</div>
                    <span className="ml-2 text-xs text-slate-400 font-bold">Terdaftar</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
                <ClipboardList className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider">Kelas & Jadwal</dt>
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full uppercase">Tahun Ajaran Aktif</span>
            <h3 className="text-lg md:text-xl font-extrabold">
              Semester {activeSemester?.semester} TA {activeSemester?.tahunAjaran}
            </h3>
            <p className="text-xs text-blue-100 max-w-xl font-medium">
              Pengisian KRS sedang <span className="font-bold underline">{activeSemester?.isKrsBuka ? 'DIBUKA' : 'DITUTUP'}</span> untuk seluruh mahasiswa. Anda dapat mengelola masa akademik dan penutupan krs melalui tab Tahun Akademik.
            </p>
          </div>
          <button 
            onClick={() => onChangeTab?.('admin-tahun-akademik')}
            className="flex items-center gap-1 bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            Kelola Akademik
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recharts Graphical ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend IPK */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                  <YAxis domain={[3.0, 4.0]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#adminGpaColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Distribusi Mahasiswa per Program Studi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prodiDistributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 1 &bull; Sinkronisasi Google Classroom / Moodle API</span>
              <LmsHybridModule />
            </div>

            {/* Smart Communication Forum & Gateway */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 2 &bull; WA Gateway &amp; Panel Pengumuman Tertarget</span>
              <SmartCommunicationModule role="lecturer" />
            </div>

            {/* AI Plagiarism & Digital Signatures */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 3 &bull; Tanda Tangan Digital &amp; Deteksi Integritas</span>
              <ModernTechModule />
            </div>

            {/* Student SKPI & KRS Tracker */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 4 &bull; Dashboard Kemandirian Mahasiswa (SKPI)</span>
              <StudentSelfServiceModule />
            </div>
          </div>

          {/* Security, 2FA & Audit Logs */}
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 5 &bull; Pengaturan 2FA Admin &amp; Log Audit Trail Menyeluruh</span>
            <SecurityComplianceModule user={user} />
          </div>
        </div>
      );
    }

    if (activeTab === 'edom') {
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block font-sans">Administrasi &bull; Monitor Kinerja EDOM Dosen Se-Universitas</span>
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
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />
          <p className="text-xs font-bold leading-tight">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
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
