import React, { useState, useEffect } from 'react';
import {
  ChatThread,
  StudentAcademic,
  JurnalItem,
  ChatMessage,
  sendChatMessage,
  getAcademicAnnouncements,
  createAcademicAnnouncement,
} from '../../../api/academic.api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Bell, 
  MessageSquare, 
  Send, 
  FileSpreadsheet, 
  CheckCircle, 
  Download, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface LecturerCommunicationModuleProps {
  students: StudentAcademic[];
  jurnal: JurnalItem[];
  chats: ChatThread[];
  setChats: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  onShowToast: (message: string) => void;
  subTab: string;
}

export function LecturerCommunicationModule({
  students,
  jurnal,
  chats,
  setChats,
  onShowToast,
  subTab
}: LecturerCommunicationModuleProps) {
  // 1. Chat States
  const [activeThreadNim, setActiveThreadNim] = useState<string>(chats[0]?.studentNim || '');
  const [typedMessage, setTypedMessage] = useState<string>('');

  // 2. Announcement States (riwayat pengumuman nyata dari backend)
  const [announcementClass, setAnnouncementClass] = useState<string>('IF3110-A');
  const [announcementMsg, setAnnouncementMsg] = useState<string>('');
  const [announcementList, setAnnouncementList] = useState<Array<{ classId: string; date: string; text: string }>>([]);

  useEffect(() => {
    let cancelled = false;
    getAcademicAnnouncements()
      .then((anns) => {
        if (cancelled) return;
        setAnnouncementList(
          anns.map((a) => ({ classId: a.target || '-', date: a.date, text: a.content })),
        );
      })
      .catch(() => {
        // biarkan riwayat kosong; UI menampilkan kondisi "Belum ada data"
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Active chat details
  const activeThread = chats.find(c => c.studentNim === activeThreadNim) || chats[0];

  // Handle Send Chat Message (disimpan ke backend, tanpa balasan otomatis)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeThread) return;
    const recipient = activeThread.studentEmail;
    if (!recipient) {
      onShowToast('Error: Penerima pesan tidak ditemukan.');
      return;
    }

    const text = typedMessage;
    setTypedMessage('');
    sendChatMessage(recipient, text)
      .then((saved) => {
        const newMessage: ChatMessage = {
          id: saved.id || 'm_lect_' + Date.now(),
          sender: 'lecturer',
          text,
          timestamp: saved.timestamp || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setChats(prevChats =>
          prevChats.map(thread => {
            if (thread.studentNim === activeThreadNim) {
              return {
                ...thread,
                lastMessage: text,
                timestamp: 'Just now',
                messages: [...thread.messages, newMessage],
              };
            }
            return thread;
          }),
        );
        onShowToast('Pesan terkirim!');
      })
      .catch(() => onShowToast('Gagal mengirim pesan. Silakan coba lagi.'));
  };

  // Broadcast announcement (disimpan ke backend)
  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.trim()) {
      onShowToast('Error: Pesan pengumuman wajib diisi!');
      return;
    }
    const text = announcementMsg;
    setAnnouncementMsg('');
    createAcademicAnnouncement({
      title: `Pengumuman Kelas ${announcementClass}`,
      content: text,
      target: announcementClass,
      date: new Date().toISOString().split('T')[0],
    })
      .then((ann) => {
        setAnnouncementList((prev) => [
          { classId: ann.target || announcementClass, date: ann.date, text: ann.content },
          ...prev,
        ]);
        onShowToast(`Pengumuman kelas berhasil disiarkan ke mahasiswa ${announcementClass}!`);
      })
      .catch(() => onShowToast('Gagal menyiarkan pengumuman. Silakan coba lagi.'));
  };

  // Grade distributions data for Recharts
  const gradeDistributionData = [
    { name: 'A', count: students.filter(s => s.grades.gradeLetter === 'A').length, fill: '#10b981' },
    { name: 'B', count: students.filter(s => s.grades.gradeLetter === 'B').length, fill: '#3b82f6' },
    { name: 'C', count: students.filter(s => s.grades.gradeLetter === 'C').length, fill: '#f59e0b' },
    { name: 'D', count: students.filter(s => s.grades.gradeLetter === 'D').length, fill: '#ef4444' },
    { name: 'E', count: students.filter(s => s.grades.gradeLetter === 'E').length, fill: 'var(--color-ink-muted)' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. CHAT DOSEN - MAHASISWA */}
      {subTab === 'pesan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
          {/* Threads list */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col h-full">
            <h4 className="text-xs font-bold text-slate-800 dark:text-whiter mb-3 px-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" /> Percakapan Aktif
            </h4>
            <div className="flex-1 overflow-y-auto space-y-2">
              {chats.map(thread => (
                <button
                  key={thread.studentNim}
                  onClick={() => {
                    setActiveThreadNim(thread.studentNim);
                    // Mark as read
                    setChats(prev => prev.map(t => t.studentNim === thread.studentNim ? { ...t, unread: false } : t));
                  }}
                  className={`w-full p-3 border rounded-xl text-left transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    thread.studentNim === activeThreadNim
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-300'
                  }`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold truncate">{thread.studentName}</h5>
                      {thread.unread && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </div>
                    <p className={`text-[11px] truncate ${thread.studentNim === activeThreadNim ? 'text-blue-100' : 'text-slate-400'}`}>
                      {thread.lastMessage}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono font-medium ${thread.studentNim === activeThreadNim ? 'text-blue-200' : 'text-slate-400'}`}>
                    {thread.timestamp}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Windows */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">{activeThread.studentName}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">NIM. {activeThread.studentNim} &bull; Hubungan: Mahasiswa Wali</p>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {activeThread.messages.map((m, idx) => {
                    const isLecturer = m.sender === 'lecturer';
                    return (
                      <div key={idx} className={`flex ${isLecturer ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isLecturer
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}>
                          <p className="font-medium">{m.text}</p>
                          <span className={`block text-[9px] text-right mt-1.5 font-mono ${isLecturer ? 'text-blue-200' : 'text-slate-400'}`}>
                            {m.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Send Footer */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <input 
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Tulis balasan pesan untuk bimbingan..."
                    className="flex-1 px-4 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                  <button 
                    type="submit"
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-10 h-10 stroke-1" />
                <p className="text-xs font-semibold mt-2">Pilih obrolan di sebelah kiri</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PENGUMUMAN KELAS */}
      {subTab === 'pengumuman-kelas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Announcement */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" /> Siarkan Pengumuman Baru
            </h4>
            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Target Kelas Kuliah</label>
                <select 
                  value={announcementClass}
                  onChange={(e) => setAnnouncementClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="IF3110-A">IF3110 - Pengembangan Web (IF-39-01)</option>
                  <option value="IF3150-B">IF3150 - Sistem Operasi (IF-39-02)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Isi Informasi Pengumuman</label>
                <textarea 
                  rows={4}
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  placeholder="Ketik pengumuman atau instruksi penting kepada mahasiswa..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                Siarkan Pengumuman
              </button>
            </form>
          </div>

          {/* Broadcasted history list */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Histori Pengumuman Terkirim</h4>
            <div className="space-y-4">
              {announcementList.map((ann, i) => (
                <div key={i} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-blue-600 font-mono uppercase">KELAS: {ann.classId}</span>
                      <span className="text-slate-400 font-mono">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{ann.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. REKAP PRESENSI */}
      {subTab === 'rekap-presensi' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Rekapitulasi Presensi Kehadiran Mahasiswa</h4>
              <p className="text-xs text-slate-500">Persentase & rincian total kehadiran kelas perkuliahan hingga minggu berjalan.</p>
            </div>
            <button 
              onClick={() => onShowToast('File Rekap Presensi berhasil diunduh (Excel)!')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor Rekap Presensi (Excel)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/15">
              <span className="text-[10px] text-slate-400 font-boldr">Rata-rata Kehadiran Kelas</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">94.3%</p>
              <p className="text-[10px] text-slate-500 mt-1">Keaktifan yang sangat baik.</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/15">
              <span className="text-[10px] text-slate-400 font-boldr">Batas Kehadiran UAS</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">75.0%</p>
              <p className="text-[10px] text-slate-500 mt-1">Syarat wajib lulus mengikuti ujian.</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/15">
              <span className="text-[10px] text-slate-400 font-boldr">Mahasiswa Terancam Alpha</span>
              <p className="text-xl font-extrabold text-rose-500 mt-1">1 Orang</p>
              <p className="text-[10px] text-rose-400 mt-1">&bull; Dedi Kurniawan (NIM 13521089)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                  <th className="pb-3 pl-2">Mahasiswa</th>
                  <th className="pb-3 text-center">Hadir</th>
                  <th className="pb-3 text-center">Sakit</th>
                  <th className="pb-3 text-center">Izin</th>
                  <th className="pb-3 text-center">Alpha</th>
                  <th className="pb-3 text-center">Total Sesi</th>
                  <th className="pb-3 text-right pr-2">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {students.map((student) => {
                  const pct = Math.round((student.attendance.hadir / student.attendance.total) * 100);
                  return (
                    <tr key={student.nim} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="py-3 pl-2">
                        <span className="font-bold text-slate-800 dark:text-white">{student.name}</span>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{student.nim}</p>
                      </td>
                      <td className="py-3 text-center font-bold text-emerald-600">{student.attendance.hadir}</td>
                      <td className="py-3 text-center text-slate-500">{student.attendance.sakit}</td>
                      <td className="py-3 text-center text-slate-500">{student.attendance.izin}</td>
                      <td className="py-3 text-center font-bold text-rose-500">{student.attendance.alpha}</td>
                      <td className="py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{student.attendance.total}</td>
                      <td className="py-3 text-right pr-2 font-extrabold text-blue-600 dark:text-blue-400">
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REKAP NILAI */}
      {subTab === 'rekap-nilai' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Rekapitulasi Nilai & Distribusi Nilai Kelas</h4>
              <p className="text-xs text-slate-500">Melihat performa akademik, grafik pencapaian nilai, serta berita acara kuliah.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onShowToast('Berita acara kuliah berhasil dicetak!')}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cetak Berita Acara
              </button>
              <button 
                onClick={() => onShowToast('Excel Rekap Nilai berhasil diunduh!')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Table */}
            <div className="lg:col-span-7">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                      <th className="pb-3 pl-2">Mahasiswa</th>
                      <th className="pb-3 text-center">UTS</th>
                      <th className="pb-3 text-center">UAS</th>
                      <th className="pb-3 text-center">Nilai Akhir</th>
                      <th className="pb-3 text-right pr-2">Grade Huruf</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {students.map((student) => (
                      <tr key={student.nim} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="py-3 pl-2">
                          <span className="font-bold text-slate-800 dark:text-white">{student.name}</span>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{student.nim}</p>
                        </td>
                        <td className="py-3 text-center font-mono font-medium text-slate-600 dark:text-slate-400">{student.grades.uts}</td>
                        <td className="py-3 text-center font-mono font-medium text-slate-600 dark:text-slate-400">{student.grades.uas}</td>
                        <td className="py-3 text-center font-bold text-slate-800 dark:text-white font-mono">{student.grades.final}</td>
                        <td className="py-3 text-right pr-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 text-xs font-extrabold">{student.grades.gradeLetter}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recharts Bar chart of grade distributions */}
            <div className="lg:col-span-5 bg-slate-50/50 dark:bg-slate-950/25 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-800 dark:text-whiter mb-4">Grafik Distribusi Huruf Kelulusan</h5>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-ink-muted)' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--color-ink-muted)' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. LAPORAN DOSEN / BKD */}
      {(subTab === 'bkd' || subTab === 'riwayat-mengajar') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-blue-500" /> Beban Kerja Dosen (BKD) & Riwayat
            </h4>

            {/* BKD Progress */}
            <div className="p-4 border border-blue-100 dark:border-blue-950 bg-blue-50/40 dark:bg-blue-950/20 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Pencapaian SKS Mengajar</span>
                <span className="text-blue-600">9 SKS / Min. 12 SKS Target</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-[10px] text-slate-500">Anda mengampu 3 mata kuliah semester ganjil ini dengan total beban 9 SKS.</p>
            </div>

            {/* Riwayat mengajar table */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-800 dark:text-whiter">Riwayat Pengajaran Lintas Semester</h5>
              <div className="space-y-2.5">
                <div className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">SEMESTER GENJIL 2025/2026</span>
                    <h6 className="font-bold text-slate-800 dark:text-white mt-0.5">Struktur Data & Basis Data Lanjut</h6>
                  </div>
                  <span className="font-bold text-slate-600 dark:text-slate-400">6 SKS</span>
                </div>
                <div className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">SEMESTER GENAP 2024/2025</span>
                    <h6 className="font-bold text-slate-800 dark:text-white mt-0.5">Pemrograman Berorientasi Objek</h6>
                  </div>
                  <span className="font-bold text-slate-600 dark:text-slate-400">3 SKS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Ringkasan Laporan BKD</h4>
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-100 dark:border-emerald-900 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">Penelitian Selesai</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">3 Jurnal internasional terindeks Scopus.</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-100 dark:border-emerald-900 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">Pengabdian Masyarakat</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pelatihan literasi digital UMKM Bandung.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
