import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CertificateService } from './certificate.service';
import { FindCertificateInput } from './inputs/FindCertificate.input';
import { CertificateIdInput } from './inputs/certificateId.input';
import { CurrentUserDto } from '@bts-soft/core';
import { Auth, CurrentUser, Permission } from '@course-plateform/common';
import { CourseDto, UserResponse } from '@course-plateform/types';
import { Certificate } from './entity/certificate.entity';
import { CertificateLoader } from './dataLoader/certificate.dataLoader';
import {
  CertificateResponse,
  CertificatesResponse,
} from './dto/certificateResponse.dto';

@Resolver(() => Certificate)
export class CertificateResolver {
  constructor(
    private readonly certificateLoader: CertificateLoader,
    private readonly certificateService: CertificateService,
  ) {}

  @Mutation(() => CertificateResponse)
  @Auth([Permission.DELETE_CERTIFICATE])
  async deleteCertificate(
    @Args('id', { type: () => CertificateIdInput }) id: CertificateIdInput,
  ): Promise<CertificateResponse> {
    return this.certificateService.delete(id.certificateId);
  }

  @Query(() => CertificateResponse)
  @Auth([Permission.VIEW_CERTIFICATE])
  async getCertificateById(
    @Args('id', { type: () => CertificateIdInput }) id: CertificateIdInput,
  ): Promise<CertificateResponse> {
    return this.certificateService.findById(id.certificateId);
  }

  @Query(() => CertificatesResponse)
  @Auth([Permission.VIEW_CERTIFICATE_FOR_USER, Permission.VIEW_CERTIFICATE])
  async getCertificateByIdForUser(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<CertificatesResponse> {
    return this.certificateService.findAll({ userId: user.id });
  }

  @Query(() => CertificatesResponse)
  @Auth([Permission.VIEW_CERTIFICATE])
  async getCertificates(
    @Args('findCertificateInput', { nullable: true })
    findCertificateInput: FindCertificateInput,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<CertificatesResponse> {
    return this.certificateService.findAll(findCertificateInput, page, limit);
  }

  @ResolveField(() => CourseDto)
  async course(@Parent() certificate: Certificate): Promise<CourseDto> {
    return this.certificateLoader.batchCoursesByCertificate.load(
      certificate.id,
    );
  }

  @ResolveField(() => UserResponse)
  async user(@Parent() certificate: Certificate): Promise<UserResponse> {
    return this.certificateLoader.batchUserByCertificate.load(certificate.id);
  }
}
