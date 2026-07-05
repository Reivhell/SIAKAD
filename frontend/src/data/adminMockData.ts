export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dosen' | 'mahasiswa' | 'kaprodi' | 'akademik';
  status: 'Aktif' | 'Non-Aktif';
  phone?: string;
  department?: string;
}

export interface AdminStudent {
  id: string;
  nim: string;
  name: string;
  prodi: string;
  angkatan: string;
  status: 'Aktif' | 'Cuti' | 'Lulus' | 'Drop Out';
  gpa: number;
  email: string;
  phone: string;
}

export interface AdminLecturer {
  id: string;
  nidn: string;
  name: string;
  jabatan: 'Asisten Ahli' | 'Lektor' | 'Lektor Kepala' | 'Guru Besar';
  prodi: string;
  status: 'Aktif' | 'Non-Aktif' | 'Tugas Belajar';
  email: string;
  phone: string;
}

export interface AdminProdi {
  id: string;
  kode: string;
  nama: string;
  jenjang: 'D3' | 'S1' | 'S2' | 'S3';
  akreditasi: 'Unggul' | 'A' | 'B' | 'C';
}

export interface AdminCourse {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  prodi: string;
  type: 'Wajib' | 'Pilihan';
  prerequisites?: string[];
}

export interface AdminRoom {
  id: string;
  kode: string;
  nama: string;
  kapasitas: number;
  lokasi: string;
  status: 'Tersedia' | 'Digunakan' | 'Perbaikan';
}

export interface AdminAcademicYear {
  id: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  isAktif: boolean;
  isKrsBuka: boolean;
}

export interface AdminClass {
  id: string;
  kodeMK: string;
  namaMK: string;
  kelas: string;
  sks: number;
  dosenId: string;
  dosenName: string;
  kapasitas: number;
  pesertaCount: number;
}

export interface AdminSchedule {
  id: string;
  classId: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulai: string;
  jamSelesai: string;
  ruangId: string;
}

export interface AdminKrsItem {
  id: string;
  studentNim: string;
  studentName: string;
  prodi: string;
  sksDiambil: number;
  status: 'Belum Mengisi' | 'Draft' | 'Diajukan' | 'Disetujui' | 'Revisi';
  courses: string[]; // array of course code
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  target: 'Semua' | 'Mahasiswa' | 'Dosen';
  date: string;
  author: string;
}

export interface AdminActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  ip: string;
  time: string;
}

export interface AdminBillingInvoice {
  id: string;
  studentNim: string;
  amount: number;
  description: string;
  status: 'Lunas' | 'Belum Lunas';
}

// Initial values for our local reactive states
export const initialUsers: AdminUser[] = [
  { id: 'usr-1', name: 'Zulkifli Amin', email: 'admin.zul@siakad.ac.id', role: 'admin', status: 'Aktif', phone: '081234567890' },
  { id: 'usr-2', name: 'Dr. Hendra Wijaya', email: 'hendra@siakad.ac.id', role: 'dosen', status: 'Aktif', phone: '081298765432', department: 'Teknik Informatika' },
  { id: 'usr-3', name: 'Faisal Akbar', email: 'faisal.akbar@student.siakad.ac.id', role: 'mahasiswa', status: 'Aktif', phone: '085678901234', department: 'Teknik Informatika' },
  { id: 'usr-4', name: 'Dr. Budi Rahardjo', email: 'budi@siakad.ac.id', role: 'kaprodi', status: 'Aktif', phone: '081345678901', department: 'Sistem Informasi' },
  { id: 'usr-5', name: 'Sri Hartati, M.T.', email: 'sri@siakad.ac.id', role: 'akademik', status: 'Aktif', phone: '081398765432', department: 'Teknik Elektro' },
  { id: 'usr-6', name: 'Dian Safitri', email: 'dian.s@student.siakad.ac.id', role: 'mahasiswa', status: 'Aktif', phone: '085789012345', department: 'Sistem Informasi' },
  { id: 'usr-7', name: 'Prof. John Doe', email: 'johndoe@siakad.ac.id', role: 'dosen', status: 'Non-Aktif', phone: '081112223334', department: 'Kedokteran' }
];

