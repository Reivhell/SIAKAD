import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, UserCheck, AlertCircle, Save, Check, UserMinus, UserCheck2 } from 'lucide-react';

interface ClassSession {
  id: string;
  code: string;
  name: string;
  schedule: string;
  room: string;
  totalStudents: number;
  lecturer: string;
}

interface StudentAttendance {
  id: string;
  nim: string;
  name: string;
  status: 'Hadir' | 'Izin' | 'Alpha' | 'Belum Presensi';
  notes?: string;
}

const mockClasses: ClassSession[] = [
  { id: 'c1', code: 'IF3110', name: 'Pengembangan Aplikasi Web', schedule: 'Senin, 08:00 - 10:30', room: 'Lab Komputer 3', totalStudents: 5, lecturer: 'Dr. Budi Rahardjo' },
  { id: 'c2', code: 'IF3170', name: 'Kecerdasan Buatan', schedule: 'Rabu, 10:00 - 12:30', room: 'Ruang Kuliah 401', totalStudents: 5, lecturer: 'Ir. Ayu Purwarianti, Ph.D.' },
  { id: 'c3', code: 'IF3140', name: 'Manajemen Basis Data', schedule: 'Kamis, 08:00 - 10:30', room: 'Lab Komputer 1', totalStudents: 5, lecturer: 'Prof. Suhono Harso' }
];

const initialRosters: Record<string, StudentAttendance[]> = {
  c1: [
    { id: '1', nim: '1901001', name: 'Ahmad Syafiq', status: 'Belum Presensi' },
    { id: '2', nim: '1901002', name: 'Budi Santoso', status: 'Belum Presensi' },
    { id: '3', nim: '1901003', name: 'Citra Kirana', status: 'Belum Presensi' },
    { id: '4', nim: '1901004', name: 'Dewi Lestari', status: 'Belum Presensi' },
    { id: '7', nim: '1901007', name: 'Gita Wirjawan', status: 'Belum Presensi' },
  ],
  c2: [
    { id: '1', nim: '1901001', name: 'Ahmad Syafiq', status: 'Hadir' },
    { id: '2', nim: '1901002', name: 'Budi Santoso', status: 'Izin', notes: 'Sakit gigi' },
    { id: '3', nim: '1901003', name: 'Citra Kirana', status: 'Belum Presensi' },
    { id: '4', nim: '1901004', name: 'Dewi Lestari', status: 'Belum Presensi' },
    { id: '7', nim: '1901007', name: 'Gita Wirjawan', status: 'Hadir' },
  ],
  c3: [
    { id: '1', nim: '1901001', name: 'Ahmad Syafiq', status: 'Belum Presensi' },
    { id: '2', nim: '1901002', name: 'Budi Santoso', status: 'Belum Presensi' },
    { id: '3', nim: '1901003', name: 'Citra Kirana', status: 'Belum Presensi' },
    { id: '4', nim: '1901004', name: 'Dewi Lestari', status: 'Belum Presensi' },
    { id: '7', nim: '1901007', name: 'Gita Wirjawan', status: 'Belum Presensi' },
  ],
};

