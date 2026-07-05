import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  CheckSquare,
  FileText,
  DollarSign,
  Award,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { User } from '../../types';

// Admin Data
const gpaTrendData = [
  { name: '2020', gpa: 3.25 },
  { name: '2021', gpa: 3.41 },
  { name: '2022', gpa: 3.38 },
  { name: '2023', gpa: 3.52 },
  { name: '2024', gpa: 3.58 },
];

const facultyDistributionData = [
  { name: 'Teknik', count: 1200 },
  { name: 'Ekonomi', count: 950 },
  { name: 'Hukum', count: 680 },
  { name: 'Kedokteran', count: 450 },
  { name: 'Ilkom', count: 820 },
];

// Lecturer Data
const classAverageScores = [
  { name: 'Web Dev', rata: 3.65 },
  { name: 'AI', rata: 3.45 },
  { name: 'RPL', rata: 3.20 },
  { name: 'PBO', rata: 3.80 },
];

const gradingCompletionData = [
  { name: 'Selesai', value: 85 },
  { name: 'Pending', value: 15 },
];
const COLORS = ['#10b981', '#f59e0b'];

// Student Data
const studentSemesterGPAs = [
  { name: 'Smt 1', IPS: 3.40, IPK: 3.40 },
  { name: 'Smt 2', IPS: 3.55, IPK: 3.48 },
  { name: 'Smt 3', IPS: 3.52, IPK: 3.49 },
  { name: 'Smt 4', IPS: 3.65, IPK: 3.53 },
  { name: 'Smt 5', IPS: 3.78, IPK: 3.58 },
];

interface DashboardViewProps {
  user: User;
}

