import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoriesResponse,
  CategoryResponse,
} from '../dto/categoryResponse.dto';
import {
  CategoryExistsHandler,
  CategoryExistsHandlerByName,
} from '../chain/category.chain';
import { Limit, Page } from '@course-plateform/common';

@Injectable()
export class CategoryProxy {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findById(id: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findOneBy({ id });

    const existsHandler = new CategoryExistsHandler(id);
    await existsHandler.handle(category, this.i18n);

    return { data: category };
  }

  async findByName(name: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findOneBy({ name });

    const existsHandler = new CategoryExistsHandlerByName(name);
    await existsHandler.handle(category, this.i18n);

    return { data: category };
  }

  async findAll(
    page: number = Page,
    limit: number = Limit,
  ): Promise<CategoriesResponse> {
    const categories = await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (categories.length === 0)
      throw new NotFoundException(await this.i18n.t('category.NOT_FOUNDS'));

    return { items: categories };
  }

  async findAllWithoutPag(): Promise<CategoriesResponse> {
    const categories = await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });

    if (categories.length === 0)
      throw new NotFoundException(await this.i18n.t('category.NOT_FOUNDS'));

    return { items: categories };
  }
}
