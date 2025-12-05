import { CourseEvents } from '@course-plateform/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LessonProxy } from './proxy/lesson.proxy';
import { FindLessonInput } from './inputs/findLesson.input';

@Controller()
export class LessonController {
  constructor(private readonly lessonProxy: LessonProxy) {}

  @MessagePattern(CourseEvents.GET_LESSON_BY_ID)
  async getUserById(@Payload() data: { findLessonInput: FindLessonInput }) {
    return await this.lessonProxy.findById(data.findLessonInput);
  }
}
