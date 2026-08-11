import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, AlertCircle, BookOpen, Calendar, 
  CheckCircle, ArrowRight, CreditCard, QrCode, ClipboardList,
  User, Check, Clock, Wallet, GraduationCap, Users
} from 'lucide-react';
import { User as UserType } from '../../types';
import { 
  getStudentOverview, 
  StudentOverviewPayload,
  getLecturerOverview,
  getMyFinance,
  payFinanceBill,
  FinanceBill,
  getThesisItems,
  ThesisItem,
  AvailableKrsCourse,
  TodayClassItem
} from '../../api/academic.api';

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  widget?: 'krs' | 'tagihan' | 'presensi' | 'skripsi';
}

interface AcademicChatbotProps {
  user: UserType;
}

const rupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export function AcademicChatbot({ user }: AcademicChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasNotification, setHasNotification] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Data riil dari backend ────────────────────────────────────────
  const [studentData, setStudentData] = useState<StudentOverviewPayload | null>(null);
  const [lecturerJadwal, setLecturerJadwal] = useState<Array<{ code: string; name: string; room: string; time: string; day: string; mahasiswaCount: number }>>([]);
  const [lecturerSkripsi, setLecturerSkripsi] = useState<ThesisItem[]>([]);
  const [thesisItems, setThesisItems] = useState<ThesisItem[]>([]);
  const [bills, setBills] = useState<FinanceBill[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // KRS planner state (kursi riil dari API)
  const [selectedKrsCodes, setSelectedKrsCodes] = useState<string[]>([]);

  // Real payment state
  const [payingBillId, setPayingBillId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      if (user.role === 'student') {
        const [ov, fin, thesis] = await Promise.all([
          getStudentOverview(),
          getMyFinance(),
          getThesisItems(),
        ]);
        setStudentData(ov);
        setBills(fin.bills ?? []);
        setThesisItems(thesis ?? []);
      } else if (user.role === 'lecturer') {
        const [ov, thesis] = await Promise.all([
          getLecturerOverview(),
          getThesisItems(),
        ]);
        setLecturerJadwal(ov.jadwal ?? []);
        setLecturerSkripsi(thesis ?? []);
      }
      setDataLoaded(true);
      setDataError(null);
    } catch (err) {
      setDataError('Data akademik belum dapat dimuat dari server. Coba lagi nanti.');
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const welcomeText = user.role === 'student'
      ? `Halo ${user.name || 'User'}! Saya **Asisten Akademik AI SIAKAD**. Saya dapat membantu melihat rekomendasi mata kuliah KRS, tagihan UKT, IPK & KHS, jadwal kuliah hari ini, presensi, serta status skripsi Anda.`
      : `Selamat datang, ${user.name || 'User'}! Saya **Asisten Akademik AI SIAKAD** untuk Dosen. Saya dapat membantu memantau jadwal mengajar, daftar mahasiswa bimbingan skripsi, dan panduan modul SIAKAD.`;

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

  const sendAssistantReply = (responseProps: Partial<Message>, delay = 800) => {
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

  const pushSystemMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'system',
        text,
        timestamp: new Date(),
      },
    ]);
  };

  // Real payment handler
  const handlePayBill = async (bill: FinanceBill) => {
    if (!bill || !bill.id) return;
    setPayingBillId(bill.id);
    try {
      const updated = await payFinanceBill(bill.id, bill.amount - (bill.paidAmount || 0));
      pushSystemMessage(
        `Pembayaran **${updated.description || bill.description || 'Tagihan UKT'}** sebesar ${rupiah(bill.amount)} berhasil dicatat. Status tagihan: ${updated.status || 'LUNAS'}.`
      );
      // Muat ulang data keuangan agar status terkini
      try {
        const fin = await getMyFinance();
        setBills(fin.bills ?? []);
      } catch { /* abaikan, pesan sukses sudah tampil */ }
    } catch (err: any) {
      pushSystemMessage(`Gagal memproses pembayaran: ${err?.message || 'terjadi kesalahan.'}`);
    } finally {
      setPayingBillId(null);
    }
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
    const today = new Date();
    const todayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][today.getDay()];

    if (user.role === 'student') {
      // ── KRS ──────────────────────────────────────────────────
      if (query.includes('krs') || query.includes('rekomendasi') || query.includes('mata kuliah') || query.includes('sks')) {
        const courses = studentData?.availableKrsCourses ?? [];
        setSelectedKrsCodes([]);
        if (courses.length === 0) {
          sendAssistantReply({
            text: `Belum ada data mata kuliah yang tersedia untuk pengisian KRS pada periode berjalan. Jika IPK Anda memenuhi syarat, data KRS akan tampil di modul KRS.`
          });
        } else {
          const wajib = courses.filter((c) => c.type === 'Wajib');
          const pilihan = courses.filter((c) => c.type === 'Pilihan');
          sendAssistantReply({
            text: `Berikut **${courses.length} mata kuliah** yang tersedia untuk KRS periode berjalan (${wajib.length} wajib, ${pilihan.length} pilihan). Silakan pilih mata kuliah untuk menghitung total SKS.`,
            widget: 'krs'
          });
        }
      }
      // ── UKT / Keuangan ───────────────────────────────────────
      else if (query.includes('ukt') || query.includes('bayar') || query.includes('biaya') || query.includes('keuangan') || query.includes('tagihan')) {
        const unpaid = bills.filter((b) => (b.status || '').toLowerCase() !== 'lunas' && (b.amount || 0) > (b.paidAmount || 0));
        const unpaidTotal = (studentData?.unpaidBill ?? 0) || unpaid.reduce((acc, b) => acc + (b.amount - (b.paidAmount || 0)), 0);
        if (unpaid.length === 0 || unpaidTotal <= 0) {
          sendAssistantReply({
            text: `Tidak ada tagihan aktif pada akun Anda saat ini. Seluruh tagihan telah **LUNAS**. Anda dapat melanjutkan aktivitas akademik tanpa hambatan administratif.`
          });
        } else {
          sendAssistantReply({
            text: `Terdapat tagihan aktif sebesar **${rupiah(unpaidTotal)}** pada periode ${unpaid[0].period || 'berjalan'}. Pilih tagihan di bawah untuk melakukan pembayaran langsung melalui SIAKAD.`,
            widget: 'tagihan'
          });
        }
      }
      // ── Presensi ─────────────────────────────────────────────
      else if (query.includes('presensi') || query.includes('absen') || query.includes('hadir') || query.includes('qr')) {
        const classes = studentData?.todayClasses ?? [];
        if (classes.length === 0) {
          sendAssistantReply({
            text: `Anda tidak memiliki jadwal kuliah hari ini (${todayName}). Presensi dilakukan melalui menu **Presensi** pada dashboard saat perkuliahan berlangsung.`
          });
        } else {
          sendAssistantReply({
            text: `Berikut kelas Anda hari ini (${todayName}). Presensi kehadiran dilakukan melalui menu **Presensi** di dashboard SIAKAD pada jam perkuliahan masing-masing.`,
            widget: 'presensi'
          });
        }
      }
      // ── Skripsi / Tugas Akhir ────────────────────────────────
      else if (query.includes('skripsi') || query.includes('tugas akhir') || query.includes('sidang') || query.includes('thesis')) {
        if (thesisItems.length === 0) {
          sendAssistantReply({
            text: `Belum ada data **Tugas Akhir / Skripsi** yang terdaftar pada akun Anda. Status akan tampil setelah pengajuan judul disetujui prodi.`
          });
        } else {
          sendAssistantReply({
            text: `Berikut status **${thesisItems.length} berkas Tugas Akhir / Skripsi** Anda yang tersimpan di SIAKAD.`,
            widget: 'skripsi'
          });
        }
      }
      // ── Nilai / IPK / KHS ────────────────────────────────────
      else if (query.includes('nilai') || query.includes('ipk') || query.includes('khs')) {
        const gpas = studentData?.semesterGPAs ?? [];
        if (gpas.length === 0) {
          sendAssistantReply({
            text: `Belum ada data IPK yang tersedia. Nilai semester akan tampil setelah Kaprodi mengesahkan KHS.`
          });
        } else {
          const latest = gpas[gpas.length - 1];
          const trend = gpas.length >= 2
            ? (latest.IPK >= gpas[gpas.length - 2].IPK ? 'mengalami kenaikan' : 'mengalami penurunan dibanding semester sebelumnya')
            : '';
          sendAssistantReply({
            text: `IPK kumulatif Anda saat ini adalah **${latest.IPK.toFixed(2)}** (semester ${latest.name}). Riwayat IPS/IPK Anda ${trend}.\n\n${gpas.map((g) => `${g.name}: IPS ${g.IPS.toFixed(2)} / IPK ${g.IPK.toFixed(2)}`).join('\n')}\n\nKartu Hasil Studi (KHS) dapat diunduh pada menu **Nilai & Transkrip** di dashboard.`
          });
        }
      }
      // ── Jadwal ───────────────────────────────────────────────
      else if (query.includes('jadwal') || query.includes('kuliah') || query.includes('hari ini')) {
        const classes = studentData?.todayClasses ?? [];
        if (classes.length === 0) {
          sendAssistantReply({
            text: `Tidak ada jadwal perkuliahan hari ini (${todayName}). Jadwal lengkap tersedia pada menu **Jadwal Kuliah** di dashboard.`
          });
        } else {
          const lines = classes.map((c) => `• **${c.name}** (${c.code})\n  📍 ${c.room} • ⏰ ${c.time} • 👨‍🏫 ${c.lecturer}`);
          sendAssistantReply({
            text: `📅 **Jadwal Kuliah Hari Ini (${todayName}):**\n\n${lines.join('\n\n')}\n\n*Pastikan datang 10 menit sebelum perkuliahan dimulai.*`
          });
        }
      }
      // ── Alur / menu lain ─────────────────────────────────────
      else if (query.includes('transkrip') || query.includes('nilai semester')) {
        sendAssistantReply({
          text: `Transkrip dan sertifikat digital tersedia pada menu **Nilai & Transkrip** di dashboard mahasiswa.`
        });
      }
      else {
        sendAssistantReply({
          text: `Maaf, saya belum memahami pertanyaan Anda sepenuhnya. Coba tanyakan tentang **Rekomendasi KRS**, **Tagihan UKT**, **IPK/KHS**, **Jadwal Kuliah**, **Presensi**, atau **Status Skripsi**.`
        });
      }
    }
    // ── Dosen ─────────────────────────────────────────────────
    else if (user.role === 'lecturer') {
      if (query.includes('jadwal') || query.includes('mengajar') || query.includes('hari ini')) {
        const todays = lecturerJadwal.filter((j) => j.day.toLowerCase().includes(todayName.toLowerCase()));
        if (todays.length === 0) {
          sendAssistantReply({
            text: `Tidak ada jadwal mengajar hari ini (${todayName}). Jadwal lengkap tersedia pada menu **Jadwal Mengajar** di dashboard dosen.`
          });
        } else {
          const lines = todays.map((j) => `• **${j.name}** (${j.code})\n  📍 ${j.room} • ⏰ ${j.time} • 👥 ${j.mahasiswaCount} mahasiswa`);
          sendAssistantReply({
            text: `👨‍🏫 **Jadwal Mengajar Hari Ini (${todayName}):**\n\n${lines.join('\n\n')}`
          });
        }
      }
      else if (query.includes('presensi') || query.includes('absen') || query.includes('hadir') || query.includes('qr')) {
        sendAssistantReply({
          text: `Sesi presensi kuliah dikelola melalui menu **Presensi** di dashboard dosen. Di sana Anda dapat membuka sesi, menampilkan kode QR dinamis di kelas, dan menutup sesi setelah perkuliahan selesai.`
        });
      }
      else if (query.includes('bimbingan') || query.includes('skripsi') || query.includes('mahasiswa')) {
        if (lecturerSkripsi.length === 0) {
          sendAssistantReply({
            text: `Belum ada mahasiswa bimbingan skripsi yang terdaftar pada akun Anda.`
          });
        } else {
          sendAssistantReply({
            text: `Anda saat ini membimbing **${lecturerSkripsi.length} mahasiswa** Tugas Akhir. Detail progres masing-masing mahasiswa dapat dilihat pada widget di bawah.`,
            widget: 'skripsi'
          });
        }
      }
      else if (query.includes('riset') || query.includes('hibah') || query.includes('penelitian')) {
        sendAssistantReply({
          text: `Informasi hibah riset internal diumumkan melalui LPPM. Pantau menu **Penelitian** pada dashboard dosen untuk pengumuman periode berjalan.`
        });
      }
      else {
        sendAssistantReply({
          text: `Maaf Bapak/Ibu Dosen ${user.name || 'User'}, saya belum memahami pertanyaan ini. Coba tanyakan mengenai **Jadwal Mengajar**, **Presensi Kuliah**, atau **Bimbingan Skripsi Mahasiswa**.`
        });
      }
    }
    // ── Peran lain ─────────────────────────────────────────────
    else {
      sendAssistantReply({
        text: `Halo! Saat ini saya fokus membantu mahasiswa dan dosen. Untuk peran ${user.role}, silakan gunakan menu-modul yang tersedia pada dashboard Anda.`
      });
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  if (!user) return null;

  const krsCourses: AvailableKrsCourse[] = studentData?.availableKrsCourses ?? [];
  const todayClasses: TodayClassItem[] = studentData?.todayClasses ?? [];
  const unpaidBills = bills.filter(
    (b) => (b.status || '').toLowerCase() !== 'lunas' && (b.amount || 0) > (b.paidAmount || 0)
  );

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
                    <div className={`flex items-center gap-1.5 text-[9px] font-bold text-slate-400 px-1 ${
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
                            
                            {/* WIDGET 1: KRS Planner (real courses) */}
                            {msg.widget === 'krs' && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-400 block">
                                  Simulasi Pemilihan Mata Kuliah (SKS)
                                </span>
                                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                  {krsCourses.map((course) => {
                                    const checked = selectedKrsCodes.includes(course.code);
                                    return (
                                      <button
                                        key={course.code}
                                        onClick={() => {
                                          setSelectedKrsCodes((prev) =>
                                            checked
                                              ? prev.filter((c) => c !== course.code)
                                              : [...prev, course.code]
                                          );
                                        }}
                                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                          checked
                                            ? 'border-blue-500 bg-blue-50/55 dark:bg-blue-950/25 text-blue-700 dark:text-blue-300'
                                            : 'border-slate-200/60 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/40 hover:bg-slate-100'
                                        }`}
                                      >
                                        <div>
                                          <div className="text-[11px] font-bold">{course.name}</div>
                                          <div className="text-[9px] text-slate-400 font-mono">
                                            {course.code} &bull; {course.sks} SKS &bull; {course.type}
                                          </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                          checked 
                                            ? 'border-blue-500 bg-blue-500 text-white' 
                                            : 'border-slate-300'
                                        }`}>
                                          {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* SKS counter banner */}
                                <div className="p-2 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/30 rounded-xl flex justify-between items-center text-[10px] font-extrabold text-blue-700 dark:text-blue-400">
                                  <span>TOTAL SKS TERPILIH:</span>
                                  <span>
                                    {krsCourses
                                      .filter((c) => selectedKrsCodes.includes(c.code))
                                      .reduce((acc, c) => acc + c.sks, 0)} SKS
                                  </span>
                                </div>

                                <button
                                  onClick={() => {
                                    const selectedCount = selectedKrsCodes.length;
                                    if (selectedCount === 0) {
                                      pushSystemMessage('Silakan pilih minimal 1 mata kuliah terlebih dahulu untuk menghitung beban SKS.');
                                      return;
                                    }
                                    const totalSks = krsCourses
                                      .filter((c) => selectedKrsCodes.includes(c.code))
                                      .reduce((acc, c) => acc + c.sks, 0);
                                    pushSystemMessage(
                                      `Pilihan simulasi: ${selectedCount} mata kuliah dengan total ${totalSks} SKS. Pengajuan KRS resmi dilakukan melalui menu **KRS** pada dashboard mahasiswa.`
                                    );
                                  }}
                                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  Lihat di Modul KRS <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* WIDGET 2: Real UKT bills */}
                            {msg.widget === 'tagihan' && (
                              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 block">
                                  TAGIHAN AKTIF (SIAKAD FINANCE)
                                </span>

                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                  {unpaidBills.map((bill) => (
                                    <div key={bill.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                                      <div className="flex justify-between items-start gap-2">
                                        <div>
                                          <div className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                                            {bill.description || 'Tagihan UKT'}
                                          </div>
                                          <div className="text-[9px] text-slate-400 font-mono">{bill.period}</div>
                                        </div>
                                        <span className="text-[10px] font-mono font-black text-rose-600">
                                          {rupiah(bill.amount - (bill.paidAmount || 0))}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => handlePayBill(bill)}
                                        disabled={payingBillId === bill.id}
                                        className="w-full py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                                      >
                                        {payingBillId === bill.id ? (
                                          <><Clock className="w-3.5 h-3.5 animate-spin" /> Memproses...</>
                                        ) : (
                                          <><CreditCard className="w-3.5 h-3.5" /> Bayar Sekarang</>
                                        )}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* WIDGET 3: Real schedule / attendance pointer */}
                            {msg.widget === 'presensi' && (
                              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 block">
                                  {user.role === 'lecturer' ? 'JADWAL MENGAJAR HARI INI' : 'KELAS HARI INI'}
                                </span>

                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                  {(user.role === 'lecturer'
                                    ? lecturerJadwal.filter((j) => j.day.toLowerCase().includes(['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()].toLowerCase()))
                                    : todayClasses
                                  ).map((cls: any) => (
                                    <div key={cls.id || cls.code} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                                      <div className="flex justify-between items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{cls.name}</span>
                                        <span className="text-[9px] font-mono font-black text-blue-600">{cls.code}</span>
                                      </div>
                                      <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {cls.day} &bull; {cls.time} &bull; {cls.room}
                                        {user.role === 'lecturer' && cls.mahasiswaCount != null && (
                                          <span className="ml-auto flex items-center gap-1"><Users className="w-3 h-3" /> {cls.mahasiswaCount} mhs</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <p className="text-[9px] text-slate-500 leading-relaxed">
                                  {user.role === 'lecturer'
                                    ? 'Buka menu Presensi di dashboard dosen untuk membuat sesi presensi dan menampilkan kode QR dinamis di kelas.'
                                    : 'Presensi kehadiran dilakukan melalui menu Presensi di dashboard mahasiswa pada jam perkuliahan masing-masing.'}
                                </p>
                              </div>
                            )}

                            {/* WIDGET 4: Skripsi tracker (real data) */}
                            {msg.widget === 'skripsi' && (
                              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 block">
                                  {user.role === 'lecturer' ? 'MAHASISWA BIMBINGAN TUGAS AKHIR' : 'STATUS TUGAS AKHIR / SKRIPSI'}
                                </span>

                                <div className="space-y-2.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                                  {(user.role === 'lecturer' ? lecturerSkripsi : thesisItems).map((item) => (
                                    <div key={item.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                                      <div className="flex justify-between items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                                          {user.role === 'lecturer' ? item.name : (item.title || `Skripsi (${item.nim})`)}
                                        </span>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                                          item.status?.toLowerCase().includes('selesai') || item.status?.toLowerCase().includes('lulus')
                                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                                        }`}>
                                          {item.status || `${item.progressPercentage || 0}%`}
                                        </span>
                                      </div>
                                      {user.role === 'lecturer' && (
                                        <div className="text-[9px] text-slate-400 font-mono">{item.nim}</div>
                                      )}
                                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-blue-500 rounded-full"
                                          style={{ width: `${item.progressPercentage || 0}%` }}
                                        />
                                      </div>
                                      <div className="text-[9px] text-slate-400 font-bold">
                                        Progres: {item.progressPercentage || 0}%
                                        {item.seminar && ` • Seminar ${item.seminar.type}: ${item.seminar.date || ''}`}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <p className="text-[9px] text-slate-500 leading-relaxed">
                                  Detail berkas dan log bimbingan tersedia pada menu Tugas Akhir di dashboard.
                                </p>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Data load warning */}
              {!dataLoaded && !dataError && (
                <div className="flex justify-center">
                  <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 rounded-xl text-[9px] font-bold flex items-center gap-1.5">
                    <Clock className="w-3 h-3 animate-spin" /> Menghubungkan ke server data akademik...
                  </div>
                </div>
              )}
              {dataError && (
                <div className="flex justify-center">
                  <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-xl text-[9px] font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3" /> {dataError}
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex flex-col space-y-1">
                  <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
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
                    onClick={() => handleQuickPrompt('Rekomendasi KRS semester ini')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" /> Rekomendasi KRS
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Bagaimana status tagihan UKT saya?')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Wallet className="w-3 h-3" /> Tagihan UKT
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Tampilkan jadwal kuliah hari ini')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" /> Jadwal Hari Ini
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Bagaimana status skripsi saya?')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <GraduationCap className="w-3 h-3" /> Status Skripsi
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Berapa IPK saya sekarang?')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <ClipboardList className="w-3 h-3" /> IPK Saya
                  </button>
                </>
              ) : user.role === 'lecturer' ? (
                <>
                  <button 
                    onClick={() => handleQuickPrompt('Tampilkan jadwal mengajar hari ini')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" /> Jadwal Mengajar
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Cara membuat QR presensi kuliah')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3 h-3" /> QR Presensi
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt('Tampilkan bimbingan skripsi')}
                    className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <User className="w-3 h-3" /> Bimbingan Skripsi
                  </button>
                </>
              ) : (
                <button 
                  className="shrink-0 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 rounded-xl shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Asisten untuk peran {user.role}
                </button>
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
