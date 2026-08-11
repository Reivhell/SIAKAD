import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Award, BrainCircuit, ShieldCheck, Database, Layout, TrendingUp, Star, Inbox, Clock } from 'lucide-react';
import { getStudentOverview, AvailableKrsCourse } from '../../api/academic.api';

interface ElectiveCourse {
  code: string;
  name: string;
  sks: number;
  semester: number;
  suitabilityScore: number; // Skor kesesuaian minat (dihitung dari kata kunci, bukan data tiruan)
  reasoning: string;
  careerProspects: string[];
  prerequisites: string;
  instructor: string;
}

const interestOptions = [
  { id: 'ai', label: 'Artificial Intelligence & Machine Learning', icon: <BrainCircuit className="w-4 h-4" />, keywords: ['kecerdasan', 'intelligence', 'machine', 'learning', 'ai', 'data mining', 'pengolahan', 'natural', 'vision', 'robot'], careers: ['AI Research Engineer', 'Data Scientist', 'Computer Vision Specialist'] },
  { id: 'cyber', label: 'Cyber Security & Network Defense', icon: <ShieldCheck className="w-4 h-4" />, keywords: ['keamanan', 'kripto', 'cryptography', 'forensik', 'forensic', 'jaringan', 'network', 'cyber', 'penetration', 'malware'], careers: ['Cyber Security Analyst', 'Penetration Tester', 'Forensic Investigator'] },
  { id: 'data', label: 'Big Data & Data Science', icon: <Database className="w-4 h-4" />, keywords: ['data', 'analitik', 'analytics', 'statistik', 'statistics', 'big data', 'visualisasi', 'sains data', 'science'], careers: ['Data Engineer', 'Business Intelligence Analyst', 'Data Analytics Consultant'] },
  { id: 'web', label: 'Full-Stack Web & Mobile Engineering', icon: <Layout className="w-4 h-4" />, keywords: ['web', 'mobile', 'pemrograman', 'programming', 'aplikasi', 'application', 'perangkat lunak', 'software', 'cloud', 'mikroservis', 'microservice'], careers: ['Full-Stack Developer', 'Mobile Developer', 'Cloud Engineer'] },
];

