import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Download, 
  Printer, 
  TrendingUp, 
  BookOpen, 
  ChevronRight,
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

interface GradeItem {
  code: string;
  name: string;
  sks: number;
  score: number;
  grade: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'D' | 'E';
  point: number;
  status: 'Lulus' | 'Tidak Lulus';
}

interface SemesterData {
  semesterName: string;
  ips: number;
  sksTaken: number;
  grades: GradeItem[];
}

const mockSemesters: Record<string, SemesterData> = {
  'Ganjil 2023/2024': {
    semesterName: 'Semester 5 (Ganjil 2023/2024)',
    ips: 3.78,
    sksTaken: 20,
    grades: [
      { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, score: 92, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, score: 86, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, score: 90, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF3140', name: 'Manajemen Basis Data', sks: 3, score: 81, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, score: 88, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF3180', name: 'Sistem Temu Balik Informasi', sks: 3, score: 78, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'IF3190', name: 'Kriptografi', sks: 3, score: 85, grade: 'AB', point: 3.5, status: 'Lulus' },
    ]
  },
  'Genap 2022/2023': {
    semesterName: 'Semester 4 (Genap 2022/2023)',
    ips: 3.65,
    sksTaken: 22,
    grades: [
      { code: 'IF2210', name: 'Algoritma dan Struktur Data', sks: 4, score: 84, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'IF2230', name: 'Sistem Operasi', sks: 3, score: 89, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2240', name: 'Rekayasa Perangkat Lunak', sks: 3, score: 76, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'IF2250', name: 'Pemrograman Berorientasi Objek', sks: 3, score: 95, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2270', name: 'Teori Bahasa Formal dan Otomata', sks: 3, score: 68, grade: 'C', point: 2.0, status: 'Lulus' },
      { code: 'IF2280', name: 'Jaringan Komputer', sks: 3, score: 82, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'KU2060', name: 'Bahasa Inggris Akademik', sks: 3, score: 91, grade: 'A', point: 4.0, status: 'Lulus' },
    ]
  },
  'Ganjil 2022/2023': {
    semesterName: 'Semester 3 (Ganjil 2022/2023)',
    ips: 3.52,
    sksTaken: 21,
    grades: [
      { code: 'IF2110', name: 'Matematika Diskrit', sks: 3, score: 80, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'IF2130', name: 'Arsitektur dan Organisasi Komputer', sks: 3, score: 75, grade: 'B', point: 3.0, status: 'Lulus' },
      { code: 'IF2140', name: 'Pemrograman fungsional', sks: 3, score: 87, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'IF2150', name: 'Aljabar Linier dan Geometri', sks: 3, score: 93, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2160', name: 'Probabilitas dan Statistika', sks: 3, score: 82, grade: 'AB', point: 3.5, status: 'Lulus' },
      { code: 'KU2010', name: 'Tata Tulis Karya Ilmiah', sks: 2, score: 90, grade: 'A', point: 4.0, status: 'Lulus' },
      { code: 'IF2180', name: 'Interaksi Manusia dan Komputer', sks: 4, score: 86, grade: 'AB', point: 3.5, status: 'Lulus' },
    ]
  }
};

const ipsHistory = [
  { name: 'Smt 1', IPS: 3.40, IPK: 3.40 },
  { name: 'Smt 2', IPS: 3.55, IPK: 3.48 },
  { name: 'Smt 3', IPS: 3.52, IPK: 3.49 },
  { name: 'Smt 4', IPS: 3.65, IPK: 3.53 },
  { name: 'Smt 5', IPS: 3.78, IPK: 3.58 },
];

export function KHSView() {
  const [selectedSemester, setSelectedSemester] = useState<string>('Ganjil 2023/2024');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const currentData = mockSemesters[selectedSemester] || mockSemesters['Ganjil 2023/2024'];
  
  // Calculate aggregate stats based on our mock history
  const cumulativeGPA = 3.58; 
  const cumulativeSKS = 104;

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
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400r">IPS Terakhir ({selectedSemester})</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{currentData.ips.toFixed(2)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Beban SKS Semester: {currentData.sksTaken} SKS
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
                {Object.keys(mockSemesters).map((sem) => (
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
                  {currentData.grades.map((grade) => (
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
                  ))}
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
