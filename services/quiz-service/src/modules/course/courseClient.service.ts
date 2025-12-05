import {
  CourseEvents,
  CourseDto,
  Lesson,
  FindLessonInput,
} from '@course-plateform/types';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class CourseClientService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async findById(id: string): Promise<CourseDto> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CourseEvents.GET_COURSE_BY_ID, { id })
          .pipe(timeout(10000)),
      );

      if (!result || !result.data)
        throw new Error('Invalid response from course microservice');

      return result.data;
    } catch (error) {
      console.error('Error fetching course by id:', error);
      throw new BadRequestException('course fetch by id failed');
    }
  }

  async findLessonById(findLessonInput: FindLessonInput): Promise<Lesson> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CourseEvents.GET_LESSON_BY_ID, { findLessonInput })
          .pipe(timeout(10000)),
      );

      if (!result || !result.data)
        throw new Error('Invalid response from course microservice');

      return result.data;
    } catch (error) {
      console.error('Error fetching course by id:', error);
      throw new BadRequestException('course fetch by id failed');
    }
  }

  async update(updateCourseInput): Promise<CourseDto> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CourseEvents.UPDATE_COURSE, { updateCourseInput })
          .pipe(timeout(10000)),
      );

      if (!result || !result.data)
        throw new Error('Invalid response from course microservice');

      return result.data;
    } catch (error) {
      console.error('Error updateing course:', error);
      throw new BadRequestException('course update failed');
    }
  }

  async findCoursesWithIds(id: string[]): Promise<CourseDto[]> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CourseEvents.GET_COURSES_BY_ID, { id })
          .pipe(timeout(10000)),
      );

      if (!result || !result)
        throw new Error('Invalid response from course microservice');

      return result;
    } catch (error) {
      console.error('Error fetching course by id:', error);
      throw new BadRequestException('course fetch by id failed');
    }
  }
}
