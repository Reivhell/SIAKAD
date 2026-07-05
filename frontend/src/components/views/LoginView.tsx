import React, { useState } from 'react';
import { Sparkles, User as UserIcon, Lock, ArrowRight, Shield, CheckCircle, HelpCircle, GraduationCap, Briefcase, ClipboardList, Globe, ArrowLeft, Mail, KeyRound, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { User, Role } from '../../types';
import { useLanguage } from '../../utils/i18n';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { AuthService } from '../../api/auth.api';

interface LoginViewProps {
  onLoginSuccess: (user: User, redirectRoute: string) => void;
}

const demoAccounts = [
  {
    role: 'student' as Role,
    username: 'ahmad.syafiq@mahasiswa.ac.id',
    name: 'Ahmad Syafiq (Mahasiswa)',
    description: 'Akses KRS, KHS, & Akademik Mandiri',
    avatar: 'A',
    color: 'border-green-200 dark:border-green-900/50 hover:bg-green-50/40 dark:hover:bg-green-950/20 text-green-700 dark:text-green-400 bg-green-50/20 dark:bg-green-950/5',
    icon: GraduationCap,
  },
  {
    role: 'lecturer' as Role,
    username: 'budi.rahardjo@kampus.ac.id',
    name: 'Dr. Budi Rahardjo (Dosen Wali)',
    description: 'Pencatatan Presensi & Wali Mahasiswa',
    avatar: 'B',
    color: 'border-amber-200 dark:border-amber-900/50 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 text-amber-700 dark:text-amber-400 bg-amber-50/20 dark:bg-amber-950/5',
    icon: Briefcase,
  },
  {
    role: 'kaprodi' as Role,
    username: 'kaprodi@kampus.ac.id',
    name: 'Dr. Budi Rahardjo (Kaprodi)',
    description: 'Persetujuan Kelas & Monitoring SKS',
    avatar: 'K',
    color: 'border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/5',
    icon: ClipboardList,
  },
  {
    role: 'dekan' as Role,
    username: 'dekan@kampus.ac.id',
    name: 'Prof. Faisal Akbar (Dekan)',
    description: 'Statistik Makro & Pengesahan Kurikulum',
    avatar: 'D',
    color: 'border-rose-200 dark:border-rose-900/50 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 text-rose-700 dark:text-rose-400 bg-rose-50/20 dark:bg-rose-950/5',
    icon: Shield,
  },
  {
    role: 'baak' as Role,
    username: 'baak@kampus.ac.id',
    name: 'Ir. Hermawan (Admin BAAK)',
    description: 'Administrasi Kurikulum & Jadwal Global',
    avatar: 'BA',
    color: 'border-cyan-200 dark:border-cyan-900/50 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 bg-cyan-50/20 dark:bg-cyan-950/5',
    icon: ClipboardList,
  },
  {
    role: 'bauk' as Role,
    username: 'bauk@kampus.ac.id',
    name: 'Siti Aminah, S.E. (Admin BAUK)',
    description: 'Keuangan, Konfigurasi UKT & Beasiswa',
    avatar: 'BK',
    color: 'border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/5',
    icon: Briefcase,
  },
  {
    role: 'applicant' as Role,
    username: 'calon@mahasiswa.ac.id',
    name: 'Rian Hidayat (Calon Mahasiswa)',
    description: 'Penerimaan Mahasiswa Baru & Ujian CBT',
    avatar: 'CM',
    color: 'border-violet-200 dark:border-violet-900/50 hover:bg-violet-50/40 dark:hover:bg-violet-950/20 text-violet-700 dark:text-violet-400 bg-violet-50/20 dark:bg-violet-950/5',
    icon: Globe,
  },
  {
    role: 'alumni' as Role,
    username: 'alumni@alumni.ac.id',
    name: 'Dewi Lestari, S.Kom (Alumni)',
    description: 'Ijazah Digital & Tracer Study',
    avatar: 'AL',
    color: 'border-purple-200 dark:border-purple-900/50 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 text-purple-700 dark:text-purple-400 bg-purple-50/20 dark:bg-purple-950/5',
    icon: GraduationCap,
  },
  {
    role: 'admin' as Role,
    username: 'admin@kampus.ac.id',
    name: 'Hendra Wijaya, M.T. (Admin)',
    description: 'Kontrol Penuh Sistem & Administrasi',
    avatar: 'H',
    color: 'border-blue-200 dark:border-blue-900/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-blue-700 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/5',
    icon: Shield,
  },
];

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const { t, lang, changeLanguage, languages, dir } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [username, setUsername] = useState('ahmad.syafiq@mahasiswa.ac.id');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState<number>(0);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleQuickPrefill = (account: typeof demoAccounts[0]) => {
    setSelectedRole(account.role);
    setUsername(account.username);
    setPassword('');
    setError('');
  };

  const getRouteForRole = (role: Role): string => {
    const routes: Record<Role, string> = {
      student: '/siakad/mahasiswa',
      lecturer: '/siakad/dosen',
      admin: '/admin',
      kaprodi: '/siakad/kaprodi',
      dekan: '/siakad/dekan',
      baak: '/siakad/baak',
      bauk: '/siakad/bauk',
      applicant: '/siakad/calon',
      alumni: '/siakad/alumni',
    };
    return routes[role] || '/';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login({ username, password });
      setLoading(false);
      if (response.status === 'success' && response.user) {
        onLoginSuccess(response.user, getRouteForRole(response.user.role));
      } else {
        setError(response.message || 'Login gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Kredensial tidak valid. Silakan periksa kembali email atau kata sandi Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200" dir={dir}>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-widest">
            SIAKAD<span className="text-blue-500">.</span>
          </span>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight px-4">
          {t('login.welcome')}
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('login.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 py-8 px-4 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-800/80 sm:px-10">
          
          {/* Left/Form section */}
          <div className="lg:col-span-7 space-y-6">
            {forgotStep === 0 ? (
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Language Switcher Section */}
                <div id="login-language-switcher-wrapper" className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div id="login-language-switcher-label" className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t('login.lang_select')}</span>
                  </div>
                  <LanguageSwitcher />
                </div>

                {/* Role Selection Switch */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                    {t('login.role_preview')}
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    {(['student', 'lecturer', 'kaprodi', 'admin'] as Role[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          const defaultEmail = 
                            role === 'student' ? 'ahmad.syafiq@mahasiswa.ac.id' : 
                            role === 'lecturer' ? 'budi.rahardjo@kampus.ac.id' : 
                            role === 'kaprodi' ? 'kaprodi@kampus.ac.id' : 
                            'admin@kampus.ac.id';
                          setUsername(defaultEmail);
                        }}
                        className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                          selectedRole === role
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {role === 'student' ? 'Mhs' : role === 'lecturer' ? 'Dosen' : role === 'kaprodi' ? 'KPS' : 'Admin'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Username Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                    {t('login.username')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder={selectedRole === 'student' ? "NIM atau Email Mahasiswa" : selectedRole === 'lecturer' ? "NIDN atau Email Dosen" : selectedRole === 'kaprodi' ? "Email Kaprodi" : "Username Admin"}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {t('login.password')}
                    </label>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setForgotEmail(username);
                        setForgotStep(1);
                        setForgotError('');
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {lang === 'id' ? 'Lupa?' : 'Forgot?'}
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all mt-6 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('login.button')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            ) : (
              /* Forgot Password Wizard Flow */
              <div className="space-y-5">
                {/* Header Recovery with Back Link */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'id' ? 'Pemulihan Kata Sandi' : 'Password Recovery'}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {forgotStep === 1 && (lang === 'id' ? 'Langkah 1/2: Identitas Akun' : 'Step 1/2: Account Identity')}
                      {forgotStep === 2 && (lang === 'id' ? 'Langkah 2/2: Instruksi Terkirim' : 'Step 2/2: Instructions Sent')}
                    </p>
                  </div>
                  {forgotStep < 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotError('');
                        setForgotStep((prev) => prev - 1);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-wider cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{lang === 'id' ? 'Kembali' : 'Back'}</span>
                    </button>
                  )}
                </div>

                {/* Progress Visual Tracker */}
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        forgotStep >= step
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Step 1 Form: Request Code */}
                {forgotStep === 1 && (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!forgotEmail.trim()) {
                        setForgotError(lang === 'id' ? 'Silakan masukkan email atau nama pengguna Anda.' : 'Please enter your email or username.');
                        return;
                      }
                      setForgotLoading(true);
                      setForgotError('');
                      try {
                        await AuthService.requestPasswordReset(forgotEmail.trim());
                        setForgotStep(2);
                      } catch (err: any) {
                        setForgotError(err?.message || 'Gagal mengirim permintaan reset. Silakan coba lagi.');
                      } finally {
                        setForgotLoading(false);
                      }
                    }} 
                    className="space-y-4"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === 'id'
                        ? 'Instruksi reset akan dikirimkan jika email terdaftar.'
                        : 'Reset instructions will be sent if the email is registered.'
                      }
                    </p>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                        {lang === 'id' ? 'Email / Nama Pengguna' : 'Email / Username'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="ahmad.syafiq@mahasiswa.ac.id"
                        />
                      </div>
                    </div>

                    {forgotError && (
                      <div className="flex items-start gap-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{lang === 'id' ? 'Kirim Instruksi Reset' : 'Send Reset Instructions'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <div className="space-y-4 text-center">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900/40">
                      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <h3 className="font-bold text-green-800 dark:text-green-300 mb-1">
                        {lang === 'id' ? 'Instruksi Terkirim' : 'Instructions Sent'}
                      </h3>
                      <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
                        {lang === 'id'
                          ? 'Instruksi reset kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk email untuk melanjutkan proses reset.'
                          : 'Password reset instructions have been sent to your email. Please check your inbox to continue the reset process.'
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setForgotStep(0);
                        setForgotError('');
                        setForgotEmail('');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-1" />
                      {lang === 'id' ? 'Kembali ke Login' : 'Back to Login'}
                    </button>
                  </div>
                )}


              </div>
            )}
          </div>

          {/* Right/Prefill Quick Access */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                Masuk Cepat Demo
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
                {t('login.credentials_desc')}
              </p>
              
              <div className="space-y-3">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  const isSelected = selectedRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickPrefill(acc)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-3 cursor-pointer ${acc.color} ${
                        isSelected ? 'ring-2 ring-blue-500 border-transparent shadow-sm' : ''
                      }`}
                    >
                      <div className="p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-lg text-slate-600 dark:text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white leading-none truncate">{acc.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">{acc.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 text-[10px] text-slate-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Butuh bantuan? Hubungi Puskom Kampus</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
