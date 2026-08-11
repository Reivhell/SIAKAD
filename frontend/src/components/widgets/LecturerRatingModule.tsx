import React, { useState } from 'react';
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
  ChevronUp
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

// ==========================================
// DATA STRUCTURES & INITIAL SIMULATED STATE
// ==========================================

interface LecturerRating {
  lecturerId: string;
  lecturerName: string;
  department: string;
  courseCode: string;
  courseName: string;
  averageRating: number;
  kpis: {
    pedagogik: number; // Kesiapan, kejelasan, materi
    profesional: number; // Ketepatan waktu, disiplin, objektivitas
    kepribadian: number; // Wibawa, keramahan, teladan
    sosial: number; // Komunikasi, bimbingan, aksesibilitas
  };
  totalEvaluations: number;
  participationRate: number; // %
  comments: Array<{
    id: string;
    date: string;
    text: string;
    sentiment: 'positif' | 'konstruktif' | 'netral';
    likes: number;
  }>;
}

const INITIAL_LECTURERS_DATA: LecturerRating[] = [
  {
    lecturerId: 'LEC001',
    lecturerName: 'Dr. Hendra Wijaya, M.T.',
    department: 'Teknik Informatika',
    courseCode: 'IF3110',
    courseName: 'Pengembangan Aplikasi Web',
    averageRating: 4.72,
    kpis: { pedagogik: 4.8, profesional: 4.6, kepribadian: 4.7, sosial: 4.8 },
    totalEvaluations: 42,
    participationRate: 88,
    comments: [
      { id: 'c1', date: 'Kemarin', text: 'Penjelasan materi tentang JWT dan Web Security sangat detail dan mudah dipahami. Dosen sangat komunikatif.', sentiment: 'positif', likes: 12 },
      { id: 'c2', date: '3 hari yang lalu', text: 'Tugas yang diberikan cukup menantang tapi sebanding dengan ilmu yang didapat. Sangat responsif saat dihubungi via WA.', sentiment: 'positif', likes: 8 },
      { id: 'c3', date: '1 minggu yang lalu', text: 'Mohon agar jadwal pengerjaan proyek akhir bisa diperpanjang sedikit agar pengerjaan bisa lebih maksimal.', sentiment: 'konstruktif', likes: 15 },
      { id: 'c4', date: '2 minggu yang lalu', text: 'Cara mengajar sudah sangat bagus. Pertahankan interaksi dua arah di dalam kelas.', sentiment: 'positif', likes: 4 }
    ]
  },
  {
    lecturerId: 'LEC002',
    lecturerName: 'Prof. Dr. Ir. Budi Rahardjo',
    department: 'Teknik Informatika',
    courseCode: 'IF3170',
    courseName: 'Kecerdasan Buatan',
    averageRating: 4.58,
    kpis: { pedagogik: 4.5, profesional: 4.4, kepribadian: 4.7, sosial: 4.7 },
    totalEvaluations: 38,
    participationRate: 80,
    comments: [
      { id: 'c5', date: 'Hari Ini', text: 'Kuliah AI yang sangat membuka wawasan. Banyak contoh penerapan di dunia nyata dan industri global.', sentiment: 'positif', likes: 18 },
      { id: 'c6', date: '5 hari yang lalu', text: 'Kadang materi matematika di Neural Network terlalu cepat dijelaskan, mohon diberikan video materi tambahan.', sentiment: 'konstruktif', likes: 10 },
      { id: 'c7', date: '1 minggu yang lalu', text: 'Dosen sangat ramah dan menghargai argumen mahasiswa saat sesi diskusi.', sentiment: 'positif', likes: 7 }
    ]
  },
  {
    lecturerId: 'LEC003',
    lecturerName: 'Syifa Nuraini, M.Cs.',
    department: 'Teknik Informatika',
    courseCode: 'IF3150',
    courseName: 'Manajemen Proyek Perangkat Lunak',
    averageRating: 4.25,
    kpis: { pedagogik: 4.1, profesional: 4.5, kepribadian: 4.2, sosial: 4.2 },
    totalEvaluations: 35,
    participationRate: 74,
    comments: [
      { id: 'c8', date: '4 hari yang lalu', text: 'Sangat disiplin soal waktu perkuliahan. Penilaian sangat transparan menggunakan rubrik terperinci.', sentiment: 'positif', likes: 9 },
      { id: 'c9', date: '1 minggu yang lalu', text: 'Pemberian feedback tugas mohon dipercepat agar kami bisa memperbaiki kesalahan di sisa iterasi berikutnya.', sentiment: 'konstruktif', likes: 14 },
      { id: 'c10', date: '3 minggu yang lalu', text: 'Penyampaian slide presentasi terlalu padat teks, mungkin bisa dibuat lebih ringkas.', sentiment: 'konstruktif', likes: 5 }
    ]
  },
  {
    lecturerId: 'LEC004',
    lecturerName: 'Dr. Ahmad Fauzi, M.Si.',
    department: 'Sistem Informasi',
    courseCode: 'SI2120',
    courseName: 'Basis Data Terdistribusi',
    averageRating: 3.85,
    kpis: { pedagogik: 3.7, profesional: 4.0, kepribadian: 3.8, sosial: 3.9 },
    totalEvaluations: 30,
    participationRate: 68,
    comments: [
      { id: 'c11', date: '2 hari yang lalu', text: 'Materi lumayan berat. Diharapkan ada sesi praktikum tambahan agar lebih paham query NoSQL.', sentiment: 'konstruktif', likes: 11 },
      { id: 'c12', date: '1 minggu yang lalu', text: 'Ketepatan waktu mengajar sangat baik, namun respon konsultasi di luar jam kuliah lambat.', sentiment: 'netral', likes: 6 },
      { id: 'c13', date: '2 minggu yang lalu', text: 'Kurang banyak interaksi dua arah di kelas doring, rasanya seperti mendengarkan podcast.', sentiment: 'konstruktif', likes: 19 }
    ]
  },
  {
    lecturerId: 'LEC005',
    lecturerName: 'Ir. Maria Ulfa, M.Eng.',
    department: 'Teknik Elektro',
    courseCode: 'EL4102',
    courseName: 'Mikrokontroler & IoT',
    averageRating: 4.65,
    kpis: { pedagogik: 4.6, profesional: 4.7, kepribadian: 4.6, sosial: 4.7 },
    totalEvaluations: 28,
    participationRate: 85,
    comments: [
      { id: 'c14', date: '3 hari yang lalu', text: 'Penyediaan kit praktikum IoT sangat lengkap. Dosen sangat membantu mendampingi saat troubleshoot sirkuit.', sentiment: 'positif', likes: 16 },
      { id: 'c15', date: '1 minggu yang lalu', text: 'Beliau tidak pelit nilai dan sangat mengapresiasi inovasi rancangan alat mahasiswa.', sentiment: 'positif', likes: 11 }
    ]
  }
];

