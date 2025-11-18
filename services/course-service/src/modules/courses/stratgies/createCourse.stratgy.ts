import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entity/course.entity';
import { CreateCourseInput } from '../inputs/createCourse.input';
import { ICourseStrategy } from '../interfaces/ICourseStratgy.interface';
import { UploadService } from '@bts-soft/core';
import { UserClientService } from 'src/modules/user/userClient.service';
import { CategoryClientService } from 'src/modules/category/categoryClient.service';

@Injectable()
export class CreateCourseStrategy implements ICourseStrategy {
  constructor(
    private readonly uploadService: UploadService,
    private readonly userProxy: UserClientService,
    private readonly categoryProxy: CategoryClientService,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async execute(input: CreateCourseInput): Promise<Course> {
    await Promise.all([
      this.categoryProxy.getCategoryById(input.categoryId),
      this.userProxy.checkIfInstractor(input.instructorId),
    ]);

    const [imageUrl, promoVideoUrl] = await Promise.all([
      input.image
        ? this.uploadService.uploadImage(input.image, 'courses')
        : Promise.resolve(null),
      input.demo_video
        ? this.uploadService.uploadVideo(input.demo_video, 'courses/videos')
        : Promise.resolve(null),
    ]);

    const course = this.courseRepository.create({
      ...input,
      instructorId: input.instructorId,
      categoryId: input.categoryId,
      price: input.price ? Number(input.price) : 0,
      discountPrice:
        input.discountPrice !== undefined ? Number(input.discountPrice) : 0,
      totalHours: input.totalHours ? Number(input.totalHours) : 0,
      totalLectures: input.totalLectures ? Number(input.totalLectures) : 0,
      imageUrl,
      promoVideoUrl,
      sections: [],
    });

    return await this.courseRepository.save(course);
  }
}
