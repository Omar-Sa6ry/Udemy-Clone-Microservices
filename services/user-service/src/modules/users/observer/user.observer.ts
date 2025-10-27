import { RedisService } from '@bts-soft/core';
import { IUserObserver } from '../interfaces/IUserObserver.interface';
import { User } from 'src/modules/users/entities/user.entity';

export class CacheObserver implements IUserObserver {
  constructor(private redisService: RedisService) {}

  async onUserUpdate(user: User): Promise<void> {
    await this.redisService.set(`user:${user.id}`, user);
  }

  async onUserDelete(userId: string, email: string): Promise<void> {
    await this.redisService.del(`user:${userId}`);
  }
}
