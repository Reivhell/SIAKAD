import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import argon2 from 'argon2';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

// Login dev: setiap akun pakai password yang sama dari env, default di bawah.
const plainPassword = process.env.DEFAULT_SEED_PASSWORD || 'Siakad@2025';

const usersToSeed = [
  { id: 'u-admin', username: 'admin@kampus.ac.id', email: 'admin@kampus.ac.id', name: 'Hendra Wijaya, M.T.', role: 'admin', phone: '0812-9988-7766', department: 'Direktorat Sistem Informasi' },
  { id: 'u-dekan', username: 'dekan@kampus.ac.id', email: 'dekan@kampus.ac.id', name: 'Prof. Dr. Faisal Akbar, M.Eng.', role: 'dekan', phone: '0812-7777-6666', department: 'Fakultas Teknologi Informasi' },
  { id: 'u-kaprodi', username: 'kaprodi@kampus.ac.id', email: 'kaprodi@kampus.ac.id', name: 'Dr. Dewi Rahmawati, M.Kom.', role: 'kaprodi', phone: '0813-4567-8901', department: 'Teknik Informatika' },
  { id: 'u-dosen', username: 'budi.rahardjo@kampus.ac.id', email: 'budi.rahardjo@kampus.ac.id', name: 'Dr. Budi Rahardjo, M.T.', role: 'lecturer', phone: '0811-2233-4455', department: 'Teknik Informatika' },
  { id: 'u-dosen2', username: 'sri.hartati@kampus.ac.id', email: 'sri.hartati@kampus.ac.id', name: 'Dra. Sri Hartati, M.Sc.', role: 'lecturer', phone: '0811-8877-6655', department: 'Sistem Informasi' },
  { id: 'u-mhs', username: 'ahmad.syafiq@mahasiswa.ac.id', email: 'ahmad.syafiq@mahasiswa.ac.id', name: 'Ahmad Syafiq', role: 'student', phone: '0812-3456-7890', department: 'Teknik Informatika' },
  { id: 'u-mhs2', username: 'dian.safitri@mahasiswa.ac.id', email: 'dian.safitri@mahasiswa.ac.id', name: 'Dian Safitri', role: 'student', phone: '0812-1112-1314', department: 'Sistem Informasi' },
  { id: 'u-mhs3', username: 'aditya.pratama@mahasiswa.ac.id', email: 'aditya.pratama@mahasiswa.ac.id', name: 'Aditya Pratama', role: 'student', phone: '0812-2223-2425', department: 'Teknik Elektro' },
  { id: 'u-mhs4', username: 'budi.santoso@mahasiswa.ac.id', email: 'budi.santoso@mahasiswa.ac.id', name: 'Budi Santoso', role: 'student', phone: '0812-3334-3536', department: 'Teknik Informatika' },
  { id: 'u-mhs5', username: 'citra.kirana@mahasiswa.ac.id', email: 'citra.kirana@mahasiswa.ac.id', name: 'Citra Kirana', role: 'student', phone: '0812-4445-4647', department: 'Teknik Informatika' },
  { id: 'u-mhs6', username: 'dewi.lestari@mahasiswa.ac.id', email: 'dewi.lestari@mahasiswa.ac.id', name: 'Dewi Lestari', role: 'student', phone: '0812-5556-5758', department: 'Teknik Informatika' },
  { id: 'u-mhs7', username: 'gita.wirjawan@mahasiswa.ac.id', email: 'gita.wirjawan@mahasiswa.ac.id', name: 'Gita Wirjawan', role: 'student', phone: '0812-6667-6869', department: 'Teknik Informatika' },
  { id: 'u-baak', username: 'baak@kampus.ac.id', email: 'baak@kampus.ac.id', name: 'Ir. Hermawan', role: 'baak', phone: '0812-1122-3344', department: 'Administrasi Akademik' },
  { id: 'u-bauk', username: 'bauk@kampus.ac.id', email: 'bauk@kampus.ac.id', name: 'Siti Aminah, S.E.', role: 'bauk', phone: '0812-5566-7788', department: 'Biro Keuangan' },
  { id: 'u-alumni', username: 'rian.hidayat@alumni.ac.id', email: 'rian.hidayat@alumni.ac.id', name: 'Rian Hidayat, S.Kom.', role: 'alumni', phone: '0812-3456-7890', department: 'Teknik Informatika' },
  { id: 'u-applicant', username: 'calon@mahasiswa.ac.id', email: 'calon@mahasiswa.ac.id', name: 'Rian Hidayat', role: 'applicant', phone: '0812-3344-5566', department: 'Penerimaan Mahasiswa Baru' },
  // Akun khusus uji integrasi (auth-krs): datanya boleh dimutasi bebas oleh test,
  // tidak dipakai seed data kanonik lain (presensi, akademik) supaya tidak saling ganggu.
  { id: 'u-itest', username: 'itest.mahasiswa@mahasiswa.ac.id', email: 'itest.mahasiswa@mahasiswa.ac.id', name: 'Ivan Mahasiswa', role: 'student', phone: '0812-0000-0099', department: 'Teknik Informatika' },
];

const krsToSeed = [
  { id: 'krs-1', studentNim: '10118001', studentName: 'Ahmad Syafiq', studentEmail: 'ahmad.syafiq@mahasiswa.ac.id', prodi: 'Teknik Informatika', sksDiambil: 14, status: 'Diajukan', courses: ['IF3110', 'IF3150', 'IF3170', 'IF3140', 'KU2071'] },
  { id: 'krs-2', studentNim: '10118002', studentName: 'Dian Safitri', studentEmail: 'dian.safitri@mahasiswa.ac.id', prodi: 'Sistem Informasi', sksDiambil: 9, status: 'Disetujui', courses: ['SI2101', 'SI2201', 'SI2301'] },
  { id: 'krs-3', studentNim: '10118003', studentName: 'Aditya Pratama', studentEmail: 'aditya.pratama@mahasiswa.ac.id', prodi: 'Teknik Elektro', sksDiambil: 4, status: 'Draft', courses: ['EE4102'] },
  { id: 'krs-4', studentNim: '10118004', studentName: 'Budi Santoso', studentEmail: 'budi.santoso@mahasiswa.ac.id', prodi: 'Teknik Informatika', sksDiambil: 12, status: 'Disetujui', courses: ['IF3110', 'IF3150', 'IF3170', 'KU2071'] },
  { id: 'krs-5', studentNim: '10118005', studentName: 'Citra Kirana', studentEmail: 'citra.kirana@mahasiswa.ac.id', prodi: 'Teknik Informatika', sksDiambil: 12, status: 'Disetujui', courses: ['IF3110', 'IF3150', 'IF3170', 'KU2071'] },
  { id: 'krs-6', studentNim: '10118006', studentName: 'Dewi Lestari', studentEmail: 'dewi.lestari@mahasiswa.ac.id', prodi: 'Teknik Informatika', sksDiambil: 12, status: 'Disetujui', courses: ['IF3110', 'IF3150', 'IF3170', 'KU2071'] },
  { id: 'krs-7', studentNim: '10118007', studentName: 'Gita Wirjawan', studentEmail: 'gita.wirjawan@mahasiswa.ac.id', prodi: 'Teknik Informatika', sksDiambil: 12, status: 'Disetujui', courses: ['IF3110', 'IF3150', 'IF3170', 'KU2071'] },
  // KRS khusus uji integrasi (auth-krs). Tidak memuat IF3110/IF3170 agar roster
  // presensi & dashboard akademik pada data kanonik tidak berubah.
  { id: 'krs-itest', studentNim: '10118099', studentName: 'Ivan Mahasiswa', studentEmail: 'itest.mahasiswa@mahasiswa.ac.id', prodi: 'Teknik Informatika', sksDiambil: 2, status: 'Diajukan', courses: ['KU2071'] },
];

