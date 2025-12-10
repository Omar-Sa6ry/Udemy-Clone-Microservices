import { Entity, Column, Index, Unique } from 'typeorm';
import { IsBoolean, IsInt, Min } from 'class-validator';
import { BaseEntity, IdField } from '@bts-soft/core';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('user_progress')
export class UserProgress extends BaseEntity {
  @Column({ length: 26 })
  @IdField('userId')
  @Index()
  userId: string;

  @Column({ length: 26 })
  @IdField('lessonId')
  @Index()
  lessonId: string;

  @Column({ length: 26 })
  @IdField('courseId')
  courseId: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  completed: boolean;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  watch_time_seconds: number;
}
