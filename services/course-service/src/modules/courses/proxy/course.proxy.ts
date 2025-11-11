import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, Limit } from '@course-plateform/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { RedisService } from '@bts-soft/core';
import { Course } from '../entity/course.entity';
import { FindCourseInput } from '../inputs/findCourse.input';
import {
  CourseResponse,
  CoursesResponse,
  CourseCountResponse,
} from '../dto/courseResponse.dto';
import {
  CourseExistsByTitleHandler,
  CourseExistsHandler,
} from '../chain/course.chain';

@Injectable()
export class CourseProxy {
  constructor(
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findById(id: string): Promise<CourseResponse> {
    const cacheKey = `course:${id}`;
    const cachedCourse = await this.redisService.get(cacheKey);
    if (cachedCourse) return { data: cachedCourse as Course };

    const course = await this.courseRepository.findOne({ where: { id } });

    const existsHandler = new CourseExistsHandler(id);
    await existsHandler.handle(course, this.i18n);

    await this.redisService.set(cacheKey, course);
    return { data: course };
  }

  async findByTitle(title: string): Promise<CourseResponse> {
    const course = await this.courseRepository.findOne({
      where: { title: ILike(`%${title}%`) },
    });

    const existsHandler = new CourseExistsByTitleHandler(title);
    await existsHandler.handle(course, this.i18n);

    await this.redisService.set(`course:${course.id}`, course);
    return { data: course };
  }

  async findAll(
    findCourseInput: FindCourseInput,
    page: number = Page,
    limit: number = Limit,
    orderby: keyof Course = 'createdAt',
  ): Promise<CoursesResponse> {
    const where: FindOptionsWhere<Course> = {};

    if (findCourseInput.title) {
      where.title = ILike(`%${findCourseInput.title}%`);
    }
    if (findCourseInput.subtitle) {
      where.subtitle = ILike(`%${findCourseInput.subtitle}%`);
    }

    Object.entries(findCourseInput).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !['title', 'subtitle'].includes(key)
      ) {
        where[key] = value;
      }
    });

    const [courses, totalItems] = await this.courseRepository.findAndCount({
      where,
      order: { [orderby]: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!courses.length) {
      throw new NotFoundException(await this.i18n.t('course.NOT_FOUNDS'));
    }

    return {
      items: courses,
      pagination: {
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findAllWithoutPag(
    findCourseInput: FindCourseInput,
  ): Promise<CoursesResponse> {
    const where: FindOptionsWhere<Course> = {};

    if (findCourseInput.title) {
      where.title = ILike(`%${findCourseInput.title}%`);
    }
    if (findCourseInput.subtitle) {
      where.subtitle = ILike(`%${findCourseInput.subtitle}%`);
    }

    Object.entries(findCourseInput).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !['title', 'subtitle'].includes(key)
      ) {
        where[key] = value;
      }
    });

    const courses = await this.courseRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    if (!courses.length) {
      throw new NotFoundException(await this.i18n.t('course.NOT_FOUNDS'));
    }

    return { items: courses };
  }

  async countCoursesActive(): Promise<CourseCountResponse> {
    const count = await this.courseRepository.count({
      where: { isActive: true },
    });
    return { data: count };
  }

  async findUsersWithIds(ids: string[]): Promise<Course[]> {
    const courses = await this.courseRepository.findByIds(ids);
    return courses;
  }
}
