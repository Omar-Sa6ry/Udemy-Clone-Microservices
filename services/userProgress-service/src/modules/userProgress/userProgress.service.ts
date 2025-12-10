import { Injectable } from '@nestjs/common';
import { UserProgressProxy } from './proxy/userProgress.proxy';
import { UserProgressFascade } from './fascade/userProgress.fascade';
import { CreateUserProgressInput } from './inputs/createUserProgress.input';
import { UpdateUserProgressInput } from './inputs/updateUserProgress.input';
import { UserProgressFilterInput } from './inputs/filterUserProgress.input';
import { Limit, Page } from '@course-plateform/common';
import { CourseProgressTypeResponse } from './dtos/courseProgress.dto';
import { UserProgressStatsTypeResponse } from './dtos/userProgressState.dto';
import {
  UserProgressResponse,
  UserProgresssResponse,
} from './dtos/userProgress.dto';

@Injectable()
export class UserProgressService {
  constructor(
    private readonly userProgressProxy: UserProgressProxy,
    private readonly userProgressFascade: UserProgressFascade,
  ) {}

  async create(
    createUserProgressInput: CreateUserProgressInput,
  ): Promise<UserProgressResponse> {
    return this.userProgressFascade.create(createUserProgressInput);
  }

  async update(
    updateUserProgressInput: UpdateUserProgressInput,
  ): Promise<UserProgressResponse> {
    return this.userProgressFascade.update(updateUserProgressInput);
  }

  async updateByUserAndLesson(
    userId: string,
    lessonId: string,
    updateUserProgressInput: UpdateUserProgressInput,
  ): Promise<UserProgressResponse> {
    return this.userProgressFascade.updateByUserAndLesson(
      userId,
      lessonId,
      updateUserProgressInput,
    );
  }

  async delete(id: string): Promise<UserProgressResponse> {
    return this.userProgressFascade.delete(id);
  }

  async markLessonAsCompleted(
    userId: string,
    lessonId: string,
  ): Promise<UserProgressResponse> {
    return this.userProgressFascade.markLessonAsCompleted(userId, lessonId);
  }

  async updateLessonWatchTime(
    userId: string,
    lessonId: string,
    seconds: number,
  ): Promise<UserProgressResponse> {
    return this.userProgressFascade.updateLessonWatchTime(
      userId,
      lessonId,
      seconds,
    );
  }

  async findAll(
    filter: UserProgressFilterInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<UserProgresssResponse> {
    return this.userProgressProxy.findAll(filter, page, limit);
  }

  async findById(id: string): Promise<UserProgressResponse> {
    return this.userProgressProxy.findById(id);
  }

  async findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<UserProgressResponse> {
    return this.userProgressProxy.findByUserAndLesson(userId, lessonId);
  }

  async getCourseProgress(
    userId: string,
    courseId: string,
  ): Promise<CourseProgressTypeResponse> {
    return this.userProgressProxy.getCourseProgress(userId, courseId);
  }

  async getUserStats(userId: string): Promise<UserProgressStatsTypeResponse> {
    return this.userProgressProxy.getUserStats(userId);
  }
}
