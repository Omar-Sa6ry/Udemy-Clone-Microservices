@course-plateform/types - Udemy Clone Shared Types
Overview
@course-plateform/types is a shared NPM package that provides TypeScript type definitions, DTOs (Data Transfer Objects), GraphQL object types, and event enumerations for the Udemy Clone microservices architecture. This package ensures type consistency and interoperability across all microservices by providing standardized data structures and communication contracts.

Features
Type Definitions: Comprehensive TypeScript interfaces and types
GraphQL Object Types: Ready-to-use GraphQL object type definitions
DTO Classes: Data Transfer Objects for API responses
Event Enumerations: Standardized NATS event names for inter-service communication
Type Safety: Full TypeScript support with strict type checking
Consistency: Ensures data structure consistency across microservices
Installation
From NPM Registry
npm install @course-plateform/types
Local Development
# In the types package directory
npm run build

# In consuming service directory
npm install ../types
Package Structure
dist/
├── index.js                    # Main export
├── index.d.ts                  # Type definitions
└── **/*.js                     # Compiled JavaScript files

src/
├── types/
│   ├── user.type.ts           # User-related types and events
│   ├── category.type.ts       # Category-related types and events
│   ├── course.type.ts         # Course-related types and events
│   └── certificate.type.ts    # Certificate-related types and events
├── dtos/
│   ├── category.dto.ts        # Category DTOs
│   ├── course.dto.ts          # Course DTOs
│   ├── lesson.dto.ts          # Lesson DTOs
│   └── findLesson.input.ts    # Lesson find input DTO
└── index.ts                   # Main export file
Usage
1. Importing Types and DTOs
Basic Import:
import { 
  UserResponse, 
  CourseDto, 
  CategoryDto,
  UserEvents,
  CourseEvents,
  CategoryEvents,
  CertificateEvents
} from '@course-plateform/types';
Specific DTO Imports:
import { CourseResponse, CoursesResponse } from '@course-plateform/types';
import { CategoryResponse, CategoriesResponse } from '@course-plateform/types';
import { LessonResponse, LessonsResponse } from '@course-plateform/types';
2. Using DTOs in Services
Type-Safe Service Methods:
import { Injectable } from '@nestjs/common';
import { CourseDto, CourseResponse } from '@course-plateform/types';

@Injectable()
export class CourseService {
  async findById(id: string): Promise<CourseResponse> {
    const course = await this.courseRepository.findOne({ where: { id } });
    
    return {
      success: true,
      message: 'Course found successfully',
      data: course as CourseDto,
    };
  }

  async findAll(): Promise<CoursesResponse> {
    const courses = await this.courseRepository.find();
    
    return {
      success: true,
      message: 'Courses retrieved successfully',
      items: courses as CourseDto[],
      pagination: {
        totalItems: courses.length,
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
}
3. Using Event Enumerations
NATS Event Communication:
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserEvents, CourseEvents } from '@course-plateform/types';

@Injectable()
export class CourseClientService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async getUserById(userId: string) {
    // Using standardized event name
    return this.client.send(UserEvents.GET_USER_BY_ID, { id: userId });
  }

  async getCourseById(courseId: string) {
    // Using standardized event name
    return this.client.send(CourseEvents.GET_COURSE_BY_ID, { id: courseId });
  }

  async checkCertificateExisted(studentId: string, courseId: string) {
    // Using standardized event name
    return this.client.send(CertificateEvents.CHECK_CERTIFICATE_EXISTED, {
      studentId,
      courseId,
    });
  }
}
4. GraphQL Resolvers with Types
Type-Safe Resolvers:
import { Resolver, Query, Args } from '@nestjs/graphql';
import { CourseDto, CourseResponse } from '@course-plateform/types';
import { CourseService } from './course.service';

@Resolver(() => CourseDto)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => CourseResponse)
  async getCourse(@Args('id') id: string): Promise<CourseResponse> {
    return this.courseService.findById(id);
  }

  @Query(() => [CourseDto])
  async getCourses(): Promise<CourseDto[]> {
    const response = await this.courseService.findAll();
    return response.items;
  }
}
5. Type Annotations for Functions
Function Return Types:
import { UserResponse, CategoryResponse, LessonDto } from '@course-plateform/types';

// User service method
async getUserProfile(userId: string): Promise<UserResponse> {
  // Implementation
}

// Category service method
async getCategoryById(categoryId: string): Promise<CategoryResponse> {
  // Implementation
}

// Lesson service method
async getLessonDetails(lessonId: string): Promise<LessonDto> {
  // Implementation
}
Available Types and DTOs
User Types
UserResponse
@ObjectType()
export class UserResponse {
  @Field(() => String)
  id: string;

  @Field(() => String)
  firstName?: string;

  @Field(() => String)
  lastName?: string;

  @Field(() => String)
  fullName?: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: Role;

  @Field(() => String, { nullable: true })
  profile?: ProfileResponse;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
ProfileResponse
export interface ProfileResponse {
  id: string;
  bio?: string;
  avatar?: string;
  headline?: string;
  website_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
}
Course Types
CourseDto
@ObjectType()
export class CourseDto {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  instructorId: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  subtitle: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  learningOutcomes: string[];

  @Field(() => [String])
  requirements: string[];

  @Field(() => [String])
  targetAudience: string[];

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  discountPrice?: number;

  @Field(() => CourseLevel)
  level: CourseLevel;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  promoVideoUrl?: string;

  @Field(() => Int)
  totalLectures: number;

  @Field(() => Float)
  totalHours: number;

  @Field(() => Float)
  ratingAvg: number;

  @Field(() => Int)
  ratingCount: number;

  @Field(() => Int)
  studentCount: number;

  @Field(() => Boolean, { nullable: true })
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
CourseResponse
@ObjectType()
export class CourseResponse extends BaseResponse {
  @Field(() => CourseDto, { nullable: true })
  data?: CourseDto;
}
CoursesResponse
@ObjectType()
export class CoursesResponse extends BaseResponse {
  @Field(() => [CourseDto], { nullable: true })
  items?: CourseDto[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}
Category Types
CategoryDto
@ObjectType()
export class CategoryDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
CategoryResponse
@ObjectType()
export class CategoryResponse extends BaseResponse {
  @Field(() => CategoryDto, { nullable: true })
  data?: CategoryDto;
}
CategoriesResponse
@ObjectType()
export class CategoriesResponse extends BaseResponse {
  @Field(() => [CategoryDto], { nullable: true })
  items?: CategoryDto[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}
Lesson Types
LessonDto
@ObjectType()
export class LessonDto {
  @Field(() => String)
  _id: string;

  @Field()
  title: string;

  @Field()
  videoUrl: string;

  @Field()
  durationSeconds: number;

  @Field()
  fileUrl: string;

  @Field()
  fileSize: number;

  @Field()
  downloadCount: number;

  @Field()
  videoSize: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
LessonResponse
@ObjectType()
export class LessonResponse extends BaseResponse {
  @Field(() => LessonDto, { nullable: true })
  data: LessonDto;
}
LessonsResponse
@ObjectType()
export class LessonsResponse extends BaseResponse {
  @Field(() => [LessonDto], { nullable: true })
  items: LessonDto[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}
FindLessonInput
@InputType()
export class FindLessonInput {
  @Field()
  courseId: string;

  @Field()
  sectionId: string;

  @Field()
  id: string;
}
Event Enumerations
User Events
export enum UserEvents {
  GET_USER_BY_ID = 'user.get.by.id',
  GET_USER_BY_EMAIL = 'user.get.by.email',
  USER_UPDATED = 'user.updated',
  USER_DATA_EXISTED = 'user.dataExists',
  CREATE_USER_DATA = 'user.createData',
  USER_ROLE_UPDATED = 'user.role.updated',
  FIND_USERS_WITH_IS = 'user.findUsersWithIds',
  CHECK_IF_INSTRACTOR = 'user.checkIfInstractor',
}
Course Events
export enum CourseEvents {
  GET_COURSE_BY_ID = 'course.get.by.id',
  GET_LESSON_BY_ID = 'course.get.by.lesson.id',
  GET_COURSES_BY_ID = 'course.get.by.ids',
  FIND_COURSES_WITH_IS = 'course.findUsersWithIds',
  UPDATE_COURSE = 'course.update',
}
Category Events
export enum CategoryEvents {
  GET_CATEGORY_BY_ID = 'category.get.by.id',
  GET_CATEGORY_BY_NAME = 'category.get.by.name',
  GET_CATEGORIES_BY_IDS = 'category.getCategoriesByIds',
}
Certificate Events
export enum CertificateEvents {
  CHECK_CERTIFICATE_EXISTED = 'certificate.checkCertificateExisted',
  CREAE_CERTIFICATE = 'certificate.createCertificate',
}
Base Response Structure
All response DTOs extend from BaseResponse (from @bts-soft/core), providing a consistent response format:

// Example response structure
{
  success: boolean;
  message: string;
  data?: T;            // For single entity responses
  items?: T[];         // For list responses
  pagination?: {       // For paginated responses
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}
Integration Examples
1. Complete Service Implementation
// course.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseDto, CourseResponse, CoursesResponse } from '@course-plateform/types';
import { Course } from './course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findById(id: string): Promise<CourseResponse> {
    const course = await this.courseRepository.findOne({ where: { id } });
    
    if (!course) {
      return {
        success: false,
        message: 'Course not found',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Course found successfully',
      data: this.mapToCourseDto(course),
    };
  }

  async findAll(page: number = 1, limit: number = 10): Promise<CoursesResponse> {
    const [courses, total] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      message: 'Courses retrieved successfully',
      items: courses.map(this.mapToCourseDto),
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private mapToCourseDto(course: Course): CourseDto {
    return {
      _id: course.id,
      categoryId: course.categoryId,
      instructorId: course.instructorId,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      learningOutcomes: course.learningOutcomes,
      requirements: course.requirements,
      targetAudience: course.targetAudience,
      price: course.price,
      discountPrice: course.discountPrice,
      level: course.level,
      imageUrl: course.imageUrl,
      promoVideoUrl: course.promoVideoUrl,
      totalLectures: course.totalLectures,
      totalHours: course.totalHours,
      ratingAvg: course.ratingAvg,
      ratingCount: course.ratingCount,
      studentCount: course.studentCount,
      isActive: course.isActive,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}
2. NATS Client Service
// user-client.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserEvents, UserResponse } from '@course-plateform/types';

@Injectable()
export class UserClientService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async findById(id: string): Promise<UserResponse> {
    const result = await firstValueFrom(
      this.client.send(UserEvents.GET_USER_BY_ID, { id })
    );
    return result.data;
  }

  async findByEmail(email: string): Promise<UserResponse> {
    const result = await firstValueFrom(
      this.client.send(UserEvents.GET_USER_BY_EMAIL, { email })
    );
    return result.data;
  }

  async checkIfInstructor(id: string): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.client.send(UserEvents.CHECK_IF_INSTRACTOR, { id })
      );
      return result.exists;
    } catch {
      return false;
    }
  }
}
3. GraphQL Resolver
// course.resolver.ts
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { CourseDto, CourseResponse, CoursesResponse } from '@course-plateform/types';
import { CourseService } from './course.service';
import { CategoryDto } from '@course-plateform/types';
import { CategoryClientService } from '../category/category-client.service';

@Resolver(() => CourseDto)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly categoryClient: CategoryClientService,
  ) {}

  @Query(() => CourseResponse)
  async getCourse(@Args('id') id: string): Promise<CourseResponse> {
    return this.courseService.findById(id);
  }

  @Query(() => CoursesResponse)
  async getCourses(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ): Promise<CoursesResponse> {
    return this.courseService.findAll(page, limit);
  }

  @ResolveField(() => CategoryDto)
  async category(@Parent() course: CourseDto): Promise<CategoryDto> {
    return this.categoryClient.getCategoryById(course.categoryId);
  }
}
TypeScript Configuration
tsconfig.json
Ensure your TypeScript configuration includes the necessary settings:

{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
Development
Building the Package
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run dev
Publishing
# Build before publishing
npm run build

# Publish to NPM registry
npm publish --access public
Versioning
The package follows semantic versioning:

Major version: Breaking changes to types/DTOs
Minor version: New types/DTOs or event enums, backward compatible
Patch version: Bug fixes, documentation updates
Dependencies
Runtime Dependencies
@bts-soft/core: Base response types and common utilities (^2.0.6)
@nestjs/common: NestJS common utilities (^10.0.0)
@nestjs/core: NestJS core framework (^10.0.0)
@nestjs/platform-express: HTTP platform (^10.0.0)
Development Dependencies
@types/node: Node.js TypeScript definitions (^18.0.0)
typescript: TypeScript compiler (^5.0.0)
Best Practices
1. Always Use Provided Types
Instead of creating custom types, use the provided DTOs to ensure consistency:

// Good
import { CourseDto } from '@course-plateform/types';
const course: CourseDto = { /* ... */ };

