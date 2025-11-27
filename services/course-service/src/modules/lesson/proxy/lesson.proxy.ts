import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, Limit } from '@course-plateform/common';
import { I18nService } from 'nestjs-i18n';
import { FindLessonInput } from '../inputs/findLesson.input';
import { LessonResponse, LessonsResponse } from '../dto/lessonResponse.dto';
import { SectionProxy } from 'src/modules/section/proxy/section.proxy';

@Injectable()
export class LessonProxy {
  constructor(
    private readonly i18n: I18nService,
    private readonly sectionProxy: SectionProxy,
  ) {}

  async findById(findLessonInput: FindLessonInput): Promise<LessonResponse> {
    const section = await this.sectionProxy.findById(findLessonInput);

    if (!section) throw new NotFoundException('Section not found');

    const lesson = section.data.lessons.find(
      (lesson) => lesson._id.toString() === findLessonInput.id,
    );

    return { data: lesson };
  }

  async findAllLessonsinCourse(
    findLessonInput: FindLessonInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<LessonsResponse> {
    const section = await this.sectionProxy.findById(findLessonInput);

    if (!section)
      throw new NotFoundException(await this.i18n.t('course.NOT_FOUND'));

    let lessons = section.data.lessons ?? [];

    lessons = lessons.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const totalItems = lessons.length;
    const start = (page - 1) * limit;
    const paginated = lessons.slice(start, start + limit);

    if (!paginated.length)
      throw new NotFoundException(await this.i18n.t('section.NOT_FOUNDS'));

    return {
      items: paginated,
      pagination: {
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findAllLessonsinCourseWithoutPag(
    findLessonInput: FindLessonInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<LessonsResponse> {
    const section = await this.sectionProxy.findById(findLessonInput);

    if (!section)
      throw new NotFoundException(await this.i18n.t('course.NOT_FOUND'));

    let lessons = section.data.lessons ?? [];

    lessons = lessons.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      items: lessons,
    };
  }
}
