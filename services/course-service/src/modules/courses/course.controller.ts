import { CourseEvents } from '@course-plateform/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CourseProxy } from './proxy/course.proxy';

@Controller()
export class CourseNatsController {
  constructor(private readonly courseProxy: CourseProxy) {}

  @MessagePattern(CourseEvents.GET_COURSE_BY_ID)
  async handlefindUsersWithIds(@Payload() data: { ids: string[] }) {
    return await this.courseProxy.findUsersWithIds(data.ids);
  }

  @MessagePattern(CourseEvents.FIND_COURSES_WITH_IS)
  async getUserById(@Payload() data: { id: string }) {
    return await this.courseProxy.findById(data.id);
  }
}
