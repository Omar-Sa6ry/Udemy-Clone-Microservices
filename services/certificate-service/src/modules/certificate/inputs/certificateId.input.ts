import { IdField } from '@bts-soft/core';
import { InputType} from '@nestjs/graphql';

@InputType()
export class CertificateIdInput {
  @IdField('certificate Id')
  certificateId: string;
}
