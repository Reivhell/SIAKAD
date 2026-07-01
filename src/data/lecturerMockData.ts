export interface LecturerProfile {
  name: string;
  nidn: string;
  jabatan: string;
  prodi: string;
  email: string;
  phone: string;
  address: string;
  foto: string;
  riwayatPendidikan: { jenjang: string; institusi: string; prodi: string; tahun: string }[];
}

export interface JadwalMengajarItem {
  id: string;
  code: string;
  name: string;
  class: string;
  room: string;
  day: string;
  time: string;
  semester: string;
  sks: number;
  mahasiswaCount: number;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  class: string;
  sks: number;
  capacity: number;
  enrolled: number;
}

export interface StudentAcademic {
  nim: string;
  name: string;
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpha: number;
    total: number;
  };
  grades: {
    tugas: number;
    kuis: number;
    praktikum: number;
    uts: number;
    uas: number;
    final: number;
    gradeLetter: string;
  };
  krs: {
    courses: { code: string; name: string; sks: number }[];
    status: 'Pending' | 'Approved' | 'Revised';
    revisionNotes?: string;
  };
  ipkHistory: { semester: string; ipk: number }[];
  consultations: { date: string; topic: string; notes: string }[];
}

export interface JurnalItem {
  pertemuan: number;
  date: string;
  materi: string;
  pokokBahasan: string;
  subPokokBahasan: string;
  catatan: string;
  status: 'Selesai' | 'Jadwal Ulang';
  fileCount: number;
}

export interface TugasItem {
  id: string;
  classId: string;
  title: string;
  description: string;
  deadline: string;
  submissionsCount: number;
  attachments: string[];
}

