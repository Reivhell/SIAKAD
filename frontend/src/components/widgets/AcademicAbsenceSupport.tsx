import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldCheck, HeartPulse, UserCheck, MessageCircle, Send, CheckCircle2, RefreshCw } from 'lucide-react';

interface AbsenceAlert {
  id: string;
  course: string;
  consecutiveAbsences: number;
  lastAbsenceDate: string;
  dosenWaliName: string;
  status: 'Dosen Wali Diperingatkan' | 'Selesai' | 'Butuh Tanggapan';
  wellbeingCheckSent: boolean;
}

export function AcademicAbsenceSupport() {
  const [alerts, setAlerts] = useState<AbsenceAlert[]>([
    {
      id: 'A-101',
      course: 'Pemrograman Berorientasi Objek (IF2230)',
      consecutiveAbsences: 3,
      lastAbsenceDate: '22 Juni 2026',
      dosenWaliName: 'Dr. Budi Rahardjo',
      status: 'Butuh Tanggapan',
      wellbeingCheckSent: true,
    },
    {
      id: 'A-102',
      course: 'Matematika Diskrit (IF2211)',
      consecutiveAbsences: 1,
      lastAbsenceDate: '24 Juni 2026',
      dosenWaliName: 'Dr. Budi Rahardjo',
      status: 'Selesai',
      wellbeingCheckSent: false,
    }
  ]);

  const [responseSubmitted, setResponseSubmitted] = useState<string | null>(null);
  const [excuseText, setExcuseText] = useState('');
  const [excuseType, setExcuseType] = useState('Sakit');

  const handleResolveAlert = (id: string) => {
    if (!excuseText.trim()) return;

    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        return {
          ...alert,
          status: 'Selesai'
        };
      }
      return alert;
    }));

    setResponseSubmitted(id);
    setTimeout(() => {
      setResponseSubmitted(null);
      setExcuseText('');
    }, 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-200 font-sans relative overflow-hidden">
      {/* Visual Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 animate-pulse">
              <HeartPulse className="w-4 h-4 text-amber-600 dark:text-amber-450" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Sistem Deteksi Absensi & Dukungan Akademik
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Sistem otomatis mendeteksi ketidakhadiran beruntun, mengirimkan laporan ke dosen wali, serta wellbeing check ke Anda.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const isWarning = alert.consecutiveAbsences >= 2;
          const isPending = alert.status === 'Butuh Tanggapan';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-colors ${
                isWarning && isPending
                  ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-500/30'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-850'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{alert.id}</span>
                    <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                    <span className={`text-[10px] font-bold ${isWarning ? 'text-amber-650 dark:text-amber-400' : 'text-slate-500'}`}>
                      {alert.consecutiveAbsences}x Absen Beruntun
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white">
                    {alert.course}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Absensi terakhir terlewat: <b className="text-slate-750 dark:text-slate-300">{alert.lastAbsenceDate}</b>
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    alert.status === 'Selesai'
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                      : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/30'
                  }`}>
                    {alert.status}
                  </span>
                  <div className="text-[9.5px] text-slate-400 font-medium mt-1">
                    Dosen Wali: {alert.dosenWaliName}
                  </div>
                </div>
              </div>

              {/* Automated Triggers Visual logger */}
              {isWarning && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-200/50 dark:border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Log for Dosen Wali warning */}
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Status Peringatan Dosen Wali
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed">
                        Sistem mendeteksi 3x absen beruntun. Notifikasi peringatan dini otomatis terkirim ke email & dasbor dosen wali <b>{alert.dosenWaliName}</b> untuk peninjauan kesejahteraan kuliah.
                      </p>
                    </div>

                    {/* Wellbeing Check Message Sent */}
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Wellbeing Check (Sistem)
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 italic leading-relaxed bg-blue-500/5 dark:bg-blue-500/10 p-2 rounded-lg border border-blue-500/5">
                        &ldquo;Hai Syafiq, sistem mencatat Anda tidak hadir beberapa kuliah belakangan. Apakah Anda baik-baik saja? Jika ada kendala medis, keluarga, atau psikologis, silakan kirim alasan di sini.&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Reply Form to resolve warning */}
                  {isPending && (
                    <AnimatePresence mode="wait">
                      {responseSubmitted === alert.id ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-350 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Tanggapan & Surat Alasan Berhasil Dikirimkan Ke Dosen Wali! Status Anda Terlindungi.
                        </motion.div>
                      ) : (
                        <div className="p-3 bg-amber-500/5 dark:bg-amber-400/5 border border-dashed border-amber-500/25 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>Formulir Klarifikasi Kehadiran</span>
                            <span className="text-[10px] text-slate-450 font-medium">Beban Absensi Terlacak</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={excuseType}
                              onChange={(e) => setExcuseType(e.target.value)}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                            >
                              <option value="Sakit">Sakit (Memerlukan Surat Dokter)</option>
                              <option value="Izin">Izin Penting/Keperluan Keluarga</option>
                              <option value="Kendala Teknis">Kendala Jaringan / Teknis</option>
                            </select>

                            <input
                              type="text"
                              required
                              placeholder="Masukkan rincian keterangan ketidakhadiran Anda..."
                              value={excuseText}
                              onChange={(e) => setExcuseText(e.target.value)}
                              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-800 dark:text-slate-200"
                            />

                            <button
                              onClick={() => handleResolveAlert(alert.id)}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-1"
                            >
                              Kirim Alasan <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
