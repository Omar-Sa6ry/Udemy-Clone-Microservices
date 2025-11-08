import { Category } from '../entity/category.entity';
import { I18nService } from 'nestjs-i18n';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ICategoryHandler } from '../interfaces/ICategoryHandler.interface';


export class CategoryExistsHandler implements ICategoryHandler {
  private nextHandler: ICategoryHandler;
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  setNext(handler: ICategoryHandler): ICategoryHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(category: Category | null, i18n: I18nService): Promise<void> {
    if (!category) {
      throw new NotFoundException(
        await i18n.t('category.NOT_FOUND', { args: { id: this.id } }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(category, i18n);
    }
  }
}


export class CategoryExistsHandlerByName implements ICategoryHandler {
  private nextHandler: ICategoryHandler;
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  setNext(handler: ICategoryHandler): ICategoryHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(category: Category | null, i18n: I18nService): Promise<void> {
    if (!category) {
      throw new NotFoundException(
        await i18n.t('category.NOT_FOUND', { args: { name: this.name } }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(category, i18n);
    }
  }
}

export class CategoryNameHandler implements ICategoryHandler {
  private nextHandler: ICategoryHandler;
  private name: string;
  private repository: Repository<Category>;

  constructor(name: string, repository: Repository<Category>) {
    this.name = name;
    this.repository = repository;
  }

  setNext(handler: ICategoryHandler): ICategoryHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(category: Category | null, i18n: I18nService): Promise<void> {
    console.log('Checking category name existence:', this.name);
    const existing = await this.repository.findOneBy({ name: this.name });

    console.log('Found existing category:', existing);
    if (existing) {
      throw new BadRequestException(
        await i18n.t('category.EXISTED', { args: { name: this.name } }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(category, i18n);
    }
  }
}
