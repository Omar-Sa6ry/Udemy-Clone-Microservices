import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './entity/course.entity';
import { CourseOrderBy } from 'src/common/constant/course.constant';
import { CreateCourseInput } from './inputs/createCourse.input';
import { CourseIdInput } from './inputs/courseId.input';
import { UpdateCourseInput } from './inputs/updateCourse.input';
import { Limit, Page, Auth, Permission } from '@course-plateform/common';
import { CourseDataLoaders } from './dataloaders/course.loader';
import { CategoryDto, UserResponse } from '@course-plateform/types';
import { FindCourseInput } from './inputs/findCourse.input';
import { CourseTitleInput } from './inputs/courseTitle.input';
import {
  CourseCountResponse,
  CourseResponse,
  CoursesResponse,
} from './dto/courseResponse.dto';

@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private readonly dataLoaders: CourseDataLoaders,
    private readonly courseService: CourseService,
  ) {}

  @Auth([Permission.CREATE_COURSE])
  @Mutation(() => CourseResponse)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ): Promise<CourseResponse> {
    return this.courseService.create(createCourseInput);
  }

  @Auth([Permission.UPDATE_COURSE])
  @Mutation(() => CourseResponse)
  async updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ): Promise<CourseResponse> {
    return this.courseService.update(updateCourseInput);
  }

  // @Auth([Permission.UPDATE_COURSE])
  @Mutation(() => CourseResponse)
  async activationCourse(@Args('id') id: string): Promise<CourseResponse> {
    return this.courseService.activate(id);
  }

  // @Auth([Permission.UPDATE_COURSE])
  @Mutation(() => CourseResponse)
  async deActivationCourse(@Args('id') id: string): Promise<CourseResponse> {
    return this.courseService.deactivate(id);
  }

  @Auth([Permission.DELETE_COURSE])
  @Mutation(() => CourseResponse)
  async deleteCourse(@Args('id') id: string): Promise<CourseResponse> {
    return this.courseService.delete(id);
  }

  @Query(() => CourseResponse)
  async findCourseById(@Args('id') id: string): Promise<CourseResponse> {
    return this.courseService.findById(id);
  }

  @Query(() => CourseResponse)
  async findCourseByTitle(
    @Args('title') title: string,
  ): Promise<CourseResponse> {
    return this.courseService.findByTitle(title);
  }

  @Query(() => CoursesResponse)
  async findAllCourses(
    @Args('findCourseInput') findCourseInput: FindCourseInput,
    @Args('page', { type: () => Int, defaultValue: Page }) page: number,
    @Args('limit', { type: () => Int, defaultValue: Limit }) limit: number,
    @Args('orderby', {
      type: () => CourseOrderBy,
      defaultValue: CourseOrderBy.CREATED_AT,
    })
    orderby: CourseOrderBy,
  ): Promise<CoursesResponse> {
    return this.courseService.findAll(findCourseInput, page, limit, orderby);
  }

  @Query(() => CoursesResponse)
  async findAllCoursesWithoutPag(
    @Args('findCourseInput', { nullable: true })
    findCourseInput?: FindCourseInput,
  ): Promise<CoursesResponse> {
    return this.courseService.findAllWithoutPag(findCourseInput);
  }

  @Query(() => CourseCountResponse)
  async countCourses(): Promise<CourseCountResponse> {
    return await this.courseService.countCourses();
  }

  @Query(() => CourseCountResponse)
  async countAllCourses(): Promise<CourseCountResponse> {
    return await this.courseService.countAllCourses();
  }

  @Query(() => CourseCountResponse)
  async countCoursesActive(): Promise<CourseCountResponse> {
    return await this.courseService.countCoursesActive();
  }

  @ResolveField(() => Number)
  finalPrice(@Parent() course: Course): number {
    return course.discountPrice && course.discountPrice > 0
      ? course.discountPrice
      : course.price;
  }

  @ResolveField(() => UserResponse)
  async instructor(@Parent() course: Course): Promise<UserResponse> {
    const instructorsLoader = this.dataLoaders.createInstructorsLoader();
    return instructorsLoader.load(course.instructorId);
  }

  @ResolveField(() => CategoryDto)
  async category(@Parent() course: Course): Promise<CategoryDto> {
    const categoriesLoader = this.dataLoaders.createCategoriesLoader();
    return categoriesLoader.load(course.categoryId);
  }
}
