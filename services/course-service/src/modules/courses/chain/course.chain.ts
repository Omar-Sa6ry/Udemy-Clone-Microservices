import { I18nService } from 'nestjs-i18n';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from '../entity/course.entity';
import { ICourseHandler } from '../interfaces/ICourse.interface';
import { ObjectId } from 'mongodb';

export class CourseExistsHandler implements ICourseHandler {
  private nextHandler: ICourseHandler;

  constructor(private readonly id: string) {}

  setNext(handler: ICourseHandler): ICourseHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(course: Course | null, i18n: I18nService): Promise<void> {
    if (!course) {
      throw new NotFoundException(
        await i18n.t('course.NOT_FOUND', {
          args: { id: new ObjectId(this.id) },
        }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(course, i18n);
    }
  }
}

export class CourseExistsByTitleHandler implements ICourseHandler {
  private nextHandler: ICourseHandler;

  constructor(private readonly title: string) {}

  setNext(handler: ICourseHandler): ICourseHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(course: Course | null, i18n: I18nService): Promise<void> {
    if (!course) {
      throw new NotFoundException(
        await i18n.t('course.NOT_FOUND_BY_TITLE', {
          args: { title: this.title },
        }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(course, i18n);
    }
  }
}

export class CourseTitleHandler implements ICourseHandler {
  private nextHandler: ICourseHandler;

  constructor(
    private readonly title: string,
    private readonly repository: Repository<Course>,
  ) {}

  setNext(handler: ICourseHandler): ICourseHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(course: Course | null, i18n: I18nService): Promise<void> {
    const existing = await this.repository.findOneBy({ title: this.title });
    if (existing) {
      throw new BadRequestException(
        await i18n.t('course.EXISTED', { args: { title: this.title } }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(course, i18n);
    }
  }
}
