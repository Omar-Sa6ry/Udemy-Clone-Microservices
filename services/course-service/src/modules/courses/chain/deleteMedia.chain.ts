import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ICourseHandler } from '../interfaces/ICourse.interface';
import { Course } from '../entity/course.entity';
import { UploadService } from '@bts-soft/core';

@Injectable()
export class DeleteMediaHandler implements ICourseHandler {
  private nextHandler: ICourseHandler;

  constructor(private readonly uploadService: UploadService) {}

  setNext(handler: ICourseHandler): ICourseHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(course: Course, i18n: I18nService): Promise<void> {
    try {
      if (course.imageUrl)
        await this.uploadService.deleteImage(course.imageUrl);

      if (course.promoVideoUrl)
        await this.uploadService.deleteVideo(course.promoVideoUrl);

      console.log(`Media deleted for course: ${course.id}`);
    } catch (error) {
      console.error(`Failed to delete media for course ${course.id}:`, error);
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(course, i18n);
    }
  }
}
