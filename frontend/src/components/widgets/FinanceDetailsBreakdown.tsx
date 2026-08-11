import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, ShieldAlert, CheckCircle2, ChevronRight, PieChart, Landmark, HelpCircle, FileText, Calendar } from 'lucide-react';

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  category: string;
  description: string;
  color: string;
}

export function FinanceDetailsBreakdown() {
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);

  const feeItems: FeeItem[] = [
    {
      id: 'fee-sks',
      name: 'Biaya SKS Perkuliahan (24 SKS)',
      amount: 4800000,
      percentage: 64,
      category: 'Akademik',
      description: 'Biaya penyelenggaraan perkuliahan tatap muka dan ujian per semester yang dihitung secara proporsional sesuai dengan jumlah 24 SKS yang diambil.',
      color: 'bg-blue-500',
    },
    {
      id: 'fee-lab',
      name: 'Praktikum & Pemakaian Laboratorium',
      amount: 1500000,
      percentage: 20,
      category: 'Fasilitas',
      description: 'Akses penuh ke lab komputer berspesifikasi tinggi, lisensi perangkat lunak perkuliahan (Matlab, IntelliJ, AWS), dan pendampingan asisten praktikum.',
      color: 'bg-emerald-500',
    },
    {
      id: 'fee-kemahasiswaan',
      name: 'Dana Kemahasiswaan & Organisasi',
      amount: 700000,
      percentage: 9,
      category: 'Kemahasiswaan',
      description: 'Sokongan anggaran untuk kegiatan himpunan mahasiswa (HMTI), unit kegiatan mahasiswa (UKM), program kreativitas mahasiswa, kompetisi nasional, dan wisuda.',
      color: 'bg-amber-500',
    },
    {
      id: 'fee-asuransi',
      name: 'Asuransi Kesehatan & Fasilitas Kampus',
      amount: 500000,
      percentage: 7,
      category: 'Proteksi & Layanan',
      description: 'Premi asuransi kecelakaan mahasiswa 24 jam, subsidi pengobatan di Poliklinik Universitas, akses Wi-Fi serat optik, dan keanggotaan Perpustakaan Pusat.',
      color: 'bg-indigo-500',
    }
  ];

  const totalAmount = feeItems.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-200 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Transparansi Alokasi & Rincian Biaya Pendidikan
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Rincian penggunaan dana UKT Semester Ganjil Anda
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-200/40 dark:border-slate-850">
          Akuntabel
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graphical Breakdown Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Nominal Pembayaran</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Rp {totalAmount.toLocaleString('id-ID')},-
              </div>
            </div>

            {/* Simulated Pie/Doughnut-like stacked visual progress bar */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-bold text-slate-500 flex justify-between">
                <span>Grafik Proporsi UKT</span>
                <span>100% Terdistribusi</span>
              </div>
              <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner border border-slate-200/30 dark:border-slate-800/30">
                {feeItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedFee(item)}
                    style={{ width: `${item.percentage}%` }}
                    className={`${item.color} h-full hover:brightness-110 active:brightness-95 transition-colors relative group cursor-pointer`}
                    title={`${item.name}: ${item.percentage}%`}
                  >
                    {/* Tooltip on hover */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded whitespace-nowrap shadow-xl z-20">
                      {item.percentage}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 p-2.5 rounded-lg">
                <span className="text-[9px] uppercase font-bold text-slate-400">Terbesar</span>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">SKS Akademik</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold mt-0.5">64% Alokasi</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 p-2.5 rounded-lg">
                <span className="text-[9px] uppercase font-bold text-slate-400">Status Audit</span>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> WTP
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">BPK RI 2025</div>
              </div>
            </div>
          </div>
        </div>

        {/* List of fee items with active interaction */}
        <div className="lg:col-span-7 space-y-3">
          {feeItems.map((fee) => {
            const isSelected = selectedFee?.id === fee.id;
            return (
              <div
                key={fee.id}
                onClick={() => setSelectedFee(isSelected ? null : fee)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'bg-slate-50 dark:bg-slate-900/60 border-blue-500/40 dark:border-blue-500/35 shadow-xs'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 border-slate-200/60 dark:border-slate-800/80'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${fee.color} shrink-0`} />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {fee.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {fee.category}
                        </span>
                        <span className="text-slate-350 dark:text-slate-650">&bull;</span>
                        <span className="text-[10px] font-black text-slate-500">
                          {fee.percentage}% Proporsi
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Rp {fee.amount.toLocaleString('id-ID')}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ml-1.5 inline-block transform transition-transform ${isSelected ? 'rotate-90 text-blue-500' : ''}`} />
                  </div>
                </div>

                {/* Animated expandable details */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed space-y-2"
                  >
                    <p>{fee.description}</p>
                    <div className="flex items-center gap-1.5 bg-blue-50/40 dark:bg-blue-950/20 px-2.5 py-1.5 rounded-lg border border-blue-500/5 dark:border-blue-500/10 text-blue-800 dark:text-blue-300">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Alokasi dana diaudit akuntan publik dan dapat dilacak transparansinya via portal PPID.</span>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