export function SmartCourseRecommendation() {
  const [selectedInterest, setSelectedInterest] = useState<string>('ai');
  const [activeCourse, setActiveCourse] = useState<ElectiveCourse | null>(null);
  const [courses, setCourses] = useState<AvailableKrsCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ov = await getStudentOverview();
        if (!cancelled) setCourses(ov.availableKrsCourses ?? []);
      } catch {
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Mata kuliah pilihan riil dari KRS backend, dicocokkan dengan kata kunci minat.
  const recommendations: Record<string, ElectiveCourse[]> = useMemo(() => {
    const electives = courses.filter((c) => c.type === 'Pilihan');
    const result: Record<string, ElectiveCourse[]> = {};
    for (const opt of interestOptions) {
      const matched = electives
        .map((c) => {
          const hay = `${c.code} ${c.name}`.toLowerCase();
          const hits = opt.keywords.filter((k) => hay.includes(k.toLowerCase())).length;
          return { c, hits };
        })
        .filter((x) => x.hits > 0)
        .sort((a, b) => b.hits - a.hits)
        .map(({ c, hits }) => ({
          code: c.code,
          name: c.name,
          sks: c.sks,
          semester: c.semester,
          suitabilityScore: Math.min(100, 50 + hits * 15),
          reasoning: `Mata kuliah ini mengandung topik yang sesuai dengan fokus minat "${opt.label}" (${hits} kata kunci cocok). Daftar ini disusun dari mata kuliah pilihan yang tersedia pada KRS periode berjalan.`,
          careerProspects: opt.careers,
          prerequisites: '—',
          instructor: 'Lihat modul KRS untuk daftar dosen pengampu.',
        }));
      result[opt.id] = matched;
    }
    return result;
  }, [courses]);

  const currentList = recommendations[selectedInterest] || [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-200 font-sans">
      
      {/* Widget Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Rekomendasi Mata Kuliah Pilihan Cerdas (AI-Driven)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Mata kuliah pilihan yang tersedia pada KRS periode berjalan, dicocokkan dengan fokus minat karir Anda.
          </p>
        </div>
      </div>

      {/* Focus Area Selector Tabs */}
      <div className="space-y-2 mb-4.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
          Pilih Fokus Minat Anda (Minat Karir)
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {interestOptions.map((opt) => {
            const isSelected = selectedInterest === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedInterest(opt.id);
                  setActiveCourse(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-2 select-none ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-500/50 dark:border-blue-500/40 text-blue-700 dark:text-blue-400 font-bold'
                    : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-850 text-slate-600 dark:text-slate-450'
                }`}
              >
                <div className="shrink-0">{opt.icon}</div>
                <span className="text-[10.5px] leading-tight font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 animate-spin" /> Memuat mata kuliah pilihan dari server...
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-2">
          <Inbox className="w-8 h-8 text-slate-300" />
          <p className="text-xs text-slate-500 max-w-sm">
            Belum ada data mata kuliah pilihan untuk KRS periode berjalan. Data akan tampil setelah prodi menerbitkan daftar mata kuliah.
          </p>
        </div>
      )}

      {!loading && courses.length > 0 && currentList.length === 0 && (
        <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-2">
          <Inbox className="w-8 h-8 text-slate-300" />
          <p className="text-xs text-slate-500 max-w-sm">
            Tidak ada mata kuliah pilihan yang cocok dengan fokus minat ini pada KRS periode berjalan.
          </p>
        </div>
      )}

      {!loading && currentList.length > 0 && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recommended list */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Mata Kuliah Yang Direkomendasikan
          </div>
          {currentList.map((course) => {
            const isSelected = activeCourse?.code === course.code;
            return (
              <div
                key={course.code}
                onClick={() => setActiveCourse(course)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer relative overflow-hidden select-none ${
                  isSelected
                    ? 'bg-slate-50 dark:bg-slate-900/60 border-blue-500/40 dark:border-blue-500/35 shadow-xs'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/40 dark:hover:bg-slate-850/50 border-slate-200/60 dark:border-slate-800/80'
                }`}
              >
                {/* Score Tag */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{course.suitabilityScore}% Cocok</span>
                </div>

                <div className="space-y-1 pr-16">
                  <div className="text-[10px] text-slate-450 font-bold">
                    {course.code} &bull; Semester {course.semester} &bull; {course.sks} SKS
                  </div>
                  <h5 className="text-xs font-bold text-slate-850 dark:text-white">
                    {course.name}
                  </h5>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 line-clamp-1 leading-relaxed">
                    {course.reasoning}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Course details panel */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {activeCourse ? (
              <motion.div
                key={activeCourse.code}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 space-y-4 h-full flex flex-col justify-between"
              >
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400">{activeCourse.code}</span>
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        {activeCourse.name}
                      </h5>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 px-2 py-0.5 rounded-md font-black text-[10px]">
                      {activeCourse.sks} SKS
                    </span>
                  </div>

                  {/* Smart reasoning explanation */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-blue-500 flex items-center gap-1 mb-1 font-sans">
                      <Award className="w-3.5 h-3.5" /> Analisis Kecocokan Minat
                    </span>
                    <p className="text-[11px] text-slate-650 dark:text-slate-300 leading-relaxed">
                      {activeCourse.reasoning}
                    </p>
                  </div>

                  {/* Career paths prospects */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Jalur Karir Umum (Fokus Minat)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCourse.careerProspects.map((cr, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10 dark:border-blue-500/20 px-2.5 py-1 rounded-md text-[10.5px] font-bold flex items-center gap-1"
                        >
                          <TrendingUp className="w-3 h-3 text-blue-500" />
                          {cr}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Prerequisites and instructor */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-slate-200/40 dark:border-slate-800/40">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Prasyarat MK</span>
                      <div className="font-semibold text-slate-700 dark:text-slate-350 mt-0.5">
                        {activeCourse.prerequisites}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Dosen Pengampu</span>
                      <div className="font-semibold text-slate-700 dark:text-slate-350 mt-0.5">
                        {activeCourse.instructor}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Tertarik mengambil MK ini?</span>
                  <button
                    onClick={() => {
                      alert(`Mata kuliah ${activeCourse.name} (${activeCourse.code}) direkomendasikan untuk KRS Anda. Finalisasi pengambilan dilakukan melalui modul KRS pada dashboard.`);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                  >
                    Tambah ke KRS <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs flex flex-col items-center justify-center h-full gap-2.5 min-h-[220px]">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center text-slate-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Pilih Mata Kuliah Rekomendasi</div>
                  <p className="text-slate-450 max-w-[240px] leading-relaxed mx-auto">
                    Pilih salah satu usulan mata kuliah di sebelah kiri untuk meninjau rincian analisis kecocokan dan prospek karirnya.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      )}
    </div>
  );
}
