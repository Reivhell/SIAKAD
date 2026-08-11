import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Download, Sparkles } from 'lucide-react';

const mockStudents = [
  { id: '1', nim: '1901001', name: 'Ahmad Syafiq', program: 'Teknik Informatika', status: 'Aktif', gpa: 3.85 },
  { id: '2', nim: '1901002', name: 'Budi Santoso', program: 'Sistem Informasi', status: 'Aktif', gpa: 3.42 },
  { id: '3', nim: '1901003', name: 'Citra Kirana', program: 'Ilmu Komputer', status: 'Cuti', gpa: 3.91 },
  { id: '4', nim: '1901004', name: 'Dewi Lestari', program: 'Teknik Informatika', status: 'Aktif', gpa: 3.10 },
  { id: '5', nim: '1901005', name: 'Eko Prabowo', program: 'Sistem Informasi', status: 'Lulus', gpa: 3.55 },
  { id: '6', nim: '1901006', name: 'Fajar Nugroho', program: 'Teknik Informatika', status: 'Drop Out', gpa: 1.85 },
  { id: '7', nim: '1901007', name: 'Gita Wirjawan', program: 'Ilmu Komputer', status: 'Aktif', gpa: 3.65 },
];

export function MahasiswaView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  const filteredStudents = mockStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.nim.includes(searchTerm) ||
                          s.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua Status' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Data Mahasiswa</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola data master mahasiswa, status akademik, dan performa.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors">
            <Download className="h-4 w-4 mr-2 text-slate-400" />
            Export Data
          </button>
          <button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Tambah Mahasiswa
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari NIM, Nama, atau Prodi..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full sm:w-auto py-2 pl-3 pr-8 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Cuti</option>
              <option value="Lulus">Lulus</option>
              <option value="Drop Out">Drop Out</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/40">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400r">NIM</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400r">Nama Lengkap</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400r">Program Studi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400r">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400r">IPK</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">{student.nim}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{student.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                      ${student.status === 'Aktif' ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400' : ''}
                      ${student.status === 'Cuti' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400' : ''}
                      ${student.status === 'Lulus' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400' : ''}
                      ${student.status === 'Drop Out' ? 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400' : ''}
                    `}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold">{student.gpa.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    Tidak ada data mahasiswa yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white dark:bg-slate-900 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-400">
                Menampilkan <span className="font-semibold">{filteredStudents.length}</span> dari <span className="font-semibold">{mockStudents.length}</span> hasil
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Sebelumnya
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 bg-blue-50 dark:bg-blue-950/40 text-sm font-medium text-blue-600 dark:text-blue-400">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Selanjutnya
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
