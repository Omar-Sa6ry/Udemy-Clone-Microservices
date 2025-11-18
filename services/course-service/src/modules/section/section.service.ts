import { Injectable } from '@nestjs/common';
import { Limit, Page } from '@course-plateform/common';
import { SectionProxy } from './proxy/section.proxy';
import { SectionFascade } from './fascade/section.fascade';
import { CreateSectionInput } from './inputs/createCourseSection.input';
import { SectionResponse, SectionsResponse } from './dto/sectionResponse.dto';
import { UpdateSectionInput } from './inputs/updateCourseSection.input';
import { DeleteSectionInput } from './inputs/deleteCourseSection.input';
import { CourseIdInput } from '../courses/inputs/courseId.input';
import { FindSectionInput } from './inputs/findCourseSection.input';

@Injectable()
export class SectionService {
  constructor(
    private readonly sectionProxy: SectionProxy,
    private readonly sectionFascade: SectionFascade,
  ) {}

  async create(
    createSectionInput: CreateSectionInput,
    userId: string,
  ): Promise<SectionResponse> {
    return this.sectionFascade.create(createSectionInput, userId);
  }

  async update(
    updateSectionInput: UpdateSectionInput,
    userId: string,
  ): Promise<SectionResponse> {
    return this.sectionFascade.update(updateSectionInput, userId);
  }

  async delete(
    deleteSectionInput: DeleteSectionInput,
    userId: string,
  ): Promise<SectionResponse> {
    return this.sectionFascade.remove(deleteSectionInput, userId);
  }

  async findById(findSectionInput: FindSectionInput): Promise<SectionResponse> {
    return this.sectionProxy.findById(findSectionInput);
  }

  async findAllSectionsinCourse(
    courseIdInput: CourseIdInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<SectionsResponse> {
    return this.sectionProxy.findAllSectionsinCourse(
      courseIdInput,
      page,
      limit,
    );
  }

  async findAllSectionsinCourseWithoutPag(
    courseIdInput: CourseIdInput,
  ): Promise<SectionsResponse> {
    return this.sectionProxy.findAllSectionsinCourseWithoutPag(courseIdInput);
  }
}
