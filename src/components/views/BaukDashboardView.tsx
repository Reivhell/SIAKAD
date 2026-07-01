import React, { useState } from 'react';
import { 
  LayoutDashboard, CreditCard, Award, ArrowUpRight, CheckSquare, Search, 
  Plus, Check, X, FileText, Lock, Clock, Sparkles, ChevronRight, BarChart2, 
  ShieldCheck, Download, Users, RefreshCw, AlertTriangle
} from 'lucide-react';
import { User } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../lib/i18n';

interface BaukDashboardViewProps {
  user: User;
  onUserChange?: (newUser: User) => void;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

export function BaukDashboardView({ user, onUserChange, activeTab: propActiveTab, onChangeTab: propOnChangeTab }: BaukDashboardViewProps) {
  const { t } = useLanguage();
  const [localActiveTab, setLocalActiveTab] = useState('dashboard');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propOnChangeTab || setLocalActiveTab;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State for Billing Configuration
  const [billingConfigs, setBillingConfigs] = useState([
    { group: 'UKT Golongan I', nominal: 500000, installmentAllowed: false, lateFee: 0, count: 42 },
    { group: 'UKT Golongan II', nominal: 2500000, installmentAllowed: true, lateFee: 50000, count: 128 },
    { group: 'UKT Golongan III', nominal: 5000000, installmentAllowed: true, lateFee: 100000, count: 540 },
    { group: 'UKT Golongan IV', nominal: 7500000, installmentAllowed: true, lateFee: 150000, count: 310 }
  ]);

  // State for Beasiswa (Scholarships)
  const [scholarships, setScholarships] = useState([
    { id: 'SCH-01', name: 'KIP Kuliah / Bidikmisi', source: 'Pemerintah (Kemdikbud)', discountPercent: 100, awardees: 110, status: 'Aktif' },
    { id: 'SCH-02', name: 'Beasiswa Prestasi Unggulan', source: 'Internal Yayasan', discountPercent: 50, awardees: 45, status: 'Aktif' },
    { id: 'SCH-03', name: 'Beasiswa Djarum Foundation', source: 'Eksternal (Mitra)', discountPercent: 75, awardees: 12, status: 'Aktif' }
  ]);

  const [newSchName, setNewSchName] = useState('');
  const [newSchSource, setNewSchSource] = useState('');
  const [newSchDiscount, setNewSchDiscount] = useState(50);

  // State for Bank Virtual Account reconciliation
  const [reconciledPayments, setReconciledPayments] = useState([
    { id: 'TX-9021', name: 'Rian Hidayat', nim: '10123045', bank: 'BNI', va: '827101230459', amount: 'Rp 5.000.000', date: '2026-06-28 09:12', method: 'VA Auto-Sync', status: 'Selesai' },
    { id: 'TX-9020', name: 'Sania Sitorus', nim: '10122012', bank: 'Mandiri', va: '881901220123', amount: 'Rp 7.500.000', date: '2026-06-28 08:44', method: 'VA Auto-Sync', status: 'Selesai' },
    { id: 'TX-9019', name: 'Indra Gunawan', nim: '10121102', bank: 'BCA', va: '719010121102', amount: 'Rp 2.500.000', date: '2026-06-27 16:30', method: 'VA Auto-Sync', status: 'Selesai' }
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleRunReconciliation = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setReconciledPayments([
        { id: `TX-${Math.floor(Math.random() * 9000) + 1000}`, name: 'Dewi Lestari', nim: '10122044', bank: 'BRI', va: '821001220441', amount: 'Rp 5.000.000', date: 'Baru saja', method: 'API Reconcile', status: 'Selesai' },
        ...reconciledPayments
      ]);
      triggerToast('API Rekonsiliasi Virtual Account Bank Mitra berhasil disinkronkan!');
    }, 1500);
  };

