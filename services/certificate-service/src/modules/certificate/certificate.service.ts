import { FindCertificateInput } from './inputs/FindCertificate.input';
import { Injectable } from '@nestjs/common';
import { CertificateProxy } from './proxy/certificate.proxy';
import { Limit, Page } from '@course-plateform/common';
import { CertificateFascade } from './fascade/certificate.fascade';
import { CreateCertificateInput } from './inputs/CreateCertificate.input';
import {
  CertificateResponse,
  CertificatesResponse,
} from './dto/certificateResponse.dto';

@Injectable()
export class CertificateService {
  constructor(
    private readonly certificateProxy: CertificateProxy,
    private readonly certificateFascade: CertificateFascade,
  ) {}

  async create(
    createCertificateInput: CreateCertificateInput,
  ): Promise<CertificateResponse> {
    return this.certificateFascade.create(createCertificateInput);
  }

  async delete(id: string): Promise<CertificateResponse> {
    return this.certificateFascade.remove(id);
  }

  async findById(id: string): Promise<CertificateResponse> {
    return this.certificateProxy.findById(id);
  }

  async findAll(
    findCertificateInput: FindCertificateInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<CertificatesResponse> {
    return this.certificateProxy.findAll(findCertificateInput, page, limit);
  }
}
