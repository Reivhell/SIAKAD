import React, { useState } from 'react';
import { User } from '../../types';
import {
  getRoleDashboard,
  updateRoleDashboardItem,
  DekanDashboardPayload,
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
  Award,
  FileText,
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  Download,
  Percent,
  CheckCircle,
  HelpCircle
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
  Area,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DekanDashboardViewProps {
  user: User;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export function DekanDashboardView({ user, activeTab = 'dashboard', onChangeTab }: DekanDashboardViewProps) {
  // Data nyata dashboard dekan dari backend
  const [bebanDosen, setBebanDosen] = useState<DekanDashboardPayload['bebanDosen']>([]);
  const [kurikulumApproval, setKurikulumApproval] = useState<DekanDashboardPayload['kurikulumApproval']>([]);
  const [prodiPerformance, setProdiPerformance] = useState<DekanDashboardPayload['prodiPerformance']>([]);
  const [gradeDistributionFaculty, setGradeDistributionFaculty] = useState<DekanDashboardPayload['gradeDistributionFaculty']>([]);
  const [financialMetrics, setFinancialMetrics] = useState<DekanDashboardPayload['financialMetrics']>([]);
  const [kpis, setKpis] = useState<DekanDashboardPayload['kpis']>({
    totalMahasiswa: '-', totalDosen: '-', rataIpk: '-', targetUkt: '-', uktSub: '-',
  });

  useEffect(() => {
    let cancelled = false;
    getRoleDashboard<DekanDashboardPayload>('dekan')
      .then((data) => {
        if (cancelled) return;
        setBebanDosen(data.bebanDosen ?? []);
        setKurikulumApproval(data.kurikulumApproval ?? []);
        setProdiPerformance(data.prodiPerformance ?? []);
        setGradeDistributionFaculty(data.gradeDistributionFaculty ?? []);
        setFinancialMetrics(data.financialMetrics ?? []);
        if (data.kpis) setKpis(data.kpis);
      })
      .catch(() => {
        // biarkan state kosong; UI menampilkan kondisi "Belum ada data"
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Simulation Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handlers for Beban Mengajar Approval (persist ke backend)
  const handleApproveBeban = (id: string, action: 'Disetujui' | 'Ditolak') => {
    updateRoleDashboardItem('dekan', 'bebanDosen', id, action)
      .then((data) => {
        setBebanDosen((data as DekanDashboardPayload).bebanDosen ?? []);
        triggerToast(`Status usulan beban mengajar berhasil diubah: ${action.toUpperCase()}`);
      })
      .catch(() => triggerToast('Gagal memperbarui beban mengajar. Silakan coba lagi.'));
  };

  // Handlers for Kurikulum Approval (persist ke backend)
  const handleApproveKurikulum = (id: string, action: 'Disetujui' | 'Ditolak') => {
    updateRoleDashboardItem('dekan', 'kurikulumApproval', id, action)
      .then((data) => {
        setKurikulumApproval((data as DekanDashboardPayload).kurikulumApproval ?? []);
        triggerToast(`Status usulan kurikulum berhasil diubah: ${action.toUpperCase()}`);
      })
      .catch(() => triggerToast('Gagal memperbarui kurikulum. Silakan coba lagi.'));
  };

  // Download Report simulation
  const handleDownloadReport = (title: string) => {
    triggerToast(`Membuat file PDF: ${title}... Unduhan akan dimulai.`);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-700/50 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
          <Layers className="w-96 h-96" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-boldr text-blue-200">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Panel Dekan Fakultas
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {user.name}
          </h2>
          <p className="text-xs text-blue-200 max-w-xl font-medium leading-relaxed">
            Fakultas Teknologi Informasi & Sains Terapan &bull; Anda memiliki hak penuh untuk mengesahkan kurikulum, menyetujui penugasan dosen, dan memantau kinerja akademik makro.
          </p>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Total Mahasiswa Aktif', value: kpis.totalMahasiswa, sub: 'Semua Program Studi', color: 'border-blue-500', bg: 'bg-blue-500/5', icon: Users, iconColor: 'text-blue-600' },
              { title: 'Dosen Tetap & LB', value: kpis.totalDosen, sub: 'Status kepegawaian saat ini', color: 'border-emerald-500', bg: 'bg-emerald-500/5', icon: ClipboardList, iconColor: 'text-emerald-600' },
              { title: 'Rataan IPK Fakultas', value: kpis.rataIpk, sub: 'Kinerja akademik makro', color: 'border-indigo-500', bg: 'bg-indigo-500/5', icon: TrendingUp, iconColor: 'text-indigo-600' },
              { title: 'Target UKT Semester', value: kpis.targetUkt, sub: kpis.uktSub, color: 'border-amber-500', bg: 'bg-amber-500/5', icon: DollarSign, iconColor: 'text-amber-600' }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className={`bg-white dark:bg-slate-900 border-l-4 ${card.color} border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-colors flex items-center justify-between gap-4`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400r">{card.title}</span>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{card.value}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">{card.sub}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Approvals (Urgent Warnings) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Lecturer Load Overloads */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Butuh Persetujuan Beban Mengajar ({bebanDosen.filter(b => b.status === 'Pending').length})
                </h4>
                <button onClick={() => onChangeTab?.('dekan-persetujuan-beban')} className="text-[11px] text-blue-600 font-bold hover:underline">Kelola Semua</button>
              </div>
              <div className="space-y-3">
                {bebanDosen.filter(b => b.status === 'Pending').slice(0, 2).map((item) => (
                  <div key={item.id} className="p-3.5 border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/25 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">{item.lecturerName}</h5>
                      <p className="text-[10px] text-slate-400 font-medium">{item.prodi} &bull; Pengajuan tambahan {item.requestedSks} SKS</p>
                      <p className="text-[10px] italic text-slate-500 mt-1 line-clamp-1">"{item.reason}"</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => handleApproveBeban(item.id, 'Ditolak')} className="p-1.5 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg text-xs" title="Tolak"><X className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleApproveBeban(item.id, 'Disetujui')} className="p-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg text-xs" title="Setujui"><Check className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {bebanDosen.filter(b => b.status === 'Pending').length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 font-medium">Semua pengajuan beban mengajar telah diselesaikan.</div>
                )}
              </div>
            </div>

            {/* Curriculum Approvals */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Pengesahan Kurikulum Baru ({kurikulumApproval.filter(k => k.status === 'Pending').length})
                </h4>
                <button onClick={() => onChangeTab?.('dekan-pengesahan-kurikulum')} className="text-[11px] text-blue-600 font-bold hover:underline">Kelola Semua</button>
              </div>
              <div className="space-y-3">
                {kurikulumApproval.filter(k => k.status === 'Pending').slice(0, 2).map((item) => (
                  <div key={item.id} className="p-3.5 border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/25 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">{item.name}</h5>
                      <p className="text-[10px] text-slate-400 font-medium">{item.prodi} &bull; Total {item.sksWajib + item.sksPilihan} SKS &bull; {item.cplCount} CPL</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Dibuat oleh: {item.createdBy}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => handleApproveKurikulum(item.id, 'Ditolak')} className="p-1.5 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg text-xs" title="Tolak"><X className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleApproveKurikulum(item.id, 'Disetujui')} className="p-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg text-xs" title="Setujui"><Check className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {kurikulumApproval.filter(k => k.status === 'Pending').length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 font-medium">Semua pengusulan kurikulum baru telah diselesaikan.</div>
                )}
              </div>
            </div>
          </div>

          {/* Graphical Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GPA & Attendance per Prodi Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter">Perbandingan Kinerja Akademik Makro per Program Studi</h4>
                <p className="text-[10px] text-slate-500">Menampilkan rata-rata IPK Mahasiswa dan tingkat presensi dosen/mahasiswa.</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prodiPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 4.0]} tickCount={5} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar name="Rata-rata IPK" dataKey="ipkAverage" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart Grade Distribution */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-whiter">Penyebaran Grade Nilai Kuliah</h4>
                <p className="text-[10px] text-slate-500">Penyebaran total nilai se-fakultas semester ganjil.</p>
              </div>
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistributionFaculty}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {gradeDistributionFaculty.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                {gradeDistributionFaculty.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERSATUJUAN BEBAN MENGAJAR TAB */}
      {activeTab === 'dekan-persetujuan-beban' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Persetujuan Beban Mengajar Tambahan Dosen</h4>
            <p className="text-xs text-slate-500 mt-1">Dosen memiliki batas maksimal pengajaran standar. Pengajuan SKS overload harus disetujui Dekan setelah verifikasi.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400r font-extrabold text-[10px]">
                  <th className="py-3 px-4">Nama Dosen / NIDN</th>
                  <th className="py-3 px-4">Program Studi</th>
                  <th className="py-3 px-4 text-center">Beban Dasar</th>
                  <th className="py-3 px-4 text-center text-blue-600">Overload Usulan</th>
                  <th className="py-3 px-4">Alasan Pengajuan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                {bebanDosen.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>{item.lecturerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIDN. {item.nidn}</div>
                    </td>
                    <td className="py-3.5 px-4">{item.prodi}</td>
                    <td className="py-3.5 px-4 text-center">{item.baseSks} SKS</td>
                    <td className="py-3.5 px-4 text-center text-blue-600 dark:text-blue-400 font-extrabold">+{item.requestedSks} SKS</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={item.reason}>"{item.reason}"</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'Disetujui' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                        item.status === 'Ditolak' ? 'bg-red-500/15 text-red-600 dark:text-red-400' :
                        'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => handleApproveBeban(item.id, 'Ditolak')} className="px-2.5 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors">
                            <X className="w-3 h-3" /> Tolak
                          </button>
                          <button onClick={() => handleApproveBeban(item.id, 'Disetujui')} className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm">
                            <Check className="w-3 h-3" /> Setujui
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No Action Needed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PENGESAHAN KURIKULUM TAB */}
      {activeTab === 'dekan-pengesahan-kurikulum' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Pengesahan Dokumen Kurikulum Program Studi (OBE & MBKM)</h4>
            <p className="text-xs text-slate-500 mt-1">Sesuai dengan ketentuan akreditasi LAM-INFOKOM, kurikulum mayor dan sebaran mata kuliah wajib disetujui Dekan sebelum diimplementasikan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kurikulumApproval.map((item) => (
              <div key={item.id} className="border border-slate-150 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/20 dark:bg-slate-950/10 space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 rounded text-[9px] font-extrabold uppercase">{item.prodi}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      item.status === 'Disetujui' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                      item.status === 'Ditolak' ? 'bg-red-500/15 text-red-600 dark:text-red-400' :
                      'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-white line-clamp-1">{item.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Diusulkan oleh: {item.createdBy}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[9px]">SKS Wajib</span>
                      <span className="text-xs text-slate-800 dark:text-white">{item.sksWajib} SKS</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">SKS Pilihan</span>
                      <span className="text-xs text-slate-800 dark:text-white">{item.sksPilihan} SKS</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Total Capaian</span>
                      <span className="text-xs text-slate-800 dark:text-white">{item.cplCount} CPL</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  {item.status === 'Pending' ? (
                    <>
                      <button onClick={() => handleApproveKurikulum(item.id, 'Ditolak')} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors">
                        <X className="w-3 h-3" /> Tolak
                      </button>
                      <button onClick={() => handleApproveKurikulum(item.id, 'Disetujui')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm">
                        <Check className="w-3 h-3" /> Sahkan
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold uppercase py-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Selesai Diaudit
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MONITORING NILAI TAB */}
      {activeTab === 'dekan-monitoring-nilai' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Pemantauan Sebaran Nilai Kuliah se-Fakultas</h4>
              <p className="text-xs text-slate-500 mt-1">Pastikan akurasi grading sesuai standar, hindari anomali inflasi nilai berlebih.</p>
            </div>
            <button onClick={() => handleDownloadReport('Sebaran Nilai Ganjil')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
              <Download className="w-3.5 h-3.5" /> Unduh Laporan Nilai
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-extrabold text-slate-800 dark:text-whiter">Peringkat Rata-Rata IPK Program Studi</h5>
              <div className="space-y-3">
                {prodiPerformance.map((p, idx) => (
                  <div key={idx} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">{p.name}</span>
                    <span className="px-2.5 py-1 bg-blue-50/50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded font-mono font-extrabold">IPK {p.ipkAverage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-950/10 p-5 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <div className="space-y-2">
                <h5 className="text-xs font-extrabold text-slate-800 dark:text-whiter flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Insight Audit Akademik
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Program Studi <strong className="text-blue-600">Kedokteran</strong> mencatatkan rata-rata IPK tertinggi di angka 3.65, sementara tingkat kehadiran dosen di <strong className="text-indigo-600">Teknik Informatika</strong> berada di angka 95.8%. Seluruh prodi berada di atas ambang batas mutu nasional (BPMN).
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 text-[10px] font-bold text-slate-400">
                Pembaruan Terakhir: Realtime via Sistem Mutu Akademik
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MONITORING KEHADIRAN TAB */}
      {activeTab === 'dekan-monitoring-kehadiran' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Audit Kehadiran Kuliah & Jurnal Mengajar Dosen</h4>
            <p className="text-xs text-slate-500 mt-1">Tingkat kehadiran tatap muka kelas minimal 80% untuk memenuhi standar operasional perkuliahan (SOP).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lecturer Attendance Rate Card */}
            <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-emerald-500/5 space-y-3">
              <h5 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400r flex items-center gap-1.5">
                <Check className="w-4.5 h-4.5" /> Kehadiran Mengajar Dosen Terbaik
              </h5>
              <div className="space-y-3">
                {prodiPerformance.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{p.name}</span>
                    <span className="text-emerald-600">{p.attendanceLecturer}% Sesi</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Attendance Rate Card */}
            <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
              <h5 className="text-xs font-extrabold text-blue-800 dark:text-blue-400r flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Kehadiran Kuliah Mahasiswa
              </h5>
              <div className="space-y-3">
                {prodiPerformance.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{p.name}</span>
                    <span className="text-blue-600">{p.attendanceStudent}% Sesi</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KEUANGAN FAKULTAS TAB */}
      {activeTab === 'dekan-monitoring-keuangan' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Rekapitulasi Keuangan UKT & SPP Fakultas</h4>
            <p className="text-xs text-slate-500 mt-1">Pemantauan penerimaan dana pendidikan per program studi se-fakultas secara real-time.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400r font-extrabold text-[10px]">
                  <th className="py-3 px-4">Nama Program Studi</th>
                  <th className="py-3 px-4 text-right">Sudah Terbayar (Lunas)</th>
                  <th className="py-3 px-4 text-right text-rose-600">Belum Terbayar (Tunggakan)</th>
                  <th className="py-3 px-4 text-right">Target Penerimaan</th>
                  <th className="py-3 px-4 text-center">Rasio Kelunasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                {financialMetrics.map((item, idx) => {
                  const ratio = ((item.paid / item.target) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-3.5 px-4 font-extrabold">{item.name}</td>
                      <td className="py-3.5 px-4 text-right text-emerald-600">Rp {item.paid.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 text-right text-rose-600 font-extrabold">Rp {item.outstanding.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 text-right text-slate-800 dark:text-white">Rp {item.target.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">
                          {ratio}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LAPORAN FAKULTAS TAB */}
      {activeTab === 'dekan-laporan' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Laporan Eksekutif & Borang Akreditasi Fakultas</h4>
            <p className="text-xs text-slate-500 mt-1 font-semibold text-slate-500">Pilih laporan di bawah ini untuk mengunduh dokumen pelaporan resmi berformat PDF/Excel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Laporan Evaluasi Dosen oleh Mahasiswa (EDOM)', desc: 'Analisis kepuasan proses belajar mengajar se-fakultas per semester.', action: 'Unduh EDOM PDF' },
              { title: 'Laporan Borang Mutu BAN-PT & LAM-INFOKOM', desc: 'Kelengkapan administrasi borang instrumen kriteria akreditasi program studi.', action: 'Unduh Borang ZIP' },
              { title: 'Laporan Status Sinkronisasi PDDIKTI', desc: 'Status pelaporan data dosen dan mahasiswa ke pangkalan data dikti.', action: 'Unduh Rekap PDDIKTI' },
              { title: 'Laporan Keuangan & Anggaran Operasional', desc: 'Rincian penggunaan anggaran operasional fakultas berjalan.', action: 'Unduh Budget Report' }
            ].map((report, idx) => (
              <div key={idx} className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/15 flex flex-col justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <h5 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" /> {report.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{report.desc}</p>
                </div>
                <button
                  onClick={() => handleDownloadReport(report.title)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> {report.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. INOVASI & FITUR CANGGIH DEKAN */}
      {activeTab === 'inovasi' && (
        <div className="space-y-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Modul ini sedang dalam pengembangan.</p>
        </div>
      )}

      {activeTab === 'edom' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-blue-600 block font-sans">Mutu &bull; Laporan Evaluasi Kinerja Dosen (EDOM) Tingkat Fakultas</span>
            <LecturerRatingModule user={user} />
          </div>
        </div>
      )}
    </div>
  );
}
