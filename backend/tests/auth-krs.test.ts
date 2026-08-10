import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { KrsService } from '../src/modules/krs/krs.service';
import { KrsRepository } from '../src/modules/krs/krs.repository';
import { AdminKrsItem } from '../src/modules/krs/krs.repository';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import crypto from 'crypto';

const STUDENT_EMAIL = 'itest.mahasiswa@mahasiswa.ac.id';
const STUDENT_NAME = 'Ivan Mahasiswa';

async function persistStudentKrs(
  app: INestApplication,
  overrides: Partial<AdminKrsItem>,
): Promise<AdminKrsItem> {
  const krsService = app.get(KrsService);
  const krsRepository = app.get(KrsRepository);
  const krs = await krsService.getKrsByEmail(STUDENT_EMAIL, STUDENT_NAME);
  const updatedKrs = { ...krs, ...overrides };
  const saved = await krsRepository.update(updatedKrs.id, updatedKrs);
  return saved ?? updatedKrs;
}

describe('SIAKAD Full-Stack Integration Tests (Auth & KRS)', () => {
  let app: INestApplication;
  let csrfToken: string = '';
  let csrfCookie: string = '';
  let studentAuthCookie: string = '';
  let adminAuthCookie: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.use(cookieParser('siakad_secure_cookie_signer_salt_9988'));

    // Register replica of CSRF Double-Submit Protection Middleware globally
    app.use((req: any, res: any, next: any) => {
      console.log("DEBUG GLOBAL MIDDLEWARE INCOMING:", req.method, req.url);
      if (!req.url.startsWith('/api')) {
        return next();
      }

      const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
      if (safeMethods.includes(req.method)) {
        if (!req.cookies.csrfToken) {
          const token = crypto.randomBytes(32).toString('hex');
          req.csrfToken = token;
          res.cookie('csrfToken', token, {
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
          });
        }
        return next();
      }

      const cookieToken = req.cookies.csrfToken;
      const headerToken = req.headers['x-csrf-token'] || req.headers['X-CSRF-Token'];

      console.log("DEBUG TEST CSRF MIDDLEWARE:", {
        method: req.method,
        url: req.url,
        cookieToken,
        headerToken,
        match: cookieToken === headerToken
      });

      if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({
          status: 'error',
          code: 'CSRF_ERROR',
          message: 'Keamanan CSRF: Permintaan ditolak karena token CSRF tidak valid.'
        });
      }

      next();
    });

    await app.init();
  });

  afterAll(async () => {
    // Kembalikan KRS akun uji ke kondisi kanonik seed supaya spec lain
    // (presensi, akademik) selalu melihat data awal, apapun urutan eksekusi.
    try {
      const krsService = app.get(KrsService);
      const krsRepository = app.get(KrsRepository);
      const krs = await krsService.getKrsByEmail(STUDENT_EMAIL, STUDENT_NAME);
      await krsRepository.update(krs.id, {
        ...krs,
        status: 'Diajukan',
        sksDiambil: 2,
        courses: ['KU2071'],
      });
    } catch {
      // Abaikan: mungkin DB sudah di-reset oleh vitest globalSetup berikutnya.
    }
    await app.close();
  });

  describe('1. CSRF Token Retrieval', () => {
    it('should retrieve a new CSRF token and set the csrfToken cookie', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/csrf-token')
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.csrfToken).toBeDefined();
      expect(typeof res.body.csrfToken).toBe('string');

      csrfToken = res.body.csrfToken;
      
      // Capture the CSRF cookie
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const csrfCookieMatch = cookies.find((c: string) => c.startsWith('csrfToken='));
      expect(csrfCookieMatch).toBeDefined();
      csrfCookie = csrfCookieMatch.split(';')[0];
    });
  });

  describe('2. Student Authentication Flow', () => {
    it('should block login without a valid CSRF token (CSRF protection verification)', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/secure-login')
        .send({
          email: 'itest.mahasiswa@mahasiswa.ac.id',
          password: process.env.DEFAULT_SEED_PASSWORD || 'Test_SIAKAD_2026!',
        })
        .expect(403);
    });

    it('should successfully authenticate student with correct credentials and CSRF', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/secure-login')
        .set('Cookie', csrfCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          username: 'itest.mahasiswa@mahasiswa.ac.id',
          password: process.env.DEFAULT_SEED_PASSWORD || 'Test_SIAKAD_2026!',
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.user.role).toBe('student');
      expect(res.body.user.email).toBe('itest.mahasiswa@mahasiswa.ac.id');

      // Capture auth cookies (token and refreshToken)
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      console.log("DEBUG STUDENT LOGIN RES COOKIES:", cookies);
      
      const tokenCookie = cookies.find((c: string) => c.startsWith('token='));
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
      
      expect(tokenCookie).toBeDefined();
      expect(refreshCookie).toBeDefined();

      studentAuthCookie = `${tokenCookie.split(';')[0]}; ${refreshCookie.split(';')[0]}`;
      console.log("DEBUG STUDENT AUTH COOKIE VALUE:", studentAuthCookie);
    });
  });

  describe('3. Admin/Lecturer Authentication Flow', () => {
    it('should successfully authenticate administrator', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/secure-login')
        .set('Cookie', csrfCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          username: 'admin@kampus.ac.id',
          password: process.env.DEFAULT_SEED_PASSWORD || 'Test_SIAKAD_2026!',
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.user.role).toBe('admin');

      const cookies = res.headers['set-cookie'];
      console.log("DEBUG ADMIN LOGIN RES COOKIES:", cookies);
      const tokenCookie = cookies.find((c: string) => c.startsWith('token='));
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));

      adminAuthCookie = `${tokenCookie.split(';')[0]}; ${refreshCookie.split(';')[0]}`;
      console.log("DEBUG ADMIN AUTH COOKIE VALUE:", adminAuthCookie);
    });
  });

  describe('4. KRS (Study Plan) Operations & Business Rules', () => {
    it('should block unauthenticated requests to get KRS', async () => {
      await request(app.getHttpServer())
        .get('/api/krs')
        .expect(401);
    });

    it('should retrieve student KRS successfully', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/krs')
        .set('Cookie', studentAuthCookie)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.krs).toBeDefined();
      expect(res.body.krs.studentEmail).toBe('itest.mahasiswa@mahasiswa.ac.id');
    });

    it('should allow student to add a valid course when state is editable', async () => {
      await persistStudentKrs(app, {
        status: 'Draft',
        courses: [],
        sksDiambil: 0,
      });

      const res = await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF3110' }) // 4 SKS
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.krs.courses).toContain('IF3110');
      expect(res.body.krs.sksDiambil).toBe(4);
    });

    it('should block adding a duplicate course', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF3110' })
        .expect(400);

      expect(res.body.message.toLowerCase()).toMatch(/already exists|sudah ada/);
    });

    it('should block adding course if it exceeds the maximum 24 SKS limit', async () => {
      // Add multiple courses to reach near-limit
      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF3150' }) // +3 SKS (Total: 7)
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF4040' }) // +4 SKS (Total: 11)
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF4050' }) // +3 SKS (Total: 14)
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'EE4102' }) // +4 SKS (Total: 18)
        .expect(200);

      // Attempt to add highly loaded imaginary courses or courses that would push it over 24 SKS.
      // Let's mock the internal list of courses to test the limit, or just mock the KRS SKS directly
      const krsService = app.get(KrsService);
      let krs = await krsService.getKrsByEmail(STUDENT_EMAIL, STUDENT_NAME);
      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF3150', 'IF4040', 'IF4050', 'EE4102', 'SI2101'],
        sksDiambil: 21,
      });

      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF3150', 'IF4050', 'EE4102', 'SI2101'],
        sksDiambil: 17,
      });

      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF3150', 'IF4050', 'SI2101', 'KU2071'],
        sksDiambil: 19,
      });
      // Let's add multiple to see limit triggered
      const resExceed = await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF4040' }) // IF4040 is 4 SKS. Total would be 19 + 4 = 23 SKS (Allowed).
        .expect(200);

      // SKS is now 23.
      // Adding any other course like IF3150 (3 SKS) would exceed 24! (23 + 3 = 26 SKS)
      // Since IF3150 is already in krs.courses, let's remove it and then try to add IF4050 (3 SKS) which is already there,
      // Or we can just mock KRS SKS to 23 with unique courses.
      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF4040', 'EE4102', 'IF4050', 'SI2101', 'KU2071'],
        sksDiambil: 20,
      });
      // Let's try to add a course IF3110? No, it's already there. Let's make sure we trigger exceed.
      // We can directly mock KrsService courses list or SKS calculation, but the easiest way is:
      // SKS is currently 20. Adding another 5 SKS course would exceed. But we only have SKS 4, 3, 2 courses.
      // Let's add 'IF3150' (3 SKS) -> 20 + 3 = 23 SKS.
      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF3150' })
        .expect(200);

      // SKS is now 23 SKS.
      // Now let's try to add 'EE4102' (4 SKS) which is not in the list (wait, EE4102 was in the mocked courses list, let's remove it first)
      krs = await persistStudentKrs(app, {
        courses: krs.courses.filter((courseCode) => courseCode !== 'EE4102'),
        sksDiambil: 19,
      });
      // Let's add 'IF3150' (3), 'IF3110' (4), 'IF4040' (4), 'IF4050' (3), 'SI2101' (3), 'KU2071' (2), 'EE4102' (4)
      // To get 23 SKS: IF3110 (4), IF4040 (4), IF3150 (3), IF4050 (3), SI2101 (3), KU2071 (2), and let's say EE4102 (4) is NOT in list.
      // Total SKS currently in `krs.courses`: 4 + 4 + 3 + 3 + 3 + 2 = 19 SKS.
      // If we add another 4 SKS course (e.g., IF3110 is 4, but it's duplicate. Let's make sure we have distinct courses)
      // Let's make: IF3110(4), IF4040(4), EE4102(4), IF3150(3), IF4050(3), SI2101(3), KU2071(2) -> total 23 SKS.
      // Let's clear krs.courses and assign a set that sums to 21 SKS: ['IF3110', 'IF4040', 'EE4102', 'IF3150', 'IF4050', 'KU2071'] (4+4+4+3+3+2 = 20 SKS)
      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF4040', 'EE4102', 'IF3150', 'IF4050', 'KU2071'],
        sksDiambil: 20,
      });

      // Add SI2101 (3 SKS) -> 20 + 3 = 23 SKS
      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'SI2101' })
        .expect(200);

      // Now SKS is 23. Try to add any course like another hypothetical 2 SKS or 3 SKS course (since we have no more unselected courses, let's remove KU2071 (2 SKS) and add IF4050, etc. Let's check.)
      // SKS is 23. If we try to add ANY course that has SKS >= 2, it will exceed 24 SKS limit (23 + 2 = 25).
      // Since all available courses have SKS >= 2, trying to add a new course will fail!
      // Let's add a course that is not in krs.courses. What course is not in krs.courses?
      // krs.courses has: IF3110, IF4040, EE4102, IF3150, IF4050, KU2071, SI2101 (all 7 courses!).
      // Let's remove one course so we have a vacant course to try.
      // Remove 'EE4102' (4 SKS) -> Total SKS: 23 - 4 = 19 SKS.
      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF4040', 'IF3150', 'IF4050', 'KU2071', 'SI2101'],
        sksDiambil: 19,
      });
      // Add 'EE4102' (4 SKS) -> 19 + 4 = 23 SKS (Allowed)
      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'EE4102' })
        .expect(200);

      // SKS is 23.
      // Now, let's temporarily add an unselected course 'IF4040'? No, it's in the list.
      // Let's remove 'KU2071' (2 SKS) -> 23 - 2 = 21 SKS.
      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF4040', 'IF3150', 'IF4050', 'SI2101', 'EE4102'],
        sksDiambil: 21,
      });
      // Add 'KU2071' (2 SKS) -> 21 + 2 = 23 SKS.
      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'KU2071' })
        .expect(200);

      // Now SKS is 23.
      // Let's remove IF3150 (3 SKS) from krs.courses so we have a vacant course to test.
      krs = await persistStudentKrs(app, {
        courses: ['IF3110', 'IF4040', 'IF4050', 'SI2101', 'EE4102', 'KU2071'],
        sksDiambil: 20,
      });
      // SKS is 20. If we add 'IF3150' (3 SKS), it will be 23 SKS.
      // Let's change krs.courses to: ['IF3110', 'IF4040', 'EE4102', 'IF4050', 'SI2101', 'KU2071'] (4+4+4+3+3+2 = 20 SKS)
      // Then if we try to add IF3150 (3 SKS) -> 20 + 3 = 23 SKS (Allowed).
      // If we instead change krs.courses to: ['IF3110', 'IF4040', 'EE4102', 'IF4050', 'SI2101'] (4+4+4+3+3 = 18 SKS)
      // Let's try to add KU2071 (2 SKS) -> 18 + 2 = 20 SKS (Allowed).
      // To trigger exceed: let's set current SKS to 22, and try to add a 3 SKS course.
      // How to get 22 SKS? ['IF3110', 'IF4040', 'EE4102', 'IF4050', 'SI2101', 'KU2071'] (Total 20 SKS)
      // Let's just mock krs.courses directly to: ['IF3110', 'IF4040', 'EE4102', 'IF4050', 'SI2101', 'KU2071'] (20 SKS), and add another imaginary course, or just mock the totalSKS inside the database:
      await persistStudentKrs(app, {
        courses: ['IF3110', 'IF3110', 'IF3110', 'IF3110', 'IF3110', 'IF3110'],
        sksDiambil: 24,
      });
      const resExceedLimit = await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'IF3150' }) // 3 SKS, would push total to 25 SKS > 24 limit!
        .expect(400);

      expect(resExceedLimit.body.message.toLowerCase()).toMatch(/limit|terlampaui/);
    });

    it('should successfully submit KRS for approval', async () => {
      await persistStudentKrs(app, {
        status: 'Draft',
        courses: ['IF3110', 'IF3150'],
        sksDiambil: 7,
      });

      const res = await request(app.getHttpServer())
        .post('/api/krs/submit')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.krs.status).toBe('Diajukan');
    });

    it('should block modifying KRS after it has been submitted', async () => {
      await request(app.getHttpServer())
        .post('/api/krs/add-course')
        .set('Cookie', [studentAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({ courseCode: 'KU2071' })
        .expect(400);
    });
  });

  describe('5. KRS Advisor Approval Workflows (RBAC Checks)', () => {
    it('should block regular student from accessing list of all students study plans', async () => {
      await request(app.getHttpServer())
        .get('/api/krs/students')
        .set('Cookie', studentAuthCookie)
        .expect(403);
    });

    it('should allow admin to view all student study plans', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/krs/students')
        .set('Cookie', adminAuthCookie)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.count).toBeGreaterThanOrEqual(1);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        totalPages: expect.any(Number),
      });
    });

    it('should support paginated listing with page and limit query params', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/krs/students?page=1&limit=2')
        .set('Cookie', adminAuthCookie)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.records).toHaveLength(2);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 2,
        totalPages: expect.any(Number),
      });
      expect(res.body.count).toBeGreaterThanOrEqual(2);
    });

    it('should filter student study plans by status', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/krs/students?status=Draft&limit=50')
        .set('Cookie', adminAuthCookie)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.records.every((r: { status: string }) => r.status === 'Draft')).toBe(true);
    });

    it('should allow admin to approve a student KRS', async () => {
      // KRS khusus uji integrasi (krs-itest) NIM 10118099
      const res = await request(app.getHttpServer())
        .post('/api/krs/approve')
        .set('Cookie', [adminAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({
          studentNim: '10118099',
          approve: true,
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.krs.status).toBe('Disetujui');
    });

    it('should block review if the KRS is not currently submitted', async () => {
      // NIM 10118099 is now 'Disetujui', so reviewing again should fail
      await request(app.getHttpServer())
        .post('/api/krs/approve')
        .set('Cookie', [adminAuthCookie, csrfCookie].join('; '))
        .set('x-csrf-token', csrfToken)
        .send({
          studentNim: '10118099',
          approve: false,
        })
        .expect(400);
    });
  });
});
