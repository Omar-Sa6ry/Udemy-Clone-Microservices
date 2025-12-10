import { CertificateEvents } from '@course-plateform/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CertificateProxy } from './proxy/certificate.proxy';
import { CertificateFascade } from './fascade/certificate.fascade';
import { CreateCertificateInput } from './inputs/CreateCertificate.input';

@Controller()
export class CertificateNatsController {
  constructor(
    private readonly certificateProxy: CertificateProxy,
    private readonly certificateFascade: CertificateFascade,
  ) {}

  @MessagePattern(CertificateEvents.CHECK_CERTIFICATE_EXISTED)
  async handleCheckCertificateExisted(
    @Payload()
    data: {
      studentId: string;
      courseId: string;
    },
  ) {
    try {
      await this.certificateProxy.checkCertificate(
        data.studentId,
        data.courseId,
      );
      return { exists: true };
    } catch {
      return { exists: false };
    }
  }

  @MessagePattern(CertificateEvents.CREAE_CERTIFICATE)
  async handleCreateCertificate(
    @Payload()
    data: {
      createCertificateInput: CreateCertificateInput;
    },
  ) {
    return await this.certificateFascade.create(data.createCertificateInput);
  }
}
