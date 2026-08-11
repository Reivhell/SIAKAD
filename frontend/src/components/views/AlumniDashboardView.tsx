import React, { useState } from 'react';
import { 
  LayoutDashboard, GraduationCap, FileSpreadsheet, 
  User as UserIcon, Award, Download, MapPin, Phone, Mail, 
  Clock, ShieldCheck, CheckSquare, Search, Info, HelpCircle, FileText,
  Lock
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { User } from '../../types';
import { getRoleDashboard, AlumniDashboardPayload } from '../../api/academic.api';
import { useEffect } from 'react';
import { CertifiedDigitalTranscript } from '../widgets/CertifiedDigitalTranscript';
import { DigitalFormsTracker } from '../widgets/DigitalFormsTracker';
import { useLanguage } from '../../utils/i18n';
import { motion } from 'motion/react';

interface AlumniDashboardViewProps {
  user: User;
  onUserChange?: (newUser: User) => void;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

export function AlumniDashboardView({ user, onUserChange, activeTab: propActiveTab, onChangeTab: propOnChangeTab }: AlumniDashboardViewProps) {
  const { t } = useLanguage();
  const [localActiveTab, setLocalActiveTab] = useState('dashboard');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propOnChangeTab || setLocalActiveTab;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Data nyata profil alumni dari backend (RoleDashboard)
  const [alumniProfile, setAlumniProfile] = useState<AlumniDashboardPayload['alumniProfile']>({
    nim: '', program: '', faculty: '', classYear: '', graduationYear: '', gpa: 0, totalSks: 0,
    degree: '', advisor: '', birthPlace: '', birthDate: '', religion: '', citizenId: '',
    phone: '', address: '', avatarUrl: '',
  });
  const [alumniSemesterGPAs, setAlumniSemesterGPAs] = useState<AlumniDashboardPayload['alumniSemesterGPAs']>([]);

  // Gabung profil alumni dari backend dengan identitas pengguna yang sedang login
  const profileView = {
    ...alumniProfile,
    name: alumniProfile.name || user.name || 'Alumni',
    email: alumniProfile.email || user.email || '',
    phone: alumniProfile.phone || user.phone || '-',
    avatarUrl: alumniProfile.avatarUrl || user.avatar || '',
  };

  useEffect(() => {
    let cancelled = false;
    getRoleDashboard<AlumniDashboardPayload>('alumni')
      .then((data) => {
        if (cancelled) return;
        if (data.alumniProfile) setAlumniProfile(data.alumniProfile);
        setAlumniSemesterGPAs(data.alumniSemesterGPAs ?? []);
      })
      .catch(() => {
        // biarkan state kosong; UI menampilkan kondisi "Belum ada data"
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan Alumni', icon: LayoutDashboard },
    { id: 'transkrip', label: 'Ijazah & Transkrip', icon: GraduationCap },
    { id: 'tracer', label: 'Tracer Study', icon: Search },
    { id: 'layanan', label: 'Layanan Alumni', icon: FileSpreadsheet },
    { id: 'profil', label: 'Profil Saya', icon: UserIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold border border-slate-800 dark:border-slate-200 flex items-center gap-2 animate-pulse">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          {toastMessage}
        </div>
      )}

      {/* Alumni Header Card */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full border border-amber-300 shadow-md">
                ALUMNI / GRADUATED
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Selamat Datang Kembali, {profileView.name}</h2>
            <p className="text-xs text-amber-100 font-medium">
              NIM: {alumniProfile.nim} &bull; {alumniProfile.program} &bull; Wisuda Angkatan {alumniProfile.graduationYear}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10 flex items-center gap-4">
            <div className="text-center border-r border-white/10 pr-4">
              <div className="text-[10px] text-amber-200 font-black">IPK Kelulusan</div>
              <div className="text-xl font-black text-amber-300">{alumniProfile.gpa}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-amber-200 font-black">Gelar Akademik</div>
              <div className="text-xs font-extrabold text-white">{alumniProfile.degree}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 max-w-2xl">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-colors cursor-pointer ${
                isActive 
                  ? item.id === 'profil'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-400/30 font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                  : item.id === 'profil'
                  ? 'text-amber-650 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-500/10 dark:hover:bg-amber-500/10'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Academic stats cards */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Info banner explaining status */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 rounded-2xl p-5 flex gap-4 items-start shadow-xs">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Status Kelulusan Terverifikasi</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Anda telah resmi menyelesaikan seluruh kewajiban akademik sebanyak <b>{alumniProfile.totalSks} SKS</b> dengan predikat kelulusan <b>Sangat Memuaskan (Cum Laude)</b>. Modul perkuliahan aktif (KRS, Presensi, Evaluasi Dosen) kini terkunci secara permanen dan dialihkan ke arsip digital.
                  </p>
                </div>
              </div>

              {/* GPA Chart over semester */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-850">
                  <div>
                    <h3 className="text-xs font-blackr text-slate-400">Riwayat IPK & IPS Per Semester</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Arsip perkembangan indeks prestasi dari Semester 1 hingga kelulusan.</p>
                  </div>
                  <span className="text-[10.5px] font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    Selesai 8 Semester
                  </span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={alumniSemesterGPAs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIPS" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorIPK" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[2.5, 4.0]} />
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid var(--color-border)' }} />
                      <Area type="monotone" dataKey="IPS" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIPS)" name="IPS Semester" />
                      <Area type="monotone" dataKey="IPK" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIPK)" name="IPK Kumulatif" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Verified Documents overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2 p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">PIN Nasional (Kemdikbud)</div>
                  <div className="font-mono text-sm font-black text-slate-800 dark:text-white">00109923881092</div>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">
                    Penomoran Ijazah Nasional (PIN) tervalidasi di SIVIL Dikti dengan nomor registrasi kelulusan resmi.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2 p-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Predikat Kelulusan</div>
                  <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">Dengan Pujian (Cum Laude)</div>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">
                    IPK akhir 3.62 dengan masa studi tepat 4.0 tahun tanpa sanksi akademik atau administrasi.
                  </p>
                </div>
              </div>

            </div>

            {/* Quick links & sidebar cards */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Alumni card representation */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-800 dark:text-whiter pb-2.5 border-b border-slate-100 dark:border-slate-850 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  Kartu Ikatan Alumni (IKA)
                </h4>
                
                {/* Simulated plastic card representation */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 aspect-[1.58/1] shadow-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[8px] font-black tracking-widest text-amber-400">IKA ALUMNI UAT</div>
                      <div className="text-[6px] text-slate-400 mt-0.5">IKATAN KELUARGA ALUMNI</div>
                    </div>
                    <span className="text-[7px] font-bold border border-white/20 bg-white/5 rounded px-1.5 py-0.5">ALUMNI</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold tracking-wide">{profileView.name}</div>
                    <div className="text-[8px] font-mono text-slate-400">NIM: {alumniProfile.nim} &bull; S.Kom</div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-1.5 mt-1 text-[7px] text-slate-400 font-mono">
                    <div>TERBIT: 2023</div>
                    <div>STATUS: ALUMNI</div>
                  </div>
                </div>

                <button
                  onClick={() => triggerToast("Simulasi pengajuan pembuatan Kartu IKA Fisik berhasil dikirim!")}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/50 dark:border-slate-700 py-2 rounded-xl text-[11px] font-black text-slate-800 dark:text-slate-200 transition-colors cursor-pointer text-center"
                >
                  Cetak / Ajukan Kartu IKA Fisik
                </button>
              </div>

              {/* Read-only verification center */}
              <div className="bg-slate-900 text-slate-250 rounded-3xl p-5 space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-xs font-black text-whiter flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Pemberitahuan Akademik
                </h4>
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Hak akses terhadap SIAKAD bagi alumni dibatasi untuk peninjauan riwayat, unduhan transkrip, dan administrasi alumni. Seluruh proses penambahan SKS atau manipulasi jadwal ditolak oleh sistem.
                </p>
                <div className="text-[9px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  Sesi Alumni Berakhir secara Aman
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CERTIFIED DIGITAL TRANSCRIPT */}
        {activeTab === 'transkrip' && (
          <div className="space-y-6">
            <CertifiedDigitalTranscript />
          </div>
        )}

        {/* TAB TRACER STUDY */}
        {activeTab === 'tracer' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white">Kuesioner Tracer Study Alumni</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kontribusi Anda sangat berharga untuk meningkatkan kualitas pengajaran, evaluasi CPL prodi, serta prasyarat akreditasi institusi nasional (BAN-PT).
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); triggerToast("Data Tracer Study Anda berhasil divalidasi dan disimpan di sistem!"); }} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450">Status Pekerjaan Saat Ini</label>
                <select className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2.5 rounded-xl text-xs mt-1 font-semibold">
                  <option value="bekerja">Bekerja Penuh Waktu (Full-Time)</option>
                  <option value="wirausaha">Berwirausaha / Founder</option>
                  <option value="studi">Melanjutkan Studi (S2/S3)</option>
                  <option value="mencari">Mencari Kesempatan Kerja</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450">Nama Instansi / Perusahaan</label>
                <input type="text" placeholder="Contoh: PT. GoTo Gojek Tokopedia" className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2.5 rounded-xl text-xs mt-1 font-semibold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450">Jabatan / Posisi Kerja</label>
                <input type="text" placeholder="Contoh: Software Engineer" className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2.5 rounded-xl text-xs mt-1 font-semibold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450">Rentang Pendapatan Bulanan</label>
                <select className="w-full border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2.5 rounded-xl text-xs mt-1 font-semibold">
                  <option value="r1">&lt; Rp 5.000.000</option>
                  <option value="r2">Rp 5.000.000 - Rp 10.000.000</option>
                  <option value="r3">Rp 10.000.000 - Rp 20.000.000</option>
                  <option value="r4">&gt; Rp 20.000.000</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-450">Keselarasan dengan Bidang Studi (Teknik Informatika)</label>
                <div className="grid grid-cols-3 gap-3 mt-1.5">
                  <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 text-xs font-semibold">
                    <input type="radio" name="keselarasan" value="sangat" defaultChecked />
                    Sangat Selaras
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 text-xs font-semibold">
                    <input type="radio" name="keselarasan" value="cukup" />
                    Cukup Selaras
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 text-xs font-semibold">
                    <input type="radio" name="keselarasan" value="tidak" />
                    Tidak Selaras
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end pt-3">
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-md">
                  Kirim Data Tracer Study
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ALUMNI SERVICES */}
        {activeTab === 'layanan' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Layanan Mandiri Alumni (Self-Service)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Lakukan pengajuan digital untuk legalisir ijazah, pembuatan SKPI, transkrip cetak bersegel, atau surat keterangan lulus secara instan.
              </p>
            </div>
            
            {/* Embedded DigitalFormsTracker forced with isAlumni={true} */}
            <DigitalFormsTracker role="student" isAlumni={true} user={user} />
          </div>
        )}

        {/* TAB 4: ALUMNI PROFILE */}
        {activeTab === 'profil' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white">Biodata & Informasi Alumni Resmi</h3>
                <p className="text-xs text-slate-400">Seluruh data kelulusan bersifat permanen dan telah dicatat di database Kemdikbudristek.</p>
              </div>
              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 font-bold text-[10px] px-3 py-1 rounded-full border border-amber-500/20">
                <Lock className="w-3 h-3" /> Data Permanen (Read-Only)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Profile pic column */}
              <div className="md:col-span-3 flex flex-col items-center text-center space-y-3">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/20 shadow-md flex items-center justify-center bg-slate-100 dark:bg-slate-850">
                    {profileView.avatarUrl ? (
                      <img 
                        src={profileView.avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-4xl font-black text-slate-400">
                        {(profileView.name || 'A').charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">{profileView.name}</div>
                  <div className="text-xs text-slate-400 font-semibold">NIM. {alumniProfile.nim}</div>
                </div>
              </div>

              {/* Biodata Fields - fully styled read-only cards */}
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Fakultas / Program Studi</span>
                  <div className="font-bold text-slate-850 dark:text-slate-200">{alumniProfile.faculty} / {alumniProfile.program}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Dosen Pembimbing Akademik</span>
                  <div className="font-bold text-slate-850 dark:text-slate-200">{alumniProfile.advisor}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tempat, Tanggal Lahir</span>
                  <div className="font-bold text-slate-850 dark:text-slate-200">{alumniProfile.birthPlace}, {alumniProfile.birthDate}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">NIK / Agama</span>
                  <div className="font-bold text-slate-850 dark:text-slate-200">{alumniProfile.religion} / {alumniProfile.citizenId}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850/50 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Surat Elektronik (Email) Resmi</span>
                  <div className="font-mono font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {profileView.email}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850/50 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nomor Telepon Seluler</span>
                  <div className="font-mono font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {profileView.phone}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850/50 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Alamat Rumah Tinggal</span>
                  <div className="font-bold text-slate-850 dark:text-slate-200 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /> {alumniProfile.address}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
