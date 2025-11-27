import { CourseSection } from 'src/modules/section/entity/courseSection.entity';
import { CreateLessonInput } from '../inputs/createLesson.input';
import { UpdateLessonInput } from '../inputs/updateLesson.input';

export interface ILessonStrategy {
  execute(
    input: UpdateLessonInput | CreateLessonInput,
    userId: string,
  ): Promise<CourseSection>;
}
