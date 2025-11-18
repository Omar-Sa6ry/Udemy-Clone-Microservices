import { CourseSection } from '../entity/courseSection.entity';
import { CreateSectionInput } from '../inputs/createCourseSection.input';
import { UpdateSectionInput } from '../inputs/updateCourseSection.input';

export interface ISectionStrategy {
  execute(
    input: CreateSectionInput | UpdateSectionInput,
    userId: string,
  ): Promise<CourseSection>;
}