// Avoid
type CustomCourse = { /* custom definition */ };
2. Use Event Enumerations for Communication
Always use the provided event enums for NATS communication:

// Good
this.client.send(UserEvents.GET_USER_BY_ID, { id });

// Avoid
this.client.send('get-user-by-id', { id });
3. Implement Proper Type Mapping
Create mapping functions to convert between entity models and DTOs:

private mapToCourseDto(entity: CourseEntity): CourseDto {
  return {
    _id: entity.id,
    title: entity.title,
    // ... map all properties
  };
}
4. Handle Optional Properties
Respect the nullable/optional properties defined in the types:

// Good - respects optional properties
const course: CourseDto = {
  _id: '123',
  title: 'Course Title',
  // discountPrice can be omitted
};

// Avoid - providing undefined for optional properties
const course: CourseDto = {
  _id: '123',
  title: 'Course Title',
  discountPrice: undefined, // Don't do this
};
5. Test Type Compatibility
Write tests to ensure your implementations match the expected types:

import { CourseDto } from '@course-plateform/types';

describe('Course Service', () => {
  it('should return CourseDto type', async () => {
    const result = await courseService.findById('123');
    
    // Type assertion test
    const courseDto: CourseDto = result.data;
    expect(courseDto).toBeDefined();
    expect(courseDto._id).toBe('123');
    expect(courseDto.title).toBeDefined();
  });
});
Extending Types
Adding New Types
If you need to add new types, follow this pattern:

