import React, { useState } from 'react';
import { User } from '../../types';
import {
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  ClipboardList,
  Check,
  X,
  TrendingUp,
  Sparkles,
  Award,
  BookMarked,
  FileText,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  LmsHybridModule, 
  SmartCommunicationModule, 
  StudentSelfServiceModule, 
  SecurityComplianceModule, 
  ModernTechModule,
  MobilePwaControlBar
} from '../widgets/ModernSiaFeatures';
import { LecturerRatingModule } from '../widgets/LecturerRatingModule';
import { EnterpriseControlSuite } from '../widgets/EnterpriseControlSuite';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

interface KaprodiDashboardViewProps {
  user: User;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

// Initial Mock Data for Kaprodi Features
const INITIAL_CLASSES_APPROVAL = [
  { id: 'ca-1', courseCode: 'IF301', courseName: 'Algoritma & Pemrograman II', sementer: 'Ganjil', sks: 3, classRoom: 'R-301', requestedBy: 'Dr. Ahmad Dahlan', status: 'Pending' },
  { id: 'ca-2', courseCode: 'IF305', courseName: 'Desain & Analisis Algoritma', sementer: 'Ganjil', sks: 4, classRoom: 'R-402', requestedBy: 'Prof. Suparman', status: 'Pending' },
  { id: 'ca-3', courseCode: 'IF310', courseName: 'Sistem Operasi Terdistribusi', sementer: 'Ganjil', sks: 3, classRoom: 'R-Lab', requestedBy: 'Dr. Indah Rahayu', status: 'Disetujui' },
  { id: 'ca-4', courseCode: 'IF401', courseName: 'Etika Profesi IT', sementer: 'Ganjil', sks: 2, classRoom: 'R-202', requestedBy: 'Drs. Wahyu Hidayat', status: 'Pending' },
];

const INITIAL_LECTURERS_MONITORING = [
  { id: 'lm-1', name: 'Dr. Budi Rahardjo', nip: '197508122001', role: 'Dosen Wali', baseSks: 12, addedSks: 4, journalFilled: '8 / 8 Pertemuan', rating: 4.8 },
  { id: 'lm-2', name: 'Dr. Indah Rahayu', nip: '198103142005', role: 'Dosen Biasa', baseSks: 8, addedSks: 6, journalFilled: '7 / 8 Pertemuan', rating: 4.5 },
  { id: 'lm-3', name: 'Prof. Suparman', nip: '196209211990', role: 'Guru Besar', baseSks: 14, addedSks: 0, journalFilled: '8 / 8 Pertemuan', rating: 4.9 },
  { id: 'lm-4', name: 'Drs. Wahyu Hidayat', nip: '197911042008', role: 'Asisten Ahli', baseSks: 6, addedSks: 8, journalFilled: '5 / 8 Pertemuan', rating: 4.2 },
  { id: 'lm-5', name: 'Dr. Ahmad Dahlan', nip: '198305222011', role: 'Dosen Biasa', baseSks: 10, addedSks: 2, journalFilled: '6 / 8 Pertemuan', rating: 4.6 }
];

const INITIAL_COURSES_BEBAN = [
  { id: 'cb-1', code: 'IF301', name: 'Algoritma & Pemrograman II', sks: 3, assignedLecturer: 'Dr. Ahmad Dahlan', semester: 3 },
  { id: 'cb-2', code: 'IF305', name: 'Desain & Analisis Algoritma', sks: 4, assignedLecturer: 'Prof. Suparman', semester: 3 },
  { id: 'cb-3', code: 'IF310', name: 'Sistem Operasi Terdistribusi', sks: 3, assignedLecturer: 'Dr. Indah Rahayu', semester: 5 },
  { id: 'cb-4', code: 'IF401', name: 'Etika Profesi IT', sks: 2, assignedLecturer: 'Drs. Wahyu Hidayat', semester: 7 },
  { id: 'cb-5', code: 'IF402', name: 'Kecerdasan Buatan (AI)', sks: 3, assignedLecturer: 'Dr. Budi Rahardjo', semester: 5 }
];

const INITIAL_COURSES_NILAI = [
  { id: 'cn-1', name: 'Algoritma II', code: 'IF301', totalStudents: 42, avgGpa: 3.45, gradeA: 15, gradeB: 20, gradeC: 5, gradeD: 2, gradeE: 0 },
  { id: 'cn-2', name: 'Desain Algoritma', code: 'IF305', totalStudents: 38, avgGpa: 3.22, gradeA: 8, gradeB: 18, gradeC: 10, gradeD: 2, gradeE: 0 },
  { id: 'cn-3', name: 'Sistem Terdistribusi', code: 'IF310', totalStudents: 40, avgGpa: 3.61, gradeA: 22, gradeB: 14, gradeC: 4, gradeD: 0, gradeE: 0 },
  { id: 'cn-4', name: 'Etika Profesi IT', code: 'IF401', totalStudents: 45, avgGpa: 3.82, gradeA: 35, gradeB: 10, gradeC: 0, gradeD: 0, gradeE: 0 },
  { id: 'cn-5', name: 'Kecerdasan Buatan', code: 'IF402', totalStudents: 35, avgGpa: 3.38, gradeA: 12, gradeB: 15, gradeC: 6, gradeD: 2, gradeE: 0 }
];

const INITIAL_PRESENSI_MONITORING = [
  { id: 'pm-1', className: 'Algoritma II - Kelas A', code: 'IF301-A', lecturer: 'Dr. Ahmad Dahlan', attendanceRate: 94.5, sessionsCompleted: 8, sessionsPlanned: 16 },
  { id: 'pm-2', className: 'Desain Algoritma - Kelas A', code: 'IF305-A', lecturer: 'Prof. Suparman', attendanceRate: 88.2, sessionsCompleted: 8, sessionsPlanned: 16 },
  { id: 'pm-3', className: 'Sistem Terdistribusi - Kelas B', code: 'IF310-B', lecturer: 'Dr. Indah Rahayu', attendanceRate: 91.0, sessionsCompleted: 7, sessionsPlanned: 16 },
  { id: 'pm-4', className: 'Etika Profesi IT - Kelas C', code: 'IF401-C', lecturer: 'Drs. Wahyu Hidayat', attendanceRate: 96.8, sessionsCompleted: 6, sessionsPlanned: 16 },
  { id: 'pm-5', className: 'Kecerdasan Buatan - Kelas A', code: 'IF402-A', lecturer: 'Dr. Budi Rahardjo', attendanceRate: 82.4, sessionsCompleted: 8, sessionsPlanned: 16 }
];

export function KaprodiDashboardView({ user, activeTab = 'dashboard', onChangeTab }: KaprodiDashboardViewProps) {
  const [classesApproval, setClassesApproval] = useState(INITIAL_CLASSES_APPROVAL);
  const [lecturers, setLecturers] = useState(INITIAL_LECTURERS_MONITORING);
  const [coursesBeban, setCoursesBeban] = useState(INITIAL_COURSES_BEBAN);
  const [coursesNilai, setCoursesNilai] = useState(INITIAL_COURSES_NILAI);
  const [presensi, setPresensi] = useState(INITIAL_PRESENSI_MONITORING);

  // Form State for Load Distribution Simulator
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedLecturerName, setSelectedLecturerName] = useState('');
  const [customSks, setCustomSks] = useState<number>(3);

