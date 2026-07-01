import React, { useState } from 'react';
import { Sparkles, User as UserIcon, Lock, ArrowRight, Shield, CheckCircle, HelpCircle, GraduationCap, Briefcase, ClipboardList, Globe, ArrowLeft, Mail, KeyRound, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { User, Role } from '../../types';
import { useLanguage } from '../../lib/i18n';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';

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

const mockUsers: Record<Role, User> = {
  admin: {
    id: 'u1',
    name: 'Hendra Wijaya, M.T.',
    email: 'admin@kampus.ac.id',
    role: 'admin',
    phone: '0812-9988-7766',
    department: 'Direktorat Sistem Informasi'
  },
  baak: {
    id: 'u-baak',
    name: 'Ir. Hermawan',
    email: 'baak@kampus.ac.id',
    role: 'baak',
    phone: '0812-1111-2222',
    department: 'Biro Administrasi Akademik'
  },
  bauk: {
    id: 'u-bauk',
    name: 'Siti Aminah, S.E.',
    email: 'bauk@kampus.ac.id',
    role: 'bauk',
    phone: '0812-3333-4444',
    department: 'Biro Administrasi Umum & Keuangan'
  },
  lecturer: {
    id: 'u2',
    name: 'Dr. Budi Rahardjo',
    email: 'budi.rahardjo@kampus.ac.id',
    role: 'lecturer',
    phone: '0811-2233-4455',
    department: 'Teknik Informatika'
  },
  student: {
    id: 'u3',
    name: 'Ahmad Syafiq',
    email: 'ahmad.syafiq@mahasiswa.ac.id',
    role: 'student',
    phone: '0812-3456-7890',
    department: 'Teknik Informatika'
  },
  kaprodi: {
    id: 'u4',
    name: 'Dr. Budi Rahardjo',
    email: 'kaprodi@kampus.ac.id',
    role: 'kaprodi',
    phone: '0813-4567-8901',
    department: 'Teknik Informatika'
  },
  dekan: {
    id: 'u5',
    name: 'Prof. Dr. Ir. Faisal Akbar',
    email: 'dekan@kampus.ac.id',
    role: 'dekan',
    phone: '0812-7777-6666',
    department: 'Fakultas Teknologi Informasi'
  },
  applicant: {
    id: 'u-applicant',
    name: 'Rian Hidayat',
    email: 'calon@mahasiswa.ac.id',
    role: 'applicant',
    phone: '0812-5555-6666',
    department: 'Calon Mahasiswa Baru'
  },
  alumni: {
    id: 'u-alumni',
    name: 'Dewi Lestari, S.Kom',
    email: 'alumni@alumni.ac.id',
    role: 'alumni',
    phone: '0812-7777-8888',
    department: 'Alumni'
  }
};

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const { t, lang, changeLanguage, languages, dir } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [username, setUsername] = useState('ahmad.syafiq@mahasiswa.ac.id');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState<number>(0);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleQuickPrefill = (account: typeof demoAccounts[0]) => {
    setSelectedRole(account.role);
    setUsername(account.username);
    setPassword('password');
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Find the matched user
      let matchedUser: User | null = null;
      
      // Look up credentials
      if (username === 'ahmad.syafiq@mahasiswa.ac.id' || username === '1901001') {
        matchedUser = mockUsers.student;
      } else if (username === 'budi.rahardjo@kampus.ac.id' || username === 'l1') {
        matchedUser = mockUsers.lecturer;
      } else if (username === 'admin@kampus.ac.id' || username === 'admin') {
        matchedUser = mockUsers.admin;
      } else if (username === 'kaprodi@kampus.ac.id' || username === 'kaprodi') {
        matchedUser = mockUsers.kaprodi;
      } else if (username === 'dekan@kampus.ac.id' || username === 'dekan') {
        matchedUser = mockUsers.dekan;
      } else if (username === 'baak@kampus.ac.id' || username === 'baak') {
        matchedUser = mockUsers.baak;
      } else if (username === 'bauk@kampus.ac.id' || username === 'bauk') {
        matchedUser = mockUsers.bauk;
      } else if (username === 'calon@mahasiswa.ac.id' || username === 'calon') {
        matchedUser = mockUsers.applicant;
      } else if (username === 'alumni@alumni.ac.id' || username === 'alumni') {
        matchedUser = mockUsers.alumni;
      } else {
        // Fallback or flexible demo login
        matchedUser = {
          id: 'u-custom',
          name: username.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          email: username,
          role: selectedRole
        };
      }

      setLoading(false);
      
      // Determine redirection route based on user role
      let route = '/';
      if (matchedUser.role === 'student') {
        route = '/siakad/mahasiswa';
      } else if (matchedUser.role === 'lecturer') {
        route = '/siakad/dosen';
      } else if (matchedUser.role === 'admin') {
        route = '/admin';
      } else if (matchedUser.role === 'kaprodi') {
        route = '/siakad/kaprodi';
      } else if (matchedUser.role === 'dekan') {
        route = '/siakad/dekan';
      } else if (matchedUser.role === 'baak') {
        route = '/siakad/baak';
      } else if (matchedUser.role === 'bauk') {
        route = '/siakad/bauk';
      } else if (matchedUser.role === 'applicant') {
        route = '/siakad/calon';
      } else if (matchedUser.role === 'alumni') {
        route = '/siakad/alumni';
      }

      onLoginSuccess(matchedUser, route);
    }, 800);
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
                        setOtpInput('');
                        setNewPassword('');
                        setConfirmPassword('');
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
                      {forgotStep === 1 && (lang === 'id' ? 'Langkah 1/3: Identitas Akun' : 'Step 1/3: Account Identity')}
                      {forgotStep === 2 && (lang === 'id' ? 'Langkah 2/3: Verifikasi Kode OTP' : 'Step 2/3: Verify OTP Code')}
                      {forgotStep === 3 && (lang === 'id' ? 'Langkah 3/3: Buat Kata Sandi Baru' : 'Step 3/3: Create New Password')}
                      {forgotStep === 4 && (lang === 'id' ? 'Selesai: Pembaruan Sukses' : 'Done: Reset Successful')}
                    </p>
                  </div>
                  {forgotStep < 4 && (
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
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((step) => (
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!forgotEmail.trim()) {
                        setForgotError(lang === 'id' ? 'Silakan masukkan email atau nama pengguna Anda.' : 'Please enter your email or username.');
                        return;
                      }
                      setForgotLoading(true);
                      setForgotError('');
                      setTimeout(() => {
                        const otp = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(otp);
                        setForgotStep(2);
                        setForgotLoading(false);
                      }, 1000);
                    }} 
                    className="space-y-4"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === 'id' 
                        ? 'Masukkan alamat email atau nama pengguna SIAKAD Anda. Kami akan mengirimkan kode OTP verifikasi 6 digit secara instan.'
                        : 'Enter your SIAKAD email or username. We will send a 6-digit verification OTP instantly.'
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
                          <span>{lang === 'id' ? 'Kirim Kode OTP' : 'Send OTP Code'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2 Form: Verify OTP */}
                {forgotStep === 2 && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (otpInput.trim() !== generatedOtp) {
                        setForgotError(lang === 'id' ? 'Kode OTP tidak cocok. Silakan periksa kembali.' : 'OTP code does not match. Please check again.');
                        return;
                      }
                      setForgotError('');
                      setForgotLoading(true);
                      setTimeout(() => {
                        setForgotStep(3);
                        setForgotLoading(false);
                      }, 850);
                    }} 
                    className="space-y-4"
                  >
                    {/* Simulated SMS/Email Notification Banner so the user actually gets the code */}
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <div className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
                          {lang === 'id' ? 'Simulasi SMS/Email SIAKAD' : 'SIAKAD Email Simulation'}
                        </div>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 leading-relaxed">
                          {lang === 'id' 
                            ? `Kode verifikasi pemulihan dikirim ke akun Anda: `
                            : `Recovery verification code sent to your account: `
                          }
                          <strong className="text-indigo-900 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded font-mono text-xs ml-1">{generatedOtp}</strong>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === 'id' 
                        ? 'Silakan masukkan kode verifikasi 6 digit yang ditampilkan di atas untuk memverifikasi kepemilikan akun.'
                        : 'Please enter the 6-digit verification code shown above to verify account ownership.'
                      }
                    </p>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 text-center">
                        {lang === 'id' ? 'Masukkan Kode Keamanan' : 'Enter Security Code'}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        className="block w-full max-w-[200px] mx-auto text-center px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xl tracking-[0.4em] bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="000000"
                      />
                    </div>

                    {forgotError && (
                      <div className="flex items-start gap-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        type="submit"
                        disabled={forgotLoading || otpInput.length < 6}
                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {forgotLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>{lang === 'id' ? 'Verifikasi Kode' : 'Verify Code'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                          setGeneratedOtp(newOtp);
                          setForgotError('');
                          setOtpInput('');
                        }}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline text-center py-1 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{lang === 'id' ? 'Kirim Ulang OTP' : 'Resend OTP'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3 Form: New Password */}
                {forgotStep === 3 && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newPassword.length < 6) {
                        setForgotError(lang === 'id' ? 'Kata sandi baru harus minimal 6 karakter.' : 'New password must be at least 6 characters.');
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        setForgotError(lang === 'id' ? 'Konfirmasi kata sandi tidak cocok.' : 'Confirm password does not match.');
                        return;
                      }
                      setForgotError('');
                      setForgotLoading(true);
                      setTimeout(() => {
                        setPassword(newPassword);
                        setUsername(forgotEmail);
                        setForgotStep(4);
                        setForgotLoading(false);
                      }, 1200);
                    }} 
                    className="space-y-4"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === 'id' 
                        ? 'Buat kata sandi baru yang kuat untuk akun Anda. Gunakan minimal 6 karakter kombinasi angka dan huruf.'
                        : 'Create a strong new password for your account. Use at least 6 characters with numbers and letters.'
                      }
                    </p>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                        {lang === 'id' ? 'Kata Sandi Baru' : 'New Password'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                        {lang === 'id' ? 'Konfirmasi Kata Sandi' : 'Confirm Password'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="••••••••"
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
                      disabled={forgotLoading || !newPassword || !confirmPassword}
                      className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{lang === 'id' ? 'Simpan Kata Sandi' : 'Save Password'}</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 4 Form: Success State */}
                {forgotStep === 4 && (
                  <div className="space-y-4 py-2 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-6 w-6 animate-bounce" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === 'id' ? 'Kata Sandi Diperbarui!' : 'Password Updated!'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                        {lang === 'id' 
                          ? 'Kata sandi Anda berhasil diperbarui. Silakan kembali ke form masuk dan masuk dengan kata sandi baru Anda.'
                          : 'Your password has been successfully updated. Please return to the login form and sign in with your new password.'
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(0);
                        setForgotError('');
                        setOtpInput('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/10 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      <span>{lang === 'id' ? 'Kembali ke Form Masuk' : 'Back to Login Form'}</span>
                      <ArrowRight className="w-4 h-4" />
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
