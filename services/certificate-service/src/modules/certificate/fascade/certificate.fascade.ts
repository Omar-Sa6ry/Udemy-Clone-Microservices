import { CreateCertificateInput } from './../inputs/CreateCertificate.input';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Certificate } from '../entity/certificate.entity';
import { CertificateProxy } from '../proxy/certificate.proxy';
import { ChannelType, NotificationService, RedisService } from '@bts-soft/core';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import { UserClientService } from 'src/modules/user/userClient.service';
import { CertificateResponse } from '../dto/certificateResponse.dto';

@Injectable()
export class CertificateFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly notificationService: NotificationService,
    private readonly redisService: RedisService,
    private readonly userProxy: UserClientService,
    private readonly courseProxy: CourseClientService,
    private readonly certificateProxy: CertificateProxy,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  @Transactional()
  async create(
    createCertificateInput: CreateCertificateInput,
  ): Promise<CertificateResponse> {
    const { userId, courseId } = createCertificateInput;

    const user = await this.userProxy.findById(userId);
    const course = await this.courseProxy.findById(courseId);

    await this.certificateProxy.checkCertificate(userId, courseId);

    const certificate = this.certificateRepository.create({
      userId,
      courseId,
    });
    await this.certificateRepository.save(certificate);

    this.redisService.set(`certificate:${certificate.id}`, certificate);

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: user.email,
      subject: 'Create Certification',
      body: 'create certificateion successfully',
    });

    return {
      data: { ...certificate, user, course },
      message: await this.i18n.t('certificate.CREATED'),
    };
  }

  @Transactional()
  async remove(id: string): Promise<CertificateResponse> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
    });
    if (!certificate)
      throw new BadRequestException(await this.i18n.t('certificate.NOT_FOUND'));

    this.certificateRepository.remove(certificate);
    this.redisService.del(`certificate:${id}`);

    return {
      data: null,
      message: await this.i18n.t('certificate.DELETED', { args: { id } }),
    };
  }
}
