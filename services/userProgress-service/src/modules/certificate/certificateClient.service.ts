import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CertificateEvents } from '@course-plateform/types';

@Injectable()
export class CertificateClientService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async createCertificte(createCertificateInput: any): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.client
          .send(CertificateEvents.CREAE_CERTIFICATE, {
            createCertificateInput,
          })
          .pipe(timeout(10000)),
      );

      if (!result || !result.data)
        throw new Error('Invalid response from certificate microservice');

      return result.data;
    } catch (error) {
      console.error('Error create certificate:', error);
      throw new BadRequestException('create certificate failed');
    }
  }
}