export function DashboardView({ user }: DashboardViewProps) {
  const currentRole = user.role;

  // Render Admin Dashboard
  const renderAdminDashboard = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Mahasiswa Aktif</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">14,285</div>
                  <div className="ml-2 flex items-baseline text-xs font-semibold text-green-600 dark:text-green-400">
                    <TrendingUp className="self-center flex-shrink-0 h-3 w-3 mr-0.5" />
                    +4.5%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3">
              <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">IPK Rata-Rata</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">3.42</div>
                  <div className="ml-2 flex items-baseline text-xs font-semibold text-green-600 dark:text-green-400">
                    <TrendingUp className="self-center flex-shrink-0 h-3 w-3 mr-0.5" />
                    +0.12
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Kelas Berjalan</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">842</div>
                  <div className="ml-2 text-xs text-slate-500">Kelas</div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Risiko Drop Out</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">124</div>
                  <div className="ml-2 text-xs text-red-500 dark:text-red-400 font-semibold">
                    Kritis
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Tren IPK Rata-Rata Universitas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpaTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark-stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis domain={[2.5, 4.0]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorGpa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Distribusi Mahasiswa per Fakultas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyDistributionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark-stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Aktivitas Administrasi Terbaru</h3>
        </div>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {[
            { id: 1, action: 'Pembayaran UKT Masuk', user: 'Faisal Akbar (Informatika)', time: '5 menit yang lalu', status: 'Success' },
            { id: 2, action: 'Pemutakhiran Kalender Akademik', user: 'Admin Akademik', time: '1 jam yang lalu', status: 'Updated' },
            { id: 3, action: 'Sinkronisasi Data PDDIKTI', user: 'Sistem Sinkronisasi', time: '3 jam yang lalu', status: 'Success' },
            { id: 4, action: 'Pengaduan Layanan KRS', user: 'Dian Safitri (Sistem Informasi)', time: '5 jam yang lalu', status: 'Reviewed' },
          ].map((activity) => (
            <li key={activity.id} className="px-6 py-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-slate-500" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activity.user}</p>
              </div>
              <div className="ml-4 flex flex-col items-end">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activity.status === 'Success' ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400' : 
                  activity.status === 'Updated' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400' : 
                  'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400'
                }`}>
                  {activity.status}
                </span>
                <span className="text-xs text-slate-400 mt-1">{activity.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  // Render Lecturer Dashboard
  const renderLecturerDashboard = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Kelas Diampu</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">4 Kelas</div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Mahasiswa Wali</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">38 Mhs</div>
                  <div className="ml-2 flex items-baseline text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    5 KRS pending
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
              <CheckSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Kehadiran Mengajar</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
                  <div className="ml-2 text-xs text-slate-500">14/14 Tatap Muka</div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
              <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Tugas Belum Dinilai</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">18 Berkas</div>
                  <div className="ml-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    Smt 5
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lecturer Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Rata-Rata Nilai Kelas yang Diampu (IP)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAverageScores} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark-stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 4.0]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#fff' }}
                />
                <Bar dataKey="rata" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Status Penilaian Tugas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Penyelesaian grading tugas mahasiswa bimbingan & kelas.</p>
          </div>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradingCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gradingCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">85%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Selesai</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 bg-emerald-500 rounded-full" />
              Sudah Dinilai (85%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 bg-amber-500 rounded-full" />
              Belum (15%)
            </span>
          </div>
        </motion.div>
      </div>

      {/* Schedules list */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Jadwal Mengajar Hari Ini</h3>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Rabu, 24 Juni 2026
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { id: 1, code: 'IF3110', name: 'Pengembangan Aplikasi Web', class: 'K-01', time: '08:00 - 10:30', room: 'GKU Timur R-202', attendance: '28 / 30 Mahasiswa hadir' },
            { id: 2, code: 'IF3170', name: 'Kecerdasan Buatan', class: 'K-03', time: '13:00 - 15:30', room: 'Lab Komputasi R-105', attendance: 'Sesi Belum Dimulai' },
          ].map((sched) => (
            <div key={sched.id} className="px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 px-2 py-0.5 rounded">
                    {sched.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 px-2 py-0.5 rounded">
                    {sched.class}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{sched.name}</h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4 mt-1">
                  <span>Pukul: {sched.time}</span>
                  <span>Ruang: {sched.room}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  sched.attendance.includes('hadir') 
                    ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {sched.attendance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Render Student Dashboard
  const renderStudentDashboard = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3">
              <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">IPK Kumulatif</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">3.58</div>
                  <div className="ml-2 flex items-baseline text-xs font-semibold text-green-600 dark:text-green-400">
                    <TrendingUp className="self-center flex-shrink-0 h-3 w-3 mr-0.5" />
                    +0.05
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">SKS Diambil</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">20 SKS</div>
                  <div className="ml-2 text-xs text-slate-500">Maks: 24 SKS</div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Presensi Kuliah</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">96.4%</div>
                  <div className="ml-2 text-xs text-slate-500">Aman (&gt;80%)</div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Tagihan UKT</dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">Lunas</div>
                  <div className="ml-2 text-[10px] text-slate-400">Ganjil 2023/24</div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Student Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Tren Indeks Prestasi Semester (IPS)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentSemesterGPAs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudentGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark-stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis domain={[3.0, 4.0]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="IPS" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudentGpa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Status Studi & SKS</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total sebaran SKS lulus berdasarkan rumpun kuliah.</p>
          </div>
          <div className="space-y-4 my-auto">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">SKS Inti Informatika</span>
                <span className="text-slate-950 dark:text-white">64 / 90 SKS</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '71%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Matakuliah Pilihan</span>
                <span className="text-slate-950 dark:text-white">12 / 20 SKS</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Rumpun Umum / MPK</span>
                <span className="text-slate-950 dark:text-white">8 / 10 SKS</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
            Total SKS Terkumpul: 84 SKS
          </div>
        </motion.div>
      </div>

      {/* Course List for Current Semester */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Rencana Kuliah Semester Ini (Ganjil 2023/24)</h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
            Total Terpilih: 5 Mata Kuliah • 14 SKS
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { id: 1, code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, lecturer: 'Dr. Hendra Wijaya', schedule: 'Senin, 08:00 - 10:30' },
            { id: 2, code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, lecturer: 'Dra. Sri Hartati', schedule: 'Selasa, 10:30 - 13:00' },
            { id: 3, code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, lecturer: 'Dr. Budi Rahardjo', schedule: 'Rabu, 13:00 - 15:30' },
            { id: 4, code: 'IF3140', name: 'Manajemen Basis Data', sks: 3, lecturer: 'Wawan Kuswara, M.T.', schedule: 'Kamis, 08:00 - 10:30' },
            { id: 5, code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, lecturer: 'Tim MPK', schedule: 'Jumat, 14:00 - 15:40' },
          ].map((course) => (
            <div key={course.id} className="px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 px-2 py-0.5 rounded">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{course.sks} SKS</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{course.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dosen: {course.lecturer}</p>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Jadwal: {course.schedule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Akademik</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Selamat datang kembali, <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>. Peran: <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">{user.role === 'admin' ? 'Staf Akademik' : user.role === 'lecturer' ? 'Dosen' : 'Mahasiswa'}</span>.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
            <option>Semester Ganjil 23/24</option>
            <option>Semester Genap 22/23</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            Generate Report
          </button>
        </div>
      </div>

      {/* Render matching Role Dashboard */}
      {currentRole === 'admin' && renderAdminDashboard()}
      {currentRole === 'lecturer' && renderLecturerDashboard()}
      {currentRole === 'student' && renderStudentDashboard()}
    </div>
  );
}
