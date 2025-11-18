import { Field, ObjectType } from '@nestjs/graphql';
import { Lesson } from 'src/modules/section/entity/lesson.entity';
import { Column, ObjectId, ObjectIdColumn } from 'typeorm';

@ObjectType()
export class CourseSection {
  @Field(() => String)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  title: string;

  @Field(() => [Lesson], { nullable: true })
  @Column((type) => Lesson)
  lessons?: Lesson[];

  @Field(() => Date)
  @Column({ default: () => new Date() })
  createdAt: Date;

  @Field(() => Date)
  @Column({ default: () => new Date() })
  updatedAt: Date;
}
