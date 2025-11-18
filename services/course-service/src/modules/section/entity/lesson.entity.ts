import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Column, ObjectIdColumn } from 'typeorm';

@ObjectType()
export class Lesson {
  @Field(() => String)
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  title: string;

  @Column()
  durationSeconds: number;
}
