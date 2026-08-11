import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Bookmark, Award, TreePine, Sparkles, Clock } from 'lucide-react';
import { getAcademicDates } from '../../api/academic.api';

interface AcademicDate {
  id: string;
  title: string;
  dateRange: string;
  category: 'exams' | 'holidays' | 'registration' | 'academic';
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Kategorisasi tanggal akademik berdasarkan kata kunci judul (heuristik jujur, bukan data tiruan).
const categorize = (title: string): AcademicDate['category'] => {
  const t = title.toLowerCase();
  if (t.includes('uts') || t.includes('uas') || t.includes('ujian')) return 'exams';
  if (t.includes('krs') || t.includes('registrasi') || t.includes('isi rencana') || t.includes('pengisian')) return 'registration';
  if (t.includes('libur') || t.includes('raya') || t.includes('kemerdekaan') || t.includes('cuti')) return 'holidays';
  return 'academic';
};

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export function AcademicDatesWidget() {
  const [dates, setDates] = useState<AcademicDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await getAcademicDates();
        if (cancelled) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const items: AcademicDate[] = rows.map((r) => {
          const d = new Date(r.date + 'T00:00:00');
          const status: AcademicDate['status'] = isNaN(d.getTime())
            ? 'upcoming'
            : d < today ? 'completed' : d.getTime() === today.getTime() ? 'ongoing' : 'upcoming';
          return {
            id: r.id,
            title: r.title,
            dateRange: formatDate(r.date),
            category: categorize(r.title),
            description: r.period ? `Periode akademik: ${r.period}` : (r.description || ''),
            status,
          };
        });
        setDates(items);
      } catch {
        if (!cancelled) setError('Gagal memuat kalender akademik.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          border: 'border-blue-100 dark:border-blue-900/40',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
          icon: <Calendar className="w-4 h-4" />,
          label: 'Akademik'
        };
    }
  };

  const statusBadge = (status: AcademicDate['status']) => {
    if (status === 'completed') return <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">Selesai</span>;
    if (status === 'ongoing') return <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">Berlangsung</span>;
    return <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">Akan Datang</span>;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-blue-500" />
          Kalender &amp; Tanggal Penting Akademik
        </h3>
        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 px-2 py-0.5 rounded text-[10px] font-bold text-blue-600 dark:text-blue-400">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Periode Akademik Aktif
        </span>
      </div>

      <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[460px]">
        {loading && (
          <div className="text-center py-8 text-xs text-slate-400 flex flex-col items-center gap-2">
            <Clock className="w-5 h-5 animate-spin text-slate-300" />
            Memuat kalender akademik...
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-xs text-rose-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {!loading && !error && dates.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            Belum ada data tanggal penting akademik.
          </div>
        )}
        <div className="grid grid-cols-1 gap-3">
          {dates.map((item) => {
            const styles = getCategoryStyles(item.category);
            return (
              <div 
                key={item.id} 
                className={`p-4 border rounded-xl flex gap-3 items-start transition-colors hover:shadow-sm ${styles.bg} ${styles.border}`}
              >
                <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 ${styles.text} shadow-sm border border-slate-100 dark:border-slate-800/80`}>
                  {styles.icon}
                </div>
                
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${styles.badge}`}>
                        {styles.label}
                      </span>
                      {statusBadge(item.status)}
                    </div>
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
