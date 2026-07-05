import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { UserRepository } from './users.repository';
import { SecureUser } from './secure-user.interface';
import crypto from 'crypto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(SecurityService) private readonly securityService: SecurityService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit() {
    await this.seedDefaultUsers();
  }

  public async findByUsername(username: string): Promise<SecureUser | null> {
    return this.userRepository.findByUsername(username);
  }

  public async findById(id: string): Promise<SecureUser | null> {
    return this.userRepository.find(id);
  }

  public async create(user: SecureUser): Promise<SecureUser> {
    return this.userRepository.create(user);
  }

  public async updatePassword(id: string, passwordHash: string, hashingAlgo: 'argon2' | 'bcrypt'): Promise<boolean> {
    const result = await this.userRepository.update(id, { passwordHash, hashingAlgo });
    return result !== null;
  }

  public async count(): Promise<number> {
    return this.userRepository.count();
  }

  private async seedDefaultUsers() {
    const existingCount = await this.userRepository.count();
    if (existingCount > 0) {
      return;
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const usersToSeed = [
      { id: 'u10', username: 'mahasiswa@kampus.ac.id', email: 'mahasiswa@kampus.ac.id', name: 'Faisal Akbar', role: 'student' as const, phone: '0812-3456-7890', department: 'Teknik Informatika' },
      { id: 'u3', username: 'ahmad.syafiq@mahasiswa.ac.id', email: 'ahmad.syafiq@mahasiswa.ac.id', name: 'Ahmad Syafiq', role: 'student' as const, phone: '0812-3456-7890', department: 'Teknik Informatika' },
      { id: 'u2', username: 'budi.rahardjo@kampus.ac.id', email: 'budi.rahardjo@kampus.ac.id', name: 'Dr. Budi Rahardjo', role: 'lecturer' as const, phone: '0811-2233-4455', department: 'Teknik Informatika' },
      { id: 'u4', username: 'kaprodi@kampus.ac.id', email: 'kaprodi@kampus.ac.id', name: 'Dr. Budi Rahardjo', role: 'kaprodi' as const, phone: '0813-4567-8901', department: 'Teknik Informatika' },
      { id: 'u5', username: 'dekan@kampus.ac.id', email: 'dekan@kampus.ac.id', name: 'Prof. Dr. Ir. Faisal Akbar', role: 'dekan' as const, phone: '0812-7777-6666', department: 'Fakultas Teknologi Informasi' },
      { id: 'u1', username: 'admin@kampus.ac.id', email: 'admin@kampus.ac.id', name: 'Hendra Wijaya, M.T.', role: 'admin' as const, phone: '0812-9988-7766', department: 'Direktorat Sistem Informasi' },
      { id: 'u6', username: 'rian.hidayat@alumni.ac.id', email: 'rian.hidayat@alumni.ac.id', name: 'Rian Hidayat, S.Kom', role: 'alumni' as const, phone: '0812-3456-7890', department: 'Teknik Informatika' },
      { id: 'u7', username: 'baak@kampus.ac.id', email: 'baak@kampus.ac.id', name: 'Admin BAAK', role: 'baak' as const, phone: '0812-1122-3344', department: 'Administrasi Akademik' },
      { id: 'u8', username: 'bauk@kampus.ac.id', email: 'bauk@kampus.ac.id', name: 'Admin BAUK', role: 'bauk' as const, phone: '0812-5566-7788', department: 'Biro Keuangan' },
      { id: 'u9', username: 'rian@gmail.com', email: 'rian@gmail.com', name: 'Rian Hidayat (Calon Maba)', role: 'applicant' as const, phone: '0812-3456-7890', department: 'Penerimaan Mahasiswa Baru' },
    ];

    for (const user of usersToSeed) {
      // Use env override for dev convenience, otherwise random per-user
      const plainPassword = process.env.DEFAULT_SEED_PASSWORD || crypto.randomBytes(24).toString('hex');
      const { hash, algo } = await this.securityService.secureHash(plainPassword);
      await this.userRepository.create({
        ...user,
        passwordHash: hash,
        hashingAlgo: algo,
      });

      if (isDev) {
        console.log(`🔐 [SEED] ${user.role} — ${user.email} → password: ${plainPassword}`);
      }
    }

    this.securityService.logSecurityEvent(
      'INFO',
      `Successfully seeded ${await this.userRepository.count()} secure user accounts in NestJS context.`,
      '0.0.0.0',
    );
  }
}
