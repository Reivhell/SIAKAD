# Portal Akademik SIAKAD Modern - Enterprise Architecture Guide

Selamat datang di panduan arsitektur skala enterprise untuk **Portal Akademik SIAKAD Modern**. Dokumen ini merangkum desain arsitektur, pola rancangan (design patterns), komponen keamanan, struktur direktori, dan integrasi full-stack yang diterapkan pada platform ini untuk memastikan skalabilitas, keandalan, kepatuhan audit, dan kemudahan pemeliharaan.

---

## 1. Tinjauan Sistem (System Overview)

Portal Akademik SIAKAD dirancang menggunakan pendekatan **Full-Stack Modular Modern**. Sistem ini memisahkan secara tegas urusan client-side (React + Vite) dan server-side (NestJS yang berjalan di atas Express) dengan protokol pertukaran data berbasis REST API yang dilengkapi pengamanan tinggi.

```
       +--------------------------------------------------------+
       |                  CLIENT LAYER (React)                  |
       |  - UI Views (Dashboard, KRS, KHS, Presensi, dll)       |
       |  - Widgets (AcademicChatbot, CertifiedTranscript, etc) |
       |  - Zustand (Centralized Client State Engine)           |
       |  - Services Layer (api.client.ts, auth.service.ts)    |
       +--------------------------------------------------------+
                                   |
                         JSON REST API (Port 3000)
                  Double-Submit CSRF & JWT Cookie Auth
                                   |
                                   v
       +--------------------------------------------------------+
       |                  BACKEND LAYER (NestJS)                |
       |  - Nest Express Adapter                                |
       |  - Guards (AuthGuard, RolesGuard RBAC Enforcer)        |
       |  - Modules (Auth, Users, KRS, Security, System, DB)   |
       |  - Repositories (In-Memory Database & Persistence)     |
       |  - Interceptors (Structured Logging, Performance Trace)|
       |  - Exception Filters (Global Response Formatter)       |
       +--------------------------------------------------------+
```

---

## 2. Struktur Direktori Enterprise (Directory Structure)

Penyusunan kode mengikuti standar industri untuk memisahkan logika presentasi, state manajemen, dan integrasi API:

```
├── server.ts                    # NestJS Bootstrapper & Express integration
├── tsconfig.json                # Strict TypeScript configurations
├── vite.config.ts               # Vite bundler options
├── ARCHITECTURE.md              # [THIS FILE] System Architecture Documentation
├── src/
│   ├── main.tsx                 # Client entrypoint & Event interception
│   ├── App.tsx                  # Main Client App, Router & Layout distributor
│   ├── types.ts                 # Shared domain interfaces (User, Student, Course)
│   ├── store.ts                 # Zustand Global client store
│   ├── index.css                # Global styles (Tailwind CSS configuration)
│   ├── lib/                     # Client libraries and core utilities
│   │   ├── ability.ts           # CASL-based Authorization rules
│   │   ├── api.ts               # Axios-based legacy configurations & Mock APIs
│   │   ├── i18n.ts              # Internationalization & Language Switcher
│   │   └── utils.ts             # Tailwind CSS helper library (cn utility)
│   ├── services/                # [NEW] Decoupled Clean Service Layer
│   │   ├── api.client.ts        # Central HttpClient wrapping fetch, CSRF & Events
│   │   ├── auth.service.ts      # Authentication domain API calls
│   │   └── krs.service.ts       # Study Plan (KRS) domain API calls
│   ├── components/              # Component architecture
│   │   ├── layout/              # Structural wrappers (Sidebar, Header, Footer)
│   │   ├── profile/             # Profile details and settings UI elements
│   │   ├── views/               # Module views matching specific system routes
│   │   └── widgets/             # Specialized isolated micro-features (chatbot, transcrips)
│   └── nestjs/                  # Enterprise NestJS backend framework code
│       ├── app.module.ts        # Global NestJS Registry
│       ├── common/              # Cross-cutting concerns
│       │   ├── decorators/      # Custom Roles decorators
│       │   ├── filters/         # HttpException exception filter
│       │   ├── guards/          # AuthGuard & RolesGuard
│       │   └── interceptors/    # Logging, Latency tracking
│       └── modules/             # Business modules
│           ├── auth/            # JWT controllers & signers
│           ├── database/        # Thread-safe repository layers
│           ├── krs/             # Study Plan registration, removal & approval
│           ├── security/        # Cryptography, CSP configs, CSRF validations
│           ├── system/          # Audit Logger, diagnostics
│           └── users/           # User lookup registries
└── tests/                       # Automated Testing Suite
    └── integration/             # Full-Stack Role-Based Access Control integration tests
```

---

## 3. Desain Arsitektur Backend (NestJS Enterprise Layer)

Sektor backend dikembangkan menggunakan kerangka kerja **NestJS** untuk menjamin struktur kode yang kokoh, injeksi ketergantungan (Dependency Injection), dan kemudahan perluasan sistem.

