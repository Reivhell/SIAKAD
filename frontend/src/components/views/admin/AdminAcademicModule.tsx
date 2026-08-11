import React, { useState } from 'react';
import {
  AdminAcademicYear,
  AdminClass,
  AdminSchedule,
  AdminKrsItem,
  AdminCourse,
  AdminStudent,
  AdminLecturer,
  AdminRoom
} from '../../../api/academic.api';
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Search,
  BookOpen,
  Eye,
  FileSpreadsheet,
  X,
  Check,
  Award,
  Layers
} from 'lucide-react';

interface AdminAcademicModuleProps {
  activeTab: string;
  academicYears: AdminAcademicYear[];
  setAcademicYears: React.Dispatch<React.SetStateAction<AdminAcademicYear[]>>;
  classes: AdminClass[];
  setClasses: React.Dispatch<React.SetStateAction<AdminClass[]>>;
  schedules: AdminSchedule[];
  setSchedules: React.Dispatch<React.SetStateAction<AdminSchedule[]>>;
  krsData: AdminKrsItem[];
  setKrsData: React.Dispatch<React.SetStateAction<AdminKrsItem[]>>;
  courses: AdminCourse[];
  setCourses: React.Dispatch<React.SetStateAction<AdminCourse[]>>;
  students: AdminStudent[];
  lecturers: AdminLecturer[];
  rooms: AdminRoom[];
  curriculums: any[];
  setCurriculums: React.Dispatch<React.SetStateAction<any[]>>;
  onShowToast: (message: string) => void;
}

