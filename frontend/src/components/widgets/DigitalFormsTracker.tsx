import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../utils/i18n';
import { 
  FileText, 
  Send, 
  Clock, 
  Building, 
  Download, 
  Plus, 
  Search, 
  AlertCircle,
  FileCheck2,
  Inbox,
  CheckCircle
} from 'lucide-react';
import { User as UserType } from '../../types';
import { getStudentOverview, getTickets, createTicket, updateTicketStatus, LayananRequest } from '../../api/academic.api';

interface EFormRequest {
  id: string;
  studentName: string;
  studentNim: string;
  type: string;
  reason: string;
  submittedAt: string;
  status: 'Diajukan' | 'Verifikasi Berkas' | 'Selesai / Terbit';
  documentUrl?: string; // URL berkas riil bila tersedia
  trackingLogs: { stage: string; timestamp: string; note: string }[];
}

const mapLayananToEForm = (r: LayananRequest, name: string, nim: string): EFormRequest => ({
  id: r.id,
  studentName: name,
  studentNim: nim,
  type: r.type,
  reason: r.purpose,
  submittedAt: r.date,
  status: r.status === 'Selesai' ? 'Selesai / Terbit' : 'Verifikasi Berkas',
  documentUrl: r.downloadUrl && r.downloadUrl !== '#' ? r.downloadUrl : undefined,
  trackingLogs: [
    { stage: r.status === 'Selesai' ? 'Selesai / Terbit' : 'Verifikasi Berkas', timestamp: r.date, note: r.purpose },
  ],
});