### 3.1. Penanganan Galat Global (HttpExceptionFilter)
Backend mendaftarkan Exception Filter global (`HttpExceptionFilter`) untuk memastikan seluruh kesalahan dalam aplikasi (baik kesalahan autentikasi, parameter tidak valid, hingga kegagalan internal server) direspon menggunakan format JSON terstandar yang aman:
```json
{
  "status": "error",
  "code": "CSRF_ERROR",
  "message": "Keamanan CSRF: Permintaan ditolak...",
  "timestamp": "2026-06-30T09:07:00.000Z",
  "path": "/api/krs/approve"
}
```

### 3.2. Logging & Metrik Performa (LoggingInterceptor)
Melalui Interceptor global, setiap aktivitas request dipantau secara real-time. Jika durasi eksekusi melebihi **50ms**, sistem secara otomatis mengkategorikan kejadian tersebut sebagai peringatan performa (`PERF ALERT`) dan menyimpannya di log aktivitas untuk dianalisis oleh administrator sistem.

### 3.3. Pengamanan Ganda Tingkat Tinggi (Security System)
Keamanan siber diimplementasikan pada beberapa lapis sistem:
1. **Double-Submit Cookie Pattern (CSRF)**: Setiap mutasi data non-GET memvalidasi kecocokan token di header `X-CSRF-Token` dengan isi cookie `csrfToken`.
2. **Secure Password Hashing**: Menggunakan algoritme hashing moderen dengan salt acak unik untuk memastikan integritas kredensial pengguna.
3. **HTTP Security Headers (Helmet)**: Mengaktifkan pengaturan Content Security Policy (CSP) khusus yang dirancang ramah terhadap rendering iframe (AI Studio preview) tanpa mengurangi resistensi terhadap serangan Cross-Site Scripting (XSS).
4. **Brute Force Rate Limiter**: Membatasi akses request per IP pada rute `/api` untuk mencegah serangan Denial of Service (DoS) dan brute force penebakan kata sandi.

---

## 4. Desain Arsitektur Frontend (React Enterprise Layer)

Sisi frontend mengedepankan performa tinggi, animasi mikro yang responsif, dan struktur kode modular.

### 4.1. Zustand State Engine
Aplikasi menggunakan **Zustand** sebagai mesin pengelola state global. Berbeda dengan Redux yang verbose atau Context API yang rentan memicu re-render massal, Zustand bekerja secara efisien dengan performa tinggi untuk menyimpan status pengguna aktif, preferensi tema, daftar notifikasi, serta aktivitas kalender akademik.

### 4.2. [NEW] Centralized Services & HttpClient
Untuk meniadakan penulisan raw `fetch` secara berulang yang tersebar di puluhan widget, kami merilis **Centralized Services Layer** di dalam `/src/services`:
- **`HttpClient` (`api.client.ts`)**: Berfungsi sebagai gerbang tunggal pengirim HTTP request. Ia secara transparan membaca cookie CSRF, menginjeksi header, memicu event progress global untuk memunculkan loading spinner, dan memformat pesan galat API agar mudah dikonsumsi UI.
- **`AuthService` (`auth.service.ts`)**: Pusat pemrosesan login, registrasi, logout, penyetelan ulang kata sandi, dan sinkronisasi data sesi pengguna.
- **`KrsService` (`krs.service.ts`)**: Pusat pemrosesan pengisian mata kuliah (KRS) mahasiswa dan persetujuan dosen wali.

---

## 5. Hubungan Integrasi Full-Stack & Pengujian

Aplikasi ini dilengkapi pengujian integrasi berbasis **Vitest** (`tests/integration/auth-krs.test.ts`) yang mensimulasikan siklus lengkap portal akademik:
1. **Otentikasi & Keamanan Sesi**: Memastikan token JWT, CSRF, dan masa kedaluwarsa berfungsi normal.
2. **Role-Based Access Control (RBAC)**: Memverifikasi sistem memblokir akun berspesifikasi rendah (mahasiswa) saat berupaya menjangkau endpoint administratif, namun tetap mengijinkan akun berspesifikasi tinggi (kaprodi, dekan, admin) untuk melakukan persetujuan.
3. **Pemberian Persetujuan KRS**: Memastikan perubahan status dari draf, diajukan, hingga disetujui tercatat dalam log audit secara aman.

---

## 6. Prosedur Produksi & Build Skala Enterprise

Sistem siap dideploy menuju infrastruktur cloud modern (seperti Google Cloud Run atau Kubernetes):
- **Build Server**: `esbuild` melakukan bundling script TypeScript server menjadi satu berkas CJS standalone (`dist/server.cjs`), meniadakan kendala kompatibilitas ES Modules di level sistem operasi produksi.
- **Build Client**: `vite build` mengompilasi berkas frontend menjadi berkas statis teroptimasi penuh (minified, code-split, cache-busted) di dalam direktori `dist/`.
- **Eksekusi Standalone**: Server berjalan secara mandiri menggunakan runtime Node standar dengan perintah `npm start`, melayani REST API seketika sekaligus mendistribusikan aset statis React Single Page Application (SPA).
