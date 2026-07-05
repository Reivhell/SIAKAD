import React, { useState } from 'react';
import { StudentAcademic, TugasItem, MateriItem } from '../../../data/lecturerMockData';
import { 
  FileSpreadsheet, 
  Award, 
  Plus, 
  Download, 
  UploadCloud, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Eye 
} from 'lucide-react';

interface LecturerGradeModuleProps {
  students: StudentAcademic[];
  setStudents: React.Dispatch<React.SetStateAction<StudentAcademic[]>>;
  tugas: TugasItem[];
  setTugas: React.Dispatch<React.SetStateAction<TugasItem[]>>;
  materi: MateriItem[];
  setMateri: React.Dispatch<React.SetStateAction<MateriItem[]>>;
  onShowToast: (message: string) => void;
  subTab: string;
}

export function LecturerGradeModule({
  students,
  setStudents,
  tugas,
  setTugas,
  materi,
  setMateri,
  onShowToast,
  subTab
}: LecturerGradeModuleProps) {
  // Tugas creation form states
  const [tugasTitle, setTugasTitle] = useState('');
  const [tugasDesc, setTugasDesc] = useState('');
  const [tugasDeadline, setTugasDeadline] = useState('');
  const [tugasClass, setTugasClass] = useState('IF3110-A');

  // Materi creation form states
  const [materiTitle, setMateriTitle] = useState('');
  const [materiType, setMateriType] = useState<'PDF' | 'PPT' | 'Video' | 'Modul'>('PDF');
  const [materiClass, setMateriClass] = useState('IF3110-A');
  const [materiFileName, setMateriFileName] = useState('');

  // Handle local dynamic recalculation of final score & letter grade
  const calculateFinalScore = (g: { tugas: number; kuis: number; praktikum: number; uts: number; uas: number }) => {
    // Standard weight: Tugas (20%), Kuis (10%), Praktikum (20%), UTS (25%), UAS (25%)
    const score = (g.tugas * 0.20) + (g.kuis * 0.10) + (g.praktikum * 0.20) + (g.uts * 0.25) + (g.uas * 0.25);
    return parseFloat(score.toFixed(1));
  };

  const getLetterAndGrade = (score: number): string => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  };

  const handleGradeChange = (studentNim: string, field: 'tugas' | 'kuis' | 'praktikum' | 'uts' | 'uas', value: string) => {
    const numValue = Math.min(100, Math.max(0, parseFloat(value) || 0));
    setStudents(prev => prev.map(student => {
      if (student.nim === studentNim) {
        const updatedGrates = { ...student.grades, [field]: numValue };
        const finalScore = calculateFinalScore(updatedGrates);
        const letter = getLetterAndGrade(finalScore);
        
        return {
          ...student,
          grades: {
            ...updatedGrates,
            final: finalScore,
            gradeLetter: letter
          }
        };
      }
      return student;
    }));
  };

  // Publish grades to portal
  const handlePublishGrades = () => {
    onShowToast('Sukses: Nilai Komponen & Huruf Akhir telah dipublikasikan ke SIAKAD Mahasiswa!');
  };

  // Submit new task
  const handleCreateTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tugasTitle || !tugasDesc) {
      onShowToast('Error: Judul dan deskripsi tugas wajib diisi!');
      return;
    }
    const newTask: TugasItem = {
      id: 'T' + (tugas.length + 1),
      classId: tugasClass,
      title: tugasTitle,
      description: tugasDesc,
      deadline: tugasDeadline || 'Besok 23:59',
      submissionsCount: 0,
      attachments: ['Soal_' + tugasTitle.replace(/\s+/g, '_') + '.pdf']
    };
    setTugas(prev => [newTask, ...prev]);
    setTugasTitle('');
    setTugasDesc('');
    setTugasDeadline('');
    onShowToast(`Tugas baru "${tugasTitle}" berhasil dibuat dan diumumkan!`);
  };

  // Submit new material
  const handleUploadMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiTitle || !materiFileName) {
      onShowToast('Error: Judul materi dan nama file simulasi wajib diisi!');
      return;
    }
    const newMateriItem: MateriItem = {
      id: 'M' + (materi.length + 1),
      classId: materiClass,
      title: materiTitle,
      type: materiType,
      fileName: materiFileName,
      fileSize: '4.2 MB',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setMateri(prev => [newMateriItem, ...prev]);
    setMateriTitle('');
    setMateriFileName('');
    onShowToast(`Materi Kuliah "${materiTitle}" berhasil diunggah!`);
  };

  const handleDeleteMateri = (id: string) => {
    setMateri(prev => prev.filter(m => m.id !== id));
    onShowToast('Materi berhasil dihapus.');
  };

  return (
    <div className="space-y-6">
      {/* 1. INPUT NILAI */}
      {subTab === 'input-nilai' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Lembar Kerja Penilaian Mata Kuliah</h4>
              <p className="text-xs text-slate-500">Edit nilai komponen mahasiswa secara langsung. Hasil akhir dihitung secara otomatis.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onShowToast('Excel Template Nilai berhasil diunduh!')}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Templat
              </button>
              <button 
                onClick={handlePublishGrades}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Publikasikan Nilai
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  <th className="pb-3 pl-2">Mahasiswa</th>
                  <th className="pb-3 text-center w-16">Tugas (20%)</th>
                  <th className="pb-3 text-center w-16">Kuis (10%)</th>
                  <th className="pb-3 text-center w-16">Prkt (20%)</th>
                  <th className="pb-3 text-center w-16">UTS (25%)</th>
                  <th className="pb-3 text-center w-16">UAS (25%)</th>
                  <th className="pb-3 text-center w-24">Nilai Akhir</th>
                  <th className="pb-3 text-center w-16">Huruf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {students.map((student) => (
                  <tr key={student.nim} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3 pl-2">
                      <span className="font-bold text-slate-800 dark:text-white">{student.name}</span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{student.nim}</p>
                    </td>
                    <td className="py-3 text-center">
                      <input 
                        type="number"
                        value={student.grades.tugas}
                        onChange={(e) => handleGradeChange(student.nim, 'tugas', e.target.value)}
                        className="w-12 text-center p-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input 
                        type="number"
                        value={student.grades.kuis}
                        onChange={(e) => handleGradeChange(student.nim, 'kuis', e.target.value)}
                        className="w-12 text-center p-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input 
                        type="number"
                        value={student.grades.praktikum}
                        onChange={(e) => handleGradeChange(student.nim, 'praktikum', e.target.value)}
                        className="w-12 text-center p-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input 
                        type="number"
                        value={student.grades.uts}
                        onChange={(e) => handleGradeChange(student.nim, 'uts', e.target.value)}
                        className="w-12 text-center p-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input 
                        type="number"
                        value={student.grades.uas}
                        onChange={(e) => handleGradeChange(student.nim, 'uas', e.target.value)}
                        className="w-12 text-center p-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center font-extrabold text-blue-600 dark:text-blue-400 font-mono text-sm">
                      {student.grades.final}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        student.grades.gradeLetter === 'A' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' :
                        student.grades.gradeLetter === 'B' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' :
                        student.grades.gradeLetter === 'C' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' :
                        'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                      }`}>
                        {student.grades.gradeLetter}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. KELOLA TUGAS */}
      {subTab === 'kelola-tugas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Task Form */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-blue-500" /> Buat Tugas Baru
            </h4>
            <form onSubmit={handleCreateTugas} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Mata Kuliah / Kelas</label>
                <select 
                  value={tugasClass}
                  onChange={(e) => setTugasClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="IF3110-A">IF3110 - Pengembangan Web (IF-39-01)</option>
                  <option value="IF3150-B">IF3150 - Sistem Operasi (IF-39-02)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Judul Tugas</label>
                <input 
                  type="text" 
                  value={tugasTitle}
                  onChange={(e) => setTugasTitle(e.target.value)}
                  placeholder="Contoh: Tugas 3: Desain REST API"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Deskripsi Soal & Ketentuan</label>
                <textarea 
                  rows={4}
                  value={tugasDesc}
                  onChange={(e) => setTugasDesc(e.target.value)}
                  placeholder="Masukkan spesifikasi tugas..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Batas Pengumpulan (Deadline)</label>
                <input 
                  type="text" 
                  value={tugasDeadline}
                  onChange={(e) => setTugasDeadline(e.target.value)}
                  placeholder="Contoh: 2026-07-20 23:59"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                Buat & Rilis Tugas
              </button>
            </form>
          </div>

          {/* Active Tasks list */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Daftar Tugas & Pengumpulan Mahasiswa</h4>
            <div className="space-y-4">
              {tugas.map((task) => (
                <div key={task.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                        {task.classId}
                      </span>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-white mt-1">{task.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>
                    </div>
                    <span className="text-[10px] text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">
                      DL: {task.deadline}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Mengumpulkan: <strong className="text-blue-600">{task.submissionsCount} / {students.length}</strong> Mahasiswa
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onShowToast(`Menampilkan semua file jawaban untuk ${task.title}`)}
                        className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lihat
                      </button>
                      <button 
                        onClick={() => onShowToast(`Mengunduh semua lembar jawaban ${task.title} (ZIP)`)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Unduh ZIP
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. KELOLA MATERI */}
      {subTab === 'kelola-materi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" /> Unggah Materi Baru
            </h4>
            <form onSubmit={handleUploadMateri} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Mata Kuliah</label>
                <select 
                  value={materiClass}
                  onChange={(e) => setMateriClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="IF3110-A">IF3110 - Pengembangan Web (IF-39-01)</option>
                  <option value="IF3150-B">IF3150 - Sistem Operasi (IF-39-02)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Judul Materi</label>
                <input 
                  type="text" 
                  value={materiTitle}
                  onChange={(e) => setMateriTitle(e.target.value)}
                  placeholder="Contoh: Modul Kuliah Bab 4"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Jenis File</label>
                  <select 
                    value={materiType}
                    onChange={(e) => setMateriType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="PPT">PPT</option>
                    <option value="Video">Video</option>
                    <option value="Modul">Modul</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Nama File Simulasi</label>
                  <input 
                    type="text" 
                    value={materiFileName}
                    onChange={(e) => setMateriFileName(e.target.value)}
                    placeholder="bab4_rest_api.pdf"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                Unggah & Publikasikan
              </button>
            </form>
          </div>

          {/* History and deletion table */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Riwayat Dokumen Materi Terunggah</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <th className="pb-3 pl-2">Materi</th>
                    <th className="pb-3 text-center">Tipe</th>
                    <th className="pb-3">Nama File</th>
                    <th className="pb-3 text-center">Ukuran</th>
                    <th className="pb-3 text-right pr-2">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {materi.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="py-3 pl-2 font-bold text-slate-800 dark:text-slate-200">
                        {item.title}
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.classId} &bull; {item.uploadedAt}</p>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          item.type === 'PDF' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600' :
                          item.type === 'PPT' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' :
                          item.type === 'Video' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' :
                          'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-500 text-[11px]">{item.fileName}</td>
                      <td className="py-3 text-center text-slate-400 text-[11px]">{item.fileSize}</td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => onShowToast(`Mengunduh file: ${item.fileName}`)}
                            className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                            title="Unduh File"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMateri(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Hapus Materi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
