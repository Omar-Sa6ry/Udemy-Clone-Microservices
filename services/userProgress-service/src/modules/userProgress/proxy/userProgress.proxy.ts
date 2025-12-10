import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Limit, Page } from '@course-plateform/common';
import { UserProgress } from '../entity/userProgress.entity';
import { I18nService } from 'nestjs-i18n';
import { CourseProgressTypeResponse } from '../dtos/courseProgress.dto';
import { UserProgressStatsTypeResponse } from '../dtos/userProgressState.dto';
import { UserProgressFilterInput } from '../inputs/filterUserProgress.input';
import {
  UserProgressResponse,
  UserProgresssResponse,
} from '../dtos/userProgress.dto';

@Injectable()
export class UserProgressProxy {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(UserProgress)
    private readonly userProgressRepo: Repository<UserProgress>,
  ) {}

  async findAll(
    filter: UserProgressFilterInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<UserProgresssResponse> {
    const query = this.userProgressRepo.createQueryBuilder('user_progress');

    if (filter.userId)
      query.andWhere('user_progress.userId = :userId', {
        userId: filter.userId,
      });

    if (filter.courseId)
      query.andWhere('user_progress.courseId = :courseId', {
        courseId: filter.courseId,
      });

    if (filter.completed !== undefined)
      query.andWhere('user_progress.completed = :completed', {
        completed: filter.completed,
      });

    const [items, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user_progress.updatedAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      pagination: {
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findById(id: string): Promise<UserProgressResponse> {
    const userProgress = await this.userProgressRepo.findOne({ where: { id } });

    if (!userProgress)
      throw new NotFoundException(this.i18n.t('userProgress.NOT_FOUND'));

    return { data: userProgress };
  }

  async findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<UserProgressResponse> {
    const userProgress = await this.userProgressRepo.findOne({
      where: { userId, lessonId },
    });

    if (!userProgress)
      throw new NotFoundException(this.i18n.t('userProgress.NOT_FOUND'));

    return { data: userProgress };
  }

  async getCourseProgress(
    userId: string,
    courseId: string,
  ): Promise<CourseProgressTypeResponse> {
    const result = await this.userProgressRepo
      .createQueryBuilder('up')
      .select('courseId')
      .addSelect('COUNT(*)', 'total_lessons')
      .addSelect(
        'SUM(CASE WHEN completed = true THEN 1 ELSE 0 END)',
        'completed_lessons',
      )
      .addSelect('SUM(watch_time_seconds)', 'total_watch_time')
      .where('up.userId = :userId', { userId })
      .andWhere('up.courseId = :courseId', { courseId })
      .groupBy('up.courseId')
      .getRawOne();

    if (!result) {
      return {
        data: {
          courseId,
          total_lessons: 0,
          completed_lessons: 0,
          progress_percentage: 0,
          total_watch_time: 0,
        },
      };
    }

    return {
      data: {
        courseId: result.courseId,
        total_lessons: parseInt(result.total_lessons),
        completed_lessons: parseInt(result.completed_lessons),
        progress_percentage:
          (parseInt(result.completed_lessons) /
            parseInt(result.total_lessons)) *
          100,
        total_watch_time: parseInt(result.total_watch_time) || 0,
      },
    };
  }

  async getUserStats(userId: string): Promise<UserProgressStatsTypeResponse> {
    const stats = await this.userProgressRepo
      .createQueryBuilder('up')
      .select('COUNT(DISTINCT up.courseId)', 'total_courses')
      .addSelect(
        'SUM(CASE WHEN up.completed = true THEN 1 ELSE 0 END)',
        'total_completed',
      )
      .addSelect('SUM(up.watch_time_seconds)', 'total_watch_time')
      .where('up.userId = :userId', { userId })
      .getRawOne();

    return {
      data: {
        total_courses_enrolled: parseInt(stats.total_courses) || 0,
        total_lessons_completed: parseInt(stats.total_completed) || 0,
        total_watch_time_hours: Math.round(
          (parseInt(stats.total_watch_time) || 0) / 3600,
        ),
      },
    };
  }
}