export const initialStudents: AdminStudent[] = [
  { id: 'std-1', nim: '10118001', name: 'Faisal Akbar', prodi: 'Teknik Informatika', angkatan: '2022', status: 'Aktif', gpa: 3.58, email: 'faisal.akbar@student.siakad.ac.id', phone: '085678901234' },
  { id: 'std-2', nim: '10118002', name: 'Dian Safitri', prodi: 'Sistem Informasi', angkatan: '2022', status: 'Aktif', gpa: 3.65, email: 'dian.s@student.siakad.ac.id', phone: '085789012345' },
  { id: 'std-3', nim: '10118003', name: 'Aditya Pratama', prodi: 'Teknik Elektro', angkatan: '2021', status: 'Aktif', gpa: 3.12, email: 'aditya.p@student.siakad.ac.id', phone: '081234345656' },
  { id: 'std-4', nim: '10118004', name: 'Rina Herawati', prodi: 'Kedokteran', angkatan: '2020', status: 'Cuti', gpa: 3.82, email: 'rina.h@student.siakad.ac.id', phone: '081299998888' },
  { id: 'std-5', nim: '10118005', name: 'Guruh Soekarno', prodi: 'Manajemen', angkatan: '2019', status: 'Lulus', gpa: 3.45, email: 'guruh.s@student.siakad.ac.id', phone: '081277776666' },
  { id: 'std-6', nim: '10118006', name: 'Hendra Setiawan', prodi: 'Hukum', angkatan: '2021', status: 'Drop Out', gpa: 1.85, email: 'hendra.s@student.siakad.ac.id', phone: '085566667777' }
];

export const initialLecturers: AdminLecturer[] = [
  { id: 'lec-1', nidn: '0412088201', name: 'Dr. Hendra Wijaya', jabatan: 'Lektor Kepala', prodi: 'Teknik Informatika', status: 'Aktif', email: 'hendra@siakad.ac.id', phone: '081298765432' },
  { id: 'lec-2', nidn: '0415057802', name: 'Dra. Sri Hartati', jabatan: 'Lektor', prodi: 'Teknik Elektro', status: 'Aktif', email: 'sri@siakad.ac.id', phone: '081398765432' },
  { id: 'lec-3', nidn: '0420107203', name: 'Dr. Budi Rahardjo', jabatan: 'Guru Besar', prodi: 'Sistem Informasi', status: 'Aktif', email: 'budi@siakad.ac.id', phone: '081345678901' },
  { id: 'lec-4', nidn: '0430128504', name: 'Wawan Kuswara, M.T.', jabatan: 'Asisten Ahli', prodi: 'Teknik Informatika', status: 'Aktif', email: 'wawan@siakad.ac.id', phone: '085533334444' },
  { id: 'lec-5', nidn: '0411119005', name: 'Prof. John Doe', jabatan: 'Guru Besar', prodi: 'Kedokteran', status: 'Non-Aktif', email: 'johndoe@siakad.ac.id', phone: '081112223334' }
];

export const initialProdis: AdminProdi[] = [
  { id: 'prd-1', kode: 'IF', nama: 'Teknik Informatika', jenjang: 'S1', akreditasi: 'Unggul' },
  { id: 'prd-2', kode: 'SI', nama: 'Sistem Informasi', jenjang: 'S1', akreditasi: 'A' },
  { id: 'prd-3', kode: 'EE', nama: 'Teknik Elektro', jenjang: 'S1', akreditasi: 'B' },
  { id: 'prd-4', kode: 'MD', nama: 'Kedokteran', jenjang: 'S2', akreditasi: 'Unggul' },
  { id: 'prd-5', kode: 'MN', nama: 'Manajemen', jenjang: 'S1', akreditasi: 'A' },
  { id: 'prd-6', kode: 'HK', nama: 'Hukum', jenjang: 'S1', akreditasi: 'Unggul' }
];