export function DigitalFormsTracker({ role, isAlumni = false, user }: { role: string; isAlumni?: boolean; user?: UserType }) {
  const { t, lang } = useLanguage();
  const [requests, setRequests] = useState<EFormRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Student application form states
  const [formType, setFormType] = useState<string>('Surat Keterangan Aktif Kuliah');

  useEffect(() => {
    if (isAlumni) {
      setFormType('Legalisir Ijazah Resmi');
    } else {
      setFormType('Surat Keterangan Aktif Kuliah');
    }
  }, [isAlumni]);

  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<EFormRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // General toast alerts
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadRequests = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      if (user?.role === 'student') {
        const ov = await getStudentOverview();
        const nim = ov.profile?.nim || user.name || '—';
        setRequests((ov.layananRequests ?? []).map((r) => mapLayananToEForm(r, ov.profile?.name || user.name || 'Mahasiswa', nim)));
      } else {
        // Staf/admin melihat seluruh tiket layanan dari Helpdesk.
        const rows = await getTickets();
        setRequests(rows.map((t) => ({
          id: t.id,
          studentName: t.requesterName || '—',
          studentNim: t.requesterEmail || '—',
          type: t.subject,
          reason: t.message,
          submittedAt: t.createdAt || '',
          status: t.status === 'Selesai' ? 'Selesai / Terbit' : t.status === 'Diproses' ? 'Verifikasi Berkas' : 'Diajukan',
          documentUrl: t.resolution ? undefined : undefined,
          trackingLogs: [{ stage: t.status, timestamp: t.createdAt || '', note: t.message }],
        })));
      }
    } catch {
      setLoadError('Gagal memuat data layanan dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      triggerToast('Alasan pengajuan wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      // Pengajuan layanan digital dicatat sebagai tiket Helpdesk yang tersimpan di basis data.
      const created = await createTicket({ subject: formType, message: reason });
      setRequests((prev) => [{
        id: created.id,
        studentName: user?.name || '—',
        studentNim: user?.email || '—',
        type: created.subject,
        reason: created.message,
        submittedAt: created.createdAt || 'Baru saja',
        status: 'Diajukan',
        trackingLogs: [{ stage: 'Diajukan', timestamp: created.createdAt || 'Baru saja', note: `Layanan digital "${formType}" berhasil dimasukkan ke sistem antrean.` }],
      }, ...prev]);
      setReason('');
      setAttachmentName('');
      triggerToast(`Pengajuan "${formType}" tercatat pada Helpdesk SIAKAD (tiket ${created.id.slice(0, 8)}).`);
    } catch (err: any) {
      triggerToast(err?.message || 'Gagal mengajukan permohonan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, next: 'Diproses' | 'Selesai') => {
    try {
      await updateTicketStatus(id, next);
      const timestamp = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      setRequests((prev) => prev.map((r) => {
        if (r.id !== id) return r;
        const status = next === 'Selesai' ? 'Selesai / Terbit' : 'Verifikasi Berkas';
        return {
          ...r,
          status,
          trackingLogs: [...r.trackingLogs, { stage: status, timestamp, note: next === 'Selesai' ? 'Dokumen resmi diterbitkan.' : 'Staf memverifikasi berkas pendukung.' }],
        };
      }));
      triggerToast(`Status pengajuan diperbarui menjadi "${next}".`);
    } catch (err: any) {
      triggerToast(err?.message || 'Gagal memperbarui status.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden transition-colors duration-200">
      
      {/* Widget Toast notification */}
      {toast && (
        <div className="absolute top-4 right-4 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-xl shadow-xl text-xs font-bold z-50 flex items-center gap-1.5 border border-slate-800">
          <CheckCircle className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Emerald accent top line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

      {/* Header Info */}
      <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/25">
            <FileText className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">
            {t('form.title')}
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          {t('form.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* STUDENT: E-FORM SUBMISSION PANEL */}
        {role === 'student' && (
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
            <h5 className="text-xs font-bold text-slate-800 dark:text-whiter flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" />
              Isi Formulir Layanan Digital
            </h5>

            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-black">{t('form.select_type')}</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-bold outline-none"
                >
                  {isAlumni ? (
                    <>
                      <option value="Legalisir Ijazah Resmi">Legalisir Ijazah Resmi</option>
                      <option value="Surat Keterangan Lulus (SKL) Resmi">Surat Keterangan Lulus (SKL) Resmi</option>
                      <option value="Sertifikat Kompetensi Pendamping Ijazah (SKPI)">Sertifikat Kompetensi (SKPI)</option>
                      <option value="Pembuatan Kartu Anggota Alumni (IKA)">Pembuatan Kartu Anggota Alumni (IKA)</option>
                      <option value="Permohonan Transkrip Resmi">Permohonan Transkrip Resmi Bersegel</option>
                    </>
                  ) : (
                    <>
                      <option value="Surat Keterangan Aktif Kuliah">Surat Keterangan Aktif Kuliah</option>
                      <option value="Permohonan Cuti Akademik">Permohonan Cuti Akademik (Cuti Kuliah)</option>
                      <option value="Permohonan Pindah Kelas">Permohonan Pindah Kelas Kuliah</option>
                      <option value="Permohonan Transkrip Resmi">Permohonan Transkrip Resmi Bersegel</option>
                      <option value="Permohonan Pengunduran Diri">Permohonan Pengunduran Diri</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-black">{t('form.reason')}</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Deskripsikan alasan pengajuan dengan formal..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none text-slate-800 dark:text-slate-200 focus:border-emerald-500 font-semibold resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-black">{t('form.upload_doc')}</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 rounded-xl p-3 text-center cursor-pointer bg-white dark:bg-slate-900 transition-colors relative">
                  <input 
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachmentName(e.target.files[0].name);
                        triggerToast('File pendukung siap dilampirkan pada pengajuan.');
                      }
                    }}
                  />
                  {attachmentName ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold block truncate">
                      ✓ {attachmentName}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block font-bold">
                      Klik / Seret Berkas Pendukung (PDF/JPG)
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Mengirim...' : t('form.submit_btn')}
              </button>
              <p className="text-[9px] text-slate-400 leading-relaxed">
                Pengajuan dicatat sebagai tiket Helpdesk SIAKAD dan ditindaklanjuti oleh unit layanan akademik.
              </p>
            </form>
          </div>
        )}

        {/* STAFF/ADMIN/LECTURER: COMPREHENSIVE QUEUE LIST */}
        <div className={`${role === 'student' ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-extrabold text-slate-800 dark:text-whiter flex items-center gap-1.5">
              <FileCheck2 className="w-4.5 h-4.5 text-emerald-500" />
              {role === 'student' ? t('form.track_title') : 'Antrean Validasi Dokumen Akademik (Staf/Kaprodi)'}
            </h5>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
              {requests.length} Pengajuan Digital
            </span>
          </div>

          {loading && (
            <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin" /> Memuat pengajuan...
            </div>
          )}
          {loadError && (
            <div className="text-center py-8 text-xs text-rose-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> {loadError}
            </div>
          )}

          {!loading && !loadError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* List column */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {requests.map((req) => {
                const colors = {
                  'Diajukan': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400',
                  'Verifikasi Berkas': 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400',
                  'Selesai / Terbit': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400',
                };

                const progressIdx = {
                  'Diajukan': 1,
                  'Verifikasi Berkas': 2,
                  'Selesai / Terbit': 4
                }[req.status] || 1;

                return (
                  <div 
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedRequest?.id === req.id 
                        ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md' 
                        : 'bg-slate-50/50 dark:bg-slate-900/25 border-slate-150 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                        <span>{req.id.slice(0, 8)}</span>
                        <span>{req.submittedAt}</span>
                      </div>

                      <div className="text-xs">
                        <h6 className="font-extrabold text-slate-800 dark:text-white line-clamp-1">{req.type}</h6>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{req.studentName} ({req.studentNim})</p>
                      </div>

                      <div className="flex justify-between items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-black border ${colors[req.status]}`}>
                          {req.status === 'Diajukan' ? t('form.step.submitted') : req.status === 'Verifikasi Berkas' ? t('form.step.verified') : t('form.step.completed')}
                        </span>

                        {/* Progress Bar Micro-indicator */}
                        <div className="flex gap-1 items-center">
                          {[1, 2, 3, 4].map(step => (
                            <div 
                              key={step} 
                              className={`w-2.5 h-1 rounded-full ${
                                step <= progressIdx 
                                  ? 'bg-emerald-500' 
                                  : 'bg-slate-200 dark:bg-slate-800'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {requests.length === 0 && (
                <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-150">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 mt-2">Belum ada pengajuan layanan digital.</p>
                </div>
              )}
            </div>

            {/* Tracker Details / Validation Column */}
            <div className="bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 min-h-[300px]">
              {selectedRequest ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">Form Detail &amp; Progress Logs</span>
                    <h5 className="font-extrabold text-xs text-slate-800 dark:text-white mt-0.5">{selectedRequest.type}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Diajukan: {selectedRequest.studentName} &bull; {selectedRequest.submittedAt}</p>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <span className="text-[9px] text-slate-400 uppercase font-black">Alasan Pengajuan</span>
                    <p className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850 text-[11px] text-slate-600 dark:text-slate-300 font-semibold italic">
                      "{selectedRequest.reason}"
                    </p>
                  </div>

                  {/* Vertical Progress Logs */}
                  <div className="space-y-3.5 pl-3 border-l border-emerald-500/30">
                    {selectedRequest.trackingLogs.map((log, lIdx) => (
                      <div key={lIdx} className="relative text-xs">
                        <div className="absolute -left-[18.5px] top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
                        <div className="font-extrabold text-slate-700 dark:text-slate-200 flex justify-between items-center">
                          <span>{log.stage}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{log.note}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action row */}
                  <div className="border-t border-slate-200/50 dark:border-slate-800 pt-3 flex flex-wrap gap-2 justify-between items-center">
                    {selectedRequest.documentUrl ? (
                      <a 
                        href={selectedRequest.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Unduh Dokumen (PDF)
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                        <span>Dokumen Sedang Diproses</span>
                      </span>
                    )}

                    {/* Staf/Lecturer status workflow controls */}
                    {role !== 'student' && (
                      <div className="flex gap-1.5 w-full sm:w-auto justify-end">
                        {selectedRequest.status === 'Diajukan' && (
                          <button 
                            onClick={() => handleUpdateStatus(selectedRequest.id, 'Diproses')}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9.5px] font-bold cursor-pointer"
                          >
                            Verifikasi Dokumen
                          </button>
                        )}
                        {selectedRequest.status === 'Verifikasi Berkas' && (
                          <button 
                            onClick={() => handleUpdateStatus(selectedRequest.id, 'Selesai')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9.5px] font-bold cursor-pointer"
                          >
                            Tandatangani &amp; Terbitkan
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <AlertCircle className="w-6 h-6 text-slate-300 dark:text-slate-750 mb-1.5" />
                  <p className="text-[11px] text-slate-400 font-semibold">Pilih salah satu item pengajuan di sebelah kiri untuk menelusuri riwayat pelacakan progress.</p>
                </div>
              )}
            </div>

          </div>
          )}
        </div>

      </div>
    </div>
  );
}
