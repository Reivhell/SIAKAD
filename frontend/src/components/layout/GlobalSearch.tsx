import React, { useState, useEffect, useRef } from 'react';
import { Search, User as UserIcon, BookOpen, GraduationCap, X, Calendar, Award } from 'lucide-react';

interface SearchResultItem {
  id: string;
  type: 'student' | 'course' | 'lecturer';
  title: string;
  subtitle: string;
  extra?: string;
  detailData: any;
}

// Comprehensive search database
const searchDatabase: SearchResultItem[] = [
  // Students
  { id: 's1', type: 'student', title: 'Ahmad Syafiq', subtitle: 'NIM. 1901001 • Teknik Informatika', extra: 'IPK: 3.85', detailData: { nim: '1901001', program: 'Teknik Informatika', gpa: 3.85, status: 'Aktif', email: 'ahmad.syafiq@mahasiswa.ac.id', semester: 6 } },
  { id: 's2', type: 'student', title: 'Budi Santoso', subtitle: 'NIM. 1901002 • Sistem Informasi', extra: 'IPK: 3.42', detailData: { nim: '1901002', program: 'Sistem Informasi', gpa: 3.42, status: 'Aktif', email: 'budi.santoso@mahasiswa.ac.id', semester: 6 } },
  { id: 's3', type: 'student', title: 'Citra Kirana', subtitle: 'NIM. 1901003 • Ilmu Komputer', extra: 'IPK: 3.91', detailData: { nim: '1901003', program: 'Ilmu Komputer', gpa: 3.91, status: 'Cuti', email: 'citra.kirana@mahasiswa.ac.id', semester: 4 } },
  { id: 's4', type: 'student', title: 'Dewi Lestari', subtitle: 'NIM. 1901004 • Teknik Informatika', extra: 'IPK: 3.10', detailData: { nim: '1901004', program: 'Teknik Informatika', gpa: 3.10, status: 'Aktif', email: 'dewi.lestari@mahasiswa.ac.id', semester: 8 } },
  { id: 's5', type: 'student', title: 'Eko Prabowo', subtitle: 'NIM. 1901005 • Sistem Informasi', extra: 'IPK: 3.55', detailData: { nim: '1901005', program: 'Sistem Informasi', gpa: 3.55, status: 'Lulus', email: 'eko.prabowo@mahasiswa.ac.id', semester: 8 } },
  
  // Courses
  { id: 'c1', type: 'course', title: 'Pengembangan Aplikasi Web', subtitle: 'IF3110 • 3 SKS', extra: 'Semester 5', detailData: { code: 'IF3110', sks: 3, semester: 5, type: 'Wajib', room: 'Lab Komputer 3', time: 'Senin, 08:00 - 10:30' } },
  { id: 'c2', type: 'course', title: 'Manajemen Proyek Perangkat Lunak', subtitle: 'IF3150 • 3 SKS', extra: 'Semester 5', detailData: { code: 'IF3150', sks: 3, semester: 5, type: 'Wajib', room: 'Ruang Kuliah 402', time: 'Selasa, 13:00 - 15:30' } },
  { id: 'c3', type: 'course', title: 'Kecerdasan Buatan', subtitle: 'IF3170 • 3 SKS', extra: 'Semester 5', detailData: { code: 'IF3170', sks: 3, semester: 5, type: 'Wajib', room: 'Ruang Kuliah 401', time: 'Rabu, 10:00 - 12:30' } },
  { id: 'c4', type: 'course', title: 'Manajemen Basis Data', subtitle: 'IF3140 • 3 SKS', extra: 'Semester 5', detailData: { code: 'IF3140', sks: 3, semester: 5, type: 'Wajib', room: 'Lab Komputer 1', time: 'Kamis, 08:00 - 10:30' } },
  { id: 'c5', type: 'course', title: 'Kriptografi', subtitle: 'IF3190 • 3 SKS', extra: 'Semester 5', detailData: { code: 'IF3190', sks: 3, semester: 5, type: 'Pilihan', room: 'Ruang Kuliah 204', time: 'Jumat, 14:00 - 16:30' } },

  // Lecturers
  { id: 'l1', type: 'lecturer', title: 'Dr. Budi Rahardjo', subtitle: 'NIP. 197408232001121002', extra: 'Keahlian: Cyber Security', detailData: { nip: '197408232001121002', dept: 'Teknik Informatika', role: 'Dosen Wali / Kepala Lab', email: 'budi.rahardjo@kampus.ac.id' } },
  { id: 'l2', type: 'lecturer', title: 'Prof. Suhono Harso, M.T.', subtitle: 'NIP. 196803121995031001', extra: 'Keahlian: Smart City & IoT', detailData: { nip: '196803121995031001', dept: 'Sistem Informasi', role: 'Guru Besar', email: 'suhono.harso@kampus.ac.id' } },
  { id: 'l3', type: 'lecturer', title: 'Ir. Ayu Purwarianti, Ph.D.', subtitle: 'NIP. 198001052008122001', extra: 'Keahlian: Natural Language Processing', detailData: { nip: '198001052008122001', dept: 'Ilmu Komputer', role: 'Ketua Program Studi', email: 'ayu.purwarianti@kampus.ac.id' } },
];

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<SearchResultItem | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = searchDatabase.filter(item => 
      item.title.toLowerCase().includes(val.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(val.toLowerCase()) ||
      item.id.toLowerCase().includes(val.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(true);
  };

  const handleSelectResult = (item: SearchResultItem) => {
    setSelectedDetail(item);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Bar Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          className="block w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          placeholder="Cari NIM, mata kuliah, dosen..."
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          <div className="p-2 text-[10px] font-bold text-slate-400 dark:text-slate-500r bg-slate-50 dark:bg-slate-900/50">
            Hasil Pencarian ({results.length})
          </div>
          {results.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => handleSelectResult(item)}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'student' ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400' :
                    item.type === 'course' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' :
                    'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}>
                    {item.type === 'student' && <GraduationCap className="w-4 h-4" />}
                    {item.type === 'course' && <BookOpen className="w-4 h-4" />}
                    {item.type === 'lecturer' && <UserIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-boldr ${
                    item.type === 'student' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    item.type === 'course' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                  }`}>
                    {item.type === 'student' ? 'Mahasiswa' : item.type === 'course' ? 'Mata Kuliah' : 'Dosen'}
                  </span>
                  {item.extra && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">{item.extra}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No results notice */}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tidak ada hasil ditemukan untuk "{query}"</p>
        </div>
      )}

      {/* Detail Modal / Card when Selected */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-200">
            {/* Detail Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/35">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500r">Detail Informasi</span>
              <button 
                onClick={() => setSelectedDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detail Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  selectedDetail.type === 'student' ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400' :
                  selectedDetail.type === 'course' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' :
                  'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                }`}>
                  {selectedDetail.type === 'student' && <GraduationCap className="w-6 h-6" />}
                  {selectedDetail.type === 'course' && <BookOpen className="w-6 h-6" />}
                  {selectedDetail.type === 'lecturer' && <UserIcon className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{selectedDetail.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedDetail.subtitle}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-sm">
                {selectedDetail.type === 'student' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">NIM</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{selectedDetail.detailData.nim}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Program Studi</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.detailData.program}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">IPK Kumulatif</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{selectedDetail.detailData.gpa}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Status Akademik</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.detailData.status}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Email</span>
                      <span className="text-slate-600 dark:text-slate-400">{selectedDetail.detailData.email}</span>
                    </div>
                  </>
                )}

                {selectedDetail.type === 'course' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Kode Matakuliah</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{selectedDetail.detailData.code}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Beban SKS</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.detailData.sks} SKS</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Tipe Matakuliah</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.detailData.type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Jadwal Kuliah</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {selectedDetail.detailData.time}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Lokasi / Ruang</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.detailData.room}</span>
                    </div>
                  </>
                )}

                {selectedDetail.type === 'lecturer' && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">NIP / ID</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{selectedDetail.detailData.nip}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Program Studi</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.detailData.dept}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Jabatan</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.detailData.role}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Email</span>
                      <span className="text-slate-600 dark:text-slate-400">{selectedDetail.detailData.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400">Bidang Ahli</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        {selectedDetail.extra}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Detail Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
