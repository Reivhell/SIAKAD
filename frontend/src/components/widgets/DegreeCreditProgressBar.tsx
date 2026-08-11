import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, BookOpen, CheckCircle2, ChevronDown, ChevronUp, HelpCircle, Info, Plus, RotateCcw, Sparkles, TrendingUp } from 'lucide-react';

interface SksCategory {
  name: string;
  taken: number;
  target: number;
  color: string;
  icon: React.ReactNode;
  details: string;
}

interface DegreeCreditProgressBarProps {
  forceCompleted?: boolean;
  /** Total SKS yang sudah ditempuh (dari transkrip riil). */
  sksTaken?: number;
  /** IPK kumulatif terkini (dari semesterGPAs riil). */
  ipk?: number;
  /** Rincian SKS per semester dari transkrip riil. */
  perSemester?: Array<{ semester: string; sksTaken: number; ips: number }>;
}

const CATEGORY_COLORS = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-indigo-500'];

export function DegreeCreditProgressBar({ forceCompleted = false, sksTaken, ipk, perSemester = [] }: DegreeCreditProgressBarProps) {
  const graduationTarget = 144;
  const baseTaken = forceCompleted ? 144 : (sksTaken ?? 0);
  
  // Interactive simulation state
  const [simulatedPlannedSks, setSimulatedPlannedSks] = useState<number>(0);
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState<boolean>(false);
  const [showHelperTooltip, setShowHelperTooltip] = useState<boolean>(false);

  // Rincian SKS per semester (data riil dari transkrip)
  const categories: SksCategory[] = perSemester.map((row, idx) => ({
    name: row.semester,
    taken: row.sksTaken,
    target: graduationTarget,
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    icon: idx % 4 === 0 ? <Award className="w-4 h-4 text-emerald-500" /> : idx % 4 === 1 ? <BookOpen className="w-4 h-4 text-blue-500" /> : idx % 4 === 2 ? <Sparkles className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-indigo-500" />,
    details: `IPS semester ${row.ips.toFixed(2)}`,
  }));

  const totalTaken = baseTaken + simulatedPlannedSks;
  const currentPercentage = Math.min(100, Math.round((baseTaken / graduationTarget) * 100));
  const simulatedPercentage = Math.min(100, Math.round((totalTaken / graduationTarget) * 100));
  const remainingSks = Math.max(0, graduationTarget - totalTaken);

  // Estimates for graduation
  const currentIpk = ipk ?? 0;
  let predicate = 'Belum Ada Data';
  if (currentIpk >= 3.51) {
    predicate = 'Dengan Pujian (Cum Laude)';
  } else if (currentIpk >= 3.0) {
    predicate = 'Sangat Memuaskan';
  } else if (currentIpk > 0) {
    predicate = 'Memuaskan';
  }

  // Calculate estimated semesters left (assuming average 20 SKS per semester)
  const estSemestersLeft = Math.ceil(remainingSks / 20);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-200 font-sans relative overflow-hidden">
      {/* Decorative top accent border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Status Capaian Kredit Kelulusan (SKS)
              <button 
                onClick={() => setShowHelperTooltip(!showHelperTooltip)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Informasi detail kelulusan"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Program Studi: S1 Teknik Informatika (Kurikulum Merdeka 2024)
          </p>
        </div>

        {/* IPK and Predicate indicator */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850 self-stretch sm:self-auto justify-between">
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Estimasi Predikat</div>
            <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{predicate}</div>
          </div>
          <div className="pl-3 border-l border-slate-200 dark:border-slate-800 text-right">
            <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">IPK</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">{currentIpk > 0 ? currentIpk : '—'}</div>
          </div>
        </div>
      </div>

      {/* Helper Tooltip Alert */}
      <AnimatePresence>
        {showHelperTooltip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex gap-2.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Informasi Kurikulum S1 Teknik Informatika</span>
                <p className="leading-relaxed opacity-90">
                  Untuk memperoleh gelar Sarjana Komputer (S.Kom), mahasiswa diwajibkan menyelesaikan minimal <strong>144 SKS</strong> yang terdiri dari mata kuliah umum, wajib program studi, elektif peminatan, serta Skripsi/Tugas Akhir dengan nilai minimal kelulusan adalah C.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main SKS Progress Representation */}
      <div className="space-y-4">
        {/* Progress details */}
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1.5">
              <span>{totalTaken}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">dari {graduationTarget} SKS</span>
              {simulatedPlannedSks > 0 && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 dark:bg-emerald-400/10 px-1.5 py-0.5 rounded ml-1">
                  +{simulatedPlannedSks} SKS Rencana
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Telah diselesaikan {currentPercentage}% &bull; {remainingSks} SKS tersisa ({estSemestersLeft} Semester lagi)
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {simulatedPercentage}%
            </span>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Capaian</div>
          </div>
        </div>

        {/* Visual Double-layered Track Progress Bar with Micro-interactions */}
        <div className="relative w-full bg-slate-150 dark:bg-slate-950 rounded-full h-4 p-[3px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
          
          {/* Base current progress */}
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-500 h-2.5 rounded-full z-10 relative transition-colors duration-500 shadow-sm"
            style={{ width: `${currentPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${currentPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Elegant lighting glimmer */}
            <div className="absolute inset-0 bg-white/20 animate-[pulse_1.5s_infinite] rounded-full" />
          </motion.div>

          {/* Simulated Planned progress bar overlay */}
          {simulatedPlannedSks > 0 && (
            <motion.div 
              className="absolute left-[3px] top-[3px] h-2.5 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-60 rounded-full animate-pulse transition-colors duration-500"
              style={{ width: `${simulatedPercentage}%` }}
            />
          )}
        </div>

        {/* Interactive SKS Planner Widget Section */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-xl p-3.5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-850 dark:text-slate-250 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
                Simulasi Perencanaan SKS Tambahan
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Ubah slider di bawah untuk mensimulasikan penambahan SKS semester depan
              </p>
            </div>
            
            {simulatedPlannedSks > 0 && (
              <button
                onClick={() => setSimulatedPlannedSks(0)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Reset simulasi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="24"
              step="1"
              value={simulatedPlannedSks}
              onChange={(e) => setSimulatedPlannedSks(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400 focus:outline-none"
            />
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-xs font-extrabold text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg min-w-[70px] text-center shrink-0">
              +{simulatedPlannedSks} SKS
            </div>
          </div>
        </div>

        {/* Toggleable Course Category Breakdown */}
        <div>
          <button
            onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-slate-100 transition-colors border-t border-slate-100 dark:border-slate-800/80 mt-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              Cek Rincian SKS per Semester
            </span>
            {showCategoryBreakdown ? (
              <ChevronUp className="w-4 h-4 text-slate-450" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-450" />
            )}
          </button>

          <AnimatePresence>
            {showCategoryBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                  {categories.length === 0 && (
                    <div className="col-span-full text-center py-8 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">Belum ada data transkrip. SKS per semester akan tampil setelah nilai tersedia.</p>
                    </div>
                  )}
                  {categories.map((cat, idx) => {
                    const catPct = Math.min(100, Math.round((cat.taken / cat.target) * 100));
                    return (
                      <div 
                        key={idx} 
                        className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-2  hover:shadow-xs transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="shrink-0 p-1 bg-white dark:bg-slate-950 rounded-lg shadow-2xs border border-slate-200/40 dark:border-slate-800/40">
                              {cat.icon}
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-[11px] font-black text-slate-800 dark:text-slate-200 leading-tight">
                                {cat.name}
                              </div>
                              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                                {cat.details}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Category Progress Stats */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-400">SKS ditempuh</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {cat.taken} / <span className="text-slate-400">{cat.target} SKS</span> ({catPct}%)
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-200/20 dark:border-slate-800/20">
                            <motion.div 
                              className={`${cat.color} h-1 rounded-full`}
                              style={{ width: `${catPct}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${catPct}%` }}
                              transition={{ duration: 0.6, delay: idx * 0.08 }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
