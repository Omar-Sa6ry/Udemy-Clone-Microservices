import { UserEvents, UserResponse } from '@course-plateform/types';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class UserClientService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async findById(id: string): Promise<UserResponse> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(UserEvents.GET_USER_BY_ID, { id })
          .pipe(timeout(10000)),
      );

      if (!result || !result.data)
        throw new Error('Invalid response from user microservice');

      return result.data;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw new BadRequestException('User fetch by id failed');
    }
  }

  async findUsersWithIds(id: string[]): Promise<UserResponse[]> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(UserEvents.GET_USER_BY_ID, { id })
          .pipe(timeout(10000)),
      );

      if (!result || !result)
        throw new Error('Invalid response from user microservice');

      return result;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw new BadRequestException('User fetch by id failed');
    }
  }
}
