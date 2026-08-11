import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Upload, Shield, CreditCard, Sparkles, Check, 
  X, AlertTriangle, Play, HelpCircle, User, Award, ShieldCheck, Download, 
  Camera, RefreshCw, ChevronRight, Eye, AlertCircle
} from 'lucide-react';
import { User as UserType } from '../../types';
import { getRoleDashboard, ApplicantDashboardPayload } from '../../api/academic.api';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../utils/i18n';

interface ApplicantDashboardViewProps {
  user: UserType;
  onUserChange?: (newUser: UserType) => void;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

export function ApplicantDashboardView({ user, onUserChange, activeTab: propActiveTab, onChangeTab: propOnChangeTab }: ApplicantDashboardViewProps) {
  const { t } = useLanguage();
  const [localActiveTab, setLocalActiveTab] = useState('dashboard');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propOnChangeTab || setLocalActiveTab;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State for Form PMB (diisi dari backend RoleDashboard)
  const [nik, setNik] = useState('');
  const [nisn, setNisn] = useState('');
  const [school, setSchool] = useState('');
  const [firstProdi, setFirstProdi] = useState('');
  const [secondProdi, setSecondProdi] = useState('');
  const [formSaved, setFormSaved] = useState(true);

  // State for OCR Documents Upload
  const [documents, setDocuments] = useState<ApplicantDashboardPayload['pmb']['documents']>([]);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // State for CBT Computer Based Test
  const [cbtStatus, setCbtStatus] = useState<'NotStarted' | 'Examining' | 'Finished'>('NotStarted');
  const [cbtScore, setCbtScore] = useState<number | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [proctorLogs, setProctorLogs] = useState<string[]>([]);
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [timerLeft, setTimerLeft] = useState(300); // 5 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [testQuestions, setTestQuestions] = useState<ApplicantDashboardPayload['testQuestions']>([]);

  useEffect(() => {
    let cancelled = false;
    getRoleDashboard<ApplicantDashboardPayload>('applicant')
      .then((data) => {
        if (cancelled) return;
        if (data.pmb) {
          setNik(data.pmb.nik ?? '');
          setNisn(data.pmb.nisn ?? '');
          setSchool(data.pmb.school ?? '');
          setFirstProdi(data.pmb.firstProdi ?? '');
          setSecondProdi(data.pmb.secondProdi ?? '');
          setDocuments(data.pmb.documents ?? []);
        }
        setTestQuestions(data.testQuestions ?? []);
      })
      .catch(() => {
        // biarkan state kosong; UI menampilkan kondisi "Belum ada data"
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Simulated proctoring camera
  useEffect(() => {
    let interval: any;
    if (cbtStatus === 'Examining' && cameraActive) {
      interval = setInterval(() => {
        const events = [
          'PROCTORING: Wajah terdeteksi cocok dengan KTP pendaftar (Match Score: 98%)',
          'PROCTORING: Pandangan mata terfokus pada layar ujian.',
          'PROCTORING: Kondisi pencahayaan dan lingkungan kondusif.',
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setProctorLogs(prev => [randomEvent, ...prev.slice(0, 5)]);

        // Random simulated warning
        if (Math.random() < 0.15) {
          setCheatWarnings(prev => {
            const nw = prev + 1;
            setProctorLogs(p => [`[WARNING] DETEKSI GERAKAN MENCURIGAKAN (${nw}/3 warnings)`, ...p]);
            triggerToast('Deteksi Gerakan Mencurigakan: Tetap fokus pada layar!');
            return nw;
          });
        }
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [cbtStatus, cameraActive]);

  useEffect(() => {
    let timer: any;
    if (cbtStatus === 'Examining' && timerLeft > 0) {
      timer = setInterval(() => {
        setTimerLeft(prev => prev - 1);
      }, 1000);
    } else if (timerLeft === 0 && cbtStatus === 'Examining') {
      handleFinishExam();
    }
    return () => clearInterval(timer);
  }, [cbtStatus, timerLeft]);

  const handleStartExam = () => {
    setCbtStatus('Examining');
    setCameraActive(true);
    setCheatWarnings(0);
    setTimerLeft(300);
    setProctorLogs(['Webcam proctoring initialized.', 'Lockdown browser active. (Alt+Tab disabled)']);
    triggerToast('Ujian CBT online dimulai! Kamera webcam aktif untuk proctoring.');
  };

  const handleFinishExam = () => {
    setCbtStatus('Finished');
    setCameraActive(false);
    // calculate score
    let correctCount = 0;
    testQuestions.forEach((q, i) => {
      if (answers[i] === q.correct) correctCount++;
    });
    const finalScore = Math.round((correctCount / testQuestions.length) * 100);
    setCbtScore(finalScore);
    triggerToast(`Ujian CBT Selesai! Skor Anda: ${finalScore}/100.`);
  };

  const handleSelectAnswer = (qIndex: number, option: string) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  // State for NIM activation
  const [isNimActivated, setIsNimActivated] = useState(false);
  const [generatedNim, setGeneratedNim] = useState('');
  const [isPayingUkt, setIsPayingUkt] = useState(false);

  const handlePayUktAndGenerateNim = () => {
    setIsPayingUkt(true);
    setTimeout(() => {
      setIsPayingUkt(false);
      setIsNimActivated(true);
      const nimCode = '260100234';
      setGeneratedNim(nimCode);
      if (onUserChange) {
        onUserChange({
          ...user,
          name: user.name || 'Calon Mahasiswa',
          role: 'student',
          department: firstProdi || user.department || 'Teknik Informatika'
        });
      }
      triggerToast('Pembayaran UKT Pertama Selesai! NIM Berhasil Diterbitkan otomatis!');
    }, 2000);
  };

  const handleOcrVerification = (docId: string) => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setIsOcrProcessing(false);
      setDocuments(documents.map(d => d.id === docId ? { ...d, status: 'Terverifikasi (AI-OCR)', ocrScore: 94 } : d));
      triggerToast('AI-OCR memverifikasi kecocokan dokumen NIK & NISN pendaftar!');
    }, 2000);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan PMB', icon: LayoutDashboard },
    { id: 'pmb-form', label: 'Formulir PMB', icon: FileText },
    { id: 'ocr-docs', label: 'Verifikasi Dokumen OCR', icon: Upload },
    { id: 'cbt-exam', label: 'Ujian CBT Online', icon: Shield },
    { id: 'register-nim', label: 'Aktivasi NIM & Daftar Ulang', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold border border-slate-800 dark:border-slate-200 flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-violet-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full border border-violet-300 shadow-md">
                CALON MAHASISWA BARU (PMB)
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Portal PMB & Computer Based Test (CBT)</h2>
            <p className="text-xs text-violet-100 font-medium">
              Selamat datang, {user.name} &bull; Selesaikan pengisian formulir, upload dokumen, ikuti ujian CBT online, dan aktivasi NIM Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 max-w-3xl">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 text-[11px] font-black rounded-xl transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-500' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Contents */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              
              {/* PMB Step Tracker */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-whiter">
                  Alur & Progress Seleksi PMB Anda
                </h3>
                
                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 pl-6 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-9 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm border border-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Langkah 1: Pengisian Formulir PMB</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Formulir NIK/NISN dan program studi pilihan selesai dilengkapi secara dinamis.</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-9 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm border border-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Langkah 2: Verifikasi Dokumen Rapor & Ijazah</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Dokumen divalidasi dengan AI-OCR & verifikasi kemurnian data (Data Integrity).</p>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-9 rounded-full p-1.5 shadow-sm border ${
                      cbtStatus === 'Finished' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-indigo-600 border-indigo-400 text-white animate-pulse'
                    }`}>
                      {cbtStatus === 'Finished' ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </span>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Langkah 3: Ujian Computer Based Test (CBT)</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {cbtStatus === 'Finished' ? `Lunas Teruji dengan skor CBT ${cbtScore}/100. (Lulus Seleksi Akademik)` : 'Ujian online interaktif dengan keamanan browser lockdown & webcam proctoring.'}
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-9 bg-slate-200 text-slate-500 rounded-full p-1.5 shadow-sm border border-slate-100">
                      <CreditCard className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Langkah 4: Daftar Ulang & Terbit NIM</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Lakukan pembayaran UKT pertama untuk mendapatkan Nomor Induk Mahasiswa otomatis.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-blackr text-slate-800 dark:text-slate-200">
                Peringatan CBT Lockdown
              </h4>
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 rounded-xl flex gap-3">
                <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sistem CBT kami melarang membuka tab browser baru, berpindah layar, atau menggunakan perangkat pembantu. Pelanggaran 3x otomatis mendiskualifikasi ujian.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PMB FORM */}
        {activeTab === 'pmb-form' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Formulir Registrasi Mahasiswa Baru</h3>
              <p className="text-xs text-slate-500">
                Lengkapi formulir registrasi untuk sinkronisasi otomatis NIK & NISN dengan Dapodik Kemdikbud.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setFormSaved(true); triggerToast('Formulir berhasil disimpan!'); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450">Nomor Induk Kependudukan (NIK)</label>
                <input 
                  type="text" 
                  value={nik} 
                  onChange={(e) => { setNik(e.target.value); setFormSaved(false); }}
                  className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450">Nomor Induk Siswa Nasional (NISN)</label>
                <input 
                  type="text" 
                  value={nisn} 
                  onChange={(e) => { setNisn(e.target.value); setFormSaved(false); }}
                  className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450">Asal Sekolah Menengah (SMA/SMK)</label>
                <input 
                  type="text" 
                  value={school} 
                  onChange={(e) => { setSchool(e.target.value); setFormSaved(false); }}
                  className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450">Pilihan Program Studi 1</label>
                <select 
                  value={firstProdi} 
                  onChange={(e) => { setFirstProdi(e.target.value); setFormSaved(false); }}
                  className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1"
                >
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Teknik Komputer">Teknik Komputer</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-3">
                <button 
                  type="submit" 
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Simpan Formulir PMB
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: OCR DOCUMENTS */}
        {activeTab === 'ocr-docs' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verifikasi Dokumen Rapor & KTP berbasis AI-OCR</h3>
              <p className="text-xs text-slate-500">
                Unggah dokumen pendaftaran Anda. Mesin OCR kami akan mengekstrak data NIK, NISN, nama sekolah, dan nilai rapor secara real-time untuk validasi orisinalitas dokumen.
              </p>
            </div>

            <div className="space-y-4">
              {documents.map(d => (
                <div key={d.id} className="p-4 border border-slate-100 dark:border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-850 dark:text-white">{d.name}</div>
                    <div className="text-[10px] text-slate-450 font-mono">File: {d.file}</div>
                    {d.ocrScore > 0 && (
                      <div className="text-[10px] text-emerald-600 font-bold">Confidence Score AI-OCR: {d.ocrScore}% Match</div>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                      d.status.includes('Terverifikasi') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {d.status}
                    </span>

                    {d.status.includes('Menunggu') && (
                      <button 
                        onClick={() => handleOcrVerification(d.id)}
                        disabled={isOcrProcessing}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {isOcrProcessing ? 'Memproses...' : 'Jalankan AI-OCR'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CBT EXAM */}
        {activeTab === 'cbt-exam' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            {cbtStatus === 'NotStarted' && (
              <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-950/40 text-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Shield className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-whiter">
                  Mulai Ujian Online (Computer Based Test)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ujian terdiri atas 3 pertanyaan struktur data, biner, dan komputer umum. Harap izinkan kamera webcam aktif untuk proctoring otomatis anti-kecurangan.
                </p>
                <button 
                  onClick={handleStartExam}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Izinkan Kamera & Mulai CBT
                </button>
              </div>
            )}

            {cbtStatus === 'Examining' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Questions Panel */}
                <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-950 border border-slate-150 rounded-2xl p-5 space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-violet-600">Pertanyaan {currentQuestion + 1} dari {testQuestions.length}</span>
                    <span className="text-xs font-mono font-bold text-red-600 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-lg">
                      Sisa Waktu: {Math.floor(timerLeft / 60)}m {timerLeft % 60}s
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {testQuestions[currentQuestion].q}
                    </p>

                    <div className="space-y-2.5">
                      {testQuestions[currentQuestion].options.map(option => {
                        const isSelected = answers[currentQuestion] === option;
                        return (
                          <button 
                            key={option}
                            onClick={() => handleSelectAnswer(currentQuestion, option)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-violet-600 text-white border-violet-500 shadow-md' 
                                : 'bg-white border-slate-200 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <button 
                      disabled={currentQuestion === 0}
                      onClick={() => setCurrentQuestion(prev => prev - 1)}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                    >
                      Sebelumnya
                    </button>

                    {currentQuestion < testQuestions.length - 1 ? (
                      <button 
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Berikutnya
                      </button>
                    ) : (
                      <button 
                        onClick={handleFinishExam}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
                      >
                        Kirim Jawaban CBT
                      </button>
                    )}
                  </div>
                </div>

                {/* Proctoring Cam Panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-950 text-white p-4 rounded-2xl relative overflow-hidden aspect-video flex flex-col justify-end">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      PROCTORING LIVE
                    </div>
                    {/* Simulated Camera placeholder grid */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-center justify-center">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <Camera className="w-6 h-6 text-white animate-pulse" />
                      </div>
                    </div>
                    <span className="relative z-10 text-[9px] font-mono text-slate-350 bg-slate-900/60 px-2 py-0.5 rounded self-start">
                      Webcam View: Rian Hidayat
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-300 font-mono text-[9px] p-4 rounded-xl space-y-1 max-h-40 overflow-y-auto">
                    <div className="text-violet-400 font-bold border-b border-slate-800 pb-1 mb-1">PROCTORING ENGINE AUDIT LOGS:</div>
                    {proctorLogs.map((log, i) => (
                      <div key={i}>&gt; {log}</div>
                    ))}
                  </div>

                  {cheatWarnings > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <div className="text-[10px] text-red-700 font-bold">Peringatan Kecurangan: {cheatWarnings}/3</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {cbtStatus === 'Finished' && (
              <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-whiter">
                  Hasil Ujian CBT Anda
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border">
                  <div className="text-3xl font-black text-emerald-600">{cbtScore} / 100</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Status Kelulusan Akademik</div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mt-2">
                    LULUS SELEKSI PMB
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Langkah selanjutnya adalah melakukan pendaftaran ulang dengan membayar UKT Semester Pertama untuk otomatis mengaktifkan status mahasiswa Anda.
                </p>
                <button 
                  onClick={() => setActiveTab('register-nim')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  Daftar Ulang Sekarang <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REGISTER NIM */}
        {activeTab === 'register-nim' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alur Daftar Ulang & Terbit NIM Otomatis</h3>
              <p className="text-xs text-slate-500">
                Pendaftar yang lulus seleksi PMB berhak mendapatkan Nomor Induk Mahasiswa (NIM) resmi universitas setelah melunasi tagihan UKT Semester Pertama.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-950 border rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-250 pb-2 border-b">Detail Tagihan UKT Pertama</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Golongan UKT</span>
                    <span className="font-bold">Golongan III (Ekonomi Menengah)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biaya UKT Semester I</span>
                    <span className="font-mono font-bold">Rp 5.000.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sumbangan Pengembangan (SPI)</span>
                    <span className="font-mono text-emerald-600 font-bold">Rp 0 (Bebas Biaya SPI)</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-sm font-black">
                    <span>Total Wajib Bayar</span>
                    <span className="font-mono text-indigo-600">Rp 5.000.000</span>
                  </div>
                </div>

                {!isNimActivated ? (
                  <button 
                    onClick={handlePayUktAndGenerateNim}
                    disabled={isPayingUkt}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-350 text-white text-xs font-black py-2.5 rounded-xl shadow-md transition-colors cursor-pointer text-center"
                  >
                    {isPayingUkt ? 'Menghubungi Bank & Memproses...' : 'Bayar UKT Semester I via VA Bank'}
                  </button>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 p-4 rounded-xl text-center text-xs font-bold">
                    Pembayaran Lunas & NIM Telah Aktif!
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-250 pb-2 border-b">Kartu Rencana Studi Mahasiswa Baru</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                    Setelah NIM diterbitkan, sistem SIAKAD akan secara otomatis mengisi Kartu Rencana Studi (KRS) paket Semester I sebanyak 20 SKS, melingkupi Dasar Pemrograman, Matematika Diskrit, dll.
                  </p>
                </div>

                {isNimActivated ? (
                  <div className="bg-indigo-950 text-white rounded-xl p-4 space-y-2 border">
                    <div className="text-[9px] font-black text-violet-400">NOMOR INDUK MAHASISWA BARU</div>
                    <div className="font-mono text-xl font-black text-center tracking-widest text-indigo-300">{generatedNim}</div>
                    <div className="text-[10px] text-center text-slate-400">Status Akun: AKTIF / MAHASISWA AKADEMIK</div>
                  </div>
                ) : (
                  <div className="border border-dashed p-4 rounded-xl text-center text-xs text-slate-500 italic">
                    NIM akan diterbitkan setelah pembayaran UKT pertama diterima secara otomatis oleh sistem rekonsiliasi bank.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
