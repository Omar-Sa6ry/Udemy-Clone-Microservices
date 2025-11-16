import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Course } from '../entity/course.entity';
import { CourseResponse } from '../dto/courseResponse.dto';
import { CourseProxy } from '../proxy/course.proxy';
import { CourseExistsHandler, CourseTitleHandler } from '../chain/course.chain';
import { CreateCourseInput } from '../inputs/createCourse.input';
import { UpdateCourseInput } from '../inputs/updateCourse.input';
import { CreateCourseStrategy } from '../stratgies/createCourse.stratgy';
import { UpdateCourseStrategy } from '../stratgies/updateCourse.stratgy';
import { DeleteMediaHandler } from '../chain/deleteMedia.chain';
import { RedisService, UploadService } from '@bts-soft/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class CourseFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    private readonly courseProxy: CourseProxy,
    private readonly createStrategy: CreateCourseStrategy,
    private readonly updateStrategy: UpdateCourseStrategy,
    private readonly uploadService: UploadService,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseInput: CreateCourseInput): Promise<CourseResponse> {
    const titleHandler = new CourseTitleHandler(
      createCourseInput.title,
      this.courseRepository,
    );
    await titleHandler.handle(null, this.i18n);

    const course = await this.createStrategy.execute(createCourseInput);

    if (course.isActive) {
      const courses = await this.courseRepository.count({
        where: { isActive: true },
      });
      await this.redisService.set(`course_count:all`, courses);
    }

    const allCourses = await this.courseRepository.count();
    await this.redisService.set(`course_count:true`, allCourses);

    return {
      data: course,
      statusCode: 201,
      message: await this.i18n.t('course.CREATED'),
    };
  }

  async update(updateCourseInput: UpdateCourseInput): Promise<CourseResponse> {

    console.log(updateCourseInput)
    const course = (await this.courseProxy.findById(updateCourseInput.id))
      ?.data;

    const existsHandler = new CourseExistsHandler(updateCourseInput.id);

    if (updateCourseInput.title) {
      const titleHandler = new CourseTitleHandler(
        updateCourseInput.title,
        this.courseRepository,
      );
      existsHandler.setNext(titleHandler);
    }

    await existsHandler.handle(course, this.i18n);

    const updatedCourse = await this.updateStrategy.execute(updateCourseInput);

    await this.redisService.update(
      `course:${updatedCourse._id}`,
      updatedCourse,
    );

    return {
      data: updatedCourse,
      message: await this.i18n.t('course.UPDATED', {
        args: { title: updatedCourse.title },
      }),
    };
  }

  async activate(id: string): Promise<CourseResponse> {
    const course = (await this.courseProxy.findById(id))?.data;

    if (course?.isActive) {
      throw new BadRequestException(
        await this.i18n.t('course.ALREADY_ACTIVE', {
          args: { title: course.title },
        }),
      );
    }

    await this.courseRepository.update(
      { _id: new ObjectId(id) },
      { isActive: true },
    );

    const courses = await this.courseRepository.count({
      where: { isActive: true },
    });
    await this.redisService.update(`course_count:all`, courses);

    return {
      data: course,
      message: await this.i18n.t('course.COURSE_IS_ACTIVE', {
        args: { title: course.title },
      }),
    };
  }

  async deactivate(id: string): Promise<CourseResponse> {
    const course = (await this.courseProxy.findById(id))?.data;

    if (!course?.isActive) {
      throw new BadRequestException(
        await this.i18n.t('course.ALREADY_INACTIVE', {
          args: { title: course.title },
        }),
      );
    }

    await this.courseRepository.update(
      { _id: new ObjectId(id) },
      { isActive: false },
    );

    const courses = await this.courseRepository.count({
      where: { isActive: true },
    });
    await this.redisService.update(`course_count:all`, courses);

    return {
      data: course,
      message: await this.i18n.t('course.COURSE_IS_INACTIVE', {
        args: { title: course.title },
      }),
    };
  }

  async remove(id: string): Promise<CourseResponse> {
    const course = await this.courseRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    const existsHandler = new CourseExistsHandler(id);
    const deleteMediaHandler = new DeleteMediaHandler(this.uploadService);

    existsHandler.setNext(deleteMediaHandler);
    await existsHandler.handle(course, this.i18n);

    await this.courseRepository.delete({ _id: new ObjectId(id) });

    if (course.isActive) {
      const courses = await this.courseRepository.count({
        where: { isActive: true },
      });
      await this.redisService.set(`course_count:all`, courses);
    }

    const allCourses = await this.courseRepository.count();
    await this.redisService.set(`course_count:true`, allCourses);
    await this.redisService.del(`course:${id}`);

    return {
      data: null,
      message: await this.i18n.t('course.DELETED', { args: { id } }),
    };
  }
}
