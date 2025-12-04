import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import { UserClientService } from 'src/modules/user/userClient.service';
import { CourseDto, UserResponse } from '@course-plateform/types';

@Injectable({ scope: Scope.REQUEST })
export class ReviewLoaders {
  constructor(
    private readonly courseService: CourseClientService,
    private readonly userService: UserClientService,
  ) {}

  readonly batchCourses = new DataLoader<string, CourseDto>(
    async (courseIds: string[]) => {
      const courses = await this.courseService.findCoursesWithIds(courseIds);
      const courseMap = new Map(courses.map((c) => [c._id, c]));
      return courseIds.map((id) => courseMap.get(id));
    },
  );

  readonly batchStudents = new DataLoader<string, UserResponse>(
    async (studentIds: string[]) => {
      const users = await this.userService.findUsersWithIds(studentIds);
      const userMap = new Map(users.map((u) => [u.id, u]));
      return studentIds.map((id) => userMap.get(id));
    },
  );
}
