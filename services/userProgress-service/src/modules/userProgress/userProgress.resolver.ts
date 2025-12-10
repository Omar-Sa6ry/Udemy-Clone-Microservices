import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UserProgressService } from './userProgress.service';
import { CreateUserProgressInput } from './inputs/createUserProgress.input';
import { UpdateUserProgressInput } from './inputs/updateUserProgress.input';
import { UserProgressFilterInput } from './inputs/filterUserProgress.input';
import { CourseProgressTypeResponse } from './dtos/courseProgress.dto';
import { UserProgressStatsTypeResponse } from './dtos/userProgressState.dto';
import {
  UserProgressResponse,
  UserProgresssResponse,
} from './dtos/userProgress.dto';

@Resolver()
export class UserProgressResolver {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Mutation(() => UserProgressResponse)
  createUserProgress(
    @Args('createUserProgressInput')
    createUserProgressInput: CreateUserProgressInput,
  ) {
    return this.userProgressService.create(createUserProgressInput);
  }

  @Mutation(() => UserProgressResponse)
  updateUserProgress(
    @Args('updateUserProgressInput')
    updateUserProgressInput: UpdateUserProgressInput,
  ) {
    return this.userProgressService.update(updateUserProgressInput);
  }

  @Mutation(() => UserProgressResponse)
  updateUserProgressByUserAndLesson(
    @Args('userId') userId: string,
    @Args('lessonId') lessonId: string,
    @Args('updateUserProgressInput')
    updateUserProgressInput: UpdateUserProgressInput,
  ) {
    return this.userProgressService.updateByUserAndLesson(
      userId,
      lessonId,
      updateUserProgressInput,
    );
  }

  @Mutation(() => UserProgressResponse)
  deleteUserProgress(@Args('id', { type: () => ID }) id: string) {
    return this.userProgressService.delete(id);
  }

  @Mutation(() => UserProgressResponse)
  markLessonAsCompleted(
    @Args('userId') userId: string,
    @Args('lessonId') lessonId: string,
  ) {
    return this.userProgressService.markLessonAsCompleted(userId, lessonId);
  }

  @Mutation(() => UserProgressResponse)
  updateLessonWatchTime(
    @Args('userId') userId: string,
    @Args('lessonId') lessonId: string,
    @Args('seconds', { type: () => Int }) seconds: number,
  ) {
    return this.userProgressService.updateLessonWatchTime(
      userId,
      lessonId,
      seconds,
    );
  }

  @Query(() => UserProgresssResponse)
  userProgressList(
    @Args('filter', { nullable: true }) filter: UserProgressFilterInput,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.userProgressService.findAll(filter, page, limit);
  }

  @Query(() => UserProgressResponse)
  userProgress(@Args('id', { type: () => ID }) id: string) {
    return this.userProgressService.findById(id);
  }

  @Query(() => UserProgressResponse)
  userProgressByUserAndLesson(
    @Args('userId') userId: string,
    @Args('lessonId') lessonId: string,
  ) {
    return this.userProgressService.findByUserAndLesson(userId, lessonId);
  }

  @Query(() => CourseProgressTypeResponse)
  getCourseProgress(
    @Args('userId') userId: string,
    @Args('courseId') courseId: string,
  ) {
    return this.userProgressService.getCourseProgress(userId, courseId);
  }

  @Query(() => UserProgressStatsTypeResponse)
  getUserProgressStats(@Args('userId') userId: string) {
    return this.userProgressService.getUserStats(userId);
  }
}