// List of courses that the current student can evaluate
const INITIAL_STUDENT_COURSES = [
  { id: 'sc1', code: 'IF3110', name: 'Pengembangan Aplikasi Web', lecturerId: 'LEC001', lecturerName: 'Dr. Hendra Wijaya, M.T.', status: 'Belum Diisi' },
  { id: 'sc2', code: 'IF3170', name: 'Kecerdasan Buatan', lecturerId: 'LEC002', lecturerName: 'Prof. Dr. Ir. Budi Rahardjo', status: 'Selesai' },
  { id: 'sc3', code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', lecturerId: 'LEC003', lecturerName: 'Syifa Nuraini, M.Cs.', status: 'Belum Diisi' }
];

export function LecturerRatingModule({ user }: { user: User }) {
  const [lecturers, setLecturers] = useState<LecturerRating[]>(INITIAL_LECTURERS_DATA);
  const [studentCourses, setStudentCourses] = useState(INITIAL_STUDENT_COURSES);
  
  // Student Evaluation Form State
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [pedagogikScore, setPedagogikScore] = useState(0);
  const [profesionalScore, setProfesionalScore] = useState(0);
  const [kepribadianScore, setKepribadianScore] = useState(0);
  const [sosialScore, setSosialScore] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [successEvalMsg, setSuccessEvalMsg] = useState(false);

  // Admin and Leadership filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('Semua');
  const [ratingFilter, setRatingFilter] = useState('Semua');

  // Simulation Period Settings
  const [isEdomActive, setIsEdomActive] = useState(true);
  const [edomDeadline, setEdomDeadline] = useState('15 Juli 2026');

  // Interactive feedback hover state
  const [hoverPedagogik, setHoverPedagogik] = useState(0);
  const [hoverProfesional, setHoverProfesional] = useState(0);
  const [hoverKepribadian, setHoverKepribadian] = useState(0);
  const [hoverSosial, setHoverSosial] = useState(0);

  // General tab for Lecturer Rating Module
  const [currentTab, setCurrentTab] = useState<'rating-list' | 'settings' | 'statistics'>('rating-list');

  // Duplicate validation tracking (lecturerId + '-' + semester) to prevent duplicate submissions
  const [submittedEvaluations, setSubmittedEvaluations] = useState<string[]>(['LEC002-2025-Genap']);

  // History View Table State for Lecturer Role
  const [historySearch, setHistorySearch] = useState('');
  const [historySemesterFilter, setHistorySemesterFilter] = useState('Semua');
  const [historySortField, setHistorySortField] = useState<'semester' | 'courseName' | 'average' | 'totalStudents'>('semester');
  const [historySortOrder, setHistorySortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedHistoryRow, setExpandedHistoryRow] = useState<string | null>(null);
  
  // Lecturer subtab: 'ringkasan' or 'riwayat-tabel'
  const [lecturerSubTab, setLecturerSubTab] = useState<'ringkasan' | 'riwayat-tabel'>('ringkasan');

  // Historical data list
  const historicalData = [
    {
      id: 'h1',
      semester: '2025-Ganjil',
      courseCode: 'IF3110',
      courseName: 'Pengembangan Aplikasi Web',
      pedagogik: 4.8,
      profesional: 4.5,
      kepribadian: 4.6,
      sosial: 4.7,
      average: 4.65,
      totalStudents: 40,
      feedbackSummary: 'Sangat menguasai materi, interaksi kelas doring maupun luring sangat baik. Mahasiswa merasa terbantu dengan feedback cepat pada tugas proyek.'
    },
    {
      id: 'h2',
      semester: '2025-Ganjil',
      courseCode: 'IF3211',
      courseName: 'Pemrograman Berorientasi Objek',
      pedagogik: 4.6,
      profesional: 4.7,
      kepribadian: 4.5,
      sosial: 4.4,
      average: 4.55,
      totalStudents: 45,
      feedbackSummary: 'Pemberian tugas dinilai sangat konstruktif. Diskusi kelas hidup, namun penyampaian materi teoritis kadangkala dirasa agak terlalu padat.'
    },
    {
      id: 'h3',
      semester: '2024-Genap',
      courseCode: 'IF2240',
      courseName: 'Rekayasa Perangkat Lunak',
      pedagogik: 4.5,
      profesional: 4.4,
      kepribadian: 4.6,
      sosial: 4.6,
      average: 4.52,
      totalStudents: 38,
      feedbackSummary: 'Dosen tepat waktu dalam pengajaran dan transparan dalam penilaian. Bimbingan proyek kelompok berjalan dengan sangat sistematis.'
    },
    {
      id: 'h4',
      semester: '2024-Ganjil',
      courseCode: 'IF1210',
      courseName: 'Dasar Pemrograman',
      pedagogik: 4.4,
      profesional: 4.5,
      kepribadian: 4.4,
      sosial: 4.5,
      average: 4.45,
      totalStudents: 50,
      feedbackSummary: 'Sangat ramah terhadap mahasiswa baru. Penjelasan konsep algoritma dasar sangat runut dan mudah diikuti bagi pemula.'
    },
    {
      id: 'h5',
      semester: '2023-Genap',
      courseCode: 'IF3110',
      courseName: 'Pengembangan Aplikasi Web',
      pedagogik: 4.3,
      profesional: 4.2,
      kepribadian: 4.5,
      sosial: 4.4,
      average: 4.35,
      totalStudents: 35,
      feedbackSummary: 'Metode pengajaran menarik. Beberapa mahasiswa menyarankan pembaruan framework yang diajarkan agar lebih relevan dengan tren industri.'
    }
  ];

  const handleHistorySort = (field: 'semester' | 'courseName' | 'average' | 'totalStudents') => {
    if (historySortField === field) {
      setHistorySortOrder(historySortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setHistorySortField(field);
      setHistorySortOrder('desc');
    }
  };

  // Filter history data
  const filteredHistoryData = historicalData.filter((row) => {
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
  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourseId) return;

    const currentCourse = studentCourses.find(c => c.id === activeCourseId);
    if (!currentCourse) return;

    if (pedagogikScore === 0 || profesionalScore === 0 || kepribadianScore === 0 || sosialScore === 0) {
      alert('Harap berikan penilaian bintang untuk seluruh komponen kinerja dosen.');
      return;
    }

    const targetLecturerId = currentCourse.lecturerId;
    const currentSemester = '2025-Genap'; // active semester
    const feedbackKey = `${targetLecturerId}-${currentSemester}`;

    if (submittedEvaluations.includes(feedbackKey)) {
      alert(`Gagal: Anda sudah mengisi evaluasi (EDOM) untuk dosen ${currentCourse.lecturerName} pada semester ${currentSemester}.`);
      return;
    }

    const computedAverage = (pedagogikScore + profesionalScore + kepribadianScore + sosialScore) / 4;

    // Update in-memory lecturers database
    setLecturers(prevLecturers => {
      return prevLecturers.map(lec => {
        if (lec.lecturerId === targetLecturerId) {
          // Calculate new moving average rating
          const newTotal = lec.totalEvaluations + 1;
          const newAvgRating = parseFloat(
            ((lec.averageRating * lec.totalEvaluations + computedAverage) / newTotal).toFixed(2)
          );

          const newKpis = {
            pedagogik: parseFloat(((lec.kpis.pedagogik * lec.totalEvaluations + pedagogikScore) / newTotal).toFixed(2)),
            profesional: parseFloat(((lec.kpis.profesional * lec.totalEvaluations + profesionalScore) / newTotal).toFixed(2)),
            kepribadian: parseFloat(((lec.kpis.kepribadian * lec.totalEvaluations + kepribadianScore) / newTotal).toFixed(2)),
            sosial: parseFloat(((lec.kpis.sosial * lec.totalEvaluations + sosialScore) / newTotal).toFixed(2)),
          };

          const sentiment: 'positif' | 'konstruktif' | 'netral' = 
            computedAverage >= 4.0 ? 'positif' : computedAverage >= 3.0 ? 'netral' : 'konstruktif';

          const newComments = commentInput.trim() 
            ? [
                {
                  id: 'c_new_' + Date.now(),
                  date: 'Baru Saja',
                  text: commentInput.trim(),
                  sentiment,
                  likes: 0
                },
                ...lec.comments
              ]
            : lec.comments;

          return {
            ...lec,
            averageRating: newAvgRating,
            kpis: newKpis,
            totalEvaluations: newTotal,
            comments: newComments
          };
        }
        return lec;
      });
    });

    // Update student course status
    setStudentCourses(prevCourses => {
      return prevCourses.map(c => {
        if (c.id === activeCourseId) {
          return { ...c, status: 'Selesai' };
        }
        return c;
      });
    });

    // Show satisfying checkmark animation, reset state
    setSubmittedEvaluations(prev => [...prev, feedbackKey]);
    setSuccessEvalMsg(true);
    setTimeout(() => {
      setSuccessEvalMsg(false);
      setActiveCourseId(null);
      setPedagogikScore(0);
      setProfesionalScore(0);
      setKepribadianScore(0);
      setSosialScore(0);
      setCommentInput('');
    }, 2500);
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
  const filteredLecturers = lecturers.filter(lec => {
    const matchesSearch = lec.lecturerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lec.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lec.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'Semua' || lec.department === selectedDept;
    
    let matchesRating = true;
    if (ratingFilter === 'tinggi') matchesRating = lec.averageRating >= 4.5;
    else if (ratingFilter === 'cukup') matchesRating = lec.averageRating >= 3.5 && lec.averageRating < 4.5;
    else if (ratingFilter === 'kurang') matchesRating = lec.averageRating < 3.5;

    return matchesSearch && matchesDept && matchesRating;
  });

  // Calculate generic statistics
  const averageAllLecturers = parseFloat((lecturers.reduce((acc, curr) => acc + curr.averageRating, 0) / lecturers.length).toFixed(2));
  const totalEvaluationsSum = lecturers.reduce((acc, curr) => acc + curr.totalEvaluations, 0);
  const averageParticipationRate = parseFloat((lecturers.reduce((acc, curr) => acc + curr.participationRate, 0) / lecturers.length).toFixed(1));

  // ==========================================
  // VIEW: STUDENT ROLE
  // ==========================================
  const renderStudentView = () => {
    if (!isEdomActive) {
      return (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-3xl p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-sm font-black text-amber-800 dark:text-amber-400">Pengisian EDOM Ditutup</h4>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
              Periode Evaluasi Dosen oleh Mahasiswa (EDOM) Semester Genap 2025/2026 saat ini sedang dinonaktifkan atau telah melewati batas akhir pengisian. Hubungi BAAK jika ada pertanyaan.
            </p>
          </div>
        </div>
      );
    }

    if (activeCourseId) {
      const selectedCourse = studentCourses.find(c => c.id === activeCourseId);
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
                <h5 className="text-base font-black text-slate-900 dark:text-white">Evaluasi Terkirim Secara Anonim</h5>
                <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                  Terima kasih atas partisipasi Anda! Data evaluasi telah disatukan secara anonim ke basis data fakultas untuk membantu meningkatkan kualitas pengajaran dosen.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 block">Pengisian Evaluasi Kinerja (EDOM)</span>
              <h5 className="text-sm font-black text-slate-900 dark:text-white">{selectedCourse?.name}</h5>
              <p className="text-xs text-slate-400 font-medium">Dosen Pengampu: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedCourse?.lecturerName}</span></p>
            </div>
            <button 
              onClick={() => setActiveCourseId(null)}
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
              <label className="text-[10px] font-black text-slate-400r block">Komentar / Saran Konstruktif (Anonim)</label>
              <textarea
                rows={3}
                placeholder="Tulis kritik, apresiasi, atau saran Anda demi perbaikan metode mengajar dosen di semester depan. Identitas Anda dijamin 100% rahasia..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-4 py-3 text-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/15"
            >
              <Send className="w-4 h-4" /> Kirim Evaluasi Anonim Sekarang
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
              Suara Anda sangat berharga! Berikan penilaian jujur dan saran konstruktif terhadap para dosen pengampu Anda. Evaluasi ini bersifat **100% anonim** dan dilindungi sistem enkripsi.
            </p>
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-100 pt-2">
              <Clock className="w-4 h-4" />
              <span>Batas Akhir Pengisian: {edomDeadline}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-sm font-black text-slate-950 dark:text-white">Daftar Mata Kuliah Semester Ini</h5>
              <p className="text-xs text-slate-400">Silakan isi evaluasi untuk seluruh mata kuliah aktif Anda.</p>
            </div>
            <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-xl">
              Progres: {studentCourses.filter(c => c.status === 'Selesai').length} / {studentCourses.length} Selesai
            </span>
          </div>

          <div className="space-y-3">
            {studentCourses.map((sc) => (
              <div 
                key={sc.id} 
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
                    <span>Dosen: {sc.lecturerName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  {sc.status === 'Selesai' ? (
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
                        onClick={() => {
                          const currentSemester = '2025-Genap';
                          const feedbackKey = `${sc.lecturerId}-${currentSemester}`;
                          if (submittedEvaluations.includes(feedbackKey)) {
                            alert(`Gagal: Anda sudah mengisi evaluasi (EDOM) untuk dosen ${sc.lecturerName} pada semester ${currentSemester}.`);
                            return;
                          }
                          setActiveCourseId(sc.id);
                        }}
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
    // We assume the logged in lecturer is LEC001 (Dr. Hendra Wijaya) for simulator purposes
    const myRatingData = lecturers.find(l => l.lecturerId === 'LEC001') || lecturers[0];

    // Radar chart formatted data
    const radarData = [
      { subject: 'Pedagogik', A: myRatingData.kpis.pedagogik * 20, fullMark: 100 },
      { subject: 'Profesional', A: myRatingData.kpis.profesional * 20, fullMark: 100 },
      { subject: 'Kepribadian', A: myRatingData.kpis.kepribadian * 20, fullMark: 100 },
      { subject: 'Sosial', A: myRatingData.kpis.sosial * 20, fullMark: 100 }
    ];

    // Historical trend of EDOM average
    const trendData = [
      { semester: '2024-Ganjil', rating: 4.45 },
      { semester: '2024-Genap', rating: 4.52 },
      { semester: '2025-Ganjil', rating: 4.60 },
      { semester: '2025-Genap', rating: myRatingData.averageRating }
    ];

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
                  <p className="text-xs text-slate-400">Diupdate real-time berdasarkan survei mahasiswa semester berjalan.</p>
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
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Persentase Isi</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{myRatingData.participationRate}%</span>
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
                  <p className="text-xs text-slate-400">Nilai indeks evaluasi dari 4 semester terakhir.</p>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <XAxis dataKey="semester" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} domain={[4.0, 5.0]} tickLine={false} />
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
                  <span className="font-extrabold block mb-1">💡 Tips AI Insights:</span>
                  Kinerja Anda berada di kategori **Sangat Baik**. Pilar terkuat Anda berada pada kompetensi **Pedagogik**. Anda disarankan mempertahankan kemudahan komunikasi sosial di luar jam perkuliahan.
                </div>
              </div>

              {/* Student comments list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-black text-slate-950 dark:text-white">Umpan Balik Mahasiswa</h5>
                    <p className="text-xs text-slate-400">Saran &amp; komentar tanpa nama mahasiswa (anonim demi privasi).</p>
                  </div>
                  <button 
                    onClick={() => alert('Laporan EDOM Lengkap berhasil diunduh dalam format PDF.')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Cetak PDF
                  </button>
                </div>

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

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] text-slate-400">Disukai oleh mahasiswa lain</span>
                        <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          <ThumbsUp className="w-3 h-3" /> {comment.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  Berikut adalah arsip rekapitulasi penilaian EDOM dan komentar kualitatif Anda dari beberapa semester terakhir.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                  Kecenderungan: <span className="text-emerald-600 dark:text-emerald-400">Meningkat (+3.4%)</span>
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
                  <option value="2025-Ganjil">2025-Ganjil</option>
                  <option value="2024-Genap">2024-Genap</option>
                  <option value="2024-Ganjil">2024-Ganjil</option>
                  <option value="2023-Genap">2023-Genap</option>
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

                                  {/* Kualitatif Summary from AI & Students */}
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
                                      <span>Indeks Evaluasi: <span className="text-blue-500">Sangat Memuaskan</span></span>
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
    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400r block">Rata-rata Rating Fakultas</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{averageAllLecturers} <span className="text-xs font-bold text-slate-400">/ 5.0</span></span>
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
              <span className="text-[10px] font-black text-slate-400r block">Partisipasi Mahasiswa</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{averageParticipationRate}%</span>
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
                onClick={() => alert('Laporan Excel EDOM seluruh dosen berhasil diunduh.')}
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
                      <div className="text-[9px] text-slate-400">{lec.participationRate}% Terisi</div>
                    </td>
                    <td className="p-4 text-right">
                      {lec.averageRating >= 4.5 ? (
                        <button 
                          onClick={() => alert(`Surat apresiasi resmi Kaprodi & Dekan telah diterbitkan dan dikirim ke ${lec.lecturerName}.`)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] cursor-pointer"
                        >
                          Kirim Apresiasi
                        </button>
                      ) : lec.averageRating < 3.8 ? (
                        <button 
                          onClick={() => alert(`Jadwal evaluasi klinis mengajar dan bimbingan dosen terbit bersama Kaprodi untuk ${lec.lecturerName}.`)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] cursor-pointer"
                        >
                          Jadwalkan Konseling
                        </button>
                      ) : (
                        <button 
                          onClick={() => alert(`Mengirimkan tips pengembangan pedagogik pembelajaran doring secara otomatis ke ${lec.lecturerName}.`)}
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
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: ADMINISTRATOR ROLE (BAAK)
  // ==========================================
  const renderAdminView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* EDOM Configuration Period */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 lg:col-span-1">
            <h5 className="text-xs font-black text-slate-800 dark:text-whiter flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-blue-500" />
              Kontrol Periode EDOM
            </h5>

            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-black text-slate-800 dark:text-white block">Status Pengisian EDOM</span>
                  <span className="text-[10px] text-slate-400 font-medium block">Mengizinkan pengisian form kuesioner mahasiswa</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEdomActive(!isEdomActive)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    isEdomActive ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    isEdomActive ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block">Tenggat Waktu Pengisian</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={edomDeadline}
                    onChange={(e) => setEdomDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
                  />
                  <button 
                    onClick={() => alert(`Tenggat waktu pengisian EDOM disematkan ke tanggal: ${edomDeadline}. Notifikasi auto-blast ke sisa mahasiswa diaktifkan.`)}
                    className="px-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 block">Status Pengiriman Kuesioner</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => alert('Broadcast WhatsApp Pengingat EDOM dikirim ke 142 mahasiswa yang belum mengisi.')}
                  className="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-[9px] font-black rounded-xl cursor-pointer"
                >
                  Remind via WhatsApp
                </button>
                <button 
                  onClick={() => alert('Push Notifikasi Dashboard EDOM dikirim ke seluruh sistem mahasiswa aktif.')}
                  className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-[9px] font-black rounded-xl cursor-pointer"
                >
                  Push Notif Portal
                </button>
              </div>
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
      {user.role === 'admin' && renderAdminView()}
    </div>
  );
}
