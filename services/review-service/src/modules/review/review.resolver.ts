import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { ReviewResponse, ReviewsResponse } from './dto/reviewResponse.dto';
import { CreateReviewInput } from './inputs/createReview.input';
import { UpdateReviewInput } from './inputs/updateReview.input';
import { FindReviewInput } from './inputs/findReview.input';
import { Review } from './entity/review.entity';
import { ReviewLoaders } from './dataLoader/review.dataLoader';
import { CurrentUserDto } from '@bts-soft/core';
import { Auth, CurrentUser, Permission } from '@course-plateform/common';
import { CourseDto, UserResponse } from '@course-plateform/types';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly reviewLoader: ReviewLoaders,
  ) {}

  @Mutation(() => ReviewResponse)
  @Auth([Permission.CREATE_REVIEW])
  async createReview(
    @CurrentUser() user: CurrentUserDto,
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<ReviewResponse> {
    return this.reviewService.createReview(user.id, createReviewInput);
  }

  @Mutation(() => ReviewResponse)
  @Auth([Permission.UPDATE_REVIEW])
  async updateReview(
    @CurrentUser() user: CurrentUserDto,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<ReviewResponse> {
    return this.reviewService.updateReview(updateReviewInput, user.id);
  }

  @Mutation(() => ReviewResponse)
  @Auth([Permission.DELETE_REVIEW])
  async deleteReview(
    @CurrentUser() user: CurrentUserDto,
    @Args('id') id: string,
  ): Promise<ReviewResponse> {
    return this.reviewService.deleteReview(id, user.id);
  }

  @Query(() => ReviewResponse)
  async findReviewById(@Args('id') id: string): Promise<ReviewResponse> {
    return this.reviewService.findById(id);
  }

  @Query(() => ReviewsResponse)
  async findReviews(
    @Args('findReviewInput', { nullable: true })
    findReviewInput?: FindReviewInput,
  ): Promise<ReviewsResponse> {
    return this.reviewService.findByAll(findReviewInput);
  }

  // Resolver Fields
  @ResolveField(() => UserResponse)
  async student(@Parent() review: Review): Promise<UserResponse> {
    return this.reviewLoader.batchStudents.load(review.studentId);
  }

  @ResolveField(() => CourseDto)
  async course(@Parent() review: Review): Promise<CourseDto> {
    return this.reviewLoader.batchCourses.load(review.courseId);
  }
}
