import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toast, Toaster } from 'sonner';
import { defineRulesFor } from '../../lib/ability';
import { useAppStore } from '../../store';
import { fetchAcademicCourses, fetchAcademicAnnouncements, submitAbsenceForm, ApiCourse } from '../../lib/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  Calendar as CalendarIcon, 
  GraduationCap, 
  CheckSquare, 
  Database, 
  FileSpreadsheet, 
  FileText, 
  Lock, 
  Plus, 
  RefreshCw, 
  User as UserIcon, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  AlertTriangle,
  Info,
  CheckCircle,
  Eye,
  X,
  FileCheck,
  Shield,
  Activity,
  Fingerprint,
  KeyRound,
  Unlock
} from 'lucide-react';

// Class Variance Authority for buttons
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none select-none border shadow-sm",
  {
    variants: {
      intent: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700",
        danger: "bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700",
        warning: "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 hover:border-amber-600",
      },
      size: {
        sm: "px-3 py-1.5 text-[11px]",
        md: "px-4 py-2 text-xs",
        lg: "px-5 py-2.5 text-sm",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

// Zod Validation Schema for absence request
const absenceFormSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  nim: z.string().min(8, { message: 'NIM minimal 8 digit angka' }).regex(/^\d+$/, { message: 'NIM harus berupa angka saja' }),
  email: z.string().email({ message: 'Format alamat email tidak valid' }),
  absenceDate: z.string().refine((val) => {
    try {
      const date = parseISO(val);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, { message: 'Tanggal absensi tidak valid' }),
  reason: z.string().min(10, { message: 'Alasan minimal 10 karakter untuk divalidasi' }),
  absenceType: z.enum(['Sakit', 'Izin', 'Tugas Universitas']),
});

type AbsenceFormData = z.infer<typeof absenceFormSchema>;

export default function ShowcaseView() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  // Zustand state properties
  const { 
    customEvents, 
    addCustomEvent, 
    deleteCustomEvent, 
    notifications, 
    addNotification, 
    clearNotifications 
  } = useAppStore();

  // Active simulated role for CASL abilities
  const [selectedCaslRole, setSelectedCaslRole] = useState<'student' | 'lecturer' | 'admin' | 'kaprodi' | 'dekan'>(user?.role || 'student');
  
  // Custom states for the Security & Cryptography (JWT, Argon2, Helmet, CORS, Rate Limit) tab
  const [secRegName, setSecRegName] = useState('');
  const [secRegEmail, setSecRegEmail] = useState('');
  const [secRegPassword, setSecRegPassword] = useState('');
  const [secRegRole, setSecRegRole] = useState<'student' | 'lecturer' | 'kaprodi' | 'dekan' | 'admin'>('student');
  const [secRegDept, setSecRegDept] = useState('');
  const [secRegPhone, setSecRegPhone] = useState('');
  
  const [secLoginEmail, setSecLoginEmail] = useState('ahmad.syafiq@mahasiswa.ac.id');
  const [secLoginPassword, setSecLoginPassword] = useState('password123');
  const [secActiveToken, setSecActiveToken] = useState('');
  const [secDecodedPayload, setSecDecodedPayload] = useState<any>(null);
  
  const [securityTelemetry, setSecurityTelemetry] = useState<any>(null);
  const [telemetryLoading, setTelemetryLoading] = useState(false);
  const [rateLimitHitsCount, setRateLimitHitsCount] = useState(0);

  const fetchSecurityTelemetry = async () => {
    try {
      const res = await fetch('/api/security/telemetry');
      if (res.ok) {
        const data = await res.json();
        setSecurityTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error("Gagal memuat telemetri keamanan:", e);
    }
  };

  useEffect(() => {
    fetchSecurityTelemetry();
    // Poll logs every 5 seconds for real-time responsiveness
    const interval = setInterval(fetchSecurityTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  // Security Sandbox State Handlers
  const [secLoginError, setSecLoginError] = useState('');
  const [secLoginSuccess, setSecLoginSuccess] = useState('');
  const [secRegError, setSecRegError] = useState('');
  const [secRegSuccess, setSecRegSuccess] = useState('');
  const [bruteForceActive, setBruteForceActive] = useState(false);
  const [bruteForceStatus, setBruteForceStatus] = useState('');
  const [bruteForceProgress, setBruteForceProgress] = useState(0);

  const handleSecureLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecLoginError('');
    setSecLoginSuccess('');
    try {
      const res = await fetch('/api/auth/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: secLoginEmail, password: secLoginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setSecLoginError(data.message || 'Gagal masuk secara aman.');
        toast.error(data.message || 'Login Gagal');
      } else {
        setSecActiveToken(data.token);
        setSecLoginSuccess(data.message);
        // Decode JWT token locally
        try {
          const payloadPart = data.token.split('.')[1];
          const decoded = JSON.parse(atob(payloadPart));
          setSecDecodedPayload(decoded);
        } catch (err) {
          setSecDecodedPayload({ error: 'Gagal mendecode token' });
        }
        toast.success('Login Berhasil Melalui JWT!');
        fetchSecurityTelemetry();
      }
    } catch (err) {
      setSecLoginError('Tidak dapat terhubung ke server.');
      toast.error('Koneksi Gagal');
    }
  };

  const handleSecureRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecRegError('');
    setSecRegSuccess('');
    try {
      const res = await fetch('/api/auth/secure-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: secRegName,
          email: secRegEmail,
          password: secRegPassword,
          role: secRegRole,
          department: secRegDept,
          phone: secRegPhone
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setSecRegError(data.errors.join(', '));
        } else {
          setSecRegError(data.message || 'Gagal mendaftar secara aman.');
        }
        toast.error('Registrasi Gagal');
      } else {
        setSecRegSuccess(data.message);
        toast.success('Registrasi Sukses (Hashed with Argon2/Bcrypt!)');
        setSecRegName('');
        setSecRegEmail('');
        setSecRegPassword('');
        setSecRegDept('');
        setSecRegPhone('');
        fetchSecurityTelemetry();
      }
    } catch (err) {
      setSecRegError('Tidak dapat terhubung ke server.');
      toast.error('Koneksi Gagal');
    }
  };

  const handleBruteForceSimulation = async () => {
    if (bruteForceActive) return;
    setBruteForceActive(true);
    setBruteForceStatus('Memulai simulasi brute force...');
    setBruteForceProgress(0);

    let hitCount = 0;
    const maxHits = 210;
    let isBlocked = false;

    for (let i = 0; i < maxHits; i++) {
      if (isBlocked) break;
      try {
        const res = await fetch('/api/security/telemetry');
        hitCount++;
        setBruteForceProgress(Math.floor((hitCount / maxHits) * 100));
        setBruteForceStatus(`Mengirim request ke server... (${hitCount}/${maxHits})`);

        if (res.status === 429) {
          isBlocked = true;
          setBruteForceStatus(`SUKSES: Terdeteksi HTTP 429 Rate Limit Exceeded pada request ke-${hitCount}! Sistem menghentikan ancaman.`);
          toast.warning('Terdeteksi Serangan! Sistem Keamanan Memblokir IP Anda.');
          break;
        }
      } catch (err) {
        console.error(err);
      }
      await new Promise(resolve => setTimeout(resolve, 15));
    }

    if (!isBlocked) {
      setBruteForceStatus(`Simulasi selesai. Mengirim ${hitCount} request tanpa terblokir. Batas laju belum tercapai.`);
    }
    setBruteForceActive(false);
    fetchSecurityTelemetry();
  };
  
  // Create current CASL Ability
  const currentAbility = useMemo(() => defineRulesFor(selectedCaslRole), [selectedCaslRole]);

  // React Query with Axios mock
  const { 
    data: courses, 
    isLoading: isCoursesLoading, 
    isFetching: isCoursesFetching, 
    refetch: refetchCourses 
  } = useQuery<ApiCourse[]>({
    queryKey: ['academicCourses'],
    queryFn: fetchAcademicCourses,
  });

  const { 
    data: announcements, 
    isLoading: isAnnouncementsLoading,
    refetch: refetchAnnouncements 
  } = useQuery({
    queryKey: ['academicAnnouncements'],
    queryFn: fetchAcademicAnnouncements,
  });

  // React Hook Form + Zod Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AbsenceFormData>({
    resolver: zodResolver(absenceFormSchema),
    defaultValues: {
      fullName: user?.name || '',
      nim: '210901234',
      email: user?.email || '',
      absenceDate: format(new Date(), 'yyyy-MM-dd'),
      absenceType: 'Sakit',
      reason: '',
    },
  });

  // Mutation for Form Submission
  const absenceMutation = useMutation({
    mutationFn: submitAbsenceForm,
    onSuccess: (data) => {
      toast.success(data.message, {
        description: `Dispensasi disetujui untuk ${data.data.fullName} pada ${format(parseISO(data.data.absenceDate), 'dd MMMM yyyy')}`,
      });
      addNotification(`Absensi/Dispensasi berhasil diajukan untuk ${data.data.fullName}`, 'success');
      reset();
    },
    onError: () => {
      toast.error('Gagal memproses form absensi.');
    },
  });

  const onSubmitAbsence = (data: AbsenceFormData) => {
    absenceMutation.mutate(data);
  };

  // TanStack Table Setup for Academic Courses
  const [globalFilter, setGlobalFilter] = useState('');
  
  const columns = useMemo<ColumnDef<ApiCourse>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Kode MK',
        cell: (info) => <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Nama Matakuliah',
        cell: (info) => <span className="font-semibold text-slate-900 dark:text-white">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'sks',
        header: 'SKS',
        cell: (info) => <span className="font-bold text-center block">{info.getValue() as number} SKS</span>,
      },
      {
        accessorKey: 'semester',
        header: 'Smt',
        cell: (info) => <span className="text-center block font-medium">{info.getValue() as number}</span>,
      },
      {
        accessorKey: 'lecturer',
        header: 'Dosen Pengampu',
        cell: (info) => <span className="text-xs text-slate-500 dark:text-slate-400">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'grade',
        header: 'Nilai',
        cell: (info) => {
          const val = info.getValue() as string;
          const isA = val.startsWith('A');
          return (
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              isA ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
            }`}>
              {val}
            </span>
          );
        },
      },
    ],
    []
  );

  const tableData = useMemo(() => courses || [], [courses]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // Excel Export with XLSX
  const exportToExcel = () => {
    if (!courses) return;
    try {
      const dataToExport = courses.map(c => ({
        'Kode MK': c.code,
        'Nama Matakuliah': c.name,
        'SKS': c.sks,
        'Semester': c.semester,
        'Dosen Pengampu': c.lecturer,
        'Nilai Huruf': c.grade,
        'Bobot Nilai': c.point
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'KHS_Mahasiswa');
      XLSX.writeFile(workbook, 'SIAKAD_Transcript_Showcase.xlsx');
      toast.success('File Excel berhasil diekspor!', {
        description: 'Tabel KHS dikonversi menjadi file Excel spreadsheet.'
      });
      addNotification('Ekspor data KHS ke format Excel berhasil.', 'success');
    } catch (err) {
      toast.error('Gagal mengekspor ke Excel');
    }
  };

  // PDF Export with jsPDF
  const exportToPDF = () => {
    if (!courses) return;
    try {
      const doc = new jsPDF();
      
      // Page styling / Header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN', 105, 15, { align: 'center' });
      doc.setFontSize(14);
      doc.text('UNIVERSITAS TEKNOLOGI SIAKAD INDONESIA', 105, 23, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(15, 27, 195, 27);
      
      doc.setFontSize(12);
      doc.text('TRANSKRIP AKADEMIK SEMENTARA (SHOWCASE)', 105, 36, { align: 'center' });
      
      // Student details
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`NAMA MAHASISWA : ${user?.name || 'DAVID A.'}`, 15, 45);
      doc.text(`NIM             : 210901234`, 15, 51);
      doc.text(`PROGRAM STUDI   : ${user?.department || 'Teknik Informatika'}`, 15, 57);
      
      // Table Header
      let currentY = 67;
      doc.setFillColor(59, 130, 246); // Blue color code
      doc.rect(15, currentY, 180, 8, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('KODE', 17, currentY + 5);
      doc.text('MATAKULIAH', 40, currentY + 5);
      doc.text('SKS', 125, currentY + 5);
      doc.text('SEMESTER', 145, currentY + 5);
      doc.text('NILAI', 175, currentY + 5);
      
      currentY += 8;
      
      // Table Rows
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      courses.forEach((c) => {
        // Draw bottom separator line
        doc.setLineWidth(0.1);
        doc.line(15, currentY + 8, 195, currentY + 8);
        
        doc.text(c.code, 17, currentY + 5);
        
        // Truncate name if too long
        const displayName = c.name.length > 35 ? c.name.substr(0, 32) + '...' : c.name;
        doc.text(displayName, 40, currentY + 5);
        doc.text(`${c.sks}`, 127, currentY + 5);
        doc.text(`${c.semester}`, 152, currentY + 5);
        doc.text(c.grade, 178, currentY + 5);
        currentY += 8;
      });

      // GPA calculations
      const totalSks = courses.reduce((acc, curr) => acc + curr.sks, 0);
      const totalPoints = courses.reduce((acc, curr) => acc + (curr.point * curr.sks), 0);
      const ipk = (totalPoints / totalSks).toFixed(2);

      currentY += 10;
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`Total SKS: ${totalSks} SKS`, 15, currentY);
      doc.text(`IPK Kumulatif (Showcase): ${ipk}`, 120, currentY);

      // Certified Digital stamp
      currentY += 15;
      doc.setFillColor(243, 244, 246);
      doc.rect(15, currentY, 180, 22, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(59, 130, 246);
      doc.text('DOKUMEN INI TELAH TERSETUJU & TER-SERTIFIKASI SECARA DIGITAL', 20, currentY + 6);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Sertifikasi Keamanan: SHA-256 / DIGITAL_SIGNATURE_SIAKAD_CORE_GEN2', 20, currentY + 12);
      doc.text(`Dicetak pada: ${format(new Date(), 'dd MMMM yyyy, HH:mm')} WIB`, 20, currentY + 18);
      
      doc.save('SIAKAD_Academic_Transcript.pdf');
      toast.success('Dokumen PDF berhasil diunduh!', {
        description: 'Transkrip akademik ditandatangani secara digital dengan standar PDF.'
      });
      addNotification('Sertifikat & Transkrip Akademik diunduh dalam format PDF.', 'success');
    } catch (err) {
      toast.error('Gagal mengekspor PDF');
    }
  };

  // Interactive full calendar custom event creation
  const handleDateClick = (arg: any) => {
    const title = window.prompt(`Tambah Kegiatan pada tanggal ${arg.dateStr}:`);
    if (title) {
      addCustomEvent({
        title,
        start: arg.dateStr,
        color: '#10b981' // emerald theme color
      });
      toast.success('Kegiatan berhasil dijadwalkan!', {
        description: `${title} pada ${arg.dateStr}`
      });
      addNotification(`Menjadwalkan kegiatan baru: "${title}"`, 'info');
    }
  };

  return (
    <div id="showcase-view-container" className="space-y-6 max-w-7xl mx-auto px-4 py-6 font-sans">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 dark:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">SIAKAD Advanced Hub</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Pusat Integrasi &amp; Teknologi Library</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Menampilkan implementasi seluruh library canggih yang diintegrasikan secara sinergis dalam satu portal dashboard interaktif SIAKAD.
          </p>
        </div>

        {/* Radix UI Dialog wrapper */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className={buttonVariants({ intent: 'primary', size: 'md' })}>
              <Info className="w-4 h-4" /> Tentang Showcase
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-all" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl space-y-4 focus:outline-none">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <Dialog.Title className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" /> Arsitektur Library Pendukung
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
                <p>
                  SIAKAD Modern ini mengimplementasikan integrasi dari total <strong>15+ library production-grade</strong> berikut:
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px] bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> react-router-dom</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> react-query</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> zustand</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> react-hook-form</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> zod</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> react-table</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> date-fns</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> fullcalendar</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> axios</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> sonner</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> @casl/ability</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> loading-skeleton</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> xlsx &amp; jspdf</div>
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> radix-ui primitives</div>
                </div>
                <p>
                  Setiap modul dikonfigurasi secara optimal untuk memastikan performa tinggi, type-safety maksimal, dan desain antarmuka yang sangat responsif.
                </p>
              </Dialog.Description>
              <div className="flex justify-end pt-2">
                <Dialog.Close asChild>
                  <button className={buttonVariants({ intent: 'secondary', size: 'sm' })}>Tutup Detail</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Main Tabs Area - Powered by Radix UI Tabs */}
      <Tabs.Root defaultValue="query-table" className="w-full">
        <Tabs.List className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-px" aria-label="Library Showcase Options">
          <Tabs.Trigger
            value="query-table"
            className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-slate-800 dark:hover:text-white data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all cursor-pointer whitespace-nowrap focus:outline-none flex items-center gap-2"
          >
            <Database className="w-4 h-4" /> TanStack Table, Query &amp; Exports
          </Tabs.Trigger>
          <Tabs.Trigger
            value="calendar-zustand"
            className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-slate-800 dark:hover:text-white data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all cursor-pointer whitespace-nowrap focus:outline-none flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" /> FullCalendar &amp; Zustand
          </Tabs.Trigger>
          <Tabs.Trigger
            value="form-validation"
            className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-slate-800 dark:hover:text-white data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all cursor-pointer whitespace-nowrap focus:outline-none flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" /> Form, Zod &amp; Axios
          </Tabs.Trigger>
          <Tabs.Trigger
            value="casl-rbac"
            className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-slate-800 dark:hover:text-white data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all cursor-pointer whitespace-nowrap focus:outline-none flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> CASL Ability / RBAC
          </Tabs.Trigger>
          <Tabs.Trigger
            value="security-vault"
            className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent hover:text-slate-800 dark:hover:text-white data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all cursor-pointer whitespace-nowrap focus:outline-none flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-emerald-500 animate-pulse" /> Keamanan &amp; Kriptografi
          </Tabs.Trigger>
        </Tabs.List>

        {/* TAB 1 CONTENT: TANSTACK QUERY, TANSTACK TABLE, AND EXPORTERS */}
        <Tabs.Content value="query-table" className="pt-6 focus:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Control Sidebar Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Database className="w-4 h-4 text-blue-500" /> Kontrol Query &amp; Ekspor
              </h3>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Tabel di sebelah kanan menggunakan <strong>@tanstack/react-table</strong> untuk sorting, pagination, dan global searching. 
                Data diperoleh secara asinkron lewat <strong>@tanstack/react-query</strong> menggunakan simulasi <strong>Axios client</strong>.
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Sandi / State React Query</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Query Status:</span>
                    <span className={`font-bold ${isCoursesLoading ? 'text-amber-500' : 'text-emerald-500 animate-pulse'}`}>
                      {isCoursesLoading ? 'Loading...' : 'Success (Cached)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Background Fetch:</span>
                    <span className="font-mono text-[10px]">{isCoursesFetching ? 'Fetching...' : 'Idle'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => refetchCourses()}
                  className={buttonVariants({ intent: 'secondary', size: 'sm' })}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCoursesFetching ? 'animate-spin' : ''}`} /> Paksa Refetch (Query)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={exportToExcel}
                    disabled={!courses}
                    className={buttonVariants({ intent: 'success', size: 'sm' })}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor Excel
                  </button>
                  <button
                    onClick={exportToPDF}
                    disabled={!courses}
                    className={buttonVariants({ intent: 'danger', size: 'sm' })}
                  >
                    <FileText className="w-3.5 h-3.5" /> Ekspor PDF
                  </button>
                </div>
              </div>
            </div>

            {/* TanStack Table Container */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">Kartu Hasil Studi Terintegrasi</h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Menampilkan 7 matakuliah dari database simulated API</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Cari matakuliah..."
                    className="w-full sm:w-56 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {isCoursesLoading ? (
                <div className="space-y-2 py-4">
                  <Skeleton height={35} className="rounded-lg" />
                  <Skeleton height={45} count={5} className="rounded-lg" />
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th key={header.id} className="p-3 select-none">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="p-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Pagination Controls */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span>Halaman</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {table.getState().pagination.pageIndex + 1}
                  </span>
                  <span>dari</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {table.getPageCount()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </Tabs.Content>

        {/* TAB 2 CONTENT: FULLCALENDAR AND ZUSTAND */}
        <Tabs.Content value="calendar-zustand" className="pt-6 focus:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Zustand State Inspector Side-Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Database className="w-4 h-4 text-emerald-500" /> State Manager (Zustand)
              </h3>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Data kalender disinkronisasikan secara dinamis menggunakan state global <strong>Zustand</strong>. 
                Anda dapat menambahkan atau menghapus kegiatan dari panel ini maupun mengklik langsung tanggal di kalender.
              </p>

              {/* Notification Center within Zustand */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Log Notifikasi Zustand ({notifications.length})</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[9px] font-black text-red-500 hover:text-red-700 uppercase cursor-pointer"
                    >
                      Bersihkan
                    </button>
                  )}
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                  {notifications.length === 0 ? (
                    <span className="text-[10px] text-slate-400 block py-4 text-center italic">Tidak ada notifikasi aktif.</span>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="text-[10px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start gap-1.5 shadow-xs">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium leading-normal">{n.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Event manager list */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Kelola Agenda Kalender ({customEvents.length})</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {customEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs shadow-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">{ev.title}</span>
                        <span className="text-[10px] font-semibold font-mono text-slate-400 dark:text-slate-500">{ev.start}</span>
                      </div>
                      <button
                        onClick={() => {
                          deleteCustomEvent(ev.id);
                          toast.info('Agenda dihapus.');
                          addNotification(`Menghapus agenda: "${ev.title}"`, 'warning');
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Calendar view using @fullcalendar */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">Kalender Akademik Interaktif</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Klik pada salah satu tanggal untuk menjadwalkan agenda baru!</p>
                </div>
                <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20">
                  FullCalendar v6
                </span>
              </div>
              
              <div className="fullcalendar-custom-theme select-none text-xs dark:text-slate-200">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={customEvents}
                  dateClick={handleDateClick}
                  headerToolbar={{
                    left: 'title',
                    center: '',
                    right: 'prev,next'
                  }}
                  height={420}
                  dayMaxEvents={2}
                />
              </div>
            </div>

          </div>
        </Tabs.Content>

        {/* TAB 3 CONTENT: FORM HANDLER, ZOD AND RESOLVERS */}
        <Tabs.Content value="form-validation" className="pt-6 focus:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Info Side-Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <CheckSquare className="w-4 h-4 text-purple-500" /> Form Validation Engine
              </h3>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Formulir di sebelah kanan dibangun dengan kombinasi optimal dari:
              </p>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="p-1 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded mt-0.5">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="block font-bold">React Hook Form</strong>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Mencegah unnecesary re-renders dan mempermudah field register.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="p-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded mt-0.5">
                    <FileCheck className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="block font-bold">Zod Schema validation</strong>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Validasi tipe data yang ketat, pencegahan data kotor, dan kustomisasi error message.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="p-1 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="block font-bold">@hookform/resolvers</strong>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Mengawinkan validasi Zod schema langsung sebagai resolver form state.</span>
                  </div>
                </div>
              </div>

              {/* API Announcements section via React Query */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pengumuman Terkini (React Query / Axios)</span>
                {isAnnouncementsLoading ? (
                  <div className="space-y-1.5">
                    <Skeleton height={20} className="rounded" />
                    <Skeleton height={20} className="rounded" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {announcements?.slice(0, 2).map((a: any) => (
                      <div key={a.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850/60 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            a.category === 'Akademik' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}>
                            {a.category}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">{a.date}</span>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">{a.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Validated form */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                Formulir Pengajuan Dispensasi Kuliah (Sakit / Izin)
              </h3>

              <form onSubmit={handleSubmit(onSubmitAbsence)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full name field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Nama Lengkap Mahasiswa
                    </label>
                    <input
                      type="text"
                      {...register('fullName')}
                      placeholder="Masukkan nama lengkap..."
                      className={`w-full px-3 py-2 text-xs font-medium rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 transition-all ${
                        errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[10px] font-bold text-red-500 block">{errors.fullName.message}</span>
                    )}
                  </div>

                  {/* NIM field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      NIM (Nomor Induk Mahasiswa)
                    </label>
                    <input
                      type="text"
                      {...register('nim')}
                      placeholder="Contoh: 210901234"
                      className={`w-full px-3 py-2 text-xs font-medium rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 transition-all ${
                        errors.nim ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.nim && (
                      <span className="text-[10px] font-bold text-red-500 block">{errors.nim.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Alamat Email Aktif
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="username@mahasiswa.ac.id"
                      className={`w-full px-3 py-2 text-xs font-medium rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 transition-all ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] font-bold text-red-500 block">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Absence Type select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Tipe Dispensasi / Absensi
                    </label>
                    <select
                      {...register('absenceType')}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Sakit">Sakit (Memerlukan Surat Dokter)</option>
                      <option value="Izin">Izin (Keperluan Mendesak)</option>
                      <option value="Tugas Universitas">Tugas Delegasi Universitas</option>
                    </select>
                    {errors.absenceType && (
                      <span className="text-[10px] font-bold text-red-500 block">{errors.absenceType.message}</span>
                    )}
                  </div>
                </div>

                {/* Absence Date picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Tanggal Absensi Kuliah
                  </label>
                  <input
                    type="date"
                    {...register('absenceDate')}
                    className={`w-full px-3 py-2 text-xs font-mono rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 transition-all ${
                      errors.absenceDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.absenceDate && (
                    <span className="text-[10px] font-bold text-red-500 block">{errors.absenceDate.message}</span>
                  )}
                </div>

                {/* Reason Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Alasan Lengkap Pengajuan dispensasi
                  </label>
                  <textarea
                    {...register('reason')}
                    rows={4}
                    placeholder="Contoh: Mengalami demam tinggi sejak kemarin sore, melampirkan surat sakit dari klinik utama..."
                    className={`w-full px-3 py-2 text-xs font-medium rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 transition-all resize-none ${
                      errors.reason ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.reason && (
                    <span className="text-[10px] font-bold text-red-500 block">{errors.reason.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || absenceMutation.isPending}
                    className={buttonVariants({ intent: 'primary', size: 'md' })}
                  >
                    {isSubmitting || absenceMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Mengirim...
                      </>
                    ) : (
                      'Kirim Pengajuan Dispensasi'
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </Tabs.Content>

        {/* TAB 4 CONTENT: CASL RBAC PERMISSIONS PLAYGROUND */}
        <Tabs.Content value="casl-rbac" className="pt-6 focus:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Control panel to switch simulated roles */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Lock className="w-4 h-4 text-rose-500" /> Permainan Peran CASL Ability
              </h3>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Di bawah ini, ubah simulasi peran untuk mengetes bagaimana <strong>@casl/ability</strong> memblokir atau memperbolehkan aksi-aksi tertentu secara deklaratif.
              </p>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Simulasikan Peran Aktif</label>
                <select
                  value={selectedCaslRole}
                  onChange={(e) => {
                    const newRole = e.target.value as any;
                    setSelectedCaslRole(newRole);
                    toast.success(`Aturan CASL diubah ke: ${newRole.toUpperCase()}`);
                    addNotification(`Mengubah hak akses simulasi ke: ${newRole}`, 'info');
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="student">Student (Mahasiswa)</option>
                  <option value="lecturer">Lecturer (Dosen Pengampu)</option>
                  <option value="kaprodi">Kaprodi (Ketua Program Studi)</option>
                  <option value="dekan">Dekan (Pimpinan Fakultas)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              {/* Live Rule list display */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Ringkasan Aturan CASL (Role: {selectedCaslRole})</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Edit Nilai (Grade):</span>
                    <span className={`font-bold uppercase ${currentAbility.can('update', 'Grade') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {currentAbility.can('update', 'Grade') ? 'Diperbolehkan' : 'Dilarang'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Ubah Mata Kuliah (Course):</span>
                    <span className={`font-bold uppercase ${currentAbility.can('update', 'Course') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {currentAbility.can('update', 'Course') ? 'Diperbolehkan' : 'Dilarang'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Kelola Keuangan (Finance):</span>
                    <span className={`font-bold uppercase ${currentAbility.can('update', 'Finance') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {currentAbility.can('update', 'Finance') ? 'Diperbolehkan' : 'Dilarang'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated UI components governed by permissions */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">Gerbang Akses Terproteksi CASL</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Komponen-komponen di bawah dimuat bersyarat sesuai evaluasi rules CASL</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Grade editing block (Lecturer / Admin can change, Student cannot) */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-500">Aksi 1 &bull; Edit Nilai Mahasiswa</span>
                    <span className="p-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Aturan CASL mendikte bahwa hanya Dosen Pengampu &amp; Admin yang boleh mengedit nilai akademik mahasiswa.</p>
                  
                  {currentAbility.can('update', 'Grade') ? (
                    <button
                      onClick={() => toast.success('Membuka form edit nilai mahasiswa!')}
                      className={buttonVariants({ intent: 'primary', size: 'sm' })}
                    >
                      Akses Form Nilai
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-500/10 rounded-lg text-[10px] font-bold">
                      <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                      Akses Ditolak (Khusus Dosen / Admin)
                    </div>
                  )}
                </div>

                {/* Finance management block (Dekan / Admin can modify, others cannot) */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-500">Aksi 2 &bull; Kelola Anggaran Fakultas</span>
                    <span className="p-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Aturan CASL mendikte bahwa hanya Dekan &amp; Admin yang dapat mengesahkan atau merevisi anggaran keuangan.</p>

                  {currentAbility.can('update', 'Finance') ? (
                    <button
                      onClick={() => toast.success('Membuka dashboard anggaran keuangan!')}
                      className={buttonVariants({ intent: 'warning', size: 'sm' })}
                    >
                      Akses Edit Anggaran
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-500/10 rounded-lg text-[10px] font-bold">
                      <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                      Akses Ditolak (Khusus Dekan / Admin)
                    </div>
                  )}
                </div>

              </div>

              {/* Complete capabilities matrix check */}
              <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-3 bg-slate-50 dark:bg-slate-950/80">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Log Evaluasi CASL Aturan Rinci</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-lg shadow-xs space-y-1">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block">Manage All</span>
                    <span className={currentAbility.can('manage', 'all') ? 'text-emerald-500' : 'text-slate-400'}>
                      {currentAbility.can('manage', 'all') ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-lg shadow-xs space-y-1">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block">Read Course</span>
                    <span className={currentAbility.can('read', 'Course') ? 'text-emerald-500' : 'text-rose-500'}>
                      {currentAbility.can('read', 'Course') ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-lg shadow-xs space-y-1">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block">Create Course</span>
                    <span className={currentAbility.can('create', 'Course') ? 'text-emerald-500' : 'text-rose-500'}>
                      {currentAbility.can('create', 'Course') ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-lg shadow-xs space-y-1">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block">Update Grade</span>
                    <span className={currentAbility.can('update', 'Grade') ? 'text-emerald-500' : 'text-rose-500'}>
                      {currentAbility.can('update', 'Grade') ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Tabs.Content>

        {/* TAB 5 CONTENT: SECURITY & CRYPTOGRAPHY VAULT */}
        <Tabs.Content value="security-vault" className="pt-6 focus:outline-none animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (7 cols): Monitoring, Telemetry & Brute force simulation */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Telemetry Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500 animate-pulse" /> Telemetri Keamanan Backend (Real-Time)
                  </h3>
                  <button 
                    onClick={fetchSecurityTelemetry} 
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                    title="Perbarui Data Keamanan"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">HTTP Security</span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                      <CheckCircle className="w-3 h-3" /> Helmet Active
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">CORS Origin Control</span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                      <CheckCircle className="w-3 h-3" /> Strict Origins
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">Password Hashing</span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg">
                      <Fingerprint className="w-3 h-3 animate-pulse" /> Argon2id
                    </span>
                  </div>
                </div>

                {/* Additional telemetry indicators */}
                <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                  <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
                    <span>Otentikasi Token</span>
                    <span className="text-slate-900 dark:text-white font-bold">JWT (JSON Web Token) - HS256</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
                    <span>Zod Input Validator</span>
                    <span className="text-emerald-500 flex items-center gap-1 font-bold">Strict Type Enforcement <CheckCircle className="w-3.5 h-3.5" /></span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
                    <span>Brute Force Limiter</span>
                    <span className="text-slate-900 dark:text-white font-bold">RateLimit (Max 200 req / 15 Min)</span>
                  </div>
                </div>
              </div>

              {/* Rate Limit / Brute Force Simulator */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Activity className="w-4 h-4 text-rose-500" /> Simulasi Serangan Brute Force (Anti brute-force)
                </h3>
                
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Untuk menguji middleware <strong>express-rate-limit</strong> secara nyata, Anda dapat memicu simulasi serangan brute-force. Tombol di bawah ini akan membanjiri API backend dengan 210 requests secara beruntun. Ketika mencapai limit, server akan memblokir IP dan merespons dengan status <strong>HTTP 429 (Too Many Requests)</strong>.
                </p>

                <div className="space-y-3.5">
                  <button
                    type="button"
                    onClick={handleBruteForceSimulation}
                    disabled={bruteForceActive}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98 border border-transparent ${
                      bruteForceActive 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-none' 
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    <Activity className={`w-4 h-4 ${bruteForceActive ? 'animate-spin' : ''}`} />
                    {bruteForceActive ? 'Melancarkan Request Beruntun...' : 'Simulasikan Serangan (Banjiri 210 Request)'}
                  </button>

                  {bruteForceStatus && (
                    <div className="p-4 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Simulator Status</span>
                        <span className={bruteForceProgress >= 100 && !bruteForceActive ? 'text-emerald-400' : 'text-blue-400'}>
                          {bruteForceProgress}%
                        </span>
                      </div>
                      <p className="text-xs font-mono break-all leading-relaxed">{bruteForceStatus}</p>
                      
                      {/* Visual progress bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-150 ${bruteForceProgress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${bruteForceProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column (5 cols): Secure Auth Sandbox */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Secure Login Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <KeyRound className="w-4 h-4 text-blue-500" /> Secure Login Sandbox (JWT &amp; Hashed Verify)
                </h3>

                <form onSubmit={handleSecureLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Email / Username (Zod Validated)
                    </label>
                    <input
                      type="email"
                      value={secLoginEmail}
                      onChange={(e) => setSecLoginEmail(e.target.value)}
                      required
                      placeholder="Contoh: ahmad.syafiq@mahasiswa.ac.id"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={secLoginPassword}
                      onChange={(e) => setSecLoginPassword(e.target.value)}
                      required
                      placeholder="Sandi default: password123"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 border border-transparent"
                  >
                    <Unlock className="w-4 h-4" /> Masuk Portal via JWT
                  </button>
                </form>

                {secLoginError && (
                  <p className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-500/15 rounded-xl text-xs font-semibold">
                    {secLoginError}
                  </p>
                )}

                {secLoginSuccess && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 rounded-xl text-xs font-semibold space-y-2">
                    <p className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> {secLoginSuccess}</p>
                    {secActiveToken && (
                      <div className="space-y-1.5 pt-1.5 border-t border-emerald-500/10">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Isi Token JWT (Decoded Payload)</span>
                        <pre className="bg-slate-950 text-slate-300 p-2.5 rounded-lg text-[10px] font-mono break-all leading-relaxed whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(secDecodedPayload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Secure Registration Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Fingerprint className="w-4 h-4 text-emerald-500" /> Buat Akun Baru (Password Hashing via Argon2)
                </h3>

                <form onSubmit={handleSecureRegister} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={secRegName}
                        onChange={(e) => setSecRegName(e.target.value)}
                        required
                        placeholder="Ahmad Syafiq"
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-slate-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Email (Zod)</label>
                      <input
                        type="email"
                        value={secRegEmail}
                        onChange={(e) => setSecRegEmail(e.target.value)}
                        required
                        placeholder="syafiq@kampus.ac.id"
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-slate-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Password (Min 8)</label>
                      <input
                        type="password"
                        value={secRegPassword}
                        onChange={(e) => setSecRegPassword(e.target.value)}
                        required
                        placeholder="Sandi rahasia Anda"
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-slate-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Peran Akses (Role)</label>
                      <select
                        value={secRegRole}
                        onChange={(e) => setSecRegRole(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-slate-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="student">Student (Mahasiswa)</option>
                        <option value="lecturer">Lecturer (Dosen)</option>
                        <option value="kaprodi">Kaprodi</option>
                        <option value="dekan">Dekan</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Prodi / Unit Kerja</label>
                      <input
                        type="text"
                        value={secRegDept}
                        onChange={(e) => setSecRegDept(e.target.value)}
                        required
                        placeholder="Teknik Informatika"
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-slate-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Nomor Telepon</label>
                      <input
                        type="text"
                        value={secRegPhone}
                        onChange={(e) => setSecRegPhone(e.target.value)}
                        required
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-slate-900 dark:text-white font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1 border border-transparent"
                  >
                    <Fingerprint className="w-3.5 h-3.5" /> Registrasi User Aman
                  </button>
                </form>

                {secRegError && (
                  <p className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-500/15 rounded-xl text-xs font-semibold">
                    {secRegError}
                  </p>
                )}

                {secRegSuccess && (
                  <p className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> {secRegSuccess}
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Audit Event Stream Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 mt-6">
            <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-emerald-500" /> Event Stream Log Audit Keamanan Server (Live)
            </h3>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-850 space-y-2 font-mono text-[11px] leading-relaxed">
              {securityTelemetry?.logs && securityTelemetry.logs.length > 0 ? (
                securityTelemetry.logs.map((log: any, idx: number) => {
                  let badgeColor = 'text-blue-500 bg-blue-500/10';
                  if (log.type === 'WARNING') badgeColor = 'text-amber-500 bg-amber-500/10';
                  if (log.type === 'ALERT') badgeColor = 'text-rose-500 bg-rose-500/10';

                  return (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl flex items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider ${badgeColor}`}>
                          {log.type}
                        </span>
                        <div className="space-y-0.5">
                          <p className="text-slate-800 dark:text-slate-300 font-semibold">{log.message}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">IP: {log.ip} &bull; {new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400">Belum ada aktivitas log keamanan tercatat.</div>
              )}
            </div>
          </div>
        </Tabs.Content>

      </Tabs.Root>
    </div>
  );
}
