import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../../types';
import { getDashboardSummary, DashboardSummary } from '../../api/dashboard.api';

import {
  getLecturerOverview,
  LecturerProfile,
  JadwalMengajarItem,
  ClassItem,
  StudentAcademic,
  JurnalItem,
  TugasItem,
  MateriItem,
  SkripsiItem,
  ChatThread,
  mapStudentAcademic,
  EMPTY_LECTURER_PROFILE,
} from '../../api/academic.api';

// Sub Module Imports
import { LecturerProfileModule } from './lecturer/LecturerProfileModule';
import { LecturerAcademicModule } from './lecturer/LecturerAcademicModule';
import { LecturerGradeModule } from './lecturer/LecturerGradeModule';
import { LecturerBimbinganModule } from './lecturer/LecturerBimbinganModule';
import { LecturerCommunicationModule } from './lecturer/LecturerCommunicationModule';
import { LecturerRatingModule } from '../widgets/LecturerRatingModule';
import { AcademicDatesWidget } from '../widgets/AcademicDatesWidget';
import { AnnouncementTicker } from '../widgets/AnnouncementTicker';
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
  // Master states representing active lecturer database (diisi dari basis data)
  const [profile, setProfile] = useState<LecturerProfile>(EMPTY_LECTURER_PROFILE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentAcademic[]>([]);
  const [jurnal, setJurnal] = useState<JurnalItem[]>([]);
  const [tugas, setTugas] = useState<TugasItem[]>([]);
  const [materi, setMateri] = useState<MateriItem[]>([]);
  const [skripsi, setSkripsi] = useState<SkripsiItem[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);

  const [jadwal, setJadwal] = useState<JadwalMengajarItem[]>([]);
  const [kelas, setKelas] = useState<ClassItem[]>([]);

  // Live summary from backend (falls back to real data while loading/on error)
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  useEffect(() => {
    let cancelled = false;
    getLecturerOverview()
      .then((data) => {
        if (cancelled) return;
        setProfile(data.profile);
        setJadwal(data.jadwal);
        setKelas(data.kelas);
        setStudents(data.students.map(mapStudentAcademic));
        setJurnal(data.jurnal);
        setTugas(data.tugas);
        setMateri(data.materi);
        setSkripsi(data.skripsi);
        // Bangun thread percakapan dari pesan nyata, dikelompokkan per mahasiswa pengirim.
        const studentSenders = Array.from(
          new Map(
            data.chats
              .filter((m) => m.sender === 'student' && m.senderEmail)
              .map((m) => [m.senderEmail as string, m]),
          ).values(),
        );
        setChats(
          studentSenders.map((m) => {
            const threadMsgs = data.chats.filter((c) => c.senderEmail === m.senderEmail);
            const match = data.students.find((s) => s.name.toLowerCase().includes((m.senderName ?? '').toLowerCase()));
            return {
              studentNim: match?.nim ?? (m.senderEmail ?? '').split('@')[0].replace(/\./g, '').toUpperCase(),
              studentName: match?.name ?? m.senderName ?? m.senderEmail ?? 'Mahasiswa',
              studentEmail: m.senderEmail ?? '',
              lastMessage: threadMsgs.length ? threadMsgs[threadMsgs.length - 1].text : 'Belum ada percakapan',
              timestamp: threadMsgs.length ? threadMsgs[threadMsgs.length - 1].timestamp : '-',
              unread: false,
              messages: threadMsgs.map((c) => ({ id: c.id, sender: c.sender, text: c.text, timestamp: c.timestamp })),
            };
          }),
        );
      })
      .catch((err) => console.error('Gagal memuat overview dosen:', err));
    getDashboardSummary()
      .then((s) => {
        if (!cancelled) setSummary(s);
      })
      .catch(() => {
        // ringkasan tetap berasal dari data nyata yang sudah dimuat
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const apiSchedule = summary?.schedule?.length
    ? summary.schedule.map((s) => ({ id: `${s.code}-${s.time}`, day: s.day, code: s.code, name: s.name, class: s.class, room: s.room, time: s.time }))
    : null;
  const todayClasses = useMemo(() => (apiSchedule && apiSchedule.length ? apiSchedule : jadwal.filter(j => j.day === 'Senin')), [apiSchedule, jadwal]);
  const kelasCount = useMemo(() => summary?.kpis[0]?.value ?? kelas.length, [summary, kelas]);
  const totalStudentsCount = useMemo(() => summary?.kpis[1]?.value ?? students.length, [summary, students]);
  const pendingKrsCount = useMemo(() => students.filter((s: any) => s.krsStatus === 'Menunggu' || s.krs?.status === 'Pending').length, [students]);

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
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse border border-slate-800 dark:border-slate-100">
          <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-xs font-bold leading-tight">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div>
          <span className="text-[10px] font-boldr text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
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
          <AnnouncementTicker user={user} />

          {/* Main Stat Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Stat 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-boldr">Kelas Diampu</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{kelasCount} Kelas</h3>
              <p className="text-[10px] text-slate-500">Semester Ganjil Aktif</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-boldr">Mahasiswa Wali</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{totalStudentsCount} Orang</h3>
              <p className="text-[10px] text-slate-500">Bimbingan Akademik</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <ClipboardCheck className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-boldr">Persetujuan KRS</span>
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
                <span className="text-[10px] font-boldr">Mengajar Hari Ini</span>
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
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter mb-4 flex items-center gap-2">
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
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter flex items-center gap-2">
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
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter mb-4">Pengumuman Kampus Terbaru</h4>
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
          <p className="text-sm text-slate-500 dark:text-slate-400">Modul ini sedang dalam pengembangan.</p>
        </div>
      )}

      {activeTab === 'edom' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 block font-sans">Kinerja &bull; Hasil Evaluasi Kinerja Dosen</span>
            <LecturerRatingModule user={user} />
          </div>
        </div>
      )}
    </div>
  );
}
