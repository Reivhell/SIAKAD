import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, AlertCircle, BookOpen, Calendar, 
  CheckCircle, ArrowRight, CreditCard, Award, QrCode, ClipboardList,
  User, Check, Phone, ShieldCheck, Download
} from 'lucide-react';
import { User as UserType } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  widget?: 'krs' | 'qris' | 'qr_absensi' | 'skripsi';
}

interface AcademicChatbotProps {
  user: UserType;
}

export function AcademicChatbot({ user }: AcademicChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasNotification, setHasNotification] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulated KRS data for student
  const [krsSimulated, setKrsSimulated] = useState([
    { code: 'IF301', name: 'Analisis & Desain Perangkat Lunak', sks: 3, checked: false },
    { code: 'IF302', name: 'Kecerdasan Buatan (AI)', sks: 3, checked: false },
    { code: 'IF303', name: 'Pemrograman Web Enterprise', sks: 4, checked: false },
    { code: 'IF304', name: 'Sistem Terdistribusi', sks: 3, checked: false },
  ]);

  // Simulated UKT Payment states
  const [uktPaid, setUktPaid] = useState(() => {
    return user?.id ? localStorage.getItem(`siakad_ukt_paid_${user.id}`) === 'true' : false;
  });
  const [isPaying, setIsPaying] = useState(false);

  // Simulated Attendance state
  const [attendanceCodeGenerated, setAttendanceCodeGenerated] = useState(false);
  const [attendanceMinutesLeft, setAttendanceMinutesLeft] = useState(15);

  // Simulated Skripsi states
  const [skripsiStep, setSkripsiStep] = useState(2); // 1: Pengajuan Judul, 2: Seminar Proposal, 3: Bimbingan, 4: Sidang Akhir

  useEffect(() => {
    if (!user) return;
    // Welcome message based on role
    const welcomeText = user.role === 'student'
      ? `Halo ${user.name || 'User'}! Saya **Asisten Akademik AI SIAKAD**. Bagaimana saya bisa membantu Anda hari ini? Anda bisa menanyakan rekomendasi mata kuliah KRS, memeriksa tagihan UKT, melacak status bimbingan skripsi, atau melakukan presensi kuliah.`
      : `Selamat datang, ${user.name || 'User'}! Saya **Asisten Akademik AI SIAKAD** untuk Dosen. Anda dapat memantau jadwal mengajar hari ini, menghasilkan QR presensi kuliah dinamis, mengirim pengumuman kelas, atau meninjau berkas skripsi bimbingan mahasiswa.`;

    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date(),
      }
    ]);
  }, [user]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasNotification(false);
  };

  const simulateTyping = (responseProps: Partial<Message>, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          text: '',
          timestamp: new Date(),
          ...responseProps,
        },
      ]);
    }, delay);
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    const query = textToSend.toLowerCase();

    // Student specific flows
    if (user.role === 'student') {
      if (query.includes('krs') || query.includes('rekomendasi') || query.includes('mata kuliah') || query.includes('sks')) {
        simulateTyping({
          text: `Berdasarkan Indeks Prestasi Kumulatif (IPK) Anda yang luar biasa, Anda direkomendasikan mengambil mata kuliah lanjutan Semester Ganjil TA 2026/2027 berikut. Silakan pilih mata kuliah di bawah untuk simulasi beban SKS Anda:`,
          widget: 'krs'
        });
      } else if (query.includes('ukt') || query.includes('bayar') || query.includes('biaya') || query.includes('keuangan')) {
        if (uktPaid) {
          simulateTyping({
            text: `Status tagihan UKT Anda untuk **Semester Ganjil 2026/2027** adalah **LUNAS**. Anda sudah dapat melakukan pengisian KRS tanpa hambatan administratif. Terima kasih!`
          });
        } else {
          simulateTyping({
            text: `Sistem mendeteksi Anda memiliki tagihan UKT aktif sebesar **Rp 7.500.000** untuk **Semester Ganjil 2026/2027**. Silakan gunakan modul pembayaran QRIS dinamis di bawah ini untuk penyelesaian instan:`,
            widget: 'qris'
          });
        }
      } else if (query.includes('presensi') || query.includes('absen') || query.includes('hadir') || query.includes('qr')) {
        simulateTyping({
          text: `Untuk melakukan presensi kuliah hari ini, silakan masukkan kode QR dinamis yang ditampilkan oleh Dosen di proyektor kelas atau pilih menu di bawah untuk menyimulasikan kehadiran cepat:`,
          widget: 'qr_absensi'
        });
      } else if (query.includes('skripsi') || query.includes('tugas akhir') || query.includes('sidang') || query.includes('thesis')) {
        simulateTyping({
          text: `Berikut adalah status pelacakan berkas **Tugas Akhir / Skripsi** Anda saat ini. Anda berada pada tahap **Seminar Proposal**:`,
          widget: 'skripsi'
        });
      } else if (query.includes('nilai') || query.includes('ipk') || query.includes('khs')) {
        simulateTyping({
          text: `IPK Kumulatif Anda saat ini adalah **3.74**. Seluruh Kartu Hasil Studi (KHS) dari Semester 1 s.d. 5 telah disahkan oleh Kaprodi. Anda memiliki tren kenaikan nilai yang sangat konsisten!`
        });
      } else if (query.includes('jadwal') || query.includes('kuliah') || query.includes('hari ini')) {
        simulateTyping({
          text: `📅 **Jadwal Kuliah Anda Hari Ini (Kamis, 25 Juni 2026):**\n\n1. **Kecerdasan Buatan (IF402)** — Kelas A\n   📍 Ruang: Lab RPL & AI\n   ⏰ Pukul: 08:00 - 10:30 WIB\n   👨‍🏫 Dosen: Dr. Budi Rahardjo\n\n2. **Pemrograman Web Enterprise** — Kelas B\n   📍 Ruang: Ruang Kuliah 401\n   ⏰ Pukul: 13:00 - 15:30 WIB\n   👨‍🏫 Dosen: Dr. Hendra Wijaya\n\n*Catatan: Pastikan datang 10 menit sebelum perkuliahan dimulai.*`
        });
      } else {
        simulateTyping({
          text: `Maaf, saya belum memahami pertanyaan Anda sepenuhnya. Coba tanyakan tentang **Rekomendasi KRS**, **Bayar UKT**, **Presensi Kuliah**, **Status Skripsi**, atau **Jadwal Kuliah Hari Ini**.`
        });
      }
    } 
    // Lecturer specific flows
    else if (user.role === 'lecturer') {
      if (query.includes('jadwal') || query.includes('mengajar') || query.includes('hari ini')) {
        simulateTyping({
          text: `👨‍🏫 **Jadwal Mengajar Anda Hari Ini (Kamis, 25 Juni 2026):**\n\n1. **Konsep AI (IF402)** — Kelas A\n   📍 Ruang: Lab RPL & AI\n   ⏰ Pukul: 10:00 - 12:30 WIB\n   👥 Kehadiran: 28/30 Mahasiswa\n\n2. **Pemrograman Aplikasi Web** — Kelas C\n   📍 Ruang: Ruang Kuliah 305\n   ⏰ Pukul: 14:00 - 16:30 WIB\n   👥 Kehadiran: Belum Dimulai`
        });
      } else if (query.includes('presensi') || query.includes('absen') || query.includes('hadir') || query.includes('qr')) {
        simulateTyping({
          text: `Buat sesi presensi digital instan untuk kelas Anda yang sedang berlangsung sekarang. Mahasiswa cukup memindai kode QR dari layar proyektor atau perangkat mereka:`,
          widget: 'qr_absensi'
        });
      } else if (query.includes('bimbingan') || query.includes('skripsi') || query.includes('mahasiswa')) {
        simulateTyping({
          text: `Anda saat ini membimbing **5 Mahasiswa Tugas Akhir**. Mahasiswa atas nama **Aditya Pratama (NIM: 1901001)** baru saja mengunggah draft Bab III untuk peninjauan Anda. Silakan hubungi prodi untuk penjadwalan sidang.`
        });
      } else if (query.includes('riset') || query.includes('hibah') || query.includes('penelitian')) {
        simulateTyping({
          text: `Sponsor dan Pengajuan Hibah Riset Penelitian Internal Dosen Tahun Anggaran 2026 diperpanjang hingga **15 Juli 2026**. Topik prioritas meliputi: Artificial Intelligence (AI), Internet of Things (IoT), dan Keamanan Siber.`
        });
      } else {
        simulateTyping({
          text: `Maaf Bapak/Ibu Dosen ${user.name || 'User'}, saya masih menyempurnakan respon ini. Silakan coba tanyakan mengenai **Jadwal Mengajar**, **Membuat QR Presensi**, atau **Bimbingan Skripsi Mahasiswa**.`
        });
      }
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  // Simulated payments trigger
  const triggerUktPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setUktPaid(true);
      localStorage.setItem(`siakad_ukt_paid_${user.id}`, 'true');
      
      // Post system announcement that UKT has been updated
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'system',
          text: '🎉 Pembayaran UKT sebesar Rp 7.500.000 Berhasil diproses menggunakan QRIS Dinamis. Status Akademik Anda: AKTIF.',
          timestamp: new Date()
        }
      ]);
    }, 2000);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpenChat}
          className={`relative p-4 rounded-full text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-transform duration-150 cursor-pointer flex items-center justify-center ${
            isOpen 
              ? 'bg-rose-500 hover:bg-rose-600 rotate-90' 
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
          title="Asisten Akademik AI"
          id="academic-chatbot-trigger"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}

          {/* Unread notification ping */}
          {hasNotification && !isOpen && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-black items-center justify-center text-white">
                1
              </span>
            </span>
          )}
        </button>
      </div>

      {/* Main Collapsible Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-40 w-[90vw] sm:w-[400px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-colors duration-200"
            id="academic-chatbot-container"
          >
            {/* Chatbot Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center select-none">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl bg-white/10 border border-white/15">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-black leading-tight flex items-center gap-1.5">
                    Asisten Akademik AI
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </h4>
                  <p className="text-[10px] text-blue-100 font-medium">
                    SIAKAD Smart Helper &amp; Copilot
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  {/* Sender Labels */}
                  {msg.sender !== 'system' && (
                    <div className={`flex items-center gap-1.5 text-[9px] font-boldr text-slate-400 px-1 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      {msg.sender === 'user' ? (
                        <>
                          <span>Anda ({user.name || 'User'})</span>
                          <User className="w-3 h-3 text-slate-400" />
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          <span>Asisten SIAKAD AI</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                    {msg.sender === 'system' ? (
                      <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold text-center max-w-[90%] flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{msg.text}</span>
                      </div>
                    ) : (
                      <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed max-w-[85%] font-medium ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                          : 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                      }`}>
                        {/* Safe simple formatting for linebreaks and bolding */}
                        <div className="whitespace-pre-line">
                          {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-blue-600 dark:text-blue-400">{chunk}</strong> : chunk)}
                        </div>

                        {/* Interactive Widget Injector */}
                        {msg.widget && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            
                            {/* WIDGET 1: KRS Recommender */}
                            {msg.widget === 'krs' && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-400r block">
                                  Simulasi Pengisian Mata Kuliah (SKS)
                                </span>
                                <div className="grid grid-cols-1 gap-2">
                                  {krsSimulated.map((course, idx) => (
                                    <button
                                      key={course.code}
                                      onClick={() => {
                                        const updated = [...krsSimulated];
                                        updated[idx].checked = !updated[idx].checked;
                                        setKrsSimulated(updated);
                                      }}
                                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                        course.checked
                                          ? 'border-blue-500 bg-blue-50/55 dark:bg-blue-950/25 text-blue-700 dark:text-blue-300'
                                          : 'border-slate-200/60 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/40 hover:bg-slate-100'
                                      }`}
                                    >
                                      <div>
                                        <div className="text-[11px] font-bold">{course.name}</div>
                                        <div className="text-[9px] text-slate-400 font-mono">{course.code} &bull; {course.sks} SKS</div>
                                      </div>
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        course.checked 
                                          ? 'border-blue-500 bg-blue-500 text-white' 
                                          : 'border-slate-300'
                                      }`}>
                                        {course.checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                
                                {/* SKS counter banner */}
                                <div className="p-2 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/30 rounded-xl flex justify-between items-center text-[10px] font-extrabold text-blue-700 dark:text-blue-400">
                                  <span>TOTAL SKS TERPILIH:</span>
                                  <span>
                                    {krsSimulated.reduce((acc, c) => acc + (c.checked ? c.sks : 0), 0)} / 24 SKS
                                  </span>
                                </div>
                                
                                <button
                                  onClick={() => {
                                    const selectedCount = krsSimulated.filter(c => c.checked).length;
                                    if (selectedCount === 0) {
                                      setMessages((prev) => [
                                        ...prev,
                                        {
                                          id: Math.random().toString(),
                                          sender: 'assistant',
                                          text: 'Silakan pilih minimal 1 mata kuliah terlebih dahulu untuk melakukan simulasi KRS.',
                                          timestamp: new Date()
                                        }
                                      ]);
                                      return;
                                    }
                                    setMessages((prev) => [
                                      ...prev,
                                      {
                                        id: Math.random().toString(),
                                        sender: 'assistant',
                                        text: `Hebat! Anda telah menyimulasikan **${selectedCount} Mata Kuliah** dengan total **${krsSimulated.reduce((acc, c) => acc + (c.checked ? c.sks : 0), 0)} SKS**. Konsultasikan pilihan ini dengan Dosen Wali Anda sebelum KRS ditutup pada 10 Agustus 2026.`,
                                        timestamp: new Date()
                                      }
                                    ]);
                                  }}
                                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  Ajukan Konsultasi Wali <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* WIDGET 2: QRIS Dynamic Payment Gateway */}
                            {msg.widget === 'qris' && (
                              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-slate-500">DYNAMIC BILLING GATEWAY</span>
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-md">
                                    BELUM BAYAR
                                  </span>
                                </div>
                                
                                {/* Simulated QRIS Code image */}
                                <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center space-y-2">
                                  <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center relative border border-slate-200/80 overflow-hidden">
                                    {/* QR layout style */}
                                    <QrCode className="w-24 h-24 text-slate-800" />
                                    {/* Simulated lines */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-600" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-600" />
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-600" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-600" />
                                  </div>
                                  <div className="text-[10px] font-black tracking-widest text-slate-800 font-mono">
                                    SIAKAD_QRIS_098273
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    <span>Penerima:</span>
                                    <span className="font-bold text-slate-800 dark:text-white">UNIVERSITAS SIAKAD</span>
                                  </div>
                                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    <span>Nominal:</span>
                                    <span className="font-extrabold text-blue-600 dark:text-blue-400">Rp 7.500.000</span>
                                  </div>
                                </div>

                                <button
                                  onClick={triggerUktPayment}
                                  disabled={isPaying}
                                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  {isPaying ? (
                                    <>Memproses Pembayaran...</>
                                  ) : (
                                    <>
                                      <CreditCard className="w-3.5 h-3.5" />
                                      Bayar via QRIS Simulator
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {/* WIDGET 3: QR Attendance Generator/Scanner */}
                            {msg.widget === 'qr_absensi' && (
                              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 block">
                                  {user.role === 'lecturer' ? 'PRESENSI KULIAH AKTIF' : 'SCAN QR PRESENSI'}
                                </span>
                                
                                {user.role === 'lecturer' ? (
                                  <>
                                    {!attendanceCodeGenerated ? (
                                      <button
                                        onClick={() => {
                                          setAttendanceCodeGenerated(true);
                                          setAttendanceMinutesLeft(15);
                                        }}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                                      >
                                        <QrCode className="w-3.5 h-3.5" />
                                        Hasilkan Kode Presensi Baru
                                      </button>
                                    ) : (
                                      <div className="text-center space-y-2">
                                        <div className="bg-white p-3 rounded-xl inline-block border border-slate-200">
                                          <QrCode className="w-20 h-20 text-slate-800 animate-pulse" />
                                        </div>
                                        <div className="text-[11px] font-bold text-slate-800 dark:text-white">
                                          KODE: <span className="font-mono text-blue-600 dark:text-blue-400">LECT-2506-WEB</span>
                                        </div>
                                        <div className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                                          <AlertCircle className="w-3.5 h-3.5 animate-spin" />
                                          Kode QR kedaluwarsa dalam {attendanceMinutesLeft} menit
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                      Gunakan tombol simulator di bawah ini untuk menandai kehadiran Anda pada kelas **Kecerdasan Buatan (IF402)** hari ini secara instan:
                                    </p>
                                    <button
                                      onClick={() => {
                                        setMessages((prev) => [
                                          ...prev,
                                          {
                                            id: Math.random().toString(),
                                            sender: 'system',
                                            text: '✅ PRESENSI BERHASIL! Anda terdaftar HADIR pada mata kuliah Kecerdasan Buatan (IF402) - Kelas A, tanggal 25 Juni 2026 pukul 08:15 WIB.',
                                            timestamp: new Date()
                                          }
                                        ]);
                                      }}
                                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      Simulasikan Pindai Kehadiran
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* WIDGET 4: Skripsi Tracker */}
                            {msg.widget === 'skripsi' && (
                              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 block">
                                  PETA TAHAPAN SKRIPSI / TUGAS AKHIR
                                </span>
                                
                                <div className="space-y-3 relative pl-4 border-l border-slate-200 dark:border-slate-800 ml-1.5">
                                  {/* Step 1 */}
                                  <div className="relative">
                                    <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                      Tahap 1: Pengajuan Judul &amp; Proposal
                                    </div>
                                    <div className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                                      <Check className="w-3.5 h-3.5" /> DISAHKAN (SK DEKAN)
                                    </div>
                                  </div>

                                  {/* Step 2 */}
                                  <div className="relative">
                                    <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                                      Tahap 2: Seminar Proposal (Sempro)
                                    </div>
                                    <div className="text-[9px] text-blue-600 font-bold">
                                      SELAI / VERIFIKASI JADWAL UTAMA
                                    </div>
                                  </div>

                                  {/* Step 3 */}
                                  <div className="relative opacity-60">
                                    <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900" />
                                    <div className="text-[11px] font-bold text-slate-600">
                                      Tahap 3: Bimbingan &amp; Pengumpulan Draft
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setMessages((prev) => [
                                      ...prev,
                                      {
                                        id: Math.random().toString(),
                                        sender: 'assistant',
                                        text: `Buku Panduan Tugas Akhir &amp; Template Dokumen Sidang dapat Anda unduh dari repositori digital SIAKAD. Silakan unggah Bab III draft Skripsi Anda di menu utama mahasiswa.`,
                                        timestamp: new Date()
                                      }
                                    ]);
                                  }}
                                  className="w-full py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" /> Unduh Dokumen Panduan
                                </button>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex flex-col space-y-1">
                  <div className="text-[9px] font-boldr text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Asisten SIAKAD AI sedang mengetik...</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions scrollable chips list */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 flex gap-2 overflow-x-auto select-none shrink-0 scrollbar-none">
              {user.role === 'student' ? (
                <>
                  <button 
                    onClick={() => handleQuickPrompt('Rekomendasi KRS semester ganjil')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" /> Rekomendasi KRS
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Bagaimana status tagihan UKT saya?')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3 h-3" /> Bayar UKT
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Presensi kehadiran kuliah')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3 h-3" /> Presensi Kehadiran
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Bagaimana status skripsi saya?')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <ClipboardList className="w-3 h-3" /> Status Skripsi
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleQuickPrompt('Tampilkan jadwal mengajar hari ini')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" /> Jadwal Mengajar
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Buat QR Presensi kuliah')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3 h-3" /> Buat QR Presensi
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Tampilkan bimbingan skripsi')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <User className="w-3 h-3" /> Bimbingan Skripsi
                  </button>
                </>
              )}
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan akademik atau bantuan..."
                className="flex-1 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-md shadow-blue-500/10 transition-colors cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
