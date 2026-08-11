import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Send, 
  Download, 
  ThumbsUp, 
  Clock, 
  UserCheck, 
  BookOpen, 
  ChevronRight, 
  Settings, 
  Sliders, 
  FileText,
  Calendar,
  History,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Inbox
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { User } from '../../types';
import { getEdomEvaluations, submitEdomEvaluation, EdomEvaluation } from '../../api/academic.api';

// ==========================================
// DATA STRUCTURES
// ==========================================

interface LecturerRating {
  lecturerId: string;
  lecturerName: string;
  department: string;
  courseCode: string;
  courseName: string;
  averageRating: number;
  kpis: {
    pedagogik: number;
    profesional: number;
    kepribadian: number;
    sosial: number;
  };
  totalEvaluations: number;
  participationRate: number;
  semester?: string;
  comments: Array<{
    id: string;
    date: string;
    text: string;
    sentiment: 'positif' | 'konstruktif' | 'netral';
    likes: number;
  }>;
}

interface StudentCourse {
  code: string;
  name: string;
  lecturer: string;
  evaluated: boolean;
}

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
const departmentFromCode = (code: string) => {
  if (code.startsWith('SI')) return 'Sistem Informasi';
  if (code.startsWith('EE')) return 'Teknik Elektro';
  return 'Teknik Informatika';
};
const sentimentOf = (score: number): 'positif' | 'konstruktif' | 'netral' =>
  score >= 4 ? 'positif' : score >= 3 ? 'netral' : 'konstruktif';

