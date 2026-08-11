import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, AlertCircle, Clock, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Course } from '../../types';
import { KrsService } from '../../api/krs.api';

const availableCourses: Course[] = [
  { id: '1', code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, semester: 5, type: 'Wajib' },
  { id: '2', code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, semester: 5, type: 'Wajib' },
  { id: '3', code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, semester: 5, type: 'Wajib' },
  { id: '4', code: 'IF3140', name: 'Manajemen Basis Data', sks: 3, semester: 5, type: 'Wajib' },
  { id: '5', code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, semester: 5, type: 'Wajib' },
  { id: '6', code: 'IF3180', name: 'Sistem Temu Balik Informasi', sks: 3, semester: 5, type: 'Pilihan' },
  { id: '7', code: 'IF3190', name: 'Kriptografi', sks: 3, semester: 5, type: 'Pilihan' },
];

export function KRSView() {
  const [selectedCourseCodes, setSelectedCourseCodes] = useState<string[]>([]);
  const [status, setStatus] = useState<'Draft' | 'Pending' | 'Approved'>('Draft');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedCourses = availableCourses.filter(c => selectedCourseCodes.includes(c.code));
  const totalSKS = selectedCourses.reduce((sum, course) => sum + course.sks, 0);
  const maxSKS = 24;

  useEffect(() => {
    loadKrs();
  }, []);

  const loadKrs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await KrsService.getKrs();
      if (response.status === 'success' && response.krs) {
        setSelectedCourseCodes(response.krs.courses || []);
        if (response.krs.status === 'Diajukan') setStatus('Pending');
        else if (response.krs.status === 'Disetujui') setStatus('Approved');
        else setStatus('Draft');
      }
    } catch (err: any) {
      // Backend unavailable — fall back to offline mode
      console.warn('KRS API unavailable, using offline mode:', err?.message);
      setSelectedCourseCodes(['IF3110', 'IF3150', 'IF3170']);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (course: Course) => {
    if (selectedCourseCodes.includes(course.code)) return;
    if (totalSKS + course.sks > maxSKS) {
      alert('Batas maksimal SKS tercapai!');
      return;
    }
    try {
      setSelectedCourseCodes(prev => [...prev, course.code]);
      await KrsService.addCourse(course.code);
    } catch (err: any) {
      setSelectedCourseCodes(prev => prev.filter(c => c !== course.code));
      setError(err?.message || 'Gagal menambahkan mata kuliah.');
    }
  };

  const handleRemoveCourse = async (courseCode: string) => {
    try {
      setSelectedCourseCodes(prev => prev.filter(c => c !== courseCode));
      await KrsService.removeCourse(courseCode);
    } catch (err: any) {
      loadKrs();
      setError(err?.message || 'Gagal menghapus mata kuliah.');
    }
  };

  const handleSubmit = async () => {
    try {
      await KrsService.submitKrs();
      setStatus('Pending');
    } catch (err: any) {
      setError(err?.message || 'Gagal mengajukan KRS.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kartu Rencana Studi (KRS)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pilih mata kuliah untuk Semester Ganjil 2023/2024.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {error && (
            <div className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}
          <button onClick={loadKrs} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center border ${
            status === 'Approved' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/60' :
            status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60' :
            'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}>
            {status === 'Approved' ? <CheckCircle2 className="w-4 h-4 mr-2" /> :
             status === 'Pending' ? <Clock className="w-4 h-4 mr-2" /> :
             <AlertCircle className="w-4 h-4 mr-2" />}
            Status: {status}
          </div>
          {status === 'Draft' && (
            <button
              onClick={handleSubmit}
              disabled={selectedCourses.length === 0 || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto"
            >
              Ajukan KRS
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Memuat data KRS...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-slate-500" />
                  Mata Kuliah Terpilih
                </h3>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Total SKS: <span className={totalSKS > maxSKS ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}>{totalSKS}</span> / {maxSKS}
                </div>
              </div>

              {selectedCourses.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-1">Belum ada mata kuliah</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Silakan pilih mata kuliah dari daftar di samping.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {selectedCourses.map((course) => (
                    <div key={course.code} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                            {course.code}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                            course.type === 'Wajib'
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/50'
                              : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200/50 dark:border-teal-900/50'
                          }`}>
                            {course.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{course.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Semester {course.semester} • {course.sks} SKS</p>
                      </div>
                      {status === 'Draft' && (
                        <button
                          onClick={() => handleRemoveCourse(course.code)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden sticky top-6">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-900 dark:text-white">Daftar Penawaran</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Klik untuk menambahkan ke KRS.</p>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                {availableCourses.map((course) => {
                  const isSelected = selectedCourseCodes.includes(course.code);
                  return (
                    <div
                      key={course.code}
                      className={`p-4 flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'opacity-50 bg-slate-50 dark:bg-slate-800/20 cursor-not-allowed'
                          : 'hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer'
                      }`}
                      onClick={() => status === 'Draft' && !isSelected && handleAddCourse(course)}
                    >
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">{course.code} - {course.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{course.sks} SKS • {course.type}</div>
                      </div>
                      {!isSelected && status === 'Draft' && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
