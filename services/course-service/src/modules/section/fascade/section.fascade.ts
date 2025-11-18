import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionInput } from '../inputs/createCourseSection.input';
import { SectionResponse } from '../dto/sectionResponse.dto';
import { CourseProxy } from 'src/modules/courses/proxy/course.proxy';
import { CourseSection } from '../entity/courseSection.entity';
import { CreateSectionStrategy } from '../stratgies/createSection.stratgy';
import { UpdateSectionInput } from '../inputs/updateCourseSection.input';
import { UpdateSectionStrategy } from '../stratgies/updateSection.stratgy';
import { DeleteSectionInput } from '../inputs/deleteCourseSection.input';

@Injectable()
export class SectionFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly courseProxy: CourseProxy,
    private readonly createStrategy: CreateSectionStrategy,
    private readonly updateStrategy: UpdateSectionStrategy,
    @InjectRepository(CourseSection)
    private readonly courseSectionRepo: Repository<CourseSection>,
  ) {}

  async create(
    createSectionInput: CreateSectionInput,
    userId: string,
  ): Promise<SectionResponse> {
    const section = await this.createStrategy.execute(
      createSectionInput,
      userId,
    );

    return {
      data: section,
      statusCode: 201,
      message: await this.i18n.t('section.CREATED'),
    };
  }

  async update(
    updateCourseInput: UpdateSectionInput,
    userId: string,
  ): Promise<SectionResponse> {
    const updatedSection = await this.updateStrategy.execute(
      updateCourseInput,
      userId,
    );

    return {
      data: updatedSection,
      message: await this.i18n.t('section.UPDATED', {
        args: { title: updatedSection.title },
      }),
    };
  }

  async remove(
    deleteSectionInput: DeleteSectionInput,
    userId: string,
  ): Promise<SectionResponse> {
    const course = await this.courseProxy.findById(deleteSectionInput.courseId);

    if (course.data.instructorId !== userId)
      throw new UnauthorizedException(
        await this.i18n.t('section.NOT_INSTRACTOR'),
      );

    const section = await course.data.sections.find((id) => (id = id));

    this.courseSectionRepo.remove(section);

    return {
      data: null,
      message: await this.i18n.t('section.DELETED', {
        args: { id: section._id },
      }),
    };
  }
}
