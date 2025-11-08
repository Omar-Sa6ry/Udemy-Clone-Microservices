import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from '../inputs/createCategoryr.input';
import { UpdateCategoryInput } from '../inputs/updateCategory.input';
import { Category } from '../entity/category.entity';
import { ICategoryStrategy } from '../interfaces/ICategoryStrategy.interface';

@Injectable()
export class CreateCategoryStrategy implements ICategoryStrategy {
  execute(input: CreateCategoryInput): Promise<Category> {
    const category = new Category();
    category.name = input.name;
    return Promise.resolve(category);
  }
}

@Injectable()
export class UpdateCategoryStrategy implements ICategoryStrategy {
  execute(input: UpdateCategoryInput, category: Category): Promise<Category> {
    category.name = input.name;
    category.description = input.description;
    return Promise.resolve(category);
  }
}