  // Toast notifier
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Approve Class Opening
  const handleApproveClass = (id: string, approve: boolean) => {
    setClassesApproval(prev =>
      prev.map(c => c.id === id ? { ...c, status: approve ? 'Disetujui' : 'Ditolak' } : c)
    );
    triggerToast(
      approve ? 'Pembukaan kelas disetujui!' : 'Pembukaan kelas ditolak.'
    );
  };

  // 2. Assign Lecturer (Beban Mengajar)
  const handleAssignLecturer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !selectedLecturerName) {
      triggerToast('Pilih Mata Kuliah dan Dosen Pengampu.');
      return;
    }

    // Update Courses Beban List
    setCoursesBeban(prev =>
      prev.map(c => {
        if (c.id === selectedCourseId) {
          return { ...c, assignedLecturer: selectedLecturerName, sks: customSks };
        }
        return c;
      })
    );

    // Update Lecturer addedSks state dynamically
    setLecturers(prev =>
      prev.map(l => {
        if (l.name === selectedLecturerName) {
          return { ...l, addedSks: l.addedSks + customSks };
        }
        return l;
      })
    );

    triggerToast(`Beban mengajar berhasil didistribusikan ke ${selectedLecturerName}.`);
    setSelectedCourseId('');
    setSelectedLecturerName('');
  };

  // KPI Dashboard data
  const totalStudentsProdi = 210;
  const avgProdiGpa = 3.51;
  const pendingClassApprovals = classesApproval.filter(c => c.status === 'Pending').length;
  const lowAttendanceClasses = presensi.filter(p => p.attendanceRate < 85).length;

  const renderDashboardLanding = () => {
    const prodiGpaTrend = [
      { name: 'Smt 1', IPK: 3.32 },
      { name: 'Smt 2', IPK: 3.41 },
      { name: 'Smt 3', IPK: 3.48 },
      { name: 'Smt 4', IPK: 3.50 },
      { name: 'Smt 5', IPK: 3.51 }
    ];

    const distributionChartData = coursesNilai.map(c => ({
      name: c.code,
      'Grade A %': Math.round((c.gradeA / c.totalStudents) * 100),
      'Lulus': Math.round(((c.gradeA + c.gradeB + c.gradeC) / c.totalStudents) * 100)
    }));

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Mahasiswa Aktif</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{totalStudentsProdi} Orang</h3>
            <p className="text-[10px] text-slate-500">Program Studi S1 Informatika</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <Award className="w-5 h-5 text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">IPK Rata-Rata Prodi</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{avgProdiGpa}</h3>
            <div className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Melampaui Target Fakultas (3.25)
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Antrean Persetujuan Kelas</span>
            </div>
            <h3 className={`text-2xl font-extrabold ${pendingClassApprovals > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
              {pendingClassApprovals} Kelas
            </h3>
            <p className="text-[10px] text-slate-500">Menunggu Verifikasi Kaprodi</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Peringatan Presensi Rendah</span>
            </div>
            <h3 className={`text-2xl font-extrabold ${lowAttendanceClasses > 0 ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>
              {lowAttendanceClasses} Sesi
            </h3>
            <p className="text-[10px] text-slate-500">Mata Kuliah &lt; 85% Kehadiran</p>
          </div>
        </div>

        {/* Dashboard Graphs and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prodi GPA Trend Area Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Tren Indeks Prestasi Kumulatif Prodi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prodiGpaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gpaTrendColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                  <YAxis domain={[3.0, 4.0]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="IPK" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#gpaTrendColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Distribution Bar Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Rasio Kelulusan &amp; Nilai A per MK</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Bar dataKey="Grade A %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lulus" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Antrean Persetujuan Kelas (Quick Widget) */}
        {pendingClassApprovals > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 animate-bounce" />
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">Pemberitahuan: {pendingClassApprovals} Permintaan Pembukaan Kelas Baru</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classesApproval.filter(c => c.status === 'Pending').map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                      {item.courseCode} &bull; {item.sks} SKS
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{item.courseName}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Dosen Pengaju: {item.requestedBy}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleApproveClass(item.id, true)}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-lg transition-all"
                      title="Setujui Kelas"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApproveClass(item.id, false)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-lg transition-all"
                      title="Tolak Kelas"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderActiveView = () => {
    switch (activeTab) {
      // PERSERTUJUAN PEMBUKAAN KELAS
      case 'kaprodi-persetujuan-kelas':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Antrean Pengajuan Pembukaan Kelas Kuliah</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {classesApproval.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                          {item.courseCode}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{item.sks} SKS &bull; Semester {item.sementer}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-1">{item.courseName}</h4>
                      <p className="text-[10px] text-slate-400">Dosen Pengaju: <span className="font-bold text-slate-600 dark:text-slate-300">{item.requestedBy}</span> &bull; Ruang: {item.classRoom}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        item.status === 'Disetujui' ? 'bg-emerald-105 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' :
                        item.status === 'Ditolak' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                      {item.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveClass(item.id, true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleApproveClass(item.id, false)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // MONITORING DOSEN
      case 'kaprodi-monitoring-dosen':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Pemantauan Kinerja &amp; Kehadiran Dosen</h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/30 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4">Nama Dosen / NIP</th>
                      <th className="px-6 py-4">Status Beban (SKS)</th>
                      <th className="px-6 py-4">Pengisian Jurnal</th>
                      <th className="px-6 py-4">Rating Kepuasan Mhs</th>
                      <th className="px-6 py-4">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-semibold text-slate-600 dark:text-slate-350">
                    {lecturers.map((lec) => (
                      <tr key={lec.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-slate-900 dark:text-white">{lec.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">NIP: {lec.nip} &bull; {lec.role}</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full ${
                            (lec.baseSks + lec.addedSks) > 12 ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700' : 'bg-blue-105 text-blue-700 dark:bg-blue-950/30'
                          }`}>
                            {lec.baseSks + lec.addedSks} SKS
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-800 dark:text-slate-200">{lec.journalFilled}</td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-amber-500 font-extrabold">★ {lec.rating}</span>
                          <span className="text-[10px] text-slate-400"> / 5.0</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => triggerToast(`Mengirim email pengingat untuk mengisi jurnal ke ${lec.name}...`)}
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                          >
                            Kirim Pengingat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // MONITORING NILAI
      case 'kaprodi-monitoring-nilai':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Rekapitulasi Nilai &amp; Kelulusan Mata Kuliah</h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/30 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4">Kode MK / Judul</th>
                      <th className="px-6 py-4">Rata-Rata Nilai</th>
                      <th className="px-6 py-4 text-center">Grade A</th>
                      <th className="px-6 py-4 text-center">Grade B</th>
                      <th className="px-6 py-4 text-center">Grade C</th>
                      <th className="px-6 py-4 text-center">Grade D / E</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-semibold text-slate-600 dark:text-slate-350">
                    {coursesNilai.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-slate-900 dark:text-white">{course.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{course.code} &bull; {course.totalStudents} Mahasiswa</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{course.avgGpa.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200">{course.gradeA} orang</td>
                        <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200">{course.gradeB} orang</td>
                        <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200">{course.gradeC} orang</td>
                        <td className="px-6 py-4 text-center text-rose-500">{course.gradeD + course.gradeE} orang</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            course.avgGpa > 3.4 ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}>
                            {course.avgGpa > 3.4 ? 'Sangat Baik' : 'Cukup'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // MONITORING PRESENSI
      case 'kaprodi-monitoring-presensi':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Pemantauan Persentase Kehadiran Kelas</h3>
              </div>
              <div className="overflow-x-auto text-xs font-semibold text-slate-600 dark:text-slate-350">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/30 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4">Mata Kuliah / Sesi</th>
                      <th className="px-6 py-4">Dosen Pengampu</th>
                      <th className="px-6 py-4">Progres Pertemuan</th>
                      <th className="px-6 py-4">Tingkat Kehadiran</th>
                      <th className="px-6 py-4">Indikator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {presensi.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-slate-900 dark:text-white">{p.className}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{p.code}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-bold">{p.lecturer}</td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400">{p.sessionsCompleted} / {p.sessionsPlanned} Pertemuan</div>
                            <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(p.sessionsCompleted / p.sessionsPlanned) * 100}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-extrabold text-slate-800 dark:text-white">{p.attendanceRate}%</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.attendanceRate >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                            p.attendanceRate >= 85 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40' :
                            'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                          }`}>
                            {p.attendanceRate >= 90 ? 'Sangat Aman' : p.attendanceRate >= 85 ? 'Aman' : 'Tinjauan Penting'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // LAPORAN PRODI
      case 'kaprodi-laporan':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Laporan Indikator Kinerja Utama (IKU) Program Studi</h3>
                  <p className="text-xs text-slate-500">Unduh dokumen IKU resmi format laporan BAN-PT.</p>
                </div>
                <button
                  onClick={() => triggerToast('Mengunduh Laporan IKU Prodi (.pdf)...')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  Ekspor PDF Laporan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-semibold text-slate-600 dark:text-slate-350 pt-3">
                <div className="border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Rasio Dosen : Mahasiswa</div>
                  <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white">1 : 21</h4>
                  <p className="text-[10px] text-slate-400">Target BAN-PT: Maksimal 1 : 30</p>
                </div>
                <div className="border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Ketepatan Kelulusan (7 Smt)</div>
                  <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white">82.4%</h4>
                  <p className="text-[10px] text-slate-400">Mengalami peningkatan 4% dari tahun lalu</p>
                </div>
                <div className="border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Penyerapan Lulusan (&lt; 6 Bln)</div>
                  <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white">88.9%</h4>
                  <p className="text-[10px] text-slate-400">Lulusan bekerja, wirausaha, atau lanjut studi</p>
                </div>
              </div>
            </div>
          </div>
        );

      // DISTRIBUSI BEBAN MENGAJAR
      case 'kaprodi-distribusi-beban':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Form Simulator */}
            <form onSubmit={handleAssignLecturer} className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 text-xs font-semibold">
              <h4 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-indigo-500" />
                Alokasikan Dosen Pengampu
              </h4>
              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                Tugaskan dosen wali atau pengajar pada mata kuliah di prodi, serta tetapkan SKS beban mengajar secara interaktif.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Pilih Mata Kuliah</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => {
                    const cId = e.target.value;
                    setSelectedCourseId(cId);
                    const matchedC = coursesBeban.find(c => c.id === cId);
                    if (matchedC) setCustomSks(matchedC.sks);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-white"
                >
                  <option value="">-- Pilih Mata Kuliah --</option>
                  {coursesBeban.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Pilih Dosen Pengampu</label>
                <select
                  required
                  value={selectedLecturerName}
                  onChange={(e) => setSelectedLecturerName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-white"
                >
                  <option value="">-- Pilih Dosen Pengampu --</option>
                  {lecturers.map(l => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Beban Bobot SKS</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  required
                  value={customSks}
                  onChange={(e) => setCustomSks(parseInt(e.target.value) || 3)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer text-xs"
              >
                Terapkan Distribusi SKS
              </button>
            </form>

            {/* Right Course List */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="p-5 border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Distribusi Beban Mengajar</h4>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {coursesBeban.map((c) => (
                  <div key={c.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <span className="text-[10px] text-slate-400">Semester {c.semester}</span>
                      </div>
                      <h5 className="font-extrabold text-slate-850 dark:text-white text-xs">{c.name}</h5>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Dosen Pengampu</span>
                        <span className="text-slate-800 dark:text-slate-200 font-extrabold">{c.assignedLecturer}</span>
                      </div>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-mono font-bold">
                        {c.sks} SKS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'inovasi':
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
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 1 &bull; Monitoring &amp; Link LMS Program Studi</span>
                <LmsHybridModule />
              </div>

              {/* Smart Communication Forum & Gateway */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 2 &bull; Komunikasi Massa (Pengumuman Target &amp; WA Gateway)</span>
                <SmartCommunicationModule role="lecturer" />
              </div>

              {/* AI Plagiarism & Digital Signatures */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 3 &bull; Tanda Tangan Elektronik &amp; Kepatuhan</span>
                <ModernTechModule />
              </div>

              {/* Student Self-Service Hub (SKPI & KRS Tracker) */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 4 &bull; Dashboard Kinerja Mahasiswa (Self-service SKPI)</span>
                <StudentSelfServiceModule />
              </div>
            </div>

            {/* Security, 2FA & Audit Logs */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Inovasi 5 &bull; Keamanan Sistem &amp; Audit Trail Log KPS</span>
              <SecurityComplianceModule user={user} />
            </div>
          </div>
        );

      case 'edom':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block font-sans">Kinerja &bull; Hasil Evaluasi Kinerja Dosen (EDOM) Program Studi</span>
              <LecturerRatingModule user={user} />
            </div>
          </div>
        );

      default:
        return renderDashboardLanding();
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 space-y-8 font-sans transition-colors relative">
      {/* Toast alert widget */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 dark:border-slate-100 animate-slideUp">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />
          <p className="text-xs font-bold leading-tight">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
            SIAKAD Kaprodi &bull; Panel Kepala Program Studi
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-2 leading-tight">
            Program Studi S1 Teknik Informatika
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Ketua Prodi: <span className="text-slate-750 dark:text-slate-300 font-bold">{user.name}</span> &bull; Hak Akses: Monitoring &amp; Distribusi Beban SKS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            KPS
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Portal</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              Monitoring Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Render selected route view */}
      {renderActiveView()}
    </div>
  );
}
