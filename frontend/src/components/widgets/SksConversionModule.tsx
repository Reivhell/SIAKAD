import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../utils/i18n';
import { 
  Award, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  History, 
  RefreshCw, 
  Search, 
  Sliders, 
  FileText, 
  Percent, 
  CheckCircle,
  Building,
  UserCheck,
  Zap,
  Trash2
} from 'lucide-react';

interface ConversionRecord {
  id: string;
  studentName: string;
  studentNim: string;
  originUni: string;
  originCourse: string;
  originSks: number;
  targetCourseCode: string;
  targetCourseName: string;
  targetSks: number;
  cplMatchPercentage: number;
  status: 'Diajukan' | 'Mengecek CPL' | 'Disetujui' | 'Ditolak';
  proposedAt: string;
  approvedAt?: string;
  notes?: string;
}

const defaultConversions: ConversionRecord[] = [
  {
    id: 'CONV-2026-001',
    studentName: 'Ahmad Syafiq',
    studentNim: '1901001',
    originUni: 'Program Bangkit Academy (Google, GoTo, Traveloka)',
    originCourse: 'Cloud Computing Learning Path',
    originSks: 9,
    targetCourseCode: 'IF3110',
    targetCourseName: 'Pengembangan Web & Cloud',
    targetSks: 4,
    cplMatchPercentage: 92,
    status: 'Disetujui',
    proposedAt: '20 Juni 2026',
    approvedAt: '22 Juni 2026',
    notes: 'Sesuai dengan Capaian Pembelajaran Lulusan (CPL-03 dan CPL-05). SKS berhasil dialihkan.',
  },
  {
    id: 'CONV-2026-002',
    studentName: 'Ahmad Syafiq',
    studentNim: '1901001',
    originUni: 'Universitas Indonesia (Pertukaran Mahasiswa Merdeka)',
    originCourse: 'Kecerdasan Artifisial Dasar',
    originSks: 3,
    targetCourseCode: 'IF3240',
    targetCourseName: 'Pengantar Inteligensi Buatan',
    targetSks: 3,
    cplMatchPercentage: 88,
    status: 'Diajukan',
    proposedAt: '25 Juni 2026',
    notes: 'Sedang diverifikasi oleh Kaprodi terkait dokumen silabus.',
  }
];

const availableTargetCourses = [
  { code: 'IF3110', name: 'Pengembangan Web & Cloud', sks: 4, keywords: ['web', 'cloud', 'server', 'database', 'rest api', 'internet'] },
  { code: 'IF3240', name: 'Pengantar Inteligensi Buatan', sks: 3, keywords: ['kecerdasan', 'artifisial', 'ai', 'machine learning', 'data', 'logika'] },
  { code: 'IF2230', name: 'Pemrograman Berorientasi Objek', sks: 3, keywords: ['oop', 'java', 'class', 'object', 'pemrograman', ' inheritance'] },
  { code: 'IF2211', name: 'Matematika Diskrit', sks: 3, keywords: ['logika', 'graf', 'himpunan', 'kombinatorika', 'diskrit', 'aljabar'] },
  { code: 'IF4120', name: 'Kriptografi & Keamanan Jaringan', sks: 3, keywords: ['kripto', 'keamanan', 'jaringan', 'enkripsi', 'cipher', 'hash'] },
];

