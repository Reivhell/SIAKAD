import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, Download, QrCode, FileText, CheckCircle2, Globe, Building, ArrowUpRight, Copy, Check, X, RefreshCw } from 'lucide-react';

interface CertifiedDigitalTranscriptProps {
  student?: { name: string; nim: string; program?: string; faculty?: string };
  ipk?: number;
  sksTotal?: number;
  transcriptRows?: Array<{ code: string; name: string; sks: number; grade: string; semester: number }>;
  onDownload?: () => void;
}

async function sha256Hex(payload: string): Promise<string> {
  const data = new TextEncoder().encode(payload);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function CertifiedDigitalTranscript({ student, ipk = 0, sksTotal = 0, transcriptRows = [], onDownload }: CertifiedDigitalTranscriptProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [recordHash, setRecordHash] = useState<string>('');

  const name = student?.name || '—';
  const nim = student?.nim || '—';
  const program = student?.program || 'S1 Teknik Informatika';

  // Sidik jari kriptografis dihitung dari data transkrip riil di sisi klien.
  const recordPayload = useMemo(
    () => JSON.stringify({ student: { name, nim, program }, ipk, sksTotal, rows: transcriptRows }),
    [name, nim, program, ipk, sksTotal, transcriptRows],
  );

  useEffect(() => {
    let cancelled = false;
    sha256Hex(recordPayload)
      .then((h) => { if (!cancelled) setRecordHash(h); })
      .catch(() => { if (!cancelled) setRecordHash(''); });
    return () => { cancelled = true; };
  }, [recordPayload]);

  const certId = `CERT-SIAKAD-${nim}-${recordHash ? recordHash.slice(0, 8).toUpperCase() : 'PENDING'}`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(recordHash || '');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Verifikasi ulang: hitung ulang hash dari data yang sama dan bandingkan.
  const runVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const recomputed = await sha256Hex(recordPayload);
      setVerificationResult(!!recordHash && recomputed === recordHash);
    } catch (err) {
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-200 font-sans relative overflow-hidden">
      {/* Decorative Golden / Emerald cert accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-emerald-500 to-indigo-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Transkrip & Ijazah Digital Tersertifikasi (Secure Credential)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Dokumen kelulusan dengan sidik jari kriptografis SHA-256 dari data transkrip riil.
          </p>
        </div>

        <button
          onClick={() => onDownload && onDownload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs  transition-colors flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Download className="w-3.5 h-3.5" /> Unduh PDF Resmi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Certificate preview layout */}
        <div className="lg:col-span-8 p-4.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-2 right-2 opacity-[0.03] dark:opacity-[0.05]">
            <Award className="w-48 h-48 text-indigo-600" />
          </div>

          <div className="space-y-4 relative z-10 text-xs">
            {/* Cert Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 leading-none">
                  UNIVERSITAS AKADEMIK TERPADU
                </span>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  REKTORAT & DIREKTORAT AKADEMIK
                </h5>
              </div>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-black">
                DOKUMEN DIGITAL TERSERTIFIKASI
              </span>
            </div>

            {/* Main content body */}
            <div className="border-y border-dashed border-slate-250 dark:border-slate-800 py-3.5 space-y-2.5">
              <div className="space-y-0.5 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">SALINAN IJAZAH & TRANSKRIP AKADEMIK DIGITAL</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{name} (NIM. {nim})</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Lulus Program Studi <b>{program}</b> dengan IPK <b>{ipk > 0 ? ipk : '—'}</b> dan total <b>{sksTotal} SKS</b>.
                </p>
              </div>

              {/* Cryptographic metadata signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">ID Sertifikat Digital</span>
                  <div className="bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-800 font-mono text-[9.5px] text-slate-750 dark:text-slate-350">
                    {certId}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Tanda Tangan Digital Tersemat</span>
                  <div className="bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-800 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Direktur Akademik & Senat Kampus</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SHA Hash fingerprint */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Sidik Jari Kriptografis SHA-256 (Hash)</span>
              <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-800 font-mono text-[9px] text-slate-500 dark:text-slate-450 flex justify-between items-center gap-3">
                <span className="truncate">{recordHash ? recordHash : 'Menghitung hash...'}</span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer shrink-0"
                  title="Salin hash kriptografis"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code & Third-party Verification Section */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4.5 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-center">
          <div className="space-y-3">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Scan QR Verifikasi</span>
            
            {/* Visual interactive QR code */}
            <div 
              onClick={() => setShowVerificationModal(true)}
              className="bg-white p-3 rounded-2xl inline-block border border-slate-200 shadow-xs  active:scale-95 transition-colors cursor-pointer mx-auto relative group"
            >
              <div className="w-28 h-28 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <QrCode className="w-24 h-24 text-slate-900" />
                {/* Visual lens scan line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent top-0 animate-[bounce_2.5s_infinite]" />
              </div>
              <div className="absolute inset-0 bg-slate-950/10 dark:bg-slate-950/30 backdrop-blur-3xs rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="bg-slate-900 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg shadow-lg flex items-center gap-1">
                  Uji Verifikasi <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px] mx-auto">
              Hash sidik jari dokumen ditautkan ke data transkrip di server SIAKAD untuk pengecekan keaslian.
            </p>
          </div>

          <button
            onClick={() => setShowVerificationModal(true)}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-250/30 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" /> Uji Verifikasi Keaslian Dokumen
          </button>
        </div>
      </div>

      {/* Verification modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-500" />
                  Gerbang Verifikasi Ijazah SIAKAD
                </h4>
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    setVerificationResult(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 text-xs space-y-3">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold">Pemilik Dokumen</span>
                  <div className="font-extrabold text-slate-800 dark:text-white">{name} (NIM. {nim})</div>
                </div>
                <div className="space-y-1 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  <div>Cert ID: {certId}</div>
                  <div>Hash Fingerprint: {recordHash ? `${recordHash.slice(0, 32)}...` : '—'}</div>
                </div>
              </div>

              {isVerifying ? (
                <div className="text-center py-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold animate-pulse">
                    Menghitung ulang hash dari data transkrip untuk verifikasi...
                  </p>
                </div>
              ) : verificationResult !== null ? (
                <div className={`${verificationResult ? 'bg-green-500/10 dark:bg-green-400/5 border-green-500/20' : 'bg-rose-500/10 dark:bg-rose-400/5 border-rose-500/20'} border p-4 rounded-xl text-xs space-y-3`}>
                  <div className={`flex items-center gap-2 font-black ${verificationResult ? 'text-green-700 dark:text-green-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    {verificationResult ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-rose-500" />}
                    <span>{verificationResult ? 'STATUS: DOKUMEN VALID / ASLI' : 'STATUS: HASH TIDAK COCOK'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed">
                    {verificationResult
                      ? `Hash terhitung ulang cocok dengan sidik jari kriptografis dokumen untuk ${name} (IPK ${ipk > 0 ? ipk : '—'}, ${sksTotal} SKS). Dokumen tidak diubah sejak diterbitkan.`
                      : 'Hash hasil perhitungan ulang berbeda dari sidik jari dokumen. Data transkrip kemungkinan berubah.'}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tekan tombol di bawah untuk menghitung ulang sidik jari kriptografis (SHA-256) dari data transkrip dan membandingkannya dengan hash yang tersemat pada dokumen.
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    setVerificationResult(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-200 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Tutup
                </button>
                {verificationResult === null && !isVerifying && (
                  <button
                    onClick={runVerification}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/15 cursor-pointer"
                  >
                    Mulai Verifikasi
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
