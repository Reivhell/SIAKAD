import React, { useState } from 'react';
import {
  AdminUser,
  AdminStudent,
  AdminLecturer,
  AdminProdi,
  AdminCourse,
  AdminRoom
} from '../../../data/adminMockData';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Key,
  Shield,
  FileSpreadsheet,
  FileText,
  X,
  Check,
  Power,
  Layers,
  Building,
  BookOpen,
  UserCheck,
  FolderOpen
} from 'lucide-react';

interface AdminMasterDataModuleProps {
  activeTab: string;
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  students: AdminStudent[];
  setStudents: React.Dispatch<React.SetStateAction<AdminStudent[]>>;
  lecturers: AdminLecturer[];
  setLecturers: React.Dispatch<React.SetStateAction<AdminLecturer[]>>;
  prodis: AdminProdi[];
  setProdis: React.Dispatch<React.SetStateAction<AdminProdi[]>>;
  courses: AdminCourse[];
  setCourses: React.Dispatch<React.SetStateAction<AdminCourse[]>>;
  rooms: AdminRoom[];
  setRooms: React.Dispatch<React.SetStateAction<AdminRoom[]>>;
  onShowToast: (message: string) => void;
}

export function AdminMasterDataModule({
  activeTab,
  users,
  setUsers,
  students,
  setStudents,
  lecturers,
  setLecturers,
  prodis,
  setProdis,
  courses,
  setCourses,
  rooms,
  setRooms,
  onShowToast
}: AdminMasterDataModuleProps) {
  // State for search queries and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [prodiFilter, setProdiFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Modal and CRUD Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form Fields (unified record for any entity)
  const [formData, setFormData] = useState<any>({});

  // Excel Import Simulated states
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Helper title & labels based on active tab
  const getTabLabel = () => {
    switch (activeTab) {
      case 'admin-mahasiswa': return 'Mahasiswa';
      case 'admin-dosen': return 'Dosen';
      case 'admin-prodi': return 'Program Studi';
      case 'admin-matakuliah': return 'Mata Kuliah';
      case 'admin-ruangan': return 'Ruangan';
      case 'admin-user': return 'User & Akun';
      default: return 'Data';
    }
  };

  // Filter lists based on search and selected options
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();
    switch (activeTab) {
      case 'admin-mahasiswa':
        return students.filter(s => 
          (s.name.toLowerCase().includes(query) || s.nim.includes(query)) &&
          (prodiFilter === 'Semua' || s.prodi === prodiFilter) &&
          (statusFilter === 'Semua' || s.status === statusFilter)
        );
      case 'admin-dosen':
        return lecturers.filter(l => 
          (l.name.toLowerCase().includes(query) || l.nidn.includes(query)) &&
          (prodiFilter === 'Semua' || l.prodi === prodiFilter) &&
          (statusFilter === 'Semua' || l.status === statusFilter)
        );
      case 'admin-prodi':
        return prodis.filter(p => 
          p.nama.toLowerCase().includes(query) || p.kode.toLowerCase().includes(query)
        );
      case 'admin-matakuliah':
        return courses.filter(c => 
          (c.nama.toLowerCase().includes(query) || c.kode.toLowerCase().includes(query)) &&
          (prodiFilter === 'Semua' || c.prodi === prodiFilter)
        );
      case 'admin-ruangan':
        return rooms.filter(r => 
          (r.nama.toLowerCase().includes(query) || r.kode.toLowerCase().includes(query)) &&
          (statusFilter === 'Semua' || r.status === statusFilter)
        );
      case 'admin-user':
        return users.filter(u => 
          (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)) &&
          (statusFilter === 'Semua' || u.status === statusFilter) &&
          (prodiFilter === 'Semua' || u.role === prodiFilter.toLowerCase())
        );
      default:
        return [];
    }
  };

  const filteredItems = getFilteredData();

  // Reset form inputs
  const resetForm = () => {
    setFormData({});
    setSelectedId(null);
    setModalMode('add');
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    resetForm();
    setModalMode('add');
    
    // Set some defaults based on entity
    if (activeTab === 'admin-mahasiswa') {
      setFormData({ status: 'Aktif', angkatan: '2026', gpa: 0.0 });
    } else if (activeTab === 'admin-dosen') {
      setFormData({ status: 'Aktif', jabatan: 'Asisten Ahli' });
    } else if (activeTab === 'admin-prodi') {
      setFormData({ jenjang: 'S1', akreditasi: 'A' });
    } else if (activeTab === 'admin-matakuliah') {
      setFormData({ sks: 3, semester: 1, type: 'Wajib' });
    } else if (activeTab === 'admin-ruangan') {
      setFormData({ status: 'Tersedia', kapasitas: 40 });
    } else if (activeTab === 'admin-user') {
      setFormData({ role: 'mahasiswa', status: 'Aktif' });
    }
    
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: any) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Delete Entity Handler
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${name}" dari sistem?`)) {
      switch (activeTab) {
        case 'admin-mahasiswa':
          setStudents(prev => prev.filter(s => s.id !== id));
          break;
        case 'admin-dosen':
          setLecturers(prev => prev.filter(l => l.id !== id));
          break;
        case 'admin-prodi':
          setProdis(prev => prev.filter(p => p.id !== id));
          break;
        case 'admin-matakuliah':
          setCourses(prev => prev.filter(c => c.id !== id));
          break;
        case 'admin-ruangan':
          setRooms(prev => prev.filter(r => r.id !== id));
          break;
        case 'admin-user':
          setUsers(prev => prev.filter(u => u.id !== id));
          break;
      }
      onShowToast(`Berhasil menghapus data ${getTabLabel()}: ${name}`);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const newId = `ent-${Date.now()}`;
      const recordWithId = { ...formData, id: newId };

      switch (activeTab) {
        case 'admin-mahasiswa':
          setStudents(prev => [...prev, recordWithId as AdminStudent]);
          // Also auto-create a user account for them!
          const newStudentUser: AdminUser = {
            id: `usr-${Date.now()}`,
            name: formData.name,
            email: formData.email || `${formData.nim}@student.siakad.ac.id`,
            role: 'mahasiswa',
            status: 'Aktif',
            phone: formData.phone
          };
          setUsers(prev => [...prev, newStudentUser]);
          break;
        case 'admin-dosen':
          setLecturers(prev => [...prev, recordWithId as AdminLecturer]);
          // Also auto-create a user account for them!
          const newDosenUser: AdminUser = {
            id: `usr-${Date.now()}`,
            name: formData.name,
            email: formData.email || `${formData.nidn}@siakad.ac.id`,
            role: 'dosen',
            status: 'Aktif',
            phone: formData.phone
          };
          setUsers(prev => [...prev, newDosenUser]);
          break;
        case 'admin-prodi':
          setProdis(prev => [...prev, recordWithId as AdminProdi]);
          break;
        case 'admin-matakuliah':
          setCourses(prev => [...prev, recordWithId as AdminCourse]);
          break;
        case 'admin-ruangan':
          setRooms(prev => [...prev, recordWithId as AdminRoom]);
          break;
        case 'admin-user':
          setUsers(prev => [...prev, recordWithId as AdminUser]);
          break;
      }
      onShowToast(`Berhasil menambahkan data ${getTabLabel()}: ${formData.name || formData.nama}`);
    } else {
      // Edit mode
      switch (activeTab) {
        case 'admin-mahasiswa':
          setStudents(prev => prev.map(s => s.id === selectedId ? { ...s, ...formData } : s));
          break;
        case 'admin-dosen':
          setLecturers(prev => prev.map(l => l.id === selectedId ? { ...l, ...formData } : l));
          break;
        case 'admin-prodi':
          setProdis(prev => prev.map(p => p.id === selectedId ? { ...p, ...formData } : p));
          break;
        case 'admin-matakuliah':
          setCourses(prev => prev.map(c => c.id === selectedId ? { ...c, ...formData } : c));
          break;
        case 'admin-ruangan':
          setRooms(prev => prev.map(r => r.id === selectedId ? { ...r, ...formData } : r));
          break;
        case 'admin-user':
          setUsers(prev => prev.map(u => u.id === selectedId ? { ...u, ...formData } : u));
          break;
      }
      onShowToast(`Berhasil memperbarui data ${getTabLabel()}: ${formData.name || formData.nama}`);
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Toggle user active status shortcut
  const handleToggleUserStatus = (userItem: AdminUser) => {
    const nextStatus = userItem.status === 'Aktif' ? 'Non-Aktif' : 'Aktif';
    setUsers(prev => prev.map(u => u.id === userItem.id ? { ...u, status: nextStatus } : u));
    onShowToast(`Akun ${userItem.name} sekarang ${nextStatus}`);
  };

  // Reset password shortcut
  const handleResetPassword = (userItem: AdminUser) => {
    if (window.confirm(`Reset password untuk user "${userItem.name}"? Password baru akan di-set default: "siakad123".`)) {
      onShowToast(`Password untuk ${userItem.name} berhasil di-reset ke default: "siakad123".`);
    }
  };

  // Simulate Excel Import
  const handleImportExcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setIsUploading(true);
    setTimeout(() => {
      // Simulated parsing of excel
      const parsedStudents: AdminStudent[] = [
        { id: `imp-1-${Date.now()}`, nim: '10118991', name: 'Zaki Mubarak (Imported)', prodi: 'Teknik Informatika', angkatan: '2026', status: 'Aktif', gpa: 0.0, email: 'zaki@student.siakad.ac.id', phone: '081299990001' },
        { id: `imp-2-${Date.now()}`, nim: '10118992', name: 'Lia Lestari (Imported)', prodi: 'Sistem Informasi', angkatan: '2026', status: 'Aktif', gpa: 0.0, email: 'lia@student.siakad.ac.id', phone: '081299990002' }
      ];

      setStudents(prev => [...prev, ...parsedStudents]);
      // Create user accounts too
      parsedStudents.forEach(st => {
        setUsers(prev => [...prev, { id: `usr-${st.nim}`, name: st.name, email: st.email, role: 'mahasiswa', status: 'Aktif' }]);
      });

      setIsUploading(false);
      setIsImportOpen(false);
      setImportFile(null);
      onShowToast('Berhasil mengimpor 2 mahasiswa baru dari berkas Excel!');
    }, 2000);
  };

  // Simulating exports
  const handleExport = (type: 'pdf' | 'excel') => {
    onShowToast(`Mengunduh laporan rekap data ${getTabLabel()} (${type.toUpperCase()})...`);
    // Simulated anchor download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `rekap_${getTabLabel().toLowerCase()}_${Date.now()}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    setTimeout(() => {
      onShowToast(`Berkas rekap_${getTabLabel().toLowerCase()}.${type === 'excel' ? 'xlsx' : 'pdf'} berhasil diunduh!`);
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Master Data &gt; Kelola {getTabLabel()}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Lakukan operasi Tambah, Ubah, Hapus (CRUD) serta pengelolaan data transaksional sistem.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeTab === 'admin-mahasiswa' && (
            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
            >
              <Upload className="w-4 h-4" />
              Import Excel
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah {getTabLabel()}
          </button>
        </div>
      </div>

      {/* Filtering and Searching controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Cari nama, kode atau NIM...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
          {/* Show program studi filter for related tabs */}
          {['admin-mahasiswa', 'admin-dosen', 'admin-matakuliah', 'admin-user'].includes(activeTab) && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Prodi / Role</span>
              <select
                value={prodiFilter}
                onChange={(e) => setProdiFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-600 dark:text-slate-400 font-bold outline-none"
              >
                <option value="Semua">Semua</option>
                {activeTab === 'admin-user' ? (
                  <>
                    <option value="Admin">Admin</option>
                    <option value="Dosen">Dosen</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Kaprodi">Kaprodi</option>
                    <option value="Akademik">Akademik</option>
                  </>
                ) : (
                  prodis.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)
                )}
              </select>
            </div>
          )}

          {/* Show status filter for relevant tabs */}
          {['admin-mahasiswa', 'admin-dosen', 'admin-ruangan', 'admin-user'].includes(activeTab) && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-600 dark:text-slate-400 font-bold outline-none"
              >
                <option value="Semua">Semua</option>
                {activeTab === 'admin-mahasiswa' && (
                  <>
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Drop Out">Drop Out</option>
                  </>
                )}
                {activeTab === 'admin-dosen' && (
                  <>
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                    <option value="Tugas Belajar">Tugas Belajar</option>
                  </>
                )}
                {activeTab === 'admin-ruangan' && (
                  <>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Digunakan">Digunakan</option>
                    <option value="Perbaikan">Perbaikan</option>
                  </>
                )}
                {activeTab === 'admin-user' && (
                  <>
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Download Exports */}
          {['admin-mahasiswa', 'admin-dosen', 'admin-matakuliah'].includes(activeTab) && (
            <div className="flex gap-1.5">
              <button
                onClick={() => handleExport('excel')}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 rounded-xl transition-all"
                title="Unduh Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl transition-all"
                title="Unduh PDF"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table for lists */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Data Tidak Ditemukan</p>
              <p className="text-xs text-slate-400">Silakan tambahkan data baru atau bersihkan filter pencarian.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  {activeTab === 'admin-mahasiswa' && (
                    <>
                      <th className="px-6 py-4">NIM</th>
                      <th className="px-6 py-4">Nama Lengkap</th>
                      <th className="px-6 py-4">Program Studi</th>
                      <th className="px-6 py-4">Angkatan</th>
                      <th className="px-6 py-4 text-center">IPK</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </>
                  )}
                  {activeTab === 'admin-dosen' && (
                    <>
                      <th className="px-6 py-4">NIDN</th>
                      <th className="px-6 py-4">Nama Lengkap</th>
                      <th className="px-6 py-4">Jabatan Akademik</th>
                      <th className="px-6 py-4">Program Studi</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </>
                  )}
                  {activeTab === 'admin-prodi' && (
                    <>
                      <th className="px-6 py-4">Kode</th>
                      <th className="px-6 py-4">Nama Program Studi</th>
                      <th className="px-6 py-4">Jenjang</th>
                      <th className="px-6 py-4">Akreditasi</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </>
                  )}
                  {activeTab === 'admin-matakuliah' && (
                    <>
                      <th className="px-6 py-4">Kode MK</th>
                      <th className="px-6 py-4">Nama Mata Kuliah</th>
                      <th className="px-6 py-4">SKS</th>
                      <th className="px-6 py-4">Semester</th>
                      <th className="px-6 py-4">Program Studi</th>
                      <th className="px-6 py-4">Sifat</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </>
                  )}
                  {activeTab === 'admin-ruangan' && (
                    <>
                      <th className="px-6 py-4">Kode Ruang</th>
                      <th className="px-6 py-4">Nama Ruangan</th>
                      <th className="px-6 py-4">Kapasitas</th>
                      <th className="px-6 py-4">Lokasi Gedung</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </>
                  )}
                  {activeTab === 'admin-user' && (
                    <>
                      <th className="px-6 py-4">Nama User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Akun Keamanan</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {activeTab === 'admin-mahasiswa' && filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{item.nim}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">{item.prodi}</td>
                    <td className="px-6 py-4 text-slate-500">{item.angkatan}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">{item.gpa?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                        item.status === 'Cuti' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                        item.status === 'Lulus' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' :
                        'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Ubah">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'admin-dosen' && filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{item.nidn}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">{item.jabatan}</td>
                    <td className="px-6 py-4 text-slate-500">{item.prodi}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                        item.status === 'Non-Aktif' ? 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Ubah">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'admin-prodi' && filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{item.kode}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{item.nama}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">{item.jenjang}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Akreditasi {item.akreditasi}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Ubah">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'admin-matakuliah' && filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{item.kode}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{item.nama}</td>
                    <td className="px-6 py-4 text-slate-500">{item.sks} SKS</td>
                    <td className="px-6 py-4 text-slate-500">Semester {item.semester}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">{item.prodi}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'Wajib' ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Ubah">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'admin-ruangan' && filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{item.kode}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{item.nama}</td>
                    <td className="px-6 py-4 text-slate-500">{item.kapasitas} Kursi</td>
                    <td className="px-6 py-4 text-slate-500">{item.lokasi}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Tersedia' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                        item.status === 'Digunakan' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' :
                        'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Ubah">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'admin-user' && filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                      {item.phone && <p className="text-[10px] text-slate-400 mt-0.5">{item.phone}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 rounded text-[10px] font-bold capitalize">
                        <Shield className="w-3 h-3" />
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleUserStatus(item)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 rounded-lg text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80 transition-all flex items-center gap-1 text-[10px] font-bold"
                          title="Aktifkan/Non-aktifkan"
                        >
                          <Power className="w-3.5 h-3.5" />
                          {item.status === 'Aktif' ? 'Deaktif' : 'Aktifkan'}
                        </button>
                        <button
                          onClick={() => handleResetPassword(item)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 rounded-lg text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80 transition-all flex items-center gap-1 text-[10px] font-bold"
                          title="Reset Sandi"
                        >
                          <Key className="w-3.5 h-3.5" />
                          Reset
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Ubah">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Unified CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-zoomIn flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {modalMode === 'add' ? 'Tambah' : 'Ubah'} Data {getTabLabel()}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scroll Container */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === 'admin-mahasiswa' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">NIM</label>
                      <input
                        type="text"
                        required
                        disabled={modalMode === 'edit'}
                        value={formData.nim || ''}
                        onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white disabled:opacity-50"
                        placeholder="Contoh: 10118025"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Nama lengkap mahasiswa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Program Studi</label>
                      <select
                        value={formData.prodi || ''}
                        onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="">Pilih Program Studi</option>
                        {prodis.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Angkatan</label>
                      <input
                        type="text"
                        required
                        value={formData.angkatan || ''}
                        onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: 2026"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">IP Kumulatif (IPK)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={formData.gpa || 0}
                        onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Status Akademik</label>
                      <select
                        value={formData.status || ''}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Cuti">Cuti</option>
                        <option value="Lulus">Lulus</option>
                        <option value="Drop Out">Drop Out</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: f@student.siakad.ac.id"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Telepon</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: 081234567"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'admin-dosen' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">NIDN / NIDK</label>
                      <input
                        type="text"
                        required
                        disabled={modalMode === 'edit'}
                        value={formData.nidn || ''}
                        onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white disabled:opacity-50"
                        placeholder="Contoh: 0412088201"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap (Gelar)</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Nama lengkap + gelar"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Jabatan Akademik</label>
                      <select
                        value={formData.jabatan || ''}
                        onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Asisten Ahli">Asisten Ahli</option>
                        <option value="Lektor">Lektor</option>
                        <option value="Lektor Kepala">Lektor Kepala</option>
                        <option value="Guru Besar">Guru Besar</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Program Studi Homebase</label>
                      <select
                        value={formData.prodi || ''}
                        onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="">Pilih Program Studi</option>
                        {prodis.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Status Aktif</label>
                      <select
                        value={formData.status || ''}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Non-Aktif">Non-Aktif</option>
                        <option value="Tugas Belajar">Tugas Belajar</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor HP</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: 081231231"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: name@siakad.ac.id"
                    />
                  </div>
                </>
              )}

              {activeTab === 'admin-prodi' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Kode Prodi</label>
                    <input
                      type="text"
                      required
                      value={formData.kode || ''}
                      onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: IF atau SI"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Program Studi</label>
                    <input
                      type="text"
                      required
                      value={formData.nama || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: Teknik Informatika"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Jenjang</label>
                      <select
                        value={formData.jenjang || ''}
                        onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="D3">D3 - Diploma</option>
                        <option value="S1">S1 - Sarjana</option>
                        <option value="S2">S2 - Magister</option>
                        <option value="S3">S3 - Doktor</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Akreditasi BAN-PT</label>
                      <select
                        value={formData.akreditasi || ''}
                        onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Unggul">Unggul (A+)</option>
                        <option value="A">A - Sangat Baik</option>
                        <option value="B">B - Baik</option>
                        <option value="C">C - Cukup</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'admin-matakuliah' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Kode Mata Kuliah</label>
                      <input
                        type="text"
                        required
                        value={formData.kode || ''}
                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: IF3110"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">SKS</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="8"
                        value={formData.sks || 3}
                        onChange={(e) => setFormData({ ...formData, sks: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Mata Kuliah</label>
                    <input
                      type="text"
                      required
                      value={formData.nama || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: Pengembangan Aplikasi Web"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Semester</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="8"
                        value={formData.semester || 1}
                        onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Sifat Kuliah</label>
                      <select
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Wajib">Wajib</option>
                        <option value="Pilihan">Pilihan</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Program Studi</label>
                    <select
                      value={formData.prodi || ''}
                      onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="">Pilih Program Studi</option>
                      {prodis.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'admin-ruangan' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Kode Ruangan</label>
                      <input
                        type="text"
                        required
                        value={formData.kode || ''}
                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Contoh: R-202"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Kapasitas (Kursi)</label>
                      <input
                        type="number"
                        required
                        min="10"
                        max="200"
                        value={formData.kapasitas || 40}
                        onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Ruangan</label>
                    <input
                      type="text"
                      required
                      value={formData.nama || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: Ruang Kuliah Umum 202"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Lokasi Gedung / Deskripsi</label>
                    <input
                      type="text"
                      required
                      value={formData.lokasi || ''}
                      onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: Gedung Kuliah Umum Timur Lantai 2"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status Ruangan</label>
                    <select
                      value={formData.status || ''}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="Tersedia">Tersedia</option>
                      <option value="Digunakan">Digunakan</option>
                      <option value="Perbaikan">Perbaikan</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'admin-user' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Nama lengkap pemilik akun"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email Akun</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: user@siakad.ac.id"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Hak Akses (Role)</label>
                      <select
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="admin">Admin</option>
                        <option value="dosen">Dosen</option>
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="kaprodi">Kaprodi (KPS)</option>
                        <option value="akademik">Staf Akademik</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Status Akun</label>
                      <select
                        value={formData.status || ''}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Non-Aktif">Non-Aktif</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor HP</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Contoh: 081234567"
                    />
                  </div>
                </>
              )}

              {/* Actions Footer inside modal scrollable area to guarantee visible on tall modals */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Excel Import Dialog */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-zoomIn">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
                Impor Data via Excel (.xlsx)
              </h3>
              <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportExcel} className="p-6 space-y-4">
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Silakan unggah berkas template Excel yang sesuai dengan format database mahasiswa SIAKAD. Sistem akan otomatis memvalidasi NIM dan menambahkan akun login mahasiswa.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
                <Upload className="w-8 h-8 text-slate-400" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih berkas Excel Anda</p>
                  <p className="text-[10px] text-slate-400">Seret & taruh berkas atau klik tombol di bawah</p>
                </div>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="excel-file-uploader"
                />
                <label
                  htmlFor="excel-file-uploader"
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Pilih Berkas
                </label>
                {importFile && (
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-lg">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-500">Sedang mengurai berkas & menyeimbangkan relasi database...</p>
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="button"
                    onClick={() => setIsImportOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!importFile}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Mulai Impor
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