export interface MateriItem {
  id: string;
  classId: string;
  title: string;
  type: 'PDF' | 'PPT' | 'Video' | 'Modul';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export interface SkripsiItem {
  id: string;
  nim: string;
  name: string;
  title: string;
  progressPercentage: number;
  status: 'Bimbingan' | 'Siap Kolokium' | 'Siap Sidang' | 'Lulus';
  logs: { date: string; note: string; approval: boolean }[];
  seminar?: { type: string; date: string; room: string; time: string };
}

export interface ChatMessage {
  id: string;
  sender: 'lecturer' | 'student';
  text: string;
  timestamp: string;
}

export interface ChatThread {
  studentNim: string;
  studentName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: ChatMessage[];
}

export const initialLecturerProfile: LecturerProfile = {
  name: 'Prof. Dr. Ir. David Alfrids, M.T.',
  nidn: '0421067802',
  jabatan: 'Guru Besar / Profesor',
  prodi: 'Teknik Informatika (S1)',
  email: 'david.alfrids@siakad.ac.id',
  phone: '+62 812-3456-7890',
  address: 'Jl. Kampus ITB No. 10, Bandung, Jawa Barat',
  foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  riwayatPendidikan: [
    { jenjang: 'S1', institusi: 'Institut Teknologi Bandung', prodi: 'Teknik Informatika', tahun: '2000' },
    { jenjang: 'S2', institusi: 'Nanyang Technological University', prodi: 'Computer Science', tahun: '2004' },
    { jenjang: 'S3', institusi: 'Kyoto University', prodi: 'Informatics', tahun: '2010' }
  ]
};

export const initialJadwalMengajar: JadwalMengajarItem[] = [
  { id: '1', code: 'IF3110', name: 'Pengembangan Aplikasi Web', class: 'IF-39-01', room: 'Lab Multimedia 3', day: 'Senin', time: '08:00 - 10:30', semester: 'Ganjil 2026/2027', sks: 3, mahasiswaCount: 38 },
  { id: '2', code: 'IF3150', name: 'Sistem Operasi', class: 'IF-39-02', room: 'Ruang Kuliah 402', day: 'Selasa', time: '13:00 - 15:30', semester: 'Ganjil 2026/2027', sks: 3, mahasiswaCount: 40 },
  { id: '3', code: 'IF3180', name: 'Sistem Temu Balik Informasi', class: 'IF-39-01', room: 'Ruang Kuliah 103', day: 'Kamis', time: '10:00 - 12:30', semester: 'Ganjil 2026/2027', sks: 3, mahasiswaCount: 35 }
];

export const initialKelas: ClassItem[] = [
  { id: 'IF3110-A', code: 'IF3110', name: 'Pengembangan Aplikasi Web', class: 'IF-39-01', sks: 3, capacity: 40, enrolled: 38 },
  { id: 'IF3150-B', code: 'IF3150', name: 'Sistem Operasi', class: 'IF-39-02', sks: 3, capacity: 40, enrolled: 40 },
  { id: 'IF3180-A', code: 'IF3180', name: 'Sistem Temu Balik Informasi', class: 'IF-39-01', sks: 3, capacity: 35, enrolled: 35 }
];

export const initialStudents: StudentAcademic[] = [
  {
    nim: '13521001',
    name: 'Ahmad Faiz',
    attendance: { hadir: 13, sakit: 1, izin: 0, alpha: 0, total: 14 },
    grades: { tugas: 85, kuis: 78, praktikum: 90, uts: 82, uas: 88, final: 84.7, gradeLetter: 'A' },
    krs: {
      courses: [
        { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3 },
        { code: 'IF3150', name: 'Sistem Operasi', sks: 3 },
        { code: 'IF3180', name: 'Sistem Temu Balik Informasi', sks: 3 }
      ],
      status: 'Pending'
    },
    ipkHistory: [
      { semester: 'Smt 1', ipk: 3.4 },
      { semester: 'Smt 2', ipk: 3.52 },
      { semester: 'Smt 3', ipk: 3.65 },
      { semester: 'Smt 4', ipk: 3.71 }
    ],
    consultations: [
      { date: '12 Jan 2026', topic: 'Persiapan PKL', notes: 'Mahasiswa berencana magang di Tokopedia, diarahkan mengajukan surat pengantar akademis.' },
      { date: '10 Mar 2026', topic: 'Evaluasi Pertengahan Studi', notes: 'IPK stabil di atas 3.5, sangat baik. Didorong untuk ikut kompetisi nasional.' }
    ]
  },
  {
    nim: '13521015',
    name: 'Budi Santoso',
    attendance: { hadir: 11, sakit: 2, izin: 1, alpha: 0, total: 14 },
    grades: { tugas: 70, kuis: 65, praktikum: 80, uts: 75, uas: 72, final: 72.3, gradeLetter: 'B' },
    krs: {
      courses: [
        { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3 },
        { code: 'IF3150', name: 'Sistem Operasi', sks: 3 }
      ],
      status: 'Approved'
    },
    ipkHistory: [
      { semester: 'Smt 1', ipk: 2.9 },
      { semester: 'Smt 2', ipk: 3.01 },
      { semester: 'Smt 3', ipk: 3.12 },
      { semester: 'Smt 4', ipk: 3.18 }
    ],
    consultations: [
      { date: '15 Feb 2026', topic: 'Kesulitan Belajar Sistem Operasi', notes: 'Menyarankan mahasiswa membuat kelompok belajar tambahan dan membaca jurnal rujukan.' }
    ]
  },
  {
    nim: '13521045',
    name: 'Citra Lestari',
    attendance: { hadir: 14, sakit: 0, izin: 0, alpha: 0, total: 14 },
    grades: { tugas: 95, kuis: 92, praktikum: 98, uts: 90, uas: 94, final: 93.6, gradeLetter: 'A' },
    krs: {
      courses: [
        { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3 },
        { code: 'IF3150', name: 'Sistem Operasi', sks: 3 },
        { code: 'IF3180', name: 'Sistem Temu Balik Informasi', sks: 3 }
      ],
      status: 'Revised',
      revisionNotes: 'SKS terlalu banyak melebihi batas IPK semester lalu, kurangi satu matkul opsional.'
    },
    ipkHistory: [
      { semester: 'Smt 1', ipk: 3.8 },
      { semester: 'Smt 2', ipk: 3.91 },
      { semester: 'Smt 3', ipk: 3.88 },
      { semester: 'Smt 4', ipk: 3.94 }
    ],
    consultations: [
      { date: '20 Jan 2026', topic: 'Rencana Skripsi Jalur Cepat (Fast Track)', notes: 'Sangat direkomendasikan karena IPK istimewa. Meminta mahasiswa merancang draf proposal.' }
    ]
  },
  {
    nim: '13521089',
    name: 'Dedi Kurniawan',
    attendance: { hadir: 10, sakit: 1, izin: 0, alpha: 3, total: 14 },
    grades: { tugas: 60, kuis: 55, praktikum: 70, uts: 58, uas: 62, final: 61.1, gradeLetter: 'C' },
    krs: {
      courses: [
        { code: 'IF3150', name: 'Sistem Operasi', sks: 3 },
        { code: 'IF3180', name: 'Sistem Temu Balik Informasi', sks: 3 }
      ],
      status: 'Pending'
    },
    ipkHistory: [
      { semester: 'Smt 1', ipk: 2.5 },
      { semester: 'Smt 2', ipk: 2.62 },
      { semester: 'Smt 3', ipk: 2.71 },
      { semester: 'Smt 4', ipk: 2.65 }
    ],
    consultations: [
      { date: '05 Mar 2026', topic: 'Masalah Absensi', notes: 'Mengingatkan keras batas kehadiran 75% untuk dapat mengikuti UAS. Mahasiswa berjanji memperbaiki.' }
    ]
  }
];

export const initialJurnal: JurnalItem[] = [
  { pertemuan: 1, date: '2026-06-01', materi: 'Kontrak Perkuliahan & Pengantar Basis Data', pokokBahasan: 'Pengantar SIAKAD & DB', subPokokBahasan: 'Instalasi, Arsitektur 3-tier', catatan: 'Kuliah perdana lancar, mahasiswa hadir lengkap.', status: 'Selesai', fileCount: 1 },
  { pertemuan: 2, date: '2026-06-08', materi: 'Pemodelan Relasional & ERD', pokokBahasan: 'Entity-Relationship Model', subPokokBahasan: 'Entitas, Atribut, Kardinalitas Relasi', catatan: 'Sesi latihan langsung merancang ERD perpustakaan.', status: 'Selesai', fileCount: 2 },
  { pertemuan: 3, date: '2026-06-15', materi: 'Normalisasi Basis Data', pokokBahasan: 'Normalisasi Data', subPokokBahasan: '1NF, 2NF, 3NF, BCNF', catatan: 'Banyak pertanyaan terkait anomali update data.', status: 'Selesai', fileCount: 1 }
];

export const initialTugas: TugasItem[] = [
  { id: 'T1', classId: 'IF3110-A', title: 'Tugas 1: Desain Basis Data Fisik', description: 'Buatlah file DDL SQL untuk skema relasional perpustakaan lengkap dengan indeks dan foreign key constraints.', deadline: '2026-07-02 23:59', submissionsCount: 36, attachments: ['Panduan_Tugas1.pdf'] },
  { id: 'T2', classId: 'IF3150-B', title: 'Tugas 2: Simulasi CPU Scheduling', description: 'Implementasikan program simulasi scheduler FCFS, SJF, dan Round Robin menggunakan Node.js/Python.', deadline: '2026-07-10 23:59', submissionsCount: 38, attachments: ['Template_Simulasi.zip'] }
];

export const initialMateri: MateriItem[] = [
  { id: 'M1', classId: 'IF3110-A', title: 'Slide Pertemuan 1: Pengantar Web App', type: 'PDF', fileName: 'P1_Web_Introduction.pdf', fileSize: '2.4 MB', uploadedAt: '2026-06-01' },
  { id: 'M2', classId: 'IF3110-A', title: 'Video Tutorial: Setup Express & SQLite', type: 'Video', fileName: 'tutorial_express_setup.mp4', fileSize: '45.1 MB', uploadedAt: '2026-06-05' },
  { id: 'M3', classId: 'IF3150-B', title: 'Slide Pertemuan 2: Proses & Thread', type: 'PPT', fileName: 'P2_Process_Threads.pptx', fileSize: '5.8 MB', uploadedAt: '2026-06-08' }
];

export const initialSkripsi: SkripsiItem[] = [
  {
    id: 'S1',
    nim: '13521001',
    name: 'Ahmad Faiz',
    title: 'Analisis Keamanan Smart Contract pada Jaringan Ethereum Menggunakan Algoritma Heuristik',
    progressPercentage: 80,
    status: 'Siap Kolokium',
    logs: [
      { date: '2026-05-10', note: 'Bab 1-3 disetujui, lanjut bab 4 pengujian', approval: true },
      { date: '2026-06-02', note: 'Revisi implementasi kode pemindaian contract', approval: false },
      { date: '2026-06-20', note: 'Hasil pengujian Bab 4 disetujui, siap maju kolokium', approval: true }
    ],
    seminar: { type: 'Kolokium Skripsi', date: '2026-07-05', room: 'Ruang Sidang Utama', time: '10:00 - 11:30' }
  },
  {
    id: 'S2',
    nim: '13521015',
    name: 'Budi Santoso',
    title: 'Rancang Bangun Sistem Klasifikasi Sentiment Twitter Terhadap Pilkada Berbasis BERT',
    progressPercentage: 45,
    status: 'Bimbingan',
    logs: [
      { date: '2026-05-20', note: 'Pengumpulan dataset Twitter dan pembersihan teks', approval: true },
      { date: '2026-06-18', note: 'Mulai training model BERT dasar, hasil evaluasi awal masih overfitting', approval: false }
    ]
  }
];

export const initialChats: ChatThread[] = [
  {
    studentNim: '13521001',
    studentName: 'Ahmad Faiz',
    lastMessage: 'Mohon izin bimbingan besok pagi Prof.',
    timestamp: '20:15',
    unread: true,
    messages: [
      { id: 'm1', sender: 'student', text: 'Selamat sore Prof, apakah draf bab 4 saya sudah sempat diperiksa?', timestamp: '16:00' },
      { id: 'm2', sender: 'lecturer', text: 'Sudah Ahmad, secara umum bagus. Tolong perbaiki representasi tabel hasil ujinya.', timestamp: '17:30' },
      { id: 'm3', sender: 'student', text: 'Baik Prof, saya edit malam ini. Mohon izin bimbingan besok pagi Prof.', timestamp: '20:15' }
    ]
  },
  {
    studentNim: '13521045',
    studentName: 'Citra Lestari',
    lastMessage: 'Terima kasih banyak atas persetujuan KRS nya Prof!',
    timestamp: 'Yesterday',
    unread: false,
    messages: [
      { id: 'm4', sender: 'lecturer', text: 'Citra, saya sudah setujui revisi KRS kamu ya.', timestamp: '11:20' },
      { id: 'm5', sender: 'student', text: 'Terima kasih banyak atas persetujuan KRS nya Prof!', timestamp: '11:45' }
    ]
  }
];
