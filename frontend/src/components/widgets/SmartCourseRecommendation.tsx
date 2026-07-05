import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Award, BrainCircuit, ShieldCheck, Database, Layout, TrendingUp, CheckCircle2, UserCheck, Star } from 'lucide-react';

interface ElectiveCourse {
  code: string;
  name: string;
  sks: number;
  semester: number;
  suitabilityScore: number; // Percentage
  reasoning: string;
  careerProspects: string[];
  prerequisites: string;
  instructor: string;
}

const interestOptions = [
  { id: 'ai', label: 'Artificial Intelligence & Machine Learning', icon: <BrainCircuit className="w-4 h-4" /> },
  { id: 'cyber', label: 'Cyber Security & Network Defense', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'data', label: 'Big Data & Data Science', icon: <Database className="w-4 h-4" /> },
  { id: 'web', label: 'Full-Stack Web & Mobile Engineering', icon: <Layout className="w-4 h-4" /> },
];

const mockRecommendations: Record<string, ElectiveCourse[]> = {
  ai: [
    {
      code: 'IF3244',
      name: 'Pembelajaran Mendalam (Deep Learning)',
      sks: 3,
      semester: 6,
      suitabilityScore: 98,
      reasoning: 'Sangat cocok karena Anda meraih nilai A pada mata kuliah Matematika Diskrit dan Algoritma Struktur Data. Mata kuliah ini memperluas penguasaan neural networks Anda.',
      careerProspects: ['AI Research Engineer', 'Computer Vision Specialist', 'Data Scientist'],
      prerequisites: 'Kalkulus II, Pengantar Kecerdasan Buatan',
      instructor: 'Prof. Dr. Ir. Supriadi'
    },
    {
      code: 'IF3248',
      name: 'Pemrosesan Bahasa Alami (NLP)',
      sks: 3,
      semester: 6,
      suitabilityScore: 92,
      reasoning: 'Rekomendasi kuat berdasarkan kesukaan Anda pada struktur data teks. Berfokus pada implementasi LLM, chatbot, dan analisis sentimen.',
      careerProspects: ['NLP Engineer', 'Generative AI Developer', 'Computational Linguist'],
      prerequisites: 'Probabilitas & Statistika, Pemrograman Python',
      instructor: 'Dr. Eng. Ayu Purwari'
    }
  ],
  cyber: [
    {
      code: 'IF3262',
      name: 'Kriptografi Terapan & Keamanan Informasi',
      sks: 3,
      semester: 6,
      suitabilityScore: 95,
      reasoning: 'Didukung oleh nilai AB Anda di Jaringan Komputer. Mempelajari sistem enkripsi modern, otentikasi biometrik, dan audit keamanan sistem.',
      careerProspects: ['Cryptographer', 'Information Security Officer', 'Cyber Security Consultant'],
      prerequisites: 'Matematika Diskrit, Jaringan Komputer',
      instructor: 'Dr. Rahmat Kartiko'
    },
    {
      code: 'IF3266',
      name: 'Forensik Digital & Analisis Malware',
      sks: 3,
      semester: 6,
      suitabilityScore: 89,
      reasoning: 'Sesuai untuk melacak serangan siber. Mempelajari pemulihan data pasca-insiden dan reverse engineering file biner berbahaya.',
      careerProspects: ['Digital Forensics Investigator', 'Incident Responder', 'Malware Analyst'],
      prerequisites: 'Sistem Operasi, Keamanan Jaringan',
      instructor: 'Brigjen Dr. Sonny Santosa'
    }
  ],
  data: [
    {
      code: 'IF3250',
      name: 'Arsitektur Data Besar (Big Data Engineering)',
      sks: 3,
      semester: 6,
      suitabilityScore: 96,
      reasoning: 'Didorong oleh pencapaian nilai A Anda di Sistem Basis Data. Memfokuskan pada pemrosesan klaster Hadoop, Spark, dan ETL berskala peta-byte.',
      careerProspects: ['Big Data Engineer', 'Data Warehouse Architect', 'Analytics Manager'],
      prerequisites: 'Sistem Basis Data, Pemrograman Berorientasi Objek',
      instructor: 'Dr. Budi Rahardjo'
    },
    {
      code: 'IF3255',
      name: 'Visualisasi Data & Intelijen Bisnis',
      sks: 3,
      semester: 6,
      suitabilityScore: 91,
      reasoning: 'Cocok untuk mempresentasikan analisis data rumit. Berfokus pada penceritaan data (data storytelling), Tableau, d3.js, dan dashboard eksekutif.',
      careerProspects: ['Business Intelligence Analyst', 'Data Journalist', 'Data Analytics Consultant'],
      prerequisites: 'Statistika Terapan, Pengantar Sains Data',
      instructor: 'Indah Kusuma, M.T.'
    }
  ],
  web: [
    {
      code: 'IF3270',
      name: 'Arsitektur Mikroservis & Komputasi Awan (Cloud)',
      sks: 3,
      semester: 6,
      suitabilityScore: 97,
      reasoning: 'Berdasarkan nilai prima Anda pada Rekayasa Perangkat Lunak. Mempelajari skalabilitas aplikasi, Docker, Kubernetes, dan serverless deployment.',
      careerProspects: ['Cloud Engineer', 'DevOps Specialist', 'Lead Backend Architect'],
      prerequisites: 'Rekayasa Perangkat Lunak, Jaringan Komputer',
      instructor: 'Yusuf Azhari, Ph.D.'
    },
    {
      code: 'IF3275',
      name: 'Pengembangan Aplikasi Mobile Lanjut (Cross-Platform)',
      sks: 3,
      semester: 6,
      suitabilityScore: 94,
      reasoning: 'Sesuai dengan bakat antarmuka Anda. Berfokus pada ekosistem React Native, Flutter, manajemen state global, dan sinkronisasi data luring (offline-sync).',
      careerProspects: ['Senior Mobile Developer', 'App Architect', 'Startup Tech Founder'],
      prerequisites: 'Pemrograman Web & Mobile, Interaksi Manusia & Komputer',
      instructor: 'Hafiz Azman, M.Sc.'
    }
  ]
};

