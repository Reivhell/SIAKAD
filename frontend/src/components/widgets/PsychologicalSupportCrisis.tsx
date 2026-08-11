import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, HeartHandshake, EyeOff, Send, HelpCircle, Phone, Info, CheckCircle2, Heart, User } from 'lucide-react';

interface CounselingMessage {
  sender: 'user' | 'counselor';
  text: string;
  time: string;
}

export function PsychologicalSupportCrisis() {
  // Form state
  const [category, setCategory] = useState<'Perundungan' | 'Kekerasan Seksual' | 'Kesehatan Mental'>('Kesehatan Mental');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Counseling chatbot interface state
  const [chatMessages, setChatMessages] = useState<CounselingMessage[]>([
    { sender: 'counselor', text: 'Halo Syafiq, saya konselor piket Unit Layanan Terpadu (ULT). Ruangan ini dienkripsi ujung-ke-ujung (E2EE) dan 100% rahasia. Bagaimana perasaanmu hari ini?', time: '09:00' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
    }, 4000);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg: CounselingMessage = {
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, userMsg]);
    setChatInput('');

    // Simulate comforting counselor response
    setTimeout(() => {
      const resp: CounselingMessage = {
        sender: 'counselor',
        text: 'Terima kasih telah berbagi ceritamu. Keberanianmu sangat luar biasa. Ingat, kamu tidak sendirian di sini. Kami memiliki unit pendampingan hukum dan konsultasi psikologis gratis yang siap menemanimu kapan saja.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, resp]);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-200 font-sans relative overflow-hidden">
      {/* Decorative Warm Red/Rose crisis border accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-400 via-rose-500 to-amber-500" />

      {/* Widget Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Unit Layanan Terpadu (ULT) & Dukungan Psikologis
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Layanan pengaduan kasus perundungan (bullying), kekerasan seksual, serta bimbingan kesehatan mental mahasiswa secara aman & terlindungi.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 px-2 py-1 rounded-lg text-[9px] font-bold">
          <EyeOff className="w-3.5 h-3.5" /> E2EE Aman
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Report form Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/40 dark:border-rose-900/20 p-3.5 rounded-xl text-xs text-rose-800 dark:text-rose-300 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-500" /> Kami Siap Mendengarmu
            </div>
            <p className="leading-relaxed text-[11px] opacity-90">
              Sistem menjamin kerahasiaan identitas pelapor. Semua pengaduan disalurkan ke komite etik universitas dan psikolog klinis berlisensi secara independen.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-xl text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-black text-slate-800 dark:text-whiter">
                    Laporan Berhasil Dikirimkan
                  </h5>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
                    Terima kasih atas keberanian Anda. Laporan telah diamankan dan didaftarkan ke antrean penanganan ULT. Petugas akan menghubungi Anda melalui metode yang Anda tentukan.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Pilih Kategori Isu</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="Perundungan">Perundungan / Bullying</option>
                      <option value="Kekerasan Seksual">Kekerasan Seksual / Pelecehan</option>
                      <option value="Kesehatan Mental">Kesehatan Mental & Depresi</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Status Pengiriman</label>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`w-full border px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAnonymous
                          ? 'bg-rose-500/5 border-rose-500/30 text-rose-600 dark:text-rose-450'
                          : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      {isAnonymous ? 'Anonim (Rahasia)' : 'Kirim Nama Profil'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Deskripsi / Kronologi Kejadian</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ceritakan kejadian secara ringkas, tanggal insiden, pelaku, atau kendala mental yang sedang Anda rasakan saat ini..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200 leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-rose-500/10 cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Pengaduan Aman
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>

        {/* Live counselor chat & emergency hotlines column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full justify-between bg-slate-50 dark:bg-slate-950 min-h-[220px]">
            {/* Chat header */}
            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b border-slate-200/50 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-white">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Chat Konselor ULT
              </span>
              <span className="text-[10px] text-slate-450">Respon ~5 menit</span>
            </div>

            {/* Chat message logs */}
            <div className="p-3 space-y-2.5 max-h-[140px] overflow-y-auto flex-1">
              {chatMessages.map((msg, index) => {
                const isCounselor = msg.sender === 'counselor';
                return (
                  <div
                    key={index}
                    className={`p-2.5 rounded-xl text-[11px] max-w-[85%] leading-relaxed ${
                      isCounselor
                        ? 'bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-350 self-start'
                        : 'bg-rose-500 text-white self-end ml-auto'
                    }`}
                  >
                    <p className="font-medium">{msg.text}</p>
                    <span className="text-[8px] opacity-70 block text-right mt-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat input form */}
            <div className="p-2 border-t border-slate-250/30 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex gap-1.5">
              <input
                type="text"
                placeholder="Tulis keluhan atau ajak bicara..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200"
              />
              <button
                onClick={handleSendChatMessage}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Kirim
              </button>
            </div>
          </div>

          {/* Emergency Crisis Contact line */}
          <div className="p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-extrabold text-rose-700 dark:text-rose-400">Butuh Bantuan Segera?</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-450">Saluran Telepon Krisis & Ambulans Kampus 24 Jam</p>
            </div>
            <a
              href="tel:1500900"
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer text-[10.5px] transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5" /> Call ULT: 1500-900
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
