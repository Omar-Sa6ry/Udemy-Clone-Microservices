import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@bts-soft/core';
import { Limit, Page } from '@course-plateform/common';
import { Course } from './entity/course.entity';
import { FindCourseInput } from './inputs/findCourse.input';
import { CreateCourseInput } from './inputs/createCourse.input';
import { UpdateCourseInput } from './inputs/updateCourse.input';
import { CourseProxy } from './proxy/course.proxy';
import { CourseFascade } from './fascade/course.fascade';
import {
  CourseCountResponse,
  CourseResponse,
  CoursesResponse,
} from './dto/courseResponse.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly redisService: RedisService,
    private readonly courseProxy: CourseProxy,
    private readonly courseFascade: CourseFascade,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseInput: CreateCourseInput): Promise<CourseResponse> {
    return this.courseFascade.create(createCourseInput);
  }

  async update(updateCourseInput: UpdateCourseInput): Promise<CourseResponse> {
    return this.courseFascade.update(updateCourseInput);
  }

  async activate(id: string): Promise<CourseResponse> {
    return this.courseFascade.activate(id);
  }

  async deactivate(id: string): Promise<CourseResponse> {
    return this.courseFascade.deactivate(id);
  }

  async delete(id: string): Promise<CourseResponse> {
    return this.courseFascade.remove(id);
  }

  async findById(id: string): Promise<CourseResponse> {
    return this.courseProxy.findById(id);
  }

  async findByTitle(title: string): Promise<CourseResponse> {
    return this.courseProxy.findByTitle(title);
  }

  async countCoursesActive(): Promise<CourseCountResponse> {
    return this.courseProxy.countCoursesActive();
  }

  async findAll(
    findCourseInput: FindCourseInput,
    page: number = Page,
    limit: number = Limit,
    orderby: string = 'createdAt',
  ): Promise<CoursesResponse> {
    return this.courseProxy.findAll(findCourseInput, page, limit, orderby);
  }

  async findAllWithoutPag(
    findCourseInput: FindCourseInput,
  ): Promise<CoursesResponse> {
    return this.courseProxy.findAllWithoutPag(findCourseInput);
  }

  async countCourses(): Promise<CourseCountResponse> {
    const courses = await this.courseRepository.count({
      where: { isActive: true },
    });
    await this.redisService.set(`course_count:true`, courses);
    return { data: courses };
  }

  async countAllCourses(): Promise<CourseCountResponse> {
    const courses = await this.courseRepository.count();
    await this.redisService.set(`course_count:all`, courses);
    return { data: courses };
  }
}
