import { CategoryEvents } from '@course-plateform/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CategoryIdInput, CategoryNameInput } from './inputs/category.input';

@Controller()
export class CategoryNatsController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern(CategoryEvents.GET_CATEGORY_BY_ID)
  async getCategoryById(@Payload() data: { id: CategoryIdInput }) {
    return await this.categoryService.findById(data.id);
  }

  @MessagePattern(CategoryEvents.GET_CATEGORY_BY_NAME)
  async getCategoryByName(@Payload() data: { name: CategoryNameInput }) {
    return await this.categoryService.findByName(data.name);
  }
}
