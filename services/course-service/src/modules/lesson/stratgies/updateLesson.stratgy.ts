import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ILessonStrategy } from '../interfaces/ILessonStratgy.interface';
import { RedisService } from '@bts-soft/core';
import { CourseProxy } from 'src/modules/courses/proxy/course.proxy';
import { I18nService } from 'nestjs-i18n';
import { UpdateLessonInput } from '../inputs/updateLesson.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entity/lesson.entity';
import { UploadService } from '@bts-soft/upload';

@Injectable()
export class UpdateLessonStrategy implements ILessonStrategy {
  constructor(
    private readonly redisService: RedisService,
    private readonly courseProxy: CourseProxy,
    private readonly uploadService: UploadService,
    private readonly i18n: I18nService,

    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  async execute(
    updateLessonInput: UpdateLessonInput,
    userId: string,
  ): Promise<Lesson> {
    const course = await this.courseProxy.findById(updateLessonInput.courseId);

    if (!course)
      throw new NotFoundException(
        `Course with ID ${updateLessonInput.courseId} not found`,
      );

    if (course.data.instructorId !== userId)
      throw new UnauthorizedException(
        await this.i18n.t('section.NOT_INSTRACTOR'),
      );

    const section = course.data.sections.find(
      (section) => section._id.toString() === updateLessonInput.sectionId,
    );

    if (!section) throw new NotFoundException('Section not found');

    const lesson = section.lessons.find(
      (lesson) => lesson._id.toString() === updateLessonInput.id,
    );
    if (!lesson) throw new NotFoundException('Lesson not found');

    if (updateLessonInput.title) {
      lesson.title = updateLessonInput.title;
    }

    if (updateLessonInput.file) {
      const oldPath = lesson.fileUrl;
      await this.uploadService.deleteFile(oldPath);

      const uploadedFile = await this.uploadService.uploadFile(
        updateLessonInput.file,
        'courses/files',
      );

      lesson.fileUrl = uploadedFile.url;
      lesson.fileSize = uploadedFile.size;
    }

    if (updateLessonInput.video) {
      const oldPath = lesson.videoUrl;
      await this.uploadService.deleteVideo(oldPath);

      const uploadedVideo = await this.uploadService.uploadVideo(
        updateLessonInput.video,
        'courses/videos',
      );

      lesson.videoUrl = uploadedVideo.url;
      lesson.videoSize = uploadedVideo.size;
      lesson.durationSeconds = uploadedVideo.duration;
    }

    const updatedLesson = await this.lessonRepo.save(lesson);

    await this.redisService.update(`course:${course.data._id}`, course.data);

    return updatedLesson;
  }
}
