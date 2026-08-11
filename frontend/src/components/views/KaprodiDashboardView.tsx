import React, { useState } from 'react';
import { User } from '../../types';
import {
  getRoleDashboard,
  updateRoleDashboardItem,
  KaprodiDashboardPayload,
} from '../../api/academic.api';
import { useEffect } from 'react';
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
import { LecturerRatingModule } from '../widgets/LecturerRatingModule';
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

export function KaprodiDashboardView({ user, activeTab = 'dashboard', onChangeTab }: KaprodiDashboardViewProps) {
  // Data nyata dashboard kaprodi dari backend
  const [classesApproval, setClassesApproval] = useState<KaprodiDashboardPayload['classesApproval']>([]);
  const [lecturers, setLecturers] = useState<KaprodiDashboardPayload['lecturers']>([]);
  const [coursesBeban, setCoursesBeban] = useState<KaprodiDashboardPayload['coursesBeban']>([]);
  const [coursesNilai, setCoursesNilai] = useState<KaprodiDashboardPayload['coursesNilai']>([]);
  const [presensi, setPresensi] = useState<KaprodiDashboardPayload['presensi']>([]);
  const [prodiGpaTrend, setProdiGpaTrend] = useState<KaprodiDashboardPayload['prodiGpaTrend']>([]);
  const [laporan, setLaporan] = useState<KaprodiDashboardPayload['laporan']>({ rasioDosenMahasiswa: '-', ketepatanKelulusan: '-', penyerapanLulusan: '-' });
  const [kpis, setKpis] = useState<KaprodiDashboardPayload['kpis']>({ totalStudentsProdi: 0, totalLecturers: 0, avgProdiGpa: 0 });

  useEffect(() => {
    let cancelled = false;
    getRoleDashboard<KaprodiDashboardPayload>('kaprodi')
      .then((data) => {
        if (cancelled) return;
        setClassesApproval(data.classesApproval ?? []);
        setLecturers(data.lecturers ?? []);
        setCoursesBeban(data.coursesBeban ?? []);
        setCoursesNilai(data.coursesNilai ?? []);
        setPresensi(data.presensi ?? []);
        setProdiGpaTrend(data.prodiGpaTrend ?? []);
        if (data.laporan) setLaporan(data.laporan);
        if (data.kpis) setKpis(data.kpis);
      })
      .catch(() => {
        // biarkan state kosong; UI menampilkan kondisi "Belum ada data"
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  // 1. Approve Class Opening (persist ke backend)
  const handleApproveClass = (id: string, approve: boolean) => {
    const status = approve ? 'Disetujui' : 'Ditolak';
    updateRoleDashboardItem('kaprodi', 'classesApproval', id, status)
      .then((data) => {
        const list = (data as KaprodiDashboardPayload).classesApproval ?? [];
        setClassesApproval(list);
        triggerToast(approve ? 'Pembukaan kelas disetujui!' : 'Pembukaan kelas ditolak.');
      })
      .catch(() => triggerToast('Gagal memperbarui status kelas. Silakan coba lagi.'));
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

  // KPI Dashboard data (dihitung live oleh backend)
  const totalStudentsProdi = kpis.totalStudentsProdi;
  const avgProdiGpa = kpis.avgProdiGpa;
  const pendingClassApprovals = classesApproval.filter(c => c.status === 'Pending').length;
  const lowAttendanceClasses = presensi.filter(p => p.attendanceRate < 85).length;

  const renderDashboardLanding = () => {
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
              <span className="text-[10px] font-boldr">Mahasiswa Aktif</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{totalStudentsProdi} Orang</h3>
            <p className="text-[10px] text-slate-500">Program Studi S1 Informatika</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <Award className="w-5 h-5 text-indigo-500" />
              <span className="text-[10px] font-boldr">IPK Rata-Rata Prodi</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{avgProdiGpa}</h3>
            <div className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Melampaui Target Fakultas (3.25)
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-boldr">Antrean Persetujuan Kelas</span>
            </div>
            <h3 className={`text-2xl font-extrabold ${pendingClassApprovals > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
              {pendingClassApprovals} Kelas
            </h3>
            <p className="text-[10px] text-slate-500">Menunggu Verifikasi Kaprodi</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span className="text-[10px] font-boldr">Peringatan Presensi Rendah</span>
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-ink-muted)', fontSize: 11 }} dy={10} />
                  <YAxis domain={[3.0, 4.0]} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-ink-muted)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="IPK" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#gpaTrendColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Distribution Bar Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Rasio Kelulusan &amp; Nilai A per MK</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-ink-muted)', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-ink-muted)', fontSize: 11 }} />
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
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200r">Pemberitahuan: {pendingClassApprovals} Permintaan Pembukaan Kelas Baru</h4>
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
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-lg transition-colors"
                      title="Setujui Kelas"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApproveClass(item.id, false)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-lg transition-colors"
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
                <h3 className="text-xs font-bold text-slate-850 dark:text-whiter">Antrean Pengajuan Pembukaan Kelas Kuliah</h3>
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleApproveClass(item.id, false)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
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
                <h3 className="text-xs font-bold text-slate-850 dark:text-whiter">Pemantauan Kinerja &amp; Kehadiran Dosen</h3>
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
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
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
                <h3 className="text-xs font-bold text-slate-850 dark:text-whiter">Rekapitulasi Nilai &amp; Kelulusan Mata Kuliah</h3>
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
                <h3 className="text-xs font-bold text-slate-850 dark:text-whiter">Pemantauan Persentase Kehadiran Kelas</h3>
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-colors"
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
              <h4 className="text-xs font-extrabold text-slate-850 dark:text-whiter flex items-center gap-1.5">
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
                <h4 className="text-xs font-bold text-slate-850 dark:text-whiter">Distribusi Beban Mengajar</h4>
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
            <p className="text-sm text-slate-500 dark:text-slate-400">Modul ini sedang dalam pengembangan.</p>
          </div>
        );

      case 'edom':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 block font-sans">Kinerja &bull; Hasil Evaluasi Kinerja Dosen (EDOM) Program Studi</span>
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
          <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-xs font-bold leading-tight">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
        <div>
          <span className="text-[10px] font-boldr text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
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
