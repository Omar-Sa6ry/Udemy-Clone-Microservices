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

  @Field()
  @Column()
  videoUrl: string;

  @Field()
  @Column()
  durationSeconds: number;

  @Field()
  @Column()
  fileUrl: string;

  @Field()
  @Column()
  fileSize: number;

  @Field()
  @Column({ default: 0 })
  downloadCount: number;

  @Field()
  @Column()
  videoSize: number;

  @Field(() => Date)
  @Column({ default: () => new Date() })
  createdAt: Date;

  @Field(() => Date)
  @Column({ default: () => new Date() })
  updatedAt: Date;
}
