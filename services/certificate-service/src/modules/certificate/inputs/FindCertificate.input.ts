import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCertificateInput } from './CreateCertificate.input';

@InputType()
export class FindCertificateInput extends PartialType(CreateCertificateInput) {}
