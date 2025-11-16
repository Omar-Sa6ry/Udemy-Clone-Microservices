import { registerEnumType } from '@nestjs/graphql';

export enum CourseOrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
}

registerEnumType(CourseOrderBy, {
  name: 'CourseOrderBy',
  description: 'Fields to order courses by',
});