export const initialCourses: AdminCourse[] = [
  { id: 'crs-1', kode: 'IF3110', nama: 'Pengembangan Aplikasi Web', sks: 3, semester: 5, prodi: 'Teknik Informatika', type: 'Wajib', prerequisites: ['IF1201'] },
  { id: 'crs-2', kode: 'IF3150', nama: 'Manajemen Proyek Perangkat Lunak', sks: 3, semester: 5, prodi: 'Teknik Informatika', type: 'Wajib' },
  { id: 'crs-3', kode: 'IF3170', nama: 'Kecerdasan Buatan', sks: 3, semester: 5, prodi: 'Teknik Informatika', type: 'Pilihan', prerequisites: ['IF2102'] },
  { id: 'crs-4', kode: 'IF3140', nama: 'Manajemen Basis Data', sks: 3, semester: 3, prodi: 'Teknik Informatika', type: 'Wajib' },
  { id: 'crs-5', kode: 'KU2071', nama: 'Pancasila dan Kewarganegaraan', sks: 2, semester: 1, prodi: 'Teknik Informatika', type: 'Wajib' },
  { id: 'crs-6', kode: 'SI2101', nama: 'Analisis dan Perancangan Sistem', sks: 3, semester: 3, prodi: 'Sistem Informasi', type: 'Wajib' },
  { id: 'crs-7', kode: 'EE4102', nama: 'Mikrokontroler Lanjut', sks: 4, semester: 7, prodi: 'Teknik Elektro', type: 'Pilihan' }
];

export const initialRooms: AdminRoom[] = [
  { id: 'rom-1', kode: 'R-202', nama: 'GKU Timur R-202', kapasitas: 40, lokasi: 'Gedung Kuliah Umum Timur Lantai 2', status: 'Tersedia' },
  { id: 'rom-2', kode: 'R-105', nama: 'Lab Komputasi R-105', kapasitas: 30, lokasi: 'Lab Teknik Informatika Lantai 1', status: 'Tersedia' },
  { id: 'rom-3', kode: 'R-304', nama: 'AULA Barat R-304', kapasitas: 120, lokasi: 'Gedung Barat Lantai 3', status: 'Tersedia' },
  { id: 'rom-4', kode: 'R-401', nama: 'Gedung Medis R-401', kapasitas: 35, lokasi: 'Gedung Fakultas Kedokteran Lantai 4', status: 'Perbaikan' }
];

export const initialAcademicYears: AdminAcademicYear[] = [
  { id: 'ay-1', tahunAjaran: '2023/2024', semester: 'Ganjil', isAktif: true, isKrsBuka: true },
  { id: 'ay-2', tahunAjaran: '2022/2023', semester: 'Genap', isAktif: false, isKrsBuka: false },
  { id: 'ay-3', tahunAjaran: '2022/2023', semester: 'Ganjil', isAktif: false, isKrsBuka: false }
];

export const initialClasses: AdminClass[] = [
  { id: 'cls-1', kodeMK: 'IF3110', namaMK: 'Pengembangan Aplikasi Web', kelas: 'K-01', sks: 3, dosenId: 'lec-1', dosenName: 'Dr. Hendra Wijaya', kapasitas: 40, pesertaCount: 28 },
  { id: 'cls-2', kodeMK: 'IF3170', namaMK: 'Kecerdasan Buatan', kelas: 'K-03', sks: 3, dosenId: 'lec-4', dosenName: 'Wawan Kuswara, M.T.', kapasitas: 35, pesertaCount: 15 },
  { id: 'cls-3', kodeMK: 'IF3150', namaMK: 'Manajemen Proyek Perangkat Lunak', kelas: 'K-01', sks: 3, dosenId: 'lec-2', dosenName: 'Dra. Sri Hartati', kapasitas: 45, pesertaCount: 32 }
];

export const initialSchedules: AdminSchedule[] = [
  { id: 'sch-1', classId: 'cls-1', hari: 'Rabu', jamMulai: '08:00', jamSelesai: '10:30', ruangId: 'rom-1' },
  { id: 'sch-2', classId: 'cls-2', hari: 'Rabu', jamMulai: '13:00', jamSelesai: '15:30', ruangId: 'rom-2' },
  { id: 'sch-3', classId: 'cls-3', hari: 'Selasa', jamMulai: '10:30', jamSelesai: '13:00', ruangId: 'rom-1' }
];

