import axios from 'axios';

// Configured Axios instance
export const axiosClient = axios.create({
  baseURL: 'https://api.siakad-portal-demo.org/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Data for courses
export interface ApiCourse {
  id: string;
  code: string;
  name: string;
  sks: number;
  grade: string;
  point: number;
  semester: number;
  lecturer: string;
}

const mockCourses: ApiCourse[] = [
  { id: 'c1', code: 'INF301', name: 'Rekayasa Perangkat Lunak', sks: 3, grade: 'A', point: 4.0, semester: 5, lecturer: 'Dr. Ir. Budi Santoso, M.T.' },
  { id: 'c2', code: 'INF302', name: 'Kecerdasan Buatan (AI)', sks: 3, grade: 'A-', point: 3.7, semester: 5, lecturer: 'Prof. Dr. Elizabeth, M.Sc.' },
  { id: 'c3', code: 'INF303', name: 'Pemrograman Web Enterprise', sks: 4, grade: 'B+', point: 3.3, semester: 5, lecturer: 'Ahmad Fauzi, S.Kom., M.T.' },
  { id: 'c4', code: 'INF304', name: 'Keamanan Jaringan Komputer', sks: 3, grade: 'A', point: 4.0, semester: 5, lecturer: 'Dian Kartika, M.Kom.' },
  { id: 'c5', code: 'INF305', name: 'Interaksi Manusia & Komputer', sks: 2, grade: 'B', point: 3.0, semester: 5, lecturer: 'Hendra Wijaya, Ph.D.' },
  { id: 'c6', code: 'INF306', name: 'Sistem Terdistribusi', sks: 3, grade: 'B-', point: 2.7, semester: 5, lecturer: 'Riana Lestari, S.T., M.Cs.' },
  { id: 'c7', code: 'INF307', name: 'Metodologi Penelitian TI', sks: 2, grade: 'A', point: 4.0, semester: 5, lecturer: 'Dr. Yusuf Mansur, M.T.' },
];

export interface ApiAnnouncement {
  id: string;
  title: string;
  category: 'Akademik' | 'Keuangan' | 'Event';
  date: string;
  content: string;
}

const mockAnnouncements: ApiAnnouncement[] = [
  { id: 'a1', title: 'Jadwal Pengisian KRS Semester Ganjil 2026/2027', category: 'Akademik', date: '2026-06-25', content: 'Diinformasikan kepada mahasiswa bahwa pengisian KRS dapat dilakukan mulai tanggal 1-14 Agustus 2026.' },
  { id: 'a2', title: 'Pembayaran UKT Gelombang II Diperpanjang', category: 'Keuangan', date: '2026-06-24', content: 'Batas akhir pembayaran UKT gelombang II diperpanjang hingga tanggal 25 Juli 2026 pukul 16:00 WIB.' },
  { id: 'a3', title: 'Workshop Pemanfaatan AI dalam Riset Mahasiswa', category: 'Event', date: '2026-06-20', content: 'Ikuti workshop nasional pemanfaatan AI yang diselenggarakan pada 5 Juli 2026 di Auditorium Utama.' },
];

// Axios Mock Interceptor simulator to return local mock responses beautifully
export const fetchAcademicCourses = async (): Promise<ApiCourse[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockCourses;
};

export const fetchAcademicAnnouncements = async (): Promise<ApiAnnouncement[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockAnnouncements;
};

export const submitAbsenceForm = async (formData: any): Promise<{ success: boolean; message: string; data: any }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    message: 'Form pengajuan dispensasi/absen berhasil dikirim dan divalidasi!',
    data: formData,
  };
};