Create a new file in src/types/ or src/dtos/
Export from the main index.ts
Update version following semver
Example: Adding a New DTO
// src/dtos/quiz.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResponse } from '@bts-soft/common';

@ObjectType()
export class QuizDto {
  @Field(() => String)
  id: string;

  @Field()
  title: string;

  // ... other fields
}

@ObjectType()
export class QuizResponse extends BaseResponse {
  @Field(() => QuizDto, { nullable: true })
  data?: QuizDto;
}

// src/index.ts
export * from './dtos/quiz.dto';
Troubleshooting
Common Issues
Type Import Errors

Ensure @course-plateform/types is installed
Check TypeScript configuration includes the package
Verify you're importing from the correct path
GraphQL Schema Generation Issues

Ensure all GraphQL decorators are properly applied
Check that types are exported correctly
Verify NestJS GraphQL module configuration
NATS Event Name Mismatches

Use the exact event names from the enums
Check that both sending and receiving services use the same enum
Verify event name casing matches exactly
DTO Mapping Errors

Ensure all required fields are mapped
Check that optional fields are handled properly
Verify data types match between entity and DTO
Debugging Type Issues
// Use TypeScript's type checking
const course: CourseDto = {} as any;
// TypeScript will show missing properties

// Use console.log to inspect types
console.log('Type of course:', typeof course);
console.log('Course properties:', Object.keys(course));
Migration Guide
From Custom Types to Shared Types
Replace custom type definitions with imports from @course-plateform/types
Update service methods to return the standardized response types
Replace hardcoded event strings with enum values
Update tests to use the new types
Example Migration
// Before
type CustomCourse = {
  id: string;
  title: string;
  // custom properties
};

// After
import { CourseDto } from '@course-plateform/types';
const course: CourseDto = { /* ... */ };