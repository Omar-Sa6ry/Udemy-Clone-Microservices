import { UserEvents, UserResponse } from '@course-plateform/types';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  CreateUserInput,
  ProfileInput,
} from '../auth/inputs/CreateUserData.dto';
import { Role } from '@course-plateform/common';

@Injectable()
export class UserClientService {
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy) {}

  async create(
    createUserInput: CreateUserInput,
    profileInput: ProfileInput,
  ): Promise<UserResponse> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(UserEvents.CREATE_USER_DATA, { createUserInput, profileInput })
          .pipe(timeout(10000)),
      );

      if (!result || !result.user)
        throw new Error('Invalid response from user microservice');

      return result.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('User creation failed');
    }
  }

  async save(role: Role, userId: string): Promise<void> {
    try {
      return await firstValueFrom(
        this.client
          .send(UserEvents.USER_ROLE_UPDATED, { role, userId })
          .pipe(timeout(5000)),
      );
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

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

  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(UserEvents.GET_USER_BY_EMAIL, { email })
          .pipe(timeout(10000)),
      );

      if (!result || !result.data)
        throw new Error('Invalid response from user microservice');

      return result.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new BadRequestException('User fetch by email failed');
    }
  }

  async dataExisted(
    email: string,
    phone: string,
    whatsapp: string,
  ): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(UserEvents.USER_DATA_EXISTED, { email, phone, whatsapp })
          .pipe(timeout(10000)),
      );

      if (result.exists) throw new BadRequestException(result.message);
    } catch (error) {
      console.error('Error fetching user data existed:', error);
      throw error;
    }
  }
}
