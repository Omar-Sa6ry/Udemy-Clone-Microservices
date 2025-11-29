import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { BaseEntity } from '@bts-soft/core';

@ObjectType()
@Entity('certificates')
@Index(['userId'])
@Unique(['userId', 'courseId'])
export class Certificate extends BaseEntity {
  @Field(() => String)
  @Column()
  userId: string;

  @Field(() => String)
  @Column()
  courseId: string;
}
