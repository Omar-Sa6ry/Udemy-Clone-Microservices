import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateCategoryInput } from '../inputs/createCategoryr.input';
import { UpdateCategoryInput } from '../inputs/updateCategory.input';
import { CategoryProxy } from '../proxy/category.proxy';
import { UpdateCategoryStrategy } from '../strategy/category.stategy';
import { Injectable } from '@nestjs/common';
import {
  CategoryExistsHandler,
  CategoryNameHandler,
} from '../chain/category.chain';
import { CategoryResponse } from '@course-plateform/types';

@Injectable()
export class CategoryFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly categoryProxy: CategoryProxy,
    private readonly updateStrategy: UpdateCategoryStrategy,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Transactional()
  async create(
    createCategoryInput: CreateCategoryInput,
  ): Promise<CategoryResponse> {
    const nameHandler = new CategoryNameHandler(
      createCategoryInput.name,
      this.categoryRepository,
    );
    await nameHandler.handle(null, this.i18n);

    const category = await this.categoryRepository.create(createCategoryInput);
    await this.categoryRepository.save(category);

    return {
      data: category,
      statusCode: 201,
      message: await this.i18n.t('category.CREATED'),
    };
  }

  @Transactional()
  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<CategoryResponse> {
    const category = (await this.categoryProxy.findById(id))?.data;

    const existsHandler = new CategoryExistsHandler(id);
    const nameHandler = new CategoryNameHandler(
      updateCategoryInput.name,
      this.categoryRepository,
    );

    existsHandler.setNext(nameHandler);
    await existsHandler.handle(category as Category, this.i18n);

    const updatedCategory = await this.updateStrategy.execute(
      updateCategoryInput,
      category! as Category,
    );
    await this.categoryRepository.save(updatedCategory);

    return {
      data: updatedCategory,
      message: await this.i18n.t('category.UPDATED', {
        args: { name: updatedCategory.name },
      }),
    };
  }

  @Transactional()
  async remove(id: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findOneBy({ id });

    const existsHandler = new CategoryExistsHandler(id);
    await existsHandler.handle(category, this.i18n);

    await this.categoryRepository.remove(category!);
    return {
      data: null,
      message: await this.i18n.t('category.DELETED', { args: { id } }),
    };
  }
}
