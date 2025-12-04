import { Entity, Column, ManyToOne, Unique, Check } from 'typeorm';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseEntity, TextField } from '@bts-soft/core';

@ObjectType()
@Entity('reviews')
@Unique(['studentId', 'courseId'])
@Check(`"rating" >= 1 AND "rating" <= 5`)
export class Review extends BaseEntity {
  @Field(() => String)
  @Column()
  courseId: string;

  @Field(() => String)
  @Column({ length: 26 })
  studentId: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rating: number;

  @Field(() => String, { nullable: true })
  @Column({ length: 100, nullable: true })
  @TextField('comment')
  comment?: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isApproved: boolean;
}