async function main() {
  // Users (idempotent: hanya saat kosong)
  if ((await prisma.user.count()) === 0) {
    const hash = await argon2.hash(plainPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 12,
      timeCost: 3,
      parallelism: 1,
    });
    for (const u of usersToSeed) {
      await prisma.user.create({ data: { ...u, passwordHash: hash, hashingAlgo: 'argon2' } });
    }
  }

  // KRS
  if ((await prisma.krsItem.count()) === 0) {
    for (const k of krsToSeed) {
      const { courses, ...rest } = k;
      await prisma.krsItem.create({ data: { ...rest, coursesJson: JSON.stringify(courses) } });
    }
  }

  // ── Domain akademik ────────────────────────────────────────────────
  if ((await prisma.academicPeriod.count()) === 0) {
    const periods = [
      { code: '2023/2024-Ganjil', label: '2023/2024 Ganjil', isActive: false },
      { code: '2023/2024-Genap', label: '2023/2024 Genap', isActive: false },
      { code: '2024/2025-Ganjil', label: '2024/2025 Ganjil', isActive: false },
      { code: '2024/2025-Genap', label: '2024/2025 Genap', isActive: false },
      { code: '2025/2026-Ganjil', label: '2025/2026 Ganjil', isActive: true },
    ];
    await prisma.academicPeriod.createMany({ data: periods });
  }

  if ((await prisma.courseOffering.count()) === 0) {
    const courses = [
      { code: 'IF3110', name: 'Pengembangan Aplikasi Web', sks: 3, program: 'Teknik Informatika', lecturer: 'Dr. Budi Rahardjo, M.T.', schedule: 'Senin, 08:00 - 10:30', room: 'GKU Timur R-202' },
      { code: 'IF3150', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, program: 'Teknik Informatika', lecturer: 'Dra. Sri Hartati, M.Sc.', schedule: 'Selasa, 10:30 - 13:00', room: 'Lab Komputasi R-105' },
      { code: 'IF3170', name: 'Kecerdasan Buatan', sks: 3, program: 'Teknik Informatika', lecturer: 'Dr. Budi Rahardjo, M.T.', schedule: 'Rabu, 13:00 - 15:30', room: 'Lab Komputasi R-105' },
      { code: 'IF3140', name: 'Manajemen Basis Data', sks: 3, program: 'Teknik Informatika', lecturer: 'Wawan Kuswara, M.T.', schedule: 'Kamis, 08:00 - 10:30', room: 'GKU Barat R-301' },
      { code: 'KU2071', name: 'Pancasila dan Kewarganegaraan', sks: 2, program: 'Teknik Informatika', lecturer: 'Tim MPK', schedule: 'Jumat, 14:00 - 15:40', room: 'Ruang Serbaguna' },
      { code: 'SI2101', name: 'Analisis dan Desain Sistem', sks: 3, program: 'Sistem Informasi', lecturer: 'Dra. Sri Sati, M.Sc.', schedule: 'Senin, 13:00 - 15:30', room: 'Lab SI R-201' },
      { code: 'EE4102', name: 'Sistem Kendali Digital', sks: 4, program: 'Teknik Elektro', lecturer: 'Ir. Bambang Purnomo', schedule: 'Kamis, 13:00 - 16:00', room: 'Lab Elektro R-110' },
    ];
    await prisma.courseOffering.createMany({ data: courses });
  }

  if ((await prisma.gpaTrend.count()) === 0) {
    const trends = [
      { academicYear: '2020', gpaAvg: 3.25 },
      { academicYear: '2021', gpaAvg: 3.41 },
      { academicYear: '2022', gpaAvg: 3.38 },
      { academicYear: '2023', gpaAvg: 3.52 },
      { academicYear: '2024', gpaAvg: 3.58 },
    ];
    await prisma.gpaTrend.createMany({ data: trends });
  }

  if ((await prisma.facultyDistribution.count()) === 0) {
    const dist = [
      { program: 'Teknik', students: 1200 },
      { program: 'Ekonomi', students: 950 },
      { program: 'Hukum', students: 680 },
      { program: 'Kedokteran', students: 450 },
      { program: 'Ilkom', students: 820 },
    ];
    await prisma.facultyDistribution.createMany({ data: dist });
  }

  if ((await prisma.studentGpaHistory.count()) === 0) {
    const h = (data: Array<Record<string, unknown>>) =>
      Promise.all(data.map((d) => prisma.studentGpaHistory.create({ data: d as any })));
    await Promise.all([
      h([
        { nim: 'ahmad.syafiq', semester: 'Smt 1', ips: 3.4, ipk: 3.4 },
        { nim: 'ahmad.syafiq', semester: 'Smt 2', ips: 3.55, ipk: 3.48 },
        { nim: 'ahmad.syafiq', semester: 'Smt 3', ips: 3.52, ipk: 3.49 },
        { nim: 'ahmad.syafiq', semester: 'Smt 4', ips: 3.65, ipk: 3.53 },
        { nim: 'ahmad.syafiq', semester: 'Smt 5', ips: 3.78, ipk: 3.58 },
      ]),
      h([
        { nim: 'dian.safitri', semester: 'Smt 1', ips: 3.2, ipk: 3.2 },
        { nim: 'dian.safitri', semester: 'Smt 2', ips: 3.35, ipk: 3.28 },
        { nim: 'dian.safitri', semester: 'Smt 3', ips: 3.4, ipk: 3.32 },
      ]),
    ]);
  }

  // ── Domain akademik umum: Prodi, Ruang, Pengumuman, Tanggal ───────
  if ((await prisma.prodi.count()) === 0) {
    await prisma.prodi.createMany({
      data: [
        { kode: 'IF', nama: 'Teknik Informatika', jenjang: 'S1', akreditasi: 'Unggul' },
        { kode: 'SI', nama: 'Sistem Informasi', jenjang: 'S1', akreditasi: 'A' },
        { kode: 'EL', nama: 'Teknik Elektro', jenjang: 'S1', akreditasi: 'A' },
        { kode: 'DK', nama: 'Kedokteran', jenjang: 'S1', akreditasi: 'Unggul' },
        { kode: 'MJ', nama: 'Manajemen', jenjang: 'S1', akreditasi: 'A' },
        { kode: 'HK', nama: 'Hukum', jenjang: 'S1', akreditasi: 'B' },
      ],
    });
  }

  if ((await prisma.room.count()) === 0) {
    await prisma.room.createMany({
      data: [
        { kode: 'R-101', nama: 'Ruang Kuliah 101', kapasitas: 45, lokasi: 'GKU Barat Lt.1', status: 'Tersedia' },
        { kode: 'R-202', nama: 'Ruang Kuliah 202', kapasitas: 50, lokasi: 'GKU Timur Lt.2', status: 'Tersedia' },
        { kode: 'R-301', nama: 'Ruang Kuliah 301', kapasitas: 48, lokasi: 'GKU Barat Lt.3', status: 'Digunakan' },
        { kode: 'R-402', nama: 'Ruang Kuliah 402', kapasitas: 40, lokasi: 'GKU Timur Lt.4', status: 'Tersedia' },
        { kode: 'LAB-1', nama: 'Lab Komputer 1', kapasitas: 30, lokasi: 'Lab Komputasi Lt.1', status: 'Tersedia' },
        { kode: 'LAB-3', nama: 'Lab Komputer 3', kapasitas: 30, lokasi: 'Lab Komputasi Lt.2', status: 'Digunakan' },
        { kode: 'AULA', nama: 'Aula Serbaguna', kapasitas: 200, lokasi: 'Gedung Pusat', status: 'Tersedia' },
      ],
    });
  }

  if ((await prisma.announcement.count()) === 0) {
    await prisma.announcement.createMany({
      data: [
        { title: 'Pendaftaran Yudisium & Wisuda Periode II Tahun 2026', content: 'Diberitahukan kepada seluruh mahasiswa tingkat akhir bahwa pendaftaran wisuda periode II dibuka hingga 15 Juli 2026.', target: 'Semua', date: '25 Juni 2026', author: 'BAAK', createdAt: new Date().toISOString() },
        { title: 'Kuliah Umum Internasional: Masa Depan Web 3.0 & AI Terintegrasi', content: 'Menghadirkan narasumber dari Google DeepMind dan praktisi global. Dilaksanakan secara hybrid di Aula Barat.', target: 'Semua', date: '22 Juni 2026', author: 'BAAK', createdAt: new Date().toISOString() },
        { title: 'Batas Akhir Penangguhan & Pembayaran UKT Semester Ganjil 2026/2027', content: 'Batas akhir pembayaran UKT diperpanjang hingga tanggal 3 Agustus 2026 pukul 16:00 WIB.', target: 'Mahasiswa', date: '18 Juni 2026', author: 'BAUK', createdAt: new Date().toISOString() },
        { title: 'Pengingat Pengisian Jurnal Mengajar Dosen Pekan ke-8', content: 'Seluruh dosen diharapkan melengkapi jurnal mengajar minimal 8 pertemuan sebelum akhir bulan.', target: 'Dosen', date: '20 Juni 2026', author: 'BAAK', createdAt: new Date().toISOString() },
      ],
    });
  }

  if ((await prisma.academicDate.count()) === 0) {
    await prisma.academicDate.createMany({
      data: [
        { title: 'Awal Perkuliahan Ganjil', date: '2026-08-18', period: '2025/2026-Ganjil' },
        { title: 'Batas Akhir Pengisian Rencana Studi (KRS)', date: '2026-08-29', period: '2025/2026-Ganjil' },
        { title: 'UTS Ganjil', date: '2026-10-19', period: '2025/2026-Ganjil' },
        { title: 'UAS Ganjil', date: '2026-12-14', period: '2025/2026-Ganjil' },
        { title: 'Pengumuman IPK Semester', date: '2027-01-25', period: '2025/2026-Ganjil' },
      ],
    });
  }

  // ── Profil dosen, materi, tugas, nilai, konsultasi, chat, skripsi ──
  if ((await prisma.lecturerProfile.count()) === 0) {
    await prisma.lecturerProfile.createMany({
      data: [
        {
          userId: 'u-dosen',
          nidn: '0412088201',
          jabatan: 'Lektor Kepala',
          prodi: 'Teknik Informatika',
          address: 'Jl. Setiabudi No. 112, Bandung, Jawa Barat',
          phone: '0811-2233-4455',
          riwayatJson: JSON.stringify([
            { jenjang: 'S3', institusi: 'Institut Teknologi Bandung', prodi: 'Informatika', tahun: '2015' },
            { jenjang: 'S2', institusi: 'Universitas Gadjah Mada', prodi: 'Ilmu Komputer', tahun: '2010' },
            { jenjang: 'S1', institusi: 'Universitas Indonesia', prodi: 'Teknik Informatika', tahun: '2005' },
          ]),
        },
        {
          userId: 'u-dosen2',
          nidn: '0413987654',
          jabatan: 'Lektor',
          prodi: 'Sistem Informasi',
          address: 'Jl. Cihampelas No. 45, Bandung, Jawa Barat',
          phone: '0811-8877-6655',
          riwayatJson: JSON.stringify([
            { jenjang: 'S2', institusi: 'Universitas Bina Nusantara', prodi: 'Sistem Informasi', tahun: '2012' },
            { jenjang: 'S1', institusi: 'Universitas Padjadjaran', prodi: 'Manajemen Informatika', tahun: '2007' },
          ]),
        },
      ],
    });
  }

  if ((await prisma.courseMaterial.count()) === 0) {
    await prisma.courseMaterial.createMany({
      data: [
        { courseCode: 'IF3110', title: 'Pertemuan 1 - Pengenalan Arsitektur Web', type: 'PDF', fileName: 'if3110_p1_arsitektur_web.pdf', fileSize: '2.4 MB', uploadedAt: '18 Agustus 2026', lecturerEmail: 'budi.rahardjo@kampus.ac.id' },
        { courseCode: 'IF3110', title: 'Pertemuan 2 - REST API & HTTP', type: 'PPT', fileName: 'if3110_p2_rest_api.pptx', fileSize: '4.8 MB', uploadedAt: '25 Agustus 2026', lecturerEmail: 'budi.rahardjo@kampus.ac.id' },
        { courseCode: 'IF3170', title: 'Modul 1 - Dasar Machine Learning', type: 'Modul', fileName: 'if3170_m1_ml_basics.pdf', fileSize: '6.1 MB', uploadedAt: '19 Agustus 2026', lecturerEmail: 'budi.rahardjo@kampus.ac.id' },
        { courseCode: 'IF3170', title: 'Video Tutorial - Neural Network', type: 'Video', fileName: 'if3170_v1_nn.mp4', fileSize: '120 MB', uploadedAt: '26 Agustus 2026', lecturerEmail: 'budi.rahardjo@kampus.ac.id' },
        { courseCode: 'IF3150', title: 'Pertemuan 1 - Pengantar Manajemen Proyek', type: 'PDF', fileName: 'if3150_p1_intro.pdf', fileSize: '1.8 MB', uploadedAt: '18 Agustus 2026', lecturerEmail: 'sri.hartati@kampus.ac.id' },
      ],
    });
  }

  if ((await prisma.assignment.count()) === 0) {
    await prisma.assignment.createMany({
      data: [
        { courseCode: 'IF3110', classLabel: 'IF3110-A', title: 'Tugas 1: Membangun REST API Sederhana', description: 'Buat REST API CRUD dengan Express, sertakan dokumentasi endpoint.', deadline: '12 September 2026', createdAt: '28 Agustus 2026', lecturerEmail: 'budi.rahardjo@kampus.ac.id' },
        { courseCode: 'IF3110', classLabel: 'IF3110-A', title: 'Tugas 2: Frontend React + Integrasi API', description: 'Integrasikan API buatan pada Tugas 1 ke halaman React.', deadline: '3 Oktober 2026', createdAt: '20 September 2026', lecturerEmail: 'budi.rahardjo@kampus.ac.id' },
        { courseCode: 'IF3170', classLabel: 'IF3170-A', title: 'Tugas 1: Klasifikasi Gambar dengan CNN', description: 'Latih model CNN untuk klasifikasi dataset CIFAR-10.', deadline: '20 September 2026', createdAt: '30 Agustus 2026', lecturerEmail: 'budi.rahardjo@kampus.ac.id' },
        { courseCode: 'IF3150', classLabel: 'IF3150-A', title: 'Tugas 1: Analisis Stakeholder Proyek', description: 'Identifikasi stakeholder dan matrix RACI proyek berkelanjutan.', deadline: '15 September 2026', createdAt: '29 Agustus 2026', lecturerEmail: 'sri.hartati@kampus.ac.id' },
      ],
    });
  }

  // Nilai (GradeRecord) untuk seluruh mahasiswa yang terdaftar di MK dosen.
  const gradeRows: Array<{ studentNim: string; studentName: string; courseCode: string; courseName: string; semester: number; tugas: number; kuis: number; praktikum: number; uts: number; uas: number }> = [];
  const courseMeta: Record<string, string> = { IF3110: 'Pengembangan Aplikasi Web', IF3150: 'Manajemen Proyek Perangkat Lunak', IF3170: 'Kecerdasan Buatan', IF3140: 'Manajemen Basis Data', KU2071: 'Pancasila dan Kewarganegaraan' };
  const roster = [
    { nim: '10118001', name: 'Ahmad Syafiq' },
    { nim: '10118004', name: 'Budi Santoso' },
    { nim: '10118005', name: 'Citra Kirana' },
    { nim: '10118006', name: 'Dewi Lestari' },
    { nim: '10118007', name: 'Gita Wirjawan' },
  ];
  const scores = [92, 86, 90, 81, 88, 78, 85, 76, 89, 83, 84, 91, 79, 87, 82, 80, 93, 77, 88, 84];
  let si = 0;
  for (const st of roster) {
    for (const code of ['IF3110', 'IF3150', 'IF3170', 'IF3140', 'KU2071']) {
      const base = scores[si % scores.length];
      si += 1;
      // Riwayat semester 1-5 untuk mahasiswa utama (Ahmad Syafiq)
      if (st.nim === '10118001') {
        for (const sem of [1, 2, 3, 4]) {
          gradeRows.push({ studentNim: st.nim, studentName: st.name, courseCode: code, courseName: courseMeta[code], semester: sem, tugas: base + 2, kuis: base + 1, praktikum: base + 3, uts: base - 2, uas: base - 1 });
        }
      }
      gradeRows.push({ studentNim: st.nim, studentName: st.name, courseCode: code, courseName: courseMeta[code], semester: 5, tugas: base, kuis: base + 1, praktikum: base + 2, uts: base - 1, uas: base });
    }
  }
  if ((await prisma.gradeRecord.count()) === 0) {
    const gradeLetter = (v: number) => (v >= 88 ? 'A' : v >= 80 ? 'AB' : v >= 70 ? 'B' : v >= 60 ? 'C' : 'D');
    for (const g of gradeRows) {
      const final = Math.round(((g.tugas + g.kuis + g.praktikum + g.uts + g.uas) / 5) * 100) / 100;
      await prisma.gradeRecord.create({
        data: { ...g, final, gradeLetter: gradeLetter(final), updatedBy: 'seed', updatedAt: new Date().toISOString() },
      });
    }
  }

  if ((await prisma.consultationLog.count()) === 0) {
    await prisma.consultationLog.createMany({
      data: [
        { studentNim: '10118001', date: '2026-08-20', topic: 'Konsultasi Rencana Studi', notes: 'Menentukan mata kuliah pilihan semester ganjil.', advisorEmail: 'budi.rahardjo@kampus.ac.id' },
        { studentNim: '10118001', date: '2026-09-03', topic: 'Kendala Tugas 1 IF3110', notes: 'Membahas error pada routing REST API.', advisorEmail: 'budi.rahardjo@kampus.ac.id' },
        { studentNim: '10118004', date: '2026-08-25', topic: 'Pengajuan PKL', notes: 'Persetujuan lokasi magang PT Teknologi Indonesia.', advisorEmail: 'budi.rahardjo@kampus.ac.id' },
      ],
    });
  }

  if ((await prisma.chatMessage.count()) === 0) {
    const t1 = '09:12 AM';
    const t2 = '10:35 AM';
    const t3 = '02:20 PM';
    const thread = 'ahmad.syafiq@mahasiswa.ac.id:budi.rahardjo@kampus.ac.id';
    await prisma.chatMessage.createMany({
      data: [
        { threadKey: thread, senderEmail: 'ahmad.syafiq@mahasiswa.ac.id', senderName: 'Ahmad Syafiq', senderRole: 'student', text: 'Selamat pagi Pak, izin bertanya tentang tugas REST API, apakah boleh menggunakan framework selain Express?', createdAt: t1 },
        { threadKey: thread, senderEmail: 'budi.rahardjo@kampus.ac.id', senderName: 'Dr. Budi Rahardjo', senderRole: 'lecturer', text: 'Boleh, yang penting konsep RESTful tetap dipenuhi dan dokumentasi lengkap.', createdAt: t2 },
        { threadKey: thread, senderEmail: 'ahmad.syafiq@mahasiswa.ac.id', senderName: 'Ahmad Syafiq', senderRole: 'student', text: 'Baik Pak, terima kasih! Sudah saya pahami.', createdAt: t3 },
      ],
    });
  }

  if ((await prisma.thesis.count()) === 0) {
    await prisma.thesis.createMany({
      data: [
        {
          studentNim: '10118001', studentName: 'Ahmad Syafiq', title: 'Pengembangan Sistem Rekomendasi Mata Kuliah Berbasis Knowledge Graph', progressPercentage: 65, status: 'Bimbingan', supervisorEmail: 'budi.rahardjo@kampus.ac.id',
          logsJson: JSON.stringify([
            { date: '2026-05-12', note: 'Diskusi topik dan ruang lingkup penelitian.', approval: true },
            { date: '2026-06-02', note: 'Bab 1 dan Bab 2 direvisi.', approval: true },
            { date: '2026-06-23', note: 'Pembahasan metodologi knowledge graph.', approval: false },
          ]),
          seminarType: 'Kolokium', seminarDate: '2026-08-05', seminarRoom: 'R-301', seminarTime: '10:00',
        },
        {
          studentNim: '10118004', studentName: 'Budi Santoso', title: 'Deteksi Anomali Transaksi Menggunakan Autoencoder', progressPercentage: 40, status: 'Bimbingan', supervisorEmail: 'budi.rahardjo@kampus.ac.id',
          logsJson: JSON.stringify([
            { date: '2026-06-10', note: 'Pengajuan topik diterima.', approval: true },
            { date: '2026-07-01', note: 'Studi literatur dan dataset.', approval: true },
          ]),
        },
      ],
    });
  }

  // ── Keuangan (FinanceBill), dokumen, helpdesk ──────────────────────
  const currentYear = new Date().getFullYear();
  if ((await prisma.financeBill.count()) === 0) {
    const bills = [
      { studentNim: '10118001', studentName: 'Ahmad Syafiq', period: `${currentYear - 2}/2024-Genap`, description: 'UKT Semester Genap', amount: 7500000, paidAmount: 7500000, status: 'Lunas', dueDate: '15 Februari' },
      { studentNim: '10118001', studentName: 'Ahmad Syafiq', period: `${currentYear - 1}/2025-Ganjil`, description: 'UKT Semester Ganjil', amount: 7500000, paidAmount: 7500000, status: 'Lunas', dueDate: '15 Agustus' },
      { studentNim: '10118001', studentName: 'Ahmad Syafiq', period: `${currentYear - 1}/2025-Genap`, description: 'UKT Semester Genap', amount: 7500000, paidAmount: 7500000, status: 'Lunas', dueDate: '15 Februari' },
      { studentNim: '10118001', studentName: 'Ahmad Syafiq', period: `${currentYear}/2026-Ganjil`, description: 'UKT Semester Ganjil', amount: 7500000, paidAmount: 0, status: 'Belum Lunas', dueDate: '15 Agustus' },
      { studentNim: '10118004', studentName: 'Budi Santoso', period: `${currentYear}/2026-Ganjil`, description: 'UKT Semester Ganjil', amount: 5000000, paidAmount: 0, status: 'Belum Lunas', dueDate: '15 Agustus' },
      { studentNim: '10118005', studentName: 'Citra Kirana', period: `${currentYear}/2026-Ganjil`, description: 'UKT Semester Ganjil', amount: 5000000, paidAmount: 2500000, status: 'Cicilan', dueDate: '15 Agustus' },
      { studentNim: '10118006', studentName: 'Dewi Lestari', period: `${currentYear}/2026-Ganjil`, description: 'UKT Semester Ganjil', amount: 7500000, paidAmount: 7500000, status: 'Lunas', dueDate: '15 Agustus' },
      { studentNim: '10118007', studentName: 'Gita Wirjawan', period: `${currentYear}/2026-Ganjil`, description: 'UKT Semester Ganjil', amount: 2500000, paidAmount: 0, status: 'Belum Lunas', dueDate: '15 Agustus' },
    ];
    for (const b of bills) {
      await prisma.financeBill.create({ data: b });
    }
  }

  if ((await prisma.document.count()) === 0) {
    await prisma.document.createMany({
      data: [
        { title: 'Formulir Surat Keterangan Aktif Kuliah', category: 'Formulir', fileName: 'sk_aktif_kuliah.pdf', fileSize: '240 KB' },
        { title: 'Panduan Akademik 2025/2026', category: 'Panduan', fileName: 'buku_panduan_2025.pdf', fileSize: '4.2 MB' },
        { title: 'Kalender Akademik Ganjil 2025/2026', category: 'Kalender', fileName: 'kalender_ganjil_2526.pdf', fileSize: '1.1 MB' },
        { title: 'Formulir Cuti Akademik', category: 'Formulir', fileName: 'form_cuti_akademik.pdf', fileSize: '180 KB' },
        { title: 'Petunjuk Pengisian EDOM', category: 'Panduan', fileName: 'panduan_edom.pdf', fileSize: '650 KB' },
      ],
    });
  }

  if ((await prisma.helpdeskTicket.count()) === 0) {
    await prisma.helpdeskTicket.createMany({
      data: [
        { requesterEmail: 'ahmad.syafiq@mahasiswa.ac.id', requesterName: 'Ahmad Syafiq', subject: 'Tidak bisa mengakses portal presensi', message: 'Halaman presensi muncul error 500 setelah login.', status: 'Diproses', createdAt: '2026-08-01 09:30', resolution: 'Sedang diperiksa oleh tim SISFO.' },
        { requesterEmail: 'citra.kirana@mahasiswa.ac.id', requesterName: 'Citra Kirana', subject: 'Perubahan data alamat', message: 'Mohon bantuan memperbarui alamat domisili pada profil.', status: 'Terbuka', createdAt: '2026-08-02 14:12' },
      ],
    });
  }

  // ── Dashboard per peran (RoleDashboard) ────────────────────────────
  const dashboards: Array<{ role: string; data: unknown }> = [
    {
      role: 'kaprodi',
      data: {
        classesApproval: [
          { id: 'ca-1', courseCode: 'IF301', courseName: 'Algoritma & Pemrograman II', sementer: 'Ganjil', sks: 3, classRoom: 'R-301', requestedBy: 'Dr. Ahmad Dahlan', status: 'Pending' },
          { id: 'ca-2', courseCode: 'IF305', courseName: 'Desain & Analisis Algoritma', sementer: 'Ganjil', sks: 4, classRoom: 'R-402', requestedBy: 'Prof. Suparman', status: 'Pending' },
          { id: 'ca-3', courseCode: 'IF310', courseName: 'Sistem Operasi Terdistribusi', sementer: 'Ganjil', sks: 3, classRoom: 'R-Lab', requestedBy: 'Dr. Indah Rahayu', status: 'Disetujui' },
          { id: 'ca-4', courseCode: 'IF401', courseName: 'Etika Profesi IT', sementer: 'Ganjil', sks: 2, classRoom: 'R-202', requestedBy: 'Drs. Wahyu Hidayat', status: 'Pending' },
        ],
        lecturers: [
          { id: 'lm-1', name: 'Dr. Budi Rahardjo', nip: '0412088201', role: 'Dosen Wali', baseSks: 12, addedSks: 4, journalFilled: '8 / 8 Pertemuan', rating: 4.8 },
          { id: 'lm-2', name: 'Dr. Indah Rahayu', nip: '198103142005', role: 'Dosen Biasa', baseSks: 8, addedSks: 6, journalFilled: '7 / 8 Pertemuan', rating: 4.5 },
          { id: 'lm-3', name: 'Prof. Suparman', nip: '196209211990', role: 'Guru Besar', baseSks: 14, addedSks: 0, journalFilled: '8 / 8 Pertemuan', rating: 4.9 },
          { id: 'lm-4', name: 'Drs. Wahyu Hidayat', nip: '197911042008', role: 'Asisten Ahli', baseSks: 6, addedSks: 8, journalFilled: '5 / 8 Pertemuan', rating: 4.2 },
          { id: 'lm-5', name: 'Dr. Ahmad Dahlan', nip: '198305222011', role: 'Dosen Biasa', baseSks: 10, addedSks: 2, journalFilled: '6 / 8 Pertemuan', rating: 4.6 },
        ],
        coursesBeban: [
          { id: 'cb-1', code: 'IF301', name: 'Algoritma & Pemrograman II', sks: 3, assignedLecturer: 'Dr. Ahmad Dahlan', semester: 3 },
          { id: 'cb-2', code: 'IF305', name: 'Desain & Analisis Algoritma', sks: 4, assignedLecturer: 'Prof. Suparman', semester: 3 },
          { id: 'cb-3', code: 'IF310', name: 'Sistem Operasi Terdistribusi', sks: 3, assignedLecturer: 'Dr. Indah Rahayu', semester: 5 },
          { id: 'cb-4', code: 'IF401', name: 'Etika Profesi IT', sks: 2, assignedLecturer: 'Drs. Wahyu Hidayat', semester: 7 },
          { id: 'cb-5', code: 'IF402', name: 'Kecerdasan Buatan (AI)', sks: 3, assignedLecturer: 'Dr. Budi Rahardjo', semester: 5 },
        ],
        coursesNilai: [
          { id: 'cn-1', name: 'Algoritma II', code: 'IF301', totalStudents: 42, avgGpa: 3.45, gradeA: 15, gradeB: 20, gradeC: 5, gradeD: 2, gradeE: 0 },
          { id: 'cn-2', name: 'Desain Algoritma', code: 'IF305', totalStudents: 38, avgGpa: 3.22, gradeA: 8, gradeB: 18, gradeC: 10, gradeD: 2, gradeE: 0 },
          { id: 'cn-3', name: 'Sistem Terdistribusi', code: 'IF310', totalStudents: 40, avgGpa: 3.61, gradeA: 22, gradeB: 14, gradeC: 4, gradeD: 0, gradeE: 0 },
          { id: 'cn-4', name: 'Etika Profesi IT', code: 'IF401', totalStudents: 45, avgGpa: 3.82, gradeA: 35, gradeB: 10, gradeC: 0, gradeD: 0, gradeE: 0 },
          { id: 'cn-5', name: 'Kecerdasan Buatan', code: 'IF402', totalStudents: 35, avgGpa: 3.38, gradeA: 12, gradeB: 15, gradeC: 6, gradeD: 2, gradeE: 0 },
        ],
        presensi: [
          { id: 'pm-1', className: 'Algoritma II - Kelas A', code: 'IF301-A', lecturer: 'Dr. Ahmad Dahlan', attendanceRate: 94.5, sessionsCompleted: 8, sessionsPlanned: 16 },
          { id: 'pm-2', className: 'Desain Algoritma - Kelas A', code: 'IF305-A', lecturer: 'Prof. Suparman', attendanceRate: 88.2, sessionsCompleted: 8, sessionsPlanned: 16 },
          { id: 'pm-3', className: 'Sistem Terdistribusi - Kelas B', code: 'IF310-B', lecturer: 'Dr. Indah Rahayu', attendanceRate: 91.0, sessionsCompleted: 7, sessionsPlanned: 16 },
          { id: 'pm-4', className: 'Etika Profesi IT - Kelas C', code: 'IF401-C', lecturer: 'Drs. Wahyu Hidayat', attendanceRate: 96.8, sessionsCompleted: 6, sessionsPlanned: 16 },
          { id: 'pm-5', className: 'Kecerdasan Buatan - Kelas A', code: 'IF402-A', lecturer: 'Dr. Budi Rahardjo', attendanceRate: 82.4, sessionsCompleted: 8, sessionsPlanned: 16 },
        ],
        prodiGpaTrend: [
          { name: 'Smt 1', IPK: 3.32 }, { name: 'Smt 2', IPK: 3.41 }, { name: 'Smt 3', IPK: 3.48 }, { name: 'Smt 4', IPK: 3.50 }, { name: 'Smt 5', IPK: 3.51 },
        ],
        laporan: { rasioDosenMahasiswa: '1 : 21', ketepatanKelulusan: '82.4%', penyerapanLulusan: '88.9%' },
      },
    },
    {
      role: 'dekan',
      data: {
        bebanDosen: [
          { id: 'bd-1', lecturerName: 'Dr. Hendra Wijaya', nidn: '0412088201', prodi: 'Teknik Informatika', baseSks: 12, requestedSks: 6, reason: 'Pengajaran Paralel Rekayasa Perangkat Lunak & Riset AI', status: 'Pending' },
          { id: 'bd-2', lecturerName: 'Dra. Sri Hartati', nidn: '0413987654', prodi: 'Teknik Elektro', baseSks: 10, requestedSks: 8, reason: 'Pengganti Dosen Tugas Belajar & Lab Mikrokontroler', status: 'Pending' },
          { id: 'bd-3', lecturerName: 'Dr. Budi Rahardjo', nidn: '0413456789', prodi: 'Sistem Informasi', baseSks: 12, requestedSks: 4, reason: 'Bimbingan Magang MBKM Industri Skala Besar', status: 'Disetujui' },
          { id: 'bd-4', lecturerName: 'Wawan Kuswara, M.T.', nidn: '0455333344', prodi: 'Teknik Informatika', baseSks: 8, requestedSks: 6, reason: 'Pengampu Mata Kuliah Baru Web Developer Lanjut', status: 'Pending' },
          { id: 'bd-5', lecturerName: 'Prof. John Doe', nidn: '0411122233', prodi: 'Kedokteran', baseSks: 14, requestedSks: 4, reason: 'Koordinator Riset Klinis Terpadu', status: 'Ditolak' },
        ],
        kurikulumApproval: [
          { id: 'ka-1', prodi: 'Teknik Informatika', name: 'Kurikulum OBE - MBKM v2026', sksWajib: 110, sksPilihan: 34, cplCount: 12, createdBy: 'Dr. Budi Rahardjo (Kaprodi IF)', status: 'Pending' },
          { id: 'ka-2', prodi: 'Sistem Informasi', name: 'Kurikulum Digital Business Specialist 2026', sksWajib: 114, sksPilihan: 30, cplCount: 10, createdBy: 'Dr. Ahmad Dahlan (Kaprodi SI)', status: 'Pending' },
          { id: 'ka-3', prodi: 'Teknik Elektro', name: 'Kurikulum IoT & Smart Energy v2.0', sksWajib: 112, sksPilihan: 32, cplCount: 11, createdBy: 'Dra. Sri Hartati (KPS)', status: 'Disetujui' },
        ],
        financialMetrics: [
          { name: 'Teknik Informatika', paid: 1200000000, outstanding: 150000000, target: 1350000000 },
          { name: 'Sistem Informasi', paid: 980000000, outstanding: 120000000, target: 1100000000 },
          { name: 'Teknik Elektro', paid: 640000000, outstanding: 80000000, target: 720000000 },
          { name: 'Kedokteran', paid: 3200000000, outstanding: 450000000, target: 3650000000 },
          { name: 'Manajemen', paid: 1100000000, outstanding: 90000000, target: 1190000000 },
          { name: 'Hukum', paid: 850000000, outstanding: 60000000, target: 910000000 },
        ],
        prodiPerformance: [
          { name: 'Teknik Informatika', ipkAverage: 3.48, attendanceLecturer: 95.8, attendanceStudent: 91.2 },
          { name: 'Sistem Informasi', ipkAverage: 3.32, attendanceLecturer: 94.2, attendanceStudent: 88.5 },
          { name: 'Teknik Elektro', ipkAverage: 3.18, attendanceLecturer: 92.0, attendanceStudent: 86.4 },
          { name: 'Kedokteran', ipkAverage: 3.65, attendanceLecturer: 98.4, attendanceStudent: 96.2 },
          { name: 'Manajemen', ipkAverage: 3.42, attendanceLecturer: 93.5, attendanceStudent: 89.0 },
          { name: 'Hukum', ipkAverage: 3.25, attendanceLecturer: 91.0, attendanceStudent: 85.8 },
        ],
        gradeDistributionFaculty: [
          { name: 'Nilai A', value: 35 }, { name: 'Nilai B', value: 45 }, { name: 'Nilai C', value: 14 }, { name: 'Nilai D', value: 5 }, { name: 'Nilai E/F', value: 1 },
        ],
        kpis: {
          totalMahasiswa: '4,820 Orang',
          totalDosen: '142 Dosen',
          rataIpk: '3.42 / 4.00',
          targetUkt: 'Rp 12.8 Milyar',
          uktSub: 'Sudah lunas: 91.4%',
        },
      },
    },
    {
      role: 'baak',
      data: {
        schedules: [
          { id: 'S1', course: 'Pemrograman Web', lecturer: 'Dr. Hendra Wijaya', room: 'Lab Komputer 3', time: 'Senin, 08:00 - 10:30', cap: '30/30', status: 'Terjadwal' },
          { id: 'S2', course: 'Kecerdasan Buatan', lecturer: 'Dra. Sri Hartati, M.T.', room: 'Ruang Kuliah 402', time: 'Selasa, 10:00 - 12:30', cap: '40/40', status: 'Terjadwal' },
          { id: 'S3', course: 'Arsitektur Enterprise', lecturer: 'Wawan Kuswara, M.T.', room: 'Ruang Kuliah 101', time: 'Rabu, 13:00 - 15:30', cap: '35/45', status: 'Terjadwal' },
        ],
        courses: [
          { code: 'IF101', name: 'Dasar Pemrograman', sks: 3, semester: 1, type: 'Wajib', preraq: '-', cpl: 'CPL-1, CPL-2' },
          { code: 'IF203', name: 'Struktur Data', sks: 3, semester: 2, type: 'Wajib', preraq: 'Dasar Pemrograman', cpl: 'CPL-2, CPL-3' },
          { code: 'IF305', name: 'Pemrograman Web', sks: 4, semester: 3, type: 'Wajib', preraq: 'Struktur Data', cpl: 'CPL-3, CPL-5' },
        ],
        mutasiRequests: [
          { id: 'MUT-01', name: 'Indra Gunawan', nim: '10123045', type: 'Cuti Akademik', date: '2026-06-25', status: 'Pending', reason: 'Alasan Kesehatan' },
          { id: 'MUT-02', name: 'Sonia Sitorus', nim: '10122012', type: 'Mutasi Lintas Prodi', date: '2026-06-24', status: 'Approved', reason: 'Pindah ke Sistem Informasi' },
          { id: 'MUT-03', name: 'Ronaldo Simanjuntak', nim: '10121088', type: 'Drop Out (DO)', date: '2026-06-20', status: 'Pending', reason: 'Melebihi Batas Studi SP3' },
        ],
        warningList: [
          { nim: '10121102', name: 'Bagus Pratoso', ipk: 1.8, spLevel: 'SP-2', status: 'Peringatan Aktif', desc: 'IPK di bawah standar kelulusan minimum' },
          { nim: '10122044', name: 'Tommy Wijaya', ipk: 1.9, spLevel: 'SP-1', status: 'Peringatan Aktif', desc: 'Presensi di bawah 75%' },
        ],
      },
    },
    {
      role: 'bauk',
      data: {
        billingConfigs: [
          { group: 'UKT Golongan I', nominal: 500000, installmentAllowed: false, lateFee: 0, count: 42 },
          { group: 'UKT Golongan II', nominal: 2500000, installmentAllowed: true, lateFee: 50000, count: 128 },
          { group: 'UKT Golongan III', nominal: 5000000, installmentAllowed: true, lateFee: 100000, count: 540 },
          { group: 'UKT Golongan IV', nominal: 7500000, installmentAllowed: true, lateFee: 150000, count: 310 },
        ],
        scholarships: [
          { id: 'SCH-01', name: 'KIP Kuliah / Bidikmisi', source: 'Pemerintah (Kemdikbud)', discountPercent: 100, awardees: 110, status: 'Aktif' },
          { id: 'SCH-02', name: 'Beasiswa Prestasi Unggulan', source: 'Internal Yayasan', discountPercent: 50, awardees: 45, status: 'Aktif' },
          { id: 'SCH-03', name: 'Beasiswa Djarum Foundation', source: 'Eksternal (Mitra)', discountPercent: 75, awardees: 12, status: 'Aktif' },
        ],
        reconciledPayments: [
          { id: 'TX-9021', name: 'Rian Hidayat', nim: '10123045', bank: 'BNI', va: '827101230459', amount: 'Rp 5.000.000', date: '2026-06-28 09:12', method: 'VA Auto-Sync', status: 'Selesai' },
          { id: 'TX-9020', name: 'Sania Sitorus', nim: '10122012', bank: 'Mandiri', va: '881901220123', amount: 'Rp 7.500.000', date: '2026-06-28 08:44', method: 'VA Auto-Sync', status: 'Selesai' },
          { id: 'TX-9019', name: 'Indra Gunawan', nim: '10121102', bank: 'BCA', va: '719010121102', amount: 'Rp 2.500.000', date: '2026-06-27 16:30', method: 'VA Auto-Sync', status: 'Selesai' },
        ],
      },
    },
    {
      role: 'alumni',
      data: {
        alumniProfile: {
          nim: '1901001',
          program: 'Teknik Informatika (S1)',
          faculty: 'Fakultas Teknik',
          classYear: '2019',
          graduationYear: '2023',
          gpa: 3.62,
          totalSks: 144,
          degree: 'Sarjana Komputer (S.Kom)',
          advisor: 'Dr. Ir. H. Hermawan, M.T.',
          birthPlace: 'Bandung',
          birthDate: '12 September 2001',
          religion: 'Islam',
          citizenId: '3273012309010002',
          phone: '+62 812-3456-7890',
          address: 'Jl. Merdeka No. 45, Coblong, Kota Bandung, Jawa Barat 40135',
          avatarUrl: '',
        },
        alumniSemesterGPAs: [
          { name: 'Smt 1', IPS: 3.40, IPK: 3.40 }, { name: 'Smt 2', IPS: 3.55, IPK: 3.48 }, { name: 'Smt 3', IPS: 3.52, IPK: 3.49 }, { name: 'Smt 4', IPS: 3.65, IPK: 3.53 },
          { name: 'Smt 5', IPS: 3.70, IPK: 3.56 }, { name: 'Smt 6', IPS: 3.62, IPK: 3.57 }, { name: 'Smt 7', IPS: 3.80, IPK: 3.60 }, { name: 'Smt 8', IPS: 3.90, IPK: 3.62 },
        ],
      },
    },
    {
      role: 'applicant',
      data: {
        pmb: {
          nik: '3273012304910003',
          nisn: '0039401812',
          school: 'SMAN 3 Bandung',
          firstProdi: 'Teknik Informatika',
          secondProdi: 'Sistem Informasi',
          documents: [
            { id: 'ktp', name: 'KTP / Kartu Keluarga', file: 'ktp_rian_hidayat.pdf', status: 'Terverifikasi (AI-OCR)', ocrScore: 98, error: '' },
            { id: 'ijazah', name: 'Ijazah SMA / Sederajat', file: 'ijazah_legalisir.pdf', status: 'Terverifikasi (AI-OCR)', ocrScore: 95, error: '' },
            { id: 'rapor', name: 'Scan Transkrip Rapor Semester 1-5', file: 'rapor_full.pdf', status: 'Menunggu Verifikasi', ocrScore: 0, error: '' },
          ],
        },
        testQuestions: [
          { q: 'Manakah dari berikut ini yang merupakan struktur data Linier?', options: ['Pohon / Tree', 'Graf / Graph', 'Antrian / Queue', 'Splay Tree'], correct: 'Antrian / Queue' },
          { q: 'Berapakah hasil biner dari penjumlahan 1010 + 0101?', options: ['1111', '1001', '1100', '1010'], correct: '1111' },
          { q: 'Siapakah penemu konsep mesin Turing?', options: ['Alan Turing', 'Ada Lovelace', 'Steve Jobs', 'Charles Babbage'], correct: 'Alan Turing' },
        ],
      },
    },
  ];

  if ((await prisma.roleDashboard.count()) === 0) {
    for (const d of dashboards) {
      await prisma.roleDashboard.create({ data: { role: d.role, dataJson: JSON.stringify(d.data), updatedAt: new Date().toISOString() } });
    }
  }

  const banner = ['── SIAKAD SEED ──', `users: ${await prisma.user.count()}`, `courses: ${await prisma.courseOffering.count()}`, `periods: ${await prisma.academicPeriod.count()}`];
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🔐 [SEED] selesai. Login password semua akun (dev): ${plainPassword}`);
    console.log(banner.join(' | '));
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());