import React, { useState, useEffect } from 'react';
import {
  Layers,
  Network,
  Award,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  Cpu,
  Send,
  Key,
  FileCheck,
  MessageSquare,
  Eye,
  Check,
  X,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  FileText,
  Mail,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Lock,
  Compass,
  HardDrive,
  BarChart,
  UserCheck,
  CreditCard,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  ThumbsUp,
  Globe,
  Activity,
  Database,
  BookOpen,
  Zap,
  ShoppingBag,
  Share2,
  DollarSign
} from 'lucide-react';

export function EnterpriseControlSuite() {
  const [activeTab, setActiveTab] = useState<string>('multi-kampus');

  // List of 8 Enterprise Features
  const featuresList = [
    { id: 'multi-kampus', label: '1. Multi-Kampus & SSO', icon: Globe, desc: 'Hierarki Kampus Cabang & Federasi SSO' },
    { id: 'interop', label: '2. API-First & ESB', icon: Network, desc: 'API Gateway, ESB Billing & Webhooks' },
    { id: 'analytics-ai', label: '3. AI DSS & Analitik', icon: Cpu, desc: 'AI Scheduler & Prediksi Dropout ML' },
    { id: 'dosen-bkd', label: '4. BKD & Tridharma', icon: BarChart, desc: 'Pencatatan SINTA & Remunerasi Otomatis' },
    { id: 'bpm-rpa', label: '5. BPM & RPA Otomatisasi', icon: Layers, desc: 'Workflow Cuti, E-Sign PSrE & RPA' },
    { id: 'audit-mutu', label: '6. Audit, Mutu & GDPR', icon: ShieldAlert, desc: 'Audit Trail, Borang Akreditasi & PDP' },
    { id: 'scale-ha', label: '7. Skalabilitas & PITR', icon: Database, desc: 'Load Balancing, Failover & PITR' },
    { id: 'lifelong', label: '8. Lifelong & Kursus RPL', icon: ShoppingBag, desc: 'Program RPL, E-Commerce & Alumni' }
  ];

  // -------------------------------------------------------------
  // STATE DEFINITIONS FOR THE 8 ENTERPRISE FEATURES
  // -------------------------------------------------------------

  // Feature 1: Multi-Kampus & SSO
  const [selectedBranch, setSelectedBranch] = useState('Kampus-Pusat');
  const [ssoSearch, setSsoSearch] = useState('');
  const [ssoLogs, setSsoLogs] = useState([
    { username: 'budi.hartono@univ.ac.id', role: 'Dosen', authType: 'Azure AD', time: '10 detik lalu', status: 'SUKSES', ip: '10.23.4.112' },
    { username: 'clara.bella@student.univ.ac.id', role: 'Mahasiswa', authType: 'LDAP', time: '1 menit lalu', status: 'SUKSES', ip: '180.252.1.99' },
    { username: 'hacker@anonymous.org', role: 'Unknown', authType: 'LDAP', time: '5 menit lalu', status: 'GAGAL (Wrong Password)', ip: '198.51.100.4' }
  ]);
  const [ssoUsernameInput, setSsoUsernameInput] = useState('');
  const [ssoRoleInput, setSsoRoleInput] = useState('Mahasiswa');

  // Feature 2: API-First & ESB Gateway
  const [rateLimit, setRateLimit] = useState(150);
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState('GET /api/v1/mahasiswa');
  const [apiResponseStatus, setApiResponseStatus] = useState<string | null>(null);
  const [apiResponsePayload, setApiResponsePayload] = useState<string | null>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [esbSyncing, setEsbSyncing] = useState<string | null>(null);

  // Feature 3: AI DSS & Scheduling
  // Drill-down Executive Dashboard
  const [drillLevel, setDrillLevel] = useState<'universitas' | 'kampus' | 'fakultas' | 'prodi' | 'mahasiswa'>('universitas');
  const [drillPath, setDrillPath] = useState<string[]>([]);
  // Dropout Prediction ML states
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('All');
  const [riskStudents, setRiskStudents] = useState([
    { nim: '10121014', name: 'Andi Wijaya', gpa: 2.1, absent: '35%', delayPayment: '2 Bulan', dropoutRisk: 88, status: 'Kritis' },
    { nim: '10121088', name: 'Nadia Putri', gpa: 2.7, absent: '15%', delayPayment: '0 Bulan', dropoutRisk: 42, status: 'Waspada' },
    { nim: '10121102', name: 'Bagus Pratoso', gpa: 1.8, absent: '40%', delayPayment: '3 Bulan', dropoutRisk: 95, status: 'Kritis' },
    { nim: '10121115', name: 'Eka Lestari', gpa: 3.4, absent: '2%', delayPayment: '0 Bulan', dropoutRisk: 5, status: 'Aman' }
  ]);
  // Optimizer scheduler simulation state
  const [optimizerStatus, setOptimizerStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [optimizerProgress, setOptimizerProgress] = useState(0);
  const [optimizerMetrics, setOptimizerMetrics] = useState({ solved: 0, conflicts: 0, iterations: 0 });

  // Feature 4: BKD & Tridharma Dosen
  const [bkdSearch, setBkdSearch] = useState('');
  const [bkdSyncing, setBkdSyncing] = useState(false);
  const [dosenList, setDosenList] = useState([
    { nidn: '0421098501', name: 'Dr. Hendra Wijaya', jabfung: 'Lektor Kepala', SKS_Mengajar: 12, SKS_Penelitian: 4, SKS_Abdimas: 3, totalSKS: 19, status: 'MEMENUHI (12-16 SKS)', remunerasi: 'Rp 4,500,000' },
    { nidn: '0414117702', name: 'Dra. Sri Hartati, M.T.', jabfung: 'Lektor', SKS_Mengajar: 8, SKS_Penelitian: 2, SKS_Abdimas: 2, totalSKS: 12, status: 'MEMENUHI (12-16 SKS)', remunerasi: 'Rp 0' },
    { nidn: '0408048103', name: 'Wawan Kuswara, M.T.', jabfung: 'Asisten Ahli', SKS_Mengajar: 16, SKS_Penelitian: 6, SKS_Abdimas: 1, totalSKS: 23, status: 'KELEBIHAN BEBAN (+7 SKS)', remunerasi: 'Rp 5,250,000' }
  ]);

  // Feature 5: BPM & RPA
  const [bpmWorkflowType, setBpmWorkflowType] = useState('Cuti Akademik');
  const [bpmSteps, setBpmSteps] = useState([
    { id: 1, name: 'Dosen Wali (PA)', status: 'Approved', note: 'Mahasiswa sudah melunasi UKT sebelum cuti', date: '2026-06-23' },
    { id: 2, name: 'Kaprodi', status: 'Approved', note: 'Kuata cuti prodi mencukupi', date: '2026-06-24' },
    { id: 3, name: 'Dekan Fakultas', status: 'Pending', note: 'Menunggu tanda tangan elektronik', date: '-' },
    { id: 4, name: 'Wakil Rektor 1', status: 'Locked', note: 'Menunggu approval Dekan', date: '-' }
  ]);
  const [signatureWatermark, setSignatureWatermark] = useState<string | null>(null);
  const [ttePasscode, setTtePasscode] = useState('');
  const [rpaLogs, setRpaLogs] = useState<string[]>([
    'RPA System initialized successfully.',
    'System Scheduler check at 22:00: Automatic billing generated for 4,820 students.',
    'Checking KRS payment confirmation: Locked KRS for 12 outstanding bills.'
  ]);

  // Feature 6: Audit, Borang & GDPR
  const [auditLogs, setAuditLogs] = useState([
    { id: 'AUD-998', actor: 'Hendra Wijaya (Admin)', action: 'Ubah Nilai Pemrograman Web - NIM 10123001', oldVal: 'C', newVal: 'A', ip: '192.168.1.125', time: '2026-06-25 14:15:00' },
    { id: 'AUD-997', actor: 'Ahmad Dahlan (Kaprodi)', action: 'Update Kurikulum Konsentrasi AI 2026', oldVal: 'Kurikulum V1', newVal: 'Kurikulum V2 AI', ip: '10.233.15.91', time: '2026-06-25 11:30:22' },
    { id: 'AUD-996', actor: 'Rektorat (Biro Keuangan)', action: 'Override Status UKT Penangguhan - NIM 10123045', oldVal: 'Belum Bayar', newVal: 'Tangguh (Disetujui)', ip: '10.0.4.88', time: '2026-06-25 09:12:05' }
  ]);
  const [gdprConsent, setGdprConsent] = useState(true);
  const [anonymizedAlumniCount, setAnonymizedAlumniCount] = useState(0);

  // Feature 7: HA, Failover & PITR
  const [dcAStatus, setDcAStatus] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [dcBStatus, setDcBStatus] = useState<'ONLINE' | 'STANDBY'>('STANDBY');
  const [loadBalancingStats, setLoadBalancingStats] = useState({ requestsPerSec: 1420, activeReplicas: 3, cpuUtilization: 42 });
  const [stressTestingActive, setStressTestingActive] = useState(false);
  const [pitrTimestamp, setPitrTimestamp] = useState('2026-06-25 22:30:00');

  // JWT Secret management states
  const [jwtSecrets, setJwtSecrets] = useState<any[]>([]);
  const [generatedKey, setGeneratedKey] = useState('');
  const [loadingSecrets, setLoadingSecrets] = useState(false);
  const [rotatingSecrets, setRotatingSecrets] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  
  // Password reset simulation states
  const [resetEmail, setResetEmail] = useState('ahmad.syafiq@mahasiswa.ac.id');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('MahasiswaSiaSecure2026!');
  const [resetStatus, setResetStatus] = useState('');
  const [resetError, setResetError] = useState('');

  const fetchJwtSecretsStatus = async () => {
    setLoadingSecrets(true);
    try {
      const res = await fetch('/api/enterprise/jwt-secrets-status');
      const data = await res.json();
      if (data.status === 'success') {
        setJwtSecrets(data.secrets);
      }
    } catch (err) {
      console.error("Gagal memfetch status JWT:", err);
    } finally {
      setLoadingSecrets(false);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await fetch('/api/enterprise/generate-key', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setGeneratedKey(data.key);
        setCopiedKey(false);
      }
    } catch (err) {
      console.error("Gagal menghasilkan kunci:", err);
    }
  };

  const handleRotateSecrets = async () => {
    if (!window.confirm("PENTING: Apakah Anda yakin ingin memaksa rotasi semua kunci JWT seumur hidup? Sesi semua pengguna yang sedang login akan langsung dibatalkan (Logged Out) demi memitigasi kebocoran.")) {
      return;
    }
    setRotatingSecrets(true);
    try {
      const res = await fetch('/api/enterprise/rotate-secrets', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        alert(data.message);
        await fetchJwtSecretsStatus();
      }
    } catch (err) {
      console.error("Gagal melakukan rotasi kunci:", err);
    } finally {
      setRotatingSecrets(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    setResetStatus('');
    setResetError('');
    try {
      const res = await fetch('/api/auth/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setResetStatus(data.message);
        if (data.debugToken) {
          setResetToken(data.debugToken);
        }
      } else {
        setResetError(data.message || 'Gagal merequest reset password.');
      }
    } catch (err) {
      setResetError('Gagal menghubungi server.');
    }
  };

  const handleConfirmPasswordReset = async () => {
    setResetStatus('');
    setResetError('');
    try {
      const res = await fetch('/api/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setResetStatus(data.message);
        setResetToken(''); // spent
      } else {
        setResetError(data.message || 'Gagal menyetel ulang kata sandi.');
      }
    } catch (err) {
      setResetError('Gagal menghubungi server.');
    }
  };

  // Fetch secrets status on mount when active tab is scale-ha
  useEffect(() => {
    if (activeTab === 'scale-ha') {
      fetchJwtSecretsStatus();
    }
  }, [activeTab]);

  // Feature 8: RPL & Lifelong Portal
  const [selectedCourseRpl, setSelectedCourseRpl] = useState('Pemrograman Web Lanjut');
  const [rplYearsExp, setRplYearsExp] = useState(4);
  const [rplStatus, setRplStatus] = useState<string | null>(null);
  const [alumniSearchNIM, setAlumniSearchNIM] = useState('');
  const [alumniVerifyResult, setAlumniVerifyResult] = useState<any>(null);

  // Run dynamic stress test simulation loop
  useEffect(() => {
    let interval: any = null;
    if (stressTestingActive) {
      interval = setInterval(() => {
        setLoadBalancingStats(prev => ({
          requestsPerSec: Math.floor(4000 + Math.random() * 1500),
          activeReplicas: prev.requestsPerSec > 4800 ? 8 : 5,
          cpuUtilization: Math.floor(75 + Math.random() * 18)
        }));
      }, 1000);
    } else {
      setLoadBalancingStats({ requestsPerSec: 120 + Math.floor(Math.random() * 80), activeReplicas: 2, cpuUtilization: 14 });
    }
    return () => clearInterval(interval);
  }, [stressTestingActive]);

  // Handle SSO Authenticate simulator
  const handleSsoAuthTest = () => {
    if (!ssoUsernameInput) return;
    const newLog = {
      username: ssoUsernameInput,
      role: ssoRoleInput,
      authType: 'Federated SSO (Azure AD)',
      time: 'Baru saja',
      status: 'SUKSES',
      ip: '192.168.100.5'
    };
    setSsoLogs([newLog, ...ssoLogs]);
    setSsoUsernameInput('');
  };

  // Simulate API Gateway call
  const triggerApiEndpointTest = () => {
    setApiResponseStatus('Loading...');
    setApiResponsePayload(null);
    setTimeout(() => {
      let payload = '';
      if (selectedApiEndpoint.includes('mahasiswa')) {
        payload = JSON.stringify([
          { nim: '10123001', nama: 'Budi Hartono', prodi: 'Teknik Informatika', ipk: 3.82 },
          { nim: '10123045', nama: 'Siti Aminah', prodi: 'Sistem Informasi', ipk: 3.55 }
        ], null, 2);
      } else if (selectedApiEndpoint.includes('dosen')) {
        payload = JSON.stringify([
          { nidn: '0421098501', nama: 'Dr. Hendra Wijaya', status: 'Aktif', bkd: 'Memenuhi' }
        ], null, 2);
      } else {
        payload = JSON.stringify({
          status: 'RECONCILED',
          amount_received_idr: 4500000000,
          channels: { va_bni: 420, qris: 152, indomaret: 12 }
        }, null, 2);
      }
      setApiResponseStatus('200 OK');
      setApiResponsePayload(payload);
      setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] CALL ${selectedApiEndpoint} -> 200 OK`, ...prev]);
    }, 1000);
  };

  // Simulate ESB Sync Service
  const runEsbSyncSimulation = (serviceName: string) => {
    setEsbSyncing(serviceName);
    setTimeout(() => {
      setEsbSyncing(null);
      alert(`Sinkronisasi Dua Arah ESB [${serviceName}] Berhasil Selesai & Reconciled.`);
    }, 1500);
  };

  // Simulate AI Scheduling Optimasi
  const runAiSchedulerOptimasi = () => {
    setOptimizerStatus('running');
    setOptimizerProgress(0);
    setOptimizerMetrics({ solved: 0, conflicts: 120, iterations: 0 });

    const interval = setInterval(() => {
      setOptimizerProgress(prev => {
        const next = prev + 10;
        setOptimizerMetrics(m => ({
          solved: Math.floor((next / 100) * 412),
          conflicts: Math.max(0, 120 - Math.floor((next / 100) * 120) - (Math.random() > 0.7 ? 3 : 0)),
          iterations: m.iterations + 15
        }));
        if (next >= 100) {
          clearInterval(interval);
          setOptimizerStatus('completed');
        }
        return next;
      });
    }, 300);
  };

  // Simulate Tridharma SINTA Sync
  const runSintaSync = () => {
    setBkdSyncing(true);
    setTimeout(() => {
      setBkdSyncing(false);
      setDosenList(prev => prev.map(d => ({
        ...d,
        SKS_Penelitian: d.SKS_Penelitian + 2,
        totalSKS: d.totalSKS + 2
      })));
      alert('Sinkronisasi API SINTA & Scopus Berhasil. Mengimpor 4 Jurnal Internasional Terindeks Baru.');
    }, 1500);
  };

  // Simulating sign document certified
  const handleBpmSignDocument = () => {
    if (!ttePasscode) {
      alert('Masukkan Passcode TTE Certified Anda terlebih dahulu.');
      return;
    }
    setSignatureWatermark(`✓ Certified by BSrE ID #${Math.floor(100000 + Math.random() * 900000)}`);
    setBpmSteps(prev => prev.map(step => step.id === 3 ? { ...step, status: 'Approved', date: 'Hari ini', note: 'Ditandatangani secara digital via PSrE Certificate' } : step));
  };

  // Rollback Audit Trail record
  const handleRollbackAudit = (auditId: string) => {
    alert(`Rollback Berhasil untuk ID ${auditId}. Data dipulihkan ke versi sebelumnya secara transparan.`);
    setAuditLogs(prev => prev.filter(log => log.id !== auditId));
  };

  // Anonymize Alumni
  const handleAnonymizeAlumni = () => {
    const confirmation = window.confirm('Apakah Anda yakin ingin menganonimkan data alumni angkatan di bawah 2018 demi kepatuhan UU PDP (Retensi 8 Tahun)? Tindakan ini irreversible.');
    if (confirmation) {
      setAnonymizedAlumniCount(prev => prev + 1420);
      alert('Data pribadi alumni (Email, No HP, Alamat) berhasil didelete & digantikan hash anonim.');
    }
  };

  // Simulate RPL Check
  const handleRplEvaluationCheck = () => {
    const successRate = rplYearsExp * 25;
    if (successRate >= 75) {
      setRplStatus(`MEMENUHI SYARAT! Rekognisi ${selectedCourseRpl} disetujui (Konversi SKS Penuh).`);
    } else {
      setRplStatus(`Kekurangan Portofolio Pengalaman Kerja. Direkomendasikan mengambil kelas matrikulasi.`);
    }
  };

  // Simulate Alumni Transcript check
  const handleAlumniSearchNIM = () => {
    if (!alumniSearchNIM) return;
    setAlumniVerifyResult({
      nama: 'Wira Kusuma',
      prodi: 'Teknik Elektro',
      ipk: 3.65,
      graduatedYear: '2022',
      statusVerified: true,
      certifiedDocHash: 'SHA-256: 7f81a28cb901f44e135bc...'
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col lg:flex-row h-auto min-h-[700px] text-slate-800 dark:text-slate-200">
      {/* Sidebar Tabs */}
      <div className="lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 p-6 flex flex-col gap-1.5 shrink-0">
        <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">SIAKAD Enterprise</h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold block leading-normal">Premium Enterprise Architecture Controls</span>
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-1">
          {featuresList.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-start gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <div className="space-y-0.5">
                  <span className={`text-xs block ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200 font-extrabold'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[10px] block font-medium leading-normal ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Feature Content Container */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/25">
        
        {/* TAB 1: MULTI KAMPUS & SSO */}
        {activeTab === 'multi-kampus' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 1 &bull; Hirarki Multi-Kampus & SSO</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Arsitektur Multi-Kampus &amp; Federasi SSO</h3>
              <p className="text-xs text-slate-500">Mengelola hirarki operasional dari Kampus Pusat, Cabang, hingga Program Kelas Internasional terfederasi.</p>
            </div>

            {/* Organizaton Hierarchy Tree */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">1. Manajemen Hirarki Organisasi Kompleks</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Kampus-Pusat', 'Kampus-Bandung-Cabang', 'Kampus-Virtual-Internasional'].map((branch) => (
                  <button
                    key={branch}
                    onClick={() => setSelectedBranch(branch)}
                    className={`p-4 border text-left rounded-2xl cursor-pointer transition-all ${
                      selectedBranch === branch
                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
                        : 'border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-black text-slate-800 dark:text-white">{branch.replace(/-/g, ' ')}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">Punya kalender akademik khusus, skema UKT tersendiri, dan otonomi kebijakan kurikulum.</p>
                  </button>
                ))}
              </div>

              {/* Dynamic Policy details for selected branch */}
              <div className="p-4 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl space-y-2.5">
                <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block">Aturan Spesifik: {selectedBranch.replace(/-/g, ' ')}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">Batas Maks SKS:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">{selectedBranch === 'Kampus-Virtual-Internasional' ? '24 SKS (Double Degree Matched)' : '24 SKS (Regular limits)'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">Kalender UTS:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">{selectedBranch === 'Kampus-Bandung-Cabang' ? '12 - 24 Okt 2026' : '05 - 17 Okt 2026'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">Kebijakan Cuti Akademik:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">{selectedBranch === 'Kampus-Virtual-Internasional' ? 'Tidak diizinkan di semester awal' : 'Diizinkan dengan approval PA'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SSO & Identity Federation Module */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">2. SSO &amp; Federasi Identitas (Azure AD &amp; LDAP)</h5>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold">LDAP/AD INTEGRATED</span>
              </div>
              <p className="text-xs text-slate-400">Satu akun kredensial terfederasi untuk SIAKAD, Perpustakaan, E-Learning Moodle, dan Microsoft 365.</p>

              {/* Simulation input form */}
              <div className="flex flex-col sm:flex-row gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="Masukkan email kampus (contoh: wawan@univ.ac.id)"
                  value={ssoUsernameInput}
                  onChange={(e) => setSsoUsernameInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
                <select
                  value={ssoRoleInput}
                  onChange={(e) => setSsoRoleInput(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                >
                  <option value="Dosen">Dosen</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Biro IT">Biro IT</option>
                </select>
                <button
                  onClick={handleSsoAuthTest}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shrink-0"
                >
                  Simulasikan Login SSO
                </button>
              </div>

              {/* Table logs */}
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold">
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Protokol SSO</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {ssoLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-950/20">
                        <td className="p-3 text-slate-800 dark:text-slate-200">{log.username}</td>
                        <td className="p-3">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-bold">{log.role}</span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-500">{log.authType}</td>
                        <td className="p-3 text-slate-400 text-[10px]">{log.time}</td>
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{log.ip}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-black uppercase ${log.status.includes('SUKSES') ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTEROPERABILITAS & API-FIRST */}
        {activeTab === 'interop' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 2 &bull; API Gateway & ESB Gateway</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">API-First Platform &amp; Enterprise Service Bus (ESB)</h3>
              <p className="text-xs text-slate-500">Integrasi dua arah terstandarisasi dengan FinTech, HRIS Kepegawaian, Perpustakaan, dan PDDIKTI Feeder Kemendikbud.</p>
            </div>

            {/* ESB Reconcile Area */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">1. Integrasi ESB Dua Arah</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { name: 'HRIS Kepegawaian', desc: 'Sync remunerasi dosen berdasarkan jam SKS mengajar riil', icon: Users },
                  { name: 'Finance & Bank Billing', desc: 'Auto rekonsiliasi UKT & Virtual Account Multi-Channel', icon: CreditCard },
                  { name: 'Perpustakaan & Asrama', desc: 'Cek validasi bebas tunggakan & kelayakan wisuda', icon: BookOpen },
                  { name: 'Feeder PDDIKTI', desc: 'Auto sinkronisasi pelaporan berkala tanpa input manual', icon: Network }
                ].map((esb) => (
                  <div key={esb.name} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-indigo-500">
                        <esb.icon className="w-4 h-4" />
                        <span className="text-xs font-black text-slate-800 dark:text-white">{esb.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{esb.desc}</p>
                    </div>
                    <button
                      onClick={() => runEsbSyncSimulation(esb.name)}
                      disabled={esbSyncing !== null}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-[10px] font-black rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      {esbSyncing === esb.name ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      Sync Real-time
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* API Sandbox Documentation Playground */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">2. API Gateway Sandbox Playground (Swagger Mock)</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Rate Limiting Token:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="50"
                        max="500"
                        value={rateLimit}
                        onChange={(e) => setRateLimit(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{rateLimit} req/min</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Pilih Endpoint Rest-API:</label>
                    <select
                      value={selectedApiEndpoint}
                      onChange={(e) => setSelectedApiEndpoint(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                    >
                      <option value="GET /api/v1/mahasiswa">GET /api/v1/mahasiswa (Daftar Mahasiswa)</option>
                      <option value="GET /api/v1/dosen">GET /api/v1/dosen (Data Kepegawaian Dosen)</option>
                      <option value="POST /api/v1/finance/reconcile">POST /api/v1/finance/reconcile (Invoice Reconciled)</option>
                    </select>
                  </div>

                  <button
                    onClick={triggerApiEndpointTest}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Simulasikan API Request
                  </button>
                </div>

                <div className="md:col-span-7 bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-3 max-h-56">
                  <div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                      <span className="text-[10px] font-bold text-slate-500 font-mono">Gateway Response Header</span>
                      {apiResponseStatus && (
                        <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${
                          apiResponseStatus.includes('200') ? 'bg-emerald-950 text-emerald-400' : 'text-amber-500'
                        }`}>
                          {apiResponseStatus}
                        </span>
                      )}
                    </div>
                    <pre className="text-[10px] font-mono text-indigo-300 overflow-y-auto max-h-36 custom-scrollbar whitespace-pre-wrap">
                      {apiResponsePayload || '// Klik Simulasikan API Request untuk melihat payload JSON real-time...'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALITIK & AI DECISION SUPPORT */}
        {activeTab === 'analytics-ai' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 3 &bull; AI Decision Support System</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Analitik Prediktif &amp; AI Room Scheduler</h3>
              <p className="text-xs text-slate-500">Mendeteksi dini mahasiswa rentan dropout dengan Machine Learning &amp; melakukan penyusunan ribuan jadwal tanpa bentrok secara otomatis.</p>
            </div>

            {/* AI Scheduling Solver Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">1. AI-Driven Scheduling &amp; Space Optimizer</h5>
                  <p className="text-[10px] text-slate-400">Algoritma optimasi otomatis menyusun mata kuliah, ruangan, waktu dosen, dan kuota dalam 1 klik.</p>
                </div>
                <button
                  onClick={runAiSchedulerOptimasi}
                  disabled={optimizerStatus === 'running'}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  {optimizerStatus === 'running' ? 'Solving conflicts...' : 'Jalankan AI Scheduler Solver'}
                </button>
              </div>

              {optimizerStatus !== 'idle' && (
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Progress AI Optimasi Constraint Satisfaction:</span>
                    <span>{optimizerProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${optimizerProgress}%` }} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center pt-2">
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Jadwal Sukses</span>
                      <span className="text-xs font-black text-indigo-600 font-mono">{optimizerMetrics.solved} MK</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Bentrok Tersisa</span>
                      <span className="text-xs font-black text-rose-500 font-mono">{optimizerMetrics.conflicts} Bentrok</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Iterasi Algoritma</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 font-mono">{optimizerMetrics.iterations}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ML Dropout Prediction */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">2. ML Prediksi Masa Studi &amp; Risiko Dropout</h5>
                <div className="flex gap-1">
                  {['All', 'Kritis', 'Waspada', 'Aman'].map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setSelectedRiskFilter(risk)}
                      className={`px-2.5 py-1 text-[10px] font-black rounded-lg cursor-pointer ${
                        selectedRiskFilter === risk
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold">
                      <th className="p-3">NIM</th>
                      <th className="p-3">Nama Mahasiswa</th>
                      <th className="p-3 text-center">IPK Terakhir</th>
                      <th className="p-3 text-center">Presensi Kelas</th>
                      <th className="p-3 text-center">Tunggakan UKT</th>
                      <th className="p-3">ML Risk Score (Dropout)</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {riskStudents
                      .filter(st => selectedRiskFilter === 'All' || st.status === selectedRiskFilter)
                      .map((st) => (
                        <tr key={st.nim} className="hover:bg-slate-50/60 dark:hover:bg-slate-950/20">
                          <td className="p-3 font-mono">{st.nim}</td>
                          <td className="p-3 text-slate-900 dark:text-white font-extrabold">{st.name}</td>
                          <td className="p-3 text-center font-mono">{st.gpa.toFixed(2)}</td>
                          <td className="p-3 text-center font-mono text-rose-500">{st.absent}</td>
                          <td className="p-3 text-center text-slate-500">{st.delayPayment}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                                <div className={`h-full rounded-full ${
                                  st.dropoutRisk > 80 ? 'bg-rose-500' : st.dropoutRisk > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} style={{ width: `${st.dropoutRisk}%` }} />
                              </div>
                              <span className="font-mono font-bold text-[10px]">{st.dropoutRisk}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => alert(`Sistem secara otomatis mengirim email reminder & notifikasi Telegram ke Dosen Wali mahasiswa ${st.name} untuk pendampingan.`)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black rounded-lg cursor-pointer"
                            >
                              Kirim Alert ke PA
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Executive Dashboard with Drill-Down */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">3. Executive Dashboard Drill-Down (Rektorat View)</h5>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => { setDrillLevel('universitas'); setDrillPath([]); }}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Universitas
                </button>
                {drillPath.map((path, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <button
                      onClick={() => {
                        const newPath = drillPath.slice(0, idx + 1);
                        setDrillPath(newPath);
                        if (idx === 0) setDrillLevel('kampus');
                        if (idx === 1) setDrillLevel('fakultas');
                        if (idx === 2) setDrillLevel('prodi');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      {path}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Drill content */}
              <div className="p-5 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl">
                {drillLevel === 'universitas' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Pilih Kampus Cabang untuk analisis mendalam:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Kampus Pusat (Jakarta)', 'Kampus Bandung Cabang', 'Kampus Surabaya Cabang'].map((kampus) => (
                        <button
                          key={kampus}
                          onClick={() => { setDrillLevel('kampus'); setDrillPath([kampus]); }}
                          className="p-3 bg-white dark:bg-slate-900 hover:border-indigo-500 border border-slate-150 dark:border-slate-800 rounded-xl text-left font-black text-xs cursor-pointer"
                        >
                          {kampus}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {drillLevel === 'kampus' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Pilih Fakultas di {drillPath[0]}:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Fakultas Teknik & Ilmu Komputer', 'Fakultas Ekonomi & Bisnis'].map((fakultas) => (
                        <button
                          key={fakultas}
                          onClick={() => { setDrillLevel('fakultas'); setDrillPath([...drillPath, fakultas]); }}
                          className="p-3 bg-white dark:bg-slate-900 hover:border-indigo-500 border border-slate-150 dark:border-slate-800 rounded-xl text-left font-black text-xs cursor-pointer"
                        >
                          {fakultas}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {drillLevel === 'fakultas' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Pilih Program Studi di {drillPath[1]}:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['S1 Teknik Informatika', 'S1 Sistem Informasi'].map((prodi) => (
                        <button
                          key={prodi}
                          onClick={() => { setDrillLevel('prodi'); setDrillPath([...drillPath, prodi]); }}
                          className="p-3 bg-white dark:bg-slate-900 hover:border-indigo-500 border border-slate-150 dark:border-slate-800 rounded-xl text-left font-black text-xs cursor-pointer"
                        >
                          {prodi}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {drillLevel === 'prodi' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-emerald-600">Daftar Mahasiswa Kritis (IPK &lt; 2.50) pada {drillPath[2]}:</p>
                    <ul className="divide-y divide-slate-100 dark:divide-slate-850">
                      <li className="py-2.5 flex justify-between text-xs font-semibold">
                        <span>Andi Wijaya (NIM 10121014)</span>
                        <span className="font-mono font-black text-rose-500">IPK: 2.10</span>
                      </li>
                      <li className="py-2.5 flex justify-between text-xs font-semibold">
                        <span>Bagus Pratoso (NIM 10121102)</span>
                        <span className="font-mono font-black text-rose-500">IPK: 1.80</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOSEN BKD & TRIDHARMA */}
        {activeTab === 'dosen-bkd' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 4 &bull; Manajemen Kinerja Dosen</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Beban Kerja Dosen (BKD) &amp; Tridharma Terpadu</h3>
              <p className="text-xs text-slate-500">Pencatatan aktivitas mengajar, pengabdian masyarakat, bimbingan mahasiswa, dan sinkronisasi berkala dengan indeks SINTA &amp; Scopus.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Laporan Real-time BKD Semester Berjalan</h5>
                <button
                  onClick={runSintaSync}
                  disabled={bkdSyncing}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${bkdSyncing ? 'animate-spin' : ''}`} />
                  Sync SINTA &amp; Scopus API
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold">
                      <th className="p-3">Nama Dosen</th>
                      <th className="p-3">Jabatan</th>
                      <th className="p-3 text-center">Pendidikan (SKS)</th>
                      <th className="p-3 text-center">Penelitian (SKS)</th>
                      <th className="p-3 text-center">Abdimas (SKS)</th>
                      <th className="p-3 text-center">Total SKS</th>
                      <th className="p-3">Status Syarat BKD</th>
                      <th className="p-3">Remunerasi Insentif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {dosenList.map((dosen) => (
                      <tr key={dosen.nidn} className="hover:bg-slate-50/60 dark:hover:bg-slate-950/20">
                        <td className="p-3 text-slate-900 dark:text-white font-extrabold">{dosen.name}</td>
                        <td className="p-3">{dosen.jabfung}</td>
                        <td className="p-3 text-center font-mono">{dosen.SKS_Mengajar}</td>
                        <td className="p-3 text-center font-mono">{dosen.SKS_Penelitian}</td>
                        <td className="p-3 text-center font-mono">{dosen.SKS_Abdimas}</td>
                        <td className="p-3 text-center font-mono font-black">{dosen.totalSKS} SKS</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            dosen.status.includes('MEMENUHI')
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          }`}>
                            {dosen.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{dosen.remunerasi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAK Alerts */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-3.5 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">E-Portofolio Dosen &amp; Reminder PAK (Kenaikan Pangkat)</h5>
              <div className="p-4 bg-indigo-50/25 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-900 dark:text-white">Reminder Angka Kredit PAK Otomatis</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Berdasarkan perhitungan Tri Dharma otomatis, **Dr. Hendra Wijaya** telah mengumpulkan **380 Angka Kredit (AK)**. Masa berlaku sertifikasi dan pemenuhan syarat usulan Jabatan Fungsional ke **Guru Besar (Profesor)** sudah mencapai 92%. Batas waktu usulan periode ini adalah **15 September 2026**.
                  </p>
                  <button
                    onClick={() => alert('Proposal usulan kenaikan pangkat Anda berhasil digenerate otomatis berdasarkan data e-Portofolio SINTA.')}
                    className="mt-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer"
                  >
                    Draft Ajukan Kenaikan Golongan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BPM & RPA OTOMATISASI */}
        {activeTab === 'bpm-rpa' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 5 &bull; BPM & RPA Automation Suite</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Business Process Management (BPM) &amp; Digital Signature</h3>
              <p className="text-xs text-slate-500">Mengoordinasikan alur pengajuan cuti secara bertingkat dengan Tanda Tangan Elektronik (TTE) Tersertifikasi BSrE.</p>
            </div>

            {/* Interactive BPM Diagram */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">1. BPM Approval Workflow Engine</h5>
                <select
                  value={bpmWorkflowType}
                  onChange={(e) => setBpmWorkflowType(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none"
                >
                  <option value="Cuti Akademik">Alur Cuti Akademik</option>
                  <option value="Pindah Prodi">Alur Pindah Program Studi</option>
                  <option value="Pengajuan MK Baru">Alur Pengusulan Mata Kuliah Baru</option>
                </select>
              </div>

              {/* Steps Flowchart */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {bpmSteps.map((step) => (
                  <div key={step.id} className="relative p-4 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 block font-bold">Langkah #{step.id}</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{step.name}</span>
                      <p className="text-[10px] text-slate-400 leading-normal italic">"{step.note}"</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-850">
                      <span className="text-[9px] font-mono text-slate-400">{step.date}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        step.status === 'Approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : step.status === 'Pending'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Digital Sign Form */}
              <div className="p-4 bg-indigo-50/25 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block">Sertifikasi PSrE Digital Signature (E-Sign)</span>
                    <p className="text-xs text-slate-400">Tanda tangani dokumen persetujuan di atas secara hukum sah dan bersertifikasi.</p>
                  </div>
                  <input
                    type="password"
                    placeholder="Passcode Sertifikat Anda"
                    value={ttePasscode}
                    onChange={(e) => setTtePasscode(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-250 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div className="flex justify-between items-center flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleBpmSignDocument}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    Bubuhi Tanda Tangan Digital (TTE)
                  </button>

                  {signatureWatermark && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black font-mono bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 border border-emerald-100 dark:border-emerald-900/55 rounded-lg flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-500" />
                      {signatureWatermark}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RPA Automation logs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">2. Robotic Process Automation (RPA) Logs</h5>
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl font-mono text-[10px] text-emerald-400 space-y-1">
                {rpaLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-slate-500">[{new Date().toLocaleDateString()}]</span> {log}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setRpaLogs(prev => [...prev, 'RPA Action: Mass billing UKT generation complete.', 'Checking database consistency: ok']);
                    alert('Proses RPA Mass Billing berhasil dijalankan di background.');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black rounded-lg cursor-pointer"
                >
                  Force Run RPA UKT Generation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT TRAIL & MUTU ACCREDITATION */}
        {activeTab === 'audit-mutu' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 6 &bull; Audit Trail, Mutu & GDPR</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Kepatuhan, Audit, dan Manajemen Mutu</h3>
              <p className="text-xs text-slate-500">Comprehensive Audit Trail, visualisasi akreditasi BAN-PT otomatis, dan kepatuhan GDPR/UU Pelindungan Data Pribadi.</p>
            </div>

            {/* Audit Trail Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">1. Comprehensive Audit Trail &amp; Versioning Control</h5>
              <p className="text-[10px] text-slate-400 leading-normal">Mencatat setiap tindakan modifikasi nilai, transkrip, maupun NIM beserta pelacakan IP address pengubah.</p>

              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold">
                      <th className="p-3">ID Log</th>
                      <th className="p-3">Aktor Pengubah</th>
                      <th className="p-3">Aktivitas Modifikasi</th>
                      <th className="p-3 text-center">Nilai Lama</th>
                      <th className="p-3 text-center">Nilai Baru</th>
                      <th className="p-3">Waktu Kejadian</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3 text-right">Recovery Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-950/20 text-slate-700 dark:text-slate-300">
                        <td className="p-3 font-mono text-[10px] text-slate-500">{log.id}</td>
                        <td className="p-3 text-slate-900 dark:text-white font-extrabold">{log.actor}</td>
                        <td className="p-3 text-[11px]">{log.action}</td>
                        <td className="p-3 text-center font-mono font-bold text-rose-500">{log.oldVal}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-500">{log.newVal}</td>
                        <td className="p-3 text-slate-400 text-[10px]">{log.time}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">{log.ip}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleRollbackAudit(log.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 text-[10px] font-black rounded-lg cursor-pointer"
                          >
                            Rollback Versi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GDPR Protection */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">2. GDPR &amp; UU Pelindungan Data Pribadi (PDP) Tools</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-3">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-white block">Manajemen Konsen Cookie &amp; Data Pribadi</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Mahasiswa berhak menyetujui atau menolak penggunaan riwayat aktivitas untuk kepentingan tracking analytics kampus.</p>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="accent-indigo-600 cursor-pointer"
                      id="gdpr_consent_box"
                    />
                    <label htmlFor="gdpr_consent_box" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                      Aktifkan konsen pemrosesan data pelacakan
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white block">Hak Untuk Dihapus &amp; Anonimisasi Alumni</span>
                    <p className="text-[10px] text-slate-400 leading-normal">Bila alumni tidak lagi aktif &gt; 8 tahun, database otomatis menyamarkan identitas pribadi (anonymization) sesuai regulasi.</p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                    <button
                      onClick={handleAnonymizeAlumni}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer"
                    >
                      Jalankan Anonymizer Alumni
                    </button>
                    {anonymizedAlumniCount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600">
                        {anonymizedAlumniCount} Record Anonim
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SKALABILITAS & DISASTER RECOVERY */}
        {activeTab === 'scale-ha' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 7 &bull; High Availability & DR</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Active-Active Deployment &amp; PITR Disaster Recovery</h3>
              <p className="text-xs text-slate-500">Mencegah server down saat ribuan mahasiswa berebut KRS bersamaan dengan simulasi stres test auto-scaling dan Point-In-Time-Recovery database.</p>
            </div>

            {/* KRS War Room Stress Tester */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">1. KRS War Room Stress Test Simulator</h5>
                  <p className="text-[10px] text-slate-400">Simulasikan lonjakan load saat 5,000+ mahasiswa melakukan penginputan KRS serentak.</p>
                </div>
                <button
                  onClick={() => setStressTestingActive(!stressTestingActive)}
                  className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer ${
                    stressTestingActive ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {stressTestingActive ? 'Stop Stress Testing' : 'Simulasikan Beban Ekstrim'}
                </button>
              </div>

              {/* Stress test analytics metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Request Per Second (Ingress)</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{loadBalancingStats.requestsPerSec} Req/s</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Active Pod Replicas Count</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{loadBalancingStats.activeReplicas} Replicas</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">CPU Cluster Utilization</span>
                  <span className={`text-lg font-black font-mono ${loadBalancingStats.cpuUtilization > 70 ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                    {loadBalancingStats.cpuUtilization}%
                  </span>
                </div>
              </div>
            </div>

            {/* Active-Active Failover & Disaster Recovery */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">2. Active-Active Data Center Deployment Failover</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-800 dark:text-white block">Primary Data Center A (Jakarta)</span>
                    <span className="text-[10px] text-slate-400 block">Server Ingress Utama</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    dcAStatus === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {dcAStatus}
                  </span>
                </div>

                <div className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-800 dark:text-white block">Secondary Data Center B (Singapore)</span>
                    <span className="text-[10px] text-slate-400 block">Active-Active Sync Replica</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    {dcBStatus}
                  </span>
                </div>
              </div>

              {/* Simulation buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    setDcAStatus('OFFLINE');
                    setDcBStatus('ONLINE');
                    alert('Data Center A dipadamkan. Data Center B berhasil mendeteksi kegagalan jantung (heartbeat failure) & mengambil alih traffic penuh tanpa ada koneksi yang terputus (Zero-Downtime Failover).');
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 text-[10px] font-black rounded-lg cursor-pointer"
                >
                  Simulasikan DC A Padam (Failover)
                </button>
                <button
                  onClick={() => {
                    setDcAStatus('ONLINE');
                    setDcBStatus('STANDBY');
                    alert('Data Center A kembali online. Replikasi data berhasil diseimbangkan kembali.');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-black rounded-lg cursor-pointer"
                >
                  Reset / Re-balance Cluster DC
                </button>
              </div>

              {/* Point-in-time recovery area */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">3. Backup &amp; PITR (Point-In-Time Recovery)</span>
                <p className="text-[10px] text-slate-400">Pulihkan status database ke 5 menit atau exact timestamp sebelum kesalahan massal terjadi.</p>
                
                <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="text"
                    value={pitrTimestamp}
                    onChange={(e) => setPitrTimestamp(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-250 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono"
                  />
                  <button
                    onClick={() => alert(`Sistem berhasil memulihkan database ke timestamp ${pitrTimestamp}. Re-indexing complete.`)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg cursor-pointer"
                  >
                    Restore Database
                  </button>
                </div>
              </div>
            </div>

            {/* JWT SECURE MULTI-SECRET MANAGEMENT */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-indigo-150 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-2.5 py-0.5 rounded-full uppercase block">Mitigasi Blast Radius</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  </div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">3. Manajemen JWT Secret Terpisah &amp; Kriptografi</h5>
                  <p className="text-[10px] text-slate-400">Gunakan kunci rahasia berbeda untuk membatasi dampak kebocoran kredensial pada portal SIAKAD.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchJwtSecretsStatus}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                    disabled={loadingSecrets}
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingSecrets ? 'animate-spin' : ''}`} />
                    Refresh Status
                  </button>
                  <button
                    onClick={handleRotateSecrets}
                    disabled={rotatingSecrets}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 text-[10px] font-black rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3" />
                    {rotatingSecrets ? "Rotating..." : "Rotasi Paksa Kunci"}
                  </button>
                </div>
              </div>

              {/* Secrets Status Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {jwtSecrets.map((secret, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-800 dark:text-white font-mono break-all">{secret.name}</span>
                        <span className="flex items-center gap-1 text-[8px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                          SECURE
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold block">{secret.purpose}</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Lifespan: <span className="font-bold text-slate-600 dark:text-slate-300">{secret.lifespan}</span></p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Entropy:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">{secret.entropy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Length:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">{secret.strength}</span>
                      </div>
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-slate-400 font-bold">Value:</span>
                        <span className="text-slate-800 dark:text-slate-100 font-mono bg-slate-200/60 dark:bg-slate-850 px-1 py-0.5 rounded break-all tracking-wide">{secret.maskedValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Source:</span>
                        <span className="text-slate-500 font-bold italic">{secret.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cryptographic Key Generator */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h6 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Cryptographic Secret Generator Sandbox</h6>
                    <p className="text-[9px] text-slate-400">Hasilkan kunci 512-bit acak berkecepatan tinggi dengan modul kriptografi Node.js asli.</p>
                  </div>
                  <button
                    onClick={handleGenerateKey}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Generate 64-byte Key
                  </button>
                </div>

                {generatedKey && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Generated 64-byte Secret Key (Hexadecimal Representation)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedKey}
                        className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedKey);
                          setCopiedKey(true);
                          setTimeout(() => setCopiedKey(false), 2000);
                        }}
                        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black rounded-xl cursor-pointer"
                      >
                        {copiedKey ? "Copied!" : "Copy Key"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Example Generation Snippets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] pt-1">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-850/50 space-y-1.5">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Option A: CLI Command (Terminal)</span>
                    <code className="block bg-slate-50 dark:bg-slate-950 p-2 rounded-lg font-mono text-[9px] text-rose-600 dark:text-rose-400 break-all select-all">
                      node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
                    </code>
                    <p className="text-[9px] text-slate-400">Jalankan di terminal Node Anda untuk mendapatkan key instan sekuat 512-bit.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-850/50 space-y-1.5">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Option B: Node.js Crypto API (Code)</span>
                    <pre className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg font-mono text-[8px] text-slate-500 overflow-x-auto">
                      {`import crypto from "crypto";
const secret = crypto.randomBytes(64).toString("hex");
console.log(secret);`}
                    </pre>
                    <p className="text-[9px] text-slate-400">Sertakan dalam kode runtime server Anda untuk inisialisasi kriptografis.</p>
                  </div>
                </div>
              </div>

              {/* Password Reset Demonstration Playground */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-4">
                <div>
                  <h6 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Demo Sandbox: One-Time Password Reset (Strict Expiration)</h6>
                  <p className="text-[9px] text-slate-400">Simulasikan siklus hidup reset password menggunakan token terpisah, membuktikan validasi waktu nyata dan ketahanan replay attack.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step 1: Request */}
                  <div className="space-y-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850/50">
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-2 py-0.5 rounded uppercase block w-max">Langkah 1: Request Token</span>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Email Terdaftar:</label>
                      <input
                        type="text"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 font-bold"
                      />
                    </div>

                    <button
                      onClick={handleRequestPasswordReset}
                      className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer"
                    >
                      Kirim Token Reset Khusus
                    </button>
                  </div>

                  {/* Step 2: Confirm */}
                  <div className="space-y-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850/50">
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-2 py-0.5 rounded uppercase block w-max">Langkah 2: Verifikasi &amp; Reset</span>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Input Token Reset JWT:</label>
                      <input
                        type="text"
                        placeholder="Tempel Token JWT Reset Di Sini..."
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Kata Sandi Baru:</label>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 font-bold"
                      />
                    </div>

                    <button
                      onClick={handleConfirmPasswordReset}
                      className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer"
                    >
                      Konfirmasi Setel Ulang Sandi
                    </button>
                  </div>
                </div>

                {/* Outputs */}
                {(resetStatus || resetError) && (
                  <div className={`p-3 rounded-xl border text-[10px] font-medium leading-relaxed ${
                    resetStatus 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 text-emerald-800 dark:text-emerald-300' 
                      : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 text-rose-800 dark:text-rose-300'
                  }`}>
                    <span className="font-bold uppercase text-[8px] block mb-1">
                      {resetStatus ? "Status Operasi" : "Kesalahan Keamanan"}
                    </span>
                    {resetStatus || resetError}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: LIFELONG LEARNING & RPL KURSUS */}
        {activeTab === 'lifelong' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Fitur 8 &bull; Lifelong Learning & Business</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Rekognisi Pembelajaran Lampau (RPL) &amp; Alumni Portal</h3>
              <p className="text-xs text-slate-500">Mendukung paket pembelajaran fleksibel (RPL), pendaftaran kursus publik, dan verifikasi ijazah digital seumur hidup alumni.</p>
            </div>

            {/* RPL Module */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">1. Rekognisi Pembelajaran Lampau (RPL) Evaluator</h5>
              <p className="text-[10px] text-slate-400">Konversikan pengalaman kerja nyata mahasiswa pendaftar program ekstensi/RPL ke dalam SKS perkuliahan reguler.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Matakuliah Konversi:</label>
                  <select
                    value={selectedCourseRpl}
                    onChange={(e) => setSelectedCourseRpl(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                  >
                    <option value="Pemrograman Web Lanjut">Pemrograman Web Lanjut</option>
                    <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                    <option value="Manajemen Proyek IT">Manajemen Proyek IT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Pengalaman Kerja Industri (Tahun):</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={rplYearsExp}
                    onChange={(e) => setRplYearsExp(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono font-bold"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleRplEvaluationCheck}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    Evaluasi Kelayakan SKS
                  </button>
                </div>
              </div>

              {rplStatus && (
                <div className={`p-3.5 rounded-xl border text-xs font-bold ${
                  rplStatus.includes('MEMENUHI')
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                    : 'bg-amber-50/50 border-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                }`}>
                  {rplStatus}
                </div>
              )}
            </div>

            {/* Lifelong Alumni Portal */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">2. Lifelong Alumni Portal &amp; Transcript Verification</h5>
              <p className="text-[10px] text-slate-400 leading-normal">Memungkinkan perusahaan atau alumni memverifikasi keaslian transkrip digital &amp; ijazah kapan pun, aman dari pemalsuan.</p>

              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="Masukkan NIM alumni (contoh: 10118045)"
                  value={alumniSearchNIM}
                  onChange={(e) => setAlumniSearchNIM(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-250 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono font-bold"
                />
                <button
                  onClick={handleAlumniSearchNIM}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg cursor-pointer"
                >
                  Verifikasi Ijazah
                </button>
              </div>

              {alumniVerifyResult && (
                <div className="p-4 bg-indigo-50/25 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-indigo-100/40 pb-2">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white">Status Transkrip: verified</span>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">✓ CERTIFIED TRANSCRIPT</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                    <div>
                      <span className="text-slate-400 block font-medium">Nama Alumni:</span>
                      <span className="text-slate-800 dark:text-white">{alumniVerifyResult.nama}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Lulus Program:</span>
                      <span className="text-slate-800 dark:text-white">{alumniVerifyResult.prodi} ({alumniVerifyResult.graduatedYear})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Nilai IPK Akhir:</span>
                      <span className="text-slate-800 dark:text-white font-mono">{alumniVerifyResult.ipk.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Digital Signature Hash:</span>
                      <span className="text-slate-500 font-mono text-[9px] leading-normal">{alumniVerifyResult.certifiedDocHash}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
