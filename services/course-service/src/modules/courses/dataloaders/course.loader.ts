import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { CategoryDto, UserResponse } from '@course-plateform/types';
import { UserClientService } from 'src/modules/user/userClient.service';
import { CategoryClientService } from 'src/modules/category/categoryClient.service';

@Injectable()
export class CourseDataLoaders {
  constructor(
    private readonly userService: UserClientService,
    private readonly categoryService: CategoryClientService,
  ) {}

  createInstructorsLoader() {
    return new DataLoader<string, UserResponse>(
      async (instructorIds: string[]) => {
        const instructors =
          await this.userService.findUsersWithIds(instructorIds);

        const instructorMap = new Map(
          instructors.map((instructor) => [instructor.id, instructor]),
        );

        return instructorIds.map((id) => instructorMap.get(id));
      },
    );
  }

  createCategoriesLoader() {
    return new DataLoader<string, CategoryDto>(
      async (categoryIds: string[]) => {
        const categories =
          await this.categoryService.getCategoriesById(categoryIds);

        const categoryMap = new Map(
          categories.map((category) => [category.id, category]),
        );

        return categoryIds.map((id) => categoryMap.get(id));
      },
    );
  }
}
