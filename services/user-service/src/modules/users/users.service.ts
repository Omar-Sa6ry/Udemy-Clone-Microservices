import {
  UserCountResponse,
  UserResponse,
  UsersResponse,
} from './dtos/UserResponse.dto';
import { UserProxy } from 'src/modules/users/proxy/user.proxy';
import { Injectable } from '@nestjs/common';
import { IUserObserver } from './interfaces/IUserObserver.interface';
import { CacheObserver } from './observer/user.observer';
import { RedisService } from '@bts-soft/core';
import { Limit, Page } from '@course-plateform/common';
import { UserFacadeService } from './fascade/user.fascade';
import { UpdateProfileInput } from './inputs/UpdateProfile.dto';
import { ProfileResponse } from './dtos/ProfileResponse.dto';
import { UpdateUserInput } from './inputs/UpdateUser.dto';
import { NatsService } from 'src/common/nats/nats.service';

@Injectable()
export class UserService {
  private observers: IUserObserver[] = [];

  constructor(
    private readonly redisService: RedisService,
    private readonly fascade: UserFacadeService,
    private readonly proxy: UserProxy,
    private readonly natsUtil: NatsService,
  ) {
    this.observers.push(new CacheObserver(this.redisService));
  }

  async updateUser(
    updateUserDto: UpdateUserInput,
    id: string,
  ): Promise<UserResponse> {
    const result = await this.fascade.updateUser(updateUserDto, id);

    await this.natsUtil.emitEvent('user.updated', {
      userId: id,
      updates: Object.keys(updateUserDto),
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });

    return result;
  }

  async updateProfile(
    updateProfileInput: UpdateProfileInput,
    userId: string,
  ): Promise<ProfileResponse> {
    const result = await this.fascade.updateProfile(updateProfileInput, userId);

    await this.natsUtil.emitEvent('user.profile_updated', {
      userId: userId,
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });

    return result;
  }

  async createInstructor(userIdInput: string): Promise<UserResponse> {
    const result = await this.fascade.createInstructor(userIdInput);

    await this.natsUtil.emitEvent('user.instructor_created', {
      userId: userIdInput,
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });

    return result;
  }

  async editUserRole(id: string): Promise<UserResponse> {
    const result = await this.fascade.editUserRole(id);

    await this.natsUtil.emitEvent('user.role_changed', {
      userId: id,
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });

    return result;
  }

  async delete(id: string): Promise<UserResponse> {
    const result = await this.fascade.deleteUser(id);

    await this.natsUtil.emitEvent('user.deleted', {
      userId: id,
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });

    return result;
  }

  async findById(id: string): Promise<UserResponse> {
    const result = await this.proxy.findById(id);

    await this.natsUtil.emitEvent('user.queried', {
      userId: id,
      action: 'find_by_id',
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });

    return result;
  }

  async findByEmail(email: string): Promise<UserResponse> {
    const result = await this.proxy.findByEmail(email);

    await this.natsUtil.emitEvent('user.queried', {
      email: email,
      action: 'find_by_email',
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });

    return result;
  }

  async findUsers(
    page: number = Page,
    limit: number = Limit,
  ): Promise<UsersResponse> {
    return this.proxy.findUsers(page, limit);
  }

  async findInstructors(
    page: number = Page,
    limit: number = Limit,
  ): Promise<UsersResponse> {
    return this.proxy.findInstructors(page, limit);
  }

  async getInstructorsCout(): Promise<UserCountResponse> {
    return this.proxy.getInstructorsCout();
  }

  async getUsersCount(): Promise<UserCountResponse> {
    return this.proxy.getUsersCount();
  }
}
