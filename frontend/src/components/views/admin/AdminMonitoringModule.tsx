import React, { useState } from 'react';
import {
  AdminClass,
  AdminStudent,
  AdminLecturer,
  AdminActivityLog
} from '../../../api/academic.api';
import {
  Activity,
  AlertCircle,
  Bell,
  Check,
  CheckCircle,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Mail,
  Search,
  Send,
  Sliders,
  TrendingUp,
  User,
  Users
} from 'lucide-react';

interface AdminMonitoringModuleProps {
  activeTab: string;
  classes: AdminClass[];
  students: AdminStudent[];
  lecturers: AdminLecturer[];
  activityLogs: AdminActivityLog[];
  onShowToast: (message: string) => void;
}

export function AdminMonitoringModule({
  activeTab,
  classes,
  students,
  lecturers,
  activityLogs,
  onShowToast
}: AdminMonitoringModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Semua');

  // Poke Lecturer handler (simulates sending notification)
  const handlePokeLecturer = (lecturerName: string, classTitle: string) => {
    onShowToast(`Notifikasi pengingat berhasil dikirim ke dosen ${lecturerName} untuk perkuliahan ${classTitle}`);
  };

  // Export report handler
  const handleDownloadReport = (title: string) => {
    onShowToast(`Mengekspor laporan "${title}" ke dalam format Excel...`);
    setTimeout(() => {
      onShowToast(`Laporan "${title}" berhasil diunduh ke perangkat Anda.`);
    }, 1200);
  };

  // Filter logs or items based on query
  const filteredLogs = activityLogs.filter(log =>
    (log.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          Monitoring &amp; Audit &gt; {
            activeTab === 'admin-monitoring-presensi' ? 'Presensi Perkuliahan' :
            activeTab === 'admin-monitoring-nilai' ? 'Monitoring Nilai' :
            activeTab === 'admin-laporan-akademik' ? 'Laporan Akademik' : 'Audit Log Aktivitas'
          }
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Pantau absensi harian kelas, grafik kelulusan nilai, serta audit log sekuriti dan kepatuhan sistem.
        </p>
      </div>

      {/* 1. MONITORING PRESENSI */}
      {activeTab === 'admin-monitoring-presensi' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Presensi Dosen</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">94.8%</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Check-in tepat waktu rata-rata</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Presensi Mahasiswa</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">88.2%</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Kehadiran seluruh program studi</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Kelas Berlangsung</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">12 Kelas</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Aktif terjadwal hari ini</p>
              </div>
            </div>
          </div>

          {/* Classes Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-whiter">Tingkat Kehadiran Per Kelas</h3>
              <button
                onClick={() => handleDownloadReport('Presensi Perkuliahan')}
                className="flex items-center gap-1 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Ekspor Presensi
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500r bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4">Kode / Mata Kuliah</th>
                    <th className="px-6 py-4">Dosen Pengampu</th>
                    <th className="px-6 py-4 text-center">Kehadiran Dosen</th>
                    <th className="px-6 py-4 text-center">Rata Kehadiran Mhs</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {classes.map((cls) => {
                    // Simulate random percentages for look and feel
                    const lecturerAtt = cls.id.includes('1') ? '92%' : '100%';
                    const studentAtt = cls.id.includes('1') ? '82.5%' : cls.id.includes('2') ? '95.1%' : '88.0%';
                    const statusClass = cls.id.includes('1') ? 'Kurang' : 'Optimal';
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="px-6 py-4">
                          <p className="font-mono font-bold text-blue-600 text-[10px]">{cls.kodeMK}</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cls.namaMK}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Kelas {cls.kelas}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{cls.dosenName}</td>
                        <td className="px-6 py-4 text-center font-bold text-emerald-600">{lecturerAtt}</td>
                        <td className="px-6 py-4 text-center font-bold text-blue-600">{studentAtt}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            statusClass === 'Optimal' ? 'bg-green-100 text-green-800 dark:bg-green-950/40' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40'
                          }`}>
                            {statusClass}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {statusClass === 'Kurang' ? (
                            <button
                              onClick={() => handlePokeLecturer(cls.dosenName, cls.namaMK)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 text-[10px] font-extrabold border border-amber-200 dark:border-amber-900/60 rounded-lg flex items-center gap-1 mx-auto transition-colors"
                            >
                              <Bell className="w-3.5 h-3.5" />
                              Kirim Pengingat
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[10px] font-medium">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MONITORING NILAI */}
      {activeTab === 'admin-monitoring-nilai' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Input Nilai Selesai</p>
              <p className="text-lg font-extrabold text-emerald-600 mt-1">4 / 5 Kelas</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Indeks Kelulusan</p>
              <p className="text-lg font-extrabold text-blue-600 mt-1">98.1%</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Rata-Rata IPK</p>
              <p className="text-lg font-extrabold text-blue-600 mt-1">3.42</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Mahasiswa Terancam DO</p>
              <p className="text-lg font-extrabold text-red-600 mt-1">0 Mahasiswa</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-slate-300 dark:bg-slate-700 h-full rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          {/* Classes Grade Status List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-whiter">Status Input Nilai Perkuliahan</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500r bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4">Mata Kuliah / Kelas</th>
                    <th className="px-6 py-4">Dosen Pengampu</th>
                    <th className="px-6 py-4 text-center">Status Input</th>
                    <th className="px-6 py-4 text-center">Rata-Rata Kelas</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {classes.map((cls) => {
                    const isInputSelesai = !cls.id.includes('4'); // Simulating one class hasn't submitted grades
                    const avgGrade = isInputSelesai ? '82.5 (B+)' : '-';
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-blue-600 text-[10px]">{cls.kodeMK}</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cls.namaMK}</p>
                          <p className="text-[10px] text-slate-400">Kelas {cls.kelas}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{cls.dosenName}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isInputSelesai ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 animate-pulse'
                          }`}>
                            {isInputSelesai ? 'Selesai (Publish)' : 'Belum Input Nilai'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-extrabold text-blue-600">{avgGrade}</td>
                        <td className="px-6 py-4 text-center">
                          {!isInputSelesai ? (
                            <button
                              onClick={() => handlePokeLecturer(cls.dosenName, cls.namaMK)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 text-[10px] font-bold rounded-lg border border-red-200 dark:border-red-900/60 flex items-center gap-1 mx-auto"
                            >
                              <Bell className="w-3.5 h-3.5" />
                              Hubungi Dosen
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[10px] font-medium">Sudah Publish</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. LAPORAN AKADEMIK */}
      {activeTab === 'admin-laporan-akademik' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-whiter flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Laporan Kehadiran Universitas
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Unduh rekapitulasi kehadiran dosen dan mahasiswa pada semester aktif saat ini dalam bentuk dokumen tabular Excel (.xlsx) untuk kebutuhan audit internal.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDownloadReport('Rekap Kehadiran Dosen')}
                className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-400" />
                Absensi Dosen
              </button>
              <button
                onClick={() => handleDownloadReport('Rekap Kehadiran Mahasiswa')}
                className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-400" />
                Absensi Mahasiswa
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-whiter flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Sertifikasi Akreditasi &amp; Kelulusan
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Mulai generate dokumen rekap nilai kumulatif, statistik kelulusan per program studi, serta pemetaan distribusi predikat kelulusan (Pujian, Sangat Memuaskan, Memuaskan).
            </p>
            <button
              onClick={() => handleDownloadReport('Laporan Kelulusan & Predikat')}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-blue-500/20 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Generate Laporan Kelulusan PDF
            </button>
          </div>
        </div>
      )}

      {/* 4. AUDIT LOG AKTIVITAS */}
      {activeTab === 'admin-log-aktivitas' && (
        <div className="space-y-4">
          {/* Logs Search controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari user, aktivitas, atau detail log..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                onShowToast('Log aktivitas ditampilkan langsung dari sistem (real-time).');
              }}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Refresh Database Log
            </button>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500r bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4">Waktu Kejadian (UTC)</th>
                    <th className="px-6 py-4">User Pengakses</th>
                    <th className="px-6 py-4">Aktivitas</th>
                    <th className="px-6 py-4">Deskripsi Rinci</th>
                    <th className="px-6 py-4 font-mono">Alamat IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="px-6 py-4 text-slate-500 font-semibold font-mono">{log.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {log.user || '—'}
                        </div>
                        {log.role ? (
                          <span className="text-[10px] text-slate-400 ml-4">({log.role})</span>
                        ) : null}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-semibold">{log.action}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
