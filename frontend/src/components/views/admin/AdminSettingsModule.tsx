import React, { useState } from 'react';
import {
  AdminAnnouncement,
  AdminBillingInvoice
} from '../../../api/academic.api';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  Database,
  Download,
  Upload,
  CreditCard,
  DollarSign,
  DollarSign as RpIcon,
  Check,
  X,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Send,
  Eye,
  Briefcase
} from 'lucide-react';

interface AdminSettingsModuleProps {
  activeTab: string;
  announcements: AdminAnnouncement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<AdminAnnouncement[]>>;
  invoices: AdminBillingInvoice[];
  setInvoices: React.Dispatch<React.SetStateAction<AdminBillingInvoice[]>>;
  onShowToast: (message: string) => void;
}

// Initial mock backups
const INITIAL_BACKUPS = [
  { id: 'b-1', filename: 'siakad_backup_20260625_120000.sql', size: '12.4 MB', timestamp: '2026-06-25 12:00:15', status: 'Sukses' },
  { id: 'b-2', filename: 'siakad_backup_20260624_120000.sql', size: '12.2 MB', timestamp: '2026-06-24 12:00:09', status: 'Sukses' },
  { id: 'b-3', filename: 'siakad_backup_20260623_120000.sql', size: '12.1 MB', timestamp: '2026-06-23 12:00:22', status: 'Sukses' }
];

