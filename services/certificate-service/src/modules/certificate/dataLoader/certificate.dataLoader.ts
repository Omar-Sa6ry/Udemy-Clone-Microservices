import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UserClientService } from 'src/modules/user/userClient.service';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseDto, UserResponse } from '@course-plateform/types';
import { Certificate } from '../entity/certificate.entity';

@Injectable({ scope: Scope.REQUEST })
export class CertificateLoader {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,

    private readonly userProxy: UserClientService,
    private readonly courseProxy: CourseClientService,
  ) {}

  public readonly batchCoursesByCertificate = new DataLoader<string, CourseDto>(
    async (certificateIds: readonly string[]) => {
      const certificates = await this.certificateRepository.find({
        where: { id: In(certificateIds as string[]) },
      });

      const courseIds = certificates.map((c) => c.courseId);

      const courses = await this.courseProxy.findCoursesWithIds(courseIds);

      const courseMap = new Map(courses.map((c) => [c._id, c]));

      return courseIds.map((id) => courseMap.get(id));
    },
  );

  public readonly batchUserByCertificate = new DataLoader<string, UserResponse>(
    async (certificateIds: readonly string[]) => {
      const certificates = await this.certificateRepository.find({
        where: { id: In(certificateIds as string[]) },
      });

      const userIds = certificates.map((c) => c.userId);

      const users = await this.userProxy.findUsersWithIds(userIds);

      const userMap = new Map(users.map((u) => [u.id, u]));

      return userIds.map((id) => userMap.get(id));
    },
  );
}
