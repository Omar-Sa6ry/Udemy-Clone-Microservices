import {
  Auth,
  CurrentUser,
  Limit,
  Page,
  Permission,
} from '@course-plateform/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CurrentUserDto } from '@bts-soft/core';
import { Lesson } from './entity/lesson.entity';
import { LessonService } from './lesson.service';
import { LessonResponse, LessonsResponse } from './dto/lessonResponse.dto';
import { CreateLessonInput } from './inputs/createLesson.input';
import { UpdateLessonInput } from './inputs/updateLesson.input';
import { FindLessonInput } from './inputs/findLesson.input';

@Resolver(() => Lesson)
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

  @Auth([Permission.CREATE_SECTION])
  @Mutation(() => LessonResponse)
  async createLesson(
    @CurrentUser() user: CurrentUserDto,
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ): Promise<LessonResponse> {
    return this.lessonService.create(createLessonInput, user.id);
  }

  @Auth([Permission.UPDATE_SECTION])
  @Mutation(() => LessonResponse)
  async updateLesson(
    @CurrentUser() user: CurrentUserDto,
    @Args('updateLessonInput') updateLessonInput: UpdateLessonInput,
  ): Promise<LessonResponse> {
    return this.lessonService.update(updateLessonInput, user.id);
  }

  @Auth([Permission.DELETE_SECTION])
  @Mutation(() => LessonResponse)
  async deleteLesson(
    @CurrentUser() user: CurrentUserDto,
    @Args('findLessonInput') findLessonInput: FindLessonInput,
  ): Promise<LessonResponse> {
    return this.lessonService.delete(findLessonInput, user.id);
  }

  @Query(() => LessonResponse)
  async findLessonById(
    @Args('findLessonInput') findLessonInput: FindLessonInput,
  ): Promise<LessonResponse> {
    return this.lessonService.findById(findLessonInput);
  }

  @Query(() => LessonsResponse)
  async findAllLessons(
    @Args('findLessonInput') findLessonInput: FindLessonInput,
    @Args('page', { type: () => Int, defaultValue: Page }) page: number,
    @Args('limit', { type: () => Int, defaultValue: Limit }) limit: number,
  ): Promise<LessonsResponse> {
    return this.lessonService.findAllLessonsinSection(
      findLessonInput,
      page,
      limit,
    );
  }

  @Query(() => LessonsResponse)
  async findAllLessonsWithoutPag(
    @Args('findLessonInput') findLessonInput: FindLessonInput,
  ): Promise<LessonsResponse> {
    return this.lessonService.findAllLessonsinSectionWithoutPag(
      findLessonInput,
    );
  }
}
