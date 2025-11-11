import { Course } from '../entity/course.entity';
import { CreateCourseInput } from '../inputs/createCourse.input';
import { UpdateCourseInput } from '../inputs/updateCourse.input';

export interface ICourseStrategy {
  execute(input: CreateCourseInput | UpdateCourseInput): Promise<Course>;
}
