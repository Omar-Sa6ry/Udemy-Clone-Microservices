import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { UserResponse, CourseDto } from '@course-plateform/types';
import { Certificate } from '../entity/certificate.entity';

@ObjectType()
export class CertificateDto {
  @Field(() => UserResponse, { nullable: true })
  user?: UserResponse;

  @Field(() => CourseDto, { nullable: true })
  course?: CourseDto;
}

@ObjectType()
export class CertificateResponse extends BaseResponse {
  @Field(() => CertificateDto, { nullable: true })
  data?: CertificateDto;
}

@ObjectType()
export class CertificatesResponse extends BaseResponse {
  @Field(() => [Certificate], { nullable: true })
  items?: Certificate[];

  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}
