# Keamanan SIAKAD — Postur & Checklist

Dokumen ini merangkum postur keamanan sistem, perbaikan yang sudah diterapkan,
dan langkah yang wajib dilakukan sebelum rilis ke produksi.

## Ringkasan Postur Keamanan

| Area | Status | Keterangan |
|------|--------|------------|
| Hashing password | ✅ | Argon2id (memoryCost 4MB, timeCost 3) — `argon2` |
| Transport | ✅ | Cookie `HttpOnly` + `SameSite=Strict` + `Secure` (prod); HSTS aktif di prod |
| Token | ✅ | Access JWT 15m + Refresh JWT 7d; secret terpisah per tujuan; HS256 + issuer di-pin; rotasi refresh token; `refreshVersion` untuk revocation |
| CSRF | ✅ | Double-submit cookie + header `X-CSRF-Token`; dikecualikan hanya untuk `Authorization: Bearer` |
| Rate limiting | ✅ | Global `/api` (200/15m), login & register (10/15m), reset request (5/15m), reset confirm (10/jam) |
| Header keamanan | ✅ | Helmet (CSP, nosniff, dll); frontend statis via `vercel.json` headers |
| RBAC | ✅ | `AuthGuard` + `RolesGuard`; endpoint KRS self-service dibatasi role `student` |
| Audit trail | ✅ | `AuditRecord` persisten + log kejadian keamanan (`SecurityService`) |

## 2. Perbaikan di Iterasi Ini

1. **Rotasi & revocation refresh token.** Setiap pemulihan sesi memutar refresh
   token (menaikkan `User.refreshVersion`). Logout dan reset password ikut
   menaikkan versi, sehingga seluruh token lama (access + refresh) langsung
   hangus, bahkan yang sudah dicuri.
2. **JWT dip-IP**: `alg: HS256` + `iss: siakad-api` diverifikasi eksplisit —
   menutup serangan *algorithm confusion* dan menolak token dari issuer asing.
3. **Pengecekan sesi per request.** `AuthGuard` memverifikasi pengguna masih
   ada di DB dan `refreshVersion` cocok, sehingga akun yang dihapus tidak bisa
   lagi menggunakan tokennya.
4. **Reset password diperkeras.** Endpoint di-rate-limit; token diverifikasi
   one-time-use via hash SHA-256 dengan kedaluwarsa & batas penyimpanan
   (mencegah memory leak); sesi lama dicabut setelah password diganti.
5. **Input validation lebih ketat.** Semua field panjang dibatasi (zod,
   `max()`); `approve` di `/krs/approve` wajib boolean asli (mencegah
   `"false"` truthy); `courseCode`/`studentNim` divalidasi format.
6. **ID tidak lagi `Math.random()`.** Registrasi & pembuatan KRS memakai
   `crypto.randomUUID()`.
7. **frontend: dependensi rawan dihapus.** Paket `xlsx` (0.18.5, discontinued,
   ada CVE publik) tidak terpakai — sudah dihapus dari `package.json`.
8. **Docker hardening.** `.dockerignore` mencegah `dev.db`, `.env`, dan
   `node_modules` masuk image; `npm prune --omit=dev` di runner; HEALTHCHECK
   ditambahkan; Prisma client di-generate saat build.
9. **Trust proxy dapat dikonfigurasi** (`TRUST_PROXY` env) — mencegah spoof
   `X-Forwarded-For` ketika API di-expose langsung.
10. **Body JSON dibatasi** `100kb` untuk mencegah request raksasa.
11. **Audit log & listing dibatasi** (limit max 500; pagination cap di KRS).

## 3. Checklist Sebelum Produksi

- [ ] Set semua secret via env vars: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`,
      `JWT_RESET_PASSWORD_SECRET`, `COOKIE_SECRET` (panjang ≥ 64 hex).
      `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- [ ] `NODE_ENV=production` — server menolak start tanpa secret.
- [ ] Perhatikan `TRUST_PROXY` sesuaikan arsitektur (0 jika langsung internet).
- [ ] `ALLOWED_ORIGINS` hanya origin frontend yang sah (jangan `*`).
- [ ] Ganti `DATABASE_URL` dari SQLite ke PostgreSQL di production
      (`provider = "postgresql"` di `schema.prisma` + migrasi).
- [ ] Jangan pernah import `dev.db`/`test.db` hasil seed ke server produksi;
      password seed hanya untuk lingkungan dev.
- [ ] Integrasikan email service untuk kirim reset token (`reset-password-request`
      saat ini hanya mencatat token ke console — TODO di controller).
- [ ] Verifikasi koneksi HTTPS (HSTS hanya aktif di `NODE_ENV=production`).
- [ ] Hapus/matikan endpoint dev & debug (perpindahan konsol, log verbose).

## 4. Catatan & Sisa Pekerjaan

- Revocation antar-instance: `refreshVersion` bersifat per-DB (aman dengan satu
  DB), atau gunakan Redis shared untuk semua instance.
- Logging keamanan saat ini ke memory (50 event) — untuk produksi, alirkan ke
  agregator log (pino/winston + GCP/DataDog).
- Ideal: dua secret berbeda untuk refresh & access sudah dilakukan; jangan
  pernah memakai satu secret untuk semua tujuan.

## 5. Status Verifikasi (per commit eca4dc9)

- `npm audit` (production deps): **0 vulnerabilities** di backend dan frontend
  (multer, fast-uri, ip-address, body-parser, hono, prisma, valibot, postcss
  dibersihkan via `npm audit fix` non-breaking, hanya perubahan lockfile).
- Pemindaian secret di seluruh file ter-commit: bersih (tidak ada private key,
  AWS key, API key, atau kredensial hardcoded; satu-satunya kemunculan
  `password=` adalah fixture di unit test).
- Backend: `tsc --noEmit` bersih, 26/26 test hijau (3 file).
- Frontend: `tsc --noEmit` bersih, `vite build` sukses.
- Branch `dev`, 8 commit keamanan terpisah; refactor WIP yang sedang berjalan
  tidak ikut ter-commit.