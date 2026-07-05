import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Video, QrCode, MapPin, Radio, Clock, Calendar, CheckSquare,
  MessageSquare, Bell, Send, Users, AlertTriangle, TrendingUp, Sparkles,
  BarChart2, Award, FileText, Download, Check, X, Shield, Key, Eye,
  RefreshCw, Laptop, WifiOff, FileCheck, Layers, ClipboardList, PenTool,
  QrCode as QrIcon, Server, Database, Lock, EyeOff, Globe, Camera
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

// ==========================================
// 1. MODULE: LMS & INTEGRASI HYBRID LEARNING
// ==========================================
export function LmsHybridModule() {
  const [platform, setPlatform] = useState<'google' | 'moodle' | 'internal'>('google');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCourses, setSyncedCourses] = useState([
    { id: 1, name: 'Pengembangan Aplikasi Web - Kelas A', source: 'Google Classroom', items: 12, lastSync: '25 Juni 2026 10:15' },
    { id: 2, name: 'Kecerdasan Buatan (AI) - Kelas B', source: 'Google Classroom', items: 8, lastSync: '24 Juni 2026 14:30' },
  ]);

  const [activeTab, setActiveTab] = useState<'lms' | 'absensi' | 'scheduler'>('lms');
  const [attendanceMethod, setAttendanceMethod] = useState<'qr' | 'geo' | 'zoom'>('qr');
  const [geoState, setGeoState] = useState<'idle' | 'detecting' | 'verified'>('idle');
  const [attendanceLogs, setAttendanceLogs] = useState([
    { time: '08:05', name: 'Rian Adiputra', nim: '10115082', method: 'Geolokasi (Lab RPL & AI)', status: 'HADIR' },
    { time: '08:07', name: 'Syifa Nuraini', nim: '10115121', method: 'Pindai QR Dinamis', status: 'HADIR' },
    { time: '08:12', name: 'Farhan Hanif', nim: '10115043', method: 'Zoom Activity Log Sync', status: 'HADIR' }
  ]);

  const [meetings, setMeetings] = useState([
    { id: 1, topic: 'Pertemuan 10: Optimasi Database NoSQL', type: 'Hybrid', time: 'Kamis, 25 Juni &bull; 08:00 - 10:30', link: 'https://zoom.us/j/982739182', recording: 'https://drive.google.com/rec_098' },
    { id: 2, topic: 'Pertemuan 11: Deployment Kubernetes & Cloud', type: 'Daring (Online)', time: 'Senin, 29 Juni &bull; 13:00 - 15:30', link: 'https://meet.google.com/abc-xyz-123', recording: null },
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedCourses(prev => [
        ...prev,
        {
          id: Date.now(),
          name: 'Konsep Pemrograman Lanjut - Kelas D',
          source: platform === 'google' ? 'Google Classroom' : platform === 'moodle' ? 'Moodle LMS' : 'SIAKAD Internal',
          items: 15,
          lastSync: 'Baru saja'
        }
      ]);
    }, 1500);
  };

  const handleGeoVerification = () => {
    setGeoState('detecting');
    setTimeout(() => {
      setGeoState('verified');
      setAttendanceLogs(prev => [
        { time: 'Baru saja', name: 'Anda (Simulator Akun)', nim: '10115999', method: 'Geolokasi (Radius 15m Kampus)', status: 'HADIR' },
        ...prev
      ]);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-200">
      {/* Top navigation tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('lms')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'lms' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> LMS Classroom Sync
        </button>
        <button 
          onClick={() => setActiveTab('absensi')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'absensi' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" /> Absensi Otomatis
        </button>
        <button 
          onClick={() => setActiveTab('scheduler')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'scheduler' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Live Class &amp; Recording
        </button>
      </div>

      {/* 1A. Tab: LMS Classroom Sync */}
      {activeTab === 'lms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <h5 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-blue-500" />
                Integrasi Gateway Pembelajaran
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Pilih provider platform eksternal untuk melakukan sinkronisasi modul kuliah, tugas, dan rekap penilaian otomatis.
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="google">Google Classroom</option>
                <option value="moodle">Moodle LMS Kampus</option>
                <option value="internal">SIAKAD Custom API</option>
              </select>

              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sinkronisasi...' : 'Tarik Data'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Mata Kuliah Terkoneksi</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {syncedCourses.map((c) => (
                <div key={c.id} className="p-3 bg-white dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <h6 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{c.name}</h6>
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md">
                      {c.source}
                    </span>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                    <div>{c.items} Modul/Tugas</div>
                    <div className="text-[9px] text-slate-400 font-normal">Last Sync: {c.lastSync}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1B. Tab: Absensi Otomatis */}
      {activeTab === 'absensi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Method options */}
            <button
              onClick={() => setAttendanceMethod('qr')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                attendanceMethod === 'qr'
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400'
                  : 'border-slate-200/60 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-5 h-5 mb-2 text-blue-500" />
              <div>
                <div className="text-xs font-bold">QR Code Dinamis</div>
                <div className="text-[9px] text-slate-500">Scan QR Code kelas yang berganti tiap 10 detik.</div>
              </div>
            </button>

            <button
              onClick={() => setAttendanceMethod('geo')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                attendanceMethod === 'geo'
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400'
                  : 'border-slate-200/60 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-5 h-5 mb-2 text-indigo-500" />
              <div>
                <div className="text-xs font-bold">Geolokasi &amp; Radius</div>
                <div className="text-[9px] text-slate-500">Verifikasi keberadaan presensi sesuai radius koordinat kelas.</div>
              </div>
            </button>

            <button
              onClick={() => setAttendanceMethod('zoom')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                attendanceMethod === 'zoom'
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400'
                  : 'border-slate-200/60 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-100'
              }`}
            >
              <Radio className="w-5 h-5 mb-2 text-rose-500" />
              <div>
                <div className="text-xs font-bold">Zoom Log Analytics</div>
                <div className="text-[9px] text-slate-500">Ambil data kehadiran berdasar durasi log aktivitas webinar.</div>
              </div>
            </button>
          </div>

          {/* Interactive method sandbox */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
            {attendanceMethod === 'qr' && (
              <div className="flex flex-col items-center justify-center py-4 space-y-3 text-center">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col items-center">
                  <QrCode className="w-20 h-20 text-slate-800" />
                  <span className="text-[9px] font-black text-blue-600 font-mono mt-1 animate-pulse">PRESENSI_IF311_A_2506</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Simulator Pindai Kehadiran QR Dinamis</p>
                  <p className="text-[10px] text-slate-500 max-w-xs">Scan menggunakan kamera HP. Di-refresh berkala untuk mengantisipasi manipulasi absensi.</p>
                </div>
                <button 
                  onClick={() => {
                    setAttendanceLogs(prev => [
                      { time: 'Baru saja', name: 'Anda (Simulator QR)', nim: '10115999', method: 'Pindai QR Dinamis', status: 'HADIR' },
                      ...prev
                    ]);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold cursor-pointer"
                >
                  Simulasikan Pindai QR Sukses
                </button>
              </div>
            )}

            {attendanceMethod === 'geo' && (
              <div className="flex flex-col items-center justify-center py-4 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 animate-pulse">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Deteksi Geofencing Radius Kampus</p>
                  <p className="text-[10px] text-slate-500 max-w-xs">Pastikan mengaktifkan izin GPS pada peramban Anda untuk memulai verifikasi kehadiran.</p>
                </div>
                
                {geoState === 'idle' && (
                  <button 
                    onClick={handleGeoVerification}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    Verifikasi Geolokasi Saya
                  </button>
                )}

                {geoState === 'detecting' && (
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    Menghitung jarak ke titik ruang kelas...
                  </span>
                )}

                {geoState === 'verified' && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-emerald-800 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" /> Terverifikasi berada dalam ruangan (Jarak: 3 meter)
                  </div>
                )}
              </div>
            )}

            {attendanceMethod === 'zoom' && (
              <div className="flex flex-col items-center justify-center py-4 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1 animate-pulse">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Otomasi Integrasi API Zoom / Meet</p>
                  <p className="text-[10px] text-slate-500 max-w-xs">Menarik riwayat login partisipasi siswa. Mahasiswa terdaftar hadir jika ikut minimal 75% durasi webinar.</p>
                </div>
                <button 
                  onClick={() => {
                    setAttendanceLogs(prev => [
                      { time: 'Baru saja', name: 'Anda (Log Sync)', nim: '10115999', method: 'Zoom Activity Log Sync', status: 'HADIR' },
                      ...prev
                    ]);
                  }}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold cursor-pointer"
                >
                  Sinkronisasikan Kehadiran Zoom Sekarang
                </button>
              </div>
            )}
          </div>

          {/* Real-time attendance log list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Log Presensi Masuk (Hari Ini)</span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Total: {attendanceLogs.length} Mahasiswa</span>
            </div>
            <div className="max-h-[140px] overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
              {attendanceLogs.map((log, index) => (
                <div key={index} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono text-slate-400">{log.time}</span>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">{log.name} &bull; <span className="text-slate-500 font-normal font-mono">{log.nim}</span></div>
                      <div className="text-[9px] text-slate-400 font-medium">Metode: {log.method}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold text-[9px] rounded-md uppercase tracking-wider">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1C. Tab: Live Class & Recording */}
      {activeTab === 'scheduler' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jadwal Kelas &amp; Media Interaktif</span>
            <button 
              onClick={() => {
                setMeetings(prev => [
                  ...prev,
                  {
                    id: Date.now(),
                    topic: 'Kuliah Tambahan: Review Persiapan Sidang Akhir',
                    type: 'Daring (Online)',
                    time: 'Sabtu, 27 Juni &bull; 10:00 - 12:00',
                    link: 'https://zoom.us/j/123456789',
                    recording: null
                  }
                ]);
              }}
              className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              + Jadwal Baru
            </button>
          </div>

          <div className="space-y-3">
            {meetings.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      m.type.includes('Hybrid')
                        ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                        : 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400'
                    }`}>
                      {m.type}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span dangerouslySetInnerHTML={{ __html: m.time }} />
                    </span>
                  </div>
                  <h6 className="text-xs font-black text-slate-800 dark:text-white">{m.topic}</h6>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <a 
                    href={m.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 sm:flex-none text-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold"
                  >
                    Buka Room
                  </a>
                  {m.recording ? (
                    <a 
                      href={m.recording} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 sm:flex-none text-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold"
                    >
                      Nonton Rekaman
                    </a>
                  ) : (
                    <span className="flex-1 sm:flex-none text-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 opacity-50 text-slate-400 rounded-xl text-[10px] font-medium select-none">
                      Rekaman Belum Ada
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. MODULE: NOTIFIKASI & KOMUNIKASI CERDAS
// ==========================================
export function SmartCommunicationModule({ role }: { role: string }) {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'forum' | 'broadcast'>('whatsapp');
  
  // WA Simulator State
  const [waLogs, setWaLogs] = useState([
    { phone: '0812-3456-XXXX', name: 'Rian Adiputra', type: 'Tagihan UKT', text: 'SIAKAD INFO: UKT Semester Ganjil 2026 sebesar Rp 7.500.000 jatuh tempo pada 3 Agustus 2026.', status: 'Sent' },
    { phone: '0857-9876-XXXX', name: 'Dr. Hendra Wijaya', type: 'Perubahan Jadwal', text: 'SIAKAD INFO: Perkuliahan Pemrograman Web hari ini dipindahkan ke jam 15:30 WIB secara Daring.', status: 'Delivered' },
    { phone: '0899-1234-XXXX', name: 'Syifa Nuraini', type: 'Verifikasi KRS', text: 'SIAKAD INFO: Pengisian KRS Anda telah divalidasi oleh Dosen Wali.', status: 'Read' }
  ]);
  const [phoneInput, setPhoneInput] = useState('');
  const [notifType, setNotifType] = useState('Pengumuman Nilai');
  const [messageText, setMessageText] = useState('SIAKAD INFO: Nilai KHS Semester Genap Anda telah disahkan. Silakan unduh transkrip akademik.');

  // Forums State
  const [forums, setForums] = useState([
    { id: 1, course: 'IF3110 Pengembangan Aplikasi Web', title: 'Diskusi Pertemuan 10: OAuth JWT vs Session', replies: 14, author: 'Dr. Hendra Wijaya', date: 'Hari Ini' },
    { id: 2, course: 'IF3170 Kecerdasan Buatan', title: 'Tanya-Jawab Tugas Proyek Akhir Neural Network', replies: 8, author: 'Syifa Nuraini', date: 'Kemarin' }
  ]);
  const [forumTitle, setForumTitle] = useState('');
  const [forumCourse, setForumCourse] = useState('IF3110 Pengembangan Aplikasi Web');

  // Targeted Announcements
  const [targetProdi, setTargetProdi] = useState('Teknik Informatika');
  const [targetSemester, setTargetSemester] = useState('3');
  const [targetTitle, setTargetTitle] = useState('');
  const [targetContent, setTargetContent] = useState('');
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Sosialisasi MBKM Magang Bersertifikat Batch VII', prodi: 'Semua Prodi', semester: 'Semester 5-7', date: '25 Juni 2026' }
  ]);

  const handleSendWa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setWaLogs(prev => [
      {
        phone: phoneInput,
        name: 'Pengguna Baru',
        type: notifType,
        text: messageText,
        status: 'Sent'
      },
      ...prev
    ]);
    setPhoneInput('');
  };

  const handleCreateForum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumTitle) return;
    setForums(prev => [
      {
        id: Date.now(),
        course: forumCourse,
        title: forumTitle,
        replies: 0,
        author: role === 'student' ? 'Anda (Mahasiswa)' : 'Anda (Dosen)',
        date: 'Baru saja'
      },
      ...prev
    ]);
    setForumTitle('');
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTitle || !targetContent) return;
    setAnnouncements(prev => [
      {
        id: Date.now(),
        title: targetTitle,
        prodi: targetProdi,
        semester: `Semester ${targetSemester}`,
        date: 'Baru saja'
      },
      ...prev
    ]);
    setTargetTitle('');
    setTargetContent('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-200">
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'whatsapp' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Bell className="w-3.5 h-3.5" /> WA &amp; Push Gateway
        </button>
        <button 
          onClick={() => setActiveTab('forum')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'forum' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Forum Diskusi Matkul
        </button>
        {role !== 'student' && (
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'broadcast' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Pengumuman Tertarget
          </button>
        )}
      </div>

      {/* 2A. WhatsApp / Push Simulator */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-4">
          <form onSubmit={handleSendWa} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Simulator Pengiriman WA OTP / Notifikasi</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Nomor WhatsApp Penerima</label>
                <input 
                  type="text" 
                  placeholder="Contoh: 0812-9988-7766"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Kategori Notifikasi</label>
                <select 
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
                >
                  <option value="Konfirmasi KHS">Konfirmasi Nilai KHS</option>
                  <option value="OTP Keamanan 2FA">Kode OTP Keamanan 2FA</option>
                  <option value="Deadline Tagihan UKT">Deadline Tagihan UKT</option>
                  <option value="Pengingat Kelas Daring">Pengingat Kelas Daring</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">Konten Pesan</label>
              <textarea 
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Kirim Pesan Simulator (WA Gateway)
            </button>
          </form>

          {/* Logs of sent messages */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Log Pengiriman WhatsApp Server</span>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
              {waLogs.map((log, index) => (
                <div key={index} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl flex justify-between items-center text-xs shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                      <span>{log.name}</span>
                      <span className="text-[9px] font-normal text-slate-400 font-mono">{log.phone}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 italic">"{log.text}"</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md">
                      {log.type}
                    </span>
                    <span className="block text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                      ✓ {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2B. Threaded Forums */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateForum} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Buka Topik Diskusi Baru</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <input 
                  type="text" 
                  placeholder="Ketik judul diskusi (misal: Pertanyaan Kisi-kisi UTS)"
                  value={forumTitle}
                  onChange={(e) => setForumTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <select 
                  value={forumCourse}
                  onChange={(e) => setForumCourse(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                >
                  <option value="IF3110 Pengembangan Aplikasi Web">Aplikasi Web</option>
                  <option value="IF3170 Kecerdasan Buatan">Kecerdasan Buatan</option>
                  <option value="IF3150 Manajemen Proyek PL">Manajemen Proyek</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl cursor-pointer"
            >
              Terbitkan Topik Kelas
            </button>
          </form>

          <div className="space-y-2">
            {forums.map((f) => (
              <div key={f.id} className="p-3 bg-white dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/80 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">{f.course}</span>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{f.title}</h6>
                  <div className="text-[9px] text-slate-400 font-medium mt-1">Dibuat oleh: {f.author} &bull; {f.date}</div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-2 py-1 rounded-xl text-slate-600 dark:text-slate-400">
                    <MessageSquare className="w-3 h-3" />
                    {f.replies} Balasan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2C. Targeted Announcements (For Admin/Faculty) */}
      {activeTab === 'broadcast' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateBroadcast} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Kirim Pengumuman Bertarget</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Prodi Target</label>
                <select 
                  value={targetProdi}
                  onChange={(e) => setTargetProdi(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                >
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Teknik Elektro">Teknik Elektro</option>
                  <option value="Semua Prodi">Semua Program Studi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Semester Target</label>
                <select 
                  value={targetSemester}
                  onChange={(e) => setTargetSemester(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                >
                  <option value="1">Semester 1 (Maba)</option>
                  <option value="3">Semester 3</option>
                  <option value="5">Semester 5</option>
                  <option value="7">Semester 7 (Tingkat Akhir)</option>
                  <option value="Semua">Semua Semester</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="Judul Pengumuman"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-1">
              <textarea 
                rows={2}
                placeholder="Konten pengumuman penting..."
                value={targetContent}
                onChange={(e) => setTargetContent(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl cursor-pointer"
            >
              Kirim Notifikasi Blast Bertarget
            </button>
          </form>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Histori Broadcast Bertarget</span>
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3 bg-white dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/80 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h6>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md">
                      {ann.prodi}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md">
                      {ann.semester}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400">{ann.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MODULE: DASHBOARD & ANALITIK (EWS & BI)
// ==========================================
export function EwsBiLeadershipModule() {
  const [activeTab, setActiveTab] = useState<'ews' | 'bi' | 'tracer'>('ews');

  // EWS Risk Data
  const [riskStudents, setRiskStudents] = useState([
    { nim: '10115024', name: 'Rahmat Hidayat', prodi: 'Informatika', riskLevel: 'TINGGI', attendance: '54%', ipk: 1.82, reason: 'Kehadiran < 75% & Nilai UTS Rendah' },
    { nim: '10115112', name: 'Dewi Lestari', prodi: 'Informatika', riskLevel: 'SEDANG', attendance: '72%', ipk: 2.15, reason: 'Tunggakan Keuangan & UTS Kosong' },
    { nim: '10115089', name: 'Galih Wicaksono', prodi: 'Elektro', riskLevel: 'RENDAH', attendance: '81%', ipk: 2.30, reason: 'Sakit Berkepanjangan' }
  ]);

  // BI Data
  const enrollmentData = [
    { year: '2022', Teknik: 420, Bisnis: 310, Hukum: 180 },
    { year: '2023', Teknik: 480, Bisnis: 350, Hukum: 210 },
    { year: '2024', Teknik: 510, Bisnis: 380, Hukum: 240 },
    { year: '2025', Teknik: 580, Bisnis: 420, Hukum: 290 },
    { year: '2026', Teknik: 620, Bisnis: 460, Hukum: 320 }
  ];

  // Tracer Study Alumni
  const tracerData = [
    { name: 'Teknologi/IT', value: 45 },
    { name: 'Keuangan/Bank', value: 20 },
    { name: 'Wirausaha', value: 15 },
    { name: 'Lainnya', value: 20 }
  ];
  const ALUMNI_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-200">
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('ews')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'ews' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Early Warning System (DO Risk)
        </button>
        <button 
          onClick={() => setActiveTab('bi')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'bi' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> BI Realtime Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('tracer')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'tracer' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Tracer Study &amp; Alumni
        </button>
      </div>

      {/* 3A. Early Warning System */}
      {activeTab === 'ews' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 rounded-2xl">
            <h5 className="text-xs font-extrabold text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Sistem Peringatan Dini Akademik (AI DO Prediction)
            </h5>
            <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80 leading-relaxed mt-1">
              Algoritma mengevaluasi mahasiswa dengan risiko akademik tinggi berdasarkan komparasi otomatis: Kehadiran kuliah &lt; 75%, IPK di bawah standar kelulusan minimal (&lt; 2.0), serta keterlambatan tagihan UKT melampaui batas toleransi.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Mahasiswa Dalam Pemantauan Khusus</span>
            <div className="space-y-2">
              {riskStudents.map((st) => (
                <div key={st.nim} className="p-3 bg-white dark:bg-slate-950/45 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                        st.riskLevel === 'TINGGI'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          : st.riskLevel === 'SEDANG'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      }`}>
                        RISIKO {st.riskLevel}
                      </span>
                      <h6 className="text-xs font-bold text-slate-900 dark:text-white">{st.name} &bull; <span className="text-slate-400 font-mono">{st.nim}</span></h6>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Faktor Pemicu: {st.reason}</p>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-bold">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[9px] font-bold">PRESENSI</span>
                      <span className={`${st.ipk < 2.0 ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>{st.attendance}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[9px] font-bold">IPK</span>
                      <span className={`${st.ipk < 2.0 ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>{st.ipk.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => {
                        alert(`Notifikasi peringatan resmi akademik telah di-blast ke email, WhatsApp orang tua, dan dashboard wali mahasiswa atas nama ${st.name}.`);
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] cursor-pointer"
                    >
                      Kirim Peringatan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3B. BI Real-time Dashboard */}
      {activeTab === 'bi' && (
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Visualisasi Pertumbuhan &amp; Penerimaan Mahasiswa</span>
          
          <div className="h-48 w-full bg-slate-50 dark:bg-slate-950/40 rounded-xl p-2 border border-slate-100 dark:border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415510" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Teknik" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bisnis" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hukum" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Angkatan 2026</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">1.400 Mhs</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Rasio Kelulusan</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">96.5%</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Akreditasi Fakultas</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400">UNGGUL (A)</span>
            </div>
          </div>
        </div>
      )}

      {/* 3C. Tracer Study */}
      {activeTab === 'tracer' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <h5 className="text-sm font-bold text-slate-800 dark:text-white">Alumni Tracer Survey Module</h5>
              <p className="text-[11px] text-slate-500">Menganalisis masa tunggu kerja &amp; bidang industri keterserapan alumni.</p>
            </div>
            <button 
              onClick={() => alert('Simulator formulir survey kuesioner kelayakan wisuda di-generate & link broadcast dikirim ke 450 alumni angkatan terbaru.')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
            >
              Kirim Survey Otomatis
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tracerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {tracerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ALUMNI_COLORS[index % ALUMNI_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Keterserapan Bidang Industri</span>
              {tracerData.map((item, idx) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ALUMNI_COLORS[idx] }} />
                    {item.name}
                  </span>
                  <span className="font-mono font-black text-slate-800 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. MODULE: MOBILE-FRIENDLY & PWA UTILITY
// ==========================================
export function MobilePwaControlBar() {
  const [offlineMode, setOfflineMode] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const simulateDocScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedImage('https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?w=400&auto=format&fit=crop&q=60');
      alert('Dokumen berhasil dikompresi, di-crop otomatis dengan deteksi border AI, dan siap diunggah sebagai berkas pendaftaran.');
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900/60 dark:to-slate-950/60 border border-blue-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
      <div className="space-y-1">
        <h5 className="text-xs font-black text-slate-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
          <Laptop className="w-4 h-4 text-blue-500" />
          PWA &amp; Mobile Optimization Center
        </h5>
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
          SIAKAD mendukung akses offline progresif, mode kompresi data hemat kuota, serta pemindaian berkas langsung dari kamera ponsel.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Offline Sandbox */}
        <button
          onClick={() => setOfflineMode(!offlineMode)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 cursor-pointer border transition-all ${
            offlineMode
              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          {offlineMode ? 'Sandbox Offline: AKTIF' : 'Simulasi Offline'}
        </button>

        {/* Data Saver Mode */}
        <button
          onClick={() => setDataSaver(!dataSaver)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 cursor-pointer border transition-all ${
            dataSaver
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          {dataSaver ? 'Mode Hemat Kuota: ON' : 'Mode Hemat Kuota'}
        </button>

        {/* Camera Scanner */}
        <button
          onClick={simulateDocScan}
          disabled={isScanning}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-[10px] font-black flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/15"
        >
          <Camera className="w-3.5 h-3.5" />
          {isScanning ? 'Memindai...' : 'Scan Dokumen WebCam'}
        </button>

        {scannedImage && (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">Scan_Doc.pdf ✓</span>
            <button 
              onClick={() => setScannedImage(null)}
              className="p-0.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. MODULE: FITUR MANDIRI MAHASISWA (SELF-SERVICE)
// ==========================================
export function StudentSelfServiceModule() {
  const [activeTab, setActiveTab] = useState<'skpi' | 'krs' | 'perwalian'>('skpi');

  // E-Portfolio accomplishments
  const [portfolio, setPortfolio] = useState([
    { id: 1, title: 'Juara 1 National Competitive Programming Contest (GEMASTIK)', category: 'Prestasi Nasional', points: 25, doc: 'Verified' },
    { id: 2, title: 'Ketua Himpunan Mahasiswa Teknik Informatika (HMIF)', category: 'Organisasi & Kepemimpinan', points: 15, doc: 'Verified' },
    { id: 3, title: 'Google Certified Mobile Web Specialist', category: 'Sertifikasi Keahlian', points: 20, doc: 'Verified' }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Prestasi Nasional');

  // Smart KRS Clash Simulation
  const [courses, setCourses] = useState([
    { code: 'IF3110', name: 'Web Dev Enterprise', sks: 3, day: 'Senin', time: '08:00 - 10:30', checked: true, clash: false },
    { code: 'IF3150', name: 'Manajemen Proyek PL', sks: 3, day: 'Senin', time: '08:00 - 10:30', checked: false, clash: true },
    { code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, day: 'Rabu', time: '13:00 - 15:30', checked: true, clash: false }
  ]);

  // Perwalian online status
  const [advisingLog, setAdvisingLog] = useState([
    { author: 'Dosen Wali (Dr. Budi Rahardjo)', msg: 'Silakan ambil Web Dev Enterprise untuk memperkuat jalur web, pastikan bentrok dengan Manajemen Proyek diselesaikan.', date: '25 Juni 2026' }
  ]);
  const [advisingInput, setAdvisingInput] = useState('');

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setPortfolio(prev => [
      ...prev,
      {
        id: Date.now(),
        title: newTitle,
        category: newCategory,
        points: 10,
        doc: 'Pending'
      }
    ]);
    setNewTitle('');
  };

  const handleSendAdvisingMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisingInput) return;
    setAdvisingLog(prev => [
      ...prev,
      {
        author: 'Anda (Mahasiswa)',
        msg: advisingInput,
        date: 'Baru saja'
      }
    ]);
    setAdvisingInput('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-200">
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('skpi')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'skpi' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> E-Portofolio &amp; SKPI
        </button>
        <button 
          onClick={() => setActiveTab('krs')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'krs' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Simulasi KRS Cerdas
        </button>
        <button 
          onClick={() => setActiveTab('perwalian')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'perwalian' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" /> Perwalian Online
        </button>
      </div>

      {/* 5A. E-Portfolio & SKPI */}
      {activeTab === 'skpi' && (
        <div className="space-y-4">
          <form onSubmit={handleAddPortfolio} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Unggah Portofolio Kegiatan / Prestasi</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <input 
                  type="text" 
                  placeholder="Ketik judul penghargaan atau sertifikasi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                >
                  <option value="Prestasi Nasional">Prestasi Nasional</option>
                  <option value="Sertifikasi Keahlian">Sertifikasi Keahlian</option>
                  <option value="Organisasi &amp; Kepemimpinan">Organisasi Kampus</option>
                  <option value="Pengabdian Masyarakat">Pengabdian</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl cursor-pointer"
            >
              Ajukan Prestasi Portofolio
            </button>
          </form>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Berkas Portofolio Pengisi SKPI</span>
              <button 
                onClick={() => alert('Mengunduh dokumen Surat Keterangan Pendamping Ijazah (SKPI) resmi yang ditandatangani secara digital oleh Dekan Fakultas dalam format PDF.')}
                className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Draft SKPI (PDF)
              </button>
            </div>

            <div className="space-y-1.5">
              {portfolio.map((item) => (
                <div key={item.id} className="p-3 bg-white dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/80 rounded-xl flex justify-between items-center shadow-sm">
                  <div>
                    <h6 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h6>
                    <span className="text-[9px] font-bold text-slate-400">{item.category}</span>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-[10px] font-mono font-black text-blue-600 dark:text-blue-400">+{item.points} Pts</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.doc === 'Verified'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                    }`}>
                      {item.doc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5B. Smart KRS Simulation */}
      {activeTab === 'krs' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl text-amber-800 dark:text-amber-400 text-xs flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <div>
              <span className="font-extrabold">Pencegah Bentrok KRS Otomatis:</span>
              <p className="text-[10px] font-semibold mt-0.5 leading-relaxed text-amber-700/90 dark:text-amber-400/90">
                Sistem mendeteksi jadwal mata kuliah pilihan secara visual untuk mengantisipasi pengambilan jadwal di hari &amp; jam yang sama sebelum dikirimkan ke Dosen Wali.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Simulator Kelas &amp; Hari Kuliah</span>
            <div className="space-y-2">
              {courses.map((course, idx) => (
                <div 
                  key={course.code} 
                  className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                    course.clash && !course.checked
                      ? 'border-rose-200 bg-rose-50/20 dark:bg-rose-950/10'
                      : 'border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h6 className="text-xs font-bold text-slate-800 dark:text-white">{course.name}</h6>
                      <span className="text-[9px] font-mono text-slate-400">{course.code} &bull; {course.sks} SKS</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{course.day}, {course.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {course.clash && (
                      <span className="text-[9px] font-extrabold text-rose-600 dark:text-rose-400 animate-pulse bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded-md">
                        ⚠️ JADWAL BENTROK
                      </span>
                    )}
                    <button
                      onClick={() => {
                        const updated = [...courses];
                        updated[idx].checked = !updated[idx].checked;
                        setCourses(updated);
                      }}
                      className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer ${
                        course.checked
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {course.checked ? 'Dipilih' : 'Pilih Kelas'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5C. Perwalian Online */}
      {activeTab === 'perwalian' && (
        <div className="space-y-4">
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Catatan Bimbingan Perwalian</span>
            
            <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar">
              {advisingLog.map((log, i) => (
                <div key={i} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl text-xs space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-600 dark:text-blue-400">{log.author}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{log.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 italic">"{log.msg}"</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendAdvisingMsg} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Balas catatan perwalian..."
                value={advisingInput}
                onChange={(e) => setAdvisingInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
              />
              <button 
                type="submit"
                className="px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Balas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. MODULE: KEAMANAN & KEPATUHAN (2FA & AUDIT LOGS)
// ==========================================
export function SecurityComplianceModule({ user }: { user: any }) {
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);

  const [activeTab, setActiveTab] = useState<'twofa' | 'audit'>('twofa');

  const [logs, setLogs] = useState([
    { id: 1, action: 'Validasi KRS Mahasiswa Nim 10115121', user: 'Dr. Budi Rahardjo', role: 'Dosen Wali', ip: '192.168.10.12', time: '25 Juni 2026 14:15' },
    { id: 2, action: 'Ubah Data Nilai KHS Mata Kuliah Web Enterprise', user: 'Dr. Hendra Wijaya', role: 'Dosen Pengampu', ip: '192.168.10.45', time: '25 Juni 2026 12:30' },
    { id: 3, action: 'Penerbitan Tagihan Pembayaran UKT Semester Ganjil', user: 'Agus Santoso', role: 'Admin Keuangan', ip: '10.10.1.92', time: '24 Juni 2026 10:10' }
  ]);

  const handleToggle2Fa = () => {
    if (twoFaEnabled) {
      setTwoFaEnabled(false);
      setOtpSent(false);
    } else {
      setOtpSent(true);
      setOtpTimer(60);
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode === '2506') {
      setTwoFaEnabled(true);
      setOtpSent(false);
      setLogs(prev => [
        {
          id: Date.now(),
          action: 'Aktivasi Otentikasi Dua Faktor (2FA) Keamanan Akun',
          user: user.name,
          role: user.role,
          ip: '127.0.0.1 (Local)',
          time: 'Baru saja'
        },
        ...prev
      ]);
    } else {
      alert('Kode OTP salah! (Masukkan kode "2506" untuk simulator)');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-200">
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('twofa')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'twofa' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Key className="w-3.5 h-3.5" /> Two-Factor Authentication (2FA)
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'audit' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Server className="w-3.5 h-3.5" /> Log Aktivitas &amp; Audit Trail
        </button>
      </div>

      {/* 6A. 2FA Setup */}
      {activeTab === 'twofa' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Dual-Shield 2FA OTP</span>
              <h6 className="text-xs font-black text-slate-850 dark:text-white">Dua Faktor Pengamanan Akun</h6>
              <p className="text-[10px] text-slate-500">Mencegah akses ilegal dengan mengirim kode OTP via email/HP tiap login.</p>
            </div>

            <button 
              onClick={handleToggle2Fa}
              className={`px-4 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                twoFaEnabled
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {twoFaEnabled ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA'}
            </button>
          </div>

          {otpSent && (
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl space-y-3">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">Simulator OTP Verifikasi (Cek Email Anda)</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">Masukkan kode OTP 4-angka **2506** untuk melanjutkan aktivasi simulator:</p>
              
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="Kode OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  onClick={handleVerifyOtp}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Verifikasi OTP
                </button>
              </div>
            </div>
          )}

          {twoFaEnabled && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500 animate-pulse" />
              <span>Otentikasi Dua Faktor (2FA) Aktif. Akun Anda saat ini terlindung dengan tingkat kepatuhan PD Dikti tertinggi.</span>
            </div>
          )}
        </div>
      )}

      {/* 6B. Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Catatan Histori Perubahan Data Sensitif</span>
            <span className="text-[9px] font-extrabold text-slate-450 flex items-center gap-1">
              <Database className="w-3 h-3" /> Integrity Check: VALID (SHA-256)
            </span>
          </div>

          <div className="space-y-1.5 max-h-[180px] overflow-y-auto custom-scrollbar">
            {logs.map((log) => (
              <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl text-xs space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800 dark:text-white">{log.action}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{log.time}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Oleh: {log.user} ({log.role})</span>
                  <span className="font-mono text-[9px]">IP: {log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. MODULE: FITUR KEKINIAN (PLAGIARISME & DIGITAL E-SIGN)
// ==========================================
export function ModernTechModule() {
  const [activeTab, setActiveTab] = useState<'plagiarism' | 'esign'>('plagiarism');

  // Plagiarism state
  const [isChecking, setIsChecking] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState<any>(null);

  // Signature Pad state
  const [signedDoc, setSignedDoc] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);

  const triggerPlagiarismCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setPlagiarismResult({
        score: 12,
        sources: [
          { name: 'Repository UI/UX UI', percent: 6 },
          { name: 'Jurnal Ilmiah Teknik Informasi v4', percent: 4 },
          { name: 'Blog Teknologi OpenSource', percent: 2 }
        ],
        status: 'AMAN (Di bawah toleransi 20%)'
      });
    }, 1800);
  };

  const handleEsign = () => {
    setSignedDoc(true);
    alert('Dokumen berhasil dibubuhi Tanda Tangan Elektronik (TTE) Tersertifikasi BSrE / Kominfo RI dengan Barcode Cryptographic Validator.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-200">
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('plagiarism')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'plagiarism' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" /> Cek Plagiarisme Draft TA
        </button>
        <button 
          onClick={() => setActiveTab('esign')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'esign' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" /> Digital Signature (E-Sign)
        </button>
      </div>

      {/* 7A. Plagiarism Checker */}
      {activeTab === 'plagiarism' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-3">
            <span className="text-[10px] font-black text-slate-500 block uppercase">Pemeriksaan Kemiripan Tulisan Mandiri</span>
            <p className="text-[10px] text-slate-400 max-w-sm mx-auto">SIAKAD terintegrasi pembanding repositori lokal tugas akhir guna meminimalisasi duplikasi karya ilmiah sebelum sidang.</p>
            
            <button 
              onClick={triggerPlagiarismCheck}
              disabled={isChecking}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {isChecking ? 'Menganalisis kemiripan...' : 'Simulasikan Cek Plagiasi Draft'}
            </button>
          </div>

          {plagiarismResult && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-100/30 pb-2">
                <span className="text-xs font-black text-emerald-800 dark:text-emerald-400">Plagiarism Score Result</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{plagiarismResult.score}%</span>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Indeks Kemiripan Sumber</span>
                {plagiarismResult.sources.map((src: any) => (
                  <div key={src.name} className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">{src.name}</span>
                    <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">{src.percent}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                STATUS: {plagiarismResult.status}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7B. Digital Signature */}
      {activeTab === 'esign' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
            <span className="text-[10px] font-black text-slate-500 block uppercase">TTE Tersertifikasi BSrE</span>
            <p className="text-[10px] text-slate-400">Bubuhi tanda tangan pada berkas KRS / BAP digital secara sah hukum.</p>
            
            {/* Draw Pad Canvas simulation area */}
            <div className="w-full h-32 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center relative cursor-crosshair">
              <span className="text-[10px] text-slate-400 font-bold select-none">Silakan gambar/bubuhkan tanda tangan Anda di area ini</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleEsign}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl cursor-pointer"
              >
                Simpan &amp; Tanda Tangani Dokumen Digital
              </button>
              <button 
                onClick={() => alert('Kanvas dibersihkan.')}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-xl cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {signedDoc && (
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                <QrIcon className="w-8 h-8 text-blue-500" />
                <div>
                  <div>KRS_SIGNED_VERIFIED.pdf</div>
                  <span className="text-[9px] text-slate-400 font-mono font-normal">SHA-256: e3b0c44298fc1c14...</span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                ✓ SAH (E-SIGN)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
