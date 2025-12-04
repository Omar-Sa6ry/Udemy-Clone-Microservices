import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CertificateEvents } from '@course-plateform/types';

@Injectable()
export class CertificateClientService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async checkCertificateExisted(
    studentId: string,
    courseId: string,
  ): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CertificateEvents.CHECK_CERTIFICATE_EXISTED, {
            studentId,
            courseId,
          })
          .pipe(timeout(10000)),
      );

      if (result.exists) return true;
    } catch (error) {
      console.error('Error fetching user data existed:', error);
      return false;
    }
  }
}