export function LecturerRatingModule({ user }: { user: User }) {
  // Data EDOM riil dari backend
  const [rows, setRows] = useState<EdomEvaluation[]>([]);
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Student Evaluation Form State
  const [activeCourse, setActiveCourse] = useState<StudentCourse | null>(null);
  const [pedagogikScore, setPedagogikScore] = useState(0);
  const [profesionalScore, setProfesionalScore] = useState(0);
  const [kepribadianScore, setKepribadianScore] = useState(0);
  const [sosialScore, setSosialScore] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successEvalMsg, setSuccessEvalMsg] = useState(false);

  // Admin and Leadership filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('Semua');
  const [ratingFilter, setRatingFilter] = useState('Semua');

  // Interactive feedback hover state
  const [hoverPedagogik, setHoverPedagogik] = useState(0);
  const [hoverProfesional, setHoverProfesional] = useState(0);
  const [hoverKepribadian, setHoverKepribadian] = useState(0);
  const [hoverSosial, setHoverSosial] = useState(0);

  // General tab for Lecturer Rating Module
  const [currentTab, setCurrentTab] = useState<'rating-list' | 'settings' | 'statistics'>('rating-list');

  // History View Table State for Lecturer Role
  const [historySearch, setHistorySearch] = useState('');
  const [historySemesterFilter, setHistorySemesterFilter] = useState('Semua');
  const [historySortField, setHistorySortField] = useState<'semester' | 'courseName' | 'average' | 'totalStudents'>('semester');
  const [historySortOrder, setHistorySortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedHistoryRow, setExpandedHistoryRow] = useState<string | null>(null);

  // Lecturer subtab: 'ringkasan' or 'riwayat-tabel'
  const [lecturerSubTab, setLecturerSubTab] = useState<'ringkasan' | 'riwayat-tabel'>('ringkasan');

  const loadEdom = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getEdomEvaluations();
      setRows(data.evaluations ?? []);
      if (data.role === 'student') setStudentCourses(data.courses ?? []);
    } catch (err) {
      setLoadError('Gagal memuat data EDOM. Periksa koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEdom();
  }, []);

  // ── Agregasi per dosen (leadership / admin) ─────────────────────
  const lecturerGroups: LecturerRating[] = useMemo(() => {
    const map = new Map<string, EdomEvaluation[]>();
    for (const r of rows) {
      const key = r.lecturerEmail || r.lecturerName || 'Unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries()).map(([key, list]) => {
      const perRowAvg = list.map((r) => (r.pedagogik + r.profesional + r.kepribadian + r.sosial) / 4);
      const codes = Array.from(new Set(list.map((r) => r.courseCode)));
      return {
        lecturerId: key,
        lecturerName: list[0].lecturerName || key,
        department: departmentFromCode(codes[0] || ''),
        courseCode: codes.join(', '),
        courseName: Array.from(new Set(list.map((r) => r.courseName))).join(', '),
        averageRating: round(avg(perRowAvg)),
        kpis: {
          pedagogik: round(avg(list.map((r) => r.pedagogik))),
          profesional: round(avg(list.map((r) => r.profesional))),
          kepribadian: round(avg(list.map((r) => r.kepribadian))),
          sosial: round(avg(list.map((r) => r.sosial))),
        },
        totalEvaluations: list.length,
        participationRate: list.length,
        semester: list[0].semester,
        comments: list
          .filter((r) => r.comment)
          .map((r) => ({
            id: r.id,
            date: r.createdAt || '',
            text: r.comment || '',
            sentiment: sentimentOf((r.pedagogik + r.profesional + r.kepribadian + r.sosial) / 4),
            likes: 0,
          })),
      };
    });
  }, [rows]);

  // ── Data dosen yang sedang login (role lecturer) ────────────────
  const myRatingData: LecturerRating = useMemo(() => {
    if (rows.length === 0) {
      return {
        lecturerId: user.email,
        lecturerName: user.name,
        department: '—',
        courseCode: '—',
        courseName: '—',
        averageRating: 0,
        kpis: { pedagogik: 0, profesional: 0, kepribadian: 0, sosial: 0 },
        totalEvaluations: 0,
        participationRate: 0,
        comments: [],
      };
    }
    const perRowAvg = rows.map((r) => (r.pedagogik + r.profesional + r.kepribadian + r.sosial) / 4);
    return {
      lecturerId: rows[0].lecturerEmail || user.email,
      lecturerName: rows[0].lecturerName || user.name,
      department: departmentFromCode(rows[0].courseCode),
      courseCode: Array.from(new Set(rows.map((r) => r.courseCode))).join(', '),
      courseName: Array.from(new Set(rows.map((r) => r.courseName))).join(', '),
      averageRating: round(avg(perRowAvg)),
      kpis: {
        pedagogik: round(avg(rows.map((r) => r.pedagogik))),
        profesional: round(avg(rows.map((r) => r.profesional))),
        kepribadian: round(avg(rows.map((r) => r.kepribadian))),
        sosial: round(avg(rows.map((r) => r.sosial))),
      },
      totalEvaluations: rows.length,
      participationRate: rows.length,
      comments: rows
        .filter((r) => r.comment)
        .map((r) => ({
          id: r.id,
          date: r.createdAt || '',
          text: r.comment || '',
          sentiment: sentimentOf((r.pedagogik + r.profesional + r.kepribadian + r.sosial) / 4),
          likes: 0,
        })),
    };
  }, [rows, user]);

  // Riwayat per mata kuliah untuk tabel dosen
  const historyData = useMemo(() => {
    const map = new Map<string, EdomEvaluation[]>();
    for (const r of rows) {
      const key = `${r.semester}-${r.courseCode}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries()).map(([key, list], i) => {
      const perRowAvg = list.map((r) => (r.pedagogik + r.profesional + r.kepribadian + r.sosial) / 4);
      return {
        id: `h-${i}-${key}`,
        semester: list[0].semester,
        courseCode: list[0].courseCode,
        courseName: list[0].courseName,
        pedagogik: round(avg(list.map((r) => r.pedagogik)), 1),
        profesional: round(avg(list.map((r) => r.profesional)), 1),
        kepribadian: round(avg(list.map((r) => r.kepribadian)), 1),
        sosial: round(avg(list.map((r) => r.sosial)), 1),
        average: round(avg(perRowAvg)),
        totalStudents: list.length,
        feedbackSummary: list.find((r) => r.comment)?.comment || 'Tidak ada komentar kualitatif pada periode ini.',
      };
    });
  }, [rows]);

  const semestersAvailable = useMemo(() => Array.from(new Set(rows.map((r) => r.semester))), [rows]);

  // Tren per semester untuk grafik dosen
  const trendData = useMemo(() => {
    return semestersAvailable.map((sem) => {
      const semRows = rows.filter((r) => r.semester === sem);
      return { semester: sem, rating: round(avg(semRows.map((r) => (r.pedagogik + r.profesional + r.kepribadian + r.sosial) / 4))) };
    });
  }, [rows, semestersAvailable]);

  const handleHistorySort = (field: 'semester' | 'courseName' | 'average' | 'totalStudents') => {
    if (historySortField === field) {
      setHistorySortOrder(historySortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setHistorySortField(field);
      setHistorySortOrder('desc');
    }
  };

  // Filter history data
  const filteredHistoryData = historyData.filter((row) => {
    const matchesSearch = row.courseName.toLowerCase().includes(historySearch.toLowerCase()) || 
                          row.courseCode.toLowerCase().includes(historySearch.toLowerCase());
    const matchesSemester = historySemesterFilter === 'Semua' || row.semester === historySemesterFilter;
    return matchesSearch && matchesSemester;
  });

  // Sort history data
  const sortedHistoryData = [...filteredHistoryData].sort((a, b) => {
    let compA = a[historySortField];
    let compB = b[historySortField];

    if (typeof compA === 'string' && typeof compB === 'string') {
      return historySortOrder === 'asc' ? compA.localeCompare(compB) : compB.localeCompare(compA);
    } else {
      return historySortOrder === 'asc' 
        ? (compA as number) - (compB as number) 
        : (compB as number) - (compA as number);
    }
  });

  // Handle rating submission from Student
  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse) return;

    if (pedagogikScore === 0 || profesionalScore === 0 || kepribadianScore === 0 || sosialScore === 0) {
      setSubmitError('Harap berikan penilaian bintang untuk seluruh komponen kinerja dosen.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitEdomEvaluation({
        courseCode: activeCourse.code,
        courseName: activeCourse.name,
        lecturerName: activeCourse.lecturer,
        pedagogik: pedagogikScore,
        profesional: profesionalScore,
        kepribadian: kepribadianScore,
        sosial: sosialScore,
        comment: commentInput,
      });
      setSuccessEvalMsg(true);
      setTimeout(async () => {
        setSuccessEvalMsg(false);
        setActiveCourse(null);
        setPedagogikScore(0);
        setProfesionalScore(0);
        setKepribadianScore(0);
        setSosialScore(0);
        setCommentInput('');
        await loadEdom();
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setSubmitError(typeof msg === 'string' ? msg : 'Gagal mengirim evaluasi. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper render for star selector
  const renderStarSelector = (
    currentScore: number, 
    setScore: (v: number) => void, 
    hoverVal: number, 
    setHoverVal: (v: number) => void,
    label: string,
    description: string
  ) => {
    return (
      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-xs font-black text-slate-800 dark:text-white block">{label}</span>
          <span className="text-[10px] text-slate-400 font-medium block">{description}</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="cursor-pointer transition-transform duration-100 hover:scale-110 focus:outline-none"
              onClick={() => setScore(star)}
              onMouseEnter={() => setHoverVal(star)}
              onMouseLeave={() => setHoverVal(0)}
            >
              <Star 
                className={`w-6 h-6 ${
                  star <= (hoverVal || currentScore) 
                    ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]' 
                    : 'text-slate-200 dark:text-slate-800'
                }`} 
              />
            </button>
          ))}
          <span className="text-xs font-black font-mono text-amber-500 min-w-[20px] text-center ml-1">
            {currentScore || ''}
          </span>
        </div>
      </div>
    );
  };

  // Filtered lecturers logic for leadership / admin
  const filteredLecturers = lecturerGroups.filter(lec => {
    const matchesSearch = lec.lecturerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lec.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lec.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'Semua' || lec.department === selectedDept;
    
    let matchesRating = true;
    if (ratingFilter === 'tinggi') matchesRating = lec.averageRating >= 4.5;
    else if (ratingFilter === 'cukup') matchesRating = lec.averageRating >= 3.5 && lec.averageRating < 4.5;
    else if (ratingFilter === 'kurang') matchesRating = lec.averageRating > 0 && lec.averageRating < 3.5;

    return matchesSearch && matchesDept && matchesRating;
  });

  // Calculate generic statistics
  const averageAllLecturers = lecturerGroups.length
    ? parseFloat((lecturerGroups.reduce((acc, curr) => acc + curr.averageRating, 0) / lecturerGroups.length).toFixed(2))
    : 0;
  const totalEvaluationsSum = rows.length;
  const averageParticipationRate = lecturerGroups.length
    ? parseFloat((lecturerGroups.reduce((acc, curr) => acc + curr.participationRate, 0) / lecturerGroups.length).toFixed(1))
    : 0;

  const renderLoading = () => (
    <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800">
      <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-spin" />
      <p className="text-xs text-slate-500">Memuat data EDOM...</p>
    </div>
  );

  const renderEmpty = (message: string) => (
    <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800">
      <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p className="text-xs text-slate-500">{message}</p>
    </div>
  );

  // ==========================================
  // VIEW: STUDENT ROLE
  // ==========================================
  const renderStudentView = () => {
    if (loading) return renderLoading();
    if (loadError) return renderEmpty(loadError);
    if (studentCourses.length === 0) return renderEmpty('Belum ada data matakuliah yang dapat dievaluasi. Data muncul setelah Anda mengambil KRS.');

    if (activeCourse) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <AnimatePresence>
            {successEvalMsg && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-50 flex flex-col items-center justify-center text-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                  <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 mx-auto" />
                </motion.div>
                <h5 className="text-base font-black text-slate-900 dark:text-white">Evaluasi Terkirim</h5>
                <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                  Terima kasih atas partisipasi Anda! Data evaluasi telah tersimpan ke basis data SIAKAD dan akan digunakan fakultas untuk meningkatkan kualitas pengajaran.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 block">Pengisian Evaluasi Kinerja (EDOM)</span>
              <h5 className="text-sm font-black text-slate-900 dark:text-white">{activeCourse.name}</h5>
              <p className="text-xs text-slate-400 font-medium">Dosen Pengampu: <span className="font-bold text-slate-700 dark:text-slate-300">{activeCourse.lecturer}</span></p>
            </div>
            <button 
              onClick={() => { setActiveCourse(null); setSubmitError(null); }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold cursor-pointer"
            >
              Kembali
            </button>
          </div>

          <form onSubmit={handleSubmitEvaluation} className="space-y-5">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400r block mb-1">Berikan Penilaian Anda</span>
              
              {renderStarSelector(
                pedagogikScore, 
                setPedagogikScore, 
                hoverPedagogik, 
                setHoverPedagogik, 
                "1. Kompetensi Pedagogik", 
                "Penguasaan materi, metode mengajar, kejelasan menjelaskan, dan pemanfaatan media LMS"
              )}

              {renderStarSelector(
                profesionalScore, 
                setProfesionalScore, 
                hoverProfesional, 
                setHoverProfesional, 
                "2. Kompetensi Profesional", 
                "Ketepatan waktu mengajar, kesesuaian silabus, objektivitas dalam penilaian tugas & ujian"
              )}

              {renderStarSelector(
                kepribadianScore, 
                setKepribadianScore, 
                hoverKepribadian, 
                setHoverKepribadian, 
                "3. Kompetensi Kepribadian", 
                "Kewibawaan, kedisiplinan diri, memberikan teladan positif, kesopanan, dan bersikap adil"
              )}

              {renderStarSelector(
                sosialScore, 
                setSosialScore, 
                hoverSosial, 
                setHoverSosial, 
                "4. Kompetensi Sosial", 
                "Kemudahan berkomunikasi, keramahan, merespon konsultasi akademik, membuka ruang diskusi"
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400r block">Komentar / Saran Konstruktif</label>
              <textarea
                rows={3}
                placeholder="Tulis kritik, apresiasi, atau saran Anda demi perbaikan metode mengajar dosen di semester depan..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-4 py-3 text-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
              />
            </div>

            {submitError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/15"
            >
              {submitting ? <><Clock className="w-4 h-4 animate-spin" /> Mengirim...</> : <><Send className="w-4 h-4" /> Kirim Evaluasi</>}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-10">
            <Award className="w-36 h-36" />
          </div>
          <div className="space-y-2 relative z-10 max-w-xl">
            <span className="text-[10px] font-black bg-blue-500 text-white px-2.5 py-1 rounded-mdr">Periode Aktif</span>
            <h4 className="text-lg font-black">Evaluasi Kinerja Dosen Oleh Mahasiswa (EDOM)</h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              Suara Anda sangat berharga! Berikan penilaian jujur dan saran konstruktif terhadap para dosen pengampu Anda pada semester berjalan.
            </p>
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-100 pt-2">
              <Calendar className="w-4 h-4" />
              <span>Periode: Semester Genap 2025/2026</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-sm font-black text-slate-950 dark:text-white">Daftar Mata Kuliah Semester Ini</h5>
              <p className="text-xs text-slate-400">Silakan isi evaluasi untuk seluruh mata kuliah yang Anda ambil.</p>
            </div>
            <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-xl">
              Progres: {studentCourses.filter(c => c.evaluated).length} / {studentCourses.length} Selesai
            </span>
          </div>

          <div className="space-y-3">
            {studentCourses.map((sc) => (
              <div 
                key={sc.code} 
                className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                      {sc.code}
                    </span>
                    <h6 className="text-xs font-black text-slate-900 dark:text-white">{sc.name}</h6>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <span>Dosen: {sc.lecturer}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  {sc.evaluated ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl">
                      <CheckCircle className="w-4 h-4" />
                      <span>Selesai Dievaluasi</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-[10px] text-amber-600 font-extrabold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Belum Diisi
                      </span>
                      <button
                        onClick={() => { setActiveCourse(sc); setSubmitError(null); }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-xl cursor-pointer whitespace-nowrap shadow-sm shadow-blue-500/15"
                      >
                        Isi Evaluasi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: LECTURER ROLE
  // ==========================================
  const renderLecturerView = () => {
    if (loading) return renderLoading();
    if (loadError) return renderEmpty(loadError);

    // Radar chart formatted data
    const radarData = [
      { subject: 'Pedagogik', A: myRatingData.kpis.pedagogik * 20, fullMark: 100 },
      { subject: 'Profesional', A: myRatingData.kpis.profesional * 20, fullMark: 100 },
      { subject: 'Kepribadian', A: myRatingData.kpis.kepribadian * 20, fullMark: 100 },
      { subject: 'Sosial', A: myRatingData.kpis.sosial * 20, fullMark: 100 }
    ];

    if (rows.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
            <button className="px-4 py-2.5 text-xs font-black tracking-wider uppercase border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 cursor-pointer flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Ringkasan Performa
            </button>
          </div>
          {renderEmpty('Belum ada data evaluasi EDOM untuk Anda pada semester ini. Hasil akan tampil setelah mahasiswa mengisi kuesioner.')}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Tab Switcher for Lecturer View */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
          <button
            onClick={() => setLecturerSubTab('ringkasan')}
            className={`px-4 py-2.5 text-xs font-black tracking-wider uppercase border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              lecturerSubTab === 'ringkasan'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Ringkasan Performa
          </button>
          <button
            onClick={() => setLecturerSubTab('riwayat-tabel')}
            className={`px-4 py-2.5 text-xs font-black tracking-wider uppercase border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              lecturerSubTab === 'riwayat-tabel'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Riwayat &amp; Tren Kinerja (EDOM)
          </button>
        </div>

        {lecturerSubTab === 'ringkasan' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card Overal Score */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-blue-600 block">Evaluasi Kinerja Dosen</span>
                  <h5 className="text-sm font-black text-slate-800 dark:text-white">Rangkuman Kinerja Anda</h5>
                  <p className="text-xs text-slate-400">Berdasarkan survei mahasiswa semester berjalan.</p>
                </div>

                <div className="my-6 text-center space-y-1">
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                    {myRatingData.averageRating.toFixed(2)}
                  </span>
                  <span className="text-slate-400 text-xs font-bold block">dari 5.00 Bintang</span>
                  <div className="flex justify-center gap-1 text-amber-400 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${star <= Math.round(myRatingData.averageRating) ? 'fill-current' : 'opacity-20'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Partisipan</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{myRatingData.totalEvaluations} Mhs</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Matakuliah Dinilai</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{myRatingData.courseCode.split(', ').length} MK</span>
                  </div>
                </div>
              </div>

              {/* KPI Breakdown Radar Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <div className="space-y-1 mb-4">
                  <h5 className="text-sm font-black text-slate-800 dark:text-white">Analisis Pilar Kompetensi</h5>
                  <p className="text-xs text-slate-400">Skor performa pada 4 kategori utama (skala 100).</p>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#33415515" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Skor Anda" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trend Line Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <div className="space-y-1 mb-4">
                  <h5 className="text-sm font-black text-slate-800 dark:text-white">Tren Kepuasan Kuliah</h5>
                  <p className="text-xs text-slate-400">Nilai indeks evaluasi per semester yang tersedia.</p>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData.length ? trendData : [{ semester: 'Belum ada', rating: 0 }]}>
                      <XAxis dataKey="semester" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 5]} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                      <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Breakdown detail and anonymous feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detail Scores progress bars */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 lg:col-span-1">
                <h5 className="text-xs font-black text-slate-800 dark:text-whiter">Komparasi Pilar Kompetensi</h5>
                
                <div className="space-y-3.5">
                  {[
                    { name: 'Pedagogik (Metodologi)', score: myRatingData.kpis.pedagogik, color: 'bg-blue-500' },
                    { name: 'Profesional (Integritas)', score: myRatingData.kpis.profesional, color: 'bg-emerald-500' },
                    { name: 'Kepribadian (Atitut)', score: myRatingData.kpis.kepribadian, color: 'bg-amber-500' },
                    { name: 'Sosial (Aksesibilitas)', score: myRatingData.kpis.sosial, color: 'bg-indigo-500' }
                  ].map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>{item.name}</span>
                        <span className="font-mono">{item.score.toFixed(2)} / 5.00</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full`} 
                          style={{ width: `${(item.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed mt-2">
                  <span className="font-extrabold block mb-1">💡 Ringkasan:</span>
                  {myRatingData.kpis.pedagogik >= myRatingData.kpis.sosial
                    ? `Pilar terkuat Anda berada pada kompetensi Pedagogik (${myRatingData.kpis.pedagogik.toFixed(2)}). Pertahankan metode mengajar yang jelas dan terstruktur.`
                    : `Pilar terkuat Anda berada pada kompetensi Sosial (${myRatingData.kpis.sosial.toFixed(2)}). Terus buka ruang diskusi dan komunikasi dengan mahasiswa.`}
                </div>
              </div>

              {/* Student comments list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-black text-slate-950 dark:text-white">Umpan Balik Mahasiswa</h5>
                    <p className="text-xs text-slate-400">Komentar dari kuesioner EDOM yang telah diisi mahasiswa.</p>
                  </div>
                  <button 
                    onClick={() => alert('Laporan EDOM lengkap sedang disiapkan.')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Cetak PDF
                  </button>
                </div>

                {myRatingData.comments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Belum ada komentar kualitatif dari mahasiswa.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                    {myRatingData.comments.map((comment) => (
                      <div key={comment.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            comment.sentiment === 'positif' 
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' 
                              : comment.sentiment === 'konstruktif'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {comment.sentiment}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{comment.date}</span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
                          "{comment.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Summary Trend Banner */}
            <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-100 dark:border-blue-900/40 p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h5 className="text-sm font-black text-slate-800 dark:text-white">Analisis Tren Kepuasan Kuliah Dosen</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rekapitulasi penilaian EDOM dan komentar kualitatif Anda per mata kuliah.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                  Rata-rata: <span className="text-emerald-600 dark:text-emerald-400">{myRatingData.averageRating.toFixed(2)} / 5.00</span>
                </span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Cari Kode atau Nama Mata Kuliah..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400r whitespace-nowrap">Semester:</span>
                <select 
                  value={historySemesterFilter}
                  onChange={(e) => setHistorySemesterFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-blue-500"
                >
                  <option value="Semua">Semua Semester</option>
                  {semestersAvailable.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/60 dark:border-slate-800 select-none">
                      <th className="p-4 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200" onClick={() => handleHistorySort('semester')}>
                        <div className="flex items-center gap-1">
                          <span>Semester</span>
                          {historySortField === 'semester' && (
                            historySortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {historySortField !== 'semester' && <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200" onClick={() => handleHistorySort('courseName')}>
                        <div className="flex items-center gap-1">
                          <span>Mata Kuliah</span>
                          {historySortField === 'courseName' && (
                            historySortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {historySortField !== 'courseName' && <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200" onClick={() => handleHistorySort('average')}>
                        <div className="flex items-center gap-1">
                          <span>Rerata Rating</span>
                          {historySortField === 'average' && (
                            historySortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {historySortField !== 'average' && <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200 text-center" onClick={() => handleHistorySort('totalStudents')}>
                        <div className="flex items-center justify-center gap-1">
                          <span>Partisipan Mhs</span>
                          {historySortField === 'totalStudents' && (
                            historySortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {historySortField !== 'totalStudents' && <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                        </div>
                      </th>
                      <th className="p-4 text-right">Rincian Evaluasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {sortedHistoryData.map((row) => {
                      const isExpanded = expandedHistoryRow === row.id;
                      return (
                        <React.Fragment key={row.id}>
                          <tr 
                            className={`hover:bg-slate-50/60 dark:hover:bg-slate-950/20 transition-colors cursor-pointer ${
                              isExpanded ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                            }`}
                            onClick={() => setExpandedHistoryRow(isExpanded ? null : row.id)}
                          >
                            <td className="p-4">
                              <span className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-[10px] font-bold">
                                {row.semester}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="text-slate-900 dark:text-white font-extrabold">{row.courseName}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.courseCode}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-2.5 py-0.5 rounded-md">
                                  {row.average.toFixed(2)}
                                </span>
                                <div className="flex text-amber-400">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center text-slate-500 dark:text-slate-400 font-mono">
                              {row.totalStudents} Mhs
                            </td>
                            <td className="p-4 text-right">
                              <button
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-black cursor-pointer inline-flex items-center gap-1 transition-colors"
                              >
                                {isExpanded ? 'Tutup Detail' : 'Buka Detail'}
                                <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                            </td>
                          </tr>

                          {/* Expandable row content */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="p-5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-b border-slate-150 dark:border-slate-800">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                  {/* KPIs breakdown progress bars */}
                                  <div className="md:col-span-5 space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                                    <h6 className="text-[10px] font-black text-slate-400r mb-2">Nilai Kompetensi Detail</h6>
                                    
                                    {[
                                      { name: 'Pedagogik (Metodologi)', score: row.pedagogik, color: 'bg-blue-500' },
                                      { name: 'Profesional (Materi & Disiplin)', score: row.profesional, color: 'bg-emerald-500' },
                                      { name: 'Kepribadian (Atitut)', score: row.kepribadian, color: 'bg-amber-500' },
                                      { name: 'Sosial (Responsif & Komunikasi)', score: row.sosial, color: 'bg-indigo-500' }
                                    ].map((kpi) => (
                                      <div key={kpi.name} className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                          <span>{kpi.name}</span>
                                          <span className="font-mono">{kpi.score.toFixed(1)} / 5.0</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full ${kpi.color} rounded-full`} 
                                            style={{ width: `${(kpi.score / 5) * 100}%` }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Kualitatif Summary */}
                                  <div className="md:col-span-7 space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <h6 className="text-[10px] font-black text-slate-400r">Komentar & Ringkasan Kualitatif Mhs</h6>
                                      </div>
                                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 italic leading-relaxed">
                                        "{row.feedbackSummary}"
                                      </p>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                                      <span>Status Penilaian: <span className="text-emerald-500">Selesai &amp; Diarsipkan</span></span>
                                      <span>Semester: <span className="text-blue-500">{row.semester}</span></span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}

                    {sortedHistoryData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                          Tidak ditemukan data riwayat evaluasi yang cocok dengan pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // VIEW: ACADEMIC LEADERSHIP (KAPRODI & DEKAN)
  // ==========================================
  const renderLeadershipView = () => {
    if (loading) return renderLoading();
    if (loadError) return renderEmpty(loadError);

    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400r block">Rata-rata Rating Fakultas</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{lecturerGroups.length ? averageAllLecturers : '—'} <span className="text-xs font-bold text-slate-400">/ 5.0</span></span>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400r block">Total Kuesioner Terisi</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalEvaluationsSum} <span className="text-xs font-bold text-slate-400">Form</span></span>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400r block">Dosen Ternilai</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{lecturerGroups.length} <span className="text-xs font-bold text-slate-400">Dosen</span></span>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Table of Lecturer Performance ratings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h5 className="text-sm font-black text-slate-950 dark:text-white">Laporan Evaluasi Kinerja Dosen (EDOM)</h5>
              <p className="text-xs text-slate-400">Pantau dan verifikasi mutu pembelajaran program studi &amp; fakultas.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => alert('Laporan EDOM seluruh dosen sedang disiapkan.')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <Download className="w-3.5 h-3.5" /> Unduh XLS
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Cari Dosen atau Matkul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">Prodi:</span>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              >
                <option value="Semua">Semua Program Studi</option>
                <option value="Teknik Informatika">Teknik Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Teknik Elektro">Teknik Elektro</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">Kategori:</span>
              <select 
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              >
                <option value="Semua">Semua Nilai</option>
                <option value="tinggi">Sangat Baik (Rating &gt;= 4.5)</option>
                <option value="cukup">Cukup (Rating 3.5 - 4.4)</option>
                <option value="kurang">Kurang (Rating &lt; 3.5)</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          {lecturerGroups.length === 0 ? (
            renderEmpty('Belum ada data evaluasi EDOM. Hasil akan tampil setelah mahasiswa mengisi kuesioner.')
          ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4">Dosen &amp; Matkul</th>
                  <th className="p-4">Program Studi</th>
                  <th className="p-4">Rating EDOM</th>
                  <th className="p-4 text-center">Partisipasi Mhs</th>
                  <th className="p-4 text-right">Rekomendasi Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                {filteredLecturers.map((lec) => (
                  <tr key={lec.lecturerId} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4 space-y-1">
                      <div className="font-extrabold text-slate-900 dark:text-white">{lec.lecturerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{lec.courseCode} &bull; {lec.courseName}</div>
                    </td>
                    <td className="p-4 text-slate-500">{lec.department}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-md ${
                          lec.averageRating >= 4.5 
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' 
                            : lec.averageRating >= 3.5 
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' 
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        }`}>
                          {lec.averageRating.toFixed(2)}
                        </span>
                        <div className="flex text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono text-slate-500">
                      <div>{lec.totalEvaluations} Mhs</div>
                      <div className="text-[9px] text-slate-400">{lec.semester || '—'}</div>
                    </td>
                    <td className="p-4 text-right">
                      {lec.averageRating >= 4.5 ? (
                        <button 
                          onClick={() => alert('Aksi apresiasi dosen akan dihubungkan ke alur persetujuan Kaprodi/Dekan pada integrasi lanjutan.')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] cursor-pointer"
                        >
                          Kirim Apresiasi
                        </button>
                      ) : lec.averageRating > 0 && lec.averageRating < 3.8 ? (
                        <button 
                          onClick={() => alert('Penjadwalan konseling klinis mengajar akan dihubungkan ke alur Kaprodi pada integrasi lanjutan.')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] cursor-pointer"
                        >
                          Jadwalkan Konseling
                        </button>
                      ) : (
                        <button 
                          onClick={() => alert('Rekomendasi pengembangan pedagogik dosen akan dihubungkan ke modul pengembangan SDM pada integrasi lanjutan.')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] cursor-pointer"
                        >
                          Kirim Saran AI
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: ADMINISTRATOR ROLE (BAAK)
  // ==========================================
  const renderAdminView = () => {
    if (loading) return renderLoading();
    if (loadError) return renderEmpty(loadError);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* EDOM Period Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 lg:col-span-1">
            <h5 className="text-xs font-black text-slate-800 dark:text-whiter flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-blue-500" />
              Info Periode EDOM
            </h5>

            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-black text-slate-800 dark:text-white block">Periode Aktif</span>
                  <span className="text-[10px] text-slate-400 font-medium block">Semester Genap 2025/2026</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                  AKTIF
                </span>
              </div>

              <div className="space-y-1.5 border-t border-dashed border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>Total Evaluasi Masuk</span>
                  <span className="font-mono">{totalEvaluationsSum}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>Dosen Ternilai</span>
                  <span className="font-mono">{lecturerGroups.length}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed">
              Pengaturan pembukaan/penutupan periode dan pengingat massal akan tersedia pada integrasi lanjutan modul EDOM BAAK.
            </div>
          </div>

          {/* General leadership tables and report statistics for Admin */}
          <div className="lg:col-span-2">
            {renderLeadershipView()}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // GENERAL COMPONENT RENDER ROUTER
  // ==========================================
  return (
    <div className="bg-slate-50 dark:bg-slate-950/10 rounded-2xl space-y-6">
      {/* Dynamic Render based on User Role */}
      {user.role === 'student' && renderStudentView()}
      {user.role === 'lecturer' && renderLecturerView()}
      {user.role === 'kaprodi' && renderLeadershipView()}
      {user.role === 'dekan' && renderLeadershipView()}
      {user.role === 'baak' && renderAdminView()}
      {user.role === 'bauk' && renderLeadershipView()}
      {user.role === 'admin' && renderAdminView()}
    </div>
  );
}
