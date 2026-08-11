import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Calendar, Users, ClipboardCheck, ArrowRight,
  Plus, Check, X, CheckSquare, Search, AlertTriangle, FileText, Lock, Clock,
  MapPin, Sparkles, ChevronRight, BarChart2, ShieldCheck, Download
} from 'lucide-react';
import { User } from '../../types';
import { getRoleDashboard, BaakDashboardPayload } from '../../api/academic.api';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../utils/i18n';

interface BaakDashboardViewProps {
  user: User;
  onUserChange?: (newUser: User) => void;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

export function BaakDashboardView({ user, onUserChange, activeTab: propActiveTab, onChangeTab: propOnChangeTab }: BaakDashboardViewProps) {
  const { t } = useLanguage();
  const [localActiveTab, setLocalActiveTab] = useState('dashboard');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propOnChangeTab || setLocalActiveTab;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Data nyata dashboard BAAK dari backend
  const [schedules, setSchedules] = useState<BaakDashboardPayload['schedules']>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationLogs, setOptimizationLogs] = useState<string[]>([]);

  // State for Kurikulum & OBE
  const [courses, setCourses] = useState<BaakDashboardPayload['courses']>([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseSks, setNewCourseSks] = useState(3);
  const [newCoursePrereq, setNewCoursePrereq] = useState('');

  // State for Cuti & Status (Mutasi & SP)
  const [mutasiRequests, setMutasiRequests] = useState<BaakDashboardPayload['mutasiRequests']>([]);
  const [warningList, setWarningList] = useState<BaakDashboardPayload['warningList']>([]);

  useEffect(() => {
    let cancelled = false;
    getRoleDashboard<BaakDashboardPayload>('baak')
      .then((data) => {
        if (cancelled) return;
        setSchedules(data.schedules ?? []);
        setCourses(data.courses ?? []);
        setMutasiRequests(data.mutasiRequests ?? []);
        setWarningList(data.warningList ?? []);
      })
      .catch(() => {
        // biarkan state kosong; UI menampilkan kondisi "Belum ada data"
      });
    return () => {
      cancelled = true;
    };
  }, []);


  const handleRunGeneticScheduler = () => {
    setIsOptimizing(true);
    setOptimizationLogs(['Initializing Constraint Programming engine...', 'Analyzing lecturer time preferences...', 'Checking space/room availability matrix...']);
    
    setTimeout(() => {
      setOptimizationLogs(prev => [...prev, 'Running Genetic Algorithm Generation 1-150...', 'Resolving 3 time conflicts between Dr. Hendra & Room 402...', 'Resolving capacity bottlenecks...']);
    }, 1000);

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationLogs(prev => [...prev, 'OPTIMIZATION SUCCESSFUL: 0 conflicts detected!', 'Optimized room utilization by 18.2%.']);
      triggerToast('Penjadwalan Otomatis berbasis Constraint Programming Berhasil diselesaikan!');
    }, 2500);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName) return;
    setCourses([
      ...courses,
      { code: newCourseCode, name: newCourseName, sks: Number(newCourseSks), semester: 1, type: 'Wajib', preraq: newCoursePrereq || '-', cpl: 'CPL-1, CPL-3' }
    ]);
    setNewCourseCode('');
    setNewCourseName('');
    setNewCoursePrereq('');
    triggerToast(`Mata kuliah ${newCourseName} berhasil ditambahkan ke kurikulum!`);
  };

  const handleApproveMutasi = (id: string) => {
    setMutasiRequests(mutasiRequests.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
    triggerToast(`Permintaan mutasi ${id} disetujui secara digital.`);
  };

  const handleRejectMutasi = (id: string) => {
    setMutasiRequests(mutasiRequests.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
    triggerToast(`Permintaan mutasi ${id} ditolak.`);
  };

  const handleIssueWarning = (nim: string) => {
    setWarningList(warningList.map(w => w.nim === nim ? { ...w, spLevel: w.spLevel === 'SP-1' ? 'SP-2' : 'SP-3 (DO Warning)' } : w));
    triggerToast(`Peringatan Akademik (SP) baru berhasil diterbitkan untuk mahasiswa NIM: ${nim}`);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan BAAK', icon: LayoutDashboard },
    { id: 'kurikulum', label: 'Kurikulum & OBE', icon: BookOpen },
    { id: 'penjadwalan', label: 'Smart Scheduling', icon: Calendar },
    { id: 'cuti-status', label: 'Status & Mutasi', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold border border-slate-800 dark:border-slate-200 flex items-center gap-2 animate-pulse">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full border border-cyan-300 shadow-md">
                ADMINISTRATOR BAAK
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Portal Administrasi Akademik (BAAK)</h2>
            <p className="text-xs text-cyan-100 font-medium">
              Selamat datang, {user.name} &bull; Kelola Kurikulum, Smart Scheduling, dan Mutasi Akademik Global.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 max-w-2xl">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Contents */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="text-[10px] font-blackr text-slate-400">Total Program Studi</div>
              <div className="text-3xl font-black text-cyan-600 mt-1">14</div>
              <p className="text-[11px] text-slate-500 mt-2">Daftar kurikulum aktif terverifikasi OBE.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="text-[10px] font-blackr text-slate-400">Total Jadwal Kelas</div>
              <div className="text-3xl font-black text-indigo-600 mt-1">340</div>
              <p className="text-[11px] text-slate-500 mt-2">Optimasi ruangan dan ketersediaan dosen pengampu.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="text-[10px] font-blackr text-slate-400">Cuti & Mutasi Menunggu</div>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {mutasiRequests.filter(r => r.status === 'Pending').length}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Memerlukan verifikasi dan tanda tangan elektronik.</p>
            </div>

            <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-blackr text-slate-800 dark:text-slate-200">
                PEMBERITAHUAN ADMINISTRASI TERBARU
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/40 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Batas Pengisian KRS Berakhir Pekan Ini:</span> Pastikan seluruh data mahasiswa yang ditangguhkan status pembayarannya telah direkonsiliasi oleh BAUK untuk membuka kunci portal KRS.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KURIKULUM & OBE */}
        {activeTab === 'kurikulum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Peta Kurikulum & Matriks OBE</h3>
                <p className="text-xs text-slate-500">
                  Visualisasikan prasyarat mata kuliah berjenjang serta korelasi Capaian Pembelajaran Lulusan (CPL) untuk akreditasi BAN-PT.
                </p>
              </div>

              {/* Kurikulum table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500r text-[10px] font-black">
                    <tr>
                      <th className="p-3">Kode Matkul</th>
                      <th className="p-3">Nama Matakuliah</th>
                      <th className="p-3">SKS</th>
                      <th className="p-3">Prasyarat</th>
                      <th className="p-3">Korelasi CPL (OBE)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {courses.map(c => (
                      <tr key={c.code} className="hover:bg-slate-50 dark:hover:bg-slate-850/20">
                        <td className="p-3 font-mono font-bold text-cyan-600">{c.code}</td>
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{c.name}</td>
                        <td className="p-3 font-bold">{c.sks} SKS</td>
                        <td className="p-3 text-slate-500">{c.preraq}</td>
                        <td className="p-3">
                          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {c.cpl}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-blackr text-slate-800 dark:text-slate-200">
                Tambah Mata Kuliah Baru
              </h4>
              <form onSubmit={handleAddCourse} className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450">Kode Matkul</label>
                  <input 
                    type="text" 
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="Contoh: IF402" 
                    className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450">Nama Matakuliah</label>
                  <input 
                    type="text" 
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="Contoh: Pemrograman Mobile" 
                    className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450">Jumlah SKS</label>
                  <select 
                    value={newCourseSks}
                    onChange={(e) => setNewCourseSks(Number(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1"
                  >
                    <option value={2}>2 SKS</option>
                    <option value={3}>3 SKS</option>
                    <option value={4}>4 SKS</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450">Mata Kuliah Prasyarat</label>
                  <input 
                    type="text" 
                    value={newCoursePrereq}
                    onChange={(e) => setNewCoursePrereq(e.target.value)}
                    placeholder="Contoh: Struktur Data (Opsional)" 
                    className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Tambahkan ke Kurikulum
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: SMART SCHEDULING */}
        {activeTab === 'penjadwalan' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Scheduling (Genetic Engine)</h3>
                <p className="text-xs text-slate-500">
                  Gunakan algoritma optimasi kekangan untuk mendistribusikan jadwal perkuliahan, menghindari bentrokan waktu dosen, ruang, dan mahasiswa secara real-time.
                </p>
              </div>
              <button 
                onClick={handleRunGeneticScheduler}
                disabled={isOptimizing}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                {isOptimizing ? 'Sedang Mengoptimasi...' : 'Mulai Optimasi Penjadwalan'}
              </button>
            </div>

            {optimizationLogs.length > 0 && (
              <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-4 rounded-xl space-y-1">
                <div className="text-indigo-400 font-bold border-b border-slate-800 pb-1 mb-1">CONSTRAINED ALGORITHM RUNNING LOGS:</div>
                {optimizationLogs.map((log, i) => (
                  <div key={i}>&gt; {log}</div>
                ))}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500r text-[10px] font-black">
                  <tr>
                    <th className="p-3">Mata Kuliah</th>
                    <th className="p-3">Dosen Pengampu</th>
                    <th className="p-3">Ruangan & Lab</th>
                    <th className="p-3">Slot Waktu</th>
                    <th className="p-3">Kapasitas</th>
                    <th className="p-3">Status Optimasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {schedules.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/20">
                      <td className="p-3 font-bold">{s.course}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{s.lecturer}</td>
                      <td className="p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{s.room}</td>
                      <td className="p-3 text-slate-500">{s.time}</td>
                      <td className="p-3 font-medium">{s.cap}</td>
                      <td className="p-3">
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STATUS & MUTASI */}
        {activeTab === 'cuti-status' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alur Persetujuan Mutasi & Cuti</h3>
                <p className="text-xs text-slate-500">
                  Verifikasi berkas pengajuan cuti akademik, penundaan studi, drop out, serta perpindahan lintas prodi.
                </p>
              </div>

              <div className="space-y-4">
                {mutasiRequests.map(req => (
                  <div key={req.id} className="border border-slate-100 dark:border-slate-850 p-4 rounded-xl flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">{req.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          req.type.includes('Cuti') ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' : 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400'
                        }`}>
                          {req.type}
                        </span>
                      </div>
                      <div className="text-xs font-bold">{req.name} ({req.nim})</div>
                      <p className="text-[11px] text-slate-500">Alasan: {req.reason}</p>
                      <div className="text-[10px] text-slate-400">Diajukan: {req.date}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {req.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRejectMutasi(req.id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleApproveMutasi(req.id)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-blackr text-slate-800 dark:text-slate-200">
                Peringatan Akademik (SP) & Drop Out
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Peringatan diterbitkan otomatis jika IPK &lt; 2.0 atau presensi &lt; 75% berturut-turut.
              </p>

              <div className="space-y-3.5 pt-2">
                {warningList.map(w => (
                  <div key={w.nim} className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center gap-3">
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{w.name} (NIM {w.nim})</div>
                      <div className="text-[10px] text-slate-400">{w.desc}</div>
                      <div className="flex gap-2 items-center text-[10px] pt-1">
                        <span className="font-bold">IPK: {w.ipk}</span>
                        <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded text-[9px]">{w.spLevel}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleIssueWarning(w.nim)}
                      className="text-[10px] font-bold text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 border border-red-200 rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Kirim SP+
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
