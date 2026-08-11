import React, { useState } from 'react';
import { 
  JadwalMengajarItem, 
  ClassItem, 
  StudentAcademic, 
  JurnalItem 
} from '../../../api/academic.api';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  BookOpen, 
  MapPin, 
  Clock, 
  Check, 
  AlertCircle, 
  Plus, 
  BookOpenCheck,
  FileDown
} from 'lucide-react';

interface LecturerAcademicModuleProps {
  jadwal: JadwalMengajarItem[];
  kelas: ClassItem[];
  students: StudentAcademic[];
  setStudents: React.Dispatch<React.SetStateAction<StudentAcademic[]>>;
  jurnal: JurnalItem[];
  setJurnal: React.Dispatch<React.SetStateAction<JurnalItem[]>>;
  onShowToast: (message: string) => void;
  subTab: string;
}

export function LecturerAcademicModule({ 
  jadwal, 
  kelas, 
  students, 
  setStudents, 
  jurnal, 
  setJurnal, 
  onShowToast, 
  subTab 
}: LecturerAcademicModuleProps) {
  // Local active class selections
  const [selectedClassId, setSelectedClassId] = useState<string>(kelas[0]?.id || '');
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [topicCovered, setTopicCovered] = useState<string>('');

  // Jurnal addition form states
  const [newMateri, setNewMateri] = useState('');
  const [newPokok, setNewPokok] = useState('');
  const [newSubPokok, setNewSubPokok] = useState('');
  const [newCatatan, setNewCatatan] = useState('');

  // Handle Lecturer Check-in
  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    setIsCheckedIn(true);
    onShowToast('Presensi Dosen: Berhasil Check-in Mengajar! Sesi aktif dimulai.');
  };

  const handleFinishLectureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicCovered) {
      onShowToast('Error: Mohon isi materi/aktivitas pengajaran!');
      return;
    }
    // Add to Jurnal
    const nextPertemuan = jurnal.length + 1;
    const newEntry: JurnalItem = {
      pertemuan: nextPertemuan,
      date: new Date().toISOString().split('T')[0],
      materi: topicCovered,
      pokokBahasan: 'Aktivitas Kelas Harian',
      subPokokBahasan: 'Topik Sesi ' + nextPertemuan,
      catatan: 'Pertemuan diselesaikan dengan sukses.',
      status: 'Selesai',
      fileCount: 0
    };
    setJurnal(prev => [...prev, newEntry]);
    setIsCheckedIn(false);
    setTopicCovered('');
    onShowToast(`BAP & Jurnal Pertemuan ${nextPertemuan} berhasil direkam!`);
  };

  // Handle student attendance updates
  const handleAttendanceChange = (studentNim: string, statusType: 'hadir' | 'sakit' | 'izin' | 'alpha') => {
    setStudents(prev => prev.map(student => {
      if (student.nim === studentNim) {
        // Reset current attendance counts for this session simulated update
        const updatedAttendance = { ...student.attendance };
        if (statusType === 'hadir') {
          updatedAttendance.hadir += 1;
          onShowToast(`Absensi ${student.name} diset: HADIR`);
        } else if (statusType === 'sakit') {
          updatedAttendance.sakit += 1;
          onShowToast(`Absensi ${student.name} diset: SAKIT`);
        } else if (statusType === 'izin') {
          updatedAttendance.izin += 1;
          onShowToast(`Absensi ${student.name} diset: IZIN`);
        } else {
          updatedAttendance.alpha += 1;
          onShowToast(`Absensi ${student.name} diset: ALPHA`);
        }
        updatedAttendance.total += 1;
        return { ...student, attendance: updatedAttendance };
      }
      return student;
    }));
  };

  // Handle adding custom manual Jurnal
  const handleAddJurnalManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMateri || !newPokok) {
      onShowToast('Error: Materi dan Pokok Bahasan wajib diisi!');
      return;
    }
    const nextPertemuan = jurnal.length + 1;
    const newEntry: JurnalItem = {
      pertemuan: nextPertemuan,
      date: new Date().toISOString().split('T')[0],
      materi: newMateri,
      pokokBahasan: newPokok,
      subPokokBahasan: newSubPokok || '-',
      catatan: newCatatan || 'Pertemuan selesai.',
      status: 'Selesai',
      fileCount: 0
    };
    setJurnal(prev => [...prev, newEntry]);
    setNewMateri('');
    setNewPokok('');
    setNewSubPokok('');
    setNewCatatan('');
    onShowToast(`Sukses menambahkan Jurnal Pertemuan ${nextPertemuan}!`);
  };

  const activeClassDetails = kelas.find(k => k.id === selectedClassId) || kelas[0];

  return (
    <div className="space-y-6">
      {/* 1. JADWAL MENGAJAR */}
      {subTab === 'jadwal-mengajar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" /> Jadwal Mengajar Semester Ganjil
            </h4>
            <div className="space-y-4">
              {jadwal.map((item) => (
                <div key={item.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 hover:border-blue-500/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      {item.code} - SKS {item.sks}
                    </span>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-white mt-1">{item.name}</h5>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Users className="w-3.5 h-3.5" /> Kelas: {item.class} &bull; {item.mahasiswaCount} Mahasiswa
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end text-left md:text-right text-[11px] font-semibold text-slate-600 dark:text-slate-400 space-y-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.room}</span>
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                      <Clock className="w-3.5 h-3.5 text-blue-400" /> {item.day}, {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Kalender Akademik</h4>
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-950 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Minggu Kuliah ke-14</span>
                <span className="text-blue-600">Aktif</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">UAS Ganjil dijadwalkan tanggal 15 - 28 Juli 2026</p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">10 Juli 2026</span>
                  <p className="text-[10px] text-slate-500">Batas Akhir Input Jurnal Perkuliahan</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">12 Juli 2026</span>
                  <p className="text-[10px] text-slate-500">Batas Pengumpulan Nilai Komponen UTS/UAS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KELAS PERKULIAHAN */}
      {subTab === 'kelas-perkuliahan' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Daftar Kelas Perkuliahan</h4>
              <p className="text-xs text-slate-500">Pilih kelas di bawah ini untuk melihat rincian mahasiswa terdaftar.</p>
            </div>
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none font-semibold cursor-pointer"
            >
              {kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.code} - {k.class} ({k.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Class capacity card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold">Informasi Kelas</span>
                <h5 className="text-base font-extrabold text-slate-800 dark:text-white mt-1">{activeClassDetails?.name}</h5>
                <p className="text-xs text-slate-500 mt-1">Kode: {activeClassDetails?.code} &bull; SKS: {activeClassDetails?.sks}</p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Kapasitas Maksimal</span>
                    <span className="text-slate-800 dark:text-white font-bold">{activeClassDetails?.capacity} Kursi</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Terisi / Terdaftar</span>
                    <span className="text-blue-600 font-bold">{activeClassDetails?.enrolled} Mahasiswa</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full" 
                      style={{ width: `${((activeClassDetails?.enrolled || 1) / (activeClassDetails?.capacity || 1)) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Students table */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-xs font-bold text-slate-800 dark:text-whiter">Mahasiswa Terdaftar</h5>
                <button 
                  onClick={() => onShowToast('Daftar mahasiswa berhasil diekspor!')}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" /> Ekspor PDF
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                      <th className="pb-3 pl-2">NIM</th>
                      <th className="pb-3">Nama Lengkap</th>
                      <th className="pb-3 text-right pr-2">Presensi Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {students.map((student) => (
                      <tr key={student.nim} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="py-3 pl-2 font-mono text-slate-500">{student.nim}</td>
                        <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{student.name}</td>
                        <td className="py-3 text-right pr-2 font-bold text-slate-700 dark:text-slate-300">
                          {student.attendance.hadir} / {student.attendance.total} Pertemuan ({Math.round((student.attendance.hadir / student.attendance.total) * 100)}%)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRESENSI PERKULIAHAN */}
      {subTab === 'presensi-perkuliahan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Presensi Dosen */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Presensi & BAP Dosen</h4>
              
              {!isCheckedIn ? (
                <div className="space-y-4 text-center py-6">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/40 rounded-2xl border border-yellow-100/50 dark:border-yellow-950/50 text-yellow-600 dark:text-yellow-400 text-xs text-left flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Kelas Belum Aktif</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Lakukan Check-In Mengajar terlebih dahulu untuk merekam BAP pengajaran secara real-time.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckIn}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Check-In Mulai Mengajar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFinishLectureSubmit} className="space-y-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-950 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">Sesi Mengajar Aktif</span>
                    </div>
                    <span className="text-slate-500">Mulai: {checkInTime} WIB</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5">Materi Pengajaran (BAP)</label>
                    <textarea
                      rows={3}
                      value={topicCovered}
                      onChange={(e) => setTopicCovered(e.target.value)}
                      placeholder="Masukkan topik, sub bahasan, dan aktivitas kuliah hari ini..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-600/10"
                  >
                    Selesaikan Kelas & Simpan BAP
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Presensi Mahasiswa */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Presensi Mahasiswa</h4>
                <p className="text-xs text-slate-500">Pertemuan ke-14 &bull; {selectedClassId}</p>
              </div>
              <button
                onClick={() => onShowToast('Rekap absensi kelas berhasil diperbarui!')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm"
              >
                Simpan Presensi Kelas
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                    <th className="pb-3 pl-2">Nama Mahasiswa</th>
                    <th className="pb-3 text-center">Hadir</th>
                    <th className="pb-3 text-center">Izin</th>
                    <th className="pb-3 text-center">Sakit</th>
                    <th className="pb-3 text-center">Alpha</th>
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
                        <button
                          onClick={() => handleAttendanceChange(student.nim, 'hadir')}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-900 cursor-pointer"
                        >
                          H
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleAttendanceChange(student.nim, 'izin')}
                          className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-100 dark:border-blue-900 cursor-pointer"
                        >
                          I
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleAttendanceChange(student.nim, 'sakit')}
                          className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-100 dark:border-amber-900 cursor-pointer"
                        >
                          S
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleAttendanceChange(student.nim, 'alpha')}
                          className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-100 dark:border-rose-900 cursor-pointer"
                        >
                          A
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. JURNAL PERKULIAHAN */}
      {subTab === 'jurnal-perkuliahan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Jurnal Addition Form */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-blue-500" /> Isi Jurnal Perkuliahan
            </h4>
            <form onSubmit={handleAddJurnalManual} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Materi Pokok Perkuliahan</label>
                <input 
                  type="text" 
                  value={newMateri}
                  onChange={(e) => setNewMateri(e.target.value)}
                  placeholder="Contoh: Normalisasi Basis Data"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Pokok Bahasan</label>
                <input 
                  type="text" 
                  value={newPokok}
                  onChange={(e) => setNewPokok(e.target.value)}
                  placeholder="Contoh: Desain Database Relasional"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Sub Pokok Bahasan</label>
                <input 
                  type="text" 
                  value={newSubPokok}
                  onChange={(e) => setNewSubPokok(e.target.value)}
                  placeholder="Contoh: 1NF, 2NF, dan 3NF"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Catatan Kelas / Hambatan</label>
                <textarea 
                  rows={2}
                  value={newCatatan}
                  onChange={(e) => setNewCatatan(e.target.value)}
                  placeholder="Masukkan keluhan atau catatan jalannya kuliah..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                Tambahkan Jurnal Mengajar
              </button>
            </form>
          </div>

          {/* Historical Table */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-blue-500" /> Riwayat Jurnal Pengajaran
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                    <th className="pb-3 pl-2 text-center w-12">Pert</th>
                    <th className="pb-3 w-28">Tanggal</th>
                    <th className="pb-3">Materi Diajarkan</th>
                    <th className="pb-3">Pokok / Sub Bahasan</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {jurnal.map((item) => (
                    <tr key={item.pertemuan} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="py-4 pl-2 font-bold text-slate-700 dark:text-slate-300 text-center bg-slate-50/50 dark:bg-slate-950/10 rounded-lg">{item.pertemuan}</td>
                      <td className="py-4 text-slate-500 font-mono pl-2">{item.date}</td>
                      <td className="py-4 font-bold text-slate-800 dark:text-white">{item.materi}</td>
                      <td className="py-4">
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{item.pokokBahasan}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.subPokokBahasan}</p>
                      </td>
                      <td className="py-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          {item.status}
                        </span>
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
