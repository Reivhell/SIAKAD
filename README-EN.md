# 🇺🇸 SIAKAD — Academic Information System

<p align="center">
  <a href="README.md">🇮🇩 Bahasa Indonesia</a>
</p>

<p align="center">
  <!-- HERO IMAGE: Same as README.md — replace with actual hero banner (1920×480) -->
  <img src="docs/screenshots/hero-banner.png" alt="SIAKAD — Cloud-Based Academic Information System" width="100%">
</p>

<p align="center">
  <strong>Modern Academic Information System • Modular Monolith • Multi-Role • Multi-Language</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status: Active">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License MIT">
  <img src="https://img.shields.io/badge/architecture-Modular%20Monolith-8b5cf6?style=flat-square" alt="Architecture">
  <img src="https://img.shields.io/badge/frontend-React%2019-61dafb?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/backend-NestJS%2011-ea2845?style=flat-square&logo=nestjs" alt="NestJS 11">
  <img src="https://img.shields.io/badge/database-Prisma%207-2d3748?style=flat-square&logo=prisma" alt="Prisma 7">
  <img src="https://img.shields.io/badge/style-Tailwind%204-0ea5e9?style=flat-square&logo=tailwindcss" alt="Tailwind 4">
  <img src="https://img.shields.io/badge/tests-26%20passing-brightgreen?style=flat-square" alt="Tests: 26 passing">
  <img src="https://img.shields.io/badge/i18n-4%20languages-0ea5e9?style=flat-square" alt="4 Languages">
</p>

<hr>

## 📋 Table of Contents

