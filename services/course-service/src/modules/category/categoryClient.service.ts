import {
  CategoryResponse,
  CategoryEvents,
  CategoryDto,
} from '@course-plateform/types';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class CategoryClientService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async getCategoryById(id: string): Promise<CategoryResponse> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CategoryEvents.GET_CATEGORY_BY_ID, { id })
          .pipe(timeout(10000)),
      );

      if (!result || !result.data)
        throw new Error('Invalid response from category microservice');

      return result.data;
    } catch (error) {
      console.error('Error fetching category by id:', error);
      throw new BadRequestException('category fetch by id failed');
    }
  }

  async getCategoriesById(ids: string[]): Promise<CategoryDto[]> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CategoryEvents.GET_CATEGORIES_BY_IDS, { ids })
          .pipe(timeout(10000)),
      );

      if (!result)
        throw new Error('Invalid response from category microservice');

      return result;
    } catch (error) {
      console.error('Error fetching category by id:', error);
      throw new BadRequestException('category fetch by id failed');
    }
  }
}
