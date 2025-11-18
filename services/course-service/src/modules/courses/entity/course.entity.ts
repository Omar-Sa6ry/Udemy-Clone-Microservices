import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Entity, Column, ObjectIdColumn, Index, BaseEntity } from 'typeorm';
import { CourseLevel } from '@course-plateform/common';
import { ObjectId } from 'mongodb';
import { CourseSection } from 'src/modules/section/entity/courseSection.entity';

@ObjectType()
@Entity('courses')
@Index(['title', 'price'])
export class Course extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Field(() => String)
  @Column()
  categoryId: string;

  @Field(() => String)
  @Column()
  instructorId: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  subtitle: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => [String])
  @Column()
  learningOutcomes: string[];

  @Field(() => [String])
  @Column()
  requirements: string[];

  @Field(() => [String])
  @Column()
  targetAudience: string[];

  @Field(() => Float)
  @Column()
  price: number;

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true })
  discountPrice?: number;

  @Field(() => CourseLevel)
  @Column()
  level: CourseLevel;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  promoVideoUrl?: string;

  @Field(() => Int)
  @Column({ default: 1 })
  totalLectures: number;

  @Field(() => Float)
  @Column({ default: 0.0 })
  totalHours: number;

  @Field(() => Float)
  @Column({ default: 0.0 })
  ratingAvg: number;

  @Field(() => Int)
  @Column({ default: 0 })
  ratingCount: number;

  @Field(() => Int)
  @Column({ default: 0 })
  studentCount: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: true })
  isActive: boolean;

  @Field(() => [CourseSection], { nullable: true })
  @Column({ type: 'json', default: [] })
  sections?: CourseSection[];

  @Field(() => Date)
  @Column({ default: () => new Date() })
  createdAt: Date;

  @Field(() => Date)
  @Column({ default: () => new Date() })
  updatedAt: Date;
}