export function SksConversionModule({ role }: { role: string }) {
  const { t, lang } = useLanguage();
  const [conversions, setConversions] = useState<ConversionRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('siakad_sks_conversions');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return defaultConversions;
  });

  // Lecturer Form states
  const [studentSearch, setStudentSearch] = useState('Ahmad Syafiq (1901001)');
  const [originUni, setOriginUni] = useState('');
  const [originCourse, setOriginCourse] = useState('');
  const [originSks, setOriginSks] = useState<number>(3);
  const [targetIndex, setTargetIndex] = useState(0);
  const [syllabusText, setSyllabusText] = useState('');

  // Interactive Simulator status
  const [isMatching, setIsMatching] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('siakad_sks_conversions', JSON.stringify(conversions));
  }, [conversions]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Perform a simulated intelligent matching between origin course & syllabus text
  const handleCalculateMatch = () => {
    if (!originCourse || !syllabusText) {
      showToast('Harap isi nama mata kuliah asal dan draf silabus terlebih dahulu!');
      return;
    }

    setIsMatching(true);
    setMatchScore(null);
    setMatchedKeywords([]);

    setTimeout(() => {
      const selectedTarget = availableTargetCourses[targetIndex];
      const keywords = selectedTarget.keywords;
      
      // Compute score based on matching keywords inside syllabus or origin course
      const combinedInput = (originCourse + ' ' + syllabusText).toLowerCase();
      const hits = keywords.filter(kw => combinedInput.includes(kw));
      
      // Calculate a randomized yet inputs-proportional percentage match (minimum 55%, maximum 98%)
      const keywordRatio = hits.length / keywords.length;
      const computedScore = Math.min(98, Math.max(55, Math.floor(60 + (keywordRatio * 30) + (Math.random() * 8))));

      setMatchScore(computedScore);
      setMatchedKeywords(hits.length > 0 ? hits : [keywords[0]]);
      setIsMatching(false);
      showToast('Pencocokan CPL Selesai! Analisis Kompetensi Berhasil.');
    }, 1500);
  };

  // Propose/submit new conversion
  const handleProposeConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originUni || !originCourse) {
      showToast('Wajib melengkapi data universitas asal dan nama mata kuliah asal!');
      return;
    }

    const selectedTarget = availableTargetCourses[targetIndex];
    const finalScore = matchScore || Math.floor(65 + Math.random() * 25);

    const newRecord: ConversionRecord = {
      id: `CONV-2026-0${conversions.length + 1}`,
      studentName: 'Ahmad Syafiq',
      studentNim: '1901001',
      originUni,
      originCourse,
      originSks,
      targetCourseCode: selectedTarget.code,
      targetCourseName: selectedTarget.name,
      targetSks: selectedTarget.sks,
      cplMatchPercentage: finalScore,
      status: 'Diajukan',
      proposedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      notes: `Menunggu tinjauan Program Studi untuk kesesuaian SKS (${originSks} SKS ➔ ${selectedTarget.sks} SKS).`
    };

    setConversions([newRecord, ...conversions]);
    
    // Reset form states
    setOriginUni('');
    setOriginCourse('');
    setOriginSks(3);
    setSyllabusText('');
    setMatchScore(null);
    setMatchedKeywords([]);
    
    showToast('Berhasil mengusulkan penyetaraan SKS otomatis!');
  };

  const handleApprove = (id: string) => {
    setConversions(conversions.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Disetujui',
          approvedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          notes: 'Telah diverifikasi silabus dan CPL cocok. Konversi SKS resmi dialihkan di transkrip akademik.'
        };
      }
      return c;
    }));
    showToast('Rekomendasi konversi SKS disetujui secara resmi!');
  };

  const handleReject = (id: string) => {
    setConversions(conversions.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Ditolak',
          notes: 'Ditolak: Dokumen silabus atau jam kredit tidak mencukupi standar minimum program studi.'
        };
      }
      return c;
    }));
    showToast('Konversi SKS ditolak.');
  };

  const handleDelete = (id: string) => {
    setConversions(conversions.filter(c => c.id !== id));
    showToast('Catatan konversi berhasil dihapus dari sistem.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden transition-colors duration-200">
      
      {/* Dynamic Toast Alert inside widget */}
      {toast && (
        <div className="absolute top-4 right-4 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-xl shadow-xl text-xs font-bold z-50 flex items-center gap-1.5 border border-slate-800">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Accent Decorator */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />

      {/* Widget Header */}
      <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/25">
            <Award className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">
            {t('sks.title')}
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          {t('sks.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LECTURER: PROPOSE CONVERSION FORM */}
        {role !== 'student' && (
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-blue-500" />
              <h5 className="text-xs font-bold text-slate-800 dark:text-whiter">
                {t('sks.lecturer_view')}
              </h5>
            </div>

            <form onSubmit={handleProposeConversion} className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black">{t('login.username')} (Mahasiswa)</label>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-500" /> {studentSearch}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black">{t('sks.university_origin')}</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Universitas Gadjah Mada / Kampus Merdeka"
                  value={originUni}
                  onChange={(e) => setOriginUni(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-200 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-8 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-black">{t('sks.course_origin')}</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Pemrograman Sistem & Cloud"
                    value={originCourse}
                    onChange={(e) => setOriginCourse(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-200 focus:border-blue-500 font-bold"
                  />
                </div>
                <div className="col-span-4 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-black">{t('sks.sks_origin')}</label>
                  <input 
                    type="number"
                    min={1}
                    max={12}
                    value={originSks}
                    onChange={(e) => setOriginSks(parseInt(e.target.value) || 3)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-200 text-center font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black">{t('sks.course_target')}</label>
                <select
                  value={targetIndex}
                  onChange={(e) => {
                    setTargetIndex(parseInt(e.target.value));
                    setMatchScore(null);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-bold outline-none"
                >
                  {availableTargetCourses.map((c, i) => (
                    <option key={c.code} value={i}>{c.code} - {c.name} ({c.sks} SKS)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black">Draf Silabus / Deskripsi Kompetensi Asal</label>
                <textarea 
                  rows={2}
                  placeholder="Masukkan deskripsi mata kuliah asal atau silabus untuk mencocokkan Capaian Pembelajaran Lulusan (CPL)..."
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-200 focus:border-blue-500 font-semibold resize-none"
                />
              </div>

              {/* Dynamic Matching Calculator */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-2">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 font-bold block">{t('sks.match_cpl')}</span>
                  {isMatching ? (
                    <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menganalisis...
                    </span>
                  ) : matchScore !== null ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{matchScore}% Match</span>
                      <span className="text-[9px] text-slate-400 font-semibold">(Kata kunci: {matchedKeywords.join(', ')})</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Belum dihitung</span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={handleCalculateMatch}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> {t('sks.calculate_btn')}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {t('sks.propose_btn')}
              </button>
            </form>
          </div>
        )}

        {/* HISTORIC LIST OF CONVERSIONS */}
        <div className={`${role === 'student' ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-4`}>
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-extrabold text-slate-800 dark:text-whiter flex items-center gap-1.5">
              <History className="w-4.5 h-4.5 text-blue-500" />
              {role === 'student' ? t('sks.student_view') : t('sks.history_title')}
            </h5>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 rounded-full border border-blue-500/10">
              {conversions.length} Total Records
            </span>
          </div>

          <div className="space-y-3.5">
            {conversions.map((rec) => {
              const statusColors = {
                'Disetujui': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
                'Ditolak': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
                'Diajukan': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
                'Mengecek CPL': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
              };

              return (
                <div 
                  key={rec.id}
                  className="bg-slate-50/50 dark:bg-slate-900/25 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 transition-colors space-y-3.5 relative overflow-hidden"
                >
                  {/* Card top row */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2.5">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400">
                        <span>{rec.id}</span>
                        <span>&bull;</span>
                        <span>{rec.proposedAt}</span>
                      </div>
                      <h6 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 flex-wrap">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rec.originUni}</span>
                      </h6>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Mahasiswa: <strong className="text-slate-700 dark:text-slate-200">{rec.studentName} ({rec.studentNim})</strong>
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black border ${statusColors[rec.status] || ''}`}>
                        {rec.status === 'Diajukan' ? t('sks.status.proposed') : rec.status === 'Disetujui' ? t('sks.status.approved') : rec.status}
                      </span>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1.5 flex items-center justify-end gap-1 font-mono">
                        <Zap className="w-3 h-3 animate-pulse text-amber-500" /> CPL Match: {rec.cplMatchPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Core mapping visually designed with arrow */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 flex-1 w-full text-center sm:text-left">
                      <span className="text-[8.5px] uppercase font-black text-slate-400">Matakuliah Asal</span>
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{rec.originCourse}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{rec.originSks} SKS Credits</span>
                    </div>

                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shrink-0 transform rotate-90 sm:rotate-0">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="space-y-0.5 flex-1 w-full text-center sm:text-right">
                      <span className="text-[8.5px] uppercase font-black text-slate-400">SIAKAD Sasaran</span>
                      <div className="font-bold text-blue-600 dark:text-blue-400 truncate">({rec.targetCourseCode}) {rec.targetCourseName}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{rec.targetSks} Converted SKS</span>
                    </div>
                  </div>

                  {/* Syllabus / Notes description */}
                  {rec.notes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-350 bg-slate-100/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-150/40 dark:border-slate-850">
                      <strong>Keterangan Kaprodi:</strong> {rec.notes}
                    </p>
                  )}

                  {/* Actions for lecturers / admin */}
                  {role !== 'student' && rec.status === 'Diajukan' && (
                    <div className="flex gap-2 justify-end pt-1">
                      <button 
                        onClick={() => handleReject(rec.id)}
                        className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Tolak Konversi
                      </button>
                      <button 
                        onClick={() => handleApprove(rec.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-md shadow-emerald-500/10 cursor-pointer transition-colors"
                      >
                        Setujui Konversi & Verifikasi CPL
                      </button>
                    </div>
                  )}

                  {/* Delete record option for Admin */}
                  {role === 'admin' && (
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="absolute top-3.5 right-3.5 p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      title="Hapus rekaman"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}

            {conversions.length === 0 && (
              <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada data konversi atau penyetaraan SKS.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
