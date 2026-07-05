import { Injectable, Inject } from '@nestjs/common';
import { IBaseRepository } from '../../common/prisma/base.repository';
import { SecureUser } from './secure-user.interface';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UserRepository implements IBaseRepository<SecureUser> {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async find(id: string): Promise<SecureUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user as SecureUser | null;
  }

  async findAll(): Promise<SecureUser[]> {
    const users = await this.prisma.user.findMany();
    return users as SecureUser[];
  }

  async create(item: SecureUser): Promise<SecureUser> {
    const user = await this.prisma.user.create({ data: item });
    return user as SecureUser;
  }

  async update(id: string, item: Partial<SecureUser>): Promise<SecureUser | null> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: item,
      });
      return user as SecureUser;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findByUsername(username: string): Promise<SecureUser | null> {
    const normalizedUsername = username.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: normalizedUsername },
          { email: normalizedUsername },
        ],
      },
    });
    return user as SecureUser | null;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }
}

