import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOneBy(where);
  }

  async create(username: string, password: string, role: UserRole): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hash, role });
    return this.userRepository.save(user);
  }

  async setRefreshTokenHash(userId: number, refreshTokenHash: string | null): Promise<void> {
    await this.userRepository.update({ userId }, { refreshTokenHash });
  }
}