  const handleAddScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchName || !newSchSource) return;
    setScholarships([
      ...scholarships,
      { id: `SCH-0${scholarships.length + 1}`, name: newSchName, source: newSchSource, discountPercent: Number(newSchDiscount), awardees: 0, status: 'Aktif' }
    ]);
    setNewSchName('');
    setNewSchSource('');
    triggerToast(`Beasiswa ${newSchName} berhasil didaftarkan.`);
  };

  const handleUpdateBillingConfig = (group: string, newNominal: number) => {
    setBillingConfigs(billingConfigs.map(config => config.group === group ? { ...config, nominal: newNominal } : config));
    triggerToast(`Nominal ${group} berhasil diperbarui.`);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan BAUK', icon: LayoutDashboard },
    { id: 'billing', label: 'Konfigurasi UKT/SPP', icon: CreditCard },
    { id: 'beasiswa', label: 'Manajemen Beasiswa', icon: Award },
    { id: 'rekon', label: 'Rekonsiliasi Bank VA', icon: RefreshCw }
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold border border-slate-800 dark:border-slate-200 flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-300 shadow-md">
                ADMINISTRATOR BAUK
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Portal Keuangan & Beasiswa (BAUK)</h2>
            <p className="text-xs text-emerald-100 font-medium">
              Selamat datang, {user.name} &bull; Kelola Struktur UKT, Rekonsiliasi Otomatis Virtual Account, dan Beasiswa Mahasiswa.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 max-w-2xl">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Tagihan Terbit</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">Rp 4.85 Miliar</div>
              <p className="text-[11px] text-slate-500 mt-2">UKT Semester Ganjil 2026/2027.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Pembayaran Terverifikasi</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">Rp 4.12 Miliar</div>
              <p className="text-[11px] text-slate-500 mt-2">Sinkronisasi otomatis Virtual Account bank.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Rasio Pelunasan</div>
              <div className="text-2xl font-black text-blue-600 mt-1">84.9 %</div>
              <p className="text-[11px] text-slate-500 mt-2">Kenaikan 4% dari semester sebelumnya.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Penerima Beasiswa</div>
              <div className="text-2xl font-black text-amber-600 mt-1">167 Mahasiswa</div>
              <p className="text-[11px] text-slate-500 mt-2">Pembebasan UKT penuh maupun sebagian.</p>
            </div>

            <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Laporan Keuangan & Audit Sistem
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center">
                  <div className="text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-250">Laporan Rekonsiliasi Harian</div>
                    <div className="text-[10px] text-slate-450 mt-0.5">Disinkronkan terakhir: Hari ini, 09:12</div>
                  </div>
                  <button className="bg-emerald-600/15 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Unduh PDF
                  </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center">
                  <div className="text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-250">Audit Rekapitulasi Beasiswa</div>
                    <div className="text-[10px] text-slate-450 mt-0.5">Sesuai aturan Kemdikbudristek.</div>
                  </div>
                  <button className="bg-emerald-600/15 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Unduh PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONFIG UKT/SPP */}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Skema Golongan UKT & Aturan Cicilan</h3>
                <p className="text-xs text-slate-500">
                  Tentukan tarif nominal untuk masing-masing golongan ekonomi, kebijakan kelayakan cicilan, dan besaran denda jika terlambat melunasi.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                    <tr>
                      <th className="p-3">Golongan</th>
                      <th className="p-3">Nominal Per Semester</th>
                      <th className="p-3">Kebijakan Cicilan</th>
                      <th className="p-3">Denda Keterlambatan</th>
                      <th className="p-3">Jumlah Mahasiswa</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {billingConfigs.map(c => (
                      <tr key={c.group} className="hover:bg-slate-50 dark:hover:bg-slate-850/20">
                        <td className="p-3 font-bold">{c.group}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600">Rp {c.nominal.toLocaleString('id-ID')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.installmentAllowed ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {c.installmentAllowed ? 'Diizinkan Cicil' : 'Wajib Lunas'}
                          </span>
                        </td>
                        <td className="p-3 text-red-500 font-mono">Rp {c.lateFee.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-slate-500">{c.count} Mhs</td>
                        <td className="p-3">
                          <button 
                            onClick={() => handleUpdateBillingConfig(c.group, c.nominal + 250000)}
                            className="text-[10.5px] font-bold text-emerald-600 hover:underline cursor-pointer"
                          >
                            Naikkan Rp250k
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Informasi Skema Pembayaran
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Setiap golongan UKT diverifikasi dengan melampirkan slip gaji orang tua dan tagihan listrik saat pendaftaran mahasiswa baru. Penurunan golongan dapat diajukan di awal semester dengan menyerahkan dokumen pendukung ke BAUK.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: BEASISWA */}
        {activeTab === 'beasiswa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daftar Program Beasiswa Aktif</h3>
                <p className="text-xs text-slate-500">
                  Daftarkan beasiswa dari internal kampus maupun eksternal. Sistem akan secara otomatis memotong nominal tagihan UKT mahasiswa penerima.
                </p>
              </div>

              <div className="space-y-3">
                {scholarships.map(s => (
                  <div key={s.id} className="p-4 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{s.id}</span>
                        <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                          Potongan {s.discountPercent}%
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.name}</div>
                      <div className="text-[10px] text-slate-500">Sumber: {s.source} &bull; {s.awardees} Penerima</div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 uppercase">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Daftarkan Beasiswa Baru
              </h4>
              <form onSubmit={handleAddScholarship} className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450">Nama Program Beasiswa</label>
                  <input 
                    type="text" 
                    value={newSchName}
                    onChange={(e) => setNewSchName(e.target.value)}
                    placeholder="Contoh: Beasiswa BRI Peduli" 
                    className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450">Sumber Dana</label>
                  <input 
                    type="text" 
                    value={newSchSource}
                    onChange={(e) => setNewSchSource(e.target.value)}
                    placeholder="Contoh: CSR Bank BRI" 
                    className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450">Persentase Potongan UKT</label>
                  <select 
                    value={newSchDiscount}
                    onChange={(e) => setNewSchDiscount(Number(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl text-xs mt-1"
                  >
                    <option value={25}>25 % (Potongan Sebagian)</option>
                    <option value={50}>50 % (Potongan Setengah)</option>
                    <option value={75}>75 % (Potongan Sebagian Besar)</option>
                    <option value={100}>100 % (Bebas UKT Penuh)</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer transition-all"
                >
                  Daftarkan Program Beasiswa
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: REKONSILIASI */}
        {activeTab === 'rekon' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Rekonsiliasi Bank Virtual Account</h3>
                <p className="text-xs text-slate-500">
                  Sinkronisasi mutasi kas harian dari bank mitra (BNI, BRI, Mandiri, BCA) untuk verifikasi pembayaran UKT otomatis.
                </p>
              </div>
              <button 
                onClick={handleRunReconciliation}
                disabled={isSyncing}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                {isSyncing ? 'Sedang Sinkronisasi VA...' : 'Mulai Sinkronisasi VA'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                  <tr>
                    <th className="p-3">ID Transaksi</th>
                    <th className="p-3">Nama Mahasiswa</th>
                    <th className="p-3">NIM</th>
                    <th className="p-3">Virtual Account</th>
                    <th className="p-3">Nominal Terbayar</th>
                    <th className="p-3">Waktu Transaksi</th>
                    <th className="p-3">Status VA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {reconciledPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/20">
                      <td className="p-3 font-mono font-bold text-slate-400">{p.id}</td>
                      <td className="p-3 font-bold">{p.name}</td>
                      <td className="p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{p.nim}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10.5px]">
                          {p.bank} &bull; {p.va}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600">{p.amount}</td>
                      <td className="p-3 text-slate-500">{p.date}</td>
                      <td className="p-3">
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
