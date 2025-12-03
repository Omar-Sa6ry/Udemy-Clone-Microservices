import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { UserClientService } from 'src/modules/user/userClient.service';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import { CourseDto, UserResponse } from '@course-plateform/types';

@Injectable({ scope: Scope.REQUEST })
export class WishlistLoader {
  constructor(
    private readonly userProxy: UserClientService,
    private readonly courseProxy: CourseClientService,
  ) {}

  public readonly batchUsers = new DataLoader<string, UserResponse>(
    async (userIds: readonly string[]) => {
      const users = await this.userProxy.findUsersWithIds(userIds as string[]);

      const userMap: Record<string, UserResponse> = {};
      users.forEach((u) => (userMap[u.id] = u));

      return userIds.map((id) => userMap[id]);
    },
  );

  public readonly batchCourses = new DataLoader<string, CourseDto>(
    async (courseIds: readonly string[]) => {
      const courses = await this.courseProxy.findCoursesWithIds(
        courseIds as string[],
      );

      const courseMap: Record<string, CourseDto> = {};
      courses.forEach((c) => (courseMap[c._id] = c));

      return courseIds.map((id) => courseMap[id]);
    },
  );
}