export function AdminAcademicModule({
  activeTab,
  academicYears,
  setAcademicYears,
  classes,
  setClasses,
  schedules,
  setSchedules,
  krsData,
  setKrsData,
  courses,
  setCourses,
  students,
  lecturers,
  rooms,
  curriculums,
  setCurriculums,
  onShowToast
}: AdminAcademicModuleProps) {
  // Common states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>({});

  // View Details Sub-Modals
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState<any>(null);

  // Clash detection variables
  const [scheduleConflict, setScheduleConflict] = useState<string | null>(null);

  // Time conversion helper (e.g. "08:00" -> 480 minutes)
  const timeToMinutes = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  // Conflict Checker for Schedules
  const checkScheduleConflict = (
    schedId: string | null,
    classId: string,
    hari: string,
    mulai: string,
    selesai: string,
    ruangId: string
  ): string | null => {
    const startMin = timeToMinutes(mulai);
    const endMin = timeToMinutes(selesai);
    if (endMin <= startMin) {
      return 'Waktu selesai harus lebih lambat dari waktu mulai perkuliahan.';
    }

    // Get current class's lecturer
    const currentClass = classes.find(c => c.id === classId);
    if (!currentClass) return null;
    const lecturerId = currentClass.dosenId;

    for (const other of schedules) {
      // Skip editing self
      if (schedId && other.id === schedId) continue;

      if (other.hari === hari) {
        const otherStart = timeToMinutes(other.jamMulai);
        const otherEnd = timeToMinutes(other.jamSelesai);

        // Check time overlapping
        const isOverlapping = startMin < otherEnd && endMin > otherStart;

        if (isOverlapping) {
          // 1. Room Clash
          if (other.ruangId === ruangId) {
            const roomObj = rooms.find(r => r.id === ruangId);
            return `BENTROK RUANGAN: Ruang ${roomObj?.kode || ruangId} sedang digunakan oleh kelas lain pada hari ${hari} pukul ${other.jamMulai} - ${other.jamSelesai}.`;
          }

          // 2. Lecturer Clash
          const otherClass = classes.find(c => c.id === other.classId);
          if (otherClass && otherClass.dosenId === lecturerId) {
            return `BENTROK DOSEN: Dosen ${currentClass.dosenName} sudah memiliki jadwal mengajar kelas lain (${otherClass.namaMK}) pada hari ${hari} pukul ${other.jamMulai} - ${other.jamSelesai}.`;
          }
        }
      }
    }
    return null;
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Specific Schedule Conflict Checks
    if (activeTab === 'admin-jadwal-kuliah') {
      const conflict = checkScheduleConflict(
        modalMode === 'edit' ? selectedId : null,
        formData.classId,
        formData.hari,
        formData.jamMulai,
        formData.jamSelesai,
        formData.ruangId
      );

      if (conflict) {
        setScheduleConflict(conflict);
        return; // Prevent save
      }
      setScheduleConflict(null);
    }

    if (modalMode === 'add') {
      const newId = `acad-${Date.now()}`;
      const recordWithId = { ...formData, id: newId };

      switch (activeTab) {
        case 'admin-tahun-akademik':
          setAcademicYears(prev => [...prev, recordWithId as AdminAcademicYear]);
          break;
        case 'admin-kurikulum':
          setCurriculums(prev => [...prev, recordWithId]);
          break;
        case 'admin-kelas-kuliah':
          // Resolve course name and SKS
          const matchedCourse = courses.find(c => c.kode === formData.kodeMK);
          const matchedDosen = lecturers.find(l => l.id === formData.dosenId);
          const fullClass = {
            ...recordWithId,
            namaMK: matchedCourse?.nama || 'Mata Kuliah Baru',
            sks: matchedCourse?.sks || 3,
            dosenName: matchedDosen?.name || 'Dosen Belum Ditunjuk',
            pesertaCount: 0
          };
          setClasses(prev => [...prev, fullClass as AdminClass]);
          break;
        case 'admin-jadwal-kuliah':
          setSchedules(prev => [...prev, recordWithId as AdminSchedule]);
          break;
      }
      onShowToast(`Berhasil menambahkan data akademik baru.`);
    } else {
      // Edit
      switch (activeTab) {
        case 'admin-tahun-akademik':
          setAcademicYears(prev => prev.map(y => y.id === selectedId ? { ...y, ...formData } : y));
          break;
        case 'admin-kurikulum':
          setCurriculums(prev => prev.map(c => c.id === selectedId ? { ...c, ...formData } : c));
          break;
        case 'admin-kelas-kuliah':
          const matchedCourse = courses.find(c => c.kode === formData.kodeMK);
          const matchedDosen = lecturers.find(l => l.id === formData.dosenId);
          const updatedClassObj = {
            ...formData,
            namaMK: matchedCourse?.nama || formData.namaMK,
            sks: matchedCourse?.sks || formData.sks,
            dosenName: matchedDosen?.name || formData.dosenName
          };
          setClasses(prev => prev.map(c => c.id === selectedId ? { ...c, ...updatedClassObj } : c));
          break;
        case 'admin-jadwal-kuliah':
          setSchedules(prev => prev.map(s => s.id === selectedId ? { ...s, ...formData } : s));
          break;
      }
      onShowToast(`Berhasil memperbarui data akademik.`);
    }

    setIsModalOpen(false);
    setFormData({});
    setSelectedId(null);
  };

  // Toggle active status for academic year
  const handleToggleYearActive = (id: string) => {
    setAcademicYears(prev => prev.map(y => {
      if (y.id === id) {
        return { ...y, isAktif: true };
      }
      return { ...y, isAktif: false };
    }));
    onShowToast(`Tahun akademik terpilih berhasil diaktifkan.`);
  };

  // Toggle KRS open/close for academic year
  const handleToggleKrsBuka = (id: string, currentVal: boolean) => {
    setAcademicYears(prev => prev.map(y => y.id === id ? { ...y, isKrsBuka: !currentVal } : y));
    onShowToast(`Periode pengisian KRS berhasil ${!currentVal ? 'DIBUKA' : 'DITUTUP'}.`);
  };

  // KRS Approvals
  const handleKrsStatus = (krsId: string, status: 'Disetujui' | 'Revisi') => {
    setKrsData(prev => prev.map(k => k.id === krsId ? { ...k, status: status } : k));
    onShowToast(`Pengajuan KRS Mahasiswa berhasil di-set: ${status}`);
  };

  // Open Add Modals
  const handleOpenAdd = () => {
    setFormData({});
    setSelectedId(null);
    setModalMode('add');
    setScheduleConflict(null);

    if (activeTab === 'admin-tahun-akademik') {
      setFormData({ semester: 'Ganjil', isAktif: false, isKrsBuka: false });
    } else if (activeTab === 'admin-kurikulum') {
      setFormData({ status: 'Draft', totalSks: 144 });
    } else if (activeTab === 'admin-kelas-kuliah') {
      setFormData({ kelas: 'A', kapasitas: 40 });
    } else if (activeTab === 'admin-jadwal-kuliah') {
      setFormData({ hari: 'Senin', jamMulai: '08:00', jamSelesai: '10:30' });
    }

    setIsModalOpen(true);
  };

  // Open Edit Modals
  const handleOpenEdit = (item: any) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setFormData({ ...item });
    setScheduleConflict(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus rekap akademik ini?')) {
      switch (activeTab) {
        case 'admin-tahun-akademik':
          setAcademicYears(prev => prev.filter(y => y.id !== id));
          break;
        case 'admin-kurikulum':
          setCurriculums(prev => prev.filter(c => c.id !== id));
          break;
        case 'admin-kelas-kuliah':
          setClasses(prev => prev.filter(c => c.id !== id));
          break;
        case 'admin-jadwal-kuliah':
          setSchedules(prev => prev.filter(s => s.id !== id));
          break;
      }
      onShowToast('Data akademik berhasil dihapus.');
    }
  };

  // Filter schedules and classes matching search
  const filteredClasses = classes.filter(c =>
    c.namaMK.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.kodeMK.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dosenName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSchedules = schedules.filter(s => {
    const parentClass = classes.find(c => c.id === s.classId);
    return parentClass?.namaMK.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parentClass?.kodeMK.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredKrs = krsData.filter(k =>
    k.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.studentNim.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Tab Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Manajemen Akademik &gt; {
              activeTab === 'admin-tahun-akademik' ? 'Tahun Akademik' :
              activeTab === 'admin-kurikulum' ? 'Kurikulum' :
              activeTab === 'admin-kelas-kuliah' ? 'Kelas Kuliah' :
              activeTab === 'admin-jadwal-kuliah' ? 'Jadwal Mengajar' :
              activeTab === 'admin-krs' ? 'Rencana Studi (KRS)' : 'KHS & Kelulusan'
            }
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Kelola kalender universitas, plotting jadwal bebas bentrok, sirkulasi kelas, dan audit KRS/KHS mahasiswa.
          </p>
        </div>
        {['admin-tahun-akademik', 'admin-kurikulum', 'admin-kelas-kuliah', 'admin-jadwal-kuliah'].includes(activeTab) && (
          <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Tambah Data
          </button>
        )}
      </div>

      {/* Control Filters */}
      {['admin-kelas-kuliah', 'admin-jadwal-kuliah', 'admin-krs', 'admin-khs'].includes(activeTab) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari matakuliah, NIM, atau dosen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
      )}

      {/* 1. TAHUN AKADEMIK TAB */}
      {activeTab === 'admin-tahun-akademik' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicYears.map((year) => (
            <div
              key={year.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 space-y-4 shadow-sm transition-colors flex flex-col justify-between ${
                year.isAktif ? 'ring-2 ring-blue-500 border-transparent bg-blue-50/10' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                    {year.semester}
                  </span>
                  {year.isAktif && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Aktif Semester Ini
                    </span>
                  )}
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-2">
                  Tahun Ajaran {year.tahunAjaran}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-3">
                <div className="flex justify-between items-center font-semibold">
                  <span>Masa Pengisian KRS:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    year.isKrsBuka ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                  }`}>
                    {year.isKrsBuka ? 'DIBUKA' : 'DITUTUP'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                {!year.isAktif && (
                  <button
                    onClick={() => handleToggleYearActive(year.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                  >
                    Set Ganjil/Genap Aktif
                  </button>
                )}
                <button
                  onClick={() => handleToggleKrsBuka(year.id, year.isKrsBuka)}
                  className={`w-full py-2 font-bold text-xs rounded-xl border transition-colors ${
                    year.isKrsBuka
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-950/20 dark:border-red-900/60 dark:text-red-400'
                      : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-950/20 dark:border-green-900/60 dark:text-green-400'
                  }`}
                >
                  {year.isKrsBuka ? 'Tutup Pengisian KRS' : 'Buka Pengisian KRS'}
                </button>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => handleOpenEdit(year)} className="flex-1 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(year.id)} className="flex-1 py-1.5 border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-[10px] font-bold">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. KURIKULUM TAB */}
      {activeTab === 'admin-kurikulum' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500r border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Kode Kurikulum</th>
                <th className="px-6 py-4">Nama Dokumen Kurikulum</th>
                <th className="px-6 py-4">SKS Kelulusan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {curriculums.map((curr) => (
                <tr key={curr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{curr.kode}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{curr.nama}</td>
                  <td className="px-6 py-4 font-semibold text-slate-500">{curr.totalSks} SKS</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      curr.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-950/40' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {curr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenEdit(curr)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(curr.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. KELAS KULIAH TAB */}
      {activeTab === 'admin-kelas-kuliah' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500r border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Mata Kuliah</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">SKS</th>
                <th className="px-6 py-4">Dosen Pengampu</th>
                <th className="px-6 py-4">Kapasitas</th>
                <th className="px-6 py-4">Peserta Terdaftar</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded text-[10px]">
                      {cls.kodeMK}
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{cls.namaMK}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-500">{cls.kelas}</td>
                  <td className="px-6 py-4 text-slate-500">{cls.sks} SKS</td>
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{cls.dosenName}</td>
                  <td className="px-6 py-4 text-slate-500">{cls.kapasitas} Mhs</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      cls.pesertaCount >= cls.kapasitas ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                    }`}>
                      {cls.pesertaCount} / {cls.kapasitas} Mahasiswa
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setDetailsItem({
                            ...cls,
                            studentsList: students.slice(0, cls.pesertaCount || 3) // simulate enrolled students list
                          });
                          setIsDetailsOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 rounded flex items-center gap-1 text-[10px] font-bold border border-slate-200 dark:border-slate-800"
                        title="Daftar Mahasiswa"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Mahasiswa
                      </button>
                      <button onClick={() => handleOpenEdit(cls)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cls.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. JADWAL KULIAH TAB */}
      {activeTab === 'admin-jadwal-kuliah' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500r border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Mata Kuliah / Kelas</th>
                <th className="px-6 py-4">Dosen Pengampu</th>
                <th className="px-6 py-4">Hari / Waktu</th>
                <th className="px-6 py-4">Ruangan</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredSchedules.map((sched) => {
                const parentClass = classes.find(c => c.id === sched.classId);
                const roomObj = rooms.find(r => r.id === sched.ruangId);
                return (
                  <tr key={sched.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded text-[10px]">
                          {parentClass?.kodeMK}
                        </span>
                        <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Kelas {parentClass?.kelas}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{parentClass?.namaMK}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">{parentClass?.dosenName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        {sched.hari}, {sched.jamMulai} - {sched.jamSelesai}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {roomObj?.nama || sched.ruangId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(sched)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 rounded">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(sched.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. KRS MONITORING TAB */}
      {activeTab === 'admin-krs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500r border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Mahasiswa (NIM)</th>
                <th className="px-6 py-4">Program Studi</th>
                <th className="px-6 py-4">SKS Diambil</th>
                <th className="px-6 py-4">Status Pengajuan</th>
                <th className="px-6 py-4 text-center">Tindakan Akademis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredKrs.map((krs) => (
                <tr key={krs.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{krs.studentName}</p>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">NIM: {krs.studentNim}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-semibold">{krs.prodi}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{krs.sksDiambil} SKS</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      krs.status === 'Disetujui' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                      krs.status === 'Diajukan' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse' :
                      krs.status === 'Revisi' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {krs.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setDetailsItem({
                            ...krs,
                            fullCourses: krs.courses.map(code => courses.find(c => c.kode === code) || { kode: code, nama: 'Mata Kuliah Pilihan', sks: 3 })
                          });
                          setIsDetailsOpen(true);
                        }}
                        className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Mata Kuliah ({krs.courses.length})
                      </button>
                      {krs.status === 'Diajukan' && (
                        <>
                          <button
                            onClick={() => handleKrsStatus(krs.id, 'Disetujui')}
                            className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 rounded-lg"
                            title="Setujui KRS"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleKrsStatus(krs.id, 'Revisi')}
                            className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 rounded-lg"
                            title="Minta Revisi"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. KHS MONITORING TAB */}
      {activeTab === 'admin-khs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500r border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Mahasiswa (NIM)</th>
                <th className="px-6 py-4">Program Studi</th>
                <th className="px-6 py-4 text-center">IP Semester (IPS)</th>
                <th className="px-6 py-4 text-center">IP Kumulatif (IPK)</th>
                <th className="px-6 py-4 text-center font-bold">Total SKS Tempuh</th>
                <th className="px-6 py-4 text-center">Aksi Akademik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {students.filter(s => s.status === 'Aktif').map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{student.name}</p>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">NIM: {student.nim}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-semibold">{student.prodi}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400">
                    {(student.gpa * 0.98 + 0.05).toFixed(2)} {/* simulate IPS based on GPA */}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400">{student.gpa.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-500">84 SKS</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          const mockKhsDetails = {
                            studentNim: student.nim,
                            studentName: student.name,
                            gpa: student.gpa,
                            prodi: student.prodi,
                            nilai: [
                              { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, nilaiAngka: 85, nilaiHuruf: 'A' },
                              { code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, nilaiAngka: 78, nilaiHuruf: 'AB' },
                              { code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, nilaiAngka: 90, nilaiHuruf: 'A' }
                            ]
                          };
                          setDetailsItem(mockKhsDetails);
                          setIsDetailsOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-200 dark:border-blue-900/50 flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Lihat Transkrip & KHS
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Unified Academic Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-zoomIn">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-whiter">
                {modalMode === 'add' ? 'Tambah' : 'Ubah'} Rekap Akademik
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Conflict banner inside schedule modal if any */}
              {activeTab === 'admin-jadwal-kuliah' && scheduleConflict && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 p-3.5 rounded-xl text-xs flex gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 animate-bounce" />
                  <div>
                    <p className="font-extrabold text-[11px]r">Bentrok Terdeteksi!</p>
                    <p className="mt-1 font-semibold leading-relaxed text-[10px]">{scheduleConflict}</p>
                  </div>
                </div>
              )}

              {activeTab === 'admin-tahun-akademik' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun Ajaran</label>
                    <input
                      type="text"
                      required
                      value={formData.tahunAjaran || ''}
                      onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: 2025/2026"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Semester</label>
                    <select
                      value={formData.semester || 'Ganjil'}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'admin-kurikulum' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Kode Kurikulum</label>
                    <input
                      type="text"
                      required
                      value={formData.kode || ''}
                      onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: KUR2025"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Kurikulum</label>
                    <input
                      type="text"
                      required
                      value={formData.nama || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: Kurikulum Merdeka Belajar 2025"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Total SKS Syarat</label>
                      <input
                        type="number"
                        required
                        value={formData.totalSks || 144}
                        onChange={(e) => setFormData({ ...formData, totalSks: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                      <select
                        value={formData.status || 'Draft'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Arsip">Arsip</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'admin-kelas-kuliah' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Mata Kuliah</label>
                    <select
                      required
                      value={formData.kodeMK || ''}
                      onChange={(e) => setFormData({ ...formData, kodeMK: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="">Pilih Mata Kuliah</option>
                      {courses.map(c => <option key={c.id} value={c.kode}>({c.kode}) {c.nama}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Kelas (e.g. A, K-01)</label>
                      <input
                        type="text"
                        required
                        value={formData.kelas || ''}
                        onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: K-01"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Kapasitas Kelas (Mhs)</label>
                      <input
                        type="number"
                        required
                        min="5"
                        max="100"
                        value={formData.kapasitas || 40}
                        onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Dosen Pengampu</label>
                    <select
                      required
                      value={formData.dosenId || ''}
                      onChange={(e) => setFormData({ ...formData, dosenId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="">Pilih Dosen Pengampu</option>
                      {lecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'admin-jadwal-kuliah' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Kelas Perkuliahan</label>
                    <select
                      required
                      value={formData.classId || ''}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="">Pilih Kelas</option>
                      {classes.map(c => <option key={c.id} value={c.id}>Kelas {c.kelas} &bull; {c.namaMK} ({c.dosenName})</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Hari</label>
                    <select
                      value={formData.hari || 'Senin'}
                      onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                      <option value="Kamis">Kamis</option>
                      <option value="Jumat">Jumat</option>
                      <option value="Sabtu">Sabtu</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Jam Mulai</label>
                      <input
                        type="text"
                        required
                        value={formData.jamMulai || '08:00'}
                        onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: 08:00"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Jam Selesai</label>
                      <input
                        type="text"
                        required
                        value={formData.jamSelesai || '10:30'}
                        onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: 10:30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Ruangan Kuliah</label>
                    <select
                      required
                      value={formData.ruangId || ''}
                      onChange={(e) => setFormData({ ...formData, ruangId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="">Pilih Ruangan</option>
                      {rooms.filter(r => r.status === 'Tersedia').map(r => <option key={r.id} value={r.id}>{r.nama}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Sub-Modal (List of Students, KRS details, or KHS details) */}
      {isDetailsOpen && detailsItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-zoomIn flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 flex-shrink-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-whiter">
                {activeTab === 'admin-kelas-kuliah' ? 'Peserta Kelas Perkuliahan' :
                  activeTab === 'admin-krs' ? `Detail Rencana Studi: ${detailsItem.studentName}` : `Transkrip Hasil Studi (KHS): ${detailsItem.studentName}`}
              </h3>
              <button onClick={() => { setIsDetailsOpen(false); setDetailsItem(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* 1. Class List Enrollment Details */}
              {activeTab === 'admin-kelas-kuliah' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-850/80">
                    <p className="text-xs font-bold text-slate-400 uppercase">Mata Kuliah</p>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">({detailsItem.kodeMK}) {detailsItem.namaMK}</p>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Dosen:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{detailsItem.dosenName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Kelas & Kapasitas:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold">Kelas {detailsItem.kelas} ({detailsItem.pesertaCount} / {detailsItem.kapasitas} Mhs)</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-500r">Daftar Mahasiswa Terdaftar</h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-850/80 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950">
                    {detailsItem.studentsList.map((st: any) => (
                      <div key={st.id} className="p-3.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{st.name}</p>
                          <p className="font-mono text-[10px] text-slate-400 mt-0.5">NIM: {st.nim}</p>
                        </div>
                        <span className="text-slate-500 font-bold">{st.prodi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. KRS course choice review */}
              {activeTab === 'admin-krs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-850/80">
                      <span className="text-slate-400 font-bold block uppercase text-[9px]">Mahasiswa</span>
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold text-xs block mt-1">{detailsItem.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">NIM: {detailsItem.studentNim}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-850/80">
                      <span className="text-slate-400 font-bold block uppercase text-[9px]">SKS DISETUJUI</span>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold text-base block mt-1">{detailsItem.sksDiambil} SKS</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-0.5 block uppercase">Status: {detailsItem.status}</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-500r">Mata Kuliah Yang Diajukan</h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-850/80 rounded-xl overflow-hidden">
                    {detailsItem.fullCourses.map((c: any, index: number) => (
                      <div key={index} className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-50/50">
                        <div>
                          <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded text-[10px]">
                            {c.kode}
                          </span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{c.nama}</p>
                        </div>
                        <span className="font-extrabold text-slate-500">{c.sks} SKS</span>
                      </div>
                    ))}
                  </div>

                  {detailsItem.status === 'Diajukan' && (
                    <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-850/80 flex-shrink-0">
                      <button
                        onClick={() => {
                          handleKrsStatus(detailsItem.id, 'Disetujui');
                          setIsDetailsOpen(false);
                        }}
                        className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Setujui KRS Sekarang
                      </button>
                      <button
                        onClick={() => {
                          handleKrsStatus(detailsItem.id, 'Revisi');
                          setIsDetailsOpen(false);
                        }}
                        className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-bold text-xs rounded-xl transition-colors"
                      >
                        Minta Revisi
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. KHS / Transcript details */}
              {activeTab === 'admin-khs' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-850/80 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Mahasiswa</span>
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold text-xs block mt-1">{detailsItem.studentName}</span>
                      <span className="text-slate-400 font-mono mt-0.5 block">{detailsItem.studentNim}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Indeks Kumulatif</span>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xl block mt-1">IPK {detailsItem.gpa.toFixed(2)}</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-500r">Nilai Semester Aktif</h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-850/80 rounded-xl overflow-hidden text-xs">
                    {detailsItem.nilai.map((n: any, idx: number) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center hover:bg-slate-50/50">
                        <div>
                          <span className="font-mono font-bold text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                            {n.code}
                          </span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{n.name}</p>
                          <span className="text-[10px] text-slate-400 font-medium">SKS: {n.sks} &bull; Nilai Angka: {n.nilaiAngka}</span>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-extrabold flex items-center justify-center text-xs">
                          {n.nilaiHuruf}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Generate transcript simulation */}
                  <button
                    onClick={() => {
                      onShowToast(`Mengekspor berkas KHS Transkrip untuk ${detailsItem.studentName}...`);
                      setIsDetailsOpen(false);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Cetak KHS Mahasiswa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
