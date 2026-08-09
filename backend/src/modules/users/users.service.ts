import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { SecureUser } from './secure-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

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

  public async findAuthSession(id: string): Promise<{ id: string; refreshVersion: number } | null> {
    return this.userRepository.findAuthSession(id);
  }

  public async bumpRefreshVersion(id: string): Promise<boolean> {
    return this.userRepository.bumpRefreshVersion(id);
  }
}