import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { SecureUser } from '../users/secure-user.interface';

@Injectable()
export class UserRepository extends BaseRepository<SecureUser> {
  async findByUsername(username: string): Promise<SecureUser | null> {
    const user = this.items.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    return user ? { ...user } : null;
  }

  async count(): Promise<number> {
    return this.items.length;
  }
}
