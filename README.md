# 🇮🇩 SIAKAD — Sistem Informasi Akademik Terpadu

<p align="center">
  <a href="README-EN.md">🇺🇸 English</a>
</p>

<p align="center">
  <!-- GAMBAR HERO: Ganti dengan banner/gambar hero SIAKAD (1920×480) -->
  <img src="docs/screenshots/hero-banner.png" alt="SIAKAD — Sistem Informasi Akademik Berbasis Cloud" width="100%">
</p>

<p align="center">
  <strong>Sistem Informasi Akademik Modern • Modular Monolith • Multi-Role • Multi-Bahasa</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status: Active">
  <img src="https://img.shields.io/badge/versi-1.0.0-blue?style=flat-square" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License MIT">
  <img src="https://img.shields.io/badge/arsitektur-Modular%20Monolith-8b5cf6?style=flat-square" alt="Arsitektur">
  <img src="https://img.shields.io/badge/frontend-React%2019-61dafb?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/backend-NestJS%2011-ea2845?style=flat-square&logo=nestjs" alt="NestJS 11">
  <img src="https://img.shields.io/badge/database-Prisma%207-2d3748?style=flat-square&logo=prisma" alt="Prisma 7">
  <img src="https://img.shields.io/badge/style-Tailwind%204-0ea5e9?style=flat-square&logo=tailwindcss" alt="Tailwind 4">
  <img src="https://img.shields.io/badge/tests-26%20passing-brightgreen?style=flat-square" alt="Tests: 26 passing">
  <img src="https://img.shields.io/badge/i18n-4%20bahasa-0ea5e9?style=flat-square" alt="4 Languages">
</p>

<hr>

## 📋 Daftar Isi

