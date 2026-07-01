import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LifeBuoy, Plus, Send, Clock, CheckCircle2, AlertCircle, Eye, Search, ChevronRight, X, ArrowUpRight, MessageSquare } from 'lucide-react';

interface TicketComment {
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  title: string;
  category: 'Nilai' | 'Jadwal' | 'Keuangan' | 'Lainnya';
  priority: 'Rendah' | 'Sedang' | 'Darurat';
  status: 'Diajukan' | 'Verifikasi Kaprodi' | 'Proses Rektorat' | 'Selesai';
  description: string;
  createdAt: string;
  updatedAt: string;
  comments: TicketComment[];
}

const initialTickets: SupportTicket[] = [
  {
    id: 'TK-1092',
    title: 'Nilai Praktikum Basis Data Tidak Muncul di KHS',
    category: 'Nilai',
    priority: 'Darurat',
    status: 'Verifikasi Kaprodi',
    description: 'Saya sudah mengumpulkan semua tugas praktikum basis data dan mengikuti responsi lengkap, namun di portal KHS Semester 4 nilai saya masih tertera T (Tertunda). Mohon bantuannya.',
    createdAt: '24 Juni 2026, 09:15',
    updatedAt: '25 Juni 2026, 14:20',
    comments: [
      { author: 'Sistem Helpdesk', role: 'System', text: 'Tiket berhasil dibuat dan dialokasikan ke Program Studi S1 Teknik Informatika.', timestamp: '24 Juni 2026, 09:15' },
      { author: 'Dr. Eng. Ayu Purwari (Kaprodi)', role: 'Staff', text: 'Halo Syafiq, berkas asisten praktikum sedang kami verifikasi silang dengan nilai pusat. Kami kabari maksimal besok sore ya.', timestamp: '25 Juni 2026, 14:20' }
    ]
  },
  {
    id: 'TK-1044',
    title: 'Bentrok Jadwal Kelas Pilihan Kecerdasan Buatan & Pemrograman Web',
    category: 'Jadwal',
    priority: 'Sedang',
    status: 'Selesai',
    description: 'Kelas A Pilihan Kecerdasan Buatan berbenturan langsung dengan kelas wajib Pemrograman Web di hari Kamis jam 08:00.',
    createdAt: '18 Juni 2026, 11:30',
    updatedAt: '20 Juni 2026, 10:00',
    comments: [
      { author: 'Sistem Helpdesk', role: 'System', text: 'Tiket diteruskan ke Bagian Akademik Fakultas.', timestamp: '18 Juni 2026, 11:30' },
      { author: 'Budi Santoso (Admin Akademik)', role: 'Staff', text: 'Halo Ahmad Syafiq, jadwal Kelas Pilihan Kecerdasan Buatan telah digeser ke hari Kamis jam 13:00 WIB agar tidak berbenturan. Terima kasih masukannya.', timestamp: '20 Juni 2026, 10:00' },
      { author: 'Ahmad Syafiq (Anda)', role: 'Student', text: 'Terima kasih banyak pak atas solusi instannya!', timestamp: '20 Juni 2026, 10:45' }
    ]
  }
];

