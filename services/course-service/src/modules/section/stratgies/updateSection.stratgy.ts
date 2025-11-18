import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ISectionStrategy } from '../interfaces/ICourseSectionStratgy.interface';
import { CourseSection } from '../entity/courseSection.entity';
import { UpdateSectionInput } from '../inputs/updateCourseSection.input';
import { RedisService } from '@bts-soft/core';
import { CourseProxy } from 'src/modules/courses/proxy/course.proxy';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UpdateSectionStrategy implements ISectionStrategy {
  constructor(
    private readonly redisService: RedisService,
    private readonly courseProxy: CourseProxy,
    private readonly i18n: I18nService,
  ) {}

  async execute(
    updateSectionInput: UpdateSectionInput,
    userId: string,
  ): Promise<CourseSection> {
    const course = await this.courseProxy.findById(updateSectionInput.courseId);

    if (!course)
      throw new NotFoundException(
        `Course with ID ${updateSectionInput.courseId} not found`,
      );

    if (course.data.instructorId !== userId)
      throw new UnauthorizedException(
        await this.i18n.t('section.NOT_INSTRACTOR'),
      );

    const section = course.data.sections.find(
      (section) => section._id.toString() === updateSectionInput.sectionId,
    );

    if (!section) throw new NotFoundException('Section not found');

    Object.assign(section, { title: updateSectionInput.title });

    const updatedCourse = await course.data.save();

    await this.redisService.update(`course:${course.data._id}`, course);

    return updatedCourse;
  }
}