export function SmartCourseRecommendation() {
  const [selectedInterest, setSelectedInterest] = useState<string>('ai');
  const [activeCourse, setActiveCourse] = useState<ElectiveCourse | null>(null);

  const currentList = mockRecommendations[selectedInterest] || [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200 font-sans">
      
      {/* Widget Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Rekomendasi Mata Kuliah Pilihan Cerdas (AI-Driven)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Saran mata kuliah opsional berdasar minat karir, performa akademik, dan kecenderungan minat Anda.
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
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 select-none ${
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

      {/* Suggested Courses Area */}
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
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden select-none ${
                  isSelected
                    ? 'bg-slate-50 dark:bg-slate-900/60 border-blue-500/40 dark:border-blue-500/35 shadow-xs'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/40 dark:hover:bg-slate-850/50 border-slate-200/60 dark:border-slate-800/80'
                }`}
              >
                {/* Score Tag */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
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
                    <span className="text-[9px] uppercase font-bold text-indigo-500 flex items-center gap-1 mb-1 font-sans">
                      <Award className="w-3.5 h-3.5" /> Analisis Kecocokan Akademik
                    </span>
                    <p className="text-[11px] text-slate-650 dark:text-slate-300 leading-relaxed">
                      {activeCourse.reasoning}
                    </p>
                  </div>

                  {/* Career paths prospects */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Prospek Karir Masa Depan
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
                      alert(`Mata kuliah ${activeCourse.name} (${activeCourse.code}) berhasil ditambahkan ke usulan KRS bayangan Anda! Silakan finalisasi di menu KRS.`);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all text-[11px]"
                  >
                    Tambah ke KRS <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs flex flex-col items-center justify-center h-full gap-2.5 min-h-[220px]">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center text-slate-400">
                  <Sparkles className="w-5 h-5 animate-bounce" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Pilih Mata Kuliah Rekomendasi</div>
                  <p className="text-slate-450 max-w-[240px] leading-relaxed mx-auto">
                    Pilih salah satu usulan mata kuliah di sebelah kiri untuk meninjau rincian analisis akademik, prasyarat, serta prospek karirnya.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
