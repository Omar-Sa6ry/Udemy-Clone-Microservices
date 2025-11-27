import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonStrategy } from '../stratgies/createLesson.stratgy';
import { Lesson } from '../entity/lesson.entity';
import { LessonResponse } from '../dto/lessonResponse.dto';
import { CreateLessonInput } from '../inputs/createLesson.input';
import { UpdateLessonStrategy } from '../stratgies/updateLesson.stratgy';
import { UpdateLessonInput } from '../inputs/updateLesson.input';
import { LessonProxy } from '../proxy/lesson.proxy';
import { FindLessonInput } from '../inputs/findLesson.input';
import { CourseProxy } from 'src/modules/courses/proxy/course.proxy';

@Injectable()
export class LessonFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly createStrategy: CreateLessonStrategy,
    private readonly updateStrategy: UpdateLessonStrategy,
    private readonly lessonProxy: LessonProxy,
    private readonly courseProxy: CourseProxy,

    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  async create(
    createLessonInput: CreateLessonInput,
    userId: string,
  ): Promise<LessonResponse> {
    const lesson = await this.createStrategy.execute(createLessonInput, userId);

    return {
      data: lesson,
      statusCode: 201,
      message: await this.i18n.t('section.CREATED'),
    };
  }

  async update(
    updateLessonInput: UpdateLessonInput,
    userId: string,
  ): Promise<LessonResponse> {
    const updatedSection = await this.updateStrategy.execute(
      updateLessonInput,
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
    findLessonInput: FindLessonInput,
    userId: string,
  ): Promise<LessonResponse> {
    const lesson = await this.lessonProxy.findById(findLessonInput);

    const course = await this.courseProxy.findById(findLessonInput.courseId);

    if (course.data.instructorId !== userId)
      throw new UnauthorizedException(
        await this.i18n.t('section.NOT_INSTRACTOR'),
      );

    const section = await course.data.sections.find((id) => (id = id));

    this.lessonRepo.remove(lesson.data);

    return {
      data: null,
      message: await this.i18n.t('section.DELETED', {
        args: { id: section._id },
      }),
    };
  }
}
