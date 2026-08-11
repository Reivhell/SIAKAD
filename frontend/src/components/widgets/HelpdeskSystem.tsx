import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LifeBuoy, Plus, Send, Clock, CheckCircle2, AlertCircle, Search, X, MessageSquare, Inbox } from 'lucide-react';
import { User as UserType } from '../../types';
import { getTickets, createTicket, updateTicketStatus, TicketItem } from '../../api/academic.api';

interface SupportTicket {
  id: string;
  title: string;
  category: 'Nilai' | 'Jadwal' | 'Keuangan' | 'Lainnya';
  status: 'Terbuka' | 'Diproses' | 'Selesai';
  description: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string | null;
  requesterName?: string;
}

// Kategorisasi tiket dari kata kunci subjek/isi (heuristik jujur, bukan data tiruan).
const categorize = (text: string): SupportTicket['category'] => {
  const t = text.toLowerCase();
  if (t.includes('nilai') || t.includes('khs') || t.includes('ujian') || t.includes('praktikum')) return 'Nilai';
  if (t.includes('jadwal') || t.includes('bentrok') || t.includes('kelas') || t.includes('kuliah')) return 'Jadwal';
  if (t.includes('ukt') || t.includes('bayar') || t.includes('keuangan') || t.includes('beasiswa')) return 'Keuangan';
  return 'Lainnya';
};

