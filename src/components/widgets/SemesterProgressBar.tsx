import React from 'react';
import { Calendar, Compass, Clock, GraduationCap } from 'lucide-react';

export function SemesterProgressBar() {
  // Current academic term: Semester Genap 2025/2026
  // Start date: February 1, 2026
  // End date: July 31, 2026
  const termStart = new Date('2026-02-01T00:00:00');
  const termEnd = new Date('2026-07-31T23:59:59');
  const today = new Date(); // In 2026-06-25 based on system environment

  // Calculations
  const totalDuration = termEnd.getTime() - termStart.getTime();
  const elapsed = today.getTime() - termStart.getTime();
  
  // Calculate percentage (clamp between 0 and 100)
  let percentage = Math.round((elapsed / totalDuration) * 100);
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  // Remaining days calculation
  const remainingTime = termEnd.getTime() - today.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

  // Formatter for readable dates
  const formatDateString = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Progress Semester Genap 2025/2026
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Periode Kuliah: {formatDateString(termStart)} &mdash; {formatDateString(termEnd)}
          </p>
        </div>
        
        <div className="text-right">
          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 px-2.5 py-1 rounded-xl text-xs font-extrabold text-blue-700 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            {remainingDays} Hari Tersisa
          </span>
        </div>
      </div>

      {/* Visual Progress Bar track */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            Berjalan {percentage}%
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-black">{percentage}% Selesai</span>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3.5 overflow-hidden p-[2px] border border-slate-200/40 dark:border-slate-800/60">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm shadow-blue-500/20 relative"
            style={{ width: `${percentage}%` }}
          >
            {/* Elegant glass shimmer glow overlay */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Awal Semester</span>
          <span>Ujian Akhir Semester / Selesai</span>
        </div>
      </div>
    </div>
  );
}
