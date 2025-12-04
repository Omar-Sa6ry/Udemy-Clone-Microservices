import { CertificateEvents } from '@course-plateform/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CertificateProxy } from './proxy/certificate.proxy';

@Controller()
export class CertificateNatsController {
  constructor(private readonly certificateProxy: CertificateProxy) {}

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
}
