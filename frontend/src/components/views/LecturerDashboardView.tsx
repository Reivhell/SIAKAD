import React, { useState, useMemo } from 'react';
import { User } from '../../types';

import {
  initialLecturerProfile,
  initialJadwalMengajar,
  initialKelas,
  initialStudents,
  initialJurnal,
  initialTugas,
  initialMateri,
  initialSkripsi,
  initialChats,
} from '../../data/lecturerMockData';

// Sub Module Imports
import { LecturerProfileModule } from './lecturer/LecturerProfileModule';
import { LecturerAcademicModule } from './lecturer/LecturerAcademicModule';
import { LecturerGradeModule } from './lecturer/LecturerGradeModule';
import { LecturerBimbinganModule } from './lecturer/LecturerBimbinganModule';
import { LecturerCommunicationModule } from './lecturer/LecturerCommunicationModule';
import { 
  LmsHybridModule, 
  SmartCommunicationModule, 
  StudentSelfServiceModule, 
  SecurityComplianceModule, 
  ModernTechModule,
  MobilePwaControlBar
} from '../widgets/ModernSiaFeatures';
import { LecturerRatingModule } from '../widgets/LecturerRatingModule';
import { AcademicDatesWidget } from '../widgets/AcademicDatesWidget';
import { AnnouncementTicker } from '../widgets/AnnouncementTicker';
import { EnterpriseControlSuite } from '../widgets/EnterpriseControlSuite';
import { CentralizedTasksModule } from '../widgets/CentralizedTasksModule';
import { SksConversionModule } from '../widgets/SksConversionModule';

import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Bell, 
  Info, 
  Sparkles,
  BookOpen,
  Award,
  BookOpenCheck,
  ClipboardCheck
} from 'lucide-react';

interface LecturerDashboardViewProps {
  user: User;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
  onUserChange?: (newUser: User) => void;
}