export function HelpdeskSystem({ user }: { user?: UserType }) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Ticket Submission Form States
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Nilai' | 'Jadwal' | 'Keuangan' | 'Lainnya'>('Nilai');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const isStaff = user?.role === 'admin' || user?.role === 'baak';

  const loadTickets = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await getTickets();
      setTickets(rows.map((t: TicketItem) => ({
        id: t.id,
        title: t.subject,
        category: categorize(`${t.subject} ${t.message}`),
        status: (t.status as SupportTicket['status']) || 'Terbuka',
        description: t.message,
        createdAt: t.createdAt || '',
        updatedAt: t.createdAt || '',
        resolution: t.resolution,
        requesterName: t.requesterName,
      })));
    } catch {
      setLoadError('Gagal memuat tiket helpdesk dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const created = await createTicket({
        subject: title,
        message: description,
      });
      const newTicket: SupportTicket = {
        id: created.id,
        title: created.subject,
        category,
        status: (created.status as SupportTicket['status']) || 'Terbuka',
        description: created.message,
        createdAt: created.createdAt || 'Baru saja',
        updatedAt: created.createdAt || 'Baru saja',
        resolution: created.resolution,
        requesterName: created.requesterName,
      };
      setTickets((prev) => [newTicket, ...prev]);
      setActiveTicket(newTicket);
      setIsCreating(false);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      alert(err?.message || 'Gagal membuat tiket. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const advanceStatus = async (id: string, next: SupportTicket['status']) => {
    try {
      const updated = await updateTicketStatus(id, next);
      const patched: SupportTicket = {
        id: updated.id,
        title: updated.subject,
        category: categorize(`${updated.subject} ${updated.message}`),
        status: (updated.status as SupportTicket['status']) || next,
        description: updated.message,
        createdAt: updated.createdAt || '',
        updatedAt: updated.createdAt || '',
        resolution: updated.resolution,
        requesterName: updated.requesterName,
      };
      setTickets((prev) => prev.map((t) => (t.id === id ? patched : t)));
      setActiveTicket(patched);
    } catch (err: any) {
      alert(err?.message || 'Gagal memperbarui status tiket.');
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    'Terbuka': 'bg-slate-100 text-slate-800 dark:bg-slate-950/40 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    'Diproses': 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30',
    'Selesai': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-200 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <LifeBuoy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sistem Pengaduan &amp; Pelacakan Tiket (Helpdesk Akademik)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Sampaikan kendala administrasi, nilai, perkuliahan, atau keuangan. Semua tiket tersimpan di basis data SIAKAD.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
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

          {loading && (
            <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin" /> Memuat tiket...
            </div>
          )}
          {loadError && (
            <div className="text-center py-8 text-xs text-rose-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> {loadError}
            </div>
          )}

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {!loading && !loadError && filteredTickets.map((ticket) => {
              const isActive = activeTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => {
                    setActiveTicket(ticket);
                    setIsCreating(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'bg-slate-50 dark:bg-slate-850/60 border-blue-500/40 dark:border-blue-500/35 shadow-xs'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50/40 dark:hover:bg-slate-850/50 border-slate-200/60 dark:border-slate-800/85'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{ticket.id.slice(0, 8)}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border ${statusColors[ticket.status] || statusColors.Terbuka}`}>
                        {ticket.status}
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

            {!loading && !loadError && filteredTickets.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl flex flex-col items-center gap-1.5">
                <Inbox className="w-5 h-5 text-slate-300" />
                {searchQuery ? 'Tidak ada tiket yang cocok dengan pencarian.' : 'Belum ada tiket pengaduan.'}
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
                  <h5 className="text-xs font-black text-slate-800 dark:text-white">
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
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 cursor-pointer transition-colors"
                >
                  {submitting ? 'Mengirim tiket...' : 'Submit Tiket ke Helpdesk Kampus'}
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
                        <span className="font-mono font-black text-slate-400 text-[10px]">{activeTicket.id.slice(0, 8)}</span>
                        <span className="text-slate-350 dark:text-slate-650">&bull;</span>
                        <span className="text-[10px] text-slate-500 font-bold">Kategori: {activeTicket.category}</span>
                        {activeTicket.requesterName && (
                          <>
                            <span className="text-slate-350 dark:text-slate-650">&bull;</span>
                            <span className="text-[10px] text-slate-500 font-bold">{activeTicket.requesterName}</span>
                          </>
                        )}
                      </div>
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        {activeTicket.title}
                      </h5>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border uppercase shrink-0 ${statusColors[activeTicket.status] || statusColors.Terbuka}`}>
                      {activeTicket.status}
                    </span>
                  </div>

                  {/* Description Box */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850/80 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed text-[11.5px]">
                    {activeTicket.description}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Log Aktivitas Helpdesk
                    </span>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      <div className="p-2.5 rounded-lg border text-[11px] bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/50 text-slate-500">
                        <div className="flex justify-between font-bold text-[10px] opacity-80 mb-0.5">
                          <span>Sistem Helpdesk</span>
                          <span>{activeTicket.createdAt}</span>
                        </div>
                        <p className="leading-relaxed font-medium">
                          Tiket "{activeTicket.title}" berhasil dibuat dan dicatat pada sistem Helpdesk SIAKAD.
                        </p>
                      </div>

                      {activeTicket.resolution && (
                        <div className="p-2.5 rounded-lg border text-[11px] bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                          <div className="flex justify-between font-bold text-[10px] opacity-80 mb-0.5">
                            <span>Resolusi Staf</span>
                            <span>{activeTicket.updatedAt}</span>
                          </div>
                          <p className="leading-relaxed font-medium">{activeTicket.resolution}</p>
                        </div>
                      )}
                      {!activeTicket.resolution && activeTicket.status !== 'Selesai' && (
                        <div className="p-2.5 rounded-lg border text-[11px] bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/10 dark:border-amber-500/20 text-amber-800 dark:text-amber-300">
                          <div className="flex justify-between font-bold text-[10px] opacity-80 mb-0.5">
                            <span>Status Saat Ini</span>
                            <span>{activeTicket.updatedAt}</span>
                          </div>
                          <p className="leading-relaxed font-medium">
                            {activeTicket.status === 'Diproses'
                              ? 'Tiket sedang ditangani oleh unit terkait.'
                              : 'Tiket menunggu penanganan dari unit terkait.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Staff workflow */}
                {isStaff && activeTicket.status !== 'Selesai' && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
                    {activeTicket.status === 'Terbuka' && (
                      <button
                        onClick={() => advanceStatus(activeTicket.id, 'Diproses')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Tandai Diproses
                      </button>
                    )}
                    <button
                      onClick={() => advanceStatus(activeTicket.id, 'Selesai')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Selesai
                    </button>
                  </div>
                )}

                {!isStaff && (
                  <div className="pt-3 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Status tiket diperbarui oleh staf helpdesk. Pantau perkembangan melalui widget ini.
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
                    Pilih salah satu tiket di sebelah kiri untuk melihat rincian progres dan log penanganan.
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
