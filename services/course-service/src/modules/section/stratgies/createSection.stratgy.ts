import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSection } from '../entity/courseSection.entity';
import { CreateSectionInput } from '../inputs/createCourseSection.input';
import { CourseProxy } from 'src/modules/courses/proxy/course.proxy';
import { ISectionStrategy } from '../interfaces/ICourseSectionStratgy.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CreateSectionStrategy implements ISectionStrategy {
  constructor(
    private readonly courseProxy: CourseProxy,
    private readonly i18n: I18nService,

    @InjectRepository(CourseSection)
    private readonly courseSectionRepo: Repository<CourseSection>,
  ) {}

  async execute(
    createSectionInput: CreateSectionInput,
    userId: string,
  ): Promise<CourseSection> {
    const course = await this.courseProxy.findById(createSectionInput.id);

    if (course.data.instructorId !== userId)
      throw new UnauthorizedException(
        await this.i18n.t('section.NOT_INSTRACTOR'),
      );
    const section = await this.courseSectionRepo.create({
      title: createSectionInput.title,
      lessons: [],
    });
    await this.courseSectionRepo.save(section);

    course.data.sections?.push(section);

    return section;
  }
}
