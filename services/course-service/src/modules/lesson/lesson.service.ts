import { Injectable } from '@nestjs/common';
import { Limit, Page } from '@course-plateform/common';
import { LessonProxy } from './proxy/lesson.proxy';
import { LessonFascade } from './fascade/lesson.fascade';
import { LessonResponse, LessonsResponse } from './dto/lessonResponse.dto';
import { CreateLessonInput } from './inputs/createLesson.input';
import { UpdateLessonInput } from './inputs/updateLesson.input';
import { FindLessonInput } from './inputs/findLesson.input';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonProxy: LessonProxy,
    private readonly lessonFascade: LessonFascade,
  ) {}

  async create(
    createLessonInput: CreateLessonInput,
    userId: string,
  ): Promise<LessonResponse> {
    return this.lessonFascade.create(createLessonInput, userId);
  }

  async update(
    updateLessonInput: UpdateLessonInput,
    userId: string,
  ): Promise<LessonResponse> {
    return this.lessonFascade.update(updateLessonInput, userId);
  }

  async delete(
    findLessonInput: FindLessonInput,
    userId: string,
  ): Promise<LessonResponse> {
    return this.lessonFascade.remove(findLessonInput, userId);
  }

  async findById(findLessonInput: FindLessonInput): Promise<LessonResponse> {
    return this.lessonProxy.findById(findLessonInput);
  }

  async findAllLessonsinSection(
    findLessonInput: FindLessonInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<LessonsResponse> {
    return this.lessonProxy.findAllLessonsinCourse(
      findLessonInput,
      page,
      limit,
    );
  }

  async findAllLessonsinSectionWithoutPag(
    findLessonInput: FindLessonInput,
  ): Promise<LessonsResponse> {
    return this.lessonProxy.findAllLessonsinCourseWithoutPag(findLessonInput);
  }
}
