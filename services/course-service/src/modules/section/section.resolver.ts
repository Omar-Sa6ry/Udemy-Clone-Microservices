import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseSection } from './entity/courseSection.entity';
import { SectionService } from './section.service';
import {
  Auth,
  CurrentUser,
  Limit,
  Page,
  Permission,
} from '@course-plateform/common';
import { SectionResponse, SectionsResponse } from './dto/sectionResponse.dto';
import { CreateSectionInput } from './inputs/createCourseSection.input';
import { UpdateSectionInput } from './inputs/updateCourseSection.input';
import { DeleteSectionInput } from './inputs/deleteCourseSection.input';
import { FindSectionInput } from './inputs/findCourseSection.input';
import { CourseIdInput } from '../courses/inputs/courseId.input';
import { CurrentUserDto } from '@bts-soft/core';

@Resolver(() => CourseSection)
export class SectionResolver {
  constructor(private readonly sectionService: SectionService) {}

  @Auth([Permission.CREATE_SECTION])
  @Mutation(() => SectionResponse)
  async createCourseSection(
    @CurrentUser() user: CurrentUserDto,
    @Args('createCourseInput') createSectionInput: CreateSectionInput,
  ): Promise<SectionResponse> {
    return this.sectionService.create(createSectionInput, user.id);
  }

  @Auth([Permission.UPDATE_SECTION])
  @Mutation(() => SectionResponse)
  async updateCourseSection(
    @CurrentUser() user: CurrentUserDto,
    @Args('updateSectionInput') updateSectionInput: UpdateSectionInput,
  ): Promise<SectionResponse> {
    return this.sectionService.update(updateSectionInput, user.id);
  }

  @Auth([Permission.DELETE_SECTION])
  @Mutation(() => SectionResponse)
  async deleteCourseSection(
    @CurrentUser() user: CurrentUserDto,
    @Args('deleteSectionInput') deleteSectionInput: DeleteSectionInput,
  ): Promise<SectionResponse> {
    return this.sectionService.delete(deleteSectionInput, user.id);
  }

  @Query(() => SectionResponse)
  async findCourseSectionById(
    @Args('findSectionInput') findSectionInput: FindSectionInput,
  ): Promise<SectionResponse> {
    return this.sectionService.findById(findSectionInput);
  }

  @Query(() => SectionsResponse)
  async findAllCourseSections(
    @Args('courseIdInput') courseIdInput: CourseIdInput,
    @Args('page', { type: () => Int, defaultValue: Page }) page: number,
    @Args('limit', { type: () => Int, defaultValue: Limit }) limit: number,
  ): Promise<SectionsResponse> {
    return this.sectionService.findAllSectionsinCourse(
      courseIdInput,
      page,
      limit,
    );
  }

  @Query(() => SectionsResponse)
  async findAllCourseSectionsWithoutPag(
    @Args('courseIdInput') courseIdInput: CourseIdInput,
  ): Promise<SectionsResponse> {
    return this.sectionService.findAllSectionsinCourseWithoutPag(courseIdInput);
  }
}