export function AdminSettingsModule({
  activeTab,
  announcements,
  setAnnouncements,
  invoices,
  setInvoices,
  onShowToast
}: AdminSettingsModuleProps) {
  // Common states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Backup states
  const [backups, setBackups] = useState(INITIAL_BACKUPS);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Currency Formatter
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Open Add Modals
  const handleOpenAdd = () => {
    setFormData({});
    setSelectedId(null);
    setModalMode('add');

    if (activeTab === 'admin-pengumuman') {
      setFormData({ target: 'Semua', category: 'Akademik', date: new Date().toISOString().split('T')[0] });
    } else if (activeTab === 'admin-keuangan') {
      setFormData({ amount: 5000000, status: 'Belum Lunas' });
    }

    setIsModalOpen(true);
  };

  // Open Edit Modals
  const handleOpenEdit = (item: any) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Delete handlers
  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus item terpilih?')) {
      if (activeTab === 'admin-pengumuman') {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        onShowToast('Pengumuman berhasil dihapus.');
      } else if (activeTab === 'admin-keuangan') {
        setInvoices(prev => prev.filter(i => i.id !== id));
        onShowToast('Tagihan UKT/SPP berhasil dihapus.');
      }
    }
  };

  // Submit handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === 'add') {
      const newId = `set-${Date.now()}`;
      const recordWithId = { ...formData, id: newId };

      if (activeTab === 'admin-pengumuman') {
        setAnnouncements(prev => [recordWithId as AdminAnnouncement, ...prev]);
        onShowToast(`Pengumuman "${formData.title}" berhasil disiarkan!`);
      } else if (activeTab === 'admin-keuangan') {
        setInvoices(prev => [recordWithId as AdminBillingInvoice, ...prev]);
        onShowToast(`Tagihan UKT baru untuk NIM ${formData.studentNim} berhasil diterbitkan.`);
      }
    } else {
      // Edit
      if (activeTab === 'admin-pengumuman') {
        setAnnouncements(prev => prev.map(a => a.id === selectedId ? { ...a, ...formData } : a));
        onShowToast(`Pengumuman berhasil diperbarui.`);
      } else if (activeTab === 'admin-keuangan') {
        setInvoices(prev => prev.map(i => i.id === selectedId ? { ...i, ...formData } : i));
        onShowToast(`Detail tagihan UKT berhasil diperbarui.`);
      }
    }

    setIsModalOpen(false);
    setFormData({});
    setSelectedId(null);
  };

  // Trigger Manual Database Backup
  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    onShowToast('Menghubungkan ke PostgreSQL, dump schema & transaction logs...');

    setTimeout(() => {
      const now = new Date();
      const formatDigit = (d: number) => d < 10 ? `0${d}` : d;
      const timestampStr = `${now.getFullYear()}${formatDigit(now.getMonth() + 1)}${formatDigit(now.getDate())}_${formatDigit(now.getHours())}${formatDigit(now.getMinutes())}${formatDigit(now.getSeconds())}`;
      const newBackup = {
        id: `back-${Date.now()}`,
        filename: `siakad_backup_${timestampStr}.sql`,
        size: '12.5 MB',
        timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
        status: 'Sukses'
      };

      setBackups(prev => [newBackup, ...prev]);
      setIsBackingUp(false);
      onShowToast('Berhasil! Salinan database SQL berhasil disimpan dan siap diunduh.');
    }, 2500);
  };

  // Toggle billing status payment
  const handleTogglePaymentStatus = (inv: AdminBillingInvoice) => {
    const nextStatus = inv.status === 'Lunas' ? 'Belum Lunas' : 'Lunas';
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: nextStatus } : i));
    onShowToast(`Status tagihan NIM ${inv.studentNim} diubah menjadi: ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Konfigurasi &amp; Penyetelan &gt; {
              activeTab === 'admin-pengumuman' ? 'Siaran Pengumuman' :
              activeTab === 'admin-keuangan' ? 'Keuangan & UKT' : 'Backup & Restore SQL'
            }
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Broadcasting pengumuman civitas akademika, kelola invoice SPP/UKT semester, serta lakukan dump backup database harian.
          </p>
        </div>
        {['admin-pengumuman', 'admin-keuangan'].includes(activeTab) && (
          <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'admin-pengumuman' ? 'Buat Pengumuman Baru' : 'Terbitkan Tagihan Baru'}
          </button>
        )}
      </div>

      {/* 1. BROADCAST PENGUMUMAN */}
      {activeTab === 'admin-pengumuman' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs relative hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 roundedr">
                      Target: {ann.target}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white pt-1">
                      {ann.title}
                    </h4>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleOpenEdit(ann)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 rounded">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-semibold">
                  {ann.content}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Disiarkan pada: {ann.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. KEUANGAN & UKT */}
      {activeTab === 'admin-keuangan' && (
        <div className="space-y-6">
          {/* Quick billing summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Dana Terkumpul</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">
                  {formatRupiah(invoices.filter(i => i.status === 'Lunas').reduce((acc, i) => acc + i.amount, 0))}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Dari tagihan UKT lunas semester ini</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Tunggakan Belum Lunas</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">
                  {formatRupiah(invoices.filter(i => i.status === 'Belum Lunas').reduce((acc, i) => acc + i.amount, 0))}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Harus ditindak lanjuti / dispensasi</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Persentase Pelunasan</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">
                  {(invoices.filter(i => i.status === 'Lunas').length / (invoices.length || 1) * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Rasio pelunasan UKT mahasiswa</p>
              </div>
            </div>
          </div>

          {/* Invoices List table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500r bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4">NIM Mahasiswa</th>
                    <th className="px-6 py-4">Nominal Tagihan</th>
                    <th className="px-6 py-4">Deskripsi Billing</th>
                    <th className="px-6 py-4">Status Pembayaran</th>
                    <th className="px-6 py-4 text-center">Tindakan Cepat</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{inv.studentNim}</td>
                      <td className="px-6 py-4 font-extrabold text-slate-800 dark:text-slate-200">{formatRupiah(inv.amount)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-500">{inv.description}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleTogglePaymentStatus(inv)}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                        >
                          Switch ke {inv.status === 'Lunas' ? 'Belum Lunas' : 'Lunas'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenEdit(inv)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 rounded">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(inv.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 rounded">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. BACKUP & RESTORE DATABASE */}
      {activeTab === 'admin-backup' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-lg">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-whiter flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Preservasi Data PostgreSQL &amp; Media Vault
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Sistem akan membuat salinan dump data transaksional (KRS, KHS, Biodata, Presensi, Billing) lengkap beserta struktur schema tabel secara aman. Backup direkomendasikan setiap akhir periode pengisian KRS.
              </p>
            </div>

            <button
              onClick={handleTriggerBackup}
              disabled={isBackingUp}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-colors flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
            >
              {isBackingUp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengkompresi SQL...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Cadangkan Database SQL Sekarang
                </>
              )}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-whiter">Arsip SQL Dump (.sql)</h4>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {backups.map((b) => (
                <div key={b.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{b.filename}</p>
                    <p className="text-[10px] text-slate-400">Ukuran: {b.size} &bull; Selesai pada: {b.timestamp}</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-0.5 rounded text-[10px] font-bold">
                      {b.status}
                    </span>
                    <button
                      onClick={() => onShowToast(`Mengunduh salinan cadangan ${b.filename}...`)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
                      title="Unduh Berkas SQL"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`PERINGATAN KRITIKAL: Anda akan melakukan restorasi database SIAKAD menggunakan berkas "${b.filename}". Seluruh data transaksi saat ini akan tertimpa. Lanjutkan?`)) {
                          onShowToast('Memulihkan struktur database dari salinan arsip SQL...');
                        }
                      }}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg transition-colors text-[10px] font-bold"
                      title="Kembalikan (Restore)"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Unified Create/Edit Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-zoomIn">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-whiter">
                {modalMode === 'add' ? 'Terbitkan' : 'Ubah'} Rekap Konfigurasi
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {activeTab === 'admin-pengumuman' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Judul Pengumuman</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Judul pengumuman akademik"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Konten / Isi Pengumuman</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white resize-none"
                      placeholder="Tuliskan isi maklumat / pengumuman secara rinci..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Target Pembaca</label>
                      <select
                        value={formData.target || 'Semua'}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                      >
                        <option value="Semua">Semua Civitas</option>
                        <option value="Dosen">Dosen Saja</option>
                        <option value="Mahasiswa">Mahasiswa Saja</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Publikasi</label>
                      <input
                        type="date"
                        required
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'admin-keuangan' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">NIM Mahasiswa</label>
                    <input
                      type="text"
                      required
                      value={formData.studentNim || ''}
                      onChange={(e) => setFormData({ ...formData, studentNim: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white font-mono"
                      placeholder="Contoh: 10118025"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nominal Pembayaran UKT (Rupiah)</label>
                    <input
                      type="number"
                      required
                      value={formData.amount || 5000000}
                      onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Deskripsi Tagihan (e.g. UKT Semester Ganjil)</label>
                    <input
                      type="text"
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      placeholder="Deskripsi pembayaran tagihan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status Pembayaran</label>
                    <select
                      value={formData.status || 'Belum Lunas'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
                    >
                      <option value="Belum Lunas">Belum Lunas</option>
                      <option value="Lunas">Lunas</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