- [📖 About SIAKAD](#-about-siakad)
- [📸 Preview & Screenshots](#-preview--screenshots)
- [✨ Features](#-features)
- [🏗 Architecture](#-architecture)
- [⚙️ Technology Stack](#️-technology-stack)
- [🔐 Security Model](#-security-model)
- [📊 Flow Diagrams](#-flow-diagrams)
- [👥 Roles & Access](#-roles--access)
- [🚀 Setup Guide](#-setup-guide)
- [🔧 Environment Configuration](#-environment-configuration)
- [📡 API Reference](#-api-reference)
- [🧩 Widget Catalog](#-widget-catalog)
- [🧪 Testing](#-testing)
- [🐳 Docker Deployment](#-docker-deployment)
- [🤝 Contributing](#-contributing)
- [❓ FAQ](#-faq)
- [📄 License](#-license)

---

## 📖 About SIAKAD

SIAKAD is a **modern web-based Academic Information System** built as a **Modular Monolith** — a single application with clean module separation between the React frontend and NestJS backend. Designed for Indonesian higher education institutions, it supports **9 (nine) user roles** simultaneously.

### Vision

Deliver a modern, secure, and extensible academic information system — bridging the development simplicity of a monolith with the discipline of modular architecture.

### Problems Solved

| Problem | SIAKAD Solution |
|---------|----------------|
| Legacy PHP monolithic academic systems | Modular architecture with React 19 + NestJS 11 |
| Weak security (MD5/basic auth) | JWT + refresh token, CSRF double-submit, Argon2id, rate limiting |
| Hard-to-maintain unstructured code | Clean module separation + Prisma ORM + dependency injection |
| No audit trail | Audit log + telemetry + security event logging |
| Difficult to add new features | Plugin-like architecture with independent sub-modules |
| Single language only | Multi-language i18n (ID, EN, ZH, AR) with RTL support |

### Target Users

| User | Key Needs |
|------|-----------|
| **Students** | Course registration, grades, attendance, semester progress, digital transcript |
| **Lecturers** | Class attendance, thesis supervision, journal, evaluation, grading |
| **Department Heads** | Class approval, SKS monitoring, academic reports |
| **Dean** | Faculty overview, reports, evaluation |
| **Admin** | Master data, system monitoring, audit, configuration |
| **BAAK** | Academic administration, helpdesk, digital forms |
| **BAUK** | Finance bureau, student financial breakdown |
| **Applicants** | Online registration, admission info |
| **Alumni** | Transcript, digital diploma, tracer study |

---

## 📸 Preview & Screenshots

### Login Page

<!-- IMAGE: Login page with role selector and language switcher -->
<p align="center">
  <img src="docs/screenshots/login-page.png" alt="SIAKAD Login Page" width="800">
  <br><em>Login page with account role preview and language selector</em>
</p>

### Role Dashboards

| Role | Dashboard Preview | Description |
|------|------------------|-------------|
| 🎓 **Student** | <!-- IMAGE: student dashboard with KRS, grades, progress bar --> | Academic overview, KRS, grades, SKS progress |
| 👨‍🏫 **Lecturer** | <!-- IMAGE: lecturer dashboard with schedule, supervision, attendance --> | Teaching schedule, thesis supervision, journal, evaluation |
| 📋 **Department Head** | <!-- IMAGE: kaprodi dashboard with approval, monitoring --> | KRS approval, SKS monitoring, reports |
| 🏛 **Dean** | <!-- IMAGE: dean dashboard with faculty overview --> | Faculty overview, charts, reports |
| ⚙️ **Admin** | <!-- IMAGE: admin dashboard with master data, monitoring --> | Control panel, audit, system monitoring |
| 📊 **BAAK** | <!-- IMAGE: baak dashboard --> | Academic administration, helpdesk |
| 💰 **BAUK** | <!-- IMAGE: bauk dashboard --> | Finance, payments |
| 👤 **Applicant** | <!-- IMAGE: applicant dashboard --> | Registration, information |
| 🎓 **Alumni** | <!-- IMAGE: alumni dashboard --> | Transcript, diploma, tracer |

### Course Registration Flow (GIF)

<!-- GIF: Full KRS flow — login → add courses → submit → admin approval -->
<p align="center">
  <img src="docs/screenshots/krs-flow.gif" alt="KRS Flow Demo" width="800">
  <br><em>End-to-end course registration: Login → Select Courses → Submit → Admin Approval</em>
</p>

### Feature Demos (GIF)

| Feature | GIF | Duration |
|---------|-----|----------|
| 🎯 **Smart Course Recommendation** | <!-- GIF: auto course recommendation demo --> | ~15s |
| 📊 **Degree Credit Progress Bar** | <!-- GIF: interactive SKS progress bar --> | ~10s |
| 🤖 **Academic Chatbot** | <!-- GIF: AI academic chatbot demo --> | ~20s |
| 📋 **Thesis Supervision** | <!-- GIF: supervision chat + draft upload --> | ~25s |
| 📈 **Recharts Dashboard** | <!-- GIF: interactive chart dashboard --> | ~15s |
| 🔄 **Attendance & Calendar** | <!-- GIF: attendance marking + calendar --> | ~15s |

### Interactive Showcase

<!-- IMAGE: showcase page with data table, charts, calendar, export features -->
<p align="center">
  <img src="docs/screenshots/showcase.png" alt="Interactive Showcase" width="800">
  <br><em>Demo page: data tables, Recharts, FullCalendar, XLSX/PDF export</em>
</p>

---

## ✨ Features

### 1️⃣ Academic Module

| Feature | Student | Lecturer | Dept. Head | Admin |
|---------|:-------:|:--------:|:----------:|:-----:|
| **KRS** — Course Registration | ✅ | — | — | — |
| **KRS** — Approval | — | — | ✅ | ✅ |
| **KRS** — History per Semester | ✅ | — | — | — |
| **KRS** — Status Tracking | ✅ | ✅ | ✅ | ✅ |
| **KHS** — View Grades per Semester | ✅ | — | ✅ | ✅ |
| **KHS** — Grade Input | — | ✅ | ✅ | ✅ |
| **Attendance** — Class Absence | ✅ | ✅ | — | — |
| **Attendance** — Summary Report | ✅ | ✅ | ✅ | ✅ |
| **Academic Calendar** | ✅ | ✅ | ✅ | ✅ |

### 2️⃣ Student Module

| Feature | Description |
|---------|-------------|
| 📝 **Course Registration** | Add/remove courses with SKS validation (max 24), duplicate filtering |
| 📊 **Semester Grades** | View grades per semester in tables and charts |
| 📈 **Degree Credit Progress** | Visual SKS progress bar toward 144 graduation SKS |
| 📑 **Certified Digital Transcript** | Digital transcript with verification code |
| 💡 **Smart Course Recommendation** | Course recommendations based on remaining SKS |
| 📅 **Academic Dates** | Important dates: midterms, finals, holidays, registration |
| 🗣 **Academic Chatbot** | Automated Q&A for academic inquiries |
| 📋 **Lecturer Evaluation** | Online lecturer evaluation form (EDOM) |
| 📎 **Digital Forms** | Leave, withdrawal, re-registration forms |

### 3️⃣ Lecturer Module

| Feature | Description |
|---------|-------------|
| 📋 **Teaching Schedule** | Weekly schedule view, filter by day/room |
| 👥 **Class Attendance** | Per-meeting attendance input, attendance summary |
| 📝 **Grading** | Input assignment, midterm, final exam grades per class |
| 📖 **Thesis Supervision** | Chat with students, draft upload, progress tracking |
| 📚 **Academic Journal** | Daily academic activity log, PDF export |
| 📎 **Assignments & Materials** | Upload course materials, distribute assignments |
| ⭐ **Evaluation Results** | Student evaluation results (ratings) |
| 💬 **Communication** | Messaging with students, discussion forums |

### 4️⃣ Admin Module

| Feature | Description |
|---------|-------------|
| 🗂 **Master Data** | CRUD users, study programs, rooms, courses, semesters |
| 👤 **User Management** | Create/edit/delete all role users, password reset |
| 📊 **Monitoring** | Activity logs, system performance, audit trail, telemetry |
| 🔒 **Security Panel** | JWT secret status, key generation, secret rotation |
| 🔄 **Infrastructure** | Scale simulation, ACID transaction validation, backup/recovery |
| 🎛 **Enterprise Control Suite** | Integrated control panel for power users |
| 🛠 **System Settings** | Global configuration, role management, notification settings |

---

## 🏗 Architecture

```
siaKAD ──────────────────────────────────────────────────────────────
│
├── 📁 frontend/             ◆ React 19 SPA + Vite 6
│   └── src/
│       ├── api/             ◆ Axios instance + per-module API client
│       ├── components/
│       │   ├── layout/      ◆ Sidebar, Header, Breadcrumb, Notifications
│       │   ├── views/       ◆ 21+ role-based page views
│       │   ├── widgets/     ◆ 20+ reusable widget components
│       │   └── ui/          ◆ Shared UI components
│       ├── utils/
│       │   ├── i18n.ts      ◆ Internationalization (ID/EN/ZH/AR)
│       │   ├── ability.ts   ◆ CASL — role-based authorization
│       │   ├── api.ts       ◆ Common API functions
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
│   │   │   ├── auth/        ◆ Login, register, CSRF, password reset
│   │   │   ├── krs/         ◆ KRS CRUD + approval workflow
│   │   │   ├── users/       ◆ User seeding, find, update
│   │   │   ├── audit/       ◆ Audit log, telemetry, infrastructure
│   │   │   └── security/    ◆ JWT, hashing, token invalidation
│   │   └── server.ts        ◆ Bootstrap Express + middleware stack
│   ├── prisma/
│   │   └── schema.prisma    ◆ Models: User, KRS, AuditRecord
│   └── tests/               ◆ Integration & unit tests
│
├── 📄 docker-compose.yml    ◆ PostgreSQL + Redis (optional)
├── 📄 .env.example          ◆ Root environment template
└── 📄 package.json          ◆ Root workspace scripts
```

---

## ⚙️ Technology Stack

See [README.md](README.md#%EF%B8%8F-stack-teknologi) (Indonesian) for the full technology table.

### Frontend Highlights

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.0+ | Declarative UI components |
| **Vite** | 6.2+ | Build tool — fast HMR, optimized production builds |
| **Tailwind CSS** | 4.1+ | Utility-first styling |
| **TanStack Query** | 5.101+ | Server state — caching, refetch, mutations |
| **TanStack Table** | 8.21+ | Data tables — sorting, filtering, pagination |
| **Radix UI** | 1.1+ | Accessible unstyled primitives |
| **Recharts** | 3.9+ | Charts — responsive, interactive |
| **CASL** | 7.0+ | Client-side RBAC |

### Backend Highlights

| Technology | Version | Purpose |
|-----------|---------|---------|
| **NestJS** | 11.0+ | Modular framework — DI, guards |
| **Prisma** | 7.8+ | Type-safe ORM |
| **Argon2** | 0.44+ | Memory-hard password hashing (argon2id) |
| **jsonwebtoken** | 9.0+ | JWT — access, refresh, reset tokens |
| **Zod** | 4.4+ | Runtime DTO validation |

---

## 🔐 Security Model

SIAKAD implements **defense-in-depth** — layered security from transport to database.

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│ 1. HTTPS (TLS)              — All traffic encrypted         │
│ 2. Helmet                   — Security HTTP headers         │
│ 3. CORS                     — Whitelist allowed origins     │
│ 4. Rate Limiting            — 200 req/15m global, 10 login  │
│ 5. CSRF Double-Submit       — Cookie + Header X-CSRF-Token │
│ 6. JWT Authentication       — Access (15m) + Refresh (7d)   │
│ 7. Role-Based Access        — AuthGuard → RolesGuard chain  │
│ 8. Input Validation         — Zod schemas for all input     │
│ 9. Password Hashing         — Argon2id (default) / bcrypt   │
│ 10. Audit Trail             — All critical operations logged│
└─────────────────────────────────────────────────────────────┘
```

For detailed security flow diagrams (auth flow, password reset anti-replay), see the [Indonesian README](README.md#-model-keamanan).

---

## 👥 Roles & Access

### Role Matrix

| Role | Dashboard | KRS | KHS | Attendance | Admin | Audit | Settings |
|------|:---------:|:---:|:---:|:----------:|:-----:|:-----:|:--------:|
| **admin** | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| **dean** | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| **dept. head** | ✅ | ✅ | ✅ | ✅ | — | — | — |
| **lecturer** | ✅ | — | ✅ | ✅ | — | — | — |
| **baak** | ✅ | — | — | — | — | ✅ | — |
| **bauk** | ✅ | — | — | — | — | — | — |
| **student** | ✅ | ✅ | ✅ | ✅ | — | — | — |
| **applicant** | ✅ | — | — | — | — | — | — |
| **alumni** | ✅ | — | ✅ | — | — | — | — |

### Seed Credentials (Development)

> **Note**: Passwords are **random per-user** for security. On first dev server start, passwords are printed to the terminal console. Set `DEFAULT_SEED_PASSWORD` env for a custom password.

| Role | Email | Password |
|------|-------|----------|
| 🛠 Admin | `admin@kampus.ac.id` | 🔑 Check terminal |
| 🎓 Student | `mahasiswa@kampus.ac.id` | 🔑 Check terminal |
| 👨‍🏫 Lecturer | `budi.rahardjo@kampus.ac.id` | 🔑 Check terminal |
| 📋 Dept. Head | `kaprodi@kampus.ac.id` | 🔑 Check terminal |
| 🏛 Dean | `dekan@kampus.ac.id` | 🔑 Check terminal |

---

## 🚀 Setup Guide

### Prerequisites

- **Node.js** ≥ 22.x
- **npm** ≥ 10.x
- **Git**

### Quick Start

```bash
# Clone
git clone https://github.com/your-org/siakad.git
cd siakad

# Install dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# Environment setup
cp .env.example .env
cp backend/.env.example backend/.env

# Database
cd backend
npx prisma generate
npx prisma db push
cd ..

# Run both servers
npm run dev
```

- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

---

## 📡 API Reference

### Base URL

```
http://localhost:3000/api
```

### Auth

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|:----:|:----------:|-------------|
| `GET` | `/api/auth/csrf-token` | — | — | Get CSRF token |
| `GET` | `/api/auth/me` | JWT | — | Current user profile |
| `POST` | `/api/auth/secure-login` | — | 10/15m | Login with email + password |
| `POST` | `/api/auth/secure-register` | — | 10/15m | Register (student/applicant) |
| `POST` | `/api/auth/reset-password-request` | — | Global | Request password reset |
| `POST` | `/api/auth/reset-password-confirm` | — | Global | Confirm password reset |
| `POST` | `/api/auth/refresh-token` | JWT | — | Refresh access token |
| `POST` | `/api/auth/logout` | JWT | — | Logout + clear cookies |

### KRS (Course Registration)

| Method | Endpoint | Auth | RBAC | Description |
|--------|----------|:----:|:----:|-------------|
| `GET` | `/api/krs` | JWT | — | Your course list |
| `POST` | `/api/krs/add-course` | JWT | — | Add course to KRS |
| `POST` | `/api/krs/remove-course` | JWT | — | Remove course from KRS |
| `POST` | `/api/krs/submit` | JWT | — | Submit KRS for approval |
| `GET` | `/api/krs/students` | JWT | admin/dean/hod | All student KRS records |
| `POST` | `/api/krs/approve` | JWT | admin/dean/hod | Approve/reject KRS |

### Error Codes

| Code | HTTP | Description |
|------|:----:|-------------|
| `CSRF_ERROR` | 403 | CSRF token mismatch |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `AUTH_TOKEN_EXPIRED` | 401 | Token expired |
| `AUTH_RATE_LIMIT` | 429 | Too many attempts |
| `KRS_DUPLICATE_COURSE` | 400 | Course already in KRS |
| `KRS_SKS_EXCEEDED` | 400 | Exceeds 24 SKS limit |
| `KRS_INVALID_STATUS` | 400 | KRS status not valid for action |
| `KRS_NOT_FOUND` | 404 | KRS record not found |

---

## 🧪 Testing

```bash
cd backend

# Run all tests
npx vitest run

# Specific test files
npx vitest run tests/auth-krs.test.ts
npx vitest run src/modules/security/security.service.spec.ts
```

**Coverage**: 26 tests (17 integration + 9 unit), covering auth, CSRF, KRS CRUD, RBAC, password hashing, audit logs, and replay attack prevention.

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

Build and run backend container:

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

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/awesome-feature`
3. **Commit**: `git commit -m 'feat: add awesome feature'`
4. **Push**: `git push origin feat/awesome-feature`
5. **Open a Pull Request**

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `security:`, `docs:`, `refactor:`, `test:`, `chore:`

---

## ❓ FAQ

**Q: Why Modular Monolith instead of Microservices?**
A: Modular monolith provides the deployment simplicity of a monolith with clean module separation. For university-scale workloads (thousands, not millions), microservices add complexity without meaningful benefits. Migration to microservices remains possible since modules are already well-separated.

**Q: Which database for production?**
A: PostgreSQL is recommended for production. SQLite for development. Prisma ORM makes migration seamless — just change `DATABASE_URL`.

**Q: How to add a new role?**
A: Add role to the enum, create a view file in `frontend/src/components/views/`, add guard rules in `ability.ts` (frontend) and `RolesGuard` (backend).

**Q: Does it support SSO?**
A: Not yet. SSO can be added as a separate auth module in a future iteration.

---

## 📄 License

MIT License. See `LICENSE` for details.

---

<p align="center">
  <strong>SIAKAD — Academic Information System</strong><br>
  Built with ❤️ for Indonesian education
</p>

<p align="center">
  <a href="README.md">🇮🇩 Bahasa Indonesia</a>
</p>