export function LecturerDashboardView({ user, activeTab = 'dashboard', onChangeTab, onUserChange }: LecturerDashboardViewProps) {
  // Master states representing active lecturer database
  const [profile, setProfile] = useState(initialLecturerProfile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [students, setStudents] = useState(initialStudents);
  const [jurnal, setJurnal] = useState(initialJurnal);
  const [tugas, setTugas] = useState(initialTugas);
  const [materi, setMateri] = useState(initialMateri);
  const [skripsi, setSkripsi] = useState(initialSkripsi);
  const [chats, setChats] = useState(initialChats);

  const jadwal = useMemo(() => initialJadwalMengajar, []);
  const kelas = useMemo(() => initialKelas, []);
  const todayClasses = useMemo(() => initialJadwalMengajar.filter(j => j.day === 'Senin'), []);
  const kelasCount = useMemo(() => initialKelas.length, []);
  const totalStudentsCount = useMemo(() => initialStudents.length, []);
  const pendingKrsCount = useMemo(() => initialStudents.filter((s: any) => s.krsStatus === 'Menunggu').length, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync with global user object from props
  React.useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        foto: user.avatar || prev.foto
      }));
    }
  }, [user]);

  // Sync back to global user object if profile state changes
  React.useEffect(() => {
    if (user && onUserChange) {
      if (profile.name !== user.name || profile.email !== user.email || profile.phone !== user.phone || profile.foto !== user.avatar) {
        onUserChange({
          ...user,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.foto
        });
      }
    }
  }, [profile, user, onUserChange]);
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-8 font-sans transition-colors relative">
      {/* Toast Alert Widget */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-slate-800 dark:border-slate-100">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />
          <p className="text-xs font-bold leading-tight">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
            SIAKAD Dosen &bull; Portal Utama
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-2 leading-tight">
            Selamat Datang, {profile.name}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            NIDN. {profile.nidn} &bull; Jabatan Akademis: {profile.jabatan}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-extrabold text-xs">
            PROF
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Akun</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Terverifikasi SISTER</span>
          </div>
        </div>
      </div>

      {/* CORE ROUTING SECTION */}

      {/* 1. LECTURER DASHBOARD / HUB (MAIN TAB) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Scrolling Announcement Ticker */}
          <AnnouncementTicker />

          {/* Main Stat Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Stat 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Kelas Diampu</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{kelasCount} Kelas</h3>
              <p className="text-[10px] text-slate-500">Semester Ganjil Aktif</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Mahasiswa Wali</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{totalStudentsCount} Orang</h3>
              <p className="text-[10px] text-slate-500">Bimbingan Akademik</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <ClipboardCheck className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Persetujuan KRS</span>
              </div>
              <h3 className={`text-2xl font-extrabold ${pendingKrsCount > 0 ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
                {pendingKrsCount} Antrean
              </h3>
              <p className="text-[10px] text-slate-500">Perlu Peninjauan Segera</p>
            </div>

            {/* Stat 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Mengajar Hari Ini</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                {todayClasses.length} Sesi
              </h3>
              <p className="text-[10px] text-slate-500">Lihat Modul Jadwal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Today's Teaching Schedule */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-blue-500" /> Jadwal Mengajar Hari Ini
                </h4>
                <div className="space-y-4">
                  {todayClasses.map((item) => (
                    <div key={item.id} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                          {item.code}
                        </span>
                        <h5 className="text-xs font-extrabold text-slate-800 dark:text-white mt-1">{item.name}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.class} &bull; Ruang {item.room}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 rounded-xl">
                        {item.time}
                      </span>
                    </div>
                  ))}
                  {todayClasses.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">Tidak ada jadwal mengajar hari ini.</p>
                  )}
                </div>
              </div>

              {/* Centralized Task Deadline Manager */}
              <CentralizedTasksModule role="lecturer" />

              {/* Academic Notifications Alerts */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-blue-500" /> Peringatan & Notifikasi Akademik
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 border border-amber-100/60 dark:border-amber-950 bg-amber-500/5 rounded-xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-700 dark:text-slate-200">KRS Mahasiswa Menunggu Approval</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Ada {pendingKrsCount} mahasiswa wali yang mengumpulkan draf KRS baru. Segera periksa berkas.</p>
                    </div>
                  </div>
                  <div className="p-3.5 border border-blue-100/60 dark:border-blue-950 bg-blue-500/5 rounded-xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-700 dark:text-slate-200">Batas Pengisian Nilai Ganjil</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pengisian nilai komponen & final ditutup dalam 10 hari ke depan.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SKS Course Equivalence Conversion Proposals */}
              <SksConversionModule role="lecturer" />
            </div>

            {/* Campus Notices / Pengumuman Terkini & Academic Dates */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Pengumuman Kampus Terbaru</h4>
                <div className="space-y-4 text-xs font-semibold">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
                    <span className="text-[9px] text-slate-400 block font-mono">24 Juni 2026</span>
                    <h5 className="text-slate-800 dark:text-slate-200 text-xs font-bold leading-tight">Pengajuan Hibah Riset Penelitian Dosen 2026</h5>
                    <p className="text-[11px] text-slate-500 font-normal">Sponsor riset dibuka untuk topik AI, Blockchain, dan Sustainable Tech.</p>
                  </div>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
                    <span className="text-[9px] text-slate-400 block font-mono">20 Juni 2026</span>
                    <h5 className="text-slate-800 dark:text-slate-200 text-xs font-bold leading-tight">Pemeliharaan Server Portal SIAKAD</h5>
                    <p className="text-[11px] text-slate-500 font-normal">Portal tidak dapat diakses pada hari Sabtu mulai pukul 22.00 s.d 02.00 WIB.</p>
                  </div>
                </div>
              </div>

              <AcademicDatesWidget />
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFILE & PASSWORD ROUTE MODULES */}
      {(activeTab === 'profil' || activeTab === 'ubah-password') && (
        <LecturerProfileModule 
          profile={profile} 
          setProfile={setProfile} 
          onShowToast={triggerToast} 
          subTab={activeTab} 
        />
      )}

      {/* 3. ACADEMIC ROUTE MODULES */}
      {(activeTab === 'jadwal-mengajar' || activeTab === 'kelas-perkuliahan' || activeTab === 'presensi-perkuliahan' || activeTab === 'jurnal-perkuliahan') && (
        <LecturerAcademicModule 
          jadwal={jadwal} 
          kelas={kelas} 
          students={students} 
          setStudents={setStudents} 
          jurnal={jurnal} 
          setJurnal={setJurnal} 
          onShowToast={triggerToast} 
          subTab={activeTab} 
        />
      )}

      {/* 4. GRADE ROUTE MODULES */}
      {(activeTab === 'input-nilai' || activeTab === 'kelola-tugas' || activeTab === 'kelola-materi') && (
        <LecturerGradeModule 
          students={students} 
          setStudents={setStudents} 
          tugas={tugas} 
          setTugas={setTugas} 
          materi={materi} 
          setMateri={setMateri} 
          onShowToast={triggerToast} 
          subTab={activeTab} 
        />
      )}

      {/* 5. BIMBINGAN ROUTE MODULES */}
      {(activeTab === 'bimbingan-akademik' || activeTab === 'persetujuan-krs' || activeTab === 'skripsi') && (
        <LecturerBimbinganModule 
          students={students} 
          setStudents={setStudents} 
          skripsi={skripsi} 
          setSkripsi={setSkripsi} 
          onShowToast={triggerToast} 
          subTab={activeTab} 
        />
      )}

      {/* 6. COMMUNICATION & REPORTS ROUTE MODULES */}
      {(activeTab === 'pesan' || activeTab === 'pengumuman-kelas' || activeTab === 'rekap-presensi' || activeTab === 'rekap-nilai' || activeTab === 'bkd' || activeTab === 'riwayat-mengajar') && (
        <LecturerCommunicationModule 
          students={students} 
          jurnal={jurnal} 
          chats={chats} 
          setChats={setChats} 
          onShowToast={triggerToast} 
          subTab={activeTab} 
        />
      )}

      {/* 7. INOVASI & FITUR CANGGIH DOSEN */}
      {activeTab === 'inovasi' && (
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
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 1 &bull; Kelas Hybrid &amp; Sinkronisasi LMS</span>
              <LmsHybridModule />
            </div>

            {/* Smart Communication Forum & Gateway */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 2 &bull; Komunikasi Cerdas (WA &amp; Pengumuman Blast)</span>
              <SmartCommunicationModule role="lecturer" />
            </div>

            {/* AI Plagiarism & Digital Signatures */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 3 &bull; TTE (E-Sign) &amp; Cek Plagiarisme Tugas</span>
              <ModernTechModule />
            </div>

            {/* Student Advising Status Monitor (Self-service perwalian viewer) */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 4 &bull; Log &amp; Catatan Perwalian</span>
              <StudentSelfServiceModule />
            </div>
          </div>

          {/* Security, 2FA & Audit Logs */}
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 5 &bull; Keamanan Akun Dosen &amp; Log Audit Trail</span>
            <SecurityComplianceModule user={user} />
          </div>
        </div>
      )}

      {activeTab === 'edom' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block font-sans">Kinerja &bull; Hasil Evaluasi Kinerja Dosen</span>
            <LecturerRatingModule user={user} />
          </div>
        </div>
      )}
    </div>
  );
}
