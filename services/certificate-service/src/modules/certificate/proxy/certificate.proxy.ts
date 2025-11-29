import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../entity/certificate.entity';
import { I18nService } from 'nestjs-i18n';
import { FindCertificateInput } from '../inputs/FindCertificate.input';
import { RedisService } from '@bts-soft/core';
import { Limit, Page } from '@course-plateform/common';
import { UserClientService } from 'src/modules/user/userClient.service';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import {
  CertificateResponse,
  CertificatesResponse,
} from '../dto/certificateResponse.dto';

@Injectable()
export class CertificateProxy {
  constructor(
    private readonly i18n: I18nService,
    private readonly userProxy: UserClientService,
    private readonly courseProxy: CourseClientService,
    private readonly redisService: RedisService,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async checkCertificate(userId: string, courseId: string): Promise<void> {
    const certificate = await this.certificateRepository.findOne({
      where: { userId, courseId },
    });

    if (certificate) {
      this.redisService.set(`certificate:${certificate.id}`, certificate);
      throw new NotFoundException(await this.i18n.t('certificate.EXISTED'));
    }
  }

  async findById(id: string): Promise<CertificateResponse> {
    const cacheKey = `certificate:${id}`;
    const cachedCertificate = await this.redisService.get(cacheKey);

    if (cachedCertificate) return { data: cachedCertificate };

    const certificate = await this.certificateRepository.findOne({
      where: { id },
    });

    if (!certificate)
      throw new NotFoundException(await this.i18n.t('certificate.NOT_FOUND'));

    const user = await this.userProxy.findById(certificate.userId);
    const course = await this.courseProxy.findById(certificate.courseId);

    this.redisService.set(cacheKey, certificate);

    return { data: { ...certificate, user, course } };
  }

  async findAll(
    findCertificateInput: FindCertificateInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<CertificatesResponse> {
    const [certificates, total] = await this.certificateRepository.findAndCount(
      {
        where: {
          ...(findCertificateInput.courseId && {
            courseId: findCertificateInput.courseId,
          }),
          ...(findCertificateInput.userId && {
            userId: findCertificateInput.userId,
          }),
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    if (certificates.length === 0)
      throw new NotFoundException(await this.i18n.t('certificate.NOT_FOUNDS'));

    return {
      items: certificates,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findbyData(userId: string, courseId: string): Promise<void> {
    const certificate = await this.certificateRepository.findOne({
      where: { userId, courseId },
    });

    if (!certificate)
      throw new NotFoundException(this.i18n.t('review.NOT_BUY_THIS_COURSE'));
  }

  async checkCertificateExisted(
    userId: string,
    courseId: string,
  ): Promise<void> {
    await this.certificateRepository.findOne({
      where: { userId, courseId },
    });
  }
}
