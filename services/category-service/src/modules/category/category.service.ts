import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './inputs/createCategoryr.input';
import { UpdateCategoryInput } from './inputs/updateCategory.input';
import { CategoryProxy } from './proxy/category.proxy';
import { CategoryIdInput, CategoryNameInput } from './inputs/category.input';
import { CategoryFascade } from './fascade/category.fascade';
import { Limit, Page } from '@course-plateform/common';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryProxy: CategoryProxy,
    private readonly categoryFascade: CategoryFascade,
  ) {}

  async create(createCategoryInput: CreateCategoryInput) {
    return await this.categoryFascade.create(createCategoryInput);
  }

  async update(id: CategoryIdInput, updateCategoryInput: UpdateCategoryInput) {
    return await this.categoryFascade.update(
      id.categoryId,
      updateCategoryInput,
    );
  }

  async delete(id: CategoryIdInput) {
    return await this.categoryFascade.remove(id.categoryId);
  }

  async findById(id: CategoryIdInput) {
    return await this.categoryProxy.findById(id.categoryId);
  }

  async findByName(name: CategoryNameInput) {
    return await this.categoryProxy.findByName(name.name);
  }

  async findAll(page: number = Page, limit: number = Limit) {
    return await this.categoryProxy.findAll(page, limit);
  }

  async findAllWithoutPag() {
    return await this.categoryProxy.findAllWithoutPag();
  }
}