export function PresensiView() {
  const [selectedClassId, setSelectedClassId] = useState<string>('c1');
  const [rosters, setRosters] = useState<Record<string, StudentAttendance[]>>(initialRosters);
  const [saveMessage, setSaveMessage] = useState(false);

  const selectedClass = mockClasses.find(c => c.id === selectedClassId) || mockClasses[0];
  const currentRoster = rosters[selectedClassId] || [];

  const handleStatusChange = (studentId: string, newStatus: 'Hadir' | 'Izin' | 'Alpha') => {
    setRosters(prev => {
      const updatedRoster = prev[selectedClassId].map(student => {
        if (student.id === studentId) {
          return { ...student, status: newStatus };
        }
        return student;
      });
      return { ...prev, [selectedClassId]: updatedRoster };
    });
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setRosters(prev => {
      const updatedRoster = prev[selectedClassId].map(student => {
        if (student.id === studentId) {
          return { ...student, notes };
        }
        return student;
      });
      return { ...prev, [selectedClassId]: updatedRoster };
    });
  };

  const handleMarkAll = (status: 'Hadir' | 'Izin' | 'Alpha') => {
    setRosters(prev => {
      const updatedRoster = prev[selectedClassId].map(student => ({
        ...student,
        status
      }));
      return { ...prev, [selectedClassId]: updatedRoster };
    });
  };

  const handleSaveAttendance = () => {
    setSaveMessage(true);
    setTimeout(() => {
      setSaveMessage(false);
    }, 2500);
  };

  // Stats calculation
  const total = currentRoster.length;
  const hadirCount = currentRoster.filter(s => s.status === 'Hadir').length;
  const izinCount = currentRoster.filter(s => s.status === 'Izin').length;
  const alphaCount = currentRoster.filter(s => s.status === 'Alpha').length;
  const pendingCount = currentRoster.filter(s => s.status === 'Belum Presensi').length;
  const attendanceRate = total > 0 ? Math.round((hadirCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* View Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Presensi Mahasiswa</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lakukan pencatatan dan pengelolaan kehadiran mahasiswa per kelas.</p>
        </div>
        
        {saveMessage && (
          <div className="animate-bounce bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center shadow-md">
            <Check className="w-4 h-4 mr-2" /> Presensi Berhasil Disimpan!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Active Classes */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Kelas Hari Ini
            </h3>
            
            <div className="space-y-3">
              {mockClasses.map((cls) => {
                const isActive = cls.id === selectedClassId;
                const clsRoster = rosters[cls.id] || [];
                const loggedCount = clsRoster.filter(s => s.status !== 'Belum Presensi').length;
                const isFinished = loggedCount === clsRoster.length;

                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                        : 'bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {cls.code}
                      </span>
                      {isFinished && (
                        <span className={`inline-flex items-center text-[10px] font-semibold ${
                          isActive ? 'text-blue-200' : 'text-green-600 dark:text-green-400'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Selesai
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm line-clamp-1">{cls.name}</h4>
                    
                    <div className={`flex flex-col gap-1 text-xs mt-1.5 ${
                      isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Ruang: <span className="font-semibold">{cls.room}</span></span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full transition-all duration-300 ${isActive ? 'bg-white' : 'bg-blue-600'}`}
                        style={{ width: `${(loggedCount / clsRoster.length) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 font-semibold opacity-80">
                      <span>Progres Presensi</span>
                      <span>{loggedCount} / {clsRoster.length} Mahasiswa</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Attendance Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            
            {/* Header Detail Kelas */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">DETAIL KELAS</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedClass.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dosen Pengampu: <span className="font-semibold">{selectedClass.lecturer}</span></p>
              </div>

              {/* Quick statistics */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 px-3 py-1.5 rounded-lg text-center">
                  <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Hadir</div>
                  <div className="text-sm font-bold text-green-700 dark:text-green-300">{hadirCount}</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 px-3 py-1.5 rounded-lg text-center">
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Izin</div>
                  <div className="text-sm font-bold text-amber-700 dark:text-amber-300">{izinCount}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 px-3 py-1.5 rounded-lg text-center">
                  <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">Alpha</div>
                  <div className="text-sm font-bold text-red-700 dark:text-red-300">{alphaCount}</div>
                </div>
                {pendingCount > 0 && (
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Belum</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{pendingCount}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance controls */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi Cepat Presensi Massal:</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleMarkAll('Hadir')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Hadirkan Semua
                </button>
                <button 
                  onClick={() => handleMarkAll('Izin')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Izinkan Semua
                </button>
                <button 
                  onClick={() => handleMarkAll('Alpha')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <UserMinus className="w-3.5 h-3.5" /> Alphakan Semua
                </button>
              </div>
            </div>

            {/* Student Attendance Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/40">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">NIM</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Mahasiswa</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Kehadiran</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Keterangan / Catatan</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                  {currentRoster.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">{student.nim}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-semibold">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-950">
                          
                          {/* Hadir Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Hadir')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                              student.status === 'Hadir'
                                ? 'bg-green-500 text-white shadow-sm'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                          >
                            Hadir
                          </button>

                          {/* Izin Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Izin')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                              student.status === 'Izin'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                          >
                            Izin
                          </button>

                          {/* Alpha Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Alpha')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                              student.status === 'Alpha'
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                          >
                            Alpha
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <input
                          type="text"
                          value={student.notes || ''}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          placeholder={student.status === 'Izin' ? "cth: Sakit, Acara Keluarga..." : "Tambahkan catatan..."}
                          className="block w-full px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-800 rounded-md bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Section */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Attendance rate hari ini: <span className="font-bold text-slate-700 dark:text-slate-300">{attendanceRate}%</span>
              </span>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan Lembar Kehadiran
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
