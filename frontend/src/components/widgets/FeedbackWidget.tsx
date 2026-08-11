import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Sparkles, 
  CheckCircle, 
  History, 
  Send, 
  AlertTriangle, 
  X, 
  Plus, 
  Filter, 
  Trash2, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { User } from '../../types';
import { createTicket } from '../../api/academic.api';
import { safeDispatchCustomEvent } from '../../utils/utils';

interface FeedbackWidgetProps {
  user: User;
}

export interface FeedbackItem {
  id: string;
  title: string;
  category: 'bug' | 'feature' | 'ui' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'received' | 'in_review' | 'resolved';
  userEmail: string;
}

export function FeedbackWidget({ user }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  
  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'bug' | 'feature' | 'ui' | 'general'>('bug');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Load persistent feedback history from localStorage (hanya kiriman nyata pengguna)
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem('siakad_feedback_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Failed to parse feedback history:", e);
    }
    return [];
  });

  // Save to localStorage whenever feedback history changes
  useEffect(() => {
    localStorage.setItem('siakad_feedback_history', JSON.stringify(feedbackHistory));
  }, [feedbackHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    // Trigger the Global Progress Bar at the top of the screen via fetch intercept & events
    safeDispatchCustomEvent('global-progress-start');

    // Kirim laporan ke backend helpdesk (tiket) yang nyata
    try {
      const ticket = await createTicket({
        subject: title,
        message: description,
      });

      if (ticket) {
        // Create new feedback entry
        const newFeedback: FeedbackItem = {
          id: ticket.id,
          title,
          category,
          severity,
          description,
          timestamp: new Date().toLocaleString(),
          status: 'received',
          userEmail: user.email
        };

        setFeedbackHistory(prev => [newFeedback, ...prev]);
        setIsSuccess(true);
        
        // Reset form
        setTitle('');
        setCategory('bug');
        setSeverity('medium');
        setDescription('');
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert('Gagal mengirim laporan. Silakan coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
      safeDispatchCustomEvent('global-progress-end');
    }
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbackHistory(prev => prev.filter(item => item.id !== id));
  };

  const filteredHistory = feedbackHistory.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  if (!user) return null;

  return (
    <div id="feedback-widget-root" className="fixed bottom-6 left-6 z-[9999] pointer-events-auto">
      {/* Floating Action Button */}
      <motion.button
        id="feedback-toggle-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsSuccess(false);
        }}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors font-sans text-xs font-boldr border border-slate-800 dark:border-slate-200 cursor-pointer"
      >
        {isOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <MessageSquare className="w-4 h-4 text-blue-500 dark:text-blue-600 animate-pulse" />
        )}
        <span>{isOpen ? 'Tutup' : 'Umpan Balik & Bug'}</span>
      </motion.button>

      {/* Floating Panel Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="feedback-panel"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 left-0 w-[420px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[580px] font-sans"
          >
            {/* Header Section */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white border-b border-slate-200/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-400" />
                  <span>Sistem Umpan Balik SIAKAD</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Kirimkan bug, keluhan, atau ide pengembangan portal.
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('submit');
                  setIsSuccess(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'submit'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Kirim Laporan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Riwayat Anda ({feedbackHistory.length})
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
              <AnimatePresence mode="wait">
                {activeTab === 'submit' ? (
                  isSuccess ? (
                    /* Success Screen */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 px-4 flex flex-col items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-500 dark:text-green-400 mb-4 animate-bounce">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        Laporan Berhasil Dikirim!
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 max-w-xs">
                        Terima kasih atas partisipasi Anda dalam meningkatkan SIAKAD. Laporan Anda telah masuk ke sistem antrean dan akan diverifikasi oleh tim pengembang.
                      </p>
                      
                      <button
                        type="button"
                        onClick={() => setIsSuccess(false)}
                        className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                      >
                        Kirim Laporan Lain
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ) : (
                    /* Submission Form */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Active Prefilled Account Context Banner */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                            {(user.name || 'User').charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {user.name || 'User'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {user.email || ''}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {user.role === 'student' ? 'Mahasiswa' : user.role === 'lecturer' ? 'Dosen' : user.role === 'kaprodi' ? 'Kaprodi' : 'Admin'}
                        </span>
                      </div>

                      {/* Title Field */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Judul Isu / Saran
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Contoh: Gagal mengunduh transkrip nilai KHS"
                          className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Grid Category & Severity */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Kategori
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="bug">🐛 Bug / Error</option>
                            <option value="feature">💡 Saran Fitur</option>
                            <option value="ui">🎨 Tampilan / UI</option>
                            <option value="general">💬 Umum / Lainnya</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                            Tingkat Keparahan
                          </label>
                          <select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value as any)}
                            className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="low">Rendah (Saran)</option>
                            <option value="medium">Sedang (Hambatan Kecil)</option>
                            <option value="high">Tinggi (Macet/Error)</option>
                            <option value="critical">Kritis (Bloking Total)</option>
                          </select>
                        </div>
                      </div>

                      {/* Description Area */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Detail Deskripsi
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Jelaskan secara mendetail langkah-langkah terjadinya bug atau usulan ide Anda."
                          className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !description.trim()}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-4 border border-transparent rounded-xl shadow-md text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Kirim Laporan</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )
                ) : (
                  /* History Log Tab */
                  <motion.div
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Filters bar */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filter Kategori</span>
                      </div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-2 py-1 text-[11px] font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="all">Semua Kategori</option>
                        <option value="bug">🐛 Bug / Error</option>
                        <option value="feature">💡 Saran Fitur</option>
                        <option value="ui">🎨 Tampilan / UI</option>
                        <option value="general">💬 Umum</option>
                      </select>
                    </div>

                    {/* Lists of Feedbacks */}
                    {filteredHistory.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                        <History className="w-8 h-8 mx-auto stroke-1 mb-2.5 opacity-60" />
                        <p className="text-xs font-medium">Belum ada riwayat laporan.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredHistory.map((item) => (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-left space-y-2.5 relative group hover:shadow-md transition-shadow"
                          >
                            {/* Delete Action Icon */}
                            <button
                              onClick={() => handleDeleteFeedback(item.id)}
                              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                              title="Hapus riwayat laporan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Badge and Metadata */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {item.category === 'bug' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 flex items-center gap-0.5">
                                  <Bug className="w-2.5 h-2.5" />
                                  Bug
                                </span>
                              )}
                              {item.category === 'feature' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                                  <Lightbulb className="w-2.5 h-2.5" />
                                  Fitur
                                </span>
                              )}
                              {item.category === 'ui' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 flex items-center gap-0.5">
                                  🎨 UI/UX
                                </span>
                              )}
                              {item.category === 'general' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                                  💬 Umum
                                </span>
                              )}

                              {/* Severity Badge */}
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                item.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400' :
                                item.severity === 'high' ? 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400' :
                                item.severity === 'medium' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {item.severity}
                              </span>

                              {/* Status Badge */}
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5 ml-auto ${
                                item.status === 'resolved' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' :
                                item.status === 'in_review' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {item.status === 'resolved' ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                {item.status === 'resolved' ? 'Selesai' : item.status === 'in_review' ? 'Ditinjau' : 'Diterima'}
                              </span>
                            </div>

                            {/* Title & Description */}
                            <div>
                              <h6 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                {item.title}
                              </h6>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {/* Timestamp */}
                            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 border-t border-slate-100 dark:border-slate-900 pt-2">
                              <Clock className="w-3 h-3" />
                              <span>Dikirim pada: {item.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
