import React from 'react';
import { Calendar, AlertCircle, Bookmark, Award, TreePine, Sparkles } from 'lucide-react';

interface AcademicDate {
  id: string;
  title: string;
  dateRange: string;
  category: 'exams' | 'holidays' | 'registration' | 'academic';
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const keyAcademicDates: AcademicDate[] = [
  {
    id: 'd1',
    title: 'Hari Raya Idul Adha 1447 H',
    dateRange: '27 Juni 2026',
    category: 'holidays',
    description: 'Hari libur nasional memperingati Hari Raya Idul Adha.',
    status: 'upcoming'
  },
  {
    id: 'd2',
    title: 'Registrasi & KRS Ganjil 2026/2027',
    dateRange: '15 Juli 2026 - 10 Agustus 2026',
    category: 'registration',
    description: 'Periode pendaftaran administratif dan pengisian Kartu Rencana Studi (KRS) online.',
    status: 'upcoming'
  },
  {
    id: 'd3',
    title: 'Hari Kemerdekaan RI Ke-81',
    dateRange: '17 Agustus 2026',
    category: 'holidays',
    description: 'Hari libur nasional memperingati Hari Kemerdekaan Republik Indonesia.',
    status: 'upcoming'
  },
  {
    id: 'd4',
    title: 'Mulai Perkuliahan Semester Ganjil',
    dateRange: '24 Agustus 2026',
    category: 'academic',
    description: 'Awal kegiatan belajar mengajar tatap muka semester ganjil tahun ajaran 2026/2027.',
    status: 'upcoming'
  },
  {
    id: 'd5',
    title: 'Ujian Tengah Semester (UTS) Ganjil',
    dateRange: '12 Oktober 2026 - 23 Oktober 2026',
    category: 'exams',
    description: 'Penyelenggaraan evaluasi tengah semester untuk seluruh program studi.',
    status: 'upcoming'
  },
  {
    id: 'd6',
    title: 'Ujian Akhir Semester (UAS) Ganjil',
    dateRange: '14 Desember 2026 - 24 Desember 2026',
    category: 'exams',
    description: 'Evaluasi akhir semester ganjil dan pengumpulan nilai akhir perkuliahan.',
    status: 'upcoming'
  }
];

export function AcademicDatesWidget() {
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'exams':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/20',
          border: 'border-rose-100 dark:border-rose-900/40',
          text: 'text-rose-700 dark:text-rose-400',
          badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300',
          icon: <Award className="w-4 h-4" />,
          label: 'Ujian'
        };
      case 'holidays':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          border: 'border-emerald-100 dark:border-emerald-900/40',
          text: 'text-emerald-700 dark:text-emerald-400',
          badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
          icon: <TreePine className="w-4 h-4" />,
          label: 'Hari Libur'
        };
      case 'registration':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          border: 'border-blue-100 dark:border-blue-900/40',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
          icon: <Bookmark className="w-4 h-4" />,
          label: 'Registrasi'
        };
      default:
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/20',
          border: 'border-indigo-100 dark:border-indigo-900/40',
          text: 'text-indigo-700 dark:text-indigo-400',
          badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300',
          icon: <Calendar className="w-4 h-4" />,
          label: 'Akademik'
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-blue-500" />
          Kalender &amp; Tanggal Penting Akademik
        </h3>
        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 px-2 py-0.5 rounded text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Tahun 2026
        </span>
      </div>

      <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[460px]">
        <div className="grid grid-cols-1 gap-3">
          {keyAcademicDates.map((item) => {
            const styles = getCategoryStyles(item.category);
            return (
              <div 
                key={item.id} 
                className={`p-4 border rounded-xl flex gap-3 items-start transition-all hover:shadow-sm ${styles.bg} ${styles.border}`}
              >
                <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 ${styles.text} shadow-sm border border-slate-100 dark:border-slate-800/80`}>
                  {styles.icon}
                </div>
                
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${styles.badge}`}>
                      {styles.label}
                    </span>
                  </div>
                  
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {item.dateRange}
                  </div>
                  
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