- [📖 Tentang SIAKAD](#-tentang-siakad)
- [📸 Preview & Screenshots](#-preview--screenshots)
- [✨ Fitur Lengkap](#-fitur-lengkap)
- [🏗 Arsitektur](#-arsitektur)
- [⚙️ Stack Teknologi](#️-stack-teknologi)
- [🔐 Model Keamanan](#-model-keamanan)
- [📊 Diagram Alur](#-diagram-alur)
- [👥 Role & Hak Akses](#-role--hak-akses)
- [🚀 Panduan Setup](#-panduan-setup)
- [🔧 Konfigurasi Lingkungan](#-konfigurasi-lingkungan)
- [📡 API Reference](#-api-reference)
- [🧩 Widget Catalog](#-widget-catalog)
- [🧪 Testing](#-testing)
- [🗄 Perbandingan Database](#-perbandingan-database)
- [🐳 Docker Deployment](#-docker-deployment)
- [🤝 Kontribusi](#-kontribusi)
- [❓ FAQ](#-faq)
- [📄 Lisensi](#-lisensi)

---

## 📖 Tentang SIAKAD

SIAKAD adalah **Sistem Informasi Akademik** berbasis web modern yang dibangun sebagai **Modular Monolith** — satu kesatuan aplikasi dengan pemisahan modul yang bersih antara frontend React dan backend NestJS. Dirancang untuk kebutuhan institusi pendidikan tinggi di Indonesia dengan mendukung 9 (sembilan) peran pengguna sekaligus.

### Visi

Menghadirkan sistem informasi akademik yang modern, aman, dan mudah dikembangkan — menjembatani kesenjangan antara kemudahan pengembangan monolit dengan disiplin arsitektur modular.

### Masalah yang Dipecahkan

| Masalah | Solusi SIAKAD |
|---------|---------------|
| Sistem akademik kuno berbasis PHP monolitik | Arsitektur modular dengan React 19 + NestJS 11 |
| Keamanan lemah (MD5/basic auth) | JWT + refresh token, CSRF double-submit, Argon2id, rate limiting |
| Maintenance sulit karena kode tidak terstruktur | Pemisahan modul tegas + Prisma ORM + dependency injection |
| Tidak ada audit trail | Audit log + telemetry + security event logging |
| Sulit dikembangkan fitur baru | Arsitektur plugin-like dengan sub-modul independen |
| Hanya satu bahasa | i18n multi-bahasa (Indonesia, Inggris, Mandarin, Arab) dengan RTL |

### Target Pengguna

| Pengguna | Kebutuhan Utama |
|----------|----------------|
| **Mahasiswa** | KRS, KHS, presensi, progres semester, transkrip digital |
| **Dosen** | Presensi kelas, bimbingan skripsi, jurnal, edom, penilaian |
| **Kaprodi** | Persetujuan kelas, monitoring SKS, rekap akademik |
| **Dekan** | Overview fakultas, laporan, evaluasi |
| **Admin** | Master data, monitoring sistem, audit, konfigurasi |
| **BAAK** | Administrasi akademik, helpdesk, form digital |
| **BAUK** | Biro keuangan, breakdown finansial mahasiswa |
| **Calon Maba** | Pendaftaran, informasi penerimaan |
| **Alumni** | Transkrip, ijazah digital, tracer study |

### Keunggulan Komparatif

| Fitur | SIAKAD | Sistem Konvensional |
|-------|--------|-------------------|
| **Arsitektur** | Modular Monolith (React + NestJS) | PHP monolit / Service Mesh over-engineering |
| **Frontend** | React 19 SPA + TanStack Query + Tailwind 4 | jQuery / Blade template |
| **Keamanan** | JWT + Refresh Token + CSRF + Argon2id + Helmet | MD5 / Basic Auth / tanpa CSRF |
| **Database** | Prisma ORM (SQLite dev / PostgreSQL prod) | MySQL mentah tanpa ORM |
| **Audit** | Audit log per event + telemetry + security log | Minimal / tidak ada |
| **Testing** | 26 integration test (auth + KRS full flow) | Jarang ada automated test |
| **i18n** | ID + EN + ZH + AR dengan RTL support | Biasanya Indonesia saja |
| **API** | RESTful dengan Zod validation + CSRF | Mix POST/GET tanpa validasi |

---

## 📸 Preview & Screenshots

### Halaman Login

<!-- GAMBAR: Tampilan halaman login dengan role selector (student/lecturer/kaprodi/dll) dan language switcher -->
<p align="center">
  <img src="docs/screenshots/login-page.png" alt="Halaman Login SIAKAD" width="800">
  <br><em>Halaman login dengan pratinjau peran akun (role preview) dan pemilih bahasa</em>
</p>

### Dashboard per Role

| Role | Cuplikan Dashboard | Deskripsi |
|------|-------------------|-----------|
| 🎓 **Mahasiswa** | <!-- GAMBAR: dashboard mahasiswa dengan KRS, KHS, progress bar --> | Overview akademik, KRS, KHS, progres SKS |
| 👨‍🏫 **Dosen** | <!-- GAMBAR: dashboard dosen dengan jadwal, bimbingan, presensi --> | Jadwal mengajar, bimbingan, jurnal, edom |
| 📋 **Kaprodi** | <!-- GAMBAR: dashboard kaprodi dengan approval, monitoring --> | Persetujuan KRS, monitoring SKS, rekap |
| 🏛 **Dekan** | <!-- GAMBAR: dashboard dekan dengan overview fakultas --> | Overview fakultas, grafik, laporan |
| ⚙️ **Admin** | <!-- GAMBAR: dashboard admin dengan master data, monitoring --> | Panel kontrol, audit, monitoring sistem |
| 📊 **BAAK** | <!-- GAMBAR: dashboard baak --> | Administrasi akademik, helpdesk |
| 💰 **BAUK** | <!-- GAMBAR: dashboard bauk --> | Biro keuangan, pembayaran |
| 👤 **Calon Maba** | <!-- GAMBAR: dashboard calon maba --> | Pendaftaran, informasi |
| 🎓 **Alumni** | <!-- GAMBAR: dashboard alumni --> | Transkrip, ijazah, tracer |

### Alur KRS (GIF)

<!-- GIF: Rekam alur lengkap pengisian KRS — dari login mahasiswa → buka halaman KRS → tambah mata kuliah → cek sks → submit → admin approve -->
<p align="center">
  <img src="docs/screenshots/krs-flow.gif" alt="Demo Alur KRS" width="800">
  <br><em>Alur lengkap KRS: Login → Pilih Matkul → Submit → Approval Admin</em>
</p>

### Fitur Unggulan (GIF)

| Fitur | GIF | Durasi |
|-------|-----|--------|
| 🎯 **Smart Course Recommendation** | <!-- GIF: rekomendasi matkul otomatis --> | ~15 detik |
| 📊 **Degree Credit Progress Bar** | <!-- GIF: progress bar SKS interaktif --> | ~10 detik |
| 🤖 **Academic Chatbot** | <!-- GIF: chatbot akademik --> | ~20 detik |
| 📋 **Bimbingan Skripsi** | <!-- GIF: chat bimbingan + upload draf --> | ~25 detik |
| 📈 **Recharts Dashboard** | <!-- GIF: grafik interaktif dashboard --> | ~15 detik |
| 🔄 **Presensi & Kalender** | <!-- GIF: presensi + kalender akademik --> | ~15 detik |

### Showcase Interaktif

<!-- GAMBAR: halaman showcase dengan tabel data, grafik, kalender, export -->
<p align="center">
  <img src="docs/screenshots/showcase.png" alt="Showcase Interaktif" width="800">
  <br><em>Halaman demo interaktif: tabel online, grafik Recharts, kalender FullCalendar, export XLSX/PDF</em>
</p>

### Widget Gallery

| Widget | Screenshot | Fungsi |
|--------|-----------|--------|
| Academic Absence Support | <!-- placeholder --> | Dukungan izin akademik |
| Academic Dates Widget | <!-- placeholder --> | Tanggal penting akademik |
| Announcement Ticker | <!-- placeholder --> | Pengumuman berjalan |
| Centralized Tasks Module | <!-- placeholder --> | Manajemen tugas terpusat |
| Certified Digital Transcript | <!-- placeholder --> | Transkrip digital tersertifikasi |
| Digital Forms Tracker | <!-- placeholder --> | Tracking formulir digital |
| Enterprise Control Suite | <!-- placeholder --> | Panel kontrol enterprise |
| Feedback Widget | <!-- placeholder --> | Widget umpan balik |
| Finance Details Breakdown | <!-- placeholder --> | Rincian keuangan |
| Helpdesk System | <!-- placeholder --> | Sistem helpdesk terintegrasi |
| Lecturer Rating Module | <!-- placeholder --> | Rating & evaluasi dosen |
| Psychological Support Crisis | <!-- placeholder --> | Dukungan psikologis |
| Siakad Preloader | <!-- placeholder --> | Preloader animasi kustom |
| Skeleton Loader | <!-- placeholder --> | Skeleton loading screen |
| Sks Conversion Module | <!-- placeholder --> | Konversi SKS |
| Smart Course Recommendation | <!-- placeholder --> | Rekomendasi matkul cerdas |

---

## ✨ Fitur Lengkap

### 1️⃣ Modul Akademik

| Fitur | Mahasiswa | Dosen | Kaprodi | Admin |
|-------|:---------:|:-----:|:-------:|:-----:|
| **KRS** — Isi & Submit KRS | ✅ | — | — | — |
| **KRS** — Persetujuan | — | — | ✅ | ✅ |
| **KRS** — Riwayat per Semester | ✅ | — | — | — |
| **KRS** — Tracking Status | ✅ | ✅ | ✅ | ✅ |
| **KHS** — Lihat Nilai per Semester | ✅ | — | ✅ | ✅ |
| **KHS** — Input Nilai | — | ✅ | ✅ | ✅ |
| **Presensi** — Absensi Kelas | ✅ | ✅ | — | — |
| **Presensi** — Rekap Kehadiran | ✅ | ✅ | ✅ | ✅ |
| **Kalender Akademik** | ✅ | ✅ | ✅ | ✅ |

### 2️⃣ Modul Mahasiswa

| Fitur | Deskripsi |
|-------|-----------|
| 📝 **Pengisian KRS** | Tambah/hapus mata kuliah dengan validasi SKS (max 24), filter duplikasi |
| 📊 **KHS Semester** | Tampilkan nilai per semester dalam tabel dan grafik |
| 📈 **Degree Credit Progress Bar** | Visualisasi progres SKS menuju 144 SKS kelulusan |
| 📑 **Certified Digital Transcript** | Transkrip digital dengan kode verifikasi |
| 💡 **Smart Course Recommendation** | Rekomendasi mata kuliah berdasarkan SKS tersisa |
| 📅 **Academic Dates** | Tanggal penting: UTS, UAS, Libur, herregistrasi |
| 🗣 **Academic Chatbot** | Tanya jawab akademik otomatis |
| 📋 **Feedback / EDOM** | Pengisian evaluasi dosen |
| 📎 **Digital Forms** | Formulir digital: izin, cuti, herregistrasi |
| 📚 **SKS Conversion** | Konversi nilai dan konversi SKS transfer |

### 3️⃣ Modul Dosen

| Fitur | Deskripsi |
|-------|-----------|
| 📋 **Jadwal Mengajar** | Tampilan jadwal mingguan, filter hari/ruangan |
| 👥 **Presensi Kelas** | Input absensi per pertemuan, rekap kehadiran |
| 📝 **Penilaian** | Input nilai tugas, UTS, UAS per kelas |
| 📖 **Bimbingan Skripsi** | Chat mahasiswa bimbingan, upload draf, tracking progres |
| 📚 **Jurnal Akademik** | Catat kegiatan akademik harian, export PDF |
| 📎 **Tugas & Materi** | Upload materi kuliah, distribusi dan tracking tugas |
| ⭐ **E-DOM** | Hasil evaluasi dosen oleh mahasiswa (rating) |
| 💬 **Komunikasi** | Pesan dengan mahasiswa, forum diskusi |

### 4️⃣ Modul Admin

| Fitur | Deskripsi |
|-------|-----------|
| 🗂 **Master Data** | CRUD user, prodi, ruangan, mata kuliah, semester |
| 👤 **Manajemen User** | Buat/edit/hapus user semua role, reset password |
| 📊 **Monitoring** | Log aktivitas, performa sistem, audit trail, telemetry |
| 🔒 **Security Panel** | Status JWT secrets, key generation, rotasi secret |
| 🔄 **Infrastructure** | Simulasi scale, validasi transaksi ACID, backup/recovery |
| 🎛 **Enterprise Control Suite** | Panel kontrol terintegrasi untuk power user |
| 🛠 **System Settings** | Konfigurasi global, role management, pengaturan notifikasi |

### 5️⃣ Role Khusus

| Role | Fitur Eksklusif |
|------|----------------|
| **Kaprodi** | Persetujuan KRS, monitoring SKS mahasiswa, rekap akademik prodi |
| **Dekan** | Overview fakultas (grafik lintas prodi), laporan eksekutif |
| **BAAK** | Administrasi akademik, helpdesk terintegrasi, digital forms tracking |
| **BAUK** | Keuangan mahasiswa, breakdown biaya, status pembayaran |
| **Calon Maba** | Pendaftaran online, info penerimaan, status registrasi |
| **Alumni** | Transkrip digital, ijazah, tracer study |

---

## 🏗 Arsitektur

```
siaKAD ──────────────────────────────────────────────────────────────
│                                                                    
├── 📁 frontend/             ◆ React 19 SPA + Vite 6                 
│   └── src/                                                       
│       ├── api/             ◆ Axios instance + per-module API client
│       ├── components/                                            
│       │   ├── layout/      ◆ Sidebar, Header, Breadcrumb, Notif    
│       │   ├── views/       ◆ 21+ halaman per role                 
│       │   ├── widgets/     ◆ 20+ reusable widget komponen         
│       │   └── ui/          ◆ Komponen UI umum                     
│       ├── utils/                                                     
│       │   ├── i18n.ts      ◆ Internationalisasi (ID/EN/ZH/AR)      
│       │   ├── ability.ts   ◆ CASL — role-based authorization       
│       │   ├── api.ts       ◆ Fungsi API umum                      
│       │   └── store.ts     ◆ Zustand — global state management      
│       └── App.tsx          ◆ Root component + routing              
│                                                                    
├── 📁 backend/              ◆ NestJS 11 + Prisma 7                 
│   ├── src/                                                      
│   │   ├── app.module.ts    ◆ Root NestJS module                   
│   │   ├── common/                                                
│   │   │   ├── guards/      ◆ AuthGuard (JWT), RolesGuard (RBAC)    
│   │   │   ├── filters/     ◆ Global HTTP exception filter          
│   │   │   ├── interceptors/◆ Logging interceptor                   
│   │   │   ├── decorators/  ◆ @Roles() decorator                  
│   │   │   └── prisma/      ◆ PrismaModule + PrismaService          
│   │   ├── modules/                                              
│   │   │   ├── auth/        ◆ Login, register, CSRF, reset pass    
│   │   │   ├── krs/         ◆ KRS CRUD + approval workflow          
│   │   │   ├── users/       ◆ User seeding, find, update            
│   │   │   ├── audit/       ◆ Audit log, telemetry, infra           
│   │   │   └── security/    ◆ JWT, hashing, token invalidation      
│   │   └── server.ts        ◆ Bootstrap Express + middleware stack  
│   ├── prisma/                                                      
│   │   └── schema.prisma    ◆ Model: User, KRS, AuditRecord         
│   └── tests/               ◆ Integration & unit tests              
│                                                                    
├── 📄 docker-compose.yml    ◆ PostgreSQL + Redis (opsional)         
├── 📄 .env.example          ◆ Root environment template              
└── 📄 package.json          ◆ Root workspace scripts                
```

### Alur Data

```
┌──────────────┐    CSRF Token    ┌──────────────┐    Prisma ORM    ┌────────────┐
│              │ ◄────────────── │              │ ──────────────► │            │
│   React 19   │   JWT Cookie     │  NestJS 11   │                 │  SQLite /  │
│   Frontend   │ ──────────────► │  Backend     │ ◄────────────── │ Postgres   │
│   (Vite 6)   │                 │  (Express)   │                 │            │
│              │   JSON Response  │              │                 └────────────┘
│              │ ◄────────────── │              │
└──────────────┘                 └──────────────┘
       │                              │
       │                              ├── Redis (opsional)
       │                              │    └── Token blacklist
       │                              │
       │                              ├── Audit Log
       │                              │    └── Prisma → DB
       │                              │
       │                              └── Security Events
       │                                   └── In-memory log
       │
       └── Zustand Store (client state)
```

### Pola Arsitektur

| Pola | Implementasi |
|------|-------------|
| **Modular Monolith** | Frontend/Backend terpisah dalam satu repo, modul independen |
| **Dependency Injection** | NestJS DI — setiap module punya service + controller |
| **Repository Pattern** | PrismaService dibungkus BaseRepository |
| **Guard Pattern** | AuthGuard (JWT) → RolesGuard (RBAC) pipeline |
| **DTO Validation** | Zod schema di controller layer (login, register) |
| **CSRF Double-Submit** | Cookie + Header `X-CSRF-Token` |
| **Event Sourcing (light)** | Audit log setiap operasi penting + security events |

---

## ⚙️ Stack Teknologi

### Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | 19.0+ | UI Library — komponen deklaratif |
| **Vite** | 6.2+ | Build tool — HMD cepat, optimasi production |
| **Tailwind CSS** | 4.1+ | Utility-first CSS — styling cepat dan konsisten |
| **TypeScript** | 5.8+ | Type safety — kurangi runtime error |
| **TanStack Query** | 5.101+ | Server state — caching, refetch, mutation |
| **TanStack Table** | 8.21+ | Tabel data — sorting, filter, pagination |
| **Radix UI** | 1.1+ | Headless UI — aksesibel, unstyled primitives |
| **Recharts** | 3.9+ | Grafik — responsive, interaktif |
| **motion** | 12+ | Animasi — framer motion API |
| **Zustand** | 5.0+ | Global state — ringan, tanpa boilerplate |
| **React Router** | 7.18+ | Routing — SPA navigation |
| **CASL** | 7.0+ | RBAC client — ability-based authorization |
| **Axios** | 1.18+ | HTTP client — interceptor, CSRF |
| **Zod** | 4.4+ | Validasi — frontend + backend shared |
| **lucide-react** | 0.546+ | Icons — 1000+ ikon konsisten |
| **react-hook-form** | 7.80+ | Form — performa, validasi terintegrasi |
| **FullCalendar** | 6.1+ | Kalender — drag & drop, multi-view |
| **date-fns** | 4.4+ | Tanggal — tree-shakeable, immutable |
| **jsPDF / xlsx** | 4.2+ / 0.18+ | Export — PDF dan Excel |
| **sonner** | 2.0+ | Toast — notifikasi ringan |
| **lenis** | 1.3+ | Scroll — smooth scroll experience |

### Backend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **NestJS** | 11.0+ | Framework — modular, DI, guard system |
| **Express** | 4.21+ | HTTP server — middleware stack |
| **Prisma** | 7.8+ | ORM — type-safe database access |
| **Argon2** | 0.44+ | Password hashing — argon2id (memory-hard) |
| **bcrypt** | 6.0+ | Fallback hashing — backward compatibility |
| **jsonwebtoken** | 9.0+ | JWT — access, refresh, reset token |
| **Zod** | 4.4+ | DTO Validation — runtime type checking |
| **cookie-parser** | 1.4+ | Cookie parsing — signed cookies |
| **helmet** | 8.2+ | Security headers — CSP, XSS, dll |
| **cors** | 2.8+ | CORS — allowed origins policy |
| **express-rate-limit** | 8.5+ | Rate limiting — brute force protection |
| **ioredis** | 5.11+ | Redis client — token blacklist (opsional) |
| **reflect-metadata** | 0.2+ | Decorators — NestJS DI |
| **class-transformer** | 0.5+ | Serialization — response transformation |
| **class-validator** | 0.15+ | Validation — decorator-based (fallback) |

### Database

| Database | Mode | Koneksi |
|----------|------|---------|
| **SQLite** (better-sqlite3) | Development | `file:./dev.db` |
| **PostgreSQL** (via Prisma) | Production | `DATABASE_URL` env |
| **Redis** (ioredis) | Opsional | `REDIS_URL` env |

---

## 🔐 Model Keamanan

SIAKAD menerapkan **defense-in-depth** — berlapis dari transport sampai database.

```
┌─────────────────────────────────────────────────────────────┐
│                     LAPISAN KEAMANAN                        │
├─────────────────────────────────────────────────────────────┤
│ 1. HTTPS (TLS)              — Semua trafik terenkripsi      │
│ 2. Helmet                   — Security HTTP headers         │
│ 3. CORS                     — Whitelist allowed origins     │
│ 4. Rate Limiting            — 200 req/15m global, 10 login  │
│ 5. CSRF Double-Submit       — Cookie + Header X-CSRF-Token │
│ 6. JWT Authentication       — Access (15m) + Refresh (7d)   │
│ 7. Role-Based Access        — AuthGuard → RolesGuard chain  │
│ 8. Input Validation         — Zod schemas di setiap input   │
│ 9. Password Hashing         — Argon2id (default) / bcrypt   │
│ 10. Audit Trail             — Semua operasi penting logged  │
└─────────────────────────────────────────────────────────────┘
```

### Detail Lapisan Keamanan

| Lapisan | Detail | Implementasi |
|---------|--------|-------------|
| **1. Transport** | HTTPS diperlukan di production | Nginx / reverse proxy |
| **2. HTTP Headers** | CSP, X-Frame-Options, XSS Protection, dll | `helmet()` middleware |
| **3. CORS** | Whitelist origin via `ALLOWED_ORIGINS` env | `cors()` dengan callback |
| **4. Rate Limit** | Global 200 req/15m, login 10 req/15m | `express-rate-limit` |
| **5. CSRF** | Double-submit pattern — token di cookie + header | Middleware kustom di `/api/` |
| **6. JWT Access** | 15 menit, dikirim HttpOnly cookie | `jsonwebtoken.sign/verify` |
| **7. JWT Refresh** | 7 hari, rotasi otomatis saat kedaluwarsa | AuthGuard auto-refresh |
| **8. JWT Reset** | 10 menit, one-time use + blacklist | `securityService` |
| **9. RBAC** | 9 role, guard chain | `AuthGuard` → `RolesGuard` |
| **10. Input Val** | Zod validation di controller | Schema sebelum service |
| **11. Hashing** | Argon2id (memory=4MB, time=3, par=1) | `argon2.hash()` / `bcrypt` fallback |
| **12. Audit** | Setiap event login/logout/KRS/security | `AuditService.log()` |

### Alur Autentikasi

```
Browser                              Server
   │                                    │
   │  GET /api/auth/csrf-token          │
   │──────────────────────────────────►│
   │◄──────────────────────────────────│ Set-Cookie: csrfToken=xxx
   │                                   │ Response: { csrfToken: "xxx" }
   │                                   │
   │  POST /api/auth/secure-login      │
   │  Cookie: csrfToken=xxx            │
   │  X-CSRF-Token: xxx                │
   │  Body: { username, password }     │
   │──────────────────────────────────►│
   │                                   │ Validasi CSRF
   │                                   │ Rate limit check
   │                                   │ Zod validation
   │                                   │ Argon2 verify
   │◄──────────────────────────────────│ Set-Cookie: token=JWT (HttpOnly)
   │                                   │ Set-Cookie: refreshToken=JWT
   │                                   │ Audit log: AUTH_LOGIN_SUCCESS
```

### Anti-Replay Attack (Password Reset)

```
User                        Server
  │                           │
  │ POST /auth/request-reset  │
  │ { email: "..." }         │
  │──────────────────────────►│
  │                           │ Sign JWT reset (10m expiry)
  │◄──────────────────────────│ (Email: token tersimpan)
  │                           │
  │ POST /auth/reset-confirm  │
  │ { token, newPassword }    │
  │──────────────────────────►│
  │                           │ 1. Cek blacklist (Redis/Set)
  │                           │ 2. Verify JWT + purpose
  │                           │ 3. Hash newPassword (Argon2)
  │                           │ 4. Update DB
  │                           │ 5. Invalidate token (blacklist)
  │                           │ 6. Audit log
  │◄──────────────────────────│ { status: "success" }
  │                           │
  │ (Token yang sama dikirim ulang)
  │──────────────────────────►│
  │                           │ 1. Cek blacklist → FOUND
  │                           │ 2. ALERT: replay attack detected
  │◄──────────────────────────│ 403: Token expired
```

---

## 📊 Diagram Alur

### Alur KRS (Course Registration)

```
 MAHASISWA                  BACKEND                     ADMIN/KAPRODI
    │                          │                             │
    │ Login + CSRF             │                             │
    │─────────────────────────►│                             │
    │                          │                             │
    │ GET /api/krs             │                             │
    │─────────────────────────►│                             │
    │◄─────────────────────────│ Daftar KRS + status         │
    │                          │                             │
    │ POST /api/krs/add-course │                             │
    │ { kode: "IF3110" }      │                             │
    │─────────────────────────►│                             │
    │                          ├── Cek duplikasi             │
    │                          ├── Cek SKS (max 24)         │
    │                          ├── Validasi kode matkul      │
    │◄─────────────────────────│                             │
    │                          │                             │
    │ POST /api/krs/submit     │                             │
    │─────────────────────────►│                             │
    │                          ├── Cek total SKS > 0        │
    │                          ├── Status → "Diajukan"      │
    │◄─────────────────────────│                             │
    │                          │                             │
    │                          │   GET /api/krs/students     │
    │                          │◄───────────────────────────│
    │                          │                             │
    │                          │   POST /api/krs/approve     │
    │                          │   { studentNim, approve }   │
    │                          │◄───────────────────────────│
    │                          ├── Validasi status           │
    │                          ├── Status → "Disetujui"     │
    │                          ├── Audit log                │
    │                          │                             │
    │ GET /api/krs             │                             │
    │─────────────────────────►│                             │
    │◄─────────────────────────│ Status: Disetujui ✅        │
    │                          │                             │
```

### Alur Login & Session

```
┌─────────┐          ┌─────────┐         ┌──────────┐
│ Browser │          │ Backend │         │ Database │
└────┬────┘          └────┬────┘         └────┬─────┘
     │                    │                    │
     │  GET csrf-token    │                    │
     │──────────────────► │                    │
     │◄───────────────────│ Set-Cookie         │
     │                    │                    │
     │  POST secure-login │                    │
     │  (CSRF cookie+head)│                    │
     │──────────────────► │                    │
     │                    │──findByUsername──►│
     │                    │◄───user data──────│
     │                    │                    │
     │                    │ Argon2 verify       │
     │                    │                    │
     │                    │ Sign JWT Access    │
     │                    │ Sign JWT Refresh   │
     │◄───────────────────│ Set-Cookie (HttpOnly)│
     │                    │                    │
     │  GET /api/krs      │                    │
     │  (Cookie: token)   │                    │
     │──────────────────► │                    │
     │                    │ Verify Access Token│
     │     [EXPIRED]      │                    │
     │◄───────────────────│ 401                │
     │                    │                    │
     │  [Auto-retry with Refresh Token]        │
     │──────────────────► │                    │
     │                    │ Verify Refresh     │
     │                    │ Sign NEW Access    │
     │◄───────────────────│ Set-Cookie (baru)   │
```

---

## 👥 Role & Hak Akses

### Matrix Role

| Role | Dashboard | KRS | KHS | Presensi | Admin | Audit | Settings |
|------|:---------:|:---:|:---:|:--------:|:-----:|:-----:|:--------:|
| **admin** | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| **dekan** | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| **kaprodi** | ✅ | ✅ | ✅ | ✅ | — | — | — |
| **lecturer** | ✅ | — | ✅ | ✅ | — | — | — |
| **baak** | ✅ | — | — | — | — | ✅ | — |
| **bauk** | ✅ | — | — | — | — | — | — |
| **student** | ✅ | ✅ | ✅ | ✅ | — | — | — |
| **applicant** | ✅ | — | — | — | — | — | — |
| **alumni** | ✅ | — | ✅ | — | — | — | — |

### Kredensial Seed (Development)

<!-- GAMBAR: halaman login dengan role selector, highlight demo accounts -->

> **Perhatian**: Password seed bersifat **acak per-user** demi keamanan. Saat pertama kali menjalankan server dalam mode development, password akan ditampilkan di console terminal. Atur environment variable `DEFAULT_SEED_PASSWORD` untuk password kustom.

| Role | Email | Password |
|------|-------|----------|
| 🛠 Admin | `admin@kampus.ac.id` | 🔑 Cek terminal |
| 🎓 Mahasiswa | `mahasiswa@kampus.ac.id` | 🔑 Cek terminal |
| 🎓 Mahasiswa (demo) | `ahmad.syafiq@mahasiswa.ac.id` | 🔑 Cek terminal |
| 👨‍🏫 Dosen | `budi.rahardjo@kampus.ac.id` | 🔑 Cek terminal |
| 📋 Kaprodi | `kaprodi@kampus.ac.id` | 🔑 Cek terminal |
| 🏛 Dekan | `dekan@kampus.ac.id` | 🔑 Cek terminal |
| 📊 BAAK | `baak@kampus.ac.id` | 🔑 Cek terminal |
| 💰 BAUK | `bauk@kampus.ac.id` | 🔑 Cek terminal |
| 👤 Calon Maba | `rian@gmail.com` | 🔑 Cek terminal |
| 🎓 Alumni | `rian.hidayat@alumni.ac.id` | 🔑 Cek terminal |

---

## 🚀 Panduan Setup

### Prasyarat

- **Node.js** ≥ 22.x
- **npm** ≥ 10.x
- **Git**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-org/siakad.git
cd siakad
```

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 3️⃣ Konfigurasi Environment

```bash
# Root env (dev convenience)
cp .env.example .env

# Backend env
cp backend/.env.example backend/.env
```

Edit `backend/.env` jika perlu (default sudah cukup untuk development):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET=           # auto-generate di dev
JWT_REFRESH_SECRET=          # auto-generate di dev
JWT_RESET_PASSWORD_SECRET=   # auto-generate di dev
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4️⃣ Setup Database

```bash
cd backend
npx prisma generate
npx prisma db push           # Buat database + seed data
cd ..
```

### 5️⃣ Jalankan Aplikasi

```bash
npm run dev
```

Ini menjalankan:
- **Backend**: `http://localhost:3000` (NestJS API)
- **Frontend**: `http://localhost:5173` (Vite dev server)

### 6️⃣ Buka Browser

Buka `http://localhost:5173` — Anda akan melihat halaman login dengan 10 akun demo.

---

## 🔧 Konfigurasi Lingkungan

### Root `.env`

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `PORT` | `3000` | Port backend |
| `NODE_ENV` | `development` | Environment mode |
| `DATABASE_URL` | `file:./backend/dev.db` | Koneksi database |
| `JWT_ACCESS_SECRET` | (auto) | Secret JWT access token |
| `JWT_REFRESH_SECRET` | (auto) | Secret JWT refresh token |
| `JWT_RESET_PASSWORD_SECRET` | (auto) | Secret JWT reset password |
| `COOKIE_SECRET` | (auto) | Secret signed cookies |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | CORS whitelist |
| `VITE_API_URL` | `http://localhost:3000` | Base URL API untuk frontend |

### Backend `backend/.env`

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `PORT` | `3000` | Port backend |
| `NODE_ENV` | `development` | Environment |
| `DATABASE_URL` | `file:./dev.db` | Koneksi Prisma |
| `JWT_ACCESS_SECRET` | (auto) | Secret JWT access (min 32 chars) |
| `JWT_REFRESH_SECRET` | (auto) | Secret JWT refresh |
| `JWT_RESET_PASSWORD_SECRET` | (auto) | Secret JWT reset password |
| `COOKIE_SECRET` | (auto) | Secret cookie parser |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | CORS |
| `REDIS_URL` | (opsional) | Redis untuk token blacklist |
| `DEFAULT_SEED_PASSWORD` | (random) | Override password seed |

### Environment untuk Production

```bash
NODE_ENV=production
JWT_ACCESS_SECRET=<min-32-char-random-string>
JWT_REFRESH_SECRET=<min-32-char-random-string>
JWT_RESET_PASSWORD_SECRET=<min-32-char-random-string>
COOKIE_SECRET=<min-32-char-random-string>
ALLOWED_ORIGINS=https://siakad.domain.ac.id
DATABASE_URL=postgresql://user:pass@host:5432/siakad?schema=public
```

> ⚠️ **Production Wajib**: Semua JWT secrets HARUS diisi dengan nilai random yang kuat. Jika tidak, server akan exit.

---

## 📡 API Reference

### Base URL

```
http://localhost:3000/api
```

### Authentication

Semua endpoint kecuali login/register/CSRF memerlukan:
- **Cookie**: `token=<JWT>` (HttpOnly, SameSite=Strict)
- Atau **Header**: `Authorization: Bearer <JWT>`
- **CSRF** untuk method POST/PUT/DELETE: Cookie `csrfToken` + Header `X-CSRF-Token`

### Auth Endpoints

| Method | Endpoint | Auth | Rate Limit | Deskripsi |
|--------|----------|:----:|:----------:|-----------|
| `GET` | `/api/auth/csrf-token` | — | — | Ambil CSRF token |
| `GET` | `/api/auth/me` | JWT | — | Profile user saat ini |
| `POST` | `/api/auth/secure-login` | — | 10/15m | Login dengan email + password |
| `POST` | `/api/auth/secure-register` | — | 10/15m | Registrasi (student/applicant) |
| `POST` | `/api/auth/reset-password-request` | — | Global | Request reset password |
| `POST` | `/api/auth/reset-password-confirm` | — | Global | Konfirmasi reset password |
| `POST` | `/api/auth/refresh-token` | JWT | — | Refresh access token |
| `GET` | `/api/auth/logout` | JWT | — | Logout + hapus cookie |

### KRS Endpoints

| Method | Endpoint | Auth | RBAC | Deskripsi |
|--------|----------|:----:|:----:|-----------|
| `GET` | `/api/krs` | JWT | — | Daftar KRS (milik sendiri) |
| `POST` | `/api/krs/add-course` | JWT | — | Tambah mata kuliah ke KRS |
| `POST` | `/api/krs/remove-course` | JWT | — | Hapus mata kuliah dari KRS |
| `POST` | `/api/krs/submit` | JWT | — | Ajukan KRS untuk approval |
| `GET` | `/api/krs/students` | JWT | admin/dekan/kaprodi | Semua KRS mahasiswa |
| `POST` | `/api/krs/approve` | JWT | admin/dekan/kaprodi | Setujui/tolak KRS |

### Audit & Monitoring Endpoints

| Method | Endpoint | Auth | RBAC | Deskripsi |
|--------|----------|:----:|:----:|-----------|
| `GET` | `/api/audit/audit-logs` | JWT | admin/dekan | Log audit trail |
| `GET` | `/api/telemetry` | JWT | admin/dekan | Data telemetry sistem |
| `GET` | `/api/infrastructure/cache-performance` | JWT | admin | Performa cache |
| `POST` | `/api/infrastructure/scale-simulate` | JWT | admin | Simulasi scale |
| `POST` | `/api/infrastructure/transaction-validate` | JWT | admin | Validasi transaksi ACID |
| `GET` | `/api/infrastructure/backup-recovery` | JWT | admin | Status backup |
| `GET` | `/api/infrastructure/jwt-secrets-status` | JWT | admin | Status secrets |
| `POST` | `/api/infrastructure/generate-key` | JWT | admin | Generate key baru |
| `POST` | `/api/infrastructure/rotate-secrets` | JWT | admin | Rotasi semua secret |

### Response Format

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "code": "CSRF_ERROR",
  "message": "CSRF token tidak valid."
}
```

**Error Codes:**
| Code | HTTP Status | Penyebab |
|------|:-----------:|----------|
| `CSRF_ERROR` | 403 | CSRF token tidak cocok |
| `VALIDATION_ERROR` | 400 | Input tidak sesuai schema |
| `AUTH_INVALID_CREDENTIALS` | 401 | Email/password salah |
| `AUTH_TOKEN_EXPIRED` | 401 | Token kedaluwarsa |
| `AUTH_RATE_LIMIT` | 429 | Terlalu banyak percobaan |
| `KRS_DUPLICATE_COURSE` | 400 | Mata kuliah sudah ada |
| `KRS_SKS_EXCEEDED` | 400 | Melebihi 24 SKS |
| `KRS_INVALID_STATUS` | 400 | Status KRS tidak sesuai |
| `KRS_NOT_FOUND` | 404 | KRS tidak ditemukan |

---

## 🧩 Widget Catalog

### Akademik & Mahasiswa

| Widget | File | Deskripsi | Role |
|--------|------|-----------|:----:|
| **Academic Absence Support** | `AcademicAbsenceSupport.tsx` | Pengajuan izin akademik | student |
| **Academic Chatbot** | `AcademicChatbot.tsx` | Chatbot tanya jawab akademik | all |
| **Academic Dates Widget** | `AcademicDatesWidget.tsx` | Tanggal penting akademik | all |
| **Announcement Ticker** | `AnnouncementTicker.tsx` | Pengumuman berjalan (marquee) | all |
| **Certified Digital Transcript** | `CertifiedDigitalTranscript.tsx` | Transkrip digital dengan kode verifikasi | student, alumni |
| **Degree Credit Progress Bar** | `DegreeCreditProgressBar.tsx` | Progress bar SKS 0→144 | student |
| **Semester Progress Bar** | `SemesterProgressBar.tsx` | Progress bar waktu semester | student |
| **Smart Course Recommendation** | `SmartCourseRecommendation.tsx` | Rekomendasi matkul berdasarkan SKS | student |
| **SKS Conversion Module** | `SksConversionModule.tsx` | Konversi SKS transfer/alin | student |

### Dosen & Akademik

| Widget | File | Deskripsi | Role |
|--------|------|-----------|:----:|
| **Lecturer Rating Module** | `LecturerRatingModule.tsx` | Rating & evaluasi dosen | lecturer, mahasiswa |
| **Centralized Tasks Module** | `CentralizedTasksModule.tsx` | Manajemen tugas terpusat | lecturer |

### Admin & Enterprise

| Widget | File | Deskripsi | Role |
|--------|------|-----------|:----:|
| **Enterprise Control Suite** | `EnterpriseControlSuite.tsx` | Panel kontrol enterprise | admin |
| **Digital Forms Tracker** | `DigitalFormsTracker.tsx` | Tracking formulir digital | baak |
| **Finance Details Breakdown** | `FinanceDetailsBreakdown.tsx` | Rincian keuangan mahasiswa | bauk |
| **Helpdesk System** | `HelpdeskSystem.tsx` | Sistem helpdesk terintegrasi | baak |
| **Feedback Widget** | `FeedbackWidget.tsx` | Widget umpan balik | all |

### UI & Utility

| Widget | File | Deskripsi |
|--------|------|-----------|
| **Siakad Preloader** | `SiakadPreloader.tsx` | Preloader animasi khas SIAKAD |
| **Skeleton Loader** | `SkeletonLoader.tsx` | Skeleton loading screen |
| **Modern SIA Features** | `ModernSiaFeatures.tsx` | Kumpulan fitur modern: LMS hybrid, komunikasi, SSO, security |

---

## 🧪 Testing

### Test Suite

```
backend/
└── tests/
    ├── auth-krs.test.ts        ◆ 17 integration tests (auth + KRS full flow)
    └── global-setup.ts          ◆ Database setup sebelum test
backend/src/
└── modules/
    ├── audit/
    │   └── audit.service.spec.ts  ◆ 3 unit tests (audit log CRUD)
    └── security/
        └── security.service.spec.ts ◆ 6 unit tests (hashing + verify)
```

### Cakupan Test

| Area | Jumlah Test | Cakupan |
|------|:----------:|---------|
| 🔐 **Auth — CSRF** | 2 | Token valid, missing token, mismatch token |
| 🔐 **Auth — Login** | 3 | Student login sukses, admin login sukses, password salah |
| 🔐 **Auth — Logout** | 1 | Session termination |
| 📋 **KRS — CRUD** | 4 | Tambah matkul, duplikasi, SKS limit, hapus matkul |
| 📋 **KRS — Submit** | 1 | Transisi Draft → Diajukan |
| 📋 **KRS — RBAC** | 2 | Student block dari list, admin access |
| 📋 **KRS — Approval** | 3 | Approve sukses, block double-review, invalid status |
| 🔄 **Password Reset** | 1 | Replay attack detection |
| 🔒 **Security — Hashing** | 3 | Hash, verify benar, verify salah |
| 🔒 **Security — Algo** | 3 | Argon2 & bcrypt fallback |
| 📝 **Audit Log** | 3 | Init, create, filter |

### Menjalankan Test

```bash
cd backend

# Semua test
npx vitest run

# Dengan coverage
npx vitest run --coverage

# Watch mode (development)
npx vitest

# Test spesifik
npx vitest run tests/auth-krs.test.ts
npx vitest run src/modules/security/security.service.spec.ts
```

---

## 🗄 Perbandingan Database

| Fitur | SQLite (Development) | PostgreSQL (Production) | Redis (Opsional) |
|-------|:-------------------:|:----------------------:|:----------------:|
| **Tipe** | File-based | Relational server | In-memory key-value |
| **Setup** | Zero config | Docker / server | Docker / server |
| **Performance** | Single-writer | Multi-writer, concurrent | < 1ms latency |
| **Digunakan untuk** | Semua data | Semua data | Token blacklist |
| **Koneksi** | `DATABASE_URL` | `DATABASE_URL` | `REDIS_URL` |
| **Docker** | Tidak perlu | `docker-compose.yml` | `docker-compose.yml` |

```bash
# Development — SQLite (default)
DATABASE_URL="file:./dev.db"

# Production — PostgreSQL
DATABASE_URL="postgresql://user:pass@host:5432/siakad?schema=public"

# Opsional — Redis untuk token blacklist
REDIS_URL="redis://localhost:6379"
```

---

## 🐳 Docker Deployment

### Stack Lengkap (PostgreSQL + Redis)

```bash
docker-compose up -d
```

Ini menjalankan:
- **PostgreSQL 15** — database production
- **Redis 7** — token blacklist + caching

### Backend Container

```bash
cd backend
docker build -t siakad-backend .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_ACCESS_SECRET="..." \
  -e JWT_REFRESH_SECRET="..." \
  -e JWT_RESET_PASSWORD_SECRET="..." \
  -e COOKIE_SECRET="..." \
  -e NODE_ENV=production \
  siakad-backend
```

### Dockerfile (Backend)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
USER nestjs
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]
```

---

## 🤝 Kontribusi

### Panduan Kontribusi

1. **Fork repository**
2. **Buat branch fitur**: `git checkout -b feat/fitur-keren`
3. **Commit perubahan**: `git commit -m 'feat: tambah fitur keren'`
4. **Push ke branch**: `git push origin feat/fitur-keren`
5. **Buat Pull Request**

### Aturan Commit

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Contoh |
|--------|--------|
| `feat:` | `feat: tambah modul presensi` |
| `fix:` | `fix: validasi SKS tidak terpanggil` |
| `security:` | `security: harden JWT verification` |
| `docs:` | `docs: update README` |
| `refactor:` | `refactor: extract KRS validation` |
| `test:` | `test: tambah integration test` |
| `chore:` | `chore: update dependencies` |

### Code Style

- **Frontend**: React functional components + hooks, Tailwind utility classes
- **Backend**: NestJS module structure, dependency injection
- **Umum**: TypeScript strict mode, Zod validation di semua input

---

## ❓ FAQ

**Q: Kenapa pilih Modular Monolith bukan Microservices?**
A: Modular monolith memberi kemudahan deployment monolit dengan disiplin pemisahan modul. Untuk skala institusi pendidikan (ribuan user bukan jutaan), microservices hanya menambah kompleksitas tanpa manfaat signifikan. Migrasi ke microservices tetap mungkin nanti karena modul sudah terpisah dengan baik.

**Q: Database apa yang dipakai di production?**
A: PostgreSQL direkomendasikan untuk production. SQLite untuk development. Prisma ORM memudahkan migrasi antar database — cukup ubah `DATABASE_URL`.

**Q: Apakah ada REST API documentation?**
A: Ya, lihat [API Reference](#-api-reference) di atas. Untuk dokumentasi interaktif, bisa ditambahkan Swagger di iterasi berikutnya.

**Q: Bagaimana cara menambah role baru?**
A: Tambahkan role ke enum, buat file view baru di `frontend/src/components/views/`, tambahkan guard rules di `ability.ts` (frontend) dan `RolesGuard` (backend).

**Q: Apakah mendukung single sign-on (SSO)?**
A: Belum. SSO bisa ditambahkan sebagai modul auth terpisah di iterasi berikutnya.

**Q: Bagaimana performanya?**
A: Dengan SQLite medium load (dev) sangat responsif. Dengan PostgreSQL + Redis, bisa handle ribuan request simultan.

**Q: Apakah bisa di-deploy di shared hosting?**
A: Tidak disarankan. SIAKAD membutuhkan Node.js runtime dan akses database (SQLite atau PostgreSQL). VPS / cloud server minimal 1GB RAM.

---

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <strong>SIAKAD — Sistem Informasi Akademik Terpadu</strong><br>
  Dibangun dengan ❤️ untuk pendidikan Indonesia
</p>

<p align="center">
  <a href="README-EN.md">🇺🇸 English Version</a>
</p>
