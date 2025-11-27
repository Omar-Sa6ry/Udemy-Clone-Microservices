import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseProxy } from 'src/modules/courses/proxy/course.proxy';
import { ILessonStrategy } from '../interfaces/ILessonStratgy.interface';
import { I18nService } from 'nestjs-i18n';
import { Lesson } from '../entity/lesson.entity';
import { SectionProxy } from 'src/modules/section/proxy/section.proxy';
import { CreateLessonInput } from '../inputs/createLesson.input';
import { UploadService } from '@bts-soft/upload';

@Injectable()
export class CreateLessonStrategy implements ILessonStrategy {
  constructor(
    private readonly sectionProxy: SectionProxy,
    private readonly courseProxy: CourseProxy,
    private readonly uploadService: UploadService,
    private readonly i18n: I18nService,

    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  async execute(
    createLessonInput: CreateLessonInput,
    userId: string,
  ): Promise<Lesson> {
    const course = await this.courseProxy.findById(createLessonInput.courseId);

    if (course.data.instructorId !== userId)
      throw new UnauthorizedException(
        await this.i18n.t('section.NOT_INSTRACTOR'),
      );

    const section = await this.sectionProxy.findById(createLessonInput);

    const [file, video] = await Promise.all([
      createLessonInput.file
        ? this.uploadService.uploadFile(createLessonInput.file, 'courses/files')
        : Promise.resolve(null),
      createLessonInput.video
        ? this.uploadService.uploadVideo(
            createLessonInput.video,
            'courses/videos',
          )
        : Promise.resolve(null),
    ]);

    const lesson = await this.lessonRepo.create({
      ...createLessonInput,
      fileUrl: file.url,
      fileSize: file.size,
      videoUrl: video.url,
      videoSize: video.size,
      durationSeconds: video.duration,
    });
    await this.lessonRepo.save(lesson);

    section.data.lessons.push(lesson);

    return lesson;
  }
}