export function HelpdeskSystem() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  
  // Ticket Submission Form States
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Nilai' | 'Jadwal' | 'Keuangan' | 'Lainnya'>('Nilai');
  const [priority, setPriority] = useState<'Rendah' | 'Sedang' | 'Darurat'>('Sedang');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Comment Form States
  const [commentText, setCommentText] = useState('');

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket: SupportTicket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      category,
      priority,
      status: 'Diajukan',
      description,
      createdAt: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      comments: [
        { author: 'Sistem Helpdesk', role: 'System', text: 'Tiket berhasil dibuat secara anonim dan aman di helpdesk utama.', timestamp: 'Baru saja' }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setActiveTicket(newTicket);
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !activeTicket) return;

    const updatedComments = [
      ...activeTicket.comments,
      {
        author: 'Ahmad Syafiq (Anda)',
        role: 'Student',
        text: commentText,
        timestamp: 'Baru saja'
      }
    ];

    const updatedTicket: SupportTicket = {
      ...activeTicket,
      comments: updatedComments,
      updatedAt: 'Baru saja'
    };

    setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
    setActiveTicket(updatedTicket);
    setCommentText('');

    // Simulate an automatic response from staff after 2 seconds for interactive real-time goodness!
    setTimeout(() => {
      const responseComment: TicketComment = {
        author: 'Sistem AI Helpdesk (Auto-Responder)',
        role: 'System',
        text: 'Notifikasi otomatis terkirim ke unit terkait. Tiket Anda sedang dalam tinjauan intensif tim admin fakultas.',
        timestamp: 'Baru saja'
      };

      const finalTicket: SupportTicket = {
        ...updatedTicket,
        status: updatedTicket.status === 'Diajukan' ? 'Verifikasi Kaprodi' : updatedTicket.status,
        comments: [...updatedComments, responseComment],
        updatedAt: 'Baru saja'
      };

      setTickets(prevTickets => prevTickets.map(t => t.id === activeTicket.id ? finalTicket : t));
      setActiveTicket(finalTicket);
    }, 2000);
  };

  const statusColors = {
    'Diajukan': 'bg-slate-100 text-slate-800 dark:bg-slate-950/40 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    'Verifikasi Kaprodi': 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30',
    'Proses Rektorat': 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border-amber-200/50 dark:border-amber-900/30',
    'Selesai': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30',
  };

  const priorityColors = {
    'Rendah': 'bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-300',
    'Sedang': 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    'Darurat': 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-bold',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <LifeBuoy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sistem Pengaduan & Pelacakan Tiket (Helpdesk Akademik)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Sampaikan kendala administrasi, nilai, perkuliahan, atau keuangan secara real-time.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:scale-[1.01] transition-all flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-3.5 h-3.5" /> Buat Tiket Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Ticket List Section */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Search tickets */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tiket berdasar subjek atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 pl-9 pr-3 py-2 rounded-xl text-xs font-medium outline-none text-slate-800 dark:text-slate-200 placeholder-slate-450 focus:border-blue-500/50"
            />
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {filteredTickets.map((ticket) => {
              const isActive = activeTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => {
                    setActiveTicket(ticket);
                    setIsCreating(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-slate-50 dark:bg-slate-850/60 border-blue-500/40 dark:border-blue-500/35 shadow-xs'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50/40 dark:hover:bg-slate-850/50 border-slate-200/60 dark:border-slate-800/85'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{ticket.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-slate-850 dark:text-white leading-snug line-clamp-1 mb-1">
                    {ticket.title}
                  </h5>
                  <div className="flex justify-between items-center text-[10px] text-slate-450 font-medium">
                    <span>Kat: {ticket.category}</span>
                    <span>Update: {ticket.updatedAt}</span>
                  </div>
                </div>
              );
            })}

            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl">
                Tidak ada tiket pengaduan ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Support Interface Output Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.form
                key="create-ticket"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleSubmitTicket}
                className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-xl border border-slate-100 dark:border-slate-850 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                    Pengajuan Tiket Masalah Baru
                  </h5>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Subjek Kendala / Masalah</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bentrok Jam Kuliah Kewarganegaraan Kelas B"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs outline-none font-semibold text-slate-700 dark:text-slate-350"
                    >
                      <option value="Nilai">Nilai Akademik</option>
                      <option value="Jadwal">Jadwal Kuliah</option>
                      <option value="Keuangan">Masalah Keuangan/UKT</option>
                      <option value="Lainnya">Lain-lain</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Tingkat Urgensi</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs outline-none font-semibold text-slate-700 dark:text-slate-350"
                    >
                      <option value="Rendah">Rendah</option>
                      <option value="Sedang">Sedang / Menengah</option>
                      <option value="Darurat">Darurat / Penting</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Deskripsi Detail Masalah</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Sebutkan mata kuliah, kode kelas, serta rincian kendala Anda secara jelas agar admin dapat memproses solusi secepat mungkin."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200 leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 cursor-pointer transition-all"
                >
                  Submit Tiket ke Helpdesk Kampus
                </button>
              </motion.form>
            ) : activeTicket ? (
              <motion.div
                key={activeTicket.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between h-full space-y-4"
              >
                <div className="space-y-3 text-xs">
                  {/* Active Header */}
                  <div className="flex justify-between items-start gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-800/40">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-slate-400 text-[10px]">{activeTicket.id}</span>
                        <span className="text-slate-350 dark:text-slate-650">&bull;</span>
                        <span className="text-[10px] text-slate-500 font-bold">Kategori: {activeTicket.category}</span>
                      </div>
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        {activeTicket.title}
                      </h5>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border uppercase shrink-0 ${statusColors[activeTicket.status]}`}>
                      {activeTicket.status}
                    </span>
                  </div>

                  {/* Description Box */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850/80 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed text-[11.5px]">
                    {activeTicket.description}
                  </div>

                  {/* Real-time Follow-up Timeline */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Log Aktivitas & Tanggapan Helpdesk
                    </span>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {activeTicket.comments.map((comment, index) => {
                        const isStudent = comment.role === 'Student';
                        const isSystem = comment.role === 'System';
                        return (
                          <div 
                            key={index} 
                            className={`p-2.5 rounded-lg border text-[11px] ${
                              isSystem 
                                ? 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/50 text-slate-500' 
                                : isStudent 
                                  ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/10 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 ml-4' 
                                  : 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 mr-4'
                            }`}
                          >
                            <div className="flex justify-between font-bold text-[10px] opacity-80 mb-0.5">
                              <span>{comment.author}</span>
                              <span>{comment.timestamp}</span>
                            </div>
                            <p className="leading-relaxed font-medium">{comment.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Response / Message form */}
                {activeTicket.status !== 'Selesai' && (
                  <div className="flex gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
                    <input
                      type="text"
                      placeholder="Balas pesan atau beri info tambahan..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3.5 py-2 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200"
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/15 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs flex flex-col items-center justify-center h-full gap-2.5 min-h-[220px]">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center text-slate-400">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Pilih Tiket Pelacakan</div>
                  <p className="text-slate-450 max-w-[240px] leading-relaxed mx-auto">
                    Pilih salah satu tiket di sebelah kiri untuk melihat rincian progres, timeline solusi rektorat, dan log obrolan penanganan.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
