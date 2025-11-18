import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, Limit } from '@course-plateform/common';
import { I18nService } from 'nestjs-i18n';
import { SectionResponse, SectionsResponse } from '../dto/sectionResponse.dto';
import { FindSectionInput } from '../inputs/findCourseSection.input';
import { CourseIdInput } from 'src/modules/courses/inputs/courseId.input';
import { CourseProxy } from 'src/modules/courses/proxy/course.proxy';

@Injectable()
export class SectionProxy {
  constructor(
    private readonly i18n: I18nService,
    private readonly courseProxy: CourseProxy,
  ) {}

  async findById(findSectionInput: FindSectionInput): Promise<SectionResponse> {
    const course = await this.courseProxy.findById(findSectionInput.courseId);

    const section = course.data.sections.find(
      (section) => section._id.toString() === findSectionInput.sectionId,
    );

    if (!section) throw new NotFoundException('Section not found');

    return { data: section };
  }

  async findAllSectionsinCourse(
    courseIdInput: CourseIdInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<SectionsResponse> {
    const course = await this.courseProxy.findById(courseIdInput.courseId);

    if (!course) {
      throw new NotFoundException(await this.i18n.t('course.NOT_FOUND'));
    }

    let sections = course.data.sections ?? [];

    sections = sections.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const totalItems = sections.length;
    const start = (page - 1) * limit;
    const paginated = sections.slice(start, start + limit);

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

  async findAllSectionsinCourseWithoutPag(
    courseIdInput: CourseIdInput,
  ): Promise<SectionsResponse> {
    const course = await this.courseProxy.findById(courseIdInput.courseId);

    if (!course) {
      throw new NotFoundException(await this.i18n.t('course.NOT_FOUND'));
    }

    let sections = course.data.sections ?? [];

    sections = sections.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      items: sections,
    };
  }
}