export const initialKrsData: AdminKrsItem[] = [
  { id: 'krs-1', studentNim: '10118001', studentName: 'Faisal Akbar', prodi: 'Teknik Informatika', sksDiambil: 8, status: 'Diajukan', courses: ['IF3110', 'IF3150', 'KU2071'] },
  { id: 'krs-2', studentNim: '10118002', studentName: 'Dian Safitri', prodi: 'Sistem Informasi', sksDiambil: 3, status: 'Disetujui', courses: ['SI2101'] },
  { id: 'krs-3', studentNim: '10118003', studentName: 'Aditya Pratama', prodi: 'Teknik Elektro', sksDiambil: 4, status: 'Draft', courses: ['EE4102'] },
  { id: 'krs-4', studentNim: '10118004', studentName: 'Rina Herawati', prodi: 'Kedokteran', sksDiambil: 0, status: 'Belum Mengisi', courses: [] }
];

export const initialAnnouncements: AdminAnnouncement[] = [
  { id: 'ann-1', title: 'Pendaftaran KRS Semester Ganjil 2026/2027 dibuka', content: 'Diingatkan kepada seluruh mahasiswa untuk segera melakukan pengisian KRS secara online di portal SIAKAD dari tanggal 1 Juli - 15 Juli 2026.', target: 'Semua', date: '25 Juni 2026', author: 'Bagian Akademik' },
  { id: 'ann-2', title: 'Sosialisasi Penulisan Proposal Skripsi & TA', content: 'Diberitahukan kepada mahasiswa angkatan 2022 bahwa sosialisasi proposal tugas akhir akan dilaksanakan pada Jumat, 27 Juni 2026 pukul 14:00 WIB via Zoom.', target: 'Mahasiswa', date: '24 Juni 2026', author: 'Kaprodi IF' },
  { id: 'ann-3', title: 'Batas Akhir Input Nilai Akhir Semester', content: 'Kepada bapak/ibu dosen pengampu matakuliah, mohon untuk segera menginput nilai akhir mahasiswa paling lambat 1 Juli 2026 pukul 23:59 WIB.', target: 'Dosen', date: '23 Juni 2026', author: 'Wakil Rektor Akademik' }
];

export const initialActivityLogs: AdminActivityLog[] = [
  { id: 'log-1', user: 'Zulkifli Amin', role: 'Admin', action: 'Login Sukses', ip: '192.168.10.12', time: '5 menit yang lalu' },
  { id: 'log-2', user: 'Sri Hartati, M.T.', role: 'Akademik', action: 'Input Pengumuman Akademik', ip: '10.50.120.44', time: '1 jam yang lalu' },
  { id: 'log-3', user: 'Dr. Hendra Wijaya', role: 'Dosen', action: 'Melakukan Persetujuan KRS Mahasiswa', ip: '192.168.10.15', time: '2 jam yang lalu' },
  { id: 'log-4', user: 'Faisal Akbar', role: 'Mahasiswa', action: 'Mengajukan KRS Semester Ganjil', ip: '114.122.34.89', time: '3 jam yang lalu' },
  { id: 'log-5', user: 'Zulkifli Amin', role: 'Admin', action: 'Melakukan Backup Database Utama', ip: '192.168.10.12', time: '5 jam yang lalu' }
];

export const initialBillingInvoices: AdminBillingInvoice[] = [
  { id: 'inv-1', studentNim: '10118001', amount: 5500000, description: 'UKT Semester Ganjil 2026/2027', status: 'Lunas' },
  { id: 'inv-2', studentNim: '10118002', amount: 5500000, description: 'UKT Semester Ganjil 2026/2027', status: 'Lunas' },
  { id: 'inv-3', studentNim: '10118003', amount: 5000000, description: 'UKT Semester Ganjil 2026/2027', status: 'Belum Lunas' },
  { id: 'inv-4', studentNim: '10118004', amount: 7500000, description: 'UKT Semester Ganjil 2026/2027', status: 'Belum Lunas' }
];
