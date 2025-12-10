import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProgress } from '../entity/userProgress.entity';
import { CreateUserProgressInput } from '../inputs/createUserProgress.input';
import { UserProgressProxy } from '../proxy/userProgress.proxy';
import { UserProgressResponse } from '../dtos/userProgress.dto';
import { UpdateUserProgressInput } from '../inputs/updateUserProgress.input';
import { CertificateClientService } from 'src/modules/certificate/certificateClient.service';

@Injectable()
export class UserProgressFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly userProgressProxy: UserProgressProxy,
    private readonly certificateClientService: CertificateClientService,

    @InjectRepository(UserProgress)
    private readonly userProgressRepo: Repository<UserProgress>,
  ) {}

  async create(
    createUserProgressInput: CreateUserProgressInput,
  ): Promise<UserProgressResponse> {
    const userProgressExisted =
      await this.userProgressProxy.findByUserAndLesson(
        createUserProgressInput.userId,
        createUserProgressInput.lessonId,
      );

    if (userProgressExisted)
      throw new BadRequestException(await this.i18n.t('userProgress.EXISTED'));

    const userProgress = await this.userProgressRepo.create(
      createUserProgressInput,
    );
    this.userProgressRepo.save(userProgress);

    return {
      data: userProgress,
      statusCode: 201,
      message: await this.i18n.t('userProgress.CREATED'),
    };
  }

  async update(
    updateUserProgressInput: UpdateUserProgressInput,
  ): Promise<UserProgressResponse> {
    const ifExisted = await this.userProgressProxy.findById(
      updateUserProgressInput.id,
    );

    const userProgress = await this.userProgressRepo.update(
      updateUserProgressInput.id,
      updateUserProgressInput,
    );

    if (updateUserProgressInput.completed)
      this.certificateClientService.createCertificte({
        userId: ifExisted.data.userId,
        courseId: ifExisted.data.courseId,
      });

    return {
      data: userProgress.raw,
      statusCode: 201,
      message: await this.i18n.t('userProgress.UPDATED'),
    };
  }

  async updateByUserAndLesson(
    userId: string,
    lessonId: string,
    updateUserProgressInput: UpdateUserProgressInput,
  ): Promise<UserProgressResponse> {
    const ifExisted = await this.userProgressProxy.findByUserAndLesson(
      userId,
      lessonId,
    );

    const userProgress = await this.userProgressRepo.update(
      updateUserProgressInput.id,
      updateUserProgressInput,
    );

    if (updateUserProgressInput.completed)
      this.certificateClientService.createCertificte({
        userId: ifExisted.data.userId,
        courseId: ifExisted.data.courseId,
      });

    return {
      data: userProgress.raw,
      statusCode: 201,
      message: await this.i18n.t('userProgress.UPDATED'),
    };
  }

  async delete(id: string): Promise<UserProgressResponse> {
    const userProgress = await this.userProgressProxy.findById(id);

    await this.userProgressRepo.remove(userProgress.data);

    return {
      data: null,
      statusCode: 201,
      message: await this.i18n.t('userProgress.UPDATED'),
    };
  }

  async markLessonAsCompleted(
    userId: string,
    lessonId: string,
  ): Promise<UserProgressResponse> {
    const ifExisted = await this.userProgressProxy.findByUserAndLesson(
      userId,
      lessonId,
    );

    const userProgress = await this.userProgressRepo.update(ifExisted.data.id, {
      completed: true,
    });

    this.certificateClientService.createCertificte({
      userId: ifExisted.data.userId,
      courseId: ifExisted.data.courseId,
    });

    return {
      data: userProgress.raw,
      statusCode: 201,
      message: await this.i18n.t('userProgress.UPDATED'),
    };
  }

  async updateLessonWatchTime(
    userId: string,
    lessonId: string,
    seconds: number,
  ): Promise<UserProgressResponse> {
    const userProgress = await this.userProgressProxy.findByUserAndLesson(
      userId,
      lessonId,
    );

    const watch_time_seconds = userProgress.data.watch_time_seconds + seconds;
    const updated = await this.userProgressRepo.update(userProgress.data.id, {
      watch_time_seconds,
    });

    return {
      data: updated.raw,
      statusCode: 201,
      message: await this.i18n.t('userProgress.UPDATED'),
    };
  }
}
