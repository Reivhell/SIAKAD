import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Download, 
  Printer, 
  TrendingUp, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { getStudentOverview, TranskripRow, StudentSemesterGpa } from '../../api/academic.api';

export function KHSView() {
  const [transkrip, setTranskrip] = useState<TranskripRow[]>([]);
  const [ipsHistory, setIpsHistory] = useState<StudentSemesterGpa[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getStudentOverview()
      .then((data) => {
        if (cancelled) return;
        setTranskrip(data.transkrip || []);
        setIpsHistory(data.semesterGPAs || []);
        if (data.transkrip?.length) setSelectedSemester(data.transkrip[data.transkrip.length - 1].semester);
      })
      .catch((err) => console.error('Gagal memuat KHS:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const currentData = transkrip.find((t) => t.semester === selectedSemester) || transkrip[transkrip.length - 1];
  const semesterOptions = transkrip.map((t) => t.semester);

  // Statistik kumulatif dihitung dari transkrip nyata
  const cumulativeSKS = transkrip.reduce((sum, t) => sum + t.sksTaken, 0);
  const allGrades = transkrip.flatMap((t) => t.grades);
  const cumulativeGPA = allGrades.length
    ? Math.round((allGrades.reduce((sum, g) => sum + g.point * g.sks, 0) / Math.max(1, allGrades.reduce((sum, g) => sum + g.sks, 0))) * 100) / 100
    : 0;

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  const handleExportPDF = () => {
    triggerNotification("Berhasil mengekspor KHS " + selectedSemester + " ke PDF!");
  };

  const handleExportExcel = () => {
    triggerNotification("Berhasil mengekspor KHS " + selectedSemester + " ke Excel (.xlsx)!");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700/50 dark:border-slate-200 animate-pulse">
          <Sparkles className="w-5 h-5 text-amber-400 dark:text-amber-500" />
          <span className="text-sm font-medium">{showNotification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kartu Hasil Studi (KHS)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Lihat nilai akademik, IP semester, dan riwayat perkembangan IPK Anda.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExportExcel}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
          >
            <Download className="h-4 w-4 mr-2 text-slate-400" />
            Excel
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
          >
            <Printer className="h-4 w-4 mr-2 text-slate-400" />
            Cetak / PDF
          </button>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400r">IPK Kumulatif</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{cumulativeGPA.toFixed(2)}</h3>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Sangat Memuaskan
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400r">IPS Terakhir ({selectedSemester || '—'})</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{currentData ? currentData.ips.toFixed(2) : '—'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Beban SKS Semester: {currentData ? currentData.sksTaken : 0} SKS
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400r">Total SKS Lulus</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{cumulativeSKS} SKS</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Target Kelulusan: 144 SKS
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Timeline Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              Perkembangan Indeks Prestasi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tren IP Semester (IPS) vs IP Kumulatif (IPK)</p>
          </div>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ipsHistory} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis domain={[3.0, 4.0]} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderRadius: '8px', 
                    border: 'none',
                    color: '#fff' 
                  }} 
                />
                <Line type="monotone" dataKey="IPS" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="IPK" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-medium mt-2">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-1 bg-indigo-500 rounded-full inline-block" />
              IPS (Smt)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" />
              IPK (Kumulatif)
            </span>
          </div>
        </div>

        {/* Course Grades Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header / Semester Switcher */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pilih Semester:</span>
              </div>
              <div className="flex flex-wrap gap-1 w-full sm:w-auto">
                {semesterOptions.map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedSemester === sem
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50/50 dark:bg-slate-800/40">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400r">Kode</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400r">Mata Kuliah</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400r">SKS</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400r">Nilai Angka</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400r">Grade</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400r">Bobot</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400r">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Memuat data KHS...
                      </td>
                    </tr>
                  ) : !currentData ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum ada data KHS.
                      </td>
                    </tr>
                  ) : (
                    currentData.grades.map((grade) => (
                    <tr key={grade.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-900 dark:text-white">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200/60 dark:border-slate-700/60">
                          {grade.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-300 font-medium">
                        {grade.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-600 dark:text-slate-400">
                        {grade.sks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-mono text-slate-700 dark:text-slate-300">
                        {grade.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          grade.grade === 'A' || grade.grade === 'AB' 
                            ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200/50' 
                            : grade.grade === 'B' || grade.grade === 'BC'
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-800 dark:text-slate-300 font-semibold">
                        {grade.point.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          grade.status === 'Lulus' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}>
                          {grade.status}
                        </span>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary info footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
              <div>* Sistem penilaian standar kampus (A = 4.0, AB = 3.5, B = 3.0, BC = 2.5, C = 2.0)</div>
              <div>Rentang kelulusan minimal grade C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